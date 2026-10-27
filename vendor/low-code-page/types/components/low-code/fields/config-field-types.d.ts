import type { ComponentAppearance } from '../../../lib/low-code/schema';
export type ConfigOption = {
    label: string;
    value: string;
    disabled?: boolean;
    children?: ConfigOption[];
};
export type ConfigFieldProps = {
    fieldId: string;
    kind: 'text' | 'number' | 'select' | 'switch' | 'choice' | 'checkboxes' | 'cascader' | 'datetime' | 'date';
    layout?: 'vertical' | 'horizontal' | 'card';
    placeholder?: string;
    suffix?: string;
    step?: number;
    options?: ConfigOption[];
    actionEventId?: string;
    actionLabel?: string;
    hideControl?: boolean;
    hideLabel?: boolean;
    labelAppearance?: ComponentAppearance;
    descriptionAppearance?: ComponentAppearance;
};
export type RecordColumn = {
    key: string;
    label: string;
    kind: 'text' | 'number' | 'datetime' | 'select';
    required?: boolean;
    min?: number;
    max?: number;
    options?: ConfigOption[];
};
export type RecordListFieldProps = {
    fieldId: string;
    itemLabel: string;
    addLabel: string;
    columns: RecordColumn[];
    minItems?: number;
    maxItems?: number;
    layout?: 'inline' | 'cards';
    addEventId?: string;
};
