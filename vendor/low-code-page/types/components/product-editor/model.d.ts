import type { CategorySuggestionResult, CollectionProductDetail, DraftAttributeSuggestResult } from '../../api/product-library';
import type { ProductEditorCategory, ProductEditorCategoryAttribute, ProductEditorCategoryNode, ProductEditorError, ProductEditorListItem, ProductEditorProductAttribute, ProductEditorSchemaAttribute, ProductEditorSectionId, ProductEditorValue } from './types';
export type ProductEditorCategoryPlatform = 'tiktok' | 'shopee';
export declare const CATEGORY_PLATFORMS: ReadonlyArray<{
    key: ProductEditorCategoryPlatform;
    enabled: boolean;
}>;
export declare function resolveCategoryPlatform(value?: string): ProductEditorCategoryPlatform | undefined;
export declare function resolveCategorySyncRequest(input: {
    shopId?: string;
    platform?: string;
    site?: string;
}): {
    ok: true;
    platform: ProductEditorCategoryPlatform;
    shopId: string;
    site: string;
} | {
    ok: false;
    error: string;
};
export declare function readCategorySyncContext(source: unknown): {
    shopId?: string;
    platform?: string;
    site?: string;
};
export declare function normalizeCategoryTree(raw: unknown): ProductEditorCategoryNode[];
export declare function loadProductEditorCategoryTree(params: {
    shopId?: string;
    site?: string;
    platform?: string;
    refresh?: boolean;
}, api: {
    listPlatformCategories: (payload: {
        shopId: string;
        site?: string;
        platform: ProductEditorCategoryPlatform;
    }) => Promise<unknown>;
    syncPlatformCategories: (payload: {
        shopId: string;
        site?: string;
        platform: ProductEditorCategoryPlatform;
    }) => Promise<unknown>;
}): Promise<ProductEditorCategoryNode[]>;
export declare function readCategoryShopId(rawData: unknown): string;
export declare function readCategoryPlatform(rawData: unknown): string | undefined;
export declare function toProductEditorAttributes(attributes: ProductEditorSchemaAttribute[]): {
    options: {
        id?: string;
        name: string;
        displayName?: string;
    }[];
    isCustomizable?: boolean | undefined;
    valueType?: string | undefined;
    scope?: string | undefined;
    required?: boolean | undefined;
    canonicalKey?: string | undefined;
    value: string;
    attrId: string;
    displayName?: string | undefined;
    name: string;
}[];
/** 编辑器侧属性：两个桶结构一致，只有归属不同。 */
export type ProductEditorAttribute = ProductEditorCategoryAttribute | ProductEditorProductAttribute;
/**
 * 把类目 schema 属性与草稿已存的属性合成编辑器状态。
 *
 * 草稿的 `attributeId` 与类目的 `attrId` 未必同一套编码（草稿可能是
 * `material` 这种 canonicalKey 形态，类目可能是平台数字 ID），所以先按
 * attrId 配，配不上再按 canonicalKey 配。
 *
 * 两个键都没配上的草稿属性默认原样保留：schema 一旦返回内容，这里会整体
 * 重建属性列表，配不上的条目如果直接丢掉，就会在用户下一次保存时静默消失。
 *
 * 换类目是例外：那些配不上的属性属于旧类目，留着会带着旧类目的 required /
 * options 混进新类目的表单，既删不掉又拦提交。这时传 `dropUnmatched`。
 */
export declare function mergeSchemaAttributes(schema: ProductEditorSchemaAttribute[], existing: ProductEditorAttribute[], { dropUnmatched }?: {
    dropUnmatched?: boolean;
}): {
    categoryAttributes: ProductEditorCategoryAttribute[];
    productAttributes: ProductEditorProductAttribute[];
};
/**
 * 将类目建议值回填到产品属性下拉框。
 *
 * 类目 Schema 决定属性行及其 options，建议接口只决定当前选中值。
 * 先按 attrId 匹配，匹配不到再按属性名匹配；有枚举 options 时只接受
 * 能对应到现有选项的建议，避免把无效值写进表单。
 */
export declare function applySuggestedProductAttributes(attributes: ProductEditorProductAttribute[], result: DraftAttributeSuggestResult | null | undefined): ProductEditorProductAttribute[];
/**
 * schema 合并时要不要丢掉配不上的旧属性。
 *
 * 只有「用户刚给这个商品换了类目」才算数。带上 productId 是必须的：切换商品
 * 也会让类目变，但那种情况下新商品的属性是它自己的，不能跟着一起丢。
 */
