import type { ImageTaskAutoApply, ProductEditorSizeChart, ProductEditorSkuSpecAxis } from './types';
/**
 * 图片任务结果的原地写回。
 *
 * 商品图库走 `productImageRef` 那套，这里只管两个「没有天然身份」的槽位：
 * 规格值图与尺码表图 —— 它们的锚点是 `image-ai-source-ref.ts` 里编的 ref。
 *
 * 组件层（`ProductEditorDialog` 的显式应用）与适配器层（弹框里手动「应用优化结果」）
 * 共用这一份，免得同一个口径写两遍、日后改一处漏一处。
 */
/** ref → url。空 url、没 ref 的丢掉；同一个 ref 先到先得（同图多能力时取第一个）。 */
export declare function indexTaskResultsByRef(results: ImageTaskAutoApply['images']): Map<string, string>;
/**
 * 规格值图：按 `spec:{轴下标}:{值下标}:{值名}` 贴回 `skuSpecAxes[].images`。
 *
 * 下标是锚、值名取**当下**这个 —— 值名可能已被规格润色 / `copy_spec` 改掉。
 * 一条都没落地（轴/值下标越界，规格中途被删）时返回 null，别往草稿里写原样的克隆。
 */
export declare function applySpecImageResults(axes: readonly ProductEditorSkuSpecAxis[], results: ImageTaskAutoApply['images']): ProductEditorSkuSpecAxis[] | null;
/** 尺码表图：按 `size-chart` 字面量写回 `imageUrl`；没命中返回 null。 */
export declare function applySizeChartImageResult(sizeChart: ProductEditorSizeChart, results: ImageTaskAutoApply['images']): ProductEditorSizeChart | null;
