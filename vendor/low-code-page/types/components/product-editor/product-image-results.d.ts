import type { ImageTaskAutoApply, ProductEditorImage } from './types';
/**
 * 商品图的 ref 口径。
 *
 * 必须和 `productImageSources`（图片管理器里给 AI 按钮算 `imageSources` 的那份）
 * 完全一致 —— 任务下发时用这套 ref 认原图，结果回来时也用它认回来。
 */
export declare function productImageRef(image: ProductEditorImage): string;
/**
 * 把图片任务的成功结果作为**新图插到商品图列表开头**，原图保留。
 *
 * 产品口径：占位卡摆在列表开头，跑完那个位置就该变成生成图 —— 不是把原图的 URL
 * 换掉。新图只带 `imageType`（沿用原图，MAIN 还是 MAIN）和结果 URL：
 * `id`/`objectKey`/`clientKey` 一律不带（它不是图库里的图），合规检测结果也不继承
 * （那是原图的结论）。
 *
 * 顺序：新图之间按**当前列表顺序**排（用户中途拖过也认），插完之后整表重排
 * `sortOrder`，否则会和原图的序号撞车。
 *
 * 认不出的 ref（原图在任务期间被删）整项丢弃，不凭空加图；一项都没命中时返回原数组。
 */
export declare function prependProductImageResults(images: readonly ProductEditorImage[], results: ImageTaskAutoApply['images']): ProductEditorImage[];
