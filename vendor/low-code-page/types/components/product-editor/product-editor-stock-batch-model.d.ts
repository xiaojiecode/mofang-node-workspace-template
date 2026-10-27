import type { ProductEditorSku } from './types';
export declare function parseBatchStockValue(raw: string): number | null;
export declare function applyBatchStock(skus: ProductEditorSku[], raw: string): ProductEditorSku[] | null;
