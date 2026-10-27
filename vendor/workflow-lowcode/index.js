import {
  jsonValues,
  resolveSettingsFormId,
  settingsFields
} from "./chunk-CJ25FB45.js";

// src/lib/low-code/runtime-core/values.ts
var unsafe = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
var safeKey = (key) => !!key && !unsafe.has(key);
var clone = (value) => value === void 0 ? value : JSON.parse(JSON.stringify(value));

// src/lib/low-code/runtime-core/capabilities.ts
var checkName = (method) => {
  if (!method || method.split(".").some(
    (part) => !part || ["__proto__", "constructor", "prototype"].includes(part)
  ))
    throw new Error("\u80FD\u529B\u540D\u79F0\u65E0\u6548");
};
function checkJson(value, limit) {
  let nodes = 0;
  const seen = /* @__PURE__ */ new Set();
  const visit = (item, depth) => {
    if (++nodes > 1e4 || depth > 32) throw new Error("\u811A\u672C\u6570\u636E\u7ED3\u6784\u8D85\u9650");
    if (item === null || typeof item === "string" || typeof item === "boolean")
      return;
    if (typeof item === "number" && Number.isFinite(item)) return;
    if (typeof item !== "object" || !item || seen.has(item))
      throw new Error("\u811A\u672C\u53C2\u6570\u548C\u7ED3\u679C\u5FC5\u987B\u662F JSON \u6570\u636E");
    seen.add(item);
    for (const [key, child] of Object.entries(item)) {
      if (!safeKey(key)) throw new Error("\u811A\u672C\u53C2\u6570\u542B\u65E0\u6548\u5C5E\u6027");
      if (child !== void 0) visit(child, depth + 1);
    }
    seen.delete(item);
  };
  visit(value, 0);
  if (JSON.stringify(value).length > limit)
    throw new Error("\u811A\u672C\u53C2\u6570\u6216\u7ED3\u679C\u5927\u5C0F\u8D85\u9650");
}
function createCapabilityRegistry(entries = {}) {
  const allowed = /* @__PURE__ */ new Map();
  const register = (method, entry) => {
    checkName(method);
    if (!["form", "dataSource", "action", "dialog"].includes(entry.kind) || typeof entry.handler !== "function")
      throw new Error("\u80FD\u529B\u767B\u8BB0\u65E0\u6548");
    allowed.set(method, entry);
  };
  Object.entries(entries).forEach(
    ([method, entry]) => register(method, entry)
  );
  const invoke = async (method, args) => {
    const entry = allowed.get(method);
    if (!entry) throw new Error(`\u811A\u672C\u80FD\u529B\u672A\u6388\u6743\uFF1A${method}`);
    if (!Array.isArray(args) || args.length > 16)
      throw new Error("\u811A\u672C\u53C2\u6570\u6570\u91CF\u8D85\u9650");
    checkJson(args, 65536);
    const result = await entry.handler(...clone(args));
    checkJson(result, 65536);
    return clone(result);
  };
  return {
    invoke,
    has: (method) => allowed.has(method),
    list: () => [...allowed].map(([name, entry]) => ({
      name,
      kind: entry.kind,
      ...entry.label ? { label: entry.label } : {},
      ...entry.input ? { input: entry.input } : {},
      ...entry.result ? { result: entry.result } : {},
      ...entry.completion ? { completion: entry.completion } : {}
    })),
    register,
    remove: (method) => allowed.delete(method)
  };
}

