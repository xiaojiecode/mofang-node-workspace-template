import type { ProductEditorSku } from './types';
export declare function SkuStockBatchDialog({ open, skus, onOpenChange, onConfirm }: {
    open: boolean;
    skus: ProductEditorSku[];
    onOpenChange: (open: boolean) => void;
    onConfirm: (skus: ProductEditorSku[]) => void;
}): import("react/jsx-runtime").JSX.Element;
