import type { ProductEditorCategoryNode } from './types';
export type CategorySearchResult = {
    ids: string[];
    labels: string;
};
/** 搜索结果上限：类目树动辄上千叶子，全量渲染会把弹层卡住。 */
export declare const CATEGORY_SEARCH_LIMIT = 50;
/**
 * 按类目名称搜叶子。
 *
 * 只比对叶子自身的名字，不比对父级路径：搜到父级名（比如「服饰」）时没有叶子
 * 命中，弹层会走空态并保留层级列表，让用户顺着往下点，而不是把一整棵子树
 * 当成结果倒出来。结果按树的顺序返回，取前 `limit` 条。
 */
export declare function searchCategoryLeaves(nodes: ProductEditorCategoryNode[], query: string, limit?: number): CategorySearchResult[];