// src/features/workflow/mofangsdk/lowcode/catalog.ts
var WORKFLOW_SDK_VERSION = "1";
var WORKFLOW_SDK_METHODS = [
  {
    path: "toast.success",
    kind: "async",
    effect: "read",
    label: "\u63D0\u793A \xB7 \u6210\u529F\u63D0\u793A",
    description: "\u63D0\u793A \xB7 \u6210\u529F\u63D0\u793A\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u63D0\u793A \xB7 \u4FE1\u606F\u63D0\u793A",
    description: "\u63D0\u793A \xB7 \u4FE1\u606F\u63D0\u793A\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u63D0\u793A \xB7 \u8B66\u544A\u63D0\u793A",
    description: "\u63D0\u793A \xB7 \u8B66\u544A\u63D0\u793A\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u63D0\u793A \xB7 \u9519\u8BEF\u63D0\u793A",
    description: "\u63D0\u793A \xB7 \u9519\u8BEF\u63D0\u793A\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u8BFB\u53D6",
    description: "\u8282\u70B9\u6D41 \xB7 \u8BFB\u53D6\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u5019\u9009\u5217\u8868",
    description: "\u8282\u70B9\u6D41 \xB7 \u5019\u9009\u5217\u8868\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u4EFB\u52A1\u5217\u8868",
    description: "\u8282\u70B9\u6D41 \xB7 \u4EFB\u52A1\u5217\u8868\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u8BA2\u9605\u8D44\u6E90",
    description: "\u76F8\u540C\u8EAB\u4EFD\u548C\u9875\u590D\u7528\u8D44\u6E90\uFF0C\u6700\u540E\u4E00\u4E2A\u8BA2\u9605\u91CA\u653E\u5B9E\u65F6\u76D1\u542C\u53CA\u8BA1\u65F6\u5668\u3002",
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
    example: "const resource = sdk.nodeFlow.watch(input.query);\nconst unsubscribe = resource.subscribe(() => { const state = resource.getSnapshot(); /* \u4F7F\u7528 state \u66F4\u65B0\u9875\u9762 */ });\nonDispose(unsubscribe);\nawait resource.refresh();"
  },
  {
    path: "nodeFlow.editCandidate",
    kind: "async",
    effect: "write",
    label: "\u8282\u70B9\u6D41 \xB7 \u7F16\u8F91\u5019\u9009",
    description: "\u8282\u70B9\u6D41 \xB7 \u7F16\u8F91\u5019\u9009\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u653E\u884C\u5019\u9009",
    description: "\u8282\u70B9\u6D41 \xB7 \u653E\u884C\u5019\u9009\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u79FB\u9664\u5019\u9009",
    description: "\u8282\u70B9\u6D41 \xB7 \u79FB\u9664\u5019\u9009\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u7ED3\u675F\u5BA1\u6838",
    description: "\u8282\u70B9\u6D41 \xB7 \u7ED3\u675F\u5BA1\u6838\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u89E6\u53D1\u4E1A\u52A1\u52A8\u4F5C",
    description: "\u8282\u70B9\u6D41 \xB7 \u89E6\u53D1\u4E1A\u52A1\u52A8\u4F5C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u8BFB\u53D6\u4E1A\u52A1\u52A8\u4F5C\u7ED3\u679C",
    description: "\u8282\u70B9\u6D41 \xB7 \u8BFB\u53D6\u4E1A\u52A1\u52A8\u4F5C\u7ED3\u679C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u4E1A\u52A1\u52A8\u4F5C\u8BB0\u5F55",
    description: "\u8282\u70B9\u6D41 \xB7 \u4E1A\u52A1\u52A8\u4F5C\u8BB0\u5F55\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u8BA2\u9605\u4E1A\u52A1\u52A8\u4F5C\u7ED3\u679C",
    description: "\u8282\u70B9\u6D41 \xB7 \u8BA2\u9605\u4E1A\u52A1\u52A8\u4F5C\u7ED3\u679C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const resource = sdk.nodeFlow.watchActionResult(input.query);\nconst unsubscribe = resource.subscribe(() => { const state = resource.getSnapshot(); /* \u4F7F\u7528 state \u66F4\u65B0\u9875\u9762 */ });\nonDispose(unsubscribe);\nawait resource.refresh();"
  },
  {
    path: "nodeFlow.pause",
    kind: "async",
    effect: "write",
    label: "\u8282\u70B9\u6D41 \xB7 \u6682\u505C",
    description: "\u8282\u70B9\u6D41 \xB7 \u6682\u505C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u6062\u590D",
    description: "\u53EA\u6062\u590D\u8282\u70B9\u7236\u7EA7\u6682\u505C\uFF0C\u4E0D\u8DF3\u8FC7\u4EBA\u5DE5\u56DE\u7B54\u6216\u5B50\u6267\u884C\u7684\u72EC\u7ACB\u6682\u505C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u53D6\u6D88",
    description: "\u8282\u70B9\u6D41 \xB7 \u53D6\u6D88\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    path: "nodeFlow.replyTask",
    kind: "async",
    effect: "write",
    label: "\u8282\u70B9\u6D41 \xB7 \u56DE\u590D\u4EFB\u52A1",
    description: "\u8282\u70B9\u6D41 \xB7 \u56DE\u590D\u4EFB\u52A1\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u7EE7\u7EED\u4EFB\u52A1",
    description: "\u8282\u70B9\u6D41 \xB7 \u7EE7\u7EED\u4EFB\u52A1\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9\u6D41 \xB7 \u6838\u5BF9\u672A\u77E5\u4EFB\u52A1",
    description: "\u4EBA\u5DE5\u6838\u5BF9\u539F\u64CD\u4F5C\uFF0C\u4E0D\u91CD\u53D1\u4E1A\u52A1\u8BF7\u6C42\uFF1B\u539F\u5B50\u4EFB\u52A1\u4FDD\u6301\u5931\u8D25\u4E8B\u5B9E\u3002",
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
            type: '"failed" | "succeeded"'
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
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u66F4\u65B0",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u66F4\u65B0\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.subscribe(input.filter, (event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ });\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onStage",
    kind: "subscribe",
    effect: "read",
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u9636\u6BB5",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u9636\u6BB5\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.onStage((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onPlan",
    kind: "subscribe",
    effect: "read",
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u8BA1\u5212",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u8BA1\u5212\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.onPlan((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onMessage",
    kind: "subscribe",
    effect: "read",
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u6D88\u606F",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u6D88\u606F\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.onMessage((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onReasoning",
    kind: "subscribe",
    effect: "read",
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u63A8\u7406",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u63A8\u7406\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.onReasoning((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onTool",
    kind: "subscribe",
    effect: "read",
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u5DE5\u5177",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u5DE5\u5177\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.onTool((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "messages.onConnectionChange",
    kind: "subscribe",
    effect: "read",
    label: "\u6D88\u606F \xB7 \u8BA2\u9605\u8FDE\u63A5\u72B6\u6001",
    description: "\u6D88\u606F \xB7 \u8BA2\u9605\u8FDE\u63A5\u72B6\u6001\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    example: "const unsubscribe = sdk.messages.onConnectionChange((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ }, input.filter);\nonDispose(unsubscribe);"
  },
  {
    path: "getState",
    kind: "snapshot",
    effect: "read",
    label: "SDK \xB7 \u8BFB\u53D6\u672C\u5730\u72B6\u6001",
    description: "\u6574\u4E2A store \u7684\u6839\u72B6\u6001\uFF1B\u53EA\u5728\u4EFB\u4E00\u8D44\u6E90\u5185\u5BB9\u53D8\u5316\u65F6\u624D\u6362\u5F15\u7528\u3002",
    signature: "(): MofangSDKState",
    parameters: [],
    example: "sdk.getState()"
  },
  {
    path: "subscribe",
    kind: "subscribe",
    effect: "read",
    label: "SDK \xB7 \u8BA2\u9605\u66F4\u65B0",
    description: "SDK \xB7 \u8BA2\u9605\u66F4\u65B0\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(listener: () => void): () => void",
    parameters: [
      {
        name: "listener",
        type: "() => void"
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.subscribe((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ });\nonDispose(unsubscribe);"
  },
  {
    path: "context.getState",
    kind: "snapshot",
    effect: "read",
    label: "\u4E0A\u4E0B\u6587 \xB7 \u8BFB\u53D6\u672C\u5730\u72B6\u6001",
    description: "\u4E0A\u4E0B\u6587 \xB7 \u8BFB\u53D6\u672C\u5730\u72B6\u6001\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: '(): Readonly<{ data: Readonly<{ sdkVersion: "1"; contextRevision: Revision; workflowId: ID; workspaceId: ID; spaceId: ID; nodeInstanceId: ID; nodeKey: string; runId?: ID; nodeRunId?: ID; taskId?: ID; mode: "auto" | "manual"; view: "current" | "history" | "preview"; inputRequestId?: ID; inputManifest?: Readonly<{ taskId: ID; id: ID; inputRequestId: ID; valuesRef: Readonly<{ id: ID; sha256: string; kind: "json" | "file" | "record_set"; }>; inputHash: string; usedRefs: readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]; fieldSources: Readonly<Record<string, readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]>>; predecessors: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; configRevisionId: ID; programHash: string; panelRevisionId: ID; inboxWatermark: Revision; createdAt: string; }>; input: JSONObject | null; config: JSONObject | null; configRevisionId: ID; pendingConfigRevisionId?: ID; inboxWatermark: Revision; predecessorRefs: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; output?: Readonly<{ nodeRunId: ID; nodeInstanceId: ID; runId: ID; status: string; generation?: number; values: JSONObject | null; writtenAt?: string; }>; plan?: Readonly<{ seq: number; updatedAt: string; explanation?: string; steps: readonly Readonly<{ id: string; title: string; status: "pending" | "in_progress" | "completed"; }>[]; }>; agentAwait?: Readonly<{ waitingToolCallId: ID; prompt: string; output?: JSONObject; }>; state: Readonly<{ status: string; phase: string; closure: "open" | "settling" | "closed"; }>; control: Readonly<{ revision: Revision; desiredState: "running" | "paused"; phase: "applying" | "applied" | "blocked"; reasons: readonly JSONObject[]; inFlightToolCount: number; unknownToolCount: number; }>; wait?: WaitEnvelope; permissions: Readonly<{ canEditConfig: boolean; canEditDefinition: boolean; canPrepare: boolean; canExecute: boolean; canCommit: boolean; }>; panel: Readonly<{ revisionId: ID; renderMode: PanelRenderMode; frontendAdapter?: string; lowcode?: Readonly<{ rendererKey: string; config: JsonObject; }>; compiledHash?: string; programHash?: string; }>; settingsPanel: SettingsPanelReference; }> | null; loading: boolean; stale: boolean; error: MofangSDKError | null; revision: Revision | null; }>',
    parameters: [],
    example: "sdk.context.getState()"
  },
  {
    path: "context.getSnapshot",
    kind: "snapshot",
    effect: "read",
    label: "\u4E0A\u4E0B\u6587 \xB7 \u8BFB\u53D6\u672C\u5730\u5FEB\u7167",
    description: "\u4E0A\u4E0B\u6587 \xB7 \u8BFB\u53D6\u672C\u5730\u5FEB\u7167\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: '(): Readonly<{ sdkVersion: "1"; contextRevision: Revision; workflowId: ID; workspaceId: ID; spaceId: ID; nodeInstanceId: ID; nodeKey: string; runId?: ID; nodeRunId?: ID; taskId?: ID; mode: "auto" | "manual"; view: "current" | "history" | "preview"; inputRequestId?: ID; inputManifest?: Readonly<{ taskId: ID; id: ID; inputRequestId: ID; valuesRef: Readonly<{ id: ID; sha256: string; kind: "json" | "file" | "record_set"; }>; inputHash: string; usedRefs: readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]; fieldSources: Readonly<Record<string, readonly Readonly<{ kind: "delivery" | "input_manifest" | "node_run_output" | "record_version" | "domain" | "config_revision" | "node_definition" | "action" | "result_proposal" | "operation"; id: ID; path?: string; }>[]>>; predecessors: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; configRevisionId: ID; programHash: string; panelRevisionId: ID; inboxWatermark: Revision; createdAt: string; }>; input: JSONObject | null; config: JSONObject | null; configRevisionId: ID; pendingConfigRevisionId?: ID; inboxWatermark: Revision; predecessorRefs: readonly Readonly<{ nodeInstanceId: ID; nodeKey: string; generation: Revision; nodeRunId: ID; sourceRunId: ID; sourceNodeRunId: ID; }>[]; output?: Readonly<{ nodeRunId: ID; nodeInstanceId: ID; runId: ID; status: string; generation?: number; values: JSONObject | null; writtenAt?: string; }>; plan?: Readonly<{ seq: number; updatedAt: string; explanation?: string; steps: readonly Readonly<{ id: string; title: string; status: "pending" | "in_progress" | "completed"; }>[]; }>; agentAwait?: Readonly<{ waitingToolCallId: ID; prompt: string; output?: JSONObject; }>; state: Readonly<{ status: string; phase: string; closure: "open" | "settling" | "closed"; }>; control: Readonly<{ revision: Revision; desiredState: "running" | "paused"; phase: "applying" | "applied" | "blocked"; reasons: readonly JSONObject[]; inFlightToolCount: number; unknownToolCount: number; }>; wait?: WaitEnvelope; permissions: Readonly<{ canEditConfig: boolean; canEditDefinition: boolean; canPrepare: boolean; canExecute: boolean; canCommit: boolean; }>; panel: Readonly<{ revisionId: ID; renderMode: PanelRenderMode; frontendAdapter?: string; lowcode?: Readonly<{ rendererKey: string; config: JsonObject; }>; compiledHash?: string; programHash?: string; }>; settingsPanel: SettingsPanelReference; }> | null',
    parameters: [],
    example: "sdk.context.getSnapshot()"
  },
  {
    path: "context.subscribe",
    kind: "subscribe",
    effect: "read",
    label: "\u4E0A\u4E0B\u6587 \xB7 \u8BA2\u9605\u66F4\u65B0",
    description: "\u4E0A\u4E0B\u6587 \xB7 \u8BA2\u9605\u66F4\u65B0\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(listener: () => void): () => void",
    parameters: [
      {
        name: "listener",
        type: "() => void"
      }
    ],
    callbackIndex: 0,
    example: "const unsubscribe = sdk.context.subscribe((event) => { /* \u5728\u8FD9\u91CC\u5904\u7406\u66F4\u65B0 */ });\nonDispose(unsubscribe);"
  },
  {
    path: "context.getCurrentContext",
    kind: "async",
    effect: "read",
    label: "\u4E0A\u4E0B\u6587 \xB7 \u8BFB\u53D6\u5F53\u524D\u4E0A\u4E0B\u6587",
    description: "\u663E\u5F0F\u7F51\u7EDC\u8BFB\u53D6\uFF1A\u65E0\u8BBA\u672C\u5730\u6709\u6CA1\u6709\u503C\u90FD\u53BB\u670D\u52A1\u7AEF\u53D6\uFF0C\u5931\u8D25\u65F6\u629B\u9519\u3002",
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
    label: "\u4E0A\u4E0B\u6587 \xB7 \u786E\u4FDD\u4E0A\u4E0B\u6587\u5DF2\u52A0\u8F7D",
    description: "\u5DF2\u6709\u540C\u4E00\u4E2A nodeRunId/view \u7684\u503C\u5C31\u76F4\u63A5\u8FD4\u56DE\uFF1B\u5426\u5219\u8BFB\u4E00\u6B21\uFF0C\u5931\u8D25\u53EA\u843D\u5230 error\u3002",
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
    label: "\u4E0A\u4E0B\u6587 \xB7 \u5237\u65B0",
    description: "\u5F3A\u5236\u91CD\u8BFB\uFF0C\u5931\u8D25\u4E0D\u629B\u9519\uFF08\u5931\u8D25\u4FE1\u606F\u5728 error \u91CC\uFF09\u3002",
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
    label: "\u8282\u70B9 \xB7 \u8BFB\u53D6\u8282\u70B9\u8FD0\u884C",
    description: "\u8282\u70B9 \xB7 \u8BFB\u53D6\u8282\u70B9\u8FD0\u884C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9 \xB7 \u53D6\u6D88",
    description: "\u8282\u70B9 \xB7 \u53D6\u6D88\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9 \xB7 \u7EE7\u7EED",
    description: "\u8282\u70B9 \xB7 \u7EE7\u7EED\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(nodeRunId: string): Promise<NodeExecutionInfo>",
    parameters: [
      {
        name: "nodeRunId",
        type: "string"
      }
    ],
    example: "await sdk.nodes.continue(input.nodeRunId)"
  },
  {
    path: "nodes.list",
    kind: "async",
    effect: "read",
    label: "\u8282\u70B9 \xB7 \u5217\u51FA",
    description: "\u8282\u70B9 \xB7 \u5217\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(): Promise<WorkflowNode[]>",
    parameters: [],
    example: "await sdk.nodes.list()"
  },
  {
    path: "nodes.get",
    kind: "async",
    effect: "read",
    label: "\u8282\u70B9 \xB7 \u8BFB\u53D6",
    description: "\u8282\u70B9 \xB7 \u8BFB\u53D6\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9 \xB7 \u89E3\u6790\u8EAB\u4EFD",
    description: "\u8282\u70B9 \xB7 \u89E3\u6790\u8EAB\u4EFD\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9 \xB7 \u4EFB\u52A1\u5217\u8868",
    description: "\u8282\u70B9 \xB7 \u4EFB\u52A1\u5217\u8868\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9 \xB7 \u6267\u884C\u5217\u8868",
    description: "\u8282\u70B9 \xB7 \u6267\u884C\u5217\u8868\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8282\u70B9 \xB7 \u91CD\u65B0\u8FD0\u884C",
    description: "\u8282\u70B9 \xB7 \u91CD\u65B0\u8FD0\u884C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u914D\u7F6E \xB7 \u8BFB\u53D6",
    description: "\u914D\u7F6E \xB7 \u8BFB\u53D6\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u914D\u7F6E \xB7 \u4FDD\u5B58",
    description: "\u914D\u7F6E \xB7 \u4FDD\u5B58\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(body: SaveConfigurationBody): Promise<ConfigurationSnapshot>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ target: ConfigurationTarget; revision: string; previous: WorkflowGraph; graph: WorkflowGraph; }>",
        fields: [
          {
            name: "target",
            type: "ConfigurationTarget"
          },
          {
            name: "revision",
            type: "string"
          },
          {
            name: "previous",
            type: "WorkflowGraph"
          },
          {
            name: "graph",
            type: "WorkflowGraph"
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
    label: "\u914D\u7F6E \xB7 \u590D\u5236",
    description: "\u914D\u7F6E \xB7 \u590D\u5236\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(body: CopyConfigurationBody): Promise<ConfigurationSnapshot>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ workflowId: string; graph: WorkflowGraph; }>",
        fields: [
          {
            name: "workflowId",
            type: "string"
          },
          {
            name: "graph",
            type: "WorkflowGraph"
          }
        ]
      }
    ],
    example: "await sdk.configuration.copy(input.body)"
  },
  {
    path: "configuration.setAutoExecute",
    kind: "async",
    effect: "write",
    label: "\u914D\u7F6E \xB7 \u8BBE\u7F6E\u81EA\u52A8\u6267\u884C",
    description: "\u914D\u7F6E \xB7 \u8BBE\u7F6E\u81EA\u52A8\u6267\u884C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(body: SetAutoExecuteBody): Promise<ConfigurationSnapshot>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ target: ConfigurationTarget; revision: string; enabled: boolean; }>",
        fields: [
          {
            name: "target",
            type: "ConfigurationTarget"
          },
          {
            name: "revision",
            type: "string"
          },
          {
            name: "enabled",
            type: "boolean"
          }
        ]
      }
    ],
    example: "await sdk.configuration.setAutoExecute(input.body)"
  },
  {
    path: "panel.getBundle",
    kind: "async",
    effect: "read",
    label: "\u9875\u9762 \xB7 \u8BFB\u53D6\u9875\u9762\u5305",
    description: "\u9875\u9762 \xB7 \u8BFB\u53D6\u9875\u9762\u5305\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
            description: "Omission keeps the existing business-panel resource."
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
    label: "\u9875\u9762 \xB7 \u8BFB\u53D6\u9875\u9762\u6E90\u7801",
    description: "\u8BFB\u53D6\u9875\u9762\u5305\u7684\u7F16\u8BD1\u4EA7\u7269\u3002\u4EA7\u7269\u53EF\u8FBE\u6570 MB\uFF0C\u56E0\u6B64\u4E0D\u968F\u5143\u6570\u636E\u4E0B\u53D1\uFF1A\u6309\u4FEE\u8BA2\u4E0E\u5185\u5BB9\u54C8\u5E0C\r\n\u5355\u72EC\u53D6\u4E00\u6B21\uFF0C\u5BBF\u4E3B\u8FDB\u7A0B\u5185\u7F13\u5B58\u3002\u54C8\u5E0C\u4E0D\u5339\u914D\u8BF4\u660E\u5143\u6570\u636E\u5DF2\u8FC7\u671F\uFF0C\u9700\u8981\u91CD\u8BFB\u5143\u6570\u636E\u3002",
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
    label: "\u6570\u636E \xB7 \u8BFB\u53D6\u6570\u636E",
    description: "\u6570\u636E \xB7 \u8BFB\u53D6\u6570\u636E\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u4E1A\u52A1\u8D44\u6E90 \xB7 \u5217\u51FA",
    description: "\u4E1A\u52A1\u8D44\u6E90 \xB7 \u5217\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u4E1A\u52A1\u8D44\u6E90 \xB7 \u8BFB\u53D6",
    description: "\u4E1A\u52A1\u8D44\u6E90 \xB7 \u8BFB\u53D6\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u4E1A\u52A1\u8D44\u6E90 \xB7 \u66F4\u65B0",
    description: "\u4E1A\u52A1\u8D44\u6E90 \xB7 \u66F4\u65B0\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u6D3B\u52A8\u8BB0\u5F55 \xB7 \u5217\u51FA",
    description: "\u6D3B\u52A8\u8BB0\u5F55 \xB7 \u5217\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8FD0\u884C \xB7 \u8BFB\u53D6\u7EDF\u8BA1",
    description: "\u8FD0\u884C \xB7 \u8BFB\u53D6\u7EDF\u8BA1\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8FD0\u884C \xB7 \u8BFB\u53D6\u6D3B\u52A8\u8FD0\u884C",
    description: "\u5F53\u524D\u672A\u7ED3\u675F\u7684\u8FD0\u884C\uFF1B\u6CA1\u6709\u6D3B\u52A8\u8FD0\u884C\u65F6\u662F null\uFF0C\u4E0D\u662F\u9519\u8BEF\u3002",
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
    label: "\u8F93\u5165\u6295\u9012 \xB7 \u5217\u51FA",
    description: "\u8F93\u5165\u6295\u9012 \xB7 \u5217\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u5165\u5386\u53F2 \xB7 \u5217\u51FA",
    description: "\u8F93\u5165\u5386\u53F2 \xB7 \u5217\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u5165 \xB7 \u51C6\u5907\u8F93\u5165",
    description: "\u8F93\u5165 \xB7 \u51C6\u5907\u8F93\u5165\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u5165 \xB7 \u6267\u884C\u8F93\u5165",
    description: "\u8F93\u5165 \xB7 \u6267\u884C\u8F93\u5165\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u51FA \xB7 \u8BFB\u53D6",
    description: "\u8F93\u51FA \xB7 \u8BFB\u53D6\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u51FA \xB7 \u8BFB\u53D6\u8282\u70B9\u8F93\u51FA\u9875",
    description: "\u8F93\u51FA \xB7 \u8BFB\u53D6\u8282\u70B9\u8F93\u51FA\u9875\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u51FA \xB7 \u5199\u5165\u8F93\u51FA",
    description: "\u8F93\u51FA \xB7 \u5199\u5165\u8F93\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u8F93\u51FA \xB7 \u63A8\u8FDB\u8F93\u51FA",
    description: "\u8F93\u51FA \xB7 \u63A8\u8FDB\u8F93\u51FA\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    path: "actions.reply",
    kind: "async",
    effect: "write",
    label: "\u4EBA\u5DE5\u52A8\u4F5C \xB7 \u56DE\u590D",
    description: "\u4EBA\u5DE5\u52A8\u4F5C \xB7 \u56DE\u590D\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(body: ReplyNodeBody): Promise<ReplyNodeResult>",
    parameters: [
      {
        name: "body",
        type: "Readonly<{ nodeRunId: ID; waitingToolCallId: ID; answer: JSONValue; }>",
        fields: [
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
    label: "\u4EBA\u5DE5\u52A8\u4F5C \xB7 \u63D0\u4EA4",
    description: "\u4EBA\u5DE5\u52A8\u4F5C \xB7 \u63D0\u4EA4\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u4EBA\u5DE5\u52A8\u4F5C \xB7 \u8BFB\u53D6",
    description: "\u6309\u52A8\u4F5C ID \u6216\u8282\u70B9\u6267\u884C\u56DE\u8BFB\u52A8\u4F5C\u3002",
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
    label: "\u64CD\u4F5C\u72B6\u6001 \xB7 \u8BFB\u53D6",
    description: "\u8BFB\u4E00\u6B21\u539F\u5B50\u8C03\u7528\u7684\u5F53\u524D\u72B6\u6001\uFF1B\u7ED3\u679C\u672A\u77E5\u65F6\u4E1A\u52A1\u4E0A\u4ECD\u4F1A\u963B\u585E\u5173\u95ED\u3002",
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
    path: "control.get",
    kind: "async",
    effect: "read",
    label: "\u6267\u884C\u63A7\u5236 \xB7 \u8BFB\u53D6",
    description: "\u6267\u884C\u63A7\u5236 \xB7 \u8BFB\u53D6\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
    signature: "(target: WorkflowExecutionTarget): Promise<ExecutionControlSnapshot>",
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
      }
    ],
    example: "await sdk.control.get(input.target)"
  },
  {
    path: "control.pause",
    kind: "async",
    effect: "write",
    label: "\u6267\u884C\u63A7\u5236 \xB7 \u6682\u505C",
    description: "\u6267\u884C\u63A7\u5236 \xB7 \u6682\u505C\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u6267\u884C\u63A7\u5236 \xB7 \u6062\u590D",
    description: "\u6267\u884C\u63A7\u5236 \xB7 \u6062\u590D\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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
    label: "\u6267\u884C\u63A7\u5236 \xB7 \u4E2D\u65AD",
    description: "\u6267\u884C\u63A7\u5236 \xB7 \u4E2D\u65AD\uFF1B\u53C2\u6570\u4E0E\u8FD4\u56DE\u503C\u9075\u5FAA\u516C\u5F00 SDK \u5408\u540C\u3002",
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

// src/features/workflow/mofangsdk/core/sdk-error.ts
var MofangSDKError = class extends Error {
  kind;
  code;
  retryable;
  requestId;
  httpStatus;
  resourceRevision;
  constructor(message, fields) {
    super(message);
    this.name = "MofangSDKError";
    this.kind = fields.kind;
    this.code = fields.code;
    this.retryable = fields.retryable;
    this.requestId = fields.requestId;
    this.resourceRevision = fields.resourceRevision;
    this.httpStatus = fields.httpStatus;
  }
};

// src/features/workflow/mofangsdk/core/node-flow-types.ts
var isTerminalNodeAction = (status) => ["applied", "rejected", "failed", "cancelled"].includes(status);

// src/features/workflow/mofangsdk/lowcode/provider.ts
var services = /* @__PURE__ */ new WeakMap();
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
            "\u5F53\u524D\u9762\u677F\u4E3A\u53EA\u8BFB\uFF0C\u4E0D\u80FD\u6267\u884C SDK \u5199\u5165",
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
          throw new MofangSDKError(`\u5F53\u524D SDK \u672A\u63D0\u4F9B ${method.path}`, {
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

// src/features/workflow/lowcode-adapter/lifecycle.ts
var owners = /* @__PURE__ */ new WeakMap();
function hostLifecycle(owner, key) {
  const entries = owners.get(owner) ?? /* @__PURE__ */ new Map();
  owners.set(owner, entries);
  const lifecycle = entries.get(key) ?? {
    pending: /* @__PURE__ */ new Set(),
    subscribers: 0
  };
  entries.set(key, lifecycle);
  return {
    pending: lifecycle.pending,
    retain() {
      lifecycle.subscribers++;
      return () => {
        lifecycle.subscribers--;
        queueMicrotask(() => {
          if (lifecycle.subscribers) return;
          for (const controller of lifecycle.pending)
            controller.abort();
          lifecycle.pending.clear();
          if (entries.get(key) === lifecycle) entries.delete(key);
        });
      };
    }
  };
}

// src/features/workflow/lowcode-adapter/cancellation.ts
function abortableResult(request, signal) {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () => reject(
      signal.reason ?? new DOMException("\u7B49\u5F85\u5DF2\u53D6\u6D88", "AbortError")
    );
    signal.addEventListener("abort", abort, { once: true });
    request.then(
      (value) => {
        signal.removeEventListener("abort", abort);
        if (!signal.aborted) resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", abort);
        reject(error);
      }
    );
  });
}

// src/features/workflow/lowcode-adapter/node-action.ts
var failure = (message, code, detail) => Object.assign(new Error(message), { code, retryable: false, detail });
async function runNodeAction(api, target, body, signal, timeoutMs = 3e4) {
  signal.throwIfAborted();
  if (!target.runId || !target.nodeInstanceId || body.runId !== target.runId || body.nodeInstanceId !== target.nodeInstanceId)
    throw failure("\u52A8\u4F5C\u76EE\u6807\u4E0E\u5F53\u524D\u8282\u70B9\u4E0D\u4E00\u81F4", "target_mismatch");
  if (typeof body.name !== "string" || !body.name.trim() || typeof body.expectedSessionRevision !== "string" || !/^[1-9]\d*$/.test(body.expectedSessionRevision) || !body.payload || typeof body.payload !== "object" || Array.isArray(body.payload) || !Array.isArray(body.candidates))
    throw failure("\u8282\u70B9\u52A8\u4F5C\u53C2\u6570\u65E0\u6548", "input_invalid");
  const view = await abortableResult(api.get(target), signal);
  signal.throwIfAborted();
  if (view.runId !== target.runId || view.nodeInstanceId !== target.nodeInstanceId)
    throw failure("\u8282\u70B9\u5FEB\u7167\u4E0E\u5F53\u524D\u76EE\u6807\u4E0D\u4E00\u81F4", "target_mismatch");
  const projection = view.composition.projection;
  if (projection.status !== "ready")
    throw failure("\u8282\u70B9\u6295\u5F71\u5C1A\u672A\u5C31\u7EEA", "projection_unavailable");
  const action = projection.actions.find((item) => item.name === body.name);
  if (!view.permissions.canAct || !action || !action.availability.enabled)
    throw failure(
      action && !action.availability.enabled ? action.availability.reason : "\u5F53\u524D\u8282\u70B9\u52A8\u4F5C\u4E0D\u53EF\u7528",
      "action_unavailable"
    );
  if (view.composition.snapshot.sessionRevision !== body.expectedSessionRevision)
    throw failure("\u8282\u70B9\u4FEE\u8BA2\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u6838\u5BF9", "revision_conflict");
  const ids = /* @__PURE__ */ new Set();
  for (const candidate of body.candidates) {
    if (!candidate || typeof candidate.id !== "string" || !candidate.id || typeof candidate.expectedRevision !== "string" || !/^[1-9]\d*$/.test(candidate.expectedRevision) || ids.has(candidate.id))
      throw failure("\u5019\u9009\u9879\u8EAB\u4EFD\u6216\u4FEE\u8BA2\u65E0\u6548", "input_invalid");
    ids.add(candidate.id);
    const current = view.nodeOutput.items.find(
      (item) => item.id === candidate.id
    );
    if (current && current.revision !== candidate.expectedRevision)
      throw failure("\u5019\u9009\u9879\u4FEE\u8BA2\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u6838\u5BF9", "revision_conflict");
  }
  let receipt;
  try {
    receipt = await abortableResult(api.action(body), signal);
  } catch (error) {
    signal.throwIfAborted();
    if (error && typeof error === "object" && "kind" in error && ["rejected", "conflict"].includes(String(error.kind)))
      throw error;
    throw failure(
      "\u52A8\u4F5C\u63D0\u4EA4\u7ED3\u679C\u672A\u77E5\uFF0C\u8BF7\u6838\u5BF9\u52A8\u4F5C\u8BB0\u5F55\uFF0C\u4E0D\u80FD\u81EA\u52A8\u91CD\u53D1",
      "needs_review",
      error
    );
  }
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    let settled = false;
    let release;
    let timer;
    const finish = (result, error) => {
      if (settled) return;
      settled = true;
      release?.();
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      if (error) reject(error);
      else resolve(result);
    };
    const abort = () => finish(
      void 0,
      signal.reason ?? new DOMException("\u52A8\u4F5C\u7B49\u5F85\u5DF2\u53D6\u6D88", "AbortError")
    );
    const unknown = (cause) => finish(
      void 0,
      failure(
        "\u52A8\u4F5C\u7ED3\u679C\u672A\u77E5\uFF0C\u8BF7\u6838\u5BF9\u539F\u52A8\u4F5C\uFF0C\u4E0D\u80FD\u81EA\u52A8\u91CD\u53D1",
        "needs_review",
        { receipt, cause }
      )
    );
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) {
      abort();
      return;
    }
    try {
      const store = api.watchActionResult({
        ...target,
        eventId: receipt.eventId
      });
      const update = () => {
        const state = store.getSnapshot();
        if (state.error) {
          unknown(state.error);
          return;
        }
        const result = state.data;
        if (!result || !isTerminalNodeAction(result.status)) return;
        if (result.eventId !== receipt.eventId) {
          unknown("\u52A8\u4F5C\u56DE\u6267\u8EAB\u4EFD\u4E0D\u5339\u914D");
          return;
        }
        if (result.status === "applied") finish(result);
        else
          finish(
            void 0,
            failure(
              result.error?.message ?? `\u52A8\u4F5C${result.status}`,
              result.status,
              result
            )
          );
      };
      release = store.subscribe(update);
      if (settled) release();
      else {
        timer = setTimeout(() => unknown("\u7B49\u5F85\u8D85\u65F6"), timeoutMs);
        update();
      }
    } catch (error) {
      unknown(error);
    }
  });
}

