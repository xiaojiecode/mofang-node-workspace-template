import type { ProductEditorLogistics, ProductEditorLogisticsInformation } from './types';
export declare function applyProductEditorLogisticsAutoFill(current: ProductEditorLogistics, information: ProductEditorLogisticsInformation, weightUnit?: 'KG' | 'G', options?: {
    overwrite?: boolean;
}): ProductEditorLogistics | undefined;
export declare function isProductEditorLogisticsEmpty(logistics: ProductEditorLogistics): boolean;
