import { css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import type { TemplateResult } from 'lit'

export type FlowProps = Readonly<{
    direction?: 'horizontal' | 'vertical'
    gap?: number
    wrap?: boolean
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between'
}>

/** 流式容器只负责子内容排列，不持有工作流或节点状态。 */
export function flow(p: FlowProps, content: TemplateResult) {
    return html`<div
        class="mf-flow"
        style=${styleMap({
            flexDirection: p.direction === 'vertical' ? 'column' : 'row',
            gap: `${p.gap ?? 12}px`,
            flexWrap: p.wrap ? 'wrap' : 'nowrap',
            alignItems:
                p.align === 'start'
                    ? 'flex-start'
                    : p.align === 'end'
                      ? 'flex-end'
                      : (p.align ?? 'stretch'),
            justifyContent:
                p.justify === 'between'
                    ? 'space-between'
                    : p.justify === 'center'
                      ? 'center'
                      : p.justify === 'end'
                        ? 'flex-end'
                        : 'flex-start',
        })}
    >
        ${content}
    </div>`
}

/** 底部操作区固定在调用方容器末尾，业务操作和提交均由调用方传入。 */
export function footer(p: Readonly<{ leading?: TemplateResult; actions?: TemplateResult }>) {
    return html`<footer class="mf-footer">
        <div>${p.leading ?? nothing}</div>
        <div class="mf-footer-actions">${p.actions ?? nothing}</div>
    </footer>`
}

export const layoutStyles = /* @__PURE__ */ (() => css`
    .mf-button[data-variant='accent'] {
        background: #338fff;
        border-color: #338fff;
        color: #fff;
    }
    .mf-button[data-variant='accent']:hover:not(:disabled) {
        background: #1677ff;
        border-color: #1677ff;
    }
    .mf-button[data-variant='accent']:disabled {
        opacity: 0.45;
    }
    .mf-flow {
        display: flex;
        min-width: 0;
    }
    .mf-flow > * {
        min-width: 0;
    }
    .mf-footer {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-top: 1px solid #eceef1;
        background: #fff;
        padding: 12px 16px;
    }
    .mf-footer-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .mf-card[data-clickable='true'] {
        position: relative;
    }
    .mf-card[data-clickable='true'] .mf-toolbar,
    .mf-card[data-clickable='true'] .mf-card-body :is(button, a, input, select, textarea) {
        position: relative;
        z-index: 1;
    }
    .mf-card[data-card-variant='compact'] {
        position: relative;
        padding: 14px;
        border-radius: 6px;
        box-shadow: none;
    }
    .mf-card[data-card-variant='compact'] .mf-card-heading {
        gap: 10px;
        align-items: center;
        margin-bottom: 0;
    }
    .mf-card[data-card-variant='compact'] .mf-card-heading h3 {
        font-size: 16px;
    }
    .mf-card[data-card-variant='compact'] .mf-card-heading p {
        font-size: 12px;
        color: #787e88;
    }
    .mf-card[data-card-variant='compact'] .mf-card-body:empty {
        display: none;
    }
    .mf-card[data-selected='true'] {
        border-color: #338fff;
        background: #f0f7ff;
    }
    .mf-card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        color: #338fff;
        background: #f5f8fc;
        border-radius: 5px;
        flex-shrink: 0;
    }
    .mf-card-icon svg {
        width: 23px;
        height: 23px;
    }
    .mf-card-title-button {
        background: transparent;
        padding: 0;
        border: 0;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }
    .mf-card-title-button::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
    }
    .mf-card-title-button:focus-visible {
        outline: none;
    }
    .mf-card:has(.mf-card-title-button:focus-visible) {
        outline: 2px solid #338fff;
        outline-offset: 2px;
    }
    .mf-tabs[data-variant='underline'] .mf-tab-list {
        padding: 0;
        border-radius: 0;
        background: transparent;
        border-bottom: 1px solid #e7e9ed;
        gap: 28px;
        height: auto;
        min-height: 43px;
        align-items: stretch;
        width: 100%;
    }
    .mf-tabs[data-variant='underline'] .mf-tab {
        height: auto;
        min-height: 42px;
        padding: 0 2px;
        border: 0;
        border-bottom: 2px solid transparent;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        font-size: 14px;
    }
    .mf-tabs[data-variant='underline'] .mf-tab[aria-selected='true'] {
        color: #338fff;
        border-bottom-color: #338fff;
        background: transparent;
        box-shadow: none;
    }
    .mf-tabs[data-variant='underline'] .mf-tab-panel {
        padding-top: 16px;
    }
`)()
