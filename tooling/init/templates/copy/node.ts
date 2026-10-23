import type { NodeDefinition } from '@mofang/contracts/author'
import { inputSchema, outputSchema } from './contract'
// noinspection JSUnusedGlobalSymbols
export default {
    code: 'copy',
    name: '原样传递',
    description: '函数节点、冻结状态与真实来源示例',
    icon: '',
    category: '示例',
    interface: 'node',
    inputSchema,
    outputSchema,
    timeoutSeconds: 120,
    tools: [],
    maxToolCalls: 1,
} satisfies NodeDefinition
