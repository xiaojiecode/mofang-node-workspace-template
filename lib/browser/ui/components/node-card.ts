import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'

export type NodeCardProps = Readonly<{
    /** 右侧一般组合内置 cockpit；未传入时正文占满全部空间。 */
    aside?: TemplateResult
    /** 只控制侧栏壳体宽度；展开、收起事件由 aside 内的受控组件提供。 */
    collapsed?: boolean
}>

/** 节点业务默认容器，填满宿主可用空间；正文与侧栏分别持有自己的单一滚动区域。 */
export function nodeCard(props: NodeCardProps, content: TemplateResult) {
    return html`<div class="mf-node-card">
        <div class="mf-node-card-content">${content}</div>
        ${props.aside
            ? html`<div class="mf-node-card-aside" data-collapsed=${Boolean(props.collapsed)}>
                  ${props.aside}
              </div>`
            : nothing}
    </div>`
}

/** 容器不增加正文滚动；侧栏内部按展开宽度排版，收起时只裁切壳体。 */
export const nodeCardStyles = /* @__PURE__ */ (() => css`
    .mf-node-card {
        display: flex;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        box-sizing: border-box;
        background: var(--mf-bg, #fff);
    }
    .mf-node-card-content {
        flex: 1 1 0;
        min-width: 0;
        min-height: 0;
        height: 100%;
        overflow: hidden;
    }
    .mf-node-card-aside {
        --mf-cockpit-content-width: 339px;
        flex: 0 0 340px;
        width: 340px;
        min-width: 0;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        border-left: 1px solid var(--mf-line, #ececea);
        box-sizing: border-box;
        transition:
            flex-basis 220ms cubic-bezier(0.23, 1, 0.32, 1),
            width 220ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .mf-node-card-aside[data-collapsed='true'] {
        flex-basis: 44px;
        width: 44px;
    }
    .mf-node-card-aside > .mf-cockpit {
        border: 0;
        border-radius: 0;
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-node-card-aside {
            transition: none;
        }
    }
`)()
