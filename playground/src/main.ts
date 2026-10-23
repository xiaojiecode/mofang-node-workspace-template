import type { LitElement } from 'lit'
import type { PanelProps, JSONObject, NodeView } from '@mofang/contracts/browser'
import { createFixture } from './fixture'
import './style.css'
const sources = import.meta.glob<{ default: typeof LitElement }>('../../nodes/*/{settings,view}.ts')
const fixtures = import.meta.glob<{ default: JSONObject }>('../../nodes/*/fixtures/input.json', {
    eager: true,
})
const previews = import.meta.glob<{ default: Partial<NodeView> }>(
    '../../nodes/*/fixtures/preview.json',
    { eager: true },
)
const previewFor = (code: string) =>
    previews['../../nodes/' + code + '/fixtures/preview.json']?.default ?? {}
const codes = Object.keys(fixtures)
    .map((key) => key.split('/')[3]!)
    .sort()
const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML =
    '<header><h1>节点开发预览</h1><p>本地 fixture · 查看双面板、共享组件和宿主草稿交互</p></header><nav id="nodes" aria-label="节点"></nav><div class="toolbar"><button data-scene="ready">有商品</button><button data-scene="empty">空结果</button><button data-scene="error">读取失败</button><button id="readonly">切换只读</button><button id="replace">替换 SDK</button><span id="mode"></span></div><main><section><h2>设置面板</h2><div id="settings" class="panel"></div></section><section><h2>业务面板</h2><div id="business" class="panel"></div></section></main><aside><h2>宿主草稿</h2><pre id="draft"></pre></aside>'
let active = codes[0]!,
    scene = 'ready',
    readOnly = false,
    sequence = 0
let current: ReturnType<typeof createFixture> | undefined
const previous: ReturnType<typeof createFixture>[] = []
const elements: Array<LitElement & PanelProps> = []
const draft: Record<string, unknown> = { note: '本地预览' }
const artifacts = new URLSearchParams(location.search).has('artifacts')
function renderDraft() {
    document.querySelector('#draft')!.textContent = JSON.stringify(draft, null, 2)
    document.querySelector('#mode')!.textContent = readOnly ? '只读' : '可编辑'
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
                      for (const element of elements)
                          if (element.surface === 'settings') element.settings = settings()
                      renderDraft()
                  },
              }),
    }
}
async function mount() {
    const turn = ++sequence
    delete app.dataset.mounted
    const input = fixtures['../../nodes/' + active + '/fixtures/input.json']!.default
    if (current) previous.push(current)
    current = createFixture(input, scene === 'empty', scene === 'error', previewFor(active))
    const fixture = current
    const classes = await Promise.all(
        ['settings', 'business'].map(async (surface) => {
            if (!artifacts)
                return (
                    await sources[
                        '../../nodes/' +
                            active +
                            '/' +
                            (surface === 'settings' ? 'settings' : 'view') +
                            '.ts'
                    ]!()
                ).default
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
        // Each mount gets its own subclass: separate frozen bundles never share a fixed tag.
        const tag = 'mf-preview-' + surface + '-' + turn
        customElements.define(tag, class extends Panel {})
        const element = document.createElement(tag) as LitElement & PanelProps
        Object.assign(element, {
            sdk: fixture.sdk,
            context: fixture.context,
            surface,
            settings: surface === 'settings' ? settings() : undefined,
            nodeView: fixture.nodeView.nodeView,
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
    renderDraft()
    await Promise.all(elements.map((element) => element.updateComplete))
    if (turn === sequence) app.dataset.mounted = String(turn)
}
for (const code of codes) {
    const button = document.createElement('button')
    button.textContent = code
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
    for (const element of elements)
        if (element.surface === 'settings') element.settings = settings()
    renderDraft()
}
document.querySelector<HTMLButtonElement>('#replace')!.onclick = () => {
    if (current) previous.push(current)
    current = createFixture(
        fixtures['../../nodes/' + active + '/fixtures/input.json']!.default,
        false,
        false,
        previewFor(active),
    )
    for (const element of elements) element.sdk = current.sdk
}
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
            elements.forEach((e) => e.remove())
        },
    },
})
void mount().catch((error) => {
    app.textContent = String(error)
    throw error
})
