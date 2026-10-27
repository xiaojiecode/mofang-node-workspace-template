import type { RequestProductMediaImages } from './product-media-image-picker';
import type { ProductEditorMode, ProductEditorSku, ProductEditorSkuSpecAxis, ProductImagePending, SkuEditorChange } from './types';
import { type SkuSpecAttributeOption } from './use-sku-spec-editor';
export type { SkuEditorChange } from './types';
export declare function SkuEditor({ skus, skuSpecAxes, onChange, currency, onCurrencyChange, currencyLocked, error, mode, onModeChange, salesAttributeOptions, onRequestSkuImages, onAiIntent, onUndoSpecPolish, onSkuImageAiAction, specImagePendingImages, onSpecImagePendingDismiss }: {
    skus: ProductEditorSku[];
    skuSpecAxes?: ProductEditorSkuSpecAxis[];
    onChange: (change: SkuEditorChange) => void;
    currency?: string;
    onCurrencyChange?: (currency: string) => void;
    /** 货币由平台商品决定时置为 true。 */
    currencyLocked?: boolean;
    error?: string;
    mode: ProductEditorMode;
    onModeChange: (mode: ProductEditorMode) => void;
    /** 类目 schema 里的销售（变体）属性。对齐到它的轴走类目属性 id；
     * 自由文本的轴按 TikTok 自定义销售属性透传（平台会建出新属性），不会丢。 */
    salesAttributeOptions?: SkuSpecAttributeOption[];
    onRequestSkuImages?: RequestProductMediaImages;
    onAiIntent?: () => void;
    onUndoSpecPolish?: () => void;
    onSkuImageAiAction?: (intent: Extract<import('./types').ProductEditorAiIntent, {
        kind: 'image-translate' | 'image-remove-mark' | 'image-edit';
    }>) => void;
    /** 规格值图 AI 任务的占位卡，透传给规格图网格。 */
    specImagePendingImages?: readonly ProductImagePending[];
    onSpecImagePendingDismiss?: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
