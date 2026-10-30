import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type {
    MofangSDK,
    NodeView,
    NodeActionResult,
    JSONObject,
    PanelTarget,
} from '@mofang/contracts/browser'

type Target = {
    sdk: MofangSDK | undefined
    target: PanelTarget | undefined
    node: NodeView | undefined
}
const terminal = (result: NodeActionResult) =>
    ['applied', 'rejected', 'failed', 'cancelled'].includes(result.status)
const definite = (error: unknown) => {
    const value = error as { kind?: string; httpStatus?: number } | null
    return (
        value?.kind === 'conflict' ||
        value?.kind === 'rejected' ||
        value?.httpStatus === 401 ||
        value?.httpStatus === 403
    )
}
const denied = (error: unknown) => {
    const value = error as { code?: string; httpStatus?: number } | null
    return (
        value?.httpStatus === 401 ||
        value?.httpStatus === 403 ||
        value?.code === 'scope_changed' ||
        value?.code === 'permission_denied'
    )
}

/** 复用宿主SDK；所有已知待处理事件各自补读，绝不把最后一条记录猜作原提交。 */
export class ActionController implements ReactiveController {
    private sdk: MofangSDK | undefined
    private key = ''
    private turn = 0
    private operation = 0
    private restoring = false
    private unknown = false
    private subscriptions = new Map<string, () => void>()
    private outcomes = new Map<string, NodeActionResult>()
    private pending = new Set<string>()
    private acknowledged = new Set<string>()
    result: NodeActionResult | null = null
    error = ''
    phase: 'idle' | 'sending' | 'tracking' | 'unknown' = 'idle'

