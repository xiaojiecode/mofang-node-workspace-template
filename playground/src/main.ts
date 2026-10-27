import type { LitElement } from 'lit'
import { ActionController } from '../../lib/browser/actions'
import type { PanelProps, JSONObject, NodeView } from '@mofang/contracts/browser'
import { createFixture } from './fixture'
import { panelPreviewUrl, type PreviewPanels, type PreviewSurface } from './panel-routing'
import './style.css'
const sources = import.meta.glob<{ default: typeof LitElement }>('../../nodes/**/*.ts')
const fixtures = import.meta.glob<{ default: JSONObject }>('../../nodes/*/fixtures/input.json', {
    eager: true,
})
const previews = import.meta.glob<{ default: Partial<NodeView> }>(
    '../../nodes/*/fixtures/preview.json',
    { eager: true },
)
const previewFor = (code: string) =>
    previews['../../nodes/' + code + '/fixtures/preview.json']?.default ?? {}
type Definition = {
    name?: string
    description?: string
    category?: string
    interface?: string
    tools?: string[]
    timeoutSeconds?: number
    maxToolCalls?: number
    inputSchema?: unknown
    outputSchema?: unknown
}
const definitions = import.meta.glob<Definition>('../../nodes/*/node.ts', {
    eager: true,
    import: 'default',
})
/** 读取节点目录元数据，仅用于预览外壳的名称、说明与详情展示。 */
const metaFor = (code: string) => {
    const definition = definitions['../../nodes/' + code + '/node.ts'] ?? {}
    return {
        ...definition,
        name: definition.name || code,
        description: definition.description ?? '',
    }
}
const codes = Object.keys(fixtures)
    .map((key) => key.split('/')[3]!)
    .sort()
const svg = (paths: string) =>
    `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`
