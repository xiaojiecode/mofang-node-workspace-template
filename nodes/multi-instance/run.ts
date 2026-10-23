import {
    defineNode,
    defineStateSlot,
    useNodeState,
    useOnInput,
    useOnInputClosed,
    useOutputs,
    useProduction,
    nodeView,
} from '@mofang/node'
import type { Input, Output } from './contract'
import { inputSchema, outputSchema } from './contract'
import type { Counter } from './contract'
import { counterSchema } from './contract'

/** 静态纯工厂为两份 Hook 显式分配不同持久键；不按调用顺序或变量名猜身份。 */
function counterSlot(key: string) {
    return defineStateSlot<Counter>({ key, schema: counterSchema, initial: () => ({ count: 0 }) })
}
const left = counterSlot('left-count')
const right = counterSlot('right-count')
export const spec = {
    abi: 'mf.node/1',
    code: 'multi-instance',
    inputSchema,
    outputSchema,
    state: { left, right },
    tasks: {},
    actions: {},
} as const

/** 自定义 Hook 持有已注册槽；两个处理器各更新自己的 pending state，不共享隐式状态。 */
function useCountInputs(slot: typeof left) {
    const [state, setState] = useNodeState(slot)
    useOnInput<Input>(() => {
        setState((pending) => ({ count: pending.count + 1 }))
    })
    return state
}

// noinspection JSUnusedGlobalSymbols
export default defineNode(spec, function MultiInstanceNode() {
    const leftState = useCountInputs(spec.state.left)
    const rightState = useCountInputs(spec.state.right)
    const outputs = useOutputs<Output>()
    const production = useProduction()
    // 两个计数 Hook 均不重复输出；根节点负责每次输入唯一的候选命令。
    useOnInput<Input>((event) => {
        outputs.append({ items: [event.values.item] }, { inputRefs: [event.deliveryId] })
    })
    useOnInputClosed(() => {
        production.finish()
    })
    nodeView(() => ({ left: leftState.count, right: rightState.count }))
})
