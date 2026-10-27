import { interactionStyles } from './interaction'
import { css } from 'lit'
import { formStyles } from '../components/form'
import { cascaderStyles } from '../components/cascader'
/** 默认白色内容面；基础控件和业务面板共用语义颜色、尺寸与交互状态。 */
const baseStyles = /* @__PURE__ */ (() => css`
    .mf-card {
        min-width: 0;
        padding: 24px;
        border: 1px solid var(--mf-line);
        border-radius: var(--mf-card-radius);
        background: var(--mf-bg);
        box-shadow: var(--mf-shadow-sm);
    }
    :host > .mf-card {
        --mf-card-margin: 12px;
        margin: var(--mf-card-margin);
    }
    @container (max-width: 640px) {
        :host > .mf-card {
            --mf-card-margin: 8px;
        }
    }
    .mf-card-heading {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 24px;
    }
    .mf-card-heading p {
        margin-top: 4px;
        font-size: 14px;
    }
    .mf-card-body {
        min-width: 0;
    }
    @media (max-width: 540px) {
        .mf-card {
            padding: 16px;
        }
    }
    :host {
        --mf-bg: var(--mf-panel-background, #fff);
        --mf-fg: var(--foreground, #2f2c29);
        --mf-muted: var(--muted-foreground, oklch(0.551 0.027 264.364));
        --mf-line: var(--border, oklch(0.928 0.006 264.531));
        --mf-soft: var(--muted, oklch(0.967 0.003 264.542));
        --mf-focus: var(--ring, oklch(0.707 0.022 261.325));
        display: flow-root;
        container-type: inline-size;
        color: var(--mf-fg);
        font: 13px/1.55
            var(
                --font-default,
                'Noto Sans SC',
                -apple-system,
                BlinkMacSystemFont,
                'PingFang SC',
                'Hiragino Sans GB',
                'Microsoft YaHei UI',
                'Microsoft YaHei',
                system-ui,
                sans-serif
            );
        --mf-accent: var(--node-panel-brand, #409eff);
        --mf-primary: var(--primary, oklch(0.21 0.034 264.665));
        --mf-hover: var(--accent, oklch(0.967 0.003 264.542));
        --mf-link: var(--link, #34919b);
        --mf-input-border: var(--input, oklch(0.928 0.006 264.531));
        --mf-shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --mf-shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --mf-on-accent: var(--primary-foreground, #fff);
        --mf-radius: calc(var(--radius, 0.625rem) - 2px);
        --mf-card-radius: calc(var(--radius, 0.625rem) + 4px);
        --mf-control-height: 36px;
        --mf-danger: var(--destructive, oklch(0.577 0.245 27.325));
        --mf-success: color-mix(in srgb, #18815b 80%, var(--mf-fg));
        --mf-warning: color-mix(in srgb, #946000 85%, var(--mf-fg));
        background: var(--mf-bg);
    }
    * {
        box-sizing: border-box;
    }
    ::selection {
        background: color-mix(in srgb, var(--mf-accent) 20%, transparent);
    }
    h2,
    h3,
    p {
        margin: 0;
    }
    h2 {
        font-size: 18px;
        line-height: 1.4;
    }
    h3 {
        font-size: 14px;
        line-height: 1.5;
    }
    .mf-heading {
        margin-bottom: 20px;
    }
    .mf-heading p {
        margin-top: 6px;
        color: var(--mf-muted);
        max-width: 65ch;
        font-size: 13px;
    }
    .mf-field {
        display: grid;
        gap: 6px;
        margin: 16px 0;
        max-width: 440px;
        min-width: 0;
    }
    .mf-label {
        font-weight: 500;
        font-size: 14px;
    }
    .mf-hint {
        font-size: 12px;
        color: var(--mf-muted);
    }
    .mf-input {
        width: 100%;
        font: inherit;
        color: var(--mf-fg);
        background: var(--mf-bg);
        border: 1px solid var(--mf-line);
        border-radius: var(--mf-radius);
        padding: 4px 12px;
        caret-color: var(--mf-focus);
        min-height: var(--mf-control-height);
        font-size: 14px;
        line-height: 1.5;
        min-width: 0;
        border-color: var(--mf-input-border);
        box-shadow: var(--mf-shadow-xs);
    }
    .mf-input:hover {
        border-color: #a5aebd;
    }
    .mf-input:focus-visible {
        outline: none;
        border-color: var(--mf-focus);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--mf-focus) 50%, transparent);
    }
    .mf-input:disabled {
        color: var(--mf-fg);
        background: transparent;
        cursor: not-allowed;
        opacity: 0.5;
    }
    .mf-note {
        padding: 12px 14px;
        background: var(--mf-soft);
        border-radius: var(--mf-radius);
        margin: 16px 0;
        font-size: 13px;
    }
    .mf-note p {
        color: var(--mf-muted);
        margin-top: 4px;
    }
    .mf-note[data-kind='error'] {
        color: #9b2424;
        background: color-mix(in srgb, var(--mf-danger) 6%, var(--mf-bg));
    }
    .mf-note[data-kind='error'] p {
        color: #8a2929;
    }
    .mf-skeleton {
        display: block;
        width: 100%;
        height: 1em;
        border-radius: 4px;
        background: var(--mf-line);
        animation: mf-skeleton-pulse 1.8s ease-in-out infinite;
    }
    .mf-skeleton[data-shape='rect'] {
        height: 4rem;
        border-radius: 8px;
    }
    .mf-skeleton[data-shape='circle'] {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
    }
    @keyframes mf-skeleton-pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.55;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-skeleton {
            animation: none;
        }
    }
    .mf-transition,
    .mf-transition-content {
        display: flow-root;
        min-width: 0;
    }
    .mf-transition[hidden] {
        display: none;
    }
    .mf-transition[data-effect='collapse'][data-animating] {
        overflow: hidden;
    }
    .mf-product {
        padding: 18px 0;
        border-top: 1px solid var(--mf-line);
    }
    .mf-product p {
        margin-top: 8px;
        color: var(--mf-muted);
        max-width: 65ch;
        overflow-wrap: anywhere;
    }
    dl {
        display: flex;
        gap: 28px;
        margin: 14px 0 0;
    }
    dl div {
        display: grid;
        gap: 2px;
    }
    dt {
        font-size: 12px;
        color: var(--mf-muted);
    }
    dd {
        margin: 0;
        font-variant-numeric: tabular-nums;
    }
    .mf-stack {
        display: grid;
        gap: 12px;
    }
    .mf-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 13px;
        color: var(--mf-muted);
    }
    .mf-button {
        font: inherit;
        font-size: 14px;
        padding: 0 16px;
        border-radius: var(--mf-radius);
        border: 1px solid var(--mf-line);
        background: var(--mf-bg);
        color: var(--mf-fg);
        cursor: pointer;
        min-height: var(--mf-control-height);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        line-height: 20px;
        font-weight: 500;
        white-space: nowrap;
        box-shadow: var(--mf-shadow-xs);
    }
    .mf-button:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--mf-line), var(--mf-fg) 20%);
        background: var(--mf-soft);
    }
    .mf-button:focus-visible {
        outline: 2px solid var(--mf-focus);
        outline-offset: 2px;
    }
    .mf-button[data-variant='primary'] {
        background: #34322d;
        border-color: transparent;
        color: #fff;
        box-shadow: none;
    }
    .mf-button[data-variant='ghost'] {
        border-color: transparent;
        background: transparent;
        box-shadow: none;
    }
    .mf-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }
    .mf-table {
        overflow: auto;
        border: 1px solid var(--mf-line);
        border-radius: var(--mf-radius);
        max-height: 520px;
        background: var(--mf-bg);
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
    }
    th,
    td {
        padding: 10px 12px;
        text-align: left;
        border-bottom: 1px solid var(--mf-line);
        vertical-align: middle;
        font-variant-numeric: tabular-nums;
    }
    th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--mf-soft);
        font-weight: 600;
        white-space: nowrap;
        color: var(--mf-muted);
    }
    tbody tr:last-child td {
        border-bottom: 0;
    }
    tbody tr[data-selected] {
        background: #f2f7ff;
    }
    tbody tr[data-disabled] td {
        color: var(--mf-muted);
        background: #fafbfc;
    }
    td[data-align='right'],
    th[data-align='right'] {
        text-align: right;
    }
    td[data-align='center'],
    th[data-align='center'] {
        text-align: center;
    }
    .mf-check {
        width: 36px;
    }
    .mf-check input {
        width: 15px;
        height: 15px;
        accent-color: var(--mf-focus);
        cursor: pointer;
    }
    .mf-check input:disabled {
        cursor: not-allowed;
    }
    .mf-empty {
        text-align: center;
        color: var(--mf-muted);
        padding: 32px 0;
    }
    .mf-product-cell {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        min-width: 220px;
    }
    .mf-product-cell img,
    .mf-product-thumb {
        width: 44px;
        height: 44px;
        border-radius: 6px;
        background: var(--mf-soft);
        object-fit: cover;
        flex: none;
    }
    .mf-product-text {
        display: grid;
        gap: 4px;
        min-width: 0;
        overflow-wrap: anywhere;
    }
    .mf-product-text strong {
        font-weight: 600;
    }
    .mf-sub {
        font-size: 12px;
        color: var(--mf-muted);
    }
    .mf-link {
        font-size: 14px;
        color: var(--mf-link);
        text-decoration: none;
        text-decoration-color: color-mix(in srgb, var(--mf-accent) 35%, transparent);
        text-underline-offset: 3px;
        overflow-wrap: anywhere;
    }
    .mf-link:hover {
        text-decoration: underline;
        text-decoration-color: currentColor;
    }
    .mf-pager {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        font-size: 13px;
        color: var(--mf-muted);
        padding: 14px 0;
    }
    .mf-pager-total {
        margin-right: 6px;
    }
    .mf-page {
        min-width: 30px;
        height: 30px;
        padding: 0 6px;
        border: 1px solid var(--mf-line);
        border-radius: var(--mf-radius);
        background: var(--mf-bg);
        color: var(--mf-fg);
        font: inherit;
        cursor: pointer;
    }
    .mf-page:hover:not(:disabled) {
        border-color: #a5aebd;
    }
    .mf-page:disabled {
        color: var(--mf-muted);
        cursor: not-allowed;
    }
    .mf-page[aria-current='page'] {
        border-color: color-mix(in srgb, var(--mf-accent) 35%, var(--mf-line));
        color: var(--mf-accent);
        font-weight: 600;
        background: color-mix(in srgb, var(--mf-accent) 5%, var(--mf-bg));
    }
    .mf-page-gap {
        padding: 0 2px;
    }
    .mf-page-size {
        font: inherit;
        height: 30px;
        padding: 0 6px;
        border: 1px solid var(--mf-line);
        border-radius: 6px;
        background: var(--mf-bg);
        color: var(--mf-fg);
    }
    .mf-page-jump {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    .mf-page-jump .mf-input {
        width: 56px;
        height: 30px;
        padding: 0 6px;
        text-align: center;
        min-height: 30px;
    }
    .mf-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
    }
    [hidden] {
        display: none !important;
    }
    :where(button, input, select, textarea, summary, a, [tabindex]):focus-visible {
        outline: 2px solid var(--mf-focus);
        outline-offset: 3px;
    }
    h4 {
        font-size: 13px;
        line-height: 1.5;
    }
    .mf-input::placeholder {
        color: var(--mf-muted);
        opacity: 1;
    }
    textarea.mf-input {
        resize: vertical;
        min-height: 64px;
        padding: 8px 12px;
    }
    .mf-input:hover:not(:disabled) {
        border-color: var(--mf-input-border);
    }
    .mf-input[aria-invalid='true'] {
        border-color: var(--mf-danger);
    }
    .mf-field-error,
    [data-number-error] {
        color: var(--mf-danger);
        font-size: 12px;
    }
    .mf-button[data-size='small'] {
        min-height: 32px;
        padding: 0 12px;
        font-size: 14px;
        gap: 6px;
    }
    .mf-button:active:not(:disabled) {
        background: color-mix(in srgb, var(--mf-soft), var(--mf-fg) 6%);
    }
    .mf-button[data-variant='primary']:hover:not(:disabled),
    .mf-button[data-variant='primary']:active:not(:disabled) {
        background: #2f2c29;
        border-color: transparent;
    }
    .mf-button[data-variant='danger'] {
        color: #fff;
        border-color: transparent;
        background: var(--mf-danger);
        box-shadow: none;
    }
    .mf-button[data-variant='danger']:hover:not(:disabled) {
        background: color-mix(in srgb, var(--mf-danger) 90%, var(--mf-bg));
    }
    .mf-button-loading {
        position: absolute;
        left: calc(50% - 6px);
        top: calc(50% - 6px);
        width: 12px;
        height: 12px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: mf-control-spin 0.8s linear infinite;
    }
    .mf-button {
        position: relative;
    }
    .mf-button[data-loading='true'] .mf-button-label {
        opacity: 0;
    }
    @keyframes mf-control-spin {
        to {
            transform: rotate(360deg);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-button-loading {
            animation: none;
        }
    }
    .mf-checkbox {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        line-height: 1.5;
        min-height: 24px;
        cursor: pointer;
    }
    .mf-checkbox input {
        width: 16px;
        height: 16px;
        margin: 0;
        accent-color: var(--mf-accent);
        cursor: inherit;
        flex: none;
        appearance: none;
        border: 1px solid var(--mf-input-border);
        border-radius: 4px;
        display: inline-grid;
        place-items: center;
        background: transparent;
        box-shadow: var(--mf-shadow-xs);
    }
    .mf-checkbox:has(input:disabled) {
        cursor: not-allowed;
        color: var(--mf-fg);
        opacity: 0.5;
    }
    .mf-note[data-kind='error'],
    .mf-note[data-kind='error'] p {
        color: var(--mf-danger);
    }
    .mf-note[data-kind='success'] {
        color: var(--mf-success);
        background: color-mix(in srgb, var(--mf-success) 6%, var(--mf-bg));
    }
    .mf-note[data-kind='warning'] {
        color: var(--mf-warning);
        background: color-mix(in srgb, var(--mf-warning) 6%, var(--mf-bg));
    }
    .mf-note[data-kind='warning'] p,
    .mf-note[data-kind='success'] p {
        color: inherit;
    }
    .mf-text {
        overflow-wrap: anywhere;
    }
    .mf-text[data-tone='muted'] {
        color: var(--mf-muted);
    }
    .mf-text[data-tone='danger'] {
        color: var(--mf-danger);
    }
    .mf-text[data-tone='success'] {
        color: var(--mf-success);
    }
    .mf-text[data-size='small'] {
        font-size: 12px;
    }
    .mf-text[data-size='body'] {
        font-size: 13px;
    }
    .mf-text[data-size='title'] {
        font-size: 15px;
    }
    .mf-text[data-weight='medium'] {
        font-weight: 600;
    }
    .mf-text[data-numeric] {
        font-variant-numeric: tabular-nums;
    }
    .mf-text-expand {
        min-width: 0;
    }
    .mf-text-expand > summary {
        cursor: pointer;
        list-style: none;
        padding: 0;
    }
    .mf-text-expand > summary::-webkit-details-marker {
        display: none;
    }
    .mf-text-expand:not([open]) .mf-text {
        display: -webkit-box;
        -webkit-line-clamp: var(--mf-text-lines);
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .mf-text-expand[open] .mf-text {
        display: block;
    }
    .mf-section {
        padding: 18px 0;
        border-bottom: 1px solid var(--mf-line);
        min-width: 0;
    }
    .mf-section-heading {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }
    .mf-section-heading p {
        margin-top: 4px;
        max-width: 65ch;
    }
    .mf-section-body {
        min-width: 0;
    }
    .mf-section-collapse > summary {
        padding: 0;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
    }
    .mf-section-collapse[open] > summary {
        margin-bottom: 12px;
    }
    .mf-badge {
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        line-height: 1.6;
        padding: 2px 8px;
        border-radius: 999px;
        color: var(--mf-muted);
        background: var(--mf-soft);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        border: 1px solid transparent;
        font-weight: 500;
    }
    .mf-badge[data-tone='info'] {
        color: var(--mf-accent);
        background: color-mix(in srgb, var(--mf-accent) 8%, var(--mf-bg));
    }
    .mf-badge[data-tone='success'] {
        color: var(--mf-success);
        background: color-mix(in srgb, var(--mf-success) 8%, var(--mf-bg));
    }
    .mf-badge[data-tone='warning'] {
        color: var(--mf-warning);
        background: color-mix(in srgb, var(--mf-warning) 8%, var(--mf-bg));
    }
    .mf-badge[data-tone='danger'] {
        color: var(--mf-danger);
        background: color-mix(in srgb, var(--mf-danger) 8%, var(--mf-bg));
    }
    .mf-empty-state {
        padding: 32px 20px;
        text-align: center;
        color: var(--mf-muted);
        font-size: 13px;
    }
    .mf-empty-state strong {
        font-weight: 500;
        color: var(--mf-fg);
    }
    .mf-empty-state p {
        margin-top: 6px;
    }
    .mf-empty-state .mf-button {
        margin-top: 16px;
    }
    .mf-tab-list {
        display: inline-flex;
        gap: 0;
        overflow-x: auto;
        border-bottom: 1px solid var(--mf-line);
        width: fit-content;
        max-width: 100%;
        height: 36px;
        padding: 3px;
        border: 0;
        border-radius: var(--radius, 10px);
        background: var(--mf-soft);
        align-items: center;
    }
    .mf-tab {
        flex: none;
        padding: 4px 8px;
        border: 1px solid transparent;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: color-mix(in srgb, var(--mf-fg) 60%, transparent);
        font: inherit;
        font-size: 14px;
        cursor: pointer;
        height: calc(100% - 1px);
        border-radius: var(--mf-radius);
        line-height: 20px;
        font-weight: 500;
    }
    .mf-tab[aria-selected='true'] {
        border-bottom-color: var(--mf-accent);
        color: var(--mf-fg);
        font-weight: 500;
        border-color: transparent;
        background: var(--mf-bg);
        box-shadow: var(--mf-shadow-sm);
    }
    .mf-tab:hover:not(:disabled) {
        color: var(--mf-fg);
    }
    .mf-tab:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
    .mf-tab:focus-visible {
        outline-offset: -3px;
    }
    .mf-tab-panel {
        padding-top: 12px;
        min-width: 0;
    }
    .mf-table th {
        font-size: 14px;
        padding: 8px;
        color: var(--mf-fg);
        font-weight: 500;
        height: 40px;
    }
    .mf-table td {
        padding: 8px;
    }
    .mf-table td.mf-table-refresh {
        padding: 10px 12px;
        background: color-mix(in srgb, var(--mf-accent) 5%, var(--mf-bg));
        color: var(--mf-muted);
        font-size: 12px;
    }
    .mf-table tbody tr:hover {
        background: color-mix(in srgb, var(--mf-soft) 50%, var(--mf-bg));
    }
    .mf-table tbody tr[data-selected] {
        background: color-mix(in srgb, var(--mf-accent) 6%, var(--mf-bg));
    }
    .mf-table tbody tr[data-disabled] td {
        background: var(--mf-soft);
    }
    .mf-table td.mf-empty {
        padding: 0;
    }
    .mf-table .mf-checkbox {
        vertical-align: middle;
    }
    .mf-product-summary {
        display: flex;
        gap: 16px;
        align-items: flex-start;
    }
    .mf-product-summary > div {
        flex: 1;
        min-width: 0;
    }
    .mf-product-description {
        margin-top: 6px;
        max-width: 65ch;
    }
    .mf-product-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
    }
    .mf-product dl {
        flex-wrap: wrap;
        gap: 12px 28px;
    }
    .mf-image {
        display: inline-block;
        position: relative;
        flex: none;
        vertical-align: middle;
        border-radius: var(--mf-radius);
        overflow: hidden;
        background: var(--mf-soft);
    }
    .mf-image-trigger,
    .mf-image-static {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        padding: 0;
        background: transparent;
    }
    .mf-image-trigger {
        cursor: zoom-in;
        border-radius: inherit;
    }
    .mf-image-trigger:focus-visible {
        outline-offset: -3px;
    }
    .mf-image img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0;
        object-fit: var(--mf-image-fit, contain);
    }
    .mf-image[data-state='error'] img,
    .mf-image[data-state='loading'] img {
        visibility: hidden;
    }
    .mf-image-fallback {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: var(--mf-muted);
        background: var(--mf-soft);
    }
    .mf-image-fallback svg {
        width: 22px;
        height: 22px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.4;
    }
    .mf-image-fallback .mf-skeleton {
        width: 100%;
        height: 100%;
    }
    .mf-image-viewer {
        padding: 0;
        border: 0;
        border-radius: calc(var(--radius, 10px) + 8px);
        width: min(960px, calc(100vw - 32px));
        height: min(800px, calc(100dvh - 48px));
        max-width: none;
        max-height: none;
        color: var(--mf-fg);
        background: transparent;
        overflow: visible;
    }
    .mf-image-viewer[open] {
        display: block;
    }
    .mf-image-viewer > .mf-transition,
    .mf-image-viewer > .mf-transition > .mf-transition-content {
        height: 100%;
    }
    .mf-viewer-surface {
        height: 100%;
        border-radius: calc(var(--radius, 10px) + 8px);
        overflow: hidden;
        background: var(--mf-bg);
        box-shadow: 0 20px 70px #0005;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
    }
    .mf-image-viewer::backdrop {
        background: rgb(0 0 0 / 0.5);
    }
    .mf-viewer-header,
    .mf-viewer-footer {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .mf-viewer-header {
        border-bottom: 1px solid var(--mf-line);
    }
    .mf-viewer-header > div {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .mf-viewer-header strong {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mf-viewer-header .mf-hint {
        flex: none;
    }
    .mf-viewer-footer {
        border-top: 1px solid var(--mf-line);
        flex-wrap: wrap;
    }
    .mf-viewer-stage {
        overflow: auto;
        min-height: 0;
        background: var(--mf-soft);
    }
    .mf-viewer-canvas {
        min-width: 100%;
        min-height: 100%;
    }
    .mf-viewer-canvas .mf-image {
        display: block;
        border-radius: 0;
    }
    @media (max-width: 540px) {
        .mf-image-viewer {
            width: calc(100vw - 16px);
            height: calc(100dvh - 24px);
        }
        .mf-viewer-footer {
            justify-content: center;
        }
        .mf-viewer-footer .mf-toolbar {
            justify-content: center;
            flex-wrap: wrap;
        }
        .mf-product-summary {
            gap: 12px;
        }
    }
    .mf-button[data-size='panel'] {
        min-height: 32px;
        padding: 0 15px;
        gap: 6px;
        border-radius: 4px;
        font-size: 13px;
    }
    .mf-button[data-variant='secondary']:hover:not(:disabled),
    .mf-button[data-variant='ghost']:hover:not(:disabled) {
        background: var(--mf-hover);
        border-color: var(--mf-line);
    }
    .mf-button[data-variant='ghost']:hover:not(:disabled) {
        border-color: transparent;
    }
    .mf-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .mf-button:focus-visible,
    .mf-checkbox input:focus-visible,
    .mf-page:focus-visible,
    .mf-tab:focus-visible {
        outline: none;
        border-color: var(--mf-focus);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--mf-focus) 50%, transparent);
    }

    .mf-checkbox input:checked,
    .mf-checkbox input:indeterminate {
        background: var(--mf-primary);
        border-color: var(--mf-primary);
    }
    .mf-checkbox input:checked::after {
        content: '';
        width: 5px;
        height: 9px;
        border: solid var(--mf-on-accent);
        border-width: 0 2px 2px 0;
        transform: translateY(-1px) rotate(45deg);
    }
    .mf-checkbox input:indeterminate::after {
        content: '';
        width: 8px;
        height: 0;
        border: 0;
        border-bottom: 2px solid var(--mf-on-accent);
        transform: none;
    }
    .mf-table table {
        font-size: 14px;
    }
    .mf-table tbody tr[data-selected],
    .mf-table tbody tr[data-selected]:hover {
        background: var(--mf-soft);
    }
    .mf-image-preview-overlay {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: transparent;
        opacity: 0;
        transition: opacity 150ms;
        pointer-events: none;
    }
    .mf-image-preview-overlay svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: #fff;
        stroke-width: 2;
    }
    .mf-image-trigger:hover .mf-image-preview-overlay,
    .mf-image-trigger:focus-visible .mf-image-preview-overlay {
        background: rgb(0 0 0 / 0.35);
        opacity: 1;
    }
    .mf-select {
        min-width: 0;
    }
    .mf-select-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        min-width: 0;
        height: 36px;
        border: 1px solid var(--mf-input-border);
        border-radius: var(--mf-radius);
        background: var(--mf-bg);
        padding: 8px 12px;
        color: var(--mf-fg);
        font: inherit;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
        box-shadow: var(--mf-shadow-xs);
    }
    .mf-select-trigger > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .mf-select-trigger svg {
        flex: none;
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        color: var(--mf-muted);
        opacity: 0.5;
    }
    .mf-select-trigger:focus-visible {
        outline: none;
        border-color: var(--mf-focus);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--mf-focus) 50%, transparent);
    }
    .mf-select-trigger:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
    .mf-select-menu {
        position: fixed;
        inset: auto;
        margin: 0;
        padding: 4px;
        border: 1px solid var(--mf-line);
        border-radius: var(--mf-radius);
        background: var(--popover, var(--mf-bg));
        color: var(--popover-foreground, var(--mf-fg));
        box-shadow:
            0 4px 6px -1px #0002,
            0 2px 4px -2px #0002;
        overflow: auto;
        font: inherit;
        font-size: 14px;
    }
    .mf-select-menu::backdrop {
        background: transparent;
    }
    .mf-select-option {
        position: relative;
        padding: 6px 32px 6px 8px;
        min-height: 32px;
        border-radius: calc(var(--radius, 10px) - 4px);
        cursor: pointer;
        white-space: nowrap;
    }
    .mf-select-option[data-active] {
        background: var(--mf-hover);
        color: var(--accent-foreground, var(--mf-fg));
    }
    .mf-select-option[aria-disabled='true'] {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .mf-select-option svg {
        position: absolute;
        right: 8px;
        top: 8px;
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
    }
    .mf-pager .mf-field {
        margin: 0;
        width: auto;
    }
    .mf-pager .mf-select-trigger {
        height: 32px;
        font-size: 13px;
    }
`)()

export const panelStyles = [baseStyles, interactionStyles, formStyles, cascaderStyles]
