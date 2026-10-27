import type { FieldDefinition, Json } from '../../../lib/low-code/schema';
type Props = {
    field: FieldDefinition;
    value: string;
    onChange: (value: Json) => void;
    placeholder?: string;
    id: string;
    disabled: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'aria-required': boolean;
};
export declare function SelectInput({ field, value, onChange, placeholder, ...props }: Props): import("react/jsx-runtime").JSX.Element;
export {};
