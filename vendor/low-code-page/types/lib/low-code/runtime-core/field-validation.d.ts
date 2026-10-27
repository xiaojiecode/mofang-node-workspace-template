import type { FieldDefinition, JsonValue, RuntimeDefinition, RuntimeSnapshot } from './contracts';
/** Validate the current rendered field state, including source-backed options. */
export declare function validateFieldValue(value: unknown, props: Record<string, unknown>): string | undefined;
export declare function fieldOptions(field: FieldDefinition, current: RuntimeSnapshot): unknown[] | undefined;
export declare function serializeFieldValue(field: FieldDefinition, value: JsonValue): JsonValue;
type FormValidationServices = {
    definition: RuntimeDefinition;
    getSnapshot: () => RuntimeSnapshot;
    getRegistrations: (id: string) => {
        nodeId: string;
        props: Record<string, unknown>;
    }[] | undefined;
    evaluate: (id: string, property: 'visible' | 'disabled' | 'required', row?: JsonValue, scope?: RuntimeSnapshot['scope']) => boolean;
};
/** 同步检查为 UI 和事件共用；异步校验脚本由运行核心继续执行。 */
export declare function createFormInspector(services: FormValidationServices): (ids: string[], current?: RuntimeSnapshot, scope?: string) => {
    values: Record<string, JsonValue>;
    errors: Record<string, string>;
    visibleIds: string[];
};
export {};
