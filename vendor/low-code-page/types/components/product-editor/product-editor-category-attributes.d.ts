import type { ProductEditorCategory, ProductEditorCategoryAttribute, ProductEditorCategoryNode, ProductEditorProductAttribute } from './types';
export declare function CategoryAttributeEditor({ productAttributes, onProductAttributesChange, error, categoryValidationError, category, onCategoryChange, brand, onBrandChange, categoryTree, categoryLoading, categoryError, categorySyncing, onCategorySync, categoryDisabled, attributesReadOnly,
/**
 * 该入口有没有可选类目（采集箱置 false）。
 *
 * 两个作用：去掉类目必填星号；不套用「未选类目时产品属性不可填」的空态
 * ——采集箱没有类目可选，属性必须一直可编辑，否则会被永远解不开的空态挡死。
 */
categoryRequired,
/** 类目空态占位符。 */
categoryPlaceholder, onAiAction, aiMatching, productAttributesVariant }: {
    /** @deprecated Category attributes remain in the draft for sales schema binding. */
    attributes?: ProductEditorCategoryAttribute[];
    /** @deprecated Product attributes are edited through the dedicated combobox grid. */
    onChange?: (attributes: ProductEditorCategoryAttribute[]) => void;
    productAttributes?: ProductEditorProductAttribute[];
    onProductAttributesChange?: (attributes: ProductEditorProductAttribute[]) => void;
    error?: string;
    categoryValidationError?: string;
    category: ProductEditorCategory;
    onCategoryChange: (value: ProductEditorCategory) => void;
    brand: string;
    onBrandChange: (value: string) => void;
    categoryTree?: ProductEditorCategoryNode[];
    categoryLoading?: boolean;
    categoryError?: string;
    categorySyncing?: boolean;
    onCategorySync?: () => void;
    categoryDisabled?: boolean;
    attributesReadOnly?: boolean;
    categoryRequired?: boolean;
    categoryPlaceholder?: string;
    onAiAction?: (intent: Extract<import('./types').ProductEditorAiIntent, {
        kind: 'category-attribute-match';
    }>) => void;
    /** AI 属性匹配请求进行中时，按钮显示 loading 态并禁用。 */
    aiMatching?: boolean;
    /**
     * 产品属性编辑形态。
     *
     * `schema` 保持店铺商品 / 发布记录 / 草稿编辑原有的名称 + 值下拉；
     * `key-value` 仅供采集箱入口使用，属性和值都是可编辑文本框。
     */
    productAttributesVariant?: 'schema' | 'key-value';
}): import("react/jsx-runtime").JSX.Element;