const icons = {
    settings: svg(
        '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    ),
    maximize: svg(
        '<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>',
    ),
    minimize: svg(
        '<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>',
    ),
    close: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
}
const grip =
    '<svg width="40" height="17" viewBox="0 0 40 17" aria-hidden="true"><rect x="0.5" y="0.5" width="39" height="16" rx="8" fill="#fff" stroke="#e4e6ea"/><g fill="#b3b8c0"><circle cx="15" cy="6" r="1.3"/><circle cx="20" cy="6" r="1.3"/><circle cx="25" cy="6" r="1.3"/><circle cx="15" cy="11" r="1.3"/><circle cx="20" cy="11" r="1.3"/><circle cx="25" cy="11" r="1.3"/></g></svg>'
// 标题栏按客户端最新 Lit 模式只保留全屏与关闭，运行状态放在画布节点与详情栏。
const headerActions = (label: string, close: string) =>
    `<div class="header-actions"><button class="icon-button" data-fullscreen="${label}" aria-label="${label}">${icons.maximize}</button><button class="icon-button" data-close aria-label="${close}">${icons.close}</button></div>`
const app = document.querySelector<HTMLDivElement>('#app')!
// 外壳按客户端工作台比例模拟：画布与底部抽屉共用舞台，业务/设置抽屉同一时间只显示一个；元素 id 供浏览器回归定位。
app.innerHTML = `
<aside class="shell-nav" aria-label="本地节点">
    <div class="brand"><span class="brand-mark" aria-hidden="true">M</span><div><strong>魔方 AI</strong><span>节点开发预览</span></div></div>
    <p class="nav-label"><span>工作区节点</span><span>${codes.length}</span></p>
    <nav id="nodes" aria-label="节点"></nav>
</aside>
<div class="workspace">
    <header class="topbar">
        <div class="crumbs"><span>工作台</span><span aria-hidden="true">/</span><strong>本地预览工作流</strong></div>
        <div class="toolbar">
            <div class="segmented" role="group" aria-label="预览场景">
                <button data-scene="ready">有商品</button><button data-scene="empty">空结果</button><button data-scene="error">读取失败</button>
            </div>
            <button id="readonly" class="tool-button" aria-pressed="false">切换只读</button>
            <button id="replace" class="tool-button">替换 SDK</button>
        </div>
    </header>
    <section class="stage">
        <div class="canvas">
            <div class="canvas-toolbar"><button id="open-settings" class="tool-button" aria-pressed="false">${icons.settings}工作流设置</button></div>
            <span class="flow-start" aria-hidden="true">开始</span><span class="flow-edge" aria-hidden="true"></span>
            <button id="open-business" class="flow-node" aria-label="打开节点业务" aria-pressed="false">
                <span class="flow-node-head"><span class="node-icon" data-shell="icon"></span><strong data-shell="name"></strong><span class="status-pill" data-shell="status"></span></span>
                <span class="flow-node-desc" data-shell="description"></span>
            </button>
        </div>
        <section class="drawer" data-open="true" aria-label="节点抽屉">
            <div class="drawer-grip" role="separator" tabindex="0" aria-label="调整抽屉高度" aria-orientation="horizontal">${grip}</div>
            <div class="drawer-pane" data-pane="business">
                <header class="node-page-header">
                    <span class="node-page-icon" data-shell="icon"></span>
                    <div class="node-page-identity"><h2 data-shell="name"></h2><p data-shell="description"></p></div>
                    ${headerActions('进入全屏', '关闭节点面板')}
                </header>
                <div class="business-frame">
                    <div class="business-pane">
                        <div id="host-actions" role="region" aria-label="节点必要操作与结果"></div>
                        <div id="business"></div>
                    </div>
                </div>
            </div>
            <div class="drawer-pane" data-pane="settings">
                <header class="config-header">
                    <span class="config-icon">${icons.settings}</span>
                    <div class="config-title"><h2>工作流设置</h2><p>配置各节点的参数与执行方式</p></div>
                    ${headerActions('全屏查看工作流设置', '关闭配置')}
                </header>
                <div class="config-body">
                    <nav class="config-nav" aria-label="设置节点">
                        <div class="config-nav-item" aria-current="true"><span class="node-icon" data-shell="icon"></span><span><strong data-shell="name"></strong><small data-shell="description"></small></span></div>
                    </nav>
                    <div class="config-main">
                        <div class="config-scroll"><div id="settings"></div></div>
                        <footer class="config-footer"><button id="settings-cancel" class="button-outline">取消</button><button id="settings-save" class="button-primary">保存</button></footer>
                    </div>
                </div>
            </div>
        </section>
    </section>
    <aside class="details" aria-label="节点详情">
        <header class="details-head"><h3>节点详情</h3></header>
        <div id="details" class="details-body"></div>
    </aside>
</div>`
const statusLabels: Record<string, [string, string]> = {
    running: ['运行中', 'warn'],
    closing: ['收尾中', 'warn'],
    waiting: ['待处理', 'warn'],
    paused: ['已暂停', 'idle'],
    succeeded: ['已完成', 'ok'],
    failed: ['失败', 'bad'],
    cancelled: ['已取消', 'idle'],
}
/** 读取当前 fixture 的运行状态标签与色调。 */
function statusOf(): [string, string] {
    const snapshot = current?.sdk.nodeFlow
        .watch({ runId: current.nodeView.runId, nodeInstanceId: current.nodeView.nodeInstanceId })
        .getSnapshot()
    if (snapshot?.error) return ['读取失败', 'bad']
    return statusLabels[snapshot?.data?.status ?? ''] ?? ['未连接', 'idle']
}
/** 同步外壳中的节点名称、说明与运行状态；不参与节点面板渲染。 */
function renderShell() {
    const meta = metaFor(active)
    const [label, tone] = statusOf()
    for (const element of document.querySelectorAll<HTMLElement>('[data-shell]')) {
        const field = element.dataset.shell
        if (field === 'name') element.textContent = meta.name
        else if (field === 'description') element.textContent = meta.description
        else if (field === 'icon') element.textContent = Array.from(meta.name)[0] ?? ''
        else if (field === 'status') {
            element.textContent = label
            element.dataset.tone = tone
        }
    }
    for (const button of document.querySelectorAll<HTMLButtonElement>('#nodes button'))
        button.setAttribute('aria-current', String(button.dataset.code === active))
    for (const button of document.querySelectorAll<HTMLButtonElement>('[data-scene]'))
        button.setAttribute('aria-pressed', String(button.dataset.scene === scene))
}
/** 创建带文本的元素，避免把目录元数据拼进 HTML。 */
function element<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className = '') {
    const node = document.createElement(tag)
    if (text) node.textContent = text
    if (className) node.className = className
    return node
}
/** 渲染右侧节点详情：目录元数据、许可能力、双 Schema 与宿主草稿。 */
function renderDetails() {
    const meta = metaFor(active)
    const body = document.querySelector<HTMLElement>('#details')!
    const identity = element('div', '', 'details-identity')
    identity.append(element('h4', meta.name), element('p', active, 'details-code'))
    if (meta.description) identity.append(element('p', meta.description))
    const section = (title: string, ...children: Node[]) => {
        const block = element('section', '', 'details-section')
        block.append(element('h4', title), ...children)
        return block
    }
    const facts = element('dl', '', 'details-facts')
    const status = element('span', '', 'status-pill')
    status.dataset.shell = 'status'
    const statusValue = element('dd')
    statusValue.append(status)
    facts.append(element('dt', '运行状态'), statusValue)
    for (const [name, value] of [
        ['分类', meta.category ?? '—'],
        ['接口', meta.interface ?? '—'],
        ['超时', meta.timeoutSeconds ? meta.timeoutSeconds + ' 秒' : '—'],
        ['工具调用上限', meta.maxToolCalls === undefined ? '—' : String(meta.maxToolCalls)],
    ])
        facts.append(element('dt', name), element('dd', value))
    const tools = element('ul', '', 'details-tools')
    for (const tool of meta.tools ?? []) tools.append(element('li', tool))
    const json = (title: string, value: unknown, id = '') => {
        const details = element('details', '', 'details-json')
        const summary = element('summary', title)
        const pre = element('pre', value === undefined ? '' : JSON.stringify(value, null, 2))
        if (id) {
            pre.id = id
            const count = element('span')
            count.id = id + '-count'
            summary.append(count)
        }
        details.append(summary, pre)
        return details
    }
    body.replaceChildren(
        identity,
        section('基本信息', facts),
        section('许可的原子能力', meta.tools?.length ? tools : element('p', '未声明业务能力')),
        section(
            '契约与配置',
            json('输入 Schema', meta.inputSchema),
            json('输出 Schema', meta.outputSchema),
            json('设置草稿', undefined, 'draft'),
        ),
    )
    renderShell()
}
const previewQuery = new URLSearchParams(location.search)
const requestedNode = previewQuery.get('node')
if (previewQuery.get('surface') === 'business') document.body.dataset.surface = 'business'
let active = requestedNode && codes.includes(requestedNode) ? requestedNode : codes[0]!,
    scene = previewQuery.get('scene') ?? 'ready',
    readOnly = previewQuery.get('readonly') === 'true',
    sequence = 0
