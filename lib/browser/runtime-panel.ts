import { html, nothing } from 'lit'
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js'
import type {
    JSONObject,
    MofangSDK,
    NodeCandidate,
    NodeFlowTaskView,
    NodeTask,
    PanelTarget,
} from '@mofang/contracts/browser'
import { HostPanel, NodeFlowController } from './host'
import { button, checkbox, textarea, statusNote, panelStyles } from './ui/index'
import { ActionController } from './actions'
import { TaskOperationController } from './task-operation-controller'

/** 在节点面板内部提供平台声明的动作、候选和任务处理入口。 */
export class NodeRuntimePanel extends HostPanel {
    static override styles = panelStyles
    private flow = new NodeFlowController(this, () => ({ sdk: this.sdk, target: this.target }))
    private actions = new ActionController(
        this,
        () => ({ sdk: this.sdk, target: this.target, node: this.flow.state?.data ?? undefined }),
        () => void this.refresh(),
    )
    private taskOperations = new TaskOperationController(
        this,
        () => ({ sdk: this.sdk, target: this.target }),
        () => void this.refresh(),
    )
    private key = ''
    private boundSdk: MofangSDK | undefined
    private turn = 0
    private stopMessages: (() => void) | undefined
    private timer: ReturnType<typeof setInterval> | undefined
    private candidates: readonly NodeCandidate[] = []
    private tasks: readonly NodeFlowTaskView[] = []
    private taskPage = 1
    private taskTotal = 0
    private failedTasks: readonly NodeTask[] = []
    private failedPage = 1
    private failedTotal = 0
    private refreshSeq = 0
    private outcomeUnknown = false
    private readError = false
    private total = 0
    private page = 1
    private selected = new Map<string, string>()
    private drafts = new Map<string, { value: string; revision: string }>()
    private error = ''
    private busy = false
    private taskAnswers: Record<string, string> = {}
    private conclusions: Record<string, string> = {}
    private readonly pageSize = 20

