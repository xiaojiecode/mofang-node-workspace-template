import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
declare function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function RadioGroupItem({ className, tone, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    tone?: 'default' | 'info';
}): import("react/jsx-runtime").JSX.Element;
/** 单选项 = 圆圈 + 文案，整体可点。 */
declare function RadioGroupChoice({ value, label, disabled, className }: {
    value: string;
    label: string;
    disabled?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export { RadioGroup, RadioGroupItem, RadioGroupChoice };
