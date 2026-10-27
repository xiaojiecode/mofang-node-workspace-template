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
/** 指标卡复用通用卡片，零值保留，缺失值显示破折号。 */
export function reportMetricCard(p: ReportMetricCardProps) {
    const value = typeof p.value === 'number' ? reportNumber(p.value) : p.value || '—'
    return html`<div class="mf-report-metric">
        ${card(
            { variant: 'compact' },
            html`<div class="mf-report-metric-head">
                    <b>${p.label}</b>${p.source ? reportSourceBadge(p.source) : nothing}
                </div>
                ${p.description
                    ? html`<p>${p.description}</p>`
                    : nothing}<strong>${value}${p.unit && value !== '—'
                    ? html`<small>${p.unit}</small>`
                    : nothing}</strong>${p.note
                    ? html`<p class="mf-report-metric-note">${p.note}</p>`
                    : nothing}`,
        )}
    </div>`
}
/** 评分采用度量语义；缺失或越界分数不伪装为零分或执行中进度。 */
export function reportScore(p: ReportScoreProps) {
    const max = p.max ?? 100
    const valid =
        Number.isFinite(max) &&
        max > 0 &&
        p.value !== undefined &&
        Number.isFinite(p.value) &&
        p.value >= 0 &&
        p.value <= max
    return html`<div class="mf-report-score">
        <div class="mf-report-score-label">
            ${p.label}${p.source ? reportSourceBadge(p.source) : nothing}
        </div>
        <strong>${valid ? reportNumber(p.value) : '—'}<small>/ ${reportNumber(max)}</small></strong
        >${valid
            ? html`<div
                  class="mf-report-score-track"
                  role="meter"
                  aria-label=${p.label}
                  aria-valuemin="0"
                  aria-valuemax=${max}
                  aria-valuenow=${p.value!}
              >
                  <span style=${styleMap({ width: `${(p.value! / max) * 100}%` })}></span>
              </div>`
            : html`<p class="mf-report-missing">暂无有效评分</p>`}${p.description
            ? html`<p>${p.description}</p>`
            : nothing}
    </div>`
}
/** 矩阵阈值由报告提供，任何轴缺少有效数值时不高亮象限。 */
export function reportOpportunityMatrix(p: ReportOpportunityMatrixProps) {
    const valid =
        p.x.value !== undefined &&
        p.y.value !== undefined &&
        Number.isFinite(p.x.value) &&
        Number.isFinite(p.y.value) &&
        Number.isFinite(p.x.threshold) &&
        Number.isFinite(p.y.threshold)
    const xHigh = valid && p.x.value! >= p.x.threshold
    const yHigh = valid && p.y.value! >= p.y.threshold
    return html`<section class="mf-report-matrix-panel" aria-label=${p.title}>
        <h4>${p.title}</h4>
        ${p.description ? html`<p>${p.description}</p>` : nothing}
        <div class="mf-report-matrix">
            ${[
                { x: false, y: true },
                { x: true, y: true },
                { x: false, y: false },
                { x: true, y: false },
            ].map(
                (cell) =>
                    html`<div data-active=${Boolean(valid && cell.x === xHigh && cell.y === yHigh)}>
                        <span
                            >${p.x.label}${cell.x ? '强' : '弱'} ·
                            ${p.y.label}${cell.y ? '强' : '弱'}</span
                        ><span aria-hidden="true">●</span>${valid &&
                        cell.x === xHigh &&
                        cell.y === yHigh
                            ? html`<span class="mf-sr-only">当前象限</span>`
                            : nothing}
                    </div>`,
            )}
        </div>
        <p>
            ${valid
                ? (p.conclusion ??
                  `${p.x.label} ${reportNumber(p.x.value)}；${p.y.label} ${reportNumber(p.y.value)}`)
                : '指标不足，暂无法判断象限。'}
        </p>
        <small
            >强信号阈值：${p.x.label} ≥ ${reportNumber(p.x.threshold)}；${p.y.label} ≥
            ${reportNumber(p.y.threshold)}</small
        >
    </section>`
}
