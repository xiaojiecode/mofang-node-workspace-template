/**
 * 预置目录快照，站点关系取自 mf-client/src/lib/region/platform-sites.ts，
 * 地区币种取自同目录 currency.ts；CN/CNY 另核对 site-currency.ts。
 * 这是本地作者预置数据，不代表在线可用性、授权、结算币种或实时平台覆盖。
 * 有图标但未核实站点的平台只列身份，关系留空；未知关系不推断美元。
 */
export type Currency = Readonly<{ code: string; symbol: string; name: string }>
export type CountryRegion = Readonly<{ code: string; name: string; currencyCode: string }>
export type Platform = Readonly<{ id: string; name: string; iconKey?: string }>
export type PlatformSite = Readonly<{
    platformId: string
    regionCode: string
    currencyCode: string
}>

export const currencies: readonly Currency[] = [
    {
        code: 'AED',
        symbol: 'AED',
        name: '阿联酋迪拉姆',
    },
    {
        code: 'ARS',
        symbol: 'AR$',
        name: '阿根廷比索',
    },
    {
        code: 'AUD',
        symbol: 'A$',
        name: '澳大利亚元',
    },
    {
        code: 'BRL',
        symbol: 'R$',
        name: '巴西雷亚尔',
    },
    {
        code: 'BYN',
        symbol: 'Br',
        name: '白俄罗斯卢布',
    },
    {
        code: 'CAD',
        symbol: 'C$',
        name: '加拿大元',
    },
    {
        code: 'CLP',
        symbol: 'CLP$',
        name: '智利比索',
    },
    {
        code: 'CNY',
        symbol: '¥',
        name: '人民币',
    },
    {
        code: 'COP',
        symbol: 'COP$',
        name: '哥伦比亚比索',
    },
    {
        code: 'EGP',
        symbol: 'E£',
        name: '埃及镑',
    },
    {
        code: 'EUR',
        symbol: '€',
        name: '欧元',
    },
    {
        code: 'GBP',
        symbol: '£',
        name: '英镑',
    },
    {
        code: 'HKD',
        symbol: 'HK$',
        name: '港元',
    },
    {
        code: 'IDR',
        symbol: 'Rp',
        name: '印度尼西亚卢比',
    },
    {
        code: 'INR',
        symbol: '₹',
        name: '印度卢比',
    },
    {
        code: 'JPY',
        symbol: '¥',
        name: '日元',
    },
    {
        code: 'KRW',
        symbol: '₩',
        name: '韩元',
    },
    {
        code: 'KZT',
        symbol: '₸',
        name: '哈萨克斯坦坚戈',
    },
    {
        code: 'MXN',
        symbol: 'MX$',
        name: '墨西哥比索',
    },
    {
        code: 'MYR',
        symbol: 'RM',
        name: '马来西亚林吉特',
    },
    {
        code: 'PHP',
        symbol: '₱',
        name: '菲律宾比索',
    },
    {
        code: 'RUB',
        symbol: '₽',
        name: '俄罗斯卢布',
    },
    {
        code: 'SAR',
        symbol: 'SR',
        name: '沙特里亚尔',
    },
    {
        code: 'SGD',
        symbol: 'S$',
        name: '新加坡元',
    },
    {
        code: 'THB',
        symbol: '฿',
        name: '泰铢',
    },
    {
        code: 'TWD',
        symbol: 'NT$',
        name: '新台币',
    },
    {
        code: 'USD',
        symbol: '$',
        name: '美元',
    },
    {
        code: 'VND',
        symbol: '₫',
        name: '越南盾',
    },
]

