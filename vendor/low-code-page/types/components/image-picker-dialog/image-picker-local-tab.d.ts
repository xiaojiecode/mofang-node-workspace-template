import type { LocalUploadItem } from './image-picker-dialog.model';
export declare function ImagePickerLocalTab({ items, dragging, busy, error, acceptedTypes, maxFileSize, maxCount, onDraggingChange, onAddFiles, onRemove, onRetry }: {
    items: LocalUploadItem[];
    dragging: boolean;
    busy: boolean;
    error: string | null;
    acceptedTypes: string[];
    maxFileSize: number;
    maxCount: number;
    onDraggingChange: (dragging: boolean) => void;
    onAddFiles: (files: FileList | File[]) => void;
    onRemove: (id: string) => void;
    onRetry: (id: string) => void;
}): import("react/jsx-runtime").JSX.Element;
