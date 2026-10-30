const CONFLICT_CODES = /* @__PURE__ */ new Set([
  "revision_conflict",
  "config_revision_conflict",
  "panel_revision_conflict",
  "domain_revision_conflict",
  "input_context_stale",
  "run_state_conflict",
  "node_state_conflict",
  "pause_request_conflict",
  "waiting_turn_conflict",
  "gate_revision_conflict"
]);
const REJECTED_CODES = /* @__PURE__ */ new Set([
  "invalid_argument",
  "permission_denied",
  "action_not_supported",
  "domain_reference_denied",
  "result_evidence_invalid",
  "input_invalid",
  "input_missing",
  "unsupported_sdk_version",
  "run_closed",
  "workflow_active",
  "workflow_definition_locked",
  "retry_target_invalid",
  "retry_budget_exhausted"
]);
const TRANSPORT_CODE = "transport_failed";
const UNKNOWN_CODE = "unknown_error";
class MofangSDKError extends Error {
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
}
function classifyErrorCode(code) {
  if (CONFLICT_CODES.has(code)) return "conflict";
  if (REJECTED_CODES.has(code)) return "rejected";
  return "protocol";
}
function failureFromReceipt(receipt) {
  if (receipt.status !== "failed") return null;
  const code = receipt.errorCode || UNKNOWN_CODE;
  return new MofangSDKError(receipt.errorMessage || code, {
    kind: classifyErrorCode(code),
    code,
    // 服务端已经受理并判定失败：重发同一个请求只会得到同样的结论。
    retryable: false,
    requestId: receipt.requestId,
    resourceRevision: receipt.resourceRevision
  });
}
function toMofangSDKError(cause) {
  if (cause instanceof MofangSDKError) return cause;
  const message = cause instanceof Error ? cause.message : String(cause);
  return new MofangSDKError(message, {
    kind: "transport",
    code: TRANSPORT_CODE,
    retryable: true
  });
}
function isNodeAuthorizationError(error) {
  return error.httpStatus === 401 || error.httpStatus === 403 || [
    "http_401",
    "http_403",
    "unauthorized",
    "unauthenticated",
    "permission_denied",
    "scope_changed",
    "token_expired"
  ].includes(error.code);
}
function invalid(message) {
  throw new MofangSDKError(message, {
    kind: "protocol",
    code: "invalid_http_request",
    retryable: false
  });
}
function hasControl(value) {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}
function validateHttpPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\?#\s]/.test(value) || hasControl(value))
    invalid("HTTP 请求需要当前 backend 的相对路径，查询参数请放 query");
  try {
    if (new URL(value, "https://host.invalid").pathname !== value)
      invalid("HTTP 路径必须使用规范形式");
    for (const segment of value.split("/").slice(1)) {
      const decoded = decodeURIComponent(segment);
      if (decoded === "." || decoded === ".." || decoded.includes("/") || /[\\?#%\s]/.test(decoded) || hasControl(decoded))
        invalid("HTTP 路径不能包含路径跳转或编码分隔符");
    }
  } catch {
    invalid("HTTP 路径不是有效的规范相对路径");
  }
  return value;
}
function record(value) {
  return value !== null && typeof value === "object" && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function json(value, parents = /* @__PURE__ */ new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (!Array.isArray(value) && !record(value)) return false;
  if (parents.has(value)) return false;
  parents.add(value);
  const valid = Array.isArray(value) ? Array.from(value).every((item) => json(item, parents)) : Object.values(value).every((item) => json(item, parents));
  parents.delete(value);
  return valid;
}
function validateHttpPayload(value) {
  if (!record(value) || Object.keys(value).some(
    (key) => !["method", "path", "query", "body"].includes(key)
  ) || typeof value.method !== "string" || !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(
    String(value.method)
  ))
    invalid("HTTP 请求只接受 method、path、query、body");
  const path = validateHttpPath(value.path);
  if (value.method === "GET" && value.body !== void 0)
    invalid("GET 请求不能携带 body");
  if (value.query !== void 0) {
    const scalar = (item) => typeof item === "string" || typeof item === "boolean" || typeof item === "number" && Number.isFinite(item);
    if (!record(value.query) || !Object.values(value.query).every(
      (item) => Array.isArray(item) ? Array.from(item).every(scalar) : scalar(item)
    ))
      invalid("HTTP query 只接受字符串、有限数值、布尔值或它们的数组");
  }
  if (value.body !== void 0 && !json(value.body))
    invalid("HTTP body 必须是可序列化 JSON 值");
  return JSON.parse(JSON.stringify({ ...value, path }));
}
function createHttpAPI(transport) {
  return {
    async request(request) {
      try {
        if (!record(request)) invalid("HTTP 请求必须是参数对象");
        const { signal, ...body } = request;
        if (signal?.aborted)
          throw new MofangSDKError("HTTP 请求已取消", {
            kind: "transport",
            code: "request_cancelled",
            retryable: false
          });
        return await transport.request(
          "http.request",
          validateHttpPayload(body),
          { signal }
        );
      } catch (error) {
        throw toMofangSDKError(error);
      }
    }
  };
}
function createMessages(source, context) {
  const entries = /* @__PURE__ */ new Set();
  function bind(filter) {
    const target = context();
    return {
      workflowId: target.workflowId,
      runId: target.runId,
      nodeRunId: target.nodeRunId,
      ...filter
    };
  }
  function attach(entry) {
    if (!source)
      throw new MofangSDKError("宿主未提供消息订阅通道", {
        kind: "protocol",
        code: "messages_unavailable",
        retryable: false
      });
    const filter = bind(entry.filter);
    const bound = JSON.stringify([source.identity?.(), filter]);
    if (entry.bound === bound) return;
    const previous = entry.stop;
    entry.stop = entry.listener ? source.subscribe(filter, entry.listener) : source.onConnectionChange(filter, entry.connection);
    entry.bound = bound;
    previous();
  }
  function register(filter, listener, connection) {
    const entry = {
      filter,
      listener,
      connection,
      bound: "",
      stop: () => void 0
    };
    attach(entry);
    entries.add(entry);
    return () => {
      if (entries.delete(entry)) entry.stop();
    };
  }
  const onType = (type, listener, filter = {}) => register({ ...filter, types: [type] }, listener);
  return {
    subscribe: (filter, listener) => register(filter, listener),
    onStage: (listener, filter) => onType("workflow.agent.stage", listener, filter),
    onPlan: (listener, filter) => onType("workflow.agent.plan.updated", listener, filter),
    onMessage: (listener, filter) => onType("workflow.agent.message", listener, filter),
    onReasoning: (listener, filter) => onType("workflow.agent.reasoning", listener, filter),
    onTool: (listener, filter) => onType("workflow.agent.tool.*", listener, filter),
    onConnectionChange: (listener, filter = {}) => register(filter, void 0, listener),
    refresh: () => {
      for (const entry of entries) attach(entry);
    }
  };
}
function normalizeNodeFlowQuery(query) {
  const {
    runId,
    nodeInstanceId,
    page = 1,
    pageSize = 20,
    view = "current"
  } = query;
  if (typeof runId !== "string" || !runId || runId.trim() !== runId || typeof nodeInstanceId !== "string" || !nodeInstanceId || nodeInstanceId.trim() !== nodeInstanceId || !Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 20 || view !== "current" && view !== "history") {
    throw new MofangSDKError(
      "节点视图需要明确身份、合法分页和 current/history 视角",
      {
        kind: "protocol",
        code: "contract_mismatch",
        retryable: false
      }
    );
  }
  return { runId, nodeInstanceId, page, pageSize, view };
}
function observeNodeFlow(query, source, invalidate) {
  if (query.view === "history") return () => void 0;
  const stops = [];
  let stopped = false;
  const visible = () => typeof document === "undefined" || document.visibilityState !== "hidden";
  const refresh = () => {
    if (!stopped && visible()) invalidate();
  };
  if (source) {
    try {
      stops.push(
        source.subscribe({ runId: query.runId }, (event) => {
          if (!event.scope?.nodeInstanceId || event.scope.nodeInstanceId === query.nodeInstanceId)
            refresh();
        })
      );
    } catch {
    }
    try {
      stops.push(
        source.onConnectionChange(
          { runId: query.runId },
          (connected) => {
            if (connected) refresh();
          }
        )
      );
    } catch {
    }
  }
  const timer = setInterval(refresh, 3e4);
  stops.push(() => clearInterval(timer));
  if (typeof window !== "undefined") {
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    stops.push(() => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
    });
  }
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", refresh);
    stops.push(
      () => document.removeEventListener("visibilitychange", refresh)
    );
  }
  return () => {
    stopped = true;
    for (const stop of stops) stop();
  };
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function isDeeplyEqual(left, right) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    return left.every((item, index) => isDeeplyEqual(item, right[index]));
  }
  if (!isPlainObject(left) || !isPlainObject(right)) return false;
  const leftKeys = Object.keys(left);
  if (leftKeys.length !== Object.keys(right).length) return false;
  return leftKeys.every(
    (key) => Object.hasOwn(right, key) && isDeeplyEqual(left[key], right[key])
  );
}
function keepStableValue(previous, next) {
  if (previous === null || previous === void 0) return next;
  return isDeeplyEqual(previous, next) ? previous : next;
}
const initialState = () => ({
  data: null,
  loading: false,
  refreshing: false,
  stale: false,
  error: null,
  revision: null
});
const noop$1 = () => void 0;
function createNodeFlowStore(query, deps) {
  const identity = deps.identity();
  const listeners = /* @__PURE__ */ new Set();
  let state = initialState();
  let dirtyEpoch = 0;
  let appliedEpoch = 0;
  let generation = 0;
  let failures = 0;
  let blocked = false;
  let pending = null;
  let abort = null;
  let timer;
  let stopLive;
  function publish(next) {
    if (isDeeplyEqual(next, state)) return;
    state = next;
    for (const listener of [...listeners]) listener.notify();
  }
  function stop() {
    stopLive?.();
    stopLive = void 0;
    clearTimeout(timer);
    timer = void 0;
    generation++;
    abort?.abort();
    abort = null;
    pending = null;
  }
  function scopeError() {
    return new MofangSDKError("登录身份已变化，请重新绑定节点视图", {
      kind: "rejected",
      code: "scope_changed",
      retryable: false
    });
  }
  function inScope() {
    if (!blocked && deps.identity() === identity) return true;
    blocked = true;
    stop();
    publish({ ...initialState(), error: scopeError() });
    return false;
  }
  function schedule(delay2 = 50) {
    if (timer !== void 0 || listeners.size === 0 || !inScope()) return;
    timer = setTimeout(() => {
      timer = void 0;
      void read().catch(noop$1);
    }, delay2);
  }
  function invalidate() {
    if (!inScope()) return;
    dirtyEpoch++;
    if (state.data) publish({ ...state, stale: true });
    if (!pending) schedule();
  }
  function read() {
    if (!inScope()) return Promise.reject(scopeError());
    if (pending) return pending;
    clearTimeout(timer);
    timer = void 0;
    const epoch = dirtyEpoch;
    const token = generation;
    const controller = new AbortController();
    abort = controller;
    let failure = null;
    const request = Promise.resolve().then(() => deps.load(controller.signal)).then((value) => {
      if (blocked || deps.identity() !== identity) throw scopeError();
      if (token !== generation) return value;
      if (!inScope()) throw scopeError();
      failures = 0;
      appliedEpoch = epoch;
      const accepted = deps.accept?.(state.data, value) ?? value;
      publish({
        data: keepStableValue(state.data, accepted),
        loading: false,
        refreshing: false,
        stale: dirtyEpoch !== epoch,
        error: null,
        revision: deps.revision?.(accepted) ?? accepted.revision
      });
      return accepted;
    }).catch((cause) => {
      failure = toMofangSDKError(cause);
      if (token === generation && inScope()) {
        failures++;
        publish({
          ...isNodeAuthorizationError(failure) ? initialState() : state,
          loading: false,
          refreshing: false,
          stale: !isNodeAuthorizationError(failure) && state.data !== null,
          error: failure
        });
      }
      throw cause;
    }).finally(() => {
      if (pending !== request) return;
      pending = null;
      abort = null;
      if (token !== generation || listeners.size === 0) return;
      if (failure) {
        if (failure.retryable)
          schedule(Math.min(3e4, 250 * 2 ** (failures - 1)));
      } else if (dirtyEpoch !== appliedEpoch) schedule();
    });
    pending = request;
    publish({
      ...state,
      loading: state.data === null,
      refreshing: state.data !== null,
      error: null
    });
    request.catch(noop$1);
    return request;
  }
  return {
    getSnapshot: () => state,
    getState: () => state,
    read,
    invalidate,
    active: () => listeners.size > 0 || pending !== null,
    redact: (error) => {
      generation++;
      abort?.abort();
      abort = null;
      pending = null;
      publish({ ...initialState(), error });
    },
    clear: () => {
      blocked = true;
      stop();
      publish(initialState());
    },
    refresh: () => {
      invalidate();
      const wantedEpoch = dirtyEpoch;
      const token = generation;
      return read().then(() => {
        if (token === generation && appliedEpoch < wantedEpoch)
          return read().then(noop$1, noop$1);
      }, noop$1);
    },
    subscribe: (notify) => {
      const entry = { notify };
      listeners.add(entry);
      if (listeners.size === 1 && inScope()) {
        stopLive = deps.observe?.(invalidate) ?? observeNodeFlow(query, deps.source, invalidate);
        void read().catch(noop$1);
      }
      return () => {
        listeners.delete(entry);
        if (listeners.size === 0) {
          stop();
          publish({ ...state, loading: false, refreshing: false });
        }
      };
    }
  };
}
const isTerminalNodeAction = (status) => ["applied", "rejected", "failed", "cancelled"].includes(status);
const nodeBusinessView = (view) => view?.composition?.projection.status === "ready" ? view.composition.projection.nodeView : null;
function createNodeFlowAPI(deps) {
  const entries = /* @__PURE__ */ new Map();
  const actionEntries = /* @__PURE__ */ new Map();
  let authorizationBlocked = false;
  const currentIdentity = () => deps.source?.identity?.() ?? "";
  let identity;
  function scope() {
    const next = currentIdentity();
    if (identity === void 0) {
      identity = next;
      return;
    }
    if (next !== identity) {
      const previous = [...entries.values()];
      entries.clear();
      for (const entry of actionEntries.values()) entry.resource.clear();
      actionEntries.clear();
      authorizationBlocked = false;
      identity = next;
      for (const entry of previous) entry.resource.clear();
    }
  }
  function resource(query) {
    scope();
    const target = normalizeNodeFlowQuery(query);
    const key = JSON.stringify([
      identity,
      target.runId,
      target.nodeInstanceId,
      target.page,
      target.pageSize,
      target.view
    ]);
    const existing = entries.get(key);
    if (existing) return existing.resource;
    if (entries.size >= 64) {
      for (const [id, entry] of entries) {
        if (!entry.resource.active()) entries.delete(id);
        if (entries.size < 64) break;
      }
    }
    const store = createNodeFlowStore(target, {
      source: deps.source,
      identity: currentIdentity,
      load: (signal) => protectedRead("nodeFlow.get", target, {
        signal
      })
    });
    entries.set(key, { query: target, resource: store });
    return store;
  }
  function redactAuthorization(error) {
    authorizationBlocked = true;
    for (const entry of entries.values()) entry.resource.redact(error);
    for (const entry of actionEntries.values()) entry.resource.redact(error);
  }
  async function protectedRead(operation, payload, options) {
    scope();
    const expectedIdentity = currentIdentity();
    try {
      const result = await deps.request(operation, payload, options);
      if (currentIdentity() !== expectedIdentity)
        throw new MofangSDKError("登录身份已变化", {
          kind: "rejected",
          code: "scope_changed",
          retryable: false
        });
      if (operation === "nodeFlow.get") authorizationBlocked = false;
      return result;
    } catch (cause) {
      const error = toMofangSDKError(cause);
      if (isNodeAuthorizationError(error) && currentIdentity() === expectedIdentity) {
        redactAuthorization(error);
      }
      throw error;
    }
  }
  function actionResource(query) {
    scope();
    const key = JSON.stringify([
      identity,
      query.runId,
      query.nodeInstanceId,
      query.eventId,
      query.view ?? "current"
    ]);
    const existing = actionEntries.get(key);
    if (existing) return existing.resource;
    for (const [id, entry] of actionEntries)
      if (actionEntries.size >= 64 && !entry.resource.active())
        actionEntries.delete(id);
    const resourceForActionNode = resource({
      runId: query.runId,
      nodeInstanceId: query.nodeInstanceId,
      view: query.view
    });
    const actionStore = createNodeFlowStore(query, {
      identity: currentIdentity,
      observe: (invalidate2) => resourceForActionNode.subscribe(invalidate2),
      load: (signal) => protectedRead("nodeFlow.getActionResult", query, {
        signal
      }),
      revision: (result) => result.updatedAt,
      accept: (previous, next) => {
        if (!previous || !isTerminalNodeAction(previous.status))
          return next;
        if (isTerminalNodeAction(next.status) && next.status !== previous.status)
          throw new MofangSDKError("动作终态矛盾", {
            kind: "protocol",
            code: "contract_mismatch",
            retryable: false
          });
        return previous;
      }
    });
    actionEntries.set(key, { query, resource: actionStore });
    return actionStore;
  }
  function invalidate(target) {
    for (const entry of entries.values()) {
      if (entry.query.view === "current" && entry.query.runId === target.runId && entry.query.nodeInstanceId === target.nodeInstanceId)
        entry.resource.invalidate();
    }
  }
  async function write(operation, body) {
    scope();
    const context = deps.context();
    if (authorizationBlocked)
      throw new MofangSDKError("权限待重新核验，请重新读取节点", {
        kind: "rejected",
        code: "permission_denied",
        retryable: false
      });
    if (body.view === "history" || context.view === "history" && context.runId === body.runId && context.nodeInstanceId === body.nodeInstanceId) {
      throw new MofangSDKError("历史节点视图只读，不能执行商品操作", {
        kind: "rejected",
        code: "readonly_view",
        retryable: false
      });
    }
    if (!["nodeFlow.pause", "nodeFlow.resume", "nodeFlow.cancel"].includes(
      operation
    )) {
      const unread = [...entries.values()].some(
        (entry) => entry.query.runId === body.runId && entry.query.nodeInstanceId === body.nodeInstanceId && entry.query.view === "current" && (entry.resource.getSnapshot().stale || entry.resource.getSnapshot().error)
      );
      if (unread)
        throw new MofangSDKError("节点事实尚未重新核验，请先刷新", {
          kind: "conflict",
          code: "input_context_stale",
          retryable: false
        });
    }
    const writeIdentity = currentIdentity();
    try {
      return await deps.write(operation, body);
    } catch (cause) {
      const error = toMofangSDKError(cause);
      if (isNodeAuthorizationError(error) && currentIdentity() === writeIdentity)
        redactAuthorization(error);
      throw error;
    } finally {
      invalidate(body);
      for (const entry of actionEntries.values())
        if (entry.query.runId === body.runId && entry.query.nodeInstanceId === body.nodeInstanceId)
          entry.resource.invalidate();
    }
  }
  return {
    get: async (query) => resource(query).read(),
    watch: resource,
    listCandidates: async (query) => {
      scope();
      return protectedRead(
        "nodeFlow.listCandidates",
        normalizeNodeFlowQuery(query)
      );
    },
    tasks: async (query) => {
      scope();
      return protectedRead(
        "nodeFlow.tasks",
        normalizeNodeFlowQuery(query)
      );
    },
    editCandidate: (body) => write("nodeFlow.editCandidate", body),
    release: (body) => write("nodeFlow.release", body),
    discard: (body) => write("nodeFlow.discard", body),
    endReview: (body) => write("nodeFlow.endReview", body),
    getActionResult: (query) => actionResource(query).read(),
    watchActionResult: actionResource,
    listActions: (query) => protectedRead(
      "nodeFlow.listActions",
      query
    ),
    action: (body) => write("nodeFlow.action", body),
    pause: (body) => write("nodeFlow.pause", body),
    resume: (body) => write("nodeFlow.resume", body),
    cancel: (body) => write("nodeFlow.cancel", body),
    getTaskOperation: (query) => protectedRead(
      "nodeFlow.getTaskOperation",
      query
    ),
    listTaskOperations: (query) => protectedRead(
      "nodeFlow.listTaskOperations",
      query
    ),
    replyTask: (body) => write("nodeFlow.replyTask", body),
    continueTask: (body) => write("nodeFlow.continueTask", body),
    resolveUnknownTask: (body) => write("nodeFlow.resolveUnknownTask", body)
  };
}
function createSerialQueue() {
  let tail = Promise.resolve();
  return {
    run(task) {
      const result = tail.then(task, task);
      tail = result.catch(() => void 0);
      return result;
    }
  };
}
function validateToast(level, message) {
  if (!["success", "info", "warning", "error"].includes(String(level)) || typeof message !== "string" || !message.trim() || message.length > 500) {
    throw new MofangSDKError("Toast 需要有效类型与 1 至 500 字符的纯文本", {
      kind: "protocol",
      code: "invalid_toast",
      retryable: false
    });
  }
  return { level, message };
}
function createToastAPI(send) {
  const show = async (level, message) => {
    await send(validateToast(level, message));
  };
  return {
    success: (message) => show("success", message),
    info: (message) => show("info", message),
    warning: (message) => show("warning", message),
    error: (message) => show("error", message)
  };
}
const NODE_FLOW_WRITE_OPERATIONS = /* @__PURE__ */ new Set([
  "nodeFlow.editCandidate",
  "nodeFlow.release",
  "nodeFlow.discard",
  "nodeFlow.endReview",
  "nodeFlow.action",
  "nodeFlow.pause",
  "nodeFlow.resume",
  "nodeFlow.cancel",
  "nodeFlow.replyTask",
  "nodeFlow.continueTask",
  "nodeFlow.resolveUnknownTask"
]);
const WRITE_RESOURCE = {
  "configuration.save": "context",
  "configuration.copy": "context",
  "nodes.cancel": "context",
  "nodes.continue": "context",
  "nodes.rerun": "context",
  "inputs.prepare": "context",
  "inputs.execute": "context",
  "outputs.write": "context",
  "outputs.advance": "context",
  "actions.reply": "context",
  "actions.invoke": "context",
  "actions.submit": "context",
  "control.interrupt": "context",
  "control.start": "context",
  "control.pause": "context",
  "control.resume": "context",
  "resources.update": "context"
};
const emptyResource = () => ({
  data: null,
  loading: false,
  stale: false,
  error: null,
  revision: null
});
const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
const noop = () => void 0;
function queryPayload(source) {
  const payload = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === void 0 || value === null || value === "") continue;
    payload[key] = value;
  }
  return payload;
}
function receiptOf(result) {
  const container = result;
  if (container && typeof container === "object" && container.receipt) {
    return container.receipt;
  }
  return result;
}
function createMofangSDK(options) {
  const { transport } = options;
  const transportRetries = options.transportRetries ?? 2;
  const retryDelayMs = options.retryDelayMs ?? ((attempt) => 250 * 2 ** (attempt - 1));
  const writes = createSerialQueue();
  const listeners = /* @__PURE__ */ new Set();
  let state = {
    context: emptyResource()
  };
  const contextReads = /* @__PURE__ */ new Map();
  const contextRefreshes = /* @__PURE__ */ new Map();
  let activeContextKey = "";
  let contextKey = "";
  const binding = options.defaultContext ? Object.freeze({ ...options.defaultContext }) : void 0;
  let contextOptions = binding ?? {};
  const messages = createMessages(
    options.messageSource ?? transport.messages,
    () => ({
      ...contextOptions,
      workflowId: state.context.data?.workflowId ?? contextOptions.workflowId,
      runId: state.context.data?.runId ?? contextOptions.runId,
      nodeRunId: state.context.data?.nodeRunId ?? contextOptions.nodeRunId
    })
  );
  function emit(next) {
    if (isDeeplyEqual(next, state)) return;
    state = next;
    messages.refresh();
    for (const listener of [...listeners]) listener();
  }
  function subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
  function patchContext(patch) {
    emit({ ...state, context: { ...state.context, ...patch } });
  }
  function failResource(error) {
    patchContext({
      loading: false,
      stale: state.context.data !== null,
      error
    });
  }
  async function send(operation, payload, requestOptions) {
    const write = Object.prototype.hasOwnProperty.call(WRITE_RESOURCE, operation) || NODE_FLOW_WRITE_OPERATIONS.has(operation);
    if (operation === "control.start" && (typeof payload.workflowId !== "string" || !payload.workflowId.trim() || typeof payload.expectedRevision !== "string" || !/^[1-9]\d*$/.test(payload.expectedRevision) || typeof payload.isTestRun !== "boolean" || !["auto", "manual"].includes(String(payload.mode))))
      throw new MofangSDKError(
        "启动必须指定工作流、已保存修订、试运行身份和有效模式",
        { kind: "rejected", code: "invalid_start", retryable: false }
      );
    if (write && binding) {
      if (binding.view === "history" || binding.view === "preview" || operation === "control.start" && binding.view !== "current")
        throw new MofangSDKError("历史和预览视图不可写入", {
          kind: "rejected",
          code: "readonly_context",
          retryable: false
        });
      if (operation === "control.start" && (!binding.workflowId || payload.workflowId !== binding.workflowId))
        throw new MofangSDKError("启动目标与宿主绑定不一致", {
          kind: "rejected",
          code: "target_mismatch",
          retryable: false
        });
      if (binding.nodeInstanceId || binding.nodeRunId) {
        if (operation.startsWith("control.") && operation !== "control.start") {
          const target = payload.target;
          if (!binding.nodeRunId || target?.kind !== "node_run" || target.id !== binding.nodeRunId)
            throw new MofangSDKError("节点页面只能控制绑定执行", {
              kind: "rejected",
              code: "target_mismatch",
              retryable: false
            });
        }
        if (["nodes.cancel", "nodes.continue"].includes(operation) && (!binding.nodeRunId || payload.nodeRunId !== binding.nodeRunId))
          throw new MofangSDKError("节点执行与宿主绑定不一致", {
            kind: "rejected",
            code: "target_mismatch",
            retryable: false
          });
      }
    }
    let attempt = 0;
    for (; ; ) {
      try {
        return requestOptions ? await transport.request(
          operation,
          payload,
          requestOptions
        ) : await transport.request(operation, payload);
      } catch (cause) {
        const failure = toMofangSDKError(cause);
        if (Object.prototype.hasOwnProperty.call(
          WRITE_RESOURCE,
          operation
        ) || NODE_FLOW_WRITE_OPERATIONS.has(operation) || operation === "readOnlyActions.submit" || requestOptions?.signal?.aborted || !failure.retryable || attempt >= transportRetries)
          throw failure;
        attempt += 1;
        await delay(retryDelayMs(attempt));
      }
    }
  }
  const requestKey = (target) => [
    target.workflowId ?? "",
    target.nodeInstanceId ?? "",
    target.runId ?? "",
    target.nodeRunId ?? "",
    target.taskId ?? "",
    target.view ?? "current"
  ].join("|");
  function fetchContext(target, fresh = false) {
    const key = requestKey(target);
    contextOptions = { ...target };
    if (activeContextKey !== key) {
      activeContextKey = key;
      emit({ context: emptyResource() });
    }
    const pending = contextReads.get(key);
    if (pending) return pending;
    const payload = queryPayload({
      workflowId: target.workflowId,
      nodeInstanceId: target.nodeInstanceId,
      runId: target.runId,
      nodeRunId: target.nodeRunId,
      taskId: target.taskId,
      view: target.view ?? "current"
    });
    const read = (async () => {
      patchContext({
        loading: state.context.data === null,
        error: null
      });
      try {
        const context = await send(
          "context.get",
          payload,
          fresh ? { fresh: true } : void 0
        );
        if (activeContextKey !== key) return context;
        contextKey = key;
        emit({
          ...state,
          context: {
            data: keepStableValue(state.context.data, context),
            loading: false,
            stale: false,
            error: null,
            revision: context.contextRevision
          }
        });
        return context;
      } catch (cause) {
        const failure = toMofangSDKError(cause);
        if (activeContextKey === key) {
          patchContext({
            loading: false,
            stale: state.context.data !== null,
            error: failure
          });
        }
        throw failure;
      } finally {
        contextReads.delete(key);
      }
    })();
    contextReads.set(key, read);
    read.catch(noop);
    return read;
  }
  function refreshContext(target = contextOptions) {
    const key = requestKey(target);
    const refreshing = contextRefreshes.get(key);
    if (refreshing) {
      refreshing.dirty = true;
      return refreshing.promise;
    }
    const pending = contextReads.get(key);
    if (!pending) return fetchContext(target, true).then(noop, noop);
    const queued = { promise: Promise.resolve(), dirty: true };
    queued.promise = pending.then(noop, noop).then(async () => {
      while (queued.dirty && activeContextKey === key) {
        queued.dirty = false;
        await fetchContext(target, true).then(noop, noop);
      }
    }).finally(() => contextRefreshes.delete(key));
    contextRefreshes.set(key, queued);
    return queued.promise;
  }
  function markReadsStale() {
    emit({
      context: state.context.data ? { ...state.context, stale: true } : state.context
    });
  }
  function reconcileAfterWrite() {
    markReadsStale();
    void refreshContext(contextOptions);
  }
  function runWrite(operation, payload) {
    return writes.run(async () => {
      let result;
      try {
        result = await send(operation, payload);
      } catch (cause) {
        const failure2 = toMofangSDKError(cause);
        failResource(failure2);
        throw failure2;
      }
      const failure = failureFromReceipt(receiptOf(result));
      if (failure) {
        failResource(failure);
        throw failure;
      }
      return result;
    }).then((result) => {
      reconcileAfterWrite();
      return result;
    });
  }
  async function ensureContextLoaded(target = contextOptions) {
    if (state.context.data && !state.context.stale && contextKey === requestKey(target)) {
      return;
    }
    await fetchContext(target).then(noop, noop);
  }
  function runResourceWrite(operation, payload) {
    return writes.run(() => send(operation, payload)).then((result) => {
      if (contextOptions.nodeInstanceId || contextOptions.nodeRunId)
        reconcileAfterWrite();
      return result;
    });
  }
  const nodeFlow = createNodeFlowAPI({
    request: send,
    write: (operation, payload) => writes.run(() => send(operation, payload)),
    source: options.messageSource ?? transport.messages,
    context: () => contextOptions
  });
  async function isolatedReadOnlyRequest(operation, payload, requestOptions) {
    const source = options.messageSource ?? transport.messages;
    const identity = source?.identity?.();
    const result = await send(operation, payload, requestOptions);
    if (source?.identity?.() !== identity)
      throw new MofangSDKError("登录身份已变化，独立查询结果未应用", {
        kind: "rejected",
        code: "scope_changed",
        retryable: false
      });
    return result;
  }
  return {
    readOnlyActions: {
      submit: (body) => isolatedReadOnlyRequest("readOnlyActions.submit", body),
      get: (executionId, requestOptions) => isolatedReadOnlyRequest(
        "readOnlyActions.get",
        { executionId },
        requestOptions
      )
    },
    http: createHttpAPI(transport),
    toast: createToastAPI(
      (message) => transport.request("ui.toast", message)
    ),
    nodeFlow,
    nodes: {
      getRun: (nodeRunId) => send("nodes.getRun", {
        nodeRunId
      }),
      cancel: (nodeRunId) => runResourceWrite("nodes.cancel", {
        nodeRunId
      }),
      continue: (body) => runResourceWrite("nodes.continue", body),
      list: () => send("nodes.list", {}),
      get: (code) => send("nodes.get", { code }),
      resolveIdentity: (query) => send(
        "nodes.identity",
        queryPayload(query)
      ),
      tasks: (query) => send("nodes.tasks", queryPayload(query)),
      executions: (query) => send("nodes.executions", queryPayload(query)),
      rerun: (runId, nodeKey, nodeRunId) => runResourceWrite("nodes.rerun", {
        runId,
        nodeKey,
        nodeRunId
      })
    },
    configuration: {
      get: (target) => send(
        "configuration.get",
        queryPayload(target)
      ),
      save: (body) => runResourceWrite(
        "configuration.save",
        body
      ),
      copy: (body) => runResourceWrite(
        "configuration.copy",
        body
      )
    },
    panel: {
      getBundle: (target) => send(
        "panel.get",
        queryPayload(target)
      ),
      getSource: (target) => send("panel.getSource", queryPayload(target))
    },
    data: {
      read: (body) => send("data.read", queryPayload(body))
    },
    resources: {
      list: (body) => send("resources.list", queryPayload(body)),
      get: (body) => send("resources.get", body),
      update: (body) => runResourceWrite("resources.update", body)
    },
    activities: {
      list: (query) => send(
        "activities.list",
        queryPayload(query)
      )
    },
    getState: () => state,
    messages,
    subscribe,
    context: {
      getCurrentContext: (target = contextOptions) => fetchContext(target),
      ensureLoaded: ensureContextLoaded,
      refresh: (target) => refreshContext(target ?? contextOptions),
      getState: () => state.context,
      getSnapshot: () => state.context.data,
      subscribe
    },
    run: {
      state: (runId) => send("run.state", { runId }),
      getActiveRun: (workflowId) => send("run.active", {
        workflowId
      })
    },
    incoming: {
      list: (query) => send(
        "incoming.list",
        queryPayload(query)
      )
    },
    inputHistory: {
      list: (query) => send(
        "inputHistory.list",
        queryPayload(query)
      )
    },
    inputs: {
      prepare: (body) => runWrite("inputs.prepare", body),
      execute: (body) => runWrite("inputs.execute", body)
    },
    outputs: {
      get: (nodeRunId) => send("outputs.get", { nodeRunId }),
      getNode: (query) => send(
        "outputs.getNode",
        queryPayload(query)
      ),
      write: (body) => runResourceWrite("outputs.write", body),
      advance: (body) => runWrite("outputs.advance", body)
    },
    actions: {
      invoke: (body) => runResourceWrite("actions.invoke", body),
      history: (query) => send("actions.history", queryPayload(query)),
      reply: (body) => runResourceWrite("actions.reply", body),
      submit: (body) => runWrite("actions.submit", body),
      get: (query) => send(
        "actions.get",
        queryPayload(query)
      )
    },
    operations: {
      get: (operationId) => send("operations.get", {
        operationId
      })
    },
    control: {
      start: (body) => runWrite("control.start", body),
      getRequest: (target, requestId, options2) => send(
        "control.getRequest",
        { target, requestId },
        options2
      ),
      get: (target, options2) => send("control.get", { target }, options2),
      pause: (body) => runResourceWrite("control.pause", body),
      resume: (body) => runResourceWrite("control.resume", body),
      interrupt: (body) => runWrite("control.interrupt", body)
    }
  };
}
export {
  MofangSDKError as M,
  isTerminalNodeAction as a,
  classifyErrorCode as b,
  createMofangSDK as c,
  createSerialQueue as d,
  isDeeplyEqual as e,
  failureFromReceipt as f,
  isPlainObject as i,
  keepStableValue as k,
  nodeBusinessView as n,
  toMofangSDKError as t
};