export const countryRegions: readonly CountryRegion[] = [
    {
        code: 'US',
        name: '美国',
        currencyCode: 'USD',
    },
    {
        code: 'CA',
        name: '加拿大',
        currencyCode: 'CAD',
    },
    {
        code: 'MX',
        name: '墨西哥',
        currencyCode: 'MXN',
    },
    {
        code: 'BR',
        name: '巴西',
        currencyCode: 'BRL',
    },
    {
        code: 'GB',
        name: '英国',
        currencyCode: 'GBP',
    },
    {
        code: 'DE',
        name: '德国',
        currencyCode: 'EUR',
    },
    {
        code: 'FR',
        name: '法国',
        currencyCode: 'EUR',
    },
    {
        code: 'IT',
        name: '意大利',
        currencyCode: 'EUR',
    },
    {
        code: 'ES',
        name: '西班牙',
        currencyCode: 'EUR',
    },
    {
        code: 'AE',
        name: '阿联酋',
        currencyCode: 'AED',
    },
    {
        code: 'SA',
        name: '沙特阿拉伯',
        currencyCode: 'SAR',
    },
    {
        code: 'EG',
        name: '埃及',
        currencyCode: 'EGP',
    },
    {
        code: 'JP',
        name: '日本',
        currencyCode: 'JPY',
    },
    {
        code: 'AU',
        name: '澳大利亚',
        currencyCode: 'AUD',
    },
    {
        code: 'SG',
        name: '新加坡',
        currencyCode: 'SGD',
    },
    {
        code: 'ID',
        name: '印度尼西亚',
        currencyCode: 'IDR',
    },
    {
        code: 'TH',
        name: '泰国',
        currencyCode: 'THB',
    },
    {
        code: 'VN',
        name: '越南',
        currencyCode: 'VND',
    },
    {
        code: 'MY',
        name: '马来西亚',
        currencyCode: 'MYR',
    },
    {
        code: 'PH',
        name: '菲律宾',
        currencyCode: 'PHP',
    },
    {
        code: 'TW',
        name: '中国台湾',
        currencyCode: 'TWD',
    },
    {
        code: 'RU',
        name: '俄罗斯',
        currencyCode: 'RUB',
    },
    {
        code: 'KR',
        name: '韩国',
        currencyCode: 'KRW',
    },
    {
        code: 'HK',
        name: '中国香港',
        currencyCode: 'HKD',
    },
    {
        code: 'IN',
        name: '印度',
        currencyCode: 'INR',
    },
    {
        code: 'CL',
        name: '智利',
        currencyCode: 'CLP',
    },
    {
        code: 'CO',
        name: '哥伦比亚',
        currencyCode: 'COP',
    },
    {
        code: 'AR',
        name: '阿根廷',
        currencyCode: 'ARS',
    },
    {
        code: 'BY',
        name: '白俄罗斯',
        currencyCode: 'BYN',
    },
    {
        code: 'KZ',
        name: '哈萨克斯坦',
        currencyCode: 'KZT',
    },
    {
        code: 'CN',
        name: '中国',
        currencyCode: 'CNY',
    },
]

export const platforms: readonly Platform[] = [
    {
        id: 'amazon',
        name: '亚马逊',
        iconKey: 'amazon',
    },
    {
        id: 'tiktok_shop',
        name: 'TikTok Shop',
        iconKey: 'tiktok_shop',
    },
    {
        id: 'shopee',
        name: 'Shopee',
        iconKey: 'shopee',
    },
    {
        id: 'lazada',
        name: 'Lazada',
        iconKey: 'lazada',
    },
    {
        id: 'aliexpress',
        name: 'AliExpress',
        iconKey: 'aliexpress',
    },
    {
        id: 'ebay',
        name: 'eBay',
        iconKey: 'ebay',
    },
    {
        id: 'mercado_libre',
        name: 'Mercado Libre',
        iconKey: 'mercado_libre',
    },
    {
        id: 'walmart',
        name: 'Walmart',
        iconKey: 'walmart',
    },
    {
        id: 'ozon',
        name: 'Ozon',
        iconKey: 'ozon',
    },
    {
        id: '1688',
        name: '1688',
        iconKey: '1688',
    },
    {
        id: 'temu',
        name: 'Temu',
        iconKey: 'temu',
    },
    {
        id: 'shein',
        name: 'SHEIN',
        iconKey: 'shein',
    },
    {
        id: 'kwai_shop',
        name: 'Kwai Shop',
        iconKey: 'kwai_shop',
    },
    {
        id: 'americanas',
        name: 'Americanas',
        iconKey: 'americanas',
    },
    {
        id: 'magalu',
        name: 'Magalu',
        iconKey: 'magalu',
    },
]

