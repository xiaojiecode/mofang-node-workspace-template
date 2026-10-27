import type { ImagePickerRemoteItem, ImagePickerRemoteSource } from '../../api/image-picker';
export declare function ImagePickerRemoteTab({ source, items, loading, loadingMore, hasMore, error, selectedIds, searchInput, onSearchInputChange, onSearch, onClearSearch, onToggle, onSelectAll, onClear, onLoadMore, onRetry }: {
    source: ImagePickerRemoteSource;
    items: ImagePickerRemoteItem[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    error?: string;
    selectedIds: string[];
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onSearch: () => void;
    onClearSearch: () => void;
    onToggle: (item: ImagePickerRemoteItem) => void;
    onSelectAll: () => void;
    onClear: () => void;
    onLoadMore: () => void;
    onRetry: () => void;
}): import("react/jsx-runtime").JSX.Element;
