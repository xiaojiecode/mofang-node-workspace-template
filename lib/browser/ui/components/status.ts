import { html, nothing } from 'lit'
/**
 * 渲染信息/错误提示并使用对应的可访问性角色；文案由调用方提供，不推断业务终态。
 */
export function statusNote(title: string, message: string, kind: 'info' | 'error' = 'info') {
    return html`<div
        class="mf-note"
        data-kind=${kind}
        role=${kind === 'error' ? 'alert' : 'status'}
    >
        <strong>${title}</strong>
        <p>${message}</p>
    </div>`
}
/**
 * 渲染面板标题；说明文字可选，调用方不需要时省略。
 * 不包含状态推进或宿主接线，供设置页和业务页复用。
 */
export function sectionHeading(title: string, description?: string) {
    return html`<header class="mf-heading">
        <h2>${title}</h2>
        ${description ? html`<p>${description}</p>` : nothing}
    </header>`
}
