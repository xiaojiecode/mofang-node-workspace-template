type LoadingOverlayProps = {
    open: boolean;
    message: string;
    className?: string;
    scope?: 'page' | 'with-sidebar' | 'container';
    indicator?: 'spinner' | 'saving';
};
export declare function LoadingOverlay({ open, message, className, scope, indicator }: LoadingOverlayProps): import("react/jsx-runtime").JSX.Element | null;
export {};
