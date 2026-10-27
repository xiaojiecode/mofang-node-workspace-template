import type { ImagePickerRemoteItem, ImagePickerRemoteSource } from '../../api/image-picker';
export declare function ImagePickerRemoteGrid({ source, items, loading, loadingMore, hasMore, error, selectedIds, onToggle, onLoadMore, onRetry }: {
    source: ImagePickerRemoteSource;
    items: ImagePickerRemoteItem[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    error?: string;
    selectedIds: string[];
    onToggle: (item: ImagePickerRemoteItem) => void;
    onLoadMore: () => void;
    onRetry: () => void;
}): import("react/jsx-runtime").JSX.Element;
