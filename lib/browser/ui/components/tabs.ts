import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { fade } from './transition'

export type TabItem = Readonly<{
    value: string
    label: string
    content: TemplateResult
    disabled?: boolean
}>
export type TabsProps = Readonly<{
    /** 同一 ShadowRoot 内稳定且唯一的标识。 */
    id: string
    label: string
    value: string
    items: readonly TabItem[]
    onChange: (value: string) => void
}>

/** 受控页签；方向键/Home/End 切换，所有内容按 key 保留，隐藏页不参与焦点导航。 */
export function tabs(p: TabsProps) {
    const enabled = p.items.filter((item) => !item.disabled)
    const active = enabled.find((item) => item.value === p.value)?.value ?? enabled[0]?.value
    const prefix = `mf-tabs-${encodeURIComponent(p.id)}`
    const id = (value: string) => `${prefix}-${encodeURIComponent(value)}`
    return html`<div class="mf-tabs">
        <div class="mf-tab-list" role="tablist" aria-label=${p.label}>
            ${repeat(
                p.items,
                (item) => item.value,
                (item) =>
                    html`<button
                        class="mf-tab"
                        type="button"
                        role="tab"
                        id=${`${id(item.value)}-tab`}
                        aria-controls=${`${id(item.value)}-panel`}
                        aria-selected=${item.value === active}
                        tabindex=${item.value === active ? 0 : -1}
                        ?disabled=${item.disabled}
                        @click=${() => {
                            if (!item.disabled) p.onChange(item.value)
                        }}
                        @keydown=${(event: KeyboardEvent) => {
                            if (
                                !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) ||
                                !enabled.length
                            )
                                return
                            event.preventDefault()
                            const current = enabled.findIndex((tab) => tab.value === item.value)
                            const next =
                                event.key === 'Home'
                                    ? 0
                                    : event.key === 'End'
                                      ? enabled.length - 1
                                      : (current +
                                            (event.key === 'ArrowRight' ? 1 : -1) +
                                            enabled.length) %
                                        enabled.length
                            const value = enabled[next]!.value
                            p.onChange(value)
                            const root = (event.currentTarget as HTMLElement).getRootNode() as
                                | Document
                                | ShadowRoot
                            root.getElementById(`${id(value)}-tab`)?.focus()
                        }}
                    >
                        ${item.label}
                    </button>`,
            )}
        </div>
        ${repeat(
            p.items,
            (item) => item.value,
            (item) =>
                html`<div
                    class="mf-tab-panel"
                    id=${`${id(item.value)}-panel`}
                    role="tabpanel"
                    aria-labelledby=${`${id(item.value)}-tab`}
                    ?hidden=${item.value !== active}
                    ?inert=${item.value !== active}
                    tabindex=${item.value === active ? 0 : nothing}
                >
                    ${fade({ show: item.value === active, duration: 160 }, item.content)}
                </div>`,
        )}
    </div>`
}
