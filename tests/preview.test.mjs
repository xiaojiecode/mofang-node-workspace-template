import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { build } from 'esbuild'
import { html as staticHtml } from 'lit/static-html.js'
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
test('预览 SDK 支持 Lit 静态模板和普通对象属性探测', async () => {
    const { sdk } = createFixture({})
    assert.doesNotThrow(() => staticHtml`<div .sdk=${sdk}></div>`)
    assert.equal(Reflect.get(sdk, 'unrelatedProperty'), undefined)
    assert.equal(Reflect.get(sdk, Symbol('inspect')), undefined)
    assert.equal(Object.prototype.toString.call(sdk), '[object Object]')
    assert.equal(await Promise.resolve(sdk), sdk)
})

test('预览 SDK 对尚未实现的真实 API 保留明确错误', () => {
    const { sdk } = createFixture({})
    for (const key of ['http', 'resources', 'readOnlyActions'])
        assert.throws(() => Reflect.get(sdk, key), new RegExp('本地预览未实现 SDK 方法：' + key))
    assert.equal(typeof sdk.context.getSnapshot, 'function')
    assert.equal(typeof sdk.nodeFlow.watch, 'function')
    assert.throws(() => sdk.messages.onStage(() => {}), /本地预览未实现 SDK 方法：messages/)
})

test('预览消息订阅可取消，不生成消息或连接真实消息流', () => {
    const fixture = createFixture({})
    let events = 0
    const stop = fixture.sdk.messages.subscribe({ runId: 'preview-run' }, () => events++)
    assert.equal(typeof stop, 'function')
    fixture.notify()
    assert.equal(events, 0)
    stop()
    stop()
    fixture.notify()
    assert.equal(events, 0)
})

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

test('Mock host finish无参结束空结果，经真实fakeSDK receipt/outcome保留候选事实', async () => {
    const fixture = createFixture({}, true, false, preview)
    const request = {
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
        expectedSessionRevision: '1',
        candidates: [],
        name: 'finish',
        payload: {},
    }
    const receipt = await fixture.sdk.nodeFlow.action(request)
    assert.equal(receipt.status, 'accepted')
    const result = await fixture.sdk.nodeFlow.getActionResult({
        ...request,
        eventId: receipt.eventId,
    })
    assert.equal(result.name, 'finish')
    assert.equal(result.status, 'applied')
    assert.equal(fixture.nodeView.composition.projection.nodeView.phase, 'closed')
    assert.equal(fixture.nodeView.nodeOutput.total, 0)
    assert.equal(fixture.nodeView.productionFinished, true)
    assert.equal(
        fixture.nodeView.composition.projection.actions.every(
            (action) => !action.availability.enabled,
        ),
        true,
    )
})
test('Mock readonly与范围/参数/投影门禁阻止写入，不捏造必要动作', async () => {
    const request = {
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
        expectedSessionRevision: '1',
        candidates: [],
        name: 'finish',
        payload: {},
    }
    const fixture = createFixture({}, false, false, preview)
    fixture.setReadOnly(true)
    await assert.rejects(fixture.sdk.nodeFlow.action(request), (error) => error.kind === 'rejected')
    fixture.setReadOnly(false)
    assert.equal(fixture.nodeView.permissions.canAct, true)
    await assert.rejects(
        fixture.sdk.nodeFlow.action({ ...request, runId: 'foreign' }),
        (error) => error.kind === 'rejected',
    )
    await assert.rejects(
        fixture.sdk.nodeFlow.action({ ...request, payload: { unknown: true } }),
        (error) => error.kind === 'rejected',
    )
    const unavailable = createFixture({}, false, false, {
        ...preview,
        composition: {
            ...preview.composition,
            projection: { status: 'unavailable', code: 'broken', message: '投影错误' },
        },
    })
    await assert.rejects(
        unavailable.sdk.nodeFlow.action(request),
        (error) => error.kind === 'rejected',
    )
    const empty = createFixture({})
    assert.equal(empty.nodeView.composition.projection.actions.length, 0)
    const records = await fixture.sdk.nodeFlow.listActions({
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
    })
    assert.equal(records.items.length, 0)
})
