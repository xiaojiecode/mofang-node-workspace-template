import { html, nothing } from 'lit'
import type { Product } from '@mofang/contracts/business'
import { image } from '../components/image'
import { text } from '../components/content'
/** 只读展示完整内置 Product，不访问 SDK 或修改业务状态。 */
export function productSummary(product: Product) {
    const images = (product.images ?? []).map((item) => ({
        src: item.url,
        alt: product.basic?.title || '商品图片',
    }))
    return html`<article class="mf-product">
        <div class="mf-product-summary">
            ${image({
                ...(images[0] ? { src: images[0].src } : {}),
                alt: product.basic?.title || '商品图片',
                images,
                width: '72px',
                height: '72px',
            })}
            <div>
                <h3>${text({ value: product.basic?.title || '未命名商品', weight: 'medium' })}</h3>
                ${product.basic?.description
                    ? html`<div class="mf-product-description">
                          ${text({ value: product.basic.description, tone: 'muted', lines: 3 })}
                      </div>`
                    : nothing}
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
            </div>
        </div>
        ${images.length > 1
            ? html`<div class="mf-product-gallery" aria-label="商品图片">
                  ${images.slice(1).map((item) => image({ ...item, images }))}
              </div>`
            : nothing}
    </article>`
}
