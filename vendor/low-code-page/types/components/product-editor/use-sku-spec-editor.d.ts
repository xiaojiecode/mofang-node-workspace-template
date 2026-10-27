import { type SkuSpecAxis } from './product-editor-sku-specs';
import type { ProductEditorSku, ProductEditorSkuSpecAxis, SkuEditorChange } from './types';
/**
 * 类目 schema 里的销售（变体）属性。结构上兼容 `CategorySchemaAttribute`，
 * 只取规格编辑需要的几个字段，避免组件层依赖 api 层的完整 DTO。
 */
export type SkuSpecAttributeOption = {
    name: string;
    attrId?: string;
    canonicalKey?: string;
    /** 该属性的可选值。空/缺省表示自由文本。 */
    options?: Array<{
        id?: string;
        name: string;
    }>;
};
export declare function useSkuSpecEditor({ skus, skuSpecAxes, onChange, salesAttributeOptions }: {
    skus: ProductEditorSku[];
    skuSpecAxes?: ProductEditorSkuSpecAxis[];
    onChange: (change: SkuEditorChange) => void;
    salesAttributeOptions?: SkuSpecAttributeOption[];
}): {
    axes: SkuSpecAxis[];
    skuSpecAxes: {
        images: Record<string, string>;
        valueIds?: Record<string, string> | undefined;
        values: string[];
        canonicalKey?: string | undefined;
        attrId?: string | undefined;
        name: string;
    }[];
    removeSkus: (targets: readonly ProductEditorSku[]) => void;
    nameOptions: import("./product-editor-sku-specs").SkuSpecNameOption[];
    axisValueOptions: (axis: SkuSpecAxis) => {
        id?: string;
        name: string;
    }[];
    duplicateNames: Set<string>;
    canAddAxis: boolean;
    setName: (index: number, name: string) => void;
    addValue: (index: number) => void;
    setValue: (index: number, valueIndex: number, value: string, valueId?: string) => void;
    removeValue: (index: number, valueIndex: number) => void;
    moveValue: (index: number, valueIndex: number, targetIndex: number) => void;
    addAxis: () => void;
    removeAxis: (index: number) => void;
    moveAxis: (index: number, direction: -1 | 1) => void;
    setImage: (value: string, imageUrl: string) => void;
    addImageValue: (imageUrl: string) => void;
    clearImages: (values: string[]) => void;
    /**
     * 「批量传图」弹框点确定：整份替换规格一的图片草稿。
     *
     * 传进来的是弹框里编排好的一整份映射，未展示的键（例如空占位值上的图）
     * 也由调用方原样带回，这里不做筛选。
     */
    replaceImages: (images: Record<string, string>) => void;
};
