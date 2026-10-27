import { Ajv } from 'ajv'
import type { ErrorObject, ValidateFunction } from 'ajv'

const compiled = new WeakMap<Record<string, unknown>, ValidateFunction>()

/** Schema 由本地演示源码提供；同步编译不配置远程加载，不联网解析 $ref。 */
export function validateSchemaInput(
    schema: Record<string, unknown>,
    data: unknown,
): string | undefined {
    let validate = compiled.get(schema)
    if (!validate) {
        try {
            validate = new Ajv({ allErrors: true, strict: true, validateFormats: false }).compile(
                schema,
            )
            compiled.set(schema, validate)
        } catch {
            return '本地 JSON Schema 定义无效或引用不可用，暂不能应用这份数据。'
        }
    }
    if (validate(data)) return undefined
    const error = validate.errors?.[0]
    if (!error) return '演示数据不符合 JSON Schema。'
    return schemaError(error)
}

/** 使用中文和字段路径反馈结构错误，保留编辑区原始草稿。 */
function schemaError(error: ErrorObject) {
    const path = error.instancePath || '/'
    switch (error.keyword) {
        case 'type':
            return `JSON Schema：字段 ${path} 的类型应为 ${error.params.type}。`
        case 'required':
            return `JSON Schema：字段 ${path} 缺少必填属性 ${error.params.missingProperty}。`
        case 'additionalProperties':
            return `JSON Schema：字段 ${path} 不接受属性 ${error.params.additionalProperty}。`
        case 'enum':
            return `JSON Schema：字段 ${path} 不在允许的选项中。`
        case 'const':
            return `JSON Schema：字段 ${path} 与当前固定值不一致。`
        default:
            return `JSON Schema：字段 ${path} 不符合 ${error.keyword} 约束。`
    }
}
