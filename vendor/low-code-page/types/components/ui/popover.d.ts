import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
declare function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function PopoverContent({ className, align, sideOffset, container, zIndex, style, variant, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content> & {
    container?: HTMLElement | null;
    zIndex?: number;
    variant?: 'default' | 'parameter' | 'compact';
}): import("react/jsx-runtime").JSX.Element;
declare function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>): import("react/jsx-runtime").JSX.Element;
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
