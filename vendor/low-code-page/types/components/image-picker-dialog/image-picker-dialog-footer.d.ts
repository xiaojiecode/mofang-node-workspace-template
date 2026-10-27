import type { ImagePickerSource } from './image-picker-dialog.types';
export declare function ImagePickerDialogFooter({ source, selectedCount, busy, confirmDisabled, onCancel, onConfirm }: {
    source: ImagePickerSource;
    selectedCount: number;
    busy: boolean;
    confirmDisabled: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}): import("react/jsx-runtime").JSX.Element;