export declare function shouldDropUnmatchedAttributes({ switchedForProductId, currentProductId }: {
    switchedForProductId?: string;
    currentProductId?: string;
}): boolean;
/**
 * 属性能不能自由填写（输入选项以外的值）。
 *
 * 后端下发 `isCustomizable` 时以它为准；字段还没上线时按选项数量兜底：没有选项、
 * 或只有一个选项且不是必填枚举时视为可自定义 —— TikTok 的 Batch number 只回了一个
 * 「1」，按旧口径用户会被锁成只能选它。
 */
export declare function isCustomizableAttribute(attribute: {
    required?: boolean;
    valueType?: string;
    isCustomizable?: boolean;
    options?: Array<{
        id?: string;
        name: string;
    }>;
}): boolean;
/**
 * 是不是「必须从选项里选」的必填属性：必填 + 有选项 + 平台不允许自定义取值。
 *
 * 编辑器据此把该类字段锁成下拉、不给自由输入框。判据是 `isCustomizableAttribute`：
 * TikTok Get Attributes 的 `is_customizable=true` 表示「商家可以自己填自定义值」
 * （官方 Create Product 对 `product_attributes[].values[].name` 的说明：内置值不满足
 * 需求时可自填，平台刊登后自动生成 id），所以这一类**不**锁。
 *
 * Batch number 就是这一类：内置值只有一个 `{"id":"1000256","name":"1"}` 但可自定义，
 * 锁掉它等于逼商家把真实货号写成 1。
 *
 * 反过来，`is_customizable=false` 时手填的非选项值平台不认（发布前预检报
 * `required_product_unmapped`），必须锁成下拉。
 */
export declare function isRequiredEnumAttribute(attribute: {
    required?: boolean;
    isCustomizable?: boolean;
    valueType?: string;
    options?: Array<{
        id?: string;
        name: string;
    }>;
}): boolean;
/** TikTok 的库存是 1~99999；0 和超上限都会被平台拒掉。 */
export declare const TIKTOK_STOCK_MIN = 1;
export declare const TIKTOK_STOCK_MAX = 99999;
export declare const PRODUCT_IMAGE_MAX_COUNT = 9;
export declare const DESCRIPTION_IMAGE_MAX_COUNT = 30;
export declare const PRODUCT_SKU_MAX_COUNT = 99;
/**
 * 这个编辑器值要不要按 TikTok 的库存口径校验。
 *
 * 只对带平台信息的草稿（草稿适配器会带上 platform）生效：采集商品、店铺商品
 * 保存的是另一套资源，0 库存在那两个入口是合法状态，不能一刀切拦住。
 */
export declare function requiresTikTokStockRange(platform?: string): boolean;
export declare function resolveProductAttributeOptions(attribute: {
    value: string;
    valueId?: string;
    options?: Array<{
        id?: string;
        name: string;
    }>;
}): {
    name: string;
}[];
export declare function findCategoryPath(tree: ProductEditorCategoryNode[], id: string): ProductEditorCategoryNode[];
export declare function shouldRequestCategorySuggestion({ open, draftId, categoryIds, categoryLabels, skip }: {
    open: boolean;
    draftId?: string;
    categoryIds: string[];
    categoryLabels?: string;
    skip: boolean;
}): boolean;
export declare function resolveProductEditorCategory(current: ProductEditorCategory, suggestion: CategorySuggestionResult | null | undefined, categoryTree?: ProductEditorCategoryNode[]): ProductEditorCategory;
/**
 * 保存回读：后端落库的类目与我们提交的是否一致。
 *
 * 「选了没生效」多半是提交了父类目、或类目在新一轮同步后已失效，后端静默换成了
 * 别的节点，界面上看不出异常。不一致时必须显式告知，不能让用户以为所选类目生效了。
 * 返回提示文案；一致或本来就没选类目时返回 null。
 */
