import { css, html, nothing } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { collapse } from './transition'

export type ExecutionLogRow = Readonly<{
    id: string
    tag: string
    text: string
    tone?: 'info' | 'reason' | 'tool' | 'status'
}>

export type ExecutionAccordionProps = Readonly<{
    /** 同一 ShadowRoot 中稳定且唯一的标识。 */
    id: string
    title: string
    tag?: string
    /** 已格式化的真实耗时文本；组件不创建计时器。 */
    elapsed?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    rows: readonly ExecutionLogRow[]
    emptyText?: string
}>

/** 受控的运行逻辑手风琴；普通日志更新保留列表节点与展开状态。 */
export function executionAccordion(p: ExecutionAccordionProps) {
    const prefix = `mf-execution-${encodeURIComponent(p.id)}`
    return html`<section class="mf-execution-accordion">
        <button
            class="mf-execution-accordion__toggle"
            type="button"
            id=${`${prefix}-toggle`}
            aria-expanded=${String(p.open)}
            aria-controls=${`${prefix}-content`}
            @click=${() => p.onOpenChange(!p.open)}
        >
            <svg
                class="mf-execution-accordion__spark"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
            >
                <path d="M8 1.5 10 6l4.5 2-4.5 2L8 14.5 6 10 1.5 8 6 6Z" />
            </svg>
            ${p.tag ? html`<span class="mf-execution-accordion__tag">${p.tag}</span>` : nothing}
            <span class="mf-execution-accordion__title" title=${p.title}>${p.title}</span>
            ${p.elapsed
                ? html`<span class="mf-execution-accordion__elapsed">${p.elapsed}</span>`
                : nothing}
            <svg
                class="mf-execution-accordion__chevron"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
                focusable="false"
            >
                <path d="m4.5 6 3.5 3.5L11.5 6" />
            </svg>
        </button>
        <div
            id=${`${prefix}-content`}
            role="region"
            aria-labelledby=${`${prefix}-toggle`}
            aria-hidden=${p.open ? nothing : 'true'}
            ?inert=${!p.open}
        >
            ${collapse(
                { show: p.open, duration: 180 },
                html`<div class="mf-execution-accordion__body">
                    ${p.rows.length
                        ? html`<ol
                              class="mf-execution-accordion__rows"
                              tabindex="0"
                              aria-label="节点运行逻辑"
                              aria-live="off"
                          >
                              ${repeat(
                                  p.rows,
                                  (row) => row.id,
                                  (row) =>
                                      html`<li data-tone=${row.tone ?? 'info'}>
                                          <span class="mf-execution-accordion__tag"
                                              >${row.tag}</span
                                          >
                                          <span>${row.text}</span>
                                      </li>`,
                              )}
                          </ol>`
                        : html`<p class="mf-execution-accordion__empty">
                              ${p.emptyText ?? '暂无运行记录'}
                          </p>`}
                </div>`,
            )}
        </div>
    </section>`
}

/** 展开列表限高并独立滚动，避免运行记录持续增长挤占节点结果区。 */
export const executionAccordionStyles = /* @__PURE__ */ (() => css`
    .mf-execution-accordion {
        min-width: 0;
        border: 1px solid #ececea;
        border-radius: 10px;
        background: #fff;
    }
    .mf-execution-accordion__toggle {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        min-width: 0;
        align-items: center;
        gap: 6px;
        padding: 10px 12px;
        border: 0;
        border-radius: inherit;
        background: transparent;
        color: var(--mf-fg, #34322d);
        font: inherit;
        font-size: 12px;
        line-height: 20px;
        text-align: left;
        user-select: none;
        cursor: pointer;
    }
    .mf-execution-accordion__toggle:hover {
        background: #f8fbff;
    }
    .mf-execution-accordion__toggle:focus-visible,
    .mf-execution-accordion__rows:focus-visible {
        outline: 2px solid #91caff;
        outline-offset: -2px;
    }
    .mf-execution-accordion__spark {
        width: 13px;
        height: 13px;
        flex: 0 0 13px;
        color: #1890ff;
    }
    .mf-execution-accordion__tag {
        flex: 0 0 auto;
        padding: 1px 6px;
        border-radius: 4px;
        background: #eaf3ff;
        color: #1677ff;
        font-size: 11px;
        line-height: 18px;
        white-space: nowrap;
    }
    .mf-execution-accordion__title {
        min-width: 0;
        overflow: hidden;
        color: #626b7a;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mf-execution-accordion__elapsed {
        flex: 0 0 auto;
        margin-left: auto;
        color: #73716d;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }
    .mf-execution-accordion__chevron {
        width: 14px;
        height: 14px;
        flex: 0 0 14px;
        margin-left: auto;
        color: #73716d;
        transition: transform 180ms ease;
    }
    .mf-execution-accordion__elapsed + .mf-execution-accordion__chevron {
        margin-left: 0;
    }
    .mf-execution-accordion__toggle[aria-expanded='true'] .mf-execution-accordion__chevron {
        transform: rotate(180deg);
    }
    .mf-execution-accordion__body {
        border-top: 1px solid #f2f2f0;
        border-radius: 0 0 10px 10px;
        background: linear-gradient(180deg, #fff, #fafcfe);
    }
    .mf-execution-accordion__rows {
        box-sizing: border-box;
        min-height: 112px;
        max-height: 156px;
        margin: 0;
        overflow: auto;
        overscroll-behavior: contain;
        padding: 8px 12px;
        list-style: none;
    }
    .mf-execution-accordion__rows li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 0;
        color: #626b7a;
        font-size: 12px;
        line-height: 20px;
    }
    .mf-execution-accordion__rows li + li {
        border-top: 1px solid #f1f3f5;
    }
    .mf-execution-accordion__rows li > span:last-child {
        min-width: 0;
        overflow-wrap: anywhere;
    }
    .mf-execution-accordion__rows li[data-tone='reason'] .mf-execution-accordion__tag {
        background: #f9f0ff;
        color: #722ed1;
    }
    .mf-execution-accordion__rows li[data-tone='tool'] .mf-execution-accordion__tag {
        background: #e6f4ff;
        color: #1677ff;
    }
    .mf-execution-accordion__rows li[data-tone='status'] .mf-execution-accordion__tag {
        background: #fff7e6;
        color: #ad4e00;
    }
    .mf-execution-accordion__empty {
        margin: 0;
        padding: 16px 12px;
        color: var(--mf-muted, #6b7280);
        font-size: 12px;
        line-height: 20px;
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-execution-accordion__chevron {
            transition: none;
        }
    }
`)()
