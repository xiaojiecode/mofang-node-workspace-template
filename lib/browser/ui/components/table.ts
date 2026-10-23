import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { live } from 'lit/directives/live.js'

export type TableColumn<Row> = Readonly<{
    title: string
    cell: (row: Row) => TemplateResult | string | number | typeof nothing
    width?: string
    align?: 'left' | 'right' | 'center'
}>

export type TableSelection = Readonly<{
    selected: ReadonlySet<string>
    /** 行不可选时返回原因，例如“已提交”；返回空串表示可选。 */
    disabledReason: (key: string) => string
    onToggle: (key: string, checked: boolean) => void
    onToggleAll: (keys: readonly string[], checked: boolean) => void
}>

/**
 * 通用数据表格：列由调用方给出，可选勾选列、禁用行灰显并说明原因、空状态。
 * 只负责展示与回调，不读取 SDK、不推断业务状态；分页由 pager 单独渲染。
 */
export function dataTable<Row>(
    rows: readonly Row[],
    key: (row: Row) => string,
    columns: readonly TableColumn<Row>[],
    options: {
        selection?: TableSelection
        empty?: string
        rowState?: (row: Row) => string
    } = {},
) {
    const selection = options.selection
    const selectable = selection
        ? rows.map(key).filter((item) => !selection.disabledReason(item))
        : []
    const allChecked =
        selectable.length > 0 && selectable.every((item) => selection?.selected.has(item))
    return html`<div class="mf-table">
        <table>
            <thead>
                <tr>
                    ${selection
                        ? html`<th class="mf-check">
                              <input
                                  type="checkbox"
                                  aria-label="选择本页可选行"
                                  .checked=${allChecked}
                                  ?disabled=${selectable.length === 0}
                                  @change=${(event: Event) =>
                                      selection.onToggleAll(
                                          selectable,
                                          (event.target as HTMLInputElement).checked,
                                      )}
                              />
                          </th>`
                        : nothing}
                    ${columns.map(
                        (column) =>
                            html`<th
                                style=${column.width ? `width:${column.width}` : ''}
                                data-align=${column.align ?? 'left'}
                            >
                                ${column.title}
                            </th>`,
                    )}
                </tr>
            </thead>
            <tbody>
                ${rows.length === 0
                    ? html`<tr>
                          <td class="mf-empty" colspan=${columns.length + (selection ? 1 : 0)}>
                              ${options.empty ?? '暂无数据'}
                          </td>
                      </tr>`
                    : rows.map((row) => {
                          const item = key(row)
                          const reason = selection?.disabledReason(item) ?? ''
                          const checked = Boolean(selection?.selected.has(item))
                          return html`<tr
                              data-row-key=${item}
                              data-state=${options.rowState?.(row) ?? ''}
                              ?data-selected=${checked}
                              ?data-disabled=${Boolean(reason)}
                          >
                              ${selection
                                  ? html`<td class="mf-check">
                                        <input
                                            type="checkbox"
                                            aria-label=${reason
                                                ? `不可选择：${reason}`
                                                : '选择此行'}
                                            title=${reason}
                                            .checked=${checked}
                                            ?disabled=${Boolean(reason)}
                                            @change=${(event: Event) =>
                                                selection.onToggle(
                                                    item,
                                                    (event.target as HTMLInputElement).checked,
                                                )}
                                        />
                                    </td>`
                                  : nothing}
                              ${columns.map(
                                  (column) =>
                                      html`<td data-align=${column.align ?? 'left'}>
                                          ${column.cell(row)}
                                      </td>`,
                              )}
                          </tr>`
                      })}
            </tbody>
        </table>
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
            ? html`<select
                  class="mf-page-size"
                  aria-label="每页条数"
                  .value=${live(String(p.pageSize))}
                  ?disabled=${busy}
                  @change=${(event: Event) =>
                      p.onPageSize?.(Number((event.target as HTMLSelectElement).value))}
              >
                  ${p.pageSizes.map(
                      (size) => html`<option value=${String(size)}>${size} / page</option>`,
                  )}
              </select>`
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
