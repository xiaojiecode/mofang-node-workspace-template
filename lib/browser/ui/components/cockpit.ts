import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { card } from './card'
import { button } from './controls'
import { flow, footer } from './layout'
import { timeline } from './timeline'
import type { TimelineItem } from './timeline'
import { warningCard } from './warning-card'
import type { WarningCardProps } from './warning-card'

export type CockpitNode = Readonly<{
    id: string
    title: string
    status: string
    statusTone?: TimelineItem['tone']
    controlLabel?: string
    icon?: TemplateResult
    notice?: WarningCardProps
    processTitle?: string
    process?: readonly TimelineItem[]
    capabilities?: readonly Readonly<{ id: string; title: string }>[]
    sourceContent?: TemplateResult
    outputContent?: TemplateResult
}>

export type CockpitProps = Readonly<{
    id: string
    title?: string
    description?: string
    collapsed: boolean
    onCollapsedChange: (collapsed: boolean) => void
    nodes: readonly CockpitNode[]
    /** 只控制展示动效；暂停后保留过程内容并停止脉冲。 */
    running?: boolean
    footerAction?: Readonly<{
        label: string
        disabled?: boolean
        onClick: () => void
    }>
}>

/** 驾驶舱内的能力名称使用普通小卡片，不包含配置入口或真实能力调用。 */
function capabilities(items: NonNullable<CockpitNode['capabilities']>) {
    return items.length
        ? flow(
              { direction: 'horizontal', gap: 6, wrap: true, align: 'start' },
              html`${repeat(
                  items,
                  (item) => item.id,
                  (item) =>
                      html`<div class="mf-cockpit__capability">
                          ${card({ variant: 'compact' }, html`<span>${item.title}</span>`)}
                      </div>`,
              )}`,
          )
        : html`<p class="mf-cockpit__empty">本次未开启原子能力</p>`
}

/** 节点详情只组合已有容器和展示组件，不管理执行或数据订阅。 */
function nodeContent(node: CockpitNode, running: boolean) {
    return html`<div class="mf-cockpit__node-content">
        ${node.notice ? warningCard(node.notice) : nothing}
        <div class="mf-cockpit__detail-card">
            ${card(
                { title: node.processTitle ?? 'Agent执行过程', variant: 'compact' },
                node.process?.length
                    ? timeline({
                          label: node.processTitle ?? 'Agent执行过程',
                          items: node.process,
                          running,
                      })
                    : html`<p class="mf-cockpit__empty">暂无执行过程</p>`,
            )}
        </div>
        <div class="mf-cockpit__detail-card">
            ${card(
                { title: '本次开启的原子能力', variant: 'compact' },
                capabilities(node.capabilities ?? []),
            )}
        </div>
        <div class="mf-cockpit__detail-card">
            ${card(
                { title: '数据来源', variant: 'compact' },
                node.sourceContent ?? html`<p class="mf-cockpit__empty">暂无数据来源</p>`,
            )}
        </div>
        <div class="mf-cockpit__detail-card">
            ${card(
                { title: '输出', variant: 'compact' },
                node.outputContent ?? html`<p class="mf-cockpit__empty">暂无输出内容</p>`,
            )}
        </div>
    </div>`
}

