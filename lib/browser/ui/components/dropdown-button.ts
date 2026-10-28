import { css, html, nothing } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { ref } from 'lit/directives/ref.js'
import { button } from './controls'
import type { ButtonProps } from './controls'
import { popoverViewport, trackPopoverAnchor } from './popover-anchor'

export type DropdownButtonItem = Readonly<{
    id: string
    label: string
    onSelect: () => void
    disabled?: boolean
    disabledReason?: string
}>
export type DropdownButtonProps = Readonly<{
    label: string
    items: readonly DropdownButtonItem[]
    disabled?: boolean
    variant?: ButtonProps['variant']
    size?: ButtonProps['size']
    align?: 'start' | 'end'
}>

let sequence = 0

/** 动作菜单只持有展开与焦点状态，业务选择由调用方处理。 */
class DropdownButtonDirective extends AsyncDirective {
    private readonly id = `mf-dropdown-${++sequence}`
    private props!: DropdownButtonProps
    private root: HTMLElement | undefined
    private trigger: HTMLButtonElement | undefined
    private menu: HTMLElement | undefined
    private opened = false
    private active = 0
    private stopTracking: (() => void) | undefined
    private readonly bindRoot = (element?: Element) => {
        this.root = element as HTMLElement | undefined
    }
    private readonly bindMenu = (element?: Element) => {
        this.menu = element as HTMLElement | undefined
    }

    override render(props: DropdownButtonProps) {
        this.props = props
        if (props.disabled || !props.items.some((item) => !this.disabled(item))) this.opened = false
        queueMicrotask(() => this.sync())
        return this.template()
    }

    private disabled(item: DropdownButtonItem) {
        return Boolean(item.disabled || item.disabledReason)
    }

    private repaint(focus = false) {
        if (!this.isConnected) return
        this.setValue(this.template())
        queueMicrotask(() => {
            this.sync()
            if (focus && this.opened)
                this.menu
                    ?.querySelector<HTMLButtonElement>(`[data-index="${this.active}"]`)
                    ?.focus()
        })
    }

    private close(restoreFocus = false) {
        this.opened = false
        this.stopTracking?.()
        this.stopTracking = undefined
        this.repaint()
        if (restoreFocus) this.trigger?.focus()
    }