export const platformSites: readonly PlatformSite[] = [
    {
        platformId: 'amazon',
        regionCode: 'US',
        currencyCode: 'USD',
    },
    {
        platformId: 'amazon',
        regionCode: 'CA',
        currencyCode: 'CAD',
    },
    {
        platformId: 'amazon',
        regionCode: 'MX',
        currencyCode: 'MXN',
    },
    {
        platformId: 'amazon',
        regionCode: 'BR',
        currencyCode: 'BRL',
    },
    {
        platformId: 'amazon',
        regionCode: 'GB',
        currencyCode: 'GBP',
    },
    {
        platformId: 'amazon',
        regionCode: 'DE',
        currencyCode: 'EUR',
    },
    {
        platformId: 'amazon',
        regionCode: 'FR',
        currencyCode: 'EUR',
    },
    {
        platformId: 'amazon',
        regionCode: 'IT',
        currencyCode: 'EUR',
    },
    {
        platformId: 'amazon',
        regionCode: 'ES',
        currencyCode: 'EUR',
    },
    {
        platformId: 'amazon',
        regionCode: 'AE',
        currencyCode: 'AED',
    },
    {
        platformId: 'amazon',
        regionCode: 'SA',
        currencyCode: 'SAR',
    },
    {
        platformId: 'amazon',
        regionCode: 'EG',
        currencyCode: 'EGP',
    },
    {
        platformId: 'amazon',
        regionCode: 'JP',
        currencyCode: 'JPY',
    },
    {
        platformId: 'amazon',
        regionCode: 'AU',
        currencyCode: 'AUD',
    },
    {
        platformId: 'amazon',
        regionCode: 'SG',
        currencyCode: 'SGD',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'ID',
        currencyCode: 'IDR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'TH',
        currencyCode: 'THB',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'VN',
        currencyCode: 'VND',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'MY',
        currencyCode: 'MYR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'PH',
        currencyCode: 'PHP',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'SG',
        currencyCode: 'SGD',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'GB',
        currencyCode: 'GBP',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'DE',
        currencyCode: 'EUR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'FR',
        currencyCode: 'EUR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'IT',
        currencyCode: 'EUR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'ES',
        currencyCode: 'EUR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'US',
        currencyCode: 'USD',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'MX',
        currencyCode: 'MXN',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'SA',
        currencyCode: 'SAR',
    },
    {
        platformId: 'tiktok_shop',
        regionCode: 'JP',
        currencyCode: 'JPY',
    },
    {
        platformId: 'shopee',
        regionCode: 'SG',
        currencyCode: 'SGD',
    },
    {
        platformId: 'shopee',
        regionCode: 'MY',
        currencyCode: 'MYR',
    },
    {
        platformId: 'shopee',
        regionCode: 'TH',
        currencyCode: 'THB',
    },
    {
        platformId: 'shopee',
        regionCode: 'VN',
        currencyCode: 'VND',
    },
    {
        platformId: 'shopee',
        regionCode: 'ID',
        currencyCode: 'IDR',
    },
    {
        platformId: 'shopee',
        regionCode: 'TW',
        currencyCode: 'TWD',
    },
    {
        platformId: 'shopee',
        regionCode: 'BR',
        currencyCode: 'BRL',
    },
    {
        platformId: 'shopee',
        regionCode: 'MX',
        currencyCode: 'MXN',
    },
    {
        platformId: 'shopee',
        regionCode: 'PH',
        currencyCode: 'PHP',
    },
    {
        platformId: 'lazada',
        regionCode: 'ID',
        currencyCode: 'IDR',
    },
    {
        platformId: 'lazada',
        regionCode: 'MY',
        currencyCode: 'MYR',
    },
    {
        platformId: 'lazada',
        regionCode: 'PH',
        currencyCode: 'PHP',
    },
    {
        platformId: 'lazada',
        regionCode: 'SG',
        currencyCode: 'SGD',
    },
    {
        platformId: 'lazada',
        regionCode: 'TH',
        currencyCode: 'THB',
    },
    {
        platformId: 'lazada',
        regionCode: 'VN',
        currencyCode: 'VND',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'RU',
        currencyCode: 'RUB',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'ES',
        currencyCode: 'EUR',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'FR',
        currencyCode: 'EUR',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'BR',
        currencyCode: 'BRL',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'US',
        currencyCode: 'USD',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'KR',
        currencyCode: 'KRW',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'GB',
        currencyCode: 'GBP',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'DE',
        currencyCode: 'EUR',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'AU',
        currencyCode: 'AUD',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'SA',
        currencyCode: 'SAR',
    },
    {
        platformId: 'aliexpress',
        regionCode: 'JP',
        currencyCode: 'JPY',
    },
    {
        platformId: 'ebay',
        regionCode: 'US',
        currencyCode: 'USD',
    },
    {
        platformId: 'ebay',
        regionCode: 'CA',
        currencyCode: 'CAD',
    },
    {
        platformId: 'ebay',
        regionCode: 'GB',
        currencyCode: 'GBP',
    },
    {
        platformId: 'ebay',
        regionCode: 'DE',
        currencyCode: 'EUR',
    },
    {
        platformId: 'ebay',
        regionCode: 'FR',
        currencyCode: 'EUR',
    },
    {
        platformId: 'ebay',
        regionCode: 'IT',
        currencyCode: 'EUR',
    },
    {
        platformId: 'ebay',
        regionCode: 'ES',
        currencyCode: 'EUR',
    },
    {
        platformId: 'ebay',
        regionCode: 'AU',
        currencyCode: 'AUD',
    },
    {
        platformId: 'ebay',
        regionCode: 'HK',
        currencyCode: 'HKD',
    },
    {
        platformId: 'ebay',
        regionCode: 'TW',
        currencyCode: 'TWD',
    },
    {
        platformId: 'ebay',
        regionCode: 'SG',
        currencyCode: 'SGD',
    },
    {
        platformId: 'ebay',
        regionCode: 'MY',
        currencyCode: 'MYR',
    },
    {
        platformId: 'ebay',
        regionCode: 'PH',
        currencyCode: 'PHP',
    },
    {
        platformId: 'ebay',
        regionCode: 'IN',
        currencyCode: 'INR',
    },
    {
        platformId: 'ebay',
        regionCode: 'KR',
        currencyCode: 'KRW',
    },
    {
        platformId: 'ebay',
        regionCode: 'JP',
        currencyCode: 'JPY',
    },
    {
        platformId: 'mercado_libre',
        regionCode: 'BR',
        currencyCode: 'BRL',
    },
    {
        platformId: 'mercado_libre',
        regionCode: 'MX',
        currencyCode: 'MXN',
    },
    {
        platformId: 'mercado_libre',
        regionCode: 'CL',
        currencyCode: 'CLP',
    },
    {
        platformId: 'mercado_libre',
        regionCode: 'CO',
        currencyCode: 'COP',
    },
    {
        platformId: 'mercado_libre',
        regionCode: 'AR',
        currencyCode: 'ARS',
    },
    {
        platformId: 'walmart',
        regionCode: 'US',
        currencyCode: 'USD',
    },
    {
        platformId: 'walmart',
        regionCode: 'CA',
        currencyCode: 'CAD',
    },
    {
        platformId: 'walmart',
        regionCode: 'MX',
        currencyCode: 'MXN',
    },
    {
        platformId: 'walmart',
        regionCode: 'CL',
        currencyCode: 'CLP',
    },
    {
        platformId: 'ozon',
        regionCode: 'BY',
        currencyCode: 'BYN',
    },
    {
        platformId: 'ozon',
        regionCode: 'RU',
        currencyCode: 'RUB',
    },
    {
        platformId: 'ozon',
        regionCode: 'KZ',
        currencyCode: 'KZT',
    },
]

/** 只返回目录内明确的关系，调用方可据此展示空态。 */
export function sitesOfPlatform(platformId: string): readonly PlatformSite[] {
    return platformSites.filter((site) => site.platformId === platformId)
}
export function currencyOfPlatformSite(
    platformId: string,
    regionCode: string,
): Currency | undefined {
    const site = platformSites.find(
        (item) => item.platformId === platformId && item.regionCode === regionCode,
    )
    return site ? currencies.find((item) => item.code === site.currencyCode) : undefined
}
export function currencyName(code: string): string {
    return currencies.find((currency) => currency.code === code)?.name ?? code
}
