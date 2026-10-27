import { css, html, svg } from 'lit'

export type ActivityIconProps = Readonly<{
    kind: 'loading' | 'execute' | 'activity' | 'sparkle'
    running?: boolean
}>

/** 可复用的执行图标；只由 running 控制动效，不创建任务或计时器。 */
export function activityIcon(p: ActivityIconProps) {
    return html`<svg
        class="mf-activity-icon"
        data-kind=${p.kind}
        ?data-running=${p.running}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        ${p.kind === 'loading'
            ? svg`<circle cx="12" cy="12" r="9" opacity=".2"/><path d="M12 3a9 9 0 0 1 9 9"/>`
            : p.kind === 'execute'
              ? svg`<path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/>`
              : p.kind === 'activity'
                ? svg`<path d="M3 12h4l3-8 4 16 3-8h4"/>`
                : svg`<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>`}
    </svg>`
}

/** 旋转、执行呼吸与活动心跳沿用原型节奏，星标保持静态。 */
export const activityIconStyles = /* @__PURE__ */ (() => css`
    .mf-activity-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
        vertical-align: middle;
        transform-origin: center;
    }
    .mf-activity-icon[data-running][data-kind='loading'] {
        animation: mf-activity-spin 900ms linear infinite;
    }
    .mf-activity-icon[data-running][data-kind='execute'] {
        animation: mf-activity-execute 1.2s ease-in-out infinite;
    }
    .mf-activity-icon[data-running][data-kind='activity'] {
        animation: mf-activity-heartbeat 1.1s ease-in-out infinite;
    }
    @keyframes mf-activity-spin {
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes mf-activity-execute {
        0%,
        100% {
            opacity: 1;
            transform: translateX(1px) scale(1);
        }
        50% {
            opacity: 0.72;
            transform: translateX(1px) scale(0.88);
        }
    }
    @keyframes mf-activity-heartbeat {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.07);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-activity-icon[data-running][data-kind='loading'],
        .mf-activity-icon[data-running][data-kind='execute'],
        .mf-activity-icon[data-running][data-kind='activity'] {
            animation: none;
        }
    }
`)()
