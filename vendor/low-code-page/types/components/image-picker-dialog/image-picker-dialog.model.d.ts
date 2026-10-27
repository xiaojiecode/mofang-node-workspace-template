import type { ImagePickerRemoteItem } from '../../api/image-picker';
import type { ImagePickerResult, ImagePickerSource, ImagePickerUploadResult } from './image-picker-dialog.types';
export type LocalUploadItem = {
    id: string;
    file: File;
    previewUrl: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
    result?: ImagePickerUploadResult;
};
export declare function formatFileSize(size: number): string;
export declare function fileKey(file: File): string;
export declare function validateFile(file: File, acceptedTypes: string[], maxFileSize: number): string | null;
export type RemoteSelectionChange = {
    /** 选中的是图片本身，不是 id：翻页/改搜索词后已加载列表里不再有它，结果也要能带出去。 */
    selectedItems: ImagePickerRemoteItem[];
    limitReached: boolean;
};
export declare function toggleRemoteItem(selectedItems: readonly ImagePickerRemoteItem[], item: ImagePickerRemoteItem, maxCount: number): RemoteSelectionChange;
export declare function selectRemoteItems(selectedItems: readonly ImagePickerRemoteItem[], visibleItems: readonly ImagePickerRemoteItem[], maxCount: number): RemoteSelectionChange;
export declare function createRemotePickerResult(source: Exclude<ImagePickerSource, 'local'>, selectedItems: readonly ImagePickerRemoteItem[]): ImagePickerResult;
