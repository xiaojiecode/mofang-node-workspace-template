import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'

export type CardProps = Readonly<{
    title?: string
    description?: string
    variant?: 'default' | 'compact'
    selected?: boolean
    onClick?: () => void
    icon?: TemplateResult
    actions?: TemplateResult
}>

/** 白底卡片容器；标题和操作区可选，内部使用 Section 分组，避免重复嵌套卡片。 */
export function card(p: CardProps, content: TemplateResult) {
    return html`<section
        class="mf-card"
        data-card-variant=${p.variant ?? 'default'}
        data-clickable=${Boolean(p.onClick && p.title)}
        data-selected=${p.selected ?? false}
        aria-label=${p.title ?? nothing}
    >
        ${p.title || p.description || p.actions || p.icon
            ? html`<header class="mf-card-heading">
                  ${p.icon ? html`<span class="mf-card-icon">${p.icon}</span>` : nothing}
                  <div>
                      ${p.title
                          ? html`<h3>
                                ${p.onClick
                                    ? html`<button
                                          class="mf-card-title-button"
                                          type="button"
                                          @click=${p.onClick}
                                      >
                                          ${p.title}
                                      </button>`
                                    : p.title}
                            </h3>`
                          : nothing}
                      ${p.description ? html`<p class="mf-hint">${p.description}</p>` : nothing}
                  </div>
                  ${p.actions ? html`<div class="mf-toolbar">${p.actions}</div>` : nothing}
              </header>`
            : nothing}
        <div class="mf-card-body">${content}</div>
    </section>`
}
