import {
    defineNode,
    defineStateSlot,
    useNodeReducer,
    useNodeFacts,
    useNodeAction,
    useOnInput,
    useOnInputClosed,
    nodeView,
} from '@mofang/node'
import type { ActionSpec } from '@mofang/node'
import type { Input, State, SubmitPayload, EmptyPayload } from './contract'
import { inputSchema, outputSchema, stateSchema, submitSchema, emptySchema } from './contract'
import { selectionReducer, canFinish, canSubmit } from './reducer'

const submit: ActionSpec<SubmitPayload> = {
    name: 'submit',
    label: '提交所选商品',
    description: '逐件生成候选，随后按运行模式流转或审核',
    presentation: 'panel',
    payloadSchema: submitSchema,
}
const finish: ActionSpec<EmptyPayload> = {
    name: 'finish',
    label: '不提交商品，结束选品',
    description: '不提交未选择的商品，已有候选仍需处理',
    presentation: 'host',
    payloadSchema: emptySchema,
}
export const spec = {
    abi: 'mf.node/1',
    code: 'selection',
    inputSchema,
    outputSchema,
    state: {
        selection: defineStateSlot<State>({
            key: 'selection-state',
            schema: stateSchema,
            initial: () => ({ phase: 'collecting', rows: [], inputReason: null }),
        }),
    },
    tasks: {},
    actions: { submit, finish },
} as const

// noinspection JSUnusedGlobalSymbols
export default defineNode(spec, function SelectionNode() {
    const [state, dispatch] = useNodeReducer(spec.state.selection, selectionReducer)
    const facts = useNodeFacts()
    useOnInput<Input>((event) => {
        dispatch({ type: 'input', event })
    })
    useOnInputClosed((event) => {
        dispatch({ type: 'input-closed', reason: event.reason })
    })
    useNodeAction(spec.actions.submit, {
        guard: () => canSubmit(state, facts),
        handler: (payload, context) => {
            dispatch({ type: 'submit', payload, context })
        },
    })
    useNodeAction(spec.actions.finish, {
        guard: () => canFinish(state, facts),
        handler: (_payload, context) => {
            dispatch({ type: 'finish', context })
        },
    })
    nodeView(() => ({
        phase: state.phase,
        rows: state.rows,
        inputReason: state.inputReason,
        nextStep:
            state.phase === 'submitted'
                ? '请流转或审核候选'
                : state.phase === 'ended'
                  ? '等待平台结清节点'
                  : '等待输入关闭后勾选提交，或不提交并结束',
    }))
})
