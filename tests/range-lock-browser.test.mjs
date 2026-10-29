import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

const compiled = await build({
    stdin: {
        contents: `import {LitElement} from 'lit';import {rangeField} from './lib/browser/ui/components/range';
class RangeFixture extends LitElement { static properties={options:{attribute:false}}; constructor(){super();this.options={};this.calls=[]}; render(){return rangeField({name:'price',label:'价格',value:{min:1,max:10},onChange:v=>this.calls.push(v),...this.options})} }
customElements.define('range-lock-fixture',RangeFixture);`,
        resolveDir: process.cwd(),
        loader: 'ts',
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    target: 'es2022',
    tsconfig: 'tsconfig.base.json',
})

test('区间两端独立宿主锁不改变缺省行为，整字段只读优先且事件不能绕过锁', async (t) => {
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    t.after(() => browser.close())
    const page = await browser.newPage()
    await page.addScriptTag({ content: compiled.outputFiles[0].text })
    await page.evaluate(() => {
        const element = document.createElement('range-lock-fixture')
        document.body.append(element)
        window.rangeFixture = element
    })
    const min = page.locator('input[name=price-min]'),
        max = page.locator('input[name=price-max]')
    assert.equal(await min.isDisabled(), false)
    assert.equal(await max.isDisabled(), false)
    await page.evaluate(async () => {
        window.rangeFixture.options = { minReadOnly: true }
        await window.rangeFixture.updateComplete
    })
    assert.equal(await min.isDisabled(), true)
    assert.equal(await max.isDisabled(), false)
    await min.evaluate((element) => {
        element.value = '2'
        element.dispatchEvent(new Event('input', { bubbles: true }))
    })
    assert.deepEqual(await page.evaluate(() => window.rangeFixture.calls), [])
    await max.fill('20')
    assert.deepEqual(await page.evaluate(() => window.rangeFixture.calls), [{ min: 1, max: 20 }])
    await page.evaluate(async () => {
        window.rangeFixture.options = { maxReadOnly: true }
        await window.rangeFixture.updateComplete
    })
    assert.equal(await min.isDisabled(), false)
    assert.equal(await max.isDisabled(), true)
    await page.evaluate(async () => {
        window.rangeFixture.options = { readOnly: true, minReadOnly: false, maxReadOnly: false }
        await window.rangeFixture.updateComplete
    })
    assert.equal(await min.isDisabled(), true)
    assert.equal(await max.isDisabled(), true)
})
