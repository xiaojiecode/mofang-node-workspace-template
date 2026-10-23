import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { build } from 'esbuild'
import { root } from '../tooling/paths.mjs'
const source = await build({
    entryPoints: [path.join(root, 'playground/src/fixture.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
})
const { createFixture } = await import(
    'data:text/javascript;base64,' + Buffer.from(source.outputFiles[0].text).toString('base64')
)
const product = { basic: { title: '原预览商品', price: 2, currency: 'USD' } }
const preview = {
    permissions: { canAct: true },
    composition: {
        abi: 'mf.node/1',
        snapshot: {
            sourceHash: 'fixture',
            sessionRevision: '1',
            configDigest: 'fixture',
            factsDigest: 'fixture',
        },
        projection: {
            status: 'ready',
            nodeView: {
                phase: 'ready',
                rows: [{ key: 'a', product, submitted: false, day7UnitsSold: 123 }],
                total: 100,
                submitted: 0,
            },
            actions: [
                { name: 'submit', presentation: 'panel', availability: { enabled: true } },
                { name: 'finish', presentation: 'host', availability: { enabled: true } },
            ],
        },
    },
}
test('无上游item的入口预览不构造undefined商品，覆盖仍保留原指标', () => {
    const empty = createFixture({ region: 'US' })
    assert.deepEqual(empty.context.output.values.items, [])
    assert.deepEqual(empty.nodeView.nodeOutput.items, [])
    assert.deepEqual(empty.nodeView.composition.projection.nodeView.rows, [])
    const search = createFixture({ region: 'US' }, false, false, preview)
    assert.equal(search.nodeView.composition.projection.nodeView.rows[0].day7UnitsSold, 123)
    assert.equal(search.nodeView.composition.projection.nodeView.total, 100)
    const zero = createFixture({ region: 'US' }, true, false, preview)
    assert.deepEqual(zero.nodeView.composition.projection.nodeView.rows, [])
    assert.equal(preview.composition.projection.nodeView.rows.length, 1)
})
test('预览不读取旧nodeView兼容字段', () => {
    assert.throws(
        () => createFixture({}, false, false, { nodeView: { phase: 'ready' } }),
        /requires composition/,
    )
})
test('明确的本地动作fixture提供新receipt/outcome，不能冒充业务链路', async () => {
    const fixture = createFixture({}, false, false, preview)
    const receipt = await fixture.sdk.nodeFlow.action({
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
        expectedSessionRevision: '1',
        candidates: [],
        name: 'submit',
        payload: { keys: ['a'] },
    })
    assert.equal(receipt.status, 'accepted')
    const result = await fixture.sdk.nodeFlow.getActionResult({
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
        eventId: receipt.eventId,
    })
    assert.equal(result.status, 'applied')
    assert.equal(fixture.nodeView.nodeOutput.items.length, 1)
    assert.equal(fixture.nodeView.composition.projection.nodeView.phase, 'submitted')
    assert.equal(
        (
            await fixture.sdk.nodeFlow.listActions({
                runId: 'preview-run',
                nodeInstanceId: 'preview-node',
            })
        ).items.length,
        1,
    )
})
