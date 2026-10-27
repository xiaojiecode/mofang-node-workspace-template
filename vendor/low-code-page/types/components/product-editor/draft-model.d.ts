import type { DraftComplianceCheckRequest, DraftComplianceReport, DraftProductDetail } from '../../api/product-library';
import type { ProductEditorValue } from './types';
export declare const draftProductEditorAdapter: {
    toValue(draft: DraftProductDetail, editorId?: string): ProductEditorValue;
    toSnapshot(value: ProductEditorValue): DraftComplianceCheckRequest["snapshot"];
    withComplianceReport(value: ProductEditorValue, report: DraftComplianceReport): ProductEditorValue;
};
