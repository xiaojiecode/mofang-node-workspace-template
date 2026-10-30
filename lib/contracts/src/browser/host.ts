import type {
    ContextRequestOptions,
    MofangSDK,
    NodeContext,
    NodeCandidatePage,
    JSONObject,
    PanelSurface,
    SettingsPanelEditor,
    RecordSdkFactory,
} from './sdk/index'
export type PanelTarget = ContextRequestOptions & Readonly<{ nodeCode: string }>
/** 宿主提供的节点标题信息，不包含执行状态或业务投影。 */
export type PanelNodeIdentity = Readonly<{
    name: string
    description: string
    iconUrl: string
    kind?: 'agent' | 'code'
}>
export type PanelUI = Readonly<{
    onClose?: () => void
    onOpenSettings?: () => void
    onSelectTask?: (task: { taskId: string; nodeRunId?: string }) => void
    fullscreen?: boolean
    onToggleFullscreen?: () => void
}>
export type PanelHostContext = Readonly<{
    target: PanelTarget
    sdk?: MofangSDK
    ui: PanelUI
    surface: PanelSurface
    settings?: SettingsPanelEditor
    nodeView?: JSONObject | null
    nodeOutput?: NodeCandidatePage | null
    panelError?: string
    createRecordSdk?: RecordSdkFactory
    node?: PanelNodeIdentity
}>
export interface PanelProps {
    sdk?: MofangSDK | undefined
    mofangsdk?: MofangSDK | undefined
    context?: NodeContext | null | undefined
    node?: PanelNodeIdentity | undefined
    target?: PanelTarget | undefined
    ui?: PanelUI | undefined
    surface?: PanelSurface | undefined
    settings?: SettingsPanelEditor | undefined
    panelContext?: PanelHostContext | undefined
    nodeView?: JSONObject | null | undefined
    nodeOutput?: NodeCandidatePage | null | undefined
    panelError?: string | undefined
    createRecordSdk?: RecordSdkFactory | undefined
}
