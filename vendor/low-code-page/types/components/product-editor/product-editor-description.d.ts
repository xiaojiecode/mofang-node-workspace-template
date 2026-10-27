import type { DraftComplianceDescriptionDetection } from '../../api/product-library';
import type { DescriptionPendingImage, ProductEditorAiIntent, ProductEditorDescriptionAction } from './types';
type ProductEditorDescriptionProps = {
    value: string;
    onChange: (value: string) => void;
    onAction?: (action: ProductEditorDescriptionAction, imageId?: string) => void;
    onAiAction?: (intent: Extract<ProductEditorAiIntent, {
        kind: 'description-image-edit';
    }>) => void;
    onImageDelete?: (imageId: string) => void;
    onRequestAddImage?: (onUploaded: (url: string) => void) => void;
    onSelectedImageIdChange?: (imageId: string | null) => void;
    onUploadImages?: (files: File[]) => Promise<string[]>;
    labelledBy?: string;
    describedBy?: string;
    invalid?: boolean;
    resetKey?: string;
    detection?: DraftComplianceDescriptionDetection;
    pendingImages?: readonly DescriptionPendingImage[];
    onPendingImageDismiss?: (key: string) => void;
};
export declare function ProductEditorDescription({ value, onChange, onAction, onAiAction, onImageDelete, onRequestAddImage, onSelectedImageIdChange, onUploadImages, labelledBy, describedBy, invalid, resetKey, detection, pendingImages, onPendingImageDismiss }: ProductEditorDescriptionProps): import("react/jsx-runtime").JSX.Element;
export {};
