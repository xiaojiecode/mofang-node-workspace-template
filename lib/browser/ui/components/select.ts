import { trackPopoverAnchor, popoverViewport } from './popover-anchor'
import { html, nothing } from 'lit'
import { fieldLabel } from './form'
import type { FieldProps } from './form'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { ref } from 'lit/directives/ref.js'

export type SelectOption = Readonly<{ value: string; label: string; disabled?: boolean }>
export type SelectFieldProps = FieldProps &
    Readonly<{
        name: string
        label: string
        value: string
        options: readonly SelectOption[]
        hint?: string
        readOnly?: boolean
        ariaLabel?: string
        labelHidden?: boolean
        onChange?: (value: string | undefined) => void
    }>

let sequence = 0

/** 保留受控回调；仅下拉的展开、高亮与键盘查找属于组件内部状态。 */
class SelectDirective extends AsyncDirective {
    private readonly id = `mf-select-${++sequence}`
    private props!: SelectFieldProps
    private trigger: HTMLButtonElement | undefined
    private menu: HTMLElement | undefined
    private opened = false
    private active = 0
    private query = ''
    private typedAt = 0
    private owner: Window | undefined
    private stopTracking: (() => void) | undefined
    private readonly bindTrigger = (element?: Element) => {
        this.trigger = element as HTMLButtonElement | undefined
    }
    private readonly bindMenu = (element?: Element) => {
        this.menu = element as HTMLElement | undefined
    }

