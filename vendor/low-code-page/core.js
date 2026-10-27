import { p as B, r as _, i as S, m as A, a as C } from "./split-layout-CBltrNgl.js";
import { B as ne, h as ae, g as ie, S as ce, x as fe, e as le, y as pe, u as de, l as me, b as ue, d as ge, k as he, j as ye, t as Ie, o as we, n as Se, q as be, s as Ee, w as Oe, v as Ae } from "./split-layout-CBltrNgl.js";
import { c as x } from "./logic-runtime-DaQS0jDo.js";
import { b as xe, a as $e, g as je, d as _e, f as qe, e as Ue, p as ve, r as Re, h as Be, s as ke } from "./logic-runtime-DaQS0jDo.js";
import { s as b, o as q, _ as U, a as $, l as k } from "./schemas-DJw7aJPi.js";
import { c as E } from "./id-DAU2FMyk.js";
import { a as I } from "./validation-FKKFyTYz.js";
import { c as Te, m as He, r as Pe, v as De } from "./validation-FKKFyTYz.js";
const N = [
  {
    id: "mofang-api",
    label: "魔方 API 网关",
    path: "/",
    example: "v1/user/profile"
  },
  {
    id: "mofang-erp",
    label: "商品、店铺与类目",
    path: "/erp/api/v1/",
    example: "shops"
  },
  {
    id: "mofang-client",
    label: "工作流与选品",
    path: "/v1/client/",
    example: "selection/categories"
  },
  {
    id: "mofang-user",
    label: "用户与菜单",
    path: "/v1/user/",
    example: "profile"
  },
  {
    id: "mofang-config",
    label: "平台、站点与技能配置",
    path: "/v1/config/",
    example: "platforms"
  },
  {
    id: "mofang-tools",
    label: "工具服务",
    path: "/v1/tools/",
    example: "exchange_rate_latest"
  }
];
function X(t, o) {
  if (t.request?.mode === "url")
    return B(t.request.url ?? "").href;
  const r = o.connections?.[t.request?.connectionId ?? ""];
  if (!r) throw new Error("请选择已登记的连接");
  return typeof r == "string" ? _(r, t.request?.path ?? "").href : o.resolveHttpUrl?.(t);
}
function j(t, o) {
  if (o.startsWith("//")) throw new Error("接口路径不能越过已登记连接");
  const r = _(t, o.replace(/^\//, ""));
  if (!decodeURIComponent(r.pathname).startsWith(new URL(t).pathname))
    throw new Error("接口路径不能越过所选服务前缀");
  return r;
}
function Y(t, o) {
  const r = typeof location > "u" ? "http://localhost" : location.origin, f = new URL(o.apiBaseUrl || "/", r), i = {}, g = {};
  for (const p of N) {
    const a = new URL(
      `${f.pathname.replace(/\/$/, "")}${p.path}`,
      f.origin
    );
    g[p.id] = a.href, i[p.id] = async (h, m) => {
      const e = h.request?.path ?? "", n = j(a.href, e);
      return o.transport ? o.transport(n, h, m) : await x({
        connections: { builtin: a.href }
      })(
        {
          ...h,
          request: {
            ...h.request,
            connectionId: "builtin",
            path: n.href.slice(a.origin.length)
          }
        },
        m
      );
    };
  }
  Object.assign(i, t.connections);
  const w = x({ connections: i, host: t.context });
  return {
    ...t,
    connections: i,
    resolveHttpUrl: (p) => {
      const a = p.request?.connectionId ?? "";
      return Object.hasOwn(t.connections ?? {}, a) ? t.resolveHttpUrl?.(p) : g[a] ? j(g[a], p.request?.path ?? "").href : void 0;
    },
    request: async (p, a) => p.kind === "http" && (p.request?.mode === "url" || Object.hasOwn(
      i,
      p.request?.connectionId ?? ""
    )) ? await w(p, a) : t.request ? t.request(p, a) : await w(p, a)
  };
}
const v = b().min(1).max(160).refine(
  (t) => t.split(".").every(
    (o) => o && !["__proto__", "constructor", "prototype"].includes(o)
  )
), T = q({
  name: v,
  label: b().min(1).max(200),
  input: b().max(4e3),
  result: b().max(4e3),
  completion: U(["completed", "submitted", "closed"])
}).strict(), H = q({
  version: k(1),
  nodeCode: b().min(1).max(160),
  surface: U(["settings", "runtime"]),
  actions: $(T).max(200).refine(
    (t) => new Set(t.map((o) => o.name)).size === t.length,
    "动作名称重复"
  ),
  hostKeys: $(v).max(200)
}).strict();
function F(t, o, r) {
  if (new TextEncoder().encode(t).length > 262144)
    throw new Error("节点能力文件不能超过 256 KB");
  const f = H.parse(JSON.parse(t));
  if (f.nodeCode !== o || f.surface !== r)
    throw new Error("能力文件与当前节点编码或页面用途不一致");
  return f;
}
function Q(t, o = {}) {
  const r = I(t), f = /* @__PURE__ */ new Map(), i = (e) => {
    e && !f.has(e) && f.set(e, `${e}-${E().slice(0, 8)}`);
  }, g = (e) => {
    if (Array.isArray(e)) {
      e.forEach(g);
      return;
    }
    if (!(!S(e) || e.from === "constant")) {
      if (typeof e.type == "string" && S(e.props)) {
        const n = e.props;
        for (const l of ["id", "tableId", "formId"])
          typeof n[l] == "string" && i(n[l]);
        if (A[e.type]) return;
        if (Array.isArray(n.columns))
          for (const l of n.columns)
            S(l) && typeof l.id == "string" && i(l.id);
      }
      for (const [n, l] of Object.entries(e))
        C(e, n) || g(l);
    }
  };
  g(r.page), g(r.cells), g(r.dialogs);
  for (const e of [
    r.logic.fields,
    r.cells,
    r.dialogs
  ])
    Object.keys(e).forEach(i);
  for (const e of Object.values(r.logic.fields))
    i(e.formId);
  for (const e of Object.values(r.dialogs)) i(e.formId);
  const w = /* @__PURE__ */ new Set();
  for (const e of r.logic.events) {
    i(e.id);
    for (const n of [...e.steps, ...e.onError ?? []])
      i(n.id), w.add(n.id);
  }
  r.logic.rules.forEach((e) => i(e.id)), o.cloneShared && (r.logic.sources.forEach((e) => i(e.id)), r.logic.scripts.forEach((e) => i(e.id)));
  for (const e of r.logic.scripts)
    if ([...f.keys()].some(
      (n) => e.source.includes(`'${n}'`) || e.source.includes(`"${n}"`)
    ))
      throw new Error(
        `脚本 ${e.id} 包含页面内 ID，请先改成输入绑定再复制`
      );
  const p = /* @__PURE__ */ new Set([
    "id",
    "fieldId",
    "eventId",
    "changeEventId",
    "focusEventId",
    "blurEventId",
    "pageChangeEventId",
    "pageSizeChangeEventId",
    "selectionChangeEventId",
    "rowActionEventId",
    "retryEventId",
    "onChange",
    "dialogId",
    "cellTemplateId",
    "formId",
    "tableId",
    "nodeId",
    "targetId"
  ]);
  if (o.cloneShared)
    for (const e of [
      "sourceId",
      "dataSourceId",
      "scriptId",
      "transformScriptId",
      "valueScriptId",
      "validateScriptId"
    ])
      p.add(e);
  const a = (e) => f.get(e) ?? e, h = (e, n) => {
    if (typeof e == "string")
      return n && p.has(n) ? a(e) : e;
    if (Array.isArray(e)) return e.map((c) => h(c));
    if (!S(e)) return e;
    if (e.from === "constant") return structuredClone(e);
    const l = {};
    for (const [c, d] of Object.entries(e)) {
      const O = typeof e.type == "string" ? A[e.type] : void 0;
      if (c === "props" && O && S(d)) {
        l[c] = Object.fromEntries(
          Object.entries(d).map(([s, u]) => [
            s,
            Object.hasOwn(O.props, s) ? structuredClone(u) : h(u, s)
          ])
        );
        continue;
      }
      C(e, c) || c === "source" && typeof d == "string" ? l[c] = structuredClone(d) : c === "field" && (e.type === "field.set" || e.type === "field.clear") && typeof d == "string" ? l[c] = a(d) : (c === "fields" || c === "clearOnChange") && Array.isArray(d) ? l[c] = d.map(
        (s) => typeof s == "string" ? a(s) : s
      ) : c === "dependencies" && Array.isArray(d) ? l[c] = d.map(
        (s) => typeof s == "string" && (o.cloneShared ? /^(form|dialog|source):/ : /^(form|dialog):/).test(s) ? s.replace(
          /^(form|dialog|source):(.+)$/,
          (u, y, R) => `${y}:${a(R)}`
        ) : s
      ) : (c === "dependsOn" || c === "requireNonEmpty") && Array.isArray(d) ? l[c] = d.map(
        (s) => typeof s == "string" && s.startsWith("form.") ? s.replace(
          /^form\.([^.]+)/,
          (u, y) => `form.${a(y)}`
        ) : typeof s == "string" && s.startsWith("forms.") ? s.replace(
          /^forms\.([^.]+)/,
          (u, y) => `forms.${a(y)}`
        ) : o.cloneShared && typeof s == "string" && s.startsWith("sources.") ? s.replace(
          /^sources\.([^.]+)/,
          (u, y) => `sources.${a(y)}`
        ) : s
      ) : c === "path" && e.from === "output" && Array.isArray(d) ? l[c] = d.map(
        (s, u) => u === 0 && typeof s == "string" && w.has(s) ? a(s) : s
      ) : c === "path" && e.from === "forms" && Array.isArray(d) ? l[c] = d.map(
        (s, u) => u === 0 && typeof s == "string" ? a(s) : s
      ) : l[c] = h(d, c);
    }
    return l;
  }, m = h(r);
  return m.logic.fields = Object.fromEntries(
    Object.entries(m.logic.fields).map(([e, n]) => [
      a(e),
      n
    ])
  ), m.cells = Object.fromEntries(
    Object.entries(m.cells).map(([e, n]) => [a(e), n])
  ), m.dialogs = Object.fromEntries(
    Object.entries(m.dialogs).map(([e, n]) => [
      a(e),
      n
    ])
  ), o.cloneShared || (m.logic.sources.forEach((e, n) => {
    e.id = r.logic.sources[n].id;
  }), m.logic.scripts.forEach((e, n) => {
    e.id = r.logic.scripts[n].id;
  })), m.pageId = `${r.pageId}-${E().slice(0, 8)}`, I(m);
}
const P = 5 * 1024 * 1024;
function D(t) {
  if (new TextEncoder().encode(t).byteLength > P)
    throw new Error("配置文件不能超过 5MB");
  return I(JSON.parse(t));
}
const K = (t) => JSON.stringify(I(t), null, 2), V = (t, o, r) => `puck:v2:${encodeURIComponent(o ?? "page")}:${encodeURIComponent(r ?? "general")}:${encodeURIComponent(t)}`;
function Z(t, o, r = localStorage) {
  const f = K(o);
  r.setItem(t, f);
}
function ee(t, o = localStorage) {
  const r = o.getItem(t);
  return r === null ? null : D(r);
}
function L(t, o = localStorage) {
  const r = o.getItem(`${t}:snapshots`);
  if (!r) return [];
  const f = JSON.parse(r);
  if (!Array.isArray(f)) throw new Error("版本快照格式错误");
  return f.map((i) => {
    if (!i || typeof i.id != "string" || typeof i.createdAt != "string")
      throw new Error("版本快照格式错误");
    return {
      id: i.id,
      createdAt: i.createdAt,
      definition: I(i.definition)
    };
  });
}
function te(t, o, r = localStorage) {
  const f = {
    id: E(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    definition: I(o)
  };
  return r.setItem(
    `${t}:snapshots`,
    JSON.stringify([...L(t, r), f])
  ), f.id;
}
const re = [
  "workflowId",
  "nodeId",
  "runId",
  "status",
  "inputs",
  "output"
];
export {
  ne as BACKGROUND_IMAGE_MAX_BYTES,
  ae as BUTTON_ICON_ACCEPT,
  ie as BUTTON_ICON_MAX_BYTES,
  ce as StaleExecutionError,
  fe as abortable,
  T as actionDescriptionSchema,
  le as appearanceStyle,
  I as assertPackage,
  N as builtinConnections,
  pe as cancelled,
  H as capabilityManifestSchema,
  de as clone,
  Q as clonePackage,
  Te as collectReferences,
  xe as createCapabilityRegistry,
  x as createHostRequest,
  E as createId,
  $e as createLogicRuntime,
  je as createRuntimeStore,
  _e as createScriptExecutor,
  qe as createSourceLoader,
  V as draftKey,
  Ue as executeSource,
  me as findReferences,
  X as getHttpTargetUrl,
  ue as isAppearanceColor,
  ge as isBackgroundImageSource,
  he as isButtonIconSource,
  C as isLiteralProperty,
  S as isObject,
  ye as isSafeIconSvg,
  L as listSnapshots,
  ee as loadDraft,
  Ie as matches,
  A as materialCatalog,
  He as materialNames,
  we as optionBoolean,
  F as parseCapabilityManifest,
  D as parsePackage,
  ve as prepareHttpRequest,
  Pe as referenceErrors,
  Se as resolvePath,
  be as resolveRef,
  Re as runScript,
  Ee as safeKey,
  Z as saveDraft,
  te as saveSnapshot,
  Be as selectRuntimeServices,
  K as serializePackage,
  ke as sourceDependsOn,
  Oe as uniqueId,
  De as validatePackage,
  Ae as validateRuntimeDefinition,
  Y as withBuiltinHost,
  re as workflowNodeHostKeys
};
