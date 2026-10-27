import type { ShopProduct, ShopProductSummary } from './erp-v1-types';
import type { PlatformProductDetail, PlatformProductListItem, PlatformProductListParams, PlatformProductStatus, PlatformProductStatusBatchResult, UpdatePlatformProductPayload } from './product-library';
export declare const shopProductSummaryView: (summary: ShopProductSummary) => PlatformProductListItem;
export declare function shopProductView(product: ShopProduct): PlatformProductDetail;
export declare const erpShopProductClient: {
    listPlatformProducts(params?: PlatformProductListParams): Promise<{
        list: PlatformProductListItem[];
        pagination: {
            totalPages: number;
            page: number;
            pageSize: number;
            total: number;
        };
        statusCounts: import("./erp-v1-model-types").ShopProductStatusCounts;
    }>;
    getPlatformProduct(productId: string): Promise<PlatformProductDetail>;
    updatePlatformProduct(productId: string, payload: UpdatePlatformProductPayload): Promise<PlatformProductDetail>;
    deletePlatformProduct: (productId: string) => Promise<import("./erp-v1-contract-types").DeleteShopProductResp>;
    pushPlatformProduct(productId: string, options?: Record<string, string | number | boolean>): Promise<import("./product-library").PublishTaskListItem>;
    pullPlatformProduct(productId: string): Promise<PlatformProductDetail>;
    setPlatformProductStatus(productId: string, status: PlatformProductStatus): Promise<PlatformProductDetail>;
    setPlatformProductsStatus(productIds: string[], status: PlatformProductStatus): Promise<PlatformProductStatusBatchResult>;
    softDeletePlatformProducts: (productIds: string[]) => Promise<import("./erp-v1-contract-types").BatchSoftDeleteShopProductsResp>;
};
