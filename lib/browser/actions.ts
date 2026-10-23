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

/** 复用宿主 SDK 的动作资源，不自建网络/SSE；切换身份及卸载使旧请求失效。 */
export class ActionController implements ReactiveController {
    private sdk: MofangSDK | undefined
    private key = ''
    private turn = 0
    private operation = 0
    private unsubscribe: (() => void) | undefined
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
        this.unsubscribe?.()
        this.unsubscribe = undefined
        this.sdk = undefined
        this.key = ''
        this.result = null
        this.phase = 'idle'
        this.error = ''
        this.acknowledged.clear()
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
    get busy() {
        return this.phase !== 'idle'
    }
    /** 刷新后分页找回最后一条真实动作；不按 payload 猜身份。 */
    async restore() {
        const { sdk, target } = this.resolve()
        if (!sdk || !target?.runId || !target.nodeInstanceId) return
        const turn = this.turn,
            operation = this.operation
        try {
            let page = await sdk.nodeFlow.listActions({
                runId: target.runId,
                nodeInstanceId: target.nodeInstanceId,
                limit: 100,
                view: target.view === 'history' ? 'history' : 'current',
            })
            let latest: NodeActionResult | undefined
            let pages = 0
            while (true) {
                if (turn !== this.turn || operation !== this.operation) return
                if (page.items.length) latest = page.items[page.items.length - 1]
                if (!page.hasMore || !page.nextCursor) break
                if (++pages > 1000) throw new Error('动作记录过多，请在平台动作记录中核对')
                page = await sdk.nodeFlow.listActions({
                    runId: target.runId,
                    nodeInstanceId: target.nodeInstanceId,
                    cursor: page.nextCursor,
                    view: target.view === 'history' ? 'history' : 'current',
                })
            }
            if (latest && operation === this.operation) {
                if (this.phase === 'unknown') this.result = latest
                else this.track(latest.eventId, false)
            }
        } catch (error) {
            if (turn === this.turn && operation === this.operation)
                this.error = '动作记录读取失败：' + String(error)
        } finally {
            if (turn === this.turn) this.host.requestUpdate()
        }
    }
    /** 每次调用都是新操作；失败/断连不自动重发写请求。 */
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
        this.unsubscribe?.()
        this.unsubscribe = undefined
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
            this.track(receipt.eventId, true)
        } catch (error) {
            if (turn !== this.turn) return
            this.phase = 'unknown'
            this.error = '提交未取得确定回执，先核对平台动作记录。未自动重发。' + String(error)
        } finally {
            if (turn === this.turn) this.host.requestUpdate()
        }
    }
    /** 用户明确核对后才能允许一次新的提交；不能把查询结果猜作丢失回执的身份。 */
    acknowledgeUnknown() {
        if (this.phase === 'unknown') {
            this.phase = 'idle'
            this.host.requestUpdate()
        }
    }
    private track(eventId: string, clearOnApplied: boolean) {
        const { sdk, target } = this.resolve()
        if (!sdk || !target?.runId || !target.nodeInstanceId) return
        this.unsubscribe?.()
        const turn = this.turn,
            operation = this.operation
        const store = sdk.nodeFlow.watchActionResult({
            runId: target.runId,
            nodeInstanceId: target.nodeInstanceId,
            eventId,
            view: target.view === 'history' ? 'history' : 'current',
        })
        this.phase = 'tracking'
        const refresh = () => {
            if (turn !== this.turn || operation !== this.operation) return
            const snapshot = store.getSnapshot()
            if (snapshot.error)
                this.error =
                    '动作结果暂时不可读取，将按原 eventId 继续补读：' + snapshot.error.message
            if (snapshot.data) {
                this.result = snapshot.data
                this.phase = terminal(snapshot.data) ? 'idle' : 'tracking'
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
            this.host.requestUpdate()
        }
        this.unsubscribe = store.subscribe(refresh)
        refresh()
    }
}
