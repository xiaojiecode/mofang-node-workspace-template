/** 打开期间跟踪锚点：scroll 不跨 ShadowRoot，必须同时覆盖实际 slot 祖先的根。 */
export function trackPopoverAnchor(trigger: HTMLElement, position: () => void): () => void {
    const owner = trigger.ownerDocument.defaultView
    if (!owner) return () => {}
    const roots = new Set<EventTarget>([owner])
    let node: Node | null = trigger
    while (node) {
        const root = node.getRootNode()
        if (root instanceof ShadowRoot) roots.add(root)
        node =
            node instanceof Element && node.assignedSlot
                ? node.assignedSlot
                : (node.parentNode ?? (node instanceof ShadowRoot ? node.host : null))
    }
    let frame: number | undefined
    const schedule = () => {
        if (frame !== undefined) return
        frame = owner.requestAnimationFrame(() => {
            frame = undefined
            position()
        })
    }
    roots.forEach((root) =>
        root.addEventListener('scroll', schedule, { capture: true, passive: true }),
    )
    owner.addEventListener('resize', schedule, { passive: true })
    const viewport = owner.visualViewport
    viewport?.addEventListener('scroll', schedule, { passive: true })
    viewport?.addEventListener('resize', schedule, { passive: true })
    const resize = new ResizeObserver(schedule)
    resize.observe(trigger)
    return () => {
        roots.forEach((root) => root.removeEventListener('scroll', schedule, true))
        owner.removeEventListener('resize', schedule)
        viewport?.removeEventListener('scroll', schedule)
        viewport?.removeEventListener('resize', schedule)
        resize.disconnect()
        if (frame !== undefined) owner.cancelAnimationFrame(frame)
        frame = undefined
    }
}

/** 固定浮层按可见视口钳位，兼顾浏览器缩放和 VisualViewport 的偏移。 */
export function popoverViewport(owner: Window) {
    const viewport = owner.visualViewport
    const left = viewport?.offsetLeft ?? 0
    const top = viewport?.offsetTop ?? 0
    const width = viewport?.width ?? owner.innerWidth
    const height = viewport?.height ?? owner.innerHeight
    return { left, top, width, height, right: left + width, bottom: top + height }
}
