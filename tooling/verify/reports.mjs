import Ajv from 'ajv'
import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { root, cache } from '../paths.mjs'

// 使用独立端口验收报告与店铺弹窗，不改变正在展示的预览状态。
const server = await createServer({
    configFile: path.join(root, 'playground/components/vite.config.mjs'),
    server: { port: 0, strictPort: false },
})
let browser
const errors = [],
    checks = []
const target = path.join(cache, 'reports')
try {
    await mkdir(target, { recursive: true })
    await server.listen()
    browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(server.resolvedUrls.local[0])
    await page.evaluate(async () => {
        await import('/report.ts')
        document.body.replaceChildren()
        document.body.style.cssText = 'margin:0;height:100vh;overflow:hidden'
        const element = document.createElement('mf-selection-report-demo')
        element.style.height = '100vh'
        document.body.append(element)
    })
    const originalInput = JSON.parse(
        await readFile(
            path.join(root, 'playground/components/fixtures/selection-report.json'),
            'utf8',
        ),
    )
    const schemaBundle = await build({
        entryPoints: [path.join(root, 'playground/components/schema/report.ts')],
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'node',
    })
    const { reportDataSchema, reportDemoInputSchema } = await import(
        'data:text/javascript;base64,' +
            Buffer.from(schemaBundle.outputFiles[0].text).toString('base64')
    )
    const ajv = new Ajv({ strict: true, allErrors: true })
    const checkData = ajv.compile(reportDataSchema),
        checkDemo = ajv.compile(reportDemoInputSchema)
    const componentData = await page.evaluate(async () => {
        const { reportDemoData } = await import('/report.ts')
        return JSON.parse(JSON.stringify(reportDemoData))
    })
    assert.equal(checkData(componentData), true, JSON.stringify(checkData.errors))
    assert.equal(checkDemo(originalInput), true, JSON.stringify(checkDemo.errors))
    assert.equal(checkData(originalInput), false)
    assert.equal(checkDemo(componentData), false)
    assert.equal(
        checkData({
            title: '部分报告',
            context: [],
            categories: [{ id: 'partial', name: '仅类目' }],
        }),
        true,
    )
    assert.equal(checkData({ ...componentData, vocabulary: { metrics: { gmv: 123 } } }), false)
    assert.equal(
        checkData({ ...componentData, sources: [{ label: '来源', icon: { fake: 'Lit' } }] }),
        false,
    )
    const badProduct = structuredClone(originalInput)
    badProduct.categories[0].products[0].price = '错误价格'
    assert.equal(checkDemo(badProduct), false)
    const badTrend = structuredClone(originalInput)
    delete badTrend.categories[0].demand[0].series
    assert.equal(checkDemo(badTrend), false)
    assert.deepEqual(
        JSON.parse(
            await readFile(
                path.join(root, 'playground/components/schema/selection-report.schema.json'),
                'utf8',
            ),
        ),
        reportDataSchema,
    )
    assert.deepEqual(
        JSON.parse(
            await readFile(
                path.join(root, 'playground/components/schema/selection-report-demo.schema.json'),
                'utf8',
            ),
        ),
        reportDemoInputSchema,
    )
    const localReferences = (value) => {
        if (!value || typeof value !== 'object') return
        for (const [key, item] of Object.entries(value)) {
            if (key === '$ref') assert.ok(item.startsWith('#/'))
            else localReferences(item)
        }
    }
    localReferences(reportDataSchema)
    localReferences(reportDemoInputSchema)
    checks.push(
        '两份draft-07本地Schema严格编译；组件data与演示七区块分别验证且不能混用，缺失指标合法，嵌套/图标/错误类型拒绝，JSON资源一致',
    )
    const host = page.locator('mf-selection-report-demo')
    await host.getByRole('heading', { name: '选品报告', exact: true }).waitFor()
    assert.equal(await host.locator('.mf-report-section').count(), 7)
    const reportText = await host.locator('.mf-selection-report').innerText()
    assert.match(reportText, /月度类目成交额（USD）/)
    assert.match(reportText, /成交与内容表现/)
    assert.match(reportText, /新品销量（窗口未提供）/)
    assert.match(reportText, /报告达人计数/)
    assert.doesNotMatch(reportText, /销量榜样本|榜单 Top-K|新品榜 3 日|件 \/ 3 日|Top 5 商品销量 ÷/)

    assert.equal(await host.locator('.mf-report-hero h3').innerText(), '宠物喂养')
    assert.equal(
        await host.locator('.mf-report-hero [role=meter]').getAttribute('aria-valuenow'),
        '82',
    )
    assert.match(await host.locator('tr[data-row-key=feeding]').innerText(), /2,719,200/)
    assert.match(await host.locator('tr[data-row-key=feeding]').innerText(), /49.74%/)
    await host.getByRole('button', { name: '报告销量', exact: true }).click()
    assert.match(await host.locator('.mf-report-category-choice').first().innerText(), /宠物清洁/)
    await host.getByRole('button', { name: '月度成交额', exact: true }).click()
    assert.match(await host.locator('.mf-report-category-choice').first().innerText(), /宠物清洁/)
    await host.getByRole('button', { name: '综合机会', exact: true }).click()
    assert.match(await host.locator('.mf-report-category-choice').first().innerText(), /宠物喂养/)
    for (const category of originalInput.categories) {
        const choice = host.locator(`tr[data-row-key=${category.id}] .mf-report-category-choice`)
        await choice.focus()
        await page.keyboard.press('Enter')
        assert.equal(await host.locator('.mf-report-hero h3').innerText(), category.name)
        assert.equal(await host.locator('.mf-report-chart').count(), 2)
        assert.equal(await host.locator('.mf-report-product-table tr[data-row-key]').count(), 3)
        assert.equal(await host.locator('.mf-report-action').count(), 3)
        assert.match(
            await host.locator('.mf-report-hero-main').innerText(),
            new RegExp(category.summary.slice(0, 12)),
        )
        if (category.id === 'travel') {
            await host.locator('.mf-report-product-table').scrollIntoViewIfNeeded()
            const loaded = await host
                .locator('.mf-report-product img')
                .evaluateAll(async (images) =>
                    Promise.all(
                        images.map(async (image) => {
                            await image.decode()
                            return image.naturalWidth > 0
                        }),
                    ),
                )
            assert.deepEqual(loaded, [true, true, true])
        }
    }
    await host.locator('tr[data-row-key=feeding] .mf-report-category-choice').click()
    checks.push(
        '用户原始4类数据默认feeding；GMV2719200/增长49.74%/评分82原样；三排序与4类各2趋势、3商品、3行动；3本地图正常加载',
    )
    await host.getByRole('button', { name: '查看计算口径', exact: true }).click()
    const modal = host.getByRole('dialog', { name: '计算口径', exact: true })
    await modal.waitFor({ state: 'visible' })
    assert.match(await modal.innerText(), /扣除履约与波动风险/)
    assert.match(await modal.innerText(), /不是平台官方评级/)
    await page.keyboard.press('Escape')
    await modal.waitFor({ state: 'hidden' })
    await host.getByRole('button', { name: '查看选品列表', exact: true }).click()
    assert.match(await host.locator('.result').innerText(), /本地/)
    await host.locator('.mf-selection-report').evaluate((element) => {
        element.scrollTop = element.scrollHeight
    })
    const scrolling = await host.locator('.mf-selection-report').evaluate((element) => ({
        top: element.scrollTop,
        height: element.clientHeight,
        total: element.scrollHeight,
        overflow: element.scrollWidth > element.clientWidth,
    }))
    assert.ok(scrolling.top > 0 && scrolling.total > scrolling.height)
    assert.equal(scrolling.overflow, false)
    await page.screenshot({ path: path.join(target, 'report-bottom.png') })
    await host.locator('.mf-selection-report').evaluate((element) => {
        element.scrollTop = 0
    })
    await page.screenshot({ path: path.join(target, 'report-full.png') })
    checks.push(
        '口径保留风险扣分与非官方声明；modal Escape；列表只回调；有限高度末尾可达、无整体横向溢出',
    )
    await host.getByRole('radio', { name: '部分缺失', exact: true }).check()
    assert.equal(await host.locator('.mf-report-score-track').count(), 0)
    assert.equal(await host.locator('.mf-report-matrix [data-active=true]').count(), 0)
    assert.match(await host.locator('.mf-report-hero-facts').innerText(), /0 件/)
    assert.match(await host.locator('.mf-report-category-table').innerText(), /币种未提供/)
    assert.equal(
        await host.getByRole('button', { name: '月度成交额', exact: true }).isDisabled(),
        true,
    )
    await page.screenshot({ path: path.join(target, 'report-missing.png') })
    await host.getByRole('radio', { name: '空报告', exact: true }).check()
    assert.match(await host.locator('.mf-selection-report').innerText(), /暂无选品报告/)
    await host.getByRole('radio', { name: '长内容', exact: true }).check()
    assert.equal(
        await host
            .locator('.mf-selection-report')
            .evaluate((element) => element.scrollWidth > element.clientWidth),
        false,
    )
    checks.push('空报告、部分缺失、有效零、未知币种与长内容保持如实展示')
    const reportRail = host.getByRole('complementary', { name: '组件用法与调试' })
    const reportInput = reportRail.getByRole('textbox', { name: '输入演示数据 · JSON' })
    const reportJson = JSON.parse(await reportInput.inputValue())
    assert.deepEqual(reportJson, originalInput)
    reportJson.categories[1].name = 'JSON 调试类目'
    await reportInput.fill(JSON.stringify(reportJson))
    await reportRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    assert.equal(await host.locator('.mf-report-hero h3').innerText(), 'JSON 调试类目')
    reportJson.categories[1].units = '非法计数'
    await reportInput.fill(JSON.stringify(reportJson))
    await reportRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    assert.match(await reportRail.getByRole('alert').innerText(), /units|数字|number/)
    assert.equal(await host.locator('.mf-report-hero h3').innerText(), 'JSON 调试类目')
    await reportRail.getByRole('button', { name: '恢复默认', exact: true }).click()
    assert.equal(await host.locator('.mf-report-hero h3').innerText(), '宠物喂养')
    assert.deepEqual(JSON.parse(await reportInput.inputValue()), originalInput)
    await page.screenshot({ path: path.join(target, 'report-inspector.png') })
    checks.push(
        '完整报告右栏原始JSON保持一致；apply/数值非法保留/恢复用户原始输入；不序列化Lit对象',
    )
    await page.evaluate(() => {
        document.body.replaceChildren(document.createElement('mf-report-parts-demo'))
        document.body.firstElementChild.style.height = '100vh'
    })
    const parts = page.locator('mf-report-parts-demo')
    await parts.getByRole('heading', { name: '指标卡', exact: true }).waitFor()
    assert.match(await parts.locator('#metric').innerText(), /2,719,200/)
    assert.equal(
        await parts.locator('#score [role=meter]').first().getAttribute('aria-valuenow'),
        '82',
    )
    const partsRail = parts.getByRole('complementary', { name: '组件用法与调试' }),
        partsInput = partsRail.getByRole('textbox', { name: '输入演示数据 · JSON' })
    const partData = JSON.parse(await partsInput.inputValue())
    assert.deepEqual(partData, originalInput)
    partData.metric.value = 321
    partData.score.value = 42
    partData.trend.series[0].value = -9
    partData.trend.series[1].value = 0
    delete partData.trend.series[2].value
    partData.action.title = 'JSON 行动建议'
    await partsInput.fill(JSON.stringify(partData))
    await partsRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    assert.match(await parts.locator('#metric').innerText(), /321/)
    assert.equal(
        await parts.locator('#score [role=meter]').first().getAttribute('aria-valuenow'),
        '42',
    )
    const chart = parts.locator('#trend .mf-report-chart').first()
    assert.equal(await chart.locator('circle').count(), 4)
    assert.equal((await chart.locator('path').getAttribute('d')).match(/M/g).length, 2)
    await chart.locator('circle').first().focus()
    assert.match(await chart.locator('circle').first().getAttribute('aria-label'), /-9/)
    await parts.locator('#trend details').first().getByText('查看趋势数值', { exact: true }).click()
    assert.match(await parts.locator('#trend details').first().innerText(), /—/)
    assert.equal(await parts.locator('#trend .mf-report-chart').nth(1).locator('circle').count(), 1)
    assert.equal(await parts.locator('#trend .mf-report-chart-empty').count(), 1)
    assert.equal(await parts.locator('linearGradient[id]').count(), 0)
    assert.match(await parts.locator('#action').innerText(), /JSON 行动建议/)
    await parts
        .getByRole('navigation', { name: '报告区块导航' })
        .getByRole('button', { name: '行动建议卡', exact: true })
        .click()
    await parts.getByRole('button', { name: '查看示例回调', exact: true }).click()
    assert.match(await parts.locator('.callback').innerText(), /已收到/)
    partData.categories.push({ id: partData.categories[0].id, name: '重复类目' })
    await partsInput.fill(JSON.stringify(partData))
    await partsRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    assert.match(await partsRail.getByRole('alert').innerText(), /重复/)
    assert.match(await parts.locator('#metric').innerText(), /321/)
    await partsInput.fill('{')
    await partsRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    assert.match(await partsRail.getByRole('alert').innerText(), /JSON 格式/)
    await partsRail.getByRole('button', { name: '恢复默认', exact: true }).click()
    assert.deepEqual(JSON.parse(await partsInput.inputValue()), originalInput)
    assert.match(await parts.locator('#metric').innerText(), /2,719,200/)
    await page.screenshot({ path: path.join(target, 'report-parts.png') })
    checks.push(
        '7独立区块原始JSON一致；编辑/重复ID/非法JSON/恢复；SVG零负缺断点、单点与空图；焦点值/数值表/行动回调',
    )
    // 真实公开组件通过受控 fixture 验店铺行为、平台过滤和草稿提交边界。
    await page.evaluate(async () => {
        await import('/publish-shop.ts')
        document.body.replaceChildren(document.createElement('mf-publish-shop-demo'))
    })
    const shopHost = page.locator('mf-publish-shop-demo')
    await shopHost.getByRole('button', { name: '选择发布店铺', exact: true }).click()
    const shopDialog = shopHost.getByRole('dialog', { name: '选择发布店铺', exact: true })
    await shopDialog.waitFor({ state: 'visible' })
    assert.equal(await shopDialog.getByRole('radio').count(), 3)
    assert.equal(await shopDialog.getByRole('radio', { name: /待续期店铺/ }).isDisabled(), true)
    assert.equal(await shopDialog.getByRole('radio', { name: /Glow Beauty/ }).isChecked(), true)
    await shopDialog.getByRole('radio', { name: /Glow Beauty/ }).focus()
    await page.keyboard.press('End')
    assert.equal(await shopDialog.getByRole('radio', { name: /Home Essentials/ }).isChecked(), true)
    await shopDialog.getByRole('button', { name: '稍后再说', exact: true }).click()
    await shopDialog.waitFor({ state: 'hidden' })
    await shopHost.getByRole('button', { name: '选择发布店铺', exact: true }).click()
    assert.equal(await shopDialog.getByRole('radio', { name: /Glow Beauty/ }).isChecked(), true)
    await shopDialog.getByRole('radio', { name: /Home Essentials/ }).check()
    await page.screenshot({ path: path.join(target, 'publish-shop.png') })
    await shopDialog.getByRole('button', { name: '确认绑定店铺 (1)', exact: true }).click()
    await shopDialog.waitFor({ state: 'hidden' })
    assert.match(await shopHost.getByRole('status').innerText(), /Home Essentials/)
    await shopHost.getByRole('radio', { name: '无可用店铺', exact: true }).check()
    await shopHost.getByRole('button', { name: '选择发布店铺', exact: true }).click()
    assert.match(await shopDialog.innerText(), /暂无可选店铺/)
    await shopDialog.getByRole('button', { name: '去授权店铺', exact: true }).click()
    assert.match(await shopHost.getByRole('status').innerText(), /宿主/)
    checks.push('发布店铺平台过滤、首选、单选键盘跳过禁用、取消草稿重置、确认交接与无店铺授权回调')
    const shopRail = shopHost.getByRole('complementary', { name: '组件用法与调试' })
    const shopInput = shopRail.getByRole('textbox', { name: '输入演示数据 · JSON' })
    const shopData = JSON.parse(await shopInput.inputValue())
    shopData.productTitle = 'JSON 长店铺列表示例'
    shopData.selectedId = 'shop-0'
    shopData.shops = Array.from({ length: 40 }, (_, index) => ({
        id: `shop-${index}`,
        platformId: 'tiktok_shop',
        regionLabel: '美国',
        name: `本地店铺 ${index}`,
        defaultCategory: '宠物用品',
        ...(index === 39 ? { disabledReason: '授权已失效' } : {}),
    }))
    await shopInput.fill(JSON.stringify(shopData))
    await shopRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    await shopHost.getByRole('button', { name: '选择发布店铺', exact: true }).click()
    assert.match(await shopDialog.innerText(), /JSON 长店铺/)
    assert.equal(await shopDialog.getByRole('radio').count(), 40)
    const bodyScroll = await shopDialog
        .locator('.mf-dialog-body')
        .evaluate((element) => ({ client: element.clientHeight, total: element.scrollHeight }))
    assert.ok(bodyScroll.total > bodyScroll.client)
    await shopDialog.getByRole('radio', { name: '美国 本地店铺 0', exact: true }).focus()
    await page.keyboard.press('End')
    assert.equal(
        await shopDialog.getByRole('radio', { name: '美国 本地店铺 38', exact: true }).isChecked(),
        true,
    )
    const dialogFooter = await shopDialog.locator('.mf-footer').boundingBox()
    assert.ok(dialogFooter.y + dialogFooter.height <= 1000)
    await shopDialog.getByRole('button', { name: '稍后再说', exact: true }).click()
    await shopHost.getByRole('button', { name: '选择发布店铺', exact: true }).click()
    assert.equal(
        await shopDialog.getByRole('radio', { name: '美国 本地店铺 0', exact: true }).isChecked(),
        true,
    )
    await shopDialog.getByRole('button', { name: '稍后再说', exact: true }).click()
    shopData.selectedId = 'not-a-shop'
    await shopInput.fill(JSON.stringify(shopData))
    await shopRail.getByRole('button', { name: '应用到预览', exact: true }).click()
    assert.match(await shopRail.getByRole('alert').innerText(), /selectedId/)
    checks.push(
        '店铺 JSON 编辑与拒绝非法选择；40店铺正文滚动、末尾键盘跳过禁用、footer可达、取消保留已提交值',
    )
    const defaults = await build({
        stdin: {
            contents: `import {render} from 'lit';import {selectionReport} from './lib/browser/index.ts';render(selectionReport({data:{title:'默认口径验证',context:[],categories:[{id:'old',name:'原样本类目',units:1,gmv:2,currencyCode:'USD'}]},selectedId:'old',sortKey:'score',methodOpen:false,onSelect:()=>{},onSortChange:()=>{},onMethodOpenChange:()=>{}}),document.body)`,
            resolveDir: root,
        },
        bundle: true,
        write: false,
        format: 'esm',
        loader: { '.svg': 'dataurl' },
    })
    const defaultsPage = await browser.newPage()
    defaultsPage.on('pageerror', (error) => errors.push(error.message))
    await defaultsPage.setContent('<body></body>')
    await defaultsPage.addScriptTag({ type: 'module', content: defaults.outputFiles[0].text })
    await defaultsPage.getByRole('heading', { name: '默认口径验证', exact: true }).waitFor()
    const oldText = await defaultsPage.locator('.mf-selection-report').innerText()
    assert.match(oldText, /销量榜样本 GMV/)
    assert.match(oldText, /近一期榜单 Top-K 商品成交/)
    assert.match(oldText, /新品榜 3 日销量/)
    assert.match(oldText, /Top 5 商品销量 ÷ 榜单样本销量/)
    await defaultsPage.close()
    checks.push(
        '展示口径：用户月度GMV与未提供窗口不再套Top-K/3日/Top5公式；无vocabulary的旧调用保留原默认',
    )
    assert.deepEqual(errors, [])
    await writeFile(
        path.join(target, 'summary.json'),
        JSON.stringify({ passed: true, checks, errors }, null, 2),
    )
    console.log('PASS 报告与店铺：' + checks.join('；'))
} finally {
    await browser?.close()
    await server.close()
}
