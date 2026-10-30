import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type {
    MofangSDK,
    PanelTarget,
    ReplyNodeFlowTaskBody,
    ContinueNodeFlowTaskBody,
    TaskOperationResult,
} from '@mofang/contracts/browser'

type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
function sessionStoragePort(): StoragePort | undefined {
    try {
        return globalThis.sessionStorage
    } catch {
        return undefined
    }
}
type Binding = { sdk: MofangSDK | undefined; target: PanelTarget | undefined }
type Phase = 'idle' | 'sending' | 'tracking' | 'unknown'
type Entry = {
    phase: Phase
    error: string
    records: readonly TaskOperationResult[]
    pending: Set<string>
    uncertainSubmissions: Set<string>
    unacknowledged: boolean
    reading: boolean
    checkedUnknown: boolean
}
type Reply = Omit<ReplyNodeFlowTaskBody, 'runId' | 'nodeInstanceId' | 'view' | 'operationId'>
type Continue = Omit<ContinueNodeFlowTaskBody, 'runId' | 'nodeInstanceId' | 'view' | 'operationId'>
/** 使用系统随机数生成操作身份，不使用可预测的随机回退。 */
function operationUUID(): string {
    if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID()
    if (typeof globalThis.crypto?.getRandomValues !== 'function')
        throw new Error('浏览器无法安全生成操作身份')
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6]! & 0x0f) | 0x40
    bytes[8] = (bytes[8]! & 0x3f) | 0x80
    const h = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}
const terminal = (status: TaskOperationResult['status']) =>
    status === 'applied' || status === 'rejected' || status === 'cancelled'
const definite = (error: unknown) => {
    const failure = error as { kind?: string; httpStatus?: number } | null
    return (
        failure?.kind === 'conflict' ||
        failure?.kind === 'rejected' ||
        [400, 401, 403, 404, 409, 422].includes(failure?.httpStatus ?? 0)
    )
}
const denied = (error: unknown) => {
    const failure = error as { httpStatus?: number; code?: string } | null
    return (
        failure?.httpStatus === 401 ||
        failure?.httpStatus === 403 ||
        failure?.code === 'permission_denied' ||
        failure?.code === 'scope_changed'
    )
}

/** 子任务操作只提交一次；恢复和观察仅查询已受理的原操作。 */
export class TaskOperationController implements ReactiveController {
    private sdk: MofangSDK | undefined
    private key = ''
    private generation = 0
    private entries = new Map<string, Entry>()

