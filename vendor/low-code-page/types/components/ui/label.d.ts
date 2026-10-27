import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
declare function Label({ className, variant, ...props }: React.ComponentProps<typeof LabelPrimitive.Root> & {
    variant?: 'default' | 'form' | 'inline' | 'compact';
}): import("react/jsx-runtime").JSX.Element;
export { Label };
