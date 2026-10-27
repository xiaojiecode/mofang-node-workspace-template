import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
declare function Select({ open, defaultOpen, onOpenChange, value, defaultValue, onValueChange, clearable, ...props }: React.ComponentProps<typeof SelectPrimitive.Root> & {
    clearable?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): import("react/jsx-runtime").JSX.Element;
declare function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): import("react/jsx-runtime").JSX.Element;
declare function SelectTrigger({ className, indicatorClassName, size, variant, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'default' | 'parameter' | 'compact';
    variant?: 'default' | 'plain';
    indicatorClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
declare function SelectContent({ className, children, portalContainer, position, align, zIndex, style, ...props }: React.ComponentProps<typeof SelectPrimitive.Content> & {
    portalContainer?: HTMLElement;
    zIndex?: number;
}): import("react/jsx-runtime").JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): import("react/jsx-runtime").JSX.Element;
declare function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>): import("react/jsx-runtime").JSX.Element;
declare function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): import("react/jsx-runtime").JSX.Element;
declare function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): import("react/jsx-runtime").JSX.Element;
declare function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): import("react/jsx-runtime").JSX.Element;
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
