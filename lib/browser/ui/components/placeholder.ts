import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'

export type NodePlaceholderProps = Readonly<{
    title: string
    description?: string
    /** 仅控制展示动效；真实节点状态和完成条件由调用方提供。 */
    animate?: boolean
    icon?: TemplateResult
    actions?: TemplateResult
}>

/** 调研图标沿用原型 research.svg 的轮廓，不注册额外组件或加载外部图片。 */
function researchIcon() {
    return html`<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path
            d="M12.1796 1.03493H3.82043C2.28894 1.03493 1.03493 2.28893 1.03493 3.82043V12.1796C1.03493 13.7111 2.28893 14.9651 3.82043 14.9651H12.1796C13.7111 14.9651 14.9651 13.7111 14.9651 12.1796V3.82043C14.9651 2.28893 13.7111 1.03493 12.1796 1.03493ZM6.26973 11.7874H4.54081V8.10004H6.26973V11.7874ZM8.81244 11.7874H7.0835V4.21265H8.81244V11.7874ZM11.4592 11.7874H9.73027V6.41648H11.4592V11.7874Z"
            fill="#36cfc9"
        />
    </svg>`
}

/** 结果容器占位；animate 独立控制轻微心跳，不根据标题文字推断业务状态。 */
export function nodePlaceholder(p: NodePlaceholderProps) {
    return html`<div class="mf-node-placeholder" ?data-animate=${p.animate} role="status">
        <span class="mf-node-placeholder__agent" aria-hidden="true">
            <span class="mf-node-placeholder__icon">${p.icon ?? researchIcon()}</span>
        </span>
        <p class="mf-node-placeholder__title">${p.title}</p>
        ${p.description
            ? html`<p class="mf-node-placeholder__description">${p.description}</p>`
            : nothing}
        ${p.actions ? html`<div class="mf-node-placeholder__actions">${p.actions}</div>` : nothing}
    </div>`
}

/** 占位尺寸与动效沿用原型；所有选择器限定于本组件。 */
export const nodePlaceholderStyles = /* @__PURE__ */ (() => css`
    .mf-node-placeholder {
        box-sizing: border-box;
        display: flex;
        min-width: 0;
        min-height: 210px;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 24px 16px;
        text-align: center;
    }
    .mf-node-placeholder__agent {
        position: relative;
        display: grid;
        flex: 0 0 72px;
        width: 72px;
        height: 72px;
        place-items: center;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 42%, #eaf4ff 0%, #f7fbff 68%, #fff 100%);
    }
    .mf-node-placeholder__agent::before,
    .mf-node-placeholder__agent::after {
        position: absolute;
        inset: 0;
        border: 1px solid rgb(24 144 255 / 18%);
        border-radius: inherit;
        content: '';
    }
    .mf-node-placeholder__agent::after {
        inset: -3px;
        border-color: rgb(24 144 255 / 5%);
    }
    .mf-node-placeholder__icon {
        position: relative;
        z-index: 1;
        display: grid;
        width: 34px;
        height: 34px;
        place-items: center;
    }
    .mf-node-placeholder__icon > svg {
        width: 100%;
        height: 100%;
    }
    .mf-node-placeholder__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        color: var(--mf-fg, #3d4047);
        font-size: 13px;
        line-height: 22px;
        overflow-wrap: anywhere;
    }
    .mf-node-placeholder__description {
        max-width: 50ch;
        margin: 0;
        color: var(--mf-muted, #6b7280);
        font-size: 12px;
        line-height: 20px;
        overflow-wrap: anywhere;
    }
    .mf-node-placeholder[data-animate] .mf-node-placeholder__agent::before,
    .mf-node-placeholder[data-animate] .mf-node-placeholder__agent::after {
        animation: mf-node-placeholder-heartbeat 1.6s ease-in-out infinite;
    }
    .mf-node-placeholder[data-animate] .mf-node-placeholder__icon {
        animation: mf-node-placeholder-heartbeat 1.6s ease-in-out infinite;
    }
    @keyframes mf-node-placeholder-heartbeat {
        0%,
        100% {
            opacity: 0.84;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.07);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-node-placeholder[data-animate] .mf-node-placeholder__agent::before,
        .mf-node-placeholder[data-animate] .mf-node-placeholder__agent::after,
        .mf-node-placeholder[data-animate] .mf-node-placeholder__icon {
            animation: none;
        }
    }
`)()
