import type {
    MofangSDK,
    NodeContext,
    NodeView,
    MofangResourceState,
    NodeFlowState,
    JSONObject,
    MofangSDKError,
} from '@mofang/contracts/browser'
export function createFixture(input: JSONObject, empty = false, failed = false) {
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
            values: { items: empty ? [] : [input.item!] },
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
    const nodeView: NodeView = {
        runId: 'preview-run',
        nodeInstanceId: 'preview-node',
        sessionId: 'preview-session',
        revision: '1',
        status: 'waiting',
        mode: 'manual',
        reviewPoint: true,
        inputClosed: true,
        productionFinished: true,
        nodeView: { started: true, received: empty ? 0 : 1 },
        nodeOutput: {
            runId: 'preview-run',
            nodeInstanceId: 'preview-node',
            sessionId: 'preview-session',
            total: empty ? 0 : 1,
            page: 1,
            pageSize: 20,
            items: empty
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
            candidates: empty ? 0 : 1,
            pending: empty ? 0 : 1,
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
    const flow: NodeFlowState = {
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
    const nodeFlowAPI = {
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
        nodeView,
        listeners,
        notify: () => listeners.forEach((listener) => listener()),
    }
}
