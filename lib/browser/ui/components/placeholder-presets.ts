import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { emptyState } from './content'

export type PlaceholderProps = Readonly<{
    title: string
    description?: string
    /** 调用方提供已知图标或插图，本组件不加载图片或推断业务类型。 */
    icon?: TemplateResult
    /** 操作沿用调用方的受控按钮及回调，不自动启动任务或请求。 */
    actions?: TemplateResult
    /** panel 用于结果区，inline 用于局部空内容，page 用于页面级插图。 */
    variant?: 'panel' | 'inline' | 'page'
}>

/** 通用空态展示；复用既有空态文案结构，真实状态、图标动效和操作均由调用方提供。 */
export function placeholder(p: PlaceholderProps) {
    return html`<div class="mf-placeholder" data-variant=${p.variant ?? 'panel'}>
        ${p.icon
            ? html`<div class="mf-placeholder__icon" aria-hidden="true">${p.icon}</div>`
            : nothing}
        ${emptyState(p.title, p.description, p.actions)}
    </div>`
}

/** 占位只确定内部排版，有限高度和滚动边界继续由宿主设置。 */
export const placeholderStyles = /* @__PURE__ */ (() => css`
    .mf-placeholder {
        display: flex;
        min-width: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 28px 20px;
        text-align: center;
        overflow-wrap: anywhere;
    }
    .mf-placeholder > .mf-empty-state {
        min-width: 0;
        max-width: 60ch;
        padding: 0;
    }
    .mf-placeholder .mf-empty-state p {
        line-height: 1.7;
    }
    .mf-placeholder__icon {
        display: grid;
        min-width: 0;
        flex: 0 0 auto;
        place-items: center;
        color: var(--mf-muted, #6b7280);
    }
    .mf-placeholder__icon > svg {
        width: 36px;
        height: 36px;
    }
    .mf-placeholder__icon > img {
        display: block;
        max-width: min(144px, 100%);
        max-height: 110px;
        object-fit: contain;
    }
    .mf-placeholder[data-variant='inline'] {
        flex-direction: row;
        justify-content: flex-start;
        gap: 10px;
        padding: 16px;
        text-align: left;
    }
    .mf-placeholder[data-variant='inline'] > .mf-empty-state {
        max-width: none;
        text-align: left;
    }
    .mf-placeholder[data-variant='inline'] .mf-placeholder__icon > :is(svg, img) {
        width: 24px;
        height: 24px;
    }
    .mf-placeholder[data-variant='page'] {
        padding: 32px 24px;
    }
    .mf-placeholder[data-variant='page'] .mf-placeholder__icon > img {
        width: 264px;
        max-width: 100%;
        max-height: 176px;
    }
`)()
