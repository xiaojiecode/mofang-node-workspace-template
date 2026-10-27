import type { DraftSKUAttribute } from '../../api/product-library';
/** 一条规格「轴名 → 取值」，顺序即轴顺序。 */
export type SkuSpecAttributePair = {
    name: string;
    value: string;
};
/**
 * 把来源行的销售属性（`draftSkuAttributes`）改写到重建后的轴上。
 *
 * 规格名与规格值会变（`Colour`→`Color`、`红`→`深红`），属性名与值名必须跟着走：
 * 保存时 `toDraftSkuAttributes` 是「按属性名从旧值里复用 id」，名字不改就等于把
 * 平台的 attributeId / valueId 全部丢掉，草稿会变成「界面有规格、库里没属性」。
 *
 * 匹配先按属性名（同名轴唯一），对不上的再按段位置兜底：采集源的无名
 * `值1>值2` 行本来就没有轴名，只能按位置对位。属性比轴多的（例如残留的旧轴）
 * 原样保留，不猜也不删。
 */
export declare function alignSkuAttributes(attributes: readonly DraftSKUAttribute[] | undefined, pairs: readonly SkuSpecAttributePair[]): DraftSKUAttribute[] | undefined;
