import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { formControlVariants } from './form-control-variants';
declare function Input({ className, type, controlSize, invalidTone, ...props }: React.ComponentProps<'input'> & VariantProps<typeof formControlVariants>): import("react/jsx-runtime").JSX.Element;
export { Input };