/** 可收起的节点驾驶舱；滚动只发生在内容区，顶部与底部操作保持可达。 */
export function cockpit(p: CockpitProps) {
    const prefix = `mf-cockpit-${encodeURIComponent(p.id)}`
    const title = p.title ?? '当前节点执行'
    const items: TimelineItem[] = p.nodes.map((node) => ({
        id: node.id,
        title: node.title,
        tone: node.statusTone ?? 'neutral',
        ...(node.icon ? { icon: node.icon } : {}),
        description: html`<div class="mf-cockpit__node-meta">
            <span class="mf-cockpit__node-status" data-tone=${node.statusTone ?? 'neutral'}
                >${node.status}</span
            >
            ${node.controlLabel ? html`<span>${node.controlLabel}</span>` : nothing}
        </div>`,
        content: nodeContent(node, p.running ?? false),
    }))
    return html`<aside
        class="mf-cockpit"
        data-collapsed=${String(p.collapsed)}
        ?data-running=${p.running}
        aria-label=${title}
    >
        <div
            class="mf-cockpit__inner"
            ?inert=${p.collapsed}
            aria-hidden=${p.collapsed ? 'true' : nothing}
        >
            <header class="mf-cockpit__header">
                <button
                    class="mf-cockpit__toggle"
                    type="button"
                    aria-label=${`${p.collapsed ? '展开' : '收起'}${title}`}
                    aria-expanded=${String(!p.collapsed)}
                    aria-controls=${`${prefix}-content ${prefix}-footer`}
                    @click=${(event: Event) => {
                        const root = (event.currentTarget as HTMLElement).closest('.mf-cockpit')
                        p.onCollapsedChange(true)
                        queueMicrotask(() => {
                            if (root?.getAttribute('data-collapsed') === 'true')
                                root.querySelector<HTMLButtonElement>('.mf-cockpit__rail')?.focus()
                        })
                    }}
                >
                    <span class="mf-cockpit__heading">
                        <strong>${title}</strong>
                        <span class="mf-cockpit__description"
                            >${p.description ?? '状态、过程与操作'}</span
                        >
                    </span>
                    <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                        aria-hidden="true"
                    >
                        <path d="m6 3.5 4 4.5-4 4.5" />
                    </svg>
                </button>
            </header>
            <div
                class="mf-cockpit__content"
                id=${`${prefix}-content`}
                tabindex="0"
                role="region"
                aria-label="节点执行详情"
            >
                ${items.length
                    ? timeline({ label: '节点执行时间线', variant: 'node', items })
                    : html`<p class="mf-cockpit__empty">暂无节点执行信息</p>`}
            </div>
            <div class="mf-cockpit__footer" id=${`${prefix}-footer`}>
                ${p.footerAction
                    ? footer({
                          actions: button({
                              label: p.footerAction.label,
                              disabled: p.footerAction.disabled ?? false,
                              onClick: p.footerAction.onClick,
                              variant: 'secondary',
                              size: 'panel',
                          }),
                      })
                    : nothing}
            </div>
        </div>
        <button
            class="mf-cockpit__rail"
            type="button"
            ?inert=${!p.collapsed}
            aria-hidden=${p.collapsed ? nothing : 'true'}
            aria-label=${`展开${title}`}
            aria-expanded="false"
            aria-controls=${`${prefix}-content ${prefix}-footer`}
            @click=${(event: Event) => {
                const root = (event.currentTarget as HTMLElement).closest('.mf-cockpit')
                p.onCollapsedChange(false)
                queueMicrotask(() => {
                    if (root?.getAttribute('data-collapsed') === 'false')
                        root.querySelector<HTMLButtonElement>('.mf-cockpit__toggle')?.focus()
                })
            }}
        >
            <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
            >
                <path d="m10 3.5-4 4.5 4 4.5" />
            </svg>
            <strong>${title}</strong>
        </button>
    </aside>`
}

