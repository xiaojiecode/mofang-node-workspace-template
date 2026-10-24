import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { styleMap } from 'lit/directives/style-map.js'
import { collapse } from './transition'

export type TextProps = Readonly<{
    value: string | number
    tone?: 'default' | 'muted' | 'danger' | 'success'
    size?: 'small' | 'body' | 'title'
    weight?: 'normal' | 'medium'
    numeric?: boolean
    /** 超出行数后截断；展开入口保留全文，默认不截断。 */
    lines?: number
}>

/** 统一文字层级；截断时用原生 details 提供可键盘操作的全文入口。 */
export function text(p: TextProps) {
    const content = html`<span
        class="mf-text"
        data-tone=${p.tone ?? 'default'}
        data-size=${p.size ?? 'body'}
        data-weight=${p.weight ?? 'normal'}
        ?data-numeric=${p.numeric}
        >${p.value}</span
    >`
    return p.lines && p.lines > 0
        ? html`<details
              class="mf-text-expand"
              style=${styleMap({ '--mf-text-lines': String(p.lines) })}
          >
              <summary title=${String(p.value)} aria-label=${`展开或收起完整内容：${p.value}`}>
                  ${content}
              </summary>
          </details>`
        : content
}

export type UrlProps = Readonly<{
    href?: string
    label?: string
    newTab?: boolean
}>

/** 业务链接只接受完整 HTTP(S) 地址；无效地址以普通文字显示。 */
export function linkAddress(value: string | undefined): string | undefined {
    if (!value?.trim()) return undefined
    try {
        const parsed = new URL(value.trim())
        return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : undefined
    } catch {
        return undefined
    }
}

/** 可读的业务链接，默认新窗口打开；不把文本当 HTML 或执行协议。 */
export function url(p: UrlProps) {
    const href = linkAddress(p.href)
    const label = p.label ?? p.href ?? '—'
    return href
        ? html`<a
              class="mf-link"
              href=${href}
              title=${p.href ?? ''}
              target=${p.newTab === false ? nothing : '_blank'}
              rel=${p.newTab === false ? nothing : 'noopener noreferrer'}
              >${label}</a
          >`
        : html`<span class="mf-text" data-tone="muted" title=${p.href ? '链接地址不可用' : ''}
              >${label}</span
          >`
}

export type SectionProps = Readonly<{
    title: string
    label?: string
    description?: string
    actions?: TemplateResult
    /** 仅折叠展示；默认展开状态由浏览器在本组件存活期间保留。 */
    collapsible?: boolean
}>

/** 保留原生 summary 的键盘入口，仅由用户点击驱动折叠；刷新内容不重播。 */
class CollapsibleSection extends AsyncDirective {
    private expanded = false
    private closing = false
    private props!: SectionProps
    private content!: TemplateResult
    override render(p: SectionProps, content: TemplateResult) {
        this.props = p
        this.content = content
        return this.template()
    }
    private template(): TemplateResult {
        const p = this.props
        return html`<details
            class="mf-section mf-section-collapse"
            .open=${this.expanded || this.closing}
        >
            <summary
                aria-expanded=${this.expanded}
                @click=${(event: Event) => {
                    event.preventDefault()
                    this.expanded = !this.expanded
                    this.closing = !this.expanded
                    this.setValue(this.template())
                }}
            >
                ${p.title}
            </summary>
            ${collapse(
                {
                    show: this.expanded,
                    duration: 180,
                    onHidden: () => {
                        if (!this.closing) return
                        this.closing = false
                        if (this.isConnected) this.setValue(this.template())
                    },
                },
                html`${p.description ? html`<p class="mf-hint">${p.description}</p>` : nothing}
                    ${p.actions ?? nothing}
                    <div class="mf-section-body">${this.content}</div>`,
            )}
        </details>`
    }
    protected override disconnected() {
        this.closing = false
    }
    protected override reconnected() {
        this.setValue(this.template())
    }
}
const collapsibleSection = directive(CollapsibleSection)

/** 区块标题与工具区共用布局，标题层级保持为 h3。 */
export function section(p: SectionProps, content: TemplateResult) {
    const heading = html`<div class="mf-section-heading">
        <div>
            <h3>${p.title}</h3>
            ${p.description ? html`<p class="mf-hint">${p.description}</p>` : nothing}
        </div>
        ${p.actions ? html`<div class="mf-toolbar">${p.actions}</div>` : nothing}
    </div>`
    return p.collapsible
        ? html`${collapsibleSection(p, content)}`
        : html`<section class="mf-section" aria-label=${p.label ?? p.title}>
              ${heading}
              <div class="mf-section-body">${content}</div>
          </section>`
}

/** 纯展示的状态标签；状态含义及文案由业务方提供。 */
export function badge(
    label: string,
    tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' = 'neutral',
) {
    return html`<span class="mf-badge" data-tone=${tone}>${label}</span>`
}

/** 空态同时保留原因和调用方提供的下一步，不自行触发请求。 */
export function emptyState(title: string, description = '', actions?: TemplateResult) {
    return html`<div class="mf-empty-state">
        <strong>${title}</strong> ${description ? html`<p>${description}</p>` : nothing}${actions ??
        nothing}
    </div>`
}