let current: ReturnType<typeof createFixture> | undefined
let panels: PreviewPanels | undefined
const previous: ReturnType<typeof createFixture>[] = []
let hostUnsubscribe: (() => void) | undefined
const hostActions = new ActionController(
    {
        addController() {},
        removeController() {},
        updateComplete: Promise.resolve(true),
        requestUpdate: () => renderHostActions(),
    },
    () => ({
        sdk: current?.sdk,
        target: current
            ? {
                  runId: current.nodeView.runId,
                  nodeInstanceId: current.nodeView.nodeInstanceId,
                  nodeCode: active,
                  view: readOnly ? 'history' : 'current',
              }
            : undefined,
        node: current?.nodeView,
    }),
    () => {},
)
/** 模拟宿主必要操作区：只渲染投影中声明的 host 动作，不执行作者 handle。 */
function renderHostActions() {
    renderShell()
    const region = document.querySelector<HTMLElement>('#host-actions')!
    region.replaceChildren()
    const snapshot = current?.sdk.nodeFlow
        .watch({ runId: current.nodeView.runId, nodeInstanceId: current.nodeView.nodeInstanceId })
        .getSnapshot()
    const alert = (text: string) => {
        const error = element('p', text)
        error.setAttribute('role', 'alert')
        region.append(error)
    }
    if (snapshot?.error) return alert('读取失败：' + snapshot.error.message)
    const view = snapshot?.data
    if (!view) return
    const projection = view.composition.projection
    if (projection.status === 'unavailable') alert('业务展示暂不可用：' + projection.message)
    else
        for (const action of projection.actions.filter((item) => item.presentation === 'host')) {
            const item = element('div', '', 'host-action')
            const button = element('button', action.label)
            button.disabled =
                readOnly ||
                !view.permissions.canAct ||
                !action.availability.enabled ||
                hostActions.busy
            button.onclick = () => {
                if (!button.disabled) void hostActions.submit(action.name, {})
            }
            const reason = readOnly
                ? '只读模式不能提交动作'
                : !view.permissions.canAct
                  ? '当前上下文无操作权限'
                  : !action.availability.enabled
                    ? action.availability.reason
                    : action.description
            item.append(button, element('span', reason ?? ''))
            region.append(item)
        }
    if (hostActions.phase !== 'idle' || hostActions.result || hostActions.error) {
        const labels = {
            idle: '就绪',
            sending: '正在提交',
            tracking: '已受理，等待处理结果',
            unknown: '结果待核对',
        }
        let text = labels[hostActions.phase]
        if (hostActions.result)
            text +=
                ' · ' +
                hostActions.result.name +
                ' · ' +
                hostActions.result.status +
                ' · ' +
                hostActions.result.eventId
        if (hostActions.error) text += ' · ' + hostActions.error
        const state = element('p', text)
        state.setAttribute('role', 'status')
        region.append(state)
    }
    if (hostActions.phase === 'unknown') {
        const refresh = element('button', '重新读取动作记录')
        refresh.onclick = () => void hostActions.restore()
        const acknowledge = element('button', '已核对记录，允许新的提交')
        acknowledge.onclick = () => hostActions.acknowledgeUnknown()
        region.append(refresh, acknowledge)
    }
}
function bindHostFixture() {
    hostUnsubscribe?.()
    hostActions.hostDisconnected()
    current?.setReadOnly(readOnly)
    hostUnsubscribe = current?.sdk.nodeFlow
        .watch({ runId: current.nodeView.runId, nodeInstanceId: current.nodeView.nodeInstanceId })
        .subscribe(renderHostActions)
    hostActions.hostConnected()
    renderHostActions()
}
// 抽屉尺寸沿用客户端：默认与上限为舞台高度 80%，下限 240px，键盘步进 16/64px。
const DRAWER_MIN = 240
const stage = document.querySelector<HTMLElement>('.stage')!
const drawer = document.querySelector<HTMLElement>('.drawer')!
const resizer = drawer.querySelector<HTMLElement>('.drawer-grip')!
let pane: PreviewSurface | null =
        previewQuery.get('surface') === 'settings' ? 'settings' : 'business',
    dragged: number | null = null,
    fullscreen = false,
    settingsSnapshot: Record<string, unknown> | null = null
