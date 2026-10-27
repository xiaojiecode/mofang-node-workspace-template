import type { ComplianceDetectionIssue, ComplianceFieldDetection } from './product-library';
export interface DraftComplianceImageDetection {
    sourceUrl?: string;
    assetKey: string;
    occurrenceId: string;
    src_detection: ComplianceFieldDetection;
}
export interface DraftComplianceDescriptionDetection extends ComplianceFieldDetection {
    images?: DraftComplianceImageDetection[];
}
/**
 * 合规报告里的覆盖度说明。truncatedCandidates 是后端因单次调用上限丢掉的
 * 命中数，用于告知用户：当前看到的风险不是全部。
 */
export interface DraftComplianceCoverage {
    requestedRegions?: string[];
    textComplete?: boolean;
    imageComplete?: boolean;
    notes?: string[];
    truncatedCandidates?: number;
    [key: string]: unknown;
}
export interface DraftComplianceProductDetection {
    checkId: string;
    snapshotHash: string;
    status: string;
    summary: {
        riskLocationCount: number;
        issueCount: number;
        evidenceCount: number;
        detectedTypeCount: number;
        riskTypeCount: number;
        incompleteTypeCount: number;
    };
    checks: Array<Record<string, unknown>>;
    coverage: DraftComplianceCoverage;
    issues: ComplianceDetectionIssue[];
}
export interface DraftImage {
    isBestMain?: boolean;
    id: string;
    clientKey?: string;
    imageType: string;
    publicUrl: string;
    originUrl: string;
    objectKey?: string;
    storageKey?: string;
    sortOrder: number;
    publicUrl_detection?: ComplianceFieldDetection;
}
export interface DraftAttribute {
    id: string;
    clientKey?: string;
    attributeId?: string;
    /** 跨来源对齐用的稳定键；`attributeId` 可能是平台侧编码，两者不等价。 */
    canonicalKey?: string;
    attributeName: string;
    valueId?: string;
    valueName: string;
    unit?: string;
    attributeName_detection?: ComplianceFieldDetection;
    valueName_detection?: ComplianceFieldDetection;
}
export type DraftSKUAttribute = DraftAttribute;
/** 草稿元数据中持久化的规格轴快照。 */
export interface DraftSkuSpecAxis {
    /** 展示名。从类目销售属性里选时就是类目属性名。 */
    name: string;
    /** 绑定的类目销售属性 id。从类目 schema 选择时才有。 */
    attrId?: string;
    canonicalKey?: string;
    values: string[];
    /** 值名 → 类目选项的 valueId。仅当该值选自类目选项时才有。 */
    valueIds?: Record<string, string>;
    images: Record<string, string>;
}
export interface DraftSKU {
    skuCode?: string;
    /** 编辑器销售属性别名；与 skuCode 同步，兼容新旧草稿结构。 */
    platformSku?: string;
    price?: number;
    costPrice?: number;
    /** 编辑器销售属性别名；与 costPrice 同步，兼容新旧草稿结构。 */
    sourcePrice?: number;
    compareAtPrice?: number;
    stock?: number;
    weight?: number;
    presaleType?: 'none' | 'spot' | 'preorder';
    productionDays?: number;
    currency?: string;
    id: string;
    clientKey?: string;
    skuName: string;
    imageUrl: string;
    /** 规格值对象；旧草稿使用 attrs，新草稿可使用 specValues。 */
    attrs?: Record<string, unknown>;
    specValues?: Record<string, unknown>;
    draftSkuAttributes: DraftSKUAttribute[];
    skuName_detection?: ComplianceFieldDetection;
    imageUrl_detection?: ComplianceFieldDetection;
}
export interface DraftProductDetail {
    sourcePlatformProductId?: string;
    editorMetadata?: DraftEditorMetadata;
    id: string;
    collectProductId?: string;
    shopId: string;
    platform: string;
    region?: string;
    regionCN?: string;
    source?: string;
    title: string;
    description: string;
    currency?: string;
    language?: string;
    categoryId?: string;
    categoryPath?: string;
    category?: {
        ids?: string[];
        labels?: string;
    };
    sourceCategory?: {
        ids?: string[];
        labels?: string;
    };
    baseContentHash?: string;
    draftImages: DraftImage[];
    draftSkus: DraftSKU[];
    productAttributes: DraftAttribute[];
    product_detection?: DraftComplianceProductDetection;
    productImage_detection?: ComplianceFieldDetection;
    title_detection?: ComplianceFieldDetection;
    description_detection?: DraftComplianceDescriptionDetection;
}
export interface DraftBoundSummary {
    id: string;
    shopId: string;
    platform?: string;
    shopName?: string;
}
export interface DraftComplianceSnapshot {
    id: string;
    title: string;
    title_detection?: ComplianceFieldDetection;
    description: string;
    description_detection?: DraftComplianceDescriptionDetection;
    draftImages: DraftImage[];
    draftAttributes: DraftAttribute[];
    draftSkus: DraftSKU[];
    product_detection?: DraftComplianceProductDetection;
}
export interface DraftComplianceCheckRequest {
    checkTypes?: string[];
    mode: 'editor_snapshot';
    profile: 'prototype-v1';
    idempotencyKey: string;
    clientRevision: number;
    baseContentHash: string;
    snapshot: Omit<DraftComplianceSnapshot, 'id' | 'product_detection' | 'title_detection' | 'description_detection'> & {
        descriptionFormat: 'html';
    };
}
/**
 * 合规检测项能力矩阵。地区覆盖、工具名与默认勾选都由后端给出，
 * 前端只用它渲染，不再自己维护国家支持表。
 */
