import { html } from 'lit'
import type { IconProps } from '../components/icons'

/** 静态平台入口只带入对应图片，名称可覆盖，原品牌颜色保持不变。 */
export function platformImage(source: string, label: string, p: IconProps) {
    return html`<img
        src=${source}
        width=${p.size ?? 24}
        height=${p.size ?? 24}
        style="object-fit:contain;vertical-align:middle"
        alt=${p.label ?? label}
    />`
}
