/** 节点目录和配置图的公共契约，与 HTTP 字段保持一致。 */
export type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue;
};
export type JsonObject = {
    [key: string]: JsonValue;
};
export type ParamType = 'string' | 'integer' | 'number' | 'boolean' | 'object' | 'array' | 'url' | 'image' | 'video' | 'product';
export type TypeSchema = {
    id: string;
    version: string;
    paramType: ParamType;
    title: string;
    description: string;
    schema: JsonObject;
    hash: string;
};
export type WorkflowNodeKind = 'agent' | 'code';
export type AgentExecutor = 'codex';
export type AgentSpec = {
    instructions: string;
    tools: string[];
    model: string;
    modelParamsJson: JsonValue;
    maxTurns: number;
    timeoutSeconds: number;
    executor: AgentExecutor;
};
export type WorkflowNode = {
    code: string;
    kind: WorkflowNodeKind;
    codeRuntime?: 'go' | 'goja';
    name: string;
    description: string;
    icon: string;
    category: string;
    inputSchema: JsonObject;
    outputSchema: JsonObject;
    startable: boolean;
    skippable: boolean;
    interactive: boolean;
    actions: string[];
    editable: boolean;
    agent?: AgentSpec;
    definitionHash: string;
    updatedAt: string;
    timeoutSeconds: number;
};
export type NodeSchedulingPolicy = {
    maxConcurrentExecutions: number;
    reviewPoint?: boolean;
};
export type GraphNode = {
    executionPolicy?: NodeSchedulingPolicy;
    key: string;
    code: string;
    /** 服务端实例身份；新建且尚未保存的节点没有此字段。 */
    nodeInstanceId?: string;
    /** Read-only digest of the instance's frozen execution definition. */
    definitionHash?: string;
    /** 只保存用户编辑过的字段，不把默认值写进来。 */
    configJson: JsonValue;
    uiJson: JsonValue;
};
export type GraphEdge = {
    fromKey: string;
    toKey: string;
};
export type WorkflowGraph = {
    nodes: GraphNode[];
    edges: GraphEdge[];
    globalsJson: JsonValue;
    agentSnapshots: Record<string, WorkflowNode>;
    /** 服务端冻结的实例定义副本；不作为客户端可编辑配置。 */
    readonly nodeInstanceDefinitions?: Readonly<Record<string, JsonObject>>;
};
