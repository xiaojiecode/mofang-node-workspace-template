import test from 'node:test'
import assert from 'node:assert/strict'
import { createMofangSDK } from '@mofang/workflow-sdk'
import { WORKFLOW_SDK_METHODS } from '@mofang/workflow-sdk/lowcode'

for (const kind of ['workflow_run', 'node_run']) {
    test(`${kind} 暂停受理与真实暂停查询分离，恢复使用指定暂停身份`, async () => {
        const target = { kind, id: 'execution' }
        const reference = { ...target, submissionKey: 'submission' }
        const calls = []
        const receipt = { requestId: 'pause-accepted', target: reference, accepted: true }
        const snapshot = {
            target: reference,
            requestId: 'latest-resume',
            outstandingPauses: [
                { pauseRequestId: 'real-pause', reason: '人工暂停' },
                { pauseRequestId: 'another-pause', reason: '另一次暂停' },
            ],
            desiredState: 'paused',
            phase: 'applying',
            businessStatus: 'running',
            activeCount: 1,
            pendingChildren: 0,
            resumeAllowed: true,
            blockers: [],
        }
        const request = {
            requestId: 'real-pause',
            target: reference,
            action: 'pause',
            phase: 'applied',
            pauseRequestId: 'real-pause',
        }
        const sdk = createMofangSDK({
            transport: {
                async request(operation, payload, options) {
                    calls.push({ operation, payload, options })
                    if (operation === 'control.get') return snapshot
                    if (operation === 'control.getRequest') return request
                    return receipt
                },
            },
        })
        assert.deepEqual(await sdk.control.pause({ target, reason: '人工暂停' }), receipt)
        assert.deepEqual(
            calls.map((call) => call.operation),
            ['control.pause'],
        )
        assert.equal('phase' in receipt, false)
        const options = { signal: new AbortController().signal, fresh: true }
        assert.deepEqual(await sdk.control.get(target, options), snapshot)
        assert.deepEqual(await sdk.control.getRequest(target, 'real-pause', options), request)
        await sdk.control.resume({ target, pauseRequestId: 'real-pause' })
        assert.deepEqual(calls, [
            {
                operation: 'control.pause',
                payload: { target, reason: '人工暂停' },
                options: undefined,
            },
            { operation: 'control.get', payload: { target }, options },
            {
                operation: 'control.getRequest',
                payload: { target, requestId: 'real-pause' },
                options,
            },
            {
                operation: 'control.resume',
                payload: { target, pauseRequestId: 'real-pause' },
                options: undefined,
            },
        ])
    })
}

test('控制写结果未知时只发送一次，核对原请求只产生读取', async () => {
    const target = { kind: 'node_run', id: 'node-run' }
    const calls = []
    const sdk = createMofangSDK({
        transportRetries: 3,
        retryDelayMs: () => 0,
        transport: {
            async request(operation, payload) {
                calls.push({ operation, payload })
                if (operation === 'control.getRequest')
                    return { requestId: 'request', target, action: 'pause', phase: 'applying' }
                throw new Error('网络中断，结果未知')
            },
        },
    })
    for (const submit of [
        () => sdk.control.pause({ target, reason: '人工暂停' }),
        () => sdk.control.resume({ target, pauseRequestId: 'real-pause' }),
    ])
        await assert.rejects(submit, /网络中断/)
    await sdk.control.getRequest(target, 'request')
    assert.deepEqual(
        calls.map((call) => call.operation),
        ['control.pause', 'control.resume', 'control.getRequest'],
    )
})

test('业务取消和继续保留独立操作，不改写为暂停恢复', async () => {
    const calls = []
    const sdk = createMofangSDK({
        transport: {
            async request(operation, payload) {
                calls.push({ operation, payload })
                return { status: 'accepted', actionId: 'continue', nodeRunId: 'node-run' }
            },
        },
    })
    await sdk.nodes.cancel('node-run')
    const body = { actionId: 'continue', nodeRunId: 'node-run', expectedGateRevision: '7' }
    await sdk.nodes.continue(body)
    assert.deepEqual(
        calls.filter((call) => call.operation !== 'context.get'),
        [
            { operation: 'nodes.cancel', payload: { nodeRunId: 'node-run' } },
            { operation: 'nodes.continue', payload: body },
        ],
    )
})

test('低代码目录包含原请求查询入口', () => {
    assert.ok(WORKFLOW_SDK_METHODS.some((method) => method.path === 'control.getRequest'))
})
