import type { DataReadBody, DataReadResult, InterruptBody, PageBundle, PanelBundleQuery, PrepareNodeInputBody, SubmitWaitActionBody } from '../features/workflow/mofangsdk/core/types';
import type { CloseWorkflowRunRequest, CloseWorkflowRunResult, GetActiveRunResult, GetNodeActionResult, GetNodeOperationResult, ListInputDeliveriesResult, ListNodeInputHistoryResult, RerunWorkflowNodeRequest, WorkflowRun, WorkflowRunStateProjection } from './workflow-v1-types';
/** 提交页面程序算出的输入准备结果；凭据（gate revision、配置修订、程序哈希等）必须与读到的准备请求一致。 */
export declare function prepareNodeInput(body: PrepareNodeInputBody): Promise<Readonly<{
    receipt: import("../features/workflow/mofangsdk/core").FirstMutationReceipt<"applied">;
    inputManifestId: import("../features/workflow/mofangsdk/core").ID;
    inputHash: string;
    status: import("../features/workflow/mofangsdk/core").PreparedInputSnapshot["disposition"];
}>>;
/** 提交一次人工动作。返回首次受理事实；下一步该做什么看 nextStep，动作本身不触发执行。 */
export declare function submitWaitAction(body: SubmitWaitActionBody): Promise<Readonly<{
    receipt: import("../features/workflow/mofangsdk/core").FirstMutationReceipt<"applied">;
    waitId: import("../features/workflow/mofangsdk/core").ID;
    actionId: import("../features/workflow/mofangsdk/core").ID;
    resolvedWaitRevision: import("../features/workflow/mofangsdk/core").Revision;
    nextStep: string;
    nextRunId: import("../features/workflow/mofangsdk/core").ID;
    nextNodeInstanceId: import("../features/workflow/mofangsdk/core").ID;
    nextInputRequestId: import("../features/workflow/mofangsdk/core").ID;
}>>;
/** 按调用方声明的终态意图关闭运行；不是"编排结束"，两者语义不同不能复用。 */
export declare function closeWorkflowRun(request: CloseWorkflowRunRequest): Promise<CloseWorkflowRunResult>;
/**
 * 重跑的完整请求形状：除图内键外还可断言实例身份、声明 purpose / force。
 * 只按图内键重跑用 rerunWorkflowNode。
 */
export declare function rerunWorkflowNodeWithOptions(request: RerunWorkflowNodeRequest): Promise<WorkflowRun>;
/**
 * 运行当前已持久化事实的只读投影：只解析，不重排、不补字段、不推断含义。
 * 返回 null 表示这次读没有给出投影，调用方不要把它当成"运行没有问题"。
 */
export declare function getWorkflowRunState(runId: string): Promise<WorkflowRunStateProjection | null>;
/** 工作流上尚未关闭的运行。是否未结束由服务端的事实判定，这里不按状态推断。 */
export declare function getActiveWorkflowRunV1(workflowId: string): Promise<GetActiveRunResult>;
/**
 * 页面程序渲染的节点上下文。它是只读事实：读它不会推进运行，也不会建立准备或执行受理。
 */
export declare function getNodeContextV1(query: Readonly<Record<string, string>>, options?: {
    fresh?: boolean;
}): Promise<{
    context: Readonly<{
        sdkVersion: "1";
        contextRevision: import("../features/workflow/mofangsdk/core").Revision;
        workflowId: import("../features/workflow/mofangsdk/core").ID;
        workspaceId: import("../features/workflow/mofangsdk/core").ID;
        spaceId: import("../features/workflow/mofangsdk/core").ID;
        nodeInstanceId: import("../features/workflow/mofangsdk/core").ID;
        nodeKey: string;
        runId?: import("../features/workflow/mofangsdk/core").ID;
        nodeRunId?: import("../features/workflow/mofangsdk/core").ID;
        taskId?: import("../features/workflow/mofangsdk/core").ID;
        mode: "auto" | "manual";
        view: "current" | "history" | "preview";
        inputRequestId?: import("../features/workflow/mofangsdk/core").ID;
        inputManifest?: import("../features/workflow/mofangsdk/core").InputManifest;
        input: import("../features/workflow/mofangsdk/core").JSONObject | null;
        config: import("../features/workflow/mofangsdk/core").JSONObject | null;
        configRevisionId: import("../features/workflow/mofangsdk/core").ID;
        pendingConfigRevisionId?: import("../features/workflow/mofangsdk/core").ID;
        inboxWatermark: import("../features/workflow/mofangsdk/core").Revision;
        predecessorRefs: readonly import("../features/workflow/mofangsdk/core").PredecessorRef[];
        output?: import("../features/workflow/mofangsdk/core").NodeOutput;
        plan?: import("../features/workflow/mofangsdk/core").NodePlan;
        agentAwait?: Readonly<{
            waitingToolCallId: import("../features/workflow/mofangsdk/core").ID;
            prompt: string;
            output?: import("../features/workflow/mofangsdk/core").JSONObject;
        }>;
        state: Readonly<{
            status: string;
            phase: string;
            closure: "open" | "settling" | "closed";
        }>;
        control: Readonly<{
            revision: import("../features/workflow/mofangsdk/core").Revision;
            desiredState: "running" | "paused";
            phase: "applying" | "applied" | "blocked";
            reasons: readonly import("../features/workflow/mofangsdk/core").JSONObject[];
            inFlightToolCount: number;
            unknownToolCount: number;
        }>;
        wait?: import("../features/workflow/mofangsdk/core").WaitEnvelope;
        permissions: Readonly<{
            canEditConfig: boolean;
            canEditDefinition: boolean;
            canPrepare: boolean;
            canExecute: boolean;
            canCommit: boolean;
        }>;
        panel: import("../features/workflow/mofangsdk/core").PanelReference;
        settingsPanel: import("../features/workflow/mofangsdk/core").SettingsPanelReference;
    }>;
}>;
/** 读取与节点上下文相同身份、视角绑定的页面包，未绑定返回 null。 */
export declare function getNodePageBundleV1(query: PanelBundleQuery): Promise<PageBundle | null>;
/**
 * 读取页面包的编译产物。产物可能数 MB，因此与元数据分开取；调用方按
 * `revisionId + viewHash` 缓存，同一修订只请求一次。
 */
