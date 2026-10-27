import { css } from 'lit'

/** 原生顶层浮层保留显示与移出顶层的生命周期；普通数据刷新不会重复触发过渡。 */
export const interactionStyles = /* @__PURE__ */ (() => css`
    .mf-button,
    .mf-tab,
    .mf-select-trigger,
    .mf-select-option,
    .mf-cascader-trigger,
    .mf-cascader-panel button,
    .mf-switch-label,
    .mf-radio > span,
    .mf-radio > small,
    .mf-card-title-button,
    .mf-capability-title,
    .mf-capability-config,
    .mf-dialog-close,
    .mf-number-steppers,
    .mf-progress-value button {
        user-select: none;
        -webkit-user-select: none;
    }
    .mf-select-trigger > svg,
    .mf-cascader-trigger > svg {
        transform: rotate(0deg);
        transition: transform 150ms ease-out;
    }
    .mf-select-trigger[aria-expanded='true'] > svg,
    .mf-cascader-trigger[aria-expanded='true'] > svg {
        transform: rotate(180deg);
    }
    .mf-select-menu,
    .mf-cascader-panel {
        opacity: 0;
        transform: translateY(-4px) scale(0.99);
        transform-origin: top center;
        transition:
            opacity 150ms ease-out,
            transform 150ms ease-out,
            display 150ms allow-discrete,
            overlay 150ms allow-discrete;
    }
    .mf-select-menu:popover-open,
    .mf-cascader-panel:popover-open {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    .mf-select-menu:not(:popover-open),
    .mf-cascader-panel:not(:popover-open) {
        pointer-events: none;
    }
    .mf-dialog {
        opacity: 0;
        transform: translateY(6px) scale(0.985);
        transition:
            opacity 170ms ease-out,
            transform 170ms ease-out,
            display 170ms allow-discrete,
            overlay 170ms allow-discrete;
    }
    .mf-dialog[open] {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    .mf-dialog:not([open]) {
        pointer-events: none;
    }
    .mf-dialog::backdrop {
        opacity: 0;
        transition:
            opacity 170ms ease-out,
            display 170ms allow-discrete,
            overlay 170ms allow-discrete;
    }
    .mf-dialog[open]::backdrop {
        opacity: 1;
    }
    .mf-button[data-variant='accent'] {
        transition:
            background-color 140ms ease-out,
            border-color 140ms ease-out,
            color 140ms ease-out;
    }
    @starting-style {
        .mf-select-menu:popover-open,
        .mf-cascader-panel:popover-open {
            opacity: 0;
            transform: translateY(-4px) scale(0.99);
        }
        .mf-dialog[open] {
            opacity: 0;
            transform: translateY(6px) scale(0.985);
        }
        .mf-dialog[open]::backdrop {
            opacity: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-select-trigger > svg,
        .mf-cascader-trigger > svg,
        .mf-select-menu,
        .mf-cascader-panel,
        .mf-dialog,
        .mf-dialog::backdrop,
        .mf-button[data-variant='accent'] {
            transition: none;
        }
    }
`)()
