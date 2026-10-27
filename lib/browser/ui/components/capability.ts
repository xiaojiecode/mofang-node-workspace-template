import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { dialog } from './dialog'
import type { DialogProps } from './dialog'
import { footer } from './layout'
import { button } from './controls'

export type CapabilityCardProps = Readonly<{
    title: string
    description: string
    enabled: boolean
    required?: boolean
    disabled?: boolean
    disabledReason?: string
    onToggle?: (enabled: boolean) => void
    onConfigure?: () => void
}>

/** 能力卡展示选择与配置入口，不执行能力，不把必需项呈现为可关闭。 */
export function capabilityCard(p: CapabilityCardProps) {
    const toggle = () => {
        if (!p.required && !p.disabled) p.onToggle?.(!p.enabled)
    }
    return html`<div class="mf-capability" data-disabled=${p.disabled ?? false}>
        <div class="mf-capability-copy">
            <button
                class="mf-capability-title"
                type="button"
                ?disabled=${p.required || p.disabled || !p.onToggle}
                @click=${toggle}
            >
                ${p.title}
            </button>
            <p>${p.description}</p>
            ${p.disabledReason ? html`<small class="mf-hint">${p.disabledReason}</small>` : nothing}
        </div>
        <div class="mf-capability-actions">
            ${p.onConfigure && !p.disabled
                ? html`<button
                      class="mf-capability-config"
                      type="button"
                      aria-label=${`${p.title}详细配置`}
                      @click=${p.onConfigure}
                  >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M3 5h14M3 10h14M3 15h14" />
                          <path d="M7 2v6m6-1v6m-6-1v6" />
                      </svg>
                  </button>`
                : nothing}${!p.required
                ? html`<button
                      type="button"
                      class="mf-switch"
                      role="switch"
                      aria-label=${`切换${p.title}`}
                      aria-checked=${p.enabled}
                      ?disabled=${p.disabled || !p.onToggle}
                      @click=${toggle}
                  >
                      <span></span>
                  </button>`
                : nothing}
        </div>
    </div>`
}

export type CapabilityPanelProps = Omit<DialogProps, 'footer'> &
    Readonly<{ onConfirm: () => void; confirmDisabled?: boolean }>

/** 能力配置面板复用通用弹窗；调用方持有本次草稿并在确认后提交。 */
export function capabilityPanel(p: CapabilityPanelProps, content: TemplateResult) {
    return dialog(
        {
            ...p,
            footer: footer({
                actions: html`${button({
                    label: '取消',
                    onClick: () => p.onClose('cancel'),
                })}${button({
                    label: '确认',
                    variant: 'accent',
                    disabled: p.confirmDisabled ?? false,
                    onClick: p.onConfirm,
                })}`,
            }),
        },
        content,
    )
}

export const capabilityStyles = /* @__PURE__ */ (() => css`
    .mf-capability {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        border: 1px solid #e5e8ec;
        border-radius: 5px;
        padding: 14px 16px;
        background: #fff;
    }
    .mf-capability-copy {
        min-width: 0;
    }
    .mf-capability-copy p {
        color: #737b88;
        font-size: 12px;
        line-height: 1.6;
        margin-top: 5px;
    }
    .mf-capability-title {
        color: #30343b;
        font: inherit;
        font-weight: 600;
        background: transparent;
        padding: 0;
        border: 0;
        text-align: left;
        cursor: pointer;
    }
    .mf-capability-title:disabled {
        cursor: default;
    }
    .mf-capability-actions {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-shrink: 0;
    }
    .mf-capability[data-disabled='true'] {
        background: #fafafa;
        color: #89909b;
    }
    .mf-capability[data-disabled='true'] .mf-capability-title {
        color: #89909b;
    }
    .mf-capability-config {
        display: flex;
        padding: 4px;
        border: 1px solid #d9dce2;
        border-radius: 4px;
        background: #fff;
        color: #626c7b;
        cursor: pointer;
    }
    .mf-capability-config:hover {
        color: #338fff;
        border-color: #338fff;
    }
    .mf-capability-config svg {
        width: 15px;
        height: 15px;
    }
`)()
