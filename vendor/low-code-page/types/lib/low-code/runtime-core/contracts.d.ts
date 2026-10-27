export type JsonValue = null | boolean | number | string | JsonValue[] | {
    [key: string]: JsonValue;
};
export type ValueRef = ({
    from: 'constant';
    value: JsonValue;
} | {
    from: 'object';
    entries: Record<string, ValueRef>;
} | {
    from: 'array';
    items: ValueRef[];
} | {
    from: 'form' | 'forms' | 'page' | 'row' | 'dialog' | 'host' | 'output' | 'result';
    path?: string[];
    formId?: string;
} | {
    from: 'source';
    sourceId: string;
    path?: string[];
} | {
    from: 'table';
    tableId: string;
    path?: string[];
}) & {
    fallback?: JsonValue;
    valueType?: string;
};
export type DataSourceDefinition = {
    id: string;
    name?: string;
    kind: 'local' | 'http' | 'host';
    operation: 'query' | 'mutation';
    data?: JsonValue;
    hostKey?: string;
    request?: {
        mode?: 'connection' | 'url';
        url?: string;
        connectionId?: string;
        method?: string;
        path?: string;
        query?: Record<string, ValueRef>;
        body?: Record<string, ValueRef>;
        headers?: Record<string, ValueRef>;
        timeoutMs?: number;
    };
    params?: Record<string, ValueRef>;
    filters?: {
        path: string[];
        value: ValueRef;
        ignore?: JsonValue[];
    }[];
    result?: {
        path?: string[];
        errorPath?: string[];
        successPath?: string[];
        successValue?: JsonValue;
        transformScriptId?: string;
    };
    trigger?: {
        mode: 'initial' | 'dependency' | 'manual';
        dependsOn?: string[];
        requireNonEmpty?: string[];
    };
};
export type BindingDefinition = {
    nodeId: string;
    property: string;
    value: ValueRef;
    map?: {
        label: string;
        value: string;
        description?: string;
        disabled?: string;
        hidden?: string;
        disabledReason?: string;
        group?: string;
    };
};
export type ComparisonCondition = {
    operator: 'equals' | 'notEquals' | 'contains' | 'empty' | 'notEmpty' | 'gt' | 'lt';
    left: ValueRef;
    right?: ValueRef;
};
export type Condition = ComparisonCondition | {
    operator: 'all' | 'any';
    conditions: Condition[];
} | {
    operator: 'not';
    condition: Condition;
};
export type RuleDefinition = Partial<ComparisonCondition> & {
    id: string;
    targetId: string;
    property: 'visible' | 'disabled' | 'required';
    conditions?: Condition[];
    combinator?: 'all' | 'any';
    scriptId?: string;
    condition?: Condition;
};
export type ActionStep = {
    id: string;
    disabled?: boolean;
    when?: Condition;
} & ({
    type: 'field.set' | 'page.set' | 'dialog.set';
    field: string;
    value: ValueRef;
    valueScriptId?: string;
} | {
    type: 'field.clear';
    field: string;
} | {
    type: 'form.reset';
    fields?: string[];
    formId?: string;
    scope?: 'form' | 'dialog';
} | {
    type: 'form.validate';
    fields?: string[];
    formId?: string;
    scope?: 'form' | 'dialog';
} | {
    type: 'dataSource.call';
    sourceId: string;
    params?: Record<string, ValueRef>;
    assignTo?: string;
} | {
    type: 'dialog.open';
    targetId: string;
    mode?: 'replace' | 'stack';
    input?: Record<string, ValueRef>;
    formId?: string;
    defaults?: Record<string, JsonValue>;
} | {
    type: 'dialog.close';
    targetId: string;
} | {
    type: 'query.refresh';
    sourceId: string;
} | {
    type: 'script.run';
    scriptId: string;
    input?: Record<string, ValueRef>;
    inputValue?: ValueRef;
    assignTo?: string;
} | {
    type: 'host.action';
    actionId: string;
    input?: Record<string, ValueRef>;
    inputValue?: ValueRef;
    formId?: string;
    saveForm?: boolean;
    assignTo?: string;
} | {
    type: 'feedback';
    message: ValueRef;
});
export type EventDefinition = {
    id: string;
    nodeId: string;
    event: string;
    steps: ActionStep[];
    onError?: ActionStep[];
    scope?: {
        formId?: string;
        dialogId?: string;
        tableId?: string;
    };
};
export type ScriptDefinition = {
    id: string;
    name?: string;
    type: 'compute' | 'validate' | 'transform' | 'event';
    version: number;
    source: string;
    input?: string[];
    output?: string[];
    dependencies?: string[];
    serviceVersions?: Record<string, string>;
    timeoutMs?: number;
};
export type FieldDefinition = {
    type: string;
    id?: string;
    name?: string;
    formId?: string;
    label?: string;
    description?: string;
    readOnly?: boolean;
    clearable?: boolean;
    onChange?: string;
    submitWhenHidden?: boolean;
    options?: {
        label: string;
        value: JsonValue;
        disabled?: boolean;
        hidden?: boolean;
        description?: string;
    }[];
    optionsSource?: ValueRef;
    optionMapping?: Partial<NonNullable<BindingDefinition['map']>>;
    defaultValue?: JsonValue;
    required?: boolean;
    requiredMessage?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    validationMessage?: string;
    clearOnChange?: string[];
    nodeId?: string;
    validateScriptId?: string;
};
export type RuntimeDefinition = {
    logicVersion: 2;
    fields?: Record<string, FieldDefinition>;
    pageVariables?: Record<string, JsonValue>;
    sources: DataSourceDefinition[];
    bindings: BindingDefinition[];
    rules: RuleDefinition[];
    events: EventDefinition[];
    scripts: ScriptDefinition[];
};
/** 页面包完整声明；独立核心仍可省略空字段和变量集合。 */
export type LogicDefinition = RuntimeDefinition & {
    fields: Record<string, FieldDefinition>;
    pageVariables: Record<string, JsonValue>;
};
export type SourceDefinition = DataSourceDefinition;
export type ActionStepDefinition = ActionStep;
export type SourceState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: JsonValue;
    error?: string;
    requestId: number;
};
export type LogEntry = {
    instanceId: string;
    batchId: string;
    kind: string;
    id: string;
    status: string;
    time: number;
    duration?: number;
    detail?: string;
};
export type RuntimeSnapshot = {
    form: Record<string, JsonValue>;
    forms?: Record<string, Record<string, JsonValue>>;
    scope?: {
        formId?: string;
        dialogId?: string;
        tableId?: string;
    };
    page: Record<string, JsonValue>;
    row: JsonValue;
    dialog: Record<string, JsonValue>;
    /** Suspended parent dialogs, outermost first; dialog is the active top. */
    dialogStack?: Record<string, JsonValue>[];
    host: Record<string, JsonValue>;
    sources: Record<string, SourceState>;
    tables: Record<string, JsonValue>;
    output?: Record<string, JsonValue>;
    result?: JsonValue;
    logs: LogEntry[];
    busy: Record<string, boolean>;
    errors: Record<string, string>;
};
export type RequestContext = {
    params: Record<string, unknown>;
    signal: AbortSignal;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
    headers?: Record<string, unknown>;
};
export type RequestHandler = (source: DataSourceDefinition, request: RequestContext) => Promise<unknown>;
export type ScriptCapability = (method: string, args: JsonValue[]) => Promise<JsonValue>;
export type ScriptRunner = (script: ScriptDefinition, input: unknown, signal: AbortSignal, capability?: ScriptCapability, lifecycle?: {
    services?: import('../runtime-services').RuntimeServices;
    onRetain?: (dispose: () => void) => void;
    onError?: (error: Error) => void;
    invokeService?: import('../runtime-services').RuntimeServiceInterceptor;
}) => Promise<JsonValue>;
export declare const emptyRuntimeDefinition: () => RuntimeDefinition;
