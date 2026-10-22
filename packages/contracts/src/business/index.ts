/** Generated from platform JSON Schema. Do not edit. Runtime validation still applies. */

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
  }[]
  attributes?: {
    [k: string]: unknown
  }
  references?: {
    collectProductId?: string
    draftProductId?: string
    shopProductId?: string
  }
}
export interface Video {
  url: Url
  mimeType?: string
  width?: number
  height?: number
  durationSeconds?: number
}
