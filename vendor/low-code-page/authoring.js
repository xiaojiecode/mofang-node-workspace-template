import { b as se, v as je, c as he } from "./validation-FKKFyTYz.js";
import { L as _, z as N, C as Q, m as q, K as be, i as F, a as ve, s as ie } from "./split-layout-CBltrNgl.js";
import { s as E, o as h, d as ce, r as Z, n as P, l as $, a as D, c as L, _ as A, t as Ne } from "./schemas-DJw7aJPi.js";
import { m as ye, a as le } from "./material-metadata-DlznyyRQ.js";
function V(e) {
  return Object.assign(
    new Error(e.map((t) => t.message).join(`
`)),
    {
      name: "AuthoringError",
      code: e[0]?.code ?? "AUTHORING_FAILED",
      diagnostics: e,
      errors: e.map((t) => `${t.path}：${t.message}`)
    }
  );
}
function b(e, t, n = "operations", o = {}) {
  throw V([{ code: e, path: n, message: t, relatedIds: [], ...o }]);
}
const U = E().min(1), ke = h({ $ref: U }).strict(), x = ce([U, ke]), K = Z(E(), _), de = {
  parentId: x.default("$root"),
  slot: U.default("content"),
  index: P().int().nonnegative().optional()
}, Ce = [
  "field",
  "source",
  "rule",
  "event",
  "script",
  "dialog",
  "cell"
], Te = [
  h({
    op: $("component.add"),
    type: U,
    ref: U.optional(),
    props: K.optional(),
    ...de
  }).strict(),
  h({
    op: $("component.update"),
    componentId: x,
    props: K
  }).strict(),
  h({
    op: $("component.move"),
    componentId: x,
    ...de
  }).strict(),
  h({ op: $("component.remove"), componentId: x }).strict(),
  ...Ce.flatMap((e) => [
    h({
      op: $(`${e}.upsert`),
      id: x.optional(),
      ref: U.optional(),
      value: K
    }).strict(),
    h({ op: $(`${e}.remove`), id: x }).strict()
  ]),
  h({ op: $("binding.upsert"), value: K }).strict(),
  h({
    op: $("binding.remove"),
    nodeId: x,
    property: U
  }).strict(),
  h({ op: $("settings.bindForm"), formId: x }).strict(),
  h({
    op: $("page.update"),
    value: h({
      title: E().optional(),
      rootProps: K.optional(),
      pageVariables: K.optional()
    }).strict()
  }).strict(),
  h({ op: $("package.import"), value: _ }).strict()
], Oe = D(ce(Te)).min(1).max(1e3), f = E().min(1), X = D(f), M = Z(f, N), z = D(f), $e = h({
  label: f,
  value: f,
  description: f.optional(),
  disabled: f.optional(),
  hidden: f.optional(),
  disabledReason: f.optional(),
  group: f.optional()
}), Fe = h({
  id: f,
  name: f,
  formId: f,
  label: E(),
  type: A(["string", "number", "boolean", "object", "array", "any"]),
  defaultValue: _.optional(),
  description: E().optional(),
  required: L().optional(),
  readOnly: L().optional(),
  clearable: L().optional(),
  submitWhenHidden: L().optional(),
  requiredMessage: E().optional(),
  validationMessage: E().optional(),
  minLength: P().int().nonnegative().optional(),
  maxLength: P().int().nonnegative().optional(),
  min: P().optional(),
  max: P().optional(),
  pattern: E().optional(),
  onChange: f.optional(),
  nodeId: f.optional(),
  validateScriptId: f.optional(),
  clearOnChange: z.optional(),
  optionsSource: N.optional(),
  optionMapping: $e.partial().optional(),
  options: D(
    h({
      label: E(),
      value: _,
      disabled: L().optional(),
      hidden: L().optional(),
      description: E().optional()
    })
  ).optional()
}).passthrough(), _e = h({
  id: f,
  name: E().optional(),
  kind: A(["local", "http", "host"]),
  operation: A(["query", "mutation"]),
  data: _.optional(),
  hostKey: f.optional(),
  params: M.optional(),
  request: h({
    mode: A(["connection", "url"]).optional(),
    url: E().optional(),
    connectionId: f.optional(),
    method: E().optional(),
    path: E().optional(),
    query: M.optional(),
    body: M.optional(),
    headers: M.optional(),
    timeoutMs: P().positive().optional()
  }).optional(),
  filters: D(
    h({
      path: X,
      value: N,
      ignore: D(_).optional()
    })
  ).optional(),
  result: h({
    path: X.optional(),
    errorPath: X.optional(),
    successPath: X.optional(),
    successValue: _.optional(),
    transformScriptId: f.optional()
  }).optional(),
  trigger: h({
    mode: A(["initial", "dependency", "manual"]),
    dependsOn: z.optional(),
    requireNonEmpty: z.optional()
  }).optional()
}).passthrough(), C = {
  id: f,
  disabled: L().optional(),
  when: Q.optional()
}, ae = ce([
  h({
    ...C,
    type: A(["field.set", "page.set", "dialog.set"]),
    field: f,
    value: N,
    valueScriptId: f.optional()
  }),
  h({ ...C, type: $("field.clear"), field: f }),
  h({
    ...C,
    type: A(["form.reset", "form.validate"]),
    fields: z.optional(),
    formId: f.optional(),
    scope: A(["form", "dialog"]).optional()
  }),
  h({
    ...C,
    type: $("dataSource.call"),
    sourceId: f,
    params: M.optional(),
    assignTo: f.optional()
  }),
  h({
    ...C,
    type: $("dialog.open"),
    targetId: f,
    mode: A(["replace", "stack"]).optional(),
    input: M.optional(),
    formId: f.optional(),
    defaults: Z(f, _).optional()
  }),
  h({ ...C, type: $("dialog.close"), targetId: f }),
  h({ ...C, type: $("query.refresh"), sourceId: f }),
  h({
    ...C,
    type: $("script.run"),
    scriptId: f,
    input: M.optional(),
    inputValue: N.optional(),
    assignTo: f.optional()
  }),
  h({
    ...C,
    type: $("host.action"),
    actionId: f,
    input: M.optional(),
    inputValue: N.optional(),
    formId: f.optional(),
    saveForm: L().optional(),
    assignTo: f.optional()
  }),
  h({ ...C, type: $("feedback"), message: N })
]), De = h({
  id: f,
  nodeId: f,
  event: f,
  steps: D(ae),
  onError: D(ae).optional(),
  scope: h({
    formId: f.optional(),
    dialogId: f.optional(),
    tableId: f.optional()
  }).optional()
}).passthrough(), xe = h({
  id: f,
  name: E().optional(),
  type: A(["compute", "validate", "transform", "event"]),
  version: P().int().positive(),
  source: E(),
  input: z.optional(),
  output: z.optional(),
  dependencies: z.optional(),
  serviceVersions: Z(f, f).optional(),
  timeoutMs: P().positive().optional()
}).passthrough(), Le = h({
  id: f,
  targetId: f,
  property: A(["visible", "disabled", "required"]),
  condition: Q.optional(),
  conditions: D(Q).optional(),
  combinator: A(["all", "any"]).optional(),
  scriptId: f.optional(),
  operator: A([
    "equals",
    "notEquals",
    "contains",
    "empty",
    "notEmpty",
    "gt",
    "lt"
  ]).optional(),
  left: N.optional(),
  right: N.optional()
}).passthrough(), Pe = h({ nodeId: f, property: f, value: N, map: $e.optional() }).passthrough(), Ee = {
  field: Fe,
  source: _e,
  binding: Pe,
  rule: Le,
  event: De,
  script: xe
}, Ve = {
  type: "object",
  description: "继承当前 row；不新增事件载荷字段。"
}, T = { type: "string" }, pe = { type: "number" }, W = (e) => ({
  type: "object",
  properties: e
});
function Me(e) {
  const t = (a, l, s = Ve) => ({
    property: a,
    trigger: l,
    scope: "row",
    payload: s,
    result: "事件步骤运行结果；失败交由 onError/运行器反馈",
    constraints: ["设计态不执行；禁用/只读和忙碌状态由物料与宿主共同限制。"]
  }), n = W({
    value: {},
    rawValue: T,
    fieldId: T,
    inputKind: T,
    name: T
  }), o = W({ page: pe, pageSize: pe }), i = {
    type: "object",
    properties: { actionId: T, row: { type: "object" } },
    additionalProperties: !0,
    description: "同时展开当前行字段；actionId 为列 action 或列 id，row 为完整当前行。"
  };
  return {
    ActionButton: [
      t("eventId", "点击按钮"),
      t("menuItems[].eventId", "选择菜单项")
    ],
    Link: [t("eventId", "点击链接")],
    Tabs: [
      t(
        "eventId",
        "切换选项，单项 eventId 优先",
        W({ value: T, label: T, count: {} })
      ),
      t(
        "items[].eventId",
        "切换到指定选项",
        W({ value: T, label: T, count: {} })
      )
    ],
    TextField: [
      t("changeEventId", "输入值变化", n),
      t("focusEventId", "获得焦点", n),
      t("blurEventId", "失去焦点", n)
    ],
    ConfigField: [t("actionEventId", "点击字段附加动作")],
    RecordListField: [
      t("addEventId", "点击添加；配置此事件后替代默认新增行")
    ],
    WorkflowProcess: [t("eventId", "展开状态变化")],
    ExecutionResult: [t("eventId", "关闭进度展示")],
    ThinkingProcess: [
      t("actions[].eventId", "点击底部动作"),
      t("moreActions[].eventId", "点击更多动作"),
      t("outputs[].eventId", "点击输出")
    ],
    DataTable: [
      t(
        "selectionChangeEventId",
        "选择行变化",
        W({
          keys: { type: "array", items: T },
          rows: { type: "array", items: { type: "object" } }
        })
      ),
      t("pageChangeEventId", "页码变化", o),
      t("pageSizeChangeEventId", "每页条数变化", o),
      t("retryEventId", "点击加载失败后的重试", W({})),
      t(
        "rowActionEventId",
        "行操作；列自己的 eventId 优先",
        i
      ),
      t("columns[].eventId", "点击指定列的行操作", i)
    ]
  }[e] ?? [];
}
const Re = [
  "Stack",
  "Repeater",
  "Text",
  "Image",
  "Badge",
  "ActionButton",
  "Link"
], Se = {
  Section: ["content"],
  Stack: ["content"],
  Form: ["content"],
  Repeater: ["content"],
  ScrollPanel: ["header", "content", "footer"],
  ThinkingProcess: ["footer"],
  SplitLayout: ["panes:<paneId>:content"]
};
function we(e) {
  Object.hasOwn(se, e) || b("UNSUPPORTED_MATERIAL", `未知物料 ${e}`, "type", {
    actual: e
  });
  const t = ye[e];
  return !t && !q[e] && b("CATALOG_INCOMPLETE", `物料 ${e} 缺少可移植默认值`, "catalog"), structuredClone(
    t ?? Object.fromEntries(
      Object.entries(q[e]?.props ?? {}).filter(([, n]) => n.default !== void 0).map(([n, o]) => [n, o.default])
    )
  );
}
function oe(e) {
  return Ne(e, {
    io: "input",
    unrepresentable: "any",
    cycles: "ref"
  });
}
const ne = [
  "JSON Schema 不包含所有 refine/transform 约束；最终必须通过共享 validatePackage。",
  "组件 ID 由工具生成；现有 ID 不重建。Form 内禁止嵌套 Form/DataTable；字段 formId 必须与所属 Form 一致。",
  "row 只用于循环项、表格单元格或事件载荷；dialog 只用于弹框；output/result 只在事件步骤执行后可用。",
  "设计和目录查询不调用 HTTP/SDK。事件执行遵守宿主权限、只读与取消规则；服务目录由宿主注入。"
], Ue = {
  field: "表单字段、默认值、选项和校验；name 是值键，id 是配置身份，formId 隔离表单。",
  source: "local/http/host 数据源；连接及认证由宿主提供，支持 initial/dependency/manual 触发。",
  binding: "向目标组件属性绑定值；身份为 nodeId + property，不保存额外 binding ID。",
  rule: "对目标设置 visible/disabled/required；条件或 compute 脚本至少提供一种。",
  event: "按顺序执行 steps；失败进入 onError；nodeId 是所属对象 ID。",
  script: "compute/validate/transform/event 受限脚本；只有 event 可调用已声明并已登记的服务。"
}, ze = {
  field: {
    id: "field-example",
    name: "title",
    formId: "main",
    label: "标题",
    type: "string",
    defaultValue: ""
  },
  source: {
    id: "source-example",
    kind: "local",
    operation: "query",
    data: [],
    trigger: { mode: "manual" }
  },
  binding: {
    nodeId: "component-example",
    property: "text",
    value: { from: "constant", value: "你好" }
  },
  rule: {
    id: "rule-example",
    targetId: "component-example",
    property: "visible",
    condition: {
      operator: "notEmpty",
      left: { from: "constant", value: "内容" }
    }
  },
  event: {
    id: "event-example",
    nodeId: "component-example",
    event: "click",
    steps: [
      {
        id: "step-example",
        type: "feedback",
        message: { from: "constant", value: "已点击" }
      }
    ]
  },
  script: {
    id: "script-example",
    type: "compute",
    version: 1,
    source: "return input",
    timeoutMs: 1e3
  }
};
function Be() {
  for (const n of [
    ...Object.keys(ye),
    ...Object.keys(q)
  ])
    Object.hasOwn(se, n) || b("CATALOG_INCOMPLETE", `物料 ${n} 缺少 schema`, "catalog");
  const e = Object.entries(se).map(([n, o]) => {
    const i = q[n], r = we(n), a = oe(o);
    return {
      id: n,
      category: "material",
      name: le[n] ?? i?.label ?? n,
      version: "1",
      description: i ? `转换物料，公开组件来源 ${i.source}。` : `内置${le[n] ?? n}物料。`,
      parameters: a,
      defaults: r,
      slots: Se[n] ?? [],
      allowedIn: Re.includes(n) ? ["page", "dialog", "cell"] : ["page", "dialog"],
      events: i?.events ?? Me(n),
      binding: {
        supported: !0,
        schemaId: "value-ref",
        forbiddenProperties: [
          "id",
          "fieldId",
          "formId",
          "tableId",
          "dataSourceId",
          "eventId",
          "content"
        ]
      },
      constraints: [...ne, ...i?.warnings ?? []],
      example: {
        type: n,
        props: {
          ...r,
          id: "component-example",
          ...[
            "DataTable",
            "SelectionSummary",
            "Pagination"
          ].includes(n) ? { tableId: "table-example" } : {}
        }
      },
      ...i ? { converted: i } : {}
    };
  }), t = Object.entries(Ee).map(([n, o]) => ({
    id: n,
    category: "logic",
    name: n,
    version: "2",
    description: Ue[n],
    parameters: oe(o),
    example: ze[n],
    constraints: ne
  }));
  return [
    ...e,
    ...t,
    ...Object.entries({
      "value-ref": N,
      condition: Q,
      "action-step": ae,
      package: be,
      operations: Oe
    }).map(([n, o]) => ({
      id: n,
      category: "schema",
      name: n,
      version: "2",
      description: n,
      parameters: oe(o),
      constraints: ne
    }))
  ];
}
let fe;
function Ke() {
  return fe ??= Be(), structuredClone(fe);
}
function et(e = {}) {
  const t = e.offset ?? 0, n = e.limit ?? 20;
  (!Number.isInteger(t) || t < 0 || !Number.isInteger(n) || n < 1 || n > 100) && b(
    "INVALID_QUERY",
    "offset 必须非负，limit 必须为 1–100 整数",
    "catalog"
  );
  let o = Ke();
  if (e.id) {
    const i = o.find((r) => r.id === e.id);
    return i || b(
      "UNSUPPORTED_CAPABILITY",
      `能力不存在 ${e.id}`,
      "catalog.id",
      { actual: e.id }
    ), { version: "1", total: 1, items: [i], nextOffset: null };
  }
  if (e.category && (o = o.filter((i) => i.category === e.category)), e.query) {
    const i = e.query.toLowerCase();
    o = o.filter(
      (r) => `${r.id} ${r.name} ${r.description}`.toLowerCase().includes(i)
    );
  }
  return {
    version: "1",
    total: o.length,
    items: o.slice(t, t + n).map(({ id: i, category: r, name: a, version: l, description: s }) => ({
      id: i,
      category: r,
      name: a,
      version: l,
      description: s
    })),
    nextOffset: t + n < o.length ? t + n : null
  };
}
function ee(e) {
  return [
    {
      id: "$root",
      data: e.page,
      path: "page",
      cell: !1,
      formId: void 0,
      dialogId: void 0
    },
    ...Object.entries(e.cells).map(([t, n]) => ({
      id: `$cell:${t}`,
      data: n,
      path: `cells.${t}`,
      cell: !0,
      formId: void 0,
      dialogId: void 0
    })),
    ...Object.entries(e.dialogs).map(([t, n]) => ({
      id: `$dialog:${t}`,
      data: n.content,
      path: `dialogs.${t}.content`,
      cell: !1,
      formId: n.formId,
      dialogId: t
    }))
  ];
}
function Y(e) {
  return e.type === "SplitLayout" ? (e.props.panes ?? []).map(
    (t) => ({
      slot: `panes:${String(t.id)}:content`,
      owner: t,
      key: "content"
    })
  ) : (Se[e.type] ?? []).map((t) => ({
    slot: t,
    owner: e.props,
    key: t
  }));
}
function R(e) {
  const t = [];
  for (const n of ee(e)) {
    const o = (i, r, a, l, s) => {
      i.forEach((d, u) => {
        if (!d || typeof d != "object" || !d.props) return;
        const m = `${l}[${u}]`;
        t.push({
          node: d,
          list: i,
          index: u,
          parentId: r,
          slot: a,
          canvas: n.data,
          path: m,
          formId: s,
          dialogId: n.dialogId,
          cell: n.cell
        });
        for (const c of Y(d)) {
          const p = `${d.props.id}:${c.slot}`, g = n.data.zones?.[p] ?? c.owner[c.key];
          Array.isArray(g) && o(
            g,
            d.props.id,
            c.slot,
            `${m}.props.${c.slot}`,
            d.type === "Form" ? String(d.props.formId) : s
          );
        }
      });
    };
    o(
      n.data.content,
      n.id,
      "content",
      `${n.path}.content`,
      n.formId
    );
  }
  return t;
}
function H(e, t) {
  const n = R(e).find(
    ({ node: o }) => o.props.id === t
  );
  return n || b("OBJECT_NOT_FOUND", `组件不存在 ${t}`, "componentId", {
    objectId: t
  }), n;
}
function ue(e, t, n) {
  const o = ee(e).find((l) => l.id === t);
  if (o)
    return n !== "content" && b("INVALID_SLOT", "根画布只支持 content 插槽", "slot", {
      expected: "content",
      actual: n
    }), o.data.content;
  const i = H(e, t), r = Y(i.node).find((l) => l.slot === n);
  r || b("INVALID_SLOT", `组件 ${t} 不支持插槽 ${n}`, "slot", {
    objectId: t,
    expected: Y(i.node).map((l) => l.slot),
    actual: n
  });
  const a = i.canvas.zones?.[`${t}:${n}`];
  return a || (Array.isArray(r.owner[r.key]) || (r.owner[r.key] = []), r.owner[r.key]);
}
function me(e, t) {
  const n = R(e), o = /* @__PURE__ */ new Set([t]);
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const r of n)
      o.has(r.parentId) && !o.has(r.node.props.id) && (o.add(r.node.props.id), i = !0);
  }
  return o;
}
function ge(e) {
  const t = [], n = R(e), o = new Map(n.map((s) => [s.node.props.id, s])), i = /* @__PURE__ */ new Set([
    ...o.keys(),
    ...Object.keys(e.logic.fields),
    ...Object.keys(e.dialogs),
    ...e.logic.events.map((s) => s.id)
  ]), r = /* @__PURE__ */ new Set(), a = new Set(
    Object.values(e.logic.fields).map((s) => s.formId)
  );
  Object.values(e.dialogs).forEach(
    (s) => a.add(s.formId)
  );
  const l = (s, d, u, m, c = []) => t.push({ code: s, path: d, message: u, objectId: m, relatedIds: c });
  for (const { node: s, path: d } of n)
    if (s.type === "Form" && a.add(String(s.props.formId)), s.type === "DataTable") {
      const u = String(s.props.tableId);
      r.has(u) && l(
        "DUPLICATE_TABLE",
        `${d}.props.tableId`,
        `表格作用域重复 ${u}`,
        s.props.id,
        [u]
      ), r.add(u);
    }
  for (const { node: s, path: d } of n)
    ["SelectionSummary", "Pagination"].includes(s.type) && !r.has(String(s.props.tableId)) && l(
      "REFERENCE_INVALID",
      `${d}.props.tableId`,
      `表格引用不存在 ${String(s.props.tableId)}`,
      s.props.id,
      [String(s.props.tableId)]
    );
  for (const s of ["bindings", "rules", "events"])
    e.logic[s].forEach((d, u) => {
      const m = "targetId" in d ? d.targetId : d.nodeId;
      i.has(m) || l(
        "REFERENCE_INVALID",
        `logic.${s}[${u}].${"targetId" in d ? "targetId" : "nodeId"}`,
        `节点引用不存在：${m}`,
        "id" in d ? d.id : m,
        [m]
      );
    });
  e.logic.events.forEach((s, d) => {
    s.scope?.formId && !a.has(s.scope.formId) && l(
      "SCOPE_INVALID",
      `logic.events[${d}].scope.formId`,
      "事件表单作用域不存在",
      s.id,
      [s.scope.formId]
    ), s.scope?.dialogId && !e.dialogs[s.scope.dialogId] && l(
      "SCOPE_INVALID",
      `logic.events[${d}].scope.dialogId`,
      "事件弹框作用域不存在",
      s.id,
      [s.scope.dialogId]
    ), s.scope?.tableId && !r.has(s.scope.tableId) && l(
      "SCOPE_INVALID",
      `logic.events[${d}].scope.tableId`,
      "事件表格作用域不存在",
      s.id,
      [s.scope.tableId]
    );
  });
  for (const [s, d] of e.logic.bindings.entries()) {
    let u = o.get(d.nodeId), m = u?.cell ?? !1;
    for (; u; )
      u = o.get(u.parentId), m ||= u?.node.type === "Repeater";
    const c = (p, g) => {
      if (Array.isArray(p)) {
        p.forEach((I, v) => c(I, `${g}[${v}]`));
        return;
      }
      if (!(!F(p) || p.from === "constant")) {
        p.from === "row" && !m && l(
          "SCOPE_INVALID",
          g,
          "row 组件绑定需要单元格或循环容器作用域",
          d.nodeId
        );
        for (const [I, v] of Object.entries(p))
          ve(p, I) || c(v, `${g}.${I}`);
      }
    };
    c(d.value, `logic.bindings[${s}].value`);
  }
  return t;
}
function G(e, t = {}) {
  const n = [], o = (r, a, l, s = {}) => n.push({ code: r, path: a, message: l, relatedIds: [], ...s });
  try {
    const r = _.safeParse(e);
    if (r.success || r.error.issues.forEach(
      (p) => o("INVALID_JSON", p.path.join("."), p.message)
    ), n.length) return i();
    const a = be.safeParse(e);
    if (!a.success)
      return a.error.issues.forEach(
        (p) => o("SCHEMA_INVALID", p.path.join("."), p.message)
      ), i();
    const l = je(e);
    if (!l.valid || !l.value) {
      const p = a.data;
      n.push(...ge(p));
      const g = he(p);
      return l.errors.forEach((I) => {
        const v = I.indexOf("："), O = v >= 0 ? I.slice(0, v) : "package", S = g.filter((w) => w.path === O);
        o(
          S.length ? "REFERENCE_INVALID" : "PACKAGE_INVALID",
          O,
          v >= 0 ? I.slice(v + 1) : I,
          { relatedIds: [...new Set(S.map((w) => w.id))] }
        );
      }), i();
    }
    const s = l.value;
    n.push(...ge(s));
    const d = s.extensions?.workflow;
    t.nodeCode !== void 0 && d?.nodeCode !== t.nodeCode && o(
      "NODE_MISMATCH",
      "extensions.workflow.nodeCode",
      "页面节点身份与目标不一致",
      { expected: t.nodeCode, actual: d?.nodeCode }
    );
    const u = t.surface === "business" ? "runtime" : t.surface;
    u && d?.surface !== u && o(
      "SURFACE_MISMATCH",
      "extensions.workflow.surface",
      "页面用途与目标不一致",
      { expected: u, actual: d?.surface }
    );
    const m = R(s);
    for (const p of m) {
      const { node: g, formId: I, path: v } = p, O = g.props.fieldId;
      let S = m.find(
        (y) => y.node.props.id === p.parentId
      ), w = !1;
      for (; S; ) {
        w ||= S.node.type === "Form";
        const y = S.parentId;
        S = m.find(
          (j) => j.node.props.id === y
        );
      }
      w && ["Form", "DataTable"].includes(g.type) && o(
        "SLOT_RESTRICTION",
        v,
        "表单中不能嵌套 Form 或 DataTable",
        { objectId: g.props.id, actual: g.type }
      ), typeof O == "string" && O && I && !(g.type === "TextField" && g.props.valueMode === "value") && s.logic.fields[O]?.formId !== I && o(
        "FORM_OWNERSHIP",
        `${v}.props.fieldId`,
        "字段归属与所在表单不一致",
        {
          objectId: g.props.id,
          expected: I,
          actual: s.logic.fields[O]?.formId,
          relatedIds: [O]
        }
      );
      const k = (y, j) => {
        if (Array.isArray(y)) {
          y.forEach((B, te) => k(B, `${j}[${te}]`));
          return;
        }
        if (!(!F(y) || y.from === "constant")) {
          y.from === "dialog" && !p.dialogId && o(
            "SCOPE_INVALID",
            j,
            "dialog 绑定只能用于弹框画布",
            { objectId: g.props.id }
          ), (y.from === "output" || y.from === "result") && o(
            "SCOPE_INVALID",
            j,
            "output/result 只能用于事件执行步骤",
            { objectId: g.props.id }
          );
          for (const [B, te] of Object.entries(y))
            ve(y, B) || k(te, `${j}.${B}`);
        }
      };
      if (!q[g.type]) {
        const y = new Set(Y(g).map((j) => j.key));
        for (const [j, B] of Object.entries(g.props))
          !y.has(j) && j !== "panes" && k(B, `${v}.props.${j}`);
      }
    }
    for (const p of ee(s))
      for (const g of Object.keys(p.data.zones ?? {}))
        m.some(
          (v) => v.canvas === p.data && Y(v.node).some(
            (O) => `${v.node.props.id}:${O.slot}` === g
          )
        ) || o(
          "INVALID_SLOT",
          `${p.path}.zones.${g}`,
          "zone 没有对应的组件插槽；请通过语义插槽操作修改"
        );
    const c = d?.settingsFormId;
    return c && !m.some(
      (p) => p.node.type === "Form" && p.node.props.formId === c && !p.dialogId && !p.cell
    ) && o(
      "SETTINGS_FORM_MISSING",
      "extensions.workflow.settingsFormId",
      "配置表单必须位于主页面",
      { actual: c }
    ), i(n.length ? void 0 : s);
  } catch (r) {
    return o(
      "INVALID_PACKAGE",
      "package",
      r instanceof Error ? r.message : String(r)
    ), i();
  }
  function i(r) {
    return {
      valid: n.length === 0,
      errors: n.map((a) => `${a.path}：${a.message}`),
      diagnostics: n,
      ...r ? { value: r } : {}
    };
  }
}
const J = (e) => `${e}-${globalThis.crypto.randomUUID()}`;
function re(e, t) {
  return Array.isArray(e) ? e.map((n) => re(n, t)) : F(e) ? Object.hasOwn(e, "$ref") ? ((Object.keys(e).length !== 1 || typeof e.$ref != "string" || !Object.hasOwn(t, e.$ref)) && b("UNKNOWN_REF", `临时引用不存在 ${String(e.$ref)}`, "$ref"), t[e.$ref]) : Object.fromEntries(
    Object.entries(e).map(([n, o]) => (ie(n) || b("UNSAFE_KEY", `禁止属性 ${n}`, n), [n, re(o, t)]))
  ) : e;
}
function Ae(e) {
  let t = e.extensions?.designerNames?.counters.Form ?? 0;
  const n = [
    ...R(e).map((r) => r.node.props.formId),
    ...Object.values(e.logic.fields).map((r) => r.formId),
    ...Object.values(e.dialogs).map((r) => r.formId)
  ];
  for (const r of n) {
    const a = typeof r == "string" ? /^main(\d+)$/.exec(r) : null;
    a && (t = Math.max(t, Number(a[1])));
  }
  const o = e.extensions ??= {}, i = o.designerNames ??= { counters: {}, items: {} };
  return i.counters.Form = t + 1, `main${t + 1}`;
}
function We(e, t, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of R(e)) {
    if (i.node.type === "TextField" && i.node.props.valueMode === "value")
      continue;
    const r = i.node.props.fieldId;
    if (typeof r != "string" || !e.logic.fields[r]) continue;
    const a = i.formId ?? e.logic.fields[r].formId ?? "main";
    o.has(r) || o.set(r, /* @__PURE__ */ new Map());
    const l = o.get(r);
    l.set(a, [...l.get(a) ?? [], i]);
  }
  for (const [i, r] of o) {
    const a = e.logic.fields[i], l = r.has(a.formId ?? "main") ? a.formId : r.keys().next().value;
    a.formId !== l && (a.formId = l, n.push({ op: "field.ownership", objectId: i }));
    for (const [s, d] of r) {
      if (s === l) continue;
      const u = J("field");
      e.logic.fields[u] = {
        ...structuredClone(a),
        id: u,
        formId: s
      }, d.forEach(({ node: c }) => {
        c.props.fieldId = u;
      });
      const m = e.logic.rules.filter((c) => c.targetId === i).map((c) => ({
        ...structuredClone(c),
        id: J("rule"),
        targetId: u
      }));
      e.logic.rules.push(...m), t[`ownership:${i}:${s}`] = u, n.push(
        { op: "field.cloneForForm", objectId: u },
        ...m.map((c) => ({
          op: "rule.cloneForForm",
          objectId: c.id
        }))
      );
    }
  }
}
function tt(e) {
  h({
    nodeCode: E().trim().min(1),
    surface: A(["settings", "business"]),
    title: E().optional()
  }).strict().safeParse(e).success || b(
    "INVALID_CONTEXT",
    "必须指定 nodeCode 和 settings/business surface",
    "context"
  );
  const t = e.surface === "settings", n = {
    schemaVersion: 2,
    engineVersion: "0.23.0",
    runtimeVersion: "2",
    materialsVersion: "1",
    styleVersion: "1",
    logicVersion: 2,
    pageId: J("page"),
    title: e.title ?? (t ? "节点配置" : "节点展示"),
    page: {
      root: { props: {} },
      content: t ? [
        {
          type: "Form",
          props: {
            id: J("form"),
            formId: "main1",
            content: []
          }
        }
      ] : []
    },
    cells: {},
    dialogs: {},
    logic: {
      logicVersion: 2,
      fields: {},
      pageVariables: {},
      sources: [],
      bindings: [],
      rules: [],
      events: [],
      scripts: []
    },
    extensions: {
      workflow: {
        nodeCode: e.nodeCode,
        surface: t ? "settings" : "runtime",
        ...t ? { settingsFormId: "main1" } : {}
      },
      ...t ? { designerNames: { counters: { Form: 1 }, items: {} } } : {}
    }
  }, o = G(n, e);
  if (!o.value) throw V(o.diagnostics);
  return o.value;
}
function ot(e, t = {}) {
  const n = G(e);
  if (!n.value) throw V(n.diagnostics);
  const o = n.value, i = R(o).map(
    ({ node: l, parentId: s, slot: d, index: u, path: m, formId: c, dialogId: p, cell: g }) => ({
      id: l.props.id,
      type: l.type,
      parentId: s,
      slot: d,
      index: u,
      path: m,
      formId: c,
      dialogId: p,
      cell: g,
      props: structuredClone(l.props)
    })
  ), r = he(o);
  if (t.componentId) {
    const l = i.find(
      (s) => s.id === t.componentId
    );
    return l || b(
      "OBJECT_NOT_FOUND",
      `组件不存在 ${t.componentId}`,
      "componentId"
    ), {
      component: l,
      references: r.filter(
        (s) => s.path.startsWith(`package.${l.path}`)
      ),
      bindings: o.logic.bindings.filter(
        (s) => s.nodeId === l.id
      ),
      rules: o.logic.rules.filter(
        (s) => s.targetId === l.id
      ),
      events: o.logic.events.filter(
        (s) => s.nodeId === l.id
      )
    };
  }
  const a = {
    page: o.page,
    components: i,
    fields: o.logic.fields,
    sources: o.logic.sources,
    bindings: o.logic.bindings,
    rules: o.logic.rules,
    events: o.logic.events,
    scripts: o.logic.scripts,
    cells: o.cells,
    dialogs: o.dialogs,
    references: r,
    extensions: o.extensions,
    logic: o.logic,
    definition: o
  };
  return t.section ? (Object.hasOwn(a, t.section) || b(
    "UNSUPPORTED_SECTION",
    `未知 section ${t.section}`,
    "section"
  ), {
    section: t.section,
    value: structuredClone(a[t.section])
  }) : {
    pageId: o.pageId,
    title: o.title,
    workflow: o.extensions?.workflow,
    rootId: "$root",
    components: i,
    references: r,
    counts: {
      fields: Object.keys(o.logic.fields).length,
      sources: o.logic.sources.length,
      events: o.logic.events.length,
      scripts: o.logic.scripts.length,
      dialogs: Object.keys(o.dialogs).length,
      cells: Object.keys(o.cells).length
    }
  };
}
function Je(e, t, n) {
  const o = String(t.op), i = o === "component.add" ? n : String(t.componentId);
  if (o === "component.update") {
    const m = H(e, i), c = t.props;
    return Object.hasOwn(c, "id") && b("IMMUTABLE_ID", "组件 ID 不允许修改", "props.id", {
      objectId: i
    }), Object.assign(m.node.props, c), i;
  }
  if (o === "component.remove") {
    const m = me(e, i), c = H(e, i);
    c.list.splice(c.index, 1);
    for (const p of Object.keys(c.canvas.zones ?? {}))
      [...m].some((g) => p.startsWith(`${g}:`)) && delete c.canvas.zones[p];
    return i;
  }
  const r = String(t.parentId), a = String(t.slot);
  let l;
  const s = {};
  if (o === "component.move") {
    const m = me(e, i);
    m.has(r) && b(
      "COMPONENT_CYCLE",
      "不能把组件移入自己或自己的子组件",
      "parentId",
      { objectId: i, actual: r }
    ), ue(e, r, a);
    const c = H(e, i);
    l = c.node;
    for (const p of Object.keys(c.canvas.zones ?? {}))
      [...m].some((g) => p.startsWith(`${g}:`)) && (s[p] = c.canvas.zones[p], delete c.canvas.zones[p]);
    c.list.splice(c.index, 1);
  } else {
    const m = String(t.type), c = {
      ...we(m),
      ...t.props
    };
    Object.hasOwn(c, "id") && b(
      "IMMUTABLE_ID",
      "新增组件的 ID 由工具生成；使用 ref 引用",
      "props.id"
    ), m === "Form" && !Object.hasOwn(t.props ?? {}, "formId") && (c.formId = Ae(e)), m === "DataTable" && !c.tableId && (c.tableId = `table-${i}`), l = { type: m, props: { ...c, id: i } };
  }
  const d = ue(e, r, a), u = t.index === void 0 ? d.length : Number(t.index);
  if (u > d.length && b("INDEX_OUT_OF_RANGE", "插入位置超出插槽长度", "index", {
    expected: `0..${d.length}`,
    actual: u
  }), d.splice(u, 0, l), Object.keys(s).length) {
    const m = ee(e).find((c) => c.id === r)?.data ?? H(e, r).canvas;
    Object.assign(m.zones ??= {}, s);
  }
  return i;
}
function He(e, t) {
  const n = {}, o = /* @__PURE__ */ new Map(), i = t.map((a) => {
    const l = a.id ?? (F(a.value) ? a.value.id : void 0), s = typeof l == "string" ? l : J(String(a.op).split(".")[0]);
    return typeof a.ref == "string" && ((!ie(a.ref) || Object.hasOwn(n, a.ref)) && b("DUPLICATE_REF", `临时引用不合法或重复 ${a.ref}`, "ref"), n[a.ref] = s, F(l) && typeof l.$ref == "string" && o.set(a.ref, l.$ref)), s;
  }), r = (a, l = /* @__PURE__ */ new Set()) => {
    l.has(a) && b("REF_CYCLE", `临时引用形成循环 ${a}`, "ref"), Object.hasOwn(n, a) || b("UNKNOWN_REF", `临时引用不存在 ${a}`, "$ref");
    const s = o.get(a);
    return s && (n[a] = r(s, new Set(l).add(a))), n[a];
  };
  for (const a of o.keys()) r(a);
  return t.forEach((a, l) => {
    const s = a.id ?? (F(a.value) ? a.value.id : void 0);
    if (F(s) && typeof s.$ref == "string" && (i[l] = r(s.$ref)), a.op !== "component.add" || !["Form", "DataTable"].includes(String(a.type)))
      return;
    const d = a.type === "Form" ? "formId" : "tableId", u = F(a.props) ? a.props : {};
    if (u[d] || (u[d] = a.type === "Form" ? Ae(e) : `table-${i[l]}`), a.props = u, typeof a.ref == "string" && typeof u[d] == "string") {
      const m = `${a.ref}.${d}`;
      Object.hasOwn(n, m) && b("DUPLICATE_REF", `临时引用与派生标识冲突 ${m}`, "ref"), n[m] = u[d];
    }
  }), { idMap: n, allocated: i };
}
function nt(e, t) {
  const n = G(e);
  if (!n.value) throw V(n.diagnostics);
  let o = structuredClone(n.value);
  const i = Oe.safeParse(t);
  if (!i.success)
    throw V(
      i.error.issues.map((u) => ({
        code: "INVALID_OPERATION",
        path: `operations.${u.path.join(".")}`,
        message: u.message,
        relatedIds: []
      }))
    );
  const r = i.data, { idMap: a, allocated: l } = He(o, r), s = [];
  r.forEach((u, m) => {
    try {
      const c = re(u, a), p = String(c.op);
      let g = String(c.id ?? l[m]);
      if (ie(g) || b("UNSAFE_KEY", "对象 ID 不合法", "id", { actual: g }), p.startsWith("component."))
        g = Je(o, c, l[m]);
      else if (p === "package.import") {
        const I = G(c.value, {
          nodeCode: n.value.extensions?.workflow?.nodeCode,
          surface: n.value.extensions?.workflow?.surface === "settings" ? "settings" : "business"
        });
        if (!I.value) throw V(I.diagnostics);
        o = structuredClone(I.value), g = o.pageId;
      } else if (p === "page.update") {
        const I = c.value;
        typeof I.title == "string" && (o.title = I.title), F(I.rootProps) && Object.assign(
          o.page.root.props ??= {},
          I.rootProps
        ), F(I.pageVariables) && Object.assign(
          o.logic.pageVariables,
          I.pageVariables
        ), g = o.pageId;
      } else if (p === "settings.bindForm")
        o.extensions?.workflow?.surface !== "settings" && b(
          "SURFACE_MISMATCH",
          "settings.bindForm 只适用于设置页",
          "extensions.workflow.surface"
        ), o.extensions.workflow.settingsFormId = String(
          c.formId
        ), g = String(c.formId);
      else if (p.startsWith("binding.")) {
        const I = p.endsWith("upsert") ? c.value : c, v = o.logic.bindings.findIndex(
          (O) => O.nodeId === I.nodeId && O.property === I.property
        );
        g = `${String(I.nodeId)}:${String(I.property)}`, p.endsWith("remove") ? (v < 0 && b("OBJECT_NOT_FOUND", `绑定不存在 ${g}`, "binding"), o.logic.bindings.splice(v, 1)) : (Ie("binding", I), v < 0 ? o.logic.bindings.push(
          I
        ) : o.logic.bindings[v] = I);
      } else {
        const [I, v] = p.split("."), O = c.value;
        O?.id !== void 0 && O.id !== g && b(
          "ID_MISMATCH",
          "操作 id 与 value.id 不一致",
          "value.id",
          { expected: g, actual: O.id }
        );
        const S = Ge(o, I);
        if (v === "remove") qe(S, g);
        else {
          const w = I === "cell" ? O : { ...O, id: g };
          if (I === "event")
            for (const k of ["steps", "onError"])
              Array.isArray(w[k]) && (w[k] = w[k].map(
                (y) => ({
                  ...y,
                  id: y.id ?? J("step")
                })
              ));
          if (Ie(I, w), Array.isArray(S)) {
            const k = S.findIndex(
              (y) => y.id === g
            );
            k < 0 ? S.push(w) : S[k] = w;
          } else S[g] = w;
        }
      }
      s.push({ op: p, objectId: g });
    } catch (c) {
      if (c instanceof Error && "diagnostics" in c) throw c;
      b(
        "INVALID_OPERATION",
        c instanceof Error ? c.message : String(c),
        `operations.${m}`
      );
    }
  }), We(o, a, s);
  const d = G(o);
  if (!d.value) throw V(d.diagnostics);
  for (const [u, m] of Object.entries(a)) {
    const c = R(d.value).find(
      (p) => p.node.props.id === m
    )?.node;
    c?.type === "Form" && (a[`${u}.formId`] = String(c.props.formId)), c?.type === "DataTable" && (a[`${u}.tableId`] = String(c.props.tableId));
  }
  return { definition: d.value, idMap: a, changes: s };
}
function Ie(e, t) {
  const n = Ee[e];
  if (!n) return;
  const o = n.safeParse(t);
  if (!o.success)
    throw V(
      o.error.issues.map((i) => ({
        code: "OBJECT_INVALID",
        path: `${e}.${i.path.join(".")}`,
        message: i.message,
        relatedIds: []
      }))
    );
}
function Ge(e, t) {
  if (t === "cell")
    return e.cells;
  if (t === "dialog")
    return e.dialogs;
  if (t === "field")
    return e.logic.fields;
  const o = {
    source: "sources",
    event: "events",
    script: "scripts",
    rule: "rules"
  }[t];
  return o || b("UNSUPPORTED_OPERATION", `不支持 ${t}`), e.logic[o];
}
function qe(e, t) {
  if (Array.isArray(e)) {
    const n = e.findIndex((o) => o.id === t);
    n < 0 && b("OBJECT_NOT_FOUND", `对象不存在 ${t}`, "id"), e.splice(n, 1);
  } else
    Object.hasOwn(e, t) || b("OBJECT_NOT_FOUND", `对象不存在 ${t}`, "id"), delete e[t];
}
export {
  nt as applyOperations,
  V as authoringError,
  Ke as catalogEntries,
  tt as createAuthoringPackage,
  et as describeCatalog,
  ot as inspectPackage,
  Oe as operationsSchema,
  G as validateAuthoringPackage
};
