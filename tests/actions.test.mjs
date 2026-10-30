import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { build } from 'esbuild'
import { root } from '../tooling/paths.mjs'
const source = await build({
    entryPoints: [path.join(root, 'lib/browser/actions.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
})
const { ActionController } = await import(
    'data:text/javascript;base64,' + Buffer.from(source.outputFiles[0].text).toString('base64')
)
const deferred = () => {
    let resolve, reject
    const promise = new Promise((yes, no) => {
        resolve = yes
        reject = no
    })
    return { promise, resolve, reject }
}
const flush = async () => {
    for (let i = 0; i < 8; i++) await Promise.resolve()
}
const outcome = (id, status = 'accepted', sequence = '1', extra = {}) => ({
    eventId: id,
    name: 'submit',
    sequence,
    status,
    actor: { userId: 'u', workspaceId: 'w', role: 'user' },
    createdAt: '2026-10-23T00:00:00Z',
    updatedAt: '2026-10-23T00:00:01Z',
    ...extra,
})
const actionPage = (items = [], extra = {}) => ({
    items,
    hasMore: false,
    nextCursor: null,
    snapshotUpperSequence: '100',
    ...extra,
})
function setup() {
    const listeners = new Set(),
        stores = new Map(),
        reads = [],
        pages = []
    let writes = 0,
        applied = 0
    const sdk = {
        nodeFlow: {
            listActions: async (query) => {
                pages.push(query)
                return actionPage()
            },
            getActionResult: async ({ eventId }) => {
                reads.push(eventId)
                return outcome(eventId)
            },
            action: async () => {
                writes++
                return { eventId: 'event-' + writes, sequence: String(writes), status: 'accepted' }
            },
            watchActionResult: ({ eventId }) => {
                if (!stores.has(eventId)) {
                    let data = null,
                        error = null
                    const callbacks = new Set()
                    stores.set(eventId, {
                        getSnapshot: () => ({ data, error }),
                        subscribe: (fn) => {
                            callbacks.add(fn)
                            listeners.add(fn)
                            return () => {
                                callbacks.delete(fn)
                                listeners.delete(fn)
                            }
                        },
                        set(value) {
                            data = value
                            for (const fn of [...callbacks]) fn()
                        },
                        fail(value) {
                            error = value
                            for (const fn of [...callbacks]) fn()
                        },
                        callbacks,
                    })
                }
                return stores.get(eventId)
            },
        },
    }
    let currentSdk = sdk,
        target = { runId: 'run', nodeInstanceId: 'node', nodeCode: 'test', view: 'current' }
    const node = { revision: '2', permissions: { canAct: true } }
    const controller = new ActionController(
        { addController() {}, requestUpdate() {} },
        () => ({ sdk: currentSdk, target, node }),
        () => applied++,
    )
    return {
        controller,
        sdk,
        stores,
        listeners,
        reads,
        pages,
        get writes() {
            return writes
        },
        get applied() {
            return applied
        },
        setTarget(value) {
            target = value
        },
        setSdk(value) {
            currentSdk = value
        },
    }
}
test('动作拒绝不清选择；只有本次applied清理一次', async () => {
    const h = setup()
    await h.controller.submit('submit', { keys: ['a'] })
    assert.equal(h.writes, 1)
    assert.equal(h.controller.phase, 'tracking')
    h.stores
        .get('event-1')
        .set(outcome('event-1', 'rejected', '1', { error: { message: '修订冲突' } }))
    assert.equal(h.applied, 0)
    await h.controller.submit('submit', { keys: ['a'] })
    h.stores.get('event-2').set(outcome('event-2', 'applied', '2'))
    h.stores.get('event-2').set(outcome('event-2', 'applied', '2'))
    assert.equal(h.applied, 1)
    assert.equal(h.listeners.size, 0)
})
test('新的提交使旧结果回调失效，不能把sending改回idle', async () => {
    const h = setup()
    await h.controller.submit('submit', { keys: ['a'] })
    const old = h.stores.get('event-1'),
        queued = [...old.callbacks]
    old.set(outcome('event-1', 'applied'))
    const pending = deferred()
    h.sdk.nodeFlow.action = () => pending.promise
    const sending = h.controller.submit('submit', { keys: ['b'] })
    for (const callback of queued) callback()
    assert.equal(h.controller.phase, 'sending')
    pending.resolve({ eventId: 'event-2', sequence: '2', status: 'accepted' })
    await sending
    assert.equal(h.controller.phase, 'tracking')
    h.controller.hostDisconnected()
    assert.equal(h.listeners.size, 0)
})
test('无回执时查询旧动作不能猜作本次结果，也不会自动重发', async () => {
    const h = setup()
    h.sdk.nodeFlow.action = async () => {
        throw Error('connection lost')
    }
    await h.controller.submit('submit', { keys: ['a'] })
    assert.equal(h.controller.phase, 'unknown')
    h.sdk.nodeFlow.listActions = async () => actionPage([outcome('older-event', 'applied')])
    await h.controller.restore()
    assert.equal(h.controller.phase, 'unknown')
    assert.equal(h.applied, 0)
    assert.equal(h.controller.result.eventId, 'older-event')
    h.controller.acknowledgeUnknown()
    assert.equal(h.controller.phase, 'idle')
})
test('目标/SDK身份切换后忽略迟到回执；历史页面不能提交', async () => {
    const h = setup()
    h.controller.hostConnected()
    await flush()
    const pending = deferred()
    h.sdk.nodeFlow.action = () => pending.promise
    const sending = h.controller.submit('submit', {})
    h.setTarget({ runId: 'other', nodeInstanceId: 'other', nodeCode: 'test', view: 'history' })
    h.setSdk({ ...h.sdk })
    h.controller.hostUpdate()
    pending.resolve({ eventId: 'stale', sequence: '1', status: 'accepted' })
    await sending
    await flush()
    assert.equal(h.stores.has('stale'), false)
    await h.controller.submit('submit', {})
    assert.equal(h.controller.phase, 'idle')
    assert.equal(h.applied, 0)
})
test('确定冲突/业务拒绝/授权拒绝不误标unknown，不清选择或自动重发', async () => {
    for (const failure of [
        { kind: 'conflict' },
        { kind: 'rejected' },
        { httpStatus: 401 },
        { httpStatus: 403 },
    ]) {
        const h = setup()
        let calls = 0
        h.sdk.nodeFlow.action = async () => {
            calls++
            throw Object.assign(new Error('确定拒绝'), failure)
        }
        await h.controller.submit('submit', { keys: ['a'] })
        assert.equal(h.controller.phase, 'idle')
        assert.equal(h.applied, 0)
        assert.equal(calls, 1)
        assert.match(h.controller.error, /确定拒绝/)
        assert.doesNotMatch(h.controller.error, /未取得确定回执/)
    }
})
test('较早pending不会被较晚terminal覆盖，恢复所有非终态且只读补查', async () => {
    const h = setup(),
        early = outcome('early', 'accepted', '1'),
        later = outcome('later', 'applied', '2'),
        other = outcome('other', 'processing', '3')
    let page = 0
    h.sdk.nodeFlow.listActions = async (query) => {
        h.pages.push(query)
        return ++page === 1
            ? actionPage([early, later], { hasMore: true, nextCursor: 'opaque' })
            : actionPage([other])
    }
    h.sdk.nodeFlow.getActionResult = async ({ eventId }) => {
        h.reads.push(eventId)
        return eventId === 'early' ? early : other
    }
    await h.controller.restore()
    assert.deepEqual(h.reads, ['early', 'other'])
    assert.equal(h.stores.size, 2)
    assert.equal(h.controller.phase, 'tracking')
    assert.equal(h.pages[1].cursor, 'opaque')
    assert.equal(h.pages[1].afterSequence, undefined)
    h.stores.get('other').set(outcome('other', 'applied', '3'))
    assert.equal(h.controller.phase, 'tracking')
    assert.equal(h.controller.result.eventId, 'early')
    h.stores.get('early').set(outcome('early', 'rejected', '1'))
    assert.equal(h.controller.phase, 'idle')
    assert.equal(h.applied, 0)
    assert.equal(h.writes, 0)
    assert.equal(h.listeners.size, 0)
})
test('pending精确补读并发最多4个，扫描结果不能触发选择清除', async () => {
    const h = setup(),
        items = Array.from({ length: 9 }, (_, i) =>
            outcome('pending-' + i, 'accepted', String(i + 1)),
        )
    h.sdk.nodeFlow.listActions = async () => actionPage(items)
    let active = 0,
        maximum = 0
    h.sdk.nodeFlow.getActionResult = async ({ eventId }) => {
        active++
        maximum = Math.max(maximum, active)
        await new Promise((resolve) => setImmediate(resolve))
        active--
        return outcome(
            eventId,
            'applied',
            String(items.findIndex((item) => item.eventId === eventId) + 1),
        )
    }
    await h.controller.restore()
    assert.equal(maximum, 4)
    assert.equal(h.controller.phase, 'idle')
    assert.equal(h.applied, 0)
    assert.equal(h.writes, 0)
    assert.equal(h.listeners.size, 0)
})
test('固定上界变化及预算耗尽明确报告未完成，不能把恢复当成完成', async () => {
    const h = setup()
    let count = 0
    h.sdk.nodeFlow.listActions = async () =>
        actionPage([], {
            snapshotUpperSequence: String(++count),
            hasMore: true,
            nextCursor: 'next',
        })
    await h.controller.restore()
    assert.match(h.controller.error, /固定上界/)
    assert.equal(h.controller.phase, 'unknown')
    assert.equal(h.writes, 0)
    const limited = setup()
    let calls = 0
    limited.sdk.nodeFlow.listActions = async () => {
        calls++
        return actionPage([], { hasMore: true, nextCursor: 'next-' + calls })
    }
    await limited.controller.restore()
    assert.equal(calls, 10)
    assert.match(limited.controller.error, /尚未核对完整/)
    assert.equal(limited.controller.busy, true)
})
test('恢复在途换目标不回填；同SDK权限失效清除旧记录并失效旧回调', async () => {
    const h = setup(),
        waiting = deferred()
    h.sdk.nodeFlow.listActions = () => waiting.promise
    const restoring = h.controller.restore()
    h.controller.hostDisconnected()
    h.setTarget({ runId: 'other', nodeInstanceId: 'other', nodeCode: 'test', view: 'history' })
    waiting.resolve(actionPage([outcome('old', 'accepted')]))
    await restoring
    assert.equal(h.stores.has('old'), false)
    assert.equal(h.controller.result, null)
    const active = setup()
    await active.controller.submit('submit', {})
    const store = active.stores.get('event-1'),
        callbacks = [...store.callbacks]
    store.fail(Object.assign(new Error('无权限'), { httpStatus: 403, code: 'permission_denied' }))
    assert.equal(active.controller.result, null)
    assert.equal(active.listeners.size, 0)
    store.set(outcome('event-1', 'applied'))
    for (const callback of callbacks) callback()
    assert.equal(active.controller.result, null)
    assert.equal(active.applied, 0)
})
test('历史动作仅读取结果，不监听或重复轮询', async () => {
    const h = setup()
    h.setTarget({ runId: 'run', nodeInstanceId: 'node', nodeCode: 'test', view: 'history' })
    h.sdk.nodeFlow.listActions = async () => actionPage([outcome('pending')])
    h.sdk.nodeFlow.getActionResult = async ({ eventId }) => {
        h.reads.push(eventId)
        return outcome(eventId)
    }
    await h.controller.restore()
    assert.deepEqual(h.reads, ['pending'])
    assert.equal(h.listeners.size, 0)
    assert.equal(h.stores.size, 0)
})
