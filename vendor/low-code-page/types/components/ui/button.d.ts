import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const buttonVariants: (props?: ({
    variant?: "mode" | "default" | "muted" | "overlay" | "dashed" | "link" | "secondary" | "outline" | "destructive" | "ghost" | "brand" | "source-link" | "brand-link" | "assist" | "info-link" | null | undefined;
    size?: "mode" | "default" | "inline" | "icon" | "compact" | "dialog-pill" | "sm" | "block" | "pill-sm" | "panel" | "lg" | "xl" | "help" | "icon-sm" | "icon-lg" | "material" | "chip" | "stepper" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { Button, buttonVariants };
