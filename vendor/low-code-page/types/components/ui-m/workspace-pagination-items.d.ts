/**
 * 分页页码窗口：当前页左右各 2 个 + 首尾各 1 个。
 *
 * 原型第 13 屏的选品列表分页是 `1 … 4 5 6 7 8 … 50`（当前页第 6 页 / 共 50 页），
 * 与原型 `WorkflowCollectionResults.vue` 的 `paginationItems` 同一套算法。
 * 左右只留 1 个时中间只出 3 个页码，比设计稿少两格，看着像「页码没显示全」；
 * 窗口固定 5 格，翻页时宽度也不会忽大忽小。
 */
export declare function pageItems(page: number, pageCount: number): (number | 'ellipsis')[];
