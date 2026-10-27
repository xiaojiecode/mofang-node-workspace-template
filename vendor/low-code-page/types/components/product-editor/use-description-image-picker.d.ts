import type { ImagePickerResult } from '../image-picker-dialog';
import type { DescriptionImagePickerTarget } from './description-image-picker';
import type { ProductEditorValue } from './types';
type UpdateDraft = (patch: Partial<ProductEditorValue>) => void;
export declare function useDescriptionImagePicker({ currentDraft, updateDraft, setActiveImageId, disabledReason }: {
    currentDraft: ProductEditorValue | null;
    updateDraft: UpdateDraft;
    setActiveImageId: (imageId: string | null) => void;
    disabledReason?: string;
}): {
    open: boolean;
    target: DescriptionImagePickerTarget | null;
    requestAdd: (onUploaded: (url: string) => void) => void;
    requestReplace: (imageId: string) => void;
    onOpenChange: (nextOpen: boolean) => void;
    onConfirm: (result: ImagePickerResult) => Promise<void>;
};
export {};
