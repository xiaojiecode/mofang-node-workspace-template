import type { ReactNode } from 'react';
import type { ProductEditorSectionId } from './types';
export declare function EditorSection({ id, title, titleExtra, register, className, titleClassName, children }: {
    id: ProductEditorSectionId;
    title: string;
    titleExtra?: ReactNode;
    register: (id: ProductEditorSectionId, element: HTMLElement | null) => void;
    className?: string;
    titleClassName?: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function Field({ label, required, error, labelId, errorId, children }: {
    label: string;
    required?: boolean;
    error?: string;
    labelId?: string;
    errorId?: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function WindowAction({ icon, label, onClick }: {
    icon: string;
    label: string;
    onClick: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ProductThumbnail({ src, title, onPreview }: {
    src?: string;
    title: string;
    onPreview?: () => void;
}): import("react/jsx-runtime").JSX.Element;
