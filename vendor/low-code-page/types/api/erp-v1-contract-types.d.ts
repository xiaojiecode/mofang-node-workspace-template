/** mf_erp.thrift HTTP DTO，保留ID和金额字符串；Json字段为普通JSON。 */
import type * as Models from './erp-v1-model-types';
import type { JsonValue } from './workflow-v1-types';
export type PageReq = {
    page: number;
    pageSize: number;
};
export type PageResp = {
    total: number;
    page: number;
    pageSize: number;
};
export type PickerImagesResp = {
    items: Models.PickerImage[];
    page: PageResp;
};
export type ListShopsReq = {
    actor: Models.Actor;
    platform: string;
    region: string;
    status: string;
    authStatus: string;
    shopName: string;
    page: PageReq;
};
export type ListShopsResp = {
    items: Models.Shop[];
    page: PageResp;
};
export type ShopIDReq = {
    actor: Models.Actor;
    shopId: string;
};
export type ShopResp = {
    shop: Models.Shop;
};
export type ListPlatformProvidersReq = {
    actor: Models.Actor;
};
export type ListPlatformProvidersResp = {
    items: Models.PlatformProvider[];
    authStatuses: Models.Option[];
};
export type StartShopOAuthReq = {
    actor: Models.Actor;
    platform: string;
    region: string;
    shopId: string;
    returnUrl: string;
};
export type StartShopOAuthResp = {
    authorizeUrl: string;
    state: string;
};
export type CompleteShopOAuthReq = {
    actor: Models.Actor;
    platform: string;
    state: string;
    code: string;
    params: Record<string, string>;
};
export type CompleteShopOAuthResp = {
    shops: Models.Shop[];
    redirectUrl: string;
};
export type ShopCategoriesResp = {
    shopId: string;
    platform: string;
    region: string;
    schemaPlatform: string;
    permissionKnown: boolean;
    degraded: boolean;
    degradedReason: string;
    stale: boolean;
    source: string;
    level3Total: number;
    availableCount: number;
    syncedAt: string;
    leaves: Models.ShopCategoryLeaf[];
};
export type ShopPublishSettingsResp = {
    settings: Models.ShopPublishSettings;
};
export type UpdateShopPublishSettingsReq = {
    actor: Models.Actor;
    shopId: string;
    values: Record<string, string>;
};
export type ListPlatformCategoriesReq = {
    actor: Models.Actor;
    platform: string;
    shopId: string;
    region: string;
    keyword: string;
    parentId: string;
    onlyLeaf: boolean;
};
export type ListPlatformCategoriesResp = {
    items: Models.PlatformCategory[];
    total: number;
    leafCount: number;
    lastSyncedAt: string;
};
export type SyncPlatformCategoriesReq = {
    actor: Models.Actor;
    platform: string;
    shopId: string;
    region: string;
};
export type SyncPlatformCategoriesResp = {
    region: string;
    count: number;
    leafCount: number;
    lastSyncedAt: string;
};
export type CreateCollectBatchReq = {
    actor: Models.Actor;
    source: string;
    urls: string[];
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type CollectBatchResp = {
    batch: Models.CollectBatch;
};
export type GetCollectBatchReq = {
    actor: Models.Actor;
    batchId: string;
    includeTasks: boolean;
};
export type RetryCollectTaskReq = {
    actor: Models.Actor;
    taskId: string;
};
export type CollectTaskResp = {
    task: Models.CollectTask;
};
export type ListCollectBoxReq = {
    actor: Models.Actor;
    source: string;
    title: string;
    sourceItemId: string;
    startTime: string;
    endTime: string;
    timeField: string;
    status: string;
    sortField: string;
    sortOrder: string;
    batchId: string;
    workflowRunId: string;
    nodeRunId: string;
    page: PageReq;
};
export type ListCollectBoxResp = {
    items: Models.CollectBoxItem[];
    page: PageResp;
    statusCounts: Models.CollectStatusCounts;
};
export type GetCollectBoxItemReq = {
    actor: Models.Actor;
    id: string;
};
export type CollectBoxDetailResp = {
    id: string;
    task: Models.CollectTask;
    product?: Models.CollectProduct;
};
export type GetCollectProductReq = {
    actor: Models.Actor;
    productId: string;
};
export type CollectProductResp = {
    product: Models.CollectProduct;
};
export type ListCollectProductsByIDsReq = {
    actor: Models.Actor;
    productIds: string[];
};
export type ListCollectProductsByIDsResp = {
    items: Models.CollectProductRow[];
};
export type ListCollectImagesReq = {
    actor: Models.Actor;
    keyword: string;
    source: string;
    page: PageReq;
};
export type SaveCollectBoxItemReq = {
    actor: Models.Actor;
    id: string;
    title: string;
    description: string;
    brand: string;
    currency: string;
    language: string;
    videoUrl: string;
    videoName: string;
    packageWeight?: Models.PackageWeight;
    packageDimensions?: Models.PackageDimensions;
    sizeChartId: string;
    sizeChartUrl: string;
    codAllowed?: boolean;
    shippingMethod: string;
    images: Models.Image[];
    skus: Models.CollectSku[];
    category?: Models.CategoryRef;
    productAttributes?: Models.ProductAttribute[];
    categoryAttributes?: Models.ProductAttribute[];
};
export type SaveCollectProductReq = {
    actor: Models.Actor;
    productId: string;
    title: string;
    description: string;
    brand: string;
    currency: string;
    language: string;
    videoUrl: string;
    videoName: string;
    packageWeight?: Models.PackageWeight;
    packageDimensions?: Models.PackageDimensions;
    sizeChartId: string;
    sizeChartUrl: string;
    codAllowed?: boolean;
    shippingMethod: string;
    images: Models.Image[];
    skus: Models.CollectSku[];
};
export type BatchDeleteCollectBoxItemsReq = {
    actor: Models.Actor;
    ids: string[];
};
export type BatchDeleteResp = {
    deleted: number;
    skipped: number;
};
export type DraftResp = {
    draft: Models.Draft;
};
export type DraftsResp = {
    items: Models.Draft[];
};
export type CreateDraftFromCollectReq = {
    actor: Models.Actor;
    collectProductId: string;
    shopId: string;
    language: string;
    workflow?: Models.WorkflowRef;
};
export type PrepareDraftsReq = {
    actor: Models.Actor;
    sourceType: string;
    sources: Models.PrepareDraftSource[];
    targetShopId: string;
    language: string;
    workflow: Models.WorkflowRef;
    idempotencyKey: string;
};
export type PrepareDraftsResp = {
    items: Models.PreparedDraft[];
    total: number;
    partial: boolean;
};
export type BindDraftsShopReq = {
    actor: Models.Actor;
    draftIds: string[];
    shopId: string;
    workflowRunId: string;
};
export type GetDraftReq = {
    actor: Models.Actor;
    draftId: string;
};
export type ListDraftsReq = {
    actor: Models.Actor;
    draftIds: string[];
    workflowRunId: string;
    nodeRunId: string;
    collectProductId: string;
    shopId: string;
    status: string;
    keyword: string;
    page: PageReq;
};
export type ListDraftsResp = {
    items: Models.DraftSummary[];
    page: PageResp;
};
export type UpdateDraftReq = {
    actor: Models.Actor;
    draftId: string;
    title?: string;
    description?: string;
    currency?: string;
    language?: string;
    categoryId?: string;
    categoryPath?: string;
    editorMetadata?: Models.DraftEditorMetadata;
    images?: Models.DraftImage[];
    skus?: Models.DraftSku[];
    attributes?: Models.DraftAttribute[];
};
export type DraftCategorySuggestionResp = {
    mapped: boolean;
    targetCategoryId: string;
    targetCategoryName: string;
    schemaVersion: string;
};
export type GetDraftCategoryAttributesReq = {
    actor: Models.Actor;
    draftId: string;
    categoryId: string;
    categoryVersion: string;
};
export type DraftCategoryAttributesResp = {
    categoryId: string;
    categoryName: string;
    salesAttributes: Models.CategorySchemaAttribute[];
    descriptiveAttributes: Models.CategorySchemaAttribute[];
};
export type SuggestDraftAttributesReq = {
    actor: Models.Actor;
    draftId: string;
    categoryId: string;
    categoryVersion: string;
    mode: string;
};
export type SuggestDraftAttributesResp = {
    categoryId: string;
    suggestions: Models.AttributeSuggestion[];
};
export type ApplyDraftCategoryAttributesReq = {
    actor: Models.Actor;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
    draftIds: string[];
    title?: string;
    categoryVersion?: string;
    platform?: string;
    site?: string;
    sourcePlatform?: string;
    shopId?: string;
};
export type ApplyDraftCategoryAttributesResp = {
    results: Models.DraftCategoryAttributesApplyResult[];
};
export type GenerateDraftContentReq = {
    actor: Models.Actor;
    draftId: string;
    fields: string[];
    language: string;
    platform: string;
    images: string[];
    keywords: string;
    negativeWords: string;
};
export type GenerateDraftContentResp = {
    title?: Models.AiTitleResult;
    description?: Models.AiDescriptionResult;
};
export type PolishDraftSpecNamesReq = {
    actor: Models.Actor;
    draftId: string;
    specNames: Models.SpecName[];
};
export type PolishDraftSpecNamesResp = {
    polished: Models.PolishedSpecName[];
    taskId: string;
};
export type OptimizeDraftTitleReq = {
    actor: Models.Actor;
    draftId: string;
    language: string;
    images: string[];
    keywords: string;
    negativeWords: string;
    apply: boolean;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type OptimizeDraftTitleResp = {
    candidates: Models.TitleCandidate[];
    appliedTitle: string;
    draftRevision: string;
    taskId: string;
};
export type GenerateDraftDescriptionReq = {
    actor: Models.Actor;
    draftId: string;
    language: string;
    images: string[];
    keywords: string;
    negativeWords: string;
    apply: boolean;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type GenerateDraftDescriptionResp = {
    result: Models.AiDescriptionResult;
    applied: boolean;
    draftRevision: string;
};
export type TranslateDraftAttributesReq = {
    actor: Models.Actor;
    draftId: string;
    language: string;
    apply: boolean;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type TranslateDraftAttributesResp = {
    language: string;
    translations: Models.AttributeTranslation[];
};
export type ComplianceReportResp = {
    report?: Models.ComplianceReport;
};
export type CreateComplianceCheckReq = {
    actor: Models.Actor;
    draftId: string;
    checkTypes: string[];
    mode: string;
    profile: string;
    idempotencyKey: string;
    clientRevision: number;
    baseContentHash: string;
    snapshot: Models.ComplianceSnapshot;
};
export type GetComplianceCheckReq = {
    actor: Models.Actor;
    draftId: string;
    checkId: string;
};
export type GetLatestComplianceCheckReq = {
    actor: Models.Actor;
    draftId: string;
};
export type GetComplianceConfigReq = {
    actor: Models.Actor;
    region: string;
    platform: string;
    site?: string;
};
export type ComplianceConfigResp = {
    enabled: boolean;
    rankedTopNumber: number;
    thresholds: Record<string, number>;
    capabilities: Models.ComplianceCapabilities;
};
export type ImportComplianceResultsReq = {
    actor: Models.Actor;
    draftId: string;
    checkTypes: string[];
    results: Models.SubmittedComplianceResult[];
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type ListCostTemplatesReq = {
    actor: Models.Actor;
    keyword: string;
    platform: string;
    site: string;
    page: PageReq;
};
export type ListCostTemplatesResp = {
    items: Models.CostTemplate[];
    page: PageResp;
};
export type CreateCostTemplateReq = {
    actor: Models.Actor;
    template: Models.CostTemplateInput;
};
export type UpdateCostTemplateReq = {
    actor: Models.Actor;
    templateId: string;
    template: Models.CostTemplateInput;
};
export type CostTemplateResp = {
    template?: Models.CostTemplate;
    issues: Models.FieldIssue[];
};
export type DeleteCostTemplateReq = {
    actor: Models.Actor;
    templateId: string;
};
export type PreviewCostTemplateReq = {
    actor: Models.Actor;
    templateId: string;
    draftIds: string[];
    skuIds: string[];
    profitRate: string;
    discount: string;
};
export type PreviewCostTemplateResp = {
    lines: Models.CostTemplatePreviewLine[];
    total: number;
    failedLines?: Record<string, unknown>[];
    productFailures?: Record<string, unknown>[];
    nativePreview?: Record<string, unknown>;
};
export type PreviewPricingRuleReq = {
    actor: Models.Actor;
    target: Models.PricingTarget;
    platform: string;
    rule: Models.PricingRule;
};
export type PreviewPricingRuleResp = {
    productCount: number;
    skuCount: number;
    lines: Models.RulePreviewLine[];
    failedLines?: Record<string, unknown>[];
    productFailures?: Record<string, unknown>[];
    nativePreview?: Record<string, unknown>;
};
export type GetLogisticsOptionsReq = {
    actor: Models.Actor;
    platform: string;
};
export type LogisticsOptionsResp = {
    platform: string;
    storeTypes: Models.Option[];
    firstLegTypes: Models.Option[];
    weightSources: Models.Option[];
    localLogisticsModes: Models.Option[];
    thirdPartyLogisticsModes: Models.Option[];
    currencies: string[];
    purchaseMethods: Models.Option[];
    platformFeeFields: Models.LogisticsFeeField[];
    dimensionRequiredHint: string;
    sites: Models.LogisticsSite[];
    rateCard: Models.LogisticsRateCard;
};
export type BatchPricingReq = {
    actor: Models.Actor;
    target: Models.PricingTarget;
    templateId: string;
    profitRate: string;
    discount: string;
    rule?: Models.PricingRule;
    platform: string;
    confirm: boolean;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type BatchPricingResp = {
    lines: Models.PricingLine[];
    productFailures: Models.PricingProductFailure[];
    total: number;
    updated: number;
    skipped: number;
    draftRevisions: Record<string, string>;
};
export type PublishTaskResp = {
    task: Models.PublishTask;
};
export type PublishDraftReq = {
    actor: Models.Actor;
    draftId: string;
    revision: string;
    options: Record<string, string>;
    force: boolean;
    idempotencyKey: string;
};
export type BatchPublishReq = {
    actor: Models.Actor;
    items: Models.BatchPublishItem[];
    options: Record<string, string>;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type BatchPublishResp = {
    batch: Models.PublishBatch;
    items: Models.BatchPublishItemResult[];
};
export type PublishValidationResp = {
    valid: boolean;
    validationType: string;
    targetPlatform: string;
    productResults: Models.PublishProductCheck[];
    shopResults: Models.PublishShopCheck[];
    errors: string[];
    warnings: string[];
};
export type ValidatePublishBatchReq = {
    actor: Models.Actor;
    collectProductIds: string[];
    platform: string;
    shopIds: string[];
};
export type SubmitPublishBatchReq = {
    actor: Models.Actor;
    collectProductIds: string[];
    platform: string;
    shopIds: string[];
    language: string;
    options: Record<string, string>;
    workflow?: Models.WorkflowRef;
    idempotencyKey: string;
};
export type SubmitPublishBatchResp = {
    batch: Models.PublishBatch;
    items: Models.SubmitPublishItemResult[];
};
export type ListPublishWorkbenchReq = {
    actor: Models.Actor;
    workflowRunId: string;
    source: string;
    keyword: string;
    statusGroup: string;
    collectProductIds: string[];
    batchId: string;
    shopId: string;
    page: PageReq;
};
export type ListPublishWorkbenchResp = {
    items: Models.WorkbenchItem[];
    page: PageResp;
    statusCounts: Record<string, number>;
    unavailableFields: string[];
};
export type ListPublishTasksReq = {
    actor: Models.Actor;
    batchId: string;
    workflowRunId: string;
    nodeRunId: string;
    groupBy: string;
    draftIds: string[];
    collectProductId: string;
    shopId: string;
    platform: string;
    status: string;
    statusGroup: string;
    keyword: string;
    sourceItemId: string;
    startTime: string;
    endTime: string;
    publishedFrom: string;
    publishedTo: string;
    sortField: string;
    sortOrder: string;
    includeAllAttempts: boolean;
    page: PageReq;
};
export type ListPublishTasksResp = {
    items: Models.PublishTask[];
    page: PageResp;
    statusCounts: Models.PublishStatusCounts;
    batch?: Models.PublishBatch;
};
export type GetPublishTaskReq = {
    actor: Models.Actor;
    taskId: string;
};
export type PublishTaskIDsReq = {
    actor: Models.Actor;
    taskIds: string[];
};
export type PublishTaskBatchResp = {
    results: Models.ItemResult[];
    succeeded: number;
    skipped: number;
    failed: number;
};
export type CancelPublishTaskReq = {
    actor: Models.Actor;
    taskId: string;
};
export type RecheckPublishTaskReq = {
    actor: Models.Actor;
    taskId: string;
};
export type ShopProductResp = {
    product: Models.ShopProduct;
};
export type ListShopProductsReq = {
    actor: Models.Actor;
    productIds: string[];
    externalProductId: string;
    sourceItemId: string;
    shopId: string;
    platform: string;
    status: string;
    keyword: string;
    startTime: string;
    endTime: string;
    sortField: string;
    sortOrder: string;
    page: PageReq;
};
export type ListShopProductsResp = {
    items: Models.ShopProductSummary[];
    page: PageResp;
    statusCounts: Models.ShopProductStatusCounts;
};
export type ShopProductIDReq = {
    actor: Models.Actor;
    productId: string;
};
export type ListShopProductImagesReq = {
    actor: Models.Actor;
    keyword: string;
    platform: string;
    shopId: string;
    page: PageReq;
};
export type UpdateShopProductReq = {
    actor: Models.Actor;
    productId: string;
    title: string;
    description: string;
    categoryId: string;
    categoryPath: string;
    currency: string;
    brand: string;
    packageWeight?: Models.PackageWeight;
    packageDimensions?: Models.PackageDimensions;
    sizeChartId: string;
    sizeChartUrl: string;
    videoUrl: string;
    codAllowed?: boolean;
    attributes: Models.ShopProductAttribute[];
    platformDataJson: JsonValue;
    images: Models.ShopProductImageInput[];
    skus: Models.ShopProductSku[];
    options: Record<string, string>;
};
export type DeleteShopProductReq = {
    actor: Models.Actor;
    productId: string;
    idempotencyKey: string;
};
export type DeleteShopProductResp = {
    deleted: boolean;
};
export type PushShopProductReq = {
    actor: Models.Actor;
    productId: string;
    options: Record<string, string>;
    idempotencyKey: string;
};
export type SetShopProductStatusReq = {
    actor: Models.Actor;
    productId: string;
    status: string;
    idempotencyKey: string;
};
export type BatchSetShopProductStatusReq = {
    actor: Models.Actor;
    productIds: string[];
    status: string;
    idempotencyKey: string;
};
export type BatchSetShopProductStatusResp = {
    results: Models.ItemResult[];
    succeeded: number;
    failed: number;
};
export type ShopProductIDsReq = {
    actor: Models.Actor;
    productIds: string[];
};
export type BatchSoftDeleteShopProductsResp = {
    requested: number;
    deleted: number;
    alreadyDeleted: number;
};
export type ValidateShopProductMoveReq = {
    actor: Models.Actor;
    productIds: string[];
    platform: string;
    shopIds: string[];
};
