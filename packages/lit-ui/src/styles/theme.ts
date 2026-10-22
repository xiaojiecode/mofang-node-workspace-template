import { css } from 'lit'
export const panelStyles = css`
    :host {
        --mf-bg: var(--background, #fff);
        --mf-fg: var(--foreground, #171a20);
        --mf-muted: var(--muted-foreground, #586170);
        --mf-line: var(--border, #dce1e8);
        --mf-soft: var(--muted, #f4f6f9);
        --mf-focus: var(--ring, #395cd6);
        display: block;
        color: var(--mf-fg);
        font:
            14px/1.6 system-ui,
            sans-serif;
    }
    * {
        box-sizing: border-box;
    }
    ::selection {
        background: #dce5ff;
    }
    h2,
    h3,
    p {
        margin: 0;
    }
    h2 {
        font-size: 20px;
        line-height: 1.35;
    }
    h3 {
        font-size: 15px;
    }
    .mf-heading {
        margin-bottom: 24px;
    }
    .mf-heading p {
        margin-top: 6px;
        color: var(--mf-muted);
        max-width: 65ch;
    }
    .mf-field {
        display: grid;
        gap: 6px;
        margin: 20px 0;
        max-width: 440px;
    }
    .mf-label {
        font-weight: 600;
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
        border-radius: 7px;
        padding: 9px 11px;
        caret-color: var(--mf-focus);
    }
    .mf-input:hover {
        border-color: #a5aebd;
    }
    .mf-input:focus-visible {
        outline: 2px solid var(--mf-focus);
        outline-offset: 2px;
    }
    .mf-input:disabled {
        color: var(--mf-muted);
        background: var(--mf-soft);
        cursor: not-allowed;
    }
    .mf-note {
        padding: 16px;
        background: var(--mf-soft);
        border-radius: 8px;
        margin: 16px 0;
    }
    .mf-note p {
        color: var(--mf-muted);
        margin-top: 4px;
    }
    .mf-note[data-kind='error'] {
        color: #9b2424;
        background: #fff1f1;
    }
    .mf-note[data-kind='error'] p {
        color: #8a2929;
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
`
