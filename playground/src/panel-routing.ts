export type PreviewSurface = 'settings' | 'business'
export type PreviewPanels = {
    version: 1
    settings: { renderer: 'lit' | 'puck'; entry: string }
    business: { renderer: 'lit' | 'puck'; entry: string }
    legacy: boolean
}

/** 切换运行器时保留 Mock 场景、产物模式和显式节点/面板身份。 */
export function panelPreviewUrl(
    href: string,
    code: string,
    surface: PreviewSurface,
    renderer: 'lit' | 'puck',
) {
    const current = new URL(href)
    const target = new URL(renderer === 'puck' ? './lowcode.html' : './index.html', current)
    target.search = current.search
    target.searchParams.set('node', code)
    target.searchParams.set('surface', surface)
    return target.href
}
