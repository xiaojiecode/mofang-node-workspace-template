import { css, html, nothing, svg } from 'lit'
import type { TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

export type TimelineItem = Readonly<{
    id: string
    title: string
    description?: string | TemplateResult
    icon?: TemplateResult
    /** 展示色调，与服务端节点状态保持分离。 */
    tone?: 'neutral' | 'active' | 'complete' | 'warning' | 'error'
    current?: boolean
    content?: TemplateResult
}>

export type TimelineProps = Readonly<{
    label: string
    items: readonly TimelineItem[]
    variant?: 'node' | 'process'
    /** 当前视图确实运行中才播放活动标记；暂停时保留标记形状并停止动画。 */
    running?: boolean
}>

/** 未传图标时提供与原型一致的时钟、活动和完成标记。 */
function markerIcon(tone: TimelineItem['tone']) {
    return html`<svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        ${tone === 'complete'
            ? svg`<path d="m6 12 4 4 8-8" />`
            : tone === 'active'
              ? svg`<path d="M3 12h4l3-8 4 16 3-8h4" />`
              : tone === 'warning' || tone === 'error'
                ? svg`<path
                      d="M12 8v5m0 3h.01M10.3 4.2a2 2 0 0 1 3.4 0l7.5 13a2 2 0 0 1-1.7 3H4.5a2 2 0 0 1-1.7-3Z"
                  />`
                : svg`<circle cx="12" cy="12" r="8" /><path d="M12 7v5h4" />`}
    </svg>`
}

/** 垂直时间线只展示调用方顺序；每个标记、标题、说明和附加内容均可配置。 */
export function timeline(p: TimelineProps) {
    return html`<ol
        class="mf-timeline"
        data-variant=${p.variant ?? 'process'}
        ?data-running=${p.running}
        aria-label=${p.label}
    >
        ${repeat(
            p.items,
            (item) => item.id,
            (item) =>
                html`<li
                    class="mf-timeline__item"
                    data-tone=${item.tone ?? 'neutral'}
                    ?data-has-content=${Boolean(item.content)}
                    aria-current=${item.current ? 'step' : nothing}
                >
                    <span class="mf-timeline__marker" aria-hidden="true">
                        ${item.icon ?? markerIcon(item.tone)}
                    </span>
                    <div class="mf-timeline__copy">
                        <strong class="mf-timeline__title">${item.title}</strong>
                        ${item.description
                            ? html`<div class="mf-timeline__description">${item.description}</div>`
                            : nothing}
                        ${item.content
                            ? html`<div class="mf-timeline__content">${item.content}</div>`
                            : nothing}
                    </div>
                </li>`,
        )}
    </ol>`
}

/** 过程时间线为圆形标记，节点时间线为方形标记并可容纳节点详情。 */
export const timelineStyles = /* @__PURE__ */ (() => css`
    .mf-timeline {
        min-width: 0;
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .mf-timeline__item {
        --mf-timeline-line: #e0e3e8;
        position: relative;
        display: flex;
        min-width: 0;
        align-items: flex-start;
        gap: 8px;
        padding-bottom: 14px;
    }
    .mf-timeline__item:last-child {
        padding-bottom: 0;
    }
    .mf-timeline__item:not(:last-child)::before,
    .mf-timeline[data-variant='node'] > .mf-timeline__item[data-has-content]::before {
        position: absolute;
        top: 22px;
        bottom: 0;
        left: 11px;
        width: 1px;
        background: var(--mf-timeline-line);
        content: '';
    }
    .mf-timeline__item[data-tone='complete'] {
        --mf-timeline-line: #b5f5ec;
    }
    .mf-timeline__marker {
        position: relative;
        box-sizing: border-box;
        display: grid;
        width: 23px;
        height: 23px;
        flex: 0 0 23px;
        place-items: center;
        border: 1px solid #d9d9d9;
        border-radius: 50%;
        background: #fff;
        color: #8c8c8c;
    }
    .mf-timeline__marker svg {
        display: block;
        width: 14px;
        height: 14px;
    }
    .mf-timeline__item[data-tone='complete'] > .mf-timeline__marker {
        border-color: #87e8de;
        background: #e6fffb;
        color: #08979c;
    }
    .mf-timeline__item[data-tone='active'] > .mf-timeline__marker {
        border-color: #91caff;
        background: #e6f4ff;
        color: #1677ff;
    }
    .mf-timeline__item[data-tone='active'] > .mf-timeline__marker::after {
        position: absolute;
        inset: -5px;
        border: 1px solid #eaf2ff;
        border-radius: inherit;
        content: '';
    }
    .mf-timeline[data-running]
        > .mf-timeline__item[data-tone='active']
        > .mf-timeline__marker::after {
        border-color: currentColor;
        animation: mf-timeline-pulse-ring 1.6s ease-out infinite;
    }
    .mf-timeline[data-running]
        > .mf-timeline__item[data-tone='active']
        > .mf-timeline__marker
        > svg {
        transform-origin: center;
        animation: mf-timeline-heartbeat 1.1s ease-in-out infinite;
    }
    .mf-timeline__item[data-tone='warning'] > .mf-timeline__marker {
        border-color: #ffd591;
        background: #fff7e6;
        color: #d46b08;
    }
    .mf-timeline__item[data-tone='error'] > .mf-timeline__marker {
        border-color: #ffccc7;
        background: #fff5f5;
        color: #cf1322;
    }
    .mf-timeline__copy {
        min-width: 0;
        flex: 1;
    }
    .mf-timeline__title {
        display: block;
        color: #34322d;
        font-size: 12px;
        font-weight: 600;
        line-height: 22px;
        overflow-wrap: anywhere;
    }
    .mf-timeline__description {
        min-width: 0;
        color: #77736d;
        font-size: 11px;
        line-height: 17px;
        overflow-wrap: anywhere;
    }
    .mf-timeline__content {
        min-width: 0;
        margin-top: 16px;
    }
    .mf-timeline[data-variant='node'] > .mf-timeline__item {
        --mf-timeline-line: #d6e4ff;
        gap: 10px;
    }
    .mf-timeline[data-variant='node'] > .mf-timeline__item > .mf-timeline__marker {
        border-radius: 6px;
    }
    .mf-timeline[data-variant='node']
        > .mf-timeline__item
        > .mf-timeline__copy
        > .mf-timeline__title {
        font-size: 15px;
        line-height: 24px;
    }
    .mf-timeline[data-variant='node']
        > .mf-timeline__item
        > .mf-timeline__copy
        > .mf-timeline__description {
        margin-top: 3px;
        font-size: 11px;
        line-height: 19px;
    }
    @keyframes mf-timeline-pulse-ring {
        0% {
            opacity: 0.34;
            transform: scale(0.72);
        }
        72%,
        100% {
            opacity: 0;
            transform: scale(1.34);
        }
    }
    @keyframes mf-timeline-heartbeat {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.07);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-timeline[data-running]
            > .mf-timeline__item[data-tone='active']
            > .mf-timeline__marker::after,
        .mf-timeline[data-running]
            > .mf-timeline__item[data-tone='active']
            > .mf-timeline__marker
            > svg {
            animation: none;
        }
    }
`)()
