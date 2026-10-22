import { LitElement } from 'lit'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type {
  PanelProps,
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
} from '@mofang/contracts/browser'
/** No network, refresh loop, store or duplicated SDK. Subscription only. */
export class ContextController implements ReactiveController {
  private sdk: MofangSDK | undefined
  private unsubscribe: (() => void) | undefined
  constructor(
    private host: ReactiveControllerHost,
    private resolve: () => MofangSDK | undefined,
  ) {
    host.addController(this)
  }
  hostConnected() {
    this.bind()
  }
  hostUpdate() {
    this.bind()
  }
  hostDisconnected() {
    this.unsubscribe?.()
    this.unsubscribe = undefined
    this.sdk = undefined
  }
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
  constructor(
    private host: ReactiveControllerHost,
    private resolve: () => { sdk: MofangSDK | undefined; target: PanelTarget | undefined },
  ) {
    host.addController(this)
  }
  hostConnected() {
    this.bind()
  }
  hostUpdate() {
    this.bind()
  }
  hostDisconnected() {
    this.unsubscribe?.()
    this.unsubscribe = undefined
    this.store = undefined
    this.sdk = undefined
    this.key = ''
  }
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
/** The host registers the final panel class, including separate historical versions. */
export class HostPanel extends LitElement implements PanelProps {
  static override properties = {
    sdk: { attribute: false },
    mofangsdk: { attribute: false },
    context: { attribute: false },
    target: { attribute: false },
    ui: { attribute: false },
    surface: { attribute: false },
    settings: { attribute: false },
    panelContext: { attribute: false },
    nodeView: { attribute: false },
    nodeOutput: { attribute: false },
  }
  declare sdk: MofangSDK | undefined
  declare mofangsdk: MofangSDK | undefined
  declare context: NodeContext | null | undefined
  declare target: PanelTarget | undefined
  declare ui: PanelUI | undefined
  declare surface: PanelSurface | undefined
  declare settings: SettingsPanelEditor | undefined
  declare panelContext: PanelHostContext | undefined
  declare nodeView: JSONObject | null | undefined
  declare nodeOutput: NodeCandidatePage | null | undefined
  protected readonly contextResource = new ContextController(this, () => this.sdk)
}
