import { trackPopoverAnchor, popoverViewport } from './popover-anchor'
import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { ref } from 'lit/directives/ref.js'
import { fieldLabel } from './form'
import type { FieldProps } from './form'

export type CascadeOption = Readonly<{
    value: string
    label: string
    disabled?: boolean
    children?: readonly CascadeOption[]
}>
export type CascaderProps = FieldProps &
    Readonly<{
        value: readonly string[]
        options: readonly CascadeOption[]
        placeholder?: string
        readOnly?: boolean
        onChange?: (path: readonly string[]) => void
    }>

let cascadeSequence = 0

type Path = Readonly<{ values: string[]; labels: string[] }>
/** 类目确认前的路径与搜索是局部草稿；取消、点外和 Escape 均恢复受控路径。 */
class CascaderDirective extends AsyncDirective {
    private props!: CascaderProps
    private draft: string[] = []
    private query = ''
    private opened = false
    private menu?: HTMLElement
    private trigger?: HTMLButtonElement
    private stopTracking: (() => void) | undefined
    private token = `cascade-${++cascadeSequence}`
    private readonly bindMenu = (element?: Element) => {
        this.menu = element as HTMLElement
    }
    private readonly bindTrigger = (element?: Element) => {
        this.trigger = element as HTMLButtonElement
    }
    private refresh() {
        this.setValue(this.render(this.props))
    }
    private paths(
        options = this.props.options,
        values: string[] = [],
        labels: string[] = [],
    ): Path[] {
        return options.flatMap((item) =>
            item.disabled
                ? []
                : [
                      { values: [...values, item.value], labels: [...labels, item.label] },
                      ...this.paths(
                          item.children ?? [],
                          [...values, item.value],
                          [...labels, item.label],
                      ),
                  ],
        )
    }
    private labels(values: readonly string[]) {
        let options = this.props.options
        return values.flatMap((value) => {
            const item = options.find((option) => option.value === value)
            options = item?.children ?? []
            return item ? [item.label] : []
        })
    }
    private close(restoreFocus = true) {
        this.opened = false
        this.release()
        if (this.menu?.matches(':popover-open')) this.menu.hidePopover()
        this.refresh()
        if (restoreFocus) this.trigger?.focus({ preventScroll: true })
    }
    private open() {
        if (this.props.readOnly || !this.props.onChange) return
        if (this.opened) {
            this.close()
            return
        }
        this.opened = true
        this.query = ''
        this.draft = [...this.props.value]
        this.refresh()
        queueMicrotask(() => {
            this.sync()
            if (this.opened) this.menu?.querySelector('input')?.focus({ preventScroll: true })
        })
    }
    private readonly position = () => {
        const owner = this.trigger?.ownerDocument.defaultView
        if (!this.opened || !this.trigger || !this.menu || !owner) return
        const rect = this.trigger.getBoundingClientRect()
        const viewport = popoverViewport(owner)
        if (
            rect.bottom <= viewport.top ||
            rect.top >= viewport.bottom ||
            rect.right <= viewport.left ||
            rect.left >= viewport.right
        ) {
            this.close(false)
            return
        }
        const width = Math.max(0, Math.min(Math.max(rect.width, 360), viewport.width - 32))
        const below = viewport.bottom - rect.bottom - 22
        const above = rect.top - viewport.top - 22
        // 先按自然正文量测，避免窄视口留下的旧上限让恢复视口后仍保持压缩高度。
        Object.assign(this.menu.style, {
            width: `${width}px`,
            minWidth: `${width}px`,
            maxHeight: '430px',
        })
        const desired = Math.min(430, this.menu.scrollHeight || 430)
        const upward = below < desired && above > below
        const height = Math.max(0, Math.min(desired, upward ? above : below))
        Object.assign(this.menu.style, {
            width: `${width}px`,
            minWidth: `${width}px`,
            maxHeight: `${height}px`,
            left: `${Math.max(viewport.left + 16, Math.min(rect.left, viewport.right - width - 16))}px`,
            top: upward ? 'auto' : `${rect.bottom + 6}px`,
            bottom: upward ? `${owner.innerHeight - rect.top + 6}px` : 'auto',
        })
    }
    private sync() {
        if (!this.isConnected || !this.menu?.isConnected) return
        if (!this.opened) {
            if (this.menu.matches(':popover-open')) this.menu.hidePopover()
            this.release()
            return
        }
        if (!this.stopTracking && this.trigger)
            this.stopTracking = trackPopoverAnchor(this.trigger, this.position)
        if (!this.menu.matches(':popover-open')) this.menu.showPopover()
        this.position()
    }
    private release() {
        this.stopTracking?.()
        this.stopTracking = undefined
    }
    override render(p: CascaderProps): TemplateResult {
        const changed = this.props && this.props.value !== p.value
        this.props = p
        if (changed && this.opened) this.draft = [...p.value]
        if ((p.readOnly || !p.onChange) && this.opened) {
            this.opened = false
            this.release()
        }
        queueMicrotask(() => this.sync())
        const columns: (readonly CascadeOption[])[] = [p.options]
        let current = p.options
        for (const value of this.draft) {
            const item = current.find((option) => option.value === value)
            current = item?.children ?? []
            if (current.length) columns.push(current)
        }
        const depth = Math.max(3, columns.length)
        const entries = this.paths()
        const results = entries.filter((item) =>
            item.labels.join(' / ').toLowerCase().includes(this.query.trim().toLowerCase()),
        )
        return html`<div class="mf-field mf-cascader-field" data-compact=${p.compact ?? false}>
            ${fieldLabel(p)}<button
                class="mf-input mf-cascader-trigger"
                type="button"
                role="combobox"
                aria-label=${p.label}
                aria-haspopup="dialog"
                aria-expanded=${this.opened}
                aria-controls=${`mf-cascade-${this.token}`}
                ?disabled=${p.readOnly || !p.onChange}
                ${ref(this.bindTrigger)}
                @click=${() => this.open()}
            >
                <span data-placeholder=${!p.value.length}
                    >${p.value.length
                        ? this.labels(p.value).join(' / ')
                        : (p.placeholder ?? '请选择')}</span
                ><svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path d="m4 6 4 4 4-4" />
                </svg>
            </button>
            <div
                class="mf-cascader-panel"
                popover="auto"
                aria-hidden=${this.opened ? nothing : 'true'}
                ?inert=${!this.opened}
                role="dialog"
                aria-label=${`${p.label}选择器`}
                id=${`mf-cascade-${this.token}`}
                ${ref(this.bindMenu)}
                @keydown=${(event: KeyboardEvent) => {
                    if (event.key === 'Escape') {
                        event.preventDefault()
                        event.stopPropagation()
                        this.close()
                    }
                }}
                @toggle=${(event: Event) => {
                    if ((event as ToggleEvent).newState === 'closed' && this.opened) {
                        this.opened = false
                        this.release()
                        this.refresh()
                    }
                }}
            >
                <div class="mf-cascader-search">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor">
                        <circle cx="7.5" cy="7.5" r="5" />
                        <path d="m11 11 4 4" /></svg
                    ><input
                        aria-label=${`搜索${p.label}`}
                        placeholder="搜索类目名称..."
                        .value=${this.query}
                        @input=${(event: Event) => {
                            this.query = (event.target as HTMLInputElement).value
                            this.refresh()
                        }}
                    />
                </div>
                ${this.query.trim()
                    ? html`<div class="mf-cascader-results">
                          ${results.length
                              ? results.map(
                                    (item) =>
                                        html`<button
                                            type="button"
                                            @click=${() => {
                                                this.draft = item.values
                                                this.query = ''
                                                this.refresh()
                                            }}
                                        >
                                            ${item.labels.join(' / ')}
                                        </button>`,
                                )
                              : html`<p class="mf-hint">未找到匹配的类目</p>`}
                      </div>`
                    : html`<div class="mf-cascader-path">
                              当前路径：<span
                                  >${this.labels(this.draft).join(' / ') ||
                                  '请从下方选择一级类目'}</span
                              >
                          </div>
                          <div class="mf-cascader-columns" style=${`--cascade-columns:${depth}`}>
                              ${Array.from(
                                  { length: depth },
                                  (_, level) =>
                                      html`<div class="mf-cascader-column">
                                          <strong
                                              >${['一级类目', '二级类目', '三级类目'][level] ??
                                              `第${level + 1}级`}</strong
                                          >
                                          <div
                                              class="mf-cascader-list"
                                              role="listbox"
                                              aria-label=${`${p.label}第${level + 1}级`}
                                              @keydown=${(event: KeyboardEvent) => {
                                                  const list = event.currentTarget as HTMLElement
                                                  const buttons = [
                                                      ...list.querySelectorAll<HTMLButtonElement>(
                                                          'button:not(:disabled)',
                                                      ),
                                                  ]
                                                  const active = buttons.indexOf(
                                                      event.target as HTMLButtonElement,
                                                  )
                                                  const next =
                                                      event.key === 'Home'
                                                          ? 0
                                                          : event.key === 'End'
                                                            ? buttons.length - 1
                                                            : event.key === 'ArrowDown'
                                                              ? Math.min(
                                                                    active + 1,
                                                                    buttons.length - 1,
                                                                )
                                                              : event.key === 'ArrowUp'
                                                                ? Math.max(active - 1, 0)
                                                                : -1
                                                  if (next >= 0) {
                                                      event.preventDefault()
                                                      buttons[next]?.focus()
                                                  }
                                                  if (event.key === 'ArrowRight') {
                                                      event.preventDefault()
                                                      ;(event.target as HTMLButtonElement).click()
                                                      queueMicrotask(() =>
                                                          this.menu
                                                              ?.querySelectorAll(
                                                                  '.mf-cascader-list',
                                                              )
                                                              [
                                                                  level + 1
                                                              ]?.querySelector<HTMLButtonElement>('button:not(:disabled)')
                                                              ?.focus(),
                                                      )
                                                  }
                                                  if (event.key === 'ArrowLeft') {
                                                      event.preventDefault()
                                                      this.menu
                                                          ?.querySelectorAll('.mf-cascader-list')
                                                          [
                                                              level - 1
                                                          ]?.querySelector<HTMLButtonElement>('button[aria-selected="true"],button:not(:disabled)')
                                                          ?.focus()
                                                  }
                                              }}
                                          >
                                              ${columns[level]?.length
                                                  ? columns[level]!.map(
                                                        (item) =>
                                                            html`<button
                                                                type="button"
                                                                role="option"
                                                                aria-selected=${this.draft[
                                                                    level
                                                                ] === item.value}
                                                                tabindex=${this.draft[level] ===
                                                                    item.value ||
                                                                (!this.draft[level] &&
                                                                    columns[level]?.find(
                                                                        (option) =>
                                                                            !option.disabled,
                                                                    )?.value === item.value)
                                                                    ? 0
                                                                    : -1}
                                                                ?disabled=${item.disabled}
                                                                @click=${() => {
                                                                    this.draft = [
                                                                        ...this.draft.slice(
                                                                            0,
                                                                            level,
                                                                        ),
                                                                        item.value,
                                                                    ]
                                                                    this.refresh()
                                                                }}
                                                            >
                                                                <span>${item.label}</span>${item
                                                                    .children?.length
                                                                    ? html`<svg
                                                                          viewBox="0 0 12 16"
                                                                          fill="none"
                                                                          stroke="currentColor"
                                                                      >
                                                                          <path d="m4 4 4 4-4 4" />
                                                                      </svg>`
                                                                    : nothing}
                                                            </button>`,
                                                    )
                                                  : html`<p class="mf-hint">请先选择上一级</p>`}
                                          </div>
                                      </div>`,
                              )}
                          </div>`}
                <div class="mf-cascader-footer">
                    <button
                        type="button"
                        ?disabled=${!p.value.length && !this.draft.length}
                        @click=${() => {
                            p.onChange?.([])
                            this.close()
                        }}
                    >
                        清空</button
                    ><span></span><button type="button" @click=${() => this.close()}>取消</button
                    ><button
                        class="is-primary"
                        type="button"
                        ?disabled=${!this.draft.length}
                        @click=${() => {
                            p.onChange?.([...this.draft])
                            this.close()
                        }}
                    >
                        确认选择
                    </button>
                </div>
            </div>
            ${p.error ? html`<span class="mf-field-error" role="alert">${p.error}</span>` : nothing}
        </div>`
    }
    override disconnected() {
        this.opened = false
        if (this.menu?.matches(':popover-open')) this.menu.hidePopover()
        this.release()
    }
    override reconnected() {
        this.refresh()
    }
}
const cascade = /* @__PURE__ */ directive(CascaderDirective)
export function cascaderField(p: CascaderProps) {
    return html`${cascade(p)}`
}

