import type { ComponentProps } from 'react';
import { InputGroupInput } from '../../ui/input-group';
import type { Json } from '../../../lib/low-code/schema';
import type { ConfigFieldProps, ConfigOption } from './config-field-types';
export type ConfigControlProps = {
    kind: ConfigFieldProps['kind'];
    value: Json | undefined;
    onChange: (value: Json) => void;
    options: ConfigOption[];
    suffix?: string;
    clearable?: boolean;
    onBlur?: () => void;
    step?: number;
} & Pick<ComponentProps<typeof InputGroupInput>, 'id' | 'disabled' | 'readOnly' | 'placeholder' | 'min' | 'max' | 'maxLength' | 'aria-invalid' | 'aria-describedby' | 'aria-required' | 'aria-label'>;
export declare function ConfigControl({ kind, value, onChange, options, suffix, clearable, ...shared }: ConfigControlProps): import("react/jsx-runtime").JSX.Element;
