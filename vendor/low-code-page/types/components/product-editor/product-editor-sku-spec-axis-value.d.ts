import type { ProductEditorSku } from './types';
/**
 * 一行在某个规格轴上的取值。**展示与落库共用这一份口径**：
 *
 * 1. 规格属性对象（`specValues` / `attrs`）里的轴名；
 * 2. `draftSkuAttributes` 或 `名称:值` 的 skuName（`getSkuSpecPairs` 的命名匹配）；
 * 3. 行上规格属性按轴位置对位（轴名对不上时的旧口径，别让已有草稿从「有值」退回「—」）；
 * 4. skuName 里的 `值1>值2` 段（含 `&gt;`）——按段位置取第 `index` 段。
 *
 * 第 4 档不能省：采集源（如 1688）的 skuName 只有值、没有轴名，草稿里也没有属性数组，
 * 只认冒号会让这些行取到空值 —— 表格的规格列渲染成「—」、保存写出空属性数组，多 SKU
 * 刊登被平台以 `requires at least one sales attribute per SKU` 拦下。
 *
 * 第 4 档要额外确认「这个值属于这一根轴」：轴与段按下标对位的前提是两者同序，轴被换序、
 * 或轴上的值被改名而行的 skuName 还停在旧值时，按下标取会串到别的轴（把颜色值写进尺码）。
 * 这类输入宁可回到「—」让用户看见，也不要静默落一个和轴对不上的销售属性。轴上没有
 * 取值集合时（空轴、无名轴）无从校验，按位置取即可。
 */
export declare function getSkuSpecAxisValue(sku: ProductEditorSku, axis: {
    name: string;
    values?: readonly string[];
}, index: number): string;
