import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { checkbox, button } from './controls'
import { selectField } from './select'
import { emptyState } from './content'
import { skeleton } from './skeleton'

export type TableColumn<Row> = Readonly<{
    title: string | TemplateResult
    cell: (row: Row) => TemplateResult | string | number | typeof nothing
    width?: string
    align?: 'left' | 'right' | 'center'
}>

export type TableSelection = Readonly<{
    selected: ReadonlySet<string>
    /** 调用方持有完整结果时，可显式提供跨页全选范围；缺省仅选择当前页。 */
    allKeys?: readonly string[]
    /** 与实际全选范围一致的可访问名称。 */
    allLabel?: string
    /** 行不可选时返回原因，例如“已提交”；返回空串表示可选。 */
    disabledReason: (key: string) => string
    onToggle: (key: string, checked: boolean) => void
    onToggleAll: (keys: readonly string[], checked: boolean) => void
}>

/** 表格布局、选择与状态选项，不承载业务请求。 */
export type TableOptions<Row = unknown> = {
    /** 固定布局使用列的 CSS 宽度，未提供时为 160px；宽度包含内边距与边框。 */
    fixedLayout?: boolean
    /** 从左起冻结的物理列数，包含可选的勾选列；仅固定布局生效。 */
    freezeColumns?: number
    /** 指定吸收剩余宽度的业务列，保持原列宽作为最小宽度。 */
    fillColumn?: number
    /** 固定布局下勾选列的 CSS 宽度，默认 38px。 */
    selectionWidth?: string
    selection?: TableSelection
    empty?: string
    rowState?: (row: Row) => string
    loading?: boolean
    /** 失败展示与空数据分开；重试行为由宿主提供，不自动请求。 */
    error?: Readonly<{ title: string; description?: string; onRetry?: () => void }>
    label?: string
}

/**
 * 通用数据表格：列由调用方给出，可选勾选列、禁用行灰显并说明原因、空状态。
 * 只负责展示与回调，不读取 SDK、不推断业务状态；分页由 pager 单独渲染。
 */
