import platform0 from './platforms/ebay.svg'
import platform1 from './platforms/walmart.svg'
import platform2 from './platforms/1688.svg'
import platform3 from './platforms/tiktok-shop.svg'
import platform4 from './platforms/amazon.svg'
import platform5 from './platforms/aliexpress.svg'
import platform6 from './platforms/temu.svg'
import platform7 from './platforms/shopee.svg'
import platform8 from './platforms/shein.svg'
import platform9 from './platforms/mercado.svg'
import platform10 from './platforms/kwai-shop.svg'
import platform11 from './platforms/americanas.svg'
import platform12 from './platforms/magalu.svg'
import platform13 from './platforms/lazada.svg'
import platform14 from './platforms/ozon.svg'

/** 动态图标目录包含全部优化资产；已知平台优先使用静态入口。 */
export const platformIconUrls: Readonly<Record<string, string>> = {
    ebay: platform0,
    walmart: platform1,
    '1688': platform2,
    tiktok_shop: platform3,
    amazon: platform4,
    aliexpress: platform5,
    temu: platform6,
    shopee: platform7,
    shein: platform8,
    mercado_libre: platform9,
    kwai_shop: platform10,
    americanas: platform11,
    magalu: platform12,
    lazada: platform13,
    ozon: platform14,
}
