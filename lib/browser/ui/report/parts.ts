import { html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { card } from '../components/card'
import { button } from '../components/controls'
import type {
    ReportSource,
    ReportMetricCardProps,
    ReportScoreProps,
    ReportOpportunityMatrixProps,
    ReportActionCardProps,
} from './types'

export const reportNumber = (value: number | undefined) =>
    value !== undefined && Number.isFinite(value)
        ? value.toLocaleString('zh-CN', { maximumFractionDigits: 20 })
        : '—'
export const reportPercent = (value: number | undefined, signed = false) =>
    value !== undefined && Number.isFinite(value)
        ? `${signed && value > 0 ? '+' : ''}${reportNumber(value)}%`
        : '—'
/** 货币代码不明时不补默认币种；原始金额与缺少币种的原因同时保留。 */
export function reportMoney(value: number | undefined, currencyCode: string | undefined) {
    if (value === undefined || !Number.isFinite(value)) return '—'
    return currencyCode
        ? `${currencyCode} ${reportNumber(value)}`
        : `${reportNumber(value)}（币种未提供）`
}
/** 来源仅呈现调用方提供的标识和口径，不导入全量平台图标目录。 */
export function reportSourceBadge(p: ReportSource) {
    return html`<span class="mf-report-source" title=${p.description ?? nothing}
        >${p.icon ?? nothing}<span>${p.label}</span></span
    >`
}
