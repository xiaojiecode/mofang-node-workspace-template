import type { SkuSpecAxis } from './product-editor-sku-specs';
/** 补规格轴名时可参考的「产品属性」：属性名 + 取值。 */
export type SkuSpecAxisAttributeHint = {
    name: string;
    /**
     * 属性值。产品属性面板把多值按逗号拼在一格里（`黑色,米色,卡其`），
     * 采集/后端也可能拆成多行同名属性，两种口径都要认。
     */
    value: string;
};
/**
 * 把「一个属性值格」拆成多值：产品属性面板把多值按分隔符拼在一格里
 *（`黑色,米色,卡其`），校验与对齐都要按拆开后的单个值判定。
 */
export declare function splitAttributeValues(value: string): string[];
/**
 * 用草稿「产品属性」给**没有名字**的规格轴补名，打破「先有名字才能对齐」的死锁。
 *
 * 采集源（如 1688）的 `skuName` 只有值（`米色&gt;均码`），段里没有轴名，按位置拆轴
 * 只能留空；但草稿的产品属性里通常有能对上号的属性（`颜色 = 黑色,米色,卡其,深咖,浅咖`），
 * 可以按取值集合反查轴名。只做可预测的匹配：
 *
 * - 只补空名轴。已有名字的轴一律原样返回，绝不覆盖（含类目 schema 对齐过的
 *   `attrId`/`canonicalKey`）。
 * - 先要求「取值集合完全相等」，退一步才允许「轴的值全部落在属性值集合里」。
 * - 命中必须唯一：多条属性同时匹配、或两条轴抢同一个属性名，都保持留空，不猜。
 * - 已经有名字的轴占用的属性名，不再分配给别的轴。
 *
 * 只补名字，不写 `attrId`/`canonicalKey`：产品属性的 id 与类目销售属性的 id 不是
 * 一套编码，照着填会让推送时按错误的 id 去对齐。
 */
export declare function inferSkuSpecAxisNames(axes: readonly SkuSpecAxis[], attributes: readonly SkuSpecAxisAttributeHint[]): SkuSpecAxis[];
