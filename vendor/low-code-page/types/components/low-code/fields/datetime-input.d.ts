import type { ConfigControlProps } from './config-control';
type Props = Pick<ConfigControlProps, 'id' | 'disabled' | 'placeholder' | 'onBlur' | 'aria-label' | 'aria-describedby' | 'aria-invalid' | 'aria-required'> & {
    value: string;
    dateOnly?: boolean;
    onChange: (value: string) => void;
};
export declare function DateTimeInput({ value, onChange, dateOnly, ...props }: Props): import("react/jsx-runtime").JSX.Element;
export {};
