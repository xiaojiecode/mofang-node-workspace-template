export type ProductDetailScalar = string | number | null;
export type ProductDetailField = {
    id: string;
    label: string;
    value: ProductDetailScalar;
};
export type ProductDetailImage = {
    id: string;
    url: string;
    alt?: string;
    label?: string;
};
export type ProductDetailVideo = {
    id: string;
    url: string;
    name?: string;
    posterUrl?: string;
};
export type ProductDetailMoney = {
    amount: ProductDetailScalar;
    currency?: string;
};
export type ProductDetailMeasurement = {
    value: ProductDetailScalar;
    unit?: string;
};
export type ProductDetailDimensions = {
    length: ProductDetailScalar;
    width: ProductDetailScalar;
    height: ProductDetailScalar;
    unit?: string;
};
export type ProductDetailSales = {
    specificationType?: string;
    currency?: string;
    price?: ProductDetailMoney;
    inventory?: ProductDetailScalar;
    weight?: ProductDetailMeasurement;
    dimensions?: ProductDetailDimensions;
    specifications: ProductDetailField[];
};
export type ProductDetailSkuRow = {
    id: string;
    specification: string;
    fields: ProductDetailField[];
    price?: ProductDetailMoney;
    inventory?: ProductDetailScalar;
    weight?: ProductDetailMeasurement;
};
export type ProductDetailSkuImage = {
    id: string;
    label?: string;
    image: ProductDetailImage;
};
export type ProductDetailLogistics = {
    note?: string;
    packageWeight?: ProductDetailMeasurement;
    packageDimensions?: ProductDetailDimensions;
    codEnabled?: boolean;
    shippingMethod?: 'platform-default' | 'seller-custom';
};
export type ProductDetailData = {
    id: string;
    title: string;
    source?: string;
    sourceUrl?: string;
    sourceItemId?: string;
    description?: string;
    descriptionImages?: ProductDetailImage[];
    categoryPath?: string;
    brand?: string;
    attributes: ProductDetailField[];
    sales: ProductDetailSales;
    skuRows: ProductDetailSkuRow[];
    productImages: ProductDetailImage[];
    skuImages: ProductDetailSkuImage[];
    sizeChartImages: ProductDetailImage[];
    videos: ProductDetailVideo[];
    logistics: ProductDetailLogistics;
};
export type ProductDetailDialogProps = {
    open: boolean;
    data: ProductDetailData | null;
    loading?: boolean;
    errorMessage?: string;
    onOpenChange: (open: boolean) => void;
    onRetry?: () => void;
};
export type ProductDetailViewState = 'loading' | 'error' | 'empty' | 'populated';
export declare function resolveProductDetailViewState({ loading, errorMessage, data }: Pick<ProductDetailDialogProps, 'loading' | 'errorMessage' | 'data'>): ProductDetailViewState;
export declare function getAdjacentImageId(images: ProductDetailImage[], activeId: string, direction: -1 | 1): string;
export declare function formatDisplayValue(value: ProductDetailScalar | undefined): string;
export declare function formatMoney(value?: ProductDetailMoney): string;
export declare function formatMeasurement(value?: ProductDetailMeasurement): string;
export declare function formatDimensions(value?: ProductDetailDimensions): string;
export declare function formatCodEnabled(value?: boolean): "--" | "支持" | "不支持";
export declare function formatShippingMethod(value?: ProductDetailLogistics['shippingMethod']): "--" | "卖家自定义" | "平台默认";
