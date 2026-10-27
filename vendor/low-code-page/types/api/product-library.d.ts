export type { DraftAttribute, DraftBoundSummary, DraftComplianceCheckCapability, DraftComplianceCheckRequest, DraftComplianceConfig, DraftComplianceDescriptionDetection, DraftComplianceImageDetection, DraftComplianceProductDetection, DraftComplianceReport, DraftComplianceSnapshot, DraftEditorMetadata, DraftImage, DraftProductDetail, DraftPublishPayload, DraftSKU, DraftSKUAttribute, UpdateDraftPayload } from './product-draft-types';
export type CollectionSource = '1688' | 'pinduoduo' | 'taobao_tmall' | 'aliexpress' | 'shein_temu' | 'custom';
export type CollectProductListSortField = '' | 'price' | 'stock' | 'collectedAt' | 'updatedAt';
/** @deprecated Use CollectProductListSortField. */
export type CollectProductListSortBy = CollectProductListSortField;
export type CollectProductListSortOrder = 'asc' | 'desc';
export type CollectionTaskStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'cancelled' | 'retrying' | 'dead_letter';
export interface CreateCollectionBatchPayload {
    source: CollectionSource;
    urls: string[];
    /** 独立商品库：采集批次 id。 */
    taskId?: string;
    /** 工作流采集节点：值为本次节点运行的 nodeRunId。 */
    workflowId?: string;
}
export interface CreateCollectionBatchResult {
    batchId: string;
    batch?: {
        id?: string;
    };
    taskCount?: number;
}
export interface CollectionTask {
    id: string;
    batchId?: string;
    source: CollectionSource;
    sourceUrl: string;
    status: CollectionTaskStatus;
    resultProductId?: string;
    rawResult?: Record<string, unknown>;
    errorMessage?: string;
    collectorErrorCode?: string;
    retryable?: boolean;
    failureHint?: string;
    sameUrlSucceededElsewhere?: boolean;
    requestOptions?: Record<string, unknown>;
    retryCount?: number;
    maxRetries?: number;
    nextRetryAt?: string;
    retryEnqueuedAt?: string;
    createdBy?: string;
    nodeId?: string;
    workflowRunId?: string;
    startedAt?: string;
    finishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface CollectionBatchDetail {
    id?: string;
    batchId: string;
    status: string;
    totalCount?: number;
    successCount?: number;
    failedCount?: number;
    skippedCount?: number;
    tasks?: CollectionTask[];
}
export interface CollectProductListParams {
    page?: number;
    pageSize?: number;
    source?: CollectionSource;
    title?: string;
    sourceItemId?: string;
    startTime?: string;
    endTime?: string;
    /** 采集箱时间范围过滤的任务字段（按任务更新时间口径）。 */
    timeField?: 'createdAt' | 'updatedAt';
    /** 页签口径；collecting 写成 statusGroup=running，success / failed 原样。 */
    status?: 'all' | 'success' | 'failed' | 'collecting';
    sortField?: CollectProductListSortField;
    sortOrder?: CollectProductListSortOrder;
    /** 独立商品库：按采集批次 id 过滤。 */
    taskId?: string;
    /** 工作流采集节点：值为本次节点运行的 nodeRunId。 */
    workflowId?: string;
    /** 工作流运行范围；同一运行内节点重跑采集的商品仍归属该范围。 */
    workflowRunId?: string;
}
/** 店铺**可用**的二级类目：平台类目 ID + 中英名（中文名可能缺省）。 */
export type CollectProductSecondCategory = {
    categoryId: string;
    name: string;
    nameCn?: string;
};
/**
 * 按一批 id 批量取数的行形状；后端一次最多接受 200 个 id（逗号分隔）。
 *
 * `CollectProductRow`：`GET /collect-products?productIds=`，货源价 / 库存是采集口径。
 * `DraftListRow`：`GET /drafts?draftIds=`，是草稿列表投影——只有主图 `productImage`，
 * 不含 `draftSkus` / `draftImages` 子表，所以拿不到草稿售价、库存与重量。
 */
export interface CollectProductRow {
    id: string;
    source?: string;
    sourceUrl?: string;
    sourceItemId?: string;
    title?: string;
    currency?: string;
    language?: string;
    /**
     * 该采集商品**最新一条草稿**的目标店铺；没有草稿时缺省。
     * 列表按这个店铺取可用二级类目（口径见 `docs/product-api.md` 3.9）。
     */
    shopId?: string;
    /**
     * 该店铺可用的二级类目，只一个；没有草稿、或一个可用类目都没有时缺省。
     * 只用来补「店铺 / 预发布类目」的展示，不代表草稿已经选了类目。
     */
    availableSecondCategory?: CollectProductSecondCategory;
    mainImage?: string;
    productImage?: string;
    minPrice?: number;
    maxPrice?: number;
    stock?: number;
    category?: {
        ids?: string[];
        labels?: string;
    };
}
export interface DraftListRow {
    sourcePlatformProductId?: string;
    id: string;
    collectProductId?: string;
    shopId?: string;
    shopName?: string;
    platform?: string;
    region?: string;
    /** 站点中文名（`泰`）：列表原样下发，只用于发布目标列展示。 */
    regionCN?: string;
    source?: string;
    title?: string;
    description?: string;
    currency?: string;
    language?: string;
    categoryId?: string;
    categoryPath?: string;
    status?: string;
    productImage?: string;
    /** 草稿包裹数据（重量单位与数值同处一个对象，见 `editorMetadata.logistics`）。 */
    editorMetadata?: {
        logistics?: {
            weight?: string;
            weightUnit?: string;
        };
    };
}
/**
 * 采集箱列表行的展示状态。
 * 后端任务状态 pending / running / retrying 统一收敛为 `collecting`（采集中）：
 * 重试后任务先转 retrying 再转 running，页面需要一直能看到这一行。
 */
export type CollectInboxItemStatus = 'success' | 'failed' | 'skipped' | 'collecting';
export interface CollectProductListItem {
    /** 采集箱行 id，等于 collect_tasks.id，也是采集箱详情/保存接口的路径参数。 */
    id: string;
    resultProductId?: string;
    source: CollectionSource;
    sourceUrl: string;
    sourceItemId: string;
    title: string;
    currency: string;
    language: string;
    category?: {
        ids?: string[];
        labels?: string;
    };
    sourceCategory?: {
        ids?: string[];
        labels?: string;
    };
    infoComplete: boolean;
    price?: number;
    stock?: number;
    imageUrl?: string;
    createdAt: string;
    collectedAt?: string;
    updatedAt: string;
    collectionStatus?: CollectInboxItemStatus;
    failureReason?: string;
}
/**
 * 采集箱详情响应（GET /collect/inbox/:id 与 POST /collect/inbox/:id/save）。
 * 采集箱与草稿解耦：只返回采集任务与采集商品，不含任何草稿 / 店铺字段。
 * 任务未产出采集商品（失败 / 跳过 / 采集商品已删除）时 product 为 null。
 */
export interface CollectInboxDetail {
    /** collect_tasks.id，与采集箱列表行 id 一致。 */
    id: string;
    task: CollectionTask;
    product: CollectionProductDetail | null;
}
export interface CollectProductListResponse {
    list: CollectProductListItem[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
    statusCounts?: {
        all: number;
        success: number;
        failed: number;
        running?: number;
    };
}
export interface CollectInboxDetail {
    id: string;
    task: CollectionTask;
    product: CollectionProductDetail | null;
}
export type PlatformProductStatus = 'active' | 'inactive';
export type PlatformProductSortField = 'price' | 'sales' | 'stock' | 'createdAt';
export type PlatformProductSortOrder = 'asc' | 'desc';
export interface PlatformProductListParams {
    page?: number;
    pageSize?: number;
    sourceItemId?: string;
    productId?: string;
    shopId?: string;
    platform?: string;
    status?: PlatformProductStatus;
    keyword?: string;
    start?: string;
    end?: string;
    sortField?: PlatformProductSortField;
    sortOrder?: PlatformProductSortOrder;
}
export interface PlatformProductImage {
    id?: string;
    type?: string;
    imageType?: string;
    url?: string;
    originUrl?: string;
    publicUrl?: string;
    objectKey?: string;
    sortOrder?: number;
    isBestMain?: boolean;
    source?: string;
    sourceTaskId?: string;
    originalImageId?: string;
    storageKey?: string;
    score?: number;
}
export interface PlatformProductSku {
    id?: string;
    draftSkuId?: string;
    externalSkuId?: string;
    skuCode?: string;
    skuName?: string;
    /** 变体轴映射：`{类目销售属性名: 值名}`。后端已过滤掉内部注入键。 */
    attrs?: Record<string, unknown>;
    price?: number;
    stock?: number;
    imageUrl?: string;
    bindStatus?: string;
    bindConfidence?: number;
    bindMessage?: string;
    /** 本地运营扩展字段：本系统自有，不提交平台。 */
    costPrice?: number;
    presaleType?: string;
    productionDays?: number;
}
export interface PlatformProductListItem {
    id: string;
    nodeId?: string;
    workflowRunId?: string;
    title?: string;
    images?: PlatformProductImage[];
    productImage?: string;
    shopId: string;
    shopName?: string;
    platform: string;
    category?: {
        ids?: string[];
        labels?: string;
    };
    sourceCategory?: {
        ids?: string[];
        labels?: string;
    };
    status: PlatformProductStatus;
    publishStatus?: string;
    currency?: string;
    minPrice?: number;
    maxPrice?: number;
    sales: number;
    stock?: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt?: string;
}
export interface PlatformProductListResponse {
    list: PlatformProductListItem[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
    statusCounts: {
        total: number;
        active: number;
        inactive: number;
    };
}
export interface PlatformProductPlatformOption {
    platform: string;
    productCount: number;
}
export interface PlatformProductShopOption {
    id: string;
    platform: string;
    shopName: string;
    productCount: number;
}
export interface PlatformProductPlatformOptionsResponse {
    list: PlatformProductPlatformOption[];
}
export interface PlatformProductShopOptionsResponse {
    list: PlatformProductShopOption[];
}
export interface CollectProvider {
    source: string;
    name: string;
    description?: string;
    status: string;
    batchSupported?: boolean;
    urlPatterns?: string[];
    features?: string[];
    notes?: string;
}
export interface CollectProviderListResponse {
    list: CollectProvider[];
}
export interface CollectPluginSku {
    properties?: Record<string, unknown>;
    price?: number;
    stock?: number;
    image?: string;
}
export interface CollectPluginPayload {
    title: string;
    url: string;
    company?: string;
    category?: string;
    mainImages?: string[];
    attributes?: Record<string, unknown>;
    packaging?: string[];
    skus: CollectPluginSku[];
    detailImages?: string[];
}
export interface CollectPluginResult {
    batch: CollectionBatchDetail;
    task: CollectionTask;
    productId: string;
}
export interface PlatformCategoryNode {
    id?: string;
    categoryId?: string;
    parentId?: string;
    name?: string;
    categoryName?: string;
    level?: number;
    isLeaf?: boolean;
    status?: string;
    path?: string;
    syncedAt?: string;
    children?: PlatformCategoryNode[];
}
export interface PlatformCategoriesResult {
    list?: PlatformCategoryNode[];
    flat?: PlatformCategoryNode[];
    total?: number;
    leafCount?: number;
    lastSyncedAt?: string;
}
/** 店铺可用类目（选品链路）：只含**该店铺**可用的三级类目，见 docs/product-api.md §3.15.2。 */
export interface ShopCategoryLeaf {
    /** 平台类目 ID（不是选品要用的三级类目 ID —— 那个由类目匹配接口给出）。 */
    categoryId: string;
    parentId?: string;
    name: string;
    nameCn?: string;
    level?: number;
    /** 英文路径 `A > B > C`：既是对外契约，也是类目匹配接口的输入。 */
    pathEn: string;
    pathCn?: string;
    permissionStatuses?: string[];
    available?: boolean;
}
export interface ShopCategoriesResult {
    shopId: string;
    platform: string;
    region?: string;
    schemaPlatform: string;
    /** 假：该平台不提供店铺级权限位（此时 leaves 为空、degraded 为真）。 */
    permissionKnown: boolean;
    degraded: boolean;
    degradedReason?: string;
    /** 真：上游暂时不可用，返回的是旧缓存。 */
    stale: boolean;
    source: string;
    level3Total: number;
    availableCount: number;
    syncedAt?: string;
    leaves: ShopCategoryLeaf[];
}
export interface PlatformCategoryAttribute {
    id?: string;
    categoryId?: string;
    attrId: string;
    name: string;
    displayName?: string;
    required?: boolean;
    valueType?: string;
    options?: Array<{
        id?: string;
        name: string;
        displayName?: string;
    }>;
    unitOptions?: Array<{
        id?: string;
        name: string;
    }>;
    syncedAt?: string;
}
export interface PlatformCategoryAttributesResult {
    list: PlatformCategoryAttribute[];
}
export interface PlatformCategoryStatsResult {
    count: number;
    leafCount: number;
    lastSyncedAt?: string;
}
export interface DraftSkuSearchParams {
    keyword?: string;
    productId?: string;
    limit?: number;
}
export interface DraftSkuSearchItem {
    productId: string;
    productTitle: string;
    productSkuId: string;
    skuCode: string;
    skuName: string;
    stock: number;
    attrs?: Record<string, unknown>;
}
export interface DraftSkuSearchResponse {
    list: DraftSkuSearchItem[];
}
export interface DraftAiGeneratePayload {
    fields: string[];
    language?: string;
    platform?: string;
    images?: string[];
    keywords?: string;
    negativeWords?: string;
}
export interface DraftAiGenerateResult {
    title?: {
        optimizedTitle: string;
        keywords?: string[];
        reason?: string;
        taskId?: string;
    };
    description?: {
        description: string;
        highlights?: string[];
        specifications?: string[];
        packageIncludes?: string[];
        notes?: string[];
        reason?: string;
        taskId?: string;
    };
}
export interface DraftAiTitleGeneratePayload {
    images?: string[];
    keywords?: string;
    negativeWords?: string;
}
export interface DraftAiTitleGenerateResult {
    imageRecognition?: Record<string, unknown>;
    candidates: Array<{
        title: string;
        reason?: string;
    }>;
    taskId?: string;
}
export interface DraftAiDescriptionGeneratePayload {
    images?: string[];
    keywords?: string;
    negativeWords?: string;
}
export interface DraftAiDescriptionGenerateResult {
    imageRecognition?: Record<string, unknown>;
    description: string;
    taskId?: string;
}
export interface DraftAiSpecNamePolishPayload {
    specNames: Array<{
        attributeName: string;
        canonicalKey?: string;
        sourceName?: string;
    }>;
}
export interface DraftAiSpecNamePolishResult {
    polished: Array<{
        attributeName: string;
        canonicalKey?: string;
        sourceName?: string;
        polishedName: string;
        reason?: string;
    }>;
    taskId?: string;
}
export interface DraftAttributeTranslatePayload {
    language: string;
    apply?: boolean;
}
export interface DraftAttributeTranslateResult {
    language: string;
    translations: Array<{
        sourceValue: string;
        targetValue: string;
    }>;
}
export interface DraftAttributeSuggestPayload {
    categoryId?: string;
    categoryVersion?: string;
    mode?: string;
}
export interface DraftAttributeSuggestResult {
    categoryId?: string;
    suggestions: Array<{
        attributeId: string;
        attributeName: string;
        valueId?: string;
        valueName?: string;
        sourceName?: string;
        confidence?: number;
        reason?: string;
        source?: string;
        scope?: string;
    }>;
}
export interface DraftAttributeProjectionResult {
    issues?: Array<Record<string, unknown>>;
    [key: string]: unknown;
}
export interface ProductSyncTaskListParams {
    page?: number;
    pageSize?: number;
    shopId?: string;
    platform?: string;
    status?: string;
    start?: string;
    end?: string;
}
export interface ProductSyncTaskListResponse {
    list: SyncProductsTask[];
    pagination: CollectProductListResponse['pagination'];
}
export interface PublishReadyListParams {
    page?: number;
    pageSize?: number;
    platform?: string;
    shopId?: string;
    keyword?: string;
}
export interface PublishReadyItem {
    id: string;
    workflowRunId?: string;
    collectProductId?: string;
    shopId?: string;
    shopName?: string;
    platform?: string;
    title?: string;
    currency?: string;
    minPrice?: number;
    mainImage?: string;
    updatedAt?: string;
}
export interface PublishReadyListResponse {
    list: PublishReadyItem[];
    pagination: CollectProductListResponse['pagination'];
}
/**
 * 商品信息化工作台的分组口径是「发布状态」，取值由后端白名单校验。
 *
 * 与发布记录列表的 {@link PublishStatusGroup}（all / success / failed / publishing）不是
 * 同一套；商品信息优化节点里的页签（已采集 / 合规异常 / 定价失败）也不是发布状态，
 * 不要直接下发（后端会回 400）。
 */
export type WorkbenchStatusGroup = 'all' | 'unpublished' | 'published' | 'failed' | 'publishing';
export interface PublishWorkbenchListParams {
    page?: number;
    pageSize?: number;
    /**
     * 工作流运行 ID：节点内查询必须始终携带，工作台据此把结果限制在该次运行交出的批次里。
     */
    workflowRunId?: string;
    source?: string;
    keyword?: string;
    statusGroup?: WorkbenchStatusGroup;
    /** 采集商品 ID（collect_products.id），最多 200 个。 */
    productIds?: string[];
    batchId?: string;
    shopId?: string;
}
export interface PublishWorkbenchTarget {
    publishMode?: string;
    editNodeRunId?: string;
    originDraftId?: string;
    rootDraftId?: string;
    updateTargetShopProductId?: string;
    draftProductId?: string;
    shopId?: string;
    shopName?: string;
    platform?: string;
    region?: string;
    /** 该目标店铺草稿的预发布类目路径（`电子 > 手机配件`）；草稿还没选类目时是空串。 */
    categoryPath?: string;
    /**
     * 该目标店铺草稿的售价区间与币种（后端按 draft_skus 聚合）。
     * 商品项上的同名字段是采集源价，两者口径不同，不要混用。
     */
    currency?: string;
    minPrice?: number;
    maxPrice?: number;
    stock?: number;
    draftStatus?: string;
    status?: string;
    shopAuthStatus?: string;
    taskId?: string;
    errorCode?: string;
    errorMessage?: string;
    finishedAt?: string;
}
export interface PublishWorkbenchImage {
    id?: string;
    imageType?: string;
    url?: string;
    publicUrl?: string;
    originUrl?: string;
    sortOrder?: number;
}
export interface PublishWorkbenchItem {
    publicationHistory?: {
        everPublished: boolean;
        lastSuccessfulDraftId?: string;
        lastSuccessfulTaskId?: string;
    };
    id: string;
    source?: string;
    sourceItemId?: string;
    sourceUrl?: string;
    title?: string;
    description?: string;
    mainImage?: string;
    images?: Array<PublishWorkbenchImage | string>;
    specs?: Array<{
        name: string;
        value: string;
    }>;
    category?: string;
    categoryPath?: string;
    platform?: string;
    site?: string;
    language?: string;
    currency?: string;
    minPrice?: number;
    maxPrice?: number;
    stock?: number;
    weightKg?: number;
    infoComplete?: boolean;
    nodeId?: string;
    workflowRunId?: string;
    status?: string;
    targets?: PublishWorkbenchTarget[];
    createdAt?: string;
    updatedAt?: string;
}
export interface PublishWorkbenchListResponse {
    list: PublishWorkbenchItem[];
    pagination: CollectProductListResponse['pagination'];
    statusCounts?: Record<string, number>;
    unavailableFields?: string[];
}
/** `GET /drafts` 的分页投影（按运行或按 id 批量取都是同一个响应形状）。 */
export interface DraftListResponse {
    list: DraftListRow[];
    pagination: CollectProductListResponse['pagination'];
}
/**
 * 包裹重量，平台原生形状。单位与数值同处一个对象，结构上不可能出现
 * 「数值是 kg、单位却写着 G」这类不一致。
 */
export interface PlatformProductPackageWeight {
    unit?: string;
    value?: string;
}
/** 包装尺寸，平台原生形状。`unit` 目前没有编辑器 UI，保存时沿用详情里的值。 */
export interface PlatformProductPackageDimensions {
    unit?: string;
    length?: string;
    width?: string;
    height?: string;
}
export interface PlatformProductDetail extends PlatformProductListItem {
    tenantId?: number;
    collectProductId?: string;
    draftProductId?: string;
    movedFromPlatformProductId?: string;
    externalProductId?: string;
    externalSpuId?: string;
    externalUrl?: string;
    description?: string;
    images?: PlatformProductImage[];
    lastSyncedAt?: string;
    skus?: PlatformProductSku[];
    updatedAt: string;
    /** 平台类目 ID（可能为空字符串，空表示未设置类目） */
    categoryId?: string;
    /** 平台类目路径（可能为空字符串，用于展示已选类目名称） */
    categoryPath?: string;
    brand?: string;
    language?: string;
    packageWeight?: PlatformProductPackageWeight;
    packageDimensions?: PlatformProductPackageDimensions;
    sizeChartId?: string;
    sizeChartUrl?: string;
    videoUrl?: string;
    codAllowed?: boolean;
    platformData?: Record<string, unknown>;
    attributes?: {
        items?: Array<{
            id?: string;
            name: string;
            values: Array<{
                id?: string;
                name: string;
            }>;
        }>;
    };
    category?: {
        ids?: string[];
        labels?: string;
    };
    sourceCategory?: {
        ids?: string[];
        labels?: string;
    };
    /** @deprecated legacy adapter fields. */
    categoryAttributes?: Array<Record<string, unknown>>;
    /** @deprecated legacy adapter fields. */
    productAttributes?: Array<Record<string, unknown>>;
}
export interface UpdatePlatformProductPayload {
    title?: string;
    description?: string;
    categoryId?: string;
    categoryPath?: string;
    currency?: string;
    brand?: string;
    packageWeight?: PlatformProductPackageWeight;
    packageDimensions?: PlatformProductPackageDimensions;
    sizeChartId?: string;
    sizeChartUrl?: string;
    videoUrl?: string;
    codAllowed?: boolean;
    attributes?: {
        items: Array<{
            id?: string;
            name: string;
            values: Array<{
                id?: string;
                name: string;
            }>;
        }>;
    };
    platformData?: Record<string, unknown>;
    images?: Array<{
        type?: string;
        url?: string;
        objectKey?: string;
        sortOrder?: number;
    }>;
    skus: Array<{
        /**
         * `platform_product_skus.id`，详情接口返回、提交时原样带回。
         * 它是这一行的稳定身份：不带的话后端只能按 `skuCode` 匹配，改了平台 SKU 编码
         * 就会被认成新行，TikTok 的 `skus[].id` 绑定随之丢失、推送被拒。
         */
        id?: string;
        skuCode?: string;
        skuName?: string;
        /** 变体轴映射：`{类目销售属性名: 值名}`。后端据此对齐 TikTok 的 sales_attributes。 */
        attrs?: Record<string, unknown>;
        price?: number;
        stock?: number;
        imageUrl?: string;
        /** 本地运营扩展字段：本系统自有，不提交平台。 */
        costPrice?: number;
        presaleType?: string;
        productionDays?: number;
    }>;
    options?: Record<string, string | number | boolean>;
}
export interface PlatformProductStatusBatchResult {
    results: Array<{
        id: string;
        success: boolean;
        status?: PlatformProductStatus;
        error?: string;
    }>;
    succeeded: number;
    failed: number;
}
export interface PlatformProductSoftDeleteBatchResult {
    requested: number;
    deleted: number;
    alreadyDeleted: number;
}
export interface SyncProductsTask {
    id: string;
    shopId: string;
    shopName?: string;
    platform?: string;
    taskType: string;
    status: string;
    mode?: string;
    cursor?: string;
    startedAt?: string;
    finishedAt?: string;
    totalCount?: number;
    successCount?: number;
    failedCount?: number;
    errorMessage?: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface DeleteCollectProductResult {
    deleted: boolean;
}
export interface BatchPublishValidatePayload {
    productIds: string[];
    platform: string;
    shopIds: string[];
}
export interface BatchPublishProductResult {
    productId: string;
    valid: boolean;
    reason?: string;
    duplicateShopIds?: string[];
}
export interface BatchPublishShopResult {
    shopId: string;
    valid: boolean;
    reason?: string;
}
export interface BatchPublishValidationResult {
    valid: boolean;
    /** 发布校验返回 `publish`；搬运复用同一形状，返回 `move`。 */
    workflowType: 'publish' | 'move';
    targetPlatform: string;
    productResults: BatchPublishProductResult[];
    shopResults: BatchPublishShopResult[];
    errors?: string[];
    warnings?: string[];
}
export interface BatchPublishSubmitPayload extends BatchPublishValidatePayload {
    workflowRunId: string;
    nodeId?: string;
    nodeRunId?: string;
    language?: string;
    publishOptions?: Record<string, string | number | boolean>;
    draft?: Record<string, unknown>;
}
export interface BatchPublishSubmitResult {
    batchId: string;
    succeeded: number;
    failed: number;
    items: Array<{
        productId: string;
        shopId: string;
        success: boolean;
        taskId: string;
        error?: string;
    }>;
}
export interface CollectionProductImage {
    id?: string;
    imageType: string;
    originUrl?: string;
    publicUrl?: string;
    objectKey?: string;
    storageKey?: string;
    isBestMain?: boolean;
    sortOrder: number;
}
export interface CollectionProductSku {
    id?: string;
    collectProductId?: string;
    skuCode: string;
    skuName: string;
    price: number | null;
    costPrice?: number | null;
    compareAtPrice?: number | null;
    stock: number | null;
    weight?: number | null;
    presaleType?: 'none' | 'spot' | 'preorder' | null;
    productionDays?: number | null;
    imageUrl?: string;
    attrs?: Record<string, unknown> | null;
}
/**
 * 采集商品的包裹重量。数值和单位成对出现；未设置时详情返回 `null`。
 * 不限定单位枚举，避免把来源中的 POUND 等单位错误改标为 KG。
 */
export interface CollectionProductPackageWeight {
    value: string | null;
    unit: string | null;
}
/**
 * 采集商品的包装尺寸，形状与店铺商品的 `PlatformProductPackageDimensions` 一致。
 * 长宽高必须同时存在；未设置时详情返回 `null`。采集侧编辑器只展示 CM，没有单位选择器，
 * 所以 `unit` 缺省为 `CM`，读回时原样返回。
 */
export interface CollectionProductPackageDimensions {
    unit?: string | null;
    length?: string | null;
    width?: string | null;
    height?: string | null;
}
/**
 * `/logistics/information` 返回的整理结果。
 * 接口返回裸对象，重量单位为 KG，尺寸单位为 CM。
 */
export interface CollectionLogisticsInformation {
    weight: number;
    length: number;
    width: number;
    height: number;
}
export interface CollectionProductDetail {
    id: string;
    tenantId?: number;
    source?: CollectionSource;
    sourceUrl?: string;
    sourceItemId?: string;
    nodeId?: string;
    workflowRunId?: string;
    title: string;
    description?: string;
    brand?: string;
    currency?: string;
    language?: string;
    videoUrl?: string;
    videoName?: string;
    packageWeight?: CollectionProductPackageWeight | null;
    packageDimensions?: CollectionProductPackageDimensions | null;
    /** 尺码表模板 ID；采集侧只产出图片形态，通常为空串。 */
    sizeChartId?: string;
    /** 尺码表图片地址；未设置时为空串。 */
    sizeChartUrl?: string;
    /** 是否支持货到付款；未设置时为 `null`（与「显式关闭」区分）。 */
    codAllowed?: boolean | null;
    /** 发货方式：`platform-default` / `seller-custom`；未设置时为空串。 */
    shippingMethod?: string;
    infoComplete?: boolean;
    /** 草稿态图片字段；新接口优先返回它，历史接口仍回退到 `images`。 */
    draftImages?: CollectionProductImage[];
    images: CollectionProductImage[];
    skus: CollectionProductSku[];
    /** 采集商品类目。与店铺详情同形：ids 为单元素（采集侧无类目链），labels 为类目路径。 */
    category?: {
        ids?: string[];
        labels?: string;
    };
    sourceCategory?: {
        ids?: string[];
        labels?: string;
    };
    /** 采集商品属性（归一化 k-v）。与店铺详情同名同型。 */
    productAttributes?: CollectionProductAttribute[];
    /** 采集商品变体轴汇总。与店铺详情同名同型。 */
    categoryAttributes?: CollectionProductAttribute[];
    rawData?: unknown;
    createdAt?: string;
    updatedAt?: string;
}
/**
 * 采集 / 店铺详情共用的扁平属性 DTO。后端以同一批 Go 类型下发，
 * 键恒在：无平台 id 时 attrId / valueId 为空字符串、options 为 []。
 */
export interface CollectionProductAttribute {
    id?: string;
    attrId?: string;
    name: string;
    displayName?: string;
    value: string;
    valueId?: string;
    options?: Array<{
        id?: string;
        name: string;
        displayName?: string;
    }>;
}
export type PlatformCategoryPlatform = 'tiktok' | 'shopee' | 'douyin';
export interface ComplianceDetectionRange {
    textHash: string;
    start: number;
    end: number;
    quote: string;
    unit: 'utf16';
    projectionVersion?: string;
}
export interface ComplianceDetectionIssue {
    id: string;
    checkType?: string;
    severity: 'high' | 'medium' | 'low' | 'unknown' | string;
    message: string;
    ranges?: ComplianceDetectionRange[];
    evidence?: Array<Record<string, unknown>>;
}
export interface ComplianceFieldCheck {
    status: string;
    conclusion: 'suspected_risk' | 'no_hits' | 'unknown' | string;
    reason?: string;
    issues: ComplianceDetectionIssue[];
}
export interface ComplianceFieldDetection {
    checkId?: string;
    inputHash?: string;
    checkedAt?: string;
    status: 'not_checked' | 'queued' | 'running' | 'completed' | 'partial' | 'failed' | 'cancelled' | 'stale' | string;
    checks: Record<string, ComplianceFieldCheck>;
}
export interface PlatformCategoryQuery {
    shopId?: string;
    site?: string;
    platform?: PlatformCategoryPlatform;
    keyword?: string;
    parentId?: string;
    onlyLeaf?: boolean;
    refresh?: boolean;
}
export type TikTokCategorySyncPayload = PlatformCategoryQuery;
export interface TikTokCategorySyncResult {
    site?: string;
    count?: number;
    leafCount?: number;
    lastSyncedAt?: string;
}
export interface CategorySuggestionResult {
    mapped: boolean;
    targetCategoryId?: string;
    targetCategoryName?: string;
    schemaVersion?: string;
}
export interface CategorySchemaAttribute {
    attrId: string;
    name: string;
    displayName?: string;
    canonicalKey?: string;
    required?: boolean;
    scope?: string;
    valueType?: string;
    /** 平台是否允许该属性自由填写；缺失时前端按选项数量兜底。 */
    isCustomizable?: boolean;
    options?: Array<{
        id?: string;
        name: string;
        displayName?: string;
    }>;
}
export interface CategoryAttributesResult {
    categoryId: string;
    categoryName?: string;
    salesAttributes: CategorySchemaAttribute[];
    descriptiveAttributes: CategorySchemaAttribute[];
}
export type SaveCollectInboxPayload = Pick<CollectionProductDetail, 'title' | 'description' | 'currency' | 'language' | 'packageWeight' | 'packageDimensions' | 'sizeChartId' | 'sizeChartUrl' | 'codAllowed' | 'shippingMethod' | 'images' | 'skus'>;
/** 兼容管理端 PUT 的采集商品保存体，保留旧的类目/属性扩展。 */
export type UpdateCollectionProductPayload = SaveCollectInboxPayload & {
    category?: {
        ids: string[];
        labels: string;
    };
    categoryAttributes?: CollectionProductAttribute[];
    productAttributes?: CollectionProductAttribute[];
    brand?: string;
    videoUrl?: string;
    videoName?: string;
};
export type PublishTaskStatus = 'unsubmitted' | 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
export type PublishStatusGroup = 'all' | 'success' | 'failed' | 'publishing';
/**
 * 发布前预检的一项（ERP `PublishPrecheckItem`）。
 *
 * 用户可修正的字段级原因：`attribute` 是类目属性名（如 `Batch number`）、`field` 是商品
 * 文本字段路径（如 `productText`）、`details.issueCode` 是平台侧问题码
 * （`required_product_missing` = 属性值为空 / `required_product_unmapped` = 值不是平台
 * 允许的枚举，两者处置不同）。`code` 是给排查用的错误码，展示时不要丢。
 */
export interface PublishPrecheckItem {
    code?: string;
    group?: string;
    level?: string;
    field?: string;
    message?: string;
    suggestion?: string;
    sku?: string;
    attribute?: string;
    details?: Record<string, unknown>;
}
/** 任务 `checkResult` / 批量发布出参 `precheck` 的信封形状。 */
export interface PublishPrecheckResult {
    items?: PublishPrecheckItem[];
}
export interface PublishTaskListParams {
    /** 按工作流运行过滤（一次运行）。 */
    workflowRunId?: string;
    /**
     * 按工作流过滤（该工作流的全部运行）。
     *
     * 批量上架节点离开再回来时当前运行会变，按运行查会丢记录；归属信息在创建
     * 发布任务时就写进 `product_publish_tasks.workflow_id`，这里用它取数。
     */
    workflowId?: string;
    /**
     * 聚合维度：`draft` = 一行一个草稿（成功优先 + 最近一次尝试时间倒序）。
     *
     * **必须与 `workflowRunId` 同时给出**，否则后端 400：该维度没有「整租户按草稿
     * 聚合」的语义。命中该维度时后端会自行取满逐记录再折叠，不需要（也不该）由
     * 调用方传 `includeAllAttempts`。
     */
    groupBy?: 'draft';
    includeAllAttempts?: boolean;
    page?: number;
    pageSize?: number;
    productId?: string;
    shopId?: string;
    platform?: string;
    status?: PublishTaskStatus;
    statusGroup?: PublishStatusGroup;
    keyword?: string;
    sourceItemId?: string;
    start?: string;
    end?: string;
    publishedFrom?: string;
    publishedTo?: string;
    sortField?: 'publishedAt';
    /** @deprecated Use sortField. */
    sortBy?: 'publishedAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PublishTaskListItem {
    operation?: string;
    canReedit?: boolean;
    id: string;
    workflowRunId?: string;
    productId?: string;
    draftProductId?: string;
    shopId?: string;
    targetStoreId?: string;
    shopName?: string;
    productTitle?: string;
    title?: string;
    description?: string;
    language?: string;
    brand?: string;
    category?: {
        ids?: string[];
        labels?: string;
    };
    categoryAttributes?: Array<Record<string, unknown>>;
    productAttributes?: Array<Record<string, unknown>>;
    platform?: string;
    targetPlatform?: string;
    sourcePlatform?: string;
    sourceItemId?: string;
    sourceUrl?: string;
    productImage?: string;
    status: PublishTaskStatus;
    publishStatus?: string;
    images?: Array<Record<string, unknown>>;
    skus?: Array<Record<string, unknown>>;
    sizeChart?: Record<string, unknown>;
    logistics?: Record<string, unknown>;
    videoUrl?: string;
    videoName?: string;
    price?: number;
    currency?: string;
    retryable?: boolean;
    attempts?: number;
    startedAt?: string;
    finishedAt?: string;
    createdAt: string;
    updatedAt: string;
    errorCode?: string;
    errorMessage?: string;
    improvementHint?: string;
    /**
     * 发布前预检 / 任务检查快照（ERP `TaskDTO.CheckResult` / `PublishRecordItem.CheckResult`）。
     *
     * **两种读法都下发**：逐记录（列表、详情）与 `groupBy=draft` 的草稿聚合行都带，
     * 口径一致 —— 都只带**最近一次失败**那次的明细（后端 `foldDraftRecords` 与
     * `errorCode`/`errorMessage` 同口径）。展示层用 `parsePublishPrecheckItems` 解析，
     * 认不出的形状按空处理，不做兜底猜测。
     *
     * 例外：`publish-records` / `batch-publish-drafts` 的**工具调用链**（`list` 字段）刻意不带
     * —— 那条链的下发字段是被测试钉住的契约，只服务节点面板与试运行快照。
     */
    checkResult?: PublishPrecheckResult;
    /**
     * 以下是 `groupBy=draft`（按草稿聚合）时后端下发的派生字段，逐记录读法下一律缺席。
     *
     * 语义见后端 `productpublish/draft_publish_summary.go` 的 `PublishDraftRecordItem`
     * 与前端 `workflow/node-pages/publish-result/publish-draft-rows.ts` 的 `foldDraftRows`。
     */
    rowType?: 'draft';
    everSuccess?: boolean;
    latestAttemptFailed?: boolean;
    lastAttemptAt?: string;
    attemptCount?: number;
}
export type PublishTaskDTO = PublishTaskListItem;
export type BatchPublishDraftsResult = {
    /** Adopted ERP has no publish batch resource. */
    batchId?: string;
    succeeded: number;
    failed: number;
    items: Array<{
        draftId: string;
        success: boolean;
        taskId?: string;
        error?: string;
        /**
         * 该条被预检拦住（或缺必填属性、或值映射不上）时的字段级明细。
         *
         * ERP 在建任务前就把它算出来（`service_batch_draft_publish.go` 的两处赋值），
         * 前端要在这里点名到字段，不能只弹一句笼统的 `error`。
         */
        precheck?: PublishPrecheckResult;
    }>;
};
export interface PublishTaskListResponse {
    list: PublishTaskListItem[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
    statusCounts: {
        all: number;
        success: number;
        failed: number;
        publishing: number;
    };
}
export type PublishTaskDetail = PublishTaskListItem;
export type UpdatePublishTaskPayload = Omit<Pick<PublishTaskListItem, 'title' | 'description' | 'price' | 'currency' | 'language' | 'images' | 'skus' | 'category' | 'categoryAttributes' | 'productAttributes' | 'brand' | 'sizeChart' | 'logistics' | 'videoUrl' | 'videoName'>, 'skus'> & {
    skus?: Array<CollectionProductSku & {
        id?: string;
    }>;
    mode?: string;
    publishMode?: string;
};
export type PublishTaskBatchDeleteCode = 'deleted' | 'skipped_not_final' | 'already_gone' | 'error';
export type PublishTaskBatchRetryCode = 'retried' | 'skipped_not_failed' | 'already_gone' | 'error';
export interface PublishTaskBatchDeleteResult {
    results: Array<{
        id: string;
        deleted: boolean;
        code: PublishTaskBatchDeleteCode;
        error?: string;
    }>;
    deleted: number;
    skipped: number;
    failed: number;
}
export interface PublishTaskBatchRetryResult {
    results: Array<{
        id: string;
        retried: boolean;
        code: PublishTaskBatchRetryCode;
        error?: string;
    }>;
    retried: number;
    skipped: number;
    failed: number;
}
export declare const productLibraryApi: {
    /**
     * 用采集原始 packaging 解析物流信息。
     * 兼容旧版扁平字符串数组和新版 packaging_info_list 对象数组。
     * 该接口返回裸对象，必须使用 text/plain 发送 JSON 字符串。
     */
    getCollectionLogisticsInformation: (packaging: unknown[]) => Promise<CollectionLogisticsInformation>;
    createCollectionBatch(payload: CreateCollectionBatchPayload): Promise<CreateCollectionBatchResult>;
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
    getDraft(draftId: string): Promise<import("./product-draft-types").DraftProductDetail>;
    updateDraft(draftId: string, payload: import("./product-draft-types").UpdateDraftPayload): Promise<import("./product-draft-types").DraftProductDetail>;
    createCollectionProductDraft(productId: string, payload: {
        shopId: string;
        workflowRunId: string;
        nodeId?: string;
        nodeRunId?: string;
        language?: string;
    }): Promise<import("./product-draft-types").DraftProductDetail>;
    listDraftsByIds(ids: string[]): Promise<DraftListRow[]>;
    listDraftsByRun(workflowRunId: string): Promise<DraftListRow[]>;
    prepareCollectionDrafts(payload: {
        productIds: string[];
        workflowRunId: string;
        nodeId: string;
        nodeRunId?: string;
        targetShopId?: string;
    }): Promise<{
        list: import("./product-draft-types").DraftProductDetail[];
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
    }): Promise<import("./product-draft-types").DraftProductDetail[]>;
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
    createDraftComplianceCheck(draftId: string, payload: import("./product-draft-types").DraftComplianceCheckRequest): Promise<import("./product-draft-types").DraftComplianceReport>;
    getDraftComplianceCheck(draftId: string, checkId: string): Promise<import("./product-draft-types").DraftComplianceReport>;
    getLatestDraftComplianceCheck(draftId: string): Promise<import("./product-draft-types").DraftComplianceReport | undefined>;
    getDraftComplianceConfig: (region?: string, platform?: string, site?: string) => Promise<import("./erp-v1-contract-types").ComplianceConfigResp>;
    listPublishTasks: (params?: PublishTaskListParams) => Promise<PublishTaskListResponse>;
    listPublishWorkbench: (params?: PublishWorkbenchListParams) => Promise<{
        list: PublishWorkbenchItem[];
        pagination: {
            totalPages: number;
            page: number;
            pageSize: number;
            total: number;
        };
        statusCounts: Record<string, number>;
        unavailableFields: string[];
    }>;
    listAllPublishWorkbenchItems(params: {
        workflowRunId: string;
        productIds?: string[];
    }): Promise<PublishWorkbenchItem[]>;
    batchPublishDrafts(payload: {
        draftIds: string[];
        workflowRunId: string;
        workflowId?: string;
        nodeId?: string;
    }): Promise<BatchPublishDraftsResult>;
    publishDraft(draftId: string, payload: import("./product-draft-types").DraftPublishPayload): Promise<PublishTaskListItem>;
    validateBatchPublish(payload: BatchPublishValidatePayload): Promise<BatchPublishValidationResult>;
    validateProductMove(payload: BatchPublishValidatePayload): Promise<BatchPublishValidationResult & {
        targetChecked: boolean;
        requiresConfirmation: boolean;
        pairResults: Array<{
            productId: string;
            shopId: string;
            alreadyPublished: boolean;
        }>;
    }>;
    submitBatchPublish(payload: BatchPublishSubmitPayload): Promise<BatchPublishSubmitResult>;
    getPublishTask(taskId: string): Promise<PublishTaskListItem>;
    cancelPublishTask(taskId: string): Promise<PublishTaskListItem>;
    deletePublishTasks(taskIds: string[]): Promise<PublishTaskBatchDeleteResult>;
    retryPublishTasks(taskIds: string[]): Promise<PublishTaskBatchRetryResult>;
    retryPublishTask(taskId: string): Promise<PublishTaskListItem>;
    listPlatformProducts(params?: PlatformProductListParams): Promise<{
        list: PlatformProductListItem[];
        pagination: {
            totalPages: number;
            page: number;
            pageSize: number;
            total: number;
        };
        statusCounts: import("./erp-v1-model-types").ShopProductStatusCounts;
    }>;
    getPlatformProduct(productId: string): Promise<PlatformProductDetail>;
    updatePlatformProduct(productId: string, payload: UpdatePlatformProductPayload): Promise<PlatformProductDetail>;
    deletePlatformProduct: (productId: string) => Promise<import("./erp-v1-contract-types").DeleteShopProductResp>;
    pushPlatformProduct(productId: string, options?: Record<string, string | number | boolean>): Promise<PublishTaskListItem>;
    pullPlatformProduct(productId: string): Promise<PlatformProductDetail>;
    setPlatformProductStatus(productId: string, status: PlatformProductStatus): Promise<PlatformProductDetail>;
    setPlatformProductsStatus(productIds: string[], status: PlatformProductStatus): Promise<PlatformProductStatusBatchResult>;
    softDeletePlatformProducts: (productIds: string[]) => Promise<import("./erp-v1-contract-types").BatchSoftDeleteShopProductsResp>;
    listPlatformCategories(payload: PlatformCategoryQuery): Promise<PlatformCategoriesResult>;
    syncPlatformCategories(payload: PlatformCategoryQuery): Promise<TikTokCategorySyncResult>;
    listShopCategories(payload: {
        shopId: string;
        platform?: string;
        refresh?: boolean;
    }): Promise<ShopCategoriesResult>;
    syncTikTokCategories: (payload: TikTokCategorySyncPayload) => Promise<TikTokCategorySyncResult>;
};
