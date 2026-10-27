export type ImagePickerRemoteSource = 'library' | 'collection';
export type ImagePickerImageType = 'main' | 'sku';
export type ImagePickerRemoteItem = {
    id: string;
    source: ImagePickerRemoteSource;
    url: string;
    name: string;
    subtitle: string;
    badge?: string;
    dimensions?: string;
    imageType?: ImagePickerImageType;
    objectKey?: string;
    storageKey?: string;
    productId?: string;
    skuCode?: string;
};
export type ImagePickerRemoteQuery = {
    keyword?: string;
    page?: number;
    pageSize?: number;
    /** 仅商品库：按平台筛选，如 `tiktok` / `shopee`。 */
    platform?: string;
    /** 仅商品库：按店铺 ID 筛选；会与服务端店铺权限取交集。 */
    shopId?: string;
    /** 仅采集箱：按来源平台筛选，如 `1688` / `tiktok`。 */
    source?: string;
};
/** 分页单位是商品：一页图片数由这批商品各带几张决定，所以只有 `totalPages` 可靠。 */
export type ImagePickerRemotePage = {
    items: ImagePickerRemoteItem[];
    page: number;
    totalPages: number;
};
/** 契约见 docs/图片选择-商品库与采集箱图片对接说明.md。 */
export declare const IMAGE_PICKER_PAGE_SIZE = 60;
export declare function loadImagePickerItems(source: ImagePickerRemoteSource, query?: ImagePickerRemoteQuery, options?: {
    signal?: AbortSignal;
}): Promise<ImagePickerRemotePage>;