    constructor(
        private host: ReactiveControllerHost,
        private resolve: () => Target,
        private onApplied: () => void,
    ) {
        host.addController(this)
    }
    hostConnected() {
        this.bind()
    }
    hostUpdate() {
        this.bind()
    }
    hostDisconnected() {
        this.turn++
        this.operation++
        this.release()
        this.sdk = undefined
        this.key = ''
        this.result = null
        this.phase = 'idle'
        this.error = ''
        this.restoring = false
        this.unknown = false
        this.outcomes.clear()
        this.pending.clear()
        this.acknowledged.clear()
    }
    private release() {
        for (const stop of this.subscriptions.values()) stop()
        this.subscriptions.clear()
    }
    private bind() {
        const { sdk, target } = this.resolve()
        const key = JSON.stringify([target?.runId, target?.nodeInstanceId, target?.view])
        if (sdk === this.sdk && key === this.key) return
        this.hostDisconnected()
        this.sdk = sdk
        this.key = key
        if (sdk && target?.runId && target.nodeInstanceId && target.view !== 'preview')
            void this.restore()
    }
    get records(): readonly NodeActionResult[] {
        return [...this.outcomes.values()].sort((a, b) =>
            BigInt(a.sequence) < BigInt(b.sequence) ? -1 : 1,
        )
    }
    get busy() {
        return this.phase !== 'idle'
    }
    private updatePhase() {
        this.phase = this.unknown
            ? 'unknown'
            : this.restoring || this.pending.size
              ? 'tracking'
              : 'idle'
    }
    private remember(result: NodeActionResult) {
        const previous = this.outcomes.get(result.eventId)
        if (previous && terminal(previous)) return
        this.outcomes.set(result.eventId, result)
        if (terminal(result)) this.pending.delete(result.eventId)
        else this.pending.add(result.eventId)
        let latest: NodeActionResult | undefined, latestPending: NodeActionResult | undefined
        for (const item of this.outcomes.values()) {
            if (!latest || BigInt(item.sequence) > BigInt(latest.sequence)) latest = item
            if (
                this.pending.has(item.eventId) &&
                (!latestPending || BigInt(item.sequence) > BigInt(latestPending.sequence))
            )
                latestPending = item
        }
        this.result = latestPending ?? latest ?? null
    }
    /** 固定上界最多扫描10页；所有未终态按4个一批补读，再订阅仍待处理的身份。 */
    async restore() {
        const { sdk, target } = this.resolve()
        if (
            !sdk ||
            !target?.runId ||
            !target.nodeInstanceId ||
            this.restoring ||
            this.phase === 'sending'
        )
            return
        const turn = this.turn,
            operation = this.operation
        const current = () => turn === this.turn && operation === this.operation
        const query = {
            runId: target.runId,
            nodeInstanceId: target.nodeInstanceId,
            view: target.view === 'history' ? ('history' as const) : ('current' as const),
        }
        this.restoring = true
        this.updatePhase()
        this.host.requestUpdate()
        try {
            let page = await sdk.nodeFlow.listActions({ ...query, afterSequence: '0', limit: 100 })
            const upper = page.snapshotUpperSequence
            let pages = 0
            while (true) {
                if (!current()) return
                if (page.snapshotUpperSequence !== upper)
                    throw new Error('动作列表固定上界发生变化，请重新核对')
                for (const result of page.items) this.remember(result)
                pages++
                if (!page.hasMore) break
                if (!page.nextCursor) throw new Error('动作记录分页回执不完整')
                if (pages >= 10)
                    throw new Error('动作记录尚未核对完整（超过10页），请按原事件身份继续核对')
                page = await sdk.nodeFlow.listActions({ ...query, cursor: page.nextCursor })
            }
            const ids = [...this.pending]
            for (let index = 0; index < ids.length; index += 4) {
                if (!current()) return
                const results = await Promise.all(
                    ids.slice(index, index + 4).map(async (eventId) => {
                        try {
                            return {
                                value: await sdk.nodeFlow.getActionResult({ ...query, eventId }),
                            }
                        } catch (error) {
                            return { error }
                        }
                    }),
                )
                if (!current()) return
                for (const result of results) {
                    if (result.value) this.remember(result.value)
                    else if (denied(result.error)) {
                        this.invalidateScope(result.error)
                        return
                    } else
                        this.error =
                            '动作结果暂不可读取，将按原 eventId 继续补读：' + String(result.error)
                }
            }
        } catch (error) {
            if (!current()) return
            if (denied(error)) {
                this.invalidateScope(error)
                return
            }
            this.unknown = true
            this.error = '动作记录读取未完成：' + String(error)
        } finally {
            if (current()) {
                this.restoring = false
                for (const eventId of this.pending) this.track(eventId, false)
                this.updatePhase()
                this.host.requestUpdate()
            }
        }
    }
    /** 确定冲突/拒绝保留选择；仅无确定受理结果时进入人工核对，不自动重发。 */
    async submit(name: string, payload: JSONObject) {
        const { sdk, target, node } = this.resolve()
        if (
            this.busy ||
            !sdk ||
            !target?.runId ||
            !target.nodeInstanceId ||
            target.view === 'history' ||
            target.view === 'preview' ||
            !node?.permissions.canAct
        )
            return
        const turn = this.turn
        this.operation++
        this.release()
        this.outcomes.clear()
        this.pending.clear()
        this.unknown = false
        this.phase = 'sending'
        this.error = ''
        this.result = null
        this.host.requestUpdate()
        try {
            const receipt = await sdk.nodeFlow.action({
                runId: target.runId,
                nodeInstanceId: target.nodeInstanceId,
                name,
                payload,
                expectedSessionRevision: node.revision,
                candidates: [],
            })
            if (turn !== this.turn) return
            this.pending.add(receipt.eventId)
            this.track(receipt.eventId, true)
            this.updatePhase()
        } catch (error) {
            if (turn !== this.turn) return
            this.unknown = !definite(error)
            this.error = this.unknown
                ? '提交未取得确定回执，先核对平台动作记录。未自动重发。' + String(error)
                : String(error)
            this.updatePhase()
        } finally {
            if (turn === this.turn) this.host.requestUpdate()
        }
    }
    acknowledgeUnknown() {
        if (this.phase === 'unknown') {
            this.unknown = false
            this.updatePhase()
            this.host.requestUpdate()
        }
    }
    private invalidateScope(error: unknown) {
        this.operation++
        this.release()
        this.outcomes.clear()
        this.pending.clear()
        this.result = null
        this.restoring = false
        this.unknown = true
        this.error = '身份或权限已变化，请重新核对节点：' + String(error)
        this.updatePhase()
        this.host.requestUpdate()
    }
    private track(eventId: string, clearOnApplied: boolean) {
        const { sdk, target } = this.resolve()
        if (!sdk || !target?.runId || !target.nodeInstanceId || this.subscriptions.has(eventId))
            return
        const turn = this.turn,
            operation = this.operation
        const store = sdk.nodeFlow.watchActionResult({
            runId: target.runId,
            nodeInstanceId: target.nodeInstanceId,
            eventId,
            view: target.view === 'history' ? 'history' : 'current',
        })
        const refresh = () => {
            if (turn !== this.turn || operation !== this.operation) return
            const snapshot = store.getSnapshot()
            if (snapshot.error) {
                if (denied(snapshot.error)) {
                    this.invalidateScope(snapshot.error)
                    return
                }
                this.error =
                    '动作结果暂时不可读取，将按原 eventId 继续补读：' + snapshot.error.message
            }
            if (snapshot.data) {
                this.remember(snapshot.data)
                if (terminal(snapshot.data)) {
                    this.subscriptions.get(eventId)?.()
                    this.subscriptions.delete(eventId)
                }
                if (!snapshot.error) this.error = ''
                if (
                    clearOnApplied &&
                    snapshot.data.status === 'applied' &&
                    !this.acknowledged.has(eventId)
                ) {
                    this.acknowledged.add(eventId)
                    this.onApplied()
                }
            }
            this.updatePhase()
            this.host.requestUpdate()
        }
        this.subscriptions.set(eventId, store.subscribe(refresh))
        refresh()
    }
}
