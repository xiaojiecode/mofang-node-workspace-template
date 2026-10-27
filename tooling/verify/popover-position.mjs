import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { root, cache } from '../paths.mjs'

// 同时覆盖实际阴影根与 slot 祖先滚动，独立页不影响用户的预览状态。
const fixture = `
import {LitElement,html,css} from 'lit'
import {panelStyles,selectField,cascaderField} from './lib/browser/index.ts'
class ScrollFrame extends LitElement {
 static styles=css\`:host{display:block;width:640px;max-width:90vw}.outer{height:360px;overflow:auto;border:1px solid #ccc;padding:16px}.spacer{height:50px}\`
 render(){return html\`<div class="outer"><div class="spacer"></div><slot></slot><div style="height:400px"></div></div>\`}
}
customElements.define('mf-scroll-frame',ScrollFrame)
class Fixture extends LitElement {
 static properties={error:{state:true}}
 constructor(){super();this.error='请选择有效平台'}
 static styles=[panelStyles,css\`:host{display:block;padding:30px}.inner{height:270px;overflow:auto;padding:0 24px;border:1px solid #ddd}.top{height:70px}.end{height:500px}\`]
 render(){return html\`<mf-scroll-frame><div class="inner"><div class="top"></div>\${selectField({name:'select',label:'单层测试',value:'a',hint:'选择一个可用平台',error:this.error,options:[{value:'a',label:'选项A'},{value:'b',label:'选项B'}],onChange:()=>{}})}<div style="height:28px"></div>\${cascaderField({name:'cascade',label:'级联测试',value:[],options:[{value:'a',label:'一级A',children:[{value:'b',label:'二级B'}]}],onChange:()=>{}})}<div class="end"></div></div></mf-scroll-frame>\`}
}
customElements.define('mf-position-fixture',Fixture)
document.body.append(document.createElement('mf-position-fixture'))
`
const built = await build({
    stdin: { contents: fixture, resolveDir: root, loader: 'ts' },
    bundle: true,
    write: false,
    format: 'esm',
    loader: { '.svg': 'dataurl' },
})
const browser = await chromium.launch({
    headless: true,
    ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
})
const checks = [],
    errors = [],
    samples = []
