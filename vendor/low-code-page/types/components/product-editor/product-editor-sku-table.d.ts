import type { ProductEditorSku, ProductEditorSkuSpecAxis } from './types';
type SkuRowError = {
    sourcePrice?: string;
    price?: string;
    stock?: string;
    platformSku?: string;
    weight?: string;
    productionDays?: string;
};
export declare function getSkuTableMinWidth(specAxisCount: number, canDelete: boolean): string;
export declare function filterSkuRows(skus: ProductEditorSku[], query: string): ProductEditorSku[];
/**
 * 切换一批行的选中态。
 *
 * 表头全选传的是**当前搜索结果**，所以「取消全选」只会取消结果里的那些，筛选之外
 * 已经勾好的行原样保留；「已选 M 个」数的是全量集合，包含筛选下看不见的行。
 */
export declare function toggleSkuSelection(selected: ReadonlySet<string>, targets: readonly ProductEditorSku[], nextSelected: boolean): Set<string>;
/** 按行标识在全量列表里解析出选中行；解析不到的（行已被删/重建）直接忽略。 */
export declare function selectSkuRows(skus: readonly ProductEditorSku[], selected: ReadonlySet<string>): ProductEditorSku[];
export declare function getSkuRowErrors(sku: ProductEditorSku, allSkus?: ProductEditorSku[]): SkuRowError;
export declare function SkuTable({ skus, skuSpecAxes, onChange, onDeleteSkus, currency, onCurrencyChange, currencyLocked }: {
    skus: ProductEditorSku[];
    skuSpecAxes?: ProductEditorSkuSpecAxis[];
    onChange: (skus: ProductEditorSku[]) => void;
    /**
     * 删除若干行。**必须由父级接到规格轴钩子上**：删行的同时要把「一行都不剩的选项值」
     * 从规格里摘掉，两者得在同一次提交里落地。不传就不渲染选择列与操作列。
     */
    onDeleteSkus?: (skus: ProductEditorSku[]) => void;
    currency?: string;
    onCurrencyChange?: (currency: string) => void;
    /** 货币由平台商品决定时置为 true。 */
    currencyLocked?: boolean;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 这次删除会连带摘掉哪些规格选项值，用于确认文案里先说清影响。
 *
 * 复用与真正删除同一个裁剪函数，保证文案说的和实际发生的一致。
 */
export declare function describeSpecImpact(specAxes: ProductEditorSkuSpecAxis[], remaining: ProductEditorSku[]): string;
export {};
