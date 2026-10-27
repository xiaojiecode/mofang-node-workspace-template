import { type SkuBatchPriceField } from './product-editor-price-batch-model';
import type { ProductEditorSku } from './types';
export declare function SkuPriceBatchDialog({ open, field, skus, currency, onOpenChange, onConfirm }: {
    open: boolean;
    field: SkuBatchPriceField;
    skus: ProductEditorSku[];
    currency: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: (skus: ProductEditorSku[]) => void;
}): import("react/jsx-runtime").JSX.Element;
