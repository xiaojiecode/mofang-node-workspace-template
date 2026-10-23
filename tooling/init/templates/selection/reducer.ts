import type {
    NodeReducer,
    InputEvent,
    Availability,
    DeepReadonly,
    NodeFacts,
    ActionContext,
} from '@mofang/node'
import type { Input, Output, State, SubmitPayload } from './contract'

export type SelectionAction =
    | { readonly type: 'input'; readonly event: InputEvent<Input> }
    | { readonly type: 'input-closed'; readonly reason: 'completed' | 'failed' | 'cancelled' }
    | { readonly type: 'submit'; readonly payload: SubmitPayload; readonly context: ActionContext }
    | { readonly type: 'finish'; readonly context: ActionContext }

/** Project 和动作消费共用业务判据；平台权限和实时修订另由宿主检查。 */
export function canFinish(
    state: DeepReadonly<State>,
    facts: DeepReadonly<NodeFacts>,
): Availability {
    if (!facts.gate.canHandle) return { enabled: false, reason: '当前节点不能处理业务动作' }
    if (!facts.inputClosed) return { enabled: false, reason: '仍有上游输入，等待输入关闭' }
    if (facts.tasks.unknown > 0) return { enabled: false, reason: '请先核对未知任务结果' }
    if (facts.tasks.unresolved > 0) return { enabled: false, reason: '请等待子任务结清' }
    if (facts.productionDeclared || state.phase !== 'ready')
        return { enabled: false, reason: '选品已经结束或尚未就绪' }
    return { enabled: true }
}
export function canSubmit(
    state: DeepReadonly<State>,
    facts: DeepReadonly<NodeFacts>,
): Availability {
    const base = canFinish(state, facts)
    if (!base.enabled) return base
    if (state.inputReason !== 'completed')
        return { enabled: false, reason: '上游未正常结束，本例只允许不提交并结束' }
    if (!state.rows.some((row) => !row.submitted))
        return { enabled: false, reason: '没有可提交的商品，可直接结束选品' }
    return { enabled: true }
}

/** 本例聚合上游逐件到达的完整 Product；不重新定义 FastMoss 搜索或三方映射。 */
export const selectionReducer: NodeReducer<State, SelectionAction> = (state, action, env) => {
    if (action.type === 'input')
        return {
            state: {
                ...state,
                rows: [
                    ...state.rows,
                    {
                        key: action.event.deliveryId,
                        product: action.event.values.item,
                        submitted: false,
                    },
                ],
            },
            commands: [],
            production: 'unchanged',
        }
    if (action.type === 'input-closed')
        return {
            state: { ...state, phase: 'ready', inputReason: action.reason },
            commands: [],
            production: 'unchanged',
        }
    const availability =
        action.type === 'submit' ? canSubmit(state, env.facts) : canFinish(state, env.facts)
    if (!availability.enabled)
        return { kind: 'reject', code: 'selection_unavailable', message: availability.reason }
    if (action.type === 'finish')
        return {
            state: { ...state, phase: 'ended' },
            commands: [],
            production: 'declare-finished',
        }
    const rows = action.payload.keys.map((key) =>
        state.rows.find((row) => row.key === key && !row.submitted),
    )
    if (rows.some((row) => !row))
        return {
            kind: 'reject',
            code: 'selection_changed',
            message: '选择已变化，请刷新后重新勾选',
        }
    const commands = []
    // 前面先校验整批；任何失效项均使本次动作整体拒绝，不静默跳过。
    for (const row of rows) {
        if (!row) return { kind: 'reject', code: 'selection_changed', message: '商品不存在' }
        commands.push(
            env.commands.append<Output>(
                { items: [row.product], report: { sourceDeliveryId: row.key } },
                { inputRefs: [row.key] },
            ),
        )
    }
    return {
        state: {
            ...state,
            phase: 'submitted',
            rows: state.rows.map((row) =>
                action.payload.keys.includes(row.key) ? { ...row, submitted: true } : row,
            ),
        },
        commands,
        production: 'declare-finished',
    }
}
