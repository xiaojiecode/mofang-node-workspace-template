import type { JsonObject, JsonValue, ParamType } from './catalog-types';
export declare const businessParamTypes: readonly ["image", "video", "product"];
export declare const schemaObject: (value: unknown) => JsonObject;
export type SchemaField = {
    name: string;
    title: string;
    description: string;
    type: ParamType | undefined;
    element?: SchemaField;
    required: boolean;
    nullable: boolean;
    /** 仅允许在运行前固定配置，不接受上游绑定。 */
    configBeforeRun?: boolean;
    /** 能力开关相对本字段的 JSON Pointer；普通字段为空数组。 */
    capabilitySwitchPaths: readonly string[];
    defaultValue?: JsonValue;
    ui: JsonObject;
    schema: JsonObject;
};
/** 仅解析当前冻结文档的引用，不访问最新目录或网络。 */
export declare function resolveSchema(root: JsonObject, value: JsonValue): JsonObject;
/** 字段是只读投影；Schema 始终是唯一契约。 */
export declare function schemaFields(root: JsonObject): SchemaField[];
export declare function matchingSchemaFields(left: SchemaField, right: SchemaField): boolean;
/** 重新编辑只还原系统引用与引用点配置，不将系统 Schema 正文上传。 */
export declare function authoringSchema(root: JsonObject): JsonObject;
