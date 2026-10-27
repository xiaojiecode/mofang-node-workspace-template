import type { SlotComponent } from '@puckeditor/core';
import type { ComponentAppearance } from '../../lib/low-code/schema';
export declare function Section({ title, appearance, content: Content }: {
    title: string;
    appearance?: ComponentAppearance;
    content: SlotComponent;
}): import("react/jsx-runtime").JSX.Element;
export declare function Stack({ direction, gap, justify, wrap, align, content: Content }: {
    direction: 'row' | 'column';
    gap: number;
    justify?: 'start' | 'space-between';
    wrap?: 'wrap' | 'nowrap';
    align?: 'start' | 'center' | 'end' | 'stretch';
    content: SlotComponent;
}): import("react/jsx-runtime").JSX.Element;
export declare function Form({ formId, layout, columns, minColumnWidth, gap, content: Content }: {
    formId: string;
    layout?: 'vertical' | 'grid';
    columns?: number;
    minColumnWidth?: number;
    gap?: number;
    content: SlotComponent;
}): import("react/jsx-runtime").JSX.Element;
