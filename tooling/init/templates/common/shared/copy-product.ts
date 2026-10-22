import type { Product } from '@mofang/contracts/business'
import type { DeepReadonly } from '@mofang/contracts/goja'
/**
 * 深拷贝已经通过平台 Schema 校验的完整 Product。
 * 输入可能只读；通过 JSON 拷贝避免修改上游对象，保留所有已存在的业务字段，
 * 不补造缺失的价格、SKU、来源或身份，也不使用 Goja 没有提供的浏览器 API。
 */
export function copyProduct(value: DeepReadonly<Product>): Product {
    return JSON.parse(JSON.stringify(value)) as Product
}
