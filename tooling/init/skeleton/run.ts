import { defineNode, nodeView } from '@mofang/node'
import { inputSchema, outputSchema } from './contract'

export const spec = {
    abi: 'mf.node/1',
    code: '__NODE_CODE__',
    inputSchema,
    outputSchema,
    state: {},
    tasks: {},
    actions: {},
} as const

/**
 * 这是可编译的最小节点入口。
 * 请在确认业务输入、状态、任务和动作后，再补充对应 Hook 与阶段程序。
 */
// noinspection JSUnusedGlobalSymbols
export default defineNode(spec, function NodeSkeleton() {
    nodeView(() => ({}))
})
