import type { ProductEditorSku } from './types';
/** 规格轴的最小结构；`SkuSpecAxis` 与它的测试替身都能直接传进来。 */
type SkuSpecAxisLike = {
    name: string;
    values: readonly string[];
    images: Record<string, string>;
};
/**
 * 把 SKU 行上的图片落到**第一根轴**的规格值上：同一个规格值由多行共用时保留第一张。
 *
 * 规格图在业务上只属于第一根轴（换序即清图，重建组合时也只认 `axes[0].images`），
 * 所以「`名称:值`」与「无名 `值>值`」两条解析路径共用这一份口径；值不在该轴取值集合里
 * 的图直接丢弃，免得在轴上留下点不到的脏键。
 */
export declare function assignFirstAxisImages<T extends SkuSpecAxisLike>(axes: T[], skus: readonly ProductEditorSku[], readValue: (sku: ProductEditorSku, axis: T) => string | undefined): T[];
export {};
