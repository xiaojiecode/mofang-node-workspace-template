import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { optimize } from 'svgo'
import { root, cache } from '../paths.mjs'
import { platformIcons, svgoConfig } from './config.mjs'
import { generateIconEntries } from './generate.mjs'

const check = process.argv.includes('--check')
await generateIconEntries(check)
const manifest = JSON.parse(
    await readFile(path.join(root, 'lib/browser/ui/assets/source/platforms/manifest.json'), 'utf8'),
)
const report = []
for (const item of platformIcons) {
    const sourcePath = path.join(root, 'lib/browser/ui/assets/source/platforms', `${item.file}.svg`)
    const targetPath = path.join(root, 'lib/browser/ui/assets/platforms', `${item.file}.svg`)
    const source = await readFile(sourcePath, 'utf8')
    const provenance = manifest.assets.find((asset) => asset.file === `${item.file}.svg`)
    if (
        !provenance ||
        provenance.file !== `${item.file}.svg` ||
        provenance.sha256 !== createHash('sha256').update(source).digest('hex')
    )
        throw new Error(`${item.id} 的来源记录或源文件哈希不一致`)
    const result = optimize(source, { ...svgoConfig, path: sourcePath })
    // removeViewBox 不在 SVGO 4 的默认 preset 中；仍明确核对，防止未来配置变化。
    const sourceViewBox = source.match(/\bviewBox\s*=\s*["']([^"']+)["']/)?.[1]
    const targetViewBox = result.data.match(/\bviewBox\s*=\s*["']([^"']+)["']/)?.[1]
    if (!sourceViewBox || sourceViewBox !== targetViewBox)
        throw new Error(`${item.id} 的 viewBox 改变`)
    const output = result.data + '\n'
    if (check) {
        if ((await readFile(targetPath, 'utf8')) !== output)
            throw new Error(`${item.id} 优化产物不是最新，请执行 npm run icons:optimize`)
    } else {
        await mkdir(path.dirname(targetPath), { recursive: true })
        await writeFile(targetPath, output)
    }
    report.push({
        platformId: item.id,
        originalBytes: Buffer.byteLength(source),
        optimizedBytes: Buffer.byteLength(output),
        savedBytes: Buffer.byteLength(source) - Buffer.byteLength(output),
        sourceHash: createHash('sha256').update(source).digest('hex'),
        optimizedHash: createHash('sha256').update(output).digest('hex'),
    })
}
await mkdir(path.join(cache, 'icons'), { recursive: true })
await writeFile(
    path.join(cache, 'icons', 'optimization.json'),
    JSON.stringify({ tool: 'svgo@4.1.0', check, config: svgoConfig, files: report }, null, 2) +
        '\n',
)
console.log(
    `${check ? 'CHECK' : 'PASS'} ${report.length} 个平台 SVG：${report.reduce((sum, item) => sum + item.originalBytes, 0)} → ${report.reduce((sum, item) => sum + item.optimizedBytes, 0)} bytes`,
)
