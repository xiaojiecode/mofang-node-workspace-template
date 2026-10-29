import type {
    MofangSDK,
    PanelProps,
    PageProgramContext,
    NodeView,
    SchemaField,
    WorkflowNodeSummary,
    WorkflowSummary,
} from '@mofang/contracts/browser'
import { HostPanel } from '@mofang/browser'
import { productSummary, textField, selectField, card } from '@mofang/browser'
import type { TemplateResult } from 'lit'
import type { Product } from '@mofang/contracts/business'
import type {
    JavaScriptValidation,
    JavaScriptNodeBody,
    NodeDefinition,
} from '@mofang/contracts/author'
import type { WorkflowSummary as PublishedWorkflowSummary } from '@mofang/workflow-sdk'
const moduleValidation: JavaScriptValidation = {
    programInterface: 'mf.node/1',
    valid: true,
    entry: 'initialize',
    steps: ['initialize', 'handle', 'project'],
    scope: 'syntax_and_contract',
    toolAvailability: 'checked_on_submission',
}
void moduleValidation
declare const sdk: MofangSDK
declare const props: PanelProps
type IsAny<T> = 0 extends 1 & T ? true : false
type ExpectFalse<T extends false> = T
type SDKIsTyped = ExpectFalse<IsAny<MofangSDK>>
type PanelPropsAreTyped = ExpectFalse<IsAny<PanelProps>>
type ProductIsTyped = ExpectFalse<IsAny<Product>>
void sdk.nodeFlow.watch({ runId: 'run', nodeInstanceId: 'node' })
// 宿主 HTTP 能力仅声明 JSON 参数，不向作者暴露底层鉴权请求实例。
void sdk.http.request<{ items: string[] }>({
    method: 'GET',
    path: '/v1/example/items',
    query: { page: 1 },
})
// @ts-expect-error HTTP 仅支持公开的五种方法。
void sdk.http.request({ method: 'TRACE', path: '/v1/example/items' })
// @ts-expect-error 页面不能覆盖宿主认证请求头。
void sdk.http.request({ method: 'GET', path: '/v1/example/items', headers: { Authorization: 'x' } })
void props.settings?.onFieldChange?.('note', 'text')
void props.ui?.onSelectTask?.({ taskId: 'task', nodeRunId: 'run' })
// @ts-expect-error 宿主回调接收身份对象，不能只传任务 ID 字符串。
void props.ui?.onSelectTask?.('task')
void textField({ name: 'x', label: 'x', value: '', readOnly: true })
void productSummary({
    basic: { title: 'x' },
    references: { shopProductId: 'shop' },
} satisfies Product)
// @ts-expect-error ID 和修订号必须为字符串。
void sdk.nodeFlow.watch({ runId: 42, nodeInstanceId: 'node' })
// @ts-expect-error 契约包只导出类型，SDK 运行时由平台提供。
import { createMofangSDK } from '@mofang/contracts/browser'

// 保留已有 selectField 的 TemplateResult 返回契约，可直接作为容器内容。
const selectionField: TemplateResult = selectField({
    name: 'region',
    label: '地区',
    value: 'US',
    options: [{ value: 'US', label: '美国' }],
})
void card({ title: '设置' }, selectionField)

// 字段禁用和仅运行前配置由宿主提供，保留具体类型。
const disabledFields: readonly string[] | undefined = props.settings?.disabledFields
const beforeRunField: SchemaField = {
    name: 'mode',
    title: '模式',
    description: '',
    type: 'string',
    required: false,
    nullable: false,
    ui: {},
    schema: {},
    configBeforeRun: true,
    capabilitySwitchPaths: [],
}
// @ts-expect-error 字段禁用列表只能包含字段名字符串。
const invalidDisabledFields: NonNullable<PanelProps['settings']>['disabledFields'] = [1]
// @ts-expect-error 仅运行前配置标记必须为布尔值。
const invalidBeforeRun: SchemaField = { ...beforeRunField, configBeforeRun: 'true' }
void disabledFields
void beforeRunField
void invalidDisabledFields
void invalidBeforeRun

// 能力开关按相对 JSON Pointer 锁叶子，普通同级字段仍可编辑。
const fieldPaths: Readonly<Record<string, readonly string[]>> | undefined =
    props.settings?.disabledFieldPaths
const capabilities: SchemaField = {
    ...beforeRunField,
    configBeforeRun: false,
    capabilitySwitchPaths: ['/title/enabled'],
}
const invalidFieldPaths: NonNullable<PanelProps['settings']>['disabledFieldPaths'] = {
    // @ts-expect-error 叶子锁路径必须为字符串数组。
    caps: [false],
}
void fieldPaths
void capabilities
void invalidFieldPaths

