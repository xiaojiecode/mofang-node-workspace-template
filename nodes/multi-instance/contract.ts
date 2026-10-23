import type { Product, DeepReadonly } from '@mofang/node'
export type Input = { item: Product; note?: string }
export type Output = { items?: Product[] }
const productRef = { $ref: 'urn:mofang:workflow:type:product:1' }
export const inputSchema = {
    type: 'object',
    properties: { item: productRef, note: { type: 'string' } },
    required: ['item'],
    additionalProperties: false,
}
export const outputSchema = {
    type: 'object',
    properties: { items: { type: 'array', items: productRef } },
    additionalProperties: false,
}
/** 复制宿主已校验的完整商品值。 */
export function copyProduct(value: DeepReadonly<Product>): Product {
    return JSON.parse(JSON.stringify(value)) as Product
}
export type Counter = { readonly count: number }
export const counterSchema = {
    type: 'object',
    required: ['count'],
    additionalProperties: false,
    properties: { count: { type: 'integer', minimum: 0 } },
}
