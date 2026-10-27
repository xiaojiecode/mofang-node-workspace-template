import { type LocalUploadItem } from './image-picker-dialog.model';
export declare function ImagePickerUploadList({ items, onRemove, onRetry, disabled }: {
    items: LocalUploadItem[];
    onRemove: (id: string) => void;
    onRetry: (id: string) => void;
    disabled: boolean;
}): import("react/jsx-runtime").JSX.Element;
