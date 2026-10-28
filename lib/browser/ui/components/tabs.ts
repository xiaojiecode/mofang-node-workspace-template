import { html, nothing, noChange } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import type { ElementPart } from 'lit/directive.js'
import type { TemplateResult } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

export type TabItem = Readonly<{
    value: string
    label: string
    content: TemplateResult
    disabled?: boolean
}>
export type TabsProps = Readonly<{
    /** 同一 ShadowRoot 内稳定且唯一的标识。 */
    id: string
    label: string
    value: string
    items: readonly TabItem[]
    variant?: 'segmented' | 'underline'
    /** 指向同一根节点内已有的单一结果区域；此模式不额外渲染 items.content。 */
    contentId?: string
    /** 切换动画毫秒数，默认 160；0 立即切换，减少动态效果偏好始终跳过。 */
    motionDuration?: number
    onChange: (value: string) => void
}>

/** 保留页签 DOM，退出动画结束后才隐藏；失活时立即隔离焦点与辅助技术。 */
class TabPanelMotion extends AsyncDirective {
    private element: HTMLElement | undefined
    private show = false
    private applied: boolean | undefined
    private duration = 160
    private scheduled = false
    private animation: Animation | undefined
    private media: MediaQueryList | undefined

    override render(_show: boolean, _duration: number, _focusId: string) {
        return noChange
    }

    override update(part: ElementPart, [show, duration, focusId]: [boolean, number, string]) {
        this.element = part.element as HTMLElement
        this.show = show
        this.duration = Number.isFinite(duration) ? Math.max(0, duration) : 160
        this.element.inert = !show
        this.element.setAttribute('data-active', String(show))
        if (show) this.element.removeAttribute('aria-hidden')
        else {
            this.element.setAttribute('aria-hidden', 'true')
            const root = this.element.getRootNode() as Document | ShadowRoot
            if (this.element.contains(root.activeElement)) root.getElementById(focusId)?.focus()
        }
        if (this.applied === undefined) this.element.hidden = !show
        this.schedule()
        return noChange
    }

    private schedule() {
        if (this.scheduled) return
        this.scheduled = true
        queueMicrotask(() => {
            this.scheduled = false
            const element = this.element
            if (!element) return
            if (!this.isConnected || !element.isConnected) {
                this.settle()
                return
            }
            if (!this.media) {
                this.media = element.ownerDocument.defaultView?.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                )
                this.media?.addEventListener('change', this.motionChanged)
            }
            const previous = this.applied
            this.applied = this.show
            if (previous === undefined || this.media?.matches || this.duration === 0) this.settle()
            else if (previous !== this.show) this.start()
        })
    }

    private readonly motionChanged = () => {
        if (this.media?.matches) this.settle()
    }

    private start() {
        const element = this.element!
        const content = element.firstElementChild as HTMLElement | null
        if (!content || typeof content.animate !== 'function') {
            this.settle()
            return
        }
        const wasHidden = element.hidden
        const style = element.ownerDocument.defaultView!.getComputedStyle(content)
        const from = this.animation
            ? { opacity: style.opacity, transform: style.transform }
            : wasHidden
              ? { opacity: 0, transform: 'translateY(4px)' }
              : { opacity: 1, transform: 'none' }
        this.cancel()
        element.hidden = false
        content.setAttribute('data-animating', '')
        const animation = content.animate(
            [
                from,
                this.show
                    ? { opacity: 1, transform: 'none' }
                    : { opacity: 0, transform: 'translateY(4px)' },
            ],
            { duration: this.duration, easing: 'ease-in-out', fill: 'both' },
        )
        this.animation = animation
        animation.onfinish = () => {
            if (this.animation === animation) this.settle()
        }
    }

    private cancel() {
        if (this.animation) {
            this.animation.onfinish = null
            this.animation.cancel()
            this.animation = undefined
        }
        this.element?.firstElementChild?.removeAttribute('data-animating')
    }

    private settle() {
        this.cancel()
        if (this.element) this.element.hidden = !this.show
        this.applied = this.show
    }

    protected override disconnected() {
        this.media?.removeEventListener('change', this.motionChanged)
        this.media = undefined
        this.settle()
    }
    protected override reconnected() {
        this.applied = undefined
        this.schedule()
    }
}
const tabPanelMotion = /* @__PURE__ */ directive(TabPanelMotion)

/** 将同一结果区域与当前页签关联；只在页签值改变时播放内容进入动画。 */
class TabResultMotion extends AsyncDirective {
    private host: HTMLElement | undefined
    private target: HTMLElement | undefined
    private targetId = ''
    private active = ''
    private labelId = ''
    private duration = 160
    private applied: string | undefined
    private scheduled = false
    private animation: Animation | undefined
    private media: MediaQueryList | undefined
    private original = new Map<string, string | null>()
    private owned = new Map<string, string>()

    override render(_targetId: string, _active: string, _labelId: string, _duration: number) {
        return noChange
    }

    override update(
        part: ElementPart,
        [targetId, active, labelId, duration]: [string, string, string, number],
    ) {
        this.host = part.element as HTMLElement
        this.targetId = targetId
        this.active = active
        this.labelId = labelId
        this.duration = Number.isFinite(duration) ? Math.max(0, duration) : 160
        this.schedule()
        return noChange
    }

