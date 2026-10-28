import path from 'node:path'
import { readFile, writeFile, mkdir, mkdtemp, realpath, lstat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { root } from '../paths.mjs'
import { inspectSource, syncVendor } from './sync.mjs'
import {
    demoImageHashes,
    isFontAsset,
    removeDemoImages,
    useSystemFonts,
} from './package-assets.mjs'

const sha = (bytes, algorithm = 'sha256', encoding = 'hex') =>
    createHash(algorithm).update(bytes).digest(encoding)
const packageName = '@mofang/low-code-page'

/** 移除调试映射、字体及指定示例大图，保留公开入口、类型与运行分块。 */
export async function prepareLowcodePackage(source, stage) {
    const inspected = await inspectSource(source, packageName)
    const original = JSON.parse(
        await readFile(path.join(inspected.directory, 'manifest.json'), 'utf8'),
    )
    const outputs = [],
        removed = []
    const imageHashes = demoImageHashes(original)
    const removedImages = new Set()
    let beforeBytes = 0,
        afterBytes = 0
    for (const file of inspected.files) {
        const bytes = await readFile(path.join(inspected.directory, file.path))
        if (sha(bytes) !== file.sha256) throw new Error('打包来源在读取过程中变化')
        beforeBytes += bytes.length
        if (file.path === 'manifest.json') continue
        if (file.path.endsWith('.map') || isFontAsset(file.path)) {
            removed.push(file.path)
            continue
        }
        let content = /\.(js|css)$/.test(file.path)
            ? Buffer.from(
                  bytes
                      .toString('utf8')
                      .replace(/^\/\/[#@] sourceMappingURL=.*$/gm, '')
                      .replace(/\/\*[#@] sourceMappingURL=[^*]*\*\//g, ''),
              )
            : bytes
        if (file.path.endsWith('.css'))
            content = Buffer.from(useSystemFonts(content.toString('utf8')))
        if (file.path.endsWith('.js')) {
            const transformed = removeDemoImages(content.toString('utf8'), imageHashes)
            content = Buffer.from(transformed.code)
            for (const source of transformed.removed) removedImages.add(source)
        }
        // 移除映射后不保留文件尾空行；许可文本只统一换行，原文内容不变。
        if (/\.(js|css|txt)$/.test(file.path))
            content = Buffer.from(
                content
                    .toString('utf8')
                    .replace(/\r\n/g, '\n')
                    .replace(/\n{2,}$/, '\n'),
            )
        const destination = path.join(stage, file.path)
        await mkdir(path.dirname(destination), { recursive: true })
        await writeFile(destination, content, { flag: 'wx' })
        afterBytes += content.length
        outputs.push({ path: file.path, sha256: sha(content) })
    }
    const manifest = {
        ...original,
        distribution: {
            format: 'directory',
            sourceManifestSha256: inspected.digest,
            omitted: removed,
            fontPolicy: 'host-or-system',
            omittedEmbeddedImages: [...removedImages],
        },
        outputs,
    }
    const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n')
    await writeFile(path.join(stage, 'manifest.json'), manifestBytes, { flag: 'wx' })
    afterBytes += manifestBytes.length
    await inspectSource(stage, packageName)
    return {
        version: inspected.pkg.version,
        sourceManifestSha256: inspected.digest,
        manifestSha256: sha(manifestBytes),
        beforeFiles: inspected.files.length,
        afterFiles: outputs.length + 1,
        beforeBytes,
        afterBytes,
        removed,
        removedImages: [...removedImages],
    }
}

/** 生成精简目录并交给既有同步器替换 vendor；不生成压缩包。 */
export async function syncLowcode(source, { rootDir = root } = {}) {
    const workspace = await realpath(rootDir)
    const cache = path.join(workspace, '.cache')
    await mkdir(cache, { recursive: true })
    if ((await lstat(cache)).isSymbolicLink()) throw new Error('生成缓存不能是链接')
    const area = await mkdtemp(path.join(cache, 'lowcode-directory-'))
    const stage = path.join(area, 'package')
    await mkdir(stage)
    const report = await prepareLowcodePackage(source, stage)
    await syncVendor({ 'low-code': stage }, { rootDir: workspace })
    const receipt = { ...report, directory: path.join(workspace, 'vendor/low-code-page') }
    await writeFile(path.join(area, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n')
    return {
        directory: receipt.directory,
        files: report.afterFiles,
        bytes: report.afterBytes,
        receipt: path.join(area, 'receipt.json'),
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values } = parseArgs({ options: { source: { type: 'string' } } })
        if (!values.source) throw new Error('需要 --source <frontend 低代码构建目录>')
        console.log(JSON.stringify({ ok: true, ...(await syncLowcode(values.source)) }))
    } catch (error) {
        console.error(JSON.stringify({ ok: false, error: error.message }))
        process.exitCode = 1
    }
}
