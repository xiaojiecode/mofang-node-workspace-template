import { html, noChange } from 'lit'
import type { TemplateResult } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import type { ElementPart } from 'lit/directive.js'

export type TransitionProps = Readonly<{
    show: boolean
    /** 毫秒，默认 180；0 或负值立即切换，非有限数值使用默认值。 */
    duration?: number
    /** 内容退出并隐藏后通知调用方，用于关闭原生容器；不在卸载时触发。 */
    onHidden?: () => void
}>

export type SlideProps = TransitionProps &
    Readonly<{
        /** 进入时移动的方向，退出时反向移动；默认向上移动 12px。 */
        direction?: 'up' | 'down' | 'left' | 'right'
    }>

type Effect = 'fade' | 'slide' | 'scale' | 'collapse'
type MotionOptions = TransitionProps & { effect: Effect; direction?: SlideProps['direction'] }

/** 只管理当前包装元素的动画和显隐，不修改调用方内容或业务状态。 */
class MotionDirective extends AsyncDirective {
    private element: HTMLElement | undefined
    private options: MotionOptions | undefined
    private applied: MotionOptions | undefined
    private animation: Animation | undefined
    private media: MediaQueryList | undefined
    private resize: ResizeObserver | undefined
    private scheduled = false
    private notifiedHidden = false

    override render(_options: MotionOptions) {
        return noChange
    }

    override update(part: ElementPart, [options]: [MotionOptions]) {
        this.element = part.element as HTMLElement
        this.options = options
        if (options.show) this.notifiedHidden = false
        this.element.inert = !options.show
        if (options.show) this.element.removeAttribute('aria-hidden')
        else this.element.setAttribute('aria-hidden', 'true')
        if (!this.applied) this.element.hidden = !options.show
        this.schedule()
        return noChange
    }

    /** 等子模板提交完毕后测量，合并同一轮重复渲染；首次挂载不播放动画。 */
    private schedule() {
        if (this.scheduled) return
        this.scheduled = true
        queueMicrotask(() => {
            this.scheduled = false
            const element = this.element,
                options = this.options
            if (!element || !options) return
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
            this.applied = options
            if (!previous || this.media?.matches || this.duration === 0) {
                this.settle()
            } else if (previous.show !== options.show) {
                this.start(this.duration)
            } else if (
                previous.effect !== options.effect ||
                previous.direction !== options.direction
            ) {
                this.settle()
            }
        })
    }

    private get duration() {
        const value = this.options?.duration ?? 180
        return Number.isFinite(value) ? Math.max(0, value) : 180
    }

    private readonly motionChanged = () => {
        if (this.media?.matches) this.settle()
    }

    /** 取消旧动画前读取当前画面，使快速反向切换从当前位置接续。 */
    private start(duration: number) {
        const element = this.element!,
            options = this.options!,
            view = element.ownerDocument.defaultView!
        if (duration === 0 || typeof element.animate !== 'function') {
            this.settle()
            return
        }
        const wasHidden = element.hidden
        let current: Keyframe | undefined
        if (this.animation) {
            const style = view.getComputedStyle(element)
            current = { opacity: style.opacity, transform: style.transform }
            if (options.effect === 'collapse') current.height = style.height
        }
        this.cancel()
        element.hidden = false
        const content = element.firstElementChild as HTMLElement
        const height = content.offsetHeight
        const shown: Keyframe = { opacity: 1, transform: 'none' }
        const hidden: Keyframe = { opacity: 0, transform: 'none' }
        if (options.effect === 'slide') {
            const offsets = {
                up: 'translateY(12px)',
                down: 'translateY(-12px)',
                left: 'translateX(12px)',
                right: 'translateX(-12px)',
            }
            hidden.transform = offsets[options.direction ?? 'up']
        } else if (options.effect === 'scale') {
            hidden.transform = 'scale(0.96)'
        } else if (options.effect === 'collapse') {
            shown.height = `${height}px`
            hidden.height = '0px'
            hidden.opacity = 1
        }
        element.setAttribute('data-animating', '')
        const animation = element.animate(
            [current ?? (wasHidden ? hidden : shown), options.show ? shown : hidden],
            { duration, easing: 'ease-in-out', fill: 'both' },
        )
        this.animation = animation
        animation.onfinish = animation.oncancel = () => {
            if (this.animation === animation) this.settle()
        }
        // 展开期间内容或宽度改变时更新目标高度；结束后交回自然布局。
        if (options.effect === 'collapse' && options.show) {
            this.resize = new ResizeObserver(() => {
                if (this.animation !== animation || content.offsetHeight === height) return
                const elapsed = Number(animation.currentTime ?? 0)
                this.start(Math.max(0, duration - elapsed))
            })
            this.resize.observe(content)
        }
    }

    private cancel() {
        const animation = this.animation
        this.animation = undefined
        if (animation) {
            animation.onfinish = animation.oncancel = null
            animation.cancel()
        }
        this.resize?.disconnect()
        this.resize = undefined
        this.element?.removeAttribute('data-animating')
    }

    private settle() {
        this.cancel()
        if (this.element && this.options) {
            this.element.hidden = !this.options.show
            this.applied = this.options
            if (!this.options.show && !this.notifiedHidden && this.isConnected) {
                this.notifiedHidden = true
                this.options.onHidden?.()
            }
        }
    }

    protected override disconnected() {
        this.media?.removeEventListener('change', this.motionChanged)
        this.media = undefined
        this.settle()
    }

    protected override reconnected() {
        this.schedule()
    }
}

const motion = /* @__PURE__ */ directive(MotionDirective)

/** 共享同一模板位置，切换参数时保留子内容；额外包装层仅适合块级内容。 */
function transition(options: MotionOptions, content: TemplateResult) {
    return html`<div class="mf-transition" data-effect=${options.effect} ${motion(options)}>
        <div class="mf-transition-content">${content}</div>
    </div>`
}

/**
 * 淡入淡出。配合 panelStyles 使用，首次渲染直接采用 show，后续显隐才播放动画。
 * 始终传入同一内容模板，通过 show 隐藏；退出后保留 DOM、输入及内部订阅。
 * 关闭开始即 inert；触发器的 aria-expanded 和焦点返回由调用方负责。
 */
export function fade(p: TransitionProps, content: TemplateResult) {
    return transition({ ...p, effect: 'fade' }, content)
}

/** 位移配合淡入淡出，进入方向可选；挂载、保留内容及无障碍约定与 fade 相同。 */
export function slide(p: SlideProps, content: TemplateResult) {
    return transition({ ...p, effect: 'slide' }, content)
}

/** 从 96% 缩放到原尺寸并淡入；挂载、保留内容及无障碍约定与 fade 相同。 */
export function scale(p: TransitionProps, content: TemplateResult) {
    return transition({ ...p, effect: 'scale' }, content)
}

/** 按内容自然高度展开、收起；结束后恢复自动高度，其他约定与 fade 相同。 */
export function collapse(p: TransitionProps, content: TemplateResult) {
    return transition({ ...p, effect: 'collapse' }, content)
}
