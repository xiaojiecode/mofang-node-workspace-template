import { LitElement } from 'lit'
import type { ReactiveController, ReactiveControllerHost, PropertyDeclarations } from 'lit'
import type {
    PanelProps,
    PanelNodeIdentity,
    MofangSDK,
    NodeContext,
    NodeFlowState,
    PanelTarget,
    SettingsPanelEditor,
    PanelUI,
    PanelSurface,
    PanelHostContext,
    JSONObject,
    NodeCandidatePage,
    RecordSdkFactory,
} from '@mofang/contracts/browser'
/** 订阅宿主的执行上下文；不另建 SDK、网络连接、刷新循环或业务存储。 */
export class ContextController implements ReactiveController {
    private sdk: MofangSDK | undefined
    private unsubscribe: (() => void) | undefined
    /**
     * 登记 Lit 控制器或初始化本地状态。构造阶段不发起业务请求，
     * 依赖宿主注入的 SDK、运行身份与权限在连接/更新阶段读取。
     */
    constructor(
        private host: ReactiveControllerHost,
        private resolve: () => MofangSDK | undefined,
    ) {
        host.addController(this)
    }
    /**
     * Lit 将宿主接入页面时调用，绑定当前 SDK 与目标的订阅。
     * 重新挂载也会触发，因此绑定前必须核对身份，不能重复注册同一份监听。
     */
    hostConnected() {
        this.bind()
    }
    /**
     * Lit 更新属性时核对 SDK 和目标身份；只有实际改变时才重新绑定。
     * 订阅通知只请求渲染，不在每次更新中主动刷新远端数据。
     */
    hostUpdate() {
        this.bind()
    }
    /**
     * 宿主卸载时释放订阅并清理本地引用；再次挂载时从当前注入属性重新绑定。
     */
    hostDisconnected() {
        this.unsubscribe?.()
        this.unsubscribe = undefined
        this.sdk = undefined
    }
    /**
     * 比较当前 SDK 实例，变化时解除旧上下文订阅，再订阅新 SDK。
     * 具体执行身份由 SDK 的 context 维护；通知只请求渲染，不在这里主动拉取数据。
     */
    private bind() {
        const next = this.resolve()
        if (next === this.sdk) return
        this.hostDisconnected()
        this.sdk = next
        this.unsubscribe = next?.context.subscribe(() => this.host.requestUpdate())
    }
    get state() {
        return this.sdk?.context.getState()
    }
}
export class NodeFlowController implements ReactiveController {
    private key = ''
    private sdk: MofangSDK | undefined
    private unsubscribe: (() => void) | undefined
    private store: ReturnType<MofangSDK['nodeFlow']['watch']> | undefined
    /**
     * 登记 Lit 控制器或初始化本地状态。构造阶段不发起业务请求，
     * 依赖宿主注入的 SDK、运行身份与权限在连接/更新阶段读取。
     */
    constructor(
        private host: ReactiveControllerHost,
        private resolve: () => { sdk: MofangSDK | undefined; target: PanelTarget | undefined },
    ) {
        host.addController(this)
    }
    /**
     * Lit 将宿主接入页面时调用，绑定当前 SDK 与目标的订阅。
     * 重新挂载也会触发，因此绑定前必须核对身份，不能重复注册同一份监听。
     */
    hostConnected() {
        this.bind()
    }
    /**
     * Lit 更新属性时核对 SDK 和目标身份；只有实际改变时才重新绑定。
     * 订阅通知只请求渲染，不在每次更新中主动刷新远端数据。
     */
    hostUpdate() {
        this.bind()
    }
    /**
     * 宿主卸载时释放订阅并清理本地引用；再次挂载时从当前注入属性重新绑定。
     */
    hostDisconnected() {
        this.unsubscribe?.()
        this.unsubscribe = undefined
        this.store = undefined
        this.sdk = undefined
        this.key = ''
    }
    /**
     * 比较当前 SDK 与目标标识，变化时先解除旧绑定，再订阅对应资源。
     * 不创建 SDK、HTTP transport 或 SSE，也不把另一节点/历史修订的缓存当作当前数据。
     */
    private bind() {
        const { sdk, target } = this.resolve()
        const key = JSON.stringify([target?.runId, target?.nodeInstanceId, target?.view])
        if (sdk === this.sdk && key === this.key) return
        this.hostDisconnected()
        this.sdk = sdk
        this.key = key
        if (!sdk || !target?.runId || !target.nodeInstanceId || target.view === 'preview') return
        this.store = sdk.nodeFlow.watch({
            runId: target.runId,
            nodeInstanceId: target.nodeInstanceId,
            view: target.view === 'history' ? 'history' : 'current',
        })
        this.unsubscribe = this.store.subscribe(() => this.host.requestUpdate())
    }
    get state(): NodeFlowState | undefined {
        return this.store?.getSnapshot()
    }
}
/** 宿主负责注册最终面板类，并为历史修订保留独立实例；这里声明可注入的响应式属性。 */
export class HostPanel extends LitElement implements PanelProps {
    static override properties: PropertyDeclarations = {
        sdk: { attribute: false },
        mofangsdk: { attribute: false },
        context: { attribute: false },
        node: { attribute: false },
        target: { attribute: false },
        ui: { attribute: false },
        surface: { attribute: false },
        settings: { attribute: false },
        panelContext: { attribute: false },
        panelError: { attribute: false },
        createRecordSdk: { attribute: false },
        nodeView: { attribute: false },
        nodeOutput: { attribute: false },
    }
    declare sdk: MofangSDK | undefined
    declare mofangsdk: MofangSDK | undefined
    declare context: NodeContext | null | undefined
    declare node: PanelNodeIdentity | undefined
    declare target: PanelTarget | undefined
    declare ui: PanelUI | undefined
    declare surface: PanelSurface | undefined
    declare settings: SettingsPanelEditor | undefined
    declare panelContext: PanelHostContext | undefined
    declare panelError: string | undefined
    declare createRecordSdk: RecordSdkFactory | undefined
    declare nodeView: JSONObject | null | undefined
    declare nodeOutput: NodeCandidatePage | null | undefined
    protected readonly contextResource = new ContextController(this, () => this.sdk)
}