export function dataTable<Row>(
    rows: readonly Row[],
    key: (row: Row) => string,
    columns: readonly TableColumn<Row>[],
    options: TableOptions<Row> = {},
) {
    const selection = options.selection
    const fixed = Boolean(options.fixedLayout)
    const widths = [
        ...(selection ? [options.selectionWidth ?? '38px'] : []),
        ...columns.map((column) => column.width ?? '160px'),
    ]
    const fillIndex =
        options.fillColumn === undefined ? -1 : options.fillColumn + (selection ? 1 : 0)
    if (
        fixed &&
        Number.isInteger(fillIndex) &&
        fillIndex >= (selection ? 1 : 0) &&
        fillIndex < widths.length
    ) {
        const otherWidths = widths.filter((_, index) => index !== fillIndex)
        const availableWidth = otherWidths.length
            ? `calc(100cqw - ${otherWidths.join(' - ')})`
            : '100cqw'
        widths[fillIndex] = `max(${widths[fillIndex]}, ${availableWidth})`
    }
    const frozen = fixed
        ? Math.min(widths.length, Math.max(0, Math.floor(options.freezeColumns ?? 0)))
        : 0
    const width = `calc(${widths.join(' + ')})`
    const cellStyle = (index: number) =>
        styleMap({
            ...(fixed ? { width: widths[index], boxSizing: 'border-box' } : {}),
            ...(index < frozen
                ? { left: index ? `calc(${widths.slice(0, index).join(' + ')})` : '0px' }
                : {}),
        })
    const selectable = selection
        ? (selection.allKeys ?? rows.map(key)).filter(
              (item) => !options.loading && !options.error && !selection.disabledReason(item),
          )
        : []
    const allChecked =
        selectable.length > 0 && selectable.every((item) => selection?.selected.has(item))
    const someChecked = selectable.some((item) => selection?.selected.has(item))
    return html`<div
        class="mf-table"
        ?data-fixed-layout=${fixed}
        aria-busy=${Boolean(options.loading && !options.error)}
    >
        <table
            aria-label=${options.label ?? nothing}
            style=${styleMap(fixed ? { width, minWidth: width, tableLayout: 'fixed' } : {})}
        >
            ${fixed
                ? html`<colgroup>
                      ${widths.map((value) => html`<col style=${styleMap({ width: value })} />`)}
                  </colgroup>`
                : nothing}
            <thead>
                <tr>
                    ${selection
                        ? html`<th
                              class="mf-check"
                              scope="col"
                              ?data-frozen=${frozen > 0}
                              ?data-freeze-edge=${frozen === 1}
                              style=${cellStyle(0)}
                          >
                              ${checkbox({
                                  label: selection.allLabel ?? '选择本页可选行',
                                  labelHidden: true,
                                  checked: allChecked,
                                  indeterminate: someChecked && !allChecked,
                                  disabled: selectable.length === 0,
                                  onChange: (checked) => selection.onToggleAll(selectable, checked),
                              })}
                          </th>`
                        : nothing}
                    ${columns.map(
                        (column, index) =>
                            html`<th
                                scope="col"
                                style=${fixed
                                    ? cellStyle(index + (selection ? 1 : 0))
                                    : styleMap({ width: column.width })}
                                ?data-frozen=${index + (selection ? 1 : 0) < frozen}
                                ?data-freeze-edge=${index + (selection ? 1 : 0) === frozen - 1}
                                data-align=${column.align ?? 'left'}
                            >
                                ${column.title}
                            </th>`,
                    )}
                </tr>
            </thead>
            <tbody>
                ${options.loading && rows.length > 0 && !options.error
                    ? html`<tr>
                          <td
                              colspan=${columns.length + (selection ? 1 : 0)}
                              class="mf-table-refresh"
                          >
                              <span role="status"
                                  >正在更新数据，当前结果仍可阅读，暂不可选择。</span
                              >
                          </td>
                      </tr>`
                    : nothing}
                ${options.error
                    ? html`<tr>
                          <td class="mf-empty" colspan=${columns.length + (selection ? 1 : 0)}>
                              ${emptyState(
                                  options.error.title,
                                  options.error.description,
                                  options.error.onRetry
                                      ? button({
                                            label: '重新加载',
                                            onClick: options.error.onRetry,
                                        })
                                      : undefined,
                              )}
                          </td>
                      </tr>`
                    : options.loading && rows.length === 0
                      ? Array.from(
                            { length: 3 },
                            () =>
                                html`<tr aria-hidden="true">
                                    ${selection
                                        ? html`<td>
                                              ${skeleton({ width: '15px', height: '15px' })}
                                          </td>`
                                        : nothing}
                                    ${columns.map(
                                        () => html`<td>${skeleton({ width: '75%' })}</td>`,
                                    )}
                                </tr>`,
                        )
                      : rows.length === 0
                        ? html`<tr>
                              <td class="mf-empty" colspan=${columns.length + (selection ? 1 : 0)}>
                                  ${emptyState(options.empty ?? '暂无数据')}
                              </td>
                          </tr>`
                        : repeat(rows, key, (row) => {
                              const item = key(row)
                              const reason = options.loading
                                  ? '正在加载'
                                  : (selection?.disabledReason(item) ?? '')
                              const checked = Boolean(selection?.selected.has(item))
                              return html`<tr
                                  data-row-key=${item}
                                  data-state=${options.rowState?.(row) ?? ''}
                                  ?data-selected=${checked}
                                  ?data-disabled=${Boolean(reason)}
                              >
                                  ${selection
                                      ? html`<td
                                            class="mf-check"
                                            ?data-frozen=${frozen > 0}
                                            ?data-freeze-edge=${frozen === 1}
                                            style=${cellStyle(0)}
                                        >
                                            ${checkbox({
                                                label: reason ? `不可选择：${reason}` : '选择此行',
                                                title: reason,
                                                labelHidden: true,
                                                checked,
                                                disabled: Boolean(reason),
                                                onChange: (value) =>
                                                    selection.onToggle(item, value),
                                            })}
                                        </td>`
                                      : nothing}
                                  ${columns.map(
                                      (column, index) =>
                                          html`<td
                                              data-align=${column.align ?? 'left'}
                                              style=${fixed
                                                  ? cellStyle(index + (selection ? 1 : 0))
                                                  : nothing}
                                              ?data-frozen=${index + (selection ? 1 : 0) < frozen}
                                              ?data-freeze-edge=${index + (selection ? 1 : 0) ===
                                              frozen - 1}
                                          >
                                              ${column.cell(row)}
                                          </td>`,
                                  )}
                              </tr>`
                          })}
            </tbody>
        </table>
        ${options.loading && !options.error
            ? html`<span class="mf-sr-only" role="status">正在加载数据</span>`
            : nothing}
    </div>`
}

