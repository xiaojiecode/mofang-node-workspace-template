import type { ImagePickerImageType, ImagePickerRemoteItem } from '../../api/image-picker';
export type ImagePickerSource = 'local' | 'library' | 'collection';
export type ImagePickerUploadResult = {
    url: string;
    objectKey?: string;
    fileId?: number;
};
export type ImagePickerItem = {
    url: string;
    name: string;
    source: ImagePickerSource;
    mimeType?: string;
    size?: number;
    objectKey?: string;
    fileId?: number;
    storageKey?: string;
    imageType?: ImagePickerImageType;
    productId?: string;
    skuCode?: string;
};
export type ImagePickerResult = {
    source: ImagePickerSource;
    items: ImagePickerItem[];
    count: number;
};
export type ImagePickerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    uploadFile: (file: File, options?: {
        signal?: AbortSignal;
    }) => Promise<ImagePickerUploadResult>;
    onConfirm: (result: ImagePickerResult) => void | Promise<void>;
    maxCount?: number;
    maxFileSize?: number;
    acceptedTypes?: string[];
    zIndex?: number;
};
export type { ImagePickerRemoteItem };
