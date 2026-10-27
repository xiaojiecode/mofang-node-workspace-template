import type { ImagePickerResult } from '../image-picker-dialog';
import type { ProductMediaImagePickerRequest, RequestProductMediaImages } from './product-media-image-picker';
import type { ProductEditorValue } from './types';
export declare function useProductMediaImagePicker({ currentDraft, updateDraft, productImageType, disabledReason }: {
    currentDraft: ProductEditorValue | null;
    updateDraft: (patch: Partial<ProductEditorValue>) => void;
    productImageType?: string;
    disabledReason?: string;
}): {
    open: boolean;
    request: ProductMediaImagePickerRequest | null;
    requestImages: RequestProductMediaImages;
    requestProductImages: () => void;
    requestSizeChart: () => void;
    requestBatchImages: RequestProductMediaImages;
    onOpenChange: (nextOpen: boolean) => void;
    onConfirm: (result: ImagePickerResult) => Promise<void>;
};
