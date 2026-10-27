import * as React from 'react';
export interface CascaderOption {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
    children?: CascaderOption[];
}
export interface CascaderPanelProps {
    options: CascaderOption[];
    value?: string[];
    onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
    expandTrigger?: 'click' | 'hover';
    className?: string;
}
export declare function getStringLabel(option: CascaderOption): string;
export declare function CascaderPanel({ options, value, onChange, expandTrigger, className }: CascaderPanelProps): import("react/jsx-runtime").JSX.Element;
export interface CascaderProps extends CascaderPanelProps {
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    modal?: boolean;
    zIndex?: number;
    displayRender?: (labels: string[], selectedOptions: CascaderOption[]) => React.ReactNode;
    triggerClassName?: string;
    popupClassName?: string;
}
export declare function Cascader({ options, value, onChange, expandTrigger, placeholder, disabled, allowClear, modal, zIndex, displayRender, triggerClassName, popupClassName }: CascaderProps): import("react/jsx-runtime").JSX.Element;
