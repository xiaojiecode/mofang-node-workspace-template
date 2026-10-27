import type { ProductEditorListItem } from './types';
type ProductEditorProductListProps = {
    products: readonly ProductEditorListItem[];
    totalCount?: number;
    selectedId?: string;
    visible: boolean;
    onSelect: (productId: string) => void;
    onDelete?: (productId: string) => void;
};
/**
 * 编辑页弹窗左侧的「同页商品列表」。
 * 入口页面（pageType）声明不展示列表时整体隐藏，由 visible 控制。
 */
export declare function ProductEditorProductList({ products, totalCount, selectedId, visible, onSelect, onDelete }: ProductEditorProductListProps): import("react/jsx-runtime").JSX.Element;
export {};
