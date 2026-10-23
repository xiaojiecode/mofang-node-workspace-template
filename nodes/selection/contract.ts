import type { Product, DeepReadonly } from '@mofang/node'

export type Input = { item: Product; note?: string }
export type Output = { items?: Product[]; report?: { sourceDeliveryId: string } }
export type Row = {
    readonly key: string
    readonly product: DeepReadonly<Product>
    readonly submitted: boolean
}
export type State = {
    readonly phase: 'collecting' | 'ready' | 'submitted' | 'ended'
    readonly rows: readonly Row[]
    readonly inputReason: 'completed' | 'failed' | 'cancelled' | null
}
export type SubmitPayload = { keys: string[] }
export type EmptyPayload = Record<string, never>
const productRef = { $ref: 'urn:mofang:workflow:type:product:1' }
export const inputSchema = {
    type: 'object',
    properties: { item: productRef, note: { type: 'string' } },
    required: ['item'],
    additionalProperties: false,
}
export const outputSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        items: { type: 'array', items: productRef },
        report: {
            type: 'object',
            required: ['sourceDeliveryId'],
            properties: { sourceDeliveryId: { type: 'string' } },
            additionalProperties: false,
        },
    },
}
export const stateSchema = {
    type: 'object',
    required: ['phase', 'rows', 'inputReason'],
    additionalProperties: false,
    properties: {
        phase: { type: 'string', enum: ['collecting', 'ready', 'submitted', 'ended'] },
        rows: {
            type: 'array',
            items: {
                type: 'object',
                required: ['key', 'product', 'submitted'],
                additionalProperties: false,
                properties: {
                    key: { type: 'string', minLength: 1 },
                    product: productRef,
                    submitted: { type: 'boolean' },
                },
            },
        },
        inputReason: { enum: ['completed', 'failed', 'cancelled', null] },
    },
}
export const submitSchema = {
    type: 'object',
    required: ['keys'],
    additionalProperties: false,
    properties: {
        keys: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: { type: 'string', minLength: 1 },
        },
    },
}
export const emptySchema = { type: 'object', properties: {}, additionalProperties: false }
