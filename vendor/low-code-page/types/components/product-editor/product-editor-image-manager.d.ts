import type { ProductEditorImage, ProductImagePending } from './types';
export declare function ProductImageManager({ images, onAdd, onRemove, onReorder, error, onAiAction, pendingImages, onPendingDismiss }: {
    images: ProductEditorImage[];
    onAdd: () => void;
    onRemove: (indexes: number[]) => void;
    onReorder?: (images: ProductEditorImage[]) => void;
    error?: string;
    onAiAction?: (intent: Extract<import('./types').ProductEditorAiIntent, {
        kind: 'image-translate' | 'image-remove-mark' | 'image-edit';
    }>) => void;
    /** AI 任务进行中的占位卡；按 `sourceRef` 摆到对应原图前面。 */
    pendingImages?: readonly ProductImagePending[];
    onPendingDismiss?: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
