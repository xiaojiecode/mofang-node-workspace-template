import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import type { ElementPart } from 'lit'

export type DialogCloseReason = 'cancel' | 'backdrop' | 'close'
export type DialogProps = Readonly<{
    open: boolean
    title: string
    size?: 'default' | 'large'
    onClose: (reason: DialogCloseReason) => void
    footer?: TemplateResult
}>

/** 原生顶层模态只负责焦点和开关，表单草稿交给调用方。 */
class DialogDirective extends AsyncDirective {
    private element?: HTMLDialogElement
    private wanted = false
    render(_open: boolean) {
        return nothing
    }
    override update(part: ElementPart, [open]: [boolean]) {
        this.element = part.element as HTMLDialogElement
        this.wanted = open
        queueMicrotask(() => this.sync())
        return nothing
    }
    private sync() {
        if (!this.isConnected || !this.element?.isConnected) return
        if (this.wanted && !this.element.open) this.element.showModal()
        else if (!this.wanted && this.element.open) this.element.close()
    }
    override disconnected() {
        this.element?.close()
    }
    override reconnected() {
        queueMicrotask(() => this.sync())
    }
}
const modal = /* @__PURE__ */ directive(DialogDirective)

export function dialog(p: DialogProps, content: TemplateResult) {
    return html`<dialog
        class="mf-dialog"
        data-size=${p.size ?? 'default'}
        aria-label=${p.title}
        aria-hidden=${p.open ? nothing : 'true'}
        ?inert=${!p.open}
        ${modal(p.open)}
        @cancel=${(event: Event) => {
            event.preventDefault()
            p.onClose('cancel')
        }}
        @click=${(event: MouseEvent) => {
            const target = event.currentTarget as HTMLDialogElement
            if (event.target !== target) return
            const r = target.getBoundingClientRect()
            if (
                event.clientX < r.left ||
                event.clientX > r.right ||
                event.clientY < r.top ||
                event.clientY > r.bottom
            )
                p.onClose('backdrop')
        }}
    >
        <header class="mf-dialog-header">
            <h2>${p.title}</h2>
            <button
                class="mf-dialog-close"
                type="button"
                aria-label="关闭弹窗"
                @click=${() => p.onClose('close')}
            >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path d="m4 4 12 12M16 4 4 16" />
                </svg>
            </button>
        </header>
        <div class="mf-dialog-body">${content}</div>
        ${p.footer ?? nothing}
    </dialog>`
}

export const dialogStyles = /* @__PURE__ */ (() => css`
    .mf-dialog {
        flex-direction: column;
        width: min(480px, calc(100vw - 48px));
        max-height: calc(100dvh - 48px);
        padding: 0;
        border: 0;
        border-radius: 7px;
        background: #fff;
        color: var(--mf-fg);
        box-shadow: 0 6px 28px #0003;
    }
    .mf-dialog[open] {
        display: flex;
    }
    .mf-dialog[data-size='large'] {
        width: min(680px, calc(100vw - 48px));
    }
    .mf-dialog::backdrop {
        background: #0005;
    }
    .mf-dialog-header {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        border-bottom: 1px solid #eceef1;
        gap: 20px;
    }
    .mf-dialog-header h2 {
        font-size: 18px;
    }
    .mf-dialog-close {
        display: flex;
        border: 0;
        background: transparent;
        color: #8d9299;
        padding: 3px;
        cursor: pointer;
    }
    .mf-dialog-close svg {
        width: 20px;
        height: 20px;
    }
    .mf-dialog-body {
        overflow: auto;
        min-height: 0;
        padding: 22px 20px;
    }
    .mf-dialog-body > .mf-field:first-child {
        margin-top: 0;
    }
    .mf-dialog > .mf-footer {
        flex-shrink: 0;
    }
    .mf-dialog button:focus-visible {
        outline: 2px solid #87bbff;
        outline-offset: 2px;
    }
`)()