    constructor(
        private host: ReactiveControllerHost,
        private resolve: () => Binding,
        private onApplied: () => void,
        private storage: StoragePort | undefined = sessionStoragePort(),
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
        this.generation++
        this.sdk = undefined
        this.key = ''
        this.entries.clear()
    }
    private bind() {
        const { sdk, target } = this.resolve()
        const key = JSON.stringify([target?.runId, target?.nodeInstanceId, target?.view])
        if (sdk === this.sdk && key === this.key) return
        this.hostDisconnected()
        this.sdk = sdk
        this.key = key
    }
    private query() {
        const { target } = this.resolve()
        if (!this.sdk || !target?.runId || !target.nodeInstanceId || target.view === 'preview')
            return undefined
        return {
            runId: target.runId,
            nodeInstanceId: target.nodeInstanceId,
            view: target.view === 'history' ? ('history' as const) : ('current' as const),
        }
    }
    private storageKey(taskId: string): string {
        const query = this.query()
        if (!query) throw new Error('缺少任务目标')
        return `workflow-task-operation:${query.runId}:${query.nodeInstanceId}:${taskId}`
    }
    private clearStored(taskId: string, operationId: string) {
        if (!this.storage) throw new Error('会话存储不可用')
        const key = this.storageKey(taskId)
        if (this.storage.getItem(key) === operationId) this.storage.removeItem(key)
    }
    private entry(taskId: string): Entry {
        let entry = this.entries.get(taskId)
        if (!entry) {
            entry = {
                phase: 'idle',
                error: '',
                records: [],
                pending: new Set(),
                uncertainSubmissions: new Set(),
                unacknowledged: false,
                reading: false,
                checkedUnknown: false,
            }
            this.entries.set(taskId, entry)
        }
        return entry
    }
    state(
        taskId: string,
    ): Readonly<Pick<Entry, 'phase' | 'error' | 'records'> & { canStartNew: boolean }> {
        const entry = this.entry(taskId)
        return {
            ...entry,
            phase: entry.reading && entry.phase === 'idle' ? 'tracking' : entry.phase,
            canStartNew:
                entry.phase === 'unknown' &&
                !entry.reading &&
                entry.checkedUnknown &&
                entry.uncertainSubmissions.size > 0,
        }
    }
    private update(entry: Entry) {
        entry.phase = entry.unacknowledged ? 'unknown' : entry.pending.size ? 'tracking' : 'idle'
        this.host.requestUpdate()
    }
    private remember(entry: Entry, result: TaskOperationResult) {
        const old = entry.records.find((record) => record.operationId === result.operationId)
        if (old && terminal(old.status)) return
        const wasPending = entry.pending.has(result.operationId)
        entry.uncertainSubmissions.delete(result.operationId)
        entry.records = [
            ...entry.records.filter((record) => record.operationId !== result.operationId),
            result,
        ].sort((a, b) => (BigInt(a.sequence) < BigInt(b.sequence) ? -1 : 1))
        if (terminal(result.status)) {
            entry.pending.delete(result.operationId)
            this.clearStored(result.taskId, result.operationId)
        } else entry.pending.add(result.operationId)
        if (result.status === 'rejected') entry.error = result.errorMessage ?? '任务操作已拒绝'
        if (wasPending && result.status === 'applied') this.onApplied()
    }
    /** 可见任务恢复固定上界记录；并发最多四个，不发起业务操作。 */
    async sync(taskIds: readonly string[]) {
        this.bind()
        const generation = this.generation
        const unique = [...new Set(taskIds)]
        for (let index = 0; index < unique.length; index += 4) {
            if (generation !== this.generation) return
            await Promise.all(unique.slice(index, index + 4).map((id) => this.recheck(id)))
        }
    }
    /** 查询原身份及历史操作，不能把其它操作的成功猜作本次提交成功。 */
    async recheck(taskId: string) {
        this.bind()
        const query = this.query(),
            sdk = this.sdk
        if (!query || !sdk) return
        const entry = this.entry(taskId),
            generation = this.generation
        if (entry.reading || entry.phase === 'sending') return
        entry.reading = true
        try {
            if (!this.storage) throw new Error('会话存储不可用')
            const saved = this.storage.getItem(this.storageKey(taskId))
            if (
                saved &&
                !entry.records.some(
                    (record) => record.operationId === saved && terminal(record.status),
                )
            ) {
                entry.pending.add(saved)
            }
            let afterSequence = '0',
                upper: string | undefined
            for (let pages = 0; ; pages++) {
                const page = await sdk.nodeFlow.listTaskOperations({
                    ...query,
                    taskId,
                    afterSequence,
                    limit: 100,
                    ...(upper === undefined ? {} : { snapshotUpperSequence: upper }),
                })
                if (generation !== this.generation) return
                upper ??= page.snapshotUpperSequence
                if (page.snapshotUpperSequence !== upper)
                    throw new Error('任务操作固定上界发生变化')
                for (const record of page.items) this.remember(entry, record)
                if (!page.nextAfterSequence) break
                if (pages >= 9 || BigInt(page.nextAfterSequence) <= BigInt(afterSequence))
                    throw new Error('任务操作记录尚未核对完整，请继续查询原操作')
                afterSequence = page.nextAfterSequence
            }
            for (const operationId of [...entry.pending]) {
                if (entry.uncertainSubmissions.has(operationId)) entry.checkedUnknown = true
                const result = await sdk.nodeFlow.getTaskOperation({
                    ...query,
                    taskId,
                    operationId,
                })
                if (generation !== this.generation) return
                this.remember(entry, result)
            }
            // 只有本次未知身份得到权威结果，才解除该身份的未知状态。
            if (!entry.pending.size) entry.unacknowledged = false
            this.update(entry)
        } catch (error) {
            if (generation !== this.generation) return
            if (denied(error)) {
                try {
                    if (this.storage) this.storage.removeItem(this.storageKey(taskId))
                } catch {
                    /* 存储不可用时保留禁写 */
                }
                this.hostDisconnected()
                this.host.requestUpdate()
                return
            }
            entry.error = '任务操作结果暂不可核对：' + String(error)
            entry.unacknowledged = true
            this.update(entry)
        } finally {
            entry.reading = false
            if (generation === this.generation) this.host.requestUpdate()
        }
    }
    reply(body: Reply) {
        return this.submit('reply', body)
    }
    continue(body: Continue) {
        return this.submit('continue', body)
    }
    private async submit(kind: 'reply' | 'continue', body: Reply | Continue) {
        this.bind()
        const query = this.query(),
            sdk = this.sdk
        if (!query || !sdk || query.view !== 'current') return
        const entry = this.entry(body.taskId)
        if (entry.phase !== 'idle' || entry.reading) return
        const generation = this.generation
        let operationId: string
        try {
            operationId = operationUUID()
            if (!this.storage) throw new Error('会话存储不可用，未提交任务操作')
            this.storage.setItem(this.storageKey(body.taskId), operationId)
        } catch (error) {
            entry.error = String(error)
            this.host.requestUpdate()
            return
        }
        entry.phase = 'sending'
        entry.checkedUnknown = false
        entry.error = ''
        entry.pending.add(operationId)
        entry.uncertainSubmissions.add(operationId)
        this.host.requestUpdate()
        try {
            const receipt =
                kind === 'reply'
                    ? await sdk.nodeFlow.replyTask({ ...(body as Reply), ...query, operationId })
                    : await sdk.nodeFlow.continueTask({
                          ...(body as Continue),
                          ...query,
                          operationId,
                      })
            if (generation !== this.generation) return
            if (
                receipt.status !== 'accepted' ||
                receipt.taskId !== body.taskId ||
                receipt.operationId !== operationId
            )
                throw new Error('任务操作回执身份不一致')
            entry.uncertainSubmissions.delete(operationId)
            entry.phase = 'tracking'
            const result = await sdk.nodeFlow.getTaskOperation({
                ...query,
                taskId: body.taskId,
                operationId,
            })
            if (generation !== this.generation) return
            this.remember(entry, result)
        } catch (error) {
            if (generation !== this.generation) return
            if (definite(error) && entry.phase === 'sending') {
                try {
                    this.clearStored(body.taskId, operationId)
                } catch (storageError) {
                    entry.unacknowledged = true
                    entry.error = '无法清理操作身份：' + String(storageError)
                    this.update(entry)
                    return
                }
                entry.pending.delete(operationId)
                entry.uncertainSubmissions.delete(operationId)
                entry.error = String(error)
            } else {
                entry.unacknowledged = true
                entry.error = '结果未知，请按原操作身份核对，不会自动重发：' + String(error)
            }
        } finally {
            if (generation === this.generation) this.update(entry)
        }
    }
    /** 用户明确结束观察后才可另发新操作；旧记录与未知提示保留。 */
    acknowledgeUnknown(taskId: string) {
        const entry = this.entry(taskId)
        if (!this.state(taskId).canStartNew) return
        try {
            for (const operationId of entry.uncertainSubmissions)
                this.clearStored(taskId, operationId)
        } catch (error) {
            entry.error = '无法清理操作身份：' + String(error)
            this.host.requestUpdate()
            return
        }
        entry.unacknowledged = false
        for (const operationId of entry.uncertainSubmissions) entry.pending.delete(operationId)
        entry.uncertainSubmissions.clear()
        this.update(entry)
    }
}
