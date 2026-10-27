import type { ProductEditorValue } from './types';
/**
 * 货币被平台商品锁定时，把它从 patch 里剔除。
 *
 * 下拉框在锁定时已经禁用了，但真正的收口是 `updateDraft` —— 所有改写（表单、AI 建议、
 * 类目 schema 合并）都经过它。在这里兜底，才能把"固定"做成不变量，而不是依赖每个
 * 调用方自觉不去碰 currency。
 */
export declare function stripLockedCurrency(base: Pick<ProductEditorValue, 'currencyLocked'>, patch: Partial<ProductEditorValue>): Partial<ProductEditorValue>;