try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 800 } })
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setContent('<body style="margin:0"></body>')
    await page.evaluate(() => {
        const add = EventTarget.prototype.addEventListener,
            remove = EventTarget.prototype.removeEventListener
        window.anchorListeners = []
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'scroll' || type === 'resize') {
                const capture = typeof options === 'boolean' ? options : Boolean(options?.capture)
                if (
                    !window.anchorListeners.some(
                        (item) =>
                            item.target === this &&
                            item.type === type &&
                            item.listener === listener &&
                            item.capture === capture,
                    )
                )
                    window.anchorListeners.push({ target: this, type, listener, capture })
            }
            return add.call(this, type, listener, options)
        }
        EventTarget.prototype.removeEventListener = function (type, listener, options) {
            const capture = typeof options === 'boolean' ? options : Boolean(options?.capture)
            window.anchorListeners = window.anchorListeners.filter(
                (item) =>
                    !(
                        item.target === this &&
                        item.type === type &&
                        item.listener === listener &&
                        item.capture === capture
                    ),
            )
            return remove.call(this, type, listener, options)
        }
    })
    await page.addScriptTag({ type: 'module', content: built.outputFiles[0].text })
    const fixtureHost = page.locator('mf-position-fixture'),
        inner = fixtureHost.locator('.inner'),
        outer = fixtureHost.locator('mf-scroll-frame').locator('.outer')
    const settle = async () =>
        page.evaluate(
            () =>
                new Promise((resolve) =>
                    requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
        )
    const snap = async (trigger, menu) => {
        const t = await trigger.boundingBox(),
            m = await menu.boundingBox()
        return {
            trigger: t,
            menu: m,
            gap:
                Math.abs(m.y - t.y - t.height) < Math.abs(t.y - m.y - m.height)
                    ? m.y - t.y - t.height
                    : t.y - m.y - m.height,
        }
    }
    const errorTrigger = fixtureHost.getByRole('combobox', { name: '单层测试', exact: true })
    const errorMessage = fixtureHost.getByRole('alert')
    assert.equal(await errorMessage.innerText(), '请选择有效平台')
    assert.equal(await errorTrigger.getAttribute('aria-invalid'), 'true')
    const described = await errorTrigger.getAttribute('aria-describedby')
    const errorId = await errorMessage.getAttribute('id')
    assert.ok(described.includes(errorId) && described.includes('-hint'))
    await fixtureHost.evaluate((element) => {
        element.error = undefined
    })
    await settle()
    assert.equal(await fixtureHost.getByRole('alert').count(), 0)
    assert.equal(await errorTrigger.getAttribute('aria-invalid'), null)
    assert.equal(
        await errorTrigger.getAttribute('aria-describedby'),
        described
            .split(' ')
            .filter((id) => id !== errorId)
            .join(' '),
    )
    checks.push('selectField 错误显示/清除，稳定错误ID、aria-invalid 与提示/错误组合描述')
    for (const [label, menuSelector, gap] of [
        ['单层测试', '.mf-select-menu', 4],
        ['级联测试', '.mf-cascader-panel', 6],
    ]) {
        await inner.evaluate((element) => {
            element.scrollTop = 0
        })
        await outer.evaluate((element) => {
            element.scrollTop = 0
        })
        await page.setViewportSize({ width: 1100, height: 800 })
        const trigger = fixtureHost.getByRole('combobox', { name: label, exact: true }),
            menu = fixtureHost.locator(menuSelector)
        const arrow = trigger.locator(':scope > svg')
        // 直接采样真实 CSS Transition 的中点，避免并行构建抢占导致墙钟等待跨过整个动画。
        const middleAngle = await trigger.evaluate(async (element) => {
            element.click()
            await new Promise((resolve) => requestAnimationFrame(resolve))
            const icon = element.querySelector(':scope > svg')
            const animation = icon.getAnimations()[0]
            if (!animation) return -1
            animation.pause()
            animation.currentTime = 75
            const m = new DOMMatrix(getComputedStyle(icon).transform)
            const angle = Math.abs((Math.atan2(m.b, m.a) * 180) / Math.PI)
            animation.finish()
            return angle
        })
        assert.ok(middleAngle > 0 && middleAngle < 180, `${label} 箭头有旋转中间态`)
        await menu.waitFor({ state: 'visible' })
        await page.waitForTimeout(180)
        const openAngle = await arrow.evaluate((element) => {
            const m = new DOMMatrix(getComputedStyle(element).transform)
            return Math.abs((Math.atan2(m.b, m.a) * 180) / Math.PI)
        })
        assert.ok(Math.abs(openAngle - 180) < 0.1)
        const before = await snap(trigger, menu)
        await inner.evaluate((element) => {
            element.scrollTop += 18
        })
        await settle()
        const afterInner = await snap(trigger, menu)
        samples.push({ label, before, afterInner })
        assert.ok(
            Math.abs(afterInner.gap - gap) < 1,
            `${label} 内层滚动后间距应为 ${gap}px，实际 ${afterInner.gap}`,
        )
        assert.ok(
            Math.abs(
                afterInner.menu.y - before.menu.y - (afterInner.trigger.y - before.trigger.y),
            ) < 1,
            `${label} 内层菜单与输入同步移动`,
        )
        await outer.evaluate((element) => {
            element.scrollTop += 12
        })
        await settle()
        const afterOuter = await snap(trigger, menu)
        assert.ok(
            Math.abs(afterOuter.gap - gap) < 1,
            `${label} slot 祖先滚动后间距应为 ${gap}px，实际 ${afterOuter.gap}`,
        )
        assert.equal(await trigger.getAttribute('aria-expanded'), 'true')
        assert.equal(await menu.evaluate((element) => element.getAnimations().length), 0)
        assert.equal(await arrow.evaluate((element) => element.getAnimations().length), 0)
        if (label === '级联测试')
            assert.equal(
                await menu
                    .locator('input')
                    .evaluate((element) => element === element.getRootNode().activeElement),
                true,
            )
        await page.setViewportSize({ width: 520, height: 420 })
        await settle()
        const resized = await snap(trigger, menu)
        assert.ok(
            resized.menu.x >= 7 && resized.menu.x + resized.menu.width <= 521,
            `${label} 缩放后横向位于视口内`,
        )
        assert.ok(
            resized.menu.y >= 7 && resized.menu.y + resized.menu.height <= 421,
            `${label} 缩放后竖向位于视口内`,
        )
        await page.keyboard.press('Escape')
        await settle()
        assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
        assert.equal(
            await page.evaluate(() => window.anchorListeners.length),
            0,
            `${label} 关闭释放全部定位监听`,
        )
        await page.setViewportSize({ width: 1100, height: 800 })
        await inner.evaluate((element) => {
            element.scrollTop = 0
        })
        await outer.evaluate((element) => {
            element.scrollTop = 0
        })
        await trigger.click()
        await settle()
        assert.ok((await page.evaluate(() => window.anchorListeners.length)) > 0)
        await fixtureHost.evaluate((element) => {
            window.detachedFixture = element
            element.remove()
        })
        await settle()
        assert.equal(
            await page.evaluate(() => window.anchorListeners.length),
            0,
            `${label} 卸载释放定位监听`,
        )
        await page.evaluate(() => document.body.append(window.detachedFixture))
        await settle()
        await trigger.click()
        await settle()
        assert.equal(await trigger.getAttribute('aria-expanded'), 'true')
        await page.keyboard.press('Escape')
        await settle()
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await trigger.click()
        await settle()
        assert.equal(await arrow.evaluate((element) => element.getAnimations().length), 0)
        assert.ok(
            Math.abs(
                (await arrow.evaluate((element) => {
                    const m = new DOMMatrix(getComputedStyle(element).transform)
                    return Math.abs((Math.atan2(m.b, m.a) * 180) / Math.PI)
                })) - 180,
            ) < 0.1,
        )
        await page.keyboard.press('Escape')
        await settle()
        assert.ok(
            Math.abs(
                await arrow.evaluate((element) => {
                    const m = new DOMMatrix(getComputedStyle(element).transform)
                    return (Math.atan2(m.b, m.a) * 180) / Math.PI
                }),
            ) < 0.1,
        )
        await page.emulateMedia({ reducedMotion: 'no-preference' })
        await trigger.evaluate((element) => {
            element.click()
            queueMicrotask(() => element.click())
        })
        await page.waitForTimeout(180)
        assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
        assert.equal(await menu.evaluate((element) => element.matches(':popover-open')), false)
        assert.equal(await page.evaluate(() => window.anchorListeners.length), 0)
        checks.push(
            `${label}：阴影根内部/slot祖先滚动、视口resize、焦点、滚动不重播、关闭/卸载释放、重连重开、箭头中间态/快速反向/减少动态效果`,
        )
    }
    assert.deepEqual(errors, [])
    const output = path.join(cache, 'popover-position')
    await mkdir(output, { recursive: true })
    await writeFile(
        path.join(output, 'summary.json'),
        JSON.stringify({ passed: true, checks, samples, errors }, null, 2),
    )
    await page.screenshot({ path: path.join(output, 'fixture.png') })
    console.log('PASS ' + checks.join('；'))
} finally {
    await browser.close()
}
