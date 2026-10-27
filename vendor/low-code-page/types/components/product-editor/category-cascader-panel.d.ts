import { type CascaderOption } from '../ui/cascader';
import { type CategoryHistoryEntry } from './category-cascader-history-storage';
import { type CategorySearchResult } from './category-cascader-search';
import type { ProductEditorCategory, ProductEditorCategoryNode } from './types';
/**
 * 类目下拉的弹层内容。
 *
 * 拆成受控展示组件：`query` 由外层持有，这样单测能直接按「已输入关键字」渲染，
 * 不用为了点一下输入框引入 DOM 测试环境。
 */
export declare function CategoryCascaderPanel({ value, categoryTree, query, onQueryChange, history, historyFeedback, onSelectLeaf, onSelectSearchResult, onSelectHistory }: {
    value: ProductEditorCategory;
    categoryTree: ProductEditorCategoryNode[];
    query: string;
    onQueryChange: (query: string) => void;
    history: CategoryHistoryEntry[];
    historyFeedback: string;
    onSelectLeaf: (ids: string[], selectedOptions: CascaderOption[]) => void;
    onSelectSearchResult: (result: CategorySearchResult) => void;
    onSelectHistory: (entry: CategoryHistoryEntry) => void;
}): import("react/jsx-runtime").JSX.Element;
