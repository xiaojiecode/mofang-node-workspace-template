import type { Row } from './erp-adopted-models';
export declare function previewCostTemplate(request: Row): Promise<{
    lines: {
        draftId: unknown;
        costPrice: unknown;
        weight: unknown;
        result: Row;
    }[];
    total: number;
    nativePreview: Row;
    productFailures: Row[];
    failedLines: Row[];
}>;
export declare function previewPricingRule(request: Row): Promise<{
    productCount: number;
    skuCount: number;
    lines: {
        productId: unknown;
        draftId: unknown;
        currentPrice: unknown;
        calculatedPrice: unknown;
        delta: unknown;
        costPrice: unknown;
    }[];
    nativePreview: Row;
    productFailures: Row[];
    failedLines: Row[];
}>;
export declare function pricingPreviewFailureMessages(result: {
    failedLines?: Row[];
    productFailures?: Row[];
}): string[];
