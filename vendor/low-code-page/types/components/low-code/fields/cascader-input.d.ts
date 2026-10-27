import type { ConfigControlProps } from './config-control';
import type { ConfigOption } from './config-field-types';
type Props = Pick<ConfigControlProps, 'id' | 'disabled' | 'placeholder' | 'aria-label' | 'aria-describedby' | 'aria-invalid' | 'aria-required'> & {
    value: string[];
    options: ConfigOption[];
    onChange: (value: string[]) => void;
    clearable: boolean;
};
export declare function CascaderInput({ value, options, onChange, clearable, placeholder, ...props }: Props): import("react/jsx-runtime").JSX.Element;
export {};
