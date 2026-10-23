import { html } from 'lit'
import type { PropertyValues } from 'lit'
import {
    HostPanel,
    NodeFlowController,
    ActionController,
    panelStyles,
    productSummary,
    sectionHeading,
    statusNote,
} from '@mofang/browser'
import type { Product } from '@mofang/contracts/business'
import type { JSONObject, MofangSDK } from '@mofang/contracts/browser'

// noinspection JSUnusedGlobalSymbols
export default class SelectionPanel extends HostPanel {
    static override styles = panelStyles
    static override properties = { selected: { state: true } }
    declare private selected: ReadonlySet<string>
    private identity = ''
    private previousSDK: MofangSDK | undefined
    private readonly flow = new NodeFlowController(this, () => ({
        sdk: this.sdk,
        target: this.target,
    }))
    private readonly actions = new ActionController(
        this,
        () => ({ sdk: this.sdk, target: this.target, node: this.flow.state?.data ?? undefined }),
        () => {
            this.selected = new Set()
        },
    )

    constructor() {
        super()
        this.selected = new Set()
    }
    /** 切换真实目标才清空选择；普通资源刷新与业务拒绝保留用户勾选。 */
    protected override willUpdate(_changed: PropertyValues) {
        const key = JSON.stringify([
            this.target?.runId,
            this.target?.nodeInstanceId,
            this.target?.view,
        ])
        if (key !== this.identity || this.sdk !== this.previousSDK) {
            this.identity = key
            this.previousSDK = this.sdk
            this.selected = new Set()
        }
    }
    private toggle(key: string, checked: boolean) {
        const next = new Set(this.selected)
        if (checked) next.add(key)
        else next.delete(key)
        this.selected = next
    }
    /** 只从就绪的新 ABI 投影读取业务数据；不采用旧顶层 nodeView 兜底。 */
    override render() {
        const resource = this.flow.state
        const node = resource?.data
        if (resource?.error) return statusNote('读取失败', resource.error.message, 'error')
        if (!node) return statusNote('等待节点数据', '等待宿主提供当前节点资源。')
        const projection = node.composition.projection
        if (projection.status !== 'ready')
            return html`${statusNote('平台状态', node.status)}${statusNote(
                '业务投影不可用',
                projection.message,
                'error',
            )}`
        const rows = Array.isArray(projection.nodeView.rows)
            ? projection.nodeView.rows.filter(
                  (row): row is JSONObject =>
                      Boolean(row) && typeof row === 'object' && !Array.isArray(row),
              )
            : []
        const submit = projection.actions.find(
            (action) => action.name === 'submit' && action.presentation === 'panel',
        )
        const readOnly =
            this.target?.view === 'history' ||
            this.target?.view === 'preview' ||
            !node.permissions.canAct
        const disabled =
            readOnly ||
            this.actions.busy ||
            !submit?.availability.enabled ||
            this.selected.size === 0
        const reason =
            submit && !submit.availability.enabled
                ? submit.availability.reason
                : this.selected.size === 0
                  ? '请先勾选商品'
                  : ''
        const result = this.actions.result
        return html`${sectionHeading(
                '人工选品',
                '不选择商品也可通过宿主“结束选品”入口收尾；候选仍需审核或流转。',
            )}
            ${statusNote('平台状态', node.status)}
            ${rows.length
                ? rows.map(
                      (row) =>
                          html`<label
                              ><input
                                  type="checkbox"
                                  aria-label=${'选择商品 ' + String(row.key)}
                                  .checked=${this.selected.has(String(row.key))}
                                  ?disabled=${readOnly ||
                                  this.actions.busy ||
                                  Boolean(row.submitted)}
                                  @change=${(event: Event) =>
                                      this.toggle(
                                          String(row.key),
                                          (event.target as HTMLInputElement).checked,
                                      )}
                              />${productSummary(row.product as Product)}</label
                          >`,
                  )
                : statusNote('暂无商品', '可通过宿主必要动作区结束选品。')}
            <button
                ?disabled=${disabled}
                @click=${() => void this.actions.submit('submit', { keys: [...this.selected] })}
            >
                ${this.actions.busy ? '动作处理中' : (submit?.label ?? '提交所选商品')}
            </button>
            ${reason ? statusNote('操作条件', reason) : ''}
            ${result
                ? statusNote(
                      '本次动作',
                      result.status === 'applied'
                          ? '协调效果已应用，请继续处理候选与节点剩余义务。'
                          : (result.error?.message ?? result.status),
                  )
                : ''}
            ${this.actions.error ? statusNote('动作提示', this.actions.error, 'error') : ''}
            ${this.actions.phase === 'unknown'
                ? html`<button @click=${() => void this.actions.restore()}>读取动作记录</button
                      ><button @click=${() => this.actions.acknowledgeUnknown()}>
                          已核对记录，允许新的提交
                      </button>`
                : ''}`
    }
}
