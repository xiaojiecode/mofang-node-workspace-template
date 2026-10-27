import { i as h, m as E, a as P, z as I, s as J, A as $, k as R, C as B, D as M, E as H, F as Q, G as U, H as X, I as Y, J as Z, K as ee, v as te } from "./split-layout-CBltrNgl.js";
import { b as oe, o as w, a as x, c as A, s as b, n as y, _ as c, u as G } from "./schemas-DJw7aJPi.js";
const F = {
  fieldId: "fields",
  field: "fields",
  eventId: "events",
  changeEventId: "events",
  focusEventId: "events",
  blurEventId: "events",
  pageChangeEventId: "events",
  pageSizeChangeEventId: "events",
  selectionChangeEventId: "events",
  rowActionEventId: "events",
  retryEventId: "events",
  actionEventId: "events",
  addEventId: "events",
  onChange: "events",
  sourceId: "sources",
  dataSourceId: "sources",
  scriptId: "scripts",
  transformScriptId: "scripts",
  valueScriptId: "scripts",
  validateScriptId: "scripts",
  dialogId: "dialogs",
  cellTemplateId: "cells"
};
function N(t, s) {
  const a = E[t];
  return Object.fromEntries(
    Object.entries(s).filter(([o]) => !Object.hasOwn(a.props, o)).map(([o, m]) => [
      o,
      o === "lcEvents" && h(m) ? Object.values(m).filter(h).map((r) => ({ eventId: r.eventId })) : m
    ])
  );
}
function ne(t, s = "package") {
  const a = h(t) && h(t.logic) && h(t.logic.fields) ? t.logic.fields : {}, o = [], m = (r, u) => {
    if (Array.isArray(r)) {
      r.forEach((e, n) => m(e, `${u}[${n}]`));
      return;
    }
    if (!(!h(r) || r.from === "constant")) {
      if (r.from === "form" && Array.isArray(r.path) && r.path.length)
        for (const [e, n] of Object.entries(a))
          (n.name ?? e) === r.path[0] && (!r.formId || n.formId === r.formId) && o.push({
            path: `${u}.path`,
            collection: "fields",
            id: e
          });
      for (const [e, n] of Object.entries(r)) {
        const d = typeof r.type == "string" ? E[r.type] : void 0;
        if (e === "props" && d && h(n)) {
          m(
            N(String(r.type), n),
            `${u}.props`
          );
          continue;
        }
        if (!P(r, e)) {
          if ((e === "dependsOn" || e === "requireNonEmpty") && Array.isArray(n))
            for (const p of n) {
              if (typeof p != "string") continue;
              const [g, f, O] = p.split(".");
              if (g === "form" && f && o.push({
                path: `${u}.${e}`,
                collection: "fields",
                id: f
              }), g === "forms" && f && O)
                for (const [j, L] of Object.entries(a))
                  (L.formId ?? "main") === f && (L.name ?? j) === O && o.push({
                    path: `${u}.${e}`,
                    collection: "fields",
                    id: j
                  });
              g === "sources" && f && o.push({
                path: `${u}.${e}`,
                collection: "sources",
                id: f
              });
            }
          if (F[e] && typeof n == "string" && n && (e !== "field" || r.type === "field.set" || r.type === "field.clear") && o.push({
            path: `${u}.${e}`,
            collection: F[e],
            id: n
          }), e === "targetId" && typeof n == "string" && n !== "__current__" && (r.type === "dialog.open" || r.type === "dialog.close") && o.push({
            path: `${u}.${e}`,
            collection: "dialogs",
            id: n
          }), (e === "clearOnChange" || e === "fields") && Array.isArray(n))
            for (const p of n)
              typeof p == "string" && o.push({
                path: `${u}.${e}`,
                collection: "fields",
                id: p
              });
          if (e === "dependencies" && Array.isArray(n))
            for (const p of n) {
              if (typeof p != "string") continue;
              const g = p.indexOf(":"), f = p.slice(0, g), O = p.slice(g + 1);
              (f === "source" || f === "dialog") && o.push({
                path: `${u}.${e}`,
                collection: f === "source" ? "sources" : "dialogs",
                id: O
              });
            }
          m(n, `${u}.${e}`);
        }
      }
    }
  };
  return m(t, s), o;
}
function ie(t) {
  const s = new Set(
    Object.values(t.logic.fields).map(
      (e) => e.formId ?? "main"
    )
  ), a = /* @__PURE__ */ new Set();
  Object.values(t.dialogs).forEach(
    (e) => s.add(e.formId)
  );
  const o = (e) => {
    if (Array.isArray(e)) {
      e.forEach(o);
      return;
    }
    if (h(e)) {
      if (typeof e.type == "string" && h(e.props)) {
        if (E[e.type]) return;
        e.type === "Form" && typeof e.props.formId == "string" && s.add(e.props.formId), e.type === "DataTable" && typeof e.props.tableId == "string" && a.add(e.props.tableId);
      }
      for (const [n, d] of Object.entries(e))
        P(e, n) || o(d);
    }
  };
  o(t.page), o(t.cells), Object.values(t.dialogs).forEach(
    (e) => o(e.content)
  );
  const m = {
    fields: new Set(Object.keys(t.logic.fields)),
    events: new Set(t.logic.events.map((e) => e.id)),
    sources: new Set(t.logic.sources.map((e) => e.id)),
    scripts: new Set(t.logic.scripts.map((e) => e.id)),
    dialogs: new Set(Object.keys(t.dialogs)),
    cells: new Set(Object.keys(t.cells))
  }, r = ne(t).filter((e) => !m[e.collection].has(e.id)).map((e) => `${e.path}：引用不存在 ${e.collection}/${e.id}`), u = (e, n) => {
    if (Array.isArray(e)) {
      e.forEach((d, p) => u(d, `${n}[${p}]`));
      return;
    }
    if (h(e)) {
      if ("from" in e) {
        if (I.safeParse(e).success || r.push(`${n}：绑定结构无效`), e.from === "constant") return;
        if (e.from === "form") {
          const p = Array.isArray(e.path) ? e.path[0] : void 0;
          typeof e.formId == "string" && !s.has(e.formId) && r.push(`${n}：表单引用不存在 ${e.formId}`), Array.isArray(e.path) && e.path.length && !Object.entries(t.logic.fields).some(
            ([g, f]) => (f.name ?? g) === p && (!e.formId || (f.formId ?? "main") === e.formId)
          ) && r.push(
            `${n}：字段引用不存在 ${String(e.path[0])}`
          );
        }
        e.from === "table" && typeof e.tableId == "string" && !a.has(e.tableId) && r.push(`${n}：表格引用不存在 ${e.tableId}`);
      }
      for (const [d, p] of Object.entries(e)) {
        J(d) || r.push(`${n}.${d}：禁止原型链键`);
        const g = typeof e.type == "string" ? E[e.type] : void 0;
        if (d === "props" && g && h(p)) {
          u(
            N(String(e.type), p),
            `${n}.props`
          );
          continue;
        }
        P(e, d) || u(p, `${n}.${d}`);
      }
    }
  };
  return u(t, "package"), r;
}
const K = oe(
  () => w({
    label: b(),
    value: b().min(1),
    disabled: A().optional(),
    children: x(K).refine(
      (t) => new Set(t.map((s) => s.value)).size === t.length,
      "同级选项值不能重复"
    ).optional()
  })
), V = x(K).refine(
  (t) => new Set(t.map((s) => s.value)).size === t.length,
  "同级选项值不能重复"
), ae = w({
  key: b().min(1).refine(
    (t) => !["id", "__proto__", "constructor", "prototype"].includes(
      t
    ),
    "列字段不能使用保留名称"
  ),
  label: b(),
  kind: c(["text", "number", "datetime", "select"]),
  required: A().optional(),
  min: y().finite().optional(),
  max: y().finite().optional(),
  options: V.optional()
}).refine(
  (t) => t.min === void 0 || t.max === void 0 || t.min <= t.max,
  "下限不能大于上限"
), se = {
  fieldId: b(),
  kind: c([
    "text",
    "number",
    "select",
    "switch",
    "choice",
    "checkboxes",
    "cascader",
    "datetime",
    "date"
  ]),
  layout: c(["vertical", "horizontal", "card"]).optional(),
  placeholder: b().optional(),
  suffix: b().optional(),
  step: y().finite().positive().optional(),
  options: V.optional(),
  actionEventId: b().optional(),
  actionLabel: b().optional(),
  hideControl: A().optional(),
  hideLabel: A().optional(),
  labelAppearance: $.optional(),
  descriptionAppearance: $.optional()
}, re = {
  layout: c(["inline", "cards"]).optional(),
  addEventId: b().optional(),
  fieldId: b(),
  itemLabel: b(),
  addLabel: b(),
  columns: x(ae).min(1).refine(
    (t) => new Set(t.map((s) => s.key)).size === t.length,
    "列字段不能重复"
  ),
  minItems: y().int().nonnegative().optional(),
  maxItems: y().int().nonnegative().optional()
}, z = y().finite().nonnegative(), T = w({
  mode: c(["fixed", "content", "fill"]),
  value: y().finite().positive(),
  min: z,
  max: z,
  basis: z.optional(),
  viewportOffset: z.optional()
}).refine(
  (t) => t.max === 0 || t.max >= t.min,
  "最大尺寸不能小于最小尺寸"
), pe = {
  direction: c(["row", "column"]).optional(),
  gap: z.optional(),
  wrap: c(["nowrap", "wrap"]).optional(),
  widthSizing: T.optional(),
  heightSizing: T.optional(),
  panes: x(
    w({
      id: b().min(1),
      label: b(),
      width: T,
      height: T,
      overflow: c(["auto", "hidden", "visible"]),
      content: x(G())
    })
  ).min(1).refine(
    (t) => new Set(t.map((s) => s.id)).size === t.length,
    "分区标识不能重复"
  )
}, i = b(), S = y().finite().positive(), v = x(G()), W = c(["default", "secondary", "outline", "destructive"]), D = {
  fieldId: i,
  placeholder: i.optional(),
  rows: S.int().optional(),
  step: S.optional()
}, _ = {
  text: i,
  binding: I.optional(),
  formatter: c(["text", "money"]).optional()
}, C = {
  busyScope: c(["page", "event", "none"]).optional(),
  busyEventId: i.optional(),
  busyText: i.optional()
}, ce = {
  icon: c([
    "none",
    "external",
    "sparkles",
    "plus",
    "check",
    "download",
    "refresh",
    "custom"
  ]).optional(),
  iconImage: w({
    src: i.refine(R, "请上传安全图片"),
    name: i.max(255)
  }).optional(),
  iconPosition: c(["start", "end"]).optional(),
  iconSize: S.max(96).optional(),
  iconGap: y().finite().min(0).max(100).optional()
}, l = (t) => w({
  id: i.min(1),
  displayName: i.optional(),
  visibleWhen: B.optional(),
  appearance: $.optional(),
  ...t
}).passthrough(), q = {
  ...Object.fromEntries(
    Object.values(E).map((t) => [
      t.name,
      U(t)
    ])
  ),
  Tabs: l({
    ...C,
    itemAppearance: $.optional(),
    selectedAppearance: $.optional(),
    countAppearance: $.optional(),
    itemGap: y().finite().min(0).max(100).optional(),
    label: i,
    defaultValue: i,
    binding: I.optional(),
    variant: c(["default", "line", "buttons", "count"]),
    eventId: i,
    items: x(
      w({
        value: i.min(1),
        label: i.min(1),
        countBinding: I.optional(),
        eventId: i.optional(),
        disabled: A().optional()
      })
    ).min(1).refine(
      (t) => new Set(t.map((s) => s.value)).size === t.length,
      "标签值不能重复"
    )
  }),
  Section: l({ title: i, content: v }),
  Stack: l({
    direction: c(["row", "column"]),
    gap: y().nonnegative(),
    content: v
  }),
  SplitLayout: l(pe),
  ScrollPanel: l({ header: v, content: v, footer: v }),
  WorkflowProcess: l({
    ...Q.shape,
    title: i,
    eventId: i,
    dataSourceId: i.optional(),
    binding: I.optional()
  }),
  ExecutionResult: l({
    ...H.shape,
    dataSourceId: i,
    eventId: i,
    binding: I.optional()
  }),
  ThinkingProcess: l({
    ...M.shape,
    footer: v,
    dataSourceId: i.optional(),
    binding: I.optional()
  }),
  Link: l({
    ...ce,
    ...C,
    linkAppearance: $.optional(),
    text: i,
    href: i,
    eventId: i,
    binding: I.optional(),
    hrefBinding: I.optional()
  }),
  Form: l({
    formId: i.min(1),
    content: v,
    columns: S.int().max(12).optional(),
    minColumnWidth: S.optional(),
    gap: y().finite().nonnegative().max(100).optional(),
    layout: c(["vertical", "grid"]).optional()
  }),
  Repeater: l({
    binding: I.optional(),
    gap: y().nonnegative(),
    content: v
  }),
  Text: l({ ..._, lines: S.int().max(10).optional() }),
  Image: l({
    fit: c(["contain", "cover"]).optional(),
    radius: y().nonnegative().optional(),
    border: A().optional(),
    src: i,
    alt: i,
    width: S,
    height: S,
    binding: I.optional()
  }),
  Badge: l({
    ..._,
    variant: W.optional(),
    mappings: x(
      w({
        value: i,
        label: i,
        variant: W.optional()
      })
    ).optional()
  }),
  TextField: l(Y),
  NumberField: l(D),
  TextareaField: l(D),
  SelectField: l(D),
  SwitchField: l(D),
  ConfigField: l(se),
  RecordListField: l(re).refine(
    (t) => typeof t.minItems != "number" || typeof t.maxItems != "number" || t.minItems <= t.maxItems,
    "最少条目不能超过最多条目"
  ),
  ActionButton: l({
    ...C,
    presentation: c(["default", "text", "menu"]).optional(),
    icon: c([
      "none",
      "sparkles",
      "plus",
      "check",
      "download",
      "refresh",
      "custom"
    ]).optional(),
    iconImage: w({
      src: i.refine(
        R,
        "请上传安全的 SVG 或图片图标（不超过 1 MB）"
      ),
      name: i.max(255)
    }).optional(),
    iconPosition: c(["start", "end"]).optional(),
    iconSize: S.max(96).optional(),
    iconGap: y().finite().min(0).max(100).optional(),
    disabledOpacity: y().finite().min(0).max(1).optional(),
    buttonAppearance: $.optional(),
    menuItems: x(
      w({
        label: i,
        eventId: i,
        visibleWhen: B.optional(),
        disabledWhen: B.optional()
      })
    ).optional(),
    tone: c(["default", "primary", "danger"]).optional(),
    fullWidth: A().optional(),
    label: i,
    binding: I.optional(),
    countBinding: I.nullish(),
    eventId: i,
    variant: c([
      "default",
      "outline",
      "secondary",
      "ghost",
      "destructive",
      "link"
    ]).optional(),
    disabledWhen: B.optional()
  }),
  DataTable: l({
    ...X,
    headerAppearance: $.optional(),
    cellAppearance: $.optional(),
    selectionWidth: S.max(300).optional(),
    resetOn: I.optional(),
    minWidth: S.optional(),
    density: c(["default", "compact"]).optional(),
    layout: c(["fixed", "auto"]).optional(),
    selectionDisabledPath: i.optional(),
    defaultSelection: c(["none", "all"]).optional(),
    tableId: i.min(1),
    dataSourceId: i,
    rowKey: i.min(1),
    selection: A(),
    pageSize: S.int(),
    columns: x(
      w({
        id: i.min(1),
        title: i,
        width: S.optional(),
        field: i.optional(),
        actionLabel: i.optional(),
        action: i.optional(),
        eventId: i.optional(),
        pin: c(["left", "right"]).optional(),
        valueBinding: I.optional(),
        formatter: c(["text", "money", "badge"]).optional(),
        cellTemplateId: i.optional()
      })
    )
  }),
  SelectionSummary: l({
    tableId: i.min(1),
    text: i.optional(),
    variant: c(["badge", "text"]).optional()
  }),
  Pagination: l({
    showTotal: A().optional(),
    showPageSize: A().optional(),
    showJump: A().optional(),
    align: c(["start", "center", "end"]).optional(),
    paginationAppearance: $.optional(),
    variant: c(["default", "workspace"]).optional(),
    tableId: i.min(1),
    dataSourceId: i,
    pageSizeOptions: x(S.int().max(1e4)).min(1).max(30).refine(
      (t) => new Set(t).size === t.length,
      "每页条数不能重复"
    ).optional()
  })
};
function le(t) {
  const s = (a) => {
    if (Array.isArray(a)) return a.map(s);
    if (!h(a) || a.from === "constant" || typeof a.type == "string" && E[a.type])
      return a;
    if (a.type === "ActionButton" && h(a.props)) {
      const o = a.props;
      return o.presentation !== "ai" ? a : {
        ...a,
        props: {
          ...o,
          presentation: "default",
          icon: o.icon ?? "sparkles",
          iconPosition: o.iconPosition ?? "start",
          iconSize: o.iconSize ?? 16,
          iconGap: o.iconGap ?? 5,
          disabledOpacity: o.disabledOpacity ?? 0.5,
          buttonAppearance: {
            height: "32px",
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 12,
            paddingRight: 12,
            radius: 4,
            fontSize: 14,
            fontWeight: 400,
            border: !0,
            borderColor: "#cfd3fb",
            backgroundColor: "#f7f8ff",
            color: "#5b65d8",
            ...h(o.buttonAppearance) ? o.buttonAppearance : {}
          }
        }
      };
    }
    return Object.fromEntries(
      Object.entries(a).map(([o, m]) => [
        o,
        P(a, o) ? m : s(m)
      ])
    );
  };
  return {
    ...t,
    page: s(t.page),
    cells: s(t.cells),
    dialogs: Object.fromEntries(
      Object.entries(t.dialogs).map(([a, o]) => [
        a,
        {
          ...o,
          content: s(o.content)
        }
      ])
    )
  };
}
function de(t) {
  const s = (a) => {
    if (Array.isArray(a)) return a.map(s);
    if (!h(a) || a.from === "constant" || typeof a.type == "string" && E[a.type])
      return a;
    const o = Object.fromEntries(
      Object.entries(a).map(([m, r]) => [
        m,
        P(a, m) ? r : s(r)
      ])
    );
    return o.type === "SplitLayout" && h(o.props) && o.props.panes === void 0 && Array.isArray(o.props.main) && Array.isArray(o.props.aside) && (o.props = Z(o.props)), o;
  };
  return {
    ...t,
    page: s(t.page),
    cells: s(t.cells),
    dialogs: Object.fromEntries(
      Object.entries(t.dialogs).map(([a, o]) => [
        a,
        {
          ...o,
          content: s(o.content)
        }
      ])
    )
  };
}
const fe = Object.keys(q);
function me(t) {
  const s = ee.safeParse(t);
  if (!s.success)
    return {
      valid: !1,
      errors: s.error.issues.map(
        (e) => `${e.path.join(".")}：${e.message}`
      )
    };
  const a = le(
    de(s.data)
  ), o = ie(a), m = /* @__PURE__ */ new Set();
  for (const [e, n] of Object.entries(a.dialogs))
    e !== n.id && o.push(`dialogs.${e}：键与 ID 不一致`);
  for (const [e, n] of Object.entries(a.logic.fields)) {
    n.id !== e && o.push(`logic.fields.${e}：键与 ID 不一致`);
    const d = n.defaultValue;
    d != null && n.type !== "any" && (n.type === "array" ? !Array.isArray(d) : n.type === "object" ? typeof d != "object" || Array.isArray(d) : typeof d !== n.type) && o.push(`logic.fields.${e}：默认值类型错误`);
  }
  const r = (e, n, d) => {
    if (!e || typeof e != "object") return;
    if (Array.isArray(e)) {
      e.forEach(
        (g, f) => r(g, `${n}[${f}]`, d)
      );
      return;
    }
    const p = e;
    if ("type" in p && "props" in p) {
      if (fe.includes(String(p.type)) || o.push(`${n}：未知组件 ${String(p.type)}`), d && ![
        "Stack",
        "Repeater",
        "Text",
        "Image",
        "Badge",
        "ActionButton",
        "Link"
      ].includes(String(p.type)) && o.push(`${n}：单元格不能包含 ${String(p.type)}`), !p.props || typeof p.props != "object") {
        o.push(`${n}：props 无效`);
        return;
      }
      const g = p.props, f = g.id, O = q[String(p.type)]?.safeParse(g);
      if (O && !O.success && o.push(
        ...O.error.issues.map(
          (j) => `${n}.props.${j.path.join(".")}：${j.message}`
        )
      ), typeof f != "string" || !f ? o.push(`${n}：组件缺少 ID`) : m.has(f) ? o.push(`${n}：重复组件 ID ${f}`) : m.add(f), p.type === "DataTable" && Array.isArray(g.columns)) {
        const j = /* @__PURE__ */ new Set();
        for (const L of g.columns) {
          const k = L;
          !k || typeof k.id != "string" || j.has(k.id) ? o.push(`${n}.columns：列 ID 缺失或重复`) : j.add(k.id), (!k || k.width !== void 0 && (typeof k.width != "number" || k.width <= 0)) && o.push(`${n}.columns：列宽必须大于零`);
        }
      }
      if (E[String(p.type)]) return;
    }
    for (const [g, f] of Object.entries(p))
      P(p, g) || r(f, `${n}.${g}`, d);
  };
  r(a.page, "page", !1);
  for (const [e, n] of Object.entries(a.cells))
    r(n, `cells.${e}`, !0);
  for (const [e, n] of Object.entries(a.dialogs))
    r(n.content, `dialogs.${e}`, !1);
  const u = /* @__PURE__ */ new Set([
    ...m,
    ...Object.keys(a.logic.fields),
    ...Object.keys(a.dialogs),
    ...a.logic.events.map((e) => e.id)
  ]);
  try {
    te(a.logic, u);
  } catch (e) {
    o.push(
      `logic：${e instanceof Error ? e.message : String(e)}`
    );
  }
  return {
    valid: o.length === 0,
    errors: o,
    ...o.length ? {} : { value: a }
  };
}
function ye(t) {
  const s = me(t);
  if (!s.value) throw new Error(s.errors.join(`
`));
  return s.value;
}
export {
  ye as a,
  q as b,
  ne as c,
  fe as m,
  ie as r,
  me as v
};
