import {
    Component,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from 'react'
import { createRoot } from 'react-dom/client'
import { PageRenderer, PreviewEnvironment, useRuntime } from '@mofang/low-code-page/runtime'
import type { HostAdapter, PagePackage, Values } from '@mofang/low-code-page/schema'
import { createPuckPanelHost, resolveSettingsFormId, jsonValues } from '@mofang/workflow-lowcode'
import type { PuckPanelHostProps } from '@mofang/workflow-lowcode'
import { PuckSettingsBridge } from '@mofang/workflow-lowcode/react'
import type { JSONObject, NodeView } from '@mofang/contracts/browser'
import { createFixture } from './fixture'
import '@mofang/low-code-page/style.css'
import './lowcode-preview.css'

type Document = {
    key: string
    revision: string
    definition: PagePackage
    fixture: Partial<NodeView>
    input: JSONObject
}
const params = new URLSearchParams(location.search)
const code = params.get('node') ?? ''
const initialSurface = params.get('surface') === 'settings' ? 'settings' : 'business'
const toastEvent = (message: string) =>
    window.dispatchEvent(new CustomEvent('lowcode:toast', { detail: message }))

class PreviewBoundary extends Component<{ children: ReactNode }, { error: string }> {
    override state = { error: '' }
    static getDerivedStateFromError(error: Error) {
        return { error: error.message }
    }
    override render() {
        return this.state.error ? (
            <p role="alert">预览无法渲染：{this.state.error}。请让 AI 修正页面配置后重试。</p>
        ) : (
            this.props.children
        )
    }
}
function SettingsActions({
    formId,
    readOnly,
    save,
    cancel,
}: {
    formId: string
    readOnly: boolean
    save: () => void
    cancel: () => void
}) {
    const runtime = useRuntime()
    return (
        <div className="lowcode-actions">
            <button
                disabled={readOnly}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                    if (runtime.validate(formId)) save()
                    else toastEvent('请先修正表单中的错误')
                }}
            >
                保存模拟配置
            </button>
            <button
                disabled={readOnly}
                onMouseDown={(event) => event.preventDefault()}
                onClick={cancel}
            >
                取消配置修改
            </button>
        </div>
    )
}

