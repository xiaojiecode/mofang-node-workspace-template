import {
    defineNode,
    defineStateSlot,
    useNodeReducer,
    useTask,
    useOnInput,
    useOnInputClosed,
    nodeView,
} from '@mofang/node'
import type { Input, State } from './contract'
import { inputSchema, outputSchema, stateSchema } from './contract'
import { copyTask } from './tasks/main'
import { copyReducer } from './reducer'

export const spec = {
    abi: 'mf.node/1',
    code: 'copy',
    inputSchema,
    outputSchema,
    state: {
        copy: defineStateSlot<State>({
            key: 'copy-state',
            schema: stateSchema,
            initial: () => ({ received: 0, taskIds: [], lastError: null }),
        }),
    },
    tasks: { copy: copyTask },
    actions: {},
} as const

/** 函数体只绑定；实际派发由真实 input 事件触发。 */
// noinspection JSUnusedGlobalSymbols
export default defineNode(spec, function CopyNode() {
    const [state, dispatch] = useNodeReducer(spec.state.copy, copyReducer)
    const copy = useTask(spec.tasks.copy)
    useOnInput<Input>((event) => {
        dispatch({ type: 'input', event })
    })
    useOnInputClosed(() => {
        dispatch({ type: 'input-closed' })
    })
    copy.onResult((event) => {
        dispatch({ type: 'result', event })
    })
    nodeView(() => ({ received: state.received, lastError: state.lastError }))
})
