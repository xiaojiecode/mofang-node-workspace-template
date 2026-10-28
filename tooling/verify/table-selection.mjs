import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root } from '../paths.mjs'

/** 验证新增跨页全选范围与旧默认在真实表格 DOM 中保持各自语义。 */
test('表格显式全量选择排除禁用项，默认仍只选择当前页', async () => {
    const source = await build({
        stdin: {
            contents: `import {render, html} from 'lit';import {dataTable} from './lib/browser/ui/components/table';
                window.renderTable=(allKeys,selected=[],blocked=[])=>render(dataTable([{id:'a'}],row=>row.id,[{title:'商品',cell:row=>row.id}],{selection:{selected:new Set(selected),...(allKeys?{allKeys,allLabel:'选择全部可选商品'}:{}),disabledReason:id=>blocked.includes(id)?'已流转':'',onToggle:()=>{},onToggleAll:(keys,checked)=>window.selectionResult={keys,checked}}}),document.body);`,
            resolveDir: root,
        },
        bundle: true,
        write: false,
        format: 'iife',
        platform: 'browser',
    })
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    try {
        const page = await browser.newPage()
        await page.setContent('<!doctype html><html><body></body></html>')
        await page.addScriptTag({ content: source.outputFiles[0].text })
        await page.evaluate(() => window.renderTable(['a', 'b', 'c'], ['a'], ['c']))
        const all = page.getByRole('checkbox', { name: '选择全部可选商品' })
        assert.equal(await all.evaluate((element) => element.indeterminate), true)
        await all.click()
        assert.deepEqual(await page.evaluate(() => window.selectionResult), {
            keys: ['a', 'b'],
            checked: true,
        })
        await page.evaluate(() => window.renderTable(['a', 'b', 'c'], ['a', 'b'], ['c']))
        assert.equal(await all.isChecked(), true)
        await page.evaluate(() => window.renderTable(['a', 'b'], [], ['a', 'b']))
        assert.equal(await all.isDisabled(), true)
        await page.evaluate(() => window.renderTable(undefined))
        await page.getByRole('checkbox', { name: '选择本页可选行' }).click()
        assert.deepEqual(await page.evaluate(() => window.selectionResult), {
            keys: ['a'],
            checked: true,
        })
    } finally {
        await browser.close()
    }
})
