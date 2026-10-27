import type { CollectionProductDetail, ComplianceFieldDetection, DraftComplianceDescriptionDetection, DraftComplianceProductDetection, DraftComplianceReport, DraftSKUAttribute } from '../../api/product-library';
export type ProductEditorSectionId = 'basic-info' | 'category-attributes' | 'sales-attributes' | 'product-images' | 'size-chart' | 'product-video' | 'logistics';
export type ProductEditorDescriptionAction = 'ecommerce-images' | 'ai-generate' | 'image-edit';
/**
 * 规格名对齐时的候选平台变体属性。只取对齐需要的三个字段，结构上兼容类目
 * schema 的 `salesAttributes`，避免组件层依赖 api 层的完整 DTO。
 */
export type ProductEditorSpecNameVariantAttribute = {
    name: string;
    attrId?: string;
    canonicalKey?: string;
    /** 类目属性作用域；只有 `variant`（销售属性）能当规格轴对齐目标。 */
    scope?: string;
};
export type ProductEditorAiIntent = {
    kind: 'title-generate';
} | {
    kind: 'description-generate';
} | {
    kind: 'ecommerce-pack';
} | {
    kind: 'video-generate';
}
/** 一键优化：一次任务里跑用户勾选的多项能力，结果先预览再写回。 */
 | {
    kind: 'optimize';
} | {
    kind: 'spec-polish';
    axisIndex: 0;
}
/**
 * 规格名对齐：调草稿的 `spec-name-polish`，把自由命名的规格收进平台属性
 * （`Colour` → `Color` + attrId）。与 `spec-polish` 的区别是它只改名字，
 * 不走电商 AI 工作台，失败也不阻塞保存。
 */
 | {
    kind: 'spec-name-polish';
    /** 当前类目的变体属性；能对上时优先用平台的属性名与 attrId。 */
    variantAttributes?: ProductEditorSpecNameVariantAttribute[];
} | {
    kind: 'description-image-edit';
    imageSources: ProductEditorAiImageSource[];
    selectedRefs: string[];
} | {
    kind: 'image-translate';
    imageSources: ProductEditorAiImageSource[];
    selectedRefs: string[];
    imageTarget?: ProductEditorImageTarget;
} | {
    kind: 'image-remove-mark';
    imageSources: ProductEditorAiImageSource[];
    selectedRefs: string[];
    imageTarget?: ProductEditorImageTarget;
} | {
    kind: 'image-edit';
    imageSources: ProductEditorAiImageSource[];
    selectedRefs: string[];
    imageTarget?: ProductEditorImageTarget;
} | {
    kind: 'category-attribute-match';
};
/**
 * 图片 AI 任务的素材来路。
 *
 * 商品图片区、规格值图、尺码表图三处发的是**同一批 `entryKind`**（后端也就同一个
 * `type_code: 'edit'` 接口），光看 entryKind 分不出是谁点的。而「后台跑 + 商品图片
 * 列表原位占位回填」只对商品图片区成立 —— 商品编辑器靠这个标记把三者分开。
 */