export interface DraftComplianceCheckCapability {
    type: string;
    label: string;
    description: string;
    tool: string;
    /** false 表示该接口不接受 regions 参数，任何站点都可用。 */
    regionScoped: boolean;
    /** 该检测项执行时必须知道目标地区（例如文本政策检测要拼 platform_sites）。 */
    requiresRegion?: boolean;
    /**
     * 该检测项还要看「平台 + 站点」覆盖（文本政策检测）。
     *
     * 覆盖矩阵在 `capabilities.platformSites` 里**只下发一份**，前端据此做本地判定
     * （跨店铺混选），不自己维护平台站点表。
     */
    platformScoped?: boolean;
    /** 当前站点是否支持该检测项，由后端判定。 */
    supported: boolean;
    /** 该检测项支持的全部睿观地区代码。 */
    regions: string[];
    defaultSelected: boolean;
}
export interface DraftComplianceConfig {
    enabled: boolean;
    rankedTopNumber: number;
    thresholds: Record<string, number>;
    capabilities: {
        /**
         * 睿观的「平台 → 支持站点」矩阵，随能力矩阵一次下发。
         *
         * 口径是**店铺地区码**（小写，如 gb/us/vn）：前端拿草稿 region 直接比对；
         * 全站型平台（temu/ebay/fruugo）用通配 `*` 表示不分站点。
         * 未收录的平台不在表里，按 fail-open 处理（不拦）。
         */
        platformSites?: Record<string, string[]>;
        checks: DraftComplianceCheckCapability[];
        availableCount: number;
        defaultSelectedCount: number;
        target: {
            /** 规范化后的睿观地区代码，例如 UK→GB、EU→EM/EU。 */
            code: string;
            /** 地区代码对应的中文名，例如「英国」；后端未收录时为空串。 */
            name: string;
            /** 调用方传入的原始地区写法。 */
            input: string;
            known: boolean;
            unscoped: boolean;
        };
    };
}
export interface DraftComplianceReport {
    schemaVersion: string;
    checkId: string;
    draftId: string;
    shopId: string;
    clientRevision: number;
    baseContentHash: string;
    snapshotHash: string;
    status: string;
    pollAfterMs?: number;
    summary: DraftComplianceProductDetection['summary'];
    checks: Array<Record<string, unknown>>;
    coverage: DraftComplianceCoverage;
    issues: ComplianceDetectionIssue[];
    snapshot?: DraftComplianceSnapshot;
}
export interface DraftEditorMetadata {
    brand: string;
    productMode: 'single' | 'multiple';
    videoUrl?: string;
    videoName?: string;
    sizeChart: {
        mode: 'image' | 'template';
        imageUrl?: string;
        template?: string;
    };
    logistics: {
        weight: string;
        /**
         * 编辑器只给 KG / G 两个选项；平台返回的其它单位（如 POUND）原样保留。
         * 与 `ProductEditorLogistics['weightUnit']` 同一个形状，这里内联以免 api 层反向依赖组件层。
         */
        weightUnit: 'KG' | 'G' | (string & {});
        dimensionUnit?: string;
        length: string;
        width: string;
        height: string;
        codEnabled: boolean;
        shippingMethod: 'platform-default' | 'seller-custom';
    };
    skuSpecAxes?: DraftSkuSpecAxis[];
}
export interface UpdateDraftPayload {
    draftImages?: DraftImage[];
    draftSkus?: DraftSKU[];
    productAttributes?: DraftAttribute[];
    editorMetadata?: DraftEditorMetadata;
    title?: string;
    description?: string;
    currency?: string;
    language?: string;
    categoryId?: string;
    categoryPath?: string;
}
/**
 * 草稿发布入参。`shopId` 是目标店铺，由后端按草稿已有的目标店铺带出，
 * 前端只回传、不允许更换。
 */
export interface DraftPublishPayload {
    shopId: string;
    /** 归属工作流：发布任务按工作流归属，便于节点按 workflowId 取数。 */
    workflowId?: string;
    options?: Record<string, unknown>;
    force?: boolean;
    draft?: unknown;
}