/** 宿主将外层宽度收至 44px；内部保持展开尺寸，通过裁切与整层显隐完成过渡。 */
export const cockpitStyles = /* @__PURE__ */ (() => css`
    .mf-cockpit {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        border: 1px solid #ececea;
        border-radius: 8px;
        background: #fff;
        color: #34322d;
    }
    .mf-cockpit__inner {
        display: grid;
        width: var(--mf-cockpit-content-width, 340px);
        height: 100%;
        min-height: 0;
        grid-template-rows: auto minmax(0, 1fr) auto;
        opacity: 1;
        visibility: visible;
        transition: opacity 160ms ease;
    }
    .mf-cockpit[data-collapsed='true'] .mf-cockpit__inner {
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 160ms ease,
            visibility 0s linear 160ms;
    }
    .mf-cockpit__header {
        min-width: 0;
        border-bottom: 1px solid #ececea;
        background: #fafafa;
    }
    .mf-cockpit__toggle {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        min-height: 46px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 12px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        user-select: none;
        cursor: pointer;
    }
    .mf-cockpit__toggle:hover {
        background: #f1f5fa;
    }
    .mf-cockpit__toggle:focus-visible,
    .mf-cockpit__rail:focus-visible,
    .mf-cockpit__content:focus-visible {
        outline: 2px solid #91caff;
        outline-offset: -2px;
    }
    .mf-cockpit__toggle > svg {
        width: 15px;
        height: 15px;
        flex: 0 0 15px;
        color: #73716d;
        transition: transform 160ms ease;
    }
    .mf-cockpit__heading {
        display: grid;
        min-width: 0;
        gap: 1px;
    }
    .mf-cockpit__heading strong {
        font-size: 13px;
        font-weight: 600;
        line-height: 19px;
        overflow-wrap: anywhere;
    }
    .mf-cockpit__description {
        display: block;
        color: #77736d;
        font-size: 11px;
        line-height: 16px;
    }
    .mf-cockpit__content {
        min-width: 0;
        min-height: 0;
        overflow: auto;
        overscroll-behavior: contain;
        scrollbar-gutter: stable;
        padding: 14px 12px 18px;
    }
    .mf-cockpit__node-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 8px;
        align-items: center;
        color: #77736d;
    }
    .mf-cockpit__node-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: #68645f;
    }
    .mf-cockpit__node-status::before {
        width: 6px;
        height: 6px;
        flex: 0 0 6px;
        border-radius: 50%;
        background: #bfbfbf;
        content: '';
    }
    .mf-cockpit__node-status[data-tone='active']::before {
        background: #1677ff;
    }
    .mf-cockpit[data-running] .mf-cockpit__node-status[data-tone='active']::before {
        animation: mf-cockpit-state-pulse 1.6s ease-in-out infinite;
    }
    .mf-cockpit__node-status[data-tone='complete']::before {
        background: #08979c;
    }
    .mf-cockpit__node-status[data-tone='warning']::before {
        background: #d46b08;
    }
    .mf-cockpit__node-status[data-tone='error']::before {
        background: #cf1322;
    }
    .mf-cockpit__node-content {
        display: grid;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid #eee;
    }
    .mf-cockpit__detail-card > .mf-card[data-card-variant='compact'] {
        padding: 12px;
        border-color: #ececea;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 3px 12px rgb(31 35 40 / 3%);
    }
    .mf-cockpit__detail-card > .mf-card > .mf-card-heading {
        margin-bottom: 8px;
    }
    .mf-cockpit__detail-card > .mf-card > .mf-card-heading h3 {
        color: #77736d;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
    }
    .mf-cockpit__capability > .mf-card[data-card-variant='compact'] {
        padding: 3px 7px;
        border: 1px solid #d7e4f1;
        border-radius: 4px;
        background: #f5f9fd;
        box-shadow: none;
        color: #436a91;
        font-size: 11px;
        font-weight: 500;
        line-height: 18px;
    }
    .mf-cockpit__empty {
        margin: 0;
        color: #77736d;
        font-size: 11px;
        line-height: 18px;
        overflow-wrap: anywhere;
    }
    .mf-cockpit__footer .mf-footer {
        padding: 8px 10px;
    }
    .mf-cockpit__footer .mf-footer > :first-child:empty {
        display: none;
    }
    .mf-cockpit__footer .mf-footer-actions,
    .mf-cockpit__footer .mf-button {
        width: 100%;
    }
    .mf-cockpit__footer .mf-button {
        border-color: #d9d9d9;
        background: #fff;
        color: #68645f;
    }
    .mf-cockpit__rail {
        box-sizing: border-box;
        position: absolute;
        inset: 0 auto 0 0;
        display: flex;
        width: 42px;
        height: 100%;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 12px 10px;
        border: 0;
        background: #fafafa;
        color: #68645f;
        font: inherit;
        font-size: 12px;
        writing-mode: vertical-rl;
        user-select: none;
        opacity: 0;
        visibility: hidden;
        cursor: pointer;
        transition: opacity 160ms ease;
    }
    .mf-cockpit__rail > svg {
        width: 15px;
        height: 15px;
        flex: 0 0 15px;
    }
    .mf-cockpit[data-collapsed='true'] .mf-cockpit__rail {
        opacity: 1;
        visibility: visible;
    }
    @keyframes mf-cockpit-state-pulse {
        0%,
        100% {
            opacity: 0.42;
            transform: scale(0.96);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-cockpit__inner,
        .mf-cockpit[data-collapsed='true'] .mf-cockpit__inner,
        .mf-cockpit__rail,
        .mf-cockpit__toggle > svg {
            transition: none;
        }
        .mf-cockpit[data-running] .mf-cockpit__node-status[data-tone='active']::before {
            animation: none;
        }
    }
`)()
