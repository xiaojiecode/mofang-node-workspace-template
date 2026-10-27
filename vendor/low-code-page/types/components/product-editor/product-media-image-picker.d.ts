import { type ImagePickerResult } from '../image-picker-dialog';
export type ProductMediaImagePickerRequest = {
    maxCount: number;
    maxFileSize?: number;
    acceptedTypes?: string[];
    onConfirm: (result: ImagePickerResult) => void | Promise<void>;
};
export type RequestProductMediaImages = (request: ProductMediaImagePickerRequest) => void;
export declare function ProductMediaImagePicker({ open, request, onOpenChange, onConfirm }: {
    open: boolean;
    request: ProductMediaImagePickerRequest | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: (result: ImagePickerResult) => void | Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
