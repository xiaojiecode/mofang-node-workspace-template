import { html } from 'lit'
import { dataTable } from '../components/table'
import type { TableColumn } from '../components/table'
import { button } from '../components/controls'
import { reportMoney, reportNumber, reportPercent } from './parts'
import type { ReportCategory, ReportCategoryTableProps, ReportSortKey } from './types'

/** 类目比较复用统一表格；排序只用于显示，点击通过回调交接选择。 */
export function reportCategoryTable(p: ReportCategoryTableProps) {
    const monetaryRows = p.categories.filter(
        (row) => row.gmv !== undefined && Number.isFinite(row.gmv),
    )
    const currencies = new Set(monetaryRows.map((row) => row.currencyCode))
    const comparableMoney =
        monetaryRows.length > 0 && currencies.size === 1 && Boolean(monetaryRows[0]?.currencyCode)
    const value = (row: ReportCategory) =>
        p.sortKey === 'score' ? row.opportunityScore : p.sortKey === 'units' ? row.units : row.gmv
    const rows = [...p.categories].sort((a, b) => {
        if (p.sortKey === 'gmv' && !comparableMoney) return 0
        const av = value(a),
            bv = value(b)
        if (av === undefined || !Number.isFinite(av))
            return bv === undefined || !Number.isFinite(bv) ? 0 : 1
        if (bv === undefined || !Number.isFinite(bv)) return -1
        return bv - av
    })
    const columns: readonly TableColumn<ReportCategory>[] = [
        {
            title: '类目',
            cell: (row) =>
                html`<button
                    class="mf-report-category-choice"
                    type="button"
                    aria-pressed=${row.id === p.selectedId}
                    @click=${() => p.onSelect(row.id)}
                >
                    <b>${row.name}</b>${row.englishName
                        ? html`<small>${row.englishName}</small>`
                        : ''}
                </button>`,
        },
        {
            title: p.labels?.units ?? '销量榜样本销量',
            align: 'right',
            cell: (row) => reportNumber(row.units),
        },
        {
            title: p.labels?.gmv ?? '销量榜样本 GMV',
            align: 'right',
            cell: (row) => reportMoney(row.gmv, row.currencyCode),
        },
        {
            title: p.labels?.growth ?? '商品增长率',
            align: 'right',
            cell: (row) => reportPercent(row.growth, true),
        },
        {
            title: p.labels?.promoters ?? '热推达人累计',
            align: 'right',
            cell: (row) => reportNumber(row.promoters),
        },
        {
            title: p.labels?.newUnits ?? '新品榜 3 日销量',
            align: 'right',
            cell: (row) => reportNumber(row.newUnits),
        },
        {
            title: p.labels?.searchMomentum ?? '搜索动量',
            align: 'right',
            cell: (row) => reportPercent(row.searchMomentum, true),
        },
        {
            title: p.labels?.opportunityScore ?? '机会分',
            align: 'right',
            cell: (row) => reportNumber(row.opportunityScore),
        },
    ]
    return html`<div class="mf-report-category-table">
        <div class="mf-report-table-tools">
            <span>点击类目查看完整分析</span>
            <div class="mf-report-sort" role="group" aria-label="报告排序方式">
                ${(
                    [
                        { key: 'score', label: '综合机会' },
                        { key: 'units', label: p.labels?.sortUnits ?? '样本销量' },
                        { key: 'gmv', label: p.labels?.sortGmv ?? '样本 GMV' },
                    ] as const
                ).map((option) =>
                    button({
                        label: option.label,
                        variant: p.sortKey === option.key ? 'accent' : 'secondary',
                        disabled: option.key === 'gmv' && !comparableMoney,
                        title:
                            option.key === 'gmv' && !comparableMoney
                                ? '缺少统一币种，无法比较 GMV'
                                : '',
                        onClick: () => p.onSortChange(option.key as ReportSortKey),
                    }),
                )}
            </div>
        </div>
        <div
            @click=${(event: MouseEvent) => {
                const target = event.target
                if (!(target instanceof Element) || target.closest('button')) return
                const row = target.closest<HTMLTableRowElement>('tr[data-row-key]')
                if (row?.dataset.rowKey) p.onSelect(row.dataset.rowKey)
            }}
        >
            ${dataTable(rows, (row) => row.id, columns, {
                label: '子类目表现对比',
                rowState: (row) => (row.id === p.selectedId ? 'selected' : ''),
                empty: '暂无可比较类目',
            })}
        </div>
        ${p.sortKey === 'gmv' && !comparableMoney
            ? html`<p class="mf-report-caption">缺少统一币种，GMV 暂按输入顺序展示。</p>`
            : ''}
        ${p.caption ? html`<p class="mf-report-caption">${p.caption}</p>` : ''}
    </div>`
}
