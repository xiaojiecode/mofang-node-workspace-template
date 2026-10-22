import type { Product } from '@mofang/contracts/business'
import type { DeepReadonly } from '@mofang/contracts/goja'
/** Input already passed the platform Schema; clone only valid JSON data. */
export function copyProduct(value: DeepReadonly<Product>): Product {
  return JSON.parse(JSON.stringify(value)) as Product
}
