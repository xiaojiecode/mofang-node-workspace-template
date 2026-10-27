import { type CascaderOption } from '../ui/cascader';
import type { CategoryHistoryEntry } from './category-cascader-history-storage';
import type { ProductEditorCategory, ProductEditorCategoryNode } from './types';
export type CategoryHistoryResolution = {
    status: 'valid';
    value: ProductEditorCategory;
} | {
    status: 'invalid';
};
/**
 * 展示用类目名：优先用后端下发的 labels；后端只回 categoryId 时，按 ids 的叶子
 * 节点从类目树里反查完整路径名。两者都拿不到返回空串，调用方据此回落占位符
 * 或干脆不渲染这一块（trigger 和弹层的「您当前选择」共用同一个口径）。
 */
export declare function resolveCategoryLabel(value: ProductEditorCategory, categoryTree: ProductEditorCategoryNode[]): string;
/** 弹层里点叶子时把选中项拼成展示用 labels。 */
export declare function toLeafSelection(ids: string[], selectedOptions: CascaderOption[]): ProductEditorCategory;
/**
 * 逐段命中地走一条 ids 路径：必须逐段命中（不能只按最后一个 id 反查），只认叶子
 * id 的话，前端重新同步类目后中间层换过 id，用户会被恢复到一个看起来对、实际
 * 已经作废的路径上。任一段对不上返回 null。
 */
export declare function findCategoryNodePath(categoryTree: ProductEditorCategoryNode[], ids: readonly string[]): ProductEditorCategoryNode[] | null;
/** 这条 ids 路径是否逐段命中当前树、并且落在叶子上（发布只认末级类目）。 */
export declare function isLeafCategoryPath(categoryTree: ProductEditorCategoryNode[], ids: readonly string[]): boolean;
/**
 * 校验一条历史记录的完整路径。最后一段还得仍是叶子 —— 旧叶子长出新子级后
 * 不该让人停在父节点。
 */
export declare function resolveCategoryHistoryPath(categoryTree: ProductEditorCategoryNode[], entry: CategoryHistoryEntry): ProductEditorCategoryNode[] | null;
/** 命中当前树时按当前节点的名字重算，存储里的 leafLabel 可能已经过期。 */
export declare function resolveCategoryHistorySelection(categoryTree: ProductEditorCategoryNode[], entry: CategoryHistoryEntry): CategoryHistoryResolution;
export declare function shouldRemoveInvalidCategoryHistory(category: ProductEditorCategory): boolean;
/** 写历史时取出末级类目自己的名字，历史区只显示它。 */
export declare function toCategoryHistoryEntry(path: ProductEditorCategoryNode[], ids: string[]): CategoryHistoryEntry | null;
