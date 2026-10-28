import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { root, cache } from '../paths.mjs'
import { ensureUpstream } from '../upstream/index.mjs'

await ensureUpstream()
const output = path.join(cache, 'dropdown-button')
await mkdir(output, { recursive: true })
const server = await createServer({
    configFile: path.join(root, 'playground/components/vite.config.mjs'),
    server: { port: 0, strictPort: false },
})
let browser
const checks = [],
    errors = []
try {
    await server.listen()
    browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    const page = await browser.newPage({ viewport: { width: 1280, height: 850 } })
    page.setDefaultTimeout(10000)
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(server.resolvedUrls.local[0] + '?component=dropdown-button')
    const demo = page.locator('mf-dropdown-button-examples')
    const trigger = demo.getByRole('button', { name: '批量操作', exact: true })
    const menu = demo.getByRole('menu', { name: '批量操作', exact: true })
    await trigger.waitFor()
    assert.equal(await trigger.getAttribute('aria-haspopup'), 'menu')
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
    await trigger.focus()
    await page.keyboard.press('ArrowDown')
    await menu.waitFor()
    const first = menu.getByRole('menuitem', { name: '批量绑定店铺', exact: true })
    const last = menu.getByRole('menuitem', { name: '批量发布', exact: true })
    assert.equal(
        await first.evaluate((element) => element.getRootNode().activeElement === element),
        true,
    )
    await page.keyboard.press('ArrowDown')
    assert.equal(
        await last.evaluate((element) => element.getRootNode().activeElement === element),
        true,
    )
    await page.keyboard.press('Home')
    assert.equal(
        await first.evaluate((element) => element.getRootNode().activeElement === element),
        true,
    )
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await demo.getByRole('status').getByText('批量发布', { exact: true }).waitFor()
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
    assert.equal(
        await trigger.evaluate((element) => element.getRootNode().activeElement === element),
        true,
    )
    checks.push('方向键跳过禁用项；Home/End 定位；Enter 选择、关闭并恢复焦点')
    await trigger.click()
    await menu.waitFor()
    const disabled = menu.getByRole('menuitem', { name: '批量定价', exact: true })
    assert.equal(await disabled.isDisabled(), true)
    assert.equal(await disabled.getAttribute('title'), '请先选择可定价商品')
    await page.keyboard.press('Escape')
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
    await trigger.click()
    await page.mouse.click(1200, 800)
    await menu.waitFor({ state: 'hidden' })
    await trigger.focus()
    await page.keyboard.press('Space')
    await menu.waitFor()
    await page.keyboard.press('Tab')
    await menu.waitFor({ state: 'hidden' })
    checks.push('Escape、空格、Tab 和外部点击关闭；禁用项无回调')
    await trigger.click()
    await menu.waitFor()
    await demo.evaluate((element) => {
        element.locked = true
    })
    await menu.waitFor({ state: 'hidden' })
    assert.equal(await trigger.isDisabled(), true)
    assert.equal(
        await demo.getByRole('button', { name: '只读操作', exact: true }).isDisabled(),
        true,
    )
    await demo.getByRole('button', { name: '启用动作菜单', exact: true }).click()
    await page.setViewportSize({ width: 720, height: 480 })
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    await menu.waitFor()
    const bounds = await menu.boundingBox()
    assert.ok(
        bounds &&
            bounds.x >= 0 &&
            bounds.y >= 0 &&
            bounds.x + bounds.width <= 720 &&
            bounds.y + bounds.height <= 480,
    )
    await page.screenshot({ path: path.join(output, 'dropdown-720x480.png') })
    checks.push('只读切换立即关闭并禁用；720×480 视口浮层完整可达')
    assert.deepEqual(errors, [])
    await writeFile(
        path.join(output, 'verification.json'),
        JSON.stringify({ checks, errors }, null, 4),
    )
    console.log('动作下拉按钮键盘、焦点、外点、禁用和视口定位验证通过')
} finally {
    await browser?.close()
    await server.close()
}
