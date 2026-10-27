import type { SettingsPanelEditor } from '../mofangsdk/core';
/** 只编辑映射表单草稿；保存仍由工作流外壳负责。 */
export declare function PuckSettingsBridge({ settings, formId }: {
    settings: SettingsPanelEditor;
    formId?: string;
}): null;
