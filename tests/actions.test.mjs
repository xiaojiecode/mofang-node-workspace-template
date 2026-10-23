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
function setup() {
    const listeners = new Set(),
        stores = new Map()
    let writes = 0,
        applied = 0
    const sdk = {
        nodeFlow: {
            listActions: async () => ({ items: [], hasMore: false, nextCursor: null }),
            action: async () => {
                writes++
                return { eventId: 'event-' + writes, sequence: String(writes), status: 'accepted' }
            },
            watchActionResult: ({ eventId }) => {
                if (!stores.has(eventId)) {
                    let data = null
                    const callbacks = new Set()
                    stores.set(eventId, {
                        getSnapshot: () => ({ data, error: null }),
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
                            for (const fn of callbacks) fn()
                        },
                        callbacks,
                    })
                }
                return stores.get(eventId)
            },
        },
    }
    let target = { runId: 'run', nodeInstanceId: 'node', nodeCode: 'test', view: 'current' }
    const node = { revision: '2', permissions: { canAct: true } }
    const host = { addController() {}, requestUpdate() {} }
    const controller = new ActionController(
        host,
        () => ({ sdk, target, node }),
        () => applied++,
    )
    return {
        controller,
        sdk,
        stores,
        listeners,
        get writes() {
            return writes
        },
        get applied() {
            return applied
        },
        setTarget(value) {
            target = value
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
        .set({ eventId: 'event-1', status: 'rejected', error: { message: '修订冲突' } })
    assert.equal(h.applied, 0)
    await h.controller.submit('submit', { keys: ['a'] })
    h.stores.get('event-2').set({ eventId: 'event-2', status: 'applied' })
    h.stores.get('event-2').set({ eventId: 'event-2', status: 'applied' })
    assert.equal(h.applied, 1)
})
test('新的提交使旧结果回调失效，不能把sending改回idle', async () => {
    const h = setup()
    await h.controller.submit('submit', { keys: ['a'] })
    const old = h.stores.get('event-1')
    old.set({ eventId: 'event-1', status: 'applied' })
    const queued = [...old.callbacks]
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
        throw new Error('connection lost')
    }
    await h.controller.submit('submit', { keys: ['a'] })
    assert.equal(h.controller.phase, 'unknown')
    h.sdk.nodeFlow.listActions = async () => ({
        items: [{ eventId: 'older-event', status: 'applied' }],
        hasMore: false,
        nextCursor: null,
    })
    await h.controller.restore()
    assert.equal(h.controller.phase, 'unknown')
    assert.equal(h.applied, 0)
    assert.equal(h.controller.result.eventId, 'older-event')
    h.controller.acknowledgeUnknown()
    assert.equal(h.controller.phase, 'idle')
})
test('目标切换后忽略迟到回执；历史页面不能提交', async () => {
    const h = setup()
    h.controller.hostConnected()
    const pending = deferred()
    h.sdk.nodeFlow.action = () => pending.promise
    const sending = h.controller.submit('submit', {})
    h.setTarget({ runId: 'other', nodeInstanceId: 'other', nodeCode: 'test', view: 'history' })
    h.controller.hostUpdate()
    pending.resolve({ eventId: 'stale', sequence: '1', status: 'accepted' })
    await sending
    assert.equal(h.stores.has('stale'), false)
    await h.controller.submit('submit', {})
    assert.equal(h.controller.phase, 'idle')
})