/** 计算抽屉高度上下限，舞台过矮时下限让位给上限。 */
function bounds() {
    const max = Math.max(0, stage.clientHeight * 0.8)
    return { min: Math.min(DRAWER_MIN, max), max }
}
/** 按当前打开面板、拖动高度与全屏状态同步抽屉外观。 */
function renderDrawer() {
    const { min, max } = bounds()
    const height = Math.round(Math.min(max, Math.max(min, dragged ?? max)))
    drawer.dataset.open = String(pane !== null)
    drawer.dataset.fullscreen = String(fullscreen)
    drawer.inert = pane === null
    drawer.style.setProperty('--drawer-height', fullscreen ? '100%' : height + 'px')
    resizer.hidden = fullscreen
    resizer.setAttribute('aria-valuemin', String(Math.round(min)))
    resizer.setAttribute('aria-valuemax', String(Math.round(max)))
    resizer.setAttribute('aria-valuenow', String(height))
    for (const part of drawer.querySelectorAll<HTMLElement>('[data-pane]')) {
        part.hidden = part.dataset.pane !== pane
        part.inert = part.hidden
    }
    for (const button of drawer.querySelectorAll<HTMLButtonElement>('[data-fullscreen]')) {
        const base = button.dataset.fullscreen!
        button.setAttribute('aria-label', fullscreen ? '退出全屏' : base)
        button.title = button.getAttribute('aria-label')!
        button.innerHTML = fullscreen ? icons.minimize : icons.maximize
    }
    document
        .querySelector('#open-settings')!
        .setAttribute('aria-pressed', String(pane === 'settings'))
    document
        .querySelector('#open-business')!
        .setAttribute('aria-pressed', String(pane === 'business'))
}
/** 切换底部抽屉显示的面板；两个 Lit 实例保持挂载，只改变可见性。 */
function openDrawer(next: typeof pane) {
    if (next && panels?.[next].renderer === 'puck') {
        navigatePanel(next, 'puck')
        return
    }
    if (next === 'settings' && pane !== 'settings') settingsSnapshot = { ...draft }
    if (next !== 'settings') settingsSnapshot = null
    if (next === null) fullscreen = false
    pane = next
    renderDrawer()
}

