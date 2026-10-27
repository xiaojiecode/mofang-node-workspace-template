import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { prepareLowcodePackage, syncLowcode } from '../tooling/vendor/prepare-lowcode.mjs'
import { inspectSource } from '../tooling/vendor/sync.mjs'
import { useSystemFonts } from '../tooling/vendor/package-assets.mjs'

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
async function fixture(t) {
    const base = await mkdtemp(path.join(os.tmpdir(), 'lowcode-pack-'))
    t.after(() => rm(base, { recursive: true, force: true }))
    const source = path.join(base, 'source'),
        stage = path.join(base, 'stage')
    await mkdir(source)
    await mkdir(stage)
    const files = {
        'package.json': JSON.stringify({
            name: '@mofang/low-code-page',
            version: '0.1.0',
            type: 'module',
            exports: {
                './runtime': { import: './runtime.js', types: './types/index.d.ts' },
                './style.css': './style.css',
            },
        }),
        'runtime.js': `export const value = 42;\nexport const demo = 'data:image/png;base64,${Buffer.from('demo-png').toString('base64')}';\nexport const icon = 'data:image/png;base64,${Buffer.from('keep-icon').toString('base64')}';\nexport const thumbnail = demo || '01';\n//# sourceMappingURL=runtime.js.map\n`,
        'runtime.js.map': '{"sourcesContent":["source"]}',
        'style.css':
            '@font-face{font-family:test;src:url(./fonts/test.woff2)}.surface{--font-default:"Noto Sans SC",sans-serif;font-family:var(--font-default);padding:8px}.cockpit{font-family:"Mofang Cockpit",sans-serif}',
        'types/index.d.ts': 'export declare const value: number;',
        'fonts/test.woff2': 'fixture-font-bytes',
        'fonts/LICENSE.txt': 'fixture-font-license',
    }
    for (const [file, bytes] of Object.entries(files)) {
        await mkdir(path.dirname(path.join(source, file)), { recursive: true })
        await writeFile(path.join(source, file), bytes)
    }
    await writeFile(
        path.join(source, 'manifest.json'),
        JSON.stringify({
            runtimeVersion: '2',
            files: [
                {
                    path: 'src/components/report-display/assets/pet-carrier-backpack.png',
                    sha256: hash('demo-png'),
                },
            ],
            outputs: Object.entries(files).map(([file, bytes]) => ({
                path: file,
                sha256: hash(bytes),
            })),
        }),
    )
    return { base, source, stage, files }
}

test('移除字体和指定内嵌示例图，保留入口、类型、许可、图标及无图展示，输出清单可独立校验', async (t) => {
    const { source, stage, files } = await fixture(t)
    const before = await readFile(path.join(source, 'manifest.json'))
    const report = await prepareLowcodePackage(source, stage)
    assert.deepEqual(report.removed, ['fonts/test.woff2', 'runtime.js.map'])
    assert.deepEqual(report.removedImages, [
        'src/components/report-display/assets/pet-carrier-backpack.png',
    ])
    const runtime = await import(pathToFileURL(path.join(stage, 'runtime.js')))
    assert.equal(runtime.value, 42)
    assert.equal(runtime.demo, '')
    assert.equal(runtime.thumbnail, '01')
    assert.equal(
        runtime.icon,
        `data:image/png;base64,${Buffer.from('keep-icon').toString('base64')}`,
    )
    for (const file of ['package.json', 'types/index.d.ts', 'fonts/LICENSE.txt'])
        assert.equal(await readFile(path.join(stage, file), 'utf8'), files[file])
    await assert.rejects(readFile(path.join(stage, 'fonts/test.woff2')), { code: 'ENOENT' })
    const css = await readFile(path.join(stage, 'style.css'), 'utf8')
    assert.doesNotMatch(css, /@font-face|url\(|Mofang Cockpit|Noto Sans SC|--font-default:/)
    assert.match(css, /font-family:var\(--font-default, system-ui/)
    assert.match(css, /padding:8px/)
    assert.doesNotMatch(await readFile(path.join(stage, 'runtime.js'), 'utf8'), /sourceMappingURL/)
    const checked = await inspectSource(stage, '@mofang/low-code-page')
    assert.equal(checked.files.length, report.afterFiles)
    assert.deepEqual(await readFile(path.join(source, 'manifest.json')), before)
    for (const [file, bytes] of Object.entries(files))
        assert.equal(await readFile(path.join(source, file), 'utf8'), bytes)
})

test('字体样式裁剪支持嵌套规则和带括号的字符串，不破坏其他样式', () => {
    const css = useSystemFonts(
        '@supports (font-tech:variations){@font-face{font-family:"brace}";src:url("font.woff2")}.text{color:red}}.image{background:url("photo.png")}',
    )
    assert.doesNotMatch(css, /@font-face|font.woff2/)
    assert.match(css, /\.text\{color:red\}/)
    assert.match(css, /url\("photo.png"\)/)
})

test('来源被修改时拒绝打包，不生成可误用的发布清单', async (t) => {
    const { source, stage } = await fixture(t)
    await writeFile(path.join(source, 'runtime.js'), 'export const value=0;')
    await assert.rejects(prepareLowcodePackage(source, stage), /hash/)
    await assert.rejects(readFile(path.join(stage, 'manifest.json')), { code: 'ENOENT' })
})

test('目录同步保留裁剪规则并清理陈旧文件，不生成 tgz', async (t) => {
    const { base, source } = await fixture(t)
    const rootDir = path.join(base, 'workspace')
    await mkdir(rootDir)
    await writeFile(
        path.join(rootDir, 'package.json'),
        JSON.stringify({
            devDependencies: { '@mofang/low-code-page': 'file:vendor/low-code-page' },
        }),
    )
    const result = await syncLowcode(source, { rootDir })
    await writeFile(path.join(result.directory, 'stale.js'), 'old')
    await syncLowcode(source, { rootDir })
    await assert.rejects(readFile(path.join(result.directory, 'stale.js')), { code: 'ENOENT' })
    await assert.rejects(readFile(path.join(result.directory, 'fonts/test.woff2')), {
        code: 'ENOENT',
    })
    assert.equal((await import(pathToFileURL(path.join(result.directory, 'runtime.js')))).demo, '')
    assert.equal(
        (await readdir(path.join(rootDir, 'vendor'))).some((file) => file.endsWith('.tgz')),
        false,
    )
    const manifest = JSON.parse(
        await readFile(path.join(result.directory, 'manifest.json'), 'utf8'),
    )
    assert.equal(manifest.distribution.format, 'directory')
    await inspectSource(result.directory, '@mofang/low-code-page')
})
