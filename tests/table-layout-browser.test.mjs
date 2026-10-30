import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root } from '../tooling/paths.mjs'

for (const minify of [false, true])
    test(`表格填充列保留最小宽度、选择列与冻结位置（压缩=${minify}）`, async (t) => {
        const output = await build({
            stdin: {
                contents: `import {LitElement,html,css} from 'lit';import {dataTable,panelStyles} from './lib/browser/ui';
class TablePreview extends LitElement {
static properties={fill:{},selected:{}};
static styles=[panelStyles,css\`:host{display:block;width:900px}.mf-table{container-type:inline-size}\`];
declare fill:number|undefined; declare selected:boolean;
constructor(){super();this.fill=1;this.selected=true;}
render(){return dataTable([{id:'a'}],r=>r.id,[{title:'名称',width:'120px',cell:()=>html\`商品\`},{title:'说明',width:'180px',cell:()=>html\`内容\`}],{fixedLayout:true,freezeColumns:2,fillColumn:this.fill,selection:this.selected?{selected:new Set(),disabledReason:()=>'',onToggle:()=>{},onToggleAll:()=>{}}:undefined})}
}customElements.define('table-preview',TablePreview);`,
                resolveDir: root,
                loader: 'ts',
            },
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            loader: { '.svg': 'text' },
            minify,
            tsconfig: path.join(root, 'tsconfig.base.json'),
        })
        const browser = await chromium.launch({
            headless: true,
            ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
        })
        t.after(() => browser.close())
        const page = await browser.newPage({ viewport: { width: 1200, height: 600 } })
        await page.addScriptTag({ content: output.outputFiles[0].text })
        await page.evaluate(async () => {
            const panel = document.createElement('table-preview')
            document.body.append(panel)
            await panel.updateComplete
        })
        const measure = () =>
            page.evaluate(() => {
                const host = document.querySelector('table-preview')
                const wrapper = host.shadowRoot.querySelector('.mf-table')
                const table = wrapper.querySelector('table')
                return {
                    available: wrapper.clientWidth,
                    width: table.getBoundingClientRect().width,
                    scroll: wrapper.scrollWidth,
                    cells: [...table.querySelectorAll('thead th')].map((e) => ({
                        width: e.getBoundingClientRect().width,
                        x: e.getBoundingClientRect().x,
                    })),
                }
            })
        let size = await measure()
        assert.ok(Math.abs(size.available - size.width) < 1)
        assert.ok(Math.abs(size.cells[0].width - 38) < 1)
        assert.ok(Math.abs(size.cells[1].width - 120) < 1)
        await page.evaluate(() => {
            document.querySelector('table-preview').style.width = '200px'
        })
        size = await measure()
        assert.ok(size.scroll > size.available)
        assert.ok(size.cells[2].width >= 179)
        await page.evaluate(() => {
            document
                .querySelector('table-preview')
                .shadowRoot.querySelector('.mf-table').scrollLeft = 100
        })
        const scrolled = await measure()
        assert.ok(Math.abs(scrolled.cells[0].x - size.cells[0].x) < 1)
        assert.ok(Math.abs(scrolled.cells[1].x - size.cells[1].x) < 1)
        assert.ok(scrolled.cells[2].x < size.cells[2].x - 50)
        for (const fill of [undefined, -1, 2, 0.5]) {
            await page.evaluate(async (fill) => {
                const host = document.querySelector('table-preview')
                host.style.width = '900px'
                host.fill = fill
                await host.updateComplete
            }, fill)
            const unchanged = await measure()
            assert.ok(Math.abs(unchanged.width - 338) < 1, JSON.stringify({ fill, ...unchanged }))
        }
        await page.evaluate(async () => {
            const host = document.querySelector('table-preview')
            host.fill = 1
            host.selected = false
            await host.updateComplete
        })
        size = await measure()
        assert.ok(Math.abs(size.available - size.width) < 1)
        assert.equal(size.cells.length, 2)
    })
