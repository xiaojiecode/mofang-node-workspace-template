/**
 * 图片 AI 素材的 ref 编码。
 *
 * 商品图库的 ref 是图自己的 id/objectKey/url（见 `productImageRef`），不用编码；
 * 规格值图与尺码表图没有这种天然身份，得在这里发一个**自描述**的 ref，让结果回来
 * 时认得出该往哪写：
 *
 * - 规格值图：`spec:{轴下标}:{值下标}:{值名}` —— 下标是锚，值名是**发起任务那一刻的
 *   快照**。下标锚定是为了让值改名（`copy_spec` / 规格润色）之后仍能贴到新名字上；
 *   值名快照则是为了认出「这一格已经换人了」—— 某选项值的 SKU 行被删光时会自动摘值，
 *   后面的值整体前移，只认下标就会把图贴到隔壁值上，且没人发现（见 `image-task-results.ts`）。
 *   老 ref 只有两段（没有值名），按纯下标处理。
 * - 尺码表图：`size-chart` 字面量 —— 只有一张，不需要下标。
 *
 * 与「一键优化」那条链路的区别：那边的 ref 是裸的 `{轴下标}:{值下标}`，靠产物上的
 * `spec: { axisIndex, valueIndex }` 标记分流；独立图片 AI 的产物没有这个标记，所以
 * 身份必须写在 ref 里。
 */
export declare const SPEC_IMAGE_REF_PREFIX = "spec:";
export declare const SIZE_CHART_IMAGE_REF = "size-chart";
export type SpecImagePosition = {
    axisIndex: number;
    valueIndex: number;
    /** 发起任务那一刻这个位置上的值名；老 ref 没有这一段。 */
    valueName?: string;
};
export declare function specImageRef(axisIndex: number, valueIndex: number, valueName?: string): string;
/** 认得出来返回位置，认不出返回 null（商品图、尺码表、脏数据都走这条）。 */
export declare function parseSpecImageRef(ref: string): SpecImagePosition | null;
