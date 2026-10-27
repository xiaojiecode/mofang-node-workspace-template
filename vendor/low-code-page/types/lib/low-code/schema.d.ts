import type { Data } from '@puckeditor/core';
import type { CapabilityRegistry } from './runtime-core/capabilities';
import type { RuntimeServices } from './runtime-services';
export type { RuntimeService, RuntimeServiceMethod, RuntimeServices } from './runtime-services';
import type { JsonValue, LogicDefinition, RequestContext, RequestHandler, SourceDefinition } from './runtime-core/contracts';
export type { ValueRef as Binding, Condition, SourceDefinition as DataSourceDefinition, EventDefinition, ActionStep as EventStep, FieldDefinition, ScriptDefinition } from './runtime-core/contracts';
import type { ValueRef } from './runtime-core/contracts';
export type Json = JsonValue;
export type Values = Record<string, Json>;
export type SelectOption = {
    label: string;
    value: Json;
    disabled?: boolean;
    hidden?: boolean;
    description?: string;
};
export type OptionMapping = Partial<Record<'label' | 'value' | 'disabled' | 'hidden' | 'description' | 'disabledReason' | 'group', string>>;
export type ComponentAppearance = {
    height?: string;
    fontSize?: number;
    lineHeight?: string;
    fontWeight?: number;
    flexGrow?: number;
    flexShrink?: number;
    width?: string;
    maxWidth?: number;
    minHeight?: number;
    padding?: number;
    paddingTop?: number | string;
    paddingRight?: number | string;
    paddingBottom?: number | string;
    paddingLeft?: number | string;
    marginTop?: number | string;
    marginRight?: number | string;
    marginBottom?: number | string;
    marginLeft?: number | string;
    background?: 'default' | 'muted' | 'accent';
    backgroundColor?: string;
    backgroundGradient?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
    backgroundAttachment?: 'scroll' | 'fixed' | 'local';
    backgroundOrigin?: 'padding-box' | 'border-box' | 'content-box';
    backgroundClip?: 'padding-box' | 'border-box' | 'content-box';
    backgroundLayerOrder?: 'gradient-first' | 'image-first';
    backgroundBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
    border?: boolean;
    borderTopWidth?: number | string;
    borderRightWidth?: number | string;
    borderBottomWidth?: number | string;
    borderLeftWidth?: number | string;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
    color?: string;
    radius?: number;
    textAlign?: 'left' | 'center' | 'right';
};
export type ColumnDefinition = {
    id: string;
    title: string;
    width?: number;
    field?: string;
    actionLabel?: string;
    action?: string;
    eventId?: string;
    pin?: 'left' | 'right';
    valueBinding?: ValueRef;
    formatter?: 'text' | 'money' | 'badge';
    cellTemplateId?: string;
};
export type DialogDefinition = {
    id: string;
    title: string;
    content: Data;
    formId: string;
    initialBindings: Record<string, ValueRef>;
    width?: number;
    bodySpacing?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
};
/** 原生页面协议：逻辑仅由 logic 提供，不读取旧版顶层集合。 */
export type PagePackage = {
    schemaVersion: 2;
    engineVersion: '0.23.0';
    runtimeVersion: '2';
    materialsVersion: '1';
    styleVersion: '1';
    logicVersion: 2;
    pageId: string;
    title: string;
    page: Data;
    cells: Record<string, Data>;
    dialogs: Record<string, DialogDefinition>;
    logic: LogicDefinition;
    extensions?: {
        designSource?: {
            id: number;
            pageKey: string;
            version: number;
        };
        workflow?: {
            nodeCode: string;
            surface: 'settings' | 'runtime';
            settingsFormId?: string;
        };
        designerNames?: {
            counters: Record<string, number>;
            items: Record<string, {
                type: string;
                ordinal: number;
            }>;
        };
    };
};
export type RuntimeScope = {
    formId?: string;
    row?: Values;
    dialogId?: string;
    tableId?: string;
};
export type HostAdapter = {
    instanceKey: string;
    context: Values;
    designData?: Record<string, Json>;
    designRow?: Values;
    initialValues?: Record<string, Values>;
    request?: (source: SourceDefinition, context: RequestContext) => Promise<Json>;
    connections?: Record<string, string | RequestHandler>;
    /** 仅计算地址，不执行请求；函数连接未提供解析器时返回 undefined。 */
    resolveHttpUrl?: (source: SourceDefinition) => string | undefined;
    capabilities?: CapabilityRegistry;
    /** Runtime objects supplied by the host; never persisted in page JSON. */
    services?: RuntimeServices;
    /** 宿主声明动作可能更新的输出键；配置文件不能修改这份声明。 */
    actionOutputKeys?: Record<string, readonly string[]>;
    call: (actionId: string, input: Values, signal: AbortSignal) => Promise<Json>;
    subscribeContext?: (listener: () => void) => () => void;
    onLog?: (message: string, detail?: Json) => void;
};
export type SourceState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: Json;
    error?: string;
};
export type TableState = {
    total?: number;
    disabled?: boolean;
    pageChangeEventId?: string;
    pageSizeChangeEventId?: string;
    /** Consumed once after the first successful source load. */
    initialSelectionPending?: boolean;
    selectedIds: string[];
    page: number;
    pageSize: number;
};
export type DialogState = {
    instanceId: string;
    definitionId: string;
    row: Values;
    formId: string;
};
