import type { CollectBatch, CollectProduct, CollectTask as CollectTaskDTO } from './erp-v1-types';
import type { CollectInboxDetail, CollectionBatchDetail, CollectionProductDetail, CollectionTask, CollectProductListParams, CollectProductListResponse, CollectProductRow, CreateCollectionBatchPayload, UpdateCollectionProductPayload } from './product-library';
export declare const collectTaskView: (task: CollectTaskDTO) => CollectionTask;
export declare const collectBatchView: (batch: CollectBatch) => CollectionBatchDetail;
export declare function collectProductView(product: CollectProduct): CollectionProductDetail;
export declare const erpCollectClient: {
    createCollectionBatch(payload: CreateCollectionBatchPayload): Promise<import("./product-library").CreateCollectionBatchResult>;
    listCollectProducts(params?: CollectProductListParams): Promise<CollectProductListResponse>;
    getCollectInboxDetail(taskId: string): Promise<CollectInboxDetail>;
    saveCollectInboxItem(taskId: string, payload: UpdateCollectionProductPayload): Promise<CollectInboxDetail>;
    deleteCollectInboxItems: (taskIds: string[]) => Promise<{
        deleted: number;
    }>;
    getCollectionBatch(batchId: string): Promise<CollectionBatchDetail>;
    listCollectionBatchTasks(batchId: string): Promise<{
        list: CollectionTask[];
    }>;
    retryCollectionTask(taskId: string): Promise<CollectionTask>;
    getCollectProduct(productId: string): Promise<CollectionProductDetail>;
    listCollectProductsByIds(ids: string[]): Promise<CollectProductRow[]>;
};