export type PagerProps = Readonly<{
    page: number
    pageSize: number
    total: number
    pageSizes?: readonly number[]
    onPage: (page: number) => void
    onPageSize?: (size: number) => void
    busy?: boolean
}>

/**
 * 生成页码序列：首尾固定，当前页附近展开，其余折叠成省略号。
 * 纯展示计算，不改变页码；页码真实范围仍以 total / pageSize 为准。
 */
export function pageNumbers(page: number, pages: number, span = 2): (number | '…')[] {
    if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1)
    const start = Math.max(2, page - span)
    const end = Math.min(pages - 1, page + span)
    const items: (number | '…')[] = [1]
    if (start > 2) items.push('…')
    for (let index = start; index <= end; index++) items.push(index)
    if (end < pages - 1) items.push('…')
    items.push(pages)
    return items
}

/**
 * 分页条：总数、上一页、页码、下一页、每页条数与跳转。
 * 总数由调用方给出，不用当前页条数推断；翻页只回调页码，不改业务数据。
 */
export function pager(p: PagerProps) {
    const pages = Math.max(1, Math.ceil(p.total / Math.max(1, p.pageSize)))
    const page = Math.min(Math.max(1, p.page), pages)
    const busy = Boolean(p.busy)
    const go = (next: number) => {
        if (!Number.isFinite(next) || !Number.isInteger(next)) return
        const target = Math.min(Math.max(1, next), pages)
        if (!busy && target !== page) p.onPage(target)
    }
    return html`<nav class="mf-pager" aria-label="分页">
        <span class="mf-pager-total">总计 ${p.total} 项</span>
        <button
            class="mf-page"
            type="button"
            aria-label="上一页"
            ?disabled=${busy || page <= 1}
            @click=${() => go(page - 1)}
        >
            ‹
        </button>
        ${pageNumbers(page, pages).map((item) =>
            item === '…'
                ? html`<span class="mf-page-gap">…</span>`
                : html`<button
                      class="mf-page"
                      type="button"
                      aria-current=${item === page ? 'page' : nothing}
                      ?disabled=${busy}
                      @click=${() => go(item)}
                  >
                      ${item}
                  </button>`,
        )}
        <button
            class="mf-page"
            type="button"
            aria-label="下一页"
            ?disabled=${busy || page >= pages}
            @click=${() => go(page + 1)}
        >
            ›
        </button>
        ${p.onPageSize && p.pageSizes?.length
            ? selectField({
                  name: 'pageSize',
                  label: '每页条数',
                  labelHidden: true,
                  value: String(p.pageSize),
                  readOnly: busy,
                  options: p.pageSizes.map((size) => ({
                      value: String(size),
                      label: `${size} 条/页`,
                  })),
                  onChange: (value) => {
                      if (value !== undefined) p.onPageSize?.(Number(value))
                  },
              })
            : nothing}
        <label class="mf-page-jump">
            前往
            <input
                class="mf-input"
                type="number"
                min="1"
                max=${pages}
                ?disabled=${busy}
                @keydown=${(event: KeyboardEvent) => {
                    if (event.key === 'Enter') go(Number((event.target as HTMLInputElement).value))
                }}
                @change=${(event: Event) => go(Number((event.target as HTMLInputElement).value))}
            />
        </label>
    </nav>`
}
