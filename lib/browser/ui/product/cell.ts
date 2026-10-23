import { html, nothing } from 'lit'
import type { Product } from '@mofang/contracts/business'

/** 金额展示：有价格才显示，币种缺失时不补默认值。 */
export function money(value: number | undefined, currency: string | undefined) {
    return value === undefined ? '—' : `${currency ?? ''} ${value.toFixed(2)}`.trim()
}

/** 百分比展示：入参是 0–100 的数值，缺失时显示占位，不补 0。 */
export function percent(value: number | undefined) {
    return value === undefined ? '—' : `${value.toFixed(2)}%`
}

/**
 * 表格商品单元格：缩略图、标题、来源平台与商品 ID、来源链接。
 * 只读完整 Product 已有字段，不拼接或猜测缺失的链接与身份。
 */
export function productCell(product: Product | undefined, secondary = '') {
    const image = product?.images?.[0]?.url
    const source = product?.collection
    const meta = [
        source?.source ? `来源平台: ${source.source}` : '',
        source?.sourceItemId ? `商品 ID: ${source.sourceItemId}` : '',
    ]
        .filter(Boolean)
        .join(' ')
    return html`<div class="mf-product-cell">
        ${image
            ? html`<img src=${image} alt="" loading="lazy" />`
            : html`<span class="mf-product-thumb" aria-hidden="true"></span>`}
        <div class="mf-product-text">
            <strong>${product?.basic?.title || '未命名商品'}</strong>
            ${meta ? html`<span class="mf-sub">${meta}</span>` : nothing}
            ${source?.sourceUrl
                ? html`<a class="mf-link" href=${source.sourceUrl} target="_blank" rel="noreferrer"
                      >来源链接</a
                  >`
                : nothing}
            ${secondary ? html`<span class="mf-sub">${secondary}</span>` : nothing}
        </div>
    </div>`
}
