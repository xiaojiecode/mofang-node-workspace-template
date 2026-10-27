import type { LocalUploadItem } from './image-picker-dialog.model';
import type { ImagePickerResult, ImagePickerUploadResult } from './image-picker-dialog.types';
export declare function uploadLocalItems({ currentItems, targets, uploadFile, signal, onItemsChange }: {
    currentItems: LocalUploadItem[];
    targets: LocalUploadItem[];
    uploadFile: (file: File, options?: {
        signal?: AbortSignal;
    }) => Promise<ImagePickerUploadResult>;
    signal: AbortSignal;
    onItemsChange: (items: LocalUploadItem[]) => void;
}): Promise<ImagePickerResult>;
