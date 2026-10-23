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
        font-size: 13px;
        padding: 7px 14px;
        border-radius: 7px;
        border: 1px solid var(--mf-line);
        background: var(--mf-bg);
        color: var(--mf-fg);
        cursor: pointer;
    }
    .mf-button:hover:not(:disabled) {
        border-color: #a5aebd;
    }
    .mf-button:focus-visible {
        outline: 2px solid var(--mf-focus);
        outline-offset: 2px;
    }
    .mf-button:disabled {
        color: var(--mf-muted);
        background: var(--mf-soft);
        cursor: not-allowed;
    }
    .mf-button[data-variant='primary'] {
        background: var(--mf-focus);
        border-color: var(--mf-focus);
        color: #fff;
    }
    .mf-button[data-variant='ghost'] {
        border-color: transparent;
        background: transparent;
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
        border-radius: 8px;
        max-height: 520px;
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
        gap: 10px;
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
        gap: 2px;
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
        font-size: 12px;
        color: #2f6fed;
        text-decoration: none;
    }
    .mf-link:hover {
        text-decoration: underline;
    }
    .mf-pager {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        font-size: 13px;
        color: var(--mf-muted);
    }
    .mf-pager-total {
        margin-right: 6px;
    }
    .mf-page {
        min-width: 30px;
        height: 30px;
        padding: 0 6px;
        border: 1px solid var(--mf-line);
        border-radius: 6px;
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
        border-color: var(--mf-focus);
        color: var(--mf-focus);
        font-weight: 600;
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
    }
`
