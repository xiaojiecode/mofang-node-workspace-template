/**
 * 规格一「批量传图」弹框的草稿模型。
 *
 * 草稿只在弹框内维护：左侧备选图池 + 每个规格值对应的图片，点击「确定」时才整份
 * 写回规格一的 `images`，取消/关闭全部丢弃。
 */
export type SpecImageDraft = Record<string, string>;
export type SpecImageBatchSession = {
    /** 规格一图片草稿：键是规格值名，值是要写回的图片地址。 */
    draft: SpecImageDraft;
    /** 左侧备选图池，按加入顺序排列。 */
    candidates: string[];
    /** 当前选中的规格值；左侧点图就是替换它。 */
    selectedValue: string;
};
/**
 * 单批选择上限，只用于给图片选择弹框一个可读的批次数字。
 *
 * 商品图通道会把单批收敛到 5 张，规格图不沿用该限制；左侧备选图池本身不设上限，
 * 可反复追加。
 */
export declare const SPEC_IMAGE_BATCH_PICK_LIMIT = 100;
/** 参与批量传图的具体规格值：保持编辑弹框中的顺序，丢掉空占位值。 */
export declare function concreteSpecValues(values: readonly string[]): string[];
/** 规格值为 0 时入口不可点；选没选中图片、有没有图都不影响。 */
export declare function canBatchUploadSpecImages(values: readonly string[]): boolean;
/**
 * 草稿初始化：整份拷贝现有图片。
 *
 * 空占位值上的图不进右侧网格，但必须原样留在草稿里，否则确定之后会被抹掉。
 */
export declare function createSpecImageDraft(images: Readonly<Record<string, string>> | undefined): SpecImageDraft;
/** 默认选中右侧最左侧第一张，也就是第一个具体规格值。 */
export declare function initialSpecImageSelection(values: readonly string[]): string;
export declare function createSpecImageBatchSession(values: readonly string[], images: Readonly<Record<string, string>> | undefined): SpecImageBatchSession;
/** 把备选图写给当前选中的规格值（覆盖原图）。 */
export declare function assignSpecImage(draft: SpecImageDraft, value: string, url: string): SpecImageDraft;
/**
 * 清空某个规格值的图片。
 *
 * 写空串而不是删键：下游 `writeSpecFields` 用 `hasOwnProperty` 判断「这一格有没有
 * 被用户改过」，删键会让它回落到 SKU 行上的旧图，等于没清掉。
 */
export declare function clearSpecImage(draft: SpecImageDraft, value: string): SpecImageDraft;
/** 追加备选图：空 url、重复 url 一律跳过。 */
export declare function appendSpecImageCandidates(candidates: readonly string[], urls: readonly string[]): string[];
/** 左侧删除：只把图从备选池里去掉，右侧已经用上的草稿图不动。 */
export declare function removeSpecImageCandidate(candidates: readonly string[], index: number): string[];
/**
 * 左侧提示文案。
 *
 * 备选池为空时说明当前没有待选素材，有备选图时提示正在为哪个规格值选图。
 */
export declare function specImageBatchHint({ candidates, selectedValue }: {
    candidates: readonly string[];
    selectedValue: string;
}): string;