    override disconnectedCallback() {
        super.disconnectedCallback()
        this.reset()
    }
    private reset() {
        this.turn++
        this.stopMessages?.()
        this.stopMessages = undefined
        if (this.timer) clearInterval(this.timer)
        this.timer = undefined
        this.key = ''
        this.boundSdk = undefined
        this.candidates = []
        this.page = 1
        this.total = 0
        this.tasks = []
        this.taskPage = 1
        this.taskTotal = 0
        this.failedTasks = []
        this.failedPage = 1
        this.failedTotal = 0
        this.refreshSeq++
        this.outcomeUnknown = false
        this.readError = false
        this.selected.clear()
        this.drafts.clear()
        this.error = ''
        this.busy = false
        this.taskAnswers = {}
        this.conclusions = {}
    }
    protected override updated() {
        const key = JSON.stringify([
            this.target?.runId,
            this.target?.nodeInstanceId,
            this.target?.view,
        ])
        if (key === this.key && this.sdk === this.boundSdk) return
        this.reset()
        this.key = key
        this.boundSdk = this.sdk
        if (
            !this.sdk ||
            !this.target?.runId ||
            !this.target.nodeInstanceId ||
            this.target.view === 'preview'
        )
            return
        const sdk = this.sdk
        const runId = this.target.runId
        if (this.target.view !== 'history') {
            this.stopMessages = sdk.messages.subscribe({ runId }, () => void this.refresh())
            this.timer = setInterval(() => void this.refresh(), 15000)
        }
        void this.refresh()
    }
    private get query() {
        if (!this.target?.runId || !this.target.nodeInstanceId) return undefined
        return {
            runId: this.target.runId,
            nodeInstanceId: this.target.nodeInstanceId,
            view: this.target.view === 'history' ? ('history' as const) : ('current' as const),
        }
    }
    private get writable() {
        return Boolean(
            this.query &&
            this.target?.view !== 'history' &&
            this.target?.view !== 'preview' &&
            !this.flow.state?.refreshing &&
            !this.flow.state?.stale &&
            !this.busy &&
            !this.outcomeUnknown &&
            !this.readError,
        )
    }
    private async refresh() {
        const sdk = this.sdk,
            query = this.query,
            turn = this.turn,
            sequence = ++this.refreshSeq
        if (!sdk || !query) return
        try {
            const [candidates, tasks, failed] = await Promise.all([
                sdk.nodeFlow.listCandidates({ ...query, page: this.page, pageSize: this.pageSize }),
                sdk.nodeFlow.tasks({ ...query, page: this.taskPage, pageSize: this.pageSize }),
                sdk.nodes.tasks({
                    runId: query.runId,
                    nodeInstanceId: query.nodeInstanceId,
                    status: 'failed',
                    page: this.failedPage,
                    pageSize: this.pageSize,
                }),
            ])
            if (turn !== this.turn || sequence !== this.refreshSeq) return
            const candidateLast = Math.max(1, Math.ceil(candidates.total / this.pageSize))
            const taskLast = Math.max(1, Math.ceil(tasks.total / this.pageSize))
            const failedLast = Math.max(1, Math.ceil(failed.total / this.pageSize))
            if (
                this.page > candidateLast ||
                this.taskPage > taskLast ||
                this.failedPage > failedLast
            ) {
                this.page = Math.min(this.page, candidateLast)
                this.taskPage = Math.min(this.taskPage, taskLast)
                this.failedPage = Math.min(this.failedPage, failedLast)
                void this.refresh()
                return
            }
            this.readError = false
            this.failedTasks = failed.items
            this.failedTotal = failed.total
            for (const candidate of candidates.items) {
                if (
                    this.selected.has(candidate.id) &&
                    (candidate.state !== 'pending' ||
                        this.selected.get(candidate.id) !== candidate.revision)
                )
                    this.selected.delete(candidate.id)
            }
            this.candidates = candidates.items
            this.total = candidates.total
            this.tasks = tasks.items
            this.taskTotal = tasks.total
            void this.taskOperations.sync(tasks.items.map((task) => task.id))
        } catch (error) {
            if (turn === this.turn && sequence === this.refreshSeq) {
                this.error = '读取节点事实失败：' + String(error)
                this.readError = true
                this.candidates = []
                this.failedTasks = []
                this.tasks = []
                this.selected.clear()
            }
        }
        if (turn === this.turn) this.requestUpdate()
    }
    private async mutate(fn: () => Promise<unknown>) {
        if (!this.writable || this.busy) return
        const turn = this.turn
        this.busy = true
        this.error = ''
        this.requestUpdate()
        try {
            await fn()
            if (turn === this.turn) await this.refresh()
        } catch (error) {
            if (turn === this.turn) {
                const known = error as { kind?: string; httpStatus?: number }
                const definite =
                    known?.kind === 'conflict' ||
                    known?.kind === 'rejected' ||
                    known?.httpStatus === 401 ||
                    known?.httpStatus === 403
                this.error =
                    (definite ? '操作已拒绝：' : '操作结果未确认，请核对原记录：') + String(error)
                this.outcomeUnknown = !definite
            }
        } finally {
            if (turn === this.turn) {
                this.busy = false
                this.requestUpdate()
            }
        }
    }
    private async batch(kind: 'release' | 'discard') {
        const node = this.flow.state?.data,
            q = this.query,
            sdk = this.sdk
        if (
            !node ||
            !q ||
            !sdk ||
            !node.permissions[kind === 'release' ? 'canRelease' : 'canDiscard']
        )
            return
        const candidates = [...this.selected].map(([id, expectedRevision]) => ({
            id,
            expectedRevision,
        }))
        if (!candidates.length || this.drafts.size) return
        await this.mutate(async () => {
            const result = await sdk.nodeFlow[kind]({ ...q, candidates })
            for (const item of result.items) {
                if (item.status === 'applied') this.selected.delete(item.id)
                else this.error += `${item.id}: ${item.error?.message ?? '未处理'}；`
            }
        })
    }
    private async reloadCandidate(candidate: NodeCandidate) {
        const sdk = this.sdk,
            q = this.query,
            turn = this.turn
        if (!sdk || !q) return
        try {
            const page = await sdk.nodeFlow.listCandidates({
                ...q,
                page: this.page,
                pageSize: this.pageSize,
            })
            if (turn !== this.turn) return
            const current = page.items.find((item) => item.id === candidate.id)
            if (!current) throw new Error('候选已不在当前页，请重新核对')
            this.candidates = page.items
            this.total = page.total
            this.selected.delete(candidate.id)
            this.drafts.set(candidate.id, {
                value: JSON.stringify(current.value, null, 2),
                revision: current.revision,
            })
            this.error = ''
        } catch (error) {
            if (turn === this.turn) this.error = '重载候选失败：' + String(error)
        }
        if (turn === this.turn) this.requestUpdate()
    }
    private async saveCandidate(candidate: NodeCandidate) {
        const sdk = this.sdk,
            q = this.query,
            draft = this.drafts.get(candidate.id),
            node = this.flow.state?.data
        if (
            !sdk ||
            !q ||
            !draft ||
            !node?.permissions.canEdit ||
            candidate.state !== 'pending' ||
            !this.writable
        )
            return
        let value: unknown
        try {
            value = JSON.parse(draft.value)
            if (!value || typeof value !== 'object' || Array.isArray(value))
                throw new Error('候选内容必须是 JSON 对象')
        } catch (error) {
            this.error = '候选格式错误：' + String(error)
            this.requestUpdate()
            return
        }
        await this.mutate(async () => {
            await sdk.nodeFlow.editCandidate({
                ...q,
                candidateId: candidate.id,
                expectedRevision: draft.revision,
                value: value as JSONObject,
            })
            this.drafts.delete(candidate.id)
            this.selected.delete(candidate.id)
        })
    }
    protected override render() {
        const node = this.flow.state?.data,
            q = this.query,
            sdk = this.sdk
        if (!q || !sdk || !node) return nothing
        const declared =
            node.composition.projection.status === 'ready'
                ? node.composition.projection.actions.filter((a) => a.presentation === 'host')
                : []
        const pageButtons = (
            page: number,
            total: number,
            label: string,
            set: (n: number) => void,
        ) =>
            html` ${button({
                    label: `${label}上一页`,
                    disabled: page <= 1,
                    onClick: () => {
                        set(page - 1)
                        void this.refresh()
                    },
                })}
                <span>${page}</span>
                ${button({
                    label: `${label}下一页`,
                    disabled: page * this.pageSize >= total,
                    onClick: () => {
                        set(page + 1)
                        void this.refresh()
                    },
                })}`
        return html`<section aria-label="节点执行与审核">
            ${this.panelError ? statusNote('页面更新失败', this.panelError, 'warning') : nothing}
            <h3>节点状态：${node.status}</h3>
            ${this.error ? statusNote('操作提示', this.error, 'error') : nothing}
            ${this.outcomeUnknown
                ? button({
                      label: '已人工核对原结果',
                      onClick: () => {
                          this.outcomeUnknown = false
                          this.requestUpdate()
                      },
                  })
                : nothing}
            ${this.actions.error ? statusNote('动作提示', this.actions.error, 'error') : nothing}
            ${declared.map(
                (action) =>
                    html`${button({
                        label: action.label,
                        disabled:
                            !this.writable ||
                            !node.permissions.canAct ||
                            !action.availability.enabled ||
                            this.actions.busy,
                        onClick: () => void this.actions.submit(action.name, {}),
                    })}${!action.availability.enabled
                        ? html`<span>${action.availability.reason}</span>`
                        : nothing}`,
            )}
            ${this.actions.records.map(
                (record) =>
                    html`<p>
                        动作 ${record.name}：${record.status}（${record.eventId}）
                        ${record.error?.message ?? ''}
                    </p>`,
            )}
            ${this.actions.phase === 'unknown'
                ? html`${button({
                      label: '核对动作记录',
                      onClick: () => void this.actions.restore(),
                  })}${button({
                      label: '已人工核对动作记录',
                      onClick: () => this.actions.acknowledgeUnknown(),
                  })}`
                : nothing}
            <h4>候选（${this.total}）</h4>
            ${this.candidates.map((candidate) => {
                const draft = this.drafts.get(candidate.id)
                return html`<div>
                    ${checkbox({
                        label: `${candidate.id} ${candidate.state}`,
                        checked: this.selected.has(candidate.id),
                        disabled: !this.writable || candidate.state !== 'pending',
                        onChange: (checked) => {
                            if (checked) this.selected.set(candidate.id, candidate.revision)
                            else this.selected.delete(candidate.id)
                            this.requestUpdate()
                        },
                    })}
                    ${draft
                        ? html`${textarea({
                              name: 'candidate-' + candidate.id,
                              label: '候选内容',
                              value: draft.value,
                              readOnly: !this.writable || !node.permissions.canEdit,
                              onChange: (value) => {
                                  this.drafts.set(candidate.id, { ...draft, value })
                                  this.requestUpdate()
                              },
                          })}
                          ${button({
                              label: '保存候选',
                              disabled: !this.writable || !node.permissions.canEdit,
                              onClick: () => void this.saveCandidate(candidate),
                          })}
                          ${button({
                              label: '取消编辑',
                              onClick: () => {
                                  this.drafts.delete(candidate.id)
                                  this.requestUpdate()
                              },
                          })}
                          ${button({
                              label: '重载候选',
                              onClick: () => void this.reloadCandidate(candidate),
                          })}`
                        : html`<pre>${JSON.stringify(candidate.value, null, 2)}</pre>
                              ${candidate.state === 'pending' && node.permissions.canEdit
                                  ? button({
                                        label: '编辑候选',
                                        disabled: !this.writable,
                                        onClick: () => {
                                            this.drafts.set(candidate.id, {
                                                value: JSON.stringify(candidate.value, null, 2),
                                                revision: candidate.revision,
                                            })
                                            this.requestUpdate()
                                        },
                                    })
                                  : nothing}`}
                </div>`
            })}
            ${button({
                label: '放行所选',
                disabled:
                    !this.writable ||
                    !node.permissions.canRelease ||
                    !this.selected.size ||
                    this.drafts.size > 0,
                onClick: () => void this.batch('release'),
            })}
            ${button({
                label: '丢弃所选',
                disabled:
                    !this.writable ||
                    !node.permissions.canDiscard ||
                    !this.selected.size ||
                    this.drafts.size > 0,
                onClick: () => void this.batch('discard'),
            })}
            ${button({
                label: '结束审核',
                disabled: !this.writable || !node.permissions.canEndReview,
                onClick: () =>
                    void this.mutate(() =>
                        sdk.nodeFlow.endReview({ ...q, expectedRevision: node.revision }),
                    ),
            })}
            ${pageButtons(this.page, this.total, '候选', (n) => {
                this.page = n
            })}
            <h4>失败任务（${this.failedTotal}）</h4>
            ${this.failedTasks.map(
                (task) => html`<p>${task.taskId}：${task.error ?? task.status}</p>`,
            )}
            ${pageButtons(this.failedPage, this.failedTotal, '失败任务', (n) => {
                this.failedPage = n
            })}
            <h4>任务（${this.taskTotal}）</h4>
            ${this.tasks.map(
                (task) =>
                    html`<div>
                        <p>${task.handler}：${task.status} ${task.error?.message ?? ''}</p>
                        ${button({
                            label: '核对操作',
                            onClick: () => void this.taskOperations.recheck(task.id),
                        })}
                        ${this.taskOperations
                            .state(task.id)
                            .records.map(
                                (record) =>
                                    html`<p>
                                        操作 ${record.operationId}：${record.status}
                                        ${record.errorMessage ?? ''}
                                    </p>`,
                            )}
                        ${this.taskOperations.state(task.id).error
                            ? statusNote(
                                  '任务操作',
                                  this.taskOperations.state(task.id).error,
                                  'error',
                              )
                            : nothing}
                        ${this.taskOperations.state(task.id).phase === 'unknown' &&
                        this.taskOperations.state(task.id).canStartNew
                            ? button({
                                  label: '已人工核对任务操作',
                                  onClick: () => this.taskOperations.acknowledgeUnknown(task.id),
                              })
                            : nothing}
                        ${task.waiting
                            ? html`<p>${task.waiting.prompt}</p>
                                  ${textarea({
                                      name: 'answer-' + task.id,
                                      label: '任务回答',
                                      value: this.taskAnswers[task.id] ?? '',
                                      readOnly: !this.writable || !node.permissions.canAct,
                                      onChange: (value) => {
                                          this.taskAnswers[task.id] = value
                                      },
                                  })}
                                  ${button({
                                      label: '提交回答',
                                      disabled:
                                          !this.writable ||
                                          !node.permissions.canAct ||
                                          this.taskOperations.state(task.id).phase !== 'idle',
                                      onClick: () => void this.replyTask(task),
                                  })}
                                  ${button({
                                      label: '继续任务',
                                      disabled:
                                          !this.writable ||
                                          !node.permissions.canAct ||
                                          this.taskOperations.state(task.id).phase !== 'idle',
                                      onClick: () => void this.continueTask(task),
                                  })}`
                            : nothing}
                        ${task.status === 'unknown' && node.permissions.canResolveUnknown
                            ? html`${textarea({
                                  name: 'evidence-' + task.id,
                                  label: '核对证据',
                                  value: this.conclusions[task.id] ?? '',
                                  readOnly: !this.writable,
                                  onChange: (value) => {
                                      this.conclusions[task.id] = value
                                  },
                              })}
                              ${(['succeeded', 'failed'] as const).map((conclusion) =>
                                  button({
                                      label: conclusion === 'succeeded' ? '确认成功' : '确认失败',
                                      disabled: !this.writable,
                                      onClick: () =>
                                          void this.mutate(() =>
                                              sdk.nodeFlow.resolveUnknownTask({
                                                  ...q,
                                                  taskId: task.id,
                                                  expectedRevision: task.revision,
                                                  conclusion,
                                                  evidence: this.conclusions[task.id] ?? '',
                                              }),
                                          ),
                                  }),
                              )}`
                            : nothing}
                    </div>`,
            )}
            ${pageButtons(this.taskPage, this.taskTotal, '任务', (n) => {
                this.taskPage = n
            })}
            ${node.permissions.canControl
                ? html` ${button({
                      label: '暂停节点',
                      disabled: !this.writable,
                      onClick: () => void this.mutate(() => sdk.nodeFlow.pause(q)),
                  })}
                  ${button({
                      label: '继续节点',
                      disabled: !this.writable,
                      onClick: () => void this.mutate(() => sdk.nodeFlow.resume(q)),
                  })}
                  ${button({
                      label: '取消节点',
                      disabled: !this.writable,
                      onClick: () => void this.mutate(() => sdk.nodeFlow.cancel(q)),
                  })}`
                : nothing}
        </section>`
    }
    private async replyTask(task: NodeFlowTaskView) {
        if (!this.writable || !this.flow.state?.data?.permissions.canAct || !task.waiting) return
        await this.taskOperations.reply({
            taskId: task.id,
            waitingToolCallId: task.waiting.waitingToolCallId,
            answer: this.taskAnswers[task.id] ?? '',
        })
    }
    private async continueTask(task: NodeFlowTaskView) {
        if (!this.writable || !this.flow.state?.data?.permissions.canAct || !task.waiting) return
        await this.taskOperations.continue({
            taskId: task.id,
            expectedWaitingTurn: task.waiting.turn,
        })
    }
}
let runtimeSequence = 0
let runtimeTag = ''
do {
    runtimeTag = 'mf-node-runtime-' + ++runtimeSequence
} while (customElements.get(runtimeTag))
customElements.define(runtimeTag, NodeRuntimePanel)

/** 将公共运行能力嵌入 Lit 业务正文，SDK 和目标由宿主注入。 */
export function nodeRuntimePanel(props: {
    sdk: MofangSDK | undefined
    target: PanelTarget | undefined
    panelError?: string | undefined
}) {
    const tag = unsafeStatic(runtimeTag)
    return staticHtml`<${tag} .sdk=${props.sdk} .target=${props.target} .panelError=${props.panelError}></${tag}>`
}
