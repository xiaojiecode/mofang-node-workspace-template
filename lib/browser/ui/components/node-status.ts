import { css, html, nothing } from 'lit'
import { button } from './controls'

export type NodeStatusProps = Readonly<{
    title: string
    description?: string
    tone?: 'info' | 'success' | 'warning' | 'error'
    action?: Readonly<{
        label: string
        disabled?: boolean
        onClick: () => void
    }>
}>

/** 节点提示条只展示调用方传入的状态及操作，不自行推断节点状态或执行恢复。 */
export function nodeStatus(p: NodeStatusProps) {
    return html`<div
        class="mf-node-status"
        data-tone=${p.tone ?? 'info'}
        role=${p.tone === 'error' ? 'alert' : 'status'}
    >
        <p class="mf-node-status__copy">
            <strong>${p.title}</strong>
            ${p.description ? html`<span>${p.description}</span>` : nothing}
        </p>
        ${p.action
            ? html`<div class="mf-node-status__action">
                  ${button({
                      label: p.action.label,
                      disabled: p.action.disabled ?? false,
                      onClick: p.action.onClick,
                      variant: 'secondary',
                      size: 'small',
                  })}
              </div>`
            : nothing}
    </div>`
}

/** 淡色提示与操作按钮沿用原型，长文案在容器内换行。 */
export const nodeStatusStyles = /* @__PURE__ */ (() => css`
    .mf-node-status {
        --mf-node-status-accent: #1677ff;
        box-sizing: border-box;
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border: 1px solid #d6e4ff;
        border-radius: 6px;
        background: #f7fbff;
    }
    .mf-node-status[data-tone='success'] {
        --mf-node-status-accent: #237804;
        border-color: #d9efcf;
        background: #f7fff3;
    }
    .mf-node-status[data-tone='warning'] {
        --mf-node-status-accent: #ad4e00;
        border-color: #ffe0a3;
        background: #fffbf2;
    }
    .mf-node-status[data-tone='error'] {
        --mf-node-status-accent: #cf1322;
        border-color: #ffccc7;
        background: #fff5f5;
    }
    .mf-node-status__copy {
        display: flex;
        min-width: 0;
        flex: 1;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 8px;
        margin: 0;
        line-height: 20px;
        overflow-wrap: anywhere;
    }
    .mf-node-status__copy strong {
        color: var(--mf-node-status-accent);
        font-size: 13px;
        font-weight: 600;
    }
    .mf-node-status__copy span {
        min-width: 0;
        color: #6b6862;
        font-size: 12px;
    }
    .mf-node-status__action {
        flex: 0 0 auto;
    }
    .mf-node-status__action .mf-button {
        min-height: 28px;
        height: 28px;
        padding: 0 12px;
        border: 1px solid #d6e4ff;
        border-radius: 6px;
        background: #fff;
        color: #1677ff;
        font-size: 12px;
    }
    .mf-node-status__action .mf-button:hover:not(:disabled) {
        border-color: #91caff;
        background: #eaf4ff;
    }
`)()
