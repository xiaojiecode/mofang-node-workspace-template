import type { ProductEditorDialogProps, ProductEditorMode, ProductEditorSkuSpecAxis, ProductEditorValue } from './types';
export type SpecPolishUndoSnapshot = {
    productId: string;
    mode: ProductEditorMode;
    axes: ProductEditorSkuSpecAxis[];
    skuModeDrafts?: ProductEditorValue['skuModeDrafts'];
};
export declare function ProductEditorDialog({ services, pageType, open, value, loading, errorMessage, complianceError, relatedProducts, totalCount, initialProductId, logisticsAutoFill, onOpenChange, onProductSelect, onProductDelete, onSave, onComplianceCheck, actions, onDescriptionAction, onAiAction, categoryTree, categoryAttributes, categoryLoading, categoryError: categoryLoadError, categorySyncing, onCategorySync, onCategoryChange, categoryDraftId, categoryShopId, categorySite, categoryPlatform, skipCategorySuggestion, categoryDisabled, categoryAttributesReadOnly, allowOptionalSkuFields, productImagePendingImages, productImageAutoApply, onProductImageAutoApplied, onProductImagePendingDismiss, specImagePendingImages, onSpecImagePendingDismiss, specImageAutoApply, onSpecImageAutoApplied, sizeChartPendingImages, onSizeChartPendingDismiss, sizeChartAutoApply, onSizeChartAutoApplied, descriptionImageEditAutoApply, onDescriptionImageEditAutoApplied, descriptionPendingImages, descriptionAutoApply, onDescriptionAutoApplied, onDescriptionPendingDismiss, videoGenerating }: ProductEditorDialogProps): import("react/jsx-runtime").JSX.Element;
