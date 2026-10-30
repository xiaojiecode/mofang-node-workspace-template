import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { panelPropNames, syncPanelProps } from '../tooling/sync-contracts/panel-props.mjs'

test('CLI 注入清单与 PanelProps 一致，包含标题信息与错误/记录工厂', async () => {
    await syncPanelProps(true)
    const source = await readFile(
        new URL('../lib/contracts/src/browser/host.ts', import.meta.url),
        'utf8',
    )
    const fields = panelPropNames(source)
    assert.equal(fields.length, 13)
    for (const name of ['node', 'panelError', 'createRecordSdk']) assert.ok(fields.includes(name))
})

test('注入字段结构不支持时明确失败，不静默漏项', () => {
    for (const fields of ['node?: A; sdk?: B;', 'node?: {name: string}', 'node?: A\nnode?: B'])
        assert.throws(() => panelPropNames(`export interface PanelProps {\n${fields}\n}`))
})
