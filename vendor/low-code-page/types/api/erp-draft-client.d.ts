import type { DraftProductDetail, UpdateDraftPayload } from './product-draft-types';
import type { DraftAiDescriptionGeneratePayload, DraftAiDescriptionGenerateResult, DraftAiGeneratePayload, DraftAiGenerateResult, DraftAiSpecNamePolishPayload, DraftAiSpecNamePolishResult, DraftAiTitleGeneratePayload, DraftAiTitleGenerateResult, DraftAttributeSuggestPayload, DraftAttributeSuggestResult, DraftListRow } from './product-library';
export declare const erpDraftClient: {
    getDraft(draftId: string): Promise<DraftProductDetail>;
    updateDraft(draftId: string, payload: UpdateDraftPayload): Promise<DraftProductDetail>;
    createCollectionProductDraft(productId: string, payload: {
        shopId: string;
        workflowRunId: string;
        nodeId?: string;
        nodeRunId?: string;
        language?: string;
    }): Promise<DraftProductDetail>;
    listDraftsByIds(ids: string[]): Promise<DraftListRow[]>;
    listDraftsByRun(workflowRunId: string): Promise<DraftListRow[]>;
    prepareCollectionDrafts(payload: {
        productIds: string[];
        workflowRunId: string;
        nodeId: string;
        nodeRunId?: string;
        targetShopId?: string;
    }): Promise<{
        list: DraftProductDetail[];
        failures: {
            productId: string;
            error: string;
        }[];
        partial: boolean;
        total: number;
    }>;
    bindDraftsShop(payload: {
        draftIds: string[];
        workflowRunId: string;
        shopId: string;
    }): Promise<DraftProductDetail[]>;
    getCategorySuggestion: (draftId: string) => Promise<import("./erp-v1-contract-types").DraftCategorySuggestionResp>;
    getCategoryAttributes: (draftId: string, params?: {
        categoryId?: string;
        categoryVersion?: string;
    }) => Promise<import("./erp-v1-contract-types").DraftCategoryAttributesResp>;
    suggestDraftAttributes(draftId: string, payload?: DraftAttributeSuggestPayload): Promise<DraftAttributeSuggestResult>;
    generateDraftContent(draftId: string, payload: DraftAiGeneratePayload): Promise<DraftAiGenerateResult>;
    generateDraftTitle(draftId: string, payload?: DraftAiTitleGeneratePayload): Promise<DraftAiTitleGenerateResult>;
    generateDraftDescription(draftId: string, payload?: DraftAiDescriptionGeneratePayload): Promise<DraftAiDescriptionGenerateResult>;
    polishDraftSpecNames(draftId: string, payload: DraftAiSpecNamePolishPayload): Promise<DraftAiSpecNamePolishResult>;
};
