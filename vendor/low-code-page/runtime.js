import * as GA from "react";
import S, { createContext as Pr, useContext as at, useMemo as FA, useRef as hA, useEffect as CA, useState as $, useCallback as EA, useLayoutEffect as e7, useId as zt, createElement as yt, forwardRef as u7, memo as a7 } from "react";
import { jsx as n, jsxs as i, Fragment as AA } from "react/jsx-runtime";
import { a as n7 } from "./logic-runtime-Cc7pxBlR.js";
import { u as I7, P as z7, c as oA, a as kt, b as d7, d as ll, e as V7, f as E7, g as p7, R as i7, I as q7, h as Vr, i as RA, j as el, T as DA, k as HA, l as _A, m as ul, D as al, C as Lt, n as kr, S as nl, B as T, o as Lr, p as m7, q as M7, r as v7, s as c7, t as W7, v as X, w as wr, x as Il, y as zl, z as dl, A as JA, E as nt, F as Vl, G as f3, H as El, J as Wt, K as Zt, L as Ct, M as ft, N as bt, O as Z7, Q as C7, U as qt, V as f7, W as b7, X as U7, Y as h7, Z as K7, _ as pl, $ as LA, a0 as lt, a1 as il, a2 as ql, a3 as Yr, a4 as Q7, a5 as S7, a6 as ml, a7 as Gr, a8 as Ml, a9 as vl, aa as ZA, ab as cl, ac as s7, ad as x7, ae as X7, af as Y7, ag as G7, ah as o7, ai as R7, aj as j7 } from "./dialog-D45YVHg_.js";
import { S as O7, k as Wl, e as zA, i as Zl, o as Bt, M as b3, N as g7, s as Er, O as y7, P as N7, m as pr, Q as Jr, E as F7, F as B7, D as T7, f as P7, R as k7, c as L7, J as w7, T as J7 } from "./split-layout-CBltrNgl.js";
import { m as w, a as J, b as D7 } from "./material-metadata-DlznyyRQ.js";
import { c as U3 } from "./id-DAU2FMyk.js";
import { Render as Cl } from "@puckeditor/core";
const wt = Pr(null), or = Pr({});
function H7({
  definition: A,
  host: t,
  mode: r = "interactive",
  children: l
}) {
  const e = FA(
    () => n7(A, t, r),
    // host 更新通过下面的 effect 注入，不能重建用户草稿。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [A, t.instanceKey, r]
  ), u = hA(/* @__PURE__ */ new WeakMap());
  return CA(() => {
    const a = u.current, I = (a.get(e) ?? 0) + 1;
    return a.set(e, I), e.start(), () => {
      e.stop(), queueMicrotask(() => {
        a.get(e) === I && e.dispose();
      });
    };
  }, [e]), CA(() => (e.updateHost(t), t.subscribeContext?.(() => e.updateHost(t))), [e, t]), /* @__PURE__ */ n(wt.Provider, { value: { engine: e, host: t }, children: l });
}
function Jt({
  value: A,
  children: t
}) {
  const r = at(or);
  return /* @__PURE__ */ n(or.Provider, { value: { ...r, ...A }, children: t });
}
const h3 = (A) => Symbol.iterator in A, K3 = (A) => (
  // HACK: avoid checking entries type
  "entries" in A
), Q3 = (A, t) => {
  const r = A instanceof Map ? A : new Map(A.entries()), l = t instanceof Map ? t : new Map(t.entries());
  if (r.size !== l.size)
    return !1;
  for (const [e, u] of r)
    if (!l.has(e) || !Object.is(u, l.get(e)))
      return !1;
  return !0;
}, _7 = (A, t) => {
  const r = A[Symbol.iterator](), l = t[Symbol.iterator]();
  let e = r.next(), u = l.next();
  for (; !e.done && !u.done; ) {
    if (!Object.is(e.value, u.value))
      return !1;
    e = r.next(), u = l.next();
  }
  return !!e.done && !!u.done;
};
function $7(A, t) {
  return Object.is(A, t) ? !0 : typeof A != "object" || A === null || typeof t != "object" || t === null || Object.getPrototypeOf(A) !== Object.getPrototypeOf(t) ? !1 : h3(A) && h3(t) ? K3(A) && K3(t) ? Q3(A, t) : _7(A, t) : Q3(
    { entries: () => Object.entries(A) },
    { entries: () => Object.entries(t) }
  );
}
function Au(A) {
  const t = S.useRef(void 0);
  return (r) => {
    const l = A(r);
    return $7(t.current, l) ? t.current : t.current = l;
  };
}
function k() {
  const A = at(wt), t = at(or);
  if (!A) throw new Error("物料需要 PageRuntimeProvider");
  const { engine: r, host: l } = A, e = I7(
    r.store,
    Au((u) => ({
      forms: u.forms,
      page: u.page,
      errors: u.errors,
      sources: u.sources,
      tables: u.tables,
      dialog: u.dialog,
      dialogStack: u.dialogStack,
      busy: u.busy,
      feedback: u.feedback
    }))
  );
  return {
    definition: r.definition,
    host: l,
    mode: r.mode,
    state: e,
    scope: t,
    setField: (u, a) => r.setField(u, a, !0, t),
    getField: r.getField,
    materialProps: (u, a) => r.materialProps(u, a, t),
    options: (u) => r.options(u, t),
    fieldStatus: (u) => r.fieldStatus(u, t),
    execute: (u, a) => r.execute(u, { ...t, ...a }),
    runSource: (u) => r.runSource(u, t),
    setTable: r.setTable,
    closeDialog: r.closeDialog,
    resolve: (u) => r.resolve(u, t),
    test: (u) => r.test(u, t),
    validate: (u = t.formId ?? "main") => r.validate(u, t)
  };
}
function tu(A) {
  const t = /* @__PURE__ */ new Set();
  let r = !0, l = 0;
  const e = (E = l) => {
    if (!r || E !== l)
      throw new O7("组件服务作用域已关闭或已更新");
  }, u = (E, q) => {
    if (typeof E != "function")
      throw new Error("订阅没有返回取消函数");
    let m = !1;
    const v = () => {
      m || (m = !0, t.delete(v), E());
    };
    return !r || q !== l ? v() : t.add(v), v;
  }, a = (E, q) => Promise.resolve(E).then(
    (m) => (e(q), m),
    (m) => {
      throw e(q), m;
    }
  ), I = (E, q, m) => {
    const v = l, c = q[m];
    if (typeof c != "function") return u(E(q), v);
    let M = !0;
    const W = [...q];
    W[m] = (...Z) => {
      if (M && r && v === l)
        return c(...Z);
    };
    const C = E(W);
    if (typeof C != "function")
      throw new Error("订阅没有返回取消函数");
    return u(() => {
      M = !1, C();
    }, v);
  }, z = /* @__PURE__ */ new WeakMap(), V = (E) => {
    if (!E || typeof E != "object")
      throw new Error("服务没有返回资源对象");
    const q = z.get(E);
    if (q) return q;
    const m = E, v = Object.freeze(
      Object.fromEntries(
        ["getState", "getSnapshot", "refresh", "subscribe"].map(
          (c) => [
            c,
            (...M) => {
              if (e(), typeof m[c] != "function")
                throw new Error(`资源方法不存在：${c}`);
              if (c === "subscribe")
                return I(
                  (Z) => m[c](...Z),
                  M,
                  0
                );
              const W = l, C = m[c](...M);
              return c === "refresh" ? a(C, W) : C;
            }
          ]
        )
      )
    );
    return z.set(E, v), v;
  }, d = /* @__PURE__ */ Object.create(null);
  for (const E of A.methods) {
    const q = E.path.split(".");
    if (q.some(
      (M) => !M || ["__proto__", "constructor", "prototype"].includes(M)
    ))
      throw new Error("服务方法路径无效");
    let m = d, v = A.value;
    for (const M of q.slice(0, -1)) {
      if (!Object.hasOwn(v, M) || !v[M] || typeof v[M] != "object")
        throw new Error("服务方法未提供");
      v = v[M], m[M] ??= /* @__PURE__ */ Object.create(null), m = m[M];
    }
    const c = q.at(-1);
    m[c] = (...M) => {
      if (e(), !Object.hasOwn(v, c) || typeof v[c] != "function")
        throw new Error(`服务方法未提供：${E.path}`);
      const W = (b) => v[c].apply(
        v,
        b
      );
      if (E.kind === "subscribe")
        return I(W, M, E.callbackIndex ?? 0);
      const C = l, Z = W(M);
      return E.kind === "async" ? a(Z, C) : E.kind === "resource" ? V(Z) : Z;
    };
  }
  return {
    value: d,
    start: () => {
      r = !0;
    },
    stop: () => {
      r = !1, l++;
      for (const E of [...t])
        try {
          E();
        } catch {
        }
    }
  };
}
function mE(A, t = "1") {
  const r = at(wt);
  if (!r) throw new Error("服务组件需要 PageRuntimeProvider");
  const l = r.engine.mode === "design", e = l ? void 0 : r.host.services?.[A], u = FA(() => {
    if (!l) {
      if (!e) throw new Error(`宿主未提供服务：${A}`);
      if (e.version !== t)
        throw new Error(`服务版本不兼容：${A}`);
      return tu(e);
    }
  }, [l, e, A, t]);
  return CA(() => (u?.start(), () => u?.stop()), [u]), u?.value;
}
function ru({
  portalContainer: A,
  children: t
}) {
  return /* @__PURE__ */ n(z7.Provider, { value: A, children: t });
}
const lu = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
], fl = oA("activity", lu);
const eu = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
], uu = oA("arrow-up-right", eu);
const au = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
], nu = oA("calendar", au);
const Iu = [
  ["path", { d: "M12 6v6h4", key: "135r8i" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
], bl = oA("clock-3", Iu);
const zu = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
], du = oA("file-text", zu);
const Vu = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
], Eu = oA("settings-2", Vu);
const pu = [
  ["path", { d: "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5", key: "slp6dd" }],
  [
    "path",
    {
      d: "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",
      key: "o0xfot"
    }
  ],
  ["path", { d: "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05", key: "wn3emo" }]
], iu = oA("store", pu);
const qu = [
  [
    "path",
    {
      d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
      key: "gugj83"
    }
  ]
], mu = oA("table-2", qu);
const Mu = [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
], Ul = oA("user-round", Mu);
var vu = Object.defineProperty, cu = (A, t) => vu(A, "name", { value: t, configurable: !0 }), Wu = /* @__PURE__ */ GA.forwardRef(
  /* @__PURE__ */ cu(function(t, r) {
    return /* @__PURE__ */ n(
      kt.label,
      {
        ...t,
        ref: r,
        onMouseDown: (l) => {
          l.target.closest("button, input, select, textarea") || (t.onMouseDown?.(l), !l.defaultPrevented && l.detail > 1 && l.preventDefault());
        }
      }
    );
  }, "Label")
), Zu = Wu, Cu = Object.defineProperty, Ut = (A, t) => Cu(A, "name", { value: t, configurable: !0 }), Dr = "Tabs", [fu, ME] = d7(Dr, [
  ll
]), hl = ll(), [bu, Kl] = fu(Dr), Uu = /* @__PURE__ */ GA.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Ut(function(t, r) {
    const {
      __scopeTabs: l,
      value: e,
      onValueChange: u,
      defaultValue: a,
      orientation: I = "horizontal",
      dir: z,
      activationMode: V = "automatic",
      ...d
    } = t, p = V7(z), [E, q] = E7({
      prop: e,
      onChange: u,
      defaultProp: a ?? "",
      caller: Dr
    });
    return /* @__PURE__ */ n(
      bu,
      {
        scope: l,
        baseId: p7(),
        value: E,
        onValueChange: q,
        orientation: I,
        dir: p,
        activationMode: V,
        children: /* @__PURE__ */ n(
          kt.div,
          {
            dir: p,
            "data-orientation": I,
            ...d,
            ref: r
          }
        )
      }
    );
  }, "Tabs")
), hu = "TabsList", Ku = /* @__PURE__ */ GA.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Ut(function(t, r) {
    const { __scopeTabs: l, loop: e = !0, ...u } = t, a = Kl(hu, l), I = hl(l);
    return /* @__PURE__ */ n(
      i7,
      {
        asChild: !0,
        ...I,
        orientation: a.orientation,
        dir: a.dir,
        loop: e,
        children: /* @__PURE__ */ n(
          kt.div,
          {
            role: "tablist",
            "aria-orientation": a.orientation,
            ...u,
            ref: r
          }
        )
      }
    );
  }, "TabsList")
), Qu = "TabsTrigger", Su = /* @__PURE__ */ GA.forwardRef(
  /* @__PURE__ */ Ut(function(t, r) {
    const { __scopeTabs: l, value: e, disabled: u = !1, ...a } = t, I = Kl(Qu, l), z = hl(l), V = Ql(I.baseId, e), d = Sl(I.baseId, e), p = e === I.value;
    return /* @__PURE__ */ n(
      q7,
      {
        asChild: !0,
        ...z,
        focusable: !u,
        active: p,
        children: /* @__PURE__ */ n(
          kt.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": p,
            "aria-controls": d,
            "data-state": p ? "active" : "inactive",
            "data-disabled": u ? "" : void 0,
            disabled: u,
            id: V,
            ...a,
            ref: r,
            onMouseDown: Vr(t.onMouseDown, (E) => {
              !u && E.button === 0 && E.ctrlKey === !1 ? I.onValueChange(e) : E.preventDefault();
            }),
            onKeyDown: Vr(t.onKeyDown, (E) => {
              u || E.target !== E.currentTarget || [" ", "Enter"].includes(E.key) && I.onValueChange(e);
            }),
            onFocus: Vr(t.onFocus, () => {
              const E = I.activationMode !== "manual";
              !p && !u && E && I.onValueChange(e);
            })
          }
        )
      }
    );
  }, "TabsTrigger")
);
function Ql(A, t) {
  return `${A}-trigger-${t}`;
}
Ut(Ql, "makeTriggerId");
function Sl(A, t) {
  return `${A}-content-${t}`;
}
Ut(Sl, "makeContentId");
var su = Uu, xu = Ku, Xu = Su;
function Dt(A, t, r) {
  const l = t.find((e) => e.id === r);
  return !!(r && (A[r] || l && A[`${l.nodeId}:${l.event}`]));
}
function Hr(A, t, r, l) {
  return r.busyScope === "none" ? !1 : !r.busyScope || r.busyScope === "page" ? Object.values(A).some(Boolean) : (r.busyEventId ? [r.busyEventId] : l).some(
    (e) => Dt(A, t, e)
  );
}
function sl(A) {
  if (typeof A != "number" && typeof A != "string" || typeof A == "string" && A.trim() === "") return null;
  const t = Number(A);
  return Number.isFinite(t) && t >= 0 ? t : null;
}
function L({
  text: A,
  lines: t = 1
}) {
  const r = RA(), l = el(10050);
  return /* @__PURE__ */ i(DA, { children: [
    /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ n(
      "span",
      {
        tabIndex: 0,
        className: t > 1 ? "block max-w-full whitespace-normal overflow-hidden" : "block max-w-full truncate",
        style: t > 1 ? {
          display: "-webkit-box",
          WebkitLineClamp: t,
          WebkitBoxOrient: "vertical"
        } : void 0,
        children: A || "—"
      }
    ) }),
    /* @__PURE__ */ n(
      _A,
      {
        portalContainer: r,
        className: "max-w-sm break-words",
        style: { zIndex: l },
        children: A || "—"
      }
    )
  ] });
}
const Yu = {
  sparkles: nl,
  plus: kr,
  check: Lt,
  download: al,
  refresh: ul
};
function Gu({
  label: A,
  tone: t,
  fullWidth: r,
  binding: l,
  countBinding: e,
  eventId: u,
  variant: a,
  disabledWhen: I,
  presentation: z = "default",
  menuItems: V = [],
  buttonAppearance: d,
  icon: p = "none",
  iconImage: E,
  iconPosition: q = "start",
  iconSize: m = 16,
  iconGap: v,
  disabledOpacity: c,
  busyScope: M,
  busyEventId: W,
  busyText: C = "处理中…"
}) {
  const Z = k(), b = RA(), f = (l ? String(Z.resolve(l) ?? A) : A) + (e ? ` (${sl(Z.resolve(e)) ?? "—"})` : ""), h = V.filter(
    (y) => !y.visibleWhen || Z.test(y.visibleWhen)
  ), K = Hr(
    Z.state.busy,
    Z.definition.logic.events,
    { busyScope: M, busyEventId: W },
    z === "menu" ? h.map((y) => y.eventId) : [u]
  ), Q = Z.mode === "design" || K || (z === "menu" ? !h.length : !u) || (I ? Z.test(I) : !1), x = p === "none" || p === "custom" ? void 0 : Yu[p], lA = p === "custom" && E && Wl(E.src) ? /* @__PURE__ */ n(
    "img",
    {
      src: E.src,
      alt: "",
      "aria-hidden": "true",
      draggable: !1,
      style: {
        width: m,
        height: m,
        objectFit: "contain",
        flexShrink: 0
      }
    }
  ) : x ? /* @__PURE__ */ n(
    x,
    {
      "aria-hidden": "true",
      style: { width: m, height: m }
    }
  ) : null, O = /* @__PURE__ */ i(
    T,
    {
      style: {
        width: r ? "100%" : void 0,
        ...t === "danger" ? { color: "#f5222d" } : {},
        ...z === "text" ? {
          height: "auto",
          padding: 0,
          fontSize: "inherit",
          lineHeight: "inherit",
          fontWeight: "inherit",
          color: "inherit",
          border: 0,
          boxShadow: "none",
          background: "transparent"
        } : {},
        ...z === "menu" ? {
          height: 32,
          gap: 5,
          padding: "5px 12px",
          borderRadius: 2,
          fontSize: 14,
          fontWeight: 400,
          border: "1px solid #d9d9d9",
          background: "white",
          color: "#595959",
          opacity: Q ? 0.4 : 1
        } : {},
        ...d ? Object.fromEntries(
          Object.entries(
            zA(d)
          ).filter(([, y]) => y !== void 0)
        ) : {},
        ...v !== void 0 ? { gap: v } : {},
        ...Q && c !== void 0 ? { opacity: c } : {}
      },
      type: "button",
      variant: t === "primary" ? "default" : a,
      disabled: Q,
      "aria-busy": K,
      onClick: z === "menu" ? void 0 : () => {
        Z.execute(u).catch(() => {
        });
      },
      children: [
        q === "start" && lA,
        /* @__PURE__ */ n(L, { text: K ? C : f }),
        q === "end" && lA,
        z === "menu" && /* @__PURE__ */ n(Lr, { size: 14 })
      ]
    }
  );
  return z === "menu" ? /* @__PURE__ */ i(m7, { children: [
    /* @__PURE__ */ n(M7, { asChild: !0, children: O }),
    /* @__PURE__ */ n(v7, { portalContainer: b, align: "end", children: h.map((y, iA) => /* @__PURE__ */ n(
      c7,
      {
        disabled: !y.eventId || Dt(
          Z.state.busy,
          Z.definition.logic.events,
          y.eventId
        ) || !!(y.disabledWhen && Z.test(y.disabledWhen)),
        onSelect: () => {
          Z.execute(y.eventId).catch(() => {
          });
        },
        children: /* @__PURE__ */ n(L, { text: y.label })
      },
      iA
    )) })
  ] }) : O;
}
const Nt = (A, t) => ({
  type: "select",
  label: A,
  options: t.map(([r, l]) => ({ label: r, value: l }))
}), ir = (A) => ({
  type: "radio",
  label: A,
  options: [
    { label: "显示", value: !0 },
    { label: "隐藏", value: !1 }
  ]
}), qr = {
  busyScope: Nt("忙碌状态范围", [
    ["整页事件", "page"],
    ["关联事件", "event"],
    ["不关联", "none"]
  ]),
  busyEventId: {
    type: "text",
    label: "关联事件 ID（留空使用自身事件）"
  }
}, ou = {
  Link: {
    ...qr,
    icon: Nt("图标", [
      ["无", "none"],
      ["外链箭头", "external"],
      ["星光", "sparkles"],
      ["加号", "plus"],
      ["勾选", "check"],
      ["下载", "download"],
      ["刷新", "refresh"],
      ["本地上传", "custom"]
    ]),
    iconSize: { type: "number", label: "图标大小（px）", min: 1, max: 96 },
    iconPosition: Nt("图标位置", [
      ["文字前", "start"],
      ["文字后", "end"]
    ]),
    iconGap: { type: "number", label: "图文间距（px）", min: 0, max: 100 }
  },
  Tabs: {
    ...qr,
    itemGap: { type: "number", label: "标签间距", min: 0, max: 100 }
  },
  ActionButton: {
    ...qr,
    busyText: { type: "text", label: "处理中显示文字" }
  },
  DataTable: {
    selectionWidth: {
      type: "number",
      label: "选择列宽度",
      min: 1,
      max: 300
    }
  },
  Pagination: {
    showTotal: ir("显示总数"),
    showPageSize: ir("显示每页条数"),
    showJump: ir("显示跳页（工作区底栏）"),
    align: Nt("分页排列", [
      ["左对齐", "start"],
      ["居中", "center"],
      ["右对齐", "end"]
    ])
  }
}, Ru = wr(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function _r({
  className: A,
  variant: t,
  asChild: r = !1,
  ...l
}) {
  return /* @__PURE__ */ n(
    r ? W7 : "span",
    {
      "data-slot": "badge",
      className: X(Ru({ variant: t }), A),
      ...l
    }
  );
}
function xl({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "skeleton",
      className: X("bg-accent animate-pulse rounded-md", A),
      ...t
    }
  );
}
function $r(A, t = "text") {
  return A == null || A === "" ? "—" : t === "money" && typeof A == "number" ? new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(A) : typeof A == "object" ? JSON.stringify(A) : String(A);
}
function ju({ text: A, binding: t, formatter: r, lines: l }) {
  const e = k();
  return /* @__PURE__ */ n(
    L,
    {
      lines: l,
      text: t ? $r(e.resolve(t), r) : A
    }
  );
}
function Ou({
  text: A,
  binding: t,
  variant: r,
  mappings: l
}) {
  const e = k(), u = t ? $r(e.resolve(t)) : A, a = l?.find((I) => I.value === u);
  return /* @__PURE__ */ n(_r, { variant: a?.variant ?? r, className: "max-w-full", children: /* @__PURE__ */ n(L, { text: a?.label ?? u }) });
}
function gu({
  src: A,
  alt: t,
  width: r,
  height: l,
  fit: e = "contain",
  radius: u = 0,
  border: a = !1
}) {
  const [I, z] = $(
    "loading"
  );
  return /* @__PURE__ */ i(
    "div",
    {
      style: {
        width: r,
        height: l,
        flexShrink: 0,
        maxWidth: "100%",
        position: "relative"
      },
      children: [
        I === "loading" && /* @__PURE__ */ n(xl, { className: "absolute inset-0" }),
        I === "error" ? /* @__PURE__ */ n("span", { role: "img", "aria-label": t, children: "图片加载失败" }) : /* @__PURE__ */ n(
          "img",
          {
            src: A,
            alt: t,
            width: r,
            height: l,
            style: {
              objectFit: e,
              borderRadius: u,
              border: a ? "1px solid var(--border)" : void 0,
              width: "100%",
              height: "100%"
            },
            onLoad: () => z("loaded"),
            onError: () => z("error")
          }
        )
      ]
    }
  );
}
function yu(A) {
  const t = k(), r = A.binding ? t.resolve(A.binding) : A.src, l = typeof r == "string" ? r : "";
  return l ? /* @__PURE__ */ n(gu, { ...A, src: l }, l) : /* @__PURE__ */ n("span", { role: "img", "aria-label": A.alt, children: "暂无图片" });
}
function Rr({
  className: A,
  variant: t = "default",
  ...r
}) {
  return /* @__PURE__ */ n(
    Zu,
    {
      "data-slot": "label",
      className: X(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        t === "form" && "text-base leading-6 font-normal",
        t === "compact" && "text-xs leading-5 font-normal",
        t === "inline" && "inline text-sm leading-5 font-normal",
        A
      ),
      ...r
    }
  );
}
function Nu({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "field-group",
      className: X(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        A
      ),
      ...t
    }
  );
}
const Fu = wr(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function mt({
  className: A,
  orientation: t = "vertical",
  ...r
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      role: "group",
      "data-slot": "field",
      "data-orientation": t,
      className: X(Fu({ orientation: t }), A),
      ...r
    }
  );
}
function Bu({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "field-content",
      className: X(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        A
      ),
      ...t
    }
  );
}
function et({
  className: A,
  ...t
}) {
  return /* @__PURE__ */ n(
    Rr,
    {
      "data-slot": "field-label",
      className: X(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        A
      ),
      ...t
    }
  );
}
function BA({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "p",
    {
      "data-slot": "field-description",
      className: X(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        A
      ),
      ...t
    }
  );
}
function KA({
  className: A,
  children: t,
  errors: r,
  tone: l = "destructive",
  ...e
}) {
  const u = FA(() => {
    if (t)
      return t;
    if (!r?.length)
      return null;
    const a = [
      ...new Map(r.map((I) => [I?.message, I])).values()
    ];
    return a?.length == 1 ? a[0]?.message : /* @__PURE__ */ n("ul", { className: "ml-4 flex list-disc flex-col gap-1", children: a.map(
      (I, z) => I?.message && /* @__PURE__ */ n("li", { children: I.message }, z)
    ) });
  }, [t, r]);
  return u ? /* @__PURE__ */ n(
    "div",
    {
      role: "alert",
      "data-slot": "field-error",
      className: X(
        "text-destructive text-sm font-normal",
        l === "validation" && "text-validation text-xs leading-4",
        A
      ),
      ...e,
      children: u
    }
  ) : null;
}
function Xl({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "textarea",
    {
      "data-slot": "textarea",
      className: X(
        "border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
        A
      ),
      ...t
    }
  );
}
function Tu(A, t) {
  const r = [];
  let l = A;
  for (const e of t) {
    const u = l.find((a) => a.value === e);
    r.push(u?.label ?? e), l = u?.children ?? [];
  }
  return r;
}
function Yl(A, t = [], r = [], l = !1) {
  return A.flatMap((e) => {
    const u = [...t, e.value], a = [...r, e.label], I = l || !!e.disabled;
    return e.children?.length ? Yl(e.children, u, a, I) : [
      {
        path: u,
        label: a.join(" / "),
        disabled: I
      }
    ];
  });
}
function Pu({
  value: A,
  options: t,
  onChange: r,
  clearable: l,
  placeholder: e,
  ...u
}) {
  const [a, I] = $(!1), [z, V] = $([]), [d, p] = $(""), E = d.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean), q = E.length ? Yl(t).filter(
    (M) => E.every(
      (W) => M.label.toLocaleLowerCase().includes(W)
    )
  ) : [], m = RA(), v = [t];
  let c = t;
  for (const M of z) {
    const W = c.find((C) => C.value === M);
    if (!W?.children?.length) break;
    c = W.children, v.push(c);
  }
  return /* @__PURE__ */ i(
    Il,
    {
      open: a,
      onOpenChange: (M) => {
        u.disabled || (I(M), p(""), M && V(A));
      },
      children: [
        /* @__PURE__ */ n(zl, { asChild: !0, children: /* @__PURE__ */ i(
          T,
          {
            ...u,
            type: "button",
            variant: "outline",
            className: "w-full justify-between",
            children: [
              /* @__PURE__ */ n(
                L,
                {
                  text: A.length ? Tu(t, A).join(" / ") : e ?? "请选择"
                }
              ),
              /* @__PURE__ */ n(Lr, {})
            ]
          }
        ) }),
        /* @__PURE__ */ i(
          dl,
          {
            container: m,
            align: "start",
            className: "w-auto max-w-[90vw]",
            children: [
              /* @__PURE__ */ n(
                JA,
                {
                  "aria-label": `${u["aria-label"] ?? "级联选项"}搜索`,
                  placeholder: "搜索选项路径",
                  value: d,
                  onChange: (M) => p(M.target.value)
                }
              ),
              E.length > 0 ? /* @__PURE__ */ i(
                "div",
                {
                  className: "mt-2 flex max-h-64 w-80 max-w-full flex-col gap-1 overflow-y-auto",
                  role: "group",
                  "aria-label": "搜索结果",
                  children: [
                    q.map((M) => /* @__PURE__ */ n(
                      T,
                      {
                        type: "button",
                        variant: "ghost",
                        disabled: M.disabled,
                        className: "w-full justify-start",
                        onClick: () => {
                          r(M.path), V(M.path), I(!1);
                        },
                        children: /* @__PURE__ */ n(L, { text: M.label })
                      },
                      JSON.stringify(M.path)
                    )),
                    !q.length && /* @__PURE__ */ n(BA, { children: "没有匹配的选项" })
                  ]
                }
              ) : /* @__PURE__ */ n("div", { className: "mt-2 flex max-w-full gap-2 overflow-x-auto", children: v.map((M, W) => /* @__PURE__ */ i(
                "div",
                {
                  className: "flex max-h-64 w-48 shrink-0 flex-col gap-1 overflow-y-auto",
                  role: "group",
                  "aria-label": `第 ${W + 1} 级选项`,
                  children: [
                    M.map((C) => /* @__PURE__ */ i(
                      T,
                      {
                        type: "button",
                        variant: z[W] === C.value ? "secondary" : "ghost",
                        disabled: C.disabled,
                        className: "w-full justify-between",
                        "aria-pressed": z[W] === C.value,
                        onClick: () => {
                          const Z = [
                            ...z.slice(0, W),
                            C.value
                          ];
                          V(Z), C.children?.length || (r(Z), I(!1));
                        },
                        children: [
                          /* @__PURE__ */ n(L, { text: C.label }),
                          !!C.children?.length && /* @__PURE__ */ n(nt, {})
                        ]
                      },
                      C.value
                    )),
                    !M.length && /* @__PURE__ */ n(BA, { children: "暂无选项" })
                  ]
                },
                W
              )) }),
              l && A.length > 0 && /* @__PURE__ */ n(
                T,
                {
                  type: "button",
                  variant: "link",
                  onClick: () => {
                    r([]), V([]), I(!1);
                  },
                  children: "清空选择"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function ut(A) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : A.defaultWidth;
    return A.formats[r] || A.formats[A.defaultWidth];
  };
}
function fA(A) {
  return (t, r) => {
    const l = r?.context ? String(r.context) : "standalone";
    let e;
    if (l === "formatting" && A.formattingValues) {
      const a = A.defaultFormattingWidth || A.defaultWidth, I = r?.width ? String(r.width) : a;
      e = A.formattingValues[I] || A.formattingValues[a];
    } else {
      const a = A.defaultWidth, I = r?.width ? String(r.width) : A.defaultWidth;
      e = A.values[I] || A.values[a];
    }
    const u = A.argumentCallback ? A.argumentCallback(t) : t;
    return e[u];
  };
}
function bA(A) {
  return (t, r = {}) => {
    const l = r.width, e = l && A.matchPatterns[l] || A.matchPatterns[A.defaultMatchWidth], u = t.match(e);
    if (!u)
      return null;
    const a = u[0], I = l && A.parsePatterns[l] || A.parsePatterns[A.defaultParseWidth], z = Array.isArray(I) ? Lu(I, (p) => p.test(a)) : (
      // [TODO] -- I challenge you to fix the type
      ku(I, (p) => p.test(a))
    );
    let V;
    V = A.valueCallback ? A.valueCallback(z) : z, V = r.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      r.valueCallback(V)
    ) : V;
    const d = t.slice(a.length);
    return { value: V, rest: d };
  };
}
function ku(A, t) {
  for (const r in A)
    if (Object.prototype.hasOwnProperty.call(A, r) && t(A[r]))
      return r;
}
function Lu(A, t) {
  for (let r = 0; r < A.length; r++)
    if (t(A[r]))
      return r;
}
function Gl(A) {
  return (t, r = {}) => {
    const l = t.match(A.matchPattern);
    if (!l) return null;
    const e = l[0], u = t.match(A.parsePattern);
    if (!u) return null;
    let a = A.valueCallback ? A.valueCallback(u[0]) : u[0];
    a = r.valueCallback ? r.valueCallback(a) : a;
    const I = t.slice(e.length);
    return { value: a, rest: I };
  };
}
const ol = 6048e5, wu = 864e5, S3 = /* @__PURE__ */ Symbol.for("constructDateFrom");
function tA(A, t) {
  return typeof A == "function" ? A(t) : A && typeof A == "object" && S3 in A ? A[S3](t) : A instanceof Date ? new A.constructor(t) : new Date(t);
}
function $A(A, ...t) {
  const r = tA.bind(
    null,
    A || t.find((l) => typeof l == "object")
  );
  return t.map(r);
}
let Ju = {};
function ht() {
  return Ju;
}
function P(A, t) {
  return tA(t || A, A);
}
function TA(A, t) {
  const r = ht(), l = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, e = P(A, t?.in), u = e.getDay(), a = (u < l ? 7 : 0) + u - l;
  return e.setDate(e.getDate() - a), e.setHours(0, 0, 0, 0), e;
}
function Du(A, t, r) {
  const [l, e] = $A(
    r?.in,
    A,
    t
  );
  return +TA(l, r) == +TA(e, r);
}
const Hu = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, _u = (A, t, r) => {
  let l;
  const e = Hu[A];
  return typeof e == "string" ? l = e : t === 1 ? l = e.one : l = e.other.replace("{{count}}", t.toString()), r?.addSuffix ? r.comparison && r.comparison > 0 ? "in " + l : l + " ago" : l;
}, $u = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Aa = (A, t, r, l) => $u[A], ta = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, ra = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, la = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, ea = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, ua = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, aa = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, na = (A, t) => {
  const r = Number(A), l = r % 100;
  if (l > 20 || l < 10)
    switch (l % 10) {
      case 1:
        return r + "st";
      case 2:
        return r + "nd";
      case 3:
        return r + "rd";
    }
  return r + "th";
}, Ia = {
  ordinalNumber: na,
  era: fA({
    values: ta,
    defaultWidth: "wide"
  }),
  quarter: fA({
    values: ra,
    defaultWidth: "wide",
    argumentCallback: (A) => A - 1
  }),
  month: fA({
    values: la,
    defaultWidth: "wide"
  }),
  day: fA({
    values: ea,
    defaultWidth: "wide"
  }),
  dayPeriod: fA({
    values: ua,
    defaultWidth: "wide",
    formattingValues: aa,
    defaultFormattingWidth: "wide"
  })
}, za = /^(\d+)(th|st|nd|rd)?/i, da = /\d+/i, Va = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Ea = {
  any: [/^b/i, /^(a|c)/i]
}, pa = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, ia = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, qa = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ma = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, Ma = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, va = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, ca = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Wa = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, Za = {
  ordinalNumber: Gl({
    matchPattern: za,
    parsePattern: da,
    valueCallback: (A) => parseInt(A, 10)
  }),
  era: bA({
    matchPatterns: Va,
    defaultMatchWidth: "wide",
    parsePatterns: Ea,
    defaultParseWidth: "any"
  }),
  quarter: bA({
    matchPatterns: pa,
    defaultMatchWidth: "wide",
    parsePatterns: ia,
    defaultParseWidth: "any",
    valueCallback: (A) => A + 1
  }),
  month: bA({
    matchPatterns: qa,
    defaultMatchWidth: "wide",
    parsePatterns: ma,
    defaultParseWidth: "any"
  }),
  day: bA({
    matchPatterns: Ma,
    defaultMatchWidth: "wide",
    parsePatterns: va,
    defaultParseWidth: "any"
  }),
  dayPeriod: bA({
    matchPatterns: ca,
    defaultMatchWidth: "any",
    parsePatterns: Wa,
    defaultParseWidth: "any"
  })
}, Ca = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, fa = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, ba = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ua = {
  date: ut({
    formats: Ca,
    defaultWidth: "full"
  }),
  time: ut({
    formats: fa,
    defaultWidth: "full"
  }),
  dateTime: ut({
    formats: ba,
    defaultWidth: "full"
  })
}, rt = {
  code: "en-US",
  formatDistance: _u,
  formatLong: Ua,
  formatRelative: Aa,
  localize: Ia,
  match: Za,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
}, ha = {
  lessThanXSeconds: {
    one: "不到 1 秒",
    other: "不到 {{count}} 秒"
  },
  xSeconds: {
    one: "1 秒",
    other: "{{count}} 秒"
  },
  halfAMinute: "半分钟",
  lessThanXMinutes: {
    one: "不到 1 分钟",
    other: "不到 {{count}} 分钟"
  },
  xMinutes: {
    one: "1 分钟",
    other: "{{count}} 分钟"
  },
  xHours: {
    one: "1 小时",
    other: "{{count}} 小时"
  },
  aboutXHours: {
    one: "大约 1 小时",
    other: "大约 {{count}} 小时"
  },
  xDays: {
    one: "1 天",
    other: "{{count}} 天"
  },
  aboutXWeeks: {
    one: "大约 1 个星期",
    other: "大约 {{count}} 个星期"
  },
  xWeeks: {
    one: "1 个星期",
    other: "{{count}} 个星期"
  },
  aboutXMonths: {
    one: "大约 1 个月",
    other: "大约 {{count}} 个月"
  },
  xMonths: {
    one: "1 个月",
    other: "{{count}} 个月"
  },
  aboutXYears: {
    one: "大约 1 年",
    other: "大约 {{count}} 年"
  },
  xYears: {
    one: "1 年",
    other: "{{count}} 年"
  },
  overXYears: {
    one: "超过 1 年",
    other: "超过 {{count}} 年"
  },
  almostXYears: {
    one: "将近 1 年",
    other: "将近 {{count}} 年"
  }
}, Ka = (A, t, r) => {
  let l;
  const e = ha[A];
  return typeof e == "string" ? l = e : t === 1 ? l = e.one : l = e.other.replace("{{count}}", String(t)), r?.addSuffix ? r.comparison && r.comparison > 0 ? l + "内" : l + "前" : l;
}, Qa = {
  full: "y'年'M'月'd'日' EEEE",
  long: "y'年'M'月'd'日'",
  medium: "yyyy-MM-dd",
  short: "yy-MM-dd"
}, Sa = {
  full: "zzzz a h:mm:ss",
  long: "z a h:mm:ss",
  medium: "a h:mm:ss",
  short: "a h:mm"
}, sa = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
}, xa = {
  date: ut({
    formats: Qa,
    defaultWidth: "full"
  }),
  time: ut({
    formats: Sa,
    defaultWidth: "full"
  }),
  dateTime: ut({
    formats: sa,
    defaultWidth: "full"
  })
};
function s3(A, t, r) {
  const l = "eeee p";
  return Du(A, t, r) ? l : A.getTime() > t.getTime() ? "'下个'" + l : "'上个'" + l;
}
const Xa = {
  lastWeek: s3,
  // days before yesterday, maybe in this week or last week
  yesterday: "'昨天' p",
  today: "'今天' p",
  tomorrow: "'明天' p",
  nextWeek: s3,
  // days after tomorrow, maybe in this week or next week
  other: "PP p"
}, Ya = (A, t, r, l) => {
  const e = Xa[A];
  return typeof e == "function" ? e(t, r, l) : e;
}, Ga = {
  narrow: ["前", "公元"],
  abbreviated: ["前", "公元"],
  wide: ["公元前", "公元"]
}, oa = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["第一季", "第二季", "第三季", "第四季"],
  wide: ["第一季度", "第二季度", "第三季度", "第四季度"]
}, Ra = {
  narrow: [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二"
  ],
  abbreviated: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ],
  wide: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ]
}, ja = {
  narrow: ["日", "一", "二", "三", "四", "五", "六"],
  short: ["日", "一", "二", "三", "四", "五", "六"],
  abbreviated: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  wide: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
}, Oa = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "凌晨",
    noon: "午",
    morning: "早",
    afternoon: "下午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  }
}, ga = {
  narrow: {
    am: "上",
    pm: "下",
    midnight: "凌晨",
    noon: "午",
    morning: "早",
    afternoon: "下午",
    evening: "晚",
    night: "夜"
  },
  abbreviated: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  },
  wide: {
    am: "上午",
    pm: "下午",
    midnight: "凌晨",
    noon: "中午",
    morning: "早晨",
    afternoon: "中午",
    evening: "晚上",
    night: "夜间"
  }
}, ya = (A, t) => {
  const r = Number(A);
  switch (t?.unit) {
    case "date":
      return r.toString() + "日";
    case "hour":
      return r.toString() + "时";
    case "minute":
      return r.toString() + "分";
    case "second":
      return r.toString() + "秒";
    default:
      return "第 " + r.toString();
  }
}, Na = {
  ordinalNumber: ya,
  era: fA({
    values: Ga,
    defaultWidth: "wide"
  }),
  quarter: fA({
    values: oa,
    defaultWidth: "wide",
    argumentCallback: (A) => A - 1
  }),
  month: fA({
    values: Ra,
    defaultWidth: "wide"
  }),
  day: fA({
    values: ja,
    defaultWidth: "wide"
  }),
  dayPeriod: fA({
    values: Oa,
    defaultWidth: "wide",
    formattingValues: ga,
    defaultFormattingWidth: "wide"
  })
}, Fa = /^(第\s*)?\d+(日|时|分|秒)?/i, Ba = /\d+/i, Ta = {
  narrow: /^(前)/i,
  abbreviated: /^(前)/i,
  wide: /^(公元前|公元)/i
}, Pa = {
  any: [/^(前)/i, /^(公元)/i]
}, ka = {
  narrow: /^[1234]/i,
  abbreviated: /^第[一二三四]刻/i,
  wide: /^第[一二三四]刻钟/i
}, La = {
  any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
}, wa = {
  narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
  abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
  wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
}, Ja = {
  narrow: [
    /^一/i,
    /^二/i,
    /^三/i,
    /^四/i,
    /^五/i,
    /^六/i,
    /^七/i,
    /^八/i,
    /^九/i,
    /^十(?!(一|二))/i,
    /^十一/i,
    /^十二/i
  ],
  any: [
    /^一|1/i,
    /^二|2/i,
    /^三|3/i,
    /^四|4/i,
    /^五|5/i,
    /^六|6/i,
    /^七|7/i,
    /^八|8/i,
    /^九|9/i,
    /^十(?!(一|二))|10/i,
    /^十一|11/i,
    /^十二|12/i
  ]
}, Da = {
  narrow: /^[一二三四五六日]/i,
  short: /^[一二三四五六日]/i,
  abbreviated: /^周[一二三四五六日]/i,
  wide: /^星期[一二三四五六日]/i
}, Ha = {
  any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
}, _a = {
  any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨|)/i
}, $a = {
  any: {
    am: /^上午?/i,
    pm: /^下午?/i,
    midnight: /^午夜/i,
    noon: /^[中正]午/i,
    morning: /^早上/i,
    afternoon: /^下午/i,
    evening: /^晚上?/i,
    night: /^凌晨/i
  }
}, An = {
  ordinalNumber: Gl({
    matchPattern: Fa,
    parsePattern: Ba,
    valueCallback: (A) => parseInt(A, 10)
  }),
  era: bA({
    matchPatterns: Ta,
    defaultMatchWidth: "wide",
    parsePatterns: Pa,
    defaultParseWidth: "any"
  }),
  quarter: bA({
    matchPatterns: ka,
    defaultMatchWidth: "wide",
    parsePatterns: La,
    defaultParseWidth: "any",
    valueCallback: (A) => A + 1
  }),
  month: bA({
    matchPatterns: wa,
    defaultMatchWidth: "wide",
    parsePatterns: Ja,
    defaultParseWidth: "any"
  }),
  day: bA({
    matchPatterns: Da,
    defaultMatchWidth: "wide",
    parsePatterns: Ha,
    defaultParseWidth: "any"
  }),
  dayPeriod: bA({
    matchPatterns: _a,
    defaultMatchWidth: "any",
    parsePatterns: $a,
    defaultParseWidth: "any"
  })
}, tn = {
  code: "zh-CN",
  formatDistance: Ka,
  formatLong: xa,
  formatRelative: Ya,
  localize: Na,
  match: An,
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 4
  }
};
function rn(A, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: A,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const ln = {}, Et = {};
function wA(A, t) {
  try {
    const l = (ln[A] ||= new Intl.DateTimeFormat("en-US", {
      timeZone: A,
      timeZoneName: "longOffset"
    }).format)(t).split("GMT")[1];
    return l in Et ? Et[l] : x3(l, l.split(":"));
  } catch {
    if (A in Et) return Et[A];
    const r = A?.match(en);
    return r ? x3(A, r.slice(1)) : NaN;
  }
}
const en = /([+-]\d\d):?(\d\d)?/;
function x3(A, t) {
  const r = +(t[0] || 0), l = +(t[1] || 0), e = +(t[2] || 0) / 60;
  return Et[A] = r * 60 + l > 0 ? r * 60 + l + e : r * 60 - l - e;
}
class UA extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(wA(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), Rl(this), jr(this)) : this.setTime(Date.now());
  }
  static tz(t, ...r) {
    return r.length ? new UA(...r, t) : new UA(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new UA(+this, t);
  }
  getTimezoneOffset() {
    const t = -wA(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), jr(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new UA(+new Date(t), this.timeZone);
  }
  //#endregion
}
const X3 = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((A) => {
  if (!X3.test(A)) return;
  const t = A.replace(X3, "$1UTC");
  UA.prototype[t] && (A.startsWith("get") ? UA.prototype[A] = function() {
    return this.internal[t]();
  } : (UA.prototype[A] = function() {
    return Date.prototype[t].apply(this.internal, arguments), un(this), +this;
  }, UA.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), jr(this), +this;
  }));
});
function jr(A) {
  A.internal.setTime(+A), A.internal.setUTCSeconds(A.internal.getUTCSeconds() - Math.round(-wA(A.timeZone, A) * 60));
}
function un(A) {
  Date.prototype.setFullYear.call(A, A.internal.getUTCFullYear(), A.internal.getUTCMonth(), A.internal.getUTCDate()), Date.prototype.setHours.call(A, A.internal.getUTCHours(), A.internal.getUTCMinutes(), A.internal.getUTCSeconds(), A.internal.getUTCMilliseconds()), Rl(A);
}
function Rl(A) {
  const t = wA(A.timeZone, A), r = t > 0 ? Math.floor(t) : Math.ceil(t), l = /* @__PURE__ */ new Date(+A);
  l.setUTCHours(l.getUTCHours() - 1);
  const e = -(/* @__PURE__ */ new Date(+A)).getTimezoneOffset(), u = -(/* @__PURE__ */ new Date(+l)).getTimezoneOffset(), a = e - u, I = Date.prototype.getHours.apply(A) !== A.internal.getUTCHours();
  a && I && A.internal.setUTCMinutes(A.internal.getUTCMinutes() + a);
  const z = e - r;
  z && Date.prototype.setUTCMinutes.call(A, Date.prototype.getUTCMinutes.call(A) + z);
  const V = /* @__PURE__ */ new Date(+A);
  V.setUTCSeconds(0);
  const d = e > 0 ? V.getSeconds() : (V.getSeconds() - 60) % 60, p = Math.round(-(wA(A.timeZone, A) * 60)) % 60;
  (p || d) && (A.internal.setUTCSeconds(A.internal.getUTCSeconds() + p), Date.prototype.setUTCSeconds.call(A, Date.prototype.getUTCSeconds.call(A) + p + d));
  const E = wA(A.timeZone, A), q = E > 0 ? Math.floor(E) : Math.ceil(E), v = -(/* @__PURE__ */ new Date(+A)).getTimezoneOffset() - q, c = q !== r, M = v - z;
  if (c && M) {
    Date.prototype.setUTCMinutes.call(A, Date.prototype.getUTCMinutes.call(A) + M);
    const W = wA(A.timeZone, A), C = W > 0 ? Math.floor(W) : Math.ceil(W), Z = q - C;
    Z && (A.internal.setUTCMinutes(A.internal.getUTCMinutes() + Z), Date.prototype.setUTCMinutes.call(A, Date.prototype.getUTCMinutes.call(A) + Z));
  }
}
class uA extends UA {
  //#region static
  static tz(t, ...r) {
    return r.length ? new uA(...r, t) : new uA(Date.now(), t);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [t, r, l] = this.tzComponents(), e = `${t}${r}:${l}`;
    return this.internal.toISOString().slice(0, -1) + e;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [t, r, l, e] = this.internal.toUTCString().split(" ");
    return `${t?.slice(0, -1)} ${l} ${r} ${e}`;
  }
  toTimeString() {
    const t = this.internal.toUTCString().split(" ")[4], [r, l, e] = this.tzComponents();
    return `${t} GMT${r}${l}${e} (${rn(this.timeZone, this)})`;
  }
  toLocaleString(t, r) {
    return Date.prototype.toLocaleString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  toLocaleDateString(t, r) {
    return Date.prototype.toLocaleDateString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  toLocaleTimeString(t, r) {
    return Date.prototype.toLocaleTimeString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const t = this.getTimezoneOffset(), r = t > 0 ? "-" : "+", l = String(Math.floor(Math.abs(t) / 60)).padStart(2, "0"), e = String(Math.abs(t) % 60).padStart(2, "0");
    return [r, l, e];
  }
  //#endregion
  withTimeZone(t) {
    return new uA(+this, t);
  }
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new uA(+new Date(t), this.timeZone);
  }
  //#endregion
}
function jl(A, t, r) {
  const l = P(A, r?.in);
  return isNaN(t) ? tA(A, NaN) : (t && l.setDate(l.getDate() + t), l);
}
function Ol(A, t, r) {
  const l = P(A, r?.in);
  if (isNaN(t)) return tA(A, NaN);
  if (!t)
    return l;
  const e = l.getDate(), u = tA(A, l.getTime());
  u.setMonth(l.getMonth() + t + 1, 0);
  const a = u.getDate();
  return e >= a ? u : (l.setFullYear(
    u.getFullYear(),
    u.getMonth(),
    e
  ), l);
}
function Mt(A, t) {
  return TA(A, { ...t, weekStartsOn: 1 });
}
function gl(A, t) {
  const r = P(A, t?.in), l = r.getFullYear(), e = tA(r, 0);
  e.setFullYear(l + 1, 0, 4), e.setHours(0, 0, 0, 0);
  const u = Mt(e), a = tA(r, 0);
  a.setFullYear(l, 0, 4), a.setHours(0, 0, 0, 0);
  const I = Mt(a);
  return r.getTime() >= u.getTime() ? l + 1 : r.getTime() >= I.getTime() ? l : l - 1;
}
function Y3(A) {
  const t = P(A), r = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return r.setUTCFullYear(t.getFullYear()), +A - +r;
}
function vt(A, t) {
  const r = P(A, t?.in);
  return r.setHours(0, 0, 0, 0), r;
}
function A3(A, t, r) {
  const [l, e] = $A(
    r?.in,
    A,
    t
  ), u = vt(l), a = vt(e), I = +u - Y3(u), z = +a - Y3(a);
  return Math.round((I - z) / wu);
}
function an(A, t) {
  const r = gl(A, t), l = tA(A, 0);
  return l.setFullYear(r, 0, 4), l.setHours(0, 0, 0, 0), Mt(l);
}
function nn(A, t, r) {
  return jl(A, t * 7, r);
}
function In(A, t, r) {
  return Ol(A, t * 12, r);
}
function zn(A, t) {
  let r, l = t?.in;
  return A.forEach((e) => {
    !l && typeof e == "object" && (l = tA.bind(null, e));
    const u = P(e, l);
    (!r || r < u || isNaN(+u)) && (r = u);
  }), tA(l, r || NaN);
}
function dn(A, t) {
  let r, l = t?.in;
  return A.forEach((e) => {
    !l && typeof e == "object" && (l = tA.bind(null, e));
    const u = P(e, l);
    (!r || r > u || isNaN(+u)) && (r = u);
  }), tA(l, r || NaN);
}
function Vn(A, t, r) {
  const [l, e] = $A(
    r?.in,
    A,
    t
  );
  return +vt(l) == +vt(e);
}
function yl(A) {
  return A instanceof Date || typeof A == "object" && Object.prototype.toString.call(A) === "[object Date]";
}
function En(A) {
  return !(!yl(A) && typeof A != "number" || isNaN(+P(A)));
}
function Nl(A, t, r) {
  const [l, e] = $A(
    r?.in,
    A,
    t
  ), u = l.getFullYear() - e.getFullYear(), a = l.getMonth() - e.getMonth();
  return u * 12 + a;
}
function pn(A, t) {
  const r = P(A, t?.in), l = r.getMonth();
  return r.setFullYear(r.getFullYear(), l + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function Fl(A, t) {
  const [r, l] = $A(A, t.start, t.end);
  return { start: r, end: l };
}
function qn(A, t) {
  const { start: r, end: l } = Fl(t?.in, A);
  let e = +r > +l;
  const u = e ? +r : +l, a = e ? l : r;
  a.setHours(0, 0, 0, 0), a.setDate(1);
  let I = 1;
  const z = [];
  for (; +a <= u; )
    z.push(tA(r, a)), a.setMonth(a.getMonth() + I);
  return e ? z.reverse() : z;
}
function mn(A, t) {
  const r = P(A, t?.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function Mn(A, t) {
  const r = P(A, t?.in), l = r.getFullYear();
  return r.setFullYear(l + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function Bl(A, t) {
  const r = P(A, t?.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function vn(A, t) {
  const { start: r, end: l } = Fl(t?.in, A);
  let e = +r > +l;
  const u = e ? +r : +l, a = e ? l : r;
  a.setHours(0, 0, 0, 0), a.setMonth(0, 1);
  let I = 1;
  const z = [];
  for (; +a <= u; )
    z.push(tA(r, a)), a.setFullYear(a.getFullYear() + I);
  return e ? z.reverse() : z;
}
function Tl(A, t) {
  const r = ht(), l = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, e = P(A, t?.in), u = e.getDay(), a = (u < l ? -7 : 0) + 6 - (u - l);
  return e.setDate(e.getDate() + a), e.setHours(23, 59, 59, 999), e;
}
function cn(A, t) {
  return Tl(A, { ...t, weekStartsOn: 1 });
}
function Wn(A, t) {
  const r = P(A, t?.in);
  return A3(r, Bl(r)) + 1;
}
function t3(A, t) {
  const r = P(A, t?.in), l = +Mt(r) - +an(r);
  return Math.round(l / ol) + 1;
}
function Pl(A, t) {
  const r = P(A, t?.in), l = r.getFullYear(), e = ht(), u = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? e.firstWeekContainsDate ?? e.locale?.options?.firstWeekContainsDate ?? 1, a = tA(t?.in || A, 0);
  a.setFullYear(l + 1, 0, u), a.setHours(0, 0, 0, 0);
  const I = TA(a, t), z = tA(t?.in || A, 0);
  z.setFullYear(l, 0, u), z.setHours(0, 0, 0, 0);
  const V = TA(z, t);
  return +r >= +I ? l + 1 : +r >= +V ? l : l - 1;
}
function Zn(A, t) {
  const r = ht(), l = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, e = Pl(A, t), u = tA(t?.in || A, 0);
  return u.setFullYear(e, 0, l), u.setHours(0, 0, 0, 0), TA(u, t);
}
function r3(A, t) {
  const r = P(A, t?.in), l = +TA(r, t) - +Zn(r, t);
  return Math.round(l / ol) + 1;
}
function B(A, t) {
  const r = A < 0 ? "-" : "", l = Math.abs(A).toString().padStart(t, "0");
  return r + l;
}
const OA = {
  // Year
  y(A, t) {
    const r = A.getFullYear(), l = r > 0 ? r : 1 - r;
    return B(t === "yy" ? l % 100 : l, t.length);
  },
  // Month
  M(A, t) {
    const r = A.getMonth();
    return t === "M" ? String(r + 1) : B(r + 1, 2);
  },
  // Day of the month
  d(A, t) {
    return B(A.getDate(), t.length);
  },
  // AM or PM
  a(A, t) {
    const r = A.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.toUpperCase();
      case "aaa":
        return r;
      case "aaaaa":
        return r[0];
      default:
        return r === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(A, t) {
    return B(A.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(A, t) {
    return B(A.getHours(), t.length);
  },
  // Minute
  m(A, t) {
    return B(A.getMinutes(), t.length);
  },
  // Second
  s(A, t) {
    return B(A.getSeconds(), t.length);
  },
  // Fraction of second
  S(A, t) {
    const r = t.length, l = A.getMilliseconds(), e = Math.trunc(
      l * Math.pow(10, r - 3)
    );
    return B(e, t.length);
  }
}, At = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, G3 = {
  // Era
  G: function(A, t, r) {
    const l = A.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return r.era(l, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return r.era(l, { width: "narrow" });
      default:
        return r.era(l, { width: "wide" });
    }
  },
  // Year
  y: function(A, t, r) {
    if (t === "yo") {
      const l = A.getFullYear(), e = l > 0 ? l : 1 - l;
      return r.ordinalNumber(e, { unit: "year" });
    }
    return OA.y(A, t);
  },
  // Local week-numbering year
  Y: function(A, t, r, l) {
    const e = Pl(A, l), u = e > 0 ? e : 1 - e;
    if (t === "YY") {
      const a = u % 100;
      return B(a, 2);
    }
    return t === "Yo" ? r.ordinalNumber(u, { unit: "year" }) : B(u, t.length);
  },
  // ISO week-numbering year
  R: function(A, t) {
    const r = gl(A);
    return B(r, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(A, t) {
    const r = A.getFullYear();
    return B(r, t.length);
  },
  // Quarter
  Q: function(A, t, r) {
    const l = Math.ceil((A.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "Q":
        return String(l);
      // 01, 02, 03, 04
      case "QQ":
        return B(l, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return r.ordinalNumber(l, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return r.quarter(l, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return r.quarter(l, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.quarter(l, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(A, t, r) {
    const l = Math.ceil((A.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "q":
        return String(l);
      // 01, 02, 03, 04
      case "qq":
        return B(l, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return r.ordinalNumber(l, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return r.quarter(l, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return r.quarter(l, {
          width: "narrow",
          context: "standalone"
        });
      default:
        return r.quarter(l, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(A, t, r) {
    const l = A.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return OA.M(A, t);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return r.ordinalNumber(l + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return r.month(l, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return r.month(l, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.month(l, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(A, t, r) {
    const l = A.getMonth();
    switch (t) {
      // 1, 2, ..., 12
      case "L":
        return String(l + 1);
      // 01, 02, ..., 12
      case "LL":
        return B(l + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return r.ordinalNumber(l + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return r.month(l, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return r.month(l, {
          width: "narrow",
          context: "standalone"
        });
      default:
        return r.month(l, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(A, t, r, l) {
    const e = r3(A, l);
    return t === "wo" ? r.ordinalNumber(e, { unit: "week" }) : B(e, t.length);
  },
  // ISO week of year
  I: function(A, t, r) {
    const l = t3(A);
    return t === "Io" ? r.ordinalNumber(l, { unit: "week" }) : B(l, t.length);
  },
  // Day of the month
  d: function(A, t, r) {
    return t === "do" ? r.ordinalNumber(A.getDate(), { unit: "date" }) : OA.d(A, t);
  },
  // Day of year
  D: function(A, t, r) {
    const l = Wn(A);
    return t === "Do" ? r.ordinalNumber(l, { unit: "dayOfYear" }) : B(l, t.length);
  },
  // Day of week
  E: function(A, t, r) {
    const l = A.getDay();
    switch (t) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return r.day(l, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return r.day(l, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return r.day(l, {
          width: "short",
          context: "formatting"
        });
      default:
        return r.day(l, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(A, t, r, l) {
    const e = A.getDay(), u = (e - l.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(u);
      // Padded numerical value
      case "ee":
        return B(u, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return r.ordinalNumber(u, { unit: "day" });
      case "eee":
        return r.day(e, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return r.day(e, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return r.day(e, {
          width: "short",
          context: "formatting"
        });
      default:
        return r.day(e, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(A, t, r, l) {
    const e = A.getDay(), u = (e - l.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (same as in `e`)
      case "c":
        return String(u);
      // Padded numerical value
      case "cc":
        return B(u, t.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return r.ordinalNumber(u, { unit: "day" });
      case "ccc":
        return r.day(e, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return r.day(e, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return r.day(e, {
          width: "short",
          context: "standalone"
        });
      default:
        return r.day(e, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(A, t, r) {
    const l = A.getDay(), e = l === 0 ? 7 : l;
    switch (t) {
      // 2
      case "i":
        return String(e);
      // 02
      case "ii":
        return B(e, t.length);
      // 2nd
      case "io":
        return r.ordinalNumber(e, { unit: "day" });
      // Tue
      case "iii":
        return r.day(l, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return r.day(l, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return r.day(l, {
          width: "short",
          context: "formatting"
        });
      default:
        return r.day(l, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(A, t, r) {
    const e = A.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.dayPeriod(e, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return r.dayPeriod(e, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return r.dayPeriod(e, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.dayPeriod(e, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(A, t, r) {
    const l = A.getHours();
    let e;
    switch (l === 12 ? e = At.noon : l === 0 ? e = At.midnight : e = l / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return r.dayPeriod(e, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return r.dayPeriod(e, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return r.dayPeriod(e, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.dayPeriod(e, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(A, t, r) {
    const l = A.getHours();
    let e;
    switch (l >= 17 ? e = At.evening : l >= 12 ? e = At.afternoon : l >= 4 ? e = At.morning : e = At.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return r.dayPeriod(e, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return r.dayPeriod(e, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.dayPeriod(e, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(A, t, r) {
    if (t === "ho") {
      let l = A.getHours() % 12;
      return l === 0 && (l = 12), r.ordinalNumber(l, { unit: "hour" });
    }
    return OA.h(A, t);
  },
  // Hour [0-23]
  H: function(A, t, r) {
    return t === "Ho" ? r.ordinalNumber(A.getHours(), { unit: "hour" }) : OA.H(A, t);
  },
  // Hour [0-11]
  K: function(A, t, r) {
    const l = A.getHours() % 12;
    return t === "Ko" ? r.ordinalNumber(l, { unit: "hour" }) : B(l, t.length);
  },
  // Hour [1-24]
  k: function(A, t, r) {
    let l = A.getHours();
    return l === 0 && (l = 24), t === "ko" ? r.ordinalNumber(l, { unit: "hour" }) : B(l, t.length);
  },
  // Minute
  m: function(A, t, r) {
    return t === "mo" ? r.ordinalNumber(A.getMinutes(), { unit: "minute" }) : OA.m(A, t);
  },
  // Second
  s: function(A, t, r) {
    return t === "so" ? r.ordinalNumber(A.getSeconds(), { unit: "second" }) : OA.s(A, t);
  },
  // Fraction of second
  S: function(A, t) {
    return OA.S(A, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(A, t, r) {
    const l = A.getTimezoneOffset();
    if (l === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return R3(l);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return kA(l);
      // Hours and minutes with `:` delimiter
      default:
        return kA(l, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(A, t, r) {
    const l = A.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return R3(l);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return kA(l);
      // Hours and minutes with `:` delimiter
      default:
        return kA(l, ":");
    }
  },
  // Timezone (GMT)
  O: function(A, t, r) {
    const l = A.getTimezoneOffset();
    switch (t) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + o3(l, ":");
      default:
        return "GMT" + kA(l, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(A, t, r) {
    const l = A.getTimezoneOffset();
    switch (t) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + o3(l, ":");
      default:
        return "GMT" + kA(l, ":");
    }
  },
  // Seconds timestamp
  t: function(A, t, r) {
    const l = Math.trunc(+A / 1e3);
    return B(l, t.length);
  },
  // Milliseconds timestamp
  T: function(A, t, r) {
    return B(+A, t.length);
  }
};
function o3(A, t = "") {
  const r = A > 0 ? "-" : "+", l = Math.abs(A), e = Math.trunc(l / 60), u = l % 60;
  return u === 0 ? r + String(e) : r + String(e) + t + B(u, 2);
}
function R3(A, t) {
  return A % 60 === 0 ? (A > 0 ? "-" : "+") + B(Math.abs(A) / 60, 2) : kA(A, t);
}
function kA(A, t = "") {
  const r = A > 0 ? "-" : "+", l = Math.abs(A), e = B(Math.trunc(l / 60), 2), u = B(l % 60, 2);
  return r + e + t + u;
}
const j3 = (A, t) => {
  switch (A) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    default:
      return t.date({ width: "full" });
  }
}, kl = (A, t) => {
  switch (A) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    default:
      return t.time({ width: "full" });
  }
}, Cn = (A, t) => {
  const r = A.match(/(P+)(p+)?/) || [], l = r[1], e = r[2];
  if (!e)
    return j3(A, t);
  let u;
  switch (l) {
    case "P":
      u = t.dateTime({ width: "short" });
      break;
    case "PP":
      u = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      u = t.dateTime({ width: "long" });
      break;
    default:
      u = t.dateTime({ width: "full" });
      break;
  }
  return u.replace("{{date}}", j3(l, t)).replace("{{time}}", kl(e, t));
}, fn = {
  p: kl,
  P: Cn
}, bn = /^D+$/, Un = /^Y+$/, hn = ["D", "DD", "YY", "YYYY"];
function Kn(A) {
  return bn.test(A);
}
function Qn(A) {
  return Un.test(A);
}
function Sn(A, t, r) {
  const l = sn(A, t, r);
  if (console.warn(l), hn.includes(A)) throw new RangeError(l);
}
function sn(A, t, r) {
  const l = A[0] === "Y" ? "years" : "days of the month";
  return `Use \`${A.toLowerCase()}\` instead of \`${A}\` (in \`${t}\`) for formatting ${l} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const xn = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Xn = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Yn = /^'([^]*?)'?$/, Gn = /''/g, on = /[a-zA-Z]/;
function pt(A, t, r) {
  const l = ht(), e = r?.locale ?? l.locale ?? rt, u = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? l.firstWeekContainsDate ?? l.locale?.options?.firstWeekContainsDate ?? 1, a = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? l.weekStartsOn ?? l.locale?.options?.weekStartsOn ?? 0, I = P(A, r?.in);
  if (!En(I))
    throw new RangeError("Invalid time value");
  let z = t.match(Xn).map((d) => {
    const p = d[0];
    if (p === "p" || p === "P") {
      const E = fn[p];
      return E(d, e.formatLong);
    }
    return d;
  }).join("").match(xn).map((d) => {
    if (d === "''")
      return { isToken: !1, value: "'" };
    const p = d[0];
    if (p === "'")
      return { isToken: !1, value: Rn(d) };
    if (G3[p])
      return { isToken: !0, value: d };
    if (p.match(on))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + p + "`"
      );
    return { isToken: !1, value: d };
  });
  e.localize.preprocessor && (z = e.localize.preprocessor(I, z));
  const V = {
    firstWeekContainsDate: u,
    weekStartsOn: a,
    locale: e
  };
  return z.map((d) => {
    if (!d.isToken) return d.value;
    const p = d.value;
    (!r?.useAdditionalWeekYearTokens && Qn(p) || !r?.useAdditionalDayOfYearTokens && Kn(p)) && Sn(p, t, String(A));
    const E = G3[p[0]];
    return E(I, p, e.localize, V);
  }).join("");
}
function Rn(A) {
  const t = A.match(Yn);
  return t ? t[1].replace(Gn, "'") : A;
}
function jn(A, t) {
  const r = P(A, t?.in), l = r.getFullYear(), e = r.getMonth(), u = tA(r, 0);
  return u.setFullYear(l, e + 1, 0), u.setHours(0, 0, 0, 0), u.getDate();
}
function On(A, t) {
  return P(A, t?.in).getMonth();
}
function gn(A, t) {
  return P(A, t?.in).getFullYear();
}
function yn(A, t) {
  return +P(A) > +P(t);
}
function Nn(A, t) {
  return +P(A) < +P(t);
}
function Fn(A, t, r) {
  const [l, e] = $A(
    r?.in,
    A,
    t
  );
  return l.getFullYear() === e.getFullYear() && l.getMonth() === e.getMonth();
}
function Bn(A, t, r) {
  const [l, e] = $A(
    r?.in,
    A,
    t
  );
  return l.getFullYear() === e.getFullYear();
}
function Tn(A, t, r) {
  const l = P(A, r?.in), e = l.getFullYear(), u = l.getDate(), a = tA(A, 0);
  a.setFullYear(e, t, 15), a.setHours(0, 0, 0, 0);
  const I = jn(a);
  return l.setMonth(t, Math.min(u, I)), l;
}
function Pn(A, t, r) {
  const l = P(A, r?.in);
  return isNaN(+l) ? tA(A, NaN) : (l.setFullYear(t), l);
}
const O3 = 5, kn = 4;
function Ln(A, t) {
  const r = t.startOfMonth(A), l = r.getDay() > 0 ? r.getDay() : 7, e = t.addDays(A, -l + 1), u = t.addDays(e, O3 * 7 - 1);
  return t.getMonth(A) === t.getMonth(u) ? O3 : kn;
}
function Ll(A, t) {
  const r = t.startOfMonth(A), l = r.getDay();
  return l === 1 ? r : l === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (l - 1));
}
function wn(A, t) {
  const r = Ll(A, t), l = Ln(A, t);
  return t.addDays(r, l * 7 - 1);
}
const wl = {
  ...rt,
  labels: {
    labelDayButton: (A, t, r, l) => {
      let e;
      l && typeof l.format == "function" ? e = l.format.bind(l) : e = (a, I) => pt(a, I, { locale: rt, ...r });
      let u = e(A, "PPPP");
      return t.today && (u = `Today, ${u}`), t.selected && (u = `${u}, selected`), u;
    },
    labelMonthDropdown: "Choose the Month",
    labelNext: "Go to the Next Month",
    labelPrevious: "Go to the Previous Month",
    labelWeekNumber: (A) => `Week ${A}`,
    labelYearDropdown: "Choose the Year",
    labelGrid: (A, t, r) => {
      let l;
      return r && typeof r.format == "function" ? l = r.format.bind(r) : l = (e, u) => pt(e, u, { locale: rt, ...t }), l(A, "LLLL yyyy");
    },
    labelGridcell: (A, t, r, l) => {
      let e;
      l && typeof l.format == "function" ? e = l.format.bind(l) : e = (a, I) => pt(a, I, { locale: rt, ...r });
      let u = e(A, "PPPP");
      return t?.today && (u = `Today, ${u}`), u;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (A, t, r) => {
      let l;
      return r && typeof r.format == "function" ? l = r.format.bind(r) : l = (e, u) => pt(e, u, { locale: rt, ...t }), l(A, "cccc");
    }
  }
};
class dA {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, r) {
    this.Date = Date, this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? uA.tz(this.options.timeZone) : new this.Date(), this.newDate = (l, e, u) => this.overrides?.newDate ? this.overrides.newDate(l, e, u) : this.options.timeZone ? new uA(l, e, u, this.options.timeZone) : new Date(l, e, u), this.addDays = (l, e) => this.overrides?.addDays ? this.overrides.addDays(l, e) : jl(l, e), this.addMonths = (l, e) => this.overrides?.addMonths ? this.overrides.addMonths(l, e) : Ol(l, e), this.addWeeks = (l, e) => this.overrides?.addWeeks ? this.overrides.addWeeks(l, e) : nn(l, e), this.addYears = (l, e) => this.overrides?.addYears ? this.overrides.addYears(l, e) : In(l, e), this.differenceInCalendarDays = (l, e) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(l, e) : A3(l, e), this.differenceInCalendarMonths = (l, e) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(l, e) : Nl(l, e), this.eachMonthOfInterval = (l) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(l) : qn(l), this.eachYearOfInterval = (l) => {
      const e = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(l) : vn(l), u = new Set(e.map((I) => this.getYear(I)));
      if (u.size === e.length)
        return e;
      const a = [];
      return u.forEach((I) => {
        a.push(new Date(I, 0, 1));
      }), a;
    }, this.endOfBroadcastWeek = (l) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(l) : wn(l, this), this.endOfISOWeek = (l) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(l) : cn(l), this.endOfMonth = (l) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(l) : pn(l), this.endOfWeek = (l, e) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(l, e) : Tl(l, this.options), this.endOfYear = (l) => this.overrides?.endOfYear ? this.overrides.endOfYear(l) : Mn(l), this.format = (l, e, u) => {
      const a = this.overrides?.format ? this.overrides.format(l, e, this.options) : pt(l, e, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(a) : a;
    }, this.getISOWeek = (l) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(l) : t3(l), this.getMonth = (l, e) => this.overrides?.getMonth ? this.overrides.getMonth(l, this.options) : On(l, this.options), this.getYear = (l, e) => this.overrides?.getYear ? this.overrides.getYear(l, this.options) : gn(l, this.options), this.getWeek = (l, e) => this.overrides?.getWeek ? this.overrides.getWeek(l, this.options) : r3(l, this.options), this.isAfter = (l, e) => this.overrides?.isAfter ? this.overrides.isAfter(l, e) : yn(l, e), this.isBefore = (l, e) => this.overrides?.isBefore ? this.overrides.isBefore(l, e) : Nn(l, e), this.isDate = (l) => this.overrides?.isDate ? this.overrides.isDate(l) : yl(l), this.isSameDay = (l, e) => this.overrides?.isSameDay ? this.overrides.isSameDay(l, e) : Vn(l, e), this.isSameMonth = (l, e) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(l, e) : Fn(l, e), this.isSameYear = (l, e) => this.overrides?.isSameYear ? this.overrides.isSameYear(l, e) : Bn(l, e), this.max = (l) => this.overrides?.max ? this.overrides.max(l) : zn(l), this.min = (l) => this.overrides?.min ? this.overrides.min(l) : dn(l), this.setMonth = (l, e) => this.overrides?.setMonth ? this.overrides.setMonth(l, e) : Tn(l, e), this.setYear = (l, e) => this.overrides?.setYear ? this.overrides.setYear(l, e) : Pn(l, e), this.startOfBroadcastWeek = (l, e) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(l, this) : Ll(l, this), this.startOfDay = (l) => this.overrides?.startOfDay ? this.overrides.startOfDay(l) : vt(l), this.startOfISOWeek = (l) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(l) : Mt(l), this.startOfMonth = (l) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(l) : mn(l), this.startOfWeek = (l, e) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(l, this.options) : TA(l, this.options), this.startOfYear = (l) => this.overrides?.startOfYear ? this.overrides.startOfYear(l) : Bl(l), this.options = { locale: wl, ...t }, this.overrides = r;
  }
  /**
   * Generates a mapping of Arabic digits (0-9) to the target numbering system
   * digits.
   *
   * @since 9.5.0
   * @returns A record mapping Arabic digits to the target numerals.
   */
  getDigitMap() {
    const { numerals: t = "latn" } = this.options, r = new Intl.NumberFormat("en-US", {
      numberingSystem: t
    }), l = {};
    for (let e = 0; e < 10; e++)
      l[e.toString()] = r.format(e);
    return l;
  }
  /**
   * Replaces Arabic digits in a string with the target numbering system digits.
   *
   * @since 9.5.0
   * @param input The string containing Arabic digits.
   * @returns The string with digits replaced.
   */
  replaceDigits(t) {
    const r = this.getDigitMap();
    return t.replace(/\d/g, (l) => r[l] || l);
  }
  /**
   * Formats a number using the configured numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number as a string.
   */
  formatNumber(t) {
    return this.replaceDigits(t.toString());
  }
  /**
   * Returns the preferred ordering for month and year labels for the current
   * locale.
   */
  getMonthYearOrder() {
    const t = this.options.locale?.code;
    return t && dA.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: r, timeZone: l, numerals: e } = this.options, u = r?.code;
    if (u && dA.yearFirstLocales.has(u))
      try {
        return new Intl.DateTimeFormat(u, {
          month: "long",
          year: "numeric",
          timeZone: l,
          numberingSystem: e
        }).format(t);
      } catch {
      }
    const a = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
    return this.format(t, a);
  }
}
dA.yearFirstLocales = /* @__PURE__ */ new Set([
  "eu",
  "hu",
  "ja",
  "ja-Hira",
  "ja-JP",
  "ko",
  "ko-KR",
  "lt",
  "lt-LT",
  "lv",
  "lv-LV",
  "mn",
  "mn-MN",
  "zh",
  "zh-CN",
  "zh-HK",
  "zh-TW"
]);
const QA = new dA();
class Jl {
  constructor(t, r, l = QA) {
    this.date = t, this.displayMonth = r, this.outside = !!(r && !l.isSameMonth(t, r)), this.dateLib = l, this.isoDate = l.format(t, "yyyy-MM-dd"), this.displayMonthId = l.format(r, "yyyy-MM"), this.dateMonthId = l.format(t, "yyyy-MM");
  }
  /**
   * Checks if this day is equal to another `CalendarDay`, considering both the
   * date and the displayed month.
   *
   * @param day The `CalendarDay` to compare with.
   * @returns `true` if the days are equal, otherwise `false`.
   */
  isEqualTo(t) {
    return this.dateLib.isSameDay(t.date, this.date) && this.dateLib.isSameMonth(t.displayMonth, this.displayMonth);
  }
}
class Jn {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class Dn {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function Hn(A) {
  return S.createElement("button", { ...A });
}
function _n(A) {
  return S.createElement("span", { ...A });
}
function $n(A) {
  const { size: t = 24, orientation: r = "left", className: l } = A;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    S.createElement(
      "svg",
      { className: l, width: t, height: t, viewBox: "0 0 24 24" },
      r === "up" && S.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      r === "down" && S.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      r === "left" && S.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      r === "right" && S.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function AI(A) {
  const { day: t, modifiers: r, ...l } = A;
  return S.createElement("td", { ...l });
}
function tI(A) {
  const { day: t, modifiers: r, ...l } = A, e = S.useRef(null);
  return S.useEffect(() => {
    r.focused && e.current?.focus();
  }, [r.focused]), S.createElement("button", { ref: e, ...l });
}
var s;
(function(A) {
  A.Root = "root", A.Chevron = "chevron", A.Day = "day", A.DayButton = "day_button", A.CaptionLabel = "caption_label", A.Dropdowns = "dropdowns", A.Dropdown = "dropdown", A.DropdownRoot = "dropdown_root", A.Footer = "footer", A.MonthGrid = "month_grid", A.MonthCaption = "month_caption", A.MonthsDropdown = "months_dropdown", A.Month = "month", A.Months = "months", A.Nav = "nav", A.NextMonthButton = "button_next", A.PreviousMonthButton = "button_previous", A.Week = "week", A.Weeks = "weeks", A.Weekday = "weekday", A.Weekdays = "weekdays", A.WeekNumber = "week_number", A.WeekNumberHeader = "week_number_header", A.YearsDropdown = "years_dropdown";
})(s || (s = {}));
var _;
(function(A) {
  A.disabled = "disabled", A.hidden = "hidden", A.outside = "outside", A.focused = "focused", A.today = "today";
})(_ || (_ = {}));
var vA;
(function(A) {
  A.range_end = "range_end", A.range_middle = "range_middle", A.range_start = "range_start", A.selected = "selected";
})(vA || (vA = {}));
var IA;
(function(A) {
  A.weeks_before_enter = "weeks_before_enter", A.weeks_before_exit = "weeks_before_exit", A.weeks_after_enter = "weeks_after_enter", A.weeks_after_exit = "weeks_after_exit", A.caption_after_enter = "caption_after_enter", A.caption_after_exit = "caption_after_exit", A.caption_before_enter = "caption_before_enter", A.caption_before_exit = "caption_before_exit";
})(IA || (IA = {}));
function rI(A) {
  const { options: t, className: r, components: l, classNames: e, ...u } = A, a = [e[s.Dropdown], r].join(" "), I = t?.find(({ value: z }) => z === u.value);
  return S.createElement(
    "span",
    { "data-disabled": u.disabled, className: e[s.DropdownRoot] },
    S.createElement(l.Select, { className: a, ...u }, t?.map(({ value: z, label: V, disabled: d }) => S.createElement(l.Option, { key: z, value: z, disabled: d }, V))),
    S.createElement(
      "span",
      { className: e[s.CaptionLabel], "aria-hidden": !0 },
      I?.label,
      S.createElement(l.Chevron, { orientation: "down", size: 18, className: e[s.Chevron] })
    )
  );
}
function lI(A) {
  return S.createElement("div", { ...A });
}
function eI(A) {
  return S.createElement("div", { ...A });
}
function uI(A) {
  const { calendarMonth: t, displayIndex: r, ...l } = A;
  return S.createElement("div", { ...l }, A.children);
}
function aI(A) {
  const { calendarMonth: t, displayIndex: r, ...l } = A;
  return S.createElement("div", { ...l });
}
function nI(A) {
  return S.createElement("table", { ...A });
}
function II(A) {
  return S.createElement("div", { ...A });
}
const Dl = Pr(void 0);
function Kt() {
  const A = at(Dl);
  if (A === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return A;
}
function zI(A) {
  const { components: t } = Kt();
  return S.createElement(t.Dropdown, { ...A });
}
function dI(A) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: l, nextMonth: e, ...u } = A, { components: a, classNames: I, labels: { labelPrevious: z, labelNext: V } } = Kt(), d = EA((E) => {
    e && r?.(E);
  }, [e, r]), p = EA((E) => {
    l && t?.(E);
  }, [l, t]);
  return S.createElement(
    "nav",
    { ...u },
    S.createElement(
      a.PreviousMonthButton,
      { type: "button", className: I[s.PreviousMonthButton], tabIndex: l ? void 0 : -1, "aria-disabled": l ? void 0 : !0, "aria-label": z(l), onClick: p },
      S.createElement(a.Chevron, { disabled: l ? void 0 : !0, className: I[s.Chevron], orientation: "left" })
    ),
    S.createElement(
      a.NextMonthButton,
      { type: "button", className: I[s.NextMonthButton], tabIndex: e ? void 0 : -1, "aria-disabled": e ? void 0 : !0, "aria-label": V(e), onClick: d },
      S.createElement(a.Chevron, { disabled: e ? void 0 : !0, orientation: "right", className: I[s.Chevron] })
    )
  );
}
function VI(A) {
  const { components: t } = Kt();
  return S.createElement(t.Button, { ...A });
}
function EI(A) {
  return S.createElement("option", { ...A });
}
function pI(A) {
  const { components: t } = Kt();
  return S.createElement(t.Button, { ...A });
}
function iI(A) {
  const { rootRef: t, ...r } = A;
  return S.createElement("div", { ...r, ref: t });
}
function qI(A) {
  return S.createElement("select", { ...A });
}
function mI(A) {
  const { week: t, ...r } = A;
  return S.createElement("tr", { ...r });
}
function MI(A) {
  return S.createElement("th", { ...A });
}
function vI(A) {
  return S.createElement(
    "thead",
    { "aria-hidden": !0 },
    S.createElement("tr", { ...A })
  );
}
function cI(A) {
  const { week: t, ...r } = A;
  return S.createElement("th", { ...r });
}
function WI(A) {
  return S.createElement("th", { ...A });
}
function ZI(A) {
  return S.createElement("tbody", { ...A });
}
function CI(A) {
  const { components: t } = Kt();
  return S.createElement(t.Dropdown, { ...A });
}
const fI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: Hn,
  CaptionLabel: _n,
  Chevron: $n,
  Day: AI,
  DayButton: tI,
  Dropdown: rI,
  DropdownNav: lI,
  Footer: eI,
  Month: uI,
  MonthCaption: aI,
  MonthGrid: nI,
  Months: II,
  MonthsDropdown: zI,
  Nav: dI,
  NextMonthButton: VI,
  Option: EI,
  PreviousMonthButton: pI,
  Root: iI,
  Select: qI,
  Week: mI,
  WeekNumber: cI,
  WeekNumberHeader: WI,
  Weekday: MI,
  Weekdays: vI,
  Weeks: ZI,
  YearsDropdown: CI
}, Symbol.toStringTag, { value: "Module" }));
function XA(A, t, r = !1, l = QA) {
  let { from: e, to: u } = A;
  const { differenceInCalendarDays: a, isSameDay: I } = l;
  return e && u ? (a(u, e) < 0 && ([e, u] = [u, e]), a(t, e) >= (r ? 1 : 0) && a(u, t) >= (r ? 1 : 0)) : !r && u ? I(u, t) : !r && e ? I(e, t) : !1;
}
function l3(A) {
  return !!(A && typeof A == "object" && "before" in A && "after" in A);
}
function Ht(A) {
  return !!(A && typeof A == "object" && "from" in A);
}
function e3(A) {
  return !!(A && typeof A == "object" && "after" in A);
}
function u3(A) {
  return !!(A && typeof A == "object" && "before" in A);
}
function Hl(A) {
  return !!(A && typeof A == "object" && "dayOfWeek" in A);
}
function _l(A, t) {
  return Array.isArray(A) && A.every(t.isDate);
}
function YA(A, t, r = QA) {
  const l = Array.isArray(t) ? t : [t], { isSameDay: e, differenceInCalendarDays: u, isAfter: a } = r;
  return l.some((I) => {
    if (typeof I == "boolean")
      return I;
    if (r.isDate(I))
      return e(A, I);
    if (_l(I, r))
      return I.some((z) => e(A, z));
    if (Ht(I))
      return XA(I, A, !1, r);
    if (Hl(I))
      return Array.isArray(I.dayOfWeek) ? I.dayOfWeek.includes(A.getDay()) : I.dayOfWeek === A.getDay();
    if (l3(I)) {
      const z = u(I.before, A), V = u(I.after, A), d = z > 0, p = V < 0;
      return a(I.before, I.after) ? p && d : d || p;
    }
    return e3(I) ? u(A, I.after) > 0 : u3(I) ? u(I.before, A) > 0 : typeof I == "function" ? I(A) : !1;
  });
}
function bI(A, t, r, l, e) {
  const { disabled: u, hidden: a, modifiers: I, showOutsideDays: z, broadcastCalendar: V, today: d = e.today() } = t, { isSameDay: p, isSameMonth: E, startOfMonth: q, isBefore: m, endOfMonth: v, isAfter: c } = e, M = r && q(r), W = l && v(l), C = {
    [_.focused]: [],
    [_.outside]: [],
    [_.disabled]: [],
    [_.hidden]: [],
    [_.today]: []
  }, Z = {};
  for (const b of A) {
    const { date: U, displayMonth: f } = b, h = !!(f && !E(U, f)), K = !!(M && m(U, M)), Q = !!(W && c(U, W)), x = !!(u && YA(U, u, e)), lA = !!(a && YA(U, a, e)) || K || Q || // Broadcast calendar will show outside days as default
    !V && !z && h || V && z === !1 && h, O = p(U, d);
    h && C.outside.push(b), x && C.disabled.push(b), lA && C.hidden.push(b), O && C.today.push(b), I && Object.keys(I).forEach((y) => {
      const iA = I?.[y];
      iA && YA(U, iA, e) && (Z[y] ? Z[y].push(b) : Z[y] = [b]);
    });
  }
  return (b) => {
    const U = {
      [_.focused]: !1,
      [_.disabled]: !1,
      [_.hidden]: !1,
      [_.outside]: !1,
      [_.today]: !1
    }, f = {};
    for (const h in C) {
      const K = C[h];
      U[h] = K.some((Q) => Q === b);
    }
    for (const h in Z)
      f[h] = Z[h].some((K) => K === b);
    return {
      ...U,
      // custom modifiers should override all the previous ones
      ...f
    };
  };
}
function UI(A, t, r = {}) {
  return Object.entries(A).filter(([, e]) => e === !0).reduce((e, [u]) => (r[u] ? e.push(r[u]) : t[_[u]] ? e.push(t[_[u]]) : t[vA[u]] && e.push(t[vA[u]]), e), [t[s.Day]]);
}
function hI(A) {
  return {
    ...fI,
    ...A
  };
}
function KI(A) {
  const t = {
    "data-mode": A.mode ?? void 0,
    "data-required": "required" in A ? A.required : void 0,
    "data-multiple-months": A.numberOfMonths && A.numberOfMonths > 1 || void 0,
    "data-week-numbers": A.showWeekNumber || void 0,
    "data-broadcast-calendar": A.broadcastCalendar || void 0,
    "data-nav-layout": A.navLayout || void 0
  };
  return Object.entries(A).forEach(([r, l]) => {
    r.startsWith("data-") && (t[r] = l);
  }), t;
}
function a3() {
  const A = {};
  for (const t in s)
    A[s[t]] = `rdp-${s[t]}`;
  for (const t in _)
    A[_[t]] = `rdp-${_[t]}`;
  for (const t in vA)
    A[vA[t]] = `rdp-${vA[t]}`;
  for (const t in IA)
    A[IA[t]] = `rdp-${IA[t]}`;
  return A;
}
function $l(A, t, r) {
  return (r ?? new dA(t)).formatMonthYear(A);
}
const QI = $l;
function SI(A, t, r) {
  return (r ?? new dA(t)).format(A, "d");
}
function sI(A, t = QA) {
  return t.format(A, "LLLL");
}
function xI(A, t, r) {
  return (r ?? new dA(t)).format(A, "cccccc");
}
function XI(A, t = QA) {
  return A < 10 ? t.formatNumber(`0${A.toLocaleString()}`) : t.formatNumber(`${A.toLocaleString()}`);
}
function YI() {
  return "";
}
function Ae(A, t = QA) {
  return t.format(A, "yyyy");
}
const GI = Ae, oI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: $l,
  formatDay: SI,
  formatMonthCaption: QI,
  formatMonthDropdown: sI,
  formatWeekNumber: XI,
  formatWeekNumberHeader: YI,
  formatWeekdayName: xI,
  formatYearCaption: GI,
  formatYearDropdown: Ae
}, Symbol.toStringTag, { value: "Module" }));
function RI(A) {
  return A?.formatMonthCaption && !A.formatCaption && (A.formatCaption = A.formatMonthCaption), A?.formatYearCaption && !A.formatYearDropdown && (A.formatYearDropdown = A.formatYearCaption), {
    ...oI,
    ...A
  };
}
function n3(A, t, r, l) {
  let e = (l ?? new dA(r)).format(A, "PPPP");
  return t.today && (e = `Today, ${e}`), t.selected && (e = `${e}, selected`), e;
}
const jI = n3;
function I3(A, t, r) {
  return (r ?? new dA(t)).formatMonthYear(A);
}
const OI = I3;
function te(A, t, r, l) {
  let e = (l ?? new dA(r)).format(A, "PPPP");
  return t?.today && (e = `Today, ${e}`), e;
}
function re(A) {
  return "Choose the Month";
}
function le() {
  return "";
}
const gI = "Go to the Next Month";
function ee(A, t) {
  return gI;
}
function ue(A) {
  return "Go to the Previous Month";
}
function ae(A, t, r) {
  return (r ?? new dA(t)).format(A, "cccc");
}
function ne(A, t) {
  return `Week ${A}`;
}
function Ie(A) {
  return "Week Number";
}
function ze(A) {
  return "Choose the Year";
}
const yI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: OI,
  labelDay: jI,
  labelDayButton: n3,
  labelGrid: I3,
  labelGridcell: te,
  labelMonthDropdown: re,
  labelNav: le,
  labelNext: ee,
  labelPrevious: ue,
  labelWeekNumber: ne,
  labelWeekNumberHeader: Ie,
  labelWeekday: ae,
  labelYearDropdown: ze
}, Symbol.toStringTag, { value: "Module" })), MA = (A, t, r) => t || (r ? typeof r == "function" ? r : (...l) => r : A);
function NI(A, t) {
  const r = t.locale?.labels ?? {};
  return {
    ...yI,
    ...A ?? {},
    labelDayButton: MA(n3, A?.labelDayButton, r.labelDayButton),
    labelMonthDropdown: MA(re, A?.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: MA(ee, A?.labelNext, r.labelNext),
    labelPrevious: MA(ue, A?.labelPrevious, r.labelPrevious),
    labelWeekNumber: MA(ne, A?.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: MA(ze, A?.labelYearDropdown, r.labelYearDropdown),
    labelGrid: MA(I3, A?.labelGrid, r.labelGrid),
    labelGridcell: MA(te, A?.labelGridcell, r.labelGridcell),
    labelNav: MA(le, A?.labelNav, r.labelNav),
    labelWeekNumberHeader: MA(Ie, A?.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: MA(ae, A?.labelWeekday, r.labelWeekday)
  };
}
function FI(A, t, r, l, e) {
  const { startOfMonth: u, startOfYear: a, endOfYear: I, eachMonthOfInterval: z, getMonth: V } = e;
  return z({
    start: a(A),
    end: I(A)
  }).map((E) => {
    const q = l.formatMonthDropdown(E, e), m = V(E), v = t && E < u(t) || r && E > u(r) || !1;
    return { value: m, label: q, disabled: v };
  });
}
function BI(A, t = {}, r = {}) {
  let l = { ...t?.[s.Day] };
  return Object.entries(A).filter(([, e]) => e === !0).forEach(([e]) => {
    l = {
      ...l,
      ...r?.[e]
    };
  }), l;
}
function TI(A, t, r, l) {
  const e = l ?? A.today(), u = r ? A.startOfBroadcastWeek(e, A) : t ? A.startOfISOWeek(e) : A.startOfWeek(e), a = [];
  for (let I = 0; I < 7; I++) {
    const z = A.addDays(u, I);
    a.push(z);
  }
  return a;
}
function PI(A, t, r, l, e = !1) {
  if (!A || !t)
    return;
  const { startOfYear: u, endOfYear: a, eachYearOfInterval: I, getYear: z } = l, V = u(A), d = a(t), p = I({ start: V, end: d });
  return e && p.reverse(), p.map((E) => {
    const q = r.formatYearDropdown(E, l);
    return {
      value: z(E),
      label: q,
      disabled: !1
    };
  });
}
function kI(A, t = {}) {
  const { weekStartsOn: r, locale: l } = t, e = r ?? l?.options?.weekStartsOn ?? 0, u = (I) => {
    const z = typeof I == "number" || typeof I == "string" ? new Date(I) : I;
    return new uA(z.getFullYear(), z.getMonth(), z.getDate(), 12, 0, 0, A);
  }, a = (I) => {
    const z = u(I);
    return new Date(z.getFullYear(), z.getMonth(), z.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => u(uA.tz(A)),
    newDate: (I, z, V) => new uA(I, z, V, 12, 0, 0, A),
    startOfDay: (I) => u(I),
    startOfWeek: (I, z) => {
      const V = u(I), d = z?.weekStartsOn ?? e, p = (V.getDay() - d + 7) % 7;
      return V.setDate(V.getDate() - p), V;
    },
    startOfISOWeek: (I) => {
      const z = u(I), V = (z.getDay() - 1 + 7) % 7;
      return z.setDate(z.getDate() - V), z;
    },
    startOfMonth: (I) => {
      const z = u(I);
      return z.setDate(1), z;
    },
    startOfYear: (I) => {
      const z = u(I);
      return z.setMonth(0, 1), z;
    },
    endOfWeek: (I, z) => {
      const V = u(I), E = (((z?.weekStartsOn ?? e) + 6) % 7 - V.getDay() + 7) % 7;
      return V.setDate(V.getDate() + E), V;
    },
    endOfISOWeek: (I) => {
      const z = u(I), V = (7 - z.getDay()) % 7;
      return z.setDate(z.getDate() + V), z;
    },
    endOfMonth: (I) => {
      const z = u(I);
      return z.setMonth(z.getMonth() + 1, 0), z;
    },
    endOfYear: (I) => {
      const z = u(I);
      return z.setMonth(11, 31), z;
    },
    eachMonthOfInterval: (I) => {
      const z = u(I.start), V = u(I.end), d = [], p = new uA(z.getFullYear(), z.getMonth(), 1, 12, 0, 0, A), E = V.getFullYear() * 12 + V.getMonth();
      for (; p.getFullYear() * 12 + p.getMonth() <= E; )
        d.push(new uA(p, A)), p.setMonth(p.getMonth() + 1, 1);
      return d;
    },
    // Normalize to noon once before arithmetic (avoid DST/midnight edge cases),
    // mutate the same TZDate, and return it.
    addDays: (I, z) => {
      const V = u(I);
      return V.setDate(V.getDate() + z), V;
    },
    addWeeks: (I, z) => {
      const V = u(I);
      return V.setDate(V.getDate() + z * 7), V;
    },
    addMonths: (I, z) => {
      const V = u(I);
      return V.setMonth(V.getMonth() + z), V;
    },
    addYears: (I, z) => {
      const V = u(I);
      return V.setFullYear(V.getFullYear() + z), V;
    },
    eachYearOfInterval: (I) => {
      const z = u(I.start), V = u(I.end), d = [], p = new uA(z.getFullYear(), 0, 1, 12, 0, 0, A);
      for (; p.getFullYear() <= V.getFullYear(); )
        d.push(new uA(p, A)), p.setFullYear(p.getFullYear() + 1, 0, 1);
      return d;
    },
    getWeek: (I, z) => {
      const V = a(I);
      return r3(V, {
        weekStartsOn: z?.weekStartsOn ?? e,
        firstWeekContainsDate: z?.firstWeekContainsDate ?? l?.options?.firstWeekContainsDate ?? 1
      });
    },
    getISOWeek: (I) => {
      const z = a(I);
      return t3(z);
    },
    differenceInCalendarDays: (I, z) => {
      const V = a(I), d = a(z);
      return A3(V, d);
    },
    differenceInCalendarMonths: (I, z) => {
      const V = a(I), d = a(z);
      return Nl(V, d);
    }
  };
}
const Qt = (A) => A instanceof HTMLElement ? A : null, mr = (A) => [
  ...A.querySelectorAll("[data-animated-month]") ?? []
], LI = (A) => Qt(A.querySelector("[data-animated-month]")), Mr = (A) => Qt(A.querySelector("[data-animated-caption]")), vr = (A) => Qt(A.querySelector("[data-animated-weeks]")), wI = (A) => Qt(A.querySelector("[data-animated-nav]")), JI = (A) => Qt(A.querySelector("[data-animated-weekdays]"));
function DI(A, t, { classNames: r, months: l, focused: e, dateLib: u }) {
  const a = hA(null), I = hA(l), z = hA(!1);
  e7(() => {
    const V = I.current;
    if (I.current = l, !t || !A.current || // safety check because the ref can be set to anything by consumers
    !(A.current instanceof HTMLElement) || // validation required for the animation to work as expected
    l.length === 0 || V.length === 0 || l.length !== V.length)
      return;
    const d = u.isSameMonth(l[0].date, V[0].date), p = u.isAfter(l[0].date, V[0].date), E = p ? r[IA.caption_after_enter] : r[IA.caption_before_enter], q = p ? r[IA.weeks_after_enter] : r[IA.weeks_before_enter], m = a.current, v = A.current.cloneNode(!0);
    if (v instanceof HTMLElement ? (mr(v).forEach((C) => {
      if (!(C instanceof HTMLElement))
        return;
      const Z = LI(C);
      Z && C.contains(Z) && C.removeChild(Z);
      const b = Mr(C);
      b && b.classList.remove(E);
      const U = vr(C);
      U && U.classList.remove(q);
    }), a.current = v) : a.current = null, z.current || d || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    e)
      return;
    const c = m instanceof HTMLElement ? mr(m) : [], M = mr(A.current);
    if (M?.every((W) => W instanceof HTMLElement) && c && c.every((W) => W instanceof HTMLElement)) {
      z.current = !0, A.current.style.isolation = "isolate";
      const W = wI(A.current);
      W && (W.style.zIndex = "1"), M.forEach((C, Z) => {
        const b = c[Z];
        if (!b)
          return;
        C.style.position = "relative", C.style.overflow = "hidden";
        const U = Mr(C);
        U && U.classList.add(E);
        const f = vr(C);
        f && f.classList.add(q);
        const h = () => {
          z.current = !1, A.current && (A.current.style.isolation = ""), W && (W.style.zIndex = ""), U && U.classList.remove(E), f && f.classList.remove(q), C.style.position = "", C.style.overflow = "", C.contains(b) && C.removeChild(b);
        };
        b.style.pointerEvents = "none", b.style.position = "absolute", b.style.overflow = "hidden", b.setAttribute("aria-hidden", "true");
        const K = JI(b);
        K && (K.style.opacity = "0");
        const Q = Mr(b);
        Q && (Q.classList.add(p ? r[IA.caption_before_exit] : r[IA.caption_after_exit]), Q.addEventListener("animationend", h));
        const x = vr(b);
        x && x.classList.add(p ? r[IA.weeks_before_exit] : r[IA.weeks_after_exit]), C.insertBefore(b, C.firstChild);
      });
    }
  });
}
function HI(A, t, r, l) {
  const e = A[0], u = A[A.length - 1], { ISOWeek: a, fixedWeeks: I, broadcastCalendar: z } = r ?? {}, { addDays: V, differenceInCalendarDays: d, differenceInCalendarMonths: p, endOfBroadcastWeek: E, endOfISOWeek: q, endOfMonth: m, endOfWeek: v, isAfter: c, startOfBroadcastWeek: M, startOfISOWeek: W, startOfWeek: C } = l, Z = z ? M(e, l) : a ? W(e) : C(e), b = z ? E(u) : a ? q(m(u)) : v(m(u)), U = t && (z ? E(t) : a ? q(t) : v(t)), f = U && c(b, U) ? U : b, h = d(f, Z), K = p(u, e) + 1, Q = [];
  for (let O = 0; O <= h; O++) {
    const y = V(Z, O);
    Q.push(y);
  }
  const lA = (z ? 35 : 42) * K;
  if (I && Q.length < lA) {
    const O = lA - Q.length;
    for (let y = 0; y < O; y++) {
      const iA = V(Q[Q.length - 1], 1);
      Q.push(iA);
    }
  }
  return Q;
}
function _I(A) {
  const t = [];
  return A.reduce((r, l) => {
    const e = l.weeks.reduce((u, a) => u.concat(a.days.slice()), t.slice());
    return r.concat(e.slice());
  }, t.slice());
}
function $I(A, t, r, l) {
  const { numberOfMonths: e = 1 } = r, u = [];
  for (let a = 0; a < e; a++) {
    const I = l.addMonths(A, a);
    if (t && I > t)
      break;
    u.push(I);
  }
  return u;
}
function g3(A, t, r, l) {
  const { month: e, defaultMonth: u, today: a = l.today(), numberOfMonths: I = 1 } = A;
  let z = e || u || a;
  const { differenceInCalendarMonths: V, addMonths: d, startOfMonth: p } = l;
  if (r && V(r, z) < I - 1) {
    const E = -1 * (I - 1);
    z = d(r, E);
  }
  return t && V(z, t) < 0 && (z = t), p(z);
}
function Az(A, t, r, l) {
  const { addDays: e, endOfBroadcastWeek: u, endOfISOWeek: a, endOfMonth: I, endOfWeek: z, getISOWeek: V, getWeek: d, startOfBroadcastWeek: p, startOfISOWeek: E, startOfWeek: q } = l, m = A.reduce((v, c) => {
    const M = r.broadcastCalendar ? p(c, l) : r.ISOWeek ? E(c) : q(c), W = r.broadcastCalendar ? u(c) : r.ISOWeek ? a(I(c)) : z(I(c)), C = t.filter((f) => f >= M && f <= W), Z = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && C.length < Z) {
      const f = t.filter((h) => {
        const K = Z - C.length;
        return h > W && h <= e(W, K);
      });
      C.push(...f);
    }
    const b = C.reduce((f, h) => {
      const K = r.ISOWeek ? V(h) : d(h), Q = f.find((lA) => lA.weekNumber === K), x = new Jl(h, c, l);
      return Q ? Q.days.push(x) : f.push(new Dn(K, [x])), f;
    }, []), U = new Jn(c, b);
    return v.push(U), v;
  }, []);
  return r.reverseMonths ? m.reverse() : m;
}
function tz(A, t) {
  let { startMonth: r, endMonth: l } = A;
  const { startOfYear: e, startOfDay: u, startOfMonth: a, endOfMonth: I, addYears: z, endOfYear: V, newDate: d, today: p } = t, { fromYear: E, toYear: q, fromMonth: m, toMonth: v } = A;
  !r && m && (r = m), !r && E && (r = t.newDate(E, 0, 1)), !l && v && (l = v), !l && q && (l = d(q, 11, 31));
  const c = A.captionLayout === "dropdown" || A.captionLayout === "dropdown-years";
  return r ? r = a(r) : E ? r = d(E, 0, 1) : !r && c && (r = e(z(A.today ?? p(), -100))), l ? l = I(l) : q ? l = d(q, 11, 31) : !l && c && (l = V(A.today ?? p())), [
    r && u(r),
    l && u(l)
  ];
}
function rz(A, t, r, l) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: e, numberOfMonths: u = 1 } = r, { startOfMonth: a, addMonths: I, differenceInCalendarMonths: z } = l, V = e ? u : 1, d = a(A);
  if (!t)
    return I(d, V);
  if (!(z(t, A) < u))
    return I(d, V);
}
function lz(A, t, r, l) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: e, numberOfMonths: u } = r, { startOfMonth: a, addMonths: I, differenceInCalendarMonths: z } = l, V = e ? u ?? 1 : 1, d = a(A);
  if (!t)
    return I(d, -V);
  if (!(z(d, t) <= 0))
    return I(d, -V);
}
function ez(A) {
  const t = [];
  return A.reduce((r, l) => r.concat(l.weeks.slice()), t.slice());
}
function _t(A, t) {
  const [r, l] = $(A);
  return [t === void 0 ? r : t, l];
}
function uz(A, t) {
  const [r, l] = tz(A, t), { startOfMonth: e, endOfMonth: u } = t, a = g3(A, r, l, t), [I, z] = _t(
    a,
    // initialMonth is always computed from props.month if provided
    A.month ? a : void 0
  );
  CA(() => {
    const Z = g3(A, r, l, t);
    z(Z);
  }, [A.timeZone]);
  const { months: V, weeks: d, days: p, previousMonth: E, nextMonth: q } = FA(() => {
    const Z = $I(I, l, { numberOfMonths: A.numberOfMonths }, t), b = HI(Z, A.endMonth ? u(A.endMonth) : void 0, {
      ISOWeek: A.ISOWeek,
      fixedWeeks: A.fixedWeeks,
      broadcastCalendar: A.broadcastCalendar
    }, t), U = Az(Z, b, {
      broadcastCalendar: A.broadcastCalendar,
      fixedWeeks: A.fixedWeeks,
      ISOWeek: A.ISOWeek,
      reverseMonths: A.reverseMonths
    }, t), f = ez(U), h = _I(U), K = lz(I, r, A, t), Q = rz(I, l, A, t);
    return {
      months: U,
      weeks: f,
      days: h,
      previousMonth: K,
      nextMonth: Q
    };
  }, [
    t,
    I.getTime(),
    l?.getTime(),
    r?.getTime(),
    A.disableNavigation,
    A.broadcastCalendar,
    A.endMonth?.getTime(),
    A.fixedWeeks,
    A.ISOWeek,
    A.numberOfMonths,
    A.pagedNavigation,
    A.reverseMonths
  ]), { disableNavigation: m, onMonthChange: v } = A, c = (Z) => d.some((b) => b.days.some((U) => U.isEqualTo(Z))), M = (Z) => {
    if (m)
      return;
    let b = e(Z);
    r && b < e(r) && (b = e(r)), l && b > e(l) && (b = e(l)), z(b), v?.(b);
  };
  return {
    months: V,
    weeks: d,
    days: p,
    navStart: r,
    navEnd: l,
    previousMonth: E,
    nextMonth: q,
    goToMonth: M,
    goToDay: (Z) => {
      c(Z) || M(Z.date);
    }
  };
}
var WA;
(function(A) {
  A[A.Today = 0] = "Today", A[A.Selected = 1] = "Selected", A[A.LastFocused = 2] = "LastFocused", A[A.FocusedModifier = 3] = "FocusedModifier";
})(WA || (WA = {}));
function y3(A) {
  return !A[_.disabled] && !A[_.hidden] && !A[_.outside];
}
function az(A, t, r, l) {
  let e, u = -1;
  for (const a of A) {
    const I = t(a);
    y3(I) && (I[_.focused] && u < WA.FocusedModifier ? (e = a, u = WA.FocusedModifier) : l?.isEqualTo(a) && u < WA.LastFocused ? (e = a, u = WA.LastFocused) : r(a.date) && u < WA.Selected ? (e = a, u = WA.Selected) : I[_.today] && u < WA.Today && (e = a, u = WA.Today));
  }
  return e || (e = A.find((a) => y3(t(a)))), e;
}
function nz(A, t, r, l, e, u, a) {
  const { ISOWeek: I, broadcastCalendar: z } = u, { addDays: V, addMonths: d, addWeeks: p, addYears: E, endOfBroadcastWeek: q, endOfISOWeek: m, endOfWeek: v, max: c, min: M, startOfBroadcastWeek: W, startOfISOWeek: C, startOfWeek: Z } = a;
  let U = {
    day: V,
    week: p,
    month: d,
    year: E,
    startOfWeek: (f) => z ? W(f, a) : I ? C(f) : Z(f),
    endOfWeek: (f) => z ? q(f) : I ? m(f) : v(f)
  }[A](r, t === "after" ? 1 : -1);
  return t === "before" && l ? U = c([l, U]) : t === "after" && e && (U = M([e, U])), U;
}
function de(A, t, r, l, e, u, a, I = 0) {
  if (I > 365)
    return;
  const z = nz(A, t, r.date, l, e, u, a), V = !!(u.disabled && YA(z, u.disabled, a)), d = !!(u.hidden && YA(z, u.hidden, a)), p = z, E = new Jl(z, p, a);
  return !V && !d ? E : de(A, t, E, l, e, u, a, I + 1);
}
function Iz(A, t, r, l, e) {
  const { autoFocus: u } = A, [a, I] = $(), z = az(t.days, r, l || (() => !1), a), [V, d] = $(u ? z : void 0);
  return {
    isFocusTarget: (v) => !!z?.isEqualTo(v),
    setFocused: d,
    focused: V,
    blur: () => {
      I(V), d(void 0);
    },
    moveFocus: (v, c) => {
      if (!V)
        return;
      const M = de(v, c, V, t.navStart, t.navEnd, A, e);
      M && (A.disableNavigation && !t.days.some((C) => C.isEqualTo(M)) || (t.goToDay(M), d(M)));
    }
  };
}
function zz(A, t) {
  const { selected: r, required: l, onSelect: e } = A, [u, a] = _t(r, e ? r : void 0), I = e ? r : u, { isSameDay: z } = t, V = (q) => I?.some((m) => z(m, q)) ?? !1, { min: d, max: p } = A;
  return {
    selected: I,
    select: (q, m, v) => {
      let c = [...I ?? []];
      if (V(q)) {
        if (I?.length === d || l && I?.length === 1)
          return;
        c = I?.filter((M) => !z(M, q));
      } else
        I?.length === p ? c = [q] : c = [...c, q];
      return e || a(c), e?.(c, q, m, v), c;
    },
    isSelected: V
  };
}
function dz(A, t, r = 0, l = 0, e = !1, u = QA) {
  const { from: a, to: I } = t || {}, { isSameDay: z, isAfter: V, isBefore: d } = u;
  let p;
  if (!a && !I)
    p = { from: A, to: r > 0 ? void 0 : A };
  else if (a && !I)
    z(a, A) ? r === 0 ? p = { from: a, to: A } : e ? p = { from: a, to: void 0 } : p = void 0 : d(A, a) ? p = { from: A, to: a } : p = { from: a, to: A };
  else if (a && I)
    if (z(a, A) && z(I, A))
      e ? p = { from: a, to: I } : p = void 0;
    else if (z(a, A))
      p = { from: a, to: r > 0 ? void 0 : A };
    else if (z(I, A))
      p = { from: A, to: r > 0 ? void 0 : A };
    else if (d(A, a))
      p = { from: A, to: I };
    else if (V(A, a))
      p = { from: a, to: A };
    else if (V(A, I))
      p = { from: a, to: A };
    else
      throw new Error("Invalid range");
  if (p?.from && p?.to) {
    const E = u.differenceInCalendarDays(p.to, p.from);
    l > 0 && E > l ? p = { from: A, to: void 0 } : r > 1 && E < r && (p = { from: A, to: void 0 });
  }
  return p;
}
function Vz(A, t, r = QA) {
  const l = Array.isArray(t) ? t : [t];
  let e = A.from;
  const u = r.differenceInCalendarDays(A.to, A.from), a = Math.min(u, 6);
  for (let I = 0; I <= a; I++) {
    if (l.includes(e.getDay()))
      return !0;
    e = r.addDays(e, 1);
  }
  return !1;
}
function N3(A, t, r = QA) {
  return XA(A, t.from, !1, r) || XA(A, t.to, !1, r) || XA(t, A.from, !1, r) || XA(t, A.to, !1, r);
}
function Ez(A, t, r = QA) {
  const l = Array.isArray(t) ? t : [t];
  if (l.filter((I) => typeof I != "function").some((I) => typeof I == "boolean" ? I : r.isDate(I) ? XA(A, I, !1, r) : _l(I, r) ? I.some((z) => XA(A, z, !1, r)) : Ht(I) ? I.from && I.to ? N3(A, { from: I.from, to: I.to }, r) : !1 : Hl(I) ? Vz(A, I.dayOfWeek, r) : l3(I) ? r.isAfter(I.before, I.after) ? N3(A, {
    from: r.addDays(I.after, 1),
    to: r.addDays(I.before, -1)
  }, r) : YA(A.from, I, r) || YA(A.to, I, r) : e3(I) || u3(I) ? YA(A.from, I, r) || YA(A.to, I, r) : !1))
    return !0;
  const a = l.filter((I) => typeof I == "function");
  if (a.length) {
    let I = A.from;
    const z = r.differenceInCalendarDays(A.to, A.from);
    for (let V = 0; V <= z; V++) {
      if (a.some((d) => d(I)))
        return !0;
      I = r.addDays(I, 1);
    }
  }
  return !1;
}
function pz(A, t) {
  const { disabled: r, excludeDisabled: l, selected: e, required: u, onSelect: a } = A, [I, z] = _t(e, a ? e : void 0), V = a ? e : I;
  return {
    selected: V,
    select: (E, q, m) => {
      const { min: v, max: c } = A, M = E ? dz(E, V, v, c, u, t) : void 0;
      return l && r && M?.from && M.to && Ez({ from: M.from, to: M.to }, r, t) && (M.from = E, M.to = void 0), a || z(M), a?.(M, E, q, m), M;
    },
    isSelected: (E) => V && XA(V, E, !1, t)
  };
}
function iz(A, t) {
  const { selected: r, required: l, onSelect: e } = A, [u, a] = _t(r, e ? r : void 0), I = e ? r : u, { isSameDay: z } = t;
  return {
    selected: I,
    select: (p, E, q) => {
      let m = p;
      return !l && I && I && z(p, I) && (m = void 0), e || a(m), e?.(m, p, E, q), m;
    },
    isSelected: (p) => I ? z(I, p) : !1
  };
}
function qz(A, t) {
  const r = iz(A, t), l = zz(A, t), e = pz(A, t);
  switch (A.mode) {
    case "single":
      return r;
    case "multiple":
      return l;
    case "range":
      return e;
    default:
      return;
  }
}
function pA(A, t) {
  return A instanceof uA && A.timeZone === t ? A : new uA(A, t);
}
function tt(A, t, r) {
  return pA(A, t);
}
function F3(A, t, r) {
  return typeof A == "boolean" || typeof A == "function" ? A : A instanceof Date ? tt(A, t) : Array.isArray(A) ? A.map((l) => l instanceof Date ? tt(l, t) : l) : Ht(A) ? {
    ...A,
    from: A.from ? pA(A.from, t) : A.from,
    to: A.to ? pA(A.to, t) : A.to
  } : l3(A) ? {
    before: tt(A.before, t),
    after: tt(A.after, t)
  } : e3(A) ? {
    after: tt(A.after, t)
  } : u3(A) ? {
    before: tt(A.before, t)
  } : A;
}
function cr(A, t, r) {
  return A && (Array.isArray(A) ? A.map((l) => F3(l, t)) : F3(A, t));
}
function mz(A) {
  let t = A;
  const r = t.timeZone;
  if (r && (t = {
    ...A,
    timeZone: r
  }, t.today && (t.today = pA(t.today, r)), t.month && (t.month = pA(t.month, r)), t.defaultMonth && (t.defaultMonth = pA(t.defaultMonth, r)), t.startMonth && (t.startMonth = pA(t.startMonth, r)), t.endMonth && (t.endMonth = pA(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = pA(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((R) => pA(R, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? pA(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? pA(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = cr(t.disabled, r)), t.hidden !== void 0 && (t.hidden = cr(t.hidden, r)), t.modifiers)) {
    const R = {};
    Object.keys(t.modifiers).forEach((F) => {
      R[F] = cr(t.modifiers?.[F], r);
    }), t.modifiers = R;
  }
  const { components: l, formatters: e, labels: u, dateLib: a, locale: I, classNames: z } = FA(() => {
    const R = { ...wl, ...t.locale }, F = t.broadcastCalendar ? 1 : t.weekStartsOn, o = t.noonSafe && t.timeZone ? kI(t.timeZone, {
      weekStartsOn: F,
      locale: R
    }) : void 0, N = t.dateLib && o ? { ...o, ...t.dateLib } : t.dateLib ?? o, aA = new dA({
      locale: R,
      weekStartsOn: F,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, N);
    return {
      dateLib: aA,
      components: hI(t.components),
      formatters: RI(t.formatters),
      labels: NI(t.labels, aA.options),
      locale: R,
      classNames: { ...a3(), ...t.classNames }
    };
  }, [
    t.locale,
    t.broadcastCalendar,
    t.weekStartsOn,
    t.firstWeekContainsDate,
    t.useAdditionalWeekYearTokens,
    t.useAdditionalDayOfYearTokens,
    t.timeZone,
    t.numerals,
    t.dateLib,
    t.noonSafe,
    t.components,
    t.formatters,
    t.labels,
    t.classNames
  ]);
  t.today || (t = { ...t, today: a.today() });
  const { captionLayout: V, mode: d, navLayout: p, numberOfMonths: E = 1, onDayBlur: q, onDayClick: m, onDayFocus: v, onDayKeyDown: c, onDayMouseEnter: M, onDayMouseLeave: W, onNextClick: C, onPrevClick: Z, showWeekNumber: b, styles: U } = t, { formatCaption: f, formatDay: h, formatMonthDropdown: K, formatWeekNumber: Q, formatWeekNumberHeader: x, formatWeekdayName: lA, formatYearDropdown: O } = e, y = uz(t, a), { days: iA, months: jA, navStart: SA, navEnd: lr, previousMonth: qA, nextMonth: mA, goToMonth: sA } = y, er = bI(iA, t, SA, lr, a), { isSelected: ur, select: ar, selected: St } = qz(t, a) ?? {}, { blur: M3, focused: v3, isFocusTarget: xe, moveFocus: c3, setFocused: st } = Iz(t, y, er, ur ?? (() => !1), a), { labelDayButton: Xe, labelGridcell: Ye, labelGrid: Ge, labelMonthDropdown: oe, labelNav: W3, labelPrevious: Re, labelNext: je, labelWeekday: Oe, labelWeekNumber: ge, labelWeekNumberHeader: ye, labelYearDropdown: Ne } = u, Fe = FA(() => TI(a, t.ISOWeek, t.broadcastCalendar, t.today), [a, t.ISOWeek, t.broadcastCalendar, t.today]), Z3 = d !== void 0 || m !== void 0, nr = EA(() => {
    qA && (sA(qA), Z?.(qA));
  }, [qA, sA, Z]), Ir = EA(() => {
    mA && (sA(mA), C?.(mA));
  }, [sA, mA, C]), Be = EA((R, F) => (o) => {
    o.preventDefault(), o.stopPropagation(), st(R), !F.disabled && (ar?.(R.date, F, o), m?.(R.date, F, o));
  }, [ar, m, st]), Te = EA((R, F) => (o) => {
    st(R), v?.(R.date, F, o);
  }, [v, st]), Pe = EA((R, F) => (o) => {
    M3(), q?.(R.date, F, o);
  }, [M3, q]), ke = EA((R, F) => (o) => {
    const N = {
      ArrowLeft: [
        o.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        o.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [o.shiftKey ? "year" : "week", "after"],
      ArrowUp: [o.shiftKey ? "year" : "week", "before"],
      PageUp: [o.shiftKey ? "year" : "month", "before"],
      PageDown: [o.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (N[o.key]) {
      o.preventDefault(), o.stopPropagation();
      const [aA, g] = N[o.key];
      c3(aA, g);
    }
    c?.(R.date, F, o);
  }, [c3, c, t.dir]), Le = EA((R, F) => (o) => {
    M?.(R.date, F, o);
  }, [M]), we = EA((R, F) => (o) => {
    W?.(R.date, F, o);
  }, [W]), Je = EA((R) => (F) => {
    const o = Number(F.target.value), N = a.setMonth(a.startOfMonth(R), o);
    sA(N);
  }, [a, sA]), De = EA((R) => (F) => {
    const o = Number(F.target.value), N = a.setYear(a.startOfMonth(R), o);
    sA(N);
  }, [a, sA]), { className: He, style: _e } = FA(() => ({
    className: [z[s.Root], t.className].filter(Boolean).join(" "),
    style: { ...U?.[s.Root], ...t.style }
  }), [z, t.className, t.style, U]), $e = KI(t), C3 = hA(null);
  DI(C3, !!t.animate, {
    classNames: z,
    months: jA,
    focused: v3,
    dateLib: a
  });
  const A7 = {
    dayPickerProps: t,
    selected: St,
    select: ar,
    isSelected: ur,
    months: jA,
    nextMonth: mA,
    previousMonth: qA,
    goToMonth: sA,
    getModifiers: er,
    components: l,
    classNames: z,
    styles: U,
    labels: u,
    formatters: e
  };
  return S.createElement(
    Dl.Provider,
    { value: A7 },
    S.createElement(
      l.Root,
      { rootRef: t.animate ? C3 : void 0, className: He, style: _e, dir: t.dir, id: t.id, lang: t.lang, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...$e },
      S.createElement(
        l.Months,
        { className: z[s.Months], style: U?.[s.Months] },
        !t.hideNavigation && !p && S.createElement(l.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: z[s.Nav], style: U?.[s.Nav], "aria-label": W3(), onPreviousClick: nr, onNextClick: Ir, previousMonth: qA, nextMonth: mA }),
        jA.map((R, F) => S.createElement(
          l.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: z[s.Month],
            style: U?.[s.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: F,
            displayIndex: F,
            calendarMonth: R
          },
          p === "around" && !t.hideNavigation && F === 0 && S.createElement(
            l.PreviousMonthButton,
            { type: "button", className: z[s.PreviousMonthButton], tabIndex: qA ? void 0 : -1, "aria-disabled": qA ? void 0 : !0, "aria-label": Re(qA), onClick: nr, "data-animated-button": t.animate ? "true" : void 0 },
            S.createElement(l.Chevron, { disabled: qA ? void 0 : !0, className: z[s.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          S.createElement(l.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: z[s.MonthCaption], style: U?.[s.MonthCaption], calendarMonth: R, displayIndex: F }, V?.startsWith("dropdown") ? S.createElement(
            l.DropdownNav,
            { className: z[s.Dropdowns], style: U?.[s.Dropdowns] },
            (() => {
              const o = V === "dropdown" || V === "dropdown-months" ? S.createElement(l.MonthsDropdown, { key: "month", className: z[s.MonthsDropdown], "aria-label": oe(), classNames: z, components: l, disabled: !!t.disableNavigation, onChange: Je(R.date), options: FI(R.date, SA, lr, e, a), style: U?.[s.Dropdown], value: a.getMonth(R.date) }) : S.createElement("span", { key: "month" }, K(R.date, a)), N = V === "dropdown" || V === "dropdown-years" ? S.createElement(l.YearsDropdown, { key: "year", className: z[s.YearsDropdown], "aria-label": Ne(a.options), classNames: z, components: l, disabled: !!t.disableNavigation, onChange: De(R.date), options: PI(SA, lr, e, a, !!t.reverseYears), style: U?.[s.Dropdown], value: a.getYear(R.date) }) : S.createElement("span", { key: "year" }, O(R.date, a));
              return a.getMonthYearOrder() === "year-first" ? [N, o] : [o, N];
            })(),
            S.createElement("span", { role: "status", "aria-live": "polite", style: {
              border: 0,
              clip: "rect(0 0 0 0)",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: "1px",
              whiteSpace: "nowrap",
              wordWrap: "normal"
            } }, f(R.date, a.options, a))
          ) : S.createElement(l.CaptionLabel, { className: z[s.CaptionLabel], role: "status", "aria-live": "polite" }, f(R.date, a.options, a))),
          p === "around" && !t.hideNavigation && F === E - 1 && S.createElement(
            l.NextMonthButton,
            { type: "button", className: z[s.NextMonthButton], tabIndex: mA ? void 0 : -1, "aria-disabled": mA ? void 0 : !0, "aria-label": je(mA), onClick: Ir, "data-animated-button": t.animate ? "true" : void 0 },
            S.createElement(l.Chevron, { disabled: mA ? void 0 : !0, className: z[s.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          F === E - 1 && p === "after" && !t.hideNavigation && S.createElement(l.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: z[s.Nav], style: U?.[s.Nav], "aria-label": W3(), onPreviousClick: nr, onNextClick: Ir, previousMonth: qA, nextMonth: mA }),
          S.createElement(
            l.MonthGrid,
            { role: "grid", "aria-multiselectable": d === "multiple" || d === "range", "aria-label": Ge(R.date, a.options, a) || void 0, className: z[s.MonthGrid], style: U?.[s.MonthGrid] },
            !t.hideWeekdays && S.createElement(
              l.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: z[s.Weekdays], style: U?.[s.Weekdays] },
              b && S.createElement(l.WeekNumberHeader, { "aria-label": ye(a.options), className: z[s.WeekNumberHeader], style: U?.[s.WeekNumberHeader], scope: "col" }, x()),
              Fe.map((o) => S.createElement(l.Weekday, { "aria-label": Oe(o, a.options, a), className: z[s.Weekday], key: String(o), style: U?.[s.Weekday], scope: "col" }, lA(o, a.options, a)))
            ),
            S.createElement(l.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: z[s.Weeks], style: U?.[s.Weeks] }, R.weeks.map((o) => S.createElement(
              l.Week,
              { className: z[s.Week], key: o.weekNumber, style: U?.[s.Week], week: o },
              b && S.createElement(l.WeekNumber, { week: o, style: U?.[s.WeekNumber], "aria-label": ge(o.weekNumber, {
                locale: I
              }), className: z[s.WeekNumber], scope: "row", role: "rowheader" }, Q(o.weekNumber, a)),
              o.days.map((N) => {
                const { date: aA } = N, g = er(N);
                if (g[_.focused] = !g.hidden && !!v3?.isEqualTo(N), g[vA.selected] = ur?.(aA) || g.selected, Ht(St)) {
                  const { from: zr, to: dr } = St;
                  g[vA.range_start] = !!(zr && dr && a.isSameDay(aA, zr)), g[vA.range_end] = !!(zr && dr && a.isSameDay(aA, dr)), g[vA.range_middle] = XA(St, aA, !0, a);
                }
                const t7 = BI(g, U, t.modifiersStyles), r7 = UI(g, z, t.modifiersClassNames), l7 = !Z3 && !g.hidden ? Ye(aA, g, a.options, a) : void 0;
                return S.createElement(l.Day, { key: `${N.isoDate}_${N.displayMonthId}`, day: N, modifiers: g, className: r7.join(" "), style: t7, role: "gridcell", "aria-selected": g.selected || void 0, "aria-label": l7, "data-day": N.isoDate, "data-month": N.outside ? N.dateMonthId : void 0, "data-selected": g.selected || void 0, "data-disabled": g.disabled || void 0, "data-hidden": g.hidden || void 0, "data-outside": N.outside || void 0, "data-focused": g.focused || void 0, "data-today": g.today || void 0 }, !g.hidden && Z3 ? S.createElement(l.DayButton, { className: z[s.DayButton], style: U?.[s.DayButton], type: "button", day: N, modifiers: g, disabled: !g.focused && g.disabled || void 0, "aria-disabled": g.focused && g.disabled || void 0, tabIndex: xe(N) ? 0 : -1, "aria-label": Xe(aA, g, a.options, a), onClick: Be(N, g), onBlur: Pe(N, g), onFocus: Te(N, g), onKeyDown: ke(N, g), onMouseEnter: Le(N, g), onMouseLeave: we(N, g) }, h(aA, a.options, a)) : !g.hidden && h(N.date, a.options, a));
              })
            )))
          )
        ))
      ),
      t.footer && S.createElement(l.Footer, { className: z[s.Footer], style: U?.[s.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
function Mz({
  className: A,
  classNames: t,
  showOutsideDays: r = !0,
  captionLayout: l = "label",
  buttonVariant: e = "ghost",
  locale: u = tn,
  formatters: a,
  components: I,
  ...z
}) {
  const V = a3();
  return /* @__PURE__ */ n(
    mz,
    {
      showOutsideDays: r,
      className: X(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        A
      ),
      captionLayout: l,
      locale: u,
      formatters: {
        formatMonthDropdown: (d) => d.toLocaleString("default", { month: "short" }),
        ...a
      },
      classNames: {
        root: X("w-fit", V.root),
        months: X(
          "flex gap-4 flex-col md:flex-row relative",
          V.months
        ),
        month: X(
          "flex flex-col w-full gap-4",
          V.month
        ),
        nav: X(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          V.nav
        ),
        button_previous: X(
          f3({ variant: e }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          V.button_previous
        ),
        button_next: X(
          f3({ variant: e }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          V.button_next
        ),
        month_caption: X(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          V.month_caption
        ),
        dropdowns: X(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          V.dropdowns
        ),
        dropdown_root: X(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          V.dropdown_root
        ),
        dropdown: X(
          "absolute bg-popover inset-0 opacity-0",
          V.dropdown
        ),
        caption_label: X(
          "select-none font-medium",
          l === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          V.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: X("flex", V.weekdays),
        weekday: X(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          V.weekday
        ),
        week: X("flex w-full mt-2", V.week),
        week_number_header: X(
          "select-none w-(--cell-size)",
          V.week_number_header
        ),
        week_number: X(
          "text-[0.8rem] select-none text-muted-foreground",
          V.week_number
        ),
        day: X(
          "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          z.showWeekNumber ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md" : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          V.day
        ),
        range_start: X(
          "rounded-l-md bg-accent",
          V.range_start
        ),
        range_middle: X(
          "rounded-none",
          V.range_middle
        ),
        range_end: X(
          "rounded-r-md bg-accent",
          V.range_end
        ),
        today: X(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          V.today
        ),
        outside: X(
          "text-muted-foreground aria-selected:text-muted-foreground",
          V.outside
        ),
        disabled: X(
          "text-muted-foreground opacity-50",
          V.disabled
        ),
        hidden: X("invisible", V.hidden),
        ...t
      },
      components: {
        Root: ({ className: d, rootRef: p, ...E }) => /* @__PURE__ */ n(
          "div",
          {
            "data-slot": "calendar",
            ref: p,
            className: X(d),
            ...E
          }
        ),
        Chevron: ({ className: d, orientation: p, ...E }) => p === "left" ? /* @__PURE__ */ n(
          Vl,
          {
            className: X("size-4", d),
            ...E
          }
        ) : p === "right" ? /* @__PURE__ */ n(
          nt,
          {
            className: X("size-4", d),
            ...E
          }
        ) : /* @__PURE__ */ n(
          Lr,
          {
            className: X("size-4", d),
            ...E
          }
        ),
        DayButton: vz,
        WeekNumber: ({ children: d, ...p }) => /* @__PURE__ */ n("td", { ...p, children: /* @__PURE__ */ n("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children: d }) }),
        ...I
      },
      ...z
    }
  );
}
function vz({
  className: A,
  day: t,
  modifiers: r,
  ...l
}) {
  const e = a3(), u = GA.useRef(null);
  return GA.useEffect(() => {
    r.focused && u.current?.focus();
  }, [r.focused]), /* @__PURE__ */ n(
    T,
    {
      ref: u,
      variant: "ghost",
      size: "icon",
      "data-day": t.date.toLocaleDateString(),
      "data-selected-single": r.selected && !r.range_start && !r.range_end && !r.range_middle,
      "data-range-start": r.range_start,
      "data-range-end": r.range_end,
      "data-range-middle": r.range_middle,
      className: X(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        e.day,
        A
      ),
      ...l
    }
  );
}
function cz({ value: A, onChange: t, dateOnly: r, ...l }) {
  const e = RA(), u = A ? new Date(A) : void 0, a = u && Number.isFinite(u.getTime()) ? u : void 0;
  return /* @__PURE__ */ i("div", { className: "flex min-w-0 items-center gap-2", children: [
    /* @__PURE__ */ n(
      JA,
      {
        ...l,
        type: "text",
        value: A.replace("T", " "),
        placeholder: l.placeholder ?? (r ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"),
        onChange: (I) => t(I.target.value.replace(" ", "T"))
      }
    ),
    /* @__PURE__ */ i(Il, { children: [
      /* @__PURE__ */ n(zl, { asChild: !0, children: /* @__PURE__ */ n(
        T,
        {
          type: "button",
          variant: "outline",
          size: "icon",
          disabled: l.disabled,
          "aria-label": "选择日期",
          children: /* @__PURE__ */ n(nu, {})
        }
      ) }),
      /* @__PURE__ */ i(
        dl,
        {
          container: e,
          className: "w-auto",
          align: "end",
          children: [
            /* @__PURE__ */ n(
              Mz,
              {
                mode: "single",
                selected: a,
                defaultMonth: a,
                onSelect: (I) => {
                  if (!I) return;
                  const z = `${I.getFullYear()}-${String(I.getMonth() + 1).padStart(2, "0")}-${String(I.getDate()).padStart(2, "0")}`;
                  t(
                    r ? z : `${z}T${/^\d{2}:\d{2}$/.test(A.split("T")[1] ?? "") ? A.split("T")[1] : "00:00"}`
                  );
                }
              }
            ),
            !r && /* @__PURE__ */ n(
              JA,
              {
                "aria-label": "时间",
                type: "time",
                value: A.split("T")[1] ?? "",
                disabled: !a,
                onChange: (I) => t(
                  `${A.split("T")[0]}T${I.target.value}`
                )
              }
            )
          ]
        }
      )
    ] })
  ] });
}
function Ve(A, t) {
  const [r, l] = $(), e = r?.source === A && r.key === t;
  return r && !e && l(void 0), {
    value: e ? r.value : A,
    set: (u, a = A) => l({ source: a, key: t, value: u }),
    clear: () => l(void 0)
  };
}
function z3({
  kind: A,
  value: t,
  onChange: r,
  options: l,
  suffix: e,
  clearable: u = !0,
  ...a
}) {
  const I = RA(), z = Ve(
    String(t ?? ""),
    JSON.stringify([a.id, A])
  ), V = a.disabled || a.readOnly;
  return A === "switch" ? /* @__PURE__ */ n(
    El,
    {
      ...a,
      disabled: V,
      checked: t === !0,
      onCheckedChange: r
    }
  ) : A === "cascader" ? /* @__PURE__ */ n(
    Pu,
    {
      ...a,
      disabled: V,
      options: l,
      value: Array.isArray(t) ? t.map(String) : [],
      onChange: r,
      clearable: u
    }
  ) : A === "datetime" || A === "date" ? /* @__PURE__ */ n(
    cz,
    {
      dateOnly: A === "date",
      ...a,
      disabled: V,
      value: String(t ?? ""),
      onChange: r
    }
  ) : A === "select" ? /* @__PURE__ */ i(
    Wt,
    {
      disabled: V,
      clearable: u,
      value: String(t ?? ""),
      onValueChange: r,
      children: [
        /* @__PURE__ */ n(
          Zt,
          {
            ...a,
            disabled: V,
            className: "w-full",
            children: /* @__PURE__ */ n(Ct, { placeholder: a.placeholder ?? "请选择", children: t !== "" && t != null ? /* @__PURE__ */ n(
              L,
              {
                text: l.find(
                  (d) => d.value === String(t)
                )?.label ?? String(t)
              }
            ) : void 0 })
          }
        ),
        /* @__PURE__ */ n(ft, { portalContainer: I, children: l.filter((d) => d.value !== "").map((d) => /* @__PURE__ */ n(
          bt,
          {
            value: d.value,
            disabled: d.disabled,
            children: /* @__PURE__ */ n(L, { text: d.label })
          },
          d.value
        )) })
      ]
    }
  ) : A === "choice" ? /* @__PURE__ */ n(
    Z7,
    {
      id: a.id,
      "aria-label": a["aria-label"],
      "aria-describedby": a["aria-describedby"],
      "aria-required": a["aria-required"],
      "aria-invalid": a["aria-invalid"],
      disabled: V,
      value: String(t ?? ""),
      onValueChange: r,
      children: l.map((d, p) => /* @__PURE__ */ i(
        "div",
        {
          className: "flex min-w-0 items-center gap-2",
          children: [
            /* @__PURE__ */ n(
              C7,
              {
                id: `${a.id}-${p}`,
                value: d.value,
                disabled: V || d.disabled
              }
            ),
            /* @__PURE__ */ n(Rr, { htmlFor: `${a.id}-${p}`, children: /* @__PURE__ */ n(L, { text: d.label }) })
          ]
        },
        d.value
      ))
    }
  ) : A === "checkboxes" ? /* @__PURE__ */ n(
    "div",
    {
      role: "group",
      id: a.id,
      "aria-label": a["aria-label"],
      "aria-describedby": a["aria-describedby"],
      className: "flex flex-wrap gap-4",
      children: l.map((d, p) => /* @__PURE__ */ i(
        "div",
        {
          className: "flex min-w-0 items-center gap-2",
          children: [
            /* @__PURE__ */ n(
              qt,
              {
                id: `${a.id}-${p}`,
                disabled: V || d.disabled,
                checked: Array.isArray(t) && t.includes(d.value),
                onCheckedChange: (E) => {
                  const q = Array.isArray(t) ? t : [];
                  r(
                    E ? [
                      ...q.filter(
                        (m) => m !== d.value
                      ),
                      d.value
                    ] : q.filter(
                      (m) => m !== d.value
                    )
                  );
                }
              }
            ),
            /* @__PURE__ */ n(Rr, { htmlFor: `${a.id}-${p}`, children: /* @__PURE__ */ n(L, { text: d.label }) })
          ]
        },
        d.value
      ))
    }
  ) : /* @__PURE__ */ i(f7, { children: [
    /* @__PURE__ */ n(
      b7,
      {
        ...a,
        type: "text",
        inputMode: A === "number" ? "decimal" : "text",
        value: z.value,
        onBlur: () => {
          z.clear(), a.onBlur?.();
        },
        onChange: (d) => {
          if (V) return;
          const p = d.target.value, E = A === "number" && /^-?\d+(\.\d+)?$/.test(p) ? Number(p) : p;
          r(E), A === "number" && z.set(p, String(E));
        }
      }
    ),
    e && /* @__PURE__ */ n(U7, { align: "inline-end", children: /* @__PURE__ */ n(h7, { children: e }) })
  ] });
}
const It = [
  { label: "选项一", value: "option-1" },
  { label: "选项二", value: "option-2" }
], Wz = {
  text: "文本输入",
  number: "数字输入",
  textarea: "多行输入",
  select: "下拉选择",
  switch: "开关",
  choice: "单选组",
  checkboxes: "多选组",
  cascader: "级联选择",
  datetime: "日期时间",
  date: "日期"
};
function d3(A) {
  return { type: "string", label: Wz[A] };
}
function $t(A, t = It) {
  const r = t.find((l) => !l.disabled);
  if (A === "number") return 100;
  if (A === "switch") return !0;
  if (A === "select" || A === "choice") return r?.value ?? "";
  if (A === "checkboxes") return r ? [r.value] : [];
  if (A === "cascader") {
    const l = [];
    let e = r;
    for (; e; )
      l.push(e.value), e = e.children?.find((u) => !u.disabled);
    return l;
  }
  return A === "datetime" ? "2026-01-11T10:30" : A === "date" ? "2026-01-11" : A === "textarea" ? "这是一段示例内容，可在绑定字段后展示实际数据。" : "示例文本";
}
const Ar = {
  visible: !0,
  disabled: !0,
  required: !1,
  error: void 0
};
function Ee({
  field: A,
  value: t,
  onChange: r,
  placeholder: l,
  ...e
}) {
  const u = k(), a = RA(), I = A.optionsSource?.from === "source" ? A.optionsSource.sourceId : void 0, z = I ? u.state.sources[I] : void 0, V = (u.options(A.id) ?? []).filter(Zl).map((E) => ({
    label: String(E.label ?? E.value ?? ""),
    value: String(E.value ?? ""),
    rawValue: E.value,
    disabled: Bt(E.disabled),
    hidden: Bt(E.hidden),
    description: E.description == null ? void 0 : String(E.description)
  })), d = V.filter((E) => !E.hidden), p = V.find((E) => E.value === t);
  return /* @__PURE__ */ i(AA, { children: [
    /* @__PURE__ */ i(
      Wt,
      {
        clearable: A.clearable !== !1 && !A.readOnly,
        value: t,
        onValueChange: (E) => {
          !A.readOnly && (E === "" || d.some(
            (q) => q.value === E && !q.disabled
          )) && r(
            E === "" ? "" : d.find(
              (q) => q.value === E
            ).rawValue
          );
        },
        disabled: e.disabled || A.readOnly || z?.status === "loading",
        children: [
          /* @__PURE__ */ n(Zt, { ...e, className: "w-full", children: /* @__PURE__ */ n(Ct, { placeholder: l ?? "请选择", children: t ? /* @__PURE__ */ n(L, { text: p?.label ?? t }) : void 0 }) }),
          /* @__PURE__ */ n(ft, { portalContainer: a, children: d.map((E) => /* @__PURE__ */ i(
            bt,
            {
              value: E.value,
              disabled: E.disabled,
              children: [
                /* @__PURE__ */ n(L, { text: E.label }),
                E.description && /* @__PURE__ */ n("span", { className: "block whitespace-normal break-words", children: E.description })
              ]
            },
            E.value
          )) })
        ]
      }
    ),
    z?.status === "loading" && /* @__PURE__ */ n(BA, { role: "status", children: "正在加载选项…" }),
    z?.status === "error" && /* @__PURE__ */ i(KA, { children: [
      z.error,
      /* @__PURE__ */ n(
        T,
        {
          type: "button",
          variant: "link",
          onClick: () => {
            I && u.runSource(I).catch(() => {
            });
          },
          children: "重试"
        }
      )
    ] }),
    z?.status !== "loading" && z?.status !== "error" && d.length === 0 && /* @__PURE__ */ n(BA, { children: "暂无选项" })
  ] });
}
function xt({
  fieldId: A,
  placeholder: t,
  rows: r = 3,
  step: l = 1,
  kind: e
}) {
  const u = k(), a = zt(), I = u.definition.logic.fields[A], z = u.mode === "design" && !I, V = I ?? (z ? d3(e) : void 0);
  if (!V) return /* @__PURE__ */ n(KA, { children: "请关联字段定义" });
  const d = z ? Ar : u.fieldStatus(A);
  if (!d.visible && u.mode !== "design") return null;
  const p = z ? $t(e) : u.getField(A), E = d.disabled || u.mode === "design" || e === "switch" && V.readOnly === !0, q = {
    id: a,
    disabled: E,
    "aria-invalid": !!d.error,
    "aria-describedby": [
      V.description ? `${a}-description` : "",
      d.error ? `${a}-error` : ""
    ].filter(Boolean).join(" ") || void 0,
    "aria-required": d.required
  };
  let m;
  return e === "switch" ? m = /* @__PURE__ */ n("div", { className: "flex items-center", children: /* @__PURE__ */ n(
    El,
    {
      ...q,
      checked: p === !0,
      onCheckedChange: (v) => u.setField(A, v)
    }
  ) }) : e === "select" && z ? m = /* @__PURE__ */ n(
    z3,
    {
      ...q,
      kind: "select",
      value: p,
      options: It,
      onChange: () => {
      }
    }
  ) : e === "select" ? m = /* @__PURE__ */ n(
    Ee,
    {
      ...q,
      field: V,
      placeholder: t,
      value: p == null ? "" : String(p),
      onChange: (v) => u.setField(A, v)
    }
  ) : e === "textarea" ? m = /* @__PURE__ */ n(
    Xl,
    {
      ...q,
      rows: r,
      readOnly: V.readOnly,
      maxLength: V.maxLength,
      placeholder: t,
      value: String(p ?? ""),
      onChange: (v) => u.setField(A, v.target.value),
      onBlur: () => u.validate(V.formId ?? "main")
    }
  ) : m = /* @__PURE__ */ n(
    JA,
    {
      ...q,
      type: "text",
      inputMode: e === "number" ? "decimal" : "text",
      readOnly: V.readOnly,
      maxLength: V.maxLength,
      placeholder: t,
      value: String(p ?? ""),
      "data-step": e === "number" ? l : void 0,
      onChange: (v) => {
        const c = v.target.value;
        u.setField(
          A,
          e === "number" && /^-?\d+(\.\d+)?$/.test(c) ? Number(c) : c
        );
      },
      onBlur: () => u.validate(V.formId ?? "main")
    }
  ), /* @__PURE__ */ i(mt, { "data-invalid": !!d.error, children: [
    /* @__PURE__ */ i(et, { htmlFor: a, children: [
      V.label,
      d.required ? " *" : ""
    ] }),
    m,
    V.description && /* @__PURE__ */ n(BA, { id: `${a}-description`, children: V.description }),
    d.error && /* @__PURE__ */ n(KA, { id: `${a}-error`, children: d.error })
  ] });
}
function Zz({
  fieldId: A,
  kind: t,
  layout: r = "vertical",
  options: l,
  placeholder: e,
  suffix: u,
  step: a,
  actionEventId: I,
  actionLabel: z = "配置详情",
  hideControl: V,
  hideLabel: d,
  labelAppearance: p,
  descriptionAppearance: E
}) {
  const q = k(), m = zt(), v = q.definition.logic.fields[A], c = q.mode === "design" && !v, M = v ?? (c ? d3(t) : void 0);
  if (!M) return /* @__PURE__ */ n(KA, { children: "请关联字段定义" });
  const W = c ? Ar : q.fieldStatus(A);
  if (!W.visible && q.mode !== "design") return null;
  const C = W.disabled || q.mode === "design", Z = {
    id: m,
    disabled: C,
    readOnly: M.readOnly,
    placeholder: e,
    "aria-label": M.label || A,
    "aria-invalid": !!W.error,
    "aria-required": W.required,
    "aria-describedby": [
      M.description ? `${m}-description` : "",
      W.error ? `${m}-error` : ""
    ].filter(Boolean).join(" ") || void 0
  }, b = c ? $t(t, l?.length ? l : It) : q.getField(A), U = (K) => {
    !C && !M.readOnly && q.setField(A, K);
  }, f = (l?.length ? l : void 0) ?? (c ? It : q.options(A) ?? []).filter(Zl).filter((K) => !Bt(K.hidden)).map((K) => ({
    label: String(K.label ?? K.value ?? ""),
    value: String(K.value ?? ""),
    disabled: Bt(K.disabled)
  })), h = V ? null : t === "select" && !l?.length && !c ? /* @__PURE__ */ n(
    Ee,
    {
      ...Z,
      field: { ...M, id: A },
      value: String(b ?? ""),
      onChange: U
    }
  ) : /* @__PURE__ */ n(
    z3,
    {
      ...Z,
      kind: t,
      value: b,
      onChange: U,
      options: f,
      suffix: u,
      step: a,
      min: M.min,
      max: M.max,
      maxLength: M.maxLength,
      clearable: M.clearable !== !1,
      onBlur: () => q.validate(M.formId ?? "main")
    }
  );
  return /* @__PURE__ */ i(
    mt,
    {
      "data-invalid": !!W.error,
      className: "min-w-0",
      "data-config-layout": r,
      children: [
        /* @__PURE__ */ i(
          "div",
          {
            className: r === "vertical" ? "flex min-w-0 flex-col gap-2" : "flex min-w-0 items-center justify-between gap-3",
            children: [
              (!d || M.description) && /* @__PURE__ */ i(Bu, { className: "min-w-0", children: [
                !d && /* @__PURE__ */ n(
                  et,
                  {
                    htmlFor: V ? void 0 : m,
                    style: p ? zA(p) : void 0,
                    children: /* @__PURE__ */ n(
                      L,
                      {
                        text: `${M.label ?? A}${W.required ? " *" : ""}`
                      }
                    )
                  }
                ),
                M.description && /* @__PURE__ */ n(
                  BA,
                  {
                    id: `${m}-description`,
                    style: E ? zA(E) : void 0,
                    children: M.description
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                "div",
                {
                  className: r === "vertical" ? "flex min-w-0 items-center gap-2" : "flex min-w-0 shrink-0 items-center gap-2",
                  children: [
                    h,
                    I && /* @__PURE__ */ n(
                      T,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        disabled: C || !!q.state.busy[I],
                        "aria-label": `${M.label ?? A}：${z}`,
                        onClick: () => {
                          C || q.execute(I);
                        },
                        children: /* @__PURE__ */ n(Eu, {})
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        W.error && /* @__PURE__ */ n(KA, { id: `${m}-error`, children: W.error })
      ]
    }
  );
}
function Cz(A, t = !1) {
  if (typeof A != "string") return !1;
  const r = A.match(
    t ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/ : /^(\d{4})-(\d{2})-(\d{2})$/
  );
  if (!r) return !1;
  const [, l, e, u, a = "0", I = "0"] = r, z = /* @__PURE__ */ new Date(0);
  return z.setFullYear(Number(l), Number(e) - 1, Number(u)), z.setHours(Number(a), Number(I), 0, 0), z.getFullYear() === Number(l) && z.getMonth() === Number(e) - 1 && z.getDate() === Number(u) && z.getHours() === Number(a) && z.getMinutes() === Number(I);
}
const pe = (A) => A !== null && typeof A == "object" && !Array.isArray(A);
function fz(A, t) {
  const r = A == null || A === "";
  if (t.required && r) return `请填写${t.label}`;
  if (!r) {
    if (t.kind === "number") {
      if (typeof A != "number" || !Number.isFinite(A))
        return "请输入有效数字";
      if (t.min !== void 0 && A < t.min)
        return `不能小于 ${t.min}`;
      if (t.max !== void 0 && A > t.max)
        return `不能大于 ${t.max}`;
    }
    if (t.kind === "datetime" && !Cz(A, !0))
      return "请输入有效日期时间";
    if (t.kind === "select" && !t.options?.some(
      (l) => l.value === A && !l.disabled
    ))
      return "请选择有效选项";
  }
}
function B3(A, t = 0, r) {
  if (A != null && !Array.isArray(A)) return "字段值需要是记录数组";
  const l = A ?? [];
  if (!l.every(pe)) return "每一项都需要是记录对象";
  const e = l.map((u) => u.id).filter((u) => u != null && u !== "");
  if (e.some((u) => typeof u != "string") || new Set(e).size !== e.length)
    return "记录标识必须是唯一字符串";
  if (l.length < t) return `至少需要 ${t} 项`;
  if (r !== void 0 && l.length > r)
    return `最多允许 ${r} 项`;
}
function bz({
  fieldId: A,
  itemLabel: t,
  addLabel: r,
  columns: l,
  minItems: e = 0,
  maxItems: u,
  layout: a = "inline",
  addEventId: I
}) {
  const z = k(), V = zt(), d = z.definition.logic.fields[A], p = z.mode === "design" && !d, E = d ?? (p ? { label: "可增删明细表单" } : void 0);
  if (!E) return /* @__PURE__ */ n(KA, { children: "请关联字段定义" });
  const q = p ? Ar : z.fieldStatus(A);
  if (!q.visible && z.mode !== "design") return null;
  const m = q.disabled || E.readOnly || z.mode === "design", v = p ? Array.from({ length: Math.min(u ?? 2, 2) }, (f, h) => ({
    ...Object.fromEntries(
      l.map((K) => [
        K.key,
        K.kind === "number" ? Math.min(
          K.max ?? 100,
          Math.max(K.min ?? 0, 100)
        ) : $t(
          K.kind,
          K.options?.length ? K.options : It
        )
      ])
    ),
    id: `example-${h + 1}`
  })) : z.getField(A), M = (Array.isArray(v) ? v : []).filter(pe), W = p ? void 0 : B3(v, e, u), C = (f, h) => typeof f.id == "string" && f.id ? f.id : `${V}-row-${h}`, Z = !m && !B3(v), b = Dt(
    z.state.busy,
    z.definition.logic.events,
    I
  ), U = () => M.map((f, h) => ({ ...f, id: C(f, h) }));
  return /* @__PURE__ */ i(
    mt,
    {
      className: "min-w-0",
      "data-invalid": !!(q.error || W),
      children: [
        /* @__PURE__ */ n(et, { children: /* @__PURE__ */ n(
          L,
          {
            text: `${E.label ?? A}${q.required ? " *" : ""}`
          }
        ) }),
        E.description && /* @__PURE__ */ n(BA, { children: E.description }),
        /* @__PURE__ */ n("div", { className: "flex min-w-0 flex-col gap-4", children: M.map((f, h) => /* @__PURE__ */ i(
          "div",
          {
            className: a === "cards" ? "relative grid min-w-0 gap-2 rounded-md border bg-muted/20 p-3" : "flex min-w-0 items-start gap-3",
            "data-record-id": C(f, h),
            children: [
              /* @__PURE__ */ i(et, { className: "shrink-0", children: [
                t,
                " ",
                h + 1
              ] }),
              /* @__PURE__ */ n(
                "div",
                {
                  className: "grid min-w-0 flex-1 gap-3",
                  style: {
                    gridTemplateColumns: a === "cards" ? "minmax(0, 1fr)" : "repeat(auto-fit, minmax(min(100%, 180px), 1fr))"
                  },
                  children: l.map((K) => {
                    const Q = `${V}-${C(f, h)}-${K.key}`, x = p ? void 0 : fz(f[K.key], K);
                    return /* @__PURE__ */ i(
                      mt,
                      {
                        "data-invalid": !!x,
                        children: [
                          /* @__PURE__ */ n(et, { htmlFor: Q, children: /* @__PURE__ */ n(
                            L,
                            {
                              text: `${K.label}${K.required ? " *" : ""}`
                            }
                          ) }),
                          /* @__PURE__ */ n(
                            z3,
                            {
                              id: Q,
                              "aria-label": `${t} ${h + 1} ${K.label}`,
                              "aria-invalid": !!x,
                              "aria-describedby": x ? `${Q}-error` : void 0,
                              "aria-required": K.required,
                              kind: K.kind,
                              value: f[K.key],
                              options: K.options?.length ? K.options : p ? It : [],
                              min: K.min,
                              max: K.max,
                              disabled: !Z,
                              onChange: (lA) => {
                                Z && z.setField(
                                  A,
                                  U().map(
                                    (O, y) => y === h ? {
                                      ...O,
                                      [K.key]: lA
                                    } : O
                                  )
                                );
                              }
                            }
                          ),
                          x && /* @__PURE__ */ n(
                            KA,
                            {
                              id: `${Q}-error`,
                              children: x
                            }
                          )
                        ]
                      },
                      K.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ n(
                T,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: a === "cards" ? "absolute right-1 top-1" : void 0,
                  "aria-label": `删除${t} ${h + 1}`,
                  disabled: !Z || M.length <= e,
                  onClick: () => {
                    Z && M.length > e && z.setField(
                      A,
                      U().filter(
                        (K, Q) => Q !== h
                      )
                    );
                  },
                  children: /* @__PURE__ */ n(K7, {})
                }
              )
            ]
          },
          C(f, h)
        )) }),
        /* @__PURE__ */ i(
          T,
          {
            type: "button",
            variant: "outline",
            className: "w-fit",
            disabled: !Z || b || u !== void 0 && M.length >= u,
            onClick: () => {
              if (!Z || b || u !== void 0 && M.length >= u)
                return;
              if (I) {
                z.execute(I).catch(() => {
                });
                return;
              }
              const f = globalThis.crypto?.randomUUID?.() ?? `${V}-new-${Date.now()}-${Math.random().toString(36).slice(2)}`;
              z.setField(A, [
                ...U(),
                {
                  id: f,
                  ...Object.fromEntries(
                    l.map((h) => [h.key, ""])
                  )
                }
              ]);
            },
            children: [
              /* @__PURE__ */ n(kr, {}),
              r
            ]
          }
        ),
        (q.error || W) && /* @__PURE__ */ n(KA, { children: q.error || W })
      ]
    }
  );
}
const nA = { type: "text" }, Xt = (A, t) => ({
  type: "select",
  label: A,
  options: t.map((r) => ({ label: r, value: r }))
}), Ft = (A) => ({
  type: "radio",
  label: A,
  options: [
    { label: "是", value: !0 },
    { label: "否", value: !1 }
  ]
}), T3 = {
  label: { ...nA, label: "选项文字" },
  value: { ...nA, label: "选项值" },
  disabled: Ft("禁用")
}, Uz = {
  ConfigField: {
    label: J.ConfigField,
    defaultProps: w.ConfigField,
    fields: {
      fieldId: { ...nA, label: "字段定义" },
      kind: Xt("控件类型", [
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
      layout: Xt("排列", ["vertical", "horizontal", "card"]),
      placeholder: { ...nA, label: "占位文字" },
      suffix: { ...nA, label: "单位" },
      step: { type: "number", label: "数值步长", min: 1e-3 },
      options: {
        type: "array",
        label: "选项（留空时读取字段定义）",
        arrayFields: T3
      },
      hideControl: Ft("仅展示说明与详情操作"),
      hideLabel: Ft("隐藏字段标题（保留无障碍名称）"),
      actionEventId: { ...nA, label: "详情事件" },
      actionLabel: { ...nA, label: "详情操作说明" }
    },
    render: (A) => /* @__PURE__ */ n(Zz, { ...A })
  },
  RecordListField: {
    label: J.RecordListField,
    defaultProps: w.RecordListField,
    fields: {
      fieldId: { ...nA, label: "数组字段定义" },
      itemLabel: { ...nA, label: "条目名称" },
      addLabel: { ...nA, label: "添加按钮文字" },
      layout: Xt("排列方式", ["inline", "cards"]),
      addEventId: { ...nA, label: "添加记录事件（可选）" },
      minItems: { type: "number", label: "最少条目", min: 0 },
      maxItems: { type: "number", label: "最多条目", min: 0 },
      columns: {
        type: "array",
        label: "记录列",
        arrayFields: {
          key: { ...nA, label: "字段名" },
          label: { ...nA, label: "列名称" },
          kind: Xt("控件", [
            "text",
            "number",
            "datetime",
            "select"
          ]),
          required: Ft("必填"),
          min: { type: "number", label: "数值下限" },
          max: { type: "number", label: "数值上限" },
          options: {
            type: "array",
            label: "选项",
            arrayFields: T3
          }
        }
      }
    },
    render: (A) => /* @__PURE__ */ n(bz, { ...A })
  }
};
function hz(A) {
  const t = k(), r = zt(), { valueMode: l = "field", inputKind: e = "text", fieldId: u = "" } = A, a = l === "field", I = a ? t.definition.logic.fields[u] : void 0, z = a && !I && t.mode === "design", V = I ?? (z ? d3(e) : void 0), d = I ? t.fieldStatus(u) : z ? Ar : void 0, p = a ? z ? $t(e) : I ? t.getField(u) : "" : A.binding ? t.resolve(A.binding) : A.value, E = String(p ?? ""), q = JSON.stringify([
    l,
    u,
    A.binding,
    e,
    A.inputType
  ]), m = Ve(E, q), v = A.disabled === !0 || d?.disabled === !0 || t.mode === "design", c = A.readOnly === !0 || V?.readOnly === !0, M = A.required === !0 || d?.required === !0, W = e === "number" || e === "text" && A.inputType === "number", C = (Q, x) => {
    !Q || v || t.execute(Q, {
      row: {
        ...t.scope.row,
        value: b3(x, W),
        rawValue: x,
        fieldId: a ? u : "",
        inputKind: e,
        name: A.name ?? ""
      }
    }).catch(() => {
    });
  }, Z = (Q) => {
    if (v || c) return;
    const x = Q.currentTarget.value;
    if (a) {
      const lA = b3(x, W);
      t.setField(u, lA), W && m.set(x, String(lA));
    } else m.set(x);
    C(A.changeEventId, x);
  }, b = (Q) => {
    v || (I && t.validate(I.formId ?? "main"), C(A.blurEventId, Q.currentTarget.value), a && m.clear());
  };
  if (a && !V) return /* @__PURE__ */ n(KA, { children: "请关联字段定义" });
  if (d?.visible === !1 && t.mode !== "design") return null;
  const U = [A.maxLength, V?.maxLength].filter(
    (Q) => Q !== void 0
  ), f = [A.minLength, V?.minLength].filter(
    (Q) => Q !== void 0
  ), h = {
    id: r,
    value: m.value,
    disabled: v,
    readOnly: c,
    required: M,
    name: A.name,
    placeholder: A.placeholder,
    maxLength: U.length ? Math.min(...U) : void 0,
    minLength: f.length ? Math.max(...f) : void 0,
    "aria-label": A["aria-label"],
    "aria-invalid": !!d?.error,
    "aria-required": M,
    "aria-describedby": [
      V?.description ? `${r}-description` : "",
      d?.error ? `${r}-error` : ""
    ].filter(Boolean).join(" ") || void 0,
    onChange: Z,
    onBlur: b,
    onFocus: (Q) => C(A.focusEventId, Q.currentTarget.value)
  }, K = e === "textarea" ? /* @__PURE__ */ n(Xl, { ...h, rows: A.rows ?? 3 }) : /* @__PURE__ */ n(
    JA,
    {
      ...h,
      type: W ? "text" : A.inputType ?? "text",
      inputMode: W ? "decimal" : void 0,
      step: W ? A.step ?? 1 : void 0,
      "data-step": W ? A.step ?? 1 : void 0
    }
  );
  return V ? /* @__PURE__ */ i(mt, { "data-invalid": !!d?.error, children: [
    /* @__PURE__ */ i(et, { htmlFor: r, children: [
      V.label,
      M ? " *" : ""
    ] }),
    K,
    V.description && /* @__PURE__ */ n(BA, { id: `${r}-description`, children: V.description }),
    d?.error && /* @__PURE__ */ n(KA, { id: `${r}-error`, children: d.error })
  ] }) : K;
}
const Wr = (A) => ({
  type: "radio",
  label: A,
  options: [
    { label: "否", value: !1 },
    { label: "是", value: !0 }
  ]
}), Kz = {
  valueMode: {
    type: "select",
    label: "取值方式",
    options: [
      { label: "关联字段", value: "field" },
      { label: "独立值", value: "value" }
    ]
  },
  inputKind: {
    type: "select",
    label: "输入形式",
    options: [
      { label: "单行文本", value: "text" },
      { label: "数字", value: "number" },
      { label: "多行文本", value: "textarea" }
    ]
  },
  inputType: {
    type: "select",
    label: "单行输入类型",
    options: g7.map((A) => ({ label: A, value: A }))
  },
  fieldId: { type: "text", label: "字段 ID" },
  value: { type: "text", label: "独立值" },
  placeholder: { type: "text", label: "占位文字" },
  readOnly: Wr("只读"),
  disabled: Wr("禁用"),
  required: Wr("必填"),
  maxLength: { type: "number", label: "最大长度", min: 0 },
  minLength: { type: "number", label: "最小长度", min: 0 },
  name: { type: "text", label: "表单名称" },
  "aria-label": { type: "text", label: "无障碍名称" },
  rows: { type: "number", label: "多行行数", min: 1 },
  step: { type: "number", label: "数字步长", min: 0.01 },
  changeEventId: { type: "text", label: "值变化事件" },
  blurEventId: { type: "text", label: "失焦事件" },
  focusEventId: { type: "text", label: "聚焦事件" }
}, Qz = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAOGSURBVEiJrZZbaBxlFMd/3+zszuwmaXbXuLk0TfelwZqqD9pgWh8Msg++FRSKKNgb+tAgon3w0ooKRgqi4lstGB8sWAqmeHuoSBUNaCGgPiRt2rQh2ebSpJtNNt3sJjNzfNhks7M7cYv6h4GZM9/5n3P+3+V8AIhIXET6RGRe/jvmRaRfROIAau3lIhDHC7aNs5TBujKEnZxAVlfRIhH09p34mreijACgvDzHgG4lIv3APi/i/MDPZL86i3VlGMnn3P+VQos1Yux9nJrnDqKFI15BPlciMg+EXdyzt8icfIeVPwbBcTwLK4UWiVL74kuYiSdBuapJKxGRUos1OkL6jVdxZmeqEpfC19pG9PQZlGG47HrphzOfIn38WCW5UigziL6zAy1Ug3VjFHsyCWu5+VpaCfd+WEHuDuA4LH7wHs7MtDuzWBO1L/QQ6HoMFQwVjCJYY9e5c6YPa2SYcO9H+FrbPCsrSuTM/Ur6WA/WeGAj+n33U//2SXyxRm9dbBtn/jZaQ8z7/0YAwfrzGZzJb1i+2Ex+MIoyTKKffrFpZneLgkT2MrJwCeV3CCVuordkIXYCX+u2Cgf3ktgc64tJB5DVOVhZ015BYNcC+u6HKd9AInD8XI6hZJWlq+D0kSANdWqtglwSKEstGPf0zeaFxVz1Mm4tCg11Cq3qyH+JVbuQRCGA2UqFHMtjno5KFUaWP+WoDxasOoDyN0CgCVamEOBCvoWF5FWere+sIO/db2KXTcHQTYfXv8wVRTb90FCnSirwBVH1neTFx8d3dvHu0kOcuvw945nJisxMv6LG2HhChuL3a5ZrBrdGNMxAaQAUzrYeXs7s5VxuOwIsW3lO/PYJM9nbnlKtY2DE5vyg5bJ17fChrzEXJ1mP7GHLvd3u0lPXOPLjm1wYHyBruY/r6ewcp/76mre+vezaG/UhxVOd/uK36zRN5RZ4/ofXmM7OusgUiqBu0HHPDmr9IcYzU9xYnMARQTkG5uwB/EtdaEpxNBFg3yObBAAYSY/xyi/vV5XGDYWR6WZ/20F6EkFXS9CAdOnQ9nCcz57oZXfsAbS73CYh3eTwniaOJsyyflNoOH3AgXInWxx+Sl7i7NXvGE5dJ2fnK4ijZphHGx/kUMfTbK9r8Yp9vmrTt8Uhs7LEUGqUicwUK84qYWML7eE4bXXNmLqB+oemDxSvLf3/47Wlb/3a8jd/e/dwR7+79wAAAABJRU5ErkJggg==", Sz = "", sz = "", Yt = "", xz = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20viewBox='0%200%20140%2028'%20class='design-iconfont'%20width='128'%20height='25.6'%3e%3cpath%20d='M93.7656%2018.1304H95.6838C95.7472%2019.4312%2096.9845%2020.7532%2098.9463%2020.7532C100.843%2020.7532%20101.91%2019.5166%20101.91%2018.2157C101.91%2016.7879%20100.609%2016.1481%2099.3714%2015.8281L97.4745%2015.3594C94.3618%2014.6134%2093.8714%2012.7796%2093.8714%2011.5859C93.8714%209.04919%2096.1525%207.34375%2098.7118%207.34375C101.291%207.34375%20103.359%208.98501%20103.359%2011.6072H101.441C101.441%2010.1363%20100.225%209.13409%2098.6469%209.13409C97.1763%209.13409%2095.8122%2010.115%2095.8122%2011.5648C95.8122%2012.0763%2095.983%2013.0996%2097.9435%2013.6112L99.8627%2014.1226C102.357%2014.7837%20103.849%2016.0626%20103.849%2018.1523C103.849%2020.4334%20101.994%2022.5433%2098.9463%2022.5433C95.8545%2022.5433%2093.7867%2020.4113%2093.7656%2018.1304Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M115.104%2016.5321V22.2883H113.249V16.6387C113.249%2014.9763%20112.227%2013.9099%20110.841%2013.9099C109.456%2013.9099%20107.792%2014.7418%20107.792%2016.895V22.2883H105.938V6.91797H107.792V13.8465C108.389%2012.631%20110.009%2012.0765%20111.097%2012.0765C113.57%2012.0765%20115.127%2013.7396%20115.104%2016.5321Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M116.879%2017.2992C116.879%2014.1438%20119.246%2012.0762%20122.081%2012.0762C124.916%2012.0762%20127.304%2014.1438%20127.304%2017.2992C127.304%2020.4547%20124.916%2022.5436%20122.081%2022.5436C119.246%2022.5436%20116.879%2020.4547%20116.879%2017.2992ZM125.449%2017.2992C125.449%2015.2527%20123.914%2013.8245%20122.081%2013.8245C120.269%2013.8245%20118.755%2015.2527%20118.755%2017.2992C118.755%2019.3669%20120.269%2020.7958%20122.081%2020.7958C123.914%2020.7958%20125.449%2019.3669%20125.449%2017.2992Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M139.648%2017.3203C139.648%2020.4758%20137.41%2022.5436%20134.681%2022.5436C133.188%2022.5436%20131.781%2021.9043%20131.12%2020.7312V27.1274H129.266V12.3318H131.12V13.8883C131.781%2012.7584%20133.232%2012.0762%20134.66%2012.0762C137.388%2012.0762%20139.648%2014.1869%20139.648%2017.3203ZM137.773%2017.3422C137.773%2015.3593%20136.322%2013.8245%20134.489%2013.8245C132.719%2013.8245%20131.12%2015.2104%20131.12%2017.3422C131.12%2019.4949%20132.869%2020.7958%20134.489%2020.7958C136.322%2020.7958%20137.773%2019.3458%20137.773%2017.3422Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M22.2773%207.65039H33.1933L32.1909%2010.7736L29.3591%2010.7722V22.3187H25.8303V10.7722L22.28%2010.779L22.2773%207.65039Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M51.0742%207.65039H62.2426L61.2405%2010.7736L58.1613%2010.7722V22.3187H54.6272V10.7722L51.0769%2010.779L51.0742%207.65039Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M33.8594%2012.3164H37.3592L37.3556%2022.3191H33.8802L33.8594%2012.3164Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M38.7461%207.60938H42.2419V14.4408L45.7065%2011.0407L49.8798%2011.041L45.4975%2015.294L50.4061%2022.319H46.5544L43.2783%2017.4474L42.2419%2018.4545V22.319H38.7461V7.60938Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M75.7891%207.60938H79.2849V14.4408L82.7495%2011.0407L86.9229%2011.041L82.5405%2015.294L87.4491%2022.319H83.5974L80.3213%2017.4474L79.2849%2018.4545V22.319H75.7891V7.60938Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M37.3691%209.41189C37.3691%2010.3847%2036.5804%2011.1734%2035.6076%2011.1734C34.6344%2011.1734%2033.8457%2010.3847%2033.8457%209.41189C33.8457%208.43893%2034.6344%207.65039%2035.6076%207.65039C36.5804%207.65039%2037.3691%208.43893%2037.3691%209.41189Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M61.7964%2016.3294C61.7964%2013.1802%2064.2277%2010.6011%2067.3152%2010.3616C67.1602%2010.3494%2066.9487%2010.3418%2066.7906%2010.3418C63.4835%2010.3418%2060.8027%2013.0224%2060.8027%2016.3294C60.8027%2019.6363%2063.4835%2022.3173%2066.7906%2022.3173C66.9487%2022.3173%2067.1602%2022.3092%2067.3152%2022.2972C64.2277%2022.0574%2061.7964%2019.4783%2061.7964%2016.3294Z'%20fill='%2325F4EE'%3e%3c/path%3e%3cpath%20d='M68.6732%2010.3418C68.5139%2010.3418%2068.3008%2010.3497%2068.1445%2010.362C71.2302%2010.6035%2073.6595%2013.1821%2073.6595%2016.3294C73.6595%2019.4771%2071.2302%2022.0556%2068.1445%2022.2972C68.3008%2022.3092%2068.5139%2022.3173%2068.6732%2022.3173C71.9801%2022.3173%2074.6611%2019.6363%2074.6611%2016.3294C74.6611%2013.0226%2071.9801%2010.3418%2068.6732%2010.3418Z'%20fill='%23FF2751'%3e%3c/path%3e%3cpath%20d='M67.7262%2010.3418C64.4193%2010.3418%2061.7383%2013.0228%2061.7383%2016.3298C61.7383%2019.6367%2064.4193%2022.3173%2067.7262%2022.3173C71.0332%2022.3173%2073.7142%2019.6367%2073.7142%2016.3298C73.7142%2013.0228%2071.0332%2010.3418%2067.7262%2010.3418ZM67.7262%2019.2405C66.1186%2019.2405%2064.8155%2017.9374%2064.8155%2016.3298C64.8155%2014.7222%2066.1186%2013.419%2067.7262%2013.419C69.3338%2013.419%2070.6369%2014.7222%2070.6369%2016.3298C70.6369%2017.9374%2069.3338%2019.2405%2067.7262%2019.2405Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M7.29682%2010.3851V9.52188C7.01288%209.48322%206.72451%209.45898%206.43021%209.45898C2.88465%209.45898%200%2012.3436%200%2015.8896C0%2018.065%201.08708%2019.9902%202.74518%2021.1543C2.71485%2021.1221%202.68544%2021.0892%202.65584%2021.0562C1.64053%2019.9183%201.0573%2018.4185%201.0573%2016.7759C1.0573%2013.2813%203.82117%2010.4665%207.29682%2010.3851Z'%20fill='%2325F4EE'%3e%3c/path%3e%3cpath%20d='M7.44897%2019.7376C9.03104%2019.7376%2010.3469%2018.4552%2010.4058%2016.8874L10.4128%202.91302L12.9497%202.91728L12.9432%202.88639C12.8901%202.59875%2012.8609%202.3028%2012.8609%202H9.3675L9.36178%2016.0008C9.30294%2017.5688%208.01258%2018.8274%206.43069%2018.8274C5.93921%2018.8274%205.47605%2018.7043%205.06836%2018.4896C5.60202%2019.2295%206.46916%2019.7376%207.44897%2019.7376Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M17.7228%207.69496V6.86128C16.747%206.86128%2015.8382%206.57123%2015.0762%206.07422C15.7547%206.85351%2016.6764%207.47076%2017.7228%207.69496Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M15.0736%206.07343C14.3301%205.21959%2013.8784%204.10532%2013.8784%202.88672H12.918C13.1644%204.21778%2013.9792%205.35962%2015.0736%206.07343Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M6.43006%2012.928C4.81063%2012.928%203.4668%2014.2722%203.4668%2015.8917C3.4668%2017.0191%204.13306%2017.999%205.06774%2018.4909C4.71962%2018.0081%204.51153%2017.4177%204.51153%2016.7782C4.51153%2015.1588%205.82909%2013.8412%207.44815%2013.8412C7.75058%2013.8412%208.04062%2013.8912%208.31494%2013.9768V10.4105C8.031%2010.3719%207.74263%2010.3477%207.44815%2010.3477C7.39747%2010.3477%207.34697%2010.3502%207.29667%2010.3517L7.27244%2010.3547L7.26983%2013.0484C6.99553%2012.9624%206.7325%2012.928%206.43006%2012.928Z'%20fill='%23000'%3e%3c/path%3e%3cpath%20d='M17.7217%207.64004L17.7032%207.63672L17.6952%2010.3257C15.884%2010.3257%2014.2118%209.73597%2012.8414%208.75229L12.8377%2015.8919C12.8377%2019.4378%209.97669%2022.2962%206.43112%2022.2962C5.06066%2022.2962%203.79045%2021.89%202.74609%2021.1568C3.92086%2022.4179%205.59394%2023.2085%207.44921%2023.2085C10.9951%2023.2085%2013.8798%2020.3244%2013.8798%2016.7784V9.67882C15.2499%2010.6621%2016.9287%2011.2418%2018.74%2011.2418V7.74826C18.3909%207.74826%2018.0504%207.71033%2017.7217%207.64004Z'%20fill='%23FF2751'%3e%3c/path%3e%3cpath%20d='M12.8617%2015.8909V8.79142C14.2321%209.77455%2015.9106%2010.3543%2017.7222%2010.3543V7.63904C16.6758%207.41485%2015.7539%206.85309%2015.0752%206.0738C13.9808%205.35999%2013.1908%204.21778%2012.944%202.88672H10.3864L10.3806%2016.8881C10.3222%2018.4557%209.03182%2019.7141%207.44975%2019.7141C6.46976%2019.7141%205.60279%2019.2298%205.06914%2018.4903C4.13429%2017.9983%203.49484%2017.0183%203.49484%2015.8909C3.49484%2014.2716%204.81203%2012.9542%206.43147%2012.9542C6.73353%2012.9542%207.02356%2013.004%207.29788%2013.09V10.3509C3.82242%2010.4323%201.01953%2013.2826%201.01953%2016.7774C1.01953%2018.4677%201.67618%2020.0067%202.74644%2021.1558C3.79079%2021.889%205.06119%2022.3211%206.43147%2022.3211C9.97703%2022.3211%2012.8617%2019.4366%2012.8617%2015.8909Z'%20fill='%23000'%3e%3c/path%3e%3c/svg%3e", Xz = [
  {
    id: "travel",
    name: "宠物出行",
    englishName: "Pet Travel",
    units: 18720,
    gmv: 602e3,
    growth: 38,
    promoters: 1840,
    newUnits: 2970,
    searchMomentum: 15.6,
    platformScore: 84.6,
    searchScore: 35,
    opportunityScore: 69.7,
    productConcentration: 32,
    shopConcentration: 39,
    promotionOverlap: 58,
    newProductOverlap: 24,
    products: [
      {
        name: "折叠宠物推车",
        price: "$59.90",
        units: 1620,
        growth: 61,
        promoters: 186,
        source: "销量榜 / 热推榜"
      },
      {
        name: "透气宠物背包",
        price: "$32.50",
        units: 1240,
        growth: 32,
        promoters: 124,
        source: "热推榜"
      },
      {
        name: "车载宠物安全座椅",
        price: "$45.90",
        units: 890,
        growth: 28,
        promoters: 86,
        source: "新品榜"
      }
    ]
  },
  {
    id: "feeding",
    name: "宠物喂养",
    englishName: "Pet Feeding",
    units: 23700,
    gmv: 49e4,
    growth: 7,
    promoters: 760,
    newUnits: 1100,
    searchMomentum: -2,
    platformScore: 46.4,
    searchScore: 34.8,
    opportunityScore: 42.9,
    productConcentration: 46,
    shopConcentration: 51,
    promotionOverlap: 41,
    newProductOverlap: 19,
    products: [
      {
        name: "自动喂食器",
        price: "$39.90",
        units: 1860,
        growth: 16,
        promoters: 74,
        source: "销量榜"
      },
      {
        name: "慢食硅胶碗",
        price: "$16.80",
        units: 1120,
        growth: 9,
        promoters: 58,
        source: "热推榜"
      },
      {
        name: "便携饮水器",
        price: "$12.90",
        units: 760,
        growth: 12,
        promoters: 41,
        source: "新品榜"
      }
    ]
  },
  {
    id: "grooming",
    name: "宠物清洁",
    englishName: "Pet Grooming",
    units: 20480,
    gmv: 43e4,
    growth: 11,
    promoters: 900,
    newUnits: 1250,
    searchMomentum: 2,
    platformScore: 45.8,
    searchScore: 35.9,
    opportunityScore: 42.8,
    productConcentration: 40,
    shopConcentration: 48,
    promotionOverlap: 43,
    newProductOverlap: 22,
    products: [
      {
        name: "自清洁宠物梳",
        price: "$14.90",
        units: 1480,
        growth: 22,
        promoters: 92,
        source: "销量榜 / 热推榜"
      },
      {
        name: "宠物除毛滚筒",
        price: "$11.50",
        units: 980,
        growth: 8,
        promoters: 61,
        source: "热推榜"
      },
      {
        name: "免洗泡沫清洁",
        price: "$18.90",
        units: 640,
        growth: 15,
        promoters: 47,
        source: "新品榜"
      }
    ]
  },
  {
    id: "toys",
    name: "宠物玩具",
    englishName: "Pet Toys",
    units: 15200,
    gmv: 275e3,
    growth: 31,
    promoters: 1540,
    newUnits: 2100,
    searchMomentum: 8.2,
    platformScore: 67.8,
    searchScore: 33.2,
    opportunityScore: 57.4,
    productConcentration: 28,
    shopConcentration: 33,
    promotionOverlap: 64,
    newProductOverlap: 35,
    products: [
      {
        name: "互动漏食球",
        price: "$19.90",
        units: 1320,
        growth: 41,
        promoters: 118,
        source: "热推榜"
      },
      {
        name: "耐咬发声玩具",
        price: "$15.90",
        units: 940,
        growth: 36,
        promoters: 77,
        source: "销量榜"
      },
      {
        name: "猫狗逗引杆",
        price: "$9.90",
        units: 820,
        growth: 26,
        promoters: 69,
        source: "新品榜"
      }
    ]
  }
], P3 = (A) => A >= 1e4 ? `${(A / 1e4).toFixed(1)}w` : A.toLocaleString("en-US"), ie = (A) => `$${A.toLocaleString("en-US")}`, D = (A) => A === "tk" ? xz : Qz, H = (A) => A === "tk" ? "TikTok Shop" : "Google Trends", Zr = (A) => ({
  折叠宠物推车: Yt,
  轻量折叠宠物推车: Yt,
  双层多宠物推车: Yt,
  可拆卸宠物推车: Yt,
  透气宠物背包: Sz,
  车载宠物安全座椅: sz
})[A] ?? "", gA = (A) => typeof A == "string" ? A : Object.keys(A).filter((t) => A[t]).join(" ");
function Yz({
  reportId: A,
  currentCategory: t
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-action-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-action-title", children: "建议行动" }),
            /* @__PURE__ */ n("span", { children: "从类目判断进入具体商品验证" })
          ] }),
          /* @__PURE__ */ i("div", { className: "report-source-row", children: [
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] }),
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
              H("google")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "report-action-grid", children: [
          /* @__PURE__ */ i("article", { className: "report-action-card", children: [
            /* @__PURE__ */ n("span", { children: "STEP 01" }),
            /* @__PURE__ */ n("h4", { children: "锁定分析范围" }),
            /* @__PURE__ */ i("p", { children: [
              "将「",
              t.name,
              "」作为下一步商品筛选范围。"
            ] }),
            /* @__PURE__ */ i("small", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] })
          ] }),
          /* @__PURE__ */ i("article", { className: "report-action-card", children: [
            /* @__PURE__ */ n("span", { children: "STEP 02" }),
            /* @__PURE__ */ n("h4", { children: "筛选具体商品" }),
            /* @__PURE__ */ n("p", { children: "优先核对榜单商品的价格、近 7 天销量与评分，避免仅凭类目机会分选品。" }),
            /* @__PURE__ */ i("small", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] })
          ] }),
          /* @__PURE__ */ i("article", { className: "report-action-card", children: [
            /* @__PURE__ */ n("span", { children: "STEP 03" }),
            /* @__PURE__ */ n("h4", { children: "验证需求与货源" }),
            /* @__PURE__ */ n("p", { children: "将 Google 搜索趋势作为需求补充，再进行 1688 寻源与成本利润率测算。" }),
            /* @__PURE__ */ i("div", { className: "report-source-row", children: [
              /* @__PURE__ */ i("small", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                H("tk")
              ] }),
              /* @__PURE__ */ i("small", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
                H("google")
              ] })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function Gz({
  reportId: A,
  currentCategory: t,
  sortedCategories: r,
  sortKey: l,
  setSortKey: e,
  chooseCategory: u
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-compare-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-compare-title", children: "子类目表现对比" }),
            /* @__PURE__ */ n("span", { children: "宠物用品下的二级类目" })
          ] }),
          /* @__PURE__ */ i("div", { className: "report-source-row", children: [
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] }),
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
              H("google")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "report-table-tools", children: [
          /* @__PURE__ */ n("span", { children: "点击任一行，可查看该类目完整分析" }),
          /* @__PURE__ */ n("div", { "aria-label": "排序方式", className: "report-sort", children: [
            { key: "score", label: "综合机会" },
            { key: "units", label: "样本销量" },
            { key: "gmv", label: "样本 GMV" }
          ].map((a) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => {
                e(a.key);
              },
              className: [
                gA({
                  "is-active": l === a.key
                })
              ].filter(Boolean).join(" "),
              children: a.label
            },
            a.key
          )) })
        ] }),
        /* @__PURE__ */ n("div", { className: "report-table-wrap", children: /* @__PURE__ */ i("table", { className: "report-table", children: [
          /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ i("tr", { children: [
            /* @__PURE__ */ n("th", { children: "类目" }),
            /* @__PURE__ */ n("th", { children: "销量榜样本销量" }),
            /* @__PURE__ */ n("th", { children: "销量榜样本 GMV" }),
            /* @__PURE__ */ n("th", { children: "商品增长率*" }),
            /* @__PURE__ */ n("th", { children: "热推商品达人累计*" }),
            /* @__PURE__ */ n("th", { children: "新品榜 3 日销量" }),
            /* @__PURE__ */ n("th", { children: "Google 搜索动量" }),
            /* @__PURE__ */ n("th", { children: "机会分" })
          ] }) }),
          /* @__PURE__ */ n("tbody", { children: r.map((a, I) => /* @__PURE__ */ i(
            "tr",
            {
              tabIndex: 0,
              role: "button",
              "aria-label": `${a.name}，机会分 ${a.opportunityScore}`,
              onClick: () => {
                u(a.id);
              },
              className: [
                gA({
                  "is-selected": a.id === t.id
                })
              ].filter(Boolean).join(" "),
              onKeyDown: (z) => {
                z.key === "Enter" && (z.preventDefault(), u(a.id)), z.key === " " && (z.preventDefault(), u(a.id));
              },
              children: [
                /* @__PURE__ */ n("td", { children: /* @__PURE__ */ i("div", { className: "report-category-cell", children: [
                  /* @__PURE__ */ n("span", { className: "report-rank", children: I + 1 }),
                  /* @__PURE__ */ i("span", { children: [
                    /* @__PURE__ */ n("b", { children: a.name }),
                    /* @__PURE__ */ n("small", { children: a.englishName })
                  ] })
                ] }) }),
                /* @__PURE__ */ n("td", { className: "report-number", children: a.units.toLocaleString("en-US") }),
                /* @__PURE__ */ n("td", { className: "report-number", children: ie(a.gmv) }),
                /* @__PURE__ */ i("td", { className: "report-number is-positive", children: [
                  "+",
                  a.growth,
                  "%"
                ] }),
                /* @__PURE__ */ n("td", { className: "report-number", children: a.promoters.toLocaleString("en-US") }),
                /* @__PURE__ */ n("td", { className: "report-number", children: a.newUnits.toLocaleString("en-US") }),
                /* @__PURE__ */ i(
                  "td",
                  {
                    className: [
                      "report-number",
                      gA(
                        a.searchMomentum >= 0 ? "is-positive" : "is-negative"
                      )
                    ].filter(Boolean).join(" "),
                    children: [
                      a.searchMomentum >= 0 ? "+" : "",
                      a.searchMomentum,
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ n("td", { className: "report-number report-score-number", children: a.opportunityScore.toFixed(1) })
              ]
            },
            a.id
          )) })
        ] }) }),
        /* @__PURE__ */ n("p", { className: "report-caption", children: "* 演示汇总指标；达人累计是榜单商品的达人计数之和，可能包含同一达人，不等于去重达人数。商品增长率为商品级增长率加权值。" })
      ]
    }
  ) });
}
function oz() {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i("section", { "aria-label": "报告信息", className: "report-context", children: [
    /* @__PURE__ */ n("span", { className: "report-context__label", children: "分析层级" }),
    /* @__PURE__ */ n("span", { children: /* @__PURE__ */ n("b", { children: "一级类目" }) }),
    /* @__PURE__ */ n(
      "span",
      {
        "aria-hidden": "true",
        className: "report-context__divider"
      }
    ),
    /* @__PURE__ */ i("span", { children: [
      "站点 ",
      /* @__PURE__ */ n("b", { children: "美国 US" })
    ] }),
    /* @__PURE__ */ n(
      "span",
      {
        "aria-hidden": "true",
        className: "report-context__divider"
      }
    ),
    /* @__PURE__ */ i("span", { children: [
      "时间 ",
      /* @__PURE__ */ n("b", { children: "2026-09-30 · 示例快照" })
    ] })
  ] }) });
}
function Rz({
  reportId: A,
  currentCategory: t
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-demand-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-demand-title", children: "需求情况" }),
            /* @__PURE__ */ n("span", { children: "参考图示：平台推广与站外搜索并列展示" })
          ] }),
          /* @__PURE__ */ i("div", { className: "report-source-row", children: [
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] }),
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
              H("google")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "report-demand-grid", children: [
          /* @__PURE__ */ i("article", { className: "report-demand-card", children: [
            /* @__PURE__ */ i("div", { className: "report-demand-card__title", children: [
              /* @__PURE__ */ i("span", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                H("tk")
              ] }),
              /* @__PURE__ */ n("b", { children: "TikTok 内容生态" })
            ] }),
            /* @__PURE__ */ n("small", { children: "最新 1 个月榜单商品达人累计计数*" }),
            /* @__PURE__ */ n("strong", { children: Math.round(
              t.promoters * 0.33
            ).toLocaleString("en-US") }),
            /* @__PURE__ */ n("span", { className: "report-demand-card__hint", children: "近 12 个月带货达人计数趋势 · 演示序列" }),
            /* @__PURE__ */ i(
              "svg",
              {
                viewBox: "0 0 420 86",
                role: "img",
                "aria-label": "TikTok 带货达人计数趋势",
                className: "report-chart",
                children: [
                  /* @__PURE__ */ n("defs", { children: /* @__PURE__ */ i(
                    "linearGradient",
                    {
                      id: A + "-tk-area",
                      x1: "0",
                      x2: "0",
                      y1: "0",
                      y2: "1",
                      children: [
                        /* @__PURE__ */ n(
                          "stop",
                          {
                            offset: "0",
                            stopColor: "#6b9bff",
                            stopOpacity: ".22"
                          }
                        ),
                        /* @__PURE__ */ n(
                          "stop",
                          {
                            offset: "1",
                            stopColor: "#2f6bff",
                            stopOpacity: "0"
                          }
                        )
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ n(
                    "path",
                    {
                      d: "M0 68 C45 65 62 62 100 61 S158 53 198 50 S255 42 294 37 S352 27 420 14 V86 H0 Z",
                      fill: "url(#" + A + "-tk-area)",
                      className: "report-chart__area"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "path",
                    {
                      d: "M0 68 C45 65 62 62 100 61 S158 53 198 50 S255 42 294 37 S352 27 420 14",
                      className: "report-chart__line"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ i("div", { className: "report-demand-card__footer", children: [
              /* @__PURE__ */ n("mark", { children: "最近月上升" }),
              /* @__PURE__ */ n("span", { children: "* 非跨商品去重达人数" })
            ] })
          ] }),
          /* @__PURE__ */ i("article", { className: "report-demand-card", children: [
            /* @__PURE__ */ i("div", { className: "report-demand-card__title", children: [
              /* @__PURE__ */ i("span", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
                H("google")
              ] }),
              /* @__PURE__ */ n("b", { children: "外部搜索需求" })
            ] }),
            /* @__PURE__ */ n("small", { children: "搜索峰值月（近 12 个月）" }),
            /* @__PURE__ */ n("strong", { children: "9月" }),
            /* @__PURE__ */ n("span", { className: "report-demand-card__hint", children: "近 12 个月 Google 搜索趋势 · 演示序列" }),
            /* @__PURE__ */ i(
              "svg",
              {
                viewBox: "0 0 420 86",
                role: "img",
                "aria-label": "Google 搜索趋势",
                className: "report-chart",
                children: [
                  /* @__PURE__ */ n("defs", { children: /* @__PURE__ */ i(
                    "linearGradient",
                    {
                      id: A + "-google-area",
                      x1: "0",
                      x2: "0",
                      y1: "0",
                      y2: "1",
                      children: [
                        /* @__PURE__ */ n(
                          "stop",
                          {
                            offset: "0",
                            stopColor: "#6b9bff",
                            stopOpacity: ".22"
                          }
                        ),
                        /* @__PURE__ */ n(
                          "stop",
                          {
                            offset: "1",
                            stopColor: "#2f6bff",
                            stopOpacity: "0"
                          }
                        )
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ n(
                    "path",
                    {
                      d: "M0 70 C40 66 72 63 110 61 S166 55 205 53 S255 48 294 43 S355 30 420 15 V86 H0 Z",
                      fill: "url(#" + A + "-google-area)",
                      className: "report-chart__area"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "path",
                    {
                      d: "M0 70 C40 66 72 63 110 61 S166 55 205 53 S255 48 294 43 S355 30 420 15",
                      className: "report-chart__line"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ i("div", { className: "report-demand-card__footer", children: [
              /* @__PURE__ */ i("mark", { children: [
                "搜索动量 ",
                t.searchMomentum >= 0 ? "+" : "",
                t.searchMomentum,
                "%"
              ] }),
              /* @__PURE__ */ n("span", { children: "代表词：pet travel · dog stroller" })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function jz({
  reportId: A,
  formulaOpen: t,
  setFormulaOpen: r,
  formulaDialog: l
}) {
  return /* @__PURE__ */ n(AA, { children: t && /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      role: "dialog",
      "aria-modal": "true",
      onKeyDown: (e) => {
        e.key === "Escape" && (e.stopPropagation(), r(!1)), e.key === "Tab" && (e.preventDefault(), l.current?.querySelector("button")?.focus());
      },
      "aria-labelledby": A + "-report-formula-title",
      onClick: (e) => {
        e.target === e.currentTarget && r(!1);
      },
      className: "report-modal",
      children: /* @__PURE__ */ i("article", { className: "report-modal__card", children: [
        /* @__PURE__ */ i("header", { children: [
          /* @__PURE__ */ n("h3", { id: A + "-report-formula-title", children: "计算口径" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "关闭计算口径",
              onClick: () => {
                r(!1);
              },
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "report-modal__body", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h4", { children: "榜单样本销量与 GMV" }),
            /* @__PURE__ */ i("code", { children: [
              "SampleUnits(c) = Σ 榜单商品销量",
              /* @__PURE__ */ n("br", {}),
              "SampleGMV(c) = Σ 榜单商品 GMV"
            ] }),
            /* @__PURE__ */ n("p", { children: "仅对当前类目的销量榜 Top-K 样本求和，不代表全类目市场规模。" })
          ] }),
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h4", { children: "平台机会分" }),
            /* @__PURE__ */ n("code", { children: "PlatformScore = 45% × SalesScore + 30% × PromotionScore + 25% × NewProductScore" }),
            /* @__PURE__ */ n("p", { children: "分别衡量销量榜成交、热推榜内容扩散和新品榜冷启动表现。" })
          ] }),
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h4", { children: "综合机会分" }),
            /* @__PURE__ */ n("code", { children: "OpportunityScore = 70% × PlatformScore + 30% × SearchScore" }),
            /* @__PURE__ */ n("p", { children: "搜索需求来自 Google Trends；平台榜单数据来自 TikTok Shop 交易和内容信号。" })
          ] })
        ] })
      ] })
    }
  ) });
}
function Oz({
  setFormulaOpen: A,
  onViewList: t
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i("div", { className: "workflow-research-report__title-row", children: [
    /* @__PURE__ */ i("div", { className: "workflow-research-report__title-copy", children: [
      /* @__PURE__ */ i("div", { className: "workflow-research-report__title-line", children: [
        /* @__PURE__ */ n("h2", { children: "选品报告" }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => {
              A(!0);
            },
            className: "report-button report-button--method",
            children: "查看计算口径"
          }
        )
      ] }),
      /* @__PURE__ */ n("p", { children: "从 TikTok Shop 商品表现出发，结合 Google 搜索需求验证类目机会。" })
    ] }),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        onClick: () => {
          t?.();
        },
        className: "report-button report-button--list",
        children: "查看选品列表"
      }
    )
  ] }) });
}
function gz({
  reportId: A,
  currentCategory: t,
  currentList: r,
  currentRank: l,
  heroSummary: e
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-report-hero-title",
      className: "report-hero",
      children: [
        /* @__PURE__ */ i("div", { className: "report-hero__main", children: [
          /* @__PURE__ */ i("div", { className: "report-section-kicker", children: [
            /* @__PURE__ */ n("span", { children: "01" }),
            /* @__PURE__ */ n("b", { children: "子类目推荐" }),
            /* @__PURE__ */ n("em", { children: "建议关注" })
          ] }),
          /* @__PURE__ */ n("p", { className: "report-hero__path", children: "宠物用品 › 推荐二级类目" }),
          /* @__PURE__ */ n("h3", { id: A + "-report-hero-title", children: t.name }),
          /* @__PURE__ */ n("p", { className: "report-hero__summary", children: e }),
          /* @__PURE__ */ i("div", { className: "report-hero__points", children: [
            /* @__PURE__ */ i("span", { children: [
              "销量榜样本 ",
              /* @__PURE__ */ i("b", { children: [
                P3(t.units),
                " 件"
              ] })
            ] }),
            /* @__PURE__ */ i("span", { children: [
              "热推达人累计 ",
              /* @__PURE__ */ n("b", { children: P3(t.promoters) })
            ] }),
            /* @__PURE__ */ i("span", { children: [
              "搜索动量 ",
              /* @__PURE__ */ i(
                "b",
                {
                  className: [
                    gA(
                      t.searchMomentum >= 0 ? "is-positive" : "is-negative"
                    )
                  ].filter(Boolean).join(" "),
                  children: [
                    t.searchMomentum >= 0 ? "+" : "",
                    t.searchMomentum,
                    "%"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("p", { className: "report-hero__rank", children: [
            "同级参照：",
            r.length,
            " 个候选类目；当前排名 ",
            l,
            "/",
            r.length,
            "。"
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "report-hero__score", children: [
          /* @__PURE__ */ i("div", { className: "report-hero__score-label", children: [
            "综合机会分 ",
            /* @__PURE__ */ n("span", { children: "候选类目内相对评分" })
          ] }),
          /* @__PURE__ */ i("strong", { children: [
            t.opportunityScore.toFixed(1),
            /* @__PURE__ */ n("small", { children: "/ 100" })
          ] }),
          /* @__PURE__ */ n("div", { className: "report-progress", children: /* @__PURE__ */ n(
            "i",
            {
              style: {
                width: `${t.opportunityScore}%`
              }
            }
          ) }),
          /* @__PURE__ */ i("div", { className: "report-hero__score-sources", children: [
            /* @__PURE__ */ i("span", { children: [
              "TikTok 平台 ",
              /* @__PURE__ */ n("b", { children: t.platformScore })
            ] }),
            /* @__PURE__ */ i("span", { children: [
              "Google 搜索 ",
              /* @__PURE__ */ n("b", { children: t.searchScore })
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "report-source-row", children: [
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] }),
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
              H("google")
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function yz() {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i("footer", { className: "report-method", children: [
    /* @__PURE__ */ i("p", { children: [
      /* @__PURE__ */ n("b", { children: "数据口径：" }),
      "页面数字均为演示数据。TikTok Shop 指标代表对应商品榜单的 Top-K 样本，不表示全类目总销量、GMV、在售商品总数或市场份额。销量榜、热推榜和新品榜的取数窗口不同；新品榜展示上架后 3 日表现。"
    ] }),
    /* @__PURE__ */ i("p", { children: [
      /* @__PURE__ */ n("b", { children: "搜索口径：" }),
      "Google Trends 是相对搜索兴趣指数，不是搜索量或交易额。实际报告须记录国家、Topic/关键词、属性、类别筛选和时间窗口。"
    ] }),
    /* @__PURE__ */ i("p", { children: [
      /* @__PURE__ */ n("b", { children: "来源标注：" }),
      "榜单数据按其底层交易和内容平台标为 TikTok Shop；Google 搜索数据标为 Google Trends。综合机会分同时使用两者。"
    ] })
  ] }) });
}
function Nz({
  reportId: A,
  currentCategory: t,
  matrixType: r,
  matrixCopy: l
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-opportunity-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-opportunity-title", children: "类目机会分析" }),
            /* @__PURE__ */ n("span", { children: "分开展示平台表现与搜索需求" })
          ] }),
          /* @__PURE__ */ i("div", { className: "report-source-row", children: [
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
              H("tk")
            ] }),
            /* @__PURE__ */ i("span", { className: "report-source", children: [
              /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
              H("google")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "report-opportunity-grid", children: [
          /* @__PURE__ */ i("article", { className: "report-panel", children: [
            /* @__PURE__ */ n("h4", { children: "双源机会判断" }),
            /* @__PURE__ */ n("p", { children: "平台分与搜索分均在同级候选类目之间归一化比较。" }),
            /* @__PURE__ */ i("div", { className: "report-score-columns", children: [
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ n("span", { children: "平台机会分" }),
                /* @__PURE__ */ n("strong", { children: t.platformScore }),
                /* @__PURE__ */ i("small", { className: "report-source", children: [
                  /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                  H("tk")
                ] })
              ] }),
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ n("span", { children: "搜索需求分" }),
                /* @__PURE__ */ n("strong", { children: t.searchScore }),
                /* @__PURE__ */ i("small", { className: "report-source", children: [
                  /* @__PURE__ */ n("img", { src: D("google"), alt: "" }),
                  H("google")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ i("p", { className: "report-panel__foot", children: [
              "综合机会分 ",
              t.opportunityScore.toFixed(1),
              " = 70% 平台分 + 30% 搜索分；为当前候选集合内的相对分。"
            ] })
          ] }),
          /* @__PURE__ */ i("article", { className: "report-panel", children: [
            /* @__PURE__ */ n("h4", { children: "机会矩阵" }),
            /* @__PURE__ */ n("p", { children: "把站内成交与站外搜索拆开，解释分歧而不是藏在总分里。" }),
            /* @__PURE__ */ i("div", { className: "report-matrix", children: [
              /* @__PURE__ */ i(
                "div",
                {
                  className: [
                    gA({
                      "is-active": r === "weak-strong"
                    })
                  ].filter(Boolean).join(" "),
                  children: [
                    "成交弱 · 搜索强",
                    /* @__PURE__ */ n("span", { children: "●" })
                  ]
                }
              ),
              /* @__PURE__ */ i(
                "div",
                {
                  className: [
                    gA({
                      "is-active": r === "strong-strong"
                    })
                  ].filter(Boolean).join(" "),
                  children: [
                    "成交强 · 搜索强",
                    /* @__PURE__ */ n("span", { children: "●" })
                  ]
                }
              ),
              /* @__PURE__ */ i(
                "div",
                {
                  className: [
                    gA({
                      "is-active": r === "weak-weak"
                    })
                  ].filter(Boolean).join(" "),
                  children: [
                    "成交弱 · 搜索弱",
                    /* @__PURE__ */ n("span", { children: "●" })
                  ]
                }
              ),
              /* @__PURE__ */ i(
                "div",
                {
                  className: [
                    gA({
                      "is-active": r === "strong-weak"
                    })
                  ].filter(Boolean).join(" "),
                  children: [
                    "成交强 · 搜索弱",
                    /* @__PURE__ */ n("span", { children: "●" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("p", { className: "report-panel__foot", children: l })
          ] })
        ] })
      ]
    }
  ) });
}
function Fz({
  reportId: A,
  currentCategory: t
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-product-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-product-title", children: "代表商品" }),
            /* @__PURE__ */ n("span", { children: "用于理解切入方向，需继续通过商品筛选与货源验证" })
          ] }),
          /* @__PURE__ */ i("span", { className: "report-source", children: [
            /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
            H("tk")
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "report-table-wrap", children: /* @__PURE__ */ i("table", { className: "report-table report-product-table", children: [
          /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ i("tr", { children: [
            /* @__PURE__ */ n("th", { children: "商品方向" }),
            /* @__PURE__ */ n("th", { children: "价格" }),
            /* @__PURE__ */ n("th", { children: "榜单样本销量" }),
            /* @__PURE__ */ n("th", { children: "商品增长率" }),
            /* @__PURE__ */ n("th", { children: "达人推广计数" }),
            /* @__PURE__ */ n("th", { children: "榜单来源" })
          ] }) }),
          /* @__PURE__ */ n("tbody", { children: t.products.map((r, l) => /* @__PURE__ */ i("tr", { children: [
            /* @__PURE__ */ n("td", { children: /* @__PURE__ */ i("div", { className: "report-product-cell", children: [
              Zr(r.name) && /* @__PURE__ */ n(
                "img",
                {
                  src: Zr(
                    r.name
                  ),
                  alt: "",
                  loading: "lazy",
                  className: "report-product-thumb"
                }
              ),
              !Zr(r.name) && /* @__PURE__ */ n("span", { className: "report-product-thumb", children: String(l + 1).padStart(
                2,
                "0"
              ) }),
              /* @__PURE__ */ i("span", { children: [
                /* @__PURE__ */ n("b", { children: r.name }),
                /* @__PURE__ */ i("small", { children: [
                  "代表商品方向 ",
                  String(l + 1).padStart(
                    2,
                    "0"
                  ),
                  " · 演示条目"
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ n("td", { className: "report-number", children: r.price }),
            /* @__PURE__ */ n("td", { className: "report-number", children: r.units.toLocaleString("en-US") }),
            /* @__PURE__ */ i("td", { className: "report-number is-positive", children: [
              "+",
              r.growth,
              "%"
            ] }),
            /* @__PURE__ */ n("td", { className: "report-number", children: r.promoters }),
            /* @__PURE__ */ n("td", { children: /* @__PURE__ */ n("span", { className: "report-pill", children: r.source }) })
          ] }, r.name)) })
        ] }) })
      ]
    }
  ) });
}
function Bz({
  reportId: A,
  currentCategory: t
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-rank-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-rank-title", children: "三榜表现" }),
            /* @__PURE__ */ n("span", { children: "成交、内容扩散、新品冷启动分别观察" })
          ] }),
          /* @__PURE__ */ i("span", { className: "report-source", children: [
            /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
            H("tk")
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "report-rank-grid", children: [
          /* @__PURE__ */ i("article", { className: "report-mini-card", children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ n("b", { children: "销量榜" }),
              /* @__PURE__ */ i("span", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                H("tk")
              ] })
            ] }),
            /* @__PURE__ */ n("small", { children: "近一期榜单 Top-K 商品成交" }),
            /* @__PURE__ */ i("strong", { children: [
              t.units.toLocaleString("en-US"),
              /* @__PURE__ */ n("em", { children: "件" })
            ] }),
            /* @__PURE__ */ i("p", { children: [
              "样本 GMV ",
              ie(t.gmv),
              /* @__PURE__ */ i("mark", { children: [
                "商品增长率 +",
                t.growth,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ i("article", { className: "report-mini-card", children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ n("b", { children: "热推榜" }),
              /* @__PURE__ */ i("span", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                H("tk")
              ] })
            ] }),
            /* @__PURE__ */ n("small", { children: "当前被达人推广的商品" }),
            /* @__PURE__ */ i("strong", { children: [
              t.promoters.toLocaleString("en-US"),
              /* @__PURE__ */ n("em", { children: "达人累计计数*" })
            ] }),
            /* @__PURE__ */ i("p", { children: [
              "销量榜重合 ",
              t.promotionOverlap,
              "% ",
              /* @__PURE__ */ n("mark", { children: "内容扩散" })
            ] })
          ] }),
          /* @__PURE__ */ i("article", { className: "report-mini-card", children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ n("b", { children: "新品榜" }),
              /* @__PURE__ */ i("span", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                H("tk")
              ] })
            ] }),
            /* @__PURE__ */ n("small", { children: "上架后第 3 天榜单样本" }),
            /* @__PURE__ */ i("strong", { children: [
              t.newUnits.toLocaleString("en-US"),
              /* @__PURE__ */ n("em", { children: "件 / 3 日" })
            ] }),
            /* @__PURE__ */ i("p", { children: [
              "榜单样本口径 · 3 日累计 ",
              /* @__PURE__ */ n("mark", { children: "冷启动表现" })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function Tz({
  reportId: A,
  currentCategory: t
}) {
  return /* @__PURE__ */ n(AA, { children: /* @__PURE__ */ i(
    "section",
    {
      "aria-labelledby": A + "-supply-title",
      className: "report-section",
      children: [
        /* @__PURE__ */ i("div", { className: "report-section__heading", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("h3", { id: A + "-supply-title", children: "竞争与供给结构" }),
            /* @__PURE__ */ n("span", { children: "以下全部是榜单 Top-K 样本口径" })
          ] }),
          /* @__PURE__ */ i("span", { className: "report-source", children: [
            /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
            H("tk")
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "report-supply-grid", children: [
          {
            label: "Top 5 商品集中度",
            value: `${t.productConcentration}%`,
            note: "Top 5 商品销量 ÷ 榜单样本销量"
          },
          {
            label: "Top 5 店铺集中度",
            value: `${t.shopConcentration}%`,
            note: "Top 5 店铺销量 ÷ 榜单样本销量"
          },
          {
            label: "销量 × 热推榜重合",
            value: `${t.promotionOverlap}%`,
            note: "两榜重合商品 ÷ 销量榜商品"
          },
          {
            label: "销量 × 新品榜重合",
            value: `${t.newProductOverlap}%`,
            note: "两榜重合商品 ÷ 销量榜商品"
          }
        ].map((r) => /* @__PURE__ */ i(
          "article",
          {
            className: "report-supply-card",
            children: [
              /* @__PURE__ */ i("span", { className: "report-source", children: [
                /* @__PURE__ */ n("img", { src: D("tk"), alt: "" }),
                H("tk")
              ] }),
              /* @__PURE__ */ n("small", { children: r.label }),
              /* @__PURE__ */ n("strong", { children: r.value }),
              /* @__PURE__ */ n("p", { children: r.note })
            ]
          },
          r.label
        )) })
      ]
    }
  ) });
}
function Pz({
  onViewList: A
}) {
  const t = zt(), [r, l] = $("score"), [e, u] = $("travel"), [a, I] = $(!1), z = hA(null);
  CA(() => {
    if (!a) return;
    const M = z.current, W = M?.ownerDocument.activeElement;
    return M?.querySelector("button")?.focus(), () => {
      W?.focus();
    };
  }, [a]);
  const V = u, d = Xz, p = d.find((M) => M.id === e) ?? d[0], E = [...d].sort((M, W) => r === "units" ? W.units - M.units : r === "gmv" ? W.gmv - M.gmv : W.opportunityScore - M.opportunityScore), q = E.findIndex((M) => M.id === p.id) + 1, m = `在当前候选类目中，「${p.name}」的平台机会分为 ${p.platformScore}，Google 搜索分为 ${p.searchScore}。报告推荐把它作为下一步商品筛选类目。`, v = (() => {
    const M = p.platformScore >= 70, W = p.searchScore >= 50;
    return M && W ? "strong-strong" : M ? "strong-weak" : W ? "weak-strong" : "weak-weak";
  })(), c = {
    "strong-strong": "榜单成交与搜索需求同步走强，可优先进入商品验证。",
    "strong-weak": "TikTok 榜单表现较强，搜索相对弱；应重点观察内容带货持续性。",
    "weak-strong": "搜索需求较强但榜单成交偏弱，先验证供给和内容转化。",
    "weak-weak": "平台和搜索信号都偏弱，建议暂缓进入或缩小测试预算。"
  }[v];
  return /* @__PURE__ */ i("section", { "aria-label": "选品报告", className: "workflow-research-report", children: [
    /* @__PURE__ */ n(
      Oz,
      {
        setFormulaOpen: I,
        onViewList: A
      }
    ),
    /* @__PURE__ */ n(oz, {}),
    /* @__PURE__ */ n(
      gz,
      {
        reportId: t,
        currentCategory: p,
        currentList: d,
        currentRank: q,
        heroSummary: m
      }
    ),
    /* @__PURE__ */ n(
      Gz,
      {
        reportId: t,
        currentCategory: p,
        sortedCategories: E,
        sortKey: r,
        setSortKey: l,
        chooseCategory: V
      }
    ),
    /* @__PURE__ */ n(
      Bz,
      {
        reportId: t,
        currentCategory: p
      }
    ),
    /* @__PURE__ */ n(
      Rz,
      {
        reportId: t,
        currentCategory: p
      }
    ),
    /* @__PURE__ */ n(
      Nz,
      {
        reportId: t,
        currentCategory: p,
        matrixType: v,
        matrixCopy: c
      }
    ),
    /* @__PURE__ */ n(
      Tz,
      {
        reportId: t,
        currentCategory: p
      }
    ),
    /* @__PURE__ */ n(
      Fz,
      {
        reportId: t,
        currentCategory: p
      }
    ),
    /* @__PURE__ */ n(
      Yz,
      {
        reportId: t,
        currentCategory: p
      }
    ),
    /* @__PURE__ */ n(yz, {}),
    /* @__PURE__ */ n(
      jz,
      {
        reportId: t,
        formulaOpen: a,
        setFormulaOpen: I,
        formulaDialog: z
      }
    )
  ] });
}
const qe = (A) => {
  if (A === null || typeof A != "object") return !1;
  const t = Object.getPrototypeOf(A);
  return t === Object.prototype || t === null;
};
function kz(A) {
  if (!Array.isArray(A)) return "表格 columns 必须是列配置数组。";
  const t = /* @__PURE__ */ new Set();
  for (const [r, l] of A.entries()) {
    const e = `第 ${r + 1} 列配置错误：`;
    if (!qe(l)) return `${e}必须是非空普通对象。`;
    if (typeof l.key != "string" || !l.key.trim())
      return `${e}key 必须是非空字符串。`;
    if (t.has(l.key)) return `${e}key 重复，请提供唯一列 key。`;
    if (t.add(l.key), typeof l.title != "string")
      return `${e}title 必须是字符串。`;
    if (l.width !== void 0 && (typeof l.width != "number" || !Number.isFinite(l.width) || l.width <= 0))
      return `${e}width 必须是有限正数。`;
    if (l.format !== void 0 && l.format !== "text" && l.format !== "money")
      return `${e}format 仅支持 text 或 money。`;
    if (l.actionLabel !== void 0 && typeof l.actionLabel != "string")
      return `${e}actionLabel 必须是字符串。`;
  }
  return "";
}
function Lz(A) {
  let t = "";
  if (!Array.isArray(A.rows))
    t = "表格 rows 必须是行数据数组。";
  else {
    const e = A.rows.findIndex((u) => !qe(u));
    e >= 0 && (t = `第 ${e + 1} 行数据无效：必须是非空普通对象，不能是 null、数组或其他值。`);
  }
  const r = kz(A.columns);
  t ||= r, (typeof A.rowKey != "string" || !A.rowKey.trim()) && (t ||= "表格 rowKey 必须是非空字符串。"), A.paginationMode !== "client" && A.paginationMode !== "server" && (t ||= "表格 paginationMode 仅支持 client 或 server。");
  const l = A.selectedKeys === void 0 || Array.isArray(A.selectedKeys) && A.selectedKeys.every((e) => typeof e == "string");
  return l || (t ||= "表格 selectedKeys 必须是字符串数组。"), {
    rows: t ? [] : A.rows,
    columns: r ? [] : A.columns,
    rowKey: typeof A.rowKey == "string" ? A.rowKey : "id",
    selectedKeys: l ? A.selectedKeys ?? [] : [],
    configurationError: t
  };
}
const k3 = (A, t) => Number.isFinite(A) && A >= 1 ? Math.min(Number.MAX_SAFE_INTEGER, Math.floor(A)) : t;
function wz(A) {
  const t = Lz(A), { rows: r, columns: l, rowKey: e, selectedKeys: u } = t, { paginationMode: a } = A, I = k3(A.pageSize, 10), z = a === "client" ? r.length : Number.isFinite(A.total) ? Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.max(0, Math.floor(A.total))
  ) : 0, V = Math.max(1, Math.ceil(z / I)), d = Math.min(k3(A.page, 1), V);
  let p = t.configurationError;
  const E = [], q = /* @__PURE__ */ new Set();
  for (const [c, M] of r.entries()) {
    const W = M[e];
    if (!e.trim() || typeof W != "string" && typeof W != "number" || typeof W == "number" && !Number.isFinite(W) || !String(W).trim()) {
      p = `第 ${c + 1} 行缺少有效唯一标识（rowKey: ${e || "未配置"}），请提供非空字符串或有限数字。`;
      break;
    }
    const C = String(W);
    if (q.has(C)) {
      p = `行标识重复：${C}（rowKey: ${e}），请提供唯一行标识。`;
      break;
    }
    q.add(C), E.push(C);
  }
  const m = a === "client" ? (d - 1) * I : 0, v = a === "client" ? m + I : r.length;
  return {
    page: d,
    pageSize: I,
    total: z,
    pageCount: V,
    configurationError: p,
    columns: l,
    selectedKeys: u,
    visibleRows: p ? [] : r.slice(m, v).map((c, M) => ({
      row: c,
      id: E[m + M]
    }))
  };
}
function Jz(A, t, r) {
  const l = new Set(A);
  for (const e of t)
    r ? l.add(e) : l.delete(e);
  return [...l];
}
const Dz = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function Hz(A, t) {
  if (A == null || A === "") return "—";
  if (t === "money") {
    const r = typeof A == "number" ? A : typeof A == "string" && A.trim() ? Number(A) : NaN;
    if (Number.isFinite(r)) return Dz.format(r);
  }
  if (typeof A == "object")
    try {
      return JSON.stringify(A) ?? "—";
    } catch {
      return "[无法显示的值]";
    }
  return String(A);
}
function Or({
  text: A,
  focusable: t = !0
}) {
  return /* @__PURE__ */ i(DA, { children: [
    /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ n(
      "span",
      {
        tabIndex: t ? 0 : void 0,
        className: "block min-w-0 truncate",
        children: A
      }
    ) }),
    /* @__PURE__ */ n(_A, { className: "max-w-sm break-words", children: A })
  ] });
}
function _z({
  columns: A,
  visibleRows: t,
  selected: r,
  selectable: l,
  blocked: e,
  status: u,
  error: a,
  retryDisabled: I,
  onRetry: z,
  onSelect: V,
  onRowAction: d
}) {
  return /* @__PURE__ */ n(pl, { children: u ? /* @__PURE__ */ n(LA, { children: /* @__PURE__ */ n(
    lt,
    {
      colSpan: Math.max(
        1,
        A.length + Number(l)
      ),
      children: /* @__PURE__ */ i(
        "div",
        {
          className: "flex min-w-0 flex-wrap items-center justify-center gap-3",
          role: a ? "alert" : "status",
          children: [
            /* @__PURE__ */ n("span", { className: "min-w-0 whitespace-normal break-words", children: u }),
            z && /* @__PURE__ */ n(
              T,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                disabled: I,
                onClick: () => {
                  I || z();
                },
                children: "重试"
              }
            )
          ]
        }
      )
    }
  ) }) : t.map(({ row: p, id: E }) => /* @__PURE__ */ i(
    LA,
    {
      "data-state": r.has(E) ? "selected" : void 0,
      children: [
        l && /* @__PURE__ */ n(lt, { children: /* @__PURE__ */ n(
          qt,
          {
            "aria-label": `选择行 ${E}`,
            checked: r.has(E),
            disabled: e || !V,
            onCheckedChange: (q) => {
              e || V?.([E], q === !0);
            }
          }
        ) }),
        A.map((q) => /* @__PURE__ */ n(lt, { children: q.actionLabel !== void 0 ? /* @__PURE__ */ n(
          T,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "max-w-full",
            disabled: e || !d,
            onClick: () => {
              e || d?.(p, q.key);
            },
            children: /* @__PURE__ */ n(
              Or,
              {
                text: q.actionLabel,
                focusable: !1
              }
            )
          }
        ) : /* @__PURE__ */ n(
          Or,
          {
            text: Hz(
              p[q.key],
              q.format
            )
          }
        ) }, q.key))
      ]
    },
    E
  )) });
}
const me = (A, t) => {
  if (t <= 3)
    return Array.from({ length: t }, (u, a) => a + 1);
  const r = [];
  r.push(1), A > 3 && r.push("ellipsis");
  const l = Math.max(2, A - 1), e = Math.min(t - 1, A + 1);
  for (let u = l; u <= e; u++)
    r.push(u);
  return A < t - 2 && r.push("ellipsis"), r.push(t), r;
};
function $z({
  page: A,
  pageSize: t,
  total: r,
  pageCount: l,
  disabled: e,
  onPageChange: u,
  onPageSizeChange: a
}) {
  const I = [.../* @__PURE__ */ new Set([10, 20, 50, 100, t])].sort(
    (d, p) => d - p
  ), z = (d) => {
    e || d === A || d < 1 || d > l || u?.(d);
  }, V = (d) => {
    const p = Number(d);
    e || p === t || !I.includes(p) || a?.(p);
  };
  return /* @__PURE__ */ i("div", { className: "flex min-w-0 flex-wrap items-center justify-end gap-3", children: [
    /* @__PURE__ */ i("span", { children: [
      "共 ",
      r,
      " 条"
    ] }),
    /* @__PURE__ */ i(
      Wt,
      {
        value: String(t),
        disabled: e || !a,
        onValueChange: V,
        children: [
          /* @__PURE__ */ n(Zt, { size: "sm", "aria-label": "每页条数", children: /* @__PURE__ */ n(Ct, {}) }),
          /* @__PURE__ */ n(ft, { children: I.map((d) => /* @__PURE__ */ i(bt, { value: String(d), children: [
            d,
            " 条 / 页"
          ] }, d)) })
        ]
      }
    ),
    /* @__PURE__ */ i(
      "nav",
      {
        "aria-label": "表格分页",
        className: "flex flex-wrap items-center gap-1",
        children: [
          /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: e || !u || A <= 1,
              onClick: () => z(A - 1),
              children: "上一页"
            }
          ),
          me(A, l).map(
            (d, p) => d === "ellipsis" ? /* @__PURE__ */ n("span", { "aria-hidden": "true", children: "…" }, `gap-${p}`) : /* @__PURE__ */ n(
              T,
              {
                type: "button",
                variant: A === d ? "outline" : "ghost",
                size: "icon-sm",
                "aria-label": `第 ${d} 页`,
                "aria-current": A === d ? "page" : void 0,
                disabled: e || !u,
                onClick: () => z(d),
                children: d
              },
              d
            )
          ),
          /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: e || !u || A >= l,
              onClick: () => z(A + 1),
              children: "下一页"
            }
          )
        ]
      }
    )
  ] });
}
function Ad({
  rows: A = [],
  columns: t = [],
  rowKey: r = "id",
  page: l = 1,
  pageSize: e = 10,
  total: u = 0,
  paginationMode: a = "client",
  selectedKeys: I = [],
  selectable: z = !1,
  loading: V = !1,
  error: d = "",
  disabled: p = !1,
  onPageChange: E,
  onPageSizeChange: q,
  onSelectionChange: m,
  onRowAction: v,
  onRetry: c
} = {}) {
  const M = wz({
    rows: A,
    columns: t,
    rowKey: r,
    page: l,
    pageSize: e,
    total: u,
    paginationMode: a,
    selectedKeys: I
  }), W = typeof d == "string" ? d || M.configurationError : "表格 error 必须是字符串。", C = p || V || !!W, Z = M.visibleRows.map(({ id: Q }) => Q), b = new Set(M.selectedKeys), U = Z.filter((Q) => b.has(Q)).length, f = (Q, x) => {
    C || !z || typeof m == "function" && m(
      Jz(M.selectedKeys, Q, x)
    );
  }, h = M.columns.map(
    (Q) => Number.isFinite(Q.width) && Number(Q.width) > 0 ? Q.width : 180
  ), K = W || (V ? "正在加载…" : M.columns.length === 0 ? "请配置表格列" : M.visibleRows.length === 0 ? "暂无数据" : "");
  return /* @__PURE__ */ i(
    "div",
    {
      className: "flex w-full min-w-0 max-w-full flex-col gap-3",
      "aria-busy": V,
      children: [
        /* @__PURE__ */ i(
          il,
          {
            className: "table-fixed",
            containerClassName: "min-w-0 max-w-full",
            style: {
              minWidth: h.reduce(
                (Q, x) => Q + x,
                z ? 48 : 0
              )
            },
            "aria-label": "数据表格",
            children: [
              /* @__PURE__ */ i("colgroup", { children: [
                z && /* @__PURE__ */ n("col", { style: { width: 48 } }),
                h.map((Q, x) => /* @__PURE__ */ n("col", { style: { width: Q } }, x))
              ] }),
              /* @__PURE__ */ n(ql, { children: /* @__PURE__ */ i(LA, { children: [
                z && /* @__PURE__ */ n(Yr, { children: /* @__PURE__ */ n(
                  qt,
                  {
                    "aria-label": "选择本页全部行",
                    checked: Z.length > 0 && U === Z.length ? !0 : U > 0 ? "indeterminate" : !1,
                    disabled: C || !m || Z.length === 0,
                    onCheckedChange: (Q) => f(
                      Z,
                      Q === !0
                    )
                  }
                ) }),
                M.columns.map((Q, x) => /* @__PURE__ */ n(Yr, { children: /* @__PURE__ */ n(Or, { text: Q.title }) }, x))
              ] }) }),
              /* @__PURE__ */ n(
                _z,
                {
                  columns: M.columns,
                  visibleRows: M.visibleRows,
                  selected: b,
                  selectable: z,
                  blocked: C,
                  status: K,
                  error: !!W,
                  retryDisabled: p || V,
                  onRetry: d && typeof c == "function" ? c : void 0,
                  onSelect: m ? f : void 0,
                  onRowAction: typeof v == "function" ? v : void 0
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ n(
          $z,
          {
            page: M.page,
            pageSize: M.pageSize,
            total: M.total,
            pageCount: M.pageCount,
            disabled: C,
            onPageChange: typeof E == "function" ? E : void 0,
            onPageSizeChange: typeof q == "function" ? q : void 0
          }
        )
      ]
    }
  );
}
function td(A, t) {
  const r = (l, e = /* @__PURE__ */ new Set(), u = 0) => {
    if (l === null || typeof l == "string" || typeof l == "boolean" || typeof l == "number" && Number.isFinite(l)) return l;
    if (u > 20 || !l || typeof l != "object")
      throw new Error("事件参数不是可保存的数据，请检查取值路径");
    if (e.has(l))
      throw new Error("事件参数包含循环引用，请选择具体字段");
    e.add(l);
    try {
      if (Array.isArray(l))
        return l.map((I) => r(I, e, u + 1));
      const a = Object.getPrototypeOf(l);
      if (a !== Object.prototype && a !== null)
        throw new Error("请从事件对象中选择具体字段，例如 target.value");
      return Object.fromEntries(
        Object.entries(l).map(([I, z]) => {
          if (!Er(I))
            throw new Error("事件参数包含不允许的属性名");
          return [I, r(z, e, u + 1)];
        })
      );
    } finally {
      e.delete(l);
    }
  };
  return Object.fromEntries(
    Object.entries(A.arguments).map(([l, e]) => {
      if (!Er(l)) throw new Error("事件参数名称无效");
      if (!Number.isInteger(e.argument) || e.argument < 0 || e.argument >= t.length)
        throw new Error(`事件参数 ${l} 的参数序号无效`);
      let u = t[e.argument];
      for (const a of e.path) {
        if (!Er(a)) throw new Error("禁止读取原型链属性");
        if (u == null || typeof u != "object")
          throw new Error(`事件参数 ${l} 的路径不存在`);
        u = u[a];
      }
      return [l, r(u)];
    })
  );
}
function rd(A) {
  if (A.options?.length)
    return {
      type: "select",
      label: A.label,
      options: A.options.map((t) => ({
        label: String(t),
        value: t
      }))
    };
  if (A.type === "string") return { type: "text", label: A.label };
  if (A.type === "number") return { type: "number", label: A.label };
  if (A.type === "boolean")
    return {
      type: "radio",
      label: A.label,
      options: [
        { label: "是", value: !0 },
        { label: "否", value: !1 }
      ]
    };
}
function Cr(A, t) {
  const r = Object.fromEntries(
    Object.entries(A.props).flatMap(([u, a]) => {
      const I = rd(a);
      return I ? [[u, I]] : [];
    })
  ), l = Object.fromEntries(
    Object.entries(A.props).filter(([, u]) => u.default !== void 0).map(([u, a]) => [u, a.default])
  );
  function e(u) {
    const a = k(), I = at(wt), [z, V] = $(""), d = {};
    for (const [E, q] of Object.entries(A.props)) {
      const m = u[E] === void 0 ? q.default : u[E];
      if (m === void 0 && !q.required) continue;
      const v = y7(q).safeParse(m);
      if (!v.success)
        return /* @__PURE__ */ i("p", { role: "alert", children: [
          A.label,
          "：",
          q.label,
          " 的值不符合组件要求"
        ] });
      d[E] = v.data;
    }
    const p = N7(A).safeParse(
      u.lcEvents ?? {}
    );
    if (!p.success)
      return /* @__PURE__ */ i("p", { role: "alert", children: [
        A.label,
        "：事件参数配置无效"
      ] });
    for (const E of Object.keys(A.events))
      d[E] = (...q) => {
        if (a.mode === "design" || d.disabled === !0)
          return;
        const m = p.data[E];
        if (m?.eventId)
          try {
            const v = td(m, q);
            V(""), I.engine.core.executeEvent(
              m.eventId,
              {
                scope: a.scope,
                row: a.scope.row ?? null,
                params: v
              },
              /Change$/.test(E)
            ).catch((c) => {
              c?.name !== "AbortError" && c?.name !== "StaleExecutionError" && V(
                c instanceof Error ? c.message : "事件执行失败"
              );
            });
          } catch (v) {
            V(
              v instanceof Error ? v.message : "事件参数读取失败"
            );
          }
      };
    return a.mode === "design" && "disabled" in A.props && (d.disabled = !0), /* @__PURE__ */ i("div", { className: "min-w-0 w-full", children: [
      yt(t, d),
      z && /* @__PURE__ */ n("p", { role: "alert", children: z })
    ] });
  }
  return {
    label: A.label,
    defaultProps: { ...l, lcEvents: {} },
    fields: r,
    render: e
  };
}
const L3 = {
  ConfigurableInput: Cr(
    pr.ConfigurableInput,
    JA
  ),
  ConfigurableTable: Cr(
    pr.ConfigurableTable,
    Ad
  ),
  WorkflowResearchReport: Cr(
    pr.WorkflowResearchReport,
    Pz
  )
};
function ld({
  className: A,
  variant: t = "default",
  ...r
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card",
      "data-variant": t,
      className: X(
        "bg-card text-card-foreground flex border",
        t === "account" ? "min-h-28 flex-col gap-[5px] rounded-xl pt-2.5 pr-3 pb-3 pl-2.5 shadow-sm" : t === "platform" ? "min-h-[106px] flex-col gap-2 rounded-xl p-2 shadow-sm" : t === "row" ? "min-h-21 flex-row items-center gap-3.5 rounded-[14px] px-4 py-3.5" : "flex-col gap-6 rounded-xl py-6 shadow-sm",
        A
      ),
      ...r
    }
  );
}
function ed({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-header",
      className: X(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        A
      ),
      ...t
    }
  );
}
function ud({
  className: A,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-title",
      className: X(
        t === "sm" ? "text-base leading-6 font-medium" : "leading-none font-semibold",
        A
      ),
      ...r
    }
  );
}
function ad({ className: A, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-content",
      className: X("px-6", A),
      ...t
    }
  );
}
function nd({
  title: A,
  appearance: t,
  content: r
}) {
  return /* @__PURE__ */ i(
    ld,
    {
      className: "min-w-0 w-full",
      style: t ? zA(t) : void 0,
      children: [
        /* @__PURE__ */ n(ed, { children: /* @__PURE__ */ n(ud, { children: /* @__PURE__ */ n(L, { text: A }) }) }),
        /* @__PURE__ */ n(ad, { children: /* @__PURE__ */ n(r, {}) })
      ]
    }
  );
}
function Id({
  direction: A,
  gap: t,
  justify: r = "start",
  wrap: l = "wrap",
  align: e,
  content: u
}) {
  const { mode: a } = k();
  return /* @__PURE__ */ n(
    u,
    {
      style: {
        display: "flex",
        flexDirection: A,
        flexWrap: A === "row" ? l : "nowrap",
        justifyContent: r,
        gap: t,
        minWidth: a === "design" ? 100 : 0,
        padding: a === "design" ? 12 : void 0,
        alignItems: e ?? (A === "row" ? "center" : "stretch")
      }
    }
  );
}
function zd({
  formId: A,
  layout: t = "vertical",
  columns: r,
  minColumnWidth: l = 240,
  gap: e = 20,
  content: u
}) {
  const { scope: a } = k();
  return /* @__PURE__ */ n(Jt, { value: { ...a, formId: A }, children: /* @__PURE__ */ n(Nu, { children: /* @__PURE__ */ n(
    u,
    {
      style: {
        display: t === "grid" ? "grid" : "flex",
        gridTemplateColumns: t === "grid" ? `repeat(auto-fit, minmax(min(100%, ${r ? `max(${l}px, calc((100% - ${e * (r - 1)}px) / ${r}))` : `${l}px`}), 1fr))` : void 0,
        flexDirection: "column",
        gap: e
      }
    }
  ) }) });
}
const j = (A) => ({ type: "text", label: A }), w3 = (A) => ({ type: "number", label: A, min: 0 }), yA = (A, t) => ({
  type: "select",
  label: A,
  options: t.map((r) => ({ label: r, value: r }))
}), Tt = (A) => ({
  type: "radio",
  label: A,
  options: [
    { label: "是", value: !0 },
    { label: "否", value: !1 }
  ]
}), Me = {
  type: "select",
  label: "执行状态",
  options: Object.entries(Jr).map(([A, t]) => ({
    value: A,
    label: t
  }))
}, V3 = { dataSourceId: j("数据源（同名字段对象）") }, dt = { id: j("唯一标识"), title: j("标题") }, J3 = {
  id: j("唯一标识"),
  label: j("按钮文案"),
  eventId: j("事件 ID"),
  tone: yA("按钮语义", ["primary", "warning"]),
  disabled: Tt("禁用"),
  pending: Tt("执行中")
}, dd = {
  ...V3,
  title: j("旧版摘要（无记录时使用）"),
  eventId: j("展开/收起事件"),
  elapsed: j("耗时"),
  elapsedLabel: j("耗时标签"),
  emptyText: j("无记录提示"),
  entries: {
    type: "array",
    label: "处理记录（最新在前）",
    arrayFields: {
      id: j("唯一标识"),
      tag: j("标签"),
      text: j("处理内容"),
      tone: yA("记录类型", ["route", "reason", "tool", "status"]),
      state: yA("记录状态", ["running", "succeeded", "failed"])
    },
    defaultItemProps: { id: "", tag: "", text: "", tone: "status" }
  }
}, Vd = {
  ...V3,
  nodeKey: j("运行/节点标识"),
  status: Me,
  text: j("状态文案"),
  current: w3("当前进度"),
  total: w3("总量（0 时仅显示状态）"),
  progressLabel: j("进度标签"),
  progressText: j("进度文案（留空显示当前/总量）"),
  tone: yA("提示语义", ["info", "success", "danger"]),
  dismissible: Tt("允许关闭"),
  eventId: j("关闭事件")
}, Ed = {
  ...V3,
  nodeKey: j("运行/节点标识"),
  title: j("节点标题"),
  status: Me,
  statusLabel: j("状态文案"),
  controller: yA("控制者", ["human", "agent"]),
  steps: {
    type: "array",
    label: "执行步骤",
    arrayFields: {
      ...dt,
      detail: j("说明"),
      status: yA("步骤状态", [
        "queued",
        "running",
        "succeeded",
        "blocked"
      ])
    },
    defaultItemProps: { id: "", title: "", detail: "", status: "queued" }
  },
  capabilities: { type: "array", label: "原子能力", arrayFields: dt },
  sources: {
    type: "array",
    label: "数据来源说明",
    arrayFields: {
      ...dt,
      detail: j("详情"),
      usage: j("用途"),
      badge: j("标签"),
      badgeTone: yA("标签语义", ["authorized", "proxy", "estimate"])
    }
  },
  outputs: {
    type: "array",
    label: "输出",
    arrayFields: {
      ...dt,
      kind: yA("输出类型", ["table", "document"]),
      format: j("格式说明"),
      disabled: Tt("禁用"),
      eventId: j("查看事件 ID")
    },
    defaultItemProps: { id: "", title: "", kind: "table" }
  },
  guide: {
    type: "object",
    label: "人工处理提示",
    objectFields: {
      title: j("标题"),
      validationMessage: j("校验提示"),
      issues: {
        type: "array",
        label: "待处理项",
        arrayFields: { ...dt, detail: j("说明") }
      }
    }
  },
  notice: {
    type: "object",
    label: "提示",
    objectFields: { title: j("标题"), detail: j("说明") }
  },
  failure: {
    type: "object",
    label: "失败说明",
    objectFields: { detail: j("失败原因"), impact: j("影响") }
  },
  resultSummary: {
    type: "object",
    label: "执行结果摘要",
    objectFields: { count: j("数量摘要"), detail: j("结果说明") }
  },
  actions: { type: "array", label: "底部操作", arrayFields: J3 },
  moreActions: { type: "array", label: "更多操作", arrayFields: J3 },
  footer: { type: "slot", label: "兼容旧版底栏（未配置操作时显示）" }
}, pd = /* @__PURE__ */ new Set(["http:", "https:", "mailto:", "tel:"]);
function ve(A) {
  const t = A.trim();
  if (!t) return "";
  try {
    const r = new URL(t);
    return pd.has(r.protocol) ? r.toString() : "";
  } catch {
    return "";
  }
}
const id = async (A) => {
  const t = ve(A);
  if (!(!t || typeof window > "u")) {
    if (Q7())
      try {
        await S7("open_external_url", { url: t });
        return;
      } catch {
      }
    window.open(t, "_blank", "noopener,noreferrer");
  }
}, qd = {
  external: uu,
  check: Lt,
  download: al,
  plus: kr,
  refresh: ul,
  sparkles: nl
};
function D3({
  icon: A = "none",
  iconImage: t,
  iconSize: r = 16
}) {
  const l = { width: r, height: r, flexShrink: 0 };
  if (A === "custom")
    return t && Wl(t.src) ? /* @__PURE__ */ n(
      "img",
      {
        src: t.src,
        alt: "",
        "aria-hidden": "true",
        draggable: !1,
        style: { ...l, objectFit: "contain" }
      }
    ) : null;
  const e = A === "none" ? void 0 : qd[A];
  return e ? /* @__PURE__ */ n(e, { "aria-hidden": "true", style: l }) : null;
}
function md({
  text: A,
  href: t,
  binding: r,
  hrefBinding: l,
  eventId: e,
  appearance: u,
  linkAppearance: a,
  icon: I = "external",
  iconImage: z,
  iconSize: V = 12,
  iconPosition: d = "end",
  iconGap: p,
  busyScope: E,
  busyEventId: q
}) {
  const m = k(), v = r ? String(m.resolve(r) ?? A) : A, c = ve(
    l ? String(m.resolve(l) ?? "") : t
  ), M = m.mode === "design" || !/^https?:/.test(c) || Hr(
    m.state.busy,
    m.definition.logic.events,
    { busyScope: E, busyEventId: q },
    [e]
  );
  return /* @__PURE__ */ i(
    T,
    {
      variant: "source-link",
      size: "inline",
      className: "max-w-full self-start justify-start",
      style: {
        fontSize: u?.fontSize,
        lineHeight: u?.lineHeight,
        ...Object.fromEntries(
          Object.entries(zA(a)).filter(
            ([, W]) => W !== void 0
          )
        ),
        ...p !== void 0 ? { gap: p } : {}
      },
      disabled: M,
      onClick: () => {
        id(c), e && m.execute(e).catch(() => {
        });
      },
      children: [
        d === "start" && /* @__PURE__ */ n(
          D3,
          {
            icon: I,
            iconImage: z,
            iconSize: V
          }
        ),
        /* @__PURE__ */ n(L, { text: v }),
        d === "end" && /* @__PURE__ */ n(
          D3,
          {
            icon: I,
            iconImage: z,
            iconSize: V
          }
        )
      ]
    }
  );
}
function ct({
  text: A,
  lines: t = 1,
  focusable: r = !0
}) {
  const [l, e] = $(!1);
  return /* @__PURE__ */ i(DA, { open: l, onOpenChange: e, children: [
    /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ n(
      "span",
      {
        className: "node-execution-text",
        tabIndex: r ? 0 : void 0,
        style: t > 1 ? {
          display: "-webkit-box",
          WebkitLineClamp: t,
          WebkitBoxOrient: "vertical",
          whiteSpace: "normal"
        } : void 0,
        onClick: r ? () => e(!l) : void 0,
        children: A
      }
    ) }),
    /* @__PURE__ */ n(_A, { className: "max-w-[min(24rem,calc(100vw-24px))] break-words", children: A })
  ] });
}
function Md({
  entries: A,
  elapsed: t,
  elapsedLabel: r = "用时",
  defaultExpanded: l = !1,
  expanded: e,
  onExpandedChange: u,
  emptyText: a = "暂无智能体思考过程",
  className: I = ""
}) {
  const [z, V] = $(l), d = e ?? z, p = zt(), E = A[0];
  return /* @__PURE__ */ i(
    "section",
    {
      className: `node-feedback ${I}`,
      "aria-label": "节点处理信息反馈",
      children: [
        /* @__PURE__ */ i(DA, { children: [
          /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "node-feedback__summary",
              "aria-expanded": d,
              "aria-controls": p,
              onClick: () => {
                V(!d), u?.(!d);
              },
              children: [
                /* @__PURE__ */ n(
                  "span",
                  {
                    className: "node-feedback__spark",
                    "aria-hidden": "true",
                    children: "✦"
                  }
                ),
                /* @__PURE__ */ n("small", { className: "node-feedback__latest", children: E ? /* @__PURE__ */ i(AA, { children: [
                  /* @__PURE__ */ n("i", { children: E.tag }),
                  /* @__PURE__ */ n("span", { className: "node-execution-text", children: E.text })
                ] }) : a }),
                t && /* @__PURE__ */ i("em", { children: [
                  r,
                  " ",
                  t
                ] }),
                /* @__PURE__ */ n(
                  "i",
                  {
                    className: "node-feedback__chevron",
                    "aria-hidden": "true",
                    children: "⌄"
                  }
                )
              ]
            }
          ) }),
          E && /* @__PURE__ */ n(_A, { className: "max-w-[min(24rem,calc(100vw-24px))] break-words", children: E.text })
        ] }),
        /* @__PURE__ */ n("div", { id: p, hidden: !d, children: A.length > 0 ? /* @__PURE__ */ n(
          "ul",
          {
            className: "node-feedback__list",
            tabIndex: 0,
            "aria-label": "思考过程",
            children: A.map((q) => /* @__PURE__ */ i(
              "li",
              {
                className: `is-${q.tone} is-${q.state ?? "succeeded"}`,
                children: [
                  /* @__PURE__ */ n("i", { children: q.tag }),
                  /* @__PURE__ */ n(ct, { text: q.text, lines: 3 })
                ]
              },
              q.id
            ))
          }
        ) : /* @__PURE__ */ n("p", { className: "node-feedback__empty", children: a }) })
      ]
    }
  );
}
function vd({
  text: A,
  current: t = 0,
  total: r = 0,
  tone: l = "info",
  progressLabel: e,
  progressText: u,
  dismissible: a = !1,
  onDismiss: I
}) {
  const z = Number.isFinite(r) ? Math.max(0, r) : 0, V = Number.isFinite(t) ? Math.max(0, Math.min(z, t)) : 0, d = z > 0;
  return /* @__PURE__ */ i(
    "section",
    {
      className: `node-progress is-${l}${d ? " has-progress" : ""}`,
      role: "status",
      "aria-label": A,
      children: [
        /* @__PURE__ */ i("div", { className: "node-progress__copy", children: [
          /* @__PURE__ */ n(
            ct,
            {
              text: d ? e || "处理进度" : A
            }
          ),
          d && /* @__PURE__ */ n("strong", { children: /* @__PURE__ */ n(
            ct,
            {
              text: u || `${V}/${z}`
            }
          ) }),
          a && /* @__PURE__ */ i(DA, { children: [
            /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": "关闭状态提示",
                onClick: I,
                children: /* @__PURE__ */ n(
                  ml,
                  {
                    size: 14,
                    strokeWidth: 1.8,
                    "aria-hidden": "true"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ n(_A, { children: "关闭" })
          ] })
        ] }),
        d && /* @__PURE__ */ n(
          "i",
          {
            className: "node-progress__track",
            role: "progressbar",
            "aria-label": A,
            "aria-valuenow": V,
            "aria-valuemin": 0,
            "aria-valuemax": z,
            children: /* @__PURE__ */ n("b", { style: { width: `${V / z * 100}%` } })
          }
        )
      ]
    }
  );
}
function E3(A, t) {
  const r = k(), l = t.binding?.from === "source" ? t.binding.sourceId : t.dataSourceId, e = l ? r.state.sources[l] : void 0, u = t.binding ? r.resolve(t.binding) : e?.data;
  if (e?.status === "error")
    return { error: e.error || "数据源读取失败", data: void 0 };
  if ((t.binding || t.dataSourceId) && u == null)
    return { error: void 0, data: void 0 };
  if (u != null && (typeof u != "object" || Array.isArray(u)))
    return { error: "组件数据必须是对象", data: void 0 };
  const a = A.safeParse({ ...t, ...u });
  return a.success ? { data: a.data, error: void 0 } : {
    data: void 0,
    error: `组件数据格式不正确：${a.error.issues[0]?.path.join(".")}`
  };
}
function p3() {
  const A = k(), t = hA(/* @__PURE__ */ new Set()), [r, l] = $(""), e = (a) => Dt(A.state.busy, A.definition.logic.events, a);
  return { execute: async (a) => {
    if (!(!a || A.mode === "design" || t.current.has(a) || e(a))) {
      t.current.add(a), l("");
      try {
        await A.execute(a);
      } catch (I) {
        l(
          I instanceof Error ? I.message : "操作执行失败，请重试"
        );
      } finally {
        t.current.delete(a);
      }
    }
  }, busy: e, error: r, design: A.mode === "design" };
}
function cd(A) {
  const { data: t, error: r } = E3(B7, A), l = p3();
  return /* @__PURE__ */ i(AA, { children: [
    /* @__PURE__ */ n(
      Md,
      {
        entries: t?.entries ?? (!A.binding && !A.dataSourceId && A.title ? [
          {
            id: "summary",
            tag: "理解",
            text: A.title,
            tone: "route"
          }
        ] : []),
        elapsed: t?.elapsed,
        elapsedLabel: t?.elapsedLabel,
        expanded: t?.expanded,
        emptyText: r || t?.emptyText || "暂无节点处理信息",
        onExpandedChange: () => {
          l.execute(A.eventId);
        }
      }
    ),
    l.error && /* @__PURE__ */ n("p", { role: "alert", children: l.error })
  ] });
}
function Wd(A) {
  const { data: t, error: r } = E3(F7, A), l = t?.status ?? "queued";
  return /* @__PURE__ */ n(
    Zd,
    {
      ...A,
      data: t,
      error: r,
      status: l
    },
    t?.nodeKey ?? ""
  );
}
function Zd({
  data: A,
  error: t,
  status: r,
  eventId: l
}) {
  const [e, u] = $(!1), a = p3();
  return e && !a.design ? a.error ? /* @__PURE__ */ n("p", { role: "alert", children: a.error }) : null : /* @__PURE__ */ i(AA, { children: [
    /* @__PURE__ */ n(
      vd,
      {
        text: t || A?.text || Jr[r],
        current: A?.current ?? (A?.success ?? 0) + (A?.failed ?? 0),
        total: t ? 0 : A?.total,
        tone: t || r === "failed" ? "danger" : A?.tone ?? (r === "succeeded" ? "success" : "info"),
        progressLabel: A?.progressLabel,
        progressText: A?.progressText,
        dismissible: A?.dismissible ?? !1,
        onDismiss: () => {
          a.design || (u(!0), a.execute(l));
        }
      }
    ),
    a.error && /* @__PURE__ */ n("p", { role: "alert", children: a.error })
  ] });
}
function H3({ action: A }) {
  return /* @__PURE__ */ i(DA, { children: [
    /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: A.tone ? `is-${A.tone}` : void 0,
        disabled: A.disabled || A.pending,
        "aria-busy": A.pending || void 0,
        onClick: A.onClick,
        children: /* @__PURE__ */ n("span", { className: "node-execution-text", children: A.label })
      }
    ) }),
    /* @__PURE__ */ n(_A, { className: "max-w-[min(24rem,calc(100vw-24px))] break-words", children: A.label })
  ] });
}
function Cd({
  actions: A = [],
  moreActions: t = []
}) {
  return !A.length && !t.length ? null : /* @__PURE__ */ i(
    "footer",
    {
      className: "node-trace__actions",
      "aria-label": "工作流与当前节点操作",
      children: [
        A.map((r) => /* @__PURE__ */ n(H3, { action: r }, r.id)),
        t.length > 0 && /* @__PURE__ */ i("details", { className: "node-trace__more-actions", children: [
          /* @__PURE__ */ i("summary", { children: [
            "更多操作",
            " ",
            /* @__PURE__ */ n(
              nt,
              {
                size: 14,
                strokeWidth: 2,
                "aria-hidden": "true"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { children: t.map((r) => /* @__PURE__ */ n(H3, { action: r }, r.id)) })
        ] })
      ]
    }
  );
}
function _3({
  guide: A,
  notice: t,
  failure: r,
  status: l
}) {
  return /* @__PURE__ */ i(AA, { children: [
    t && /* @__PURE__ */ i(
      "section",
      {
        className: "node-trace__notice is-attention",
        role: "status",
        children: [
          /* @__PURE__ */ n(Gr, { size: 16, "aria-hidden": "true" }),
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("strong", { children: t.title }),
            /* @__PURE__ */ n("span", { children: t.detail })
          ] })
        ]
      }
    ),
    A && /* @__PURE__ */ i("section", { className: "node-trace__human-guide", role: "status", children: [
      /* @__PURE__ */ i("div", { className: "node-trace__human-guide-head", children: [
        /* @__PURE__ */ n(
          Ul,
          {
            size: 16,
            strokeWidth: 1.9,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n("strong", { children: A.title }) })
      ] }),
      A.issues.length > 0 ? /* @__PURE__ */ n(
        "ul",
        {
          className: "node-trace__issue-list",
          "aria-label": "人工处理问题清单",
          children: A.issues.map((e) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ i("div", { className: "node-trace__issue-copy", children: [
            A.issues.length > 1 && e.title && /* @__PURE__ */ n("strong", { children: e.title }),
            /* @__PURE__ */ n("small", { children: e.detail })
          ] }) }, e.id))
        }
      ) : /* @__PURE__ */ n("p", { className: "node-trace__issue-empty", children: "当前没有待处理问题，请核对左侧当前节点结果后继续。" }),
      A.validationMessage && /* @__PURE__ */ n(
        "p",
        {
          className: "node-trace__validation-message",
          role: "alert",
          children: A.validationMessage
        }
      )
    ] }),
    l === "failed" && r && /* @__PURE__ */ i("section", { className: "node-trace__notice is-failure", role: "alert", children: [
      /* @__PURE__ */ n(Gr, { size: 16, "aria-hidden": "true" }),
      /* @__PURE__ */ i("div", { children: [
        /* @__PURE__ */ n("strong", { children: "失败原因与处理影响" }),
        /* @__PURE__ */ n("span", { children: r.detail }),
        r.impact && /* @__PURE__ */ n("small", { children: r.impact })
      ] })
    ] })
  ] });
}
function fd({
  capabilities: A,
  sources: t,
  outputs: r
}) {
  const [l, e] = $(null), u = t.find((a) => a.id === l);
  return /* @__PURE__ */ i(AA, { children: [
    /* @__PURE__ */ i("section", { className: "node-trace__section node-trace__rail-card", children: [
      /* @__PURE__ */ n("div", { className: "node-trace__group-head", children: /* @__PURE__ */ n("h3", { className: "node-trace__group-title", children: "本次开启的原子能力" }) }),
      A.length ? /* @__PURE__ */ n(
        "ul",
        {
          className: "node-trace__atomic-list",
          "aria-label": "本次开启的原子能力列表",
          children: A.map((a) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ n("strong", { children: a.title }) }, a.id))
        }
      ) : /* @__PURE__ */ n("p", { className: "node-trace__atomic-empty", children: "本次未开启原子能力" })
    ] }),
    /* @__PURE__ */ i("section", { className: "node-trace__section node-trace__rail-card", children: [
      /* @__PURE__ */ n("div", { className: "node-trace__group-head", children: /* @__PURE__ */ n("h3", { className: "node-trace__group-title", children: "数据来源" }) }),
      /* @__PURE__ */ n("ul", { className: "node-trace__sources", children: t.map((a) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          "aria-expanded": l === a.id,
          "aria-label": `查看${a.title}使用明细`,
          onClick: () => e(
            l === a.id ? null : a.id
          ),
          children: [
            /* @__PURE__ */ n(
              "span",
              {
                className: "node-trace__source-icon",
                "aria-hidden": "true",
                children: a.icon ?? /* @__PURE__ */ n(iu, { size: 16, strokeWidth: 1.8 })
              }
            ),
            /* @__PURE__ */ n("strong", { children: /* @__PURE__ */ n(
              ct,
              {
                text: a.title,
                focusable: !1
              }
            ) }),
            a.badge && /* @__PURE__ */ n(
              "em",
              {
                className: `node-trace__source-badge is-${a.badgeTone ?? "authorized"}`,
                children: a.badge
              }
            ),
            /* @__PURE__ */ n(nt, { size: 14, "aria-hidden": "true" })
          ]
        }
      ) }, a.id)) }),
      !t.length && /* @__PURE__ */ n("p", { className: "node-trace__atomic-empty", children: "暂无数据来源" }),
      u && /* @__PURE__ */ i(
        "div",
        {
          className: "node-trace__source-detail",
          role: "region",
          "aria-label": `${u.title}使用明细`,
          children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ n("strong", { children: u.title }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  "aria-label": "关闭来源明细",
                  onClick: () => e(null),
                  children: /* @__PURE__ */ n(ml, { size: 14 })
                }
              )
            ] }),
            /* @__PURE__ */ n("p", { children: u.detail }),
            /* @__PURE__ */ i("small", { children: [
              "用于：",
              u.usage
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ i("section", { className: "node-trace__section node-trace__rail-card", children: [
      /* @__PURE__ */ n("div", { className: "node-trace__group-head", children: /* @__PURE__ */ n("h3", { className: "node-trace__group-title", children: "输出" }) }),
      /* @__PURE__ */ i("ul", { className: "node-trace__outputs", children: [
        r.map((a) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            disabled: a.disabled,
            "aria-label": `查看${a.title}`,
            onClick: a.onClick,
            children: [
              /* @__PURE__ */ n(
                "span",
                {
                  className: `node-trace__output-icon is-${a.kind}`,
                  "aria-hidden": "true",
                  children: a.kind === "table" ? /* @__PURE__ */ n(mu, { size: 16, strokeWidth: 1.8 }) : /* @__PURE__ */ n(du, { size: 16, strokeWidth: 1.8 })
                }
              ),
              /* @__PURE__ */ n("strong", { children: /* @__PURE__ */ n(
                ct,
                {
                  text: a.title,
                  focusable: !1
                }
              ) }),
              /* @__PURE__ */ n("small", { children: a.format }),
              /* @__PURE__ */ n(nt, { size: 14, "aria-hidden": "true" })
            ]
          }
        ) }, a.id)),
        !r.length && /* @__PURE__ */ n("li", { className: "is-empty", children: "暂无输出内容" })
      ] })
    ] })
  ] });
}
function bd({
  steps: A,
  status: t,
  resultSummary: r
}) {
  return /* @__PURE__ */ i(AA, { children: [
    A.length > 0 && /* @__PURE__ */ i("section", { className: "node-trace__section node-trace__rail-card", children: [
      /* @__PURE__ */ n("div", { className: "node-trace__group-head", children: /* @__PURE__ */ n("h3", { className: "node-trace__group-title", children: "Agent执行过程" }) }),
      /* @__PURE__ */ n("ol", { className: "node-trace__process-list", children: A.map((l) => {
        const e = l.status === "succeeded" ? Lt : l.status === "blocked" && t === "failed" ? Gr : l.status === "running" ? fl : bl;
        return /* @__PURE__ */ i(
          "li",
          {
            className: `is-${l.status}`,
            "aria-current": l.status === "running" || l.status === "blocked" && t === "failed" ? "step" : void 0,
            children: [
              /* @__PURE__ */ n(
                "span",
                {
                  className: "node-trace__process-marker",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ n(
                    e,
                    {
                      size: 12,
                      strokeWidth: l.status === "succeeded" ? 2.5 : l.status === "blocked" && t === "failed" ? 2.1 : 2
                    }
                  )
                }
              ),
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ n("strong", { children: l.title }),
                /* @__PURE__ */ n("small", { children: l.detail })
              ] })
            ]
          },
          l.id
        );
      }) })
    ] }),
    r && /* @__PURE__ */ i("section", { className: "node-trace__section", children: [
      /* @__PURE__ */ i("div", { className: "node-trace__group-head", children: [
        /* @__PURE__ */ n("h3", { className: "node-trace__group-title", children: "发布结果" }),
        /* @__PURE__ */ n("span", { className: "node-trace__group-count", children: r.count })
      ] }),
      /* @__PURE__ */ n("p", { className: "node-trace__publish-result", children: r.detail })
    ] })
  ] });
}
function Ud({
  collapsed: A,
  defaultCollapsed: t = !1,
  onCollapsedChange: r,
  className: l = "",
  ...e
}) {
  const [u, a] = $(t), I = A ?? u, z = (Z) => {
    a(Z), r?.(Z);
  }, {
    title: V,
    status: d,
    statusLabel: p,
    controller: E,
    steps: q,
    guide: m,
    notice: v,
    failure: c,
    resultSummary: M
  } = e, W = d === "skipped" ? "succeeded" : d, C = d === "succeeded" || d === "skipped" ? Lt : E === "human" ? Ul : d === "queued" || d === "paused" ? bl : fl;
  return /* @__PURE__ */ n(
    "aside",
    {
      className: `node-execution ${I ? "is-collapsed" : ""} ${l}`,
      "aria-label": "当前节点执行",
      children: I ? /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "node-execution__rail",
          "aria-label": "展开当前节点执行栏",
          onClick: () => z(!1),
          children: [
            /* @__PURE__ */ n("strong", { children: "执行" }),
            /* @__PURE__ */ n("span", { children: p })
          ]
        }
      ) : /* @__PURE__ */ i(AA, { children: [
        /* @__PURE__ */ i("header", { className: "node-execution__header", children: [
          /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ n("strong", { children: "当前节点执行" }),
            /* @__PURE__ */ n("span", { children: "状态、过程与操作" })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "收起当前节点执行栏",
              onClick: () => z(!0),
              children: /* @__PURE__ */ n("span", { "aria-hidden": "true", children: "›" })
            }
          )
        ] }),
        /* @__PURE__ */ i(
          "div",
          {
            className: `node-trace ${d === "failed" ? "is-mode-attention" : ""}`,
            children: [
              /* @__PURE__ */ n(
                "div",
                {
                  className: "node-trace__content",
                  tabIndex: 0,
                  "aria-label": "当前节点执行详情",
                  children: /* @__PURE__ */ i("article", { className: "node-trace__timeline", children: [
                    /* @__PURE__ */ i(
                      "div",
                      {
                        className: "node-trace__rail",
                        "aria-hidden": "true",
                        children: [
                          /* @__PURE__ */ n("span", { className: "node-trace__line" }),
                          /* @__PURE__ */ n(
                            "span",
                            {
                              className: `node-trace__marker is-${W}`,
                              children: /* @__PURE__ */ n(
                                C,
                                {
                                  size: 13,
                                  strokeWidth: W === "succeeded" ? 2.4 : 2
                                }
                              )
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ i("div", { className: "node-trace__body", children: [
                      /* @__PURE__ */ i("header", { className: "node-trace__summary", children: [
                        /* @__PURE__ */ n("div", { className: "node-trace__title-row", children: /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n("strong", { children: V }) }) }),
                        /* @__PURE__ */ i("div", { className: "node-trace__meta", children: [
                          /* @__PURE__ */ n(
                            "span",
                            {
                              className: `node-trace__state is-${W}`,
                              children: p
                            }
                          ),
                          E && d !== "queued" && d !== "waiting-human" && /* @__PURE__ */ i("span", { children: [
                            "控制状态：",
                            E === "human" ? "人工" : "智能体"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ i(
                        "p",
                        {
                          className: "node-trace__announcement",
                          role: d === "failed" ? "alert" : "status",
                          children: [
                            V,
                            "，",
                            p,
                            "。"
                          ]
                        }
                      ),
                      /* @__PURE__ */ n(
                        _3,
                        {
                          guide: m,
                          notice: v,
                          status: d
                        }
                      ),
                      /* @__PURE__ */ n(
                        bd,
                        {
                          steps: q,
                          status: d,
                          resultSummary: M
                        }
                      ),
                      /* @__PURE__ */ n(
                        _3,
                        {
                          failure: c,
                          status: d
                        }
                      ),
                      /* @__PURE__ */ n(
                        fd,
                        {
                          capabilities: e.capabilities,
                          sources: e.sources,
                          outputs: e.outputs
                        },
                        e.nodeKey
                      )
                    ] })
                  ] })
                }
              ),
              e.footer ?? /* @__PURE__ */ n(
                Cd,
                {
                  actions: e.actions,
                  moreActions: e.moreActions
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function hd(A) {
  const { data: t, error: r } = E3(T7, A);
  return /* @__PURE__ */ n(
    Kd,
    {
      data: t,
      error: r,
      footer: A.footer
    },
    t?.nodeKey ?? ""
  );
}
function Kd({
  data: A,
  error: t,
  footer: r
}) {
  const l = p3(), e = t ? "failed" : A?.status ?? "queued", u = (I) => ({
    ...I,
    disabled: l.design || I.disabled || !I.eventId,
    pending: I.pending || l.busy(I.eventId),
    onClick: () => {
      l.execute(I.eventId);
    }
  }), a = !!(A?.actions?.length || A?.moreActions?.length);
  return /* @__PURE__ */ n(
    Ud,
    {
      nodeKey: A?.nodeKey ?? "",
      title: A?.title || "当前节点",
      status: e,
      statusLabel: t ? "数据读取失败" : A?.statusLabel || Jr[e],
      controller: A?.controller,
      steps: A?.steps ?? [],
      capabilities: A?.capabilities ?? [],
      sources: A?.sources ?? [],
      outputs: (A?.outputs ?? []).map((I) => ({
        ...I,
        disabled: l.design || I.disabled || !I.eventId || l.busy(I.eventId),
        onClick: () => {
          l.execute(I.eventId);
        }
      })),
      guide: A?.guide,
      notice: l.error ? { title: "操作失败", detail: l.error } : A?.notice,
      failure: t ? { detail: t } : A?.failure,
      resultSummary: A?.resultSummary,
      collapsed: A?.collapsed,
      actions: A?.actions?.map(u),
      moreActions: A?.moreActions?.map(u),
      footer: a ? void 0 : /* @__PURE__ */ n(r, { style: { flexShrink: 0 } })
    }
  );
}
function Pt(A, t, r = !1) {
  const l = A === "width" ? "minWidth" : "minHeight", e = A === "width" ? "maxWidth" : "maxHeight", u = t.viewportOffset === void 0 ? void 0 : `calc(100${A === "width" ? "dvw" : "dvh"} - ${t.viewportOffset}px)`, a = t.max > 0 ? Math.max(t.min, t.max) : void 0;
  return {
    [A]: t.mode === "fixed" ? t.value : t.mode === "content" ? "max-content" : r ? "100%" : void 0,
    [l]: t.min,
    [e]: u && a ? `min(${a}px, ${u})` : u ?? a
  };
}
function Qd(A, t) {
  const r = t === "row" ? A.width : A.height, l = t === "row" ? A.height : A.width;
  return {
    ...Pt("width", A.width),
    ...Pt("height", A.height),
    flex: r.mode === "fill" ? `${r.value} 1 ${r.basis ?? 0}px` : "0 0 auto",
    alignSelf: l.mode === "fill" ? "stretch" : "flex-start",
    display: "flex",
    flexDirection: "column",
    overflow: A.overflow,
    boxSizing: "border-box"
  };
}
function Sd({
  main: A,
  aside: t,
  height: r,
  asideWidth: l
}) {
  return /* @__PURE__ */ i(
    "div",
    {
      className: "lc-node-workspace",
      style: { display: "flex", flexWrap: "wrap", gap: 12, minWidth: 0 },
      children: [
        /* @__PURE__ */ n(
          A,
          {
            style: {
              flex: "999 1 640px",
              minWidth: 0,
              height: r,
              maxHeight: "calc(100dvh - 100px)",
              minHeight: 360
            }
          }
        ),
        /* @__PURE__ */ n(
          t,
          {
            style: {
              flex: `1 0 ${l}px`,
              minWidth: 0,
              maxWidth: "100%",
              height: r,
              maxHeight: "calc(100dvh - 100px)",
              minHeight: 360
            }
          }
        )
      ]
    }
  );
}
function sd({
  header: A,
  content: t,
  footer: r,
  variant: l = "card",
  headerPadding: e = 12,
  contentPadding: u = 0,
  footerPadding: a = 12
}) {
  const { mode: I } = k();
  return /* @__PURE__ */ i(
    "section",
    {
      style: {
        height: "100%",
        minHeight: I === "design" ? 480 : 0,
        display: "flex",
        flexDirection: "column",
        border: l === "card" ? "1px solid var(--border)" : void 0,
        borderRadius: l === "card" ? 8 : 0,
        background: "var(--background)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ n(
          A,
          {
            style: {
              flexShrink: 0,
              padding: e,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }
          }
        ),
        /* @__PURE__ */ n(
          t,
          {
            className: "lc-panel-scroll",
            style: {
              flex: 1,
              minHeight: I === "design" ? 160 : 0,
              overflow: "auto",
              padding: u
            }
          }
        ),
        /* @__PURE__ */ n(
          r,
          {
            style: {
              flexShrink: 0,
              padding: a,
              borderTop: l === "card" ? "1px solid var(--border)" : void 0
            }
          }
        )
      ]
    }
  );
}
function xd({
  direction: A = "row",
  gap: t = 12,
  wrap: r = "nowrap",
  widthSizing: l = P7,
  heightSizing: e = k7,
  panes: u,
  main: a,
  aside: I,
  height: z = 640,
  asideWidth: V = 300
}) {
  return u ? /* @__PURE__ */ n(
    "div",
    {
      "data-split-layout": A,
      style: {
        ...Pt("width", l, !0),
        ...Pt("height", e, !0),
        display: "flex",
        flexDirection: A,
        flexWrap: r,
        gap: t,
        overflow: "auto",
        boxSizing: "border-box"
      },
      children: u.map((d) => {
        const p = d.content;
        return /* @__PURE__ */ n(
          p,
          {
            className: "lc-split-pane",
            style: Qd(d, A)
          },
          d.id
        );
      })
    }
  ) : !a || !I ? /* @__PURE__ */ n(AA, {}) : /* @__PURE__ */ n(
    Sd,
    {
      main: a,
      aside: I,
      height: z,
      asideWidth: V
    }
  );
}
const Gt = (A, t = !1) => ({
  type: "object",
  label: A,
  objectFields: {
    mode: {
      type: "select",
      label: "尺寸规则",
      options: [
        { label: "固定尺寸", value: "fixed" },
        { label: "跟随内容", value: "content" },
        {
          label: t ? "分配剩余空间 / 撑满" : "填满父容器",
          value: "fill"
        }
      ]
    },
    value: {
      type: "number",
      label: t ? "固定像素 / 剩余空间比例" : "固定尺寸（px）",
      min: 1
    },
    min: { type: "number", label: "最小尺寸（px）", min: 0 },
    max: { type: "number", label: "最大尺寸（px，0 不限制）", min: 0 },
    viewportOffset: {
      type: "number",
      label: "视口预留尺寸（px，留空不限制）",
      min: 0
    },
    ...t ? {
      basis: {
        type: "number",
        label: "分配前基础尺寸（px）",
        min: 0
      }
    } : {}
  }
}), Xd = {
  label: J.SplitLayout,
  defaultProps: w.SplitLayout,
  fields: {
    main: { type: "slot", label: "旧主区域" },
    aside: { type: "slot", label: "旧右侧区域" },
    direction: {
      type: "select",
      label: "排列方向",
      options: [
        { label: "左右排列", value: "row" },
        { label: "上下排列", value: "column" }
      ]
    },
    gap: { type: "number", label: "分区间距（px）", min: 0 },
    wrap: {
      type: "select",
      label: "空间不足时",
      options: [
        { label: "保持方向，容器内滚动", value: "nowrap" },
        { label: "允许换行 / 换列", value: "wrap" }
      ]
    },
    widthSizing: Gt("容器宽度"),
    heightSizing: Gt("容器高度"),
    panes: {
      type: "array",
      label: "分区",
      min: 1,
      getItemSummary: (A, t) => /* @__PURE__ */ n(
        "span",
        {
          style: { whiteSpace: "normal", overflowWrap: "anywhere" },
          children: A.label || `分区 ${(t ?? 0) + 1}`
        }
      ),
      defaultItemProps: (A) => L7(U3(), `分区 ${A + 1}`),
      arrayFields: {
        id: { type: "text", label: "分区标识", visible: !1 },
        label: { type: "text", label: "分区名称" },
        width: Gt("分区宽度", !0),
        height: Gt("分区高度", !0),
        overflow: {
          type: "select",
          label: "内容溢出",
          options: [
            { label: "分区内滚动", value: "auto" },
            { label: "裁切", value: "hidden" },
            { label: "向外显示", value: "visible" }
          ]
        },
        content: { type: "slot", label: "分区内容" }
      }
    }
  },
  resolveFields: (A, { fields: t }) => {
    const r = { ...t };
    return delete r.main, delete r.aside, r;
  },
  resolveData: ({ props: A }) => {
    const t = w7(A), r = t.panes ?? [], l = new Map(r.map((e, u) => [e.id, u]));
    return {
      props: {
        ...t,
        ...A.panes === void 0 ? { main: [], aside: [] } : {},
        panes: r.map(
          (e, u) => e.id && l.get(e.id) === u ? e : { ...e, id: U3() }
        )
      }
    };
  },
  render: xd
}, fr = { type: "slot" }, br = { type: "text" }, Yd = {
  SplitLayout: Xd,
  ScrollPanel: {
    label: J.ScrollPanel,
    defaultProps: w.ScrollPanel,
    fields: {
      variant: {
        type: "select",
        label: "面板样式",
        options: [
          { label: "卡片", value: "card" },
          { label: "无边框工作区", value: "workspace" }
        ]
      },
      headerPadding: {
        type: "number",
        label: "顶部内边距",
        min: 0,
        max: 64
      },
      contentPadding: {
        type: "number",
        label: "内容内边距",
        min: 0,
        max: 64
      },
      footerPadding: {
        type: "number",
        label: "底部内边距",
        min: 0,
        max: 64
      },
      header: { ...fr, label: "固定顶部" },
      content: { ...fr, label: "滚动内容" },
      footer: { ...fr, label: "固定底部" }
    },
    render: sd
  },
  WorkflowProcess: {
    label: J.WorkflowProcess,
    defaultProps: w.WorkflowProcess,
    fields: dd,
    render: cd
  },
  ExecutionResult: {
    label: J.ExecutionResult,
    defaultProps: w.ExecutionResult,
    fields: Vd,
    render: Wd
  },
  ThinkingProcess: {
    label: J.ThinkingProcess,
    defaultProps: w.ThinkingProcess,
    fields: Ed,
    render: hd
  },
  Link: {
    label: J.Link,
    defaultProps: w.Link,
    fields: {
      text: { ...br, label: "链接文字" },
      href: { ...br, label: "链接地址" },
      eventId: br
    },
    render: md
  }
};
function Gd({
  binding: A,
  gap: t,
  content: r
}) {
  const l = k(), e = A ? l.resolve(A) : void 0, u = Array.isArray(e) ? e : l.mode === "design" ? [{}] : [];
  return /* @__PURE__ */ n(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: t,
        minWidth: 0
      },
      children: u.map((a, I) => /* @__PURE__ */ n(
        Jt,
        {
          value: {
            ...l.scope,
            row: { ...l.scope.row, item: a }
          },
          children: /* @__PURE__ */ n(r, {})
        },
        I
      ))
    }
  );
}
var od = {
  outline: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  filled: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none"
  }
};
const tr = (A, t, r, l) => {
  const e = u7(
    ({ color: u = "currentColor", size: a = 24, stroke: I = 2, title: z, className: V, children: d, ...p }, E) => yt(
      "svg",
      {
        ref: E,
        ...od[A],
        width: a,
        height: a,
        className: ["tabler-icon", `tabler-icon-${t}`, V].join(" "),
        strokeWidth: I,
        stroke: u,
        ...p
      },
      [
        z && yt("title", { key: "svg-title" }, z),
        ...l.map(([q, m]) => yt(q, m)),
        ...Array.isArray(d) ? d : [d]
      ]
    )
  );
  return e.displayName = `${r}`, e;
};
const Rd = [["path", { d: "M15 6l-6 6l6 6", key: "svg-0" }]], jd = tr("outline", "chevron-left", "ChevronLeft", Rd);
const Od = [["path", { d: "M9 6l6 6l-6 6", key: "svg-0" }]], gd = tr("outline", "chevron-right", "ChevronRight", Od);
const yd = [["path", { d: "M11 7l-5 5l5 5", key: "svg-0" }], ["path", { d: "M17 7l-5 5l5 5", key: "svg-1" }]], Nd = tr("outline", "chevrons-left", "ChevronsLeft", yd);
const Fd = [["path", { d: "M7 7l5 5l-5 5", key: "svg-0" }], ["path", { d: "M13 7l5 5l-5 5", key: "svg-1" }]], Bd = tr("outline", "chevrons-right", "ChevronsRight", Fd), Td = [10, 20, 50, 100], Pd = ({
  page: A,
  pageSize: t,
  total: r,
  pageSizeOptions: l = Td,
  portalContainer: e,
  loading: u = !1,
  className: a,
  onPageChange: I,
  onPageSizeChange: z,
  showTotal: V = !0,
  showPageSize: d = !0,
  style: p
}) => {
  const E = Math.max(1, Math.ceil(r / t)), q = me(A, E), m = l.includes(t) ? l : [...l, t].sort((c, M) => c - M), v = (c) => {
    const M = Number(c);
    M !== t && (z(M), A !== 1 && I(1));
  };
  return /* @__PURE__ */ i(
    "div",
    {
      style: p,
      className: X(
        "flex flex-wrap items-center justify-end gap-3",
        a
      ),
      children: [
        V && /* @__PURE__ */ i("span", { className: "text-sm whitespace-nowrap text-muted-foreground", children: [
          "共 ",
          r,
          " 条"
        ] }),
        d && /* @__PURE__ */ i(
          Wt,
          {
            value: String(t),
            disabled: u,
            onValueChange: v,
            children: [
              /* @__PURE__ */ n(Zt, { className: "h-8 w-[92px] rounded-lg", children: /* @__PURE__ */ n(Ct, {}) }),
              /* @__PURE__ */ n(
                ft,
                {
                  align: "start",
                  zIndex: 80,
                  portalContainer: e,
                  children: m.map((c) => /* @__PURE__ */ i(bt, { value: String(c), children: [
                    c,
                    " 条"
                  ] }, c))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ n(Ml, { className: "mx-0 w-auto", children: /* @__PURE__ */ i(vl, { children: [
          /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              size: "icon-sm",
              "aria-label": "第一页",
              disabled: u || A <= 1,
              onClick: () => I(1),
              children: /* @__PURE__ */ n(Nd, {})
            }
          ) }),
          /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              size: "icon-sm",
              "aria-label": "上一页",
              disabled: u || A <= 1,
              onClick: () => I(A - 1),
              children: /* @__PURE__ */ n(jd, {})
            }
          ) }),
          q.map(
            (c, M) => c === "ellipsis" ? /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(cl, {}) }, `ellipsis-${M}`) : /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
              T,
              {
                type: "button",
                variant: A === c ? "outline" : "ghost",
                size: "icon-sm",
                "aria-label": `第 ${c} 页`,
                "aria-current": A === c ? "page" : void 0,
                disabled: u,
                onClick: () => I(c),
                children: c
              }
            ) }, c)
          ),
          /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              size: "icon-sm",
              "aria-label": "下一页",
              disabled: u || A >= E,
              onClick: () => I(A + 1),
              children: /* @__PURE__ */ n(gd, {})
            }
          ) }),
          /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              size: "icon-sm",
              "aria-label": "最后一页",
              disabled: u || A >= E,
              onClick: () => I(E),
              children: /* @__PURE__ */ n(Bd, {})
            }
          ) })
        ] }) })
      ]
    }
  );
};
function kd(A, t) {
  const r = Math.max(1, Math.floor(t) || 1), l = Math.min(Math.max(1, Math.floor(A) || 1), r);
  if (r <= 7)
    return Array.from({ length: r }, (I, z) => z + 1);
  const e = Math.max(2, Math.min(l - 2, r - 5)), u = Math.min(r - 1, e + 4), a = [1];
  e > 2 && a.push("ellipsis");
  for (let I = e; I <= u; I += 1) a.push(I);
  return u < r - 1 && a.push("ellipsis"), a.push(r), a;
}
const Ld = [10, 20, 50], wd = ({
  page: A,
  pageSize: t,
  total: r,
  loading: l = !1,
  onPageChange: e,
  onPageSizeChange: u,
  portalContainer: a,
  pageSizeOptions: I = Ld,
  showTotal: z = !0,
  showPageSize: V = !0,
  showJump: d = !0,
  align: p = "end",
  style: E
}) => {
  const q = Math.max(1, Math.ceil(r / t)), m = kd(A, q), v = `${A}/${t}`, [c, M] = $({ key: "", value: "" }), W = c.key === v ? c.value : "", C = () => {
    if (l) return;
    const Z = Number(W);
    !Number.isFinite(Z) || Z < 1 || (M({ key: v, value: "" }), e(Math.min(q, Math.floor(Z))));
  };
  return /* @__PURE__ */ i(
    "div",
    {
      className: "sticky bottom-0 z-10 mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-white px-5 py-3 text-sm text-[#6e6c68]",
      style: {
        justifyContent: {
          start: "flex-start",
          center: "center",
          end: "flex-end"
        }[p],
        ...E
      },
      "data-testid": "selection-pagination",
      children: [
        z && /* @__PURE__ */ i("span", { children: [
          "总计 ",
          r,
          " 项"
        ] }),
        /* @__PURE__ */ n(Ml, { className: "mx-0 w-auto max-w-full shrink-0 justify-start overflow-x-auto", children: /* @__PURE__ */ i(vl, { children: [
          /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              "aria-label": "上一页",
              disabled: l || A <= 1,
              onClick: () => e(A - 1),
              children: /* @__PURE__ */ n(Vl, {})
            }
          ) }),
          m.map(
            (Z, b) => Z === "ellipsis" ? /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(cl, {}) }, `ellipsis-${b}`) : /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
              s7,
              {
                "aria-disabled": l,
                href: "#",
                isActive: Z === A,
                onClick: (U) => {
                  U.preventDefault(), !l && e(Z);
                },
                children: Z
              }
            ) }, Z)
          ),
          /* @__PURE__ */ n(ZA, { children: /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              "aria-label": "下一页",
              disabled: l || A >= q,
              onClick: () => e(A + 1),
              children: /* @__PURE__ */ n(nt, {})
            }
          ) })
        ] }) }),
        V && /* @__PURE__ */ i(
          Wt,
          {
            disabled: l,
            onValueChange: (Z) => u(Number(Z)),
            value: String(t),
            children: [
              /* @__PURE__ */ n(Zt, { className: "h-8 w-[115px]", size: "sm", children: /* @__PURE__ */ n(Ct, {}) }),
              /* @__PURE__ */ n(ft, { portalContainer: a, children: [.../* @__PURE__ */ new Set([t, ...I])].sort((Z, b) => Z - b).map((Z) => /* @__PURE__ */ i(bt, { value: String(Z), children: [
                Z,
                " / page"
              ] }, Z)) })
            ]
          }
        ),
        d && /* @__PURE__ */ i("span", { className: "flex items-center gap-2", children: [
          "前往",
          /* @__PURE__ */ n(
            JA,
            {
              disabled: l,
              "aria-label": "前往页码",
              className: "h-8 w-[64px]",
              inputMode: "numeric",
              onBlur: C,
              onChange: (Z) => M({
                key: v,
                value: Z.target.value
              }),
              onKeyDown: (Z) => {
                Z.key === "Enter" && C();
              },
              value: W
            }
          )
        ] })
      ]
    }
  );
};
function ce(A) {
  return A && !Array.isArray(A) && typeof A == "object" && (A = A.items), Array.isArray(A) ? A.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Jd(A, t) {
  const r = /* @__PURE__ */ new Set();
  for (const l of A) {
    const e = l[t];
    if (typeof e != "string" && typeof e != "number" || e === "")
      return `行缺少稳定标识 ${t}`;
    const u = String(e);
    if (r.has(u)) return `行标识重复：${u}`;
    r.add(u);
  }
}
function Dd({
  tableId: A,
  text: t = "已选择 {count} 项",
  variant: r = "badge"
}) {
  const e = k().state.tables[A]?.selectedIds.length ?? 0;
  return r === "text" ? /* @__PURE__ */ n(L, { text: t.replace("{count}", String(e)) }) : /* @__PURE__ */ n(_r, { variant: "secondary", children: /* @__PURE__ */ n(L, { text: t.replace("{count}", String(e)) }) });
}
function We({
  tableId: A,
  dataSourceId: t,
  pageSizeOptions: r = [10, 20, 50],
  variant: l,
  showTotal: e,
  showPageSize: u,
  showJump: a,
  align: I,
  paginationAppearance: z,
  displayState: V
}) {
  const d = k(), p = RA(), E = hA(!1), q = d.state.tables[A] ?? {
    page: 1,
    pageSize: 20,
    selectedIds: []
  }, m = d.mode === "design" && V ? { ...q, ...V } : q, v = d.state.sources[t], c = m.total ?? ce(v?.data).length, M = Math.max(1, Math.ceil(c / m.pageSize)), W = d.mode === "design" || m.disabled === !0 || v?.status === "loading", C = (b) => {
    W || b === 1 && E.current || (d.setTable(A, { page: b }), m.pageChangeEventId && d.execute(m.pageChangeEventId, {
      tableId: A,
      row: { page: b, pageSize: m.pageSize }
    }).catch(() => {
    }));
  }, Z = (b) => {
    W || (E.current = !0, queueMicrotask(() => {
      E.current = !1;
    }), d.setTable(A, { pageSize: b, page: 1 }), (m.pageSizeChangeEventId || m.pageChangeEventId) && d.execute(
      m.pageSizeChangeEventId || m.pageChangeEventId,
      { tableId: A, row: { page: 1, pageSize: b } }
    ).catch(() => {
    }));
  };
  return l === "workspace" ? /* @__PURE__ */ n(
    wd,
    {
      pageSizeOptions: r,
      showTotal: e,
      showPageSize: u,
      showJump: a,
      align: I,
      style: Object.fromEntries(
        Object.entries(
          zA(z)
        ).filter(([, b]) => b !== void 0)
      ),
      portalContainer: p,
      page: Math.min(m.page, M),
      pageSize: m.pageSize,
      total: c,
      loading: W,
      onPageChange: C,
      onPageSizeChange: Z
    }
  ) : /* @__PURE__ */ n(
    Pd,
    {
      showTotal: e,
      showPageSize: u,
      style: {
        ...Object.fromEntries(
          Object.entries(
            zA(z)
          ).filter(([, b]) => b !== void 0)
        ),
        ...I ? {
          justifyContent: {
            start: "flex-start",
            center: "center",
            end: "flex-end"
          }[I]
        } : {}
      },
      portalContainer: p,
      page: Math.min(m.page, M),
      pageSize: m.pageSize,
      total: c,
      pageSizeOptions: r,
      loading: W,
      onPageChange: C,
      onPageSizeChange: Z
    }
  );
}
function NA(A, t) {
  return typeof A == "function" ? A(t) : A;
}
function VA(A, t) {
  return (r) => {
    t.setState((l) => ({
      ...l,
      [A]: NA(r, l[A])
    }));
  };
}
function rr(A) {
  return A instanceof Function;
}
function Hd(A) {
  return Array.isArray(A) && A.every((t) => typeof t == "number");
}
function _d(A, t) {
  const r = [], l = (e) => {
    e.forEach((u) => {
      r.push(u);
      const a = t(u);
      a != null && a.length && l(a);
    });
  };
  return l(A), r;
}
function Y(A, t, r) {
  let l = [], e;
  return (u) => {
    let a;
    r.key && r.debug && (a = Date.now());
    const I = A(u);
    if (!(I.length !== l.length || I.some((d, p) => l[p] !== d)))
      return e;
    l = I;
    let V;
    if (r.key && r.debug && (V = Date.now()), e = t(...I), r == null || r.onChange == null || r.onChange(e), r.key && r.debug && r != null && r.debug()) {
      const d = Math.round((Date.now() - a) * 100) / 100, p = Math.round((Date.now() - V) * 100) / 100, E = p / 16, q = (m, v) => {
        for (m = String(m); m.length < v; )
          m = " " + m;
        return m;
      };
      console.info(`%c⏱ ${q(p, 5)} /${q(d, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * E, 120))}deg 100% 31%);`, r?.key);
    }
    return e;
  };
}
function G(A, t, r, l) {
  return {
    debug: () => {
      var e;
      return (e = A?.debugAll) != null ? e : A[t];
    },
    key: process.env.NODE_ENV === "development" && r,
    onChange: l
  };
}
function $d(A, t, r, l) {
  const e = () => {
    var a;
    return (a = u.getValue()) != null ? a : A.options.renderFallbackValue;
  }, u = {
    id: `${t.id}_${r.id}`,
    row: t,
    column: r,
    getValue: () => t.getValue(l),
    renderValue: e,
    getContext: Y(() => [A, r, t, u], (a, I, z, V) => ({
      table: a,
      column: I,
      row: z,
      cell: V,
      getValue: V.getValue,
      renderValue: V.renderValue
    }), G(A.options, "debugCells", "cell.getContext"))
  };
  return A._features.forEach((a) => {
    a.createCell == null || a.createCell(u, r, t, A);
  }, {}), u;
}
function AV(A, t, r, l) {
  var e, u;
  const I = {
    ...A._getDefaultColumnDef(),
    ...t
  }, z = I.accessorKey;
  let V = (e = (u = I.id) != null ? u : z ? typeof String.prototype.replaceAll == "function" ? z.replaceAll(".", "_") : z.replace(/\./g, "_") : void 0) != null ? e : typeof I.header == "string" ? I.header : void 0, d;
  if (I.accessorFn ? d = I.accessorFn : z && (z.includes(".") ? d = (E) => {
    let q = E;
    for (const v of z.split(".")) {
      var m;
      q = (m = q) == null ? void 0 : m[v], process.env.NODE_ENV !== "production" && q === void 0 && console.warn(`"${v}" in deeply nested key "${z}" returned undefined.`);
    }
    return q;
  } : d = (E) => E[I.accessorKey]), !V)
    throw process.env.NODE_ENV !== "production" ? new Error(I.accessorFn ? "Columns require an id when using an accessorFn" : "Columns require an id when using a non-string header") : new Error();
  let p = {
    id: `${String(V)}`,
    accessorFn: d,
    parent: l,
    depth: r,
    columnDef: I,
    columns: [],
    getFlatColumns: Y(() => [!0], () => {
      var E;
      return [p, ...(E = p.columns) == null ? void 0 : E.flatMap((q) => q.getFlatColumns())];
    }, G(A.options, "debugColumns", "column.getFlatColumns")),
    getLeafColumns: Y(() => [A._getOrderColumnsFn()], (E) => {
      var q;
      if ((q = p.columns) != null && q.length) {
        let m = p.columns.flatMap((v) => v.getLeafColumns());
        return E(m);
      }
      return [p];
    }, G(A.options, "debugColumns", "column.getLeafColumns"))
  };
  for (const E of A._features)
    E.createColumn == null || E.createColumn(p, A);
  return p;
}
const eA = "debugHeaders";
function $3(A, t, r) {
  var l;
  let u = {
    id: (l = r.id) != null ? l : t.id,
    column: t,
    index: r.index,
    isPlaceholder: !!r.isPlaceholder,
    placeholderId: r.placeholderId,
    depth: r.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const a = [], I = (z) => {
        z.subHeaders && z.subHeaders.length && z.subHeaders.map(I), a.push(z);
      };
      return I(u), a;
    },
    getContext: () => ({
      table: A,
      header: u,
      column: t
    })
  };
  return A._features.forEach((a) => {
    a.createHeader == null || a.createHeader(u, A);
  }), u;
}
const tV = {
  createTable: (A) => {
    A.getHeaderGroups = Y(() => [A.getAllColumns(), A.getVisibleLeafColumns(), A.getState().columnPinning.left, A.getState().columnPinning.right], (t, r, l, e) => {
      var u, a;
      const I = (u = l?.map((p) => r.find((E) => E.id === p)).filter(Boolean)) != null ? u : [], z = (a = e?.map((p) => r.find((E) => E.id === p)).filter(Boolean)) != null ? a : [], V = r.filter((p) => !(l != null && l.includes(p.id)) && !(e != null && e.includes(p.id)));
      return ot(t, [...I, ...V, ...z], A);
    }, G(A.options, eA, "getHeaderGroups")), A.getCenterHeaderGroups = Y(() => [A.getAllColumns(), A.getVisibleLeafColumns(), A.getState().columnPinning.left, A.getState().columnPinning.right], (t, r, l, e) => (r = r.filter((u) => !(l != null && l.includes(u.id)) && !(e != null && e.includes(u.id))), ot(t, r, A, "center")), G(A.options, eA, "getCenterHeaderGroups")), A.getLeftHeaderGroups = Y(() => [A.getAllColumns(), A.getVisibleLeafColumns(), A.getState().columnPinning.left], (t, r, l) => {
      var e;
      const u = (e = l?.map((a) => r.find((I) => I.id === a)).filter(Boolean)) != null ? e : [];
      return ot(t, u, A, "left");
    }, G(A.options, eA, "getLeftHeaderGroups")), A.getRightHeaderGroups = Y(() => [A.getAllColumns(), A.getVisibleLeafColumns(), A.getState().columnPinning.right], (t, r, l) => {
      var e;
      const u = (e = l?.map((a) => r.find((I) => I.id === a)).filter(Boolean)) != null ? e : [];
      return ot(t, u, A, "right");
    }, G(A.options, eA, "getRightHeaderGroups")), A.getFooterGroups = Y(() => [A.getHeaderGroups()], (t) => [...t].reverse(), G(A.options, eA, "getFooterGroups")), A.getLeftFooterGroups = Y(() => [A.getLeftHeaderGroups()], (t) => [...t].reverse(), G(A.options, eA, "getLeftFooterGroups")), A.getCenterFooterGroups = Y(() => [A.getCenterHeaderGroups()], (t) => [...t].reverse(), G(A.options, eA, "getCenterFooterGroups")), A.getRightFooterGroups = Y(() => [A.getRightHeaderGroups()], (t) => [...t].reverse(), G(A.options, eA, "getRightFooterGroups")), A.getFlatHeaders = Y(() => [A.getHeaderGroups()], (t) => t.map((r) => r.headers).flat(), G(A.options, eA, "getFlatHeaders")), A.getLeftFlatHeaders = Y(() => [A.getLeftHeaderGroups()], (t) => t.map((r) => r.headers).flat(), G(A.options, eA, "getLeftFlatHeaders")), A.getCenterFlatHeaders = Y(() => [A.getCenterHeaderGroups()], (t) => t.map((r) => r.headers).flat(), G(A.options, eA, "getCenterFlatHeaders")), A.getRightFlatHeaders = Y(() => [A.getRightHeaderGroups()], (t) => t.map((r) => r.headers).flat(), G(A.options, eA, "getRightFlatHeaders")), A.getCenterLeafHeaders = Y(() => [A.getCenterFlatHeaders()], (t) => t.filter((r) => {
      var l;
      return !((l = r.subHeaders) != null && l.length);
    }), G(A.options, eA, "getCenterLeafHeaders")), A.getLeftLeafHeaders = Y(() => [A.getLeftFlatHeaders()], (t) => t.filter((r) => {
      var l;
      return !((l = r.subHeaders) != null && l.length);
    }), G(A.options, eA, "getLeftLeafHeaders")), A.getRightLeafHeaders = Y(() => [A.getRightFlatHeaders()], (t) => t.filter((r) => {
      var l;
      return !((l = r.subHeaders) != null && l.length);
    }), G(A.options, eA, "getRightLeafHeaders")), A.getLeafHeaders = Y(() => [A.getLeftHeaderGroups(), A.getCenterHeaderGroups(), A.getRightHeaderGroups()], (t, r, l) => {
      var e, u, a, I, z, V;
      return [...(e = (u = t[0]) == null ? void 0 : u.headers) != null ? e : [], ...(a = (I = r[0]) == null ? void 0 : I.headers) != null ? a : [], ...(z = (V = l[0]) == null ? void 0 : V.headers) != null ? z : []].map((d) => d.getLeafHeaders()).flat();
    }, G(A.options, eA, "getLeafHeaders"));
  }
};
function ot(A, t, r, l) {
  var e, u;
  let a = 0;
  const I = function(E, q) {
    q === void 0 && (q = 1), a = Math.max(a, q), E.filter((m) => m.getIsVisible()).forEach((m) => {
      var v;
      (v = m.columns) != null && v.length && I(m.columns, q + 1);
    }, 0);
  };
  I(A);
  let z = [];
  const V = (E, q) => {
    const m = {
      depth: q,
      id: [l, `${q}`].filter(Boolean).join("_"),
      headers: []
    }, v = [];
    E.forEach((c) => {
      const M = [...v].reverse()[0], W = c.column.depth === m.depth;
      let C, Z = !1;
      if (W && c.column.parent ? C = c.column.parent : (C = c.column, Z = !0), M && M?.column === C)
        M.subHeaders.push(c);
      else {
        const b = $3(r, C, {
          id: [l, q, C.id, c?.id].filter(Boolean).join("_"),
          isPlaceholder: Z,
          placeholderId: Z ? `${v.filter((U) => U.column === C).length}` : void 0,
          depth: q,
          index: v.length
        });
        b.subHeaders.push(c), v.push(b);
      }
      m.headers.push(c), c.headerGroup = m;
    }), z.push(m), q > 0 && V(v, q - 1);
  }, d = t.map((E, q) => $3(r, E, {
    depth: a,
    index: q
  }));
  V(d, a - 1), z.reverse();
  const p = (E) => E.filter((m) => m.column.getIsVisible()).map((m) => {
    let v = 0, c = 0, M = [0];
    m.subHeaders && m.subHeaders.length ? (M = [], p(m.subHeaders).forEach((C) => {
      let {
        colSpan: Z,
        rowSpan: b
      } = C;
      v += Z, M.push(b);
    })) : v = 1;
    const W = Math.min(...M);
    return c = c + W, m.colSpan = v, m.rowSpan = c, {
      colSpan: v,
      rowSpan: c
    };
  });
  return p((e = (u = z[0]) == null ? void 0 : u.headers) != null ? e : []), z;
}
const rV = (A, t, r, l, e, u, a) => {
  let I = {
    id: t,
    index: l,
    original: r,
    depth: e,
    parentId: a,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (z) => {
      if (I._valuesCache.hasOwnProperty(z))
        return I._valuesCache[z];
      const V = A.getColumn(z);
      if (V != null && V.accessorFn)
        return I._valuesCache[z] = V.accessorFn(I.original, l), I._valuesCache[z];
    },
    getUniqueValues: (z) => {
      if (I._uniqueValuesCache.hasOwnProperty(z))
        return I._uniqueValuesCache[z];
      const V = A.getColumn(z);
      if (V != null && V.accessorFn)
        return V.columnDef.getUniqueValues ? (I._uniqueValuesCache[z] = V.columnDef.getUniqueValues(I.original, l), I._uniqueValuesCache[z]) : (I._uniqueValuesCache[z] = [I.getValue(z)], I._uniqueValuesCache[z]);
    },
    renderValue: (z) => {
      var V;
      return (V = I.getValue(z)) != null ? V : A.options.renderFallbackValue;
    },
    subRows: [],
    getLeafRows: () => _d(I.subRows, (z) => z.subRows),
    getParentRow: () => I.parentId ? A.getRow(I.parentId, !0) : void 0,
    getParentRows: () => {
      let z = [], V = I;
      for (; ; ) {
        const d = V.getParentRow();
        if (!d) break;
        z.push(d), V = d;
      }
      return z.reverse();
    },
    getAllCells: Y(() => [A.getAllLeafColumns()], (z) => z.map((V) => $d(A, I, V, V.id)), G(A.options, "debugRows", "getAllCells")),
    _getAllCellsByColumnId: Y(() => [I.getAllCells()], (z) => z.reduce((V, d) => (V[d.column.id] = d, V), {}), G(A.options, "debugRows", "getAllCellsByColumnId"))
  };
  for (let z = 0; z < A._features.length; z++) {
    const V = A._features[z];
    V == null || V.createRow == null || V.createRow(I, A);
  }
  return I;
}, lV = {
  createColumn: (A, t) => {
    A._getFacetedRowModel = t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, A.id), A.getFacetedRowModel = () => A._getFacetedRowModel ? A._getFacetedRowModel() : t.getPreFilteredRowModel(), A._getFacetedUniqueValues = t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, A.id), A.getFacetedUniqueValues = () => A._getFacetedUniqueValues ? A._getFacetedUniqueValues() : /* @__PURE__ */ new Map(), A._getFacetedMinMaxValues = t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, A.id), A.getFacetedMinMaxValues = () => {
      if (A._getFacetedMinMaxValues)
        return A._getFacetedMinMaxValues();
    };
  }
}, Ze = (A, t, r) => {
  var l, e;
  const u = r == null || (l = r.toString()) == null ? void 0 : l.toLowerCase();
  return !!(!((e = A.getValue(t)) == null || (e = e.toString()) == null || (e = e.toLowerCase()) == null) && e.includes(u));
};
Ze.autoRemove = (A) => cA(A);
const Ce = (A, t, r) => {
  var l;
  return !!(!((l = A.getValue(t)) == null || (l = l.toString()) == null) && l.includes(r));
};
Ce.autoRemove = (A) => cA(A);
const fe = (A, t, r) => {
  var l;
  return ((l = A.getValue(t)) == null || (l = l.toString()) == null ? void 0 : l.toLowerCase()) === r?.toLowerCase();
};
fe.autoRemove = (A) => cA(A);
const be = (A, t, r) => {
  var l;
  return (l = A.getValue(t)) == null ? void 0 : l.includes(r);
};
be.autoRemove = (A) => cA(A);
const Ue = (A, t, r) => !r.some((l) => {
  var e;
  return !((e = A.getValue(t)) != null && e.includes(l));
});
Ue.autoRemove = (A) => cA(A) || !(A != null && A.length);
const he = (A, t, r) => r.some((l) => {
  var e;
  return (e = A.getValue(t)) == null ? void 0 : e.includes(l);
});
he.autoRemove = (A) => cA(A) || !(A != null && A.length);
const Ke = (A, t, r) => A.getValue(t) === r;
Ke.autoRemove = (A) => cA(A);
const Qe = (A, t, r) => A.getValue(t) == r;
Qe.autoRemove = (A) => cA(A);
const i3 = (A, t, r) => {
  let [l, e] = r;
  const u = A.getValue(t);
  return u >= l && u <= e;
};
i3.resolveFilterValue = (A) => {
  let [t, r] = A, l = typeof t != "number" ? parseFloat(t) : t, e = typeof r != "number" ? parseFloat(r) : r, u = t === null || Number.isNaN(l) ? -1 / 0 : l, a = r === null || Number.isNaN(e) ? 1 / 0 : e;
  if (u > a) {
    const I = u;
    u = a, a = I;
  }
  return [u, a];
};
i3.autoRemove = (A) => cA(A) || cA(A[0]) && cA(A[1]);
const xA = {
  includesString: Ze,
  includesStringSensitive: Ce,
  equalsString: fe,
  arrIncludes: be,
  arrIncludesAll: Ue,
  arrIncludesSome: he,
  equals: Ke,
  weakEquals: Qe,
  inNumberRange: i3
};
function cA(A) {
  return A == null || A === "";
}
const eV = {
  getDefaultColumnDef: () => ({
    filterFn: "auto"
  }),
  getInitialState: (A) => ({
    columnFilters: [],
    ...A
  }),
  getDefaultOptions: (A) => ({
    onColumnFiltersChange: VA("columnFilters", A),
    filterFromLeafRows: !1,
    maxLeafRowFilterDepth: 100
  }),
  createColumn: (A, t) => {
    A.getAutoFilterFn = () => {
      const r = t.getCoreRowModel().flatRows[0], l = r?.getValue(A.id);
      return typeof l == "string" ? xA.includesString : typeof l == "number" ? xA.inNumberRange : typeof l == "boolean" || l !== null && typeof l == "object" ? xA.equals : Array.isArray(l) ? xA.arrIncludes : xA.weakEquals;
    }, A.getFilterFn = () => {
      var r, l;
      return rr(A.columnDef.filterFn) ? A.columnDef.filterFn : A.columnDef.filterFn === "auto" ? A.getAutoFilterFn() : (
        // @ts-ignore
        (r = (l = t.options.filterFns) == null ? void 0 : l[A.columnDef.filterFn]) != null ? r : xA[A.columnDef.filterFn]
      );
    }, A.getCanFilter = () => {
      var r, l, e;
      return ((r = A.columnDef.enableColumnFilter) != null ? r : !0) && ((l = t.options.enableColumnFilters) != null ? l : !0) && ((e = t.options.enableFilters) != null ? e : !0) && !!A.accessorFn;
    }, A.getIsFiltered = () => A.getFilterIndex() > -1, A.getFilterValue = () => {
      var r;
      return (r = t.getState().columnFilters) == null || (r = r.find((l) => l.id === A.id)) == null ? void 0 : r.value;
    }, A.getFilterIndex = () => {
      var r, l;
      return (r = (l = t.getState().columnFilters) == null ? void 0 : l.findIndex((e) => e.id === A.id)) != null ? r : -1;
    }, A.setFilterValue = (r) => {
      t.setColumnFilters((l) => {
        const e = A.getFilterFn(), u = l?.find((d) => d.id === A.id), a = NA(r, u ? u.value : void 0);
        if (Al(e, a, A)) {
          var I;
          return (I = l?.filter((d) => d.id !== A.id)) != null ? I : [];
        }
        const z = {
          id: A.id,
          value: a
        };
        if (u) {
          var V;
          return (V = l?.map((d) => d.id === A.id ? z : d)) != null ? V : [];
        }
        return l != null && l.length ? [...l, z] : [z];
      });
    };
  },
  createRow: (A, t) => {
    A.columnFilters = {}, A.columnFiltersMeta = {};
  },
  createTable: (A) => {
    A.setColumnFilters = (t) => {
      const r = A.getAllLeafColumns(), l = (e) => {
        var u;
        return (u = NA(t, e)) == null ? void 0 : u.filter((a) => {
          const I = r.find((z) => z.id === a.id);
          if (I) {
            const z = I.getFilterFn();
            if (Al(z, a.value, I))
              return !1;
          }
          return !0;
        });
      };
      A.options.onColumnFiltersChange == null || A.options.onColumnFiltersChange(l);
    }, A.resetColumnFilters = (t) => {
      var r, l;
      A.setColumnFilters(t ? [] : (r = (l = A.initialState) == null ? void 0 : l.columnFilters) != null ? r : []);
    }, A.getPreFilteredRowModel = () => A.getCoreRowModel(), A.getFilteredRowModel = () => (!A._getFilteredRowModel && A.options.getFilteredRowModel && (A._getFilteredRowModel = A.options.getFilteredRowModel(A)), A.options.manualFiltering || !A._getFilteredRowModel ? A.getPreFilteredRowModel() : A._getFilteredRowModel());
  }
};
function Al(A, t, r) {
  return (A && A.autoRemove ? A.autoRemove(t, r) : !1) || typeof t > "u" || typeof t == "string" && !t;
}
const uV = (A, t, r) => r.reduce((l, e) => {
  const u = e.getValue(A);
  return l + (typeof u == "number" ? u : 0);
}, 0), aV = (A, t, r) => {
  let l;
  return r.forEach((e) => {
    const u = e.getValue(A);
    u != null && (l > u || l === void 0 && u >= u) && (l = u);
  }), l;
}, nV = (A, t, r) => {
  let l;
  return r.forEach((e) => {
    const u = e.getValue(A);
    u != null && (l < u || l === void 0 && u >= u) && (l = u);
  }), l;
}, IV = (A, t, r) => {
  let l, e;
  return r.forEach((u) => {
    const a = u.getValue(A);
    a != null && (l === void 0 ? a >= a && (l = e = a) : (l > a && (l = a), e < a && (e = a)));
  }), [l, e];
}, zV = (A, t) => {
  let r = 0, l = 0;
  if (t.forEach((e) => {
    let u = e.getValue(A);
    u != null && (u = +u) >= u && (++r, l += u);
  }), r) return l / r;
}, dV = (A, t) => {
  if (!t.length)
    return;
  const r = t.map((u) => u.getValue(A));
  if (!Hd(r))
    return;
  if (r.length === 1)
    return r[0];
  const l = Math.floor(r.length / 2), e = r.sort((u, a) => u - a);
  return r.length % 2 !== 0 ? e[l] : (e[l - 1] + e[l]) / 2;
}, VV = (A, t) => Array.from(new Set(t.map((r) => r.getValue(A))).values()), EV = (A, t) => new Set(t.map((r) => r.getValue(A))).size, pV = (A, t) => t.length, Ur = {
  sum: uV,
  min: aV,
  max: nV,
  extent: IV,
  mean: zV,
  median: dV,
  unique: VV,
  uniqueCount: EV,
  count: pV
}, iV = {
  getDefaultColumnDef: () => ({
    aggregatedCell: (A) => {
      var t, r;
      return (t = (r = A.getValue()) == null || r.toString == null ? void 0 : r.toString()) != null ? t : null;
    },
    aggregationFn: "auto"
  }),
  getInitialState: (A) => ({
    grouping: [],
    ...A
  }),
  getDefaultOptions: (A) => ({
    onGroupingChange: VA("grouping", A),
    groupedColumnMode: "reorder"
  }),
  createColumn: (A, t) => {
    A.toggleGrouping = () => {
      t.setGrouping((r) => r != null && r.includes(A.id) ? r.filter((l) => l !== A.id) : [...r ?? [], A.id]);
    }, A.getCanGroup = () => {
      var r, l;
      return ((r = A.columnDef.enableGrouping) != null ? r : !0) && ((l = t.options.enableGrouping) != null ? l : !0) && (!!A.accessorFn || !!A.columnDef.getGroupingValue);
    }, A.getIsGrouped = () => {
      var r;
      return (r = t.getState().grouping) == null ? void 0 : r.includes(A.id);
    }, A.getGroupedIndex = () => {
      var r;
      return (r = t.getState().grouping) == null ? void 0 : r.indexOf(A.id);
    }, A.getToggleGroupingHandler = () => {
      const r = A.getCanGroup();
      return () => {
        r && A.toggleGrouping();
      };
    }, A.getAutoAggregationFn = () => {
      const r = t.getCoreRowModel().flatRows[0], l = r?.getValue(A.id);
      if (typeof l == "number")
        return Ur.sum;
      if (Object.prototype.toString.call(l) === "[object Date]")
        return Ur.extent;
    }, A.getAggregationFn = () => {
      var r, l;
      if (!A)
        throw new Error();
      return rr(A.columnDef.aggregationFn) ? A.columnDef.aggregationFn : A.columnDef.aggregationFn === "auto" ? A.getAutoAggregationFn() : (r = (l = t.options.aggregationFns) == null ? void 0 : l[A.columnDef.aggregationFn]) != null ? r : Ur[A.columnDef.aggregationFn];
    };
  },
  createTable: (A) => {
    A.setGrouping = (t) => A.options.onGroupingChange == null ? void 0 : A.options.onGroupingChange(t), A.resetGrouping = (t) => {
      var r, l;
      A.setGrouping(t ? [] : (r = (l = A.initialState) == null ? void 0 : l.grouping) != null ? r : []);
    }, A.getPreGroupedRowModel = () => A.getFilteredRowModel(), A.getGroupedRowModel = () => (!A._getGroupedRowModel && A.options.getGroupedRowModel && (A._getGroupedRowModel = A.options.getGroupedRowModel(A)), A.options.manualGrouping || !A._getGroupedRowModel ? A.getPreGroupedRowModel() : A._getGroupedRowModel());
  },
  createRow: (A, t) => {
    A.getIsGrouped = () => !!A.groupingColumnId, A.getGroupingValue = (r) => {
      if (A._groupingValuesCache.hasOwnProperty(r))
        return A._groupingValuesCache[r];
      const l = t.getColumn(r);
      return l != null && l.columnDef.getGroupingValue ? (A._groupingValuesCache[r] = l.columnDef.getGroupingValue(A.original), A._groupingValuesCache[r]) : A.getValue(r);
    }, A._groupingValuesCache = {};
  },
  createCell: (A, t, r, l) => {
    A.getIsGrouped = () => t.getIsGrouped() && t.id === r.groupingColumnId, A.getIsPlaceholder = () => !A.getIsGrouped() && t.getIsGrouped(), A.getIsAggregated = () => {
      var e;
      return !A.getIsGrouped() && !A.getIsPlaceholder() && !!((e = r.subRows) != null && e.length);
    };
  }
};
function qV(A, t, r) {
  if (!(t != null && t.length) || !r)
    return A;
  const l = A.filter((u) => !t.includes(u.id));
  return r === "remove" ? l : [...t.map((u) => A.find((a) => a.id === u)).filter(Boolean), ...l];
}
const mV = {
  getInitialState: (A) => ({
    columnOrder: [],
    ...A
  }),
  getDefaultOptions: (A) => ({
    onColumnOrderChange: VA("columnOrder", A)
  }),
  createColumn: (A, t) => {
    A.getIndex = Y((r) => [it(t, r)], (r) => r.findIndex((l) => l.id === A.id), G(t.options, "debugColumns", "getIndex")), A.getIsFirstColumn = (r) => {
      var l;
      return ((l = it(t, r)[0]) == null ? void 0 : l.id) === A.id;
    }, A.getIsLastColumn = (r) => {
      var l;
      const e = it(t, r);
      return ((l = e[e.length - 1]) == null ? void 0 : l.id) === A.id;
    };
  },
  createTable: (A) => {
    A.setColumnOrder = (t) => A.options.onColumnOrderChange == null ? void 0 : A.options.onColumnOrderChange(t), A.resetColumnOrder = (t) => {
      var r;
      A.setColumnOrder(t ? [] : (r = A.initialState.columnOrder) != null ? r : []);
    }, A._getOrderColumnsFn = Y(() => [A.getState().columnOrder, A.getState().grouping, A.options.groupedColumnMode], (t, r, l) => (e) => {
      let u = [];
      if (!(t != null && t.length))
        u = e;
      else {
        const a = [...t], I = [...e];
        for (; I.length && a.length; ) {
          const z = a.shift(), V = I.findIndex((d) => d.id === z);
          V > -1 && u.push(I.splice(V, 1)[0]);
        }
        u = [...u, ...I];
      }
      return qV(u, r, l);
    }, G(A.options, "debugTable", "_getOrderColumnsFn"));
  }
}, hr = () => ({
  left: [],
  right: []
}), MV = {
  getInitialState: (A) => ({
    columnPinning: hr(),
    ...A
  }),
  getDefaultOptions: (A) => ({
    onColumnPinningChange: VA("columnPinning", A)
  }),
  createColumn: (A, t) => {
    A.pin = (r) => {
      const l = A.getLeafColumns().map((e) => e.id).filter(Boolean);
      t.setColumnPinning((e) => {
        var u, a;
        if (r === "right") {
          var I, z;
          return {
            left: ((I = e?.left) != null ? I : []).filter((p) => !(l != null && l.includes(p))),
            right: [...((z = e?.right) != null ? z : []).filter((p) => !(l != null && l.includes(p))), ...l]
          };
        }
        if (r === "left") {
          var V, d;
          return {
            left: [...((V = e?.left) != null ? V : []).filter((p) => !(l != null && l.includes(p))), ...l],
            right: ((d = e?.right) != null ? d : []).filter((p) => !(l != null && l.includes(p)))
          };
        }
        return {
          left: ((u = e?.left) != null ? u : []).filter((p) => !(l != null && l.includes(p))),
          right: ((a = e?.right) != null ? a : []).filter((p) => !(l != null && l.includes(p)))
        };
      });
    }, A.getCanPin = () => A.getLeafColumns().some((l) => {
      var e, u, a;
      return ((e = l.columnDef.enablePinning) != null ? e : !0) && ((u = (a = t.options.enableColumnPinning) != null ? a : t.options.enablePinning) != null ? u : !0);
    }), A.getIsPinned = () => {
      const r = A.getLeafColumns().map((I) => I.id), {
        left: l,
        right: e
      } = t.getState().columnPinning, u = r.some((I) => l?.includes(I)), a = r.some((I) => e?.includes(I));
      return u ? "left" : a ? "right" : !1;
    }, A.getPinnedIndex = () => {
      var r, l;
      const e = A.getIsPinned();
      return e ? (r = (l = t.getState().columnPinning) == null || (l = l[e]) == null ? void 0 : l.indexOf(A.id)) != null ? r : -1 : 0;
    };
  },
  createRow: (A, t) => {
    A.getCenterVisibleCells = Y(() => [A._getAllVisibleCells(), t.getState().columnPinning.left, t.getState().columnPinning.right], (r, l, e) => {
      const u = [...l ?? [], ...e ?? []];
      return r.filter((a) => !u.includes(a.column.id));
    }, G(t.options, "debugRows", "getCenterVisibleCells")), A.getLeftVisibleCells = Y(() => [A._getAllVisibleCells(), t.getState().columnPinning.left], (r, l) => (l ?? []).map((u) => r.find((a) => a.column.id === u)).filter(Boolean).map((u) => ({
      ...u,
      position: "left"
    })), G(t.options, "debugRows", "getLeftVisibleCells")), A.getRightVisibleCells = Y(() => [A._getAllVisibleCells(), t.getState().columnPinning.right], (r, l) => (l ?? []).map((u) => r.find((a) => a.column.id === u)).filter(Boolean).map((u) => ({
      ...u,
      position: "right"
    })), G(t.options, "debugRows", "getRightVisibleCells"));
  },
  createTable: (A) => {
    A.setColumnPinning = (t) => A.options.onColumnPinningChange == null ? void 0 : A.options.onColumnPinningChange(t), A.resetColumnPinning = (t) => {
      var r, l;
      return A.setColumnPinning(t ? hr() : (r = (l = A.initialState) == null ? void 0 : l.columnPinning) != null ? r : hr());
    }, A.getIsSomeColumnsPinned = (t) => {
      var r;
      const l = A.getState().columnPinning;
      if (!t) {
        var e, u;
        return !!((e = l.left) != null && e.length || (u = l.right) != null && u.length);
      }
      return !!((r = l[t]) != null && r.length);
    }, A.getLeftLeafColumns = Y(() => [A.getAllLeafColumns(), A.getState().columnPinning.left], (t, r) => (r ?? []).map((l) => t.find((e) => e.id === l)).filter(Boolean), G(A.options, "debugColumns", "getLeftLeafColumns")), A.getRightLeafColumns = Y(() => [A.getAllLeafColumns(), A.getState().columnPinning.right], (t, r) => (r ?? []).map((l) => t.find((e) => e.id === l)).filter(Boolean), G(A.options, "debugColumns", "getRightLeafColumns")), A.getCenterLeafColumns = Y(() => [A.getAllLeafColumns(), A.getState().columnPinning.left, A.getState().columnPinning.right], (t, r, l) => {
      const e = [...r ?? [], ...l ?? []];
      return t.filter((u) => !e.includes(u.id));
    }, G(A.options, "debugColumns", "getCenterLeafColumns"));
  }
};
function vV(A) {
  return A || (typeof document < "u" ? document : null);
}
const Rt = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
}, Kr = () => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: !1,
  columnSizingStart: []
}), cV = {
  getDefaultColumnDef: () => Rt,
  getInitialState: (A) => ({
    columnSizing: {},
    columnSizingInfo: Kr(),
    ...A
  }),
  getDefaultOptions: (A) => ({
    columnResizeMode: "onEnd",
    columnResizeDirection: "ltr",
    onColumnSizingChange: VA("columnSizing", A),
    onColumnSizingInfoChange: VA("columnSizingInfo", A)
  }),
  createColumn: (A, t) => {
    A.getSize = () => {
      var r, l, e;
      const u = t.getState().columnSizing[A.id];
      return Math.min(Math.max((r = A.columnDef.minSize) != null ? r : Rt.minSize, (l = u ?? A.columnDef.size) != null ? l : Rt.size), (e = A.columnDef.maxSize) != null ? e : Rt.maxSize);
    }, A.getStart = Y((r) => [r, it(t, r), t.getState().columnSizing], (r, l) => l.slice(0, A.getIndex(r)).reduce((e, u) => e + u.getSize(), 0), G(t.options, "debugColumns", "getStart")), A.getAfter = Y((r) => [r, it(t, r), t.getState().columnSizing], (r, l) => l.slice(A.getIndex(r) + 1).reduce((e, u) => e + u.getSize(), 0), G(t.options, "debugColumns", "getAfter")), A.resetSize = () => {
      t.setColumnSizing((r) => {
        let {
          [A.id]: l,
          ...e
        } = r;
        return e;
      });
    }, A.getCanResize = () => {
      var r, l;
      return ((r = A.columnDef.enableResizing) != null ? r : !0) && ((l = t.options.enableColumnResizing) != null ? l : !0);
    }, A.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === A.id;
  },
  createHeader: (A, t) => {
    A.getSize = () => {
      let r = 0;
      const l = (e) => {
        if (e.subHeaders.length)
          e.subHeaders.forEach(l);
        else {
          var u;
          r += (u = e.column.getSize()) != null ? u : 0;
        }
      };
      return l(A), r;
    }, A.getStart = () => {
      if (A.index > 0) {
        const r = A.headerGroup.headers[A.index - 1];
        return r.getStart() + r.getSize();
      }
      return 0;
    }, A.getResizeHandler = (r) => {
      const l = t.getColumn(A.column.id), e = l?.getCanResize();
      return (u) => {
        if (!l || !e || (u.persist == null || u.persist(), Qr(u) && u.touches && u.touches.length > 1))
          return;
        const a = A.getSize(), I = A ? A.getLeafHeaders().map((M) => [M.column.id, M.column.getSize()]) : [[l.id, l.getSize()]], z = Qr(u) ? Math.round(u.touches[0].clientX) : u.clientX, V = {}, d = (M, W) => {
          typeof W == "number" && (t.setColumnSizingInfo((C) => {
            var Z, b;
            const U = t.options.columnResizeDirection === "rtl" ? -1 : 1, f = (W - ((Z = C?.startOffset) != null ? Z : 0)) * U, h = Math.max(f / ((b = C?.startSize) != null ? b : 0), -0.999999);
            return C.columnSizingStart.forEach((K) => {
              let [Q, x] = K;
              V[Q] = Math.round(Math.max(x + x * h, 0) * 100) / 100;
            }), {
              ...C,
              deltaOffset: f,
              deltaPercentage: h
            };
          }), (t.options.columnResizeMode === "onChange" || M === "end") && t.setColumnSizing((C) => ({
            ...C,
            ...V
          })));
        }, p = (M) => d("move", M), E = (M) => {
          d("end", M), t.setColumnSizingInfo((W) => ({
            ...W,
            isResizingColumn: !1,
            startOffset: null,
            startSize: null,
            deltaOffset: null,
            deltaPercentage: null,
            columnSizingStart: []
          }));
        }, q = vV(r), m = {
          moveHandler: (M) => p(M.clientX),
          upHandler: (M) => {
            q?.removeEventListener("mousemove", m.moveHandler), q?.removeEventListener("mouseup", m.upHandler), E(M.clientX);
          }
        }, v = {
          moveHandler: (M) => (M.cancelable && (M.preventDefault(), M.stopPropagation()), p(M.touches[0].clientX), !1),
          upHandler: (M) => {
            var W;
            q?.removeEventListener("touchmove", v.moveHandler), q?.removeEventListener("touchend", v.upHandler), M.cancelable && (M.preventDefault(), M.stopPropagation()), E((W = M.touches[0]) == null ? void 0 : W.clientX);
          }
        }, c = WV() ? {
          passive: !1
        } : !1;
        Qr(u) ? (q?.addEventListener("touchmove", v.moveHandler, c), q?.addEventListener("touchend", v.upHandler, c)) : (q?.addEventListener("mousemove", m.moveHandler, c), q?.addEventListener("mouseup", m.upHandler, c)), t.setColumnSizingInfo((M) => ({
          ...M,
          startOffset: z,
          startSize: a,
          deltaOffset: 0,
          deltaPercentage: 0,
          columnSizingStart: I,
          isResizingColumn: l.id
        }));
      };
    };
  },
  createTable: (A) => {
    A.setColumnSizing = (t) => A.options.onColumnSizingChange == null ? void 0 : A.options.onColumnSizingChange(t), A.setColumnSizingInfo = (t) => A.options.onColumnSizingInfoChange == null ? void 0 : A.options.onColumnSizingInfoChange(t), A.resetColumnSizing = (t) => {
      var r;
      A.setColumnSizing(t ? {} : (r = A.initialState.columnSizing) != null ? r : {});
    }, A.resetHeaderSizeInfo = (t) => {
      var r;
      A.setColumnSizingInfo(t ? Kr() : (r = A.initialState.columnSizingInfo) != null ? r : Kr());
    }, A.getTotalSize = () => {
      var t, r;
      return (t = (r = A.getHeaderGroups()[0]) == null ? void 0 : r.headers.reduce((l, e) => l + e.getSize(), 0)) != null ? t : 0;
    }, A.getLeftTotalSize = () => {
      var t, r;
      return (t = (r = A.getLeftHeaderGroups()[0]) == null ? void 0 : r.headers.reduce((l, e) => l + e.getSize(), 0)) != null ? t : 0;
    }, A.getCenterTotalSize = () => {
      var t, r;
      return (t = (r = A.getCenterHeaderGroups()[0]) == null ? void 0 : r.headers.reduce((l, e) => l + e.getSize(), 0)) != null ? t : 0;
    }, A.getRightTotalSize = () => {
      var t, r;
      return (t = (r = A.getRightHeaderGroups()[0]) == null ? void 0 : r.headers.reduce((l, e) => l + e.getSize(), 0)) != null ? t : 0;
    };
  }
};
let jt = null;
function WV() {
  if (typeof jt == "boolean") return jt;
  let A = !1;
  try {
    const t = {
      get passive() {
        return A = !0, !1;
      }
    }, r = () => {
    };
    window.addEventListener("test", r, t), window.removeEventListener("test", r);
  } catch {
    A = !1;
  }
  return jt = A, jt;
}
function Qr(A) {
  return A.type === "touchstart";
}
const ZV = {
  getInitialState: (A) => ({
    columnVisibility: {},
    ...A
  }),
  getDefaultOptions: (A) => ({
    onColumnVisibilityChange: VA("columnVisibility", A)
  }),
  createColumn: (A, t) => {
    A.toggleVisibility = (r) => {
      A.getCanHide() && t.setColumnVisibility((l) => ({
        ...l,
        [A.id]: r ?? !A.getIsVisible()
      }));
    }, A.getIsVisible = () => {
      var r, l;
      const e = A.columns;
      return (r = e.length ? e.some((u) => u.getIsVisible()) : (l = t.getState().columnVisibility) == null ? void 0 : l[A.id]) != null ? r : !0;
    }, A.getCanHide = () => {
      var r, l;
      return ((r = A.columnDef.enableHiding) != null ? r : !0) && ((l = t.options.enableHiding) != null ? l : !0);
    }, A.getToggleVisibilityHandler = () => (r) => {
      A.toggleVisibility == null || A.toggleVisibility(r.target.checked);
    };
  },
  createRow: (A, t) => {
    A._getAllVisibleCells = Y(() => [A.getAllCells(), t.getState().columnVisibility], (r) => r.filter((l) => l.column.getIsVisible()), G(t.options, "debugRows", "_getAllVisibleCells")), A.getVisibleCells = Y(() => [A.getLeftVisibleCells(), A.getCenterVisibleCells(), A.getRightVisibleCells()], (r, l, e) => [...r, ...l, ...e], G(t.options, "debugRows", "getVisibleCells"));
  },
  createTable: (A) => {
    const t = (r, l) => Y(() => [l(), l().filter((e) => e.getIsVisible()).map((e) => e.id).join("_")], (e) => e.filter((u) => u.getIsVisible == null ? void 0 : u.getIsVisible()), G(A.options, "debugColumns", r));
    A.getVisibleFlatColumns = t("getVisibleFlatColumns", () => A.getAllFlatColumns()), A.getVisibleLeafColumns = t("getVisibleLeafColumns", () => A.getAllLeafColumns()), A.getLeftVisibleLeafColumns = t("getLeftVisibleLeafColumns", () => A.getLeftLeafColumns()), A.getRightVisibleLeafColumns = t("getRightVisibleLeafColumns", () => A.getRightLeafColumns()), A.getCenterVisibleLeafColumns = t("getCenterVisibleLeafColumns", () => A.getCenterLeafColumns()), A.setColumnVisibility = (r) => A.options.onColumnVisibilityChange == null ? void 0 : A.options.onColumnVisibilityChange(r), A.resetColumnVisibility = (r) => {
      var l;
      A.setColumnVisibility(r ? {} : (l = A.initialState.columnVisibility) != null ? l : {});
    }, A.toggleAllColumnsVisible = (r) => {
      var l;
      r = (l = r) != null ? l : !A.getIsAllColumnsVisible(), A.setColumnVisibility(A.getAllLeafColumns().reduce((e, u) => ({
        ...e,
        [u.id]: r || !(u.getCanHide != null && u.getCanHide())
      }), {}));
    }, A.getIsAllColumnsVisible = () => !A.getAllLeafColumns().some((r) => !(r.getIsVisible != null && r.getIsVisible())), A.getIsSomeColumnsVisible = () => A.getAllLeafColumns().some((r) => r.getIsVisible == null ? void 0 : r.getIsVisible()), A.getToggleAllColumnsVisibilityHandler = () => (r) => {
      var l;
      A.toggleAllColumnsVisible((l = r.target) == null ? void 0 : l.checked);
    };
  }
};
function it(A, t) {
  return t ? t === "center" ? A.getCenterVisibleLeafColumns() : t === "left" ? A.getLeftVisibleLeafColumns() : A.getRightVisibleLeafColumns() : A.getVisibleLeafColumns();
}
const CV = {
  createTable: (A) => {
    A._getGlobalFacetedRowModel = A.options.getFacetedRowModel && A.options.getFacetedRowModel(A, "__global__"), A.getGlobalFacetedRowModel = () => A.options.manualFiltering || !A._getGlobalFacetedRowModel ? A.getPreFilteredRowModel() : A._getGlobalFacetedRowModel(), A._getGlobalFacetedUniqueValues = A.options.getFacetedUniqueValues && A.options.getFacetedUniqueValues(A, "__global__"), A.getGlobalFacetedUniqueValues = () => A._getGlobalFacetedUniqueValues ? A._getGlobalFacetedUniqueValues() : /* @__PURE__ */ new Map(), A._getGlobalFacetedMinMaxValues = A.options.getFacetedMinMaxValues && A.options.getFacetedMinMaxValues(A, "__global__"), A.getGlobalFacetedMinMaxValues = () => {
      if (A._getGlobalFacetedMinMaxValues)
        return A._getGlobalFacetedMinMaxValues();
    };
  }
}, fV = {
  getInitialState: (A) => ({
    globalFilter: void 0,
    ...A
  }),
  getDefaultOptions: (A) => ({
    onGlobalFilterChange: VA("globalFilter", A),
    globalFilterFn: "auto",
    getColumnCanGlobalFilter: (t) => {
      var r;
      const l = (r = A.getCoreRowModel().flatRows[0]) == null || (r = r._getAllCellsByColumnId()[t.id]) == null ? void 0 : r.getValue();
      return typeof l == "string" || typeof l == "number";
    }
  }),
  createColumn: (A, t) => {
    A.getCanGlobalFilter = () => {
      var r, l, e, u;
      return ((r = A.columnDef.enableGlobalFilter) != null ? r : !0) && ((l = t.options.enableGlobalFilter) != null ? l : !0) && ((e = t.options.enableFilters) != null ? e : !0) && ((u = t.options.getColumnCanGlobalFilter == null ? void 0 : t.options.getColumnCanGlobalFilter(A)) != null ? u : !0) && !!A.accessorFn;
    };
  },
  createTable: (A) => {
    A.getGlobalAutoFilterFn = () => xA.includesString, A.getGlobalFilterFn = () => {
      var t, r;
      const {
        globalFilterFn: l
      } = A.options;
      return rr(l) ? l : l === "auto" ? A.getGlobalAutoFilterFn() : (t = (r = A.options.filterFns) == null ? void 0 : r[l]) != null ? t : xA[l];
    }, A.setGlobalFilter = (t) => {
      A.options.onGlobalFilterChange == null || A.options.onGlobalFilterChange(t);
    }, A.resetGlobalFilter = (t) => {
      A.setGlobalFilter(t ? void 0 : A.initialState.globalFilter);
    };
  }
}, bV = {
  getInitialState: (A) => ({
    expanded: {},
    ...A
  }),
  getDefaultOptions: (A) => ({
    onExpandedChange: VA("expanded", A),
    paginateExpandedRows: !0
  }),
  createTable: (A) => {
    let t = !1, r = !1;
    A._autoResetExpanded = () => {
      var l, e;
      if (!t) {
        A._queue(() => {
          t = !0;
        });
        return;
      }
      if ((l = (e = A.options.autoResetAll) != null ? e : A.options.autoResetExpanded) != null ? l : !A.options.manualExpanding) {
        if (r) return;
        r = !0, A._queue(() => {
          A.resetExpanded(), r = !1;
        });
      }
    }, A.setExpanded = (l) => A.options.onExpandedChange == null ? void 0 : A.options.onExpandedChange(l), A.toggleAllRowsExpanded = (l) => {
      l ?? !A.getIsAllRowsExpanded() ? A.setExpanded(!0) : A.setExpanded({});
    }, A.resetExpanded = (l) => {
      var e, u;
      A.setExpanded(l ? {} : (e = (u = A.initialState) == null ? void 0 : u.expanded) != null ? e : {});
    }, A.getCanSomeRowsExpand = () => A.getPrePaginationRowModel().flatRows.some((l) => l.getCanExpand()), A.getToggleAllRowsExpandedHandler = () => (l) => {
      l.persist == null || l.persist(), A.toggleAllRowsExpanded();
    }, A.getIsSomeRowsExpanded = () => {
      const l = A.getState().expanded;
      return l === !0 || Object.values(l).some(Boolean);
    }, A.getIsAllRowsExpanded = () => {
      const l = A.getState().expanded;
      return typeof l == "boolean" ? l === !0 : !(!Object.keys(l).length || A.getRowModel().flatRows.some((e) => !e.getIsExpanded()));
    }, A.getExpandedDepth = () => {
      let l = 0;
      return (A.getState().expanded === !0 ? Object.keys(A.getRowModel().rowsById) : Object.keys(A.getState().expanded)).forEach((u) => {
        const a = u.split(".");
        l = Math.max(l, a.length);
      }), l;
    }, A.getPreExpandedRowModel = () => A.getSortedRowModel(), A.getExpandedRowModel = () => (!A._getExpandedRowModel && A.options.getExpandedRowModel && (A._getExpandedRowModel = A.options.getExpandedRowModel(A)), A.options.manualExpanding || !A._getExpandedRowModel ? A.getPreExpandedRowModel() : A._getExpandedRowModel());
  },
  createRow: (A, t) => {
    A.toggleExpanded = (r) => {
      t.setExpanded((l) => {
        var e;
        const u = l === !0 ? !0 : !!(l != null && l[A.id]);
        let a = {};
        if (l === !0 ? Object.keys(t.getRowModel().rowsById).forEach((I) => {
          a[I] = !0;
        }) : a = l, r = (e = r) != null ? e : !u, !u && r)
          return {
            ...a,
            [A.id]: !0
          };
        if (u && !r) {
          const {
            [A.id]: I,
            ...z
          } = a;
          return z;
        }
        return l;
      });
    }, A.getIsExpanded = () => {
      var r;
      const l = t.getState().expanded;
      return !!((r = t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(A)) != null ? r : l === !0 || l?.[A.id]);
    }, A.getCanExpand = () => {
      var r, l, e;
      return (r = t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(A)) != null ? r : ((l = t.options.enableExpanding) != null ? l : !0) && !!((e = A.subRows) != null && e.length);
    }, A.getIsAllParentsExpanded = () => {
      let r = !0, l = A;
      for (; r && l.parentId; )
        l = t.getRow(l.parentId, !0), r = l.getIsExpanded();
      return r;
    }, A.getToggleExpandedHandler = () => {
      const r = A.getCanExpand();
      return () => {
        r && A.toggleExpanded();
      };
    };
  }
}, gr = 0, yr = 10, Sr = () => ({
  pageIndex: gr,
  pageSize: yr
}), UV = {
  getInitialState: (A) => ({
    ...A,
    pagination: {
      ...Sr(),
      ...A?.pagination
    }
  }),
  getDefaultOptions: (A) => ({
    onPaginationChange: VA("pagination", A)
  }),
  createTable: (A) => {
    let t = !1, r = !1;
    A._autoResetPageIndex = () => {
      var l, e;
      if (!t) {
        A._queue(() => {
          t = !0;
        });
        return;
      }
      if ((l = (e = A.options.autoResetAll) != null ? e : A.options.autoResetPageIndex) != null ? l : !A.options.manualPagination) {
        if (r) return;
        r = !0, A._queue(() => {
          A.resetPageIndex(), r = !1;
        });
      }
    }, A.setPagination = (l) => {
      const e = (u) => NA(l, u);
      return A.options.onPaginationChange == null ? void 0 : A.options.onPaginationChange(e);
    }, A.resetPagination = (l) => {
      var e;
      A.setPagination(l ? Sr() : (e = A.initialState.pagination) != null ? e : Sr());
    }, A.setPageIndex = (l) => {
      A.setPagination((e) => {
        let u = NA(l, e.pageIndex);
        const a = typeof A.options.pageCount > "u" || A.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : A.options.pageCount - 1;
        return u = Math.max(0, Math.min(u, a)), {
          ...e,
          pageIndex: u
        };
      });
    }, A.resetPageIndex = (l) => {
      var e, u;
      A.setPageIndex(l ? gr : (e = (u = A.initialState) == null || (u = u.pagination) == null ? void 0 : u.pageIndex) != null ? e : gr);
    }, A.resetPageSize = (l) => {
      var e, u;
      A.setPageSize(l ? yr : (e = (u = A.initialState) == null || (u = u.pagination) == null ? void 0 : u.pageSize) != null ? e : yr);
    }, A.setPageSize = (l) => {
      A.setPagination((e) => {
        const u = Math.max(1, NA(l, e.pageSize)), a = e.pageSize * e.pageIndex, I = Math.floor(a / u);
        return {
          ...e,
          pageIndex: I,
          pageSize: u
        };
      });
    }, A.setPageCount = (l) => A.setPagination((e) => {
      var u;
      let a = NA(l, (u = A.options.pageCount) != null ? u : -1);
      return typeof a == "number" && (a = Math.max(-1, a)), {
        ...e,
        pageCount: a
      };
    }), A.getPageOptions = Y(() => [A.getPageCount()], (l) => {
      let e = [];
      return l && l > 0 && (e = [...new Array(l)].fill(null).map((u, a) => a)), e;
    }, G(A.options, "debugTable", "getPageOptions")), A.getCanPreviousPage = () => A.getState().pagination.pageIndex > 0, A.getCanNextPage = () => {
      const {
        pageIndex: l
      } = A.getState().pagination, e = A.getPageCount();
      return e === -1 ? !0 : e === 0 ? !1 : l < e - 1;
    }, A.previousPage = () => A.setPageIndex((l) => l - 1), A.nextPage = () => A.setPageIndex((l) => l + 1), A.firstPage = () => A.setPageIndex(0), A.lastPage = () => A.setPageIndex(A.getPageCount() - 1), A.getPrePaginationRowModel = () => A.getExpandedRowModel(), A.getPaginationRowModel = () => (!A._getPaginationRowModel && A.options.getPaginationRowModel && (A._getPaginationRowModel = A.options.getPaginationRowModel(A)), A.options.manualPagination || !A._getPaginationRowModel ? A.getPrePaginationRowModel() : A._getPaginationRowModel()), A.getPageCount = () => {
      var l;
      return (l = A.options.pageCount) != null ? l : Math.ceil(A.getRowCount() / A.getState().pagination.pageSize);
    }, A.getRowCount = () => {
      var l;
      return (l = A.options.rowCount) != null ? l : A.getPrePaginationRowModel().rows.length;
    };
  }
}, sr = () => ({
  top: [],
  bottom: []
}), hV = {
  getInitialState: (A) => ({
    rowPinning: sr(),
    ...A
  }),
  getDefaultOptions: (A) => ({
    onRowPinningChange: VA("rowPinning", A)
  }),
  createRow: (A, t) => {
    A.pin = (r, l, e) => {
      const u = l ? A.getLeafRows().map((z) => {
        let {
          id: V
        } = z;
        return V;
      }) : [], a = e ? A.getParentRows().map((z) => {
        let {
          id: V
        } = z;
        return V;
      }) : [], I = /* @__PURE__ */ new Set([...a, A.id, ...u]);
      t.setRowPinning((z) => {
        var V, d;
        if (r === "bottom") {
          var p, E;
          return {
            top: ((p = z?.top) != null ? p : []).filter((v) => !(I != null && I.has(v))),
            bottom: [...((E = z?.bottom) != null ? E : []).filter((v) => !(I != null && I.has(v))), ...Array.from(I)]
          };
        }
        if (r === "top") {
          var q, m;
          return {
            top: [...((q = z?.top) != null ? q : []).filter((v) => !(I != null && I.has(v))), ...Array.from(I)],
            bottom: ((m = z?.bottom) != null ? m : []).filter((v) => !(I != null && I.has(v)))
          };
        }
        return {
          top: ((V = z?.top) != null ? V : []).filter((v) => !(I != null && I.has(v))),
          bottom: ((d = z?.bottom) != null ? d : []).filter((v) => !(I != null && I.has(v)))
        };
      });
    }, A.getCanPin = () => {
      var r;
      const {
        enableRowPinning: l,
        enablePinning: e
      } = t.options;
      return typeof l == "function" ? l(A) : (r = l ?? e) != null ? r : !0;
    }, A.getIsPinned = () => {
      const r = [A.id], {
        top: l,
        bottom: e
      } = t.getState().rowPinning, u = r.some((I) => l?.includes(I)), a = r.some((I) => e?.includes(I));
      return u ? "top" : a ? "bottom" : !1;
    }, A.getPinnedIndex = () => {
      var r, l;
      const e = A.getIsPinned();
      if (!e) return -1;
      const u = (r = e === "top" ? t.getTopRows() : t.getBottomRows()) == null ? void 0 : r.map((a) => {
        let {
          id: I
        } = a;
        return I;
      });
      return (l = u?.indexOf(A.id)) != null ? l : -1;
    };
  },
  createTable: (A) => {
    A.setRowPinning = (t) => A.options.onRowPinningChange == null ? void 0 : A.options.onRowPinningChange(t), A.resetRowPinning = (t) => {
      var r, l;
      return A.setRowPinning(t ? sr() : (r = (l = A.initialState) == null ? void 0 : l.rowPinning) != null ? r : sr());
    }, A.getIsSomeRowsPinned = (t) => {
      var r;
      const l = A.getState().rowPinning;
      if (!t) {
        var e, u;
        return !!((e = l.top) != null && e.length || (u = l.bottom) != null && u.length);
      }
      return !!((r = l[t]) != null && r.length);
    }, A._getPinnedRows = (t, r, l) => {
      var e;
      return ((e = A.options.keepPinnedRows) == null || e ? (
        //get all rows that are pinned even if they would not be otherwise visible
        //account for expanded parent rows, but not pagination or filtering
        (r ?? []).map((a) => {
          const I = A.getRow(a, !0);
          return I.getIsAllParentsExpanded() ? I : null;
        })
      ) : (
        //else get only visible rows that are pinned
        (r ?? []).map((a) => t.find((I) => I.id === a))
      )).filter(Boolean).map((a) => ({
        ...a,
        position: l
      }));
    }, A.getTopRows = Y(() => [A.getRowModel().rows, A.getState().rowPinning.top], (t, r) => A._getPinnedRows(t, r, "top"), G(A.options, "debugRows", "getTopRows")), A.getBottomRows = Y(() => [A.getRowModel().rows, A.getState().rowPinning.bottom], (t, r) => A._getPinnedRows(t, r, "bottom"), G(A.options, "debugRows", "getBottomRows")), A.getCenterRows = Y(() => [A.getRowModel().rows, A.getState().rowPinning.top, A.getState().rowPinning.bottom], (t, r, l) => {
      const e = /* @__PURE__ */ new Set([...r ?? [], ...l ?? []]);
      return t.filter((u) => !e.has(u.id));
    }, G(A.options, "debugRows", "getCenterRows"));
  }
}, KV = {
  getInitialState: (A) => ({
    rowSelection: {},
    ...A
  }),
  getDefaultOptions: (A) => ({
    onRowSelectionChange: VA("rowSelection", A),
    enableRowSelection: !0,
    enableMultiRowSelection: !0,
    enableSubRowSelection: !0
    // enableGroupingRowSelection: false,
    // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
    // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
  }),
  createTable: (A) => {
    A.setRowSelection = (t) => A.options.onRowSelectionChange == null ? void 0 : A.options.onRowSelectionChange(t), A.resetRowSelection = (t) => {
      var r;
      return A.setRowSelection(t ? {} : (r = A.initialState.rowSelection) != null ? r : {});
    }, A.toggleAllRowsSelected = (t) => {
      A.setRowSelection((r) => {
        t = typeof t < "u" ? t : !A.getIsAllRowsSelected();
        const l = {
          ...r
        }, e = A.getPreGroupedRowModel().flatRows;
        return t ? e.forEach((u) => {
          u.getCanSelect() && (l[u.id] = !0);
        }) : e.forEach((u) => {
          delete l[u.id];
        }), l;
      });
    }, A.toggleAllPageRowsSelected = (t) => A.setRowSelection((r) => {
      const l = typeof t < "u" ? t : !A.getIsAllPageRowsSelected(), e = {
        ...r
      };
      return A.getRowModel().rows.forEach((u) => {
        Nr(e, u.id, l, !0, A);
      }), e;
    }), A.getPreSelectedRowModel = () => A.getCoreRowModel(), A.getSelectedRowModel = Y(() => [A.getState().rowSelection, A.getCoreRowModel()], (t, r) => Object.keys(t).length ? xr(A, r) : {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, G(A.options, "debugTable", "getSelectedRowModel")), A.getFilteredSelectedRowModel = Y(() => [A.getState().rowSelection, A.getFilteredRowModel()], (t, r) => Object.keys(t).length ? xr(A, r) : {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, G(A.options, "debugTable", "getFilteredSelectedRowModel")), A.getGroupedSelectedRowModel = Y(() => [A.getState().rowSelection, A.getSortedRowModel()], (t, r) => Object.keys(t).length ? xr(A, r) : {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, G(A.options, "debugTable", "getGroupedSelectedRowModel")), A.getIsAllRowsSelected = () => {
      const t = A.getFilteredRowModel().flatRows, {
        rowSelection: r
      } = A.getState();
      let l = !!(t.length && Object.keys(r).length);
      return l && t.some((e) => e.getCanSelect() && !r[e.id]) && (l = !1), l;
    }, A.getIsAllPageRowsSelected = () => {
      const t = A.getPaginationRowModel().flatRows.filter((e) => e.getCanSelect()), {
        rowSelection: r
      } = A.getState();
      let l = !!t.length;
      return l && t.some((e) => !r[e.id]) && (l = !1), l;
    }, A.getIsSomeRowsSelected = () => {
      var t;
      const r = Object.keys((t = A.getState().rowSelection) != null ? t : {}).length;
      return r > 0 && r < A.getFilteredRowModel().flatRows.length;
    }, A.getIsSomePageRowsSelected = () => {
      const t = A.getPaginationRowModel().flatRows;
      return A.getIsAllPageRowsSelected() ? !1 : t.filter((r) => r.getCanSelect()).some((r) => r.getIsSelected() || r.getIsSomeSelected());
    }, A.getToggleAllRowsSelectedHandler = () => (t) => {
      A.toggleAllRowsSelected(t.target.checked);
    }, A.getToggleAllPageRowsSelectedHandler = () => (t) => {
      A.toggleAllPageRowsSelected(t.target.checked);
    };
  },
  createRow: (A, t) => {
    A.toggleSelected = (r, l) => {
      const e = A.getIsSelected();
      t.setRowSelection((u) => {
        var a;
        if (r = typeof r < "u" ? r : !e, A.getCanSelect() && e === r)
          return u;
        const I = {
          ...u
        };
        return Nr(I, A.id, r, (a = l?.selectChildren) != null ? a : !0, t), I;
      });
    }, A.getIsSelected = () => {
      const {
        rowSelection: r
      } = t.getState();
      return q3(A, r);
    }, A.getIsSomeSelected = () => {
      const {
        rowSelection: r
      } = t.getState();
      return Fr(A, r) === "some";
    }, A.getIsAllSubRowsSelected = () => {
      const {
        rowSelection: r
      } = t.getState();
      return Fr(A, r) === "all";
    }, A.getCanSelect = () => {
      var r;
      return typeof t.options.enableRowSelection == "function" ? t.options.enableRowSelection(A) : (r = t.options.enableRowSelection) != null ? r : !0;
    }, A.getCanSelectSubRows = () => {
      var r;
      return typeof t.options.enableSubRowSelection == "function" ? t.options.enableSubRowSelection(A) : (r = t.options.enableSubRowSelection) != null ? r : !0;
    }, A.getCanMultiSelect = () => {
      var r;
      return typeof t.options.enableMultiRowSelection == "function" ? t.options.enableMultiRowSelection(A) : (r = t.options.enableMultiRowSelection) != null ? r : !0;
    }, A.getToggleSelectedHandler = () => {
      const r = A.getCanSelect();
      return (l) => {
        var e;
        r && A.toggleSelected((e = l.target) == null ? void 0 : e.checked);
      };
    };
  }
}, Nr = (A, t, r, l, e) => {
  var u;
  const a = e.getRow(t, !0);
  r ? (a.getCanMultiSelect() || Object.keys(A).forEach((I) => delete A[I]), a.getCanSelect() && (A[t] = !0)) : delete A[t], l && (u = a.subRows) != null && u.length && a.getCanSelectSubRows() && a.subRows.forEach((I) => Nr(A, I.id, r, l, e));
};
function xr(A, t) {
  const r = A.getState().rowSelection, l = [], e = {}, u = function(a, I) {
    return a.map((z) => {
      var V;
      const d = q3(z, r);
      if (d && (l.push(z), e[z.id] = z), (V = z.subRows) != null && V.length && (z = {
        ...z,
        subRows: u(z.subRows)
      }), d)
        return z;
    }).filter(Boolean);
  };
  return {
    rows: u(t.rows),
    flatRows: l,
    rowsById: e
  };
}
function q3(A, t) {
  var r;
  return (r = t[A.id]) != null ? r : !1;
}
function Fr(A, t, r) {
  var l;
  if (!((l = A.subRows) != null && l.length)) return !1;
  let e = !0, u = !1;
  return A.subRows.forEach((a) => {
    if (!(u && !e) && (a.getCanSelect() && (q3(a, t) ? u = !0 : e = !1), a.subRows && a.subRows.length)) {
      const I = Fr(a, t);
      I === "all" ? u = !0 : (I === "some" && (u = !0), e = !1);
    }
  }), e ? "all" : u ? "some" : !1;
}
const Br = /([0-9]+)/gm, QV = (A, t, r) => Se(PA(A.getValue(r)).toLowerCase(), PA(t.getValue(r)).toLowerCase()), SV = (A, t, r) => Se(PA(A.getValue(r)), PA(t.getValue(r))), sV = (A, t, r) => m3(PA(A.getValue(r)).toLowerCase(), PA(t.getValue(r)).toLowerCase()), xV = (A, t, r) => m3(PA(A.getValue(r)), PA(t.getValue(r))), XV = (A, t, r) => {
  const l = A.getValue(r), e = t.getValue(r);
  return l > e ? 1 : l < e ? -1 : 0;
}, YV = (A, t, r) => m3(A.getValue(r), t.getValue(r));
function m3(A, t) {
  return A === t ? 0 : A > t ? 1 : -1;
}
function PA(A) {
  return typeof A == "number" ? isNaN(A) || A === 1 / 0 || A === -1 / 0 ? "" : String(A) : typeof A == "string" ? A : "";
}
function Se(A, t) {
  const r = A.split(Br).filter(Boolean), l = t.split(Br).filter(Boolean);
  for (; r.length && l.length; ) {
    const e = r.shift(), u = l.shift(), a = parseInt(e, 10), I = parseInt(u, 10), z = [a, I].sort();
    if (isNaN(z[0])) {
      if (e > u)
        return 1;
      if (u > e)
        return -1;
      continue;
    }
    if (isNaN(z[1]))
      return isNaN(a) ? -1 : 1;
    if (a > I)
      return 1;
    if (I > a)
      return -1;
  }
  return r.length - l.length;
}
const Vt = {
  alphanumeric: QV,
  alphanumericCaseSensitive: SV,
  text: sV,
  textCaseSensitive: xV,
  datetime: XV,
  basic: YV
}, GV = {
  getInitialState: (A) => ({
    sorting: [],
    ...A
  }),
  getDefaultColumnDef: () => ({
    sortingFn: "auto",
    sortUndefined: 1
  }),
  getDefaultOptions: (A) => ({
    onSortingChange: VA("sorting", A),
    isMultiSortEvent: (t) => t.shiftKey
  }),
  createColumn: (A, t) => {
    A.getAutoSortingFn = () => {
      const r = t.getFilteredRowModel().flatRows.slice(10);
      let l = !1;
      for (const e of r) {
        const u = e?.getValue(A.id);
        if (Object.prototype.toString.call(u) === "[object Date]")
          return Vt.datetime;
        if (typeof u == "string" && (l = !0, u.split(Br).length > 1))
          return Vt.alphanumeric;
      }
      return l ? Vt.text : Vt.basic;
    }, A.getAutoSortDir = () => {
      const r = t.getFilteredRowModel().flatRows[0];
      return typeof r?.getValue(A.id) == "string" ? "asc" : "desc";
    }, A.getSortingFn = () => {
      var r, l;
      if (!A)
        throw new Error();
      return rr(A.columnDef.sortingFn) ? A.columnDef.sortingFn : A.columnDef.sortingFn === "auto" ? A.getAutoSortingFn() : (r = (l = t.options.sortingFns) == null ? void 0 : l[A.columnDef.sortingFn]) != null ? r : Vt[A.columnDef.sortingFn];
    }, A.toggleSorting = (r, l) => {
      const e = A.getNextSortingOrder(), u = typeof r < "u" && r !== null;
      t.setSorting((a) => {
        const I = a?.find((q) => q.id === A.id), z = a?.findIndex((q) => q.id === A.id);
        let V = [], d, p = u ? r : e === "desc";
        if (a != null && a.length && A.getCanMultiSort() && l ? I ? d = "toggle" : d = "add" : a != null && a.length && z !== a.length - 1 ? d = "replace" : I ? d = "toggle" : d = "replace", d === "toggle" && (u || e || (d = "remove")), d === "add") {
          var E;
          V = [...a, {
            id: A.id,
            desc: p
          }], V.splice(0, V.length - ((E = t.options.maxMultiSortColCount) != null ? E : Number.MAX_SAFE_INTEGER));
        } else d === "toggle" ? V = a.map((q) => q.id === A.id ? {
          ...q,
          desc: p
        } : q) : d === "remove" ? V = a.filter((q) => q.id !== A.id) : V = [{
          id: A.id,
          desc: p
        }];
        return V;
      });
    }, A.getFirstSortDir = () => {
      var r, l;
      return ((r = (l = A.columnDef.sortDescFirst) != null ? l : t.options.sortDescFirst) != null ? r : A.getAutoSortDir() === "desc") ? "desc" : "asc";
    }, A.getNextSortingOrder = (r) => {
      var l, e;
      const u = A.getFirstSortDir(), a = A.getIsSorted();
      return a ? a !== u && ((l = t.options.enableSortingRemoval) == null || l) && // If enableSortRemove, enable in general
      (!(r && (e = t.options.enableMultiRemove) != null) || e) ? !1 : a === "desc" ? "asc" : "desc" : u;
    }, A.getCanSort = () => {
      var r, l;
      return ((r = A.columnDef.enableSorting) != null ? r : !0) && ((l = t.options.enableSorting) != null ? l : !0) && !!A.accessorFn;
    }, A.getCanMultiSort = () => {
      var r, l;
      return (r = (l = A.columnDef.enableMultiSort) != null ? l : t.options.enableMultiSort) != null ? r : !!A.accessorFn;
    }, A.getIsSorted = () => {
      var r;
      const l = (r = t.getState().sorting) == null ? void 0 : r.find((e) => e.id === A.id);
      return l ? l.desc ? "desc" : "asc" : !1;
    }, A.getSortIndex = () => {
      var r, l;
      return (r = (l = t.getState().sorting) == null ? void 0 : l.findIndex((e) => e.id === A.id)) != null ? r : -1;
    }, A.clearSorting = () => {
      t.setSorting((r) => r != null && r.length ? r.filter((l) => l.id !== A.id) : []);
    }, A.getToggleSortingHandler = () => {
      const r = A.getCanSort();
      return (l) => {
        r && (l.persist == null || l.persist(), A.toggleSorting == null || A.toggleSorting(void 0, A.getCanMultiSort() ? t.options.isMultiSortEvent == null ? void 0 : t.options.isMultiSortEvent(l) : !1));
      };
    };
  },
  createTable: (A) => {
    A.setSorting = (t) => A.options.onSortingChange == null ? void 0 : A.options.onSortingChange(t), A.resetSorting = (t) => {
      var r, l;
      A.setSorting(t ? [] : (r = (l = A.initialState) == null ? void 0 : l.sorting) != null ? r : []);
    }, A.getPreSortedRowModel = () => A.getGroupedRowModel(), A.getSortedRowModel = () => (!A._getSortedRowModel && A.options.getSortedRowModel && (A._getSortedRowModel = A.options.getSortedRowModel(A)), A.options.manualSorting || !A._getSortedRowModel ? A.getPreSortedRowModel() : A._getSortedRowModel());
  }
}, oV = [
  tV,
  ZV,
  mV,
  MV,
  lV,
  eV,
  CV,
  //depends on ColumnFaceting
  fV,
  //depends on ColumnFiltering
  GV,
  iV,
  //depends on RowSorting
  bV,
  UV,
  hV,
  KV,
  cV
];
function RV(A) {
  var t, r;
  process.env.NODE_ENV !== "production" && (A.debugAll || A.debugTable) && console.info("Creating Table Instance...");
  const l = [...oV, ...(t = A._features) != null ? t : []];
  let e = {
    _features: l
  };
  const u = e._features.reduce((E, q) => Object.assign(E, q.getDefaultOptions == null ? void 0 : q.getDefaultOptions(e)), {}), a = (E) => e.options.mergeOptions ? e.options.mergeOptions(u, E) : {
    ...u,
    ...E
  };
  let z = {
    ...{},
    ...(r = A.initialState) != null ? r : {}
  };
  e._features.forEach((E) => {
    var q;
    z = (q = E.getInitialState == null ? void 0 : E.getInitialState(z)) != null ? q : z;
  });
  const V = [];
  let d = !1;
  const p = {
    _features: l,
    options: {
      ...u,
      ...A
    },
    initialState: z,
    _queue: (E) => {
      V.push(E), d || (d = !0, Promise.resolve().then(() => {
        for (; V.length; )
          V.shift()();
        d = !1;
      }).catch((q) => setTimeout(() => {
        throw q;
      })));
    },
    reset: () => {
      e.setState(e.initialState);
    },
    setOptions: (E) => {
      const q = NA(E, e.options);
      e.options = a(q);
    },
    getState: () => e.options.state,
    setState: (E) => {
      e.options.onStateChange == null || e.options.onStateChange(E);
    },
    _getRowId: (E, q, m) => {
      var v;
      return (v = e.options.getRowId == null ? void 0 : e.options.getRowId(E, q, m)) != null ? v : `${m ? [m.id, q].join(".") : q}`;
    },
    getCoreRowModel: () => (e._getCoreRowModel || (e._getCoreRowModel = e.options.getCoreRowModel(e)), e._getCoreRowModel()),
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => e.getPaginationRowModel(),
    //in next version, we should just pass in the row model as the optional 2nd arg
    getRow: (E, q) => {
      let m = (q ? e.getPrePaginationRowModel() : e.getRowModel()).rowsById[E];
      if (!m && (m = e.getCoreRowModel().rowsById[E], !m))
        throw process.env.NODE_ENV !== "production" ? new Error(`getRow could not find row with ID: ${E}`) : new Error();
      return m;
    },
    _getDefaultColumnDef: Y(() => [e.options.defaultColumn], (E) => {
      var q;
      return E = (q = E) != null ? q : {}, {
        header: (m) => {
          const v = m.header.column.columnDef;
          return v.accessorKey ? v.accessorKey : v.accessorFn ? v.id : null;
        },
        // footer: props => props.header.column.id,
        cell: (m) => {
          var v, c;
          return (v = (c = m.renderValue()) == null || c.toString == null ? void 0 : c.toString()) != null ? v : null;
        },
        ...e._features.reduce((m, v) => Object.assign(m, v.getDefaultColumnDef == null ? void 0 : v.getDefaultColumnDef()), {}),
        ...E
      };
    }, G(A, "debugColumns", "_getDefaultColumnDef")),
    _getColumnDefs: () => e.options.columns,
    getAllColumns: Y(() => [e._getColumnDefs()], (E) => {
      const q = function(m, v, c) {
        return c === void 0 && (c = 0), m.map((M) => {
          const W = AV(e, M, c, v), C = M;
          return W.columns = C.columns ? q(C.columns, W, c + 1) : [], W;
        });
      };
      return q(E);
    }, G(A, "debugColumns", "getAllColumns")),
    getAllFlatColumns: Y(() => [e.getAllColumns()], (E) => E.flatMap((q) => q.getFlatColumns()), G(A, "debugColumns", "getAllFlatColumns")),
    _getAllFlatColumnsById: Y(() => [e.getAllFlatColumns()], (E) => E.reduce((q, m) => (q[m.id] = m, q), {}), G(A, "debugColumns", "getAllFlatColumnsById")),
    getAllLeafColumns: Y(() => [e.getAllColumns(), e._getOrderColumnsFn()], (E, q) => {
      let m = E.flatMap((v) => v.getLeafColumns());
      return q(m);
    }, G(A, "debugColumns", "getAllLeafColumns")),
    getColumn: (E) => {
      const q = e._getAllFlatColumnsById()[E];
      return process.env.NODE_ENV !== "production" && !q && console.error(`[Table] Column with id '${E}' does not exist.`), q;
    }
  };
  Object.assign(e, p);
  for (let E = 0; E < e._features.length; E++) {
    const q = e._features[E];
    q == null || q.createTable == null || q.createTable(e);
  }
  return e;
}
function jV() {
  return (A) => Y(() => [A.options.data], (t) => {
    const r = {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, l = function(e, u, a) {
      u === void 0 && (u = 0);
      const I = [];
      for (let V = 0; V < e.length; V++) {
        const d = rV(A, A._getRowId(e[V], V, a), e[V], V, u, void 0, a?.id);
        if (r.flatRows.push(d), r.rowsById[d.id] = d, I.push(d), A.options.getSubRows) {
          var z;
          d.originalSubRows = A.options.getSubRows(e[V], V), (z = d.originalSubRows) != null && z.length && (d.subRows = l(d.originalSubRows, u + 1, d));
        }
      }
      return I;
    };
    return r.rows = l(t), r;
  }, G(A.options, "debugTable", "getRowModel", () => A._autoResetPageIndex()));
}
function OV(A) {
  const t = [], r = (l) => {
    var e;
    t.push(l), (e = l.subRows) != null && e.length && l.getIsExpanded() && l.subRows.forEach(r);
  };
  return A.rows.forEach(r), {
    rows: t,
    flatRows: A.flatRows,
    rowsById: A.rowsById
  };
}
function gV(A) {
  return (t) => Y(() => [t.getState().pagination, t.getPrePaginationRowModel(), t.options.paginateExpandedRows ? void 0 : t.getState().expanded], (r, l) => {
    if (!l.rows.length)
      return l;
    const {
      pageSize: e,
      pageIndex: u
    } = r;
    let {
      rows: a,
      flatRows: I,
      rowsById: z
    } = l;
    const V = e * u, d = V + e;
    a = a.slice(V, d);
    let p;
    t.options.paginateExpandedRows ? p = {
      rows: a,
      flatRows: I,
      rowsById: z
    } : p = OV({
      rows: a,
      flatRows: I,
      rowsById: z
    }), p.flatRows = [];
    const E = (q) => {
      p.flatRows.push(q), q.subRows.length && q.subRows.forEach(E);
    };
    return p.rows.forEach(E), p;
  }, G(t.options, "debugTable", "getPaginationRowModel"));
}
function tl(A, t) {
  return A ? yV(A) ? /* @__PURE__ */ GA.createElement(A, t) : A : null;
}
function yV(A) {
  return NV(A) || typeof A == "function" || FV(A);
}
function NV(A) {
  return typeof A == "function" && (() => {
    const t = Object.getPrototypeOf(A);
    return t.prototype && t.prototype.isReactComponent;
  })();
}
function FV(A) {
  return typeof A == "object" && typeof A.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(A.$$typeof.description);
}
function BV(A) {
  const t = {
    state: {},
    // Dummy state
    onStateChange: () => {
    },
    // noop
    renderFallbackValue: null,
    ...A
  }, [r] = GA.useState(() => ({
    current: RV(t)
  })), [l, e] = GA.useState(() => r.current.initialState);
  return r.current.setOptions((u) => ({
    ...u,
    ...A,
    state: {
      ...l,
      ...A.state
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: (a) => {
      e(a), A.onStateChange == null || A.onStateChange(a);
    }
  })), r.current;
}
const TV = [
  {
    id: "name",
    title: "名称",
    width: 320,
    valueBinding: { from: "row", path: ["name"] }
  },
  {
    id: "status",
    title: "状态",
    width: 120,
    formatter: "badge",
    valueBinding: { from: "row", path: ["status"] }
  },
  {
    id: "createdAt",
    title: "创建时间",
    width: 200,
    valueBinding: { from: "row", path: ["createdAt"] }
  }
], PV = Array.from({ length: 6 }, (A, t) => ({
  id: `example-${t + 1}`,
  name: `示例数据 ${t + 1}`,
  status: t % 2 === 0 ? "启用" : "停用",
  createdAt: `2026-0${t + 1}-${t + 11} 10:30`
}));
function kV({
  binding: A,
  formatter: t
}) {
  const r = k(), l = $r(
    A ? r.resolve(A) : void 0,
    t
  );
  return t === "badge" ? /* @__PURE__ */ n(_r, { variant: "secondary", children: /* @__PURE__ */ n(L, { text: l }) }) : /* @__PURE__ */ n(L, { text: l });
}
function LV(A, t, r, l) {
  const { columns: e, tableId: u, selection: a, density: I, selectionWidth: z } = A, V = e.map((d) => ({
    id: d.id,
    header: d.title,
    size: d.width,
    cell: ({ row: p }) => /* @__PURE__ */ n(
      Jt,
      {
        value: { ...t.scope, tableId: u, row: p.original },
        children: d.cellTemplateId && t.definition.cells[d.cellTemplateId] ? /* @__PURE__ */ n(
          Cl,
          {
            config: se,
            data: t.definition.cells[d.cellTemplateId]
          }
        ) : d.actionLabel ? /* @__PURE__ */ n(
          T,
          {
            type: "button",
            variant: "link",
            size: "sm",
            disabled: r || !(d.eventId || A.rowActionEventId),
            onClick: () => l(d.eventId || A.rowActionEventId, {
              ...p.original,
              actionId: d.action || d.id,
              row: p.original
            }),
            children: /* @__PURE__ */ n(L, { text: d.actionLabel })
          }
        ) : /* @__PURE__ */ n(
          kV,
          {
            binding: d.valueBinding ?? {
              from: "row",
              path: (d.field || d.id).split(".")
            },
            formatter: d.formatter
          }
        )
      }
    )
  }));
  return a && V.unshift({
    id: "__selection",
    size: z ?? (I === "compact" ? 36 : 48),
    header: ({ table: d }) => /* @__PURE__ */ n(
      qt,
      {
        "aria-label": "选择本页全部行",
        disabled: r,
        checked: d.getIsAllPageRowsSelected() || d.getIsSomePageRowsSelected() && "indeterminate",
        onCheckedChange: (p) => d.toggleAllPageRowsSelected(p === !0)
      }
    ),
    cell: ({ row: d }) => /* @__PURE__ */ n(
      qt,
      {
        "aria-label": `选择行 ${d.id}`,
        disabled: r || !d.getCanSelect(),
        checked: d.getIsSelected(),
        onCheckedChange: (p) => d.toggleSelected(p === !0)
      }
    )
  }), V;
}
function wV({
  table: A,
  source: t,
  rows: r,
  columnCount: l,
  onRetry: e,
  density: u,
  layout: a = "fixed",
  minWidth: I,
  headerAppearance: z,
  cellAppearance: V,
  disabled: d,
  emptyText: p = "暂无数据"
}) {
  const E = t?.status === "error" ? t.error : void 0;
  return /* @__PURE__ */ i(
    "div",
    {
      className: "min-w-0 w-full",
      "aria-busy": t?.status === "loading",
      children: [
        E && /* @__PURE__ */ i("div", { role: "alert", children: [
          E,
          /* @__PURE__ */ n(
            T,
            {
              type: "button",
              variant: "outline",
              disabled: d,
              onClick: () => e(),
              children: "重新加载"
            }
          )
        ] }),
        /* @__PURE__ */ i(
          il,
          {
            style: {
              width: "100%",
              minWidth: I ?? A.getTotalSize(),
              tableLayout: a
            },
            children: [
              /* @__PURE__ */ n(ql, { children: A.getHeaderGroups().map((q) => /* @__PURE__ */ n(LA, { children: q.headers.map((m) => /* @__PURE__ */ n(
                Yr,
                {
                  style: {
                    width: I && m.id !== "__selection" ? `${100 * m.getSize() / A.getTotalSize()}%` : m.getSize(),
                    ...u === "compact" ? {
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#595959"
                    } : {},
                    ...Object.fromEntries(
                      Object.entries(
                        zA(
                          z
                        )
                      ).filter(([, v]) => v !== void 0)
                    ),
                    ...rl(m.column)
                  },
                  children: typeof m.column.columnDef.header == "string" ? /* @__PURE__ */ n(
                    L,
                    {
                      text: m.column.columnDef.header
                    }
                  ) : tl(
                    m.column.columnDef.header,
                    m.getContext()
                  )
                },
                m.id
              )) }, q.id)) }),
              /* @__PURE__ */ i(pl, { children: [
                t?.status === "loading" && r.length === 0 ? /* @__PURE__ */ n(LA, { children: /* @__PURE__ */ i(lt, { colSpan: l, children: [
                  /* @__PURE__ */ n(xl, { className: "h-12 w-full" }),
                  /* @__PURE__ */ n("span", { role: "status", children: "正在加载…" })
                ] }) }) : A.getRowModel().rows.map((q) => /* @__PURE__ */ n(
                  LA,
                  {
                    "data-state": q.getIsSelected() ? "selected" : void 0,
                    children: q.getVisibleCells().map((m) => /* @__PURE__ */ n(
                      lt,
                      {
                        style: {
                          ...rl(m.column),
                          ...u === "compact" ? {
                            padding: "12px",
                            fontSize: 12,
                            color: "#595959"
                          } : {},
                          ...Object.fromEntries(
                            Object.entries(
                              zA(
                                V
                              )
                            ).filter(
                              ([, v]) => v !== void 0
                            )
                          )
                        },
                        children: tl(
                          m.column.columnDef.cell,
                          m.getContext()
                        )
                      },
                      m.id
                    ))
                  },
                  q.id
                )),
                r.length === 0 && t?.status !== "loading" && /* @__PURE__ */ n(LA, { children: /* @__PURE__ */ n(lt, { colSpan: Math.max(1, l), children: /* @__PURE__ */ n("span", { role: "status", children: E ? "数据暂不可用" : p }) }) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function rl(A) {
  const t = A.getIsPinned();
  return t ? {
    position: "sticky",
    left: t === "left" ? A.getStart("left") : void 0,
    right: t === "right" ? A.getAfter("right") : void 0,
    zIndex: 1,
    background: "var(--background)"
  } : {};
}
function JV(A, t, r, l, e, u, a) {
  const {
    tableId: I,
    pageSize: z,
    rowKey: V,
    selectionDisabledPath: d,
    resetOn: p,
    defaultSelection: E = "none",
    selection: q,
    selectedKeys: m,
    paginationMode: v = "client"
  } = t, c = A.state.tables[I] ?? {
    selectedIds: [],
    page: t.page ?? 1,
    pageSize: z
  }, M = Math.max(1, Math.ceil(u / c.pageSize)), W = Math.min(t.page ?? c.page, M), C = m?.map(String) ?? c.selectedIds, Z = p ? JSON.stringify(A.resolve(p)) : void 0, b = hA(Z), U = hA(z);
  CA(() => {
    U.current !== z && (U.current = z, A.mode !== "design" && A.setTable(I, { pageSize: z, page: 1 }));
  }, [z, A, I]), CA(() => {
    A.mode !== "design" && b.current !== Z && (b.current = Z, Z !== void 0 && A.setTable(I, { selectedIds: [], page: 1 }));
  }, [Z, A, I]);
  const f = l?.status === "success";
  return CA(() => {
    if (A.mode === "design") return;
    const h = A.state.tables[I];
    if (h && !h.initialSelectionPending || E === "all" && !f || e) return;
    const K = m?.map(String) ?? (q && E === "all" ? r.filter(
      (Q) => !d || !Q[d]
    ).map((Q) => String(Q[V])) : []);
    A.setTable(I, {
      selectedIds: K,
      page: t.page ?? 1,
      pageSize: z,
      ...h?.initialSelectionPending ? { initialSelectionPending: !1 } : {}
    });
  }, [
    A,
    I,
    f,
    E,
    e,
    q,
    r,
    V,
    d,
    m,
    t.page,
    z
  ]), CA(() => {
    if (A.mode === "design" || e || !f && m === void 0 && t.page === void 0)
      return;
    const h = new Set(
      r.filter(
        (x) => !d || !x[d]
      ).map((x) => String(x[V]))
    ), K = m?.map(String) ?? (v === "server" || !f ? C : C.filter((x) => h.has(x)));
    A.state.tables[I] && (m !== void 0 && JSON.stringify(K) !== JSON.stringify(c.selectedIds) || K.length !== C.length || c.page !== W) && A.setTable(I, { selectedIds: K, page: W });
  }, [
    A,
    f,
    e,
    r,
    V,
    d,
    m,
    C,
    v,
    I,
    W,
    c.page,
    c.selectedIds,
    t.page
  ]), CA(() => {
    if (A.mode === "design") return;
    const h = A.state.tables[I];
    if (!h) return;
    const K = {
      total: u,
      disabled: a,
      pageChangeEventId: t.pageChangeEventId ?? "",
      pageSizeChangeEventId: t.pageSizeChangeEventId ?? ""
    };
    Object.entries(K).some(
      ([Q, x]) => h[Q] !== x
    ) && A.setTable(I, K);
  }, [
    A,
    I,
    u,
    a,
    t.pageChangeEventId,
    t.pageSizeChangeEventId
  ]), { state: c, page: W, selectedIds: C };
}
function DV(A) {
  let { columns: t, rowKey: r } = A;
  const {
    tableId: l,
    dataSourceId: e,
    selection: u,
    density: a,
    layout: I,
    selectionDisabledPath: z,
    minWidth: V,
    headerAppearance: d,
    cellAppearance: p,
    paginationMode: E = "client"
  } = A, q = k(), m = q.mode === "design" && !e && A.rows === void 0 && t.length === 0;
  m && (t = TV, r = "id");
  const v = q.state.sources[e], c = FA(
    () => m ? PV : ce(A.rows ?? v?.data),
    [m, A.rows, v?.data]
  ), M = {
    ...v,
    status: A.loading === !0 ? "loading" : A.error ? "error" : A.rows !== void 0 || m || A.loading === !1 ? "success" : v?.status ?? "idle",
    error: A.error ?? v?.error
  }, W = v?.data, C = W && typeof W == "object" && !Array.isArray(W) && typeof W.total == "number" ? W.total : c.length, Z = E === "server" ? A.total ?? C : c.length, b = q.mode === "design" || A.disabled === !0 || M.status === "loading", U = Jd(c, r), { state: f, page: h, selectedIds: K } = JV(
    q,
    { ...A, rowKey: r },
    c,
    M,
    U,
    Z,
    b
  ), Q = (O, y) => {
    !O || b || q.execute(O, { tableId: l, row: y }).catch(() => {
    });
  }, x = LV(
    { ...A, columns: t },
    q,
    b,
    Q
  ), lA = BV({
    data: c,
    columns: x,
    getCoreRowModel: jV(),
    getPaginationRowModel: gV(),
    manualPagination: E !== "client",
    rowCount: Z,
    getRowId: (O) => String(O[r]),
    enableRowSelection: (O) => u && !b && (!z || !O.original[z]),
    state: {
      pagination: { pageIndex: h - 1, pageSize: f.pageSize },
      rowSelection: Object.fromEntries(
        K.map((O) => [O, !0])
      ),
      columnPinning: {
        left: [
          ...u ? ["__selection"] : [],
          ...t.filter((O) => O.pin === "left").map((O) => O.id)
        ],
        right: t.filter((O) => O.pin === "right").map((O) => O.id)
      }
    },
    onRowSelectionChange: (O) => {
      const y = Object.fromEntries(
        K.map((SA) => [SA, !0])
      ), iA = typeof O == "function" ? O(y) : O;
      if (b) return;
      const jA = Object.keys(iA).filter((SA) => iA[SA]);
      q.setTable(l, { selectedIds: jA }), Q(A.selectionChangeEventId, {
        keys: jA,
        rows: c.filter((SA) => jA.includes(String(SA[r])))
      });
    }
  });
  return U ? /* @__PURE__ */ n("p", { role: "alert", children: U }) : /* @__PURE__ */ i("div", { className: "min-w-0 w-full", children: [
    /* @__PURE__ */ n(
      wV,
      {
        disabled: b,
        emptyText: A.emptyText,
        headerAppearance: d,
        cellAppearance: p,
        minWidth: V,
        density: a,
        layout: I,
        table: lA,
        source: M,
        rows: c,
        columnCount: x.length,
        onRetry: () => {
          b || (A.retryEventId ? Q(A.retryEventId, {}) : e && q.runSource(e).catch(() => {
          }));
        }
      }
    ),
    A.showPagination && E !== "none" && /* @__PURE__ */ n(
      We,
      {
        tableId: l,
        dataSourceId: e,
        pageSizeOptions: A.pageSizeOptions,
        displayState: q.mode === "design" ? { page: h, pageSize: f.pageSize, total: Z } : void 0
      }
    )
  ] });
}
function HV({
  className: A,
  orientation: t = "horizontal",
  ...r
}) {
  return /* @__PURE__ */ n(
    su,
    {
      "data-slot": "tabs",
      "data-orientation": t,
      orientation: t,
      className: X(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        A
      ),
      ...r
    }
  );
}
const _V = wr(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
        buttons: "gap-2 bg-transparent p-0",
        soft: "gap-1.5 rounded-none bg-transparent px-0 py-[5px] [&>[data-slot=tabs-trigger]]:h-[26px] [&>[data-slot=tabs-trigger]]:flex-none [&>[data-slot=tabs-trigger]]:rounded-[8px] [&>[data-slot=tabs-trigger]]:border-0 [&>[data-slot=tabs-trigger]]:px-2 [&>[data-slot=tabs-trigger]]:py-1 [&>[data-slot=tabs-trigger]]:text-[13px] [&>[data-slot=tabs-trigger]]:leading-[18px] [&>[data-slot=tabs-trigger]]:font-normal [&>[data-slot=tabs-trigger]]:data-[state=active]:bg-accent [&>[data-slot=tabs-trigger]]:data-[state=active]:shadow-none"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function $V({
  className: A,
  variant: t = "default",
  size: r = "default",
  ...l
}) {
  return /* @__PURE__ */ n(
    xu,
    {
      "data-slot": "tabs-list",
      "data-variant": t,
      "data-size": r === "default" ? void 0 : r,
      className: X(
        _V({ variant: t }),
        r === "sm" && t === "line" && "w-full justify-start gap-5 border-b border-border p-0 group-data-[orientation=horizontal]/tabs:h-[35px] [&>[data-slot=tabs-trigger]]:h-[34px] [&>[data-slot=tabs-trigger]]:flex-none [&>[data-slot=tabs-trigger]]:rounded-none [&>[data-slot=tabs-trigger]]:border-0 [&>[data-slot=tabs-trigger]]:px-0 [&>[data-slot=tabs-trigger]]:pt-0 [&>[data-slot=tabs-trigger]]:pb-2.5 [&>[data-slot=tabs-trigger]]:text-[13px] [&>[data-slot=tabs-trigger]]:leading-[22px] [&>[data-slot=tabs-trigger]]:after:bottom-0",
        r === "lg" && "rounded-xl p-0.5 group-data-[orientation=horizontal]/tabs:h-[52px] [&>[data-slot=tabs-trigger]]:rounded-[10px] [&>[data-slot=tabs-trigger]]:px-3 [&>[data-slot=tabs-trigger]]:py-[11px] [&>[data-slot=tabs-trigger]]:text-lg [&>[data-slot=tabs-trigger]]:leading-[26px]",
        (r === "parameter" || r === "ratio" || r === "compact") && "rounded-[6px] p-0.5 [&>[data-slot=tabs-trigger]]:h-full [&>[data-slot=tabs-trigger]]:rounded-[6px] [&>[data-slot=tabs-trigger]]:border-0 [&>[data-slot=tabs-trigger]]:px-1 [&>[data-slot=tabs-trigger]]:py-0 [&>[data-slot=tabs-trigger][data-state=active]]:shadow-none",
        r === "parameter" && "group-data-[orientation=horizontal]/tabs:h-[42px]",
        r === "ratio" && "group-data-[orientation=horizontal]/tabs:h-[60px] [&>[data-slot=tabs-trigger]]:flex-col [&>[data-slot=tabs-trigger]]:gap-1",
        r === "compact" && "group-data-[orientation=horizontal]/tabs:h-[30px]",
        A
      ),
      ...l
    }
  );
}
function AE({
  className: A,
  ...t
}) {
  return /* @__PURE__ */ n(
    Xu,
    {
      "data-slot": "tabs-trigger",
      className: X(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        A
      ),
      ...t
    }
  );
}
function tE({
  label: A,
  items: t,
  defaultValue: r,
  binding: l,
  variant: e,
  eventId: u,
  itemAppearance: a,
  selectedAppearance: I,
  countAppearance: z,
  itemGap: V,
  busyScope: d,
  busyEventId: p
}) {
  const E = k(), q = RA(), [m, v] = $(r), c = l ? E.resolve(l) : void 0, M = l ? String(c ?? r) : m, W = Hr(
    E.state.busy,
    E.definition.logic.events,
    { busyScope: d, busyEventId: p },
    [u, ...t.map((f) => f.eventId ?? "")]
  ), C = (f) => Object.fromEntries(
    Object.entries(
      zA({
        ...a,
        ...f ? I : {}
      })
    ).filter(([, h]) => h !== void 0)
  ), Z = E.mode === "design" || W, b = (f) => {
    const h = f.countBinding ? E.resolve(f.countBinding) : void 0;
    return sl(h);
  }, U = async (f) => {
    const h = t.find((Q) => Q.value === f);
    if (!h || h.disabled || Z || f === M) return;
    v(f);
    const K = h.eventId || u;
    if (K)
      try {
        await E.execute(K, {
          row: {
            ...E.scope.row,
            value: f,
            label: h.label,
            count: b(h)
          }
        });
      } catch {
        v(M);
      }
  };
  return e === "count" ? /* @__PURE__ */ n(
    "div",
    {
      role: "tablist",
      "aria-label": A,
      className: "flex flex-wrap items-center",
      style: { gap: V },
      children: t.map((f) => /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": M === f.value,
          disabled: Z || f.disabled,
          onClick: () => {
            U(f.value);
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px 5px 0",
            fontSize: 16,
            lineHeight: "22px",
            fontWeight: M === f.value ? 500 : 400,
            color: M === f.value ? "#34322d" : "#919398",
            background: "transparent",
            border: 0,
            cursor: Z || f.disabled ? "not-allowed" : "pointer",
            ...C(M === f.value)
          },
          children: [
            /* @__PURE__ */ n(L, { text: f.label }),
            f.countBinding && /* @__PURE__ */ n(
              "span",
              {
                style: {
                  borderRadius: 999,
                  background: "#f0f0f0",
                  padding: "0 6px",
                  fontSize: 12,
                  lineHeight: "20px",
                  fontWeight: 400,
                  color: "rgba(0,0,0,.45)",
                  ...Object.fromEntries(
                    Object.entries(
                      zA(z)
                    ).filter(([, h]) => h !== void 0)
                  )
                },
                children: b(f) ?? "—"
              }
            )
          ]
        },
        f.value
      ))
    }
  ) : /* @__PURE__ */ n(
    HV,
    {
      value: M,
      onValueChange: (f) => {
        U(f);
      },
      activationMode: "manual",
      className: E.mode === "design" ? "pointer-events-none min-w-0 max-w-full" : "min-w-0 max-w-full",
      children: /* @__PURE__ */ n(
        $V,
        {
          variant: e,
          style: { gap: V },
          "aria-label": A,
          "aria-busy": W,
          className: "max-w-full flex-wrap h-auto! gap-y-2",
          children: t.map((f) => {
            const h = f.label + (f.countBinding ? ` (${b(f) ?? "—"})` : "");
            return /* @__PURE__ */ n(
              AE,
              {
                value: f.value,
                style: C(M === f.value),
                disabled: Z || f.disabled,
                "aria-label": h,
                className: "min-w-0 max-w-full flex-none",
                children: /* @__PURE__ */ i(DA, { children: [
                  /* @__PURE__ */ n(HA, { asChild: !0, children: /* @__PURE__ */ i("span", { className: "block max-w-full truncate", children: [
                    f.label,
                    f.countBinding && /* @__PURE__ */ i(
                      "span",
                      {
                        style: Object.fromEntries(
                          Object.entries(
                            zA(
                              z
                            )
                          ).filter(
                            ([, K]) => K !== void 0
                          )
                        ),
                        children: [
                          " ",
                          "(",
                          b(f) ?? "—",
                          ")"
                        ]
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ n(
                    _A,
                    {
                      portalContainer: q,
                      className: "max-w-sm break-words",
                      children: h
                    }
                  )
                ] })
              },
              f.value
            );
          })
        }
      )
    }
  );
}
const rE = {
  label: J.Tabs,
  defaultProps: w.Tabs,
  fields: {
    label: { type: "text", label: "标签组名称" },
    defaultValue: { type: "text", label: "默认选中值" },
    variant: {
      type: "select",
      label: "展示样式",
      options: [
        { label: "文字与计数", value: "count" },
        { label: "分段", value: "default" },
        { label: "下划线", value: "line" },
        { label: "独立按钮", value: "buttons" }
      ]
    },
    eventId: { type: "text", label: "切换事件" },
    items: {
      type: "array",
      label: "标签项",
      arrayFields: {
        value: { type: "text", label: "值" },
        label: { type: "text", label: "名称" },
        eventId: { type: "text", label: "切换事件" }
      }
    }
  },
  render: tE
};
function lE({
  appearance: A,
  visibleWhen: t,
  fieldId: r,
  children: l,
  logicVisible: e = !0,
  disabled: u = !1
}) {
  const a = k(), I = !r || a.fieldStatus(r).visible, z = e && (!t || a.test(t)) && I;
  if (!z && a.mode !== "design") return null;
  const V = u ? /* @__PURE__ */ n("fieldset", { disabled: !0, style: { display: "contents" }, children: l }) : l;
  if ((!A || Object.keys(A).length === 0) && z)
    return /* @__PURE__ */ n(AA, { children: V });
  const d = {
    ...zA(A),
    opacity: z ? void 0 : 0.55
  };
  return /* @__PURE__ */ i("div", { "data-low-code-frame": "", style: d, children: [
    !z && /* @__PURE__ */ n("span", { role: "note", children: "运行时隐藏" }),
    V
  ] });
}
function eE(A, t = []) {
  return {
    ...A,
    components: Object.fromEntries(
      Object.entries(A.components).map(([r, l]) => {
        const e = l.render;
        return [
          r,
          {
            ...l,
            render: function(a) {
              const z = k().materialProps(
                String(a.id),
                { ...a, __material: r }
              );
              return /* @__PURE__ */ n(
                lE,
                {
                  appearance: t.includes(r) ? void 0 : z.props.appearance,
                  visibleWhen: z.props.visibleWhen,
                  logicVisible: z.visible,
                  disabled: z.disabled,
                  fieldId: r === "TextField" && z.props.valueMode === "value" ? void 0 : a.fieldId,
                  children: /* @__PURE__ */ n(e, { ...a, ...z.props })
                }
              );
            }
          }
        ];
      })
    )
  };
}
const rA = { type: "text" }, Ot = {
  fieldId: { ...rA, label: "字段 ID" },
  placeholder: { ...rA, label: "占位文字" }
}, gt = { type: "slot" }, Xr = {
  root: {
    render: ({ children: A }) => /* @__PURE__ */ n(
      "div",
      {
        className: "flex flex-col [&>div]:flex-1 [&>div]:min-h-0",
        style: { height: "100%", minHeight: 0, minWidth: 0 },
        children: A
      }
    )
  },
  categories: D7,
  components: {
    ...Uz,
    Repeater: {
      label: J.Repeater,
      defaultProps: w.Repeater,
      fields: {
        gap: { type: "number", label: "重复项间距", min: 0, max: 64 },
        content: gt
      },
      render: Gd
    },
    Tabs: rE,
    ...Yd,
    Section: {
      label: J.Section,
      defaultProps: w.Section,
      fields: { title: rA, content: gt },
      render: nd
    },
    Stack: {
      label: J.Stack,
      defaultProps: w.Stack,
      fields: {
        align: {
          type: "select",
          label: "交叉轴对齐",
          options: ["start", "center", "end", "stretch"].map(
            (A) => ({ label: A, value: A })
          )
        },
        direction: {
          type: "select",
          options: [
            { label: "横向", value: "row" },
            { label: "纵向", value: "column" }
          ]
        },
        justify: {
          type: "select",
          label: "主轴对齐",
          options: [
            { label: "起点", value: "start" },
            { label: "两端", value: "space-between" }
          ]
        },
        wrap: {
          type: "select",
          label: "换行",
          options: [
            { label: "自动换行", value: "wrap" },
            { label: "不换行", value: "nowrap" }
          ]
        },
        gap: { type: "number", min: 0, max: 64 },
        content: gt
      },
      render: Id
    },
    Form: {
      label: J.Form,
      defaultProps: w.Form,
      fields: {
        formId: { ...rA, label: "表单标识（需与关联字段一致）" },
        columns: { type: "number", label: "最多列数", min: 1, max: 12 },
        minColumnWidth: { type: "number", label: "最小列宽", min: 1 },
        gap: { type: "number", label: "字段间距", min: 0, max: 100 },
        layout: {
          type: "select",
          label: "排列方式",
          options: [
            { label: "纵向", value: "vertical" },
            { label: "自适应分栏", value: "grid" }
          ]
        },
        content: { ...gt, disallow: ["Form", "DataTable"] }
      },
      render: zd
    },
    Text: {
      label: J.Text,
      defaultProps: w.Text,
      fields: {
        text: rA,
        lines: { type: "number", label: "最大行数", min: 1, max: 10 },
        formatter: {
          type: "select",
          options: [
            { label: "文本", value: "text" },
            { label: "金额", value: "money" }
          ]
        }
      },
      render: ju
    },
    Image: {
      label: J.Image,
      defaultProps: w.Image,
      fields: {
        fit: {
          type: "select",
          label: "图片填充",
          options: ["contain", "cover"].map((A) => ({
            label: A,
            value: A
          }))
        },
        radius: { type: "number", label: "图片圆角", min: 0, max: 64 },
        border: {
          type: "radio",
          label: "图片边框",
          options: [
            { label: "是", value: !0 },
            { label: "否", value: !1 }
          ]
        },
        src: rA,
        alt: rA,
        width: { type: "number", min: 16, max: 1024 },
        height: { type: "number", min: 16, max: 1024 }
      },
      render: yu
    },
    Badge: {
      label: J.Badge,
      defaultProps: w.Badge,
      fields: {
        text: rA,
        variant: {
          type: "select",
          options: [
            "default",
            "secondary",
            "outline",
            "destructive"
          ].map((A) => ({ label: A, value: A }))
        }
      },
      render: Ou
    },
    TextField: {
      label: J.TextField,
      defaultProps: w.TextField,
      fields: Kz,
      render: (A) => /* @__PURE__ */ n(hz, { ...A })
    },
    NumberField: {
      label: J.NumberField,
      defaultProps: w.NumberField,
      fields: { ...Ot, step: { type: "number", min: 0.01 } },
      render: (A) => /* @__PURE__ */ n(xt, { ...A, kind: "number" })
    },
    TextareaField: {
      label: J.TextareaField,
      defaultProps: w.TextareaField,
      fields: {
        ...Ot,
        rows: { type: "number", min: 2, max: 20 }
      },
      render: (A) => /* @__PURE__ */ n(xt, { ...A, kind: "textarea" })
    },
    SelectField: {
      label: J.SelectField,
      defaultProps: w.SelectField,
      fields: Ot,
      render: (A) => /* @__PURE__ */ n(xt, { ...A, kind: "select" })
    },
    SwitchField: {
      label: J.SwitchField,
      defaultProps: w.SwitchField,
      fields: { fieldId: Ot.fieldId },
      render: (A) => /* @__PURE__ */ n(xt, { ...A, kind: "switch" })
    },
    ActionButton: {
      label: J.ActionButton,
      defaultProps: w.ActionButton,
      fields: {
        presentation: {
          type: "select",
          label: "按钮外观",
          options: [
            { label: "默认", value: "default" },
            { label: "文字操作", value: "text" },
            { label: "下拉菜单", value: "menu" }
          ]
        },
        icon: {
          type: "select",
          label: "图标",
          options: [
            { label: "无", value: "none" },
            { label: "星光", value: "sparkles" },
            { label: "加号", value: "plus" },
            { label: "勾选", value: "check" },
            { label: "下载", value: "download" },
            { label: "刷新", value: "refresh" },
            { label: "本地上传", value: "custom" }
          ]
        },
        iconPosition: {
          type: "radio",
          label: "图标位置",
          options: [
            { label: "文字前", value: "start" },
            { label: "文字后", value: "end" }
          ]
        },
        iconSize: {
          type: "number",
          label: "图标大小（px）",
          min: 1,
          max: 96
        },
        iconGap: {
          type: "number",
          label: "图文间距（px）",
          min: 0,
          max: 100
        },
        disabledOpacity: {
          type: "number",
          label: "禁用透明度（0–1）",
          min: 0,
          max: 1,
          step: 0.05
        },
        menuItems: {
          type: "array",
          label: "菜单项",
          arrayFields: {
            label: { type: "text", label: "菜单文字" },
            eventId: { type: "text", label: "菜单事件 ID" }
          }
        },
        tone: {
          type: "select",
          label: "按钮语义",
          options: [
            { label: "默认", value: "default" },
            { label: "主按钮（跟随项目）", value: "primary" },
            { label: "红色操作", value: "danger" }
          ]
        },
        fullWidth: {
          type: "radio",
          label: "填满宽度",
          options: [
            { label: "是", value: !0 },
            { label: "否", value: !1 }
          ]
        },
        label: rA,
        eventId: rA,
        variant: {
          type: "select",
          options: [
            "default",
            "outline",
            "secondary",
            "ghost",
            "destructive",
            "link"
          ].map((A) => ({ label: A, value: A }))
        }
      },
      render: Gu
    },
    DataTable: {
      label: J.DataTable,
      defaultProps: w.DataTable,
      fields: {
        ...J7,
        density: {
          type: "select",
          label: "表格密度",
          options: [
            { label: "默认", value: "default" },
            { label: "紧凑商品列表", value: "compact" }
          ]
        },
        minWidth: {
          type: "number",
          label: "表格最小宽度",
          min: 320,
          max: 4e3
        },
        layout: {
          type: "select",
          label: "列布局",
          options: [
            { label: "固定", value: "fixed" },
            { label: "自动", value: "auto" }
          ]
        },
        selectionDisabledPath: {
          type: "text",
          label: "行禁止选择字段"
        },
        defaultSelection: {
          type: "select",
          label: "首次加载默认选择",
          options: [
            { label: "不选中", value: "none" },
            { label: "全部可选行", value: "all" }
          ]
        },
        tableId: rA,
        dataSourceId: rA,
        rowKey: rA,
        columns: {
          type: "array",
          arrayFields: {
            id: rA,
            title: rA,
            width: { type: "number", min: 48, max: 1e3 }
          }
        },
        pageSize: { type: "number", min: 1, max: 100 },
        selection: {
          type: "radio",
          options: [
            { label: "允许多选", value: !0 },
            { label: "关闭多选", value: !1 }
          ]
        }
      },
      render: DV
    },
    SelectionSummary: {
      label: J.SelectionSummary,
      defaultProps: w.SelectionSummary,
      fields: {
        tableId: rA,
        text: rA,
        variant: {
          type: "select",
          label: "摘要样式",
          options: [
            { label: "标签", value: "badge" },
            { label: "文字", value: "text" }
          ]
        }
      },
      render: Dd
    },
    Pagination: {
      label: J.Pagination,
      defaultProps: w.Pagination,
      fields: {
        tableId: rA,
        dataSourceId: rA,
        variant: {
          type: "select",
          label: "分页样式",
          options: [
            { label: "默认", value: "default" },
            { label: "工作区底栏", value: "workspace" }
          ]
        }
      },
      render: We
    }
  }
}, se = eE(
  {
    ...Xr,
    components: {
      ...Object.fromEntries(
        Object.entries(Xr.components).map(
          ([A, t]) => [
            A,
            {
              ...t,
              fields: {
                ...t.fields,
                ...ou[A]
              }
            }
          ]
        )
      ),
      ...L3
    },
    categories: {
      ...Xr.categories,
      legacy: {
        title: "旧版兼容",
        components: [
          "NumberField",
          "TextareaField",
          "ConfigurableInput",
          "ConfigurableTable"
        ],
        visible: !1
      },
      converted: {
        title: "项目转换组件",
        components: Object.keys(L3).filter(
          (A) => !["ConfigurableInput", "ConfigurableTable"].includes(
            A
          )
        )
      }
    }
  },
  // 卡片有自己的底色与边框，样式直接作用于其根元素，避免被内部白底遮挡。
  ["Section"]
), Tr = a7(function({
  data: t
}) {
  return /* @__PURE__ */ n(Cl, { config: se, data: t });
});
function uE({
  dialog: A,
  active: t,
  depth: r
}) {
  const l = k(), e = RA(), a = (el(9999) ?? 9999) + r * 2, [I, z] = $(!1), [V] = $(
    () => JSON.stringify(l.state.forms[A.formId])
  ), d = l.definition.dialogs[A.definitionId];
  if (!d) return null;
  const p = Object.values(l.state.busy).some(Boolean), E = V !== JSON.stringify(l.state.forms[A.formId]), q = () => {
    !t || p || (E ? z(!0) : l.closeDialog());
  };
  return /* @__PURE__ */ n(
    x7,
    {
      open: !0,
      onOpenChange: (m) => {
        m || q();
      },
      children: /* @__PURE__ */ n(
        X7,
        {
          portalContainer: e,
          closeOnEscape: t,
          showCloseButton: t && !p,
          inert: !t,
          "aria-hidden": !t || void 0,
          zIndex: a,
          className: "max-h-[90vh] overflow-y-auto",
          style: {
            ...d.width === void 0 ? {} : {
              width: d.width,
              maxWidth: "calc(100vw - 2rem)"
            },
            ...d.bodySpacing ? { padding: 0 } : {}
          },
          children: /* @__PURE__ */ i(Y7.Provider, { value: a + 2, children: [
            /* @__PURE__ */ i(
              G7,
              {
                style: d.bodySpacing ? {
                  paddingTop: d.bodySpacing.top ?? 24,
                  paddingRight: d.bodySpacing.right ?? 24,
                  paddingBottom: 0,
                  paddingLeft: d.bodySpacing.left ?? 24
                } : void 0,
                children: [
                  /* @__PURE__ */ n(o7, { children: /* @__PURE__ */ n(L, { text: d.title }) }),
                  /* @__PURE__ */ n(R7, { children: "修改后确认提交，取消将丢弃本次修改。" })
                ]
              }
            ),
            /* @__PURE__ */ n(
              Jt,
              {
                value: {
                  ...l.scope,
                  row: A.row,
                  dialogId: A.definitionId,
                  formId: A.formId
                },
                children: d.bodySpacing ? /* @__PURE__ */ n(
                  "div",
                  {
                    "data-dialog-body": !0,
                    style: d.bodySpacing ? {
                      paddingTop: d.bodySpacing.top ?? 24,
                      paddingRight: d.bodySpacing.right ?? 24,
                      paddingBottom: d.bodySpacing.bottom ?? 24,
                      paddingLeft: d.bodySpacing.left ?? 24
                    } : void 0,
                    children: /* @__PURE__ */ n(Tr, { data: d.content })
                  }
                ) : /* @__PURE__ */ n(Tr, { data: d.content })
              }
            ),
            I && /* @__PURE__ */ i(
              "div",
              {
                role: "alert",
                style: d.bodySpacing ? { padding: "0 24px 24px" } : void 0,
                children: [
                  /* @__PURE__ */ n("p", { children: "有未保存的修改，确定放弃吗？" }),
                  /* @__PURE__ */ i(j7, { children: [
                    /* @__PURE__ */ n(
                      T,
                      {
                        variant: "outline",
                        onClick: () => z(!1),
                        children: "继续编辑"
                      }
                    ),
                    /* @__PURE__ */ n(
                      T,
                      {
                        variant: "destructive",
                        disabled: !t || p,
                        onClick: () => l.closeDialog(),
                        children: "放弃修改"
                      }
                    )
                  ] })
                ]
              }
            )
          ] })
        }
      )
    }
  );
}
function aE() {
  const { state: A } = k();
  if (!A.dialog) return null;
  const t = [...A.dialogStack ?? [], A.dialog];
  return t.map((r, l) => /* @__PURE__ */ n(
    uE,
    {
      dialog: r,
      active: l === t.length - 1,
      depth: l
    },
    r.instanceId
  ));
}
function nE() {
  const A = k();
  return /* @__PURE__ */ i(AA, { children: [
    /* @__PURE__ */ n(Tr, { data: A.definition.page }),
    /* @__PURE__ */ n(aE, {}),
    A.state.feedback && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", children: A.state.feedback })
  ] });
}
function vE({
  definition: A,
  host: t,
  mode: r = "interactive",
  children: l
}) {
  const [e, u] = $(null);
  return /* @__PURE__ */ n("div", { className: "mf-low-code-surface low-code-page min-w-0 w-full", children: /* @__PURE__ */ i(ru, { portalContainer: e ?? void 0, children: [
    /* @__PURE__ */ i(
      H7,
      {
        definition: A,
        host: t,
        mode: r,
        children: [
          /* @__PURE__ */ n(nE, {}),
          l
        ]
      },
      `${A.pageId}:${t.instanceKey}`
    ),
    /* @__PURE__ */ n(
      "div",
      {
        ref: u,
        className: "mf-low-code-surface low-code-page low-code-portals"
      }
    )
  ] }) });
}
export {
  vE as PageRenderer,
  H7 as PageRuntimeProvider,
  ru as PreviewEnvironment,
  wt as RuntimeContext,
  Jt as ScopeProvider,
  w as materialDefaults,
  J as materialLabels,
  se as runtimeConfig,
  k as useRuntime,
  mE as useRuntimeService
};
