import path from 'node:path'
import { access, mkdir, writeFile, rm, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { version as esbuildVersion } from 'esbuild'
import { root, dist, nodeCodes } from '../paths.mjs'
import { bundle, loadDefinition, litMode, buildMode } from './bundle.mjs'
import { readNodePanels, resolvePanelPath } from '../panels/manifest.mjs'
import { validateAuthoringPackage } from '@mofang/low-code-page/authoring'

/** 统一以 KiB 展示字节数；manifest 中保留整数 bytes，便于机器比较。 */
const size = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`
const milliseconds = (value) => Number(value.toFixed(2))
const started = performance.now()
const report = {
    mode: buildMode,
    minified: buildMode === 'production',
    esbuildVersion,
    nodes: [],
    artifacts: 0,
    bytes: 0,
    gzipBytes: 0,
    durationMs: 0,
}

for (const code of await nodeCodes()) {
    const nodeStarted = performance.now()
    const directory = path.join(root, 'nodes', code)
    const definition = await loadDefinition(directory)
    if (definition.code !== code) throw new Error('节点目录与编码不一致：' + code)
    const panels = await readNodePanels(code)
    const out = path.join(dist, code)
    await rm(out, { recursive: true, force: true })
    await mkdir(out, { recursive: true })
    let pageSource = '../../lib/browser/page.ts'
    try {
        await access(path.join(directory, 'page.ts'))
        pageSource = 'page.ts'
    } catch (error) {
        if (error.code !== 'ENOENT') throw error
    }
    const entries = [
        ['settings', panels.settings.renderer, await resolvePanelPath(code, 'settings')],
        ['business', panels.business.renderer, await resolvePanelPath(code, 'business')],
        ...(panels.business.renderer === 'lit'
            ? [['pageProgram', 'page-program', path.join(directory, pageSource)]]
            : []),
        ...(definition.interface === 'panels'
            ? []
            : [['executor', 'executor', path.join(directory, 'run.ts')]]),
    ]
    const artifacts = {}
    console.log(`\n${code} · ${buildMode}${report.minified ? ' · minify' : ''}`)
    console.log('产物                  编译后大小       gzip 参考       编译耗时')
    for (const [entry, kind, relative] of entries) {
        const input = await readFile(relative, 'utf8')
        let compiled
        let compatibility
        if (kind === 'puck') {
            const value = JSON.parse(input)
            const validation = validateAuthoringPackage(value, { nodeCode: code, surface: entry })
            if (!validation.valid)
                throw new Error(
                    `${code}/${entry}: ${JSON.stringify(validation.diagnostics ?? validation.errors)}`,
                )
            compiled = {
                code: JSON.stringify(value, null, 4) + '\n',
                sourceBytes: Buffer.byteLength(input),
                durationMs: 0,
            }
            compatibility = Object.fromEntries(
                [
                    'schemaVersion',
                    'engineVersion',
                    'runtimeVersion',
                    'materialsVersion',
                    'styleVersion',
                    'logicVersion',
                ].map((key) => [key, value[key]]),
            )
        } else compiled = await bundle(relative, kind === 'lit' ? 'panel' : kind)
        const { code: source, sourceBytes, durationMs } = compiled
        const file =
            kind === 'puck'
                ? entry + '.page.json'
                : entry === 'executor'
                  ? 'program.js'
                  : entry + '.js'
        await writeFile(path.join(out, file), source)
        const bytes = Buffer.byteLength(source)
        const gzipBytes = gzipSync(source, { level: 9 }).byteLength
        artifacts[entry] = {
            file,
            bytes,
            gzipBytes,
            sourceBytes,
            durationMs: milliseconds(durationMs),
            sha256: createHash('sha256').update(source).digest('hex'),
            format: kind === 'puck' ? 'json' : 'javascript',
            ...(['lit', 'puck'].includes(kind)
                ? {
                      surface: entry,
                      rendererKey: kind,
                      renderMode: kind === 'puck' ? 'lowcode' : 'lit',
                      entry: panels[entry].entry,
                      sourceSha256: createHash('sha256').update(input).digest('hex'),
                      ...(compatibility ? { compatibility } : {}),
                  }
                : {}),
        }
        report.artifacts++
        report.bytes += bytes
        report.gzipBytes += gzipBytes
        console.log(
            `${file.padEnd(22)}${size(bytes).padEnd(17)}${size(gzipBytes).padEnd(16)}${durationMs.toFixed(2)} ms`,
        )
    }
    const { interface: programInterface, ...metadata } = definition
    if (programInterface !== 'panels') {
        await writeFile(
            path.join(out, 'node.json'),
            JSON.stringify(
                { ...metadata, source: await readFile(path.join(out, 'program.js'), 'utf8') },
                null,
                4,
            ) + '\n',
        )
    }
    const durationMs = milliseconds(performance.now() - nodeStarted)
    await writeFile(
        path.join(out, 'manifest.json'),
        JSON.stringify(
            {
                code,
                interface: programInterface,
                litMode,
                build: { mode: buildMode, minified: report.minified, esbuildVersion, durationMs },
                artifacts,
            },
            null,
            4,
        ) + '\n',
    )
    report.nodes.push({
        code,
        durationMs,
        bytes: Object.values(artifacts).reduce((sum, item) => sum + item.bytes, 0),
    })
}
report.durationMs = milliseconds(performance.now() - started)
await writeFile(path.join(dist, 'build-report.json'), JSON.stringify(report, null, 4) + '\n')
console.log(
    `\n构建完成：${report.nodes.length} 个节点，${report.artifacts} 个产物，${size(report.bytes)}，gzip ${size(report.gzipBytes)}，总耗时 ${report.durationMs.toFixed(2)} ms`,
)
console.log(
    'gzip 使用 level 9 独立压缩估算；实际发布体积以传输方式为准。详细信息：dist/build-report.json',
)