// src/features/workflow/lowcode-adapter/node-flow-context.ts
function createNodeFlowContextStore(sdk, target) {
  return sdk.nodeFlow.watch(target);
}
function subscribeNodeFlowContext(sdk, target, context, listener) {
  const store = createNodeFlowContextStore(sdk, target);
  const update = () => {
    const state = store.getSnapshot();
    context.nodeFlow = jsonValues({
      ...state,
      error: state.error ? {
        ...state.error,
        message: state.error.message,
        name: state.error.name
      } : null
    });
    context.nodeView = state.data?.composition.projection.status === "ready" ? state.data.composition.projection.nodeView : null;
    context.nodeOutput = state.data?.nodeOutput ?? null;
    listener();
  };
  const release = store.subscribe(update);
  update();
  return release;
}

// src/features/workflow/lowcode-adapter/host.ts
var sdkIds = /* @__PURE__ */ new WeakMap();
var nextSdkId = 0;
function createPuckPanelHost(props) {
  const { target, sdk, settings, surface } = props;
  const page = props.lowcode.config;
  const formId = settings ? resolveSettingsFormId(page) : "main";
  const readOnly = Boolean(settings?.readOnly || target.view === "history");
  if (sdk && !sdkIds.has(sdk)) sdkIds.set(sdk, ++nextSdkId);
  const instanceKey = JSON.stringify([
    surface,
    target,
    props.lowcode.config,
    sdk ? sdkIds.get(sdk) : null
  ]);
  const nodeRunId = () => {
    if (!target.nodeRunId) throw new Error("\u5F53\u524D\u9762\u677F\u7F3A\u5C11\u8282\u70B9\u8FD0\u884C ID");
    return target.nodeRunId;
  };
  const service = sdk ? createWorkflowSdkService({
    sdk,
    target,
    readOnly: settings?.readOnly
  }) : void 0;
  const capabilities = createCapabilityRegistry();
  const lifecycle = hostLifecycle(service ?? props, instanceKey);
  const { pending } = lifecycle;
  const call = async (id, input, signal) => {
    signal.throwIfAborted();
    if (id === "workflow.settings.resetField") {
      if (readOnly) throw new Error("\u5F53\u524D\u914D\u7F6E\u4E3A\u53EA\u8BFB");
      const fields = settingsFields(page, formId);
      const selected = typeof input.fieldId === "string" ? fields.find((field) => field.id === input.fieldId) : void 0;
      const name = selected?.name ?? input.name;
      if (!settings || input.fieldId !== void 0 && !selected || typeof name !== "string" || !fields.some((field) => field.name === name))
        throw new Error("\u91CD\u7F6E\u5B57\u6BB5\u4E0D\u5C5E\u4E8E\u5F53\u524D\u914D\u7F6E\u8868\u5355");
      settings.onFieldChange?.(name, void 0);
      return null;
    }
    if (!service) throw new Error("\u5F53\u524D\u9762\u677F\u7F3A\u5C11\u5DE5\u4F5C\u6D41 SDK");
    if (id === "workflow.nodeAction.run") {
      if (readOnly) throw new Error("\u5F53\u524D\u9762\u677F\u4E3A\u53EA\u8BFB\uFF0C\u4E0D\u80FD\u6267\u884C\u8282\u70B9\u52A8\u4F5C");
      const controller = new AbortController();
      const abort = () => controller.abort(signal.reason);
      signal.addEventListener("abort", abort, { once: true });
      pending.add(controller);
      try {
        return jsonValues(
          await runNodeAction(
            service.value.nodeFlow,
            {
              runId: target.runId ?? "",
              nodeInstanceId: target.nodeInstanceId ?? ""
            },
            input,
            controller.signal
          )
        );
      } finally {
        signal.removeEventListener("abort", abort);
        pending.delete(controller);
      }
    }
    const method = WORKFLOW_SDK_METHODS.find(
      (item) => `sdk.${item.path}` === id
    );
    if (!method) throw new Error(`Puck \u9762\u677F\u4E0D\u652F\u6301\u5BBF\u4E3B\u52A8\u4F5C\uFF1A${id}`);
    if (method.kind === "subscribe" || method.kind === "resource")
      throw new Error("\u8BA2\u9605\u548C\u8D44\u6E90\u65B9\u6CD5\u8BF7\u5728\u4E8B\u4EF6 JS \u4E2D\u8C03\u7528\u5E76\u91CA\u653E\u8BA2\u9605");
    let args;
    if (Object.prototype.hasOwnProperty.call(input, "args")) {
      if (!Array.isArray(input.args))
        throw new Error("SDK \u52A8\u4F5C\u53C2\u6570 args \u5FC5\u987B\u662F\u6570\u7EC4");
      args = input.args;
    } else if (id === "sdk.context.getCurrentContext") args = [target];
    else if (id === "sdk.nodes.getRun" || id === "sdk.outputs.get")
      args = [nodeRunId()];
    else if (!method.parameters.length || method.parameters.every((p) => p.optional))
      args = [];
    else throw new Error("SDK \u52A8\u4F5C\u9700\u8981\u663E\u5F0F\u7684 args \u53C2\u6570\u6570\u7EC4");
    const parts = method.path.split(".");
    let owner = service.value;
    for (const part of parts.slice(0, -1))
      owner = owner[part];
    const fn = owner[parts.at(-1)];
    const result = await Reflect.apply(fn, owner, args);
    signal.throwIfAborted();
    return JSON.parse(JSON.stringify(result ?? null));
  };
  for (const method of WORKFLOW_SDK_METHODS) {
    if (method.kind === "subscribe" || method.kind === "resource") continue;
    const id = `sdk.${method.path}`;
    capabilities.register(id, {
      kind: "action",
      label: method.label,
      input: method.signature,
      result: method.description,
      handler: (input) => call(id, input ?? {}, new AbortController().signal)
    });
  }
  for (const id of [
    "workflow.settings.resetField",
    "workflow.nodeAction.run"
  ])
    capabilities.register(id, {
      kind: "action",
      completion: "completed",
      handler: (input) => call(id, input ?? {}, new AbortController().signal)
    });
  const context = {
    target,
    nodeView: props.nodeView ?? null,
    nodeOutput: props.nodeOutput ?? null,
    nodeFlow: null,
    settings: jsonValues(settings?.values ?? {}),
    settingsFormId: formId,
    readOnly
  };
  return {
    instanceKey,
    context,
    subscribeContext: (listener) => {
      const dispose = lifecycle.retain();
      if (!service || !target.runId || !target.nodeInstanceId)
        return dispose;
      const release = subscribeNodeFlowContext(
        service.value,
        {
          runId: target.runId,
          nodeInstanceId: target.nodeInstanceId,
          view: target.view === "history" ? "history" : "current"
        },
        context,
        listener
      );
      return () => {
        release();
        dispose();
      };
    },
    initialValues: settings ? { [formId]: jsonValues(settings.values) } : void 0,
    services: service ? { workflowSdk: service } : {},
    capabilities,
    actionOutputKeys: Object.fromEntries(
      WORKFLOW_SDK_METHODS.filter(
        (method) => method.effect === "write"
      ).map((method) => [
        `sdk.${method.path}`,
        ["nodeView", "nodeOutput"]
      ])
    ),
    call
  };
}
export {
  createNodeFlowContextStore,
  createPuckPanelHost,
  jsonValues,
  resolveSettingsFormId,
  runNodeAction
};
//# sourceMappingURL=index.js.map
