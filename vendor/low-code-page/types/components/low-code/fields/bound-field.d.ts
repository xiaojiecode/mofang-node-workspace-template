import type { FieldProps } from '../types';
export declare function BoundField({ fieldId, placeholder, rows, step, kind }: FieldProps & {
    kind: 'text' | 'number' | 'textarea' | 'select' | 'switch';
}): import("react/jsx-runtime").JSX.Element | null;