    private open(last = false) {
        if (this.props.disabled) return
        const enabled = this.props.items
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => !this.disabled(item))
        if (!enabled.length) return
        this.active = (last ? enabled.at(-1) : enabled[0])!.index
        this.opened = true
        this.repaint(true)
    }

    private choose(index: number) {
        const item = this.props.items[index]
        if (this.props.disabled || !item || this.disabled(item)) return
        this.close(true)
        item.onSelect()
    }

    private key(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.opened) {
            event.preventDefault()
            event.stopPropagation()
            this.close(true)
            return
        }
        if (event.key === 'Tab') {
            if (this.opened) this.close()
            return
        }
        if (this.props.disabled) return
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault()
            if (this.opened && this.menu?.contains(event.target as Node)) this.choose(this.active)
            else if (this.opened) this.close(true)
            else this.open()
            return
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        if (!this.opened) {
            this.open(event.key === 'ArrowUp' || event.key === 'End')
            return
        }
        const enabled = this.props.items
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => !this.disabled(item))
        if (!enabled.length) return
        let index = enabled.findIndex((item) => item.index === this.active)
        if (event.key === 'Home') index = 0
        else if (event.key === 'End') index = enabled.length - 1
        else
            index = (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length
        this.active = enabled[index]!.index
        this.repaint(true)
    }

    private readonly position = () => {
        if (!this.trigger || !this.menu || !this.opened) return
        const owner = this.trigger.ownerDocument.defaultView
        if (!owner) return
        const bounds = this.trigger.getBoundingClientRect()
        const viewport = popoverViewport(owner)
        if (
            bounds.bottom <= viewport.top ||
            bounds.top >= viewport.bottom ||
            bounds.right <= viewport.left ||
            bounds.left >= viewport.right
        ) {
            this.close()
            return
        }
        const width = Math.min(Math.max(168, bounds.width), viewport.width - 16)
        const below = viewport.bottom - bounds.bottom - 8
        const above = bounds.top - viewport.top - 8
        const upward = below < Math.min(this.menu.scrollHeight, 180) && above > below
        const left = this.props.align === 'end' ? bounds.right - width : bounds.left
        Object.assign(this.menu.style, {
            width: `${width}px`,
            maxHeight: `${Math.max(0, Math.min(280, upward ? above : below))}px`,
            left: `${Math.max(viewport.left + 8, Math.min(left, viewport.right - width - 8))}px`,
            top: upward ? 'auto' : `${bounds.bottom + 4}px`,
            bottom: upward ? `${owner.innerHeight - bounds.top + 4}px` : 'auto',
        })
    }

    private sync() {
        if (!this.isConnected || !this.menu?.isConnected) return
        this.trigger = this.root?.querySelector<HTMLButtonElement>('.mf-button') ?? undefined
        this.trigger?.setAttribute('aria-haspopup', 'menu')
        if (!this.opened) {
            if (this.menu.matches(':popover-open')) this.menu.hidePopover()
            this.stopTracking?.()
            this.stopTracking = undefined
            return
        }
        if (!this.stopTracking && this.trigger)
            this.stopTracking = trackPopoverAnchor(this.trigger, this.position)
        this.position()
        if (this.opened && !this.menu.matches(':popover-open')) this.menu.showPopover()
    }

    protected override disconnected() {
        this.opened = false
        if (this.menu?.matches(':popover-open')) this.menu.hidePopover()
        this.stopTracking?.()
        this.stopTracking = undefined
    }

    protected override reconnected() {
        this.repaint()
    }

    private template() {
        const props = this.props
        return html`<span
            class="mf-dropdown"
            ${ref(this.bindRoot)}
            @keydown=${(event: KeyboardEvent) => this.key(event)}
            @keyup=${(event: KeyboardEvent) => {
                if (event.key === ' ') {
                    event.preventDefault()
                    event.stopPropagation()
                }
            }}
        >
            ${button({
                label: props.label,
                variant: props.variant ?? 'secondary',
                size: props.size ?? 'normal',
                disabled: props.disabled || !props.items.some((item) => !this.disabled(item)),
                expanded: this.opened,
                controls: this.id,
                onClick: () => (this.opened ? this.close(true) : this.open()),
            })}
            <div
                class="mf-dropdown-menu"
                role="menu"
                aria-label=${props.label}
                id=${this.id}
                popover="auto"
                aria-hidden=${this.opened ? nothing : 'true'}
                ?inert=${!this.opened}
                ${ref(this.bindMenu)}
                @beforetoggle=${(event: Event) => {
                    if ((event as ToggleEvent).newState === 'closed' && this.opened) this.close()
                }}
            >
                ${props.items.map(
                    (item, index) =>
                        html`<button
                            type="button"
                            class="mf-dropdown-item"
                            role="menuitem"
                            data-index=${index}
                            tabindex=${this.opened && this.active === index ? 0 : -1}
                            title=${item.disabledReason ?? ''}
                            ?disabled=${this.disabled(item)}
                            @focus=${() => {
                                this.active = index
                            }}
                            @click=${() => this.choose(index)}
                        >
                            ${item.label}
                        </button>`,
                )}
            </div>
        </span>`
    }
}
const renderDropdown = /* @__PURE__ */ directive(DropdownButtonDirective)

/** 内置动作下拉沿用按钮基座和顶层浮层，不保存业务状态。 */
export function dropdownButton(props: DropdownButtonProps) {
    return html`${renderDropdown(props)}`
}

export const dropdownButtonStyles = /* @__PURE__ */ (() => css`
    .mf-dropdown {
        display: inline-flex;
    }
    .mf-dropdown > .mf-button::after {
        content: '';
        width: 5px;
        height: 5px;
        border-right: 1px solid currentColor;
        border-bottom: 1px solid currentColor;
        transform: translateY(-2px) rotate(45deg);
        margin-left: 7px;
    }
    .mf-dropdown > .mf-button[aria-expanded='true']::after {
        transform: translateY(1px) rotate(225deg);
    }
    .mf-dropdown-menu {
        position: fixed;
        inset: auto;
        margin: 0;
        padding: 5px;
        border: 1px solid var(--mf-line, #e5e8ed);
        border-radius: 6px;
        color: var(--mf-fg, #2f2c29);
        background: var(--mf-bg, #fff);
        box-shadow: 0 8px 24px #0002;
        overflow: auto;
        box-sizing: border-box;
    }
    .mf-dropdown-menu:popover-open {
        display: grid;
        gap: 2px;
    }
    .mf-dropdown-item {
        display: block;
        width: 100%;
        padding: 8px 10px;
        border: 0;
        border-radius: 4px;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 13px;
        text-align: left;
        cursor: pointer;
    }
    .mf-dropdown-item:hover:not(:disabled),
    .mf-dropdown-item:focus-visible {
        background: var(--mf-hover, #f3f6fa);
        outline: none;
    }
    .mf-dropdown-item:disabled {
        color: var(--mf-muted, #9ca3af);
        cursor: not-allowed;
    }
`)()
