import type { NodeDefinition } from '@mofang/contracts/author'
import { inputSchema, outputSchema } from './contract'
// noinspection JSUnusedGlobalSymbols
export default {
    code: 'pass-through',
    name: '商品原样传递',
    description: '保留完整商品，仅用于模板开发',
    icon: '',
    category: '开发示例',
    interface: 'stages',
    inputSchema,
    outputSchema,
    timeoutSeconds: 60,
    tools: [],
    maxToolCalls: 8,
    entries: {
        settings: 'settings/index.ts',
        business: 'business/index.ts',
        pageProgram: 'page-program/index.ts',
        executor: 'executor/index.ts',
    },
} satisfies NodeDefinition
