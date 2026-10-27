import type { PagePackage, Values } from '../../../lib/low-code/schema';
/** 旧包仅兼容 main；多个表单不会被猜测、合并为节点配置。 */
export declare function resolveSettingsFormId(page: PagePackage): string;
/** 与历史运行器一致：缺省表单为 main，缺省字段名为其逻辑 ID。 */
export declare function settingsFields(page: PagePackage, formId: string): {
    id: string;
    name: string;
    type: string;
    formId?: string;
    label?: string;
    description?: string;
    readOnly?: boolean;
    clearable?: boolean;
    onChange?: string;
    submitWhenHidden?: boolean;
    options?: {
        label: string;
        value: import("../../../lib/low-code/runtime-core/contracts").JsonValue;
        disabled?: boolean;
        hidden?: boolean;
        description?: string;
    }[];
    optionsSource?: import("../../../lib/low-code/schema").Binding;
    optionMapping?: Partial<NonNullable<import("../../../lib/low-code/runtime-core/contracts").BindingDefinition["map"]>>;
    defaultValue?: import("../../../lib/low-code/runtime-core/contracts").JsonValue;
    required?: boolean;
    requiredMessage?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    validationMessage?: string;
    clearOnChange?: string[];
    nodeId?: string;
    validateScriptId?: string;
}[];
export declare function jsonValues(value: Readonly<Record<string, unknown>>): Values;
