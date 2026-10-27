import { css } from 'lit'

/** 报告与区块共用样式；滚动边界由容器确定，图表不执行尺寸反馈。 */
export const reportStyles = /* @__PURE__ */ (() => css`
    .mf-selection-report {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        min-height: 0;
        overflow: auto;
        padding: 22px;
        color: #262b36;
        background: #f4f5f7;
    }
    .mf-selection-report *,
    .mf-report-parts * {
        box-sizing: border-box;
    }
    .mf-selection-report :is(h2, h3, h4, p),
    .mf-report-parts :is(h2, h3, h4, p) {
        margin: 0;
    }
    .mf-report-header {
        display: flex;
        gap: 20px;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0 20px;
    }
    .mf-report-title {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .mf-report-title h2 {
        font-size: 28px;
        letter-spacing: -0.6px;
    }
    .mf-report-title .mf-button {
        min-height: 25px;
        font-size: 11px;
        color: #2f6bff;
        border: 0;
        background: #eef3ff;
    }
    .mf-report-header p {
        margin-top: 7px;
        color: #8b909d;
        font-size: 12px;
        line-height: 1.7;
    }
    .mf-report-sample {
        padding: 8px 12px;
        margin-bottom: 12px;
        border: 1px solid #ffe2a6;
        border-radius: 8px;
        background: #fffbee;
        color: #947023;
        font-size: 12px;
    }
    .mf-report-context {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 24px;
        padding: 14px;
        background: #fff;
        border: 1px solid #e8eaee;
        border-radius: 12px;
        color: #8d94a0;
        font-size: 12px;
    }
    .mf-report-context span {
        display: flex;
        gap: 8px;
    }
    .mf-report-context b {
        color: #414754;
        font-weight: 600;
    }
    .mf-report-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 285px;
        margin-top: 18px;
        border: 1px solid #e8eaee;
        border-radius: 16px;
        background: #fff;
        overflow: hidden;
    }
    .mf-report-hero-main {
        padding: 24px;
        min-width: 0;
    }
    .mf-report-kicker {
        color: #2f6bff;
        font-weight: 700;
        font-size: 12px;
    }
    .mf-report-path {
        margin-top: 20px !important;
        color: #9ba1ad;
        font-size: 12px;
    }
    .mf-report-hero h3 {
        margin: 7px 0;
        font-size: 28px;
    }
    .mf-report-hero-main > p:not(.mf-report-path):not(.mf-report-caption) {
        color: #767e8d;
        font-size: 12px;
        line-height: 1.8;
        max-width: 680px;
    }
    .mf-report-hero-facts {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 18px;
    }
    .mf-report-hero-facts span {
        background: #eef3ff;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 11px;
        color: #68768c;
    }
    .mf-report-hero-facts b {
        color: #2f6bff;
    }
    .mf-report-hero aside {
        border-left: 1px solid #e8eaee;
        padding: 24px;
    }
    .mf-report-score-sources {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 11px;
        color: #959ba6;
        margin: 12px 0;
    }
    .mf-report-score-sources b {
        color: #404857;
    }
    .mf-report-section {
        margin-top: 26px;
    }
    .mf-report-section > header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 12px;
    }
    .mf-report-section h3 {
        font-size: 18px;
    }
    .mf-report-section > header > p {
        color: #969eaa;
        font-size: 11px;
    }
    .mf-report-grid {
        display: grid;
        gap: 12px;
        min-width: 0;
    }
    .mf-report-grid-two {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .mf-report-grid-three {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .mf-report-grid-four {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .mf-report-source {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        max-width: 100%;
        padding: 3px 7px;
        border: 1px solid #e8ecf1;
        border-radius: 20px;
        background: #fff;
        color: #687183;
        font-size: 10px;
        line-height: 16px;
        white-space: nowrap;
    }
    .mf-report-source > :is(svg, img),
    .mf-report-source > span.mf-icon {
        width: 14px;
        height: 14px;
        object-fit: contain;
    }
    .mf-report-source > span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .mf-report-sources {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    .mf-report-metric,
    .mf-report-action {
        min-width: 0;
    }
    .mf-report-metric > .mf-card,
    .mf-report-action > .mf-card {
        height: 100%;
        border-radius: 13px;
        border-color: #e8eaee;
    }
    .mf-report-metric .mf-card-body,
    .mf-report-action .mf-card-body {
        padding: 16px;
    }
    .mf-report-metric-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
    }
    .mf-report-metric-head b {
        font-size: 14px;
    }
    .mf-report-metric p {
        font-size: 11px;
        color: #98a0ad;
        line-height: 1.7;
        margin-top: 7px;
    }
    .mf-report-metric strong {
        display: block;
        margin-top: 20px;
        font-size: 27px;
        font-variant-numeric: tabular-nums;
        overflow-wrap: anywhere;
    }
    .mf-report-metric strong small {
        margin-left: 5px;
        font-size: 11px;
        font-weight: 400;
        color: #959eac;
    }
    .mf-report-metric .mf-report-metric-note {
        margin-top: 12px;
    }
    .mf-report-score-label {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
        font-size: 11px;
        color: #9198a6;
    }
    .mf-report-score > strong {
        display: block;
        margin-top: 12px;
        font-size: 42px;
        line-height: 1.2;
        letter-spacing: -1px;
        font-variant-numeric: tabular-nums;
    }
    .mf-report-score > strong small {
        font-size: 14px;
        color: #a2a9b4;
        font-weight: 400;
        letter-spacing: 0;
        margin-left: 6px;
    }
    .mf-report-score > p {
        color: #8d95a3;
        font-size: 11px;
        line-height: 1.7;
        margin-top: 9px;
    }
    .mf-report-score-track {
        height: 6px;
        margin-top: 12px;
        overflow: hidden;
        border-radius: 99px;
        background: #e9eef7;
    }
    .mf-report-score-track > span {
        display: block;
        height: 100%;
        background: linear-gradient(90deg, #8eb2ff, #2f6bff);
        border-radius: inherit;
    }
    .mf-report-caption {
        margin-top: 9px !important;
        font-size: 10px;
        line-height: 1.7;
        color: #9aa2af;
    }
    .mf-report-table-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        color: #939daa;
        font-size: 11px;
        margin-bottom: 8px;
    }
    .mf-report-sort {
        display: flex;
        gap: 6px;
    }
    .mf-report-sort .mf-button {
        min-height: 27px;
        padding: 4px 9px;
        font-size: 11px;
    }
    .mf-report-category-table .mf-table {
        background: #fff;
        border-radius: 12px;
        overflow: auto;
    }
    .mf-report-category-table table {
        min-width: 900px;
    }
    .mf-report-category-table tr[data-row-key] {
        cursor: pointer;
    }
    .mf-report-category-table tr[data-state='selected'] {
        background: #eef3ff;
    }
    .mf-report-category-choice {
        display: block;
        border: 0;
        background: transparent;
        text-align: left;
        font: inherit;
        color: #414b5c;
        cursor: pointer;
        padding: 0;
    }
    .mf-report-category-choice b,
    .mf-report-category-choice small {
        display: block;
    }
    .mf-report-category-choice small {
        margin-top: 3px;
        font-size: 10px;
        color: #a0a7b2;
    }
    .mf-report-category-choice:focus-visible {
        outline: 2px solid #7eacff;
        outline-offset: 4px;
    }
    .mf-report-trend,
    .mf-report-matrix-panel,
    .mf-report-dual-score {
        min-width: 0;
        padding: 18px;
        background: #fff;
        border: 1px solid #e8eaee;
        border-radius: 13px;
    }
    .mf-report-trend-heading {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
    }
    .mf-report-trend h4,
    .mf-report-matrix-panel h4,
    .mf-report-dual-score h4 {
        font-size: 14px;
    }
    .mf-report-trend > strong {
        display: block;
        font-size: 28px;
        margin-top: 16px;
    }
    .mf-report-trend > p,
    .mf-report-matrix-panel > p,
    .mf-report-dual-score > p {
        color: #929ba9;
        font-size: 11px;
        line-height: 1.8;
        margin-top: 8px;
    }
    .mf-report-chart {
        display: block;
        width: 100%;
        height: 120px;
        margin-top: 15px;
        overflow: visible;
    }
    .mf-report-chart-line {
        fill: none;
        stroke: var(--mf-report-chart-color);
        stroke-width: 2;
        stroke-linejoin: round;
        stroke-linecap: round;
    }
    .mf-report-chart-zero {
        stroke: #e9edf3;
        stroke-dasharray: 3 5;
    }
    .mf-report-chart circle {
        fill: #fff;
        stroke: var(--mf-report-chart-color);
        stroke-width: 2;
    }
    .mf-report-chart circle:hover,
    .mf-report-chart circle:focus {
        r: 6;
        fill: var(--mf-report-chart-color);
        outline: none;
    }
    .mf-report-chart-labels {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        color: #9aa3b0;
        font-size: 10px;
    }
    .mf-report-chart-empty {
        min-height: 135px;
        display: grid;
        place-items: center;
        font-size: 12px;
        color: #929eaf;
    }
    .mf-report-chart-data {
        margin-top: 12px;
        font-size: 10px;
        color: #8390a4;
    }
    .mf-report-chart-data summary {
        width: fit-content;
        cursor: pointer;
        user-select: none;
    }
    .mf-report-chart-data table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 8px;
        font-size: 11px;
    }
    .mf-report-chart-data :is(td, th) {
        padding: 5px 8px;
        border-bottom: 1px solid #edf0f5;
        text-align: left;
        font-weight: 400;
    }
    .mf-report-dual-score > .mf-report-grid {
        margin-top: 16px;
    }
    .mf-report-dual-score .mf-report-score {
        padding: 12px;
        background: #eef3ff;
        border-radius: 9px;
    }
    .mf-report-dual-score .mf-report-score > strong {
        font-size: 28px;
    }
    .mf-report-matrix {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-top: 17px;
    }
    .mf-report-matrix > div {
        display: flex;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
        min-height: 42px;
        padding: 10px;
        border: 1px solid transparent;
        border-radius: 8px;
        background: #f4f5f7;
        font-size: 11px;
        color: #a0a8b3;
    }
    .mf-report-matrix > div[data-active='true'] {
        color: #2f6bff;
        border-color: #bcd4ff;
        background: #eef3ff;
    }
    .mf-report-matrix-panel > small {
        display: block;
        font-size: 10px;
        color: #a2aab6;
        line-height: 1.7;
        margin-top: 7px;
    }
    .mf-report-product-table {
        border-radius: 12px;
        overflow: hidden;
        background: #fff;
    }
    .mf-report-product-table .mf-table {
        overflow: auto;
    }
    .mf-report-product-table table {
        min-width: 650px;
    }
    .mf-report-product {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 180px;
    }
    .mf-report-product img {
        width: 38px;
        height: 38px;
        object-fit: cover;
        border-radius: 8px;
    }
    .mf-report-product b,
    .mf-report-product small {
        display: block;
    }
    .mf-report-product small {
        margin-top: 4px;
        color: #9ba3b0;
    }
    .mf-report-action-step {
        color: #2f6bff;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.2px;
    }
    .mf-report-action h4 {
        font-size: 14px;
        margin-top: 12px;
    }
    .mf-report-action p {
        color: #7e8898;
        font-size: 12px;
        line-height: 1.8;
        margin: 8px 0 12px;
    }
    .mf-report-action .mf-button {
        margin-top: 10px;
    }
    .mf-report-notes {
        display: grid;
        gap: 8px;
        margin-top: 24px;
        color: #989fac;
        font-size: 11px;
        line-height: 1.8;
    }
    .mf-report-methods {
        display: grid;
        gap: 20px;
    }
    .mf-report-methods h4 {
        font-size: 14px;
        margin-bottom: 8px;
    }
    .mf-report-methods code {
        display: block;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        padding: 12px;
        border-radius: 8px;
        background: #eef3ff;
        color: #2f6bff;
        font-size: 12px;
        line-height: 1.8;
    }
    .mf-report-methods p {
        margin-top: 8px;
        font-size: 12px;
        line-height: 1.8;
        color: #8b94a4;
    }
    .mf-report-missing-panel,
    .mf-report-missing-selection {
        display: grid;
        place-items: center;
        min-height: 110px;
        border: 1px dashed #dce3ee;
        border-radius: 12px;
        color: #8f99a9;
        font-size: 12px;
        background: #fff;
    }
    .mf-report-missing-selection {
        margin-top: 18px;
    }
    @media (max-width: 980px) {
        .mf-report-grid-four {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .mf-report-hero {
            grid-template-columns: minmax(0, 1fr) 240px;
        }
    }
    @media (max-width: 720px) {
        .mf-selection-report {
            padding: 14px;
        }
        .mf-report-header {
            align-items: flex-start;
            gap: 12px;
        }
        .mf-report-title {
            flex-wrap: wrap;
        }
        .mf-report-title h2 {
            font-size: 24px;
        }
        .mf-report-hero {
            grid-template-columns: 1fr;
        }
        .mf-report-hero aside {
            border-left: 0;
            border-top: 1px solid #e8eaee;
        }
        .mf-report-grid-three,
        .mf-report-grid-two {
            grid-template-columns: 1fr;
        }
    }
    @media print {
        .mf-selection-report {
            height: auto;
            overflow: visible;
            background: #fff;
        }
        .mf-report-section,
        .mf-report-hero {
            break-inside: avoid;
        }
    }
`)()
