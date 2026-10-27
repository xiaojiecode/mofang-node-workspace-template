import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'

export type PlatformItem = Readonly<{
    id: string
    label: string
    icon: TemplateResult
    href?: string
}>
export type PlatformLinksProps = Readonly<{ label?: string; items: readonly PlatformItem[] }>

/** 平台标识横条只显示传入平台，外部链接仅接受 HTTP(S)，不代表已授权或已接入。 */
export function platformLinks(p: PlatformLinksProps) {
    return html`<div class="mf-platforms">
        <span>${p.label ?? '支持平台'}</span>
        <div>
            ${p.items.map((item) => {
                let href: string | undefined
                try {
                    const url = new URL(item.href ?? '')
                    if (url.protocol === 'https:' || url.protocol === 'http:') href = url.href
                } catch {
                    /* 未提供链接时仅展示平台标识。 */
                }
                return href
                    ? html`<a
                          href=${href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label=${`打开${item.label}官网`}
                          title=${item.label}
                          >${item.icon}</a
                      >`
                    : html`<span
                          class="mf-platforms-item"
                          role="img"
                          aria-label=${item.label}
                          title=${item.label}
                          >${item.icon}</span
                      >`
            })}
        </div>
        ${!p.items.length ? html`<span class="mf-hint">暂无支持平台</span>` : nothing}
    </div>`
}
export const platformStyles = /* @__PURE__ */ (() => css`
    .mf-platforms {
        display: flex;
        align-items: center;
        gap: 14px;
        color: #737b87;
        font-size: 12px;
    }
    .mf-platforms > div {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 14px;
    }
    .mf-platforms a,
    .mf-platforms-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
    .mf-platforms img,
    .mf-platforms svg {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    .mf-platforms a:focus-visible {
        outline: 2px solid #87bbff;
        outline-offset: 3px;
    }
`)()
