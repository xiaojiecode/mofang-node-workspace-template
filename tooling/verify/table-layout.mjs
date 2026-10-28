import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root } from '../paths.mjs'

/** 固定宽度与冻结列通过实际横纵滚动核对，不以样式声明代替浏览器几何。 */
test('表格固定布局跨数据和只读稳定，冻结列包含勾选列并保持横纵对齐', async () => {
    const source = await build({
        stdin: {
            resolveDir: root,
            contents: `import {LitElement,html,css} from 'lit';
                import {dataTable,panelStyles} from './lib/browser/ui/index';
                class LayoutPreview extends LitElement {
                    static properties={long:{state:true},readonly:{state:true},selection:{state:true},fixed:{state:true},freeze:{state:true},state:{state:true},count:{state:true},tick:{state:true}};
                    static styles=[panelStyles,css\`:host{display:block;padding:20px}.mf-table{width:420px;height:240px;max-height:none}.cell{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cell input{width:80px;box-sizing:border-box}\`];
                    constructor(){super();this.long=false;this.readonly=false;this.selection=true;this.fixed=true;this.freeze=2;this.state='ready';this.count=40;this.tick=0;this.events=[];}
                    render(){const rows=Array.from({length:this.state==='empty'||this.state==='initial-loading'||this.state==='error'?0:this.count},(_,i)=>({id:String(i+1)}));return dataTable(rows,row=>row.id,[{title:'商品',width:'120px',cell:row=>html\`<span class="cell">\${this.long?'很长商品标题'.repeat(60):'商品'+row.id}</span>\`},{title:'备注',width:'180px',cell:row=>html\`<span class="cell"><input aria-label=\${'备注'+row.id} .value=\${'备注'+this.tick} ?readonly=\${this.readonly}></span>\`},{title:'分类',width:'200px',cell:row=>html\`<span class="cell">\${this.long?'分类'.repeat(100):'分类'+row.id}</span>\`},{title:'操作',width:'160px',cell:row=>html\`<button ?disabled=\${this.readonly}>查看\${row.id}</button>\`}],{fixedLayout:this.fixed,freezeColumns:this.freeze,selectionWidth:'44px',label:'固定列测试表',empty:'没有匹配商品',loading:this.state==='initial-loading'||this.state==='refresh',error:this.state==='error'?{title:'加载失败',onRetry:()=>this.events.push('retry')}:undefined,selection:this.selection?{selected:new Set(),disabledReason:()=>this.readonly?'只读':'',onToggle:(key,value)=>this.events.push([key,value]),onToggleAll:(keys,value)=>this.events.push([keys,value])}:undefined});}
                }customElements.define('table-layout-preview',LayoutPreview);`,
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
        await page.setContent('<!doctype html><table-layout-preview></table-layout-preview>')
        await page.addScriptTag({ content: source.outputFiles[0].text })
        const host = page.locator('table-layout-preview')
        const table = host.getByRole('table', { name: '固定列测试表' })
        const update = (values) =>
            host.evaluate(async (element, values) => {
                Object.assign(element, values)
                await element.updateComplete
            }, values)
        const geometry = () =>
            table.evaluate((element) => {
                const box = element.parentElement.getBoundingClientRect()
                const cells = (row) =>
                    [...row.cells].map((cell) => {
                        const rect = cell.getBoundingClientRect()
                        return { x: rect.x - box.x, y: rect.y - box.y, width: rect.width }
                    })
                return {
                    head: cells(element.tHead.rows[0]),
                    row: cells(
                        element.tBodies[0].querySelector('[data-row-key]') ??
                            element.tBodies[0].rows[0],
                    ),
                    width: element.getBoundingClientRect().width,
                    layout: getComputedStyle(element).tableLayout,
                }
            })
        const close = (actual, expected, message) =>
            assert.ok(Math.abs(actual - expected) <= 1, `${message}: ${actual} / ${expected}`)
        const initial = await geometry()
        assert.equal(initial.layout, 'fixed')
        assert.deepEqual(
            initial.head.map((cell) => Math.round(cell.width)),
            [44, 120, 180, 200, 160],
        )
        close(initial.width, 704, '总宽来自明确列宽')
        for (const values of [
            { long: true, count: 1 },
            { readonly: true, count: 60 },
            { tick: 1, long: false },
        ]) {
            await update(values)
            const current = await geometry()
            assert.deepEqual(
                current.head.map((cell) => cell.width),
                initial.head.map((cell) => cell.width),
                '换数据、只读及普通刷新不改变列宽',
            )
            current.row.forEach((cell, index) =>
                close(cell.width, initial.head[index].width, '行和表头宽度一致'),
            )
        }
        assert.equal(
            await host
                .getByRole('textbox', { name: '备注1', exact: true })
                .getAttribute('readonly'),
            '',
        )
        assert.equal(
            await host.getByRole('checkbox', { name: '选择本页可选行' }).isDisabled(),
            true,
        )
        await update({ readonly: false })
        const checkScroll = async (frozen) => {
            await host.locator('.mf-table').evaluate((element) => {
                element.scrollLeft = 0
                element.scrollTop = 0
            })
            const before = await geometry()
            await host.locator('.mf-table').evaluate((element) => {
                element.scrollLeft = 210
                element.scrollTop = 120
            })
            const moved = await geometry()
            const offset = await host
                .locator('.mf-table')
                .evaluate((element) => ({ x: element.scrollLeft, y: element.scrollTop }))
            assert.ok(offset.x > 100 && offset.y > 100, '两个方向均发生真实滚动')
            moved.head.forEach((cell, index) => {
                close(cell.y, before.head[index].y, '表头纵向冻结')
                close(
                    cell.x,
                    before.head[index].x - (index < frozen ? 0 : offset.x),
                    '表头横向冻结范围正确',
                )
                close(moved.row[index].x, cell.x, '横滚后表头与数据列对齐')
            })
            close(moved.row[0].y, before.row[0].y - offset.y, '数据行仍随正文纵向滚动')
            if (frozen) {
                const hit = await table.evaluate((element, frozen) => {
                    const root = element.getRootNode()
                    const atCell = (cell) => {
                        const rect = cell.getBoundingClientRect()
                        const hit = root.elementFromPoint(
                            rect.x + rect.width / 2,
                            rect.y + rect.height / 2,
                        )
                        return hit?.closest('th,td') === cell
                    }
                    const box = element.parentElement.getBoundingClientRect()
                    const row = [...element.tBodies[0].rows].find((row) => {
                        const rect = row.getBoundingClientRect()
                        return (
                            rect.top > box.top + element.tHead.getBoundingClientRect().height &&
                            rect.bottom < box.bottom
                        )
                    })
                    return {
                        head: [...element.tHead.rows[0].cells].slice(0, frozen).every(atCell),
                        body: row ? [...row.cells].slice(0, frozen).every(atCell) : false,
                    }
                }, frozen)
                assert.deepEqual(
                    hit,
                    { head: true, body: true },
                    '冻结表头和正文覆盖滚动穿过的其它列',
                )
            }
        }
        await checkScroll(2)
        await update({ selection: false, freeze: 2 })
        assert.deepEqual(
            (await geometry()).head.map((cell) => Math.round(cell.width)),
            [120, 180, 200, 160],
        )
        await checkScroll(2)
        await update({ selection: true, freeze: 1 })
        await checkScroll(1)
        await update({ freeze: 0 })
        await checkScroll(0)
        for (const state of ['empty', 'initial-loading', 'refresh', 'error']) {
            await update({ state, freeze: 2 })
            assert.deepEqual(
                (await geometry()).head.map((cell) => cell.width),
                initial.head.map((cell) => cell.width),
                `${state}保持表头列宽`,
            )
            if (state === 'empty') await host.getByText('没有匹配商品', { exact: true }).waitFor()
            if (state === 'initial-loading') assert.equal(await host.locator('tbody tr').count(), 3)
            if (state === 'refresh') {
                assert.equal(await host.locator('[data-row-key]').count(), 60)
                assert.equal(await host.locator('.mf-table').getAttribute('aria-busy'), 'true')
            }
            if (state === 'error') {
                await host.getByRole('button', { name: '重新加载', exact: true }).click()
                assert.deepEqual(await host.evaluate((element) => element.events), ['retry'])
            }
        }
        await update({ fixed: false, freeze: 3, state: 'ready', count: 2 })
        assert.equal((await geometry()).layout, 'auto', '旧调用默认保持自动布局')
        assert.equal(await table.locator('colgroup').count(), 0)
        assert.equal(
            await table.locator('[data-frozen]').count(),
            0,
            '未启用固定布局不改变旧冻结行为',
        )
        assert.deepEqual(errors, [])
    } finally {
        await browser.close()
    }
})
