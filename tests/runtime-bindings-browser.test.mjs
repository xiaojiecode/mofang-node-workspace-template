import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'
for (const minify of [false, true])
    test(`设置绑定受控选择及只读（压缩=${minify}）`, async (t) => {
        const js = await build({
            stdin: {
                contents: `import {LitElement,html} from 'lit';import {inputBindings} from './lib/browser/bindings';import {panelStyles} from './lib/browser/ui/styles/theme';class App extends LitElement {static styles=panelStyles;static properties={settings:{attribute:false}};render(){return html\`${'${inputBindings(this.settings)}'}\`}}customElements.define('test-bindings',App)`,
                resolveDir: process.cwd(),
                loader: 'ts',
            },
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            minify,
            loader: { '.svg': 'text' },
            tsconfig: 'tsconfig.base.json',
        })
        const browser = await chromium.launch({
            headless: true,
            ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
        })
        t.after(() => browser.close())
        const page = await browser.newPage()
        await page.addScriptTag({ content: js.outputFiles[0].text })
        await page.evaluate(async () => {
            const calls = []
            const app = document.createElement('test-bindings')
            const field = {
                label: '目标字段',
                selectedId: 'one',
                options: [{ id: 'one', nodeName: '上游', fieldName: '标题', typeName: '文本' }],
                readOnly: false,
            }
            app.settings = {
                values: {},
                readOnly: false,
                messages: [{ kind: 'status', message: '运行期锁定提示' }],
                inputBindings: {
                    fields: { target: field },
                    onChange: (name, value) => calls.push([name, value]),
                },
            }
            document.body.append(app)
            window.fixture = { app, calls }
            await app.updateComplete
        })
        const app = page.locator('test-bindings')
        const select = app.getByRole('combobox', { name: '目标字段' })
        await select.waitFor()
        assert.match(await select.innerText(), /上游/)
        await page.evaluate(async () => {
            const app = window.fixture.app
            app.settings = { ...app.settings }
            await app.updateComplete
        })
        assert.match(await select.innerText(), /上游/)
        assert.equal(await app.getByText('运行期锁定提示').count(), 1)
        await select.click()
        await app.getByRole('option', { name: '不绑定' }).click()
        assert.deepEqual(await page.evaluate(() => window.fixture.calls), [['target', null]])
        await page.evaluate(async () => {
            const app = window.fixture.app
            app.settings = { ...app.settings, readOnly: true }
            await app.updateComplete
        })
        assert.equal(await select.isDisabled(), true)
    })

test('驾驶舱只显示已有事实，显式空能力仍显示空态', async (t) => {
    const js = await build({
        stdin: {
            contents: `import {LitElement,html} from 'lit';import {cockpit} from './lib/browser/ui/components/cockpit';class App extends LitElement {static properties={known:{attribute:false}};render(){return html\`${'${cockpit({id:"x",collapsed:false,onCollapsedChange:()=>{},nodes:[{id:"n",title:"节点",status:"等待",...(this.known?{capabilities:[]}:{})}]})}'}\`}}customElements.define('cockpit-test',App)`,
            resolveDir: process.cwd(),
            loader: 'ts',
        },
        bundle: true,
        write: false,
        format: 'iife',
        platform: 'browser',
        loader: { '.svg': 'text' },
        tsconfig: 'tsconfig.base.json',
    })
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    t.after(() => browser.close())
    const page = await browser.newPage()
    await page.addScriptTag({ content: js.outputFiles[0].text })
    await page.evaluate(async () => {
        const app = document.createElement('cockpit-test')
        document.body.append(app)
        await app.updateComplete
    })
    const app = page.locator('cockpit-test')
    assert.equal(await app.getByText('本次未开启原子能力').count(), 0)
    await page.evaluate(async () => {
        const app = document.querySelector('cockpit-test')
        app.known = true
        await app.updateComplete
    })
    assert.equal(await app.getByText('本次未开启原子能力').count(), 1)
})