    override render(p: SelectFieldProps) {
        if (!this.props || p.value !== this.props.value || p.options !== this.props.options) {
            const selected = p.options.findIndex(
                (option) => option.value === p.value && !option.disabled,
            )
            this.active =
                selected >= 0 ? selected : p.options.findIndex((option) => !option.disabled)
        }
        this.props = p
        if (this.disabled) this.opened = false
        queueMicrotask(() => this.sync())
        return this.template()
    }
    private get disabled() {
        return (
            this.props.readOnly ||
            !this.props.onChange ||
            !this.props.options.some((option) => !option.disabled)
        )
    }
    private repaint(reveal = false) {
        if (!this.isConnected) return
        this.setValue(this.template())
        queueMicrotask(() => {
            this.sync()
            if (reveal && this.opened)
                this.menu
                    ?.querySelector<HTMLElement>('[data-active]')
                    ?.scrollIntoView({ block: 'nearest' })
        })
    }
    private close() {
        this.opened = false
        this.release()
        this.repaint()
    }
    private choose(index: number) {
        const option = this.props.options[index]
        if (this.disabled || !option || option.disabled) return
        this.props.onChange?.(option.value === '' ? undefined : option.value)
        this.close()
        this.trigger?.focus()
    }
    private key(event: KeyboardEvent) {
        if (this.disabled) return
        const enabled = this.props.options
            .map((option, index) => ({ option, index }))
            .filter((item) => !item.option.disabled)
        if (!enabled.length) return
        if (event.key === 'Tab') {
            if (this.opened) this.close()
            return
        }
        if (event.key === 'Escape') {
            if (this.opened) {
                event.preventDefault()
                event.stopPropagation()
                this.close()
            }
            return
        }
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault()
            if (this.opened) this.choose(this.active)
            else {
                this.opened = true
                this.repaint(true)
            }
            return
        }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            let index = enabled.findIndex((item) => item.index === this.active)
            if (event.key === 'Home') index = 0
            else if (event.key === 'End') index = enabled.length - 1
            else if (this.opened)
                index =
                    (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length
            else if (index < 0) index = 0
            this.active = enabled[index]!.index
            this.opened = true
            this.repaint(true)
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const now = Date.now()
            this.query =
                (now - this.typedAt > 700 ? '' : this.query) + event.key.toLocaleLowerCase()
            this.typedAt = now
            const match = enabled.find((item) =>
                item.option.label.toLocaleLowerCase().startsWith(this.query),
            )
            if (match) {
                event.preventDefault()
                this.active = match.index
                this.opened = true
                this.repaint(true)
            }
        }
    }
    private readonly position = () => {
        if (!this.opened || !this.trigger || !this.menu || !this.owner) return
        const rect = this.trigger.getBoundingClientRect()
        const viewport = popoverViewport(this.owner)
        if (
            rect.bottom <= viewport.top ||
            rect.top >= viewport.bottom ||
            rect.right <= viewport.left ||
            rect.left >= viewport.right
        ) {
            this.close()
            return
        }
        const below = viewport.bottom - rect.bottom - 8
        const above = rect.top - viewport.top - 8
        const upward = below < 180 && above > below
        const height = Math.max(0, Math.min(256, upward ? above : below))
        const width = Math.max(0, Math.min(Math.max(rect.width, 128), viewport.width - 16))
        Object.assign(this.menu.style, {
            width: `${width}px`,
            maxHeight: `${height}px`,
            left: `${Math.max(viewport.left + 8, Math.min(rect.left, viewport.right - width - 8))}px`,
            top: upward ? 'auto' : `${rect.bottom + 4}px`,
            bottom: upward ? `${this.owner.innerHeight - rect.top + 4}px` : 'auto',
        })
    }
    private sync() {
        if (!this.isConnected || !this.menu?.isConnected) return
        if (!this.opened) {
            if (this.menu.matches(':popover-open')) this.menu.hidePopover()
            this.release()
            return
        }
        if (!this.stopTracking && this.trigger) {
            this.owner = this.trigger.ownerDocument.defaultView ?? undefined
            this.stopTracking = trackPopoverAnchor(this.trigger, this.position)
        }
        this.position()
        if (this.opened && !this.menu.matches(':popover-open')) this.menu.showPopover()
    }
    private release() {
        this.stopTracking?.()
        this.stopTracking = undefined
        this.owner = undefined
    }
    protected override disconnected() {
        this.opened = false
        if (this.menu?.matches(':popover-open')) this.menu.hidePopover()
        this.release()
    }
    protected override reconnected() {
        this.repaint()
    }
    private template() {
        const p = this.props,
            selected = p.options.find((option) => option.value === p.value)
        const describedBy = [p.hint ? `${this.id}-hint` : '', p.error ? `${this.id}-error` : '']
            .filter(Boolean)
            .join(' ')
        return html`<div class="mf-field" data-compact=${p.compact ?? false}>
            <span class=${p.labelHidden ? 'mf-sr-only' : 'mf-label'} id=${`${this.id}-label`}
                >${fieldLabel(p)}</span
            >
            <div class="mf-select">
                <input type="hidden" name=${p.name} .value=${p.value} ?disabled=${this.disabled} />
                <button
                    type="button"
                    class="mf-select-trigger"
                    role="combobox"
                    ${ref(this.bindTrigger)}
                    aria-label=${p.ariaLabel ?? nothing}
                    aria-labelledby=${p.ariaLabel ? nothing : `${this.id}-label`}
                    aria-describedby=${describedBy || nothing}
                    aria-invalid=${p.error ? 'true' : nothing}
                    aria-controls=${this.id}
                    aria-expanded=${this.opened}
                    aria-haspopup="listbox"
                    aria-required=${p.required ? 'true' : nothing}
                    aria-activedescendant=${this.opened && this.active >= 0
                        ? `${this.id}-${this.active}`
                        : nothing}
                    ?disabled=${this.disabled}
                    @keydown=${(event: KeyboardEvent) => this.key(event)}
                    @click=${() => {
                        if (!this.disabled) {
                            this.opened = !this.opened
                            this.repaint(true)
                        }
                    }}
                >
                    <span>${selected?.label ?? '请选择'}</span
                    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <div
                    class="mf-select-menu"
                    id=${this.id}
                    role="listbox"
                    aria-label=${p.label}
                    popover="auto"
                    aria-hidden=${this.opened ? nothing : 'true'}
                    ?inert=${!this.opened}
                    ${ref(this.bindMenu)}
                    @toggle=${(event: Event) => {
                        if ((event as ToggleEvent).newState === 'closed' && this.opened)
                            this.close()
                    }}
                >
                    ${p.options.map(
                        (option, index) =>
                            html`<div
                                class="mf-select-option"
                                id=${`${this.id}-${index}`}
                                role="option"
                                aria-selected=${option.value === p.value}
                                aria-disabled=${Boolean(option.disabled)}
                                ?data-active=${index === this.active}
                                @pointerdown=${(event: PointerEvent) => event.preventDefault()}
                                @pointermove=${() => {
                                    if (!option.disabled && this.active !== index) {
                                        this.active = index
                                        this.repaint()
                                    }
                                }}
                                @click=${() => this.choose(index)}
                            >
                                ${option.label}
                                ${option.value === p.value
                                    ? html`<svg viewBox="0 0 24 24" aria-hidden="true">
                                          <path d="m5 12 4 4L19 6" />
                                      </svg>`
                                    : nothing}
                            </div>`,
                    )}
                </div>
            </div>
            ${p.hint
                ? html`<span class="mf-hint" id=${`${this.id}-hint`}>${p.hint}</span>`
                : nothing}
            ${p.error
                ? html`<span class="mf-field-error" role="alert" id=${`${this.id}-error`}
                      >${p.error}</span
                  >`
                : nothing}
        </div>`
    }
}
const renderSelect = /* @__PURE__ */ directive(SelectDirective)

/** 统一客户端选择器视觉的受控字段；自绘顶层列表保留空值删除语义。 */
export function selectField(p: SelectFieldProps) {
    return html`${renderSelect(p)}`
}
