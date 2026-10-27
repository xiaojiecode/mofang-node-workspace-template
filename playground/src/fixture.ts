import type {
    MofangSDK,
    NodeContext,
    NodeView,
    MofangResourceState,
    NodeFlowState,
    JSONObject,
    MofangSDKError,
    NodeFlowActionBody,
    NodeFlowActionQuery,
    NodeActionResult,
} from '@mofang/contracts/browser'
export function createFixture(
    input: JSONObject,
    empty = false,
    failed = false,
    preview: Partial<NodeView> = {},
) {
    const context: NodeContext = {
        sdkVersion: '1',
        contextRevision: '1',
        workflowId: 'preview-workflow',
        workspaceId: 'preview-workspace',
        spaceId: 'preview-space',
        nodeInstanceId: 'preview-node',
        nodeKey: 'preview',
        runId: 'preview-run',
        nodeRunId: 'preview-execution',
        mode: 'manual',
        view: 'preview',
        input,
        config: null,
        configRevisionId: '1',
        inboxWatermark: '1',
        predecessorRefs: [],
        output: {
            nodeRunId: 'preview-execution',
            nodeInstanceId: 'preview-node',
            runId: 'preview-run',
            status: 'succeeded',
            values: { items: empty || !input.item ? [] : [input.item!] },
        },
        state: { status: 'succeeded', phase: 'done', closure: 'closed' },
        control: {
            revision: '1',
            desiredState: 'running',
            phase: 'applied',
            reasons: [],
            inFlightToolCount: 0,
            unknownToolCount: 0,
        },
        permissions: {
            canEditConfig: false,
            canEditDefinition: false,
            canPrepare: false,
            canExecute: false,
            canCommit: false,
        },
        panel: { revisionId: 'preview', renderMode: 'lit' },
        settingsPanel: { revisionId: 'preview-settings', renderMode: 'lit' },
    }
    let nodeView: NodeView = {
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
        sessionId: 'preview-session',
        revision: '1',
        status: 'waiting',
        mode: 'manual',
        reviewPoint: true,
        inputClosed: true,
        productionFinished: true,
        nodeView: null,
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
                    received: empty || !input.item ? 0 : 1,
                    rows:
                        empty || !input.item
                            ? []
                            : [{ key: 'preview-delivery', product: input.item!, submitted: false }],
                },
                actions: [],
            },
        },
        nodeOutput: {
            runId: 'preview-run',
            nodeInstanceId: 'preview-node',
            sessionId: 'preview-session',
            total: empty || !input.item ? 0 : 1,
            page: 1,
            pageSize: 20,
            items:
                empty || !input.item
                    ? []
                    : [
                          {
                              id: 'preview-candidate',
                              revision: '1',
                              state: 'pending',
                              value: { items: [input.item!] },
                              inputRefs: ['preview-delivery'],
                              createdAt: '2026-01-01T00:00:00Z',
                              updatedAt: '2026-01-01T00:00:00Z',
                          },
                      ],
        },
        summary: {
            queued: 0,
            running: 0,
            waiting: 0,
            unknown: 0,
            failed: 0,
            unresolved: 0,
            pendingEvents: 0,
            candidates: empty || !input.item ? 0 : 1,
            pending: empty || !input.item ? 0 : 1,
            released: 0,
            removed: 0,
        },
        permissions: {
            canEdit: false,
            canRelease: false,
            canDiscard: false,
            canAct: false,
            canEndReview: false,
            canControl: false,
            canResolveUnknown: false,
        },
    }
    if (Object.prototype.hasOwnProperty.call(preview, 'nodeView') && preview.nodeView !== null)
        throw new Error('preview.json requires composition; retired nodeView is not supported')
    nodeView = { ...nodeView, ...preview, nodeView: null }
    if (empty) {
        const projection = nodeView.composition.projection
        nodeView = {
            ...nodeView,
            nodeOutput: { ...nodeView.nodeOutput, items: [], total: 0 },
            composition: {
                ...nodeView.composition,
                ...(projection.status === 'ready'
                    ? {
                          projection: {
                              ...projection,
                              nodeView: { ...projection.nodeView, rows: [], total: 0, received: 0 },
                              actions: projection.actions.map((action) =>
                                  action.name === 'submit'
                                      ? {
                                            ...action,
                                            availability: {
                                                enabled: false,
                                                reason: '本地 Mock 无商品可提交，可通过宿主结束选品',
                                            },
                                        }
                                      : action,
                              ),
                          },
                      }
                    : {}),
            },
        }
    }
    // This fixture implements only the preview methods. Unsupported calls fail explicitly.
    const error = failed
        ? (Object.assign(new Error('本地模拟的读取错误'), {
              name: 'MofangSDKError',
          }) as MofangSDKError)
        : null
    const resource: MofangResourceState<NodeContext> = {
        data: failed ? null : context,
        loading: false,
        stale: false,
        error,
        revision: '1',
    }
    let flow: NodeFlowState = {
        data: failed ? null : nodeView,
        loading: false,
        stale: false,
        error,
        revision: '1',
        refreshing: false,
    }
    const listeners = new Set<() => void>()
    const subscribe = (callback: () => void) => {
        listeners.add(callback)
        return () => listeners.delete(callback)
    }
    const contextAPI = { getState: () => resource, getSnapshot: () => resource.data, subscribe }
    const records = new Map<string, NodeActionResult>()
    const writablePermissions = nodeView.permissions
    let readOnly = false
    const refusal = (message: string, kind: 'rejected' | 'conflict' = 'rejected') =>
        Object.assign(new Error(message), { kind, retryable: false })
    const nodeFlowAPI = {
        get: async () => {
            if (error) throw error
            return nodeView
        },
        listActions: async () => ({
            items: [...records.values()],
            snapshotUpperSequence: String(records.size),
            nextCursor: null,
            hasMore: false,
        }),
        getActionResult: async (query: NodeFlowActionQuery) => {
            const result = records.get(query.eventId)
            if (!result) throw new Error('preview action not found')
            return result
        },
        watchActionResult: (query: NodeFlowActionQuery) => ({
            getSnapshot: () => ({
                data: records.get(query.eventId) ?? null,
                error: null,
                loading: false,
                stale: false,
                revision: String(records.size),
                refreshing: false,
            }),
            getState: () => ({
                data: records.get(query.eventId) ?? null,
                error: null,
                loading: false,
                stale: false,
                revision: String(records.size),
                refreshing: false,
            }),
            subscribe,
            refresh: async () => {},
        }),
        /** Explicit UI-only fixture: never invokes Goja/Workflow/Tool or real business. */
        action: async (body: NodeFlowActionBody) => {
            if (
                failed ||
                readOnly ||
                !nodeView.permissions.canAct ||
                body.runId !== nodeView.runId ||
                body.nodeInstanceId !== nodeView.nodeInstanceId
            )
                throw refusal('本地 Mock 不可写或目标范围不匹配')
            if (body.expectedSessionRevision !== nodeView.revision)
                throw refusal('本地 Mock 修订已经变化', 'conflict')
            if (!Array.isArray(body.candidates)) throw refusal('本地 Mock 需要显式候选引用数组')
            const projection = nodeView.composition.projection
            if (projection.status !== 'ready') throw refusal('preview projection unavailable')
            const action = projection.actions.find((action) => action.name === body.name)
            if (!action || !action.availability.enabled) throw refusal('preview action unavailable')
            if (body.name !== 'submit' && body.name !== 'finish')
                throw refusal('preview does not simulate this business action')
            const sequence = String(records.size + 1),
                eventId = 'preview-event-' + sequence
            let view = projection.nodeView
            let output = nodeView.nodeOutput
            let rejected = false
            if (body.name === 'submit') {
                const keys = body.payload.keys
                const rows = Array.isArray(view.rows) ? (view.rows as JSONObject[]) : []
                const valid =
                    Array.isArray(keys) &&
                    keys.length > 0 &&
                    keys.every((key) => typeof key === 'string') &&
                    new Set(keys).size === keys.length
                const selected = valid
                    ? rows.filter(
                          (row) =>
                              keys.includes(String(row.key ?? row.taskId)) &&
                              !row.submitted &&
                              row.selectable !== false,
                      )
                    : []
                if (!valid || selected.length !== keys.length) rejected = true
                else {
                    const items = selected.map((row, index) => ({
                        id: 'preview-candidate-' + sequence + '-' + index,
                        revision: '1',
                        state: 'pending' as const,
                        value: {
                            items: [row.product!],
                            ...(typeof view.taskId === 'string'
                                ? { collectionTaskId: view.taskId }
                                : {}),
                        },
                        inputRefs: [],
                        createdAt: '2026-10-23T00:00:00Z',
                        updatedAt: '2026-10-23T00:00:00Z',
                    }))
                    output = {
                        ...output,
                        items: [...output.items, ...items],
                        total: output.total + items.length,
                    }
                    view = {
                        ...view,
                        phase: 'submitted',
                        submitted: Number(view.submitted ?? 0) + items.length,
                        ...(Array.isArray(view.selectedIds) ? { selectedIds: keys } : {}),
                        rows: rows.map((row) =>
                            keys.includes(String(row.key ?? row.taskId))
                                ? { ...row, submitted: true }
                                : row,
                        ),
                    }
                }
            } else {
                if (Object.keys(body.payload).length || body.candidates.length)
                    throw refusal('本地 Mock finish必须显式空payload和候选引用')
                view = { ...view, phase: 'closed' }
            }
            const result: NodeActionResult = {
                eventId,
                sequence,
                name: body.name,
                status: rejected ? 'rejected' : 'applied',
                actor: { userId: 'preview-user', workspaceId: 'preview-workspace', role: 'user' },
                createdAt: '2026-10-23T00:00:00Z',
                updatedAt: '2026-10-23T00:00:00Z',
                ...(rejected
                    ? {
                          error: {
                              code: 'FIXTURE_SELECTION_CHANGED',
                              message: '本地fixture选择已变化',
                          },
                      }
                    : { processedRevision: String(Number(nodeView.revision) + 1) }),
            }
            records.set(eventId, result)
            if (!rejected) {
                const revision = String(Number(nodeView.revision) + 1)
                nodeView = {
                    ...nodeView,
                    revision,
                    productionFinished: true,
                    nodeOutput: output,
                    summary: {
                        ...nodeView.summary,
                        pending: output.items.filter((item) => item.state === 'pending').length,
                        candidates: output.total,
                    },
                    composition: {
                        ...nodeView.composition,
                        snapshot: { ...nodeView.composition.snapshot, sessionRevision: revision },
                        projection: {
                            ...projection,
                            nodeView: view,
                            actions: projection.actions.map((action) => ({
                                ...action,
                                availability: {
                                    enabled: false,
                                    reason: 'Mock 生产已结束，已有候选仍需处理',
                                },
                            })),
                        },
                    },
                }
                flow = { ...flow, data: nodeView, revision }
            }
            listeners.forEach((listener) => listener())
            return { eventId, sequence, status: 'accepted' as const }
        },
        watch: () => ({
            getSnapshot: () => flow,
            getState: () => flow,
            subscribe,
            refresh: async () => {},
        }),
    }
    const partial = { context: contextAPI, nodeFlow: nodeFlowAPI }
    const sdk = new Proxy(partial, {
        get(target, key) {
            if (key in target) return Reflect.get(target, key)
            throw new Error('本地预览未实现 SDK 方法：' + String(key))
        },
    }) as unknown as MofangSDK
    return {
        sdk,
        context,
        get nodeView() {
            return nodeView
        },
        listeners,
        setReadOnly(value: boolean) {
            readOnly = value
            nodeView = {
                ...nodeView,
                permissions: value
                    ? {
                          ...writablePermissions,
                          canAct: false,
                          canEdit: false,
                          canRelease: false,
                          canDiscard: false,
                          canEndReview: false,
                          canControl: false,
                          canResolveUnknown: false,
                      }
                    : writablePermissions,
            }
            flow = { ...flow, data: failed ? null : nodeView }
            listeners.forEach((listener) => listener())
        },
        notify: () => listeners.forEach((listener) => listener()),
    }
}
