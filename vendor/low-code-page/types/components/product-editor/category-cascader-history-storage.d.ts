export type CategoryHistoryEntry = {
    ids: string[];
    /**
     * 只存末级类目自己的名字，历史区就显示它。
     *
     * 不存 `' / '` 连起来的完整路径：历史列表是按条扫的，长路径在这里读不出信息量，
     * 完整路径在点开时按当前树重算即可。改用独立字段名而不是复用 `labels`，
     * 是因为 `ProductEditorCategory.labels` 的语义是完整路径，同名不同义会看错。
     */
    leafLabel: string;
};
type CategoryHistoryReader = Pick<Storage, 'getItem'>;
type CategoryHistoryStorage = Pick<Storage, 'getItem' | 'setItem'>;
/** v2：条目形状从「完整路径 labels」换成「末级 leafLabel」。 */
export declare const CATEGORY_HISTORY_STORAGE_KEY = "product-editor.category-history.v2";
export declare const CATEGORY_HISTORY_LIMIT = 6;
/**
 * 读取历史快照。
 *
 * key 缺失、JSON 坏、根不是数组、任一元素 shape 不对、getItem 抛错，
 * 一律当「没有历史」返回空数组 —— 类目下拉不该因为一段脏 localStorage 打不开。
 */
export declare function readCategoryHistory(storage?: CategoryHistoryReader): CategoryHistoryEntry[];
/** 写入并返回写入后的数组；写失败返回写前的数组，不抛给 UI。 */
export declare function writeCategoryHistory(entry: CategoryHistoryEntry, storage?: CategoryHistoryStorage): CategoryHistoryEntry[];
/** 按完整 ids 精确删除一条；只删命中项，不动其余记录。 */
export declare function removeCategoryHistory(ids: string[], storage?: CategoryHistoryStorage): CategoryHistoryEntry[];
export {};
