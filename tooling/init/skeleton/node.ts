import type { NodeDefinition } from '@mofang/contracts/author'
import { inputSchema, outputSchema } from './contract'

// noinspection JSUnusedGlobalSymbols
export default {
    code: '__NODE_CODE__',
    name: '节点骨架',
    description: '待按业务需求实现的 mf.node/1 节点骨架。',
    icon: '',
    category: '自定义',
    interface: 'node',
    inputSchema,
    outputSchema,
    timeoutSeconds: 120,
    tools: [],
    maxToolCalls: 1,
} satisfies NodeDefinition
