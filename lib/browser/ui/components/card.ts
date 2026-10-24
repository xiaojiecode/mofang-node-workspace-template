import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'

export type CardProps = Readonly<{
    title?: string
    description?: string
    actions?: TemplateResult
}>

/** 白底卡片容器；标题和操作区可选，内部使用 Section 分组，避免重复嵌套卡片。 */
export function card(p: CardProps, content: TemplateResult) {
    return html`<section class="mf-card" aria-label=${p.title ?? nothing}>
        ${p.title || p.description || p.actions
            ? html`<header class="mf-card-heading">
                  <div>
                      ${p.title ? html`<h3>${p.title}</h3>` : nothing}
                      ${p.description ? html`<p class="mf-hint">${p.description}</p>` : nothing}
                  </div>
                  ${p.actions ? html`<div class="mf-toolbar">${p.actions}</div>` : nothing}
              </header>`
            : nothing}
        <div class="mf-card-body">${content}</div>
    </section>`
}
