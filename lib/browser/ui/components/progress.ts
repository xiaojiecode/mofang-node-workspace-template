import { css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'

export type ProgressProps = Readonly<{ label: string; value?: number; onClose?: () => void }>

/** 进度仅显示传入的事实，缺少数值时呈现不确定进度，不推算业务耗时。 */
export function progressBar(p: ProgressProps) {
    const value =
        p.value === undefined || !Number.isFinite(p.value)
            ? undefined
            : Math.min(100, Math.max(0, p.value))
    return html`<div class="mf-progress">
        <div class="mf-progress-heading">
            <span>${p.label}</span
            ><span class="mf-progress-value"
                >${value === undefined ? '进行中' : `${value}%`}${p.onClose
                    ? html`<button type="button" aria-label=${`关闭${p.label}`} @click=${p.onClose}>
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                              <path d="m4 4 8 8M12 4l-8 8" />
                          </svg>
                      </button>`
                    : nothing}</span
            >
        </div>
        <div
            class="mf-progress-track"
            role="progressbar"
            aria-label=${p.label}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${value ?? nothing}
        >
            <span
                data-indeterminate=${value === undefined}
                style=${styleMap({ width: value === undefined ? '30%' : `${value}%` })}
            ></span>
        </div>
    </div>`
}
export const progressStyles = /* @__PURE__ */ (() => css`
    .mf-progress {
        width: 100%;
    }
    .mf-progress-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        font-size: 13px;
        color: #666e7b;
        margin-bottom: 8px;
    }
    .mf-progress-value {
        display: inline-flex;
        gap: 10px;
        align-items: center;
        font-variant-numeric: tabular-nums;
    }
    .mf-progress-value button {
        display: inline-flex;
        padding: 0;
        border: 0;
        background: transparent;
        color: #8b939f;
        cursor: pointer;
    }
    .mf-progress-value svg {
        width: 15px;
        height: 15px;
    }
    .mf-progress-track {
        height: 6px;
        overflow: hidden;
        border-radius: 4px;
        background: #e8eff8;
    }
    .mf-progress-track > span {
        display: block;
        height: 100%;
        background: #338fff;
        border-radius: inherit;
        transition: width 250ms ease-out;
    }
    .mf-progress-track > span[data-indeterminate='true'] {
        animation: mf-progress-moving 1.5s ease-in-out infinite alternate;
    }
    @keyframes mf-progress-moving {
        to {
            transform: translateX(230%);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-progress-track > span {
            animation: none !important;
            transition: none;
        }
    }
`)()
