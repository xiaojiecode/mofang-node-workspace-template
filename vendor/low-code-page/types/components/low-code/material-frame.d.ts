import type { ReactNode } from 'react';
import type { ComponentAppearance, Condition } from '../../lib/low-code/schema';
export declare function MaterialFrame({ appearance, visibleWhen, fieldId, children, logicVisible, disabled }: {
    appearance?: ComponentAppearance;
    visibleWhen?: Condition;
    fieldId?: string;
    logicVisible?: boolean;
    disabled?: boolean;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
