/**
 * 节点骨架的输入、输出和状态契约。
 * 根据实际业务补充字段，并同步更新对应 Schema。
 */
export type Input = Record<string, never>
export type Output = Record<string, never>

export const inputSchema = {
    type: 'object',
    properties: {},
    additionalProperties: false,
}

export const outputSchema = {
    type: 'object',
    properties: {},
    additionalProperties: false,
}