/** 在已校验的面板清单之间切换；不把 Puck 配置当 Lit 模块加载。 */
function navigatePanel(surface: PreviewSurface, renderer: 'lit' | 'puck', replace = false) {
    const url = new URL(panelPreviewUrl(location.href, active, surface, renderer))
    url.searchParams.set('scene', scene)
    url.searchParams.set('readonly', String(readOnly))
    if (replace) location.replace(url.href)
    else location.assign(url.href)
}
resizer.onpointerdown = (event) => {
    event.preventDefault()
    const startY = event.clientY,
        startHeight = drawer.getBoundingClientRect().height
    drawer.classList.add('is-resizing')
    resizer.setPointerCapture(event.pointerId)
    resizer.onpointermove = (move) => {
        dragged = startHeight + startY - move.clientY
        renderDrawer()
    }
    resizer.onpointerup = resizer.onpointercancel = () => {
        drawer.classList.remove('is-resizing')
        resizer.onpointermove = resizer.onpointerup = resizer.onpointercancel = null
    }
}
resizer.onkeydown = (event) => {
    const { min, max } = bounds()
    const now = dragged ?? max
    const heights: Record<string, number> = {
        ArrowUp: now + 16,
        ArrowDown: now - 16,
        PageUp: now + 64,
        PageDown: now - 64,
        Home: max,
        End: min,
    }
    if (!Object.hasOwn(heights, event.key)) return
    event.preventDefault()
    dragged = heights[event.key]!
    renderDrawer()
}
new ResizeObserver(renderDrawer).observe(stage)
for (const button of drawer.querySelectorAll<HTMLButtonElement>('[data-fullscreen]'))
    button.onclick = () => {
        fullscreen = !fullscreen
        renderDrawer()
    }
for (const button of drawer.querySelectorAll<HTMLButtonElement>('[data-close]'))
    button.onclick = () => {
        if (pane === 'settings') restoreSettings()
        openDrawer(null)
    }
