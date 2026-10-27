import type { JSONObject } from '../mofangsdk/core/json-types';
import type { NodeCandidatePage } from '../mofangsdk/core/node-flow-types';
import type { LowcodePanelConfig, PanelSurface, SettingsPanelEditor } from '../mofangsdk/core/panel-types';
import type { ContextRequestOptions, MofangSDK } from '../mofangsdk/core/runtime-types';
/** 只依赖公开 SDK，不引入 frontend 登录、路由或业务控制器。 */
export type PuckPanelHostProps = Readonly<{
    target: ContextRequestOptions & {
        nodeCode: string;
    };
    sdk?: MofangSDK;
    surface: PanelSurface;
    lowcode: LowcodePanelConfig;
    settings?: SettingsPanelEditor;
    nodeView?: JSONObject | null;
    nodeOutput?: NodeCandidatePage | null;
}>;
