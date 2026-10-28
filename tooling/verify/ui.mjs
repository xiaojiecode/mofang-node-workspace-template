import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { bundle } from '../build/bundle.mjs'
import { cache, root } from '../paths.mjs'
import { ensureUpstream } from '../upstream/index.mjs'

await ensureUpstream()
const directory = path.join(cache, 'ui')
await mkdir(directory, { recursive: true })
const runtime = await build({
    stdin: { contents: "export * from 'lit'", resolveDir: root },
    conditions: ['production'],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    minify: true,
})
const lit =
    'data:text/javascript;base64,' + Buffer.from(runtime.outputFiles[0].text).toString('base64')
const browser = await chromium.launch({
    headless: true,
    ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
})
try {
    for (const minify of [false, true]) {
        const result = await bundle(path.join(root, 'tests/fixtures/ui-preview.ts'), 'panel', {
            minify,
        })
        const file = path.join(directory, minify ? 'preview.html' : 'preview-readable.html')
        await writeFile(
            file,
            `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>基础组件总览</title><style>body{margin:0;padding:32px;background:#f4f6f9;--background:#f4f6f9}@media(max-width:650px){body{padding:12px}}</style><body><mf-ui-preview></mf-ui-preview><script type="importmap">${JSON.stringify({ imports: { lit } })}</script><script type="module">${result.code}</script></body></html>`,
        )
        const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.goto(pathToFileURL(file).href)
        const host = page.locator('mf-ui-preview')
        await host.locator('input[name=name]').waitFor()
        assert.equal(
            await host.evaluate((e) => getComputedStyle(e).backgroundColor),
            'rgb(255, 255, 255)',
            '宿主背景为灰时，组件仍默认白底',
        )
        assert.equal(await host.locator('#unsafe-url a').count(), 0)
        assert.equal(
            await host.getByRole('link', { name: '查看来源链接' }).getAttribute('rel'),
            'noopener noreferrer',
        )

        const select = host.getByRole('combobox', { name: '分类', exact: true })
        const menu = host.getByRole('listbox', { name: '分类', exact: true })
        await select.click()
        await menu.waitFor()
        assert.equal(await menu.evaluate((e) => e.matches(':popover-open')), true)
        await host.getByRole('option', { name: '家居', exact: true }).click()
        assert.equal(await host.evaluate((e) => e.category), 'home')
        await menu.waitFor({ state: 'hidden' })
        await select.press('Home')
        await select.press('ArrowDown')
        await select.press('Enter')
        assert.equal(await host.evaluate((e) => e.category), 'home', '方向键跳过禁用选项')
        await select.press('End')
        await select.press('Enter')
        assert.equal(await host.evaluate((e) => e.category), 'outdoor')
        await select.press('Home')
        await select.press('Enter')
        assert.equal(await host.evaluate((e) => e.category), '', '空选项保持删除字段语义')
        await select.click()
        await select.press('Escape')
        await menu.waitFor({ state: 'hidden' })
        assert.equal(await select.getAttribute('aria-expanded'), 'false')
        await select.click()
        await menu.waitFor()
        await host.locator('input[name=name]').click()
        await menu.waitFor({ state: 'hidden' })
        await select.click()
        await menu.waitFor()
        await select.click()
        await menu.waitFor({ state: 'hidden' })
        await select.click()
        await menu.waitFor()
        await host.evaluate((e) => {
            e.remove()
            document.body.append(e)
        })
        await menu.waitFor({ state: 'hidden' })
        await select.click()
        await menu.waitFor()
        await page.screenshot({
            path: path.join(directory, minify ? 'select.png' : 'select-readable.png'),
        })
        await select.press('Tab')
        await menu.waitFor({ state: 'hidden' })
        assert.deepEqual(
            await host.evaluate((e) => {
                const root = e.shadowRoot
                return {
                    cardRadius: getComputedStyle(root.querySelector('.mf-card')).borderRadius,
                    inputRadius: getComputedStyle(root.querySelector('.mf-input')).borderRadius,
                    buttonColor: getComputedStyle(root.querySelector('[data-variant="primary"]'))
                        .backgroundColor,
                    tabHeight: getComputedStyle(root.querySelector('.mf-tab-list')).height,
                }
            }),
            {
                cardRadius: '14px',
                inputRadius: '8px',
                buttonColor: 'rgb(52, 50, 45)',
                tabHeight: '36px',
            },
        )

        const primaryButton = host.getByRole('button', { name: '主要操作', exact: true })
        await primaryButton.hover()
        assert.equal(
            await primaryButton.evaluate((e) => getComputedStyle(e).backgroundColor),
            'rgb(47, 44, 41)',
            '主要按钮悬停与客户端黑白按钮一致',
        )
        assert.equal(
            await primaryButton.evaluate((e) => getComputedStyle(e).color),
            'rgb(255, 255, 255)',
        )
        await primaryButton.evaluate((e) => {
            e.disabled = true
        })
        assert.deepEqual(
            await primaryButton.evaluate((e) => ({
                background: getComputedStyle(e).backgroundColor,
                color: getComputedStyle(e).color,
                opacity: getComputedStyle(e).opacity,
            })),
            { background: 'rgb(52, 50, 45)', color: 'rgb(255, 255, 255)', opacity: '0.5' },
        )
        await primaryButton.evaluate((e) => {
            e.disabled = false
        })
        await page.keyboard.press('Tab')
        for (const field of [
            host.locator('input[name=name]'),
            host.locator('input[name=amount]'),
            host.locator('textarea[name=note]'),
            host.locator('.mf-page-jump input'),
            primaryButton,
        ]) {
            await field.focus()
            const focus = await field.evaluate((e) => ({
                visible: e.matches(':focus-visible'),
                shadow: getComputedStyle(e).boxShadow,
            }))
            assert.equal(focus.visible, true)
            assert.ok(focus.shadow.includes('0px 0px 0px 3px'), '键盘焦点必须有可见的 3px 焦点环')
        }

        await host.locator('input[name=name]').fill('保留的草稿')
        assert.equal(await host.evaluate((e) => e.name), '保留的草稿')
        await host.locator('textarea[name=note]').fill('多行\n备注')
        assert.equal(await host.evaluate((e) => e.note), '多行\n备注')
        await host.locator('input[name=amount]').fill('8')
        assert.equal(await host.evaluate((e) => e.amount), 8)
        await host.locator('input[name=amount]').fill('101')
        assert.equal(await host.evaluate((e) => e.amount), 8, '无效数字不写入草稿')
        assert.equal(await host.locator('input[name=amount]').getAttribute('aria-invalid'), 'true')
        await host.locator('input[name=amount]').fill('')
        assert.equal(await host.evaluate((e) => e.amount), undefined)
        assert.equal(await host.locator('input[name=readonly]').isDisabled(), true)
        assert.ok(await host.locator('input[name=error]').getAttribute('aria-describedby'))
        await page.mouse.move(0, 0)
        await primaryButton.focus()
        await page.keyboard.down(' ')
        assert.equal(
            await primaryButton.evaluate((e) => getComputedStyle(e).backgroundColor),
            'rgb(47, 44, 41)',
            '键盘按下主要按钮仍保持深色背景和白字',
        )
        await page.keyboard.up(' ')
        assert.equal(await host.evaluate((e) => e.clickCount), 1)
        await host.getByRole('button', { name: '主要操作', exact: true }).click()
        assert.equal(await host.evaluate((e) => e.clickCount), 2)
        for (const name of ['处理中', '不可操作']) {
            const control = host.getByRole('button', { name, exact: true })
            assert.equal(await control.isDisabled(), true)
            await control.evaluate((e) =>
                e.dispatchEvent(new MouseEvent('click', { bubbles: true })),
            )
        }
        assert.equal(await host.evaluate((e) => e.clickCount), 2)

        const first = host.getByRole('tab', { name: '商品摘要', exact: true })
        await host.getByLabel('页签保留输入').fill('切换后保留')
        await first.focus()
        await page.keyboard.press('ArrowRight')
        assert.equal(await host.evaluate((e) => e.active), 'json')
        await host.getByLabel('页签保留输入').waitFor({ state: 'hidden' })
        assert.equal(await host.getByLabel('页签保留输入').isVisible(), false)
        await page.keyboard.press('End')
        assert.equal(await host.evaluate((e) => e.active), 'json', '跳过禁用页签')
        await page.keyboard.press('Home')
        assert.equal(await host.getByLabel('页签保留输入').inputValue(), '切换后保留')

        // 页签只在切换时淡入；普通内容刷新沿用正在播放的动画。
        assert.equal(
            await host.evaluate(async (e) => {
                e.shadowRoot
                    .querySelector('[role="tab"][aria-selected="false"]:not(:disabled)')
                    .click()
                await e.updateComplete
                await Promise.resolve()
                const active = e.shadowRoot.querySelector(
                    '.mf-tab-panel:not([hidden]) .mf-transition',
                )
                const animation = active.getAnimations()[0]
                if (!animation) return false
                animation.pause()
                e.requestUpdate()
                await e.updateComplete
                const same = active.getAnimations()[0] === animation
                animation.finish()
                return same
            }),
            true,
            '页签刷新不重启动画',
        )

        const details = host.locator('.mf-section-collapse').filter({ hasText: '展开详情' })
        const summary = details.locator('summary')
        await summary.evaluate((e) => e.click())
        assert.equal(await summary.getAttribute('aria-expanded'), 'true')
        assert.equal(
            await details.locator('.mf-transition').evaluate((e) => {
                const animation = e.getAnimations()[0]
                if (!animation) return false
                const changesHeight = animation.effect.getKeyframes().some((frame) => frame.height)
                animation.finish()
                return changesHeight
            }),
            true,
            '折叠区使用高度过渡',
        )
        await host.getByLabel('折叠区保留输入').fill('关闭后保留')
        await summary.evaluate((e) => e.click())
        await details.locator('.mf-transition').waitFor({ state: 'hidden' })
        assert.equal(await details.evaluate((e) => e.open), false)
        await summary.focus()
        await summary.press('Enter')
        assert.equal(await host.getByLabel('折叠区保留输入').inputValue(), '关闭后保留')
        await summary.evaluate((e) => {
            e.click()
            e.click()
        })
        await host.getByLabel('折叠区保留输入').waitFor()

        const thumb = host.locator('#preview-image > .mf-image')
        await page.waitForFunction(
            () =>
                document
                    .querySelector('mf-ui-preview')
                    .shadowRoot.querySelector('#preview-image .mf-image').dataset.state === 'ready',
        )
        await page.waitForFunction(
            () =>
                document
                    .querySelector('mf-ui-preview')
                    .shadowRoot.querySelector('#failed-image .mf-image').dataset.state === 'error',
        )
        const trigger = host.locator('#preview-image .mf-image-trigger')
        await trigger.click()
        const dialog = host.getByRole('dialog', { name: '图片查看' })
        await dialog.waitFor()
        assert.equal(await dialog.evaluate((e) => e.matches(':modal')), true)
        assert.equal(
            await dialog.locator(':scope > .mf-transition').evaluate((e) => {
                const animation = e.getAnimations()[0]
                if (!animation) return false
                animation.finish()
                return true
            }),
            true,
            '图片查看器使用缩放过渡',
        )
        await dialog.getByRole('button', { name: '下一张', exact: true }).click()
        assert.ok((await dialog.innerText()).includes('2 / 2'))
        await dialog.getByRole('button', { name: '放大', exact: true }).click()
        assert.ok((await dialog.innerText()).includes('150%'))
        await dialog.getByRole('button', { name: '适应窗口', exact: true }).click()
        assert.ok((await dialog.innerText()).includes('100%'))
        await page.keyboard.press('ArrowLeft')
        assert.ok((await dialog.innerText()).includes('1 / 2'))
        await page.keyboard.press('Escape')
        await dialog.waitFor({ state: 'detached' })
        assert.equal(
            await trigger.evaluate((e) => e.matches(':focus')),
            true,
            '关闭后焦点返回原缩略图',
        )
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await trigger.click()
        await dialog.waitFor()
        assert.equal(await dialog.locator('.mf-transition').getAttribute('data-animating'), null)
        await page.keyboard.press('Escape')
        await dialog.waitFor({ state: 'hidden' })
        await page.emulateMedia({ reducedMotion: 'no-preference' })

        // 新图片生效后，旧请求即使晚到也不能覆盖加载状态。
        const original = await host.evaluate((e) => e.src)
        let release
        const gate = new Promise((resolve) => {
            release = resolve
        })
        await page.route('https://images.example.test/slow.svg', async (route) => {
            await gate
            await route.fulfill({ status: 404, body: 'missing' })
        })
        await host.evaluate(async (e) => {
            e.src = 'https://images.example.test/slow.svg'
            await e.updateComplete
        })
        assert.equal(await thumb.getAttribute('data-state'), 'loading')
        assert.equal(await thumb.locator('.mf-skeleton').count(), 1)
        await host.evaluate(async (e, src) => {
            e.src = src
            await e.updateComplete
        }, original)
        release()
        await page.waitForFunction(
            () =>
                document
                    .querySelector('mf-ui-preview')
                    .shadowRoot.querySelector('#preview-image .mf-image').dataset.state === 'ready',
        )
        await trigger.click()
        await dialog.waitFor()
        await host.evaluate((e) => {
            e.remove()
            document.body.append(e)
        })
        await dialog.waitFor({ state: 'detached' })

        const table = host.getByRole('table', { name: '组件示例商品' })
        const choices = table.getByRole('checkbox', { name: '选择此行', exact: true })
        await choices.first().check()
        assert.equal(
            await table
                .getByRole('checkbox', { name: '选择本页可选行' })
                .evaluate((e) => e.indeterminate),
            true,
        )
        await table.getByRole('checkbox', { name: '选择本页可选行' }).check()
        assert.deepEqual(await host.evaluate((e) => [...e.selected]), ['1', '2'])
        assert.equal(
            await table.getByRole('checkbox', { name: '不可选择：已输出' }).isDisabled(),
            true,
        )
        await host.getByRole('button', { name: '下一页', exact: true }).click()
        assert.equal(await host.evaluate((e) => e.page), 2)
        assert.ok((await table.innerText()).includes('示例商品 4'))
        await host.getByRole('button', { name: '上一页', exact: true }).click()
        assert.equal(await choices.first().isChecked(), true, '分页后保留选择')
        await host.getByRole('button', { name: '查看加载态' }).click()
        assert.equal(await table.locator('tbody .mf-skeleton').count(), 12)
        assert.equal(await table.locator('tbody input').count(), 0)
        await host.getByRole('button', { name: '显示数据' }).click()
        await host.getByRole('button', { name: '展开过渡示例' }).click()
        await host.locator('.demo-reveal').waitFor()
        await host.getByRole('button', { name: '收起过渡示例' }).click()
        await host.locator('.demo-reveal').waitFor({ state: 'hidden' })

        await page.screenshot({
            path: path.join(directory, minify ? 'preview.png' : 'preview-readable.png'),
            fullPage: true,
        })
        await page.setViewportSize({ width: 390, height: 844 })
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
            '窄屏不横向溢出',
        )
        await trigger.click()
        await dialog.waitFor()
        await page.waitForFunction(() => {
            const transition = document
                .querySelector('mf-ui-preview')
                .shadowRoot.querySelector('dialog[open] > .mf-transition')
            return (
                transition &&
                !transition.hidden &&
                !transition.hasAttribute('data-animating') &&
                getComputedStyle(transition).opacity === '1'
            )
        })
        const box = await dialog.boundingBox()
        assert.ok(box.width <= 390 && box.height <= 844)
        assert.ok(
            box.x >= 0 && box.y >= 0 && box.x + box.width <= 390 && box.y + box.height <= 844,
            '图片查看器完整位于当前视口内',
        )
        await page.screenshot({
            path: path.join(directory, minify ? 'viewer-narrow.png' : 'viewer-readable-narrow.png'),
        })
        await page.keyboard.press('Escape')
        assert.deepEqual(errors, [])
        await page.close()
        console.log(
            `PASS ${minify ? '压缩' : '可读'}组件：客户端样式、下拉选择/键盘/卸载、白底、链接、输入回写及校验、按钮状态、页签键盘/保留内容、图片加载/切换/缩放/焦点/卸载、表格勾选/分页/加载、过渡与窄屏`,
        )
    }
} finally {
    await browser.close()
}
