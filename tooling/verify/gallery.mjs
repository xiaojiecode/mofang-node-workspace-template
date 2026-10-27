import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root, cache } from '../paths.mjs'

// 加载实际运行时导出核对覆盖，避免仅匹配 import 文本冒充示例。
const runtime = await build({
    entryPoints: [path.join(root, 'lib/browser/ui/index.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    loader: { '.svg': 'dataurl' },
})
const ui = await import(
    'data:text/javascript;base64,' + Buffer.from(runtime.outputFiles[0].text).toString('base64')
)
const publicFunctions = Object.entries(ui)
    .filter(([, value]) => typeof value === 'function')
    .map(([name]) => name)
    .sort()
const compiled = await build({
    entryPoints: [path.join(root, 'playground/components/coverage.ts')],
    bundle: true,
    write: false,
    format: 'esm',
})
const { componentCoverage } = await import(
    'data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64')
)
const covered = Object.values(componentCoverage).flat()
assert.deepEqual(
    [...new Set(covered)].sort(),
    publicFunctions,
    '每个可调用公共 UI 导出必须有明确示例页面',
)

const browser = await chromium.launch({
    headless: true,
    ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
})
const errors = []
const checks = []
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    page.on('pageerror', (error) => errors.push(error.message))
    const base = process.env.MF_COMPONENT_PREVIEW_URL ?? 'http://127.0.0.1:5298'
    for (const [id, exports] of Object.entries(componentCoverage)) {
        await page.goto(`${base}/?component=${id}`)
        const host = page.locator('mf-component-gallery')
        await host.locator('main h1').waitFor()
        const entry = host
            .getByRole('navigation', { name: '组件导航' })
            .locator('button[aria-current=page]')
        assert.equal(await entry.count(), 1, `${id} 有可见导航入口`)
        const demo = host.locator('.demo-surface')
        assert.ok(
            await demo.evaluate((element) => element.getBoundingClientRect().height > 0),
            `${id} 示例已挂载`,
        )
        checks.push({ page: id, exports, title: await host.locator('main h1').innerText() })
    }
    await page.goto(`${base}/?component=states`)
    const states = page.locator('mf-state-examples')
    await states.getByText('暂无运行记录', { exact: true }).waitFor()
    await states.getByRole('radio', { name: '收起', exact: true }).check()
    assert.equal(
        await states.getByRole('button', { name: /节点运行逻辑/ }).getAttribute('aria-expanded'),
        'false',
    )
    const example = async (name) => {
        await states.getByRole('radio', { name, exact: true }).check()
    }
    await example('下拉选择')
    await states.getByRole('radio', { name: '无选项', exact: true }).check()
    assert.equal(
        await states.getByRole('combobox', { name: '示例选择', exact: true }).isDisabled(),
        true,
    )
    await example('多级下拉')
    await states.getByRole('combobox', { name: '示例类目', exact: true }).click()
    await states.getByRole('textbox', { name: '搜索示例类目' }).fill('不存在的类目')
    await states.getByText('未找到匹配的类目', { exact: true }).waitFor()
    await page.keyboard.press('Escape')
    await example('节点驾驶舱')
    await states.getByRole('radio', { name: '无节点', exact: true }).check()
    await states.getByText('暂无节点执行信息', { exact: true }).waitFor()
    await example('进度条')
    for (const [label, value] of [
        ['0%', '0'],
        ['100%', '100'],
        ['不确定进度', null],
    ]) {
        await states.getByRole('radio', { name: label, exact: true }).check()
        assert.equal(await states.getByRole('progressbar').getAttribute('aria-valuenow'), value)
    }
    assert.deepEqual(errors, [])
    const directory = path.join(cache, 'gallery')
    await mkdir(directory, { recursive: true })
    await page.goto(`${base}/?component=states`)
    await page.locator('mf-state-examples').getByText('暂无运行记录', { exact: true }).waitFor()
    await page.screenshot({ path: path.join(directory, 'accordion-empty.png') })
    await writeFile(
        path.join(directory, 'summary.json'),
        JSON.stringify(
            {
                passed: true,
                publicFunctions,
                checks,
                states: [
                    '空/关闭手风琴',
                    '无选项下拉',
                    '类目搜索无匹配',
                    '无节点驾驶舱',
                    '0/100/不确定进度',
                ],
            },
            null,
            2,
        ),
    )
    console.log(
        `公共 UI 导出 ${publicFunctions.length} 项、示例页面 ${checks.length} 个及状态示例验证通过`,
    )
} finally {
    await browser.close()
}