    private schedule() {
        if (this.scheduled) return
        this.scheduled = true
        queueMicrotask(() => {
            this.scheduled = false
            if (!this.isConnected || !this.host?.isConnected) return
            const root = this.host.getRootNode()
            const found =
                root instanceof ShadowRoot || root instanceof Document
                    ? root.getElementById(this.targetId)
                    : null
            const target =
                found instanceof HTMLElement && found !== this.host && !found.contains(this.host)
                    ? found
                    : undefined
            if (target !== this.target) {
                this.release()
                this.target = target
                this.applied = undefined
            }
            if (!target) return
            this.own('role', 'tabpanel')
            this.own('aria-labelledby', this.labelId)
            if (!this.media) {
                this.media = target.ownerDocument.defaultView?.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                )
                this.media?.addEventListener('change', this.motionChanged)
            }
            const changed = this.applied !== undefined && this.applied !== this.active
            this.applied = this.active
            if (this.media?.matches || this.duration === 0) this.cancel()
            else if (changed) this.start()
        })
    }

    private own(name: string, value: string) {
        if (!this.original.has(name)) this.original.set(name, this.target!.getAttribute(name))
        this.target!.setAttribute(name, value)
        this.owned.set(name, value)
    }

    private start() {
        const target = this.target!
        if (typeof target.animate !== 'function') return
        const style = target.ownerDocument.defaultView!.getComputedStyle(target)
        const from = this.animation
            ? { opacity: style.opacity, transform: style.transform }
            : { opacity: '0', transform: 'translateY(4px)' }
        this.cancel()
        target.setAttribute('data-tab-animating', '')
        const animation = target.animate([from, { opacity: '1', transform: 'none' }], {
            duration: this.duration,
            easing: 'ease-in-out',
            fill: 'both',
        })
        this.animation = animation
        animation.onfinish = () => {
            if (this.animation === animation) this.cancel()
        }
    }

    private readonly motionChanged = () => {
        if (this.media?.matches) this.cancel()
    }

    private cancel() {
        if (this.animation) {
            this.animation.onfinish = null
            this.animation.cancel()
            this.animation = undefined
        }
        this.target?.removeAttribute('data-tab-animating')
    }

    private release() {
        this.cancel()
        this.media?.removeEventListener('change', this.motionChanged)
        this.media = undefined
        const target = this.target
        if (target)
            for (const [name, value] of this.original) {
                if (target.getAttribute(name) !== this.owned.get(name)) continue
                if (value === null) target.removeAttribute(name)
                else target.setAttribute(name, value)
            }
        this.original.clear()
        this.owned.clear()
        this.target = undefined
    }

    protected override disconnected() {
        this.release()
        this.applied = undefined
    }

    protected override reconnected() {
        this.schedule()
    }
}
const tabResultMotion = /* @__PURE__ */ directive(TabResultMotion)

/** 受控页签；方向键/Home/End 切换，所有内容按 key 保留，隐藏页不参与焦点导航。 */
export function tabs(p: TabsProps) {
    const enabled = p.items.filter((item) => !item.disabled)
    const active = enabled.find((item) => item.value === p.value)?.value ?? enabled[0]?.value
    const prefix = `mf-tabs-${encodeURIComponent(p.id)}`
    const id = (value: string) => `${prefix}-${encodeURIComponent(value)}`
    return html`<div
        class="mf-tabs"
        data-variant=${p.variant ?? 'segmented'}
        ${tabResultMotion(
            p.contentId ?? '',
            active ?? '',
            active ? `${id(active)}-tab` : '',
            p.motionDuration ?? 160,
        )}
    >
        <div class="mf-tab-list" role="tablist" aria-label=${p.label}>
            ${repeat(
                p.items,
                (item) => item.value,
                (item) =>
                    html`<button
                        class="mf-tab"
                        type="button"
                        role="tab"
                        id=${`${id(item.value)}-tab`}
                        aria-controls=${p.contentId ?? `${id(item.value)}-panel`}
                        aria-selected=${item.value === active}
                        tabindex=${item.value === active ? 0 : -1}
                        ?disabled=${item.disabled}
                        @click=${() => {
                            if (!item.disabled) p.onChange(item.value)
                        }}
                        @keydown=${(event: KeyboardEvent) => {
                            if (
                                !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) ||
                                !enabled.length
                            )
                                return
                            event.preventDefault()
                            const current = enabled.findIndex((tab) => tab.value === item.value)
                            const next =
                                event.key === 'Home'
                                    ? 0
                                    : event.key === 'End'
                                      ? enabled.length - 1
                                      : (current +
                                            (event.key === 'ArrowRight' ? 1 : -1) +
                                            enabled.length) %
                                        enabled.length
                            const value = enabled[next]!.value
                            p.onChange(value)
                            const root = (event.currentTarget as HTMLElement).getRootNode() as
                                | Document
                                | ShadowRoot
                            root.getElementById(`${id(value)}-tab`)?.focus()
                        }}
                    >
                        ${item.label}
                    </button>`,
            )}
        </div>
        ${p.contentId
            ? nothing
            : html`<div class="mf-tab-panels">
                  ${repeat(
                      p.items,
                      (item) => item.value,
                      (item) =>
                          html`<div
                              class="mf-tab-panel"
                              id=${`${id(item.value)}-panel`}
                              role="tabpanel"
                              aria-labelledby=${`${id(item.value)}-tab`}
                              ${tabPanelMotion(
                                  item.value === active,
                                  p.motionDuration ?? 160,
                                  active ? `${id(active)}-tab` : '',
                              )}
                              tabindex=${item.value === active ? 0 : nothing}
                          >
                              <div class="mf-transition" data-effect="fade">
                                  <div class="mf-transition-content">${item.content}</div>
                              </div>
                          </div>`,
                  )}
              </div>`}
    </div>`
}
