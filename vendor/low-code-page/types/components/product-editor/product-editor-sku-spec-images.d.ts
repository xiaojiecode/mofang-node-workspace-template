import { type SpecImagesBatchPickRequest } from './product-editor-sku-spec-images-batch-dialog';
import type { SkuSpecAxis } from './product-editor-sku-specs';
import type { ProductImagePending } from './types';
export declare function SkuSpecImages({ axis, axisIndex, onRequestImages, onApplyImages, onClear, onUploadNew, onUploadOne, onAiAction, pendingImages, onPendingDismiss }: {
    axis: SkuSpecAxis;
    /** 这条轴在 `skuSpecAxes` 里的下标；写回结果时要按它定位。 */
    axisIndex: number;
    /** 打开图片选择弹框；「批量传图」弹框的备选图池走这条通道。 */
    onRequestImages?: (request: SpecImagesBatchPickRequest) => void;
    /** 「批量传图」弹框点确定时整份写回规格一的图片。 */
    onApplyImages?: (images: Record<string, string>) => void;
    onClear: (values: string[]) => void;
    onUploadNew: () => void;
    onUploadOne: (value: string) => void;
    /** 规格值图 AI 任务的占位卡；渲染在规格图网格开头。 */
    pendingImages?: readonly ProductImagePending[];
    onPendingDismiss?: (key: string) => void;
    onAiAction?: (intent: Extract<import('./types').ProductEditorAiIntent, {
        kind: 'image-translate' | 'image-remove-mark' | 'image-edit';
    }>) => void;
}): import("react/jsx-runtime").JSX.Element;
