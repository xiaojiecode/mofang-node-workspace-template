import { type LocalUploadItem } from './image-picker-dialog.model';
import type { ImagePickerResult, ImagePickerUploadResult } from './image-picker-dialog.types';
type LocalPickerOptions = {
    uploadFile: (file: File, options?: {
        signal?: AbortSignal;
    }) => Promise<ImagePickerUploadResult>;
    onConfirm: (result: ImagePickerResult) => void | Promise<void>;
    maxCount: number;
    maxFileSize: number;
    acceptedTypes: string[];
};
export declare function useImagePickerLocal({ uploadFile, onConfirm, maxCount, maxFileSize, acceptedTypes }: LocalPickerOptions): {
    items: LocalUploadItem[];
    busy: boolean;
    error: string | null;
    addFiles: (files: FileList | File[]) => void;
    removeItem: (id: string) => void;
    retryItem: (id: string) => void;
    confirm: () => void;
};
export {};
