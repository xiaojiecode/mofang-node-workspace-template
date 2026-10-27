import type { DraftPublishPayload } from './product-draft-types';
import type { BatchPublishDraftsResult, BatchPublishSubmitPayload, BatchPublishSubmitResult, BatchPublishValidatePayload, PublishTaskListParams, PublishTaskListResponse, PublishWorkbenchListParams } from './product-library';
declare function listTasks(params?: PublishTaskListParams): Promise<PublishTaskListResponse>;
declare function workbench(params?: PublishWorkbenchListParams): Promise<{
    list: import("./product-library").PublishWorkbenchItem[];
    pagination: {
        totalPages: number;
        page: number;
        pageSize: number;
        total: number;
    };
    statusCounts: Record<string, number>;
    unavailableFields: string[];
}>;
export declare const erpPublishClient: {
    listPublishTasks: typeof listTasks;
    listPublishWorkbench: typeof workbench;
    listAllPublishWorkbenchItems(params: {
        workflowRunId: string;
        productIds?: string[];
    }): Promise<import("./product-library").PublishWorkbenchItem[]>;
    batchPublishDrafts(payload: {
        draftIds: string[];
        workflowRunId: string;
        workflowId?: string;
        nodeId?: string;
    }): Promise<BatchPublishDraftsResult>;
    publishDraft(draftId: string, payload: DraftPublishPayload): Promise<import("./product-library").PublishTaskListItem>;
    validateBatchPublish(payload: BatchPublishValidatePayload): Promise<import("./product-library").BatchPublishValidationResult>;
    validateProductMove(payload: BatchPublishValidatePayload): Promise<import("./product-library").BatchPublishValidationResult & {
        targetChecked: boolean;
        requiresConfirmation: boolean;
        pairResults: Array<{
            productId: string;
            shopId: string;
            alreadyPublished: boolean;
        }>;
    }>;
    submitBatchPublish(payload: BatchPublishSubmitPayload): Promise<BatchPublishSubmitResult>;
    getPublishTask(taskId: string): Promise<import("./product-library").PublishTaskListItem>;
    cancelPublishTask(taskId: string): Promise<import("./product-library").PublishTaskListItem>;
    deletePublishTasks(taskIds: string[]): Promise<import("./product-library").PublishTaskBatchDeleteResult>;
    retryPublishTasks(taskIds: string[]): Promise<import("./product-library").PublishTaskBatchRetryResult>;
    retryPublishTask(taskId: string): Promise<import("./product-library").PublishTaskListItem>;
};
export {};
