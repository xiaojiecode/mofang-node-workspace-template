import { html, nothing } from 'lit'
import type { Product } from '@mofang/contracts/business'
/** Pure display: accepts the complete built-in Product; no SDK or mutable state. */
export function productSummary(product: Product) {
  return html`<article class="mf-product">
    <h3>${product.basic?.title || '未命名商品'}</h3>
    ${product.basic?.description ? html`<p>${product.basic.description}</p>` : nothing}
    <dl>
      <div>
        <dt>SKU</dt>
        <dd>${product.skus?.length ?? 0}</dd>
      </div>
      <div>
        <dt>图片</dt>
        <dd>${product.images?.length ?? 0}</dd>
      </div>
      ${product.basic?.price !== undefined
        ? html`<div>
            <dt>价格</dt>
            <dd>${product.basic.currency ?? ''} ${product.basic.price}</dd>
          </div>`
        : nothing}
    </dl>
  </article>`
}
