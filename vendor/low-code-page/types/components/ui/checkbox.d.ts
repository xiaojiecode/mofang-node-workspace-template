import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
declare function Checkbox({ className, variant, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    variant?: 'default' | 'brand';
}): import("react/jsx-runtime").JSX.Element;
export { Checkbox };
