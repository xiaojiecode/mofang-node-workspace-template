import {
    defineNode,
    defineStateSlot,
    useNodeState,
    useTask,
    useOutputs,
    useProduction,
    useOnInput,
    useOnInputClosed,
    useNodeFacts,
    nodeView,
} from '@mofang/node'
import type { Input, Output } from './contract'
import type { TaskDefinition } from '@mofang/node'
import { inputSchema, outputSchema } from './contract'
import { approvalProgram } from './tasks/main'
import type { State } from './contract'
import { stateSchema } from './contract'

const approvalTask: TaskDefinition<Input, Output, Record<string, never>> = {
    name: 'approval',
    program: approvalProgram,
}
export const spec = {
    abi: 'mf.node/1',
    code: 'human-wait',
    inputSchema,
    outputSchema,
    state: {
        wait: defineStateSlot<State>({
            key: 'wait-state',
            schema: stateSchema,
            initial: () => ({ arrivals: 0, lastMessage: null }),
        }),
    },
    tasks: { approval: approvalTask },
    actions: {},
} as const

// noinspection JSUnusedGlobalSymbols
export default defineNode(spec, function HumanWaitNode() {
    const [state, setState] = useNodeState(spec.state.wait)
    const approval = useTask(spec.tasks.approval)
    const outputs = useOutputs<Output>()
    const production = useProduction()
    const facts = useNodeFacts()
    useOnInput<Input>((event) => {
        setState((pending) => ({ ...pending, arrivals: pending.arrivals + 1 }))
        approval.spawn(event.values, { inputRefs: [event.deliveryId] })
    })
    approval.onResult((event) => {
        if (event.status === 'unknown') {
            setState((pending) => ({
                ...pending,
                lastMessage: '结果未知，需沿平台核对原任务；不得再派发',
            }))
            return
        }
        if (event.status === 'succeeded') {
            // 用户拒绝得到空 items，结清任务但不生成空候选。
            if (event.output.items?.length)
                outputs.append(event.output, { inputRefs: event.inputRefs })
            setState((pending) => ({
                ...pending,
                lastMessage: event.output.items?.length ? '已生成候选' : '用户未保留此商品',
            }))
        } else {
            setState((pending) => ({
                ...pending,
                lastMessage: event.status === 'failed' ? event.error.message : event.reason,
            }))
        }
        if (facts.inputClosed && facts.tasks.unresolved === 0) production.finish()
    })
    useOnInputClosed(() => {
        if (facts.tasks.unresolved === 0) production.finish()
    })
    nodeView(() => ({
        arrivals: state.arrivals,
        lastMessage: state.lastMessage,
        nextStep: '待人工回答通过平台真实等待入口提交',
    }))
})