// 配置读取保留门面；写入使用完整工作流正文和唯一保存回执。
import type {
    SaveWorkflowBody,
    SaveWorkflowResult,
    StartWorkflowRunBody,
} from '@mofang/contracts/browser'
const workflowSave: SaveWorkflowBody = {
    workflowId: 'workflow',
    expectedRevision: '7',
    name: '工作流',
    description: '',
    coverUrl: '',
    graph: { nodes: [], edges: [], globalsJson: {}, agentSnapshots: {} },
    pausedRun: { runId: 'run', expectedRunRevision: '12', expectedPauseRequestId: 'pause' },
}
const savedWorkflow: Promise<SaveWorkflowResult> = sdk.configuration.save(workflowSave)
void savedWorkflow
void sdk.configuration.copy({ workflowId: 'workflow', expectedRevision: '7' })
// @ts-expect-error 不再提供独立自动化写接口，自动化随完整图手动保存。
void sdk.configuration.setAutoExecute({
    target: { workflowId: 'workflow' },
    revision: '7',
    enabled: true,
})
const retiredSaveBody = {
    target: { workflowId: 'workflow' },
    revision: '7',
    previous: workflowSave.graph,
    graph: workflowSave.graph,
}
// @ts-expect-error 旧逐节点保存正文缺少完整元信息与CAS，不允许作为新保存合同。
void sdk.configuration.save(retiredSaveBody)
const savedStart: StartWorkflowRunBody = {
    workflowId: 'workflow',
    expectedRevision: '8',
    isTestRun: false,
    mode: 'manual',
}
// @ts-expect-error 所有新运行必须明确试运行身份，不能由旧source推断。
const missingTrialIdentity: StartWorkflowRunBody = {
    workflowId: 'workflow',
    expectedRevision: '8',
    mode: 'auto',
}
void savedStart
void missingTrialIdentity

// 当前保存图的节点摘要始终存在，空图不需要补读详情或猜测字段。
declare const workflowSummary: WorkflowSummary
declare const publishedWorkflowSummary: PublishedWorkflowSummary
const workflowNodeCount: number = workflowSummary.nodeCount
const workflowNodeCodes: string[] = workflowSummary.nodeCodes
const publishedNodeSummary: WorkflowNodeSummary = publishedWorkflowSummary
const emptyWorkflowSummary: WorkflowNodeSummary = { nodeCount: 0, nodeCodes: [] }
const orderedWorkflowSummary: WorkflowNodeSummary = {
    nodeCount: 3,
    nodeCodes: ['same', '', 'same'],
}
// @ts-expect-error 节点数量是必需字段，缺失不代表空图。
const missingNodeCount: WorkflowNodeSummary = { nodeCodes: [] }
// @ts-expect-error 节点编码数组是必需字段，缺失不通过类型检查。
const missingNodeCodes: WorkflowNodeSummary = { nodeCount: 0 }
// @ts-expect-error 节点编码只能是字符串，空位置由服务端明确返回空串。
const invalidNodeCodes: WorkflowNodeSummary = { nodeCount: 1, nodeCodes: [1] }
// @ts-expect-error 节点数量不能使用数字字符串。
const invalidNodeCount: WorkflowNodeSummary = { nodeCount: '1', nodeCodes: ['a'] }
void workflowNodeCount
void workflowNodeCodes
void publishedNodeSummary
void emptyWorkflowSummary
void orderedWorkflowSummary
void missingNodeCount
void missingNodeCodes
void invalidNodeCodes
void invalidNodeCount

// 商品身份模式只进入目录作者元数据，缺省保持缺席。
const inheritedProductMode: Pick<NodeDefinition, 'productIdentityMode'> = {}
const newProductMode: Pick<JavaScriptNodeBody, 'productIdentityMode'> = {
    productIdentityMode: 'new',
}
// @ts-expect-error 显式空串不等于缺省inherit。
const emptyProductMode: Pick<NodeDefinition, 'productIdentityMode'> = { productIdentityMode: '' }
const unknownProductMode: Pick<NodeDefinition, 'productIdentityMode'> = {
    // @ts-expect-error 商品身份模式不接受其它名称。
    productIdentityMode: 'auto',
}
void inheritedProductMode
void newProductMode
void emptyProductMode
void unknownProductMode

// 控制恢复只能引用真实暂停身份；原请求与当前目标快照分别查询。
import type {
    ExecutionControlReceipt,
    ExecutionControlRequest,
    ExecutionControlSnapshot,
    ResumeExecutionRequest,
} from '@mofang/contracts/browser'
import type {
    MofangSDK as PublishedControlSDK,
    ResumeExecutionRequest as PublishedResumeExecutionRequest,
} from '@mofang/workflow-sdk'
declare const publishedControlSDK: PublishedControlSDK
const controlTarget = { kind: 'node_run', id: 'node-run' } as const
const controlReadOptions = { signal: new AbortController().signal, fresh: true }
const controlSnapshot: Promise<ExecutionControlSnapshot> = sdk.control.get(
    controlTarget,
    controlReadOptions,
)
const originalControlRequest: Promise<ExecutionControlRequest> = sdk.control.getRequest(
    controlTarget,
    'pause-request',
    controlReadOptions,
)
const resumeControl: ResumeExecutionRequest = {
    target: controlTarget,
    pauseRequestId: 'pause-request',
}
const publishedResumeControl: PublishedResumeExecutionRequest = resumeControl
const controlReceipt: Promise<ExecutionControlReceipt> =
    publishedControlSDK.control.resume(publishedResumeControl)
void publishedControlSDK.control.getRequest(controlTarget, 'pause-request', controlReadOptions)
// @ts-expect-error 恢复必须给出真实 pauseRequestId。
void sdk.control.resume({ target: controlTarget })
// @ts-expect-error 已退役的画布节点 key 不能作为控制目标。
void sdk.control.get({ kind: 'node_instance', id: 'canvas-node' })
declare const acceptedControl: ExecutionControlReceipt
// @ts-expect-error accepted 仅表示受理，回执没有控制应用状态。
void acceptedControl.phase
void controlSnapshot
void originalControlRequest
void controlReceipt
