import type { ProductEditorSku } from './types';
export type SkuBatchPriceField = 'sourcePrice' | 'price';
export type SkuBatchPriceMode = 'unified' | 'formula';
export type SkuBatchPriceRoundingMode = 'round' | 'ceil' | 'floor';
export type SkuBatchPricePrecision = {
    type: 'rounding';
    mode: SkuBatchPriceRoundingMode;
} | {
    type: 'tail';
    value: string;
} | {
    type: 'decimals';
    digits: 1 | 2;
};
export type SkuBatchPriceFormula = {
    baseField: SkuBatchPriceField;
    multiplier: string;
    addend: string;
    subtrahend: string;
    precision: SkuBatchPricePrecision | null;
};
export declare function parseBatchPriceValue(raw: string): number | null;
export declare function isValidBatchPriceValue(field: SkuBatchPriceField, value: number | null): value is number;
export declare function isBatchPriceFormulaValid(formula: SkuBatchPriceFormula): boolean;
export declare function applyBatchPrice(skus: ProductEditorSku[], field: SkuBatchPriceField, raw: string): ProductEditorSku[] | null;
export declare function applyBatchPriceFormula(skus: ProductEditorSku[], field: SkuBatchPriceField, formula: SkuBatchPriceFormula): ProductEditorSku[] | null;