export type ProductEditorImageTarget = 'product' | 'spec' | 'size-chart';
export type ProductEditorAiImageSource = {
    ref: string;
    url: string;
};
export type ProductEditorImage = CollectionProductDetail['images'][number] & {
    id?: string;
    objectKey?: string;
    url: string;
    clientKey?: string;
    publicUrl_detection?: ComplianceFieldDetection;
};
export type ProductEditorSku = Omit<CollectionProductDetail['skus'][number], 'attrs' | 'price' | 'costPrice' | 'compareAtPrice' | 'stock' | 'weight' | 'presaleType' | 'productionDays'> & {
    id?: string;
    clientKey?: string;
    /** 编辑器内将接口的 null 归一化后使用，避免空响应直接污染可编辑状态。 */
    attrs?: Record<string, unknown>;
    price: number;
    costPrice?: number;
    compareAtPrice?: number;
    stock: number;
    weight?: number;
    presaleType?: 'none' | 'spot' | 'preorder';
    productionDays?: number;
    /** 编辑器/草稿兼容别名：货源价格，对应现有 costPrice。 */
    sourcePrice?: number;
    /** SKU 级货币快照；通常与商品 currency 相同，兼容草稿中的逐 SKU 字段。 */
    currency?: string;
    /** 编辑器/草稿兼容别名：平台 SKU，对应现有 skuCode。 */
    platformSku?: string;
    /** 规格值快照，对应现有 attrs/draftSkuAttributes。 */
    specValues?: Record<string, unknown>;
    draftSkuAttributes?: DraftSKUAttribute[];
    skuName_detection?: ComplianceFieldDetection;
    imageUrl_detection?: ComplianceFieldDetection;
};
export type ProductEditorSkuSpecAxis = {
    /** 展示名。从类目销售属性里选时就是类目属性名 —— 后端按这个名字对齐变体轴。 */
    name: string;
    /** 绑定的类目销售属性 id。从类目 schema 选择时才有。 */
    attrId?: string;
    canonicalKey?: string;
    values: string[];
    /**
     * 值名 → 类目选项的 valueId。仅当该值选自类目选项时才有。
     *
     * 后端推送时会按「属性名 + 值名」重新对齐类目 schema 反推官方 id，所以这里不落库；
     * 但编辑器内保留它，才能在改类目/换属性时判断哪些值已经失效。
     */
    valueIds?: Record<string, string>;
    images: Record<string, string>;
};
export type ProductEditorSkuModeDraft = {
    skus: ProductEditorSku[];
    skuSpecAxes?: ProductEditorSkuSpecAxis[];
};
/** 销售属性编辑器向父级提交的原子变更。 */
export type SkuEditorChange = {
    skus: ProductEditorSku[];
    /**
     * 规格轴陈列。`undefined` 表示「未提供」，编辑器会从 SKU 的 skuName/attrs 推导；
     * 空数组则表示「明确没有轴」。两者含义不同 —— 用 `[]` 顶替 `undefined` 会让
     * 带规格的 SKU 打开时推导不出轴。
     */
    skuSpecAxes?: ProductEditorSkuSpecAxis[];
};
export type ProductEditorCategoryAttribute = {
    id?: string;
    clientKey?: string;
    name: string;
    value: string;
    valueId?: string;
    unit?: string;
    attrId?: string;
    /** 草稿侧属性与平台类目属性不一定同一套编码，两者靠它对上。 */
    canonicalKey?: string;
    required?: boolean;
    scope?: string;
    valueType?: string;
    displayName?: string;
    /**
     * 平台是否允许这个属性自由填写。类目属性面板据此决定能不能输入选项以外的值；
     * 后端还没下发该字段时由 `isCustomizableAttribute` 按选项数量兜底。
     */
    isCustomizable?: boolean;
    options?: Array<{
        id?: string;
        name: string;
        displayName?: string;
    }>;
    name_detection?: ComplianceFieldDetection;
    value_detection?: ComplianceFieldDetection;
};
export type ProductEditorCategory = {
    ids: string[];
    labels: string;
};
export type ProductEditorProductAttribute = {
    id?: string;
    clientKey?: string;
    name: string;
    value: string;
    valueId?: string;
    unit?: string;
    attrId?: string;
    /** 草稿侧属性与平台类目属性不一定同一套编码，两者靠它对上。 */
    canonicalKey?: string;
    required?: boolean;
    scope?: string;
    valueType?: string;
    displayName?: string;
    /**
     * 平台是否允许这个属性自由填写。类目属性面板据此决定能不能输入选项以外的值；
     * 后端还没下发该字段时由 `isCustomizableAttribute` 按选项数量兜底。
     */
    isCustomizable?: boolean;
    options?: Array<{
        id?: string;
        name: string;
        displayName?: string;
    }>;
    name_detection?: ComplianceFieldDetection;
    value_detection?: ComplianceFieldDetection;
};
export type ProductEditorMode = 'single' | 'multiple';
export type ProductEditorSizeChart = {
    mode: 'image' | 'template';
    imageUrl?: string;
    template?: string;
};
/**
 * 编辑器只提供 KG / G 两个选项；`(string & {})` 让 `POUND` 这类平台返回的单位
 * 也能通过类型检查并出现在下拉框里 —— 平台返回什么就原样保留什么，
 * 静默改标成 KG 会把 POUND 的数值错标 2.2 倍。
 */
