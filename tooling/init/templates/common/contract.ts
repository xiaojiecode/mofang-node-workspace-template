import type { Product } from '@mofang/contracts/business'
export type Input = { item: Product; note?: string }
export type Output = { items?: Product[]; report?: { received: number } }
export type Config = { note?: string }
/**
 * 选择代码内置的可信类型；这里只组织字段元信息，不定义另一份 Product 结构。
 */
const ref = (kind: string) => ({ $ref: 'urn:mofang:workflow:type:' + kind + ':1' })
export const inputSchema = {
    type: 'object',
    properties: { item: ref('product'), note: { ...ref('string'), title: '备注', default: '' } },
    required: ['item'],
    additionalProperties: false,
}
export const outputSchema = {
    type: 'object',
    properties: { items: { type: 'array', items: ref('product') }, report: ref('object') },
    additionalProperties: false,
}
