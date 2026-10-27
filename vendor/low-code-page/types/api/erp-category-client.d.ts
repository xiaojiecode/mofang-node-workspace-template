import type { PlatformCategoriesResult, PlatformCategoryQuery, ShopCategoriesResult, TikTokCategorySyncPayload, TikTokCategorySyncResult } from './product-library';
export declare const erpCategoryClient: {
    listPlatformCategories(payload: PlatformCategoryQuery): Promise<PlatformCategoriesResult>;
    syncPlatformCategories(payload: PlatformCategoryQuery): Promise<TikTokCategorySyncResult>;
    listShopCategories(payload: {
        shopId: string;
        platform?: string;
        refresh?: boolean;
    }): Promise<ShopCategoriesResult>;
    syncTikTokCategories: (payload: TikTokCategorySyncPayload) => Promise<TikTokCategorySyncResult>;
};
