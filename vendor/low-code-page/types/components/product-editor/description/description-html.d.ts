import type { ProductEditorAiImageSource } from '../types';
export declare function normalizeDescriptionImageUrl(url: string): string;
/**
 * 正文图片的身份（imageId）由图片自身的 src 派生，与商品主图数组无关。
 * 同一 src 的第 2 张起追加出现序号，保证重复图的身份仍然唯一。
 */
export declare function resolveDescriptionImageId(src: string, occurrence?: number): string;
/**
 * 从 imageId 反解出「归一化 src + 出现序号」。
 * 注意：imageId 本身不能喂给 normalizeDescriptionImageUrl —— 它会把 `#n` 当成 hash 剥掉。
 */
export declare function parseDescriptionImageId(imageId: string): {
    sourceUrl: string;
    occurrence: number;
};
/** Build the URL/ref pairs used by the AI image-edit entry for description images. */
export declare function getDescriptionImageSources(html: string): ProductEditorAiImageSource[];
export declare function replaceDescriptionImage(html: string, imageId: string, newUrl: string): string;
/** Replace several description images against the identities from one HTML snapshot. */
type DescriptionImageReplacement = string | {
    url: string;
    imageId: string;
};
export declare function replaceDescriptionImages(html: string, replacements: ReadonlyMap<string, DescriptionImageReplacement>): string;
export declare function removeDescriptionImage(html: string, imageId: string): string;
/**
 * 把一组图片插到正文**开头**，原有内容整体后移。
 *
 * 正文图是独立于商品主图数组的另一份数据（HTML 里的 `<img>`），套图结果按产品口径
 * 落到这里。写成裸标签而不是包一层 `<p>`：编辑器导入时会把 `<p><img></p>` 解包
 * （`unwrapStandaloneDescriptionImages`），两种写法最终等价，裸标签少一层嵌套。
 *
 * 默认不与正文已有图片判重 —— 用户点「应用所选结果」是对某一次生成的明确确认，
 * 静默丢掉已存在的 URL 会让操作看起来没生效。只去掉列表内部的重复与空值。
 *
 * `skipExisting` 给**自动**落地用：套图跑完是系统行为，可能被重复触发（任务记录
 * 保持活跃时每次进入商品都会重算），必须幂等，否则同一批图会被反复插进正文。
 */
export declare function prependDescriptionImages(html: string, urls: readonly string[], options?: {
    skipExisting?: boolean;
}): string;
/**
 * 把一组图片追加到正文**末尾**。
 *
 * 落点与图栏的「添加图片」（`$appendDescriptionImage`）一致：正文多出一张新图，
 * 已有正文与图片原地不动。一键优化产出的正文图走这里 —— 原图是用户的素材，
 * 换掉就找不回来了，产物一律按新增图进正文。
 *
 * 与商品图追加同样的判重口径：按归一化 src 跳过正文里已有的图，同一份结果
 * 重复应用不会越加越多。
 */
export declare function appendDescriptionImages(html: string, urls: readonly string[]): string;
/**
 * 描述正文已有图片时以正文为准，不再从来源图片里补 detail 图；
 * 只有正文没有图片时，才把来源 detail 图追加到末尾。
 */
export declare function appendDescriptionImagesIfDescriptionHasNoImages(html: string, urls: readonly string[]): string;
export declare function countDescriptionText(html: string): number;
export declare function hasDescriptionText(html: string): boolean;
export declare function readHtmlAttribute(tag: string, name: string): string;
export declare function sanitizeDescriptionHtml(html: string): string;
/** 将纯文本 description 包装为 HTML，供富文本编辑器渲染。
 *  已含 HTML 标签的内容原样返回。 */
export declare function wrapPlainTextAsHtml(html: string): string;
/**
 * 正文图片统一排到文字后面，并把原有正文里还缺的图补上。
 *
 * 产品口径：**优化后的描述在前，描述里的图片全部在后**。AI 有时会把原描述里的图
 * 一并回出来（甚至整段以图开头），按原样渲染就会出现「图挡在描述前面」；这里把
 * 正文里的 `<img>` 全部摘出来排到末尾。
 *
 * 与 {@link preserveDescriptionImages} 的差别只是位置：那个保留图在原位、只补缺口，
 * 这个把所有图都挪到末尾。图与图之间保持各自原来的相对次序；`next` 里已经有的图
 * 不会再用 `previous` 里的同一张补一遍，按归一化后的 src 判重。
 */
export declare function moveDescriptionImagesToEnd(next: string, previous: string): string;
/**
 * 整体替换正文时把原有正文图带回来。
 *
 * AI 重写文案返回的 HTML 里没有图，直接替换会把用户之前上传/粘贴的正文图全部丢掉。
 * 已经出现在新内容里的图不再重复追加，按归一化后的 src 判重。
 */
export declare function preserveDescriptionImages(next: string, previous: string): string;
/**
 * 把 AI 提炼的卖点接到正文末尾。
 *
 * 卖点在编辑器里没有独立字段，而它本来就是给详情页用的文案，所以挂到正文里。
 * 只输出一个无序列表、不加中文小标题 —— 正文是目标语种的，插一个中文标题会串语种。
 */
export declare function appendSellingPoints(html: string, points: readonly string[]): string;
export {};
