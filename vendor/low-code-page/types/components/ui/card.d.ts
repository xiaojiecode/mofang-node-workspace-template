import * as React from 'react';
declare function Card({ className, variant, ...props }: React.ComponentProps<'div'> & {
    variant?: 'default' | 'row' | 'account' | 'platform';
}): import("react/jsx-runtime").JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<'div'>): import("react/jsx-runtime").JSX.Element;
declare function CardTitle({ className, size, ...props }: React.ComponentProps<'div'> & {
    size?: 'default' | 'sm';
}): import("react/jsx-runtime").JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<'div'>): import("react/jsx-runtime").JSX.Element;
declare function CardMedia({ className, size, ...props }: React.ComponentProps<'div'> & {
    size?: 'default' | 'lg';
}): import("react/jsx-runtime").JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<'div'>): import("react/jsx-runtime").JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<'div'>): import("react/jsx-runtime").JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<'div'>): import("react/jsx-runtime").JSX.Element;
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardMedia, CardContent };
