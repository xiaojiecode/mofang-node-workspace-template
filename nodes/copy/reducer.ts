import type {
    DeepReadonly,
    NodeCommand,
    NodeReducer,
    NodeTransition,
    TaskResultEvent,
    InputEvent,
} from '@mofang/node'
import type { Input, Output, State } from './contract'
import { copyTask } from './tasks/main'

export type CopyAction =
    | { readonly type: 'input'; readonly event: InputEvent<Input> }
    | { readonly type: 'result'; readonly event: TaskResultEvent<Output> }
    | { readonly type: 'input-closed' }

/** 输入和子任务结果均在纯 reducer 中转成计划；平台事实决定是否能声明生产结束。 */
export const copyReducer: NodeReducer<State, CopyAction> = (state, action, env) => {
    if (action.type === 'input') {
        const command = env.commands.spawn(copyTask, action.event.values, {
            inputRefs: [action.event.deliveryId],
        })
        return {
            state: {
                ...state,
                received: state.received + 1,
                taskIds: [...state.taskIds, command.id],
            },
            commands: [command],
            production: 'unchanged',
        }
    }
    const settled = (
        next: DeepReadonly<State>,
        commands: readonly NodeCommand[],
    ): NodeTransition<State> => ({
        state: next,
        commands,
        production:
            env.facts.inputClosed && env.facts.tasks.unresolved === 0
                ? 'declare-finished'
                : 'unchanged',
    })
    if (action.type === 'input-closed') return settled(state, [])
    const event = action.event
    // unknown 仍保留原任务关联，禁止通过再派发同一任务“查询”原结果。
    if (event.status === 'unknown')
        return {
            state: { ...state, lastError: event.error.message },
            commands: [],
            production: 'unchanged',
        }
    const next = {
        ...state,
        taskIds: state.taskIds.filter((id) => id !== event.taskId),
        lastError:
            event.status === 'succeeded'
                ? null
                : event.status === 'failed'
                  ? event.error.message
                  : event.reason,
    }
    const commands =
        event.status === 'succeeded' && event.output.items?.length
            ? [env.commands.append<Output>(event.output, { inputRefs: event.inputRefs })]
            : []
    return {
        state: next,
        commands,
        production:
            env.facts.inputClosed && env.facts.tasks.unresolved === 0
                ? 'declare-finished'
                : 'unchanged',
    }
}