export const cascaderStyles = /* @__PURE__ */ (() => css`
    .mf-cascader-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        text-align: left;
        cursor: pointer;
    }
    .mf-cascader-trigger [data-placeholder='true'] {
        color: #7a818c;
    }
    .mf-cascader-trigger > svg {
        width: 15px;
        height: 15px;
        flex-shrink: 0;
        color: #8d939e;
    }
    .mf-cascader-panel {
        flex-direction: column;
        position: fixed;
        margin: 0;
        padding: 0;
        color: var(--mf-fg);
        border: 1px solid #dce1e8;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 6px 20px #0002;
        min-width: min(360px, calc(100vw - 32px));
        overflow: hidden;
    }
    .mf-cascader-panel:popover-open {
        display: flex;
    }
    .mf-cascader-search {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 12px;
        background: #fafbfc;
        border-bottom: 1px solid #e9edf2;
    }
    .mf-cascader-search svg {
        width: 16px;
        height: 16px;
        color: #929ba8;
    }
    .mf-cascader-search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        color: inherit;
        font: inherit;
    }
    .mf-cascader-path {
        padding: 9px 12px;
        background: #f7f9fc;
        font-size: 12px;
        color: #6e7785;
        border-bottom: 1px solid #e9edf2;
    }
    .mf-cascader-path span {
        color: #78818e;
    }
    .mf-cascader-columns {
        display: grid;
        grid-template-columns: repeat(var(--cascade-columns), minmax(0, 1fr));
        height: 210px;
        min-height: 0;
        flex: 1;
        overflow: auto;
    }
    .mf-cascader-column {
        min-width: 0;
        border-right: 1px solid #e9edf2;
        display: flex;
        flex-direction: column;
    }
    .mf-cascader-column:last-child {
        border: 0;
    }
    .mf-cascader-column strong {
        text-align: center;
        font-size: 12px;
        padding: 7px;
        color: #7c8593;
        background: #fafbfc;
        border-bottom: 1px solid #e9edf2;
    }
    .mf-cascader-list {
        max-height: 180px;
        overflow: auto;
        padding: 4px;
    }
    .mf-cascader-list button,
    .mf-cascader-results button {
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        padding: 8px;
        width: 100%;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }
    .mf-cascader-list button[aria-selected='true'] {
        color: #338fff;
        background: #f2f5fa;
    }
    .mf-cascader-list button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
    .mf-cascader-list button:hover,
    .mf-cascader-results button:hover {
        background: #f2f5fa;
    }
    .mf-cascader-list button svg {
        width: 12px;
        height: 16px;
        color: #98a1ae;
    }
    .mf-cascader-list p {
        padding: 46px 8px;
        text-align: center;
    }
    .mf-cascader-results {
        height: 210px;
        min-height: 0;
        flex: 1;
        max-height: 240px;
        overflow: auto;
        padding: 6px;
    }
    .mf-cascader-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 9px 12px;
        background: #fafbfc;
        border-top: 1px solid #e9edf2;
        flex-shrink: 0;
    }
    .mf-cascader-footer > span {
        flex: 1;
    }
    .mf-cascader-footer button {
        border: 1px solid #d9dee6;
        border-radius: 4px;
        background: #fff;
        color: #596474;
        padding: 5px 12px;
        font: inherit;
        cursor: pointer;
    }
    .mf-cascader-footer .is-primary {
        background: #338fff;
        border-color: #338fff;
        color: #fff;
    }
    .mf-cascader-footer button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
    .mf-cascader-panel button:focus-visible {
        outline: 2px solid #87bbff;
        outline-offset: -2px;
    }
`)()