function PreviewPanel({
    document,
    surface,
    scene,
    readOnly,
}: {
    document: Document
    surface: 'settings' | 'business'
    scene: string
    readOnly: boolean
}) {
    const fixture = useMemo(
        () => createFixture(document.input, scene === 'empty', scene === 'error', document.fixture),
        [document, scene],
    )
    const [values, setValues] = useState<Values>(() => jsonValues(document.input))
    const [saved, setSaved] = useState<Values>(() => jsonValues(document.input))
    const [outcome, setOutcome] = useState('')
    const [busy, setBusy] = useState(false)
    useEffect(() => fixture.setReadOnly(readOnly), [fixture, readOnly])
    const store = useMemo(
        () => fixture.sdk.nodeFlow.watch({ runId: 'preview-run', nodeInstanceId: 'preview-node' }),
        [fixture],
    )
    const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot)
    const sdk = useMemo(
        () =>
            new Proxy(fixture.sdk, {
                get(target, key) {
                    if (key === 'subscribe')
                        return (listener: () => void) => {
                            fixture.listeners.add(listener)
                            return () => fixture.listeners.delete(listener)
                        }
                    if (key === 'toast')
                        return {
                            success: async (message: string) => toastEvent(message),
                            error: async (message: string) => toastEvent(message),
                            info: async (message: string) => toastEvent(message),
                            warning: async (message: string) => toastEvent(message),
                        }
                    return Reflect.get(target, key)
                },
            }) as unknown as NonNullable<PuckPanelHostProps['sdk']>,
        [fixture],
    )
    const settings = useMemo(
        () => ({
            values,
            readOnly,
            onFieldChange: (name: string, value: unknown) => {
                if (readOnly) return
                setValues((before) => {
                    const next = { ...before }
                    if (value === undefined) delete next[name]
                    else next[name] = value as Values[string]
                    return next
                })
            },
        }),
        [values, readOnly],
    )
    const host = useMemo<HostAdapter>(() => {
        const base = createPuckPanelHost({
            sdk,
            target: {
                nodeCode: code,
                runId: 'preview-run',
                nodeInstanceId: 'preview-node',
                view: readOnly ? 'history' : 'current',
            },
            surface,
            lowcode: {
                rendererKey: 'puck',
                config: document.definition as unknown as PuckPanelHostProps['lowcode']['config'],
            },
            ...(surface === 'settings' ? { settings } : {}),
        })
        const call = base.call
        return {
            ...base,
            instanceKey: `${document.key}:${document.revision}:${readOnly}:${scene}`,
            request: async (source) => {
                if (source.kind === 'host')
                    return structuredClone(base.context?.[source.hostKey ?? source.id] ?? null)
                throw new Error('本地预览未配置真实 HTTP；请为数据源提供模拟数据')
            },
            call: async (name, input, signal) => {
                try {
                    const result = await call(name, input, signal)
                    if (name === 'workflow.nodeAction.run')
                        setOutcome('模拟动作已应用；未进行真实采集或发布')
                    return result
                } catch (error) {
                    toastEvent(String(error))
                    throw error
                }
            },
        }
    }, [sdk, surface, document, settings, readOnly, scene])
    const projection = snapshot.data?.composition.projection
    const required =
        projection?.status === 'ready'
            ? projection.actions.filter((action) => action.presentation === 'host')
            : []
    const perform = async (name: string) => {
        if (busy || readOnly || !snapshot.data) return
        setBusy(true)
        try {
            await host.call(
                'workflow.nodeAction.run',
                {
                    runId: 'preview-run',
                    nodeInstanceId: 'preview-node',
                    name,
                    payload: {},
                    candidates: [],
                    expectedSessionRevision: snapshot.data.composition.snapshot.sessionRevision,
                },
                new AbortController().signal,
            )
            setOutcome('模拟动作已应用；已有候选仍按节点合同处理')
        } catch (error) {
            toastEvent(String(error))
        } finally {
            setBusy(false)
        }
    }
    return (
        <>
            <fieldset
                disabled={readOnly}
                className="mf-low-code-surface"
                style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}
            >
                {snapshot.error && surface === 'business' ? (
                    <p role="status">模拟读取失败。切回“正常”场景重试，原操作不会重发。</p>
                ) : (
                    <PreviewEnvironment>
                        <PageRenderer definition={document.definition} host={host}>
                            {surface === 'settings' && (
                                <PuckSettingsBridge
                                    settings={settings}
                                    formId={resolveSettingsFormId(document.definition)}
                                />
                            )}
                            {surface === 'settings' && (
                                <SettingsActions
                                    formId={resolveSettingsFormId(document.definition)}
                                    readOnly={readOnly}
                                    save={() => {
                                        setSaved({ ...values })
                                        setOutcome(
                                            '已保存本轮模拟配置，没有写入页面源码或真实工作流',
                                        )
                                    }}
                                    cancel={() => {
                                        setValues({ ...saved })
                                        setOutcome('已恢复上次保存的模拟配置')
                                    }}
                                />
                            )}
                        </PageRenderer>
                    </PreviewEnvironment>
                )}
            </fieldset>
            <div className="lowcode-actions">
                {surface === 'business' &&
                    required.map((action) => (
                        <button
                            key={action.name}
                            title={
                                !action.availability.enabled
                                    ? action.availability.reason
                                    : action.description
                            }
                            disabled={readOnly || busy || !action.availability.enabled}
                            onClick={() => void perform(action.name)}
                        >
                            {action.label}
                        </button>
                    ))}
                <span role="status">{outcome}</span>
            </div>
            <details className="lowcode-detail">
                <summary>查看模拟运行结果</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(
                        surface === 'settings' ? values : snapshot.data?.nodeOutput,
                        null,
                        2,
                    )}
                </pre>
            </details>
        </>
    )
}

