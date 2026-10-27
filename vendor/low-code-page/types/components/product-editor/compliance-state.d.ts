import type { ProductEditorValue } from './types';
/**
 * 按用户实际修改的字段更新合规状态。
 *
 * 保留历史证据用于复核，但内容变更后必须标记过期，不能把旧结论当作新内容已检测。
 */
export declare function invalidateComplianceForPatch(base: ProductEditorValue, patch: Partial<ProductEditorValue>): Partial<ProductEditorValue>;
