import type { ProductEditorSku } from './types';
export declare const SKU_SPEC_VALUE_MAX_LENGTH = 50;
export declare const SKU_SPEC_AXIS_MAX_COUNT = 3;
export type SkuSpecAxis = {
    /** 展示名。从类目销售属性里选时就是类目属性名。 */
    name: string;
    /** 绑定的类目销售属性 id。从类目 schema 选择时才有；推送时后端据此对齐官方 id。 */
    attrId?: string;
    canonicalKey?: string;
    values: string[];
    /**
     * 值名 → 类目选项的 valueId。仅当该值是从类目选项里选出来的才有。
     *
     * `values` 保持字符串数组而不是对象数组：它同时是 `images` 的键、`skuName` 与
     * `attrs` 的来源，加一个平行映射改动面最小。
     */
    valueIds?: Record<string, string>;
    images: Record<string, string>;
};
export declare function createEmptySkuSpecAxis(): SkuSpecAxis;
export declare function ensureSkuSpecAxes(axes: SkuSpecAxis[]): SkuSpecAxis[];
export declare function parseSkuNamePairs(skuName: string): {
    name: string;
    value: string;
}[];
/**
 * 把一行 SKU 归一成「单品」形态：清掉全部规格痕迹。
 *
 * 只清轴（skuSpecAxes）是不够的 —— 剩下的那一行 SKU 身上还带着 attrs / specValues /
 * draftSkuAttributes（推送时经投影变成 sales_attributes，平台上依旧是一个「有规格」的
 * 商品）和 imageUrl（变成 sku_img，单品不该有规格图）。SKU 名同理：留着
 * "Color:2;ddd:A" 这种拼接名，切回多规格时还会被 getSkuPairs 之类重新读出来。
 *
 * 业务字段（价格、库存、平台 SKU 编码、本地运营字段）原样保留。
 */
export declare function toSingleSku(sku: ProductEditorSku): ProductEditorSku;
export declare const DEFAULT_SINGLE_SKU_NAME = "\u9ED8\u8BA4\u89C4\u683C";
export declare function parseSkuSpecAxes(skus: ProductEditorSku[]): SkuSpecAxis[];
/** 把 `值1>值2`（含 `&gt;` HTML 转义）拆成值数组；不满足 `>` 分隔时返回空。 */
export declare function parsePositionalSkuValues(skuName: string): string[];
/** 显式值改名。按「轴名 + 旧值」定位，不按下标，轴换序也安全。 */
export type SkuSpecValueRename = {
    axis: string;
    from: string;
    to: string;
};
export type SkuRebuildOptions = {
    /**
     * 上一次参与重建的轴，必须是**归一化后的那一份**（与 `originalSkus` 同源）。
     * `null` 表示没有增量信息，退回「按轴生成满组合」的旧路径。
     */
    previousAxes: SkuSpecAxis[] | null;
    /**
     * 由 `setValue` 声明「这是改名，不是删掉再加一个」。
     *
     * 不是优化项，是承重墙：值输入框每敲一个字符就提交一次，`红→深红` 会跑两趟
     * `红→深`、`深→深红`。若靠集合差推断，「红被删」会先丢掉那一行，随后「深是新增」
     * 又没有行可供克隆，价格和平台 SKU 一起不可逆丢失。
     */
    renamedValues?: readonly SkuSpecValueRename[];
};
export declare function rebuildSkusFromSpecAxes(axes: SkuSpecAxis[], originalSkus: ProductEditorSku[], options: SkuRebuildOptions): ProductEditorSku[];
/**
 * 旧路径：按轴生成满组合，再把组合匹配回旧行继承经营字段。
 *
 * 只在没有增量信息（首次生成、`previousAxes` 为 null）或轴与行不同源时使用；
 * 满组合行集上必须与新路径逐行一致，由测试钉住。
 */
export declare function buildCombinations(axes: SkuSpecAxis[], originalSkus: ProductEditorSku[]): ProductEditorSku[];
/** Rename existing SKU specs without changing rows; previousAxes pairs translated values by index. */
export declare function renameSkusFromSpecAxes(axes: SkuSpecAxis[], originalSkus: ProductEditorSku[], previousAxes?: SkuSpecAxis[]): ProductEditorSku[];
/**
 * 删除 SKU 行之后裁剪规格：某个选项值在剩余行里一次都没出现，就从对应规格里移除，
 * 连同它的规格图与类目选项 id。
 *
 * 只裁剪**非空值**——`addValue` 会先推入一个空占位值让用户输入，空串永远不可能出现在
 * 行里，按「没有行」的口径会被误裁，用户正在输入的那一格就没了。
 *
 * 无名轴不裁剪：采集箱的 `值1>值2` 轴没有轴名，行的取值归不到某一轴上，宁可不动。
 * 也不做「值被裁光就把整条轴删掉」——删轴是 `removeAxis` 的职责，不是删除行的副作用；
 * 保留轴名正是「有规格名、没有规格值」这个状态。
 */
export declare function pruneSkuSpecAxes(axes: readonly SkuSpecAxis[], rows: readonly ProductEditorSku[]): {
    axes: SkuSpecAxis[];
    removedValues: Array<{
        axis: string;
        value: string;
    }>;
};
export type SkuSpecNameOption = {
    name: string;
    attrId?: string;
    canonicalKey?: string;
};
/**
 * 规格名可选项 = 类目销售属性 + 已用过的名字。
 *
 * 带上 attrId/canonicalKey 是必要的：轴名能对齐到类目 variant 属性（或命中内置别名）时，
 * 后端会用类目给的属性 id/值 id 发出去；对不上的自由文本轴则按 TikTok 的**自定义销售属性**
 * 透传（只有 name/value_name，id 由平台生成）。两条路都能上架，但自由文本轴会在平台上真的
 * 建出一个自定义属性，所以列表里仍然优先给类目属性。
 */
export declare function resolveSkuSpecNameOptions(axes: SkuSpecAxis[], schemaOptions: SkuSpecNameOption[]): SkuSpecNameOption[];
export declare function clampSkuSpecValue(value: string): string;
/**
 * 一行的稳定标识：用于删除选中集合与规格轴裁剪的对账。
 *
 * 用 `||` 而不是 `??`：草稿里的新行 `id` 是空串（不是 null），用 `??` 会让所有新行
 * 拿到同一个标识，选中和删除都会串行。
 */
export declare function skuRowIdentity(sku: ProductEditorSku): string;
export declare function moveSkuSpecValue(axis: SkuSpecAxis, valueIndex: number, targetIndex: number): SkuSpecAxis;
export declare function moveSkuSpecAxis(axes: SkuSpecAxis[], index: number, direction: -1 | 1): {
    axes: SkuSpecAxis[];
    clearsImages: boolean;
};
export declare function findDuplicateSpecNames(axes: SkuSpecAxis[]): Set<string>;
export declare function findDuplicateSpecValues(values: string[]): Set<string>;
/**
 * 取一个 SKU 的规格键值对；口径与编辑器展示完全一致：
 * specValues → attrs → draftSkuAttributes → 从 skuName（`名称:值`）解析。
 * 落库时据此重建 draftSkuAttributes，避免「界面有规格、库里没属性」。
 */
export declare function getSkuSpecPairs(sku: ProductEditorSku): {
    name: string;
    value: string;
}[];
export declare function normalizeSkuSpecAxes(axes: SkuSpecAxis[]): {
    images: Record<string, string>;
    valueIds?: Record<string, string> | undefined;
    values: string[];
    canonicalKey?: string | undefined;
    attrId?: string | undefined;
    name: string;
}[];
