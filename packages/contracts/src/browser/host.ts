import type {
  ContextRequestOptions,
  MofangSDK,
  NodeContext,
  NodeCandidatePage,
  JSONObject,
  PanelSurface,
  SettingsPanelEditor,
} from './sdk/index'
export type PanelTarget = ContextRequestOptions & Readonly<{ nodeCode: string }>
export type PanelUI = Readonly<{
  onClose?: () => void
  onOpenSettings?: () => void
  onSelectTask?: (task: { taskId: string; nodeRunId?: string }) => void
}>
export type PanelHostContext = Readonly<{
  target: PanelTarget
  sdk?: MofangSDK
  ui: PanelUI
  surface: PanelSurface
  settings?: SettingsPanelEditor
  nodeView?: JSONObject | null
  nodeOutput?: NodeCandidatePage | null
}>
export interface PanelProps {
  sdk?: MofangSDK | undefined
  mofangsdk?: MofangSDK | undefined
  context?: NodeContext | null | undefined
  target?: PanelTarget | undefined
  ui?: PanelUI | undefined
  surface?: PanelSurface | undefined
  settings?: SettingsPanelEditor | undefined
  panelContext?: PanelHostContext | undefined
  nodeView?: JSONObject | null | undefined
  nodeOutput?: NodeCandidatePage | null | undefined
}
