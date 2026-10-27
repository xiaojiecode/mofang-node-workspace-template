import { platformIconUrls } from '../assets/platforms'
import { platforms } from '../catalog/data'
import { html, svg, nothing } from 'lit'
import type { SVGTemplateResult } from 'lit'

export type CurrencyCode = 'USD' | 'CNY' | 'EUR' | 'GBP' | 'JPY' | 'KRW' | 'INR' | 'RUB'
export type IconName =
    | 'search'
    | 'close'
    | 'chevron-down'
    | 'chevron-up'
    | 'chevron-right'
    | 'settings'
    | 'check'
    | 'warning'
export type IconProps = Readonly<{ size?: number; color?: string; label?: string }>
export const currencyNames: Readonly<Record<CurrencyCode, string>> = {
    USD: '美元',
    CNY: '人民币',
    EUR: '欧元',
    GBP: '英镑',
    JPY: '日元',
    KRW: '韩元',
    INR: '印度卢比',
    RUB: '俄罗斯卢布',
}

/** 图标仅使用内置矢量路径，颜色默认继承 currentColor；有名称时作为独立图像朗读。 */
function frame(content: SVGTemplateResult, p: IconProps) {
    return html`<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width=${p.size ?? 18}
        height=${p.size ?? 18}
        fill="none"
        stroke=${p.color ?? 'currentColor'}
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        role=${p.label ? 'img' : nothing}
        aria-label=${p.label ?? nothing}
        aria-hidden=${p.label ? nothing : 'true'}
        focusable="false"
    >
        ${content}
    </svg>`
}

/** 货币名称与标识独立保留；人民币和日元使用同一符号但可访问名称不同。 */
export function currencyIcon(code: CurrencyCode, p: IconProps = {}) {
    const paths: Record<CurrencyCode, SVGTemplateResult> = {
        USD: svg`<path d="M12 2v20m5-15c-.8-2-8-3-9 1-1 5 9 3 9 8-1 4-8 3-10 0"/>`,
        CNY: svg`<path d="m6 4 6 8 6-8M12 12v9M6 12h12M6 16h12"/>`,
        JPY: svg`<path d="m6 4 6 8 6-8M12 12v9M6 12h12M6 16h12"/>`,
        EUR: svg`<path d="M19 5a8 8 0 1 0 0 14M4 10h12M4 14h11"/>`,
        GBP: svg`<path d="M17 6c-1-4-8-4-8 2v8c0 2-1 3-3 4h13M5 12h11"/>`,
        KRW: svg`<path d="m3 5 4 15 5-15 5 15 4-15M2 10h20M3 14h18"/>`,
        INR: svg`<path d="M5 4h14M5 8h14M7 4c9 0 9 10 0 10l10 7"/>`,
        RUB: svg`<path d="M8 21V3h6c8 0 8 11 0 11H5M5 18h10"/>`,
    }
    return frame(paths[code], { ...p, label: p.label ?? currencyNames[code] })
}

/** 常用操作图标与控件共用笔画，不加载外部图标包。 */
export function uiIcon(name: IconName, p: IconProps = {}) {
    const paths: Record<IconName, SVGTemplateResult> = {
        search: svg`<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>`,
        close: svg`<path d="m6 6 12 12M18 6 6 18"/>`,
        'chevron-down': svg`<path d="m6 9 6 6 6-6"/>`,
        'chevron-up': svg`<path d="m6 15 6-6 6 6"/>`,
        'chevron-right': svg`<path d="m9 6 6 6-6 6"/>`,
        settings: svg`<path d="M3 6h18M3 12h18M3 18h18M8 3v6m8 0v6m-8 0v6"/>`,
        check: svg`<path d="m5 12 4 4L19 6"/>`,
        warning: svg`<path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.5 13a2 2 0 0 1-1.7 3H4.5a2 2 0 0 1-1.7-3Z"/><path d="M12 9v4m0 3h.01"/>`,
    }
    return frame(paths[name], p)
}

/** 平台图标复用原型原始 SVG 图片，未知平台没有图标，不以其它品牌兜底。 */
export function platformIcon(platformId: string, p: IconProps = {}) {
    const source = platformIconUrls[platformId]
    if (!source) return html`${nothing}`
    const label = p.label ?? platforms.find((item) => item.id === platformId)?.name ?? platformId
    return html`<img
        src=${source}
        width=${p.size ?? 24}
        height=${p.size ?? 24}
        style="object-fit:contain;vertical-align:middle"
        alt=${label}
    />`
}
