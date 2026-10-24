import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'

export type SkeletonProps = Readonly<{
    /** 默认文本占位；矩形和圆形用于图片、头像等区域。 */
    shape?: 'text' | 'rect' | 'circle'
    /** CSS 宽度，如 '60%'、'120px'；圆形只传一个尺寸时，另一边沿用该值。 */
    width?: string
    /** CSS 高度，如 '1em'、'80px'。圆形应使用相同的宽高。 */
    height?: string
}>

/**
 * 渲染纯装饰骨架占位，配合 panelStyles 使用；默认宽 100%、高 1em。
 * 加载条件、容器 aria-busy 和加载提示由调用方负责，避免逐块重复播报。
 * @example skeleton({ shape: 'rect', width: '100%', height: '80px' })
 */
export function skeleton(p: SkeletonProps = {}) {
    const shape = p.shape ?? 'text'
    return html`<span
        class="mf-skeleton"
        data-shape=${shape}
        aria-hidden="true"
        style=${styleMap({
            width: p.width ?? (shape === 'circle' ? p.height : undefined),
            height: p.height ?? (shape === 'circle' ? p.width : undefined),
        })}
    ></span>`
}
