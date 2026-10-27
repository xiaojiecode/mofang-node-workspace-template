import { s as d, b as Q, _ as m, o as c, r as k, l as j, n as f, d as L, e as se, c as A, a as h, j as Ie } from "./schemas-DJw7aJPi.js";
const we = "ConfigurableInput", xe = "基础输入框", Se = "src/components/ui/input.tsx", ke = "Input", Ae = { "aria-label": { type: "string", label: "aria-label", default: "", required: !1 }, disabled: { type: "boolean", label: "disabled", options: [!1, !0], default: !1, required: !1 }, maxLength: { type: "number", label: "maxLength", required: !1 }, minLength: { type: "number", label: "minLength", required: !1 }, name: { type: "string", label: "name", default: "", required: !1 }, placeholder: { type: "string", label: "placeholder", default: "", required: !1 }, readOnly: { type: "boolean", label: "readOnly", options: [!1, !0], default: !1, required: !1 }, required: { type: "boolean", label: "required", options: [!1, !0], default: !1, required: !1 }, type: { type: "string", label: "type", default: "text", required: !1 }, value: { type: "string", label: "value", default: "", required: !1 } }, Oe = { onBlur: { label: "onBlur", parameters: [{ name: "event", type: "FocusEvent<HTMLInputElement, Element>" }] }, onChange: { label: "onChange", parameters: [{ name: "event", type: "ChangeEvent<HTMLInputElement>" }] }, onFocus: { label: "onFocus", parameters: [{ name: "event", type: "FocusEvent<HTMLInputElement, Element>" }] } }, Ee = ["默认值仅为配置起始值，不代表组件或业务的真实默认行为；请开发者确认。", "React/HTML 继承属性白名单：value、placeholder、disabled、readOnly、required、maxLength、minLength、type、name、aria-label；事件白名单：onChange、onBlur、onFocus。自定义属性默认保留；ref/key 始终排除。可用 --props / --events 明确选择。未生成事件取值或业务配置。", "id 是框架或 React 保留属性，已排除，不能覆盖框架参数；需要该参数时请写专用适配组件。", "key 是框架或 React 保留属性，已排除，不能覆盖框架参数；需要该参数时请写专用适配组件。", "ref 是框架或 React 保留属性，已排除，不能覆盖框架参数；需要该参数时请写专用适配组件。", "value 包含联合类型 string | number | readonly string[] | undefined，起始值仅选择一种安全类型，需开发者评估。"], qe = {
  name: we,
  label: xe,
  source: Se,
  exportName: ke,
  props: Ae,
  events: Oe,
  warnings: Ee
}, je = "ConfigurableTable", Te = "简易数据表格", Ce = "src/components/ui-m/configurable-table.tsx", Le = "ConfigurableTable", Re = { columns: { type: "array", label: "columns", items: { type: "object", label: "columns[]", properties: { key: { type: "string", label: "key", default: "", required: !0 }, title: { type: "string", label: "title", default: "", required: !0 }, width: { type: "number", label: "width", default: 0, required: !1 }, format: { type: "string", label: "format", options: ["text", "money"], default: "text", required: !1 }, actionLabel: { type: "string", label: "actionLabel", default: "", required: !1 } }, default: { key: "", title: "" } }, default: [], required: !1 }, disabled: { type: "boolean", label: "disabled", options: [!1, !0], default: !1, required: !1 }, error: { type: "string", label: "error", default: "", required: !1 }, loading: { type: "boolean", label: "loading", options: [!1, !0], default: !1, required: !1 }, page: { type: "number", label: "page", default: 1, required: !1 }, pageSize: { type: "number", label: "pageSize", default: 10, required: !1 }, paginationMode: { type: "string", label: "paginationMode", options: ["client", "server"], default: "client", required: !1 }, rowKey: { type: "string", label: "rowKey", default: "id", required: !1 }, rows: { type: "array", label: "rows", items: { type: "object", label: "rows[]", default: {}, description: "Record<string, unknown>" }, default: [], required: !1 }, selectable: { type: "boolean", label: "selectable", options: [!1, !0], default: !1, required: !1 }, selectedKeys: { type: "array", label: "selectedKeys", items: { type: "string", label: "selectedKeys[]", default: "" }, default: [], required: !1 }, total: { type: "number", label: "total", default: 0, required: !1 } }, Ne = { onPageChange: { label: "onPageChange", parameters: [{ name: "page", type: "number" }] }, onPageSizeChange: { label: "onPageSizeChange", parameters: [{ name: "pageSize", type: "number" }] }, onRetry: { label: "onRetry", parameters: [] }, onRowAction: { label: "onRowAction", parameters: [{ name: "row", type: "Record<string, unknown>" }, { name: "action", type: "string" }] }, onSelectionChange: { label: "onSelectionChange", parameters: [{ name: "keys", type: "string[]" }] } }, We = ["默认值仅为配置起始值，不代表组件或业务的真实默认行为；请开发者确认。", "React/HTML 继承属性白名单：value、placeholder、disabled、readOnly、required、maxLength、minLength、type、name、aria-label；事件白名单：onChange、onBlur、onFocus。自定义属性默认保留；ref/key 始终排除。可用 --props / --events 明确选择。未生成事件取值或业务配置。", "columns[] 是对象，生成的结构和起始值需开发者评估，复杂交互需要专用面板。", "rows[] 为字典对象 Record<string, unknown>，仅保留对象边界；字段值按通用 JSON 校验，仍需开发者评估专用面板或适配。"], ze = {
  name: je,
  label: Te,
  source: Ce,
  exportName: Le,
  props: Re,
  events: Ne,
  warnings: We
}, Pe = "WorkflowResearchReport", Me = "选品报告（示例）", Be = "src/components/report-display/workflow-research-report.tsx", Ve = "WorkflowResearchReport", _e = {}, Fe = { onViewList: { label: "onViewList", parameters: [] } }, He = ["默认值仅为配置起始值，不代表组件或业务的真实默认行为；请开发者确认。", "React/HTML 继承属性白名单：value、placeholder、disabled、readOnly、required、maxLength、minLength、type、name、aria-label；事件白名单：onChange、onBlur、onFocus。自定义属性默认保留；ref/key 始终排除。可用 --props / --events 明确选择。未生成事件取值或业务配置。"], Ke = {
  name: Pe,
  label: Me,
  source: Be,
  exportName: Ve,
  props: _e,
  events: Fe,
  warnings: He
}, dt = {
  ConfigurableInput: qe,
  ConfigurableTable: ze,
  WorkflowResearchReport: Ke
};
function ge(t) {
  if (!/^https?:\/\//i.test(t) || t.trim() !== t)
    throw new Error("请输入以 http:// 或 https:// 开头的完整接口 URL");
  const a = new URL(t);
  if (!["http:", "https:"].includes(a.protocol) || a.username || a.password)
    throw new Error("接口 URL 不允许包含账号密码或使用非 HTTP 协议");
  return a;
}
function ct(t, a) {
  const r = ge(t);
  if (/^[a-z][a-z\d+.-]*:/i.test(a) || a.startsWith("//"))
    throw new Error("接口路径必须是已登记连接内的相对路径");
  const o = new URL(a, r);
  if (o.origin !== r.origin || o.username || o.password)
    throw new Error("接口路径不能越过已登记连接");
  return o;
}
function Ue(t, a = !1) {
  if (t.kind !== "http") return;
  const r = t.request;
  if (r?.mode && !["connection", "url"].includes(r.mode))
    throw new Error(`HTTP 地址方式无效：${t.id}`);
  if (r?.mode === "url") {
    a || ge(r.url ?? "");
    return;
  }
  if (!a && (!r?.connectionId || !r.path))
    throw new Error(`HTTP 数据源缺少连接目标或路径：${t.id}`);
  if (r?.path && (/^[a-z][a-z\d+.-]*:/i.test(r.path) || r.path.startsWith("//")))
    throw new Error(`接口路径必须是相对路径：${t.id}`);
}
const $ = (t) => !!t && typeof t == "object" && !Array.isArray(t), De = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]), w = (t) => !!t && !De.has(t), me = (t, a) => (a === "rows" || a === "selectedKeys") && "tableId" in t && "columns" in t || a === "data" && typeof t.kind == "string" && "operation" in t || a === "pageVariables" && "logicVersion" in t || (a === "defaultValue" || a === "options") && ["string", "number", "boolean", "object", "array", "any"].includes(
  String(t.type)
) || a === "defaults" && t.type === "dialog.open" || a === "fallback" && typeof t.from == "string" || a === "successValue" && ("successPath" in t || "errorPath" in t || "path" in t) || a === "ignore" && "path" in t && "value" in t, pt = (t) => t === !0 || t === "true" || t === 1, M = (t, a = []) => a.reduce(
  (r, o) => w(o) && ($(r) || Array.isArray(r)) && Object.prototype.hasOwnProperty.call(r, o) ? r[o] : void 0,
  t
);
function Y(t, a) {
  let r;
  if (t.from === "constant") r = t.value;
  else if (t.from === "object")
    r = Object.fromEntries(
      Object.entries(t.entries).map(([o, s]) => {
        if (!w(o)) throw new Error("禁止原型链键");
        return [o, Y(s, a)];
      })
    );
  else if (t.from === "array")
    r = t.items.map((o) => Y(o, a));
  else if (t.from === "form") {
    const o = t.formId ?? a.scope?.formId, s = a.forms?.[o ?? "main"];
    r = M(
      s ?? (o && a.forms ? void 0 : a.form),
      t.path
    );
  } else if (t.from === "source") {
    const o = a.sources[t.sourceId];
    r = ["data", "status", "error"].includes(t.path?.[0] ?? "") ? M(o, t.path) : M(o?.data, t.path);
  } else if (t.from === "table")
    r = M(
      a.tables[t.tableId || a.scope?.tableId || ""],
      t.path
    );
  else if (t.from === "dialog") {
    const o = a.scope?.dialogId ? [...a.dialogStack ?? [], a.dialog].reverse().find((s) => s.targetId === a.scope?.dialogId) : a.dialog;
    r = M(o, t.path);
  } else r = M(a[t.from], t.path);
  if (r === void 0 && (r = t.fallback), r !== void 0 && t.valueType && t.valueType !== "any" && (t.valueType === "array" ? !Array.isArray(r) : t.valueType === "null" ? r !== null : t.valueType === "object" ? !$(r) : typeof r !== t.valueType))
    throw new Error(`绑定类型不匹配，需要 ${t.valueType}`);
  return r;
}
function te(t, a) {
  if (t.operator === "all" || t.operator === "any")
    return t.operator === "all" ? t.conditions.every((s) => te(s, a)) : t.conditions.some((s) => te(s, a));
  if (t.operator === "not") return !te(t.condition, a);
  if (!("left" in t)) return !1;
  const r = Y(t.left, a), o = t.right ? Y(t.right, a) : void 0;
  switch (t.operator) {
    case "equals":
      return JSON.stringify(r) === JSON.stringify(o);
    case "notEquals":
      return JSON.stringify(r) !== JSON.stringify(o);
    case "contains":
      return (Array.isArray(r) || typeof r == "string" && typeof o == "string") && r.includes(o);
    case "empty":
    case "notEmpty": {
      const s = r == null || r === "" || Array.isArray(r) && !r.length;
      return t.operator === "empty" ? s : !s;
    }
    case "gt":
      return typeof r == "number" && typeof o == "number" && r > o;
    case "lt":
      return typeof r == "number" && typeof o == "number" && r < o;
  }
}
const ft = (t) => t === void 0 ? t : JSON.parse(JSON.stringify(t)), ut = () => `lc-${Date.now().toString(36)}-${Array.from(crypto.getRandomValues(new Uint32Array(2)), (t) => t.toString(36)).join("")}`;
class be extends Error {
}
const gt = (t, a, r) => new Promise((o, s) => {
  const b = () => s(new be(r));
  if (a.aborted) return b();
  a.addEventListener("abort", b, { once: !0 }), t.then(o, s).finally(() => a.removeEventListener("abort", b));
}), mt = (t) => t instanceof be || t instanceof Error && t.name === "AbortError";
function Je(t, a, r = {}) {
  const o = (e) => {
    throw new Error(e);
  };
  (!$(t) || t.logicVersion !== 2 || !["sources", "bindings", "rules", "events", "scripts"].every(
    (e) => Array.isArray(t[e])
  )) && o("运行定义必须使用 logicVersion=2 且包含完整数组");
  const s = t, b = /* @__PURE__ */ new Set(), g = (e) => {
    if (e == null || typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e)) return;
    !Array.isArray(e) && !$(e) && o("逻辑定义只能包含 JSON 数据");
    const i = e;
    b.has(i) && o("逻辑定义不能包含循环引用"), !Array.isArray(i) && Object.getPrototypeOf(i) !== Object.prototype && Object.getPrototypeOf(i) !== null && o("逻辑定义不能包含 SDK 或类实例"), b.add(i);
    for (const [l, n] of Object.entries(i))
      w(l) || o(`不允许的属性：${l}`), g(n);
    b.delete(i);
  };
  g(s);
  for (const e of ["fields", "pageVariables"])
    s[e] !== void 0 && !$(s[e]) && o(`${e} 必须为对象`);
  const y = (e, i) => {
    const l = /* @__PURE__ */ new Set();
    for (const n of e)
      (!$(n) || typeof n.id != "string" || !w(n.id) || l.has(n.id)) && o(`${i} ID 为空、重复或无效`), l.add(n.id);
    return l;
  }, v = y(s.sources, "数据源"), P = y(s.scripts, "脚本"), R = y(s.events, "事件");
  y(s.rules, "规则");
  const T = (e) => {
    (!e || a && !a.has(e)) && o(`节点引用不存在：${e}`);
  }, O = (e, i) => {
    e && !P.has(e) && o(`脚本引用不存在：${e}`), e && i && s.scripts.find((l) => l.id === e)?.type !== i && o(`脚本 ${e} 必须是 ${i} 类型`);
  }, I = new Set(
    Object.values(s.fields ?? {}).map((e) => e.formId ?? "main")
  );
  I.add("main");
  for (const e of s.events)
    for (const i of [
      ...Array.isArray(e.steps) ? e.steps : [],
      ...Array.isArray(e.onError) ? e.onError : []
    ])
      i.type === "dialog.open" && typeof i.formId == "string" && w(i.formId) && I.add(i.formId);
  const S = (e) => {
    (!$(e) || typeof e.from != "string") && o("绑定必须声明 from");
    const i = e;
    i.from === "object" && ($(i.entries) || o("对象绑定缺少 entries"), Object.values(i.entries).forEach(
      S
    )), i.from === "array" && (Array.isArray(i.items) || o("数组绑定缺少 items"), i.items.forEach(S));
  }, E = (e) => {
    e !== void 0 && ($(e) || o("绑定参数必须是对象"), Object.values(e).forEach(S));
  }, C = (e) => {
    if (Array.isArray(e)) return e.forEach(C);
    if ($(e)) {
      if ("operator" in e) {
        const i = e.operator;
        [
          "equals",
          "notEquals",
          "contains",
          "empty",
          "notEmpty",
          "gt",
          "lt",
          "all",
          "any",
          "not"
        ].includes(String(i)) || o("条件运算符无效"), (i === "all" || i === "any") && !Array.isArray(e.conditions) && o("组合条件必须包含 conditions"), i === "not" && !$(e.condition) && o("否定条件必须包含 condition"), !["all", "any", "not"].includes(String(i)) && !$(e.left) && o("条件缺少左侧值"), ["all", "any", "not"].includes(String(i)) || S(e.left), ["equals", "notEquals", "contains", "gt", "lt"].includes(
          String(i)
        ) && S(e.right), (i === "all" || i === "any") && e.conditions.some(
          (l) => !$(l) || !("operator" in l)
        ) && o("组合条件结构无效"), i === "not" && $(e.condition) && !("operator" in e.condition) && o("否定条件结构无效");
      }
      for (const i of Object.keys(e))
        w(i) || o(`不允许的属性：${i}`);
      if ("from" in e && (S(e), [
        "constant",
        "object",
        "array",
        "forms",
        "result",
        "form",
        "page",
        "row",
        "dialog",
        "host",
        "source",
        "table",
        "output"
      ].includes(String(e.from)) || o("绑定来源无效"), e.from === "object" && !$(e.entries) && o("对象绑定缺少 entries"), e.from === "array" && !Array.isArray(e.items) && o("数组绑定缺少 items"), e.from === "constant" && !Object.hasOwn(e, "value") && o("常量绑定缺少 value"), e.valueType !== void 0 && ![
        "any",
        "null",
        "boolean",
        "number",
        "string",
        "object",
        "array"
      ].includes(String(e.valueType)) && o("绑定类型声明无效"), e.path !== void 0 && (!Array.isArray(e.path) || !e.path.every(
        (i) => typeof i == "string" && w(i)
      )) && o("绑定路径无效"), e.from === "source" && !v.has(String(e.sourceId)) && o(`数据源引用不存在：${e.sourceId}`), e.from === "table" && (typeof e.tableId != "string" || !w(e.tableId)) && o("表格引用无效"), e.from === "form" && e.formId !== void 0 && (typeof e.formId != "string" || !I.has(e.formId)) && o(`表单引用不存在：${String(e.formId)}`), e.from === "form" && Array.isArray(e.path) && e.path.length && !Object.entries(s.fields ?? {}).some(
        ([i, l]) => (l.name ?? i) === e.path[0] && (!e.formId || (l.formId ?? "main") === e.formId)
      ) && o(`字段引用不存在：${e.path[0]}`)), e.from !== "constant")
        for (const [i, l] of Object.entries(e))
          me(e, i) || C(l);
    }
  };
  C(s);
  const _ = /* @__PURE__ */ new Set();
  for (const [e, i] of Object.entries(s.fields ?? {})) {
    const l = `${i.formId ?? "main"}:${i.name ?? e}`;
    _.has(l) && o(`表单内字段名称重复：${l}`), _.add(l), (!w(e) || !$(i) || !["string", "number", "boolean", "object", "array", "any"].includes(
      i.type
    )) && o(`字段类型无效：${e}`), i.id !== void 0 && i.id !== e && o(`字段键与 ID 不一致：${e}`);
    for (const n of ["id", "name", "formId"])
      i[n] !== void 0 && (typeof i[n] != "string" || !w(i[n])) && o(`字段标识无效：${e}.${n}`);
    for (const n of [
      "required",
      "readOnly",
      "clearable",
      "submitWhenHidden"
    ])
      i[n] !== void 0 && typeof i[n] != "boolean" && o(`字段状态无效：${e}.${n}`);
    i.onChange !== void 0 && !R.has(i.onChange) && o(`字段事件不存在：${i.onChange}`), i.optionsSource !== void 0 && S(i.optionsSource);
    for (const [n, p] of Object.entries(i.optionMapping ?? {}))
      (![
        "label",
        "value",
        "description",
        "disabled",
        "hidden",
        "disabledReason",
        "group"
      ].includes(n) || typeof p != "string" || !p.split(".").every(w)) && o(`选项映射路径无效：${e}.${n}`);
    if (i.options !== void 0) {
      Array.isArray(i.options) || o(`选项必须为数组：${e}`);
      const n = /* @__PURE__ */ new Set();
      for (const p of i.options) {
        (!$(p) || typeof p.label != "string" || !Object.hasOwn(p, "value")) && o(`选项结构无效：${e}`);
        const H = JSON.stringify(p.value);
        n.has(H) && o(`重复选项值：${e}`), n.add(H);
      }
    }
    i.nodeId !== void 0 && T(i.nodeId);
    for (const n of ["minLength", "maxLength", "min", "max"]) {
      const p = i[n];
      p !== void 0 && (typeof p != "number" || !Number.isFinite(p) || (n === "minLength" || n === "maxLength") && (!Number.isInteger(p) || p < 0)) && o(`字段约束无效：${e}.${n}`);
    }
    (i.minLength !== void 0 && i.maxLength !== void 0 && i.minLength > i.maxLength || i.min !== void 0 && i.max !== void 0 && i.min > i.max) && o(`字段范围无效：${e}`);
    for (const n of [
      "requiredMessage",
      "validationMessage",
      "pattern",
      "label",
      "description"
    ])
      i[n] !== void 0 && typeof i[n] != "string" && o(`字段约束无效：${e}.${n}`);
    if (i.pattern !== void 0)
      try {
        new RegExp(i.pattern);
      } catch {
        o(`字段正则无效：${e}`);
      }
    O(i.validateScriptId, "validate");
    for (const n of i.clearOnChange ?? [])
      n in (s.fields ?? {}) || o(`清理字段不存在：${n}`);
  }
  const N = (e, i) => {
    i.has(e) && o(`字段依赖循环：${[...i, e].join(" → ")}`);
    const l = new Set(i).add(e);
    for (const n of s.fields?.[e]?.clearOnChange ?? [])
      N(n, l);
  };
  Object.keys(s.fields ?? {}).forEach((e) => N(e, /* @__PURE__ */ new Set()));
  for (const e of s.sources) {
    E(e.params), E(e.request?.query), E(e.request?.body), E(e.request?.headers);
    for (const i of e.filters ?? []) S(i.value);
    for (const i of [e.trigger?.dependsOn, e.trigger?.requireNonEmpty]) {
      i !== void 0 && !Array.isArray(i) && o(`数据源依赖必须为数组：${e.id}`);
      for (const l of i ?? []) {
        (typeof l != "string" || !l.split(".").every(w)) && o(`数据源依赖路径无效：${e.id}`);
        const [n, p, H] = l.split(".");
        n === "form" && p && !Object.hasOwn(s.fields ?? {}, p) && o(`数据源依赖字段不存在：${p}`), n === "forms" && p && (!I.has(p) || H && !Object.entries(s.fields ?? {}).some(
          ([$e, le]) => (le.formId ?? "main") === p && (le.name ?? $e) === H
        )) && o(`数据源依赖表单字段不存在：${l}`), n === "sources" && p && !v.has(p) && o(`数据源依赖不存在：${p}`);
      }
    }
    (!["local", "http", "host"].includes(e.kind) || !["query", "mutation"].includes(e.operation)) && o(`数据源类型无效：${e.id}`), Ue(e, r.mode === "design"), e.request?.timeoutMs !== void 0 && (!Number.isFinite(e.request.timeoutMs) || e.request.timeoutMs <= 0) && o(`请求超时无效：${e.id}`), e.trigger && !["initial", "dependency", "manual"].includes(e.trigger.mode) && o(`数据源触发方式无效：${e.id}`), O(e.result?.transformScriptId, "transform");
    for (const i of Object.keys(e.request?.headers ?? {}))
      /authorization|cookie|token|api[-_]?key/i.test(i) && o("凭据由宿主注入，不能保存到页面");
  }
  const D = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Set([
    "id",
    "fieldId",
    "formId",
    "tableId",
    "dataSourceId",
    "eventId",
    "puck",
    "content"
  ]);
  for (const e of s.bindings) {
    if (S(e.value), T(e.nodeId), e.map !== void 0) {
      (!$(e.map) || !e.map.label || !e.map.value) && o("选项映射必须包含 label 和 value 路径");
      for (const [l, n] of Object.entries(e.map))
        (![
          "label",
          "value",
          "description",
          "disabled",
          "hidden",
          "disabledReason",
          "group"
        ].includes(l) || typeof n != "string" || !n.split(".").every((p) => p.trim() === p && w(p))) && o(`选项映射路径无效：${l}`);
    }
    (!e.value || !w(e.property) || F.has(e.property) || e.property.startsWith("__") || e.property.startsWith("on")) && o("数据绑定属性无效");
    const i = `${e.nodeId}:${e.property}`;
    D.has(i) && o(`重复绑定：${i}`), D.add(i);
  }
  for (const e of s.rules)
    T(e.targetId), O(e.scriptId, "compute"), ["visible", "disabled", "required"].includes(e.property) || o("规则属性无效"), !e.scriptId && !(e.condition || e.conditions?.length || e.left && e.operator) && o(`规则缺少条件：${e.id}`), e.condition && !("operator" in e.condition) && o(`规则条件无效：${e.id}`);
  const ee = /* @__PURE__ */ new Set();
  for (const e of s.events) {
    T(e.nodeId);
    const i = `${e.nodeId}:${e.event}`;
    ee.has(i) && o(`重复事件：${i}`), ee.add(i), (typeof e.event != "string" || !e.event) && o("事件名称无效"), (!Array.isArray(e.steps) || e.onError !== void 0 && !Array.isArray(e.onError)) && o("事件动作必须为数组");
    for (const l of [e.steps, e.onError ?? []]) {
      y(l, "动作");
      for (const n of l)
        "input" in n && E(n.input), "inputValue" in n && n.inputValue !== void 0 && S(n.inputValue), "params" in n && E(n.params), "value" in n && S(n.value), "valueScriptId" in n && n.valueScriptId !== void 0 && ((!["field.set", "page.set", "dialog.set"].includes(
          n.type
        ) || typeof n.valueScriptId != "string" || !n.valueScriptId) && o("自定义赋值逻辑必须用于写入值，且指定有效脚本 ID"), O(n.valueScriptId, "compute")), "message" in n && S(n.message), "formId" in n && n.formId !== void 0 && !I.has(n.formId) && o(`表单引用不存在：${n.formId}`), n.when && !("operator" in n.when) && o(`动作条件无效：${n.id}`), [
          "field.set",
          "field.clear",
          "form.reset",
          "page.set",
          "dialog.set",
          "form.validate",
          "dataSource.call",
          "query.refresh",
          "dialog.open",
          "dialog.close",
          "script.run",
          "host.action",
          "feedback"
        ].includes(n.type) || o(`未知动作类型：${n.type}`), (n.type === "dataSource.call" || n.type === "query.refresh") && !v.has(n.sourceId) && o(`数据源引用不存在：${n.sourceId}`), n.type === "script.run" && !P.has(n.scriptId) && o(`脚本引用不存在：${n.scriptId}`), (n.type === "dialog.open" || n.type === "dialog.close") && !n.targetId && o(`弹框目标无效：${n.id}`), n.type === "dialog.open" && n.mode !== void 0 && !["replace", "stack"].includes(n.mode) && o(`弹框打开方式无效：${n.id}`), "sourceId" in n && !v.has(n.sourceId) && o(`数据源引用不存在：${n.sourceId}`), "targetId" in n && n.targetId !== "__current__" && T(n.targetId), "scriptId" in n && O(n.scriptId), ["field.set", "page.set", "dialog.set"].includes(n.type) && (!("field" in n) || !w(n.field) || !("value" in n) || !$(n.value)) && o(`赋值动作无效：${n.id}`), n.type === "host.action" && (!n.actionId || !w(n.actionId)) && o(`宿主动作无效：${n.id}`), n.type === "feedback" && !$(n.message) && o(`反馈动作无效：${n.id}`), (n.type === "form.validate" || n.type === "form.reset") && n.fields?.some((p) => !(p in (s.fields ?? {}))) && o(`表单字段引用不存在：${n.id}`), (n.type === "field.set" || n.type === "field.clear") && !(n.field in (s.fields ?? {})) && o(`字段引用不存在：${n.field}`);
    }
  }
  for (const e of s.scripts) {
    for (const i of [e.input, e.output])
      i !== void 0 && (!Array.isArray(i) || i.some(
        (l) => typeof l != "string" || !l.split(".").every(w)
      )) && o(`脚本输入输出声明无效：${e.id}`);
    if (e.dependencies !== void 0 && (!Array.isArray(e.dependencies) || e.dependencies.some((i) => typeof i != "string")) && o(`脚本依赖无效：${e.id}`), e.serviceVersions !== void 0) {
      $(e.serviceVersions) || o(`脚本服务版本无效：${e.id}`);
      for (const [i, l] of Object.entries(e.serviceVersions))
        (!e.dependencies?.includes(`service:${i}`) || typeof l != "string" || !l.trim()) && o(`脚本服务版本缺少依赖或版本号：${i}`);
    }
    e.timeoutMs !== void 0 && (!Number.isFinite(e.timeoutMs) || e.timeoutMs <= 0 || e.timeoutMs > 3e4) && o(`脚本超时无效：${e.id}`);
    for (const i of e.dependencies ?? []) {
      const [l, ...n] = i.split(":"), p = n.join(":");
      p || o(`脚本依赖缺少目标：${i}`), l === "source" && !v.has(p) && o(`脚本数据源引用不存在：${p}`), l === "dialog" && T(p), l === "service" && (e.type !== "event" || !/^[a-zA-Z][\w-]*$/.test(p) || !w(p)) && o(`只有事件脚本可以声明有效服务：${i}`), [
        "source",
        "action",
        "dialog",
        "capability",
        "form",
        "service"
      ].includes(l) || o(`未知脚本依赖：${i}`);
    }
  }
  for (const e of s.scripts)
    (!["compute", "validate", "transform", "event"].includes(e.type) || typeof e.source != "string" || !Number.isInteger(e.version) || e.version < 1) && o(`脚本登记无效：${e.id}`);
}
function bt(t, a) {
  const r = [], o = (s, b) => {
    Array.isArray(s) ? s.forEach((g, y) => o(g, `${b}[${y}]`)) : $(s) && s.from !== "constant" && (s.from === "form" && Array.isArray(s.path) && s.path[0] === (t.fields?.[a]?.name ?? a) && (!s.formId || s.formId === (t.fields?.[a]?.formId ?? "main")) && t.fields?.[a] && r.push(`${b}.path`), Object.entries(s).forEach(([g, y]) => {
      me(s, g) || ([
        "sourceId",
        "scriptId",
        "transformScriptId",
        "valueScriptId",
        "validateScriptId",
        "targetId",
        "nodeId",
        "field"
      ].includes(g) && y === a ? r.push(`${b}.${g}`) : g === "path" && s.from !== "form" && Array.isArray(y) && y.includes(a) ? r.push(`${b}.${g}`) : (g === "dependsOn" || g === "requireNonEmpty") && Array.isArray(y) && y.some(
        (v) => typeof v == "string" && (v === `form.${a}` || v.startsWith(`form.${a}.`) || t.fields?.[a] && v === `forms.${t.fields[a].formId ?? "main"}.${t.fields[a].name ?? a}` || v.startsWith(`sources.${a}.`))
      ) ? r.push(`${b}.${g}`) : (g === "dependencies" || g === "clearOnChange" || g === "fields") && Array.isArray(y) && y.some(
        (v) => v === a || String(v).endsWith(`:${a}`)
      ) ? r.push(`${b}.${g}`) : g === "source" && typeof y == "string" && y.includes(a) ? r.push(`${b}.${g} (脚本源码，需人工核对)`) : o(y, `${b}.${g}`));
    }));
  };
  return o(t, "runtimeDefinition"), r;
}
const x = d().min(1).refine(w, "禁止原型链键"), oe = h(x), q = Q(
  () => L([
    se(),
    A(),
    f().finite(),
    d(),
    h(q),
    k(x, q)
  ])
), B = {
  fallback: q.optional(),
  valueType: m(["any", "null", "boolean", "number", "string", "object", "array"]).optional()
}, z = Q(
  () => L([
    c({ from: j("constant"), value: q, ...B }).strict(),
    c({
      from: j("object"),
      entries: k(x, z),
      ...B
    }).strict(),
    c({
      from: j("array"),
      items: h(z),
      ...B
    }).strict(),
    c({
      from: m([
        "form",
        "forms",
        "page",
        "row",
        "dialog",
        "host",
        "output",
        "result"
      ]),
      formId: x.optional(),
      path: oe.optional(),
      ...B
    }).strict(),
    c({
      from: j("source"),
      sourceId: x,
      path: oe.optional(),
      ...B
    }).strict(),
    c({
      from: j("table"),
      tableId: x,
      path: oe.optional(),
      ...B
    }).strict()
  ])
), re = Q(
  () => L([
    c({
      operator: m([
        "equals",
        "notEquals",
        "contains",
        "gt",
        "lt"
      ]),
      left: z,
      right: z
    }).strict(),
    c({
      operator: m(["empty", "notEmpty"]),
      left: z
    }).strict(),
    c({
      operator: m(["all", "any"]),
      conditions: h(re)
    }).strict(),
    c({ operator: j("not"), condition: re }).strict()
  ])
), ie = c({
  root: c({ props: k(d(), q).optional() }).passthrough(),
  content: h(q),
  zones: k(d(), h(q)).optional()
}).passthrough(), Ge = c({
  id: x,
  name: x,
  formId: x,
  label: d(),
  type: m(["string", "number", "boolean", "object", "array", "any"]),
  defaultValue: q.optional()
}).passthrough(), Ze = c({
  logicVersion: j(2),
  fields: k(x, Ge),
  pageVariables: k(x, q),
  sources: h(q),
  bindings: h(q),
  rules: h(q),
  events: h(q),
  scripts: h(q)
}).passthrough().superRefine((t, a) => {
  try {
    Je(t);
  } catch (r) {
    a.addIssue({
      code: "custom",
      message: r instanceof Error ? r.message : String(r)
    });
  }
}).transform((t) => t), yt = c({
  schemaVersion: j(2),
  engineVersion: j("0.23.0"),
  runtimeVersion: j("2"),
  materialsVersion: j("1"),
  styleVersion: j("1"),
  logicVersion: j(2),
  pageId: x,
  title: d(),
  page: ie,
  cells: k(x, ie),
  dialogs: k(
    x,
    c({
      id: x,
      title: d(),
      content: ie,
      formId: x,
      initialBindings: k(x, z),
      width: f().finite().min(240).max(1920).optional(),
      bodySpacing: c({
        top: f().finite().min(0).max(128).optional(),
        right: f().finite().min(0).max(128).optional(),
        bottom: f().finite().min(0).max(128).optional(),
        left: f().finite().min(0).max(128).optional()
      }).strict().optional()
    }).strict()
  ),
  logic: Ze,
  extensions: c({
    designSource: c({
      id: f().int().positive(),
      pageKey: d(),
      version: f().int().positive()
    }).strict().optional(),
    designerNames: c({
      counters: k(x, f().int().positive()),
      items: k(
        x,
        c({
          type: d(),
          ordinal: f().int().positive()
        }).strict()
      )
    }).strict().optional(),
    workflow: c({
      nodeCode: d(),
      surface: m(["settings", "runtime"]),
      settingsFormId: x.optional()
    }).strict().optional()
  }).strict().optional()
}).strict(), Xe = 1024 * 1024;
function Ye(t) {
  return t.length <= 4096 && !/[;{}<>\\]/.test(t) && /^(#[a-f\d]{3,8}|[a-z]+|(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|var|color-mix|light-dark)\(.+\))$/i.test(
    t
  );
}
function ye(t) {
  if (/^data:image\/(png|jpeg|webp|gif|avif);base64,[a-z\d+/=]+$/i.test(t))
    return t.length <= Math.ceil(Xe / 3) * 4 + 64;
  try {
    const a = new URL(t);
    return ["http:", "https:"].includes(a.protocol) && !a.username && !a.password;
  } catch {
    return !1;
  }
}
function ht(t = {}) {
  const {
    background: a,
    backgroundColor: r,
    backgroundGradient: o,
    backgroundImage: s,
    backgroundSize: b,
    backgroundPosition: g,
    backgroundRepeat: y,
    backgroundAttachment: v,
    backgroundOrigin: P,
    backgroundClip: R,
    backgroundLayerOrder: T,
    backgroundBlendMode: O,
    border: I,
    borderStyle: S,
    borderColor: E,
    radius: C,
    maxWidth: _,
    padding: N,
    ...D
  } = t, F = s && ye(s) ? `url(${JSON.stringify(s)})` : void 0, e = (T === "image-first" ? [F && "image", o && "gradient"] : [o && "gradient", F && "image"]).filter(Boolean), i = (l, n) => e.length ? e.map(
    (p) => p === "image" ? l : n
  ).join(", ") : void 0;
  return {
    minWidth: 0,
    ...D,
    paddingTop: t.paddingTop ?? N,
    paddingRight: t.paddingRight ?? N,
    paddingBottom: t.paddingBottom ?? N,
    paddingLeft: t.paddingLeft ?? N,
    maxWidth: _ ? `min(100%, ${_}px)` : "100%",
    backgroundColor: r ?? (a ? `var(--${a === "default" ? "background" : a})` : void 0),
    backgroundImage: e.map(
      (l) => l === "image" ? F : o
    ).join(", ") || void 0,
    backgroundSize: i(b ?? "auto", "100% 100%"),
    backgroundPosition: i(
      g ?? "center",
      "center"
    ),
    backgroundRepeat: i(
      y ?? "no-repeat",
      "no-repeat"
    ),
    backgroundAttachment: i(
      v ?? "scroll",
      "scroll"
    ),
    backgroundOrigin: P,
    backgroundClip: R,
    backgroundBlendMode: O,
    borderStyle: S ?? (I ? "solid" : void 0),
    borderColor: E ?? (I ? "var(--border)" : void 0),
    borderTopWidth: t.borderTopWidth ?? (I ? 1 : void 0),
    borderRightWidth: t.borderRightWidth ?? (I ? 1 : void 0),
    borderBottomWidth: t.borderBottomWidth ?? (I ? 1 : void 0),
    borderLeftWidth: t.borderLeftWidth ?? (I ? 1 : void 0),
    borderRadius: C
  };
}
const Qe = /^\d*\.?\d+(px|%|rem|em|vh|vw)?$/, J = L([
  f().finite().nonnegative(),
  d().regex(Qe)
]), G = L([
  f().finite(),
  d().regex(/^(auto|-?\d*\.?\d+(px|%|rem|em|vh|vw)?)$/)
]), Z = L([
  f().finite().nonnegative(),
  d().regex(/^\d*\.?\d+(px|rem|em)?$/)
]), he = d().min(1).max(4096).refine(
  (t) => !/[;{}<>\\]/.test(t) && !/url\s*\(/i.test(t),
  "不支持的 CSS 值"
), ne = he.refine(Ye, "请填写 CSS 色值"), de = m(["padding-box", "border-box", "content-box"]), et = c({
  height: d().regex(/^(auto|100%|\d+(\.\d+)?(px|%|rem|vh))$/).optional(),
  fontSize: f().finite().min(8).max(96).optional(),
  lineHeight: d().regex(/^\d+(\.\d+)?(px|%)?$/).optional(),
  fontWeight: f().int().min(100).max(900).optional(),
  flexGrow: f().finite().min(0).max(100).optional(),
  flexShrink: f().finite().min(0).max(100).optional(),
  width: d().regex(/^(auto|100%|\d+(\.\d+)?(px|%|rem))$/).optional(),
  maxWidth: f().finite().positive().optional(),
  minHeight: f().finite().nonnegative().optional(),
  padding: f().finite().nonnegative().optional(),
  paddingTop: J.optional(),
  paddingRight: J.optional(),
  paddingBottom: J.optional(),
  paddingLeft: J.optional(),
  marginTop: G.optional(),
  marginRight: G.optional(),
  marginBottom: G.optional(),
  marginLeft: G.optional(),
  background: m(["default", "muted", "accent"]).optional(),
  backgroundColor: ne.optional(),
  backgroundGradient: he.refine(
    (t) => /^(repeating-)?(linear|radial|conic)-gradient\(.+\)$/s.test(
      t
    ),
    "请填写 CSS 渐变"
  ).optional(),
  backgroundImage: d().refine(
    ye,
    "请使用 HTTP(S) 图片地址或支持的内嵌图片"
  ).optional(),
  backgroundSize: d().max(128).regex(/^(cover|contain|auto|[\d.%a-z\s]+)$/).optional(),
  backgroundPosition: d().max(128).regex(/^[\d.%a-z\s-]+$/).optional(),
  backgroundRepeat: m(["repeat", "no-repeat", "repeat-x", "repeat-y", "space", "round"]).optional(),
  backgroundAttachment: m(["scroll", "fixed", "local"]).optional(),
  backgroundOrigin: de.optional(),
  backgroundClip: de.optional(),
  backgroundLayerOrder: m(["gradient-first", "image-first"]).optional(),
  backgroundBlendMode: m(["normal", "multiply", "screen", "overlay", "darken", "lighten"]).optional(),
  border: A().optional(),
  borderTopWidth: Z.optional(),
  borderRightWidth: Z.optional(),
  borderBottomWidth: Z.optional(),
  borderLeftWidth: Z.optional(),
  borderStyle: m(["solid", "dashed", "dotted", "double", "none"]).optional(),
  borderColor: ne.optional(),
  color: ne.optional(),
  radius: f().finite().nonnegative().optional(),
  textAlign: m(["left", "center", "right"]).optional()
}), K = d().min(1).refine(w, "禁止原型链键"), W = Q(
  () => L([
    se(),
    d(),
    f().finite(),
    A(),
    h(W),
    k(K, W)
  ])
);
function U(t) {
  let a;
  return t.options?.length ? a = W.refine(
    (r) => t.options.some(
      (o) => JSON.stringify(o) === JSON.stringify(r)
    ),
    "不在允许的选项中"
  ) : t.type === "string" ? a = d() : t.type === "number" ? a = f().finite() : t.type === "boolean" ? a = A() : t.type === "array" ? a = h(
    t.items ? U(t.items) : W
  ) : t.type === "object" ? a = t.properties && Object.keys(t.properties).length ? c(
    Object.fromEntries(
      Object.entries(t.properties).map(
        ([r, o]) => [
          r,
          o.required ? U(o) : U(o).optional()
        ]
      )
    )
  ).catchall(W) : k(K, W) : a = W, a;
}
function tt(t) {
  return k(
    K,
    c({
      eventId: d(),
      arguments: k(
        K,
        c({
          argument: f().int().nonnegative(),
          path: h(K)
        }).strict()
      )
    }).strict()
  ).superRefine((a, r) => {
    for (const [o, s] of Object.entries(a)) {
      const b = t.events[o];
      b || r.addIssue({
        code: "custom",
        path: [o],
        message: "组件没有此回调"
      });
      for (const [g, y] of Object.entries(
        s.arguments
      ))
        b && y.argument >= b.parameters.length && r.addIssue({
          code: "custom",
          path: [o, "arguments", g],
          message: "回调参数序号超出范围"
        });
    }
  });
}
function vt(t) {
  return c({
    id: d().min(1),
    displayName: d().optional(),
    visibleWhen: re.optional(),
    appearance: et.optional(),
    lcEvents: tt(t).optional(),
    ...Object.fromEntries(
      Object.entries(t.props).map(([a, r]) => [
        a,
        r.required ? U(r) : U(r).optional()
      ])
    )
  }).passthrough();
}
const ot = [
  "text",
  "password",
  "email",
  "url",
  "tel",
  "search",
  "number",
  "date",
  "time",
  "datetime-local",
  "month",
  "week"
], $t = {
  valueMode: m(["field", "value"]).optional(),
  inputKind: m(["text", "number", "textarea"]).optional(),
  inputType: m(ot).optional(),
  fieldId: d().optional(),
  value: L([d(), f().finite(), se()]).optional(),
  binding: z.optional(),
  placeholder: d().optional(),
  readOnly: A().optional(),
  disabled: A().optional(),
  required: A().optional(),
  maxLength: f().int().nonnegative().optional(),
  minLength: f().int().nonnegative().optional(),
  name: d().optional(),
  "aria-label": d().optional(),
  rows: f().int().positive().optional(),
  step: f().finite().positive().optional(),
  changeEventId: d().optional(),
  blurEventId: d().optional(),
  focusEventId: d().optional()
};
function It(t, a) {
  if (!a || !/^-?\d+(\.\d+)?$/.test(t)) return t;
  const r = Number(t);
  return Number.isFinite(r) ? r : t;
}
const wt = {
  rows: h(k(d(), Ie())).optional(),
  page: f().int().positive().optional(),
  total: f().int().nonnegative().optional(),
  paginationMode: m(["client", "server", "none"]).optional(),
  selectedKeys: h(L([d(), f()])).optional(),
  loading: A().optional(),
  error: d().optional(),
  disabled: A().optional(),
  showPagination: A().optional(),
  pageSizeOptions: h(f().int().positive()).min(1).optional(),
  emptyText: d().optional(),
  pageChangeEventId: d().optional(),
  pageSizeChangeEventId: d().optional(),
  selectionChangeEventId: d().optional(),
  rowActionEventId: d().optional(),
  retryEventId: d().optional()
}, ae = (t) => ({
  type: "radio",
  label: t,
  options: [
    { label: "是", value: !0 },
    { label: "否", value: !1 }
  ]
}), xt = {
  paginationMode: {
    type: "select",
    label: "分页方式",
    options: [
      { label: "前端分页（完整数据）", value: "client" },
      { label: "服务端分页（当前页数据）", value: "server" },
      { label: "不分页", value: "none" }
    ]
  },
  page: { type: "number", label: "当前页", min: 1 },
  total: { type: "number", label: "服务端总条数", min: 0 },
  loading: ae("正在加载"),
  disabled: ae("禁用交互"),
  error: { type: "text", label: "错误信息" },
  emptyText: { type: "text", label: "空数据提示" },
  showPagination: ae("显示内置分页器"),
  ...Object.fromEntries(
    [
      ["pageChangeEventId", "翻页事件"],
      ["pageSizeChangeEventId", "页大小变化事件"],
      ["selectionChangeEventId", "选择变化事件"],
      ["rowActionEventId", "行操作事件"],
      ["retryEventId", "重试事件"]
    ].map(([t, a]) => [t, { type: "text", label: a }])
  )
}, ce = 1024 * 1024, St = "image/svg+xml,image/png,image/jpeg,image/webp,image/gif,image/avif", it = new Set(
  "svg g path rect circle ellipse line polyline polygon defs linearGradient radialGradient stop clipPath mask use title desc text tspan".split(
    " "
  )
), nt = new Set(
  "id xmlns xmlns:xlink viewBox width height x y x1 y1 x2 y2 cx cy r rx ry d points fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset stroke-opacity opacity transform gradientTransform gradientUnits spreadMethod offset stop-color stop-opacity clip-path clip-rule clipPathUnits mask maskUnits maskContentUnits preserveAspectRatio href xlink:href style color font-family font-size font-weight text-anchor dominant-baseline dx dy role aria-hidden aria-label focusable version".split(
    " "
  )
), at = new Set(
  "fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset stroke-opacity opacity stop-color stop-opacity color font-family font-size font-weight text-anchor dominant-baseline".split(
    " "
  )
);
function pe(t) {
  return !/[&<>\\@]/.test(t) && !/(?:https?:|data:|javascript:|\/\/|expression\s*\()/i.test(t) && !t.replace(/url\(\s*#[\w.-]+\s*\)/g, "").match(/url\s*\(/i);
}
function rt(t) {
  const a = t.trim().replace(/^<\?xml\s[^?]*\?>\s*/, "").replace(/<!--[\s\S]*?-->/g, "");
  if (!a.startsWith("<svg") || /<!|<\?/.test(a)) return !1;
  const r = [];
  let o = 0, s = 0, b = 0;
  for (const g of a.matchAll(/<([^<>]+)>/g)) {
    if (++b > 1e4 || a.slice(o, g.index).includes("<") || !r.length && a.slice(o, g.index).trim()) return !1;
    o = g.index + g[0].length;
    const y = g[1];
    if (y.startsWith("/")) {
      if (r.pop() !== y.slice(1).trim()) return !1;
      continue;
    }
    const v = /^([A-Za-z][\w-]*)([\s\S]*)$/.exec(y);
    if (!v || !it.has(v[1]) || !r.length && (v[1] !== "svg" || ++s > 1)) return !1;
    const P = /\/\s*$/.test(v[2]);
    let R = v[2].replace(/\/\s*$/, "");
    const T = /* @__PURE__ */ new Set();
    for (; R.trim(); ) {
      const O = /^\s+([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(
        R
      );
      if (!O || !nt.has(O[1]) || T.has(O[1]))
        return !1;
      const [, I] = O, S = O[2] ?? O[3];
      if (T.add(I), R = R.slice(O[0].length), I === "xmlns" || I === "xmlns:xlink") {
        if (S !== (I === "xmlns" ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xlink"))
          return !1;
      } else if (I === "href" || I === "xlink:href") {
        if (!/^#[\w.-]+$/.test(S)) return !1;
      } else if (I === "style") {
        if (!S.split(";").filter((E) => E.trim()).every((E) => {
          const C = E.indexOf(":");
          return C > 0 && at.has(E.slice(0, C).trim()) && pe(E.slice(C + 1));
        }))
          return !1;
      } else if (!pe(S)) return !1;
    }
    P || r.push(v[1]);
  }
  return s === 1 && r.length === 0 && !a.slice(o).trim();
}
function kt(t) {
  if (t.length > Math.ceil(ce / 3) * 4 + 40)
    return !1;
  const a = /^data:image\/(svg\+xml|png|jpeg|webp|gif|avif);base64,([A-Za-z0-9+/]+={0,2})$/.exec(
    t
  );
  if (!a || a[2].length % 4) return !1;
  try {
    const r = atob(a[2]);
    return !r.length || r.length > ce ? !1 : a[1] === "svg+xml" ? rt(
      new TextDecoder("utf-8", { fatal: !0 }).decode(
        Uint8Array.from(r, (o) => o.charCodeAt(0))
      )
    ) : a[1] === "png" ? r.startsWith(`PNG\r

`) : a[1] === "jpeg" ? r.startsWith("ÿØÿ") : a[1] === "gif" ? /^GIF8[79]a/.test(r) : a[1] === "webp" ? r.startsWith("RIFF") && r.slice(8, 12) === "WEBP" : r.slice(4, 8) === "ftyp" && /avif|avis/.test(r.slice(8, 32));
  } catch {
    return !1;
  }
}
const ve = m([
  "queued",
  "running",
  "paused",
  "waiting-human",
  "handed-off",
  "succeeded",
  "failed",
  "skipped"
]), u = d(), X = { id: u.min(1), title: u }, fe = c({
  id: u.min(1),
  label: u,
  eventId: u.optional(),
  tone: m(["primary", "warning"]).optional(),
  disabled: A().optional(),
  pending: A().optional()
}), At = c({
  entries: h(
    c({
      id: u.min(1),
      tag: u,
      text: u,
      tone: m(["route", "reason", "tool", "status"]),
      state: m(["running", "succeeded", "failed"]).optional()
    })
  ).optional(),
  elapsed: u.optional(),
  elapsedLabel: u.optional(),
  emptyText: u.optional(),
  expanded: A().optional()
}), Ot = c({
  // 兼容旧 ExecutionResult 数据源的计数字段；不据此推断执行成功。
  success: f().finite().nonnegative().optional(),
  failed: f().finite().nonnegative().optional(),
  nodeKey: u.optional(),
  status: ve.optional(),
  text: u.optional(),
  current: f().finite().optional(),
  total: f().finite().optional(),
  tone: m(["info", "success", "danger"]).optional(),
  progressLabel: u.optional(),
  progressText: u.optional(),
  dismissible: A().optional()
}), Et = c({
  nodeKey: u.optional(),
  title: u.optional(),
  status: ve.optional(),
  statusLabel: u.optional(),
  controller: m(["human", "agent"]).optional(),
  collapsed: A().optional(),
  steps: h(
    c({
      ...X,
      detail: u,
      status: m(["queued", "running", "succeeded", "blocked"])
    })
  ).optional(),
  capabilities: h(c(X)).optional(),
  sources: h(
    c({
      ...X,
      badge: u.optional(),
      badgeTone: m(["authorized", "proxy", "estimate"]).optional(),
      detail: u,
      usage: u
    })
  ).optional(),
  outputs: h(
    c({
      ...X,
      kind: m(["table", "document"]),
      format: u.optional(),
      disabled: A().optional(),
      eventId: u.optional()
    })
  ).optional(),
  guide: c({
    title: u,
    issues: h(
      c({
        id: u.min(1),
        title: u.optional(),
        detail: u
      })
    ),
    validationMessage: u.optional()
  }).optional(),
  notice: c({ title: u, detail: u }).optional(),
  failure: c({ detail: u, impact: u.optional() }).optional(),
  resultSummary: c({ count: u, detail: u }).optional(),
  actions: h(fe).optional(),
  moreActions: h(fe).optional()
}), qt = {
  queued: "等待执行",
  running: "执行中",
  paused: "已暂停",
  "waiting-human": "待人工处理",
  "handed-off": "人工接管中",
  succeeded: "已完成",
  failed: "执行失败",
  skipped: "已跳过"
}, V = { mode: "fill", value: 1, min: 0, max: 0 }, st = { ...V, mode: "content" };
function ue(t, a) {
  return {
    id: t,
    label: a,
    width: { ...V },
    height: { ...V },
    overflow: "auto",
    content: []
  };
}
function jt(t) {
  if (t.panes !== void 0) return t;
  const { main: a, aside: r, height: o = 640, asideWidth: s = 300, ...b } = t;
  return {
    ...b,
    direction: "row",
    gap: 12,
    wrap: "wrap",
    widthSizing: { ...V },
    heightSizing: { ...st },
    panes: [
      {
        ...ue("main", "主区域"),
        width: { ...V, value: 999, basis: 640 },
        height: {
          mode: "fixed",
          value: o,
          min: 360,
          max: 0,
          viewportOffset: 100
        },
        overflow: "visible",
        content: a ?? []
      },
      {
        ...ue("aside", "右侧区域"),
        width: { ...V, basis: s },
        height: {
          mode: "fixed",
          value: o,
          min: 360,
          max: 0,
          viewportOffset: 100
        },
        overflow: "visible",
        content: r ?? []
      }
    ]
  };
}
export {
  et as A,
  Xe as B,
  re as C,
  Et as D,
  Ot as E,
  At as F,
  vt as G,
  wt as H,
  $t as I,
  jt as J,
  yt as K,
  W as L,
  It as M,
  ot as N,
  U as O,
  tt as P,
  qt as Q,
  st as R,
  be as S,
  xt as T,
  me as a,
  Ye as b,
  ue as c,
  ye as d,
  ht as e,
  V as f,
  ce as g,
  St as h,
  $ as i,
  rt as j,
  kt as k,
  bt as l,
  dt as m,
  M as n,
  pt as o,
  ge as p,
  Y as q,
  ct as r,
  w as s,
  te as t,
  ft as u,
  Je as v,
  ut as w,
  gt as x,
  mt as y,
  z
};
