import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root } from '../paths.mjs'

/** 单一外部结果区必须保持真实 DOM、受控页签关系和可取消的轻量动效。 */
test('页签关联外部单结果区，首挂刷新不重播，快速切换与卸载恢复资源', async () => {
    const source = await build({
        stdin: {
            resolveDir: root,
            contents: `import {LitElement,html,nothing} from 'lit';
                import {keyed} from 'lit/directives/keyed.js';
                import {tabs,panelStyles} from './lib/browser/ui/index';
                class ExternalPreview extends LitElement {
                    static properties={active:{state:true},tick:{state:true},present:{state:true},target:{state:true},duration:{state:true},version:{state:true},showTabs:{state:true},external:{state:true}};
                    static styles=panelStyles;
                    constructor(){super();this.active='a';this.tick=0;this.present=true;this.target='result';this.duration=160;this.version=0;this.showTabs=true;this.external=true;this.calls=[];}
                    render(){return html\`<p id="original-label">原始区域名</p>\${this.showTabs?tabs({id:'external',label:'外部结果页签',value:this.active,contentId:this.external?this.target:undefined,motionDuration:this.duration,onChange:value=>{this.calls.push(value);this.active=value},items:[{value:'a',label:'列表A',content:html\`<input aria-label="内部草稿A"><span class="copy">内部A</span>\`},{value:'disabled',label:'禁用页',disabled:true,content:html\`<span class="copy">禁用</span>\`},{value:'b',label:'列表B',content:html\`<span class="copy">内部B</span>\`}]}):nothing}\${this.present?keyed(this.version,html\`<section id="result" role="region" aria-labelledby="original-label" tabindex="0"><input aria-label="外部草稿"><p>\${this.active} / \${this.tick}</p></section>\`):nothing}<section id="other" role="group" aria-label="其它结果"><button>结果操作</button></section>\`}
                }customElements.define('tabs-external-preview',ExternalPreview);`,
        },
        bundle: true,
        write: false,
        format: 'iife',
        platform: 'browser',
        loader: { '.svg': 'text' },
    })
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    try {
        const page = await browser.newPage({ viewport: { width: 960, height: 640 } })
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.setContent('<!doctype html><tabs-external-preview></tabs-external-preview>')
        await page.addScriptTag({ content: source.outputFiles[0].text })
        const host = page.locator('tabs-external-preview')
        const result = host.locator('#result')
        const tabA = host.getByRole('tab', { name: '列表A', exact: true })
        const tabB = host.getByRole('tab', { name: '列表B', exact: true })
        const update = (values) =>
            host.evaluate(async (element, values) => {
                Object.assign(element, values)
                await element.updateComplete
                await Promise.resolve()
            }, values)
        const finish = () =>
            result.evaluate((element) =>
                element.getAnimations().forEach((animation) => animation.finish()),
            )
        const media = async (reducedMotion) => {
            await page.emulateMedia({ reducedMotion })
            await page.evaluate(
                () =>
                    new Promise((resolve) =>
                        requestAnimationFrame(() => requestAnimationFrame(resolve)),
                    ),
            )
        }
        await result.waitFor()
        assert.equal(await result.getAttribute('role'), 'tabpanel')
        assert.equal(await result.getAttribute('aria-labelledby'), await tabA.getAttribute('id'))
        assert.equal(await tabA.getAttribute('aria-controls'), 'result')
        assert.equal(await tabB.getAttribute('aria-controls'), 'result')
        assert.equal(await host.locator('.mf-tab-panel').count(), 0, '外部模式不复制内部panel')
        assert.equal(await host.locator('.copy').count(), 0, 'items.content未重复渲染')
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '首挂无动画',
        )
        await host.getByRole('textbox', { name: '外部草稿', exact: true }).fill('保留输入')
        await result.evaluate((element) => {
            window.savedResult = element
            window.savedInput = element.querySelector('input')
        })
        await update({ tick: 1 })
        assert.equal(await result.evaluate((element) => element === window.savedResult), true)
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '普通刷新无动画',
        )
        await tabA.focus()
        await tabA.press('ArrowRight')
        assert.equal(await host.evaluate((element) => element.active), 'b', '方向键跳过禁用页')
        assert.equal(
            await tabB.evaluate((element) => element.getRootNode().activeElement === element),
            true,
        )
        const middle = await result.evaluate((element) => {
            const [animation] = element.getAnimations()
            animation.pause()
            animation.currentTime = 80
            window.savedExternalAnimation = animation
            return {
                count: element.getAnimations().length,
                duration: animation.effect.getTiming().duration,
                opacity: Number(getComputedStyle(element).opacity),
                transform: getComputedStyle(element).transform,
            }
        })
        assert.equal(middle.count, 1)
        assert.equal(middle.duration, 160)
        assert.ok(middle.opacity > 0 && middle.opacity < 1, '外部结果区具有真实中间帧')
        assert.notEqual(middle.transform, 'none')
        await update({ tick: 2 })
        assert.equal(
            await result.evaluate(
                (element) => element.getAnimations()[0] === window.savedExternalAnimation,
            ),
            true,
            '刷新不重播当前动效',
        )
        await update({ active: 'a' })
        const reversed = await result.evaluate((element) => ({
            count: element.getAnimations().length,
            previous: window.savedExternalAnimation.playState,
            from: element.getAnimations()[0].effect.getKeyframes()[0].opacity,
        }))
        assert.equal(reversed.count, 1)
        assert.equal(reversed.previous, 'idle', '反向切换取消旧动画')
        assert.ok(Number(reversed.from) > 0 && Number(reversed.from) < 1, '反向从当前帧继续')
        await finish()
        assert.equal(
            await host.getByRole('textbox', { name: '外部草稿', exact: true }).inputValue(),
            '保留输入',
        )
        assert.equal(
            await result.evaluate(
                (element) => element.querySelector('input') === window.savedInput,
            ),
            true,
        )
        await tabA.press('End')
        assert.equal(await host.evaluate((element) => element.active), 'b')
        await tabB.press('Home')
        assert.equal(await host.evaluate((element) => element.active), 'a')
        assert.equal(
            await host.getByRole('tab', { name: '禁用页', exact: true }).isDisabled(),
            true,
        )
        await media('reduce')
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '动态减少效果取消当前动画',
        )
        await update({ active: 'b' })
        assert.equal(await result.evaluate((element) => element.getAnimations().length), 0)
        assert.equal(await result.getAttribute('aria-labelledby'), await tabB.getAttribute('id'))
        await media('no-preference')
        await update({ duration: 0, active: 'a' })
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '显式0立即切换',
        )
        await update({ duration: 160, active: 'b' })
        await update({ target: 'other' })
        assert.equal(await result.getAttribute('role'), 'region', '换目标恢复原role')
        assert.equal(await result.getAttribute('aria-labelledby'), 'original-label')
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '换目标取消旧目标动画',
        )
        assert.equal(await host.locator('#other').getAttribute('role'), 'tabpanel')
        assert.equal(
            await host.locator('#other').getAttribute('aria-labelledby'),
            await tabB.getAttribute('id'),
        )
        assert.equal(
            await host.locator('#other').evaluate((element) => element.getAnimations().length),
            0,
            '新目标首次绑定不动画',
        )
        await update({ target: 'result' })
        await update({ active: 'a', present: false })
        assert.deepEqual(
            await page.evaluate(() => ({
                role: window.savedResult.getAttribute('role'),
                label: window.savedResult.getAttribute('aria-labelledby'),
                count: window.savedResult.getAnimations().length,
            })),
            { role: 'region', label: 'original-label', count: 0 },
            '目标独立卸载时释放旧关联',
        )
        await update({ present: true })
        assert.equal(await result.getAttribute('role'), 'tabpanel')
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '目标再次出现按首挂处理',
        )
        await result.evaluate((element) => {
            window.oldResult = element
        })
        await update({ version: 1, active: 'a' })
        assert.equal(await result.evaluate((element) => element !== window.oldResult), true)
        assert.equal(await result.getAttribute('role'), 'tabpanel')
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '同ID换DOM按首挂处理',
        )
        assert.deepEqual(
            await page.evaluate(() => ({
                role: window.oldResult.getAttribute('role'),
                label: window.oldResult.getAttribute('aria-labelledby'),
                count: window.oldResult.getAnimations().length,
            })),
            { role: 'region', label: 'original-label', count: 0 },
        )
        await update({ active: 'b' })
        await host.evaluate(async (element) => {
            window.detachedResult = element.shadowRoot.getElementById('result')
            element.remove()
            await Promise.resolve()
        })
        assert.deepEqual(
            await page.evaluate(() => ({
                role: window.detachedResult.getAttribute('role'),
                label: window.detachedResult.getAttribute('aria-labelledby'),
                count: window.detachedResult.getAnimations().length,
            })),
            { role: 'region', label: 'original-label', count: 0 },
            '卸载恢复ARIA并取消动画',
        )
        await page.evaluate(() => document.body.append(window.detachedResult.getRootNode().host))
        await result.waitFor()
        assert.equal(await result.getAttribute('role'), 'tabpanel')
        assert.equal(
            await result.evaluate((element) => element.getAnimations().length),
            0,
            '重挂不重播',
        )
        await update({ showTabs: false })
        assert.equal(await result.getAttribute('role'), 'region', '仅卸载页签也释放外部目标')
        assert.equal(await result.getAttribute('aria-labelledby'), 'original-label')
        await update({ showTabs: true })
        await result.evaluate((element) => element.setAttribute('role', 'complementary'))
        await update({ showTabs: false })
        assert.equal(
            await result.getAttribute('role'),
            'complementary',
            '释放关联保留调用方之后接管的属性',
        )
        await result.evaluate((element) => element.setAttribute('role', 'region'))
        await update({ showTabs: true, external: false })
        assert.equal(await host.locator('.mf-tab-panel').count(), 3, '旧模式保留内部panel')
        assert.equal(await result.getAttribute('role'), 'region', '旧模式不接管外部区域')
        assert.deepEqual(errors, [])
    } finally {
        await browser.close()
    }
})
