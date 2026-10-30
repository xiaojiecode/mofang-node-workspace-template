import { M as MofangSDKError, c as createMofangSDK } from "./create-sdk-C-0mzZYK.js";
const WORKFLOW_SDK_VERSION = "1";
const WORKFLOW_SDK_METHODS = [
  {
    path: "readOnlyActions.submit",
    kind: "async",
    effect: "write",
    label: "独立只读查询 · 提交",
    description: "独立只读查询 · 提交；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: SubmitReadOnlyActionBody): Promise<ReadOnlyActionAccepted>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ runId: ID; nodeInstanceId: ID; actionName: string; payload: JSONObject; }>",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "actionName",
            type: "string"
          },
          {
            name: "payload",
            type: "JSONObject"
          }
        ]
      }
    ],
    example: "await sdk.readOnlyActions.submit(input.body)"
  },
  {
    path: "readOnlyActions.get",
    kind: "async",
    effect: "read",
    label: "独立只读查询 · 读取",
    description: "独立只读查询 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(executionId: ID, options?: MofangRequestOptions): Promise<ReadOnlyActionExecution>",
    parameters: [
      {
        name: "executionId",
        type: "string"
      },
      {
        name: "options",
        type: "Readonly<{ signal?: AbortSignal; fresh?: boolean; }> | undefined",
        optional: true
      }
    ],
    example: "await sdk.readOnlyActions.get(input.executionId, input.options)"
  },
  {
    path: "http.request",
    kind: "async",
    effect: "write",
    label: "HTTP · 发送请求",
    description: "返回 HTTP JSON 正文原文，不拆业务信封；泛型不代替响应校验。请求不自动重发。",
    signature: "<T = unknown>(request: MofangHttpRequest): Promise<T>",
    parameters: [
      {
        name: "request",
        type: "MofangHttpRequest",
        fields: [
          {
            name: "method",
            type: "MofangHttpMethod"
          },
          {
            name: "path",
            type: "string",
            description: "当前 backend 的规范相对路径；查询参数单独放 query。"
          },
          {
            name: "query",
            type: "Readonly<Record<string, MofangHttpQueryValue | readonly MofangHttpQueryValue[]>> | undefined",
            optional: true
          },
          {
            name: "body",
            type: "JSONValue | undefined",
            optional: true
          },
          {
            name: "signal",
            type: "AbortSignal | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.http.request(input.request)"
  },
  {
    path: "toast.success",
    kind: "async",
    effect: "read",
    label: "提示 · 成功提示",
    description: "提示 · 成功提示；参数与返回值遵循公开 SDK 合同。",
    signature: "(message: string): Promise<void>",
    parameters: [
      {
        name: "message",
        type: "string"
      }
    ],
    example: "await sdk.toast.success(input.message)"
  },
  {
    path: "toast.info",
    kind: "async",
    effect: "read",
    label: "提示 · 信息提示",
    description: "提示 · 信息提示；参数与返回值遵循公开 SDK 合同。",
    signature: "(message: string): Promise<void>",
    parameters: [
      {
        name: "message",
        type: "string"
      }
    ],
    example: "await sdk.toast.info(input.message)"
  },
  {
    path: "toast.warning",
    kind: "async",
    effect: "read",
    label: "提示 · 警告提示",
    description: "提示 · 警告提示；参数与返回值遵循公开 SDK 合同。",
    signature: "(message: string): Promise<void>",
    parameters: [
      {
        name: "message",
        type: "string"
      }
    ],
    example: "await sdk.toast.warning(input.message)"
  },
  {
    path: "toast.error",
    kind: "async",
    effect: "read",
    label: "提示 · 错误提示",
    description: "提示 · 错误提示；参数与返回值遵循公开 SDK 合同。",
    signature: "(message: string): Promise<void>",
    parameters: [
      {
        name: "message",
        type: "string"
      }
    ],
    example: "await sdk.toast.error(input.message)"
  },
  {
    path: "nodeFlow.get",
    kind: "async",
    effect: "read",
    label: "节点流 · 读取",
    description: "节点流 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeFlowQuery): Promise<NodeView>",
    parameters: [
      {
        name: "query",
        type: "NodeFlowQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.get(input.query)"
  },
  {
    path: "nodeFlow.listCandidates",
    kind: "async",
    effect: "read",
    label: "节点流 · 候选列表",
    description: "节点流 · 候选列表；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeFlowQuery): Promise<NodeCandidatePage>",
    parameters: [
      {
        name: "query",
        type: "NodeFlowQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.listCandidates(input.query)"
  },
  {
    path: "nodeFlow.tasks",
    kind: "async",
    effect: "read",
    label: "节点流 · 任务列表",
    description: "节点流 · 任务列表；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeFlowQuery): Promise<NodeFlowTaskPage>",
    parameters: [
      {
        name: "query",
        type: "NodeFlowQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.tasks(input.query)"
  },
  {
    path: "nodeFlow.watch",
    kind: "resource",
    effect: "read",
    label: "节点流 · 订阅资源",
    description: "相同身份和页复用资源，最后一个订阅释放实时监听及计时器。",
    signature: "(query: NodeFlowQuery): NodeFlowStore",
    parameters: [
      {
        name: "query",
        type: "NodeFlowQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    resourceInitial: {
      state: {
        data: null,
        loading: true,
        stale: false,
        error: null,
        revision: null,
        refreshing: false
      },
      snapshot: {
        data: null,
        loading: true,
        stale: false,
        error: null,
        revision: null,
        refreshing: false
      }
    },
    example: "const resource = sdk.nodeFlow.watch(input.query);\nconst unsubscribe = resource.subscribe(() => { const state = resource.getSnapshot(); /* 使用 state 更新页面 */ });\nonDispose(unsubscribe);\nawait resource.refresh();"
  },
  {
    path: "nodeFlow.editCandidate",
    kind: "async",
    effect: "write",
    label: "节点流 · 编辑候选",
    description: "节点流 · 编辑候选；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: EditNodeCandidateBody): Promise<NodeCandidate>",
    parameters: [
      {
        name: "body",
        type: "EditNodeCandidateBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "candidateId",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string"
          },
          {
            name: "value",
            type: "JSONObject"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.editCandidate(input.body)"
  },
  {
    path: "nodeFlow.release",
    kind: "async",
    effect: "write",
    label: "节点流 · 放行候选",
    description: "节点流 · 放行候选；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeFlowCandidatesBody): Promise<NodeFlowBatchResult>",
    parameters: [
      {
        name: "body",
        type: "NodeFlowCandidatesBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "candidates",
            type: "readonly Readonly<{ id: ID; expectedRevision: Revision; }>[]"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.release(input.body)"
  },
  {
    path: "nodeFlow.discard",
    kind: "async",
    effect: "write",
    label: "节点流 · 移除候选",
    description: "节点流 · 移除候选；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeFlowCandidatesBody): Promise<NodeFlowBatchResult>",
    parameters: [
      {
        name: "body",
        type: "NodeFlowCandidatesBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "candidates",
            type: "readonly Readonly<{ id: ID; expectedRevision: Revision; }>[]"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.discard(input.body)"
  },
  {
    path: "nodeFlow.endReview",
    kind: "async",
    effect: "write",
    label: "节点流 · 结束审核",
    description: "节点流 · 结束审核；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: EndNodeReviewBody): Promise<NodeView>",
    parameters: [
      {
        name: "body",
        type: "EndNodeReviewBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.endReview(input.body)"
  },
  {
    path: "nodeFlow.action",
    kind: "async",
    effect: "write",
    label: "节点流 · 触发业务动作",
    description: "节点流 · 触发业务动作；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeFlowActionBody): Promise<NodeFlowActionReceipt>",
    parameters: [
      {
        name: "body",
        type: "NodeFlowActionBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "payload",
            type: "JSONObject"
          },
          {
            name: "expectedSessionRevision",
            type: "string"
          },
          {
            name: "candidates",
            type: "readonly Readonly<{ id: ID; expectedRevision: Revision; }>[]"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.action(input.body)"
  },
  {
    path: "nodeFlow.getActionResult",
    kind: "async",
    effect: "read",
    label: "节点流 · 读取业务动作结果",
    description: "节点流 · 读取业务动作结果；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeFlowActionQuery): Promise<NodeActionResult>",
    parameters: [
      {
        name: "query",
        type: "NodeFlowActionQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "eventId",
            type: "string"
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.getActionResult(input.query)"
  },
  {
    path: "nodeFlow.listActions",
    kind: "async",
    effect: "read",
    label: "节点流 · 业务动作记录",
    description: "节点流 · 业务动作记录；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeActionListQuery): Promise<NodeActionPage>",
    parameters: [
      {
        name: "query",
        type: "NodeActionListQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          },
          {
            name: "cursor",
            type: "string | undefined",
            optional: true
          },
          {
            name: "afterSequence",
            type: "string | undefined",
            optional: true
          },
          {
            name: "limit",
            type: "number | undefined",
            optional: true
          },
          {
            name: "name",
            type: "string | undefined",
            optional: true
          },
          {
            name: "actorUserId",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.listActions(input.query)"
  },
  {
    path: "nodeFlow.watchActionResult",
    kind: "resource",
    effect: "read",
    label: "节点流 · 订阅业务动作结果",
    description: "节点流 · 订阅业务动作结果；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeFlowActionQuery): NodeFlowStore<NodeActionResult>",
    parameters: [
      {
        name: "query",
        type: "NodeFlowActionQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "eventId",
            type: "string"
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    resourceInitial: {
      state: {
        data: null,
        loading: true,
        stale: false,
        error: null,
        revision: null,
        refreshing: false
      },
      snapshot: {
        data: null,
        loading: true,
        stale: false,
        error: null,
        revision: null,
        refreshing: false
      }
    },
    example: "const resource = sdk.nodeFlow.watchActionResult(input.query);\nconst unsubscribe = resource.subscribe(() => { const state = resource.getSnapshot(); /* 使用 state 更新页面 */ });\nonDispose(unsubscribe);\nawait resource.refresh();"
  },
  {
    path: "nodeFlow.pause",
    kind: "async",
    effect: "write",
    label: "节点流 · 暂停",
    description: "节点流 · 暂停；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeFlowControlBody): Promise<NodeView>",
    parameters: [
      {
        name: "body",
        type: "NodeFlowControlBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "reason",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.pause(input.body)"
  },
  {
    path: "nodeFlow.resume",
    kind: "async",
    effect: "write",
    label: "节点流 · 恢复",
    description: "只恢复节点父级暂停，不跳过人工回答或子执行的独立暂停。",
    signature: "(body: NodeFlowControlBody): Promise<NodeView>",
    parameters: [
      {
        name: "body",
        type: "NodeFlowControlBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "reason",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.resume(input.body)"
  },
  {
    path: "nodeFlow.cancel",
    kind: "async",
    effect: "write",
    label: "节点流 · 取消",
    description: "节点流 · 取消；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeFlowControlBody): Promise<NodeView>",
    parameters: [
      {
        name: "body",
        type: "NodeFlowControlBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "reason",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.cancel(input.body)"
  },
  {
    path: "nodeFlow.getTaskOperation",
    kind: "async",
    effect: "read",
    label: "节点流 · 查询人工操作结果",
    description: "节点流 · 查询人工操作结果；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: TaskOperationQuery): Promise<TaskOperationResult>",
    parameters: [
      {
        name: "query",
        type: "TaskOperationQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "taskId",
            type: "string"
          },
          {
            name: "operationId",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.getTaskOperation(input.query)"
  },
  {
    path: "nodeFlow.listTaskOperations",
    kind: "async",
    effect: "read",
    label: "节点流 · 人工操作记录",
    description: "节点流 · 人工操作记录；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: TaskOperationListQuery): Promise<TaskOperationPage>",
    parameters: [
      {
        name: "query",
        type: "TaskOperationListQuery",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "taskId",
            type: "string"
          },
          {
            name: "afterSequence",
            type: "string | undefined",
            optional: true
          },
          {
            name: "snapshotUpperSequence",
            type: "string | undefined",
            optional: true
          },
          {
            name: "limit",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.listTaskOperations(input.query)"
  },
  {
    path: "nodeFlow.replyTask",
    kind: "async",
    effect: "write",
    label: "节点流 · 回复任务",
    description: "节点流 · 回复任务；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: ReplyNodeFlowTaskBody): Promise<NodeFlowTaskReceipt>",
    parameters: [
      {
        name: "body",
        type: "ReplyNodeFlowTaskBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "taskId",
            type: "string"
          },
          {
            name: "operationId",
            type: "string"
          },
          {
            name: "waitingToolCallId",
            type: "string"
          },
          {
            name: "answer",
            type: "JSONValue"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.replyTask(input.body)"
  },
  {
    path: "nodeFlow.continueTask",
    kind: "async",
    effect: "write",
    label: "节点流 · 继续任务",
    description: "节点流 · 继续任务；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: ContinueNodeFlowTaskBody): Promise<NodeFlowTaskReceipt>",
    parameters: [
      {
        name: "body",
        type: "ContinueNodeFlowTaskBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "taskId",
            type: "string"
          },
          {
            name: "operationId",
            type: "string"
          },
          {
            name: "expectedWaitingTurn",
            type: "number"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.continueTask(input.body)"
  },
  {
    path: "nodeFlow.resolveUnknownTask",
    kind: "async",
    effect: "write",
    label: "节点流 · 核对未知任务",
    description: "人工核对原操作，不重发业务请求；原子任务保持失败事实。",
    signature: "(body: ResolveUnknownNodeFlowTaskBody): Promise<NodeFlowTaskView>",
    parameters: [
      {
        name: "body",
        type: "ResolveUnknownNodeFlowTaskBody",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "taskId",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string"
          },
          {
            name: "conclusion",
            type: '"succeeded" | "failed"'
          },
          {
            name: "evidence",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.nodeFlow.resolveUnknownTask(input.body)"
  },
  {
    path: "messages.subscribe",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅更新",
    description: "消息 · 订阅更新；参数与返回值遵循公开 SDK 合同。",
    signature: "(filter: MessageFilter, listener: MessageListener): () => void",
    parameters: [
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }>",
        fields: [
          {
            name: "types",
            type: "readonly string[] | undefined",
            optional: true
          },
          {
            name: "workflowId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "runId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          }
        ]
      },
      {
        name: "listener",
        type: "MessageListener"
      }
    ],
    callbackIndex: 1,
    example: "const unsubscribe = sdk.messages.subscribe(input.filter, (event) => { /* 在这里处理更新 */ });\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onStage",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅阶段",
    description: "消息 · 订阅阶段；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: MessageListener, filter?: MessageFilter): () => void",
    parameters: [
      {
        name: "listener",
        type: "MessageListener"
      },
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }> | undefined",
        optional: true
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.messages.onStage((event) => { /* 在这里处理更新 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onPlan",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅计划",
    description: "消息 · 订阅计划；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: MessageListener, filter?: MessageFilter): () => void",
    parameters: [
      {
        name: "listener",
        type: "MessageListener"
      },
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }> | undefined",
        optional: true
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.messages.onPlan((event) => { /* 在这里处理更新 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onMessage",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅消息",
    description: "消息 · 订阅消息；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: MessageListener, filter?: MessageFilter): () => void",
    parameters: [
      {
        name: "listener",
        type: "MessageListener"
      },
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }> | undefined",
        optional: true
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.messages.onMessage((event) => { /* 在这里处理更新 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onReasoning",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅推理",
    description: "消息 · 订阅推理；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: MessageListener, filter?: MessageFilter): () => void",
    parameters: [
      {
        name: "listener",
        type: "MessageListener"
      },
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }> | undefined",
        optional: true
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.messages.onReasoning((event) => { /* 在这里处理更新 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onTool",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅工具",
    description: "消息 · 订阅工具；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: MessageListener, filter?: MessageFilter): () => void",
    parameters: [
      {
        name: "listener",
        type: "MessageListener"
      },
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }> | undefined",
        optional: true
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.messages.onTool((event) => { /* 在这里处理更新 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onConnectionChange",
    kind: "subscribe",
    effect: "read",
    label: "消息 · 订阅连接状态",
    description: "消息 · 订阅连接状态；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: MessageConnectionListener, filter?: MessageFilter): () => void",
    parameters: [
      {
        name: "listener",
        type: "MessageConnectionListener"
      },
      {
        name: "filter",
        type: "Readonly<{ types?: readonly string[]; workflowId?: string; runId?: string; nodeRunId?: string; }> | undefined",
        optional: true
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.messages.onConnectionChange((event) => { /* 在这里处理更新 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "getState",
    kind: "snapshot",
    effect: "read",
    label: "SDK · 读取本地状态",
    description: "整个 store 的根状态；只在任一资源内容变化时才换引用。",
    signature: "(): MofangSDKState",
    parameters: [],
    example: "sdk.getState()"
  },
  {
    path: "subscribe",
    kind: "subscribe",
    effect: "read",
    label: "SDK · 订阅更新",
    description: "SDK · 订阅更新；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: () => void): () => void",
    parameters: [
      {
        name: "listener",
        type: "() => void"
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.subscribe((event) => { /* 在这里处理更新 */ });\nonDispose(unsubscribe);"
  },
  {
    path: "context.getState",
    kind: "snapshot",
    effect: "read",
    label: "上下文 · 读取本地状态",
    description: "上下文 · 读取本地状态；参数与返回值遵循公开 SDK 合同。",
    signature: '(): Readonly<{ data: Readonly<{ sdkVersion: "1"; contextRevision: Revision; workflowId: ID; workspaceId: ID; spaceId: ID; nodeInstanceId: ID; nodeKey: string; runId?: ID; nodeRunId?: ID; taskId?: ID; mode: "auto" | "manual"; view: "current" | "history" | "preview"; inputRequestId?: ID; inputManifest?: Readonly<{ taskId: ID; id: ID; inputRequestId: ID; valuesRef: Readonly<{ id: ID; sha256: string; kind: "json" | "file" | "record_set"; }>; inputHash: string; usedRefs: readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]; fieldSources: Readonly<Record<string, readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]>>; predecessors: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; configRevisionId: ID; programHash: string; panelRevisionId: ID; inboxWatermark: Revision; createdAt: string; }>; input: JSONObject | null; config: JSONObject | null; configRevisionId: ID; pendingConfigRevisionId?: ID; inboxWatermark: Revision; predecessorRefs: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; output?: Readonly<{ nodeRunId: ID; nodeInstanceId: ID; runId: ID; status: string; generation?: number; values: JSONObject | null; writtenAt?: string; }>; plan?: Readonly<{ seq: number; updatedAt: string; explanation?: string; steps: readonly Readonly<{ id: string; title: string; status: "pending" | "in_progress" | "completed"; }>[]; }>; agentAwait?: Readonly<{ waitingToolCallId: ID; prompt: string; output?: JSONObject; }>; readOnlyActions?: readonly Readonly<{ name: string; label: string; description: string; payloadSchema: JSONObject; outputSchema: JSONObject; }>[]; continuation?: Readonly<{ expectedGateRevision: string; expectedWaitingTurn?: number; }>; state: Readonly<{ status: string; phase: string; closure: "open" | "settling" | "closed"; }>; control: Readonly<{ revision: Revision; desiredState: "running" | "paused"; phase: "applying" | "applied" | "blocked"; reasons: readonly JSONObject[]; inFlightToolCount: number; unknownToolCount: number; }>; wait?: WaitEnvelope; permissions: Readonly<{ canEditConfig: boolean; canEditDefinition: boolean; canPrepare: boolean; canExecute: boolean; canCommit: boolean; }>; panel: Readonly<{ revisionId: ID; renderMode: PanelRenderMode; frontendAdapter?: string; lowcode?: Readonly<{ rendererKey: string; config: JsonObject; }>; compiledHash?: string; programHash?: string; }>; settingsPanel: SettingsPanelReference; }> | null; loading: boolean; stale: boolean; error: MofangSDKError | null; revision: Revision | null; }>',
    parameters: [],
    example: "sdk.context.getState()"
  },
  {
    path: "context.getSnapshot",
    kind: "snapshot",
    effect: "read",
    label: "上下文 · 读取本地快照",
    description: "上下文 · 读取本地快照；参数与返回值遵循公开 SDK 合同。",
    signature: '(): Readonly<{ sdkVersion: "1"; contextRevision: Revision; workflowId: ID; workspaceId: ID; spaceId: ID; nodeInstanceId: ID; nodeKey: string; runId?: ID; nodeRunId?: ID; taskId?: ID; mode: "auto" | "manual"; view: "current" | "history" | "preview"; inputRequestId?: ID; inputManifest?: Readonly<{ taskId: ID; id: ID; inputRequestId: ID; valuesRef: Readonly<{ id: ID; sha256: string; kind: "json" | "file" | "record_set"; }>; inputHash: string; usedRefs: readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]; fieldSources: Readonly<Record<string, readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]>>; predecessors: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; configRevisionId: ID; programHash: string; panelRevisionId: ID; inboxWatermark: Revision; createdAt: string; }>; input: JSONObject | null; config: JSONObject | null; configRevisionId: ID; pendingConfigRevisionId?: ID; inboxWatermark: Revision; predecessorRefs: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; output?: Readonly<{ nodeRunId: ID; nodeInstanceId: ID; runId: ID; status: string; generation?: number; values: JSONObject | null; writtenAt?: string; }>; plan?: Readonly<{ seq: number; updatedAt: string; explanation?: string; steps: readonly Readonly<{ id: string; title: string; status: "pending" | "in_progress" | "completed"; }>[]; }>; agentAwait?: Readonly<{ waitingToolCallId: ID; prompt: string; output?: JSONObject; }>; readOnlyActions?: readonly Readonly<{ name: string; label: string; description: string; payloadSchema: JSONObject; outputSchema: JSONObject; }>[]; continuation?: Readonly<{ expectedGateRevision: string; expectedWaitingTurn?: number; }>; state: Readonly<{ status: string; phase: string; closure: "open" | "settling" | "closed"; }>; control: Readonly<{ revision: Revision; desiredState: "running" | "paused"; phase: "applying" | "applied" | "blocked"; reasons: readonly JSONObject[]; inFlightToolCount: number; unknownToolCount: number; }>; wait?: WaitEnvelope; permissions: Readonly<{ canEditConfig: boolean; canEditDefinition: boolean; canPrepare: boolean; canExecute: boolean; canCommit: boolean; }>; panel: Readonly<{ revisionId: ID; renderMode: PanelRenderMode; frontendAdapter?: string; lowcode?: Readonly<{ rendererKey: string; config: JsonObject; }>; compiledHash?: string; programHash?: string; }>; settingsPanel: SettingsPanelReference; }> | null',
    parameters: [],
    example: "sdk.context.getSnapshot()"
  },
  {
    path: "context.subscribe",
    kind: "subscribe",
    effect: "read",
    label: "上下文 · 订阅更新",
    description: "上下文 · 订阅更新；参数与返回值遵循公开 SDK 合同。",
    signature: "(listener: () => void): () => void",
    parameters: [
      {
        name: "listener",
        type: "() => void"
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.context.subscribe((event) => { /* 在这里处理更新 */ });\nonDispose(unsubscribe);"
  },
  {
    path: "context.getCurrentContext",
    kind: "async",
    effect: "read",
    label: "上下文 · 读取当前上下文",
    description: "显式网络读取：无论本地有没有值都去服务端取，失败时抛错。",
    signature: "(options?: ContextRequestOptions): Promise<NodeContext>",
    parameters: [
      {
        name: "options",
        type: 'Readonly<{ workflowId?: ID; nodeInstanceId?: ID; runId?: ID; nodeRunId?: ID; taskId?: ID; view?: NodeContext["view"]; }> | undefined',
        optional: true
      }
    ],
    example: "await sdk.context.getCurrentContext(input.options)"
  },
  {
    path: "context.ensureLoaded",
    kind: "async",
    effect: "read",
    label: "上下文 · 确保上下文已加载",
    description: "已有同一个 nodeRunId/view 的值就直接返回；否则读一次，失败只落到 error。",
    signature: "(options?: ContextRequestOptions): Promise<void>",
    parameters: [
      {
        name: "options",
        type: 'Readonly<{ workflowId?: ID; nodeInstanceId?: ID; runId?: ID; nodeRunId?: ID; taskId?: ID; view?: NodeContext["view"]; }> | undefined',
        optional: true
      }
    ],
    example: "await sdk.context.ensureLoaded(input.options)"
  },
  {
    path: "context.refresh",
    kind: "async",
    effect: "read",
    label: "上下文 · 刷新",
    description: "强制重读，失败不抛错（失败信息在 error 里）。",
    signature: "(options?: ContextRequestOptions): Promise<void>",
    parameters: [
      {
        name: "options",
        type: 'Readonly<{ workflowId?: ID; nodeInstanceId?: ID; runId?: ID; nodeRunId?: ID; taskId?: ID; view?: NodeContext["view"]; }> | undefined',
        optional: true
      }
    ],
    example: "await sdk.context.refresh(input.options)"
  },
  {
    path: "nodes.getRun",
    kind: "async",
    effect: "read",
    label: "节点 · 读取节点运行",
    description: "节点 · 读取节点运行；参数与返回值遵循公开 SDK 合同。",
    signature: "(nodeRunId: string): Promise<NodeExecutionInfo>",
    parameters: [
      {
        name: "nodeRunId",
        type: "string"
      }
    ],
    example: "await sdk.nodes.getRun(input.nodeRunId)"
  },
  {
    path: "nodes.cancel",
    kind: "async",
    effect: "write",
    label: "节点 · 取消",
    description: "节点 · 取消；参数与返回值遵循公开 SDK 合同。",
    signature: "(nodeRunId: string): Promise<NodeExecutionInfo>",
    parameters: [
      {
        name: "nodeRunId",
        type: "string"
      }
    ],
    example: "await sdk.nodes.cancel(input.nodeRunId)"
  },
  {
    path: "nodes.continue",
    kind: "async",
    effect: "write",
    label: "节点 · 继续",
    description: "节点 · 继续；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: ContinueNodeBody): Promise<NodeOperationAccepted>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ actionId: ID; nodeRunId: ID; expectedGateRevision: string; expectedWaitingTurn?: number; }>",
        fields: [
          {
            name: "actionId",
            type: "string"
          },
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "expectedGateRevision",
            type: "string"
          },
          {
            name: "expectedWaitingTurn",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodes.continue(input.body)"
  },
  {
    path: "nodes.list",
    kind: "async",
    effect: "read",
    label: "节点 · 列出",
    description: "节点 · 列出；参数与返回值遵循公开 SDK 合同。",
    signature: "(): Promise<WorkflowNode[]>",
    parameters: [],
    example: "await sdk.nodes.list()"
  },
  {
    path: "nodes.get",
    kind: "async",
    effect: "read",
    label: "节点 · 读取",
    description: "节点 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(code: string): Promise<WorkflowNode>",
    parameters: [
      {
        name: "code",
        type: "string"
      }
    ],
    example: "await sdk.nodes.get(input.code)"
  },
  {
    path: "nodes.resolveIdentity",
    kind: "async",
    effect: "read",
    label: "节点 · 解析身份",
    description: "节点 · 解析身份；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeIdentityQuery): Promise<NodeIdentity>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ runId: string; nodeKey?: string; nodeRunId?: string; }>",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeKey",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodes.resolveIdentity(input.query)"
  },
  {
    path: "nodes.tasks",
    kind: "async",
    effect: "read",
    label: "节点 · 任务列表",
    description: "节点 · 任务列表；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeTaskQuery): Promise<NodeTaskPage>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ runId: string; nodeInstanceId: string; status?: string; page?: number; pageSize?: number; }>",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "status",
            type: "string | undefined",
            optional: true
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodes.tasks(input.query)"
  },
  {
    path: "nodes.executions",
    kind: "async",
    effect: "read",
    label: "节点 · 执行列表",
    description: "节点 · 执行列表；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeTaskQuery): Promise<NodeTaskPage>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ runId: string; nodeInstanceId: string; status?: string; page?: number; pageSize?: number; }>",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "status",
            type: "string | undefined",
            optional: true
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.nodes.executions(input.query)"
  },
  {
    path: "nodes.rerun",
    kind: "async",
    effect: "write",
    label: "节点 · 重新运行",
    description: "节点 · 重新运行；参数与返回值遵循公开 SDK 合同。",
    signature: "(runId: string, nodeKey: string, nodeRunId: string): Promise<WorkflowRunLike>",
    parameters: [
      {
        name: "runId",
        type: "string"
      },
      {
        name: "nodeKey",
        type: "string"
      },
      {
        name: "nodeRunId",
        type: "string"
      }
    ],
    example: "await sdk.nodes.rerun(input.runId, input.nodeKey, input.nodeRunId)"
  },
  {
    path: "configuration.get",
    kind: "async",
    effect: "read",
    label: "配置 · 读取",
    description: "配置 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(target: ConfigurationTarget): Promise<ConfigurationSnapshot>",
    parameters: [
      {
        name: "target",
        type: "ConfigurationTarget",
        fields: [
          {
            name: "workflowId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "runId",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.configuration.get(input.target)"
  },
  {
    path: "configuration.save",
    kind: "async",
    effect: "write",
    label: "配置 · 保存",
    description: "配置 · 保存；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: SaveWorkflowBody): Promise<SaveWorkflowResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ workflowId: string; expectedRevision: string; name: string; description: string; coverUrl: string; graph: WorkflowGraph; definitionUpdates?: readonly Readonly<{ nodeInstanceId: string; targetCatalogInstanceId: string; targetDefinitionHash: string; }>[]; businessTag?: WorkflowBusinessTag; pausedRun?: SaveContext; }>",
        fields: [
          {
            name: "workflowId",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "description",
            type: "string"
          },
          {
            name: "coverUrl",
            type: "string"
          },
          {
            name: "graph",
            type: "WorkflowGraph"
          },
          {
            name: "definitionUpdates",
            type: "readonly Readonly<{ nodeInstanceId: string; targetCatalogInstanceId: string; targetDefinitionHash: string; }>[] | undefined",
            optional: true
          },
          {
            name: "businessTag",
            type: "WorkflowBusinessTag | undefined",
            optional: true
          },
          {
            name: "pausedRun",
            type: "Readonly<{ runId: string; expectedRunRevision: string; expectedPauseRequestId: string; }> | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.configuration.save(input.body)"
  },
  {
    path: "configuration.copy",
    kind: "async",
    effect: "write",
    label: "配置 · 复制",
    description: "配置 · 复制；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: CopyWorkflowBody): Promise<WorkflowCreatedResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ workflowId: ID; expectedRevision: Revision; }>",
        fields: [
          {
            name: "workflowId",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.configuration.copy(input.body)"
  },
  {
    path: "panel.getBundle",
    kind: "async",
    effect: "read",
    label: "页面 · 读取页面包",
    description: "页面 · 读取页面包；参数与返回值遵循公开 SDK 合同。",
    signature: "(target: PanelBundleQuery): Promise<PageBundle | null>",
    parameters: [
      {
        name: "target",
        type: "PanelBundleQuery",
        fields: [
          {
            name: "workflowId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeInstanceId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "runId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "taskId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | "preview" | undefined',
            optional: true
          },
          {
            name: "surface",
            type: "PanelSurface | undefined",
            optional: true,
            description: "省略时继续读取业务面板资源。"
          }
        ]
      }
    ],
    example: "await sdk.panel.getBundle(input.target)"
  },
  {
    path: "panel.getSource",
    kind: "async",
    effect: "read",
    label: "页面 · 读取页面源码",
    description: "读取页面包的编译产物。产物可达数 MB，因此不随元数据下发：按修订与内容哈希\n单独取一次，宿主进程内缓存。哈希不匹配说明元数据已过期，需要重读元数据。",
    signature: "(target: PageBundleSourceQuery): Promise<PageBundleSource | null>",
    parameters: [
      {
        name: "target",
        type: "PageBundleSourceQuery",
        fields: [
          {
            name: "workflowId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeInstanceId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "runId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "taskId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | "preview" | undefined',
            optional: true
          },
          {
            name: "surface",
            type: "PanelSurface | undefined",
            optional: true
          },
          {
            name: "viewHash",
            type: "string | undefined",
            optional: true
          },
          {
            name: "programHash",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.panel.getSource(input.target)"
  },
  {
    path: "data.read",
    kind: "async",
    effect: "read",
    label: "数据 · 读取数据",
    description: "数据 · 读取数据；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: DataReadBody): Promise<DataReadResult>",
    parameters: [
      {
        name: "body",
        type: "DataReadBody",
        fields: [
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "refId",
            type: "string"
          },
          {
            name: "sha256",
            type: "string"
          },
          {
            name: "runId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "kind",
            type: '"json" | "file" | "record_set"'
          },
          {
            name: "cursor",
            type: "string | undefined",
            optional: true
          },
          {
            name: "limit",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.data.read(input.body)"
  },
  {
    path: "resources.list",
    kind: "async",
    effect: "read",
    label: "业务资源 · 列出",
    description: "业务资源 · 列出；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeResourceListBody): Promise<NodeResourcePage>",
    parameters: [
      {
        name: "body",
        type: "NodeResourceListBody",
        fields: [
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "resource",
            type: "string"
          },
          {
            name: "query",
            type: "JSONObject | undefined",
            optional: true
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.resources.list(input.body)"
  },
  {
    path: "resources.get",
    kind: "async",
    effect: "read",
    label: "业务资源 · 读取",
    description: "业务资源 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeResourceGetBody): Promise<NodeResourceRecord>",
    parameters: [
      {
        name: "body",
        type: "NodeResourceGetBody",
        fields: [
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "resource",
            type: "string"
          },
          {
            name: "id",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.resources.get(input.body)"
  },
  {
    path: "resources.update",
    kind: "async",
    effect: "write",
    label: "业务资源 · 更新",
    description: "业务资源 · 更新；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: NodeResourceUpdateBody): Promise<NodeResourceRecord>",
    parameters: [
      {
        name: "body",
        type: "NodeResourceUpdateBody",
        fields: [
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "resource",
            type: "string"
          },
          {
            name: "id",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string | undefined",
            optional: true
          },
          {
            name: "changes",
            type: "JSONObject"
          }
        ]
      }
    ],
    example: "await sdk.resources.update(input.body)"
  },
  {
    path: "activities.list",
    kind: "async",
    effect: "read",
    label: "活动记录 · 列出",
    description: "活动记录 · 列出；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeActivityQuery): Promise<NodeActivityList>",
    parameters: [
      {
        name: "query",
        type: "NodeActivityQuery",
        fields: [
          {
            name: "workflowId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeInstanceId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "runId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "taskId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | "preview" | undefined',
            optional: true
          },
          {
            name: "afterSeq",
            type: "number | undefined",
            optional: true
          },
          {
            name: "limit",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.activities.list(input.query)"
  },
  {
    path: "run.state",
    kind: "async",
    effect: "read",
    label: "运行 · 读取统计",
    description: "运行 · 读取统计；参数与返回值遵循公开 SDK 合同。",
    signature: "(runId: string): Promise<WorkflowRunStatistics>",
    parameters: [
      {
        name: "runId",
        type: "string"
      }
    ],
    example: "await sdk.run.state(input.runId)"
  },
  {
    path: "run.getActiveRun",
    kind: "async",
    effect: "read",
    label: "运行 · 读取活动运行",
    description: "当前未结束的运行；没有活动运行时是 null，不是错误。",
    signature: "(workflowId: ID): Promise<WorkflowRunLike | null>",
    parameters: [
      {
        name: "workflowId",
        type: "string"
      }
    ],
    example: "await sdk.run.getActiveRun(input.workflowId)"
  },
  {
    path: "incoming.list",
    kind: "async",
    effect: "read",
    label: "输入投递 · 列出",
    description: "输入投递 · 列出；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: IncomingListQuery): Promise<IncomingListResult>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ nodeInstanceId: ID; runId: ID; cursor?: string; limit?: number; }>",
        fields: [
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "runId",
            type: "string"
          },
          {
            name: "cursor",
            type: "string | undefined",
            optional: true
          },
          {
            name: "limit",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.incoming.list(input.query)"
  },
  {
    path: "inputHistory.list",
    kind: "async",
    effect: "read",
    label: "输入历史 · 列出",
    description: "输入历史 · 列出；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: InputHistoryQuery): Promise<InputHistoryResult>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ nodeInstanceId: ID; cursor?: string; }>",
        fields: [
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "cursor",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.inputHistory.list(input.query)"
  },
  {
    path: "inputs.prepare",
    kind: "async",
    effect: "write",
    label: "输入 · 准备输入",
    description: "输入 · 准备输入；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: PrepareNodeInputBody): Promise<PreparedInputReceipt>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ inputRequestId: ID; values: JSONObject; usedRefs: readonly SourceRef[]; expectedGateRevision: Revision; expectedConfigRevisionId: ID; expectedProgramHash: string; inboxWatermark: Revision; fieldSources: Readonly<Record<string, readonly SourceRef[]>>; }>",
        fields: [
          {
            name: "inputRequestId",
            type: "string"
          },
          {
            name: "values",
            type: "JSONObject"
          },
          {
            name: "usedRefs",
            type: 'readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]'
          },
          {
            name: "expectedGateRevision",
            type: "string"
          },
          {
            name: "expectedConfigRevisionId",
            type: "string"
          },
          {
            name: "expectedProgramHash",
            type: "string"
          },
          {
            name: "inboxWatermark",
            type: "string"
          },
          {
            name: "fieldSources",
            type: 'Readonly<Record<string, readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]>>'
          }
        ]
      }
    ],
    example: "await sdk.inputs.prepare(input.body)"
  },
  {
    path: "inputs.execute",
    kind: "async",
    effect: "write",
    label: "输入 · 执行输入",
    description: "输入 · 执行输入；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: ExecutePreparedBody): Promise<NodeRunReceipt>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ runId: ID; inputRequestId: ID; inputManifestId: ID; expectedGateRevision: Revision; }>",
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "inputRequestId",
            type: "string"
          },
          {
            name: "inputManifestId",
            type: "string"
          },
          {
            name: "expectedGateRevision",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.inputs.execute(input.body)"
  },
  {
    path: "outputs.get",
    kind: "async",
    effect: "read",
    label: "输出 · 读取",
    description: "输出 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(nodeRunId: ID): Promise<NodeOutput>",
    parameters: [
      {
        name: "nodeRunId",
        type: "string"
      }
    ],
    example: "await sdk.outputs.get(input.nodeRunId)"
  },
  {
    path: "outputs.getNode",
    kind: "async",
    effect: "read",
    label: "输出 · 读取节点输出页",
    description: "输出 · 读取节点输出页；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeOutputPageQuery): Promise<NodeOutputPage>",
    parameters: [
      {
        name: "query",
        type: 'Readonly<{ runId: ID; nodeInstanceId: ID; page?: number; pageSize?: number; view?: "current" | "history"; }>',
        fields: [
          {
            name: "runId",
            type: "string"
          },
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "page",
            type: "number | undefined",
            optional: true
          },
          {
            name: "pageSize",
            type: "number | undefined",
            optional: true
          },
          {
            name: "view",
            type: '"current" | "history" | undefined',
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.outputs.getNode(input.query)"
  },
  {
    path: "outputs.write",
    kind: "async",
    effect: "write",
    label: "输出 · 写入输出",
    description: "输出 · 写入输出；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: WriteNodeOutputBody): Promise<NodeOutputWriteResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ nodeRunId: ID; output: JSONObject; }>",
        fields: [
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "output",
            type: "JSONObject"
          }
        ]
      }
    ],
    example: "await sdk.outputs.write(input.body)"
  },
  {
    path: "outputs.advance",
    kind: "async",
    effect: "write",
    label: "输出 · 推进输出",
    description: "输出 · 推进输出；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: AdvanceNodeOutputBody): Promise<AdvanceNodeOutputResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ nodeRunId: ID; }>",
        fields: [
          {
            name: "nodeRunId",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.outputs.advance(input.body)"
  },
  {
    path: "actions.invoke",
    kind: "async",
    effect: "write",
    label: "人工动作 · 提交声明动作",
    description: "人工动作 · 提交声明动作；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: InvokeNodeActionBody): Promise<NodeOperationAccepted>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ actionId: ID; nodeRunId: ID; waitingToolCallId: ID; action: string; payloadJson: JSONObject; }>",
        fields: [
          {
            name: "actionId",
            type: "string"
          },
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "waitingToolCallId",
            type: "string"
          },
          {
            name: "action",
            type: "string"
          },
          {
            name: "payloadJson",
            type: "JSONObject"
          }
        ]
      }
    ],
    example: "await sdk.actions.invoke(input.body)"
  },
  {
    path: "actions.history",
    kind: "async",
    effect: "read",
    label: "人工动作 · 查询人工动作历史",
    description: "人工动作 · 查询人工动作历史；参数与返回值遵循公开 SDK 合同。",
    signature: "(query: NodeOperationHistoryQuery): Promise<NodeOperationHistoryPage>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ nodeRunId: ID; afterSequence?: string; snapshotUpperSequence?: string; limit?: number; }>",
        fields: [
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "afterSequence",
            type: "string | undefined",
            optional: true
          },
          {
            name: "snapshotUpperSequence",
            type: "string | undefined",
            optional: true
          },
          {
            name: "limit",
            type: "number | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.actions.history(input.query)"
  },
  {
    path: "actions.reply",
    kind: "async",
    effect: "write",
    label: "人工动作 · 回复",
    description: "人工动作 · 回复；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: ReplyNodeBody): Promise<ReplyNodeResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ actionId: ID; nodeRunId: ID; waitingToolCallId: ID; answer: JSONValue; }>",
        fields: [
          {
            name: "actionId",
            type: "string"
          },
          {
            name: "nodeRunId",
            type: "string"
          },
          {
            name: "waitingToolCallId",
            type: "string"
          },
          {
            name: "answer",
            type: "JSONValue"
          }
        ]
      }
    ],
    example: "await sdk.actions.reply(input.body)"
  },
  {
    path: "actions.submit",
    kind: "async",
    effect: "write",
    label: "人工动作 · 提交",
    description: "人工动作 · 提交；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: SubmitWaitActionBody): Promise<SubmitWaitActionResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ nodeInstanceId: ID; waitId: ID; expectedWaitRevision: Revision; action: string; payload: JSONObject; }>",
        fields: [
          {
            name: "nodeInstanceId",
            type: "string"
          },
          {
            name: "waitId",
            type: "string"
          },
          {
            name: "expectedWaitRevision",
            type: "string"
          },
          {
            name: "action",
            type: "string"
          },
          {
            name: "payload",
            type: "JSONObject"
          }
        ]
      }
    ],
    example: "await sdk.actions.submit(input.body)"
  },
  {
    path: "actions.get",
    kind: "async",
    effect: "read",
    label: "人工动作 · 读取",
    description: "按动作 ID 或节点执行回读动作。",
    signature: "(query: NodeActionQuery): Promise<NodeActionView>",
    parameters: [
      {
        name: "query",
        type: "Readonly<{ actionId?: ID; nodeRunId?: ID; taskId?: ID; }>",
        fields: [
          {
            name: "actionId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "nodeRunId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "taskId",
            type: "string | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.actions.get(input.query)"
  },
  {
    path: "operations.get",
    kind: "async",
    effect: "read",
    label: "操作状态 · 读取",
    description: "读一次原子调用的当前状态；结果未知时业务上仍会阻塞关闭。",
    signature: "(operationId: ID): Promise<OperationSnapshot>",
    parameters: [
      {
        name: "operationId",
        type: "string"
      }
    ],
    example: "await sdk.operations.get(input.operationId)"
  },
  {
    path: "control.start",
    kind: "async",
    effect: "read",
    label: "执行控制 · 启动工作流",
    description: "使用已保存修订启动工作流，结果未知时不得自动重发。",
    signature: "(body: StartWorkflowRunBody): Promise<WorkflowRunLike>",
    parameters: [
      {
        name: "body",
        type: 'Readonly<{ workflowId: ID; expectedRevision: Revision; isTestRun: boolean; mode: "auto" | "manual"; scope?: ExecutionScope; initialDeliveries?: readonly InitialDelivery[]; reuseOutputs?: readonly ReusedOutput[]; }>',
        fields: [
          {
            name: "workflowId",
            type: "string"
          },
          {
            name: "expectedRevision",
            type: "string"
          },
          {
            name: "isTestRun",
            type: "boolean"
          },
          {
            name: "mode",
            type: '"auto" | "manual"'
          },
          {
            name: "scope",
            type: 'Readonly<{ kind: "all" | "selected"; nodeInstanceIds: readonly ID[]; includeDescendants: boolean; }> | undefined',
            optional: true
          },
          {
            name: "initialDeliveries",
            type: "readonly Readonly<{ targetInstanceId: ID; channel: string; values: JSONObject; }>[] | undefined",
            optional: true
          },
          {
            name: "reuseOutputs",
            type: "readonly Readonly<{ nodeInstanceId: ID; nodeRunId: ID; }>[] | undefined",
            optional: true
          }
        ]
      }
    ],
    example: "await sdk.control.start(input.body)"
  },
  {
    path: "control.get",
    kind: "async",
    effect: "read",
    label: "执行控制 · 读取",
    description: "执行控制 · 读取；参数与返回值遵循公开 SDK 合同。",
    signature: "(target: WorkflowExecutionTarget, options?: MofangRequestOptions): Promise<ExecutionControlSnapshot>",
    parameters: [
      {
        name: "target",
        type: 'Readonly<{ kind: "workflow_run" | "node_run"; id: string; }>',
        fields: [
          {
            name: "kind",
            type: '"workflow_run" | "node_run"'
          },
          {
            name: "id",
            type: "string"
          }
        ]
      },
      {
        name: "options",
        type: "Readonly<{ signal?: AbortSignal; fresh?: boolean; }> | undefined",
        optional: true
      }
    ],
    example: "await sdk.control.get(input.target, input.options)"
  },
  {
    path: "control.getRequest",
    kind: "async",
    effect: "read",
    label: "执行控制 · getRequest",
    description: "执行控制 · getRequest；参数与返回值遵循公开 SDK 合同。",
    signature: "(target: WorkflowExecutionTarget, requestId: string, options?: MofangRequestOptions): Promise<ExecutionControlRequest>",
    parameters: [
      {
        name: "target",
        type: 'Readonly<{ kind: "workflow_run" | "node_run"; id: string; }>',
        fields: [
          {
            name: "kind",
            type: '"workflow_run" | "node_run"'
          },
          {
            name: "id",
            type: "string"
          }
        ]
      },
      {
        name: "requestId",
        type: "string"
      },
      {
        name: "options",
        type: "Readonly<{ signal?: AbortSignal; fresh?: boolean; }> | undefined",
        optional: true
      }
    ],
    example: "await sdk.control.getRequest(input.target, input.requestId, input.options)"
  },
  {
    path: "control.pause",
    kind: "async",
    effect: "write",
    label: "执行控制 · 暂停",
    description: "执行控制 · 暂停；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: PauseExecutionRequest): Promise<ExecutionControlReceipt>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ target: WorkflowExecutionTarget; reason: string; }>",
        fields: [
          {
            name: "target",
            type: 'Readonly<{ kind: "workflow_run" | "node_run"; id: string; }>'
          },
          {
            name: "reason",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.control.pause(input.body)"
  },
  {
    path: "control.resume",
    kind: "async",
    effect: "write",
    label: "执行控制 · 恢复",
    description: "执行控制 · 恢复；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: ResumeExecutionRequest): Promise<ExecutionControlReceipt>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ target: WorkflowExecutionTarget; pauseRequestId: string; }>",
        fields: [
          {
            name: "target",
            type: 'Readonly<{ kind: "workflow_run" | "node_run"; id: string; }>'
          },
          {
            name: "pauseRequestId",
            type: "string"
          }
        ]
      }
    ],
    example: "await sdk.control.resume(input.body)"
  },
  {
    path: "control.interrupt",
    kind: "async",
    effect: "write",
    label: "执行控制 · 中断",
    description: "执行控制 · 中断；参数与返回值遵循公开 SDK 合同。",
    signature: "(body: InterruptBody): Promise<ExecutionControlReceipt>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ target: Readonly<ExecutionReference>; reasonCode: string; message: string; relatedOperationId?: ID; requiredFields: readonly JSONObject[]; allowedRecoveryActions: readonly string[]; }>",
        fields: [
          {
            name: "target",
            type: "Readonly<ExecutionReference>"
          },
          {
            name: "reasonCode",
            type: "string"
          },
          {
            name: "message",
            type: "string"
          },
          {
            name: "relatedOperationId",
            type: "string | undefined",
            optional: true
          },
          {
            name: "requiredFields",
            type: "readonly JSONObject[]"
          },
          {
            name: "allowedRecoveryActions",
            type: "readonly string[]"
          }
        ]
      }
    ],
    example: "await sdk.control.interrupt(input.body)"
  }
];
const rejected = (message, code = "input_invalid") => new MofangSDKError(message, {
  kind: code === "revision_conflict" ? "conflict" : "rejected",
  code,
  retryable: false
});
function createMockNodeFlow(target, seed) {
  let view = seed ? structuredClone(seed) : {
    ...target,
    sessionId: "preview-session",
    revision: "1",
    status: "waiting",
    mode: "manual",
    reviewPoint: true,
    inputClosed: true,
    productionFinished: true,
    nodeView: null,
    composition: {
      abi: "mf.node/1",
      snapshot: {
        sourceHash: "preview",
        sessionRevision: "1",
        configDigest: "preview",
        factsDigest: "preview"
      },
      projection: {
        status: "ready",
        nodeView: { preview: true },
        actions: []
      }
    },
    nodeOutput: {
      ...target,
      sessionId: "preview-session",
      items: [
        {
          id: "preview-candidate",
          revision: "1",
          state: "pending",
          value: { items: [{ title: "预览候选" }] },
          inputRefs: [],
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z"
        }
      ],
      total: 1,
      page: 1,
      pageSize: 20
    },
    summary: {
      queued: 0,
      running: 0,
      waiting: 0,
      unknown: 0,
      failed: 0,
      unresolved: 0,
      pendingEvents: 0,
      candidates: 1,
      pending: 1,
      released: 0,
      removed: 0
    },
    permissions: {
      canEdit: true,
      canRelease: true,
      canDiscard: true,
      canAct: false,
      canEndReview: false,
      canControl: false,
      canResolveUnknown: false
    }
  };
  const operations = /* @__PURE__ */ new Set([
    "nodeFlow.get",
    "nodeFlow.listCandidates",
    "nodeFlow.tasks",
    "nodeFlow.editCandidate",
    "nodeFlow.release",
    "nodeFlow.discard"
  ]);
  function replace(candidate2) {
    const items = view.nodeOutput.items.map(
      (item) => item.id === candidate2.id ? candidate2 : item
    );
    const revision = String(Number(view.revision) + 1);
    view = {
      ...view,
      revision,
      composition: {
        ...view.composition,
        snapshot: {
          ...view.composition.snapshot,
          sessionRevision: revision
        }
      },
      nodeOutput: { ...view.nodeOutput, items },
      summary: {
        ...view.summary,
        pending: items.filter((i) => i.state === "pending").length,
        released: items.filter((i) => i.state === "released").length,
        removed: items.filter((i) => i.state === "removed").length
      }
    };
  }
  function candidate(id, revision) {
    const item = view.nodeOutput.items.find((item2) => item2.id === id);
    if (!item) throw rejected("预览候选不存在");
    if (item.revision !== revision)
      throw rejected("候选修订已变化，请重新读取", "revision_conflict");
    if (item.state !== "pending") throw rejected("只有待审核候选可以修改");
    return item;
  }
  return {
    operations,
    request(operation, body) {
      if (body.runId !== view.runId || body.nodeInstanceId !== view.nodeInstanceId)
        throw rejected("预览目标与当前节点不一致");
      const page = typeof body.page === "number" ? body.page : 1;
      const pageSize = typeof body.pageSize === "number" ? body.pageSize : 20;
      const outputPage = {
        ...view.nodeOutput,
        page,
        pageSize,
        items: view.nodeOutput.items.slice(
          (page - 1) * pageSize,
          page * pageSize
        )
      };
      if (operation === "nodeFlow.get")
        return structuredClone({ ...view, nodeOutput: outputPage });
      if (operation === "nodeFlow.listCandidates")
        return structuredClone(outputPage);
      if (operation === "nodeFlow.tasks")
        return {
          ...target,
          sessionId: view.sessionId,
          items: [],
          total: 0,
          page,
          pageSize
        };
      if (operation === "nodeFlow.editCandidate") {
        const item = candidate(body.candidateId, body.expectedRevision);
        if (!view.permissions.canEdit)
          throw rejected(
            "预览节点不允许编辑候选",
            "permission_denied"
          );
        const value = body.value;
        if (!value || Array.isArray(value) || !Array.isArray(value.items) || value.items.length !== 1)
          throw rejected("候选 value.items 必须恰好包含一项");
        const result = {
          ...item,
          revision: String(Number(item.revision) + 1),
          value: structuredClone(value),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        replace(result);
        return structuredClone(result);
      }
      if (operation === "nodeFlow.release" || operation === "nodeFlow.discard") {
        if (!(operation === "nodeFlow.release" ? view.permissions.canRelease : view.permissions.canDiscard))
          throw rejected(
            "预览节点不允许此候选操作",
            "permission_denied"
          );
        if (!Array.isArray(body.candidates) || !body.candidates.length)
          throw rejected("请选择候选");
        return {
          items: body.candidates.map((ref) => {
            try {
              const item = candidate(ref.id, ref.expectedRevision);
              const next = {
                ...item,
                revision: String(Number(item.revision) + 1),
                state: operation === "nodeFlow.release" ? "released" : "removed",
                updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
                ...operation === "nodeFlow.release" ? {
                  releasedValue: structuredClone(
                    item.value
                  ),
                  releasedAt: (/* @__PURE__ */ new Date()).toISOString()
                } : {}
              };
              replace(next);
              return {
                id: item.id,
                status: "applied",
                candidate: structuredClone(next)
              };
            } catch (error) {
              if (!(error instanceof MofangSDKError)) throw error;
              return {
                id: ref.id,
                status: "rejected",
                error: {
                  code: error.code,
                  message: error.message
                }
              };
            }
          })
        };
      }
      throw rejected("预览未模拟此操作", "operation_unavailable");
    }
  };
}
const services = /* @__PURE__ */ new WeakMap();
function createWorkflowSdkService(options) {
  const { sdk } = options;
  const target = Object.freeze({ ...options.target });
  const key = JSON.stringify([target, Boolean(options.readOnly)]);
  const cached = services.get(sdk)?.get(key);
  if (cached) return cached;
  const value = /* @__PURE__ */ Object.create(null);
  for (const method of WORKFLOW_SDK_METHODS) {
    const parts = method.path.split(".");
    let facade = value;
    for (const part of parts.slice(0, -1)) {
      facade[part] ??= /* @__PURE__ */ Object.create(null);
      facade = facade[part];
    }
    facade[parts.at(-1)] = (...args) => {
      const invoke = () => {
        if (method.effect === "write" && (options.readOnly || target.view === "history")) {
          throw new MofangSDKError(
            "当前面板为只读，不能执行 SDK 写入",
            {
              kind: "rejected",
              code: "readonly_view",
              retryable: false
            }
          );
        }
        let owner = sdk;
        for (const part of parts.slice(0, -1))
          owner = owner?.[part];
        const fn = owner?.[parts.at(-1)];
        if (typeof fn !== "function")
          throw new MofangSDKError(`当前 SDK 未提供 ${method.path}`, {
            kind: "rejected",
            code: "operation_unavailable",
            retryable: false
          });
        return Reflect.apply(fn, owner, args);
      };
      if (method.kind !== "async") return invoke();
      try {
        return Promise.resolve(invoke());
      } catch (error) {
        return Promise.reject(error);
      }
    };
  }
  const service = {
    version: WORKFLOW_SDK_VERSION,
    actionPrefix: "sdk.",
    methods: WORKFLOW_SDK_METHODS,
    value,
    subscribe: sdk.subscribe.bind(sdk),
    target
  };
  const entries = services.get(sdk) ?? /* @__PURE__ */ new Map();
  if (entries.size >= 64) entries.delete(entries.keys().next().value);
  entries.set(key, service);
  services.set(sdk, entries);
  return service;
}
function createMockWorkflowSdkService(options = {}) {
  const target = {
    workflowId: "preview-workflow",
    runId: "preview-run",
    nodeInstanceId: "preview-node",
    view: "preview",
    ...options.target
  };
  const context = options.context ?? {
    sdkVersion: "1",
    contextRevision: "1",
    workflowId: target.workflowId,
    workspaceId: "preview-workspace",
    spaceId: "preview-space",
    nodeInstanceId: target.nodeInstanceId,
    nodeKey: "preview-node",
    runId: target.runId,
    nodeRunId: target.nodeRunId,
    taskId: target.taskId,
    mode: "manual",
    view: target.view,
    input: null,
    config: {},
    configRevisionId: "preview-config",
    inboxWatermark: "0",
    predecessorRefs: [],
    state: { status: "waiting", phase: "preview", closure: "open" },
    control: {
      revision: "1",
      desiredState: "running",
      phase: "applied",
      reasons: [],
      inFlightToolCount: 0,
      unknownToolCount: 0
    },
    permissions: {
      canEditConfig: false,
      canEditDefinition: false,
      canPrepare: false,
      canExecute: false,
      canCommit: false
    },
    panel: { revisionId: "preview-panel", renderMode: "lowcode" },
    settingsPanel: { revisionId: "preview-settings", renderMode: "lowcode" }
  };
  const flow = createMockNodeFlow(target, options.nodeView);
  const sdk = createMofangSDK({
    defaultContext: target,
    transportRetries: 0,
    transport: {
      async request(operation, payload) {
        if (operation === "context.get") {
          for (const key of [
            "workflowId",
            "runId",
            "nodeInstanceId",
            "nodeRunId",
            "taskId"
          ]) {
            if (payload[key] !== void 0 && payload[key] !== context[key])
              throw new MofangSDKError(
                "预览目标与当前上下文不一致",
                {
                  kind: "rejected",
                  code: "input_invalid",
                  retryable: false
                }
              );
          }
          return context;
        }
        if (flow.operations.has(operation))
          return flow.request(operation, payload);
        throw new MofangSDKError(
          `预览未模拟 ${operation}；此操作需要真实工作流宿主`,
          {
            kind: "rejected",
            code: "operation_unavailable",
            retryable: false
          }
        );
      }
    }
  });
  const service = createWorkflowSdkService({ sdk, target });
  const supported = /* @__PURE__ */ new Set([
    "getState",
    "subscribe",
    "context.getCurrentContext",
    "context.ensureLoaded",
    "context.refresh",
    "context.getState",
    "context.getSnapshot",
    "context.subscribe",
    "nodeFlow.watch",
    ...flow.operations
  ]);
  for (const method of service.methods) {
    if (supported.has(method.path)) continue;
    const parts = method.path.split(".");
    let owner = service.value;
    for (const part of parts.slice(0, -1))
      owner = owner[part];
    owner[parts.at(-1)] = () => {
      const error = new MofangSDKError(
        `预览未模拟 ${method.path}；此操作需要真实工作流宿主`,
        {
          kind: "rejected",
          code: "operation_unavailable",
          retryable: false
        }
      );
      if (method.kind === "async") return Promise.reject(error);
      throw error;
    };
  }
  return {
    ...service,
    methods: service.methods.map(
      (method) => supported.has(method.path) ? method : {
        ...method,
        unavailableReason: "预览未模拟此方法；正式运行由真实工作流宿主提供。"
      }
    )
  };
}
export {
  WORKFLOW_SDK_METHODS,
  WORKFLOW_SDK_VERSION,
  createMockWorkflowSdkService,
  createWorkflowSdkService
};
