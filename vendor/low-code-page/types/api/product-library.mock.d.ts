import type { BatchPublishValidatePayload, BatchPublishValidationResult, CollectInboxDetail, CollectionBatchDetail, CollectionProductDetail, CollectionSource, CollectionTask, CollectProductListParams, CollectProductListResponse, CreateCollectionBatchPayload, CreateCollectionBatchResult, DeleteCollectProductResult, DraftProductDetail, DraftPublishPayload, PublishTaskBatchDeleteResult, PublishTaskBatchRetryResult, PublishTaskDetail, PublishTaskListParams, PublishTaskListResponse, UpdateCollectionProductPayload, UpdateDraftPayload, UpdatePublishTaskPayload } from './product-library';
type MockBatch = CollectionBatchDetail & {
    productIds: string[];
};
export declare function isProductLibraryMockEnabled(): boolean;
export declare function listMockCollectProducts(params?: CollectProductListParams): CollectProductListResponse;
export declare function listMockPublishTasks(params?: PublishTaskListParams): PublishTaskListResponse;
export declare function getMockPublishTask(taskId: string): PublishTaskDetail;
export declare function updateMockPublishTask(taskId: string, payload: UpdatePublishTaskPayload): PublishTaskDetail;
export declare function retryMockPublishTask(taskId: string): PublishTaskDetail;
export declare function retryMockPublishTasks(taskIds: string[]): PublishTaskBatchRetryResult;
export declare function deleteMockPublishTasks(taskIds: string[]): PublishTaskBatchDeleteResult;
export declare function getMockDraft(draftId: string): DraftProductDetail;
export declare function updateMockDraft(draftId: string, payload: UpdateDraftPayload): DraftProductDetail;
/**
 * 草稿发布：复用原失败记录（置为发布中并清空旧失败原因），
 * 与 PRD「重新发布不新增记录」的约定一致。
 */
export declare function publishMockDraft(draftId: string, payload: DraftPublishPayload): PublishTaskDetail;
export declare function createMockCollectionBatch(payload: CreateCollectionBatchPayload): CreateCollectionBatchResult;
export declare function retryMockCollectionTask(taskId: string): CollectionTask;
export declare function getMockCollectionBatch(batchId: string): Omit<MockBatch, "productIds">;
export declare function getMockCollectProduct(productId: string): CollectionProductDetail;
export declare function listMockPlatformCategories(): {
    list: {
        id: string;
        name: string;
        children: {
            id: string;
            name: string;
            children: {
                id: string;
                name: string;
            }[];
        }[];
    }[];
};
export declare function syncMockTikTokCategories(): {
    site: string;
    count: number;
    leafCount: number;
    lastSyncedAt: string;
};
export declare function updateMockCollectProduct(productId: string, payload: UpdateCollectionProductPayload): {
    title: string;
    description: string | undefined;
    currency: string | undefined;
    language: string | undefined;
    id: string;
    resultProductId?: string;
    source: CollectionSource;
    sourceUrl: string;
    sourceItemId: string;
    category?: {
        ids?: string[];
        labels?: string;
    } | undefined;
    sourceCategory?: {
        ids?: string[];
        labels?: string;
    } | undefined;
    infoComplete: boolean;
    price?: number;
    stock?: number;
    imageUrl?: string;
    createdAt: string;
    collectedAt?: string;
    updatedAt: string;
    collectionStatus?: import("./product-library").CollectInboxItemStatus;
    failureReason?: string;
    tenantId?: number;
    nodeId?: string;
    workflowRunId?: string;
    brand?: string;
    videoUrl?: string;
    videoName?: string;
    packageWeight?: import("./product-library").CollectionProductPackageWeight | null;
    packageDimensions?: import("./product-library").CollectionProductPackageDimensions | null;
    sizeChartId?: string;
    sizeChartUrl?: string;
    codAllowed?: boolean | null;
    shippingMethod?: string;
    draftImages?: import("./product-library").CollectionProductImage[];
    images: import("./product-library").CollectionProductImage[];
    skus: import("./product-library").CollectionProductSku[];
    productAttributes?: import("./product-library").CollectionProductAttribute[];
    categoryAttributes?: import("./product-library").CollectionProductAttribute[];
    rawData?: unknown;
};
export declare function deleteMockCollectProduct(productId: string): DeleteCollectProductResult;
/**
 * 采集箱详情 Mock：路径参数为采集箱行 id（collect_tasks.id）。
 * 只有采集成功的记录才有采集商品，失败 / 跳过返回 product: null。
 */
export declare function getMockCollectInboxDetail(taskId: string): CollectInboxDetail;
/** 采集箱保存 Mock：只更新采集商品本体，不产生任何草稿。 */
export declare function saveMockCollectInboxItem(taskId: string, payload: UpdateCollectionProductPayload): CollectInboxDetail;
export declare function validateMockBatchPublish(payload: BatchPublishValidatePayload): BatchPublishValidationResult;
export declare function deleteMockCollectInboxItems(taskIds: string[]): {
    deleted: number;
};
export declare function resetProductLibraryMock(): void;
export {};