export declare function getNodePageBundleSourceV1(query: import('../features/workflow/mofangsdk/core').PageBundleSourceQuery): Promise<Readonly<{
    revisionId: import("../features/workflow/mofangsdk/core").ID;
    surface: import("../features/workflow/mofangsdk/core").PanelSurface;
    viewHash: string;
    programHash?: string;
    viewCompiled: string;
    programCompiled?: string;
}> | null>;
/** 某节点实例上的到达列表。 */
export declare function listNodeInputDeliveriesV1(query: Readonly<Record<string, string>>): Promise<ListInputDeliveriesResult>;
/** 某节点实例上已冻结的输入清单历史。 */
export declare function listNodeInputHistoryV1(query: Readonly<Record<string, string>>): Promise<ListNodeInputHistoryResult>;
/** 读取指定执行独立保存的输出。 */
export declare function getNodeOutputV1(nodeRunId: string): Promise<Readonly<{
    nodeRunId: import("../features/workflow/mofangsdk/core").ID;
    nodeInstanceId: import("../features/workflow/mofangsdk/core").ID;
    runId: import("../features/workflow/mofangsdk/core").ID;
    status: string;
    generation?: number;
    values: import("../features/workflow/mofangsdk/core").JSONObject | null;
    writtenAt?: string;
}>>;
/** 按到达任务分页读取同一个节点的正式结果和本次尝试。 */
export declare function getNodeOutputPageV1(query: import('../features/workflow/mofangsdk/core').NodeOutputPageQuery): Promise<Readonly<{
    runId: import("../features/workflow/mofangsdk/core").ID;
    nodeInstanceId: import("../features/workflow/mofangsdk/core").ID;
    page: number;
    pageSize: number;
    total: number;
    items: readonly Readonly<{
        taskId: import("../features/workflow/mofangsdk/core").ID;
        arrivalOrder: string;
        requestedGeneration: number;
        settledGeneration: number;
        state: string;
        error?: string;
        currentOutput: import("../features/workflow/mofangsdk/core").NodeOutput | null;
        context: import("../features/workflow/mofangsdk/core").NodeContext;
    }>[];
}>>;
export declare function writeNodeOutputV1(body: import('../features/workflow/mofangsdk/core').WriteNodeOutputBody): Promise<Readonly<{
    status: "applied" | "rejected";
    nodeRunId?: import("../features/workflow/mofangsdk/core").ID;
    writtenAt?: string;
    error?: {
        code: string;
        message: string;
    };
    repairedJson?: string;
    requiresConfirmation?: boolean;
}>>;
export declare function advanceNodeOutputV1(body: import('../features/workflow/mofangsdk/core').AdvanceNodeOutputBody): Promise<Readonly<{
    receipt: import("../features/workflow/mofangsdk/core").FirstMutationReceipt<"applied">;
    snapshot: {
        nodeRunId: import("../features/workflow/mofangsdk/core").ID;
        nodeInstanceId: import("../features/workflow/mofangsdk/core").ID;
        runId: import("../features/workflow/mofangsdk/core").ID;
        deliveredTaskIds: readonly import("../features/workflow/mofangsdk/core").ID[];
        preparationFailures?: Readonly<Record<string, string>>;
    };
}>>;
export declare function replyNodeV1(body: import('../features/workflow/mofangsdk/core').ReplyNodeBody): Promise<Readonly<{
    status: "applied";
    nodeRunId: import("../features/workflow/mofangsdk/core").ID;
    waitingToolCallId: import("../features/workflow/mofangsdk/core").ID;
}>>;
export declare function getNodeActionV1(query: Readonly<Record<string, string>>): Promise<GetNodeActionResult>;
/** 读一次原子调用的当前状态；结果未知的调用业务上仍会阻塞运行关闭。 */
export declare function getNodeOperationV1(operationId: string): Promise<GetNodeOperationResult>;
/**
 * 按引用读不可变正文：清单、到达与输出修订里的 `*Ref` 都经这里取内容。
 *
 * 身份（实例、运行、节点执行）由调用方给全，服务端据此核对这次读取有没有越出该实例的范围；
 * 缺任何一个都不替它猜。
 */
export declare function readWorkflowDataRef(body: DataReadBody): Promise<DataReadResult>;
/**
 * 中断一次执行。与暂停/继续共用目标契约，但正文是工作流自己的中断正文，
 * 因此和节点写入一样按 { body } 严格提交。
 */
export declare function interruptWorkflowExecution(body: InterruptBody): Promise<Readonly<{
    requestId: import("../features/workflow/mofangsdk/core").ID;
    target: import("../features/workflow/mofangsdk/core").ExecutionReference;
    accepted: boolean;
}>>;
export declare function listNodeTasksV1(query: import('../features/workflow/mofangsdk/core').NodeTaskQuery, executions?: boolean): Promise<Readonly<{
    items: readonly import("../features/workflow/mofangsdk/core").NodeTask[];
    total: number;
    page: number;
    pageSize: number;
}>>;