function App() {
    const [surface, setSurface] = useState<'settings' | 'business'>(initialSurface)
    const [scene, setScene] = useState(params.get('scene') ?? 'ready')
    const [readOnly, setReadOnly] = useState(params.get('readonly') === 'true')
    const [follow, setFollow] = useState(true)
    const [pending, setPending] = useState(false)
    const [document, setDocument] = useState<Document | null>(null)
    const [error, setError] = useState('')
    const [toast, setToast] = useState('')
    const load = useCallback(async () => {
        try {
            const manifestResponse = await fetch(`/__lowcode/${encodeURIComponent(code)}/manifest`)
            if (manifestResponse.ok) {
                const panels = await manifestResponse.json()
                if (panels[surface]?.renderer === 'lit') {
                    const next = new URLSearchParams(location.search)
                    next.set('surface', surface)
                    location.replace(`/index.html?${next}`)
                    return
                }
            }
            const response = await fetch(
                `/__lowcode/${encodeURIComponent(code)}/${surface}?artifacts=${params.has('artifacts')}`,
            )
            const data = await response.json()
            if (!response.ok) throw new Error(data.error)
            setDocument((previous) =>
                previous && previous.key === data.key && previous.revision === data.revision
                    ? previous
                    : data,
            )
            setError('')
            setPending(false)
        } catch (error) {
            setError(String(error))
        }
    }, [surface])
    useEffect(() => {
        setDocument(null)
        void load()
    }, [load])
    useEffect(() => {
        const changed = () => {
            if (follow) void load()
            else setPending(true)
        }
        import.meta.hot?.on('lowcode:changed', changed)
        return () => import.meta.hot?.off('lowcode:changed', changed)
    }, [follow, load])
    useEffect(() => {
        const receive = (event: Event) => setToast((event as CustomEvent<string>).detail)
        window.addEventListener('lowcode:toast', receive)
        return () => window.removeEventListener('lowcode:toast', receive)
    }, [])
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(''), 6000)
            return () => clearTimeout(timer)
        }
    }, [toast])
    return (
        <main className="lowcode-workspace">
            <header className="lowcode-toolbar">
                <h1 title={code}>低代码节点预览 · {code}</h1>
                <button
                    aria-pressed={surface === 'settings'}
                    onClick={() => setSurface('settings')}
                >
                    配置表单
                </button>
                <button
                    aria-pressed={surface === 'business'}
                    onClick={() => setSurface('business')}
                >
                    展示页面
                </button>
                <label>
                    场景{' '}
                    <select
                        aria-label="模拟场景"
                        value={scene}
                        onChange={(event) => setScene(event.target.value)}
                    >
                        <option value="ready">正常</option>
                        <option value="empty">空结果</option>
                        <option value="error">读取失败</option>
                    </select>
                </label>
                <button aria-pressed={readOnly} onClick={() => setReadOnly((value) => !value)}>
                    只读
                </button>
                <button aria-pressed={follow} onClick={() => setFollow((value) => !value)}>
                    跟随 AI 更新
                </button>
                {pending && <button onClick={() => void load()}>加载新版本（重置试填）</button>}
                {document && (
                    <span
                        className="lowcode-revision"
                        title={document.revision}
                        data-revision={document.revision}
                    >
                        {document.revision.slice(0, 10)}
                    </span>
                )}
            </header>
            <p className="lowcode-notice">
                Mock 交互预览：可以试填和点击，不能修改页面配置。调整页面请告诉
                AI；不会调用真实采集接口。AI 更新会重置本轮试填，可暂停跟随。
            </p>
            <section className="lowcode-panel">
                {error && (
                    <>
                        <p role="alert">{error}</p>
                        <button onClick={() => void load()}>重新读取</button>
                    </>
                )}
                {document ? (
                    <PreviewBoundary
                        key={`${document.key}:${document.revision}:${scene}:${readOnly}`}
                    >
                        <PreviewPanel
                            document={document}
                            surface={surface}
                            scene={scene}
                            readOnly={readOnly}
                        />
                    </PreviewBoundary>
                ) : (
                    !error && <p role="status">正在读取页面…</p>
                )}
            </section>
            {toast && (
                <div className="lowcode-toast" role="alert">
                    {toast}
                </div>
            )}
        </main>
    )
}
createRoot(document.getElementById('lowcode-root')!).render(<App />)
