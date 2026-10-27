import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright'
import { build } from 'esbuild'
import { root, cache } from '../paths.mjs'
import { platformIcons } from './config.mjs'

const directory = path.join(cache, 'icons')
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({
    headless: true,
    ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
})
const pixels = []
try {
    const page = await browser.newPage()
    for (const item of platformIcons) {
        const source = await readFile(
            path.join(root, 'lib/browser/ui/assets/source/platforms', item.file + '.svg'),
            'utf8',
        )
        const optimized = await readFile(
            path.join(root, 'lib/browser/ui/assets/platforms', item.file + '.svg'),
            'utf8',
        )
        const result = await page.evaluate(
            async ({ source, optimized }) => {
                const inspect = (text) => {
                    const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
                    if (doc.querySelector('parsererror')) throw new Error('SVG 解析失败')
                    for (const node of doc.querySelectorAll('*')) {
                        if (
                            ['script', 'foreignobject', 'iframe', 'object', 'embed'].includes(
                                node.localName.toLowerCase(),
                            )
                        )
                            throw new Error('SVG 含不允许的元素')
                        for (const attr of node.attributes) {
                            if (/^on/i.test(attr.name)) throw new Error('SVG 含事件属性')
                            if (
                                /href$/i.test(attr.name) &&
                                attr.value &&
                                !attr.value.startsWith('#')
                            )
                                throw new Error('SVG 含外部引用')
                            if (/url\(\s*['"]?(?!#)/i.test(attr.value))
                                throw new Error('SVG 含外部样式引用')
                        }
                        if (
                            node.localName === 'style' &&
                            /@import|url\(\s*['"]?(?!#)/i.test(node.textContent ?? '')
                        )
                            throw new Error('SVG 含外部样式')
                    }
                    return doc.documentElement.getAttribute('viewBox')
                }
                const originalViewBox = inspect(source),
                    optimizedViewBox = inspect(optimized)
                if (originalViewBox !== optimizedViewBox) throw new Error('viewBox 不一致')
                const render = async (text, width, height) => {
                    const image = new Image()
                    image.src = 'data:image/svg+xml,' + encodeURIComponent(text)
                    await image.decode()
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const context = canvas.getContext('2d'),
                        scale = Math.min(width / image.naturalWidth, height / image.naturalHeight),
                        w = image.naturalWidth * scale,
                        h = image.naturalHeight * scale
                    context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
                    return context.getImageData(0, 0, width, height).data
                }
                const samples = []
                for (const [width, height] of [
                    [32, 32],
                    [192, 96],
                ]) {
                    const a = await render(source, width, height),
                        b = await render(optimized, width, height)
                    let sum = 0,
                        changed = 0
                    const bounds = (data) => {
                        let minX = width,
                            minY = height,
                            maxX = -1,
                            maxY = -1
                        for (let i = 0; i < width * height; i++) {
                            if (data[i * 4 + 3] > 8) {
                                const x = i % width,
                                    y = Math.floor(i / width)
                                minX = Math.min(minX, x)
                                minY = Math.min(minY, y)
                                maxX = Math.max(maxX, x)
                                maxY = Math.max(maxY, y)
                            }
                        }
                        return [minX, minY, maxX, maxY]
                    }
                    for (let i = 0; i < a.length; i += 4) {
                        let max = 0
                        for (let c = 0; c < 4; c++) {
                            const av =
                                    c === 3
                                        ? a[i + c]
                                        : (a[i + c] * a[i + 3]) / 255 + 255 - a[i + 3],
                                bv =
                                    c === 3
                                        ? b[i + c]
                                        : (b[i + c] * b[i + 3]) / 255 + 255 - b[i + 3]
                            const diff = Math.abs(av - bv)
                            sum += diff
                            max = Math.max(max, diff)
                        }
                        if (max > 16) changed++
                    }
                    samples.push({
                        width,
                        height,
                        meanChannelDifference: sum / a.length,
                        changedPixelRatio: changed / (width * height),
                        originalBounds: bounds(a),
                        optimizedBounds: bounds(b),
                    })
                }
                return { originalViewBox, optimizedViewBox, samples }
            },
            { source, optimized },
        )
        await writeFile(
            path.join(directory, item.file + '-pixels.json'),
            JSON.stringify(result, null, 2),
        )
        for (const sample of result.samples) {
            assert.ok(sample.meanChannelDifference <= 0.8, `${item.id} 平均通道差异过大`)
            assert.ok(sample.changedPixelRatio <= 0.02, `${item.id} 明显变化像素过多`)
            assert.ok(
                sample.originalBounds.every((v, i) => Math.abs(v - sample.optimizedBounds[i]) <= 1),
                `${item.id} 轮廓边界改变`,
            )
        }
        pixels.push({ platformId: item.id, ...result })
    }
} finally {
    await browser.close()
}

const originalPlugin = {
    name: 'original-svg-comparison',
    setup(api) {
        api.onLoad({ filter: /assets\/platforms\/[^/]+\.svg$/ }, async (args) => ({
            contents: await readFile(
                path.join(root, 'lib/browser/ui/assets/source/platforms', path.basename(args.path)),
                'utf8',
            ),
            loader: 'dataurl',
        }))
    },
}
const runtimeBoundary = {
    name: 'same-host-lit-boundary',
    setup(api) {
        api.onResolve({ filter: /^(lit|lit-html|@lit\/reactive-element)$/ }, () => ({
            path: 'lit',
            external: true,
        }))
        api.onResolve(
            { filter: /(?:^|\/)(?:lit-html|lit-element|reactive-element)\.js$/ },
            (args) =>
                /node_modules\/(?:lit-html|lit-element|@lit\/reactive-element)\//.test(
                    path.resolve(path.dirname(args.importer), args.path),
                )
                    ? { path: 'lit', external: true }
                    : undefined,
        )
    },
}
const originalBundle = async (contents) => {
    const result = await build({
        stdin: { contents, resolveDir: root },
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'browser',
        external: ['lit'],
        conditions: ['production'],
        loader: { '.svg': 'dataurl' },
        minify: true,
        plugins: [runtimeBoundary, originalPlugin],
    })
    const text = result.outputFiles[0].text
    return { bytes: Buffer.byteLength(text), gzipBytes: gzipSync(text, { level: 9 }).byteLength }
}
const bundles = []
for (const item of platformIcons) {
    const result = await build({
        stdin: {
            contents: `import{${item.exportName}}from'./lib/browser/ui/index.ts';export const icon=${item.exportName}()`,
            resolveDir: root,
            sourcefile: `verify-${item.id}.ts`,
        },
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'browser',
        external: ['lit'],
        conditions: ['production'],
        loader: { '.svg': 'dataurl' },
        minify: true,
        metafile: true,
        plugins: [runtimeBoundary],
    })
    const text = result.outputFiles[0].text
    const included = Object.values(result.metafile.outputs).flatMap((output) =>
        Object.entries(output.inputs)
            .filter(([file, value]) => file.endsWith('.svg') && value.bytesInOutput > 0)
            .map(([file, value]) => ({ file, bytesInOutput: value.bytesInOutput })),
    )
    assert.equal(included.length, 1, `${item.id} 静态入口打包了其它平台`)
    assert.ok(included[0].file.endsWith('/' + item.file + '.svg'))
    bundles.push({
        entry: item.exportName,
        bytes: Buffer.byteLength(text),
        gzipBytes: gzipSync(text, { level: 9 }).byteLength,
        included,
        original: await originalBundle(
            `import{${item.exportName}}from'./lib/browser/ui/index.ts';export const icon=${item.exportName}()`,
        ),
    })
}
for (const [name, contents] of [
    [
        'currency-usd',
        "import{currencyIcon}from'./lib/browser/ui/index.ts';export const icon=currencyIcon('USD')",
    ],
    [
        'dynamic-amazon',
        "import{platformIcon}from'./lib/browser/ui/index.ts';export const icon=platformIcon('amazon')",
    ],
]) {
    const result = await build({
        stdin: { contents, resolveDir: root },
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'browser',
        external: ['lit'],
        conditions: ['production'],
        loader: { '.svg': 'dataurl' },
        minify: true,
        metafile: true,
        plugins: [runtimeBoundary],
    })
    const text = result.outputFiles[0].text,
        included = Object.values(result.metafile.outputs).flatMap((output) =>
            Object.entries(output.inputs)
                .filter(([file, value]) => file.endsWith('.svg') && value.bytesInOutput > 0)
                .map(([file, value]) => ({ file, bytesInOutput: value.bytesInOutput })),
        )
    if (name === 'currency-usd') assert.equal(included.length, 0, '货币图标带入平台资源')
    bundles.push({
        entry: name,
        bytes: Buffer.byteLength(text),
        gzipBytes: gzipSync(text, { level: 9 }).byteLength,
        included,
        original: await originalBundle(contents),
    })
}
const optimization = JSON.parse(await readFile(path.join(directory, 'optimization.json'), 'utf8'))
await writeFile(
    path.join(directory, 'verification.json'),
    JSON.stringify(
        {
            passed: true,
            thresholds: {
                meanChannelDifference: 0.8,
                changedPixelRatio: 0.02,
                pixelThreshold: 16,
                boundsDifference: 1,
            },
            pixels,
            bundles,
            optimization,
        },
        null,
        2,
    ) + '\n',
)
console.log(
    `PASS ${pixels.length} SVG 安全/几何/双尺寸像素比较；${platformIcons.length} 静态平台入口仅包含本平台；货币不带平台；动态入口全量成本已记录`,
)
