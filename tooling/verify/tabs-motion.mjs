import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root } from '../paths.mjs'

/** 在有限高度的 NodeCard 中检查页签中间帧、DOM保留和唯一结果滚动层。 */
test('内置页签保留退出动画与输入，刷新不重播，NodeCard填满且侧栏稳定', async () => {
    const source = await build({
        stdin: {
            contents: `import {LitElement,html,css} from 'lit';import {tabs,nodeCard,cockpit,panelStyles,dataTable} from './lib/browser/ui/index';
        class Preview extends LitElement {static properties={active:{state:true},tick:{state:true},collapsed:{state:true}};static styles=[panelStyles,css\`:host{display:block;width:100%;height:100%;min-height:0}.content{display:flex;flex-direction:column;height:100%;min-height:0}.content>.mf-tabs{display:flex;flex-direction:column;flex:1;min-height:0}.mf-tab-panel>.mf-transition,.mf-transition-content{height:100%;min-height:0}.result{height:100%;min-height:0;overflow:hidden}.result>.mf-table{height:100%;max-height:none;box-sizing:border-box}table{min-width:1400px}\`];constructor(){super();this.active='a';this.tick=0;this.collapsed=false}render(){return nodeCard({collapsed:this.collapsed,aside:cockpit({id:'test',collapsed:this.collapsed,onCollapsedChange:v=>this.collapsed=v,nodes:[]})},html\`<div class="content">\${tabs({id:'test',label:'结果页签',value:this.active,onChange:v=>this.active=v,items:[{value:'a',label:'列表A',content:html\`<input aria-label="草稿A"><p>\${this.tick}</p>\`},{value:'b',label:'列表B',content:html\`<div class="result">\${dataTable(Array.from({length:40},(_,i)=>({id:String(i+1)})),r=>r.id,[{title:'商品',cell:r=>'示例商品'+r.id}])}</div>\`},{value:'c',label:'不可用',disabled:true,content:html\`<p>不可用</p>\`} ]})}</div>\`)}}customElements.define('motion-preview',Preview);`,
            resolveDir: root,
        },
        bundle: true,
        write: false,
        platform: 'browser',
        format: 'iife',
        loader: { '.svg': 'text' },
    })
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.setContent(
            '<html><body style="margin:0;height:100vh"><motion-preview></motion-preview></body></html>',
        )
        await page.addScriptTag({ content: source.outputFiles[0].text })
        const host = page.locator('motion-preview')
        await host.getByRole('tab', { name: '列表A', exact: true }).waitFor()
        assert.equal(
            await host.evaluate((e) => e.shadowRoot.getAnimations({ subtree: true }).length),
            0,
            '首次挂载不播放动画',
        )
        await host.getByLabel('草稿A').fill('保留本地输入')
        const middle = await host.evaluate(async (e) => {
            window.savedInput = e.shadowRoot.querySelector('input')
            e.active = 'b'
            await e.updateComplete
            await Promise.resolve()
            const a = e.shadowRoot.getElementById('mf-tabs-test-a-panel')
            const b = e.shadowRoot.getElementById('mf-tabs-test-b-panel')
            const animations = [
                ...a.querySelector('.mf-transition').getAnimations(),
                ...b.querySelector('.mf-transition').getAnimations(),
            ]
            for (const animation of animations) {
                animation.pause()
                animation.currentTime = 80
            }
            const first = animations[0]
            const before = {
                exitHidden: a.hidden,
                exitInert: a.inert,
                exitAria: a.getAttribute('aria-hidden'),
                enterHidden: b.hidden,
                opacity: Number(getComputedStyle(a.firstElementChild).opacity),
                count: animations.length,
            }
            e.tick++
            await e.updateComplete
            await Promise.resolve()
            before.same = first === a.firstElementChild.getAnimations()[0]
            for (const animation of animations) animation.finish()
            return before
        })
        assert.equal(middle.exitHidden, false, '退场中不提前hidden')
        assert.equal(middle.exitInert, true)
        assert.equal(middle.exitAria, 'true')
        assert.equal(middle.enterHidden, false)
        assert.ok(middle.opacity > 0 && middle.opacity < 1)
        assert.equal(middle.count, 2)
        assert.equal(middle.same, true, '普通刷新复用正在播放的动画')
        await page.waitForFunction(
            () =>
                document
                    .querySelector('motion-preview')
                    .shadowRoot.getElementById('mf-tabs-test-a-panel').hidden,
        )
        const geometry = await host.evaluate((e) => {
            const root = e.shadowRoot,
                card = root.querySelector('.mf-node-card'),
                aside = root.querySelector('.mf-node-card-aside'),
                table = root.querySelector('.mf-table'),
                result = root.querySelector('.result')
            table.scrollTop = 300
            table.scrollLeft = 100
            return {
                card: { width: card.clientWidth, height: card.clientHeight },
                aside: aside.getBoundingClientRect().width,
                inner: root.querySelector('.mf-cockpit__inner').getBoundingClientRect().width,
                tableScrollable:
                    table.scrollHeight > table.clientHeight &&
                    table.scrollWidth > table.clientWidth,
                resultOverflow: getComputedStyle(result).overflow,
                cardOverflow: getComputedStyle(card).overflow,
            }
        })
        assert.deepEqual(geometry.card, { width: 1280, height: 720 })
        assert.equal(geometry.aside, 340)
        assert.equal(geometry.inner, 339)
        assert.equal(geometry.tableScrollable, true)
        assert.equal(geometry.resultOverflow, 'hidden')
        assert.equal(geometry.cardOverflow, 'hidden')
        await host.getByRole('tab', { name: '列表A', exact: true }).click()
        await host.getByLabel('草稿A').waitFor()
        assert.equal(await host.getByLabel('草稿A').inputValue(), '保留本地输入')
        assert.equal(
            await host.evaluate((e) => e.shadowRoot.querySelector('input') === window.savedInput),
            true,
        )
        await host.getByLabel('草稿A').focus()
        assert.equal(
            await host.evaluate(async (e) => {
                const before = e.shadowRoot.activeElement
                e.tick++
                await e.updateComplete
                return e.shadowRoot.activeElement === before
            }),
            true,
        )
        await host.evaluate(async (e) => {
            e.active = 'b'
            await e.updateComplete
            await Promise.resolve()
        })
        assert.equal(
            await host
                .getByRole('tab', { name: '列表B', exact: true })
                .evaluate((e) => e.getRootNode().activeElement === e),
            true,
            '隐藏有焦点的页面时移焦到活动页签',
        )
        await host.evaluate(async (e) => {
            e.active = 'a'
            await e.updateComplete
            await Promise.resolve()
            e.active = 'b'
            await e.updateComplete
            await Promise.resolve()
            e.active = 'a'
            await e.updateComplete
            await Promise.resolve()
        })
        await page.waitForFunction(() => {
            const e = document.querySelector('motion-preview')
            return (
                !e.shadowRoot.getElementById('mf-tabs-test-a-panel').hidden &&
                e.shadowRoot.getElementById('mf-tabs-test-b-panel').hidden
            )
        })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await host.getByRole('tab', { name: '列表B', exact: true }).click()
        assert.equal(
            await host.evaluate((e) => e.shadowRoot.getAnimations({ subtree: true }).length),
            0,
        )
        assert.equal(
            await host.evaluate((e) => e.shadowRoot.getElementById('mf-tabs-test-a-panel').hidden),
            true,
        )
        assert.ok(
            await host.locator('.mf-table').evaluate((e) => e.scrollTop >= 299),
            '切换保留非活动页的滚动',
        )
        await host.getByRole('button', { name: '收起当前节点执行', exact: true }).click()
        assert.equal(
            await host
                .locator('.mf-node-card-aside')
                .evaluate((e) => e.getBoundingClientRect().width),
            44,
        )
        assert.equal(
            await host
                .locator('.mf-cockpit__inner')
                .evaluate((e) => e.getBoundingClientRect().width),
            339,
        )
        assert.deepEqual(errors, [])
    } finally {
        await browser.close()
    }
})
