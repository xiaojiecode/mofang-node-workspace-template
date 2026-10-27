import { type ImagePickerRemoteItem, type ImagePickerRemoteSource } from '../../api/image-picker';
import type { ImagePickerSource } from './image-picker-dialog.types';
import { type RemoteState } from './image-picker-remote-state';
export declare function useImagePickerRemote({ activeTab, maxCount }: {
    activeTab: ImagePickerSource;
    maxCount: number;
}): {
    loadFirstPage: (target: ImagePickerRemoteSource) => void;
    source: "collection" | "library" | null;
    state: RemoteState;
    visibleItems: ImagePickerRemoteItem[];
    selectedItems: ImagePickerRemoteItem[];
    selectedIds: string[];
    hasMore: boolean;
    searchInput: string;
    setSearchInput: import("react").Dispatch<import("react").SetStateAction<string>>;
    search: () => void;
    clearSearch: () => void;
    toggleItem: (item: ImagePickerRemoteItem) => void;
    selectAll: () => void;
    clearSelection: () => void;
    resetInteraction: () => void;
    retry: () => void;
    loadMore: () => void;
};
