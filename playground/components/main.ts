import { LitElement, css, html, svg, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import {
    panelStyles,
    card,
    formGroup,
    textField,
    numberField,
    selectField,
    rangeField,
    rangeError,
    radioGroup,
    switchField,
    flow,
    footer,
    progressBar,
    tabs,
    dialog,
    capabilityCard,
    capabilityPanel,
    cascaderField,
    button,
    fieldLabel,
    nodePlaceholder,
    nodeStatus,
    executionAccordion,
    platformLinks,
    warningCard,
    timeline,
    cockpit,
    activityIcon,
    currencyIcon,
    currencyNames,
    uiIcon,
    platformIcon,
    platforms,
    countryRegions,
    sitesOfPlatform,
    currencyOfPlatformSite,
    currencyName,
} from '@mofang/browser'
import type { CascadeOption, RangeValue, CurrencyCode, IconName } from '@mofang/browser'
import './states'
import './products'
import './foundation'
import './publish-shop'
import './report'
import './report-schema'
import './placeholders'
import { galleryRegistry, galleryEntries } from './registry'
import { overviewPreview } from './overview'
import { workbench } from './inspector'
import { componentUsage } from './usage'
import { validateCockpitNodes } from './debug-validation'
import type { CockpitNode } from '@mofang/browser'

const icon = (kind: 'sparkles' | 'search' | 'collect' | 'send' | 'settings' = 'sparkles') =>
    html`<svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        ${kind === 'search'
            ? svg`<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5"/>`
            : kind === 'collect'
              ? svg`<rect x="4" y="5" width="16" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m6 18 5-5 3 3 3-3 3 3M16 2v6m-3-3h6"/>`
              : kind === 'send'
                ? svg`<path d="m3 11 18-8-8 18-3-8-7-2Zm7 2L21 3"/>`
                : kind === 'settings'
                  ? svg`<path d="M4 6h16M4 12h16M4 18h16M9 3v6m7 0v6m-7 0v6"/>`
                  : svg`<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3ZM20 2v4m-2-2h4"/>`}
    </svg>`

const categories: readonly CascadeOption[] = [
    {
        value: 'beauty',
        label: '美妆个护',
        children: [
            {
                value: 'skin',
                label: '护肤',
                children: [
                    { value: 'cream', label: '面霜' },
                    { value: 'cleanser', label: '洁面' },
                ],
            },
            { value: 'makeup', label: '彩妆', children: [{ value: 'lipstick', label: '口红' }] },
        ],
    },
    {
        value: 'digital',
        label: '手机与数码',
        children: [
            {
                value: 'accessory',
                label: '数码配件',
                children: [{ value: 'case', label: '手机壳' }],
            },
        ],
    },
    {
        value: 'home',
        label: '家居生活',
        children: [
            {
                value: 'storage',
                label: '收纳整理',
                children: [
                    { value: 'box', label: '收纳盒' },
                    { value: 'shelf', label: '置物架' },
                ],
            },
        ],
    },
    { value: 'pets', label: '宠物用品', children: [{ value: 'pet-food', label: '宠物食品' }] },
    { value: 'baby', label: '母婴用品', disabled: true },
]
const entries = [
    ['overview', '组件总览'],
    ...galleryEntries.map((item) => [item.id, item.label]),
] as const
const groups = [
    { title: '', ids: ['overview'] },
    ...galleryRegistry.map((group) => ({
        title: group.title,
        ids: group.items.filter((item) => !item.overviewOnly).map((item) => item.id),
    })),
]

const steps = [
    {
        id: 'selection',
        title: '选品调研',
        description: '6.5亿实时商品数据，一键锁定爆款商品',
        icon: 'sparkles',
    },
    {
        id: 'collection',
        title: '商品采集',
        description: '从商品图中识别材质、款式与卖点',
        icon: 'collect',
    },
    {
        id: 'optimization',
        title: '商品信息优化',
        description: '依据来源证据匹配并补全类目属性',
        icon: 'sparkles',
    },
    { id: 'publishing', title: '上架', description: '发布商品到指定平台店铺', icon: 'send' },
] as const

/** 组件预览使用明确本地示例，任何操作均不连接真实能力或运行记录。 */
export class ComponentGallery extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
                height: 100dvh;
                overflow: hidden;
                --mf-accent: #338fff;
                --primary: #338fff;
                --primary-foreground: #fff;
                background: #f6f7f9;
                color: #30343b;
            }
            .gallery {
                height: 100%;
                display: grid;
                grid-template-columns: 216px minmax(0, 1fr);
                grid-template-rows: 64px minmax(0, 1fr);
            }
            .topbar {
                grid-column: 1/-1;
                padding: 0 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #e6e9ee;
                background: #fff;
            }
            .topbar strong {
                font-size: 17px;
                font-weight: 600;
            }
            .topbar span {
                color: #717986;
                font-size: 12px;
            }
            .navigation {
                min-height: 0;
                min-width: 0;
                padding: 18px 10px;
                border-right: 1px solid #e6e9ee;
                background: #fff;
                overflow-y: auto;
            }
            .navigation-group + .navigation-group {
                margin-top: 18px;
            }
            .navigation-group h2 {
                color: #9098a4;
                font-size: 11px;
                font-weight: 500;
                padding: 0 13px;
                margin: 0 0 6px;
            }
            .navigation button {
                user-select: none;
                display: block;
                width: 100%;
                border: 0;
                background: transparent;
                font: inherit;
                color: #59616d;
                text-align: left;
                padding: 9px 13px;
                margin-bottom: 3px;
                border-radius: 4px;
                cursor: pointer;
            }
            .navigation button[aria-current='page'] {
                color: #338fff;
                background: #edf5ff;
                font-weight: 500;
            }
            .navigation button:hover {
                background: #f5f8fc;
            }
            main {
                display: flex;
                flex-direction: column;
                min-width: 0;
                padding: 24px;
                overflow: auto;
                min-height: 0;
            }
            .page-heading {
                flex: 0 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                gap: 20px;
            }
            .page-heading h1 {
                margin: 0 0 4px;
                font-size: 21px;
                font-weight: 600;
            }
            .page-heading p {
                color: #77808e;
                font-size: 12px;
            }
            .demo-surface {
                background: #fff;
                border: 1px solid #e5e8ed;
                padding: 28px;
                border-radius: 6px;
                box-sizing: border-box;
                flex: 0 0 auto;
                width: 100%;
                max-width: none;
                min-width: 0;
            }
            .demo-surface[data-component='report'],
            .demo-surface[data-component='report-parts'] {
                flex: 1 1 auto;
                padding: 0;
                min-height: 0;
                overflow: hidden;
            }
            .demo-surface[data-component='table'],
            .demo-surface[data-component='products'] {
                --mf-table-preview-height: max(340px, calc(100dvh - 440px));
            }
            .demo-surface > h2 {
                margin: 0 0 22px;
                font-size: 16px;
            }
            .demo-surface .mf-field {
                max-width: none;
            }
            .demo-stack {
                display: grid;
                gap: 22px;
            }
            .svg-example {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #338fff;
                min-width: 130px;
            }
            .demo-row {
                display: flex;
                gap: 20px;
                align-items: center;
                flex-wrap: wrap;
            }
            .example-card {
                width: 300px;
            }
            .output {
                margin-top: 20px;
                padding: 12px 14px;
                background: #f6f8fb;
                color: #677281;
                font-size: 12px;
                border-radius: 4px;
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }
            .combo {
                height: calc(100dvh - 190px);
                flex-shrink: 0;
                min-height: 490px;
                display: grid;
                grid-template-columns: 236px minmax(0, 1fr);
                border: 1px solid #e5e8ed;
                border-radius: 6px;
                background: #fff;
                overflow: hidden;
            }
            .steps {
                padding: 12px;
                border-right: 1px solid #ebeef2;
                display: flex;
                flex-direction: column;
                gap: 10px;
                background: #fff;
                overflow-y: auto;
            }
            .steps .mf-card-heading h3 {
                font-size: 15px;
            }
            .steps .mf-card-heading p {
                font-size: 11px;
            }
            .steps .mf-card-icon {
                width: 34px;
                height: 38px;
            }
            .steps .mf-card-icon svg {
                width: 21px;
                height: 21px;
            }
            .combo-right {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                min-height: 0;
            }
            .combo-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 20px 14px;
                flex-shrink: 0;
                gap: 14px;
            }
            .combo-head h2 {
                font-size: 16px;
            }
            .combo-head p {
                font-size: 11px;
                color: #818996;
                margin-top: 2px;
            }
            .combo-content {
                flex: 1;
                min-height: 0;
                padding: 8px 20px 24px;
                overflow-y: auto;
            }
            .combo-content .mf-field {
                margin: 0;
            }
            .combo-content .mf-form-grid {
                gap: 18px;
            }
            .section-heading {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 24px 0 12px;
            }
            .section-heading h3 {
                font-size: 14px;
            }
            .section-heading span {
                color: #818996;
                font-size: 12px;
            }
            .capabilities {
                display: grid;
                gap: 10px;
            }
            .mf-dialog-body .mf-form-group {
                padding: 0;
                border: 0;
            }
            .mf-dialog-body .mf-form-group legend {
                font-size: 16px;
                margin-bottom: 18px;
                padding: 0;
            }
            .mf-dialog-body .mf-form-grid {
                gap: 22px 20px;
            }
            .mf-dialog-body .mf-field {
                margin: 0;
            }
            .mf-dialog-body .mf-radio-group {
                margin-top: 28px;
            }
            .mf-dialog-body .mf-radio-group legend {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 18px;
            }
            .platforms {
                display: flex;
                gap: 14px;
                align-items: center;
                padding-top: 16px;
                color: #777f8a;
                font-size: 12px;
            }
            .platform-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 27px;
                height: 27px;
                font-weight: 700;
                border-radius: 4px;
                background: #f5f6f8;
                color: #56606d;
            }
            .platform-logo:first-of-type {
                color: #f56835;
            }
            .report {
                min-height: 150px;
                padding: 12px 0;
                color: #657183;
                line-height: 1.9;
            }
            .runtime-combo {
                display: grid;
                grid-template-columns: minmax(0, 1fr) 340px;
                transition: grid-template-columns 160ms ease-out;
                height: calc(100dvh - 190px);
                flex-shrink: 0;
                min-height: 500px;

                border: 1px solid #e5e8ed;
                border-radius: 6px;
                background: #fff;
                overflow: hidden;
            }
            .runtime-main {
                min-width: 0;
                padding: 20px;
                overflow: auto;
            }
            .runtime-side {
                --mf-cockpit-content-width: 339px;
                border-left: 1px solid #e8ebf0;
                display: grid;
                grid-template-rows: minmax(0, 1fr) 39px;
                min-height: 0;
                padding: 0;
            }
            .runtime-side .mf-cockpit {
                border: 0;
                border-radius: 0;
            }
            .runtime-controls {
                height: 39px;
                overflow: hidden;
                padding: 10px 14px;
                border-top: 1px solid #e8ebf0;
            }
            .runtime-combo[data-collapsed='true'] {
                grid-template-columns: minmax(0, 1fr) 44px;
            }
            .runtime-combo[data-collapsed='true'] .runtime-controls {
                visibility: hidden;
            }
            .cockpit-demo {
                --mf-cockpit-content-width: 348px;
                transition: width 160ms ease-out;

                height: min(740px, calc(100dvh - 240px));
                min-height: 420px;
                width: 350px;
            }
            .cockpit-demo[data-collapsed='true'] {
                width: 44px;
            }
            .runtime-side > .mf-switch-label {
                margin-top: 20px;
            }
            .preview-note {
                margin-top: 14px;
                color: #747f8e;
                font-size: 12px;
            }
            .flow-chip {
                border: 1px solid #dce3ec;
                background: #f7f9fc;
                padding: 12px 20px;
                border-radius: 4px;
            }
            .footer-demo {
                display: flex;
                flex-direction: column;
                height: 340px;
                border: 1px solid #e6e9ee;
            }
            .footer-demo article {
                overflow: auto;
                flex: 1;
                padding: 20px;
            }
            button:focus-visible {
                outline: 2px solid #87bbff;
                outline-offset: 2px;
            }
            .mf-range > .mf-field > .mf-label {
                position: absolute;
            }
            @media (prefers-reduced-motion: reduce) {
                .runtime-combo,
                .cockpit-demo {
                    --mf-cockpit-content-width: 348px;
                    transition: width 160ms ease-out;
                    transition: none;
                }
            }
            .overview-group {
                margin-bottom: 30px;
            }
            .overview-group > h2 {
                margin: 0 0 12px;
                font-size: 15px;
                color: #4b5563;
            }
            .overview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
                gap: 18px;
            }
            .overview-group:has(.overview-entry:only-child) .overview-grid {
                grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
            }
            .overview-entry {
                position: relative;
                display: block;
                padding: 0;
                overflow: hidden;
                border: 1px solid #e1e6ed;
                border-radius: 6px;
                background: #fff;
                color: #303b4a;
                text-decoration: none;
            }
            .overview-entry:hover {
                border-color: #8cbbff;
                background: #f8fbff;
            }
            .overview-entry:focus-visible {
                outline: 2px solid #338fff;
                outline-offset: 2px;
            }
            .overview-caption {
                padding: 16px 38px 16px 18px;
                border-top: 1px solid #e8edf3;
                background: #fff;
                min-height: 76px;
                box-sizing: border-box;
            }
            .overview-caption > strong {
                font-size: 14px;
            }
            .overview-preview {
                height: 220px;
                display: flex;
                align-items: center;
                padding: 22px;
                box-sizing: border-box;
                background: linear-gradient(145deg, #f8fafc, #f1f5fa);
                overflow: hidden;
            }
            .overview-preview-content {
                width: 100%;
                min-width: 0;
                pointer-events: none;
            }
            .overview-preview-content[data-preview='combined'],
            .overview-preview-content[data-preview='publish-shop'],
            .overview-preview-content[data-preview='card'],
            .overview-preview-content[data-preview='dialog'],
            .overview-preview-content[data-preview='capability-panel'] {
                flex-shrink: 0;
                width: 125%;
                transform: scale(0.8);
                transform-origin: center;
                margin-left: -12.5%;
            }
            .overview-preview-content[data-preview='report'],
            .overview-preview-content[data-preview='report-parts'],
            .overview-preview-content[data-preview='report-trend'],
            .overview-preview-content[data-preview='report-opportunity'],
            .overview-preview-content[data-preview='report-category'] {
                flex-shrink: 0;
                width: 166.67%;
                transform: scale(0.6);
                transform-origin: center;
                margin-left: -33.33%;
            }
            .overview-preview-content[data-preview='report-metric'] .mf-report-score {
                display: none;
            }
            .overview-preview-content .mf-field {
                margin: 0 0 12px;
            }
            .overview-preview-content .mf-card {
                padding: 14px;
            }
            .overview-preview-content .mf-card h3 {
                font-size: 14px;
            }
            .overview-preview-content .mf-table th,
            .overview-preview-content .mf-table td {
                padding: 9px 10px;
                font-size: 11px;
            }
            .overview-preview-content .mf-progress {
                margin: 12px 0;
            }
            .overview-preview-content .mf-report-trend {
                max-height: 190px;
                overflow: hidden;
            }
            .overview-preview-content .mf-node-placeholder {
                min-height: 170px;
                padding: 10px;
            }
            .overview-preview-content .mf-node-placeholder svg {
                max-height: 110px;
            }
            .overview-preview-content .mf-placeholder {
                padding: 10px 0;
            }
            .overview-preview-content .mf-timeline {
                margin: 16px 0 0;
            }
            .overview-preview-content .mf-range {
                grid-template-columns: 1fr;
                gap: 6px;
            }
            .overview-preview-content .mf-capability {
                background: #fff;
            }
            .overview-stack {
                display: grid;
                gap: 14px;
            }
            .overview-icons {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 22px;
            }
            .overview-icons > * {
                width: 32px;
                height: 32px;
            }
            .overview-dialog {
                background: #fff;
                border: 1px solid #dbe3ed;
                border-radius: 7px;
                overflow: hidden;
                box-shadow: 0 5px 16px #1d416012;
            }
            .overview-dialog h3 {
                font-size: 13px;
                margin: 0;
                padding: 12px 14px;
                border-bottom: 1px solid #e8edf3;
            }
            .overview-dialog-body {
                padding: 12px 14px;
                font-size: 12px;
            }
            .overview-dialog .mf-footer {
                padding: 9px 12px;
            }
            .overview-dialog-body .mf-field {
                margin: 0;
            }
            .overview-footer-spacer {
                padding: 24px 14px;
                font-size: 12px;
                background: #fff;
            }
            .overview-cockpit {
                --mf-cockpit-content-width: 300px;
                height: 200px;
            }
            .overview-cockpit .mf-cockpit__inner {
                width: 100%;
            }
            .overview-preview-content .mf-report-matrix {
                transform: scale(0.75);
                transform-origin: center;
                max-height: 180px;
            }

            .overview-entry p {
                margin: 7px 0 0;
                font-size: 12px;
                line-height: 19px;
                color: #697586;
            }
            .overview-symbol {
                position: absolute;
                right: 12px;
                bottom: 52px;
                top: auto;
                color: #8093ab;
            }
            .heading-actions {
                display: flex;
                gap: 20px;
                align-items: center;
            }
            .heading-actions a {
                color: #338fff;
                font-size: 12px;
                text-decoration: none;
            }
            .example-parameters {
                display: flex;
                flex-wrap: wrap;
                align-items: end;
                gap: 16px;
                padding: 0 0 20px;
                margin-bottom: 20px;
                border-bottom: 1px solid #e6ebf1;
            }
            .example-parameters .mf-field {
                margin: 0;
                width: 180px;
            }
            .example-stage {
                min-width: 0;
            }
            .example-stage > h2,
            .example-parameters > h2 {
                flex-basis: 100%;
                margin: 0 0 6px;
                color: #697586;
                font-size: 12px;
                font-weight: 500;
            }
            .flow-host {
                box-sizing: border-box;
                min-height: 170px;
                padding: 14px;
                border: 1px dashed #b6c5d7;
                border-radius: 5px;
                overflow: auto;
                max-width: 100%;
            }
            .catalog-relations {
                display: grid;
                max-width: 420px;
                gap: 14px;
                margin-bottom: 28px;
            }
            .catalog-relations .mf-field {
                margin: 0;
            }
            .catalog-relations .output {
                margin-top: 0;
            }
            .catalog-directory {
                border-top: 1px solid #e8edf2;
                padding-top: 20px;
            }
            .catalog-directory h2 {
                font-size: 14px;
                margin: 0 0 16px;
            }
            .demo-surface[data-component='input'][data-wide='false'] .mf-field,
            .demo-surface[data-component='required'][data-wide='false'] .mf-field,
            .demo-surface[data-component='select'][data-wide='false'] .mf-field,
            .demo-surface[data-component='icons'][data-wide='false'] .mf-field {
                width: 360px;
                max-width: 100%;
            }
            .demo-surface[data-component='input'][data-wide='false']
                .mf-field:has(input[type='number']) {
                width: 160px;
            }
            .demo-surface[data-component='cascader'][data-wide='false'] .mf-field {
                width: 420px;
                max-width: 100%;
            }
            .demo-surface[data-component='range'][data-wide='false'] .mf-field {
                max-width: 520px;
            }
            .demo-surface[data-component='form'][data-wide='false'] .mf-form-group {
                max-width: 420px;
            }
            .demo-surface[data-component='progress'] .example-stage {
                max-width: 760px;
                display: grid;
                gap: 30px;
            }
            @media (max-width: 1000px) {
                .gallery {
                    grid-template-columns: 190px minmax(0, 1fr);
                }
                main {
                    padding: 18px;
                }
                .combo {
                    grid-template-columns: 195px minmax(0, 1fr);
                }
                .steps {
                    padding: 8px;
                }
                .steps .mf-card-icon {
                    display: none;
                }
            }
        `,
    ]
    static override properties = {
        active: { state: true },
        step: { state: true },
        text: { state: true },
        amount: { state: true },
        range: { state: true },
        category: { state: true },
        platform: { state: true },
        site: { state: true },
        checked: { state: true },
        sort: { state: true },
        tab: { state: true },
        modal: { state: true },
        configOpen: { state: true },
        configDraft: { state: true },
        configSaved: { state: true },
        result: { state: true },
        progress: { state: true },
        showProgress: { state: true },
        readonly: { state: true },
        flowDirection: { state: true },
        enabled: { state: true },
        accordionOpen: { state: true },
        heartbeat: { state: true },
        running: { state: true },
        cockpitCollapsed: { state: true },
        rating: { state: true },
        margin: { state: true },
        fieldWide: { state: true },
        flowWidth: { state: true },
        flowWrap: { state: true },
        dialogLong: { state: true },
        dialogSize: { state: true },
        cockpitFixture: { state: true },
    }
    private readonly pageState = new Map<string, Record<string, unknown>>()
    private initialDemoState: Record<string, unknown> = {}
    private readonly stateKeys = [
        'step',
        'text',
        'amount',
        'range',
        'category',
        'platform',
        'site',
        'checked',
        'sort',
        'tab',
        'configDraft',
        'configSaved',
        'progress',
        'showProgress',
        'readonly',
        'flowDirection',
        'enabled',
        'accordionOpen',
        'heartbeat',
        'running',
        'cockpitCollapsed',
        'rating',
        'margin',
        'fieldWide',
        'flowWidth',
        'flowWrap',
        'dialogLong',
        'dialogSize',
        'cockpitFixture',
    ] as const
    declare cockpitFixture: readonly CockpitNode[] | undefined
    declare active: string
    declare step: string
    declare text: string
    declare amount: number | undefined
    declare range: RangeValue
    declare category: readonly string[]
    declare platform: string
    declare site: string
    declare checked: boolean
    declare sort: string
    declare tab: string
    declare modal: boolean
    declare configOpen: boolean
    declare configDraft: Record<string, RangeValue | string>
    declare configSaved: Record<string, RangeValue | string>
    declare result: string
    declare progress: number
    declare showProgress: boolean
    declare readonly: boolean
    declare flowDirection: 'horizontal' | 'vertical'
    declare enabled: Record<string, boolean>
    declare heartbeat: boolean
    declare accordionOpen: boolean
    declare running: boolean
    declare cockpitCollapsed: boolean
    declare rating: number | undefined
    declare margin: number | undefined
    declare fieldWide: boolean
    declare flowWidth: number
    declare flowWrap: boolean
    declare dialogLong: boolean
    declare dialogSize: 'default' | 'large'
    constructor() {
        super()
        this.switchDemoState(new URLSearchParams(location.search).get('component') ?? 'overview')
        this.step = 'selection'
        this.text = ''
        this.amount = 100
        this.range = {}
        this.category = []
        this.platform = 'tiktok_shop'
        this.site = 'US'
        this.checked = true
        this.sort = 'sales7'
        this.tab = 'list'
        this.modal = false
        this.configOpen = false
        this.configSaved = {}
        this.configDraft = {}
        this.result = ''
        this.progress = 56
        this.showProgress = true
        this.readonly = false
        this.flowDirection = 'horizontal'
        this.enabled = { dataFilter: true, supplier: false }
        this.accordionOpen = true
        this.running = true
        this.heartbeat = true
        this.cockpitCollapsed = false
        this.rating = 4.5
        this.margin = undefined
        this.fieldWide = false
        this.flowWidth = 280
        this.flowWrap = true
        this.dialogLong = false
        this.dialogSize = 'default'
        this.initialDemoState = this.captureDemoState()
    }
    private choose(id: string, stateExample?: string) {
        const item = galleryEntries.find((entry) => entry.id === id)
        this.switchDemoState(item?.component ?? id)
        this.result = ''
        const url = new URL(location.href)
        url.searchParams.set('component', this.active)
        url.hash = item?.anchor ?? ''
        if (stateExample) url.searchParams.set('example', stateExample)
        else url.searchParams.delete('example')
        history.pushState({}, '', url)
        this.scrollToSection(item?.anchor)
    }
    private captureDemoState() {
        return Object.fromEntries(this.stateKeys.map((key) => [key, structuredClone(this[key])]))
    }
    private switchDemoState(id: string) {
        if (id === this.active) return
        this.pageState.set(this.active, this.captureDemoState())
        Object.assign(this, structuredClone(this.pageState.get(id) ?? this.initialDemoState))
        this.modal = false
        this.configOpen = false
        this.active = id
    }
    private scrollToSection(anchor?: string) {
        void this.updateComplete.then(() => {
            const report = this.renderRoot.querySelector('mf-report-parts-demo')
            void (report as LitElement | null)?.updateComplete.then(() => {
                report?.shadowRoot
                    ?.getElementById(anchor ?? location.hash.slice(1))
                    ?.scrollIntoView()
            })
        })
    }
    private readonly historyChanged = () => {
        this.switchDemoState(new URLSearchParams(location.search).get('component') ?? 'overview')
        this.result = ''
        this.scrollToSection()
    }
    override connectedCallback() {
        super.connectedCallback()
        window.addEventListener('popstate', this.historyChanged)
        this.scrollToSection()
    }
    override disconnectedCallback() {
        window.removeEventListener('popstate', this.historyChanged)
        super.disconnectedCallback()
    }
    private inspectorControls() {
        const textControl = () =>
            textField({
                name: 'inspector-text',
                label: '输入内容',
                value: this.text,
                onChange: (value) => {
                    this.text = value
                },
            })
        switch (this.active) {
            case 'input':
                return html`${textControl()}${numberField({
                    name: 'inspector-amount',
                    label: '商品数量',
                    value: this.amount,
                    min: 0,
                    max: 100,
                    onChange: (value) => {
                        this.amount = value
                    },
                })}`
            case 'required':
                return textControl()
            case 'card':
                return switchField({
                    label: '卡片选中',
                    checked: this.checked,
                    onChange: (value) => {
                        this.checked = value
                    },
                })
            case 'select':
                return selectField({
                    name: 'inspector-site',
                    label: '当前站点',
                    value: this.site,
                    options: [
                        { value: 'US', label: '美国' },
                        { value: 'GB', label: '英国' },
                        { value: 'TH', label: '泰国' },
                    ],
                    onChange: (value) => {
                        this.site = value ?? ''
                    },
                })
            case 'cascader':
                return cascaderField({
                    name: 'inspector-category',
                    label: '类目路径',
                    value: this.category,
                    options: categories,
                    onChange: (value) => {
                        this.category = value
                    },
                })
            case 'form':
            case 'combined':
                return html`${textControl()}${switchField({
                    label: '只读预览',
                    checked: this.readonly,
                    onChange: (value) => {
                        this.readonly = value
                    },
                })}`
            case 'range':
                return rangeField({
                    name: 'inspector-range',
                    label: '区间数据',
                    value: this.range,
                    min: 0,
                    onChange: (value) => {
                        this.range = value
                    },
                })
            case 'radio':
                return radioGroup({
                    name: 'inspector-radio',
                    label: '当前选择',
                    value: this.sort,
                    options: [
                        { value: 'sales7', label: '不启用' },
                        { value: 'manual', label: '指定步骤' },
                    ],
                    onChange: (value) => {
                        this.sort = value
                    },
                })
            case 'switch':
                return switchField({
                    label: '是否选中',
                    checked: this.checked,
                    onChange: (value) => {
                        this.checked = value
                    },
                })
            case 'progress':
                return numberField({
                    name: 'inspector-progress',
                    label: '进度值',
                    value: this.progress,
                    min: 0,
                    max: 100,
                    onChange: (value) => {
                        this.progress = value ?? 0
                    },
                })
            case 'svg':
            case 'timeline':
            case 'runtime':
            case 'cockpit':
                return switchField({
                    label: '运行展示动画',
                    checked: this.running,
                    onChange: (value) => {
                        this.running = value
                    },
                })
            case 'placeholder':
                return switchField({
                    label: '播放心跳',
                    checked: this.heartbeat,
                    onChange: (value) => {
                        this.heartbeat = value
                    },
                })
            case 'accordion':
                return switchField({
                    label: '展开内容',
                    checked: this.accordionOpen,
                    onChange: (value) => {
                        this.accordionOpen = value
                    },
                })
            default:
                return undefined
        }
    }
    private preview() {
        const content = this.demo()
        if (
            [
                'overview',
                'products',
                'table',
                'text',
                'images',
                'controls',
                'summary',
                'transitions',
                'states',
                'placeholders',
                'report',
                'report-parts',
                'publish-shop',
            ].includes(this.active)
        )
            return content
        const nodeData = [
            {
                id: 'research',
                title: '选品调研',
                status: '执行中',
                statusTone: 'active',
                controlLabel: '系统正在推进',
                processTitle: 'Agent 执行过程',
                process: this.processItems(),
                capabilities: [
                    { id: 'filter', title: '数据筛选' },
                    { id: 'supplier', title: '供应商寻源' },
                ],
            },
        ]
        const details = componentUsage(this.active)
        return workbench(
            {
                id: this.active,
                title: '用法与演示数据',
                description: '右侧只调整本地预览，组件数据和动作仍由调用方持有。',
                ...details,
                ...(this.active === 'cockpit'
                    ? {
                          data: nodeData,
                          validate: validateCockpitNodes,
                          onApply: (value: unknown) => {
                              this.cockpitFixture = value as readonly CockpitNode[]
                          },
                          onReset: () => {
                              this.cockpitFixture = undefined
                          },
                      }
                    : {}),
            },
            content,
            this.inspectorControls(),
        )
    }
    private overview() {
        return html`<div class="overview">
            ${galleryRegistry.map(
                (group) =>
                    html`<section class="overview-group">
                        <h2>${group.title}</h2>
                        <div class="overview-grid">
                            ${group.items.map(
                                (item) =>
                                    html`<a
                                        class="overview-entry"
                                        href=${`?component=${item.component ?? item.id}${item.anchor ? `#${item.anchor}` : ''}`}
                                        @click=${(event: MouseEvent) => {
                                            if (
                                                !event.metaKey &&
                                                !event.ctrlKey &&
                                                !event.shiftKey &&
                                                event.button === 0
                                            ) {
                                                event.preventDefault()
                                                this.choose(item.id)
                                            }
                                        }}
                                        ><div class="overview-preview" inert aria-hidden="true">
                                            <div
                                                class="overview-preview-content"
                                                data-preview=${item.id}
                                            >
                                                ${overviewPreview(item.id)}
                                            </div>
                                        </div>
                                        <div class="overview-caption">
                                            <span class="overview-symbol"
                                                >${uiIcon('chevron-right')}</span
                                            ><strong>${item.label}</strong>
                                            <p>${item.description}</p>
                                        </div></a
                                    >`,
                            )}
                        </div>
                    </section>`,
            )}
        </div>`
    }
    private openConfig() {
        this.configDraft = structuredClone(this.configSaved)
        this.configOpen = true
    }
    private updateRange(value: RangeValue) {
        this.range = value
    }
    private fieldForm() {
        return formGroup(
            {},
            html`
                ${selectField({
                    name: 'platform',
                    label: '平台',
                    required: true,
                    compact: true,
                    value: this.platform,
                    options: platforms.map((item) => ({ value: item.id, label: item.name })),
                    onChange: (v) => {
                        this.platform = v ?? ''
                        this.site = ''
                    },
                    readOnly: this.readonly,
                })}
                ${selectField({
                    name: 'site',
                    label: '站点',
                    required: true,
                    compact: true,
                    value: this.site,
                    options: sitesOfPlatform(this.platform).map((item) => ({
                        value: item.regionCode,
                        label:
                            countryRegions.find((region) => region.code === item.regionCode)
                                ?.name ?? item.regionCode,
                    })),
                    onChange: (v) => {
                        this.site = v ?? ''
                    },
                    readOnly: this.readonly,
                })}
                ${cascaderField({
                    name: 'category',
                    label: '类目',
                    optional: true,
                    compact: true,
                    value: this.category,
                    options: categories,
                    placeholder: '请选择类目（可选）',
                    onChange: (v) => {
                        this.category = v
                    },
                    readOnly: this.readonly,
                })}
                ${numberField({
                    name: 'count',
                    label: '候选商品数量',
                    required: true,
                    compact: true,
                    value: this.amount,
                    min: 1,
                    max: 100,
                    integer: true,
                    spinner: true,
                    onChange: (v) => {
                        this.amount = v
                    },
                    readOnly: this.readonly,
                })}
                ${rangeField({
                    name: 'price',
                    label: '价格区间',
                    required: true,
                    compact: true,
                    value: this.range,
                    minPlaceholder: '最低价',
                    maxPlaceholder: '最高价',
                    min: 0,
                    suffixText: currencyOfPlatformSite(this.platform, this.site)?.symbol ?? '',
                    separator: '–',
                    onChange: (v) => this.updateRange(v),
                    readOnly: this.readonly,
                })}
                ${numberField({
                    name: 'margin',
                    label: '预期利润率',
                    compact: true,
                    value: this.margin,
                    min: 0,
                    max: 100,
                    placeholder: '利润=采购成本 X 预期利润率',
                    suffixText: '%',
                    readOnly: this.readonly,
                    onChange: (v) => {
                        this.margin = v
                        this.result = v === undefined ? '利润率已清空' : `利润率：${v}%`
                    },
                })}
            `,
        )
    }
    private platforms() {
        return platformLinks({
            items: ['1688', 'amazon', 'aliexpress', 'temu'].map((id) => ({
                id,
                label: platforms.find((item) => item.id === id)?.name ?? id,
                icon: platformIcon(id, { size: 25 }),
            })),
        })
    }
    private abilities() {
        const readOnly = this.active === 'combined' && this.readonly
        return html`<div class="capabilities">
            ${capabilityCard({
                title: '数据筛选',
                description: '按价格、销量与增长表现筛选候选商品，匹配你的选品目标',
                enabled: this.enabled.dataFilter ?? true,
                disabled: readOnly,
                onToggle: (v) => {
                    this.enabled = { ...this.enabled, dataFilter: v }
                },
                onConfigure: () => this.openConfig(),
            })}${capabilityCard({
                title: '供应商寻源',
                description: '查找可采购的货源，比较成本、评价与履约条件',
                enabled: this.enabled.supplier ?? false,
                disabled: readOnly,
                onToggle: (v) => {
                    this.enabled = { ...this.enabled, supplier: v }
                },
            })}${capabilityCard({
                title: '商品资料采集',
                description: '采集商品标题、图片、销售规格及来源信息',
                enabled: true,
                required: true,
            })}${capabilityCard({
                title: '全网潜力品发现',
                description: '发现新的商品机会与市场趋势',
                enabled: false,
                disabled: true,
                disabledReason: '敬请期待',
            })}
        </div>`
    }
    private configBody() {
        const fields = [
            ['price', '价格区间', '最低价', '最高价'],
            ['sales', '销量区间', '最低销量', '最高销量'],
            ['creators', '带货达人数量区间', '最少达人数', '最多达人数'],
            ['rate', '达人出单率范围', '最低 %', '最高 %'],
            ['sales7', '近 7 天销量范围', '最低销量', '最高销量'],
            ['gmv7', '近 7 天 GMV 范围', '最低 GMV', '最高 GMV'],
            ['gmv', '累计总 GMV 范围', '最低 GMV', '最高 GMV'],
        ] as const
        return html`${formGroup(
            { title: '筛选条件', columns: 2 },
            html`${fields.map(([key, label, min, max]) =>
                rangeField({
                    name: `filter-${key}`,
                    label,
                    compact: true,
                    value: (this.configDraft[key] as RangeValue | undefined) ?? {},
                    min: 0,
                    minPlaceholder: min,
                    maxPlaceholder: max,
                    onChange: (v) => {
                        this.configDraft = { ...this.configDraft, [key]: v }
                    },
                }),
            )}${['上架时间范围', '是否为爆品', '是否为新上架商品'].map((label, index) =>
                selectField({
                    name: `filter-select-${index}`,
                    label,
                    compact: true,
                    value: (this.configDraft[`select-${index}`] as string | undefined) ?? 'all',
                    options: [
                        { value: 'all', label: '不限' },
                        { value: 'yes', label: index ? '是' : '近 7 天' },
                        { value: 'no', label: index ? '否' : '近 30 天' },
                    ],
                    onChange: (v) => {
                        this.configDraft = { ...this.configDraft, [`select-${index}`]: v ?? 'all' }
                    },
                }),
            )}`,
        )}${radioGroup({
            name: 'sort',
            label: '排序条件',
            value: (this.configDraft.sort as string | undefined) ?? 'sales7',
            options: [
                { value: 'sales7', label: '近7日销量' },
                { value: 'gmv7', label: '近7日销售额' },
                { value: 'commission', label: '佣金比例' },
                { value: 'sales', label: '总销量' },
                { value: 'gmv', label: '总销售额' },
                { value: 'creators', label: '关联达人数' },
            ],
            onChange: (v) => {
                this.configDraft = { ...this.configDraft, sort: v }
            },
        })}`
    }
    private combo() {
        const current = steps.find((item) => item.id === this.step) ?? steps[0]
        return html`<div class="combo">
            <aside class="steps">
                ${steps.map((item) =>
                    card(
                        {
                            title: item.title,
                            description: item.description,
                            variant: 'compact',
                            selected: this.step === item.id,
                            icon: icon(item.icon),
                            onClick: () => {
                                this.step = item.id
                            },
                        },
                        html``,
                    ),
                )}
            </aside>
            <div class="combo-right">
                <header class="combo-head">
                    <div>
                        <h2>${current.title}</h2>
                        <p>${current.description}</p>
                    </div>
                    ${button({
                        label: '填入示例',
                        disabled: this.readonly,
                        onClick: () => {
                            this.amount = 100
                            this.range = { min: 10, max: 80 }
                            this.category = ['home', 'storage', 'box']
                        },
                    })}
                </header>
                <div class="combo-content">
                    ${this.step === 'selection'
                        ? this.fieldForm()
                        : html`${formGroup(
                                  { title: '节点设置' },
                                  html`${textField({
                                      name: 'example-title',
                                      label: current.title,
                                      value: this.text,
                                      compact: true,
                                      placeholder: '请输入设置内容',
                                      onChange: (v) => {
                                          this.text = v
                                      },
                                  })}`,
                              )}
                              <div class="platforms">${this.platforms()}</div>`}
                    <div class="section-heading">
                        <h3>能力子项</h3>
                        <span
                            >${1 + Object.values(this.enabled).filter(Boolean).length} / 4
                            已开启</span
                        >
                    </div>
                    ${this.abilities()}${this.result
                        ? html`<div class="output" role="status">${this.result}</div>`
                        : nothing}
                </div>
                ${footer({
                    actions: button({
                        label: this.step === 'publishing' ? '确认并执行' : '确认进行下一步',
                        variant: 'accent',
                        disabled: this.readonly || !!rangeError(this.range),
                        onClick: () => {
                            const index = steps.findIndex((item) => item.id === this.step)
                            if (index < steps.length - 1) this.step = steps[index + 1]!.id
                            else this.result = '本地组件示例已确认，未启动真实工作流'
                        },
                    }),
                })}
            </div>
        </div>`
    }
    private processItems() {
        return [
            {
                id: 'prepare',
                title: '准备',
                description: '整理当前节点的输入与约束',
                tone: 'complete' as const,
            },
            {
                id: 'research',
                title: '执行调研',
                description: '按当前参数筛选候选商品',
                tone: 'active' as const,
            },
            {
                id: 'summarize',
                title: '汇总结果',
                description: '等待调研结果生成',
                tone: 'neutral' as const,
            },
        ]
    }
    private cockpit() {
        return cockpit({
            id: 'gallery-cockpit',
            running: this.running,
            collapsed: this.cockpitCollapsed,
            onCollapsedChange: (v) => {
                this.cockpitCollapsed = v
            },
            nodes: this.cockpitFixture ?? [
                {
                    id: 'research',
                    title: '选品调研',
                    status: this.running ? '执行中' : '已暂停',
                    statusTone: this.running ? 'active' : 'warning',
                    controlLabel: this.running ? '系统正在推进' : '等待继续',
                    icon: icon(),
                    ...(this.running
                        ? {}
                        : {
                              notice: {
                                  title: '运行已暂停',
                                  description: '继续后将使用当前已确认的选品参数。',
                              },
                          }),
                    processTitle: 'Agent 执行过程',
                    process: this.processItems(),
                    capabilities: [
                        { id: 'filter', title: '数据筛选' },
                        { id: 'supplier', title: '供应商寻源' },
                        { id: 'category', title: '类目洞察' },
                        { id: 'demand', title: '需求验证' },
                        { id: 'compare', title: '跨平台对比' },
                        { id: 'pricing', title: '利润测算' },
                    ],
                },
            ],
            footerAction: {
                label: this.running ? '暂停' : '继续',
                onClick: () => {
                    this.running = !this.running
                },
            },
        })
    }
    private runtime() {
        return html`<div class="runtime-combo" data-collapsed=${this.cockpitCollapsed}>
            <div class="runtime-main">
                <div class="demo-stack">
                    ${nodeStatus({
                        title: this.running ? '执行中' : '已暂停',
                        description: this.running
                            ? '正在调研商品来源与候选范围'
                            : '可重新配置选品参数，或点击右上角继续',
                        action: {
                            label: this.running ? '暂停' : '重新配置',
                            onClick: () => {
                                if (this.running) this.running = true
                                else this.openConfig()
                            },
                        },
                    })}${executionAccordion({
                        id: 'runtime',
                        title: '调研商品来源与候选范围',
                        tag: '执行',
                        elapsed: '已运行 0 秒',
                        open: this.accordionOpen,
                        onOpenChange: (v) => {
                            this.accordionOpen = v
                        },
                        rows: [
                            {
                                id: 'run',
                                tag: '执行',
                                text: '正在准备调研资料与选品范围。',
                                tone: 'tool',
                            },
                            {
                                id: 'understand',
                                tag: '理解',
                                text: '根据当前参数整理候选商品信息。',
                                tone: 'reason',
                            },
                        ],
                    })}${progressBar({ label: '调研进度', value: this.progress })}${tabs({
                        id: 'runtime-tabs',
                        label: '选品结果',
                        value: this.tab,
                        variant: 'underline',
                        onChange: (v) => {
                            this.tab = v
                        },
                        items: [
                            {
                                value: 'list',
                                label: '选品列表',
                                content: nodePlaceholder({
                                    title: this.running ? '选品调研进行中' : '选品调研已暂停',
                                    animate: this.heartbeat,
                                }),
                            },
                            {
                                value: 'report',
                                label: '选品报告',
                                content: html`<article class="report">
                                    <h3>选品调研报告</h3>
                                    <p>等待本次调研生成报告。</p>
                                </article>`,
                            },
                        ],
                    })}
                </div>
            </div>
            <aside class="runtime-side">
                ${this.cockpit()}
                <div class="runtime-controls">
                    ${switchField({
                        label: '运行动画',
                        checked: this.running,
                        onChange: (v) => {
                            this.running = v
                        },
                    })}
                </div>
            </aside>
        </div>`
    }
    private demo(): TemplateResult {
        switch (this.active) {
            case 'overview':
                return this.overview()
            case 'placeholders':
                return html`<mf-placeholder-examples></mf-placeholder-examples>`
            case 'report-schema':
                return html`<mf-report-schema-page></mf-report-schema-page>`
            case 'report':
                return html`<mf-selection-report-demo></mf-selection-report-demo>`
            case 'report-parts':
                return html`<mf-report-parts-demo></mf-report-parts-demo>`
            case 'publish-shop':
                return html`<mf-publish-shop-demo></mf-publish-shop-demo>`
            case 'products':
                return html`<mf-product-table-preview></mf-product-table-preview>`
            case 'states':
                return html`<mf-state-examples></mf-state-examples>`
            case 'table':
            case 'text':
            case 'images':
            case 'controls':
            case 'summary':
            case 'transitions':
                return html`<mf-foundation-examples kind=${this.active}></mf-foundation-examples>`
            case 'combined':
                return this.combo()
            case 'runtime':
                return this.runtime()
            case 'cockpit':
                return html`<div class="cockpit-demo" data-collapsed=${this.cockpitCollapsed}>
                    ${this.cockpit()}
                </div>`
            case 'warning':
                return warningCard({
                    title: '运行已暂停',
                    description: '可重新配置选品参数，确认后继续本次执行。',
                    actions: button({ label: '重新配置', onClick: () => this.openConfig() }),
                })
            case 'timeline':
                return html`${switchField({
                    label: '运行动画',
                    checked: this.running,
                    onChange: (v) => {
                        this.running = v
                    },
                })}${timeline({
                    label: 'Agent执行过程',
                    items: this.processItems(),
                    running: this.running,
                })}`
            case 'platforms':
                return this.platforms()
            case 'catalog': {
                const currency = currencyOfPlatformSite(this.platform, this.site)
                return html`<div class="catalog-relations">
                        ${selectField({
                            name: 'catalog-platform',
                            label: '平台',
                            value: this.platform,
                            options: platforms.map((item) => ({
                                value: item.id,
                                label: item.name,
                            })),
                            onChange: (value) => {
                                this.platform = value ?? ''
                                this.site = ''
                            },
                        })}
                        ${selectField({
                            name: 'catalog-site',
                            label: '站点',
                            value: this.site,
                            options: sitesOfPlatform(this.platform).map((item) => ({
                                value: item.regionCode,
                                label:
                                    countryRegions.find((region) => region.code === item.regionCode)
                                        ?.name ?? item.regionCode,
                            })),
                            onChange: (value) => {
                                this.site = value ?? ''
                            },
                        })}
                        <div class="output">
                            ${currency
                                ? `当前币种：${currency.code} · ${currencyName(currency.code)} · ${currency.symbol}`
                                : '请选择有已核实关系的平台和站点；未知关系保留为空。'}
                        </div>
                    </div>
                    <section class="catalog-directory">
                        <h2>平台目录</h2>
                        <div class="demo-row">
                            ${platforms.map(
                                (item) =>
                                    html`<div class="svg-example">
                                        ${platformIcon(item.id, { size: 28 })}<span
                                            >${item.name}</span
                                        >
                                    </div>`,
                            )}
                        </div>
                        <p class="preview-note">
                            目录为本地快照，图标不代表对应接口已接入或全部站点可用。
                        </p>
                    </section>`
            }
            case 'icons':
                return html`<div class="demo-stack">
                    <h2>货币图标</h2>
                    <div class="demo-row">
                        ${(['USD', 'CNY', 'EUR', 'GBP', 'JPY', 'KRW', 'INR', 'RUB'] as const).map(
                            (code) =>
                                html`<div class="svg-example">
                                    ${currencyIcon(code, { size: 22 })}<span
                                        >${code} · ${currencyNames[code]}</span
                                    >
                                </div>`,
                        )}
                    </div>
                    <h2>常用操作</h2>
                    <div class="demo-row">
                        ${(
                            [
                                'search',
                                'close',
                                'chevron-down',
                                'chevron-up',
                                'chevron-right',
                                'settings',
                                'check',
                                'warning',
                            ] as const
                        ).map(
                            (name) =>
                                html`<div class="svg-example">
                                    ${uiIcon(name, { size: 20, label: name })}<span>${name}</span>
                                </div>`,
                        )}
                    </div>
                    <h2>尺寸与颜色</h2>
                    <div class="demo-row">
                        ${currencyIcon('USD', { size: 16, color: '#697586' })}${currencyIcon(
                            'EUR',
                            { size: 24, color: '#338fff' },
                        )}${currencyIcon('CNY', { size: 32, color: '#209b87' })}
                    </div>
                    ${textField({
                        name: 'currency-example',
                        label: '金额',
                        value: this.text,
                        compact: true,
                        suffixIcon: currencyIcon('USD'),
                        placeholder: '预置货币图标作为输入后缀',
                        onChange: (v) => {
                            this.text = v
                        },
                    })}
                </div>`
            case 'svg':
                return html`<div class="example-parameters">
                        ${switchField({
                            label: '运行动画',
                            checked: this.running,
                            onChange: (v) => {
                                this.running = v
                                this.heartbeat = v
                            },
                        })}
                    </div>
                    <div class="example-stage demo-stack">
                        <div class="demo-row">
                            ${(['loading', 'execute', 'activity', 'sparkle'] as const).map(
                                (kind) =>
                                    html`<div class="svg-example">
                                        ${activityIcon({ kind, running: this.running })}<span
                                            >${{
                                                loading: '加载旋转',
                                                execute: '执行呼吸',
                                                activity: '活动',
                                                sparkle: '思考',
                                            }[kind]}</span
                                        >
                                    </div>`,
                            )}
                        </div>
                        ${timeline({
                            label: '运行过程',
                            items: this.processItems(),
                            running: this.running,
                        })}${nodePlaceholder({
                            title: '选品调研已暂停',
                            animate: this.heartbeat,
                        })}
                    </div>`
            case 'placeholder':
                return html`<div class="example-parameters">
                        ${switchField({
                            label: '心跳动画',
                            checked: this.heartbeat,
                            onChange: (v) => {
                                this.heartbeat = v
                            },
                        })}
                    </div>
                    <div class="example-stage">
                        ${nodePlaceholder({
                            title: '选品调研已暂停',
                            animate: this.heartbeat,
                        })}
                    </div>`
            case 'node-status':
                return html`<div class="demo-stack">
                    ${nodeStatus({
                        title: '已暂停',
                        description: '可重新配置选品参数，或点击右上角继续',
                        action: { label: '重新配置', onClick: () => this.openConfig() },
                    })}${nodeStatus({
                        title: '配置待核对',
                        description: '请检查当前配置后继续。',
                        tone: 'warning',
                    })}${nodeStatus({
                        title: '读取失败',
                        description: '请核对当前节点。',
                        tone: 'error',
                        action: { label: '暂不可用', disabled: true, onClick: () => {} },
                    })}
                </div>`
            case 'accordion':
                return executionAccordion({
                    id: 'gallery',
                    title: '调研商品来源与候选范围',
                    tag: '执行',
                    elapsed: '已运行 0 秒',
                    open: this.accordionOpen,
                    onOpenChange: (v) => {
                        this.accordionOpen = v
                    },
                    rows: [
                        {
                            id: 'run',
                            tag: '执行',
                            text: '正在准备调研资料与选品范围。',
                            tone: 'tool',
                        },
                        {
                            id: 'reason',
                            tag: '理解',
                            text: '根据当前参数整理候选商品信息。',
                            tone: 'reason',
                        },
                    ],
                })
            case 'card':
                return html`<div class="demo-row">
                    <div class="example-card">
                        ${card(
                            {
                                title: '选品调研',
                                description: '6.5亿实时商品数据，一键锁定爆款商品',
                                variant: 'compact',
                                icon: icon(),
                                selected: this.checked,
                                onClick: () => {
                                    this.checked = !this.checked
                                },
                            },
                            html``,
                        )}
                    </div>
                    <div class="example-card">
                        ${card(
                            {
                                title: '节点信息',
                                description: '默认 Card 保留原有风格',
                                onClick: () => {
                                    this.result = '默认卡片已点击'
                                },
                                actions: button({
                                    label: '卡片操作',
                                    onClick: () => {
                                        this.result = '独立卡片操作'
                                    },
                                }),
                            },
                            html`<p>可放入表单、内容及操作区域。</p>`,
                        )}
                    </div>
                </div>`
            case 'form':
                return this.fieldForm()
            case 'input':
                return html`<div class="demo-stack">
                    ${textField({
                        name: 'search',
                        label: '搜索商品',
                        value: this.text,
                        compact: true,
                        placeholder: '输入商品名称',
                        suffixIcon: icon('search'),
                        onChange: (v) => {
                            this.text = v
                        },
                    })}${numberField({
                        name: 'quantity',
                        label: '商品数量',
                        value: this.amount,
                        min: 0,
                        max: 100,
                        step: 1,
                        compact: true,
                        spinner: true,
                        onChange: (v) => {
                            this.amount = v
                        },
                    })}${numberField({
                        name: 'rating',
                        label: '供应商评分',
                        value: this.rating,
                        min: 0,
                        max: 5,
                        step: 0.1,
                        compact: true,
                        spinner: true,
                        onChange: (v) => {
                            this.rating = v
                            this.result = `供应商评分：${v}`
                        },
                    })}${textField({
                        name: 'readonly-input',
                        label: '只读输入',
                        value: '保持宿主草稿',
                        readOnly: true,
                        compact: true,
                    })}
                </div>`
            case 'required':
                return html`<div class="demo-stack">
                    ${fieldLabel({ label: '平台', required: true })}${fieldLabel({
                        label: '类目',
                        optional: true,
                    })}${textField({
                        name: 'required-name',
                        label: '商品名称',
                        required: true,
                        value: this.text,
                        compact: true,
                        onChange: (v) => {
                            this.text = v
                        },
                        placeholder: '请输入商品名称',
                    })}${textField({
                        name: 'optional-note',
                        label: '补充说明',
                        optional: true,
                        value: '',
                        compact: true,
                        onChange: () => {},
                    })}
                </div>`
            case 'select':
                return html`${selectField({
                        name: 'demo-site',
                        label: '站点',
                        compact: true,
                        value: this.site,
                        options: [
                            { value: 'US', label: '美国' },
                            { value: 'GB', label: '英国' },
                            { value: 'TH', label: '泰国' },
                            { value: 'de', label: '德国（暂不开放）', disabled: true },
                        ],
                        onChange: (v) => {
                            this.site = v ?? ''
                        },
                    })}
                    <p class="preview-note">使用方向键选择，Enter 确认，Escape 关闭。</p>`
            case 'cascader':
                return html`${cascaderField({
                        name: 'demo-category',
                        label: '类目',
                        optional: true,
                        compact: true,
                        value: this.category,
                        options: categories,
                        placeholder: '请选择类目（可选）',
                        onChange: (v) => {
                            this.category = v
                        },
                    })}
                    <div class="output">已确认路径：${this.category.join(' / ') || '未选择'}</div>
                    <p class="preview-note">
                        可确认任意层级；取消与点外不保存临时选择。清空会立即清除已确认路径。
                    </p>`
            case 'range':
                return html`${rangeField({
                    name: 'demo-price',
                    label: '价格区间',
                    value: this.range,
                    min: 0,
                    compact: true,
                    suffixText: '$',
                    onChange: (v) => this.updateRange(v),
                })}${button({
                    label: '确认区间',
                    variant: 'accent',
                    disabled: this.readonly || !!rangeError(this.range),
                    onClick: () => {
                        this.result = `已确认：${JSON.stringify(this.range)}（空值不等于0）`
                    },
                })}`
            case 'capability':
                return this.abilities()
            case 'dialog':
                return html`<div class="example-parameters">
                        <h2>示例参数</h2>
                        ${radioGroup({
                            name: 'dialog-content',
                            label: '正文长度',
                            value: this.dialogLong ? 'long' : 'short',
                            options: [
                                { value: 'short', label: '短正文' },
                                { value: 'long', label: '长正文' },
                            ],
                            onChange: (value) => {
                                this.dialogLong = value === 'long'
                            },
                        })}${selectField({
                            name: 'dialog-size',
                            label: '弹窗尺寸',
                            value: this.dialogSize,
                            options: [
                                { value: 'default', label: '标准' },
                                { value: 'large', label: '大尺寸' },
                            ],
                            onChange: (value) => {
                                this.dialogSize = value as 'default' | 'large'
                            },
                        })}
                    </div>
                    <div class="example-stage">
                        ${button({
                            label: '打开弹窗',
                            variant: 'accent',
                            onClick: () => {
                                this.modal = true
                            },
                        })}${dialog(
                            {
                                open: this.modal,
                                title: '组件弹窗',
                                size: this.dialogSize,
                                onClose: () => {
                                    this.modal = false
                                },
                                footer: footer({
                                    actions: html`${button({
                                        label: '取消',
                                        onClick: () => {
                                            this.modal = false
                                        },
                                    })}${button({
                                        label: '确认',
                                        variant: 'accent',
                                        onClick: () => {
                                            this.modal = false
                                            this.result = '已确认本地示例'
                                        },
                                    })}`,
                                }),
                            },
                            html`${Array.from(
                                { length: this.dialogLong ? 24 : 2 },
                                (_, index) =>
                                    html`<p>
                                        第 ${index + 1}
                                        段本地示例内容。${this.dialogLong
                                            ? '足够长的正文用于核对内容独立滚动，标题和操作区始终保持可见。'
                                            : '支持关闭按钮、Escape、遮罩点击及取消。'}
                                    </p>`,
                            )}`,
                        )}
                    </div>`
            case 'radio':
                return html`${radioGroup({
                    name: 'demo-review',
                    label: '人工审核',
                    value: this.sort,
                    options: [
                        {
                            value: 'sales7',
                            label: '不启用',
                            description: '工作流自动执行全流程，无人工审核。',
                        },
                        { value: 'manual', label: '指定步骤' },
                    ],
                    onChange: (v) => {
                        this.sort = v
                    },
                })}${radioGroup({
                    name: 'demo-readonly-radio',
                    label: '只读示例',
                    value: 'a',
                    disabled: true,
                    options: [
                        { value: 'a', label: '选项一' },
                        { value: 'b', label: '选项二' },
                    ],
                })}`
            case 'switch':
                return html`<div class="demo-stack">
                    ${switchField({
                        label: '启用数据筛选',
                        checked: this.checked,
                        onChange: (v) => {
                            this.checked = v
                        },
                    })}${switchField({ label: '暂不开放', checked: false, disabled: true })}
                </div>`
            case 'capability-panel':
                return html`${capabilityCard({
                        title: '数据筛选',
                        description: '设置筛选条件与排序方式，确认后应用本次设置',
                        enabled: true,
                        required: true,
                        onConfigure: () => this.openConfig(),
                    })}
                    <div class="output">
                        已确认配置：${JSON.stringify(this.configSaved, null, 2)}
                    </div>`
            case 'footer':
                return html`<div class="footer-demo">
                    <article>
                        <h2>设置内容区</h2>
                        ${Array.from(
                            { length: 10 },
                            (_, i) =>
                                html`<p style="padding:12px 0">
                                    第 ${i + 1} 项配置内容，正文滚动不影响操作区。
                                </p>`,
                        )}
                    </article>
                    ${footer({
                        leading: html`<span class="mf-hint">更改仅保存在本地预览</span>`,
                        actions: html`${button({
                            label: '取消',
                            onClick: () => {
                                this.result = '已取消'
                            },
                        })}${button({
                            label: '确认',
                            variant: 'accent',
                            onClick: () => {
                                this.result = '已确认'
                            },
                        })}`,
                    })}
                </div>`
            case 'flow':
                return html`<div class="example-parameters">
                        <h2>示例参数</h2>
                        ${radioGroup({
                            name: 'flow-direction',
                            label: '方向',
                            value: this.flowDirection,
                            options: [
                                { value: 'horizontal', label: '水平' },
                                { value: 'vertical', label: '垂直' },
                            ],
                            onChange: (value) => {
                                this.flowDirection = value as 'horizontal' | 'vertical'
                            },
                        })}${selectField({
                            name: 'flow-width',
                            label: '容器宽度',
                            value: String(this.flowWidth),
                            options: [
                                { value: '280', label: '紧凑 · 280px' },
                                { value: '420', label: '标准 · 420px' },
                                { value: '720', label: '宽 · 720px' },
                            ],
                            onChange: (value) => {
                                this.flowWidth = Number(value)
                            },
                        })}${switchField({
                            label: '允许换行',
                            checked: this.flowWrap,
                            onChange: (value) => {
                                this.flowWrap = value
                            },
                        })}
                    </div>
                    <section class="example-stage">
                        <h2>组件预览</h2>
                        <div class="flow-host" style=${`width:${this.flowWidth}px`}>
                            ${flow(
                                {
                                    direction: this.flowDirection,
                                    gap: 12,
                                    wrap: this.flowWrap,
                                    align: 'start',
                                },
                                html`${[
                                    '平台',
                                    '站点',
                                    '类目',
                                    '候选商品数量',
                                    '价格区间',
                                    '利润率',
                                ].map((label) => html`<div class="flow-chip">${label}</div>`)}`,
                            )}
                        </div>
                    </section>`
            case 'progress':
                return html`<div class="example-parameters">
                        <h2>示例参数</h2>
                        ${numberField({
                            name: 'demo-progress',
                            label: '预览进度',
                            value: this.progress,
                            min: 0,
                            max: 100,
                            spinner: true,
                            compact: true,
                            onChange: (value) => {
                                this.progress = value ?? 0
                            },
                        })}
                    </div>
                    <section class="example-stage">
                        <h2>组件预览</h2>
                        ${this.showProgress
                            ? progressBar({
                                  label: '调研进度',
                                  value: this.progress,
                                  onClose: () => {
                                      this.showProgress = false
                                  },
                              })
                            : button({
                                  label: '显示进度条',
                                  onClick: () => {
                                      this.showProgress = true
                                  },
                              })}${progressBar({ label: '等待进度数据' })}
                    </section>`
            case 'tabs':
                return tabs({
                    id: 'gallery-tabs',
                    label: '选品结果',
                    variant: 'underline',
                    value: this.tab,
                    onChange: (v) => {
                        this.tab = v
                    },
                    items: [
                        {
                            value: 'list',
                            label: '选品列表',
                            content: html`<p class="report">候选商品列表</p>
                                ${textField({
                                    name: 'tab-note',
                                    label: '选品备注',
                                    value: this.text,
                                    compact: true,
                                    onChange: (v) => {
                                        this.text = v
                                    },
                                    placeholder: '切换页签后保留输入',
                                })}`,
                        },
                        {
                            value: 'report',
                            label: '选品报告',
                            content: html`<article class="report">
                                <h3>选品调研报告</h3>
                                <p>这里承载同一节点的报告内容。</p>
                                <p>本地示例，未请求真实调研数据。</p>
                            </article>`,
                        },
                        { value: 'disabled', label: '暂不开放', disabled: true, content: html`` },
                    ],
                })
            default:
                return html`<p>请选择左侧组件</p>`
        }
    }
    override render() {
        const title = entries.find((item) => item[0] === this.active)?.[1] ?? '组件预览'
        const stateExample = (
            {
                accordion: 'accordion',
                select: 'select',
                cascader: 'cascader',
                input: 'field',
                required: 'field',
                range: 'field',
                form: 'field',
                capability: 'capability',
                'capability-panel': 'capability',
                dialog: 'dialog',
                timeline: 'timeline',
                cockpit: 'cockpit',
                progress: 'progress',
            } as Record<string, string>
        )[this.active]
        const invalid = Object.values(this.configDraft).some(
            (value) => typeof value === 'object' && !!rangeError(value),
        )
        return html`<div class="gallery">
                <header class="topbar">
                    <strong>魔方 Lit 组件</strong><span>本地交互预览 · 全部待验收 · 未提交</span>
                </header>
                <nav class="navigation" aria-label="组件导航">
                    ${groups.map(
                        (group) =>
                            html`<section class="navigation-group">
                                ${group.title ? html`<h2>${group.title}</h2>` : nothing}
                                ${group.ids.map((id) => {
                                    const item = entries.find((entry) => entry[0] === id)
                                    return item
                                        ? html`<button
                                              type="button"
                                              title="本地预览 · 待验收 · 未提交"
                                              aria-current=${this.active === id ? 'page' : nothing}
                                              @click=${() => this.choose(id)}
                                          >
                                              ${item[1]}
                                          </button>`
                                        : nothing
                                })}
                            </section>`,
                    )}
                </nav>
                <main>
                    <header class="page-heading">
                        <div>
                            <h1>${title}</h1>
                            <p>
                                ${this.active === 'overview'
                                    ? '按类别浏览组件的代表效果，点击卡片查看完整交互与边界。'
                                    : this.active === 'combined'
                                      ? '基于原型组合设置表单、能力卡片和底部操作。'
                                      : '可直接操作组件，检查输入、禁用、取消和键盘交互。'}
                            </p>
                        </div>
                        <div class="heading-actions">
                            ${stateExample
                                ? html`<a
                                      href=${`?component=states&example=${stateExample}`}
                                      @click=${(event: MouseEvent) => {
                                          if (!event.metaKey && !event.ctrlKey && !event.shiftKey) {
                                              event.preventDefault()
                                              this.choose('states', stateExample)
                                          }
                                      }}
                                      >查看相关状态</a
                                  >`
                                : nothing}
                            ${[
                                'input',
                                'required',
                                'select',
                                'icons',
                                'cascader',
                                'range',
                                'form',
                            ].includes(this.active)
                                ? switchField({
                                      label: '占满宽度',
                                      checked: this.fieldWide,
                                      onChange: (value) => {
                                          this.fieldWide = value
                                      },
                                  })
                                : nothing}
                            ${this.active === 'combined' || this.active === 'form'
                                ? switchField({
                                      label: '只读',
                                      checked: this.readonly,
                                      onChange: (v) => {
                                          this.readonly = v
                                      },
                                  })
                                : nothing}
                        </div>
                    </header>
                    ${this.active === 'combined' || this.active === 'runtime'
                        ? this.preview()
                        : html`<section
                              class="demo-surface"
                              data-component=${this.active}
                              data-wide=${String(this.fieldWide)}
                          >
                              ${this.preview()}${this.result
                                  ? html`<div class="output" role="status">${this.result}</div>`
                                  : nothing}
                          </section>`}
                </main>
            </div>
            ${capabilityPanel(
                {
                    open: this.configOpen,
                    title: '数据筛选规则配置',
                    size: 'large',
                    onClose: () => {
                        this.configOpen = false
                    },
                    confirmDisabled: invalid,
                    onConfirm: () => {
                        if (invalid) return
                        this.configSaved = structuredClone(this.configDraft)
                        this.configOpen = false
                        this.result = '数据筛选配置已应用到本地示例'
                    },
                },
                this.configBody(),
            )}`
    }
}
customElements.define('mf-component-gallery', ComponentGallery)
