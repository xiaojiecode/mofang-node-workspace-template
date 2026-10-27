/** 平台标识沿用本地业务目录；原始 SVG 与来源单独保留，不参与面板打包。 */
export const platformIcons = [
    { id: 'ebay', file: 'ebay', exportName: 'ebayIcon', label: 'eBay' },
    { id: 'walmart', file: 'walmart', exportName: 'walmartIcon', label: 'Walmart' },
    { id: '1688', file: '1688', exportName: 'alibaba1688Icon', label: '1688' },
    { id: 'tiktok_shop', file: 'tiktok-shop', exportName: 'tiktokShopIcon', label: 'TikTok Shop' },
    { id: 'amazon', file: 'amazon', exportName: 'amazonIcon', label: 'Amazon' },
    { id: 'aliexpress', file: 'aliexpress', exportName: 'aliexpressIcon', label: 'AliExpress' },
    { id: 'temu', file: 'temu', exportName: 'temuIcon', label: 'Temu' },
    { id: 'shopee', file: 'shopee', exportName: 'shopeeIcon', label: 'Shopee' },
    { id: 'shein', file: 'shein', exportName: 'sheinIcon', label: 'SHEIN' },
    {
        id: 'mercado_libre',
        file: 'mercado',
        exportName: 'mercadoLibreIcon',
        label: 'Mercado Libre',
    },
    { id: 'kwai_shop', file: 'kwai-shop', exportName: 'kwaiShopIcon', label: 'Kwai Shop' },
    { id: 'americanas', file: 'americanas', exportName: 'americanasIcon', label: 'Americanas' },
    { id: 'magalu', file: 'magalu', exportName: 'magaluIcon', label: 'Magalu' },
    { id: 'lazada', file: 'lazada', exportName: 'lazadaIcon', label: 'Lazada' },
    { id: 'ozon', file: 'ozon', exportName: 'ozonIcon', label: 'Ozon' },
]

/** 保守压缩保留 viewBox、品牌颜色语义和原始 ID，不触碰 ID 引用关系。 */
export const svgoConfig = {
    multipass: true,
    floatPrecision: 4,
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: { cleanupIds: false, cleanupNumericValues: false, mergePaths: false },
            },
        },
    ],
}
