/** 从平台 JSON Schema 生成，不要手动修改；运行时仍须校验。 */

export type Array = unknown[]
export type Boolean = boolean
export type Url = string
export type Integer = number
export type Number = number
export type Product = Product1
export type String = string

export interface BuiltinTypes {
  array: Array
  boolean: Boolean
  image: Image
  integer: Integer
  number: Number
  object: Object
  product: Product
  string: String
  url: Url
  video: Video
}
export interface Image {
  url: Url
  mimeType?: string
  width?: number
  height?: number
}
export interface Object {
  [k: string]: unknown
}
export interface Product1 {
  collection?: {
    source: string
    sourceUrl: Url
    sourceItemId?: string
  }
  basic?: {
    title?: string
    description?: string
    currency?: string
    language?: string
    categoryId?: string
    categoryPath?: string
    price?: number
  }
  images?: Image[]
  videos?: Video[]
  skus?: {
    skuCode?: string
    skuName?: string
    price?: number
    stock?: number
    image?: Image
    attributes?: {
      [k: string]: unknown
    }
    specValues?: ProductAttribute[]
    costPrice?: number
    sourcePrice?: number
    compareAtPrice?: number
    sourceCurrency?: string
    weight?: ProductWeight
    presaleType?: 'none' | 'spot' | 'preorder'
    productionDays?: number
  }[]
  attributes?: {
    [k: string]: unknown
  }
  references?: {
    collectProductId?: string
    draftProductId?: string
    shopProductId?: string
  }
  productAttributes?: ProductAttribute1[]
  packageWeight?: ProductWeight1
  packageDimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'mm' | 'm' | 'in'
  }
  sizeChart?: {
    mode: 'image' | 'template'
    imageUrl?: Url
    template?: string
  }
}
export interface Video {
  url: Url
  mimeType?: string
  width?: number
  height?: number
  durationSeconds?: number
}
export interface ProductAttribute {
  attributeId?: string
  canonicalKey?: string
  attributeName: string
  sourceName?: string
  valueId?: string
  valueName: string
  unit?: string
}
export interface ProductWeight {
  value: number
  unit: 'kg' | 'g' | 'lb' | 'oz'
}
export interface ProductAttribute1 {
  attributeId?: string
  canonicalKey?: string
  attributeName: string
  sourceName?: string
  valueId?: string
  valueName: string
  unit?: string
}
export interface ProductWeight1 {
  value: number
  unit: 'kg' | 'g' | 'lb' | 'oz'
}
