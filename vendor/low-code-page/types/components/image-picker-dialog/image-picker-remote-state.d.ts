import type { ImagePickerRemoteItem, ImagePickerRemotePage, ImagePickerRemoteSource } from '../../api/image-picker';
export type RemoteStatus = 'idle' | 'loading' | 'ready' | 'error';
export type RemoteState = {
    status: RemoteStatus;
    items: ImagePickerRemoteItem[];
    visibleCount: number;
    page: number;
    totalPages: number;
    error?: string;
};
export type RemoteStates = Record<ImagePickerRemoteSource, RemoteState>;
type ImagePickerRemoteListState = Pick<RemoteState, 'items' | 'visibleCount' | 'page' | 'totalPages'>;
export declare const IDLE_REMOTE_STATE: RemoteState;
export declare const EMPTY_REMOTE_STATES: RemoteStates;
export declare function getNextImagePickerVisibleCount(current: number, total: number): number;
export declare function getImagePickerListView(state: ImagePickerRemoteListState): {
    visibleItems: ImagePickerRemoteItem[];
    hasMore: boolean;
};
export declare function startImagePickerRemoteLoad(states: RemoteStates, target: ImagePickerRemoteSource, append: boolean): RemoteStates;
export declare function finishImagePickerRemoteLoad(states: RemoteStates, target: ImagePickerRemoteSource, result: ImagePickerRemotePage, append: boolean): RemoteStates;
export declare function failImagePickerRemoteLoad(states: RemoteStates, target: ImagePickerRemoteSource, error: unknown): RemoteStates;
export declare function revealNextImagePickerBatch(states: RemoteStates, target: ImagePickerRemoteSource): RemoteStates;
export {};
