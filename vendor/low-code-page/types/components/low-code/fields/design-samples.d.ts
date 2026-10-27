import type { FieldDefinition, Json } from '../../../lib/low-code/schema';
import type { ConfigFieldProps, ConfigOption } from './config-field-types';
type SampleKind = ConfigFieldProps['kind'] | 'textarea';
export declare const designOptions: ConfigOption[];
export declare function designField(kind: SampleKind): FieldDefinition;
export declare function designValue(kind: SampleKind, options?: ConfigOption[]): Json;
export declare const designFieldStatus: {
    visible: boolean;
    disabled: boolean;
    required: boolean;
    error: undefined;
};
export {};
