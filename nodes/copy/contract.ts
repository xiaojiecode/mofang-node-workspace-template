import type { Product, DeepReadonly } from '@mofang/node'

export type Input = { item: Product; note?: string }
export type Output = { items?: Product[] }
export type State = {
    readonly received: number
    readonly taskIds: readonly string[]
    readonly lastError: string | null
}
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
export const stateSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['received', 'taskIds', 'lastError'],
    properties: {
        received: { type: 'integer', minimum: 0 },
        taskIds: { type: 'array', items: { type: 'string', minLength: 1 } },
        lastError: { type: ['string', 'null'] },
    },
}
/** 仅复制已经由宿主验证的完整 JSON；不补造 Product 字段。 */
export function copyProduct(value: DeepReadonly<Product>): Product {
    return JSON.parse(JSON.stringify(value)) as Product
}