const elements: Array<LitElement & PanelProps> = []
const draft: Record<string, unknown> = { note: '本地预览' }
const artifacts = previewQuery.has('artifacts')
function renderDraft() {
    document.querySelector('#draft')!.textContent = JSON.stringify(draft, null, 2)
    document.querySelector('#draft-count')!.textContent = Object.keys(draft).length + ' 个字段'
    document.querySelector('#readonly')!.setAttribute('aria-pressed', String(readOnly))
}
function settings() {
    return {
        values: { ...draft },
        readOnly,
        ...(readOnly
            ? {}
            : {
                  onFieldChange: (name: string, value: unknown) => {
                      if (value === undefined) delete draft[name]
                      else draft[name] = value
                      pushSettings()
                  },
              }),
    }
}
/** 把宿主草稿重新下发给设置面板并刷新详情中的草稿。 */
function pushSettings() {
    for (const element of elements)
        if (element.surface === 'settings') element.settings = settings()
    renderDraft()
}
/** 取消设置抽屉时恢复打开前的宿主草稿；保存只关闭抽屉，不另开保存链路。 */
function restoreSettings() {
    if (!settingsSnapshot) return
    for (const key of Object.keys(draft)) delete draft[key]
    Object.assign(draft, settingsSnapshot)
    pushSettings()
}
async function mount() {
    const turn = ++sequence
    delete app.dataset.mounted
    const manifestResponse = await fetch('/__lowcode/' + encodeURIComponent(active) + '/manifest')
    const manifest = (await manifestResponse.json()) as PreviewPanels & { error?: string }
    if (!manifestResponse.ok) throw new Error(manifest.error ?? '面板清单读取失败')
    if (turn !== sequence) return
    panels = manifest
    const selected = pane ?? 'business'
    if (panels[selected].renderer === 'puck') {
        navigatePanel(selected, 'puck', true)
        return
    }
    const input = fixtures['../../nodes/' + active + '/fixtures/input.json']!.default
    if (current) previous.push(current)
    current = createFixture(input, scene === 'empty', scene === 'error', previewFor(active))
    bindHostFixture()
    renderDetails()
    const fixture = current
    const classes = await Promise.all(
        (['settings', 'business'] as const).map(async (surface) => {
            const descriptor = manifest[surface]
            if (descriptor.renderer === 'puck') return null
            if (!artifacts) {
                const source = sources['../../nodes/' + active + '/' + descriptor.entry]
                if (!source) throw new Error('清单中的 Lit 入口未被预览加载：' + descriptor.entry)
                return (await source()).default
            }
            const response = await fetch('/__artifact/' + active + '/' + surface)
            if (!response.ok) throw new Error('请先 npm run build')
            const { compiled } = (await response.json()) as { compiled: string }
            const lit = await import('lit')
            const module = { exports: {} as { default: typeof LitElement } }
            new Function('require', 'module', 'exports', compiled)(
                (name: string) => {
                    if (name !== 'lit') throw new Error(name)
                    return lit
                },
                module,
                module.exports,
            )
            if (!(module.exports.default.prototype instanceof lit.LitElement))
                throw new Error('产物默认导出不是 LitElement 子类')
            return module.exports.default
        }),
    )
    if (turn !== sequence) return
    for (const element of elements) element.remove()
    elements.length = 0
    classes.forEach((Panel, index) => {
        const surface = index === 0 ? 'settings' : 'business'
        if (!Panel) {
            document.querySelector('#' + surface)!.replaceChildren()
            return
        }
        // Each mount gets its own subclass: separate frozen bundles never share a fixed tag.
        const tag = 'mf-preview-' + surface + '-' + turn
        customElements.define(tag, class extends Panel {})
        const element = document.createElement(tag) as LitElement & PanelProps
        Object.assign(element, {
            sdk: fixture.sdk,
            context: fixture.context,
            surface,
            settings: surface === 'settings' ? settings() : undefined,
            nodeView:
                fixture.nodeView.composition.projection.status === 'ready'
                    ? fixture.nodeView.composition.projection.nodeView
                    : null,
            nodeOutput: fixture.nodeView.nodeOutput,
            target: {
                nodeCode: active,
                runId: 'preview-run',
                nodeInstanceId: 'preview-node',
                view: 'current',
            },
            ui: {},
        })
        document.querySelector('#' + surface)!.replaceChildren(element)
        elements.push(element)
    })
    if (pane === 'settings' && settingsSnapshot === null) settingsSnapshot = { ...draft }
    renderDraft()
    await Promise.all(elements.map((element) => element.updateComplete))
    if (turn === sequence) app.dataset.mounted = String(turn)
}
for (const code of codes) {
    const button = document.createElement('button')
    const meta = metaFor(code)
    // 可访问名称保持节点 code，回归测试按 code 精确定位；可见文字同时包含名称与 code。
    button.dataset.code = code
    button.setAttribute('aria-label', code)
    button.title = meta.name
    for (const [className, text] of [
        ['nav-icon', Array.from(meta.name)[0] ?? ''],
        ['nav-name', meta.name],
        ['nav-code', code],
    ])
        button.append(element('span', text, className))
    button.onclick = () => {
        active = code
        void mount()
    }
    document.querySelector('#nodes')!.append(button)
}
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-scene]'))
    button.onclick = () => {
        scene = button.dataset.scene!
        void mount()
    }
document.querySelector<HTMLButtonElement>('#readonly')!.onclick = () => {
    readOnly = !readOnly
    current?.setReadOnly(readOnly)
    hostActions.hostUpdate()
    renderHostActions()
    pushSettings()
}
document.querySelector<HTMLButtonElement>('#open-settings')!.onclick = () => openDrawer('settings')
document.querySelector<HTMLButtonElement>('#open-business')!.onclick = () => openDrawer('business')
document.querySelector<HTMLButtonElement>('#settings-cancel')!.onclick = () => {
    restoreSettings()
    openDrawer(null)
}
document.querySelector<HTMLButtonElement>('#settings-save')!.onclick = () => openDrawer(null)
document.querySelector<HTMLButtonElement>('#replace')!.onclick = () => {
    if (current) previous.push(current)
    current = createFixture(
        fixtures['../../nodes/' + active + '/fixtures/input.json']!.default,
        false,
        false,
        previewFor(active),
    )
    bindHostFixture()
    for (const element of elements) element.sdk = current.sdk
}
renderDrawer()
// Local test observability; this module is never part of a platform bundle.
Object.assign(window, {
    preview: {
        get current() {
            return current
        },
        get previous() {
            return previous
        },
        get elements() {
            return elements
        },
        unmount() {
            hostUnsubscribe?.()
            hostUnsubscribe = undefined
            hostActions.hostDisconnected()
            elements.forEach((e) => e.remove())
        },
    },
})
void mount().catch((error) => {
    app.textContent = String(error)
    throw error
})