export type ProductEditorWeightUnit = 'KG' | 'G' | (string & {});
export type ProductEditorLogistics = {
    weight: string;
    weightUnit: ProductEditorWeightUnit;
    dimensionUnit?: string;
    length: string;
    width: string;
    height: string;
    codEnabled: boolean;
    shippingMethod: 'platform-default' | 'seller-custom';
};
export type ProductEditorLogisticsInformation = {
    weight: number;
    length: number;
    width: number;
    height: number;
};
export type ProductEditorLogisticsAutoFill = {
    requestKey: string;
    weightUnit: 'KG' | 'G';
    information: ProductEditorLogisticsInformation;
    /**
     * 覆盖已有的重量 / 尺寸。
     *
     * 先用 `packaging_info_list` 本地顶上、再等模型接口返回的链路里，
     * 第二次回填要能覆盖第一次的本地值；普通自动回填仍然是「只在全空时补」。
     */
    overwrite?: boolean;
};
export type ProductEditorValue = {
    id: string;
    title: string;
    description: string;
    currency: string;
    /**
     * 货币由平台商品决定，编辑器不可修改。
     *
     * 只有店铺商品链路会设置它（详情接口返回的 currency 非空时）；草稿与发布任务
     * 两个适配器不设置，因此它们保持可编辑。
     */
    currencyLocked?: boolean;
    language: string;
    images: ProductEditorImage[];
    skus: ProductEditorSku[];
    skuSpecAxes?: ProductEditorSkuSpecAxis[];
    /** 单品与多规格在本次编辑中的独立草稿，不直接出站。 */
    skuModeDrafts?: Partial<Record<ProductEditorMode, ProductEditorSkuModeDraft>>;
    categoryAttributes: ProductEditorCategoryAttribute[];
    productAttributes: ProductEditorProductAttribute[];
    category: ProductEditorCategory;
    brand: string;
    productMode: ProductEditorMode;
    sizeChart: ProductEditorSizeChart;
    logistics: ProductEditorLogistics;
    videoUrl?: string;
    videoName?: string;
    draftId?: string;
    baseContentHash?: string;
    /** 草稿所属店铺的地区与平台；合规检测能力由后端按地区判定。 */
    region?: string;
    platform?: string;
    compliance?: ProductEditorCompliance;
};
export type ProductEditorCompliance = {
    report?: DraftComplianceReport;
    product?: DraftComplianceProductDetection;
    title?: ComplianceFieldDetection;
    description?: DraftComplianceDescriptionDetection;
    reportRevision?: number;
    stale?: boolean;
};
export type ProductEditorListItem = {
    id: string;
    title: string;
    sourceItemId?: string;
    imageUrl?: string;
    /** 当前商品的发布店铺名称；仅工作流商品信息优化编辑入口提供。 */
    shopName?: string;
};
export type ProductEditorError = {
    field: 'title' | 'description' | 'category' | 'sales' | 'images' | 'logistics-weight' | 'logistics-dimensions';
    message: string;
};
export type ProductEditorActionConfig = {
    key: string;
    label: string;
};
export type ProductEditorDialogProps = {
    services?: import('./editor-services').ProductEditorServices;
    /**
     * 入口页面类型。声明后，弹窗按 PRODUCT_EDITOR_PAGE_PROFILES 统一处理
     * 默认动作、合规检测能力等入口差异；不传时保持旧的按 props 判断的行为。
     */
    pageType?: import('./page-type').ProductEditorPageType;
    open: boolean;
    value: ProductEditorValue | null;
    loading?: boolean;
    errorMessage?: string;
    complianceError?: string;
    relatedProducts?: ProductEditorListItem[];
    totalCount?: number;
    initialProductId?: string;
    logisticsAutoFill?: ProductEditorLogisticsAutoFill;
    onOpenChange: (open: boolean) => void;
    onProductSelect?: (productId: string) => void;
    /** 删除左侧同页商品；由入口页面决定删除语义。 */
    onProductDelete?: (productId: string) => void;
    actions?: readonly ProductEditorActionConfig[];
    onSave: (value: ProductEditorValue, actionKey: string) => void;
    onComplianceCheck?: (value: ProductEditorValue, checkTypes?: string[]) => void | Promise<void>;
    onDescriptionAction?: (action: ProductEditorDescriptionAction) => void;
    /**
     * Title/description AI entry point. The editor only emits a typed intent
     * and exposes a local draft patch function; the e-commerce task runtime
     * stays owned by the page wrapper/host.
     */
    onAiAction?: (intent: ProductEditorAiIntent, context: {
        value: ProductEditorValue;
        getValue?: () => ProductEditorValue | null;
        apply: (patch: Partial<ProductEditorValue>) => void;
    }) => void | Promise<void>;
    /** 当前商品是否有运行中的视频生成任务；产品视频区用它覆盖式展示 loading。 */
    videoGenerating?: boolean;
    categoryTree?: ProductEditorCategoryNode[];
    categoryAttributes?: ProductEditorSchemaAttribute[];
    categoryLoading?: boolean;
    categoryError?: string;
    categorySyncing?: boolean;
    onCategorySync?: () => void;
    onCategoryChange?: (category: ProductEditorCategory) => void;
    categoryDraftId?: string;
    categoryShopId?: string;
    categorySite?: string;
    categoryPlatform?: string;
    skipCategorySuggestion?: boolean;
    categoryDisabled?: boolean;
    categoryAttributesReadOnly?: boolean;
    allowOptionalSkuFields?: boolean;
    /**
     * 商品图片 AI 任务进行中的占位卡（转圈 / 失败），集中渲染在图片列表**开头**。
     *
     * 不锚定到具体某张图：产品口径是不管占位对应哪张原图，都插在发起任务的这个列表
     * 最上面（描述区的正文图占位同理）。
     */
    productImagePendingImages?: readonly ProductImagePending[];
    /**
     * 图片任务跑完、且用户已关掉进度弹框时，要原位替换进商品图槽位的结果。
     *
     * 每项按 `sourceRef` 找到原图下标原位换 URL，其余字段（id/sortOrder 等）保留；
     * 组件只在 taskId 变化时落地一次。
     */
    productImageAutoApply?: ImageTaskAutoApply | null;
    /** 自动落地完成的回执，调用方据此向服务端标记「已应用」。 */
    onProductImageAutoApplied?: (taskId: string) => void;
    /** 用户点掉一张失败占位卡。 */
    onProductImagePendingDismiss?: (key: string) => void;
    /** 规格值图 AI 任务的占位卡，渲染在规格图网格开头。 */
    specImagePendingImages?: readonly ProductImagePending[];
    onSpecImagePendingDismiss?: (key: string) => void;
    /** 规格值图任务的结果；按 `spec:{轴下标}:{值下标}` 写回 `skuSpecAxes[].images`。 */
    specImageAutoApply?: ImageTaskAutoApply | null;
    onSpecImageAutoApplied?: (taskId: string) => void;
    /** 尺码表图 AI 任务的占位卡，渲染在尺码表图旁边。 */
    sizeChartPendingImages?: readonly ProductImagePending[];
    onSizeChartPendingDismiss?: (key: string) => void;
    /** 尺码表图任务的结果；按 `size-chart` 字面量写回 `sizeChart.imageUrl`。 */
    sizeChartAutoApply?: ImageTaskAutoApply | null;
    onSizeChartAutoApplied?: (taskId: string) => void;
    /**
     * 描述图片编辑跑完后，要按 `data-image-id` 原地替换正文图 src 的结果。
     *
     * 与 `descriptionAutoApply`（套图，往正文里**追加**新图）是两回事：这个是**替换**
     * 已有的正文图，落不进去的项（图被删了）直接忽略。
     */
    descriptionImageEditAutoApply?: ImageTaskAutoApply | null;
    /** 描述图替换完成的回执，调用方据此向服务端标记「已应用」。 */
    onDescriptionImageEditAutoApplied?: (taskId: string) => void;
    /** 套图任务进行中的占位卡（转圈 / 失败），渲染在描述图片列表顶部。 */
    descriptionPendingImages?: readonly DescriptionPendingImage[];
    /**
     * 套图跑完、且用户已关掉进度弹框时，要自动补进描述正文的图片。
     *
     * 用户关掉弹框等于放弃逐张勾选，所以这里给的是全部成功项；组件只在 taskId
     * 变化时落地一次，并保证不重复插入已经存在的 URL。
     */
    descriptionAutoApply?: {
        taskId: string;
        urls: readonly string[];
    } | null;
    /** 自动落地完成的回执，调用方据此向服务端标记「已应用」。 */
    onDescriptionAutoApplied?: (taskId: string) => void;
    /** 用户点掉一张失败占位卡。 */
    onDescriptionPendingDismiss?: (key: string) => void;
};
export type ProductEditorCategoryNode = {
    id: string;
    label: string;
    children: ProductEditorCategoryNode[];
};
/**
 * 描述图片列表顶部的「生成中 / 生成失败」占位卡。
 *
 * 刻意用中性类型，不让商品编辑器依赖 ecom-ai —— 调用方（商品编辑器入口）
 * 负责把套图任务的 itemId 映射成这里的 `key`。
 */
export type DescriptionPendingImage = {
    key: string;
    status: 'pending' | 'failed';
};
/**
 * 商品图片槽位旁的「生成中 / 生成失败」占位卡。
 *
 * 同样刻意保持中性：`product-editor` 不依赖 ecom-ai，调用方负责把图片任务的明细
 * 映射成这里的 `key`，并把原图 ref 透传成 `sourceRef`。
 */
export type ProductImagePending = {
    key: string;
    status: 'pending' | 'failed';
};
/**
 * 图片任务跑完后要原地写回的一批结果。
 *
 * 商品图（按商品图 ref 换 `value.images`）与描述图（按 `data-image-id` 换正文 HTML）
 * 共用这个形状，调用方把它直接透传进来即可。
 */
export type ImageTaskAutoApply = {
    taskId: string;
    images: ReadonlyArray<{
        key: string;
        url: string;
        sourceRef?: string;
    }>;
};
export type ProductEditorSchemaAttribute = {
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
};
