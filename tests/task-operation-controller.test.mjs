import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { build } from 'esbuild'
import { root } from '../tooling/paths.mjs'

const compiled = await build({
    entryPoints: [path.join(root, 'lib/browser/task-operation-controller.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
})
const { TaskOperationController } = await import(
    'data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64')
)
const result = (operationId, status = 'accepted', sequence = '1') => ({
    operationId,
    taskId: 'task',
    sequence,
    revision: '1',
    kind: 'reply',
    status,
    createdAt: '2026-10-30T00:00:00Z',
})
const page = (items = [], extra = {}) => ({
    items,
    snapshotUpperSequence: '100',
    nextAfterSequence: '',
    ...extra,
})
const deferred = () => {
    let resolve
    const promise = new Promise((yes) => {
        resolve = yes
    })
    return { promise, resolve }
}
function setup() {
    let applied = 0
    const writes = [],
        reads = [],
        lists = []
    const sdk = {
        nodeFlow: {
            replyTask: async (body) => {
                writes.push(body)
                return { ...body, status: 'accepted' }
            },
            continueTask: async (body) => {
                writes.push(body)
                return { ...body, status: 'accepted' }
            },
            getTaskOperation: async (query) => {
                reads.push(query)
                return result(query.operationId)
            },
            listTaskOperations: async (query) => {
                lists.push(query)
                return page()
            },
        },
    }
    let binding = { sdk, target: { runId: 'run', nodeInstanceId: 'node', view: 'current' } }
    const memory = new Map()
    const storage = {
        getItem: (k) => memory.get(k) ?? null,
        setItem: (k, v) => memory.set(k, v),
        removeItem: (k) => memory.delete(k),
    }
    const controller = new TaskOperationController(
        { addController() {}, requestUpdate() {} },
        () => binding,
        () => applied++,
        storage,
    )
    return {
        sdk,
        controller,
        writes,
        storage,
        reads,
        lists,
        get applied() {
            return applied
        },
        setBinding(next) {
            binding = next
            controller.hostUpdate()
        },
    }
}
const reply = { taskId: 'task', waitingToolCallId: 'waiting', answer: '答案' }

test('受理只进入观察，精确查询原操作，重复点击不重发', async () => {
    const h = setup()
    await h.controller.reply(reply)
    assert.equal(h.writes.length, 1)
    assert.equal(h.controller.state('task').phase, 'tracking')
    assert.equal(h.reads[0].operationId, h.writes[0].operationId)
    await h.controller.reply(reply)
    assert.equal(h.writes.length, 1)
    h.sdk.nodeFlow.getTaskOperation = async (query) => result(query.operationId, 'applied')
    await h.controller.recheck('task')
    assert.equal(h.controller.state('task').phase, 'idle')
    assert.equal(h.applied, 1)
    await h.controller.recheck('task')
    assert.equal(h.applied, 1)
})
test('提交在途的第二次点击被阻止，迟到回执不能填入新目标', async () => {
    const h = setup(),
        pending = deferred()
    h.sdk.nodeFlow.replyTask = async (body) => {
        h.writes.push(body)
        return pending.promise
    }
    const sending = h.controller.reply(reply)
    await h.controller.reply(reply)
    assert.equal(h.writes.length, 1)
    h.setBinding({
        sdk: h.sdk,
        target: { runId: 'other', nodeInstanceId: 'other', view: 'current' },
    })
    pending.resolve({ status: 'accepted', taskId: 'task', operationId: h.writes[0].operationId })
    await sending
    assert.equal(h.reads.length, 0)
    assert.equal(h.controller.state('task').records.length, 0)
})
test('无回执仅按预分配身份核对，其他历史成功不能替代本次结果', async () => {
    const h = setup()
    h.sdk.nodeFlow.replyTask = async (body) => {
        h.writes.push(body)
        throw Error('断线')
    }
    h.sdk.nodeFlow.getTaskOperation = async (query) => {
        h.reads.push(query)
        throw Error('暂不可读')
    }
    h.sdk.nodeFlow.listTaskOperations = async () => page([result('older', 'applied')])
    await h.controller.reply(reply)
    assert.equal(h.controller.state('task').phase, 'unknown')
    assert.equal(h.controller.state('task').canStartNew, false)
    await h.controller.recheck('task')
    assert.equal(h.reads[0].operationId, h.writes[0].operationId)
    assert.equal(h.controller.state('task').phase, 'unknown')
    assert.equal(h.applied, 0)
    assert.equal(h.writes.length, 1)
    assert.equal(h.controller.state('task').canStartNew, true)
    h.controller.acknowledgeUnknown('task')
    assert.equal(h.controller.state('task').phase, 'idle')
    assert.match(h.controller.state('task').error, /暂不可核对/)
})
test('已知受理结果查询失败时不能确认观察结束来重发', async () => {
    const h = setup()
    h.sdk.nodeFlow.getTaskOperation = async () => {
        throw Error('读取断线')
    }
    await h.controller.reply(reply)
    assert.equal(h.controller.state('task').phase, 'unknown')
    assert.equal(h.controller.state('task').canStartNew, false)
    h.controller.acknowledgeUnknown('task')
    await h.controller.reply(reply)
    assert.equal(h.writes.length, 1)
})
test('冲突和明确拒绝不是未知且不自动重发', async () => {
    for (const failure of [{ kind: 'conflict' }, { kind: 'rejected' }, { httpStatus: 403 }]) {
        const h = setup()
        h.sdk.nodeFlow.replyTask = async (body) => {
            h.writes.push(body)
            throw Object.assign(Error('明确拒绝'), failure)
        }
        await h.controller.reply(reply)
        assert.equal(h.controller.state('task').phase, 'idle')
        assert.equal(h.writes.length, 1)
        assert.match(h.controller.state('task').error, /明确拒绝/)
    }
})
test('历史可恢复记录但不可写，预览不读取执行数据', async () => {
    for (const view of ['history', 'preview']) {
        const h = setup()
        h.setBinding({ sdk: h.sdk, target: { runId: 'run', nodeInstanceId: 'node', view } })
        await h.controller.reply(reply)
        await h.controller.continue({ taskId: 'task', expectedWaitingTurn: 1 })
        await h.controller.sync(['task'])
        assert.equal(h.writes.length, 0)
        assert.equal(h.lists.length, view === 'history' ? 1 : 0)
        if (h.lists.length) assert.equal(h.lists[0].view, 'history')
    }
})
test('固定上界跨页恢复并核对所有未终态操作，没有POST', async () => {
    const h = setup()
    h.sdk.nodeFlow.listTaskOperations = async (query) => {
        h.lists.push(query)
        return query.afterSequence === '0'
            ? page([result('early')], { nextAfterSequence: '1' })
            : page([result('late', 'applied', '2')])
    }
    h.sdk.nodeFlow.getTaskOperation = async (query) => {
        h.reads.push(query)
        return result(query.operationId, 'rejected')
    }
    await h.controller.sync(['task'])
    assert.equal(h.lists[1].snapshotUpperSequence, '100')
    assert.deepEqual(
        h.reads.map((query) => query.operationId),
        ['early'],
    )
    assert.equal(h.controller.state('task').records.length, 2)
    assert.equal(h.controller.state('task').phase, 'idle')
    assert.equal(h.writes.length, 0)
})
test('恢复固定上界异常和权限失效不保留旧数据', async () => {
    const h = setup()
    h.sdk.nodeFlow.listTaskOperations = async (query) =>
        query.afterSequence === '0'
            ? page([result('early')], { nextAfterSequence: '1' })
            : page([], { snapshotUpperSequence: '101' })
    await h.controller.sync(['task'])
    assert.equal(h.controller.state('task').phase, 'unknown')
    h.sdk.nodeFlow.listTaskOperations = async () => {
        throw Object.assign(Error('无权限'), { httpStatus: 403 })
    }
    await h.controller.recheck('task')
    assert.equal(h.controller.state('task').records.length, 0)
})
test('切换SDK或卸载时不接收旧查询结果', async () => {
    const h = setup(),
        pending = deferred()
    h.sdk.nodeFlow.listTaskOperations = () => pending.promise
    const reading = h.controller.recheck('task')
    h.setBinding({
        sdk: { ...h.sdk },
        target: { runId: 'run', nodeInstanceId: 'node', view: 'current' },
    })
    pending.resolve(page([result('stale', 'applied')]))
    await reading
    assert.equal(h.controller.state('task').records.length, 0)
    h.controller.hostDisconnected()
    assert.equal(h.writes.length, 0)
})
test('缺 randomUUID 时使用系统随机数，缺安全随机数则拒绝提交', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
    try {
        Object.defineProperty(globalThis, 'crypto', {
            configurable: true,
            value: {
                getRandomValues(bytes) {
                    bytes.fill(9)
                    return bytes
                },
            },
        })
        const ok = setup()
        await ok.controller.reply({ taskId: 'task', waitingToolCallId: 'wait', answer: 'yes' })
        assert.match(
            ok.writes[0].operationId,
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        )
        Object.defineProperty(globalThis, 'crypto', { configurable: true, value: {} })
        const fail = setup()
        await fail.controller.reply({ taskId: 'task', waitingToolCallId: 'wait', answer: 'yes' })
        assert.equal(fail.writes.length, 0)
        assert.match(fail.controller.state('task').error, /安全生成操作身份/)
    } finally {
        if (descriptor) Object.defineProperty(globalThis, 'crypto', descriptor)
        else delete globalThis.crypto
    }
})
test('会话存储失败不提交，重挂按原身份核对并在终态清理', async () => {
    const first = setup()
    first.sdk.nodeFlow.replyTask = async (body) => {
        first.writes.push(body)
        throw Error('断线')
    }
    await first.controller.reply({ taskId: 'task', waitingToolCallId: 'wait', answer: 'x' })
    const id = first.writes[0].operationId
    assert.equal(first.storage.getItem('workflow-task-operation:run:node:task'), id)
    first.controller.hostDisconnected()
    first.sdk.nodeFlow.getTaskOperation = async (q) => {
        first.reads.push(q)
        return result(q.operationId, 'applied')
    }
    await first.controller.sync(['task'])
    assert.equal(first.reads.at(-1).operationId, id)
    assert.equal(first.storage.getItem('workflow-task-operation:run:node:task'), null)
    const bad = setup()
    bad.storage.setItem = () => {
        throw Error('不可用')
    }
    await bad.controller.reply({ taskId: 'task', waitingToolCallId: 'wait', answer: 'x' })
    assert.equal(bad.writes.length, 0)
    assert.match(bad.controller.state('task').error, /不可用/)
})
