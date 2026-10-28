import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { root, cache } from '../paths.mjs'
import { chooseCalendarDraft } from './calendar-input.mjs'

// 独立服务使用空闲端口，不干扰用户正在验收的预览进程。
const server = await createServer({
    configFile: path.join(root, 'playground/components/vite.config.mjs'),
    server: { port: 0, strictPort: false },
})
let browser
const checks = []
const errors = []
try {
    await mkdir(path.join(cache, 'components'), { recursive: true })
    await server.listen()
    browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    page.on('pageerror', (error) => errors.push(error.message))
    const base = server.resolvedUrls.local[0]
    const host = page.locator('mf-component-gallery')
    const navigate = async (name) => {
        await host
            .getByRole('navigation', { name: '组件导航' })
            .getByRole('button', { name, exact: true })
            .click()
    }
    await page.goto(`${base}/?component=combined`)
    await host.getByRole('heading', { name: '设置组合示例', exact: true }).waitFor()
    // 步骤卡整卡点击，键盘可达；底部操作与滚动正文分离。
    const step = host.locator('.steps .mf-card').nth(1)
    await step.click({ position: { x: 15, y: 60 } })
    assert.equal(await host.evaluate((e) => e.step), 'collection')
    await host.getByRole('button', { name: '选品调研', exact: true }).focus()
    await page.keyboard.press('Enter')
    assert.equal(await host.evaluate((e) => e.step), 'selection')
    const before = await host.locator('.combo .mf-footer').boundingBox()
    await host.locator('.combo-content').evaluate((e) => {
        e.scrollTop = e.scrollHeight
    })
    assert.equal((await host.locator('.combo .mf-footer').boundingBox()).y, before.y)
    checks.push('整卡点击和键盘选择；容器底部操作固定，正文独立滚动')

    await navigate('输入框 / 数字步进')
    const input = host.locator('input[name=quantity]')
    await input.fill('0')
    assert.equal(await host.evaluate((e) => e.amount), 0)
    await input.fill('')
    assert.equal(await host.evaluate((e) => e.amount), undefined)
    await input.fill('101')
    assert.equal(await host.evaluate((e) => e.amount), undefined)
    await host.locator('input[name=search]').fill('其他字段更新')
    assert.equal(await input.inputValue(), '101')
    await host.getByRole('button', { name: '商品数量减少', exact: true }).click()
    assert.equal(await input.getAttribute('aria-invalid'), 'false')
    assert.equal(await input.evaluate((e) => e.validity.customError), false)
    await input.fill('99')
    await host.getByRole('button', { name: '商品数量增加', exact: true }).click()
    assert.equal(await input.inputValue(), '100')
    assert.equal(
        await host.getByRole('button', { name: '商品数量增加', exact: true }).isDisabled(),
        true,
    )
    assert.equal(await host.locator('input[name=readonly-input]').isDisabled(), true)
    checks.push('数字零值与空值区分；非法输入保留；步进边界；只读输入禁用')

    await navigate('日期 / 时间选择')
    const dates = host.locator('mf-date-time-examples')
    const date = dates.getByRole('combobox', { name: '日期', exact: true })
    const dateTime = dates.getByRole('combobox', { name: '本地日期时间', exact: true })
    let calendar = await chooseCalendarDraft(dates, '日期', '2026-10-01')
    assert.equal(await dates.evaluate((element) => element.date), '', '选择尚未确认不能回写')
    await calendar.getByRole('button', { name: '确认', exact: true }).click()
    assert.equal(await dates.evaluate((element) => element.date), '2026-10-01')
    await date.click()
    calendar = dates.getByRole('dialog', { name: '选择日期', exact: true })
    const dateDraft = calendar.getByRole('textbox', { name: '所选日期', exact: true })
    await dateDraft.fill('2026-09-30')
    assert.equal(await dates.evaluate((element) => element.date), '2026-10-01')
    assert.equal(
        await calendar.getByRole('button', { name: '确认', exact: true }).isDisabled(),
        true,
    )
    await dates.evaluate((element) => {
        element.note = '触发其它字段刷新'
    })
    assert.equal(await dateDraft.inputValue(), '2026-09-30')
    assert.equal(await dateDraft.getAttribute('aria-invalid'), 'true')
    await dates.evaluate((element) => {
        element.date = '2026-12-31'
    })
    await calendar.waitFor({ state: 'hidden' })
    await date.click()
    assert.equal(await dateDraft.inputValue(), '2026-12-31')
    assert.equal(await dateDraft.getAttribute('aria-invalid'), 'false')
    assert.equal(await calendar.getByRole('alert').isHidden(), true)
    await calendar.getByRole('button', { name: '清空', exact: true }).click()
    assert.equal(await dates.evaluate((element) => element.date), '2026-12-31')
    await calendar.getByRole('button', { name: '确认', exact: true }).click()
    assert.equal(await dates.evaluate((element) => element.date), '')
    let clock = await chooseCalendarDraft(dates, '本地日期时间', '2026-10-01T00:00')
    await clock.getByRole('button', { name: '确认', exact: true }).click()
    assert.equal(await dates.evaluate((element) => element.dateTime), '2026-10-01T00:00')
    await dateTime.click()
    clock = dates.getByRole('dialog', { name: '选择本地日期时间', exact: true })
    await clock.getByRole('textbox', { name: '所选日期', exact: true }).fill('2027-01-01')
    assert.equal(await clock.getByRole('button', { name: '确认', exact: true }).isDisabled(), true)
    assert.equal(await dates.evaluate((element) => element.dateTime), '2026-10-01T00:00')
    await clock.getByRole('button', { name: '取消', exact: true }).click()
    clock = await chooseCalendarDraft(dates, '本地日期时间', '2026-12-31T23:59')
    await clock.getByRole('button', { name: '确认', exact: true }).click()
    assert.equal(await dates.evaluate((element) => element.dateTime), '2026-12-31T23:59')
    await dateTime.click()
    await clock.getByRole('button', { name: '清空', exact: true }).click()
    await clock.getByRole('button', { name: '确认', exact: true }).click()
    assert.equal(await dates.evaluate((element) => element.dateTime), '')
    for (const name of ['只读日期', '禁用日期', '未提供回调'])
        assert.equal(await dates.getByRole('combobox', { name, exact: true }).isDisabled(), true)
    checks.push(
        '统一日历确认才回写；日期与本地时间标准字符串、清空、上下界、非法草稿保留、外部重置清错及只读禁用',
    )

    await navigate('区间输入')
    await host.locator('input[name=demo-price-min]').fill('20')
    await host.locator('input[name=demo-price-max]').fill('10')
    assert.equal(
        await host.getByRole('button', { name: '确认区间', exact: true }).isDisabled(),
        true,
    )
    assert.deepEqual(await host.evaluate((e) => e.range), { min: 20, max: 10 })
    await host.locator('input[name=demo-price-min]').fill('0')
    await host.locator('input[name=demo-price-max]').fill('')
    assert.deepEqual(await host.evaluate((e) => e.range), { min: 0 })
    checks.push('区间不静默交换上下界；错误阻止示例确认；空上界不变为零')

    await navigate('多级下拉选择')
    const trigger = host.getByRole('combobox', { name: '类目', exact: true })
    const picker = host.getByRole('dialog', { name: '类目选择器', exact: true })
    await trigger.click()
    await picker.getByRole('option', { name: '美妆个护', exact: true }).click()
    await picker.getByRole('option', { name: '护肤', exact: true }).click()
    await picker.getByRole('option', { name: '面霜', exact: true }).click()
    await picker.getByRole('button', { name: '确认选择', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.category), ['beauty', 'skin', 'cream'])
    await trigger.click()
    await picker.getByRole('option', { name: '家居生活', exact: true }).click()
    assert.equal(await picker.getByRole('option', { name: '面霜', exact: true }).count(), 0)
    await picker.getByRole('button', { name: '取消', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.category), ['beauty', 'skin', 'cream'])
    assert.equal(await trigger.evaluate((e) => e === e.getRootNode().activeElement), true)
    await trigger.click()
    await picker.getByRole('option', { name: '家居生活', exact: true }).click()
    await page.keyboard.press('Escape')
    assert.equal(await trigger.evaluate((e) => e === e.getRootNode().activeElement), true)
    assert.deepEqual(await host.evaluate((e) => e.category), ['beauty', 'skin', 'cream'])
    await trigger.click()
    await picker.getByRole('textbox', { name: '搜索类目', exact: true }).fill('收纳盒')
    await picker.getByRole('button', { name: '家居生活 / 收纳整理 / 收纳盒', exact: true }).click()
    await picker.getByRole('button', { name: '确认选择', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.category), ['home', 'storage', 'box'])
    await trigger.click()
    await picker.getByRole('option', { name: '手机与数码', exact: true }).focus()
    await page.keyboard.press('Home')
    assert.equal(
        await picker
            .getByRole('option', { name: '美妆个护', exact: true })
            .evaluate((e) => e === e.getRootNode().activeElement),
        true,
    )
    await page.keyboard.press('End')
    assert.equal(
        await picker
            .getByRole('option', { name: '宠物用品', exact: true })
            .evaluate((e) => e === e.getRootNode().activeElement),
        true,
    )
    await page.keyboard.press('Enter')
    await picker.getByRole('button', { name: '确认选择', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.category), ['pets'])
    await trigger.click()
    await picker.getByRole('button', { name: '清空', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.category), [])
    checks.push('级联确认/取消/Escape/搜索/改上级清下级/任意层确认/清空/方向键')

    await navigate('原子能力配置面板')
    const open = host.getByRole('button', { name: '数据筛选详细配置', exact: true })
    await open.click()
    const config = host.getByRole('dialog', { name: '数据筛选规则配置', exact: true })
    await config.locator('input[name=filter-price-min]').fill('12')
    await config.getByRole('button', { name: '取消', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.configSaved), {})
    await open.click()
    assert.equal(await config.locator('input[name=filter-price-min]').inputValue(), '')
    await config.locator('input[name=filter-price-min]').fill('12')
    await config.locator('input[name=filter-price-max]').fill('10')
    assert.equal(await config.getByRole('button', { name: '确认', exact: true }).isDisabled(), true)
    await config.locator('input[name=filter-price-max]').fill('30')
    await config.getByRole('button', { name: '确认', exact: true }).click()
    assert.deepEqual(await host.evaluate((e) => e.configSaved.price), { min: 12, max: 30 })
    await open.click()
    await config.locator('input[name=filter-price-min]').fill('15')
    await page.keyboard.press('Escape')
    assert.deepEqual(await host.evaluate((e) => e.configSaved.price), { min: 12, max: 30 })
    checks.push('配置弹窗只在确认后提交；取消/Escape恢复；错误禁用确认')

    await navigate('Tab 切换容器')
    const note = host.locator('input[name=tab-note]')
    await note.fill('保留此草稿')
    const identity = await note.evaluate((e) => {
        e.dataset.identity = 'stable'
        return e.dataset.identity
    })
    await host.getByRole('tab', { name: '选品列表', exact: true }).focus()
    await page.keyboard.press('ArrowRight')
    assert.equal(await host.evaluate((e) => e.tab), 'report')
    await page.keyboard.press('ArrowRight')
    assert.equal(await host.evaluate((e) => e.tab), 'list')
    assert.equal(await note.inputValue(), '保留此草稿')
    assert.equal(await note.getAttribute('data-identity'), identity)
    checks.push('下划线Tab键盘跳过禁用项；切换保留草稿和DOM')

    await navigate('切换开关')
    await host.getByRole('switch', { name: '启用数据筛选', exact: true }).click()
    assert.equal(await host.evaluate((e) => e.checked), false)
    assert.equal(
        await host.getByRole('switch', { name: '暂不开放', exact: true }).isDisabled(),
        true,
    )
    await navigate('运行逻辑手风琴')
    const accordion = host.locator('.mf-execution-accordion__toggle')
    await accordion.focus()
    await page.keyboard.press('Enter')
    assert.equal(await accordion.getAttribute('aria-expanded'), 'false')
    await page.keyboard.press('Enter')
    assert.equal(await accordion.getAttribute('aria-expanded'), 'true')
    checks.push('开关受控/禁用；运行手风琴支持键盘展开收起')

    await navigate('下拉选择')
    const siteTrigger = host.getByRole('combobox', { name: '站点', exact: true })
    const siteMenu = host.getByRole('listbox', { name: '站点', exact: true })
    await siteTrigger.click()
    assert.ok(
        await siteMenu.evaluate(async (e) => {
            await new Promise(requestAnimationFrame)
            return e.getAnimations().length > 0
        }),
        '下拉展开应产生短过渡',
    )
    await siteMenu.evaluate(async (e) => {
        await Promise.all(e.getAnimations().map((a) => a.finished.catch(() => {})))
    })
    await host.evaluate((e) => e.requestUpdate())
    assert.equal(
        await siteMenu.evaluate((e) => e.getAnimations().length),
        0,
        '数据刷新不得重播展开动画',
    )
    await page.keyboard.press('Escape')
    await siteMenu.waitFor({ state: 'hidden' })
    await navigate('多级下拉选择')
    await trigger.click()
    assert.ok(
        await picker.evaluate(async (e) => {
            await new Promise(requestAnimationFrame)
            return e.getAnimations().length > 0
        }),
        '级联展开应有短过渡',
    )
    await picker.getByRole('button', { name: '取消', exact: true }).click()
    await picker.waitFor({ state: 'hidden' })
    await navigate('弹窗')
    await host.getByRole('button', { name: '打开弹窗', exact: true }).click()
    const modal = host.getByRole('dialog', { name: '组件弹窗', exact: true })
    assert.ok(
        await modal.evaluate(async (e) => {
            await new Promise(requestAnimationFrame)
            return e.getAnimations().length > 0
        }),
        '弹窗打开应有短过渡',
    )
    await page.keyboard.press('Escape')
    await modal.waitFor({ state: 'hidden' })
    assert.equal(await host.locator('dialog[open]').count(), 0)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await navigate('下拉选择')
    await siteTrigger.click()
    assert.equal(
        await siteMenu.evaluate((e) => e.getAnimations().length),
        0,
        '减少动效时不创建展开动画',
    )
    await page.keyboard.press('Escape')
    await navigate('多级下拉选择')
    await trigger.click()
    assert.equal(await picker.evaluate((e) => e.getAnimations().length), 0)
    await page.keyboard.press('Escape')
    await navigate('弹窗')
    await host.getByRole('button', { name: '打开弹窗', exact: true }).click()
    assert.equal(await modal.evaluate((e) => e.getAnimations().length), 0)
    await page.keyboard.press('Escape')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    checks.push('下拉/级联/弹窗短过渡；刷新不重播；关闭释放顶层；减少动效停用')

    await navigate('节点驾驶舱')
    await host.evaluate((e) => {
        e.running = false
    })
    const cockpitBody = host.locator('.cockpit-demo .mf-cockpit__content')
    const cockpitFooter = host.locator('.cockpit-demo .mf-cockpit__footer')
    const cockpitBottom = await cockpitFooter.boundingBox()
    await cockpitBody.evaluate((e) => {
        e.scrollTop = e.scrollHeight
    })
    assert.equal((await cockpitFooter.boundingBox()).y, cockpitBottom.y)
    await host.getByRole('button', { name: '收起当前节点执行', exact: true }).click()
    await cockpitBody.waitFor({ state: 'hidden' })
    assert.equal(await cockpitBody.isVisible(), false)
    await host.getByRole('button', { name: '展开当前节点执行', exact: true }).click()
    assert.equal(await cockpitBody.isVisible(), true)
    await host.getByRole('button', { name: '继续', exact: true }).click()
    assert.equal(await host.evaluate((e) => e.running), true)
    await host.getByRole('button', { name: '暂停', exact: true }).click()
    checks.push('驾驶舱正文滚动/底部固定/收起恢复/本地继续暂停；不触发真实调用')

    const layoutEvidence = {}
    const closeSamples = async (surface, closeSelector) =>
        surface.evaluate(async (element, selector) => {
            const sample = () => ({
                width: element.offsetWidth,
                height: element.offsetHeight,
                direction: getComputedStyle(element).flexDirection,
                children: [...element.children].map((child) => ({
                    width: child.offsetWidth,
                    height: child.offsetHeight,
                })),
            })
            const frames = [sample()]
            element.querySelector(selector).click()
            for (let frame = 0; frame < 14; frame++) {
                await new Promise(requestAnimationFrame)
                frames.push(sample())
            }
            return frames
        }, closeSelector)
    const stable = (frames) => {
        const visible = frames.filter((frame) => frame.width > 0)
        for (const frame of visible) {
            assert.deepEqual(frame, visible[0], '浮层退出过程不得改变正文、头部或操作区排版')
        }
    }
    await navigate('弹窗')
    await host.getByRole('button', { name: '打开弹窗', exact: true }).click()
    await modal.evaluate(async (e) => {
        await new Promise(requestAnimationFrame)
        await Promise.all(e.getAnimations().map((a) => a.finished.catch(() => {})))
    })
    layoutEvidence.dialog = await closeSamples(modal, '.mf-dialog-close')
    stable(layoutEvidence.dialog)
    await navigate('原子能力 Card')
    await host.getByRole('button', { name: '数据筛选详细配置', exact: true }).click()
    await config.evaluate(async (e) => {
        await new Promise(requestAnimationFrame)
        await Promise.all(e.getAnimations().map((a) => a.finished.catch(() => {})))
    })
    layoutEvidence.capability = await closeSamples(config, '.mf-dialog-close')
    stable(layoutEvidence.capability)
    await navigate('多级下拉选择')
    await trigger.click()
    await picker.getByRole('option', { name: '美妆个护', exact: true }).click()
    await picker.evaluate(async (e) => {
        await new Promise(requestAnimationFrame)
        await Promise.all(e.getAnimations().map((a) => a.finished.catch(() => {})))
    })
    layoutEvidence.cascader = await closeSamples(
        picker,
        '.mf-cascader-footer button:nth-last-child(2)',
    )
    stable(layoutEvidence.cascader)
    await navigate('Card 卡片')
    const normalCard = host.locator('.example-card').nth(1).locator('.mf-card')
    await normalCard.click({ position: { x: 15, y: 100 } })
    assert.equal(await host.evaluate((e) => e.result), '默认卡片已点击')
    await host.getByRole('button', { name: '卡片操作', exact: true }).click()
    assert.equal(await host.evaluate((e) => e.result), '独立卡片操作')
    await host.locator('.page-heading').click()
    assert.equal(
        await host.evaluate((e) => e.result),
        '独立卡片操作',
        'Card点击区域不得覆盖卡片外内容',
    )
    await navigate('Tab 切换容器')
    assert.equal(
        await host.locator('.mf-tab-list').evaluate((e) => e.scrollHeight <= e.clientHeight),
        true,
        '页签标题区不得出现竖向滚动',
    )
    assert.equal(
        await host
            .getByRole('tab', { name: '选品列表', exact: true })
            .evaluate((e) => getComputedStyle(e).userSelect),
        'none',
    )
    assert.notEqual(
        await host.locator('input[name=tab-note]').evaluate((e) => getComputedStyle(e).userSelect),
        'none',
    )
    await navigate('进度条')
    const fill = host.locator('.mf-progress-track > span').first()
    const initial = await fill.evaluate((e) => e.getBoundingClientRect().width)
    await host.evaluate((e) => {
        e.progress = 85
    })
    assert.ok(
        await fill.evaluate(async (e) => {
            await new Promise(requestAnimationFrame)
            return e.getAnimations().some((a) => a.transitionProperty === 'width')
        }),
    )
    await fill.evaluate(async (e) => {
        await Promise.all(e.getAnimations().map((a) => a.finished.catch(() => {})))
    })
    assert.ok((await fill.evaluate((e) => e.getBoundingClientRect().width)) > initial)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await host.evaluate((e) => {
        e.progress = 0
    })
    assert.equal(await fill.evaluate((e) => e.getAnimations().length), 0)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await writeFile(
        path.join(cache, 'components', 'layout-samples.json'),
        JSON.stringify(layoutEvidence, null, 2),
    )
    checks.push(
        '弹窗/能力配置/级联退出逐帧排版稳定；Card点击边界；Tab无竖滚动；操作文字禁选；进度平滑更新',
    )

    // 验收截图仅覆盖本轮桌面宿主，不把本地fixture当平台链路。
    for (const [name, filename] of [
        ['设置组合示例', 'settings'],
        ['运行区域组合', 'runtime'],
        ['多级下拉选择', 'cascader'],
        ['原子能力配置面板', 'config'],
        ['节点驾驶舱', 'cockpit'],
        ['支持平台横条', 'platforms'],
    ]) {
        await navigate(name)
        if (filename === 'cascader')
            await host.getByRole('combobox', { name: '类目', exact: true }).click()
        if (filename === 'config')
            await host.getByRole('button', { name: '数据筛选详细配置', exact: true }).click()
        await host.evaluate(async (element) => {
            await new Promise(requestAnimationFrame)
            const animations = [...element.shadowRoot.querySelectorAll('*')]
                .flatMap((node) => node.getAnimations())
                .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
            await Promise.all(
                [...new Set(animations)].map((animation) => animation.finished.catch(() => {})),
            )
        })
        await page.screenshot({
            path: path.join(cache, 'components', `${filename}.png`),
            fullPage: true,
        })
        await page.keyboard.press('Escape')
    }
    await page.setViewportSize({ width: 1180, height: 760 })
    await navigate('设置组合示例')
    await page.screenshot({
        path: path.join(cache, 'components', 'settings-short.png'),
        fullPage: true,
    })
    await navigate('运行区域组合')
    await page.screenshot({
        path: path.join(cache, 'components', 'runtime-short.png'),
        fullPage: true,
    })
    assert.deepEqual(errors, [])
    await writeFile(
        path.join(cache, 'components', 'summary.json'),
        JSON.stringify({ passed: true, checks, errors, fixtureOnly: true }, null, 2),
    )
    console.log(`PASS ${checks.length} 组组件交互：${checks.join('；')}`)
} finally {
    await browser?.close()
    await server.close()
}