export declare function resolveCategorySaveMismatch(submittedCategoryId: string, savedCategoryId?: string | null): string | null;
export declare const collectionProductEditorAdapter: {
    /**
     * 采集商品 → 编辑器值。
     * editorId 是采集箱行 id（collect_tasks.id），与采集箱详情 / 保存接口的
     * 路径参数一致；编辑器侧的商品切换也按该 id 定位。
     */
    toValue: (detail: CollectionProductDetail, editorId?: string) => {
        id: string;
        title: string;
        description: string;
        currency: string;
        language: string;
        images: {
            url: string;
            id?: string;
            imageType: string;
            originUrl?: string;
            publicUrl?: string;
            objectKey?: string;
            storageKey?: string;
            isBestMain?: boolean;
            sortOrder: number;
        }[];
        skus: {
            attrs: Record<string, unknown> | undefined;
            price: number;
            costPrice: number | undefined;
            compareAtPrice: number | undefined;
            stock: number;
            weight: number | undefined;
            presaleType: "none" | "spot" | "preorder";
            productionDays: number | undefined;
            id?: string;
            collectProductId?: string;
            skuCode: string;
            skuName: string;
            imageUrl?: string;
        }[];
        skuSpecAxes: undefined;
        categoryAttributes: {
            options?: {
                displayName?: string | undefined;
                id: string | undefined;
                name: string;
            }[] | undefined;
            isCustomizable?: boolean | undefined;
            valueType?: string | undefined;
            scope?: string | undefined;
            required?: boolean | undefined;
            attrId?: string | undefined;
            unit?: string | undefined;
            valueId?: string | undefined;
            value: string;
            displayName?: string | undefined;
            name: string;
            clientKey?: string | undefined;
            id?: string | undefined;
        }[];
        productAttributes: {
            options?: {
                displayName?: string | undefined;
                id: string | undefined;
                name: string;
            }[] | undefined;
            isCustomizable?: boolean | undefined;
            valueType?: string | undefined;
            scope?: string | undefined;
            required?: boolean | undefined;
            attrId?: string | undefined;
            unit?: string | undefined;
            valueId?: string | undefined;
            value: string;
            displayName?: string | undefined;
            name: string;
            clientKey?: string | undefined;
            id?: string | undefined;
        }[];
        category: {
            ids: string[];
            labels: string;
        };
        brand: string;
        productMode: import("./types").ProductEditorMode;
        sizeChart: {
            mode: "template";
            template: string;
            imageUrl?: undefined;
        } | {
            mode: "image";
            imageUrl: string | undefined;
            template?: undefined;
        };
        logistics: {
            weight: string;
            weightUnit: string;
            length: string;
            width: string;
            height: string;
            codEnabled: boolean;
            shippingMethod: "platform-default" | "seller-custom";
        };
        videoUrl: string | undefined;
        videoName: string | undefined;
    };
};
export declare function getCollectionProductEditorImages(images: ProductEditorValue['images']): import("./types").ProductEditorImage[];
export declare const PRODUCT_EDITOR_SECTIONS: Array<{
    id: ProductEditorSectionId;
    label: string;
}>;
export declare function resolveProductEditorScrollSection({ activeTop, atBottom, manualSectionId, sectionTops }: {
    activeTop: number;
    atBottom: boolean;
    manualSectionId?: ProductEditorSectionId | null;
    sectionTops: Partial<Record<ProductEditorSectionId, number>>;
}): ProductEditorSectionId;
export declare function resolveProductEditorInitialId(requestedId: string | undefined, products: ProductEditorListItem[]): string;
export declare function getProductEditorError(errors: ProductEditorError[], field: ProductEditorError['field']): ProductEditorError | undefined;
export declare function getProductEditorValidationFields(errors: ProductEditorError[]): {
    categorySelectionError: ProductEditorError | undefined;
    categoryAttributeError: ProductEditorError | undefined;
    logisticsWeightError: ProductEditorError | undefined;
    logisticsDimensionsError: ProductEditorError | undefined;
};
export declare function validateProductEditorValue(value: ProductEditorValue, options?: {
    allowOptionalSkuFields?: boolean;
    /** 类目不可用的入口（采集箱）：跳过类目必填校验，否则保存会被不落库的字段拦住。 */
    allowMissingCategory?: boolean;
    /** 采集箱键值属性允许零行，但已有行的名称和值都必须填写。 */
    requireCompleteProductAttributes?: boolean;
    /** 数量上限只在保存时校验，编辑过程中允许继续保留超限内容。 */
    enforceItemLimits?: boolean;
    /** 产品图片区域实际展示的图片数，避免把 description/detail 图混入上限。 */
    productImageCount?: number;
}): ProductEditorError[];
export declare function getScrollDirection(currentTop: number, targetTop: number): "current" | "down" | "up";
export declare function hasProductEditorChanges(initial: ProductEditorValue, current: ProductEditorValue): boolean;
