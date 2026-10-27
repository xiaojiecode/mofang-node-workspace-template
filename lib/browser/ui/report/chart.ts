import { html, nothing, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import type { ReportTrendProps } from './types'
import { reportNumber, reportSourceBadge } from './parts'

/** 数值折线支持负数、零、单点与中间缺值；缺值断开，不插值填造数据。 */
export function reportTrend(p: ReportTrendProps) {
    const width = 480,
        height = 120,
        inset = 12
    const finite = p.series
        .map((point, index) => ({ ...point, index }))
        .filter((point) => point.value !== undefined && Number.isFinite(point.value))
    const min = Math.min(0, ...finite.map((point) => point.value!))
    const max = Math.max(0, ...finite.map((point) => point.value!))
    const span = max - min || 1
    const x = (index: number) =>
        p.series.length < 2
            ? width / 2
            : inset + (index / (p.series.length - 1)) * (width - inset * 2)
    const y = (value: number) => height - inset - ((value - min) / span) * (height - inset * 2)
    let open = false
    const path = p.series
        .map((point, index) => {
            if (point.value === undefined || !Number.isFinite(point.value)) {
                open = false
                return ''
            }
            const command = `${open ? 'L' : 'M'}${x(index).toFixed(2)},${y(point.value).toFixed(2)}`
            open = true
            return command
        })
        .join(' ')
    return html`<article
        class="mf-report-trend"
        style=${styleMap({ '--mf-report-chart-color': p.color ?? '#6b9bff' })}
    >
        <div class="mf-report-trend-heading">
            <h4>${p.title}</h4>
            ${p.source ? reportSourceBadge(p.source) : nothing}
        </div>
        ${p.summary ? html`<strong>${p.summary}</strong>` : nothing}${finite.length
            ? svg`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label=${p.accessibleLabel} class="mf-report-chart"><title>${p.accessibleLabel}</title><line class="mf-report-chart-zero" x1=${inset} y1=${y(0)} x2=${width - inset} y2=${y(0)}></line><path d=${path} class="mf-report-chart-line"></path>${finite.map((point) => svg`<circle cx=${x(point.index)} cy=${y(point.value!)} r="4" tabindex="0" role="img" aria-label=${`${point.label}：${reportNumber(point.value)}${p.unit ?? ''}`}><title>${point.label}：${reportNumber(point.value)}${p.unit ?? ''}</title></circle>`)}</svg>`
            : html`<div class="mf-report-chart-empty">暂无趋势数据</div>`}
        <div class="mf-report-chart-labels">
            <span>${p.series[0]?.label ?? '—'}</span><span>${p.series.at(-1)?.label ?? '—'}</span>
        </div>
        ${p.note ? html`<p>${p.note}</p>` : nothing}
        <details class="mf-report-chart-data">
            <summary>查看趋势数值</summary>
            <table aria-label=${`${p.accessibleLabel}数值`}>
                <thead>
                    <tr>
                        <th scope="col">时间</th>
                        <th scope="col">数值${p.unit ? `（${p.unit}）` : ''}</th>
                    </tr>
                </thead>
                <tbody>
                    ${p.series.map(
                        (point) =>
                            html`<tr>
                                <th scope="row">${point.label}</th>
                                <td>${reportNumber(point.value)}</td>
                            </tr>`,
                    )}
                </tbody>
            </table>
        </details>
    </article>`
}
