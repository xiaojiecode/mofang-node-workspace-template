import type { ImagePickerRemotePage, ImagePickerRemoteQuery, ImagePickerRemoteSource } from './image-picker';
/** 真接口就绪前的假数据：dev 与 Storybook 默认走这里，`.env.dev` 可关掉。 */
export declare function isImagePickerMockEnabled(): boolean;
export declare function loadMockImagePickerItems(source: ImagePickerRemoteSource, query: ImagePickerRemoteQuery, options?: {
    signal?: AbortSignal;
}): Promise<ImagePickerRemotePage>;
