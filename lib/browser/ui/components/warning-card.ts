import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'

export type WarningCardProps = Readonly<{
    title: string
    description: string
    tone?: 'warning' | 'error'
    icon?: TemplateResult
    actions?: TemplateResult
}>

/** 可复用的警告卡片；状态原因与处理承诺由调用方明确提供。 */
export function warningCard(p: WarningCardProps) {
    return html`<section
        class="mf-warning-card"
        data-tone=${p.tone ?? 'warning'}
        role=${p.tone === 'error' ? 'alert' : 'status'}
    >
        <span class="mf-warning-card__icon" aria-hidden="true">
            ${p.icon ??
            html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.5 13a2 2 0 0 1-1.7 3H4.5a2 2 0 0 1-1.7-3Z" />
                <path d="M12 9v4" stroke-linecap="round" />
                <circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none" />
            </svg>`}
        </span>
        <div class="mf-warning-card__copy">
            <strong>${p.title}</strong>
            <p>${p.description}</p>
            ${p.actions ? html`<div class="mf-warning-card__actions">${p.actions}</div>` : nothing}
        </div>
    </section>`
}

/** 警告使用文字与图标共同表达，独立用于节点状态或其它业务卡片。 */
export const warningCardStyles = /* @__PURE__ */ (() => css`
    .mf-warning-card {
        --mf-warning-accent: #d46b08;
        box-sizing: border-box;
        display: flex;
        min-width: 0;
        align-items: flex-start;
        gap: 8px;
        padding: 10px;
        border: 1px solid #ffe0a3;
        border-radius: 7px;
        background: #fffaf1;
    }
    .mf-warning-card[data-tone='error'] {
        --mf-warning-accent: #cf1322;
        border-color: #ffccc7;
        background: #fff5f5;
    }
    .mf-warning-card__icon {
        display: flex;
        width: 16px;
        height: 20px;
        flex: 0 0 16px;
        align-items: center;
        color: var(--mf-warning-accent);
    }
    .mf-warning-card__icon svg {
        width: 16px;
        height: 16px;
    }
    .mf-warning-card__copy {
        min-width: 0;
        flex: 1;
        overflow-wrap: anywhere;
    }
    .mf-warning-card__copy strong {
        display: block;
        color: var(--mf-warning-accent);
        font-size: 12px;
        font-weight: 600;
        line-height: 20px;
    }
    .mf-warning-card__copy p {
        margin: 2px 0 0;
        color: #68645f;
        font-size: 11px;
        line-height: 18px;
    }
    .mf-warning-card__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
    }
`)()
