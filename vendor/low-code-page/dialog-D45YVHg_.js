var lr = (e) => {
  throw TypeError(e);
};
var ur = (e, t, n) => t.has(e) || lr("Cannot " + n);
var pe = (e, t, n) => (ur(e, t, "read from private field"), n ? n.call(e) : t.get(e)), dr = (e, t, n) => t.has(e) ? lr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Bn = (e, t, n, o) => (ur(e, t, "write to private field"), o ? o.call(e, n) : t.set(e, n), n);
import * as c from "react";
import Wt, { createContext as Xr, useContext as qr, forwardRef as Zr, createElement as to, useState as Ss, useLayoutEffect as Rs } from "react";
import { a as Ps } from "./id-DAU2FMyk.js";
import { jsx as m, Fragment as st, jsxs as de } from "react/jsx-runtime";
import * as Dt from "react-dom";
const Es = (e) => e;
function _s(e, t = Es) {
  const n = Wt.useSyncExternalStore(
    e.subscribe,
    Wt.useCallback(() => t(e.getState()), [e, t]),
    Wt.useCallback(() => t(e.getInitialState()), [e, t])
  );
  return Wt.useDebugValue(n), n;
}
const fr = (e) => {
  const t = Ps(e), n = (o) => _s(t, o);
  return Object.assign(n, t), n;
}, Eh = ((e) => e ? fr(e) : fr), ks = Xr(void 0);
function _h() {
  return qr(ks);
}
const Is = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Ts = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, o) => o ? o.toUpperCase() : n.toLowerCase()
), pr = (e) => {
  const t = Ts(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
}, Qr = (...e) => e.filter((t, n, o) => !!t && t.trim() !== "" && o.indexOf(t) === n).join(" ").trim(), Os = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
};
var As = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Ms = Zr(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: o,
    className: r = "",
    children: a,
    iconNode: i,
    ...s
  }, l) => to(
    "svg",
    {
      ref: l,
      ...As,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: o ? Number(n) * 24 / Number(t) : n,
      className: Qr("lucide", r),
      ...!a && !Os(s) && { "aria-hidden": "true" },
      ...s
    },
    [
      ...i.map(([u, f]) => to(u, f)),
      ...Array.isArray(a) ? a : [a]
    ]
  )
);
const we = (e, t) => {
  const n = Zr(
    ({ className: o, ...r }, a) => to(Ms, {
      ref: a,
      iconNode: t,
      className: Qr(
        `lucide-${Is(pr(e))}`,
        `lucide-${e}`,
        o
      ),
      ...r
    })
  );
  return n.displayName = pr(e), n;
};
const Ds = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Jr = we("check", Ds);
const Ns = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], ea = we("chevron-down", Ns);
const Ls = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], kh = we("chevron-left", Ls);
const Fs = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Ih = we("chevron-right", Fs);
const $s = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], zs = we("chevron-up", $s);
const Bs = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Th = we("download", Bs);
const Vs = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
], js = we("ellipsis", Vs);
const Gs = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Oh = we("plus", Gs);
const Hs = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], Ah = we("refresh-cw", Hs);
const Us = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
], Mh = we("sparkles", Us);
const Ws = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
], Dh = we("trash-2", Ws);
const Ks = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
], Nh = we("triangle-alert", Ks);
const Ys = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], ta = we("x", Ys);
var Xs = Object.defineProperty, Po = (e, t) => Xs(e, "name", { value: t, configurable: !0 });
function no(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
Po(no, "setRef");
function na(...e) {
  return (t) => {
    let n = !1;
    const o = e.map((r) => {
      const a = no(r, t);
      return !n && typeof a == "function" && (n = !0), a;
    });
    if (n)
      return () => {
        for (let r = 0; r < o.length; r++) {
          const a = o[r];
          typeof a == "function" ? a() : no(e[r], null);
        }
      };
  };
}
Po(na, "composeRefs");
function j(...e) {
  return c.useCallback(na(...e), e);
}
Po(j, "useComposedRefs");
var qs = Object.defineProperty, Te = (e, t) => qs(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function ke(e) {
  const t = c.forwardRef((n, o) => {
    let { children: r, ...a } = n, i = null, s = !1;
    const l = [];
    oo(r) && typeof Kt == "function" && (r = Kt(r._payload)), c.Children.forEach(r, (p) => {
      if (sa(p)) {
        s = !0;
        const v = p;
        let b = "child" in v.props ? v.props.child : v.props.children;
        oo(b) && typeof Kt == "function" && (b = Kt(b._payload)), i = Qs(v, b), l.push(i?.props?.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !s && c.Children.count(r) === 1 && c.isValidElement(r) && (i = r)
    );
    const u = i ? ia(i) : void 0, f = j(o, u);
    if (!i) {
      if (r || r === 0)
        throw new Error(
          s ? tc(e) : ec(e)
        );
      return r;
    }
    const d = aa(a, i.props ?? {});
    return i.type !== c.Fragment && (d.ref = o ? f : u), c.cloneElement(i, d);
  });
  return t.displayName = `${e}.Slot`, t;
}
Te(ke, "createSlot");
var Zs = /* @__PURE__ */ ke("Slot"), oa = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function ra(e) {
  const t = /* @__PURE__ */ Te((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = oa, t;
}
Te(ra, "createSlottable");
var Qs = /* @__PURE__ */ Te((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function aa(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], a = t[o];
    /^on[A-Z]/.test(o) ? r && a ? n[o] = (...s) => {
      const l = a(...s);
      return r(...s), l;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...a } : o === "className" && (n[o] = [r, a].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
Te(aa, "mergeProps");
function ia(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
Te(ia, "getElementRef");
function sa(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === oa;
}
Te(sa, "isSlottable");
var Js = /* @__PURE__ */ Symbol.for("react.lazy");
function oo(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === Js && "_payload" in e && ca(e._payload);
}
Te(oo, "isLazyComponent");
function ca(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
Te(ca, "isPromiseLike");
var ec = /* @__PURE__ */ Te((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), tc = /* @__PURE__ */ Te((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Kt = c[" use ".trim().toString()];
function la(e) {
  var t, n, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var r = e.length;
    for (t = 0; t < r; t++) e[t] && (n = la(e[t])) && (o && (o += " "), o += n);
  } else for (n in e) e[n] && (o && (o += " "), o += n);
  return o;
}
function ua() {
  for (var e, t, n = 0, o = "", r = arguments.length; n < r; n++) (e = arguments[n]) && (t = la(e)) && (o && (o += " "), o += t);
  return o;
}
const mr = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, hr = ua, mn = (e, t) => (n) => {
  var o;
  if (t?.variants == null) return hr(e, n?.class, n?.className);
  const { variants: r, defaultVariants: a } = t, i = Object.keys(r).map((u) => {
    const f = n?.[u], d = a?.[u];
    if (f === null) return null;
    const p = mr(f) || mr(d);
    return r[u][p];
  }), s = n && Object.entries(n).reduce((u, f) => {
    let [d, p] = f;
    return p === void 0 || (u[d] = p), u;
  }, {}), l = t == null || (o = t.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((u, f) => {
    let { class: d, className: p, ...v } = f;
    return Object.entries(v).every((b) => {
      let [h, g] = b;
      return Array.isArray(g) ? g.includes({
        ...a,
        ...s
      }[h]) : {
        ...a,
        ...s
      }[h] === g;
    }) ? [
      ...u,
      d,
      p
    ] : u;
  }, []);
  return hr(e, i, l, n?.class, n?.className);
}, nc = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let o = 0; o < e.length; o++)
    n[o] = e[o];
  for (let o = 0; o < t.length; o++)
    n[e.length + o] = t[o];
  return n;
}, oc = (e, t) => ({
  classGroupId: e,
  validator: t
}), da = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), cn = "-", gr = [], rc = "arbitrary..", ac = (e) => {
  const t = sc(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return ic(i);
      const s = i.split(cn), l = s[0] === "" && s.length > 1 ? 1 : 0;
      return fa(s, l, t);
    },
    getConflictingClassGroupIds: (i, s) => {
      if (s) {
        const l = o[i], u = n[i];
        return l ? u ? nc(u, l) : l : u || gr;
      }
      return n[i] || gr;
    }
  };
}, fa = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const r = e[t], a = n.nextPart.get(r);
  if (a) {
    const u = fa(e, t + 1, a);
    if (u) return u;
  }
  const i = n.validators;
  if (i === null)
    return;
  const s = t === 0 ? e.join(cn) : e.slice(t).join(cn), l = i.length;
  for (let u = 0; u < l; u++) {
    const f = i[u];
    if (f.validator(s))
      return f.classGroupId;
  }
}, ic = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), o = t.slice(0, n);
  return o ? rc + o : void 0;
})(), sc = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return cc(n, t);
}, cc = (e, t) => {
  const n = da();
  for (const o in e) {
    const r = e[o];
    Eo(r, n, o, t);
  }
  return n;
}, Eo = (e, t, n, o) => {
  const r = e.length;
  for (let a = 0; a < r; a++) {
    const i = e[a];
    lc(i, t, n, o);
  }
}, lc = (e, t, n, o) => {
  if (typeof e == "string") {
    uc(e, t, n);
    return;
  }
  if (typeof e == "function") {
    dc(e, t, n, o);
    return;
  }
  fc(e, t, n, o);
}, uc = (e, t, n) => {
  const o = e === "" ? t : pa(t, e);
  o.classGroupId = n;
}, dc = (e, t, n, o) => {
  if (pc(e)) {
    Eo(e(o), t, n, o);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(oc(n, e));
}, fc = (e, t, n, o) => {
  const r = Object.entries(e), a = r.length;
  for (let i = 0; i < a; i++) {
    const [s, l] = r[i];
    Eo(l, pa(t, s), n, o);
  }
}, pa = (e, t) => {
  let n = e;
  const o = t.split(cn), r = o.length;
  for (let a = 0; a < r; a++) {
    const i = o[a];
    let s = n.nextPart.get(i);
    s || (s = da(), n.nextPart.set(i, s)), n = s;
  }
  return n;
}, pc = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, mc = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const r = (a, i) => {
    n[a] = i, t++, t > e && (t = 0, o = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(a) {
      let i = n[a];
      if (i !== void 0)
        return i;
      if ((i = o[a]) !== void 0)
        return r(a, i), i;
    },
    set(a, i) {
      a in n ? n[a] = i : r(a, i);
    }
  };
}, ro = "!", vr = ":", hc = [], br = (e, t, n, o, r) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: o,
  isExternal: r
}), gc = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let o = (r) => {
    const a = [];
    let i = 0, s = 0, l = 0, u;
    const f = r.length;
    for (let h = 0; h < f; h++) {
      const g = r[h];
      if (i === 0 && s === 0) {
        if (g === vr) {
          a.push(r.slice(l, h)), l = h + 1;
          continue;
        }
        if (g === "/") {
          u = h;
          continue;
        }
      }
      g === "[" ? i++ : g === "]" ? i-- : g === "(" ? s++ : g === ")" && s--;
    }
    const d = a.length === 0 ? r : r.slice(l);
    let p = d, v = !1;
    d.endsWith(ro) ? (p = d.slice(0, -1), v = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(ro) && (p = d.slice(1), v = !0)
    );
    const b = u && u > l ? u - l : void 0;
    return br(a, v, p, b);
  };
  if (t) {
    const r = t + vr, a = o;
    o = (i) => i.startsWith(r) ? a(i.slice(r.length)) : br(hc, !1, i, void 0, !0);
  }
  if (n) {
    const r = o;
    o = (a) => n({
      className: a,
      parseClassName: r
    });
  }
  return o;
}, vc = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, o) => {
    t.set(n, 1e6 + o);
  }), (n) => {
    const o = [];
    let r = [];
    for (let a = 0; a < n.length; a++) {
      const i = n[a], s = i[0] === "[", l = t.has(i);
      s || l ? (r.length > 0 && (r.sort(), o.push(...r), r = []), o.push(i)) : r.push(i);
    }
    return r.length > 0 && (r.sort(), o.push(...r)), o;
  };
}, bc = (e) => ({
  cache: mc(e.cacheSize),
  parseClassName: gc(e),
  sortModifiers: vc(e),
  ...ac(e)
}), wc = /\s+/, xc = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: o,
    getConflictingClassGroupIds: r,
    sortModifiers: a
  } = t, i = [], s = e.trim().split(wc);
  let l = "";
  for (let u = s.length - 1; u >= 0; u -= 1) {
    const f = s[u], {
      isExternal: d,
      modifiers: p,
      hasImportantModifier: v,
      baseClassName: b,
      maybePostfixModifierPosition: h
    } = n(f);
    if (d) {
      l = f + (l.length > 0 ? " " + l : l);
      continue;
    }
    let g = !!h, y = o(g ? b.substring(0, h) : b);
    if (!y) {
      if (!g) {
        l = f + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (y = o(b), !y) {
        l = f + (l.length > 0 ? " " + l : l);
        continue;
      }
      g = !1;
    }
    const C = p.length === 0 ? "" : p.length === 1 ? p[0] : a(p).join(":"), w = v ? C + ro : C, x = w + y;
    if (i.indexOf(x) > -1)
      continue;
    i.push(x);
    const S = r(y, g);
    for (let R = 0; R < S.length; ++R) {
      const E = S[R];
      i.push(w + E);
    }
    l = f + (l.length > 0 ? " " + l : l);
  }
  return l;
}, yc = (...e) => {
  let t = 0, n, o, r = "";
  for (; t < e.length; )
    (n = e[t++]) && (o = ma(n)) && (r && (r += " "), r += o);
  return r;
}, ma = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = ma(e[o])) && (n && (n += " "), n += t);
  return n;
}, Cc = (e, ...t) => {
  let n, o, r, a;
  const i = (l) => {
    const u = t.reduce((f, d) => d(f), e());
    return n = bc(u), o = n.cache.get, r = n.cache.set, a = s, s(l);
  }, s = (l) => {
    const u = o(l);
    if (u)
      return u;
    const f = xc(l, n);
    return r(l, f), f;
  };
  return a = i, (...l) => a(yc(...l));
}, Sc = [], se = (e) => {
  const t = (n) => n[e] || Sc;
  return t.isThemeGetter = !0, t;
}, ha = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, ga = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Rc = /^\d+\/\d+$/, Pc = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Ec = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, _c = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, kc = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Ic = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ft = (e) => Rc.test(e), U = (e) => !!e && !Number.isNaN(Number(e)), Ke = (e) => !!e && Number.isInteger(Number(e)), Vn = (e) => e.endsWith("%") && U(e.slice(0, -1)), Fe = (e) => Pc.test(e), Tc = () => !0, Oc = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Ec.test(e) && !_c.test(e)
), va = () => !1, Ac = (e) => kc.test(e), Mc = (e) => Ic.test(e), Dc = (e) => !A(e) && !M(e), Nc = (e) => yt(e, xa, va), A = (e) => ha.test(e), nt = (e) => yt(e, ya, Oc), jn = (e) => yt(e, Bc, U), wr = (e) => yt(e, ba, va), Lc = (e) => yt(e, wa, Mc), Yt = (e) => yt(e, Ca, Ac), M = (e) => ga.test(e), kt = (e) => Ct(e, ya), Fc = (e) => Ct(e, Vc), xr = (e) => Ct(e, ba), $c = (e) => Ct(e, xa), zc = (e) => Ct(e, wa), Xt = (e) => Ct(e, Ca, !0), yt = (e, t, n) => {
  const o = ha.exec(e);
  return o ? o[1] ? t(o[1]) : n(o[2]) : !1;
}, Ct = (e, t, n = !1) => {
  const o = ga.exec(e);
  return o ? o[1] ? t(o[1]) : n : !1;
}, ba = (e) => e === "position" || e === "percentage", wa = (e) => e === "image" || e === "url", xa = (e) => e === "length" || e === "size" || e === "bg-size", ya = (e) => e === "length", Bc = (e) => e === "number", Vc = (e) => e === "family-name", Ca = (e) => e === "shadow", jc = () => {
  const e = se("color"), t = se("font"), n = se("text"), o = se("font-weight"), r = se("tracking"), a = se("leading"), i = se("breakpoint"), s = se("container"), l = se("spacing"), u = se("radius"), f = se("shadow"), d = se("inset-shadow"), p = se("text-shadow"), v = se("drop-shadow"), b = se("blur"), h = se("perspective"), g = se("aspect"), y = se("ease"), C = se("animate"), w = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], x = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], S = () => [...x(), M, A], R = () => ["auto", "hidden", "clip", "visible", "scroll"], E = () => ["auto", "contain", "none"], P = () => [M, A, l], k = () => [ft, "full", "auto", ...P()], D = () => [Ke, "none", "subgrid", M, A], F = () => ["auto", {
    span: ["full", Ke, M, A]
  }, Ke, M, A], O = () => [Ke, "auto", M, A], L = () => ["auto", "min", "max", "fr", M, A], z = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], G = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], B = () => ["auto", ...P()], $ = () => [ft, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...P()], _ = () => [e, M, A], H = () => [...x(), xr, wr, {
    position: [M, A]
  }], I = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], ie = () => ["auto", "cover", "contain", $c, Nc, {
    size: [M, A]
  }], Z = () => [Vn, kt, nt], K = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    u,
    M,
    A
  ], ee = () => ["", U, kt, nt], fe = () => ["solid", "dashed", "dotted", "double"], xe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], X = () => [U, Vn, xr, wr], N = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    b,
    M,
    A
  ], q = () => ["none", U, M, A], oe = () => ["none", U, M, A], Q = () => [U, M, A], J = () => [ft, "full", ...P()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Fe],
      breakpoint: [Fe],
      color: [Tc],
      container: [Fe],
      "drop-shadow": [Fe],
      ease: ["in", "out", "in-out"],
      font: [Dc],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Fe],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Fe],
      shadow: [Fe],
      spacing: ["px", U],
      text: [Fe],
      "text-shadow": [Fe],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", ft, A, M, g]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [U, A, M, s]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": w()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": w()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: S()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: R()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": R()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": R()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: E()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": E()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": E()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: k()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": k()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": k()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: k()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: k()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: k()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: k()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: k()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: k()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [Ke, "auto", M, A]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [ft, "full", "auto", s, ...P()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [U, ft, "auto", "initial", "none", A]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", U, M, A]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", U, M, A]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Ke, "first", "last", "none", M, A]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": D()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: F()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": O()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": O()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": D()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: F()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": O()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": O()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": L()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": L()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: P()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": P()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": P()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...z(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...G(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...G()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...z()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...G(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...G(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": z()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...G(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...G()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: P()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: P()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: P()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: P()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: P()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: P()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: P()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: P()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: P()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: B()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: B()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: B()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: B()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: B()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: B()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: B()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: B()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: B()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": P()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": P()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: $()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [s, "screen", ...$()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          s,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...$()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          s,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [i]
          },
          ...$()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...$()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...$()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...$()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, kt, nt]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [o, M, jn]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Vn, A]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Fc, A, t]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [r, M, A]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [U, "none", M, jn]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          a,
          ...P()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", M, A]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", M, A]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: _()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: _()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...fe(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [U, "from-font", "auto", M, nt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: _()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [U, "auto", M, A]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: P()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", M, A]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", M, A]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: H()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: I()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ie()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Ke, M, A],
          radial: ["", M, A],
          conic: [Ke, M, A]
        }, zc, Lc]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: _()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: Z()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Z()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Z()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: _()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: _()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: _()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: K()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": K()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": K()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": K()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": K()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": K()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": K()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": K()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": K()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": K()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": K()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": K()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": K()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": K()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": K()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ee()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ee()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ee()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ee()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ee()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ee()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ee()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ee()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ee()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ee()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": ee()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...fe(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...fe(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: _()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": _()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": _()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": _()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": _()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": _()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": _()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": _()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": _()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: _()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...fe(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [U, M, A]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", U, kt, nt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: _()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          f,
          Xt,
          Yt
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: _()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, Xt, Yt]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": _()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ee()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: _()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [U, nt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": _()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ee()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": _()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", p, Xt, Yt]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": _()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [U, M, A]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...xe(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": xe()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [U]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": X()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": X()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": _()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": _()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": X()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": X()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": _()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": _()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": X()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": X()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": _()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": _()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": X()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": X()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": _()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": _()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": X()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": X()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": _()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": _()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": X()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": X()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": _()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": _()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": X()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": X()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": _()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": _()
      }],
      "mask-image-radial": [{
        "mask-radial": [M, A]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": X()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": X()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": _()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": _()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": x()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [U]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": X()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": X()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": _()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": _()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: H()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: I()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: ie()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", M, A]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          M,
          A
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: N()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [U, M, A]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [U, M, A]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          v,
          Xt,
          Yt
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": _()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", U, M, A]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [U, M, A]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", U, M, A]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [U, M, A]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", U, M, A]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          M,
          A
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": N()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [U, M, A]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [U, M, A]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", U, M, A]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [U, M, A]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", U, M, A]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [U, M, A]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [U, M, A]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", U, M, A]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": P()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": P()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": P()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", M, A]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [U, "initial", M, A]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", y, M, A]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [U, M, A]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", C, M, A]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [h, M, A]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": S()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: q()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": q()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": q()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": q()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: oe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": oe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": oe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": oe()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Q()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Q()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Q()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [M, A, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: S()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: J()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": J()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": J()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": J()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: _()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: _()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", M, A]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": P()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": P()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": P()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": P()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": P()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": P()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": P()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": P()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": P()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": P()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": P()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": P()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": P()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": P()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": P()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": P()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": P()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": P()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", M, A]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ..._()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [U, kt, nt, jn]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ..._()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, Gc = /* @__PURE__ */ Cc(jc);
function V(...e) {
  return Gc(ua(e));
}
const Sa = mn(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#34322d] text-white hover:bg-[#2f2c29]",
        brand: "bg-[#409eff] text-white hover:bg-[#337ecc] focus-visible:ring-[#409eff]/40",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        "source-link": "text-[#1677ff] underline-offset-4 hover:underline",
        "brand-link": "text-link",
        assist: "text-foreground hover:bg-accent disabled:text-muted-foreground disabled:opacity-100 disabled:[&_img]:grayscale disabled:[&_img]:opacity-40",
        mode: "border border-border bg-background font-normal text-muted-foreground shadow-[0_1px_2px_rgba(10,13,20,0.03)] hover:bg-accent aria-pressed:rounded-[6px] aria-pressed:border-link aria-pressed:bg-muted aria-pressed:font-medium aria-pressed:text-foreground aria-pressed:shadow-[0_4px_4px_rgba(0,0,0,0.07),0_1px_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]",
        dashed: "border border-dashed border-foreground/20 bg-background text-muted-foreground hover:bg-accent",
        muted: "bg-muted text-foreground hover:bg-accent data-[state=open]:bg-accent",
        "info-link": "text-[#1677ff] hover:underline",
        overlay: "bg-[rgba(0,17,33,0.7)] text-base leading-6 text-white hover:bg-[rgba(0,17,33,0.7)]"
      },
      size: {
        "dialog-pill": "h-9 rounded-[18px] px-3.5 text-xs font-bold disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        block: "h-auto min-h-[54px] w-full justify-start gap-2.5 whitespace-normal rounded-xl px-3.5 py-2.5 text-left text-[13px] leading-5 font-normal",
        compact: "h-[34px] rounded-[9px] gap-1 px-3 text-[13px] leading-[18.2px] font-normal [&_svg:not([class*='size-'])]:size-3.5",
        "pill-sm": "h-8 rounded-[14px] gap-1 px-3 text-[13px] leading-[18.2px] font-normal [&_svg:not([class*='size-'])]:size-[15px]",
        panel: "h-8 rounded-[4px] gap-1.5 px-[15px] py-0 text-[13px] has-[>svg]:px-[15px]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-xl px-4 py-3 text-base leading-6",
        inline: "h-auto rounded-sm p-0 font-normal",
        help: "h-auto rounded-sm p-0 text-[11px] leading-5 font-normal",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        mode: "h-9 min-w-[106px] rounded-[8px] gap-1 px-2 text-sm leading-5",
        material: "size-[52px] flex-col gap-1 rounded-[9px] p-0 text-[10px] leading-4 font-normal",
        chip: "h-6 rounded-[6px] gap-1 px-2 text-xs leading-4 font-normal",
        stepper: "size-5 rounded-full p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Hc({
  className: e,
  variant: t = "default",
  size: n = "default",
  asChild: o = !1,
  ...r
}) {
  return /* @__PURE__ */ m(
    o ? Zs : "button",
    {
      "data-slot": "button",
      "data-variant": t,
      "data-size": n,
      className: V(Sa({ variant: t, size: n, className: e })),
      ...r
    }
  );
}
var Uc = Object.defineProperty, Wc = (e, t) => Uc(e, "name", { value: t, configurable: !0 }), Kc = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], W = Kc.reduce((e, t) => {
  const n = /* @__PURE__ */ ke(`Primitive.${t}`), o = c.forwardRef((r, a) => {
    const { asChild: i, ...s } = r, l = i ? n : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(l, { ...s, ref: a });
  });
  return o.displayName = `Primitive.${t}`, { ...e, [t]: o };
}, {});
function _o(e, t) {
  e && Dt.flushSync(() => e.dispatchEvent(t));
}
Wc(_o, "dispatchDiscreteCustomEvent");
var Yc = Object.defineProperty, Xc = (e, t) => Yc(e, "name", { value: t, configurable: !0 }), Ra = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), qc = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Xc(function(t, n) {
    return /* @__PURE__ */ m(
      W.span,
      {
        ...t,
        ref: n,
        style: { ...Ra, ...t.style }
      }
    );
  }, "VisuallyHidden")
), Zc = qc, Qc = Object.defineProperty, Ce = (e, t) => Qc(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Jc(e, t) {
  const n = c.createContext(t);
  n.displayName = e + "Context";
  const o = /* @__PURE__ */ Ce((a) => {
    const { children: i, ...s } = a, l = c.useMemo(() => s, Object.values(s));
    return /* @__PURE__ */ m(n.Provider, { value: l, children: i });
  }, "Provider");
  o.displayName = e + "Provider";
  function r(a, i = {}) {
    const { optional: s = !1 } = i, l = c.useContext(n);
    if (l) return l;
    if (t !== void 0) return t;
    if (!s)
      throw new Error(`\`${a}\` must be used within \`${e}\``);
  }
  return Ce(r, "useContext"), [o, r];
}
Ce(Jc, "createContext");
// @__NO_SIDE_EFFECTS__
function ge(e, t = []) {
  let n = [];
  function o(a, i) {
    const s = c.createContext(i);
    s.displayName = a + "Context";
    const l = n.length;
    n = [...n, i];
    const u = /* @__PURE__ */ Ce((d) => {
      const { scope: p, children: v, ...b } = d, h = p?.[e]?.[l] || s, g = c.useMemo(() => b, Object.values(b));
      return /* @__PURE__ */ m(h.Provider, { value: g, children: v });
    }, "Provider");
    u.displayName = a + "Provider";
    function f(d, p, v = {}) {
      const { optional: b = !1 } = v, h = p?.[e]?.[l] || s, g = c.useContext(h);
      if (g) return g;
      if (i !== void 0) return i;
      if (!b)
        throw new Error(`\`${d}\` must be used within \`${a}\``);
    }
    return Ce(f, "useContext"), [u, f];
  }
  Ce(o, "createContext");
  const r = /* @__PURE__ */ Ce(() => {
    const a = n.map((i) => c.createContext(i));
    return /* @__PURE__ */ Ce(function(s) {
      const l = s?.[e] || a;
      return c.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: l } }),
        [s, l]
      );
    }, "useScope");
  }, "createScope");
  return r.scopeName = e, [o, Pa(r, ...t)];
}
Ce(ge, "createContextScope");
function Pa(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = /* @__PURE__ */ Ce(() => {
    const o = e.map((r) => ({
      useScope: r(),
      scopeName: r.scopeName
    }));
    return /* @__PURE__ */ Ce(function(a) {
      const i = o.reduce((s, { useScope: l, scopeName: u }) => {
        const d = l(a)[`__scope${u}`];
        return { ...s, ...d };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    }, "useComposedScopes");
  }, "createScope");
  return n.scopeName = t.scopeName, n;
}
Ce(Pa, "composeContextScopes");
var el = Object.defineProperty, ue = (e, t) => el(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function hn(e) {
  const t = e + "CollectionProvider", [n, o] = /* @__PURE__ */ ge(t), [r, a] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), i = /* @__PURE__ */ ue((h) => {
    const { scope: g, children: y } = h, C = c.useRef(null), w = c.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ m(r, { scope: g, itemMap: w, collectionRef: C, children: y });
  }, "CollectionProvider");
  i.displayName = t;
  const s = e + "CollectionSlot", l = /* @__PURE__ */ ke(s), u = c.forwardRef(
    (h, g) => {
      const { scope: y, children: C } = h, w = a(s, y), x = j(g, w.collectionRef);
      return /* @__PURE__ */ m(l, { ref: x, children: C });
    }
  );
  u.displayName = s;
  const f = e + "CollectionItemSlot", d = "data-radix-collection-item", p = /* @__PURE__ */ ke(f), v = c.forwardRef(
    (h, g) => {
      const { scope: y, children: C, ...w } = h, x = c.useRef(null), S = j(g, x), R = a(f, y);
      return c.useEffect(() => (R.itemMap.set(x, { ref: x, ...w }), () => {
        R.itemMap.delete(x);
      })), /* @__PURE__ */ m(p, { [d]: "", ref: S, children: C });
    }
  );
  v.displayName = f;
  function b(h) {
    const g = a(e + "CollectionConsumer", h);
    return c.useCallback(() => {
      const C = g.collectionRef.current;
      if (!C) return [];
      const w = Array.from(C.querySelectorAll(`[${d}]`));
      return Array.from(g.itemMap.values()).sort(
        (R, E) => w.indexOf(R.ref.current) - w.indexOf(E.ref.current)
      );
    }, [g.collectionRef, g.itemMap]);
  }
  return ue(b, "useCollection"), [
    { Provider: i, Slot: u, ItemSlot: v },
    b,
    o
  ];
}
ue(hn, "createCollection");
var yr = /* @__PURE__ */ new WeakMap(), ae, be, Gn = (be = class extends Map {
  constructor(n) {
    super(n);
    dr(this, ae);
    Bn(this, ae, [...super.keys()]), yr.set(this, !0);
  }
  set(n, o) {
    return yr.get(this) && (this.has(n) ? pe(this, ae)[pe(this, ae).indexOf(n)] = n : pe(this, ae).push(n)), super.set(n, o), this;
  }
  insert(n, o, r) {
    const a = this.has(o), i = pe(this, ae).length, s = ko(n);
    let l = s >= 0 ? s : i + s;
    const u = l < 0 || l >= i ? -1 : l;
    if (u === this.size || a && u === this.size - 1 || u === -1)
      return this.set(o, r), this;
    const f = this.size + (a ? 0 : 1);
    s < 0 && l++;
    const d = [...pe(this, ae)];
    let p, v = !1;
    for (let b = l; b < f; b++)
      if (l === b) {
        let h = d[b];
        d[b] === o && (h = d[b + 1]), a && this.delete(o), p = this.get(h), this.set(o, r);
      } else {
        !v && d[b - 1] === o && (v = !0);
        const h = d[v ? b : b - 1], g = p;
        p = this.get(h), this.delete(h), this.set(h, g);
      }
    return this;
  }
  with(n, o, r) {
    const a = new be(this);
    return a.insert(n, o, r), a;
  }
  before(n) {
    const o = pe(this, ae).indexOf(n) - 1;
    if (!(o < 0))
      return this.entryAt(o);
  }
  /**
   * Sets a new key-value pair at the position before the given key.
   */
  setBefore(n, o, r) {
    const a = pe(this, ae).indexOf(n);
    return a === -1 ? this : this.insert(a, o, r);
  }
  after(n) {
    let o = pe(this, ae).indexOf(n);
    if (o = o === -1 || o === this.size - 1 ? -1 : o + 1, o !== -1)
      return this.entryAt(o);
  }
  /**
   * Sets a new key-value pair at the position after the given key.
   */
  setAfter(n, o, r) {
    const a = pe(this, ae).indexOf(n);
    return a === -1 ? this : this.insert(a + 1, o, r);
  }
  first() {
    return this.entryAt(0);
  }
  last() {
    return this.entryAt(-1);
  }
  clear() {
    return Bn(this, ae, []), super.clear();
  }
  delete(n) {
    const o = super.delete(n);
    return o && pe(this, ae).splice(pe(this, ae).indexOf(n), 1), o;
  }
  deleteAt(n) {
    const o = this.keyAt(n);
    return o !== void 0 ? this.delete(o) : !1;
  }
  at(n) {
    const o = on(pe(this, ae), n);
    if (o !== void 0)
      return this.get(o);
  }
  entryAt(n) {
    const o = on(pe(this, ae), n);
    if (o !== void 0)
      return [o, this.get(o)];
  }
  indexOf(n) {
    return pe(this, ae).indexOf(n);
  }
  keyAt(n) {
    return on(pe(this, ae), n);
  }
  from(n, o) {
    const r = this.indexOf(n);
    if (r === -1)
      return;
    let a = r + o;
    return a < 0 && (a = 0), a >= this.size && (a = this.size - 1), this.at(a);
  }
  keyFrom(n, o) {
    const r = this.indexOf(n);
    if (r === -1)
      return;
    let a = r + o;
    return a < 0 && (a = 0), a >= this.size && (a = this.size - 1), this.keyAt(a);
  }
  find(n, o) {
    let r = 0;
    for (const a of this) {
      if (Reflect.apply(n, o, [a, r, this]))
        return a;
      r++;
    }
  }
  findIndex(n, o) {
    let r = 0;
    for (const a of this) {
      if (Reflect.apply(n, o, [a, r, this]))
        return r;
      r++;
    }
    return -1;
  }
  filter(n, o) {
    const r = [];
    let a = 0;
    for (const i of this)
      Reflect.apply(n, o, [i, a, this]) && r.push(i), a++;
    return new be(r);
  }
  map(n, o) {
    const r = [];
    let a = 0;
    for (const i of this)
      r.push([i[0], Reflect.apply(n, o, [i, a, this])]), a++;
    return new be(r);
  }
  reduce(...n) {
    const [o, r] = n;
    let a = 0, i = r ?? this.at(0);
    for (const s of this)
      a === 0 && n.length === 1 ? i = s : i = Reflect.apply(o, this, [i, s, a, this]), a++;
    return i;
  }
  reduceRight(...n) {
    const [o, r] = n;
    let a = r ?? this.at(-1);
    for (let i = this.size - 1; i >= 0; i--) {
      const s = this.at(i);
      i === this.size - 1 && n.length === 1 ? a = s : a = Reflect.apply(o, this, [a, s, i, this]);
    }
    return a;
  }
  toSorted(n) {
    const o = [...this.entries()].sort(n);
    return new be(o);
  }
  toReversed() {
    const n = new be();
    for (let o = this.size - 1; o >= 0; o--) {
      const r = this.keyAt(o), a = this.get(r);
      n.set(r, a);
    }
    return n;
  }
  toSpliced(...n) {
    const o = [...this.entries()];
    return o.splice(...n), new be(o);
  }
  slice(n, o) {
    const r = new be();
    let a = this.size - 1;
    if (n === void 0)
      return r;
    n < 0 && (n = n + this.size), o !== void 0 && o > 0 && (a = o - 1);
    for (let i = n; i <= a; i++) {
      const s = this.keyAt(i), l = this.get(s);
      r.set(s, l);
    }
    return r;
  }
  every(n, o) {
    let r = 0;
    for (const a of this) {
      if (!Reflect.apply(n, o, [a, r, this]))
        return !1;
      r++;
    }
    return !0;
  }
  some(n, o) {
    let r = 0;
    for (const a of this) {
      if (Reflect.apply(n, o, [a, r, this]))
        return !0;
      r++;
    }
    return !1;
  }
}, ae = new WeakMap(), ue(be, "OrderedDict"), be);
function on(e, t) {
  if ("at" in Array.prototype)
    return Array.prototype.at.call(e, t);
  const n = Ea(e, t);
  return n === -1 ? void 0 : e[n];
}
ue(on, "at");
function Ea(e, t) {
  const n = e.length, o = ko(t), r = o >= 0 ? o : n + o;
  return r < 0 || r >= n ? -1 : r;
}
ue(Ea, "toSafeIndex");
function ko(e) {
  return e !== e || e === 0 ? 0 : Math.trunc(e);
}
ue(ko, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function tl(e) {
  const t = e + "CollectionProvider", [n, o] = /* @__PURE__ */ ge(t), [r, a] = n(
    t,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new Gn(),
      setItemMap: /* @__PURE__ */ ue(() => {
      }, "setItemMap")
    }
  ), i = /* @__PURE__ */ ue(({ state: w, ...x }) => w ? /* @__PURE__ */ m(l, { ...x, state: w }) : /* @__PURE__ */ m(s, { ...x }), "CollectionProvider");
  i.displayName = t;
  const s = /* @__PURE__ */ ue((w) => {
    const x = g();
    return /* @__PURE__ */ m(l, { ...w, state: x });
  }, "CollectionInit");
  s.displayName = t + "Init";
  const l = /* @__PURE__ */ ue((w) => {
    const { scope: x, children: S, state: R } = w, E = c.useRef(null), [P, k] = c.useState(
      null
    ), D = j(E, k), [F, O] = R;
    return c.useEffect(() => {
      if (!P) return;
      const L = Ia(() => {
      });
      return L.observe(P, {
        childList: !0,
        subtree: !0
      }), () => {
        L.disconnect();
      };
    }, [P]), /* @__PURE__ */ m(
      r,
      {
        scope: x,
        itemMap: F,
        setItemMap: O,
        collectionRef: D,
        collectionRefObject: E,
        collectionElement: P,
        children: S
      }
    );
  }, "CollectionProviderImpl");
  l.displayName = t + "Impl";
  const u = e + "CollectionSlot", f = /* @__PURE__ */ ke(u), d = c.forwardRef(
    (w, x) => {
      const { scope: S, children: R } = w, E = a(u, S), P = j(x, E.collectionRef);
      return /* @__PURE__ */ m(f, { ref: P, children: R });
    }
  );
  d.displayName = u;
  const p = e + "CollectionItemSlot", v = "data-radix-collection-item", b = /* @__PURE__ */ ke(p), h = c.forwardRef(
    (w, x) => {
      const { scope: S, children: R, ...E } = w, P = c.useRef(null), [k, D] = c.useState(null), F = j(x, P, D), O = a(p, S), { setItemMap: L } = O, z = c.useRef(E);
      _a(z.current, E) || (z.current = E);
      const G = z.current;
      return c.useEffect(() => {
        const B = G;
        return L(($) => k ? $.has(k) ? $.set(k, { ...B, element: k }).toSorted(ao) : ($.set(k, { ...B, element: k }), $.toSorted(ao)) : $), () => {
          L(($) => !k || !$.has(k) ? $ : ($.delete(k), new Gn($)));
        };
      }, [k, G, L]), /* @__PURE__ */ m(b, { [v]: "", ref: F, children: R });
    }
  );
  h.displayName = p;
  function g() {
    return c.useState(new Gn());
  }
  ue(g, "useInitCollection");
  function y(w) {
    const { itemMap: x } = a(e + "CollectionConsumer", w);
    return x;
  }
  return ue(y, "useCollection"), [
    { Provider: i, Slot: d, ItemSlot: h },
    {
      createCollectionScope: o,
      useCollection: y,
      useInitCollection: g
    }
  ];
}
ue(tl, "createCollection");
function _a(e, t) {
  if (e === t) return !0;
  if (typeof e != "object" || typeof t != "object" || e == null || t == null) return !1;
  const n = Object.keys(e), o = Object.keys(t);
  if (n.length !== o.length) return !1;
  for (const r of n)
    if (!Object.prototype.hasOwnProperty.call(t, r) || e[r] !== t[r]) return !1;
  return !0;
}
ue(_a, "shallowEqual");
function ka(e, t) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING);
}
ue(ka, "isElementPreceding");
function ao(e, t) {
  return !e[1].element || !t[1].element ? 0 : ka(e[1].element, t[1].element) ? -1 : 1;
}
ue(ao, "sortByDocumentPosition");
function Ia(e) {
  return new MutationObserver((n) => {
    for (const o of n)
      if (o.type === "childList") {
        e();
        return;
      }
  });
}
ue(Ia, "getChildListObserver");
var nl = Object.defineProperty, St = (e, t) => nl(e, "name", { value: t, configurable: !0 }), Ta = !!(typeof window < "u" && window.document && window.document.createElement);
function T(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return /* @__PURE__ */ St(function(r) {
    if (e?.(r), n === !1 || !r || !r.defaultPrevented)
      return t?.(r);
  }, "handleEvent");
}
St(T, "composeEventHandlers");
function ol(e) {
  if (!Ta)
    throw new Error("Cannot access window outside of the DOM");
  return e?.ownerDocument?.defaultView ?? window;
}
St(ol, "getOwnerWindow");
function io(e) {
  if (!Ta)
    throw new Error("Cannot access document outside of the DOM");
  return e?.ownerDocument ?? document;
}
St(io, "getOwnerDocument");
function Oa(e, t = !1) {
  const { activeElement: n } = io(e);
  if (!n?.nodeName)
    return null;
  if (Aa(n) && n.contentDocument)
    return Oa(n.contentDocument.body, t);
  if (t) {
    const o = n.getAttribute("aria-activedescendant");
    if (o) {
      const r = io(n).getElementById(o);
      if (r)
        return r;
    }
  }
  return n;
}
St(Oa, "getActiveElement");
function Aa(e) {
  return e.tagName === "IFRAME";
}
St(Aa, "isFrame");
var ne = globalThis?.document ? c.useLayoutEffect : () => {
}, rl = Object.defineProperty, al = (e, t) => rl(e, "name", { value: t, configurable: !0 }), Cr = c[" useEffectEvent ".trim().toString()], Sr = c[" useInsertionEffect ".trim().toString()];
function Ma(e) {
  if (typeof Cr == "function")
    return Cr(e);
  const t = c.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Sr == "function" ? Sr(() => {
    t.current = e;
  }) : ne(() => {
    t.current = e;
  }), c.useMemo(() => ((...n) => t.current?.(...n)), []);
}
al(Ma, "useEffectEvent");
var il = Object.defineProperty, Nt = (e, t) => il(e, "name", { value: t, configurable: !0 }), sl = c[" useInsertionEffect ".trim().toString()] || ne;
function Ie({
  prop: e,
  defaultProp: t,
  onChange: n = /* @__PURE__ */ Nt(() => {
  }, "onChange"),
  caller: o
}) {
  const [r, a, i] = Da({
    defaultProp: t,
    onChange: n
  }), s = e !== void 0, l = s ? e : r, u = c.useCallback(
    (f) => {
      if (s) {
        const d = Na(f) ? f(e) : f;
        d !== e && i.current?.(d);
      } else
        a(f);
    },
    [s, e, a, i]
  );
  return [l, u];
}
Nt(Ie, "useControllableState");
function Da({
  defaultProp: e,
  onChange: t
}) {
  const [n, o] = c.useState(e), r = c.useRef(n), a = c.useRef(t);
  return sl(() => {
    a.current = t;
  }, [t]), c.useEffect(() => {
    r.current !== n && (a.current?.(n), r.current = n);
  }, [n, r]), [n, o, a];
}
Nt(Da, "useUncontrolledState");
function Na(e) {
  return typeof e == "function";
}
Nt(Na, "isFunction");
var Rr = /* @__PURE__ */ Symbol("RADIX:SYNC_STATE");
function cl(e, t, n, o) {
  const { prop: r, defaultProp: a, onChange: i, caller: s } = t, l = r !== void 0, u = Ma(i), f = [{ ...n, state: a }];
  o && f.push(o);
  const [d, p] = c.useReducer(
    (g, y) => {
      if (y.type === Rr)
        return { ...g, state: y.state };
      const C = e(g, y);
      return l && !Object.is(C.state, g.state) && u(C.state), C;
    },
    ...f
  ), v = d.state, b = c.useRef(v);
  c.useEffect(() => {
    b.current !== v && (b.current = v, l || u(v));
  }, [v, b, l]);
  const h = c.useMemo(() => r !== void 0 ? { ...d, state: r } : d, [d, r]);
  return c.useEffect(() => {
    l && !Object.is(r, d.state) && p({ type: Rr, state: r });
  }, [r, d.state, l]), [h, p];
}
Nt(cl, "useControllableStateReducer");
var ll = Object.defineProperty, Ge = (e, t) => ll(e, "name", { value: t, configurable: !0 });
function La(e, t) {
  return c.useReducer((n, o) => t[n][o] ?? n, e);
}
Ge(La, "useStateMachine");
var Re = /* @__PURE__ */ Ge((e) => {
  const { present: t, children: n } = e, o = Fa(t), r = typeof n == "function" ? n({ present: o.isPresent }) : c.Children.only(n), a = $a(o.ref, za(r));
  return typeof n == "function" || o.isPresent ? c.cloneElement(r, { ref: a }) : null;
}, "Presence");
function Fa(e) {
  const [t, n] = c.useState(), o = c.useRef(null), r = c.useRef(e), a = c.useRef("none"), i = c.useRef(void 0), s = e ? "mounted" : "unmounted", [l, u] = La(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return c.useEffect(() => {
    l === "mounted" ? (a.current = i.current ?? vt(o.current), i.current = void 0) : a.current = "none";
  }, [l]), ne(() => {
    const f = o.current, d = r.current;
    if (d !== e) {
      const v = a.current, b = vt(f);
      e ? (i.current = b, u("MOUNT")) : b === "none" || f?.display === "none" ? u("UNMOUNT") : u(d && v !== b ? "ANIMATION_OUT" : "UNMOUNT"), r.current = e;
    }
  }, [e, u]), ne(() => {
    if (t) {
      let f;
      const d = t.ownerDocument.defaultView ?? window, p = /* @__PURE__ */ Ge((b) => {
        const g = vt(o.current).includes(CSS.escape(b.animationName));
        if (b.target === t && g && (u("ANIMATION_END"), !r.current)) {
          const y = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", f = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = y);
          });
        }
      }, "handleAnimationEnd"), v = /* @__PURE__ */ Ge((b) => {
        b.target === t && (a.current = vt(o.current));
      }, "handleAnimationStart");
      return t.addEventListener("animationstart", v), t.addEventListener("animationcancel", p), t.addEventListener("animationend", p), () => {
        d.clearTimeout(f), t.removeEventListener("animationstart", v), t.removeEventListener("animationcancel", p), t.removeEventListener("animationend", p);
      };
    } else
      u("ANIMATION_END");
  }, [t, u]), {
    isPresent: ["mounted", "unmountSuspended"].includes(l),
    ref: c.useCallback((f) => {
      if (f) {
        const d = getComputedStyle(f);
        o.current = d, i.current = vt(d);
      } else
        o.current = null;
      n(f);
    }, [])
  };
}
Ge(Fa, "usePresence");
function so(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
Ge(so, "setRef");
function $a(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((n) => {
    const o = t.current;
    let r = !1;
    const a = o.map((i) => {
      const s = so(i, n);
      return !r && typeof s == "function" && (r = !0), s;
    });
    if (r)
      return () => {
        for (let i = 0; i < a.length; i++) {
          const s = a[i];
          typeof s == "function" ? s() : so(o[i], null);
        }
      };
  }, []);
}
Ge($a, "useStableComposedRefs");
function vt(e) {
  return e?.animationName || "none";
}
Ge(vt, "getAnimationName");
function za(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
Ge(za, "getElementRef");
var ul = Object.defineProperty, dl = (e, t) => ul(e, "name", { value: t, configurable: !0 }), fl = c[" useId ".trim().toString()] || (() => {
}), pl = 0;
function _e(e) {
  const [t, n] = c.useState(fl());
  return ne(() => {
    e || n((o) => o ?? String(pl++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
dl(_e, "useId");
var ml = Object.defineProperty, hl = (e, t) => ml(e, "name", { value: t, configurable: !0 }), gl = c.createContext(void 0);
function Lt(e) {
  const t = c.useContext(gl);
  return e || t || "ltr";
}
hl(Lt, "useDirection");
var vl = Object.defineProperty, bl = (e, t) => vl(e, "name", { value: t, configurable: !0 });
function Se(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => ((...n) => t.current?.(...n)), []);
}
bl(Se, "useCallbackRef");
var wl = Object.defineProperty, le = (e, t) => wl(e, "name", { value: t, configurable: !0 }), co = "dismissableLayer.update", xl = "dismissableLayer.pointerDownOutside", yl = "dismissableLayer.focusOutside", Pr, Ba = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), Ft = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ le(function(t, n) {
    const {
      disableOutsidePointerEvents: o = !1,
      deferPointerDownOutside: r = !1,
      onEscapeKeyDown: a,
      onPointerDownOutside: i,
      onFocusOutside: s,
      onInteractOutside: l,
      onDismiss: u,
      ...f
    } = t, d = c.useContext(Ba), [p, v] = c.useState(null), b = p?.ownerDocument ?? globalThis?.document, [, h] = c.useState({}), g = j(n, v), y = Array.from(d.layers), [C] = [
      ...d.layersWithOutsidePointerEventsDisabled
    ].slice(-1), w = C ? y.indexOf(C) : -1, x = p ? y.indexOf(p) : -1, S = d.layersWithOutsidePointerEventsDisabled.size > 0, R = x >= w, E = c.useRef(!1), P = ja(
      (O) => {
        i?.(O), l?.(O), O.defaultPrevented || u?.();
      },
      {
        ownerDocument: b,
        deferPointerDownOutside: r,
        isDeferredPointerDownOutsideRef: E,
        dismissableSurfaces: d.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          (O) => {
            if (!(O instanceof Node))
              return !1;
            const L = [...d.branches].some(
              (z) => z.contains(O)
            );
            return R && !L;
          },
          [d.branches, R]
        )
      }
    ), k = Ga((O) => {
      if (r && E.current)
        return;
      const L = O.target;
      [...d.branches].some((G) => G.contains(L)) || (s?.(O), l?.(O), O.defaultPrevented || u?.());
    }, b), D = p ? x === y.length - 1 : !1, F = Se((O) => {
      O.key === "Escape" && (a?.(O), !O.defaultPrevented && u && (O.preventDefault(), u()));
    });
    return c.useEffect(() => {
      if (D)
        return b.addEventListener("keydown", F, { capture: !0 }), () => b.removeEventListener("keydown", F, { capture: !0 });
    }, [b, D, F]), c.useEffect(() => {
      if (p)
        return o && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (Pr = b.body.style.pointerEvents, b.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(p)), d.layers.add(p), lo(), () => {
          o && (d.layersWithOutsidePointerEventsDisabled.delete(p), d.layersWithOutsidePointerEventsDisabled.size === 0 && (b.body.style.pointerEvents = Pr));
        };
    }, [p, b, o, d]), c.useEffect(() => () => {
      p && (d.layers.delete(p), d.layersWithOutsidePointerEventsDisabled.delete(p), lo());
    }, [p, d]), c.useEffect(() => {
      const O = /* @__PURE__ */ le(() => h({}), "handleUpdate");
      return document.addEventListener(co, O), () => document.removeEventListener(co, O);
    }, []), /* @__PURE__ */ m(
      W.div,
      {
        ...f,
        ref: g,
        style: {
          pointerEvents: S ? R ? "auto" : "none" : void 0,
          ...t.style
        },
        onFocusCapture: T(t.onFocusCapture, k.onFocusCapture),
        onBlurCapture: T(t.onBlurCapture, k.onBlurCapture),
        onPointerDownCapture: T(
          t.onPointerDownCapture,
          P.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function Va() {
  const e = c.useContext(Ba), [t, n] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), n;
}
le(Va, "useDismissableLayerSurface");
var Cl = /* @__PURE__ */ le(() => !0, "IS_TRUE");
function ja(e, t) {
  const {
    ownerDocument: n = globalThis?.document,
    deferPointerDownOutside: o = !1,
    isDeferredPointerDownOutsideRef: r,
    dismissableSurfaces: a,
    shouldHandlePointerDownOutside: i = Cl
  } = t, s = Se(e), l = c.useRef(!1), u = c.useRef(!1), f = c.useRef(/* @__PURE__ */ new Map()), d = c.useRef(() => {
  });
  return c.useEffect(() => {
    function p() {
      u.current = !1, r.current = !1, f.current.clear();
    }
    le(p, "resetOutsideInteraction");
    function v() {
      return Array.from(f.current.values()).some(Boolean);
    }
    le(v, "isOutsideInteractionIntercepted");
    function b(w) {
      if (!u.current)
        return;
      const x = w.target;
      x instanceof Node && [...a].some((R) => R.contains(x)) || f.current.set(w.type, !0), w.type === "click" && window.setTimeout(() => {
        u.current && d.current();
      }, 0);
    }
    le(b, "handleInteractionCapture");
    function h(w) {
      u.current && f.current.set(w.type, !1);
    }
    le(h, "handleInteractionBubble");
    const g = /* @__PURE__ */ le((w) => {
      if (w.target && !l.current) {
        let x = function() {
          n.removeEventListener("click", d.current);
          const R = v();
          p(), R || Io(
            xl,
            s,
            S,
            { discrete: !0 }
          );
        };
        if (le(x, "handleAndDispatchPointerDownOutsideEvent"), !i(w.target)) {
          n.removeEventListener("click", d.current), p(), l.current = !1;
          return;
        }
        const S = { originalEvent: w };
        u.current = !0, r.current = o && w.button === 0, f.current.clear(), !o || w.button !== 0 ? x() : (n.removeEventListener("click", d.current), d.current = x, n.addEventListener("click", d.current, { once: !0 }));
      } else
        n.removeEventListener("click", d.current), p();
      l.current = !1;
    }, "handlePointerDown"), y = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const w of y)
      n.addEventListener(w, b, !0), n.addEventListener(w, h);
    const C = window.setTimeout(() => {
      n.addEventListener("pointerdown", g);
    }, 0);
    return () => {
      window.clearTimeout(C), n.removeEventListener("pointerdown", g), n.removeEventListener("click", d.current);
      for (const w of y)
        n.removeEventListener(w, b, !0), n.removeEventListener(w, h);
    };
  }, [
    n,
    s,
    o,
    r,
    a,
    i
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ le(() => l.current = !0, "onPointerDownCapture")
  };
}
le(ja, "usePointerDownOutside");
function Ga(e, t = globalThis?.document) {
  const n = Se(e), o = c.useRef(!1);
  return c.useEffect(() => {
    const r = /* @__PURE__ */ le((a) => {
      a.target && !o.current && Io(yl, n, { originalEvent: a }, {
        discrete: !1
      });
    }, "handleFocus");
    return t.addEventListener("focusin", r), () => t.removeEventListener("focusin", r);
  }, [t, n]), {
    onFocusCapture: /* @__PURE__ */ le(() => o.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ le(() => o.current = !1, "onBlurCapture")
  };
}
le(Ga, "useFocusOutside");
function lo() {
  const e = new CustomEvent(co);
  document.dispatchEvent(e);
}
le(lo, "dispatchUpdate");
function Io(e, t, n, { discrete: o }) {
  const r = n.originalEvent.target, a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && r.addEventListener(e, t, { once: !0 }), o ? _o(r, a) : r.dispatchEvent(a);
}
le(Io, "handleAndDispatchCustomEvent");
var Sl = Object.defineProperty, he = (e, t) => Sl(e, "name", { value: t, configurable: !0 }), Hn = "focusScope.autoFocusOnMount", Un = "focusScope.autoFocusOnUnmount", Er = { bubbles: !1, cancelable: !0 }, gn = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ he(function(t, n) {
    const {
      loop: o = !1,
      trapped: r = !1,
      onMountAutoFocus: a,
      onUnmountAutoFocus: i,
      ...s
    } = t, [l, u] = c.useState(null), f = Se(a), d = Se(i), p = c.useRef(null), v = j(n, u), b = c.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    c.useEffect(() => {
      if (r) {
        let g = function(x) {
          if (b.paused || !l) return;
          const S = x.target;
          l.contains(S) ? p.current = S : $e(p.current, { select: !0 });
        }, y = function(x) {
          if (b.paused || !l) return;
          const S = x.relatedTarget;
          S !== null && (l.contains(S) || $e(p.current, { select: !0 }));
        }, C = function(x) {
          if (document.activeElement === document.body)
            for (const R of x)
              R.removedNodes.length > 0 && $e(l);
        };
        he(g, "handleFocusIn"), he(y, "handleFocusOut"), he(C, "handleMutations"), document.addEventListener("focusin", g), document.addEventListener("focusout", y);
        const w = new MutationObserver(C);
        return l && w.observe(l, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", g), document.removeEventListener("focusout", y), w.disconnect();
        };
      }
    }, [r, l, b.paused]), c.useEffect(() => {
      if (l) {
        _r.add(b);
        const g = document.activeElement;
        if (!l.contains(g)) {
          const C = new CustomEvent(Hn, Er);
          l.addEventListener(Hn, f), l.dispatchEvent(C), C.defaultPrevented || (Ha(Xa(To(l)), { select: !0 }), document.activeElement === g && $e(l));
        }
        return () => {
          l.removeEventListener(Hn, f), setTimeout(() => {
            const C = new CustomEvent(Un, Er);
            l.addEventListener(Un, d), l.dispatchEvent(C), C.defaultPrevented || $e(g ?? document.body, { select: !0 }), l.removeEventListener(Un, d), _r.remove(b);
          }, 0);
        };
      }
    }, [l, f, d, b]);
    const h = c.useCallback(
      (g) => {
        if (!o && !r || b.paused) return;
        const y = g.key === "Tab" && !g.altKey && !g.ctrlKey && !g.metaKey, C = document.activeElement;
        if (y && C) {
          const w = g.currentTarget, [x, S] = Ua(w);
          x && S ? !g.shiftKey && C === S ? (g.preventDefault(), o && $e(x, { select: !0 })) : g.shiftKey && C === x && (g.preventDefault(), o && $e(S, { select: !0 })) : C === w && g.preventDefault();
        }
      },
      [o, r, b.paused]
    );
    return /* @__PURE__ */ m(W.div, { tabIndex: -1, ...s, ref: v, onKeyDown: h });
  }, "FocusScope")
);
function Ha(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const o of e)
    if ($e(o, { select: t }), document.activeElement !== n) return;
}
he(Ha, "focusFirst");
function Ua(e) {
  const t = To(e), n = uo(t, e), o = uo(t.reverse(), e);
  return [n, o];
}
he(Ua, "getTabbableEdges");
function To(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ he((o) => {
      const r = o.tagName === "INPUT" && o.type === "hidden";
      return o.disabled || o.hidden || r ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
he(To, "getTabbableCandidates");
function uo(e, t) {
  const n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const o of e)
    if (!(n ? !o.checkVisibility({ checkVisibilityCSS: !0 }) : Wa(o, { upTo: t })))
      return o;
}
he(uo, "findVisible");
function Wa(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
he(Wa, "isHidden");
function Ka(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
he(Ka, "isSelectableInput");
function $e(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Ka(e) && t && e.select();
  }
}
he($e, "focus");
var _r = Ya();
function Ya() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && n?.pause(), e = fo(e, t), e.unshift(t);
    },
    remove(t) {
      e = fo(e, t), e[0]?.resume();
    }
  };
}
he(Ya, "createFocusScopesStack");
function fo(e, t) {
  const n = [...e], o = n.indexOf(t);
  return o !== -1 && n.splice(o, 1), n;
}
he(fo, "arrayRemove");
function Xa(e) {
  return e.filter((t) => t.tagName !== "A");
}
he(Xa, "removeLinks");
var Rl = Object.defineProperty, Pl = (e, t) => Rl(e, "name", { value: t, configurable: !0 }), $t = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Pl(function(t, n) {
    const { container: o, ...r } = t, [a, i] = c.useState(!1);
    ne(() => i(!0), []);
    const s = o || a && globalThis?.document?.body;
    return s ? Dt.createPortal(/* @__PURE__ */ m(W.div, { ...r, ref: n }), s) : null;
  }, "Portal")
), El = Object.defineProperty, Oo = (e, t) => El(e, "name", { value: t, configurable: !0 }), qt = 0, pt = null;
function _l(e) {
  return Rt(), e.children;
}
Oo(_l, "FocusGuards");
function Rt() {
  c.useEffect(() => {
    pt || (pt = { start: po(), end: po() });
    const { start: e, end: t } = pt;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), qt++, () => {
      qt === 1 && (pt?.start.remove(), pt?.end.remove(), pt = null), qt = Math.max(0, qt - 1);
    };
  }, []);
}
Oo(Rt, "useFocusGuards");
function po() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
Oo(po, "createFocusGuard");
var Oe = function() {
  return Oe = Object.assign || function(t) {
    for (var n, o = 1, r = arguments.length; o < r; o++) {
      n = arguments[o];
      for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a]);
    }
    return t;
  }, Oe.apply(this, arguments);
};
function qa(e, t) {
  var n = {};
  for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
}
function kl(e, t, n) {
  if (n || arguments.length === 2) for (var o = 0, r = t.length, a; o < r; o++)
    (a || !(o in t)) && (a || (a = Array.prototype.slice.call(t, 0, o)), a[o] = t[o]);
  return e.concat(a || Array.prototype.slice.call(t));
}
var rn = "right-scroll-bar-position", an = "width-before-scroll-bar", Il = "with-scroll-bars-hidden", Tl = "--removed-body-scroll-bar-size";
function Wn(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Ol(e, t) {
  var n = Ss(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(o) {
          var r = n.value;
          r !== o && (n.value = o, n.callback(o, r));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var Al = typeof window < "u" ? c.useLayoutEffect : c.useEffect, kr = /* @__PURE__ */ new WeakMap();
function Ml(e, t) {
  var n = Ol(null, function(o) {
    return e.forEach(function(r) {
      return Wn(r, o);
    });
  });
  return Al(function() {
    var o = kr.get(n);
    if (o) {
      var r = new Set(o), a = new Set(e), i = n.current;
      r.forEach(function(s) {
        a.has(s) || Wn(s, null);
      }), a.forEach(function(s) {
        r.has(s) || Wn(s, i);
      });
    }
    kr.set(n, e);
  }, [e]), n;
}
function Dl(e) {
  return e;
}
function Nl(e, t) {
  t === void 0 && (t = Dl);
  var n = [], o = !1, r = {
    read: function() {
      if (o)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(a) {
      var i = t(a, o);
      return n.push(i), function() {
        n = n.filter(function(s) {
          return s !== i;
        });
      };
    },
    assignSyncMedium: function(a) {
      for (o = !0; n.length; ) {
        var i = n;
        n = [], i.forEach(a);
      }
      n = {
        push: function(s) {
          return a(s);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(a) {
      o = !0;
      var i = [];
      if (n.length) {
        var s = n;
        n = [], s.forEach(a), i = n;
      }
      var l = function() {
        var f = i;
        i = [], f.forEach(a);
      }, u = function() {
        return Promise.resolve().then(l);
      };
      u(), n = {
        push: function(f) {
          i.push(f), u();
        },
        filter: function(f) {
          return i = i.filter(f), n;
        }
      };
    }
  };
  return r;
}
function Ll(e) {
  e === void 0 && (e = {});
  var t = Nl(null);
  return t.options = Oe({ async: !0, ssr: !1 }, e), t;
}
var Za = function(e) {
  var t = e.sideCar, n = qa(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var o = t.read();
  if (!o)
    throw new Error("Sidecar medium not found");
  return c.createElement(o, Oe({}, n));
};
Za.isSideCarExport = !0;
function Fl(e, t) {
  return e.useMedium(t), Za;
}
var Qa = Ll(), Kn = function() {
}, vn = c.forwardRef(function(e, t) {
  var n = c.useRef(null), o = c.useState({
    onScrollCapture: Kn,
    onWheelCapture: Kn,
    onTouchMoveCapture: Kn
  }), r = o[0], a = o[1], i = e.forwardProps, s = e.children, l = e.className, u = e.removeScrollBar, f = e.enabled, d = e.shards, p = e.sideCar, v = e.noRelative, b = e.noIsolation, h = e.inert, g = e.allowPinchZoom, y = e.as, C = y === void 0 ? "div" : y, w = e.gapMode, x = qa(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), S = p, R = Ml([n, t]), E = Oe(Oe({}, x), r);
  return c.createElement(
    c.Fragment,
    null,
    f && c.createElement(S, { sideCar: Qa, removeScrollBar: u, shards: d, noRelative: v, noIsolation: b, inert: h, setCallbacks: a, allowPinchZoom: !!g, lockRef: n, gapMode: w }),
    i ? c.cloneElement(c.Children.only(s), Oe(Oe({}, E), { ref: R })) : c.createElement(C, Oe({}, E, { className: l, ref: R }), s)
  );
});
vn.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
vn.classNames = {
  fullWidth: an,
  zeroRight: rn
};
var $l = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function zl() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = $l();
  return t && e.setAttribute("nonce", t), e;
}
function Bl(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Vl(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var jl = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = zl()) && (Bl(t, n), Vl(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Gl = function() {
  var e = jl();
  return function(t, n) {
    c.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, Ja = function() {
  var e = Gl(), t = function(n) {
    var o = n.styles, r = n.dynamic;
    return e(o, r), null;
  };
  return t;
}, Hl = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Yn = function(e) {
  return parseInt(e || "", 10) || 0;
}, Ul = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], o = t[e === "padding" ? "paddingTop" : "marginTop"], r = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Yn(n), Yn(o), Yn(r)];
}, Wl = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Hl;
  var t = Ul(e), n = document.documentElement.clientWidth, o = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, o - n + t[2] - t[0])
  };
}, Kl = Ja(), bt = "data-scroll-locked", Yl = function(e, t, n, o) {
  var r = e.left, a = e.top, i = e.right, s = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(Il, ` {
   overflow: hidden `).concat(o, `;
   padding-right: `).concat(s, "px ").concat(o, `;
  }
  body[`).concat(bt, `] {
    overflow: hidden `).concat(o, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(o, ";"),
    n === "margin" && `
    padding-left: `.concat(r, `px;
    padding-top: `).concat(a, `px;
    padding-right: `).concat(i, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s, "px ").concat(o, `;
    `),
    n === "padding" && "padding-right: ".concat(s, "px ").concat(o, ";")
  ].filter(Boolean).join(""), `
  }

  .`).concat(rn, ` {
    right: `).concat(s, "px ").concat(o, `;
  }

  .`).concat(an, ` {
    margin-right: `).concat(s, "px ").concat(o, `;
  }

  .`).concat(rn, " .").concat(rn, ` {
    right: 0 `).concat(o, `;
  }

  .`).concat(an, " .").concat(an, ` {
    margin-right: 0 `).concat(o, `;
  }

  body[`).concat(bt, `] {
    `).concat(Tl, ": ").concat(s, `px;
  }
`);
}, Ir = function() {
  var e = parseInt(document.body.getAttribute(bt) || "0", 10);
  return isFinite(e) ? e : 0;
}, Xl = function() {
  c.useEffect(function() {
    return document.body.setAttribute(bt, (Ir() + 1).toString()), function() {
      var e = Ir() - 1;
      e <= 0 ? document.body.removeAttribute(bt) : document.body.setAttribute(bt, e.toString());
    };
  }, []);
}, ql = function(e) {
  var t = e.noRelative, n = e.noImportant, o = e.gapMode, r = o === void 0 ? "margin" : o;
  Xl();
  var a = c.useMemo(function() {
    return Wl(r);
  }, [r]);
  return c.createElement(Kl, { styles: Yl(a, !t, r, n ? "" : "!important") });
}, mo = !1;
if (typeof window < "u")
  try {
    var Zt = Object.defineProperty({}, "passive", {
      get: function() {
        return mo = !0, !0;
      }
    });
    window.addEventListener("test", Zt, Zt), window.removeEventListener("test", Zt, Zt);
  } catch {
    mo = !1;
  }
var mt = mo ? { passive: !1 } : !1, Zl = function(e) {
  return e.tagName === "TEXTAREA";
}, ei = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Zl(e) && n[t] === "visible")
  );
}, Ql = function(e) {
  return ei(e, "overflowY");
}, Jl = function(e) {
  return ei(e, "overflowX");
}, Tr = function(e, t) {
  var n = t.ownerDocument, o = t;
  do {
    typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
    var r = ti(e, o);
    if (r) {
      var a = ni(e, o), i = a[1], s = a[2];
      if (i > s)
        return !0;
    }
    o = o.parentNode;
  } while (o && o !== n.body);
  return !1;
}, eu = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, o = e.clientHeight;
  return [
    t,
    n,
    o
  ];
}, tu = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, o = e.clientWidth;
  return [
    t,
    n,
    o
  ];
}, ti = function(e, t) {
  return e === "v" ? Ql(t) : Jl(t);
}, ni = function(e, t) {
  return e === "v" ? eu(t) : tu(t);
}, nu = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, ou = function(e, t, n, o, r) {
  var a = nu(e, window.getComputedStyle(t).direction), i = a * o, s = n.target, l = t.contains(s), u = !1, f = i > 0, d = 0, p = 0;
  do {
    if (!s)
      break;
    var v = ni(e, s), b = v[0], h = v[1], g = v[2], y = h - g - a * b;
    (b || y) && ti(e, s) && (d += y, p += b);
    var C = s.parentNode;
    s = C && C.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? C.host : C;
  } while (
    // portaled content
    !l && s !== document.body || // self content
    l && (t.contains(s) || t === s)
  );
  return (f && Math.abs(d) < 1 || !f && Math.abs(p) < 1) && (u = !0), u;
}, Qt = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Or = function(e) {
  return [e.deltaX, e.deltaY];
}, Ar = function(e) {
  return e && "current" in e ? e.current : e;
}, ru = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, au = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, iu = 0, ht = [];
function su(e) {
  var t = c.useRef([]), n = c.useRef([0, 0]), o = c.useRef(), r = c.useState(iu++)[0], a = c.useState(Ja)[0], i = c.useRef(e);
  c.useEffect(function() {
    i.current = e;
  }, [e]), c.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(r));
      var h = kl([e.lockRef.current], (e.shards || []).map(Ar), !0).filter(Boolean);
      return h.forEach(function(g) {
        return g.classList.add("allow-interactivity-".concat(r));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(r)), h.forEach(function(g) {
          return g.classList.remove("allow-interactivity-".concat(r));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = c.useCallback(function(h, g) {
    if ("touches" in h && h.touches.length === 2 || h.type === "wheel" && h.ctrlKey)
      return !i.current.allowPinchZoom;
    var y = Qt(h), C = n.current, w = "deltaX" in h ? h.deltaX : C[0] - y[0], x = "deltaY" in h ? h.deltaY : C[1] - y[1], S, R = h.target, E = Math.abs(w) > Math.abs(x) ? "h" : "v";
    if ("touches" in h && E === "h" && R.type === "range")
      return !1;
    var P = window.getSelection(), k = P && P.anchorNode, D = k ? k === R || k.contains(R) : !1;
    if (D)
      return !1;
    var F = Tr(E, R);
    if (!F)
      return !0;
    if (F ? S = E : (S = E === "v" ? "h" : "v", F = Tr(E, R)), !F)
      return !1;
    if (!o.current && "changedTouches" in h && (w || x) && (o.current = S), !S)
      return !0;
    var O = o.current || S;
    return ou(O, g, h, O === "h" ? w : x);
  }, []), l = c.useCallback(function(h) {
    var g = h;
    if (!(!ht.length || ht[ht.length - 1] !== a)) {
      var y = "deltaY" in g ? Or(g) : Qt(g), C = t.current.filter(function(S) {
        return S.name === g.type && (S.target === g.target || g.target === S.shadowParent) && ru(S.delta, y);
      })[0];
      if (C && C.should) {
        g.cancelable && g.preventDefault();
        return;
      }
      if (!C) {
        var w = (i.current.shards || []).map(Ar).filter(Boolean).filter(function(S) {
          return S.contains(g.target);
        }), x = w.length > 0 ? s(g, w[0]) : !i.current.noIsolation;
        x && g.cancelable && g.preventDefault();
      }
    }
  }, []), u = c.useCallback(function(h, g, y, C) {
    var w = { name: h, delta: g, target: y, should: C, shadowParent: cu(y) };
    t.current.push(w), setTimeout(function() {
      t.current = t.current.filter(function(x) {
        return x !== w;
      });
    }, 1);
  }, []), f = c.useCallback(function(h) {
    n.current = Qt(h), o.current = void 0;
  }, []), d = c.useCallback(function(h) {
    u(h.type, Or(h), h.target, s(h, e.lockRef.current));
  }, []), p = c.useCallback(function(h) {
    u(h.type, Qt(h), h.target, s(h, e.lockRef.current));
  }, []);
  c.useEffect(function() {
    return ht.push(a), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: p
    }), document.addEventListener("wheel", l, mt), document.addEventListener("touchmove", l, mt), document.addEventListener("touchstart", f, mt), function() {
      ht = ht.filter(function(h) {
        return h !== a;
      }), document.removeEventListener("wheel", l, mt), document.removeEventListener("touchmove", l, mt), document.removeEventListener("touchstart", f, mt);
    };
  }, []);
  var v = e.removeScrollBar, b = e.inert;
  return c.createElement(
    c.Fragment,
    null,
    b ? c.createElement(a, { styles: au(r) }) : null,
    v ? c.createElement(ql, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function cu(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const lu = Fl(Qa, su);
var zt = c.forwardRef(function(e, t) {
  return c.createElement(vn, Oe({}, e, { ref: t, sideCar: lu }));
});
zt.classNames = vn.classNames;
var uu = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, gt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), en = {}, Xn = 0, oi = function(e) {
  return e && (e.host || oi(e.parentNode));
}, du = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var o = oi(n);
    return o && e.contains(o) ? o : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, fu = function(e, t, n, o) {
  var r = du(t, Array.isArray(e) ? e : [e]);
  en[n] || (en[n] = /* @__PURE__ */ new WeakMap());
  var a = en[n], i = [], s = /* @__PURE__ */ new Set(), l = new Set(r), u = function(d) {
    !d || s.has(d) || (s.add(d), u(d.parentNode));
  };
  r.forEach(u);
  var f = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (s.has(p))
        f(p);
      else
        try {
          var v = p.getAttribute(o), b = v !== null && v !== "false", h = (gt.get(p) || 0) + 1, g = (a.get(p) || 0) + 1;
          gt.set(p, h), a.set(p, g), i.push(p), h === 1 && b && Jt.set(p, !0), g === 1 && p.setAttribute(n, "true"), b || p.setAttribute(o, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", p, y);
        }
    });
  };
  return f(t), s.clear(), Xn++, function() {
    i.forEach(function(d) {
      var p = gt.get(d) - 1, v = a.get(d) - 1;
      gt.set(d, p), a.set(d, v), p || (Jt.has(d) || d.removeAttribute(o), Jt.delete(d)), v || d.removeAttribute(n);
    }), Xn--, Xn || (gt = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), en = {});
  };
}, bn = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var o = Array.from(Array.isArray(e) ? e : [e]), r = uu(e);
  return r ? (o.push.apply(o, Array.from(r.querySelectorAll("[aria-live], script"))), fu(o, r, n, "aria-hidden")) : function() {
    return null;
  };
}, pu = Object.defineProperty, Pe = (e, t) => pu(e, "name", { value: t, configurable: !0 }), Ao = "Dialog", [ri, Lh] = /* @__PURE__ */ ge(Ao), [mu, Ne] = ri(Ao), hu = /* @__PURE__ */ Pe((e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: o,
    defaultOpen: r,
    onOpenChange: a,
    modal: i = !0
  } = e, s = c.useRef(null), l = c.useRef(null), [u, f] = Ie({
    prop: o,
    defaultProp: r ?? !1,
    onChange: a,
    caller: Ao
  }), [d, p] = c.useState(0), [v, b] = c.useState(0);
  return /* @__PURE__ */ m(
    mu,
    {
      scope: t,
      triggerRef: s,
      contentRef: l,
      contentId: _e(),
      titleId: _e(),
      descriptionId: _e(),
      titlePresent: d > 0,
      descriptionPresent: v > 0,
      setTitleCount: p,
      setDescriptionCount: b,
      open: u,
      onOpenChange: f,
      onOpenToggle: c.useCallback(() => f((h) => !h), [f]),
      modal: i,
      children: n
    }
  );
}, "Dialog"), ai = "DialogPortal", [gu, ii] = ri(ai, {
  forceMount: void 0
}), vu = /* @__PURE__ */ Pe((e) => {
  const { __scopeDialog: t, forceMount: n, children: o, container: r } = e, a = Ne(ai, t);
  return /* @__PURE__ */ m(gu, { scope: t, forceMount: n, children: c.Children.map(o, (i) => /* @__PURE__ */ m(Re, { present: n || a.open, children: /* @__PURE__ */ m($t, { asChild: !0, container: r, children: i }) })) });
}, "DialogPortal"), ho = "DialogOverlay", bu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Pe(function(t, n) {
    const o = ii(ho, t.__scopeDialog), { forceMount: r = o.forceMount, ...a } = t, i = Ne(ho, t.__scopeDialog);
    return i.modal ? /* @__PURE__ */ m(Re, { present: r || i.open, children: /* @__PURE__ */ m(xu, { ...a, ref: n }) }) : null;
  }, "DialogOverlay")
), wu = /* @__PURE__ */ ke("DialogOverlay.RemoveScroll"), xu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Pe(function(t, n) {
    const { __scopeDialog: o, ...r } = t, a = Ne(ho, o), i = Va(), s = j(n, i);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ m(zt, { as: wu, allowPinchZoom: !0, shards: [a.contentRef], children: /* @__PURE__ */ m(
        W.div,
        {
          "data-state": Mo(a.open),
          ...r,
          ref: s,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), It = "DialogContent", yu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Pe(function(t, n) {
    const o = ii(It, t.__scopeDialog), { forceMount: r = o.forceMount, ...a } = t, i = Ne(It, t.__scopeDialog);
    return /* @__PURE__ */ m(Re, { present: r || i.open, children: i.modal ? /* @__PURE__ */ m(Cu, { ...a, ref: n }) : /* @__PURE__ */ m(Su, { ...a, ref: n }) });
  }, "DialogContent")
), Cu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Pe(function(t, n) {
    const o = Ne(It, t.__scopeDialog), r = c.useRef(null), a = j(n, o.contentRef, r);
    return c.useEffect(() => {
      const i = r.current;
      if (i) return bn(i);
    }, []), /* @__PURE__ */ m(
      si,
      {
        ...t,
        ref: a,
        trapFocus: o.open,
        disableOutsidePointerEvents: o.open,
        onCloseAutoFocus: T(t.onCloseAutoFocus, (i) => {
          i.preventDefault(), o.triggerRef.current?.focus();
        }),
        onPointerDownOutside: T(t.onPointerDownOutside, (i) => {
          const s = i.detail.originalEvent, l = s.button === 0 && s.ctrlKey === !0;
          (s.button === 2 || l) && i.preventDefault();
        }),
        onFocusOutside: T(
          t.onFocusOutside,
          (i) => i.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), Su = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Pe(function(t, n) {
    const o = Ne(It, t.__scopeDialog), r = c.useRef(!1), a = c.useRef(!1);
    return /* @__PURE__ */ m(
      si,
      {
        ...t,
        ref: n,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          t.onCloseAutoFocus?.(i), i.defaultPrevented || (r.current || o.triggerRef.current?.focus(), i.preventDefault()), r.current = !1, a.current = !1;
        },
        onInteractOutside: (i) => {
          t.onInteractOutside?.(i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (a.current = !0));
          const s = i.target;
          o.triggerRef.current?.contains(s) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && a.current && i.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), si = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Pe(function(t, n) {
    const { __scopeDialog: o, trapFocus: r, onOpenAutoFocus: a, onCloseAutoFocus: i, ...s } = t, l = Ne(It, o);
    return Rt(), /* @__PURE__ */ m(st, { children: /* @__PURE__ */ m(
      gn,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: a,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ m(
          Ft,
          {
            role: "dialog",
            id: l.contentId,
            "aria-describedby": l.descriptionPresent ? l.descriptionId : void 0,
            "aria-labelledby": l.titlePresent ? l.titleId : void 0,
            "data-state": Mo(l.open),
            ...s,
            ref: n,
            deferPointerDownOutside: !0,
            onDismiss: () => l.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), Ru = "DialogTitle", Pu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Pe(function(t, n) {
    const { __scopeDialog: o, ...r } = t, a = Ne(Ru, o), { setTitleCount: i } = a;
    return ne(() => (i((s) => s + 1), () => i((s) => s - 1)), [i]), /* @__PURE__ */ m(W.h2, { id: a.titleId, ...r, ref: n });
  }, "DialogTitle")
), Eu = "DialogDescription", _u = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Pe(function(t, n) {
    const { __scopeDialog: o, ...r } = t, a = Ne(Eu, o), { setDescriptionCount: i } = a;
    return ne(() => (i((s) => s + 1), () => i((s) => s - 1)), [i]), /* @__PURE__ */ m(W.p, { id: a.descriptionId, ...r, ref: n });
  }, "DialogDescription")
), ku = "DialogClose", Iu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Pe(function(t, n) {
    const { __scopeDialog: o, ...r } = t, a = Ne(ku, o);
    return /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        ...r,
        ref: n,
        onClick: T(t.onClick, () => a.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function Mo(e) {
  return e ? "open" : "closed";
}
Pe(Mo, "getState");
var Tu = Object.defineProperty, Ou = (e, t) => Tu(e, "name", { value: t, configurable: !0 });
function Bt(e) {
  const [t, n] = c.useState(void 0);
  return ne(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const o = new ResizeObserver((r) => {
        if (!Array.isArray(r) || !r.length)
          return;
        const a = r[0];
        let i, s;
        if ("borderBoxSize" in a) {
          const l = a.borderBoxSize, u = Array.isArray(l) ? l[0] : l;
          i = u.inlineSize, s = u.blockSize;
        } else
          i = e.offsetWidth, s = e.offsetHeight;
        n({ width: i, height: s });
      });
      return o.observe(e, { box: "border-box" }), () => o.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
Ou(Bt, "useSize");
var Au = Object.defineProperty, He = (e, t) => Au(e, "name", { value: t, configurable: !0 }), Do = "Checkbox", [Mu, Fh] = /* @__PURE__ */ ge(Do), [Du, No] = Mu(Do);
function ci(e) {
  const {
    __scopeCheckbox: t,
    checked: n,
    children: o,
    defaultChecked: r,
    disabled: a,
    form: i,
    name: s,
    onCheckedChange: l,
    required: u,
    value: f = "on",
    // @ts-expect-error
    internal_do_not_use_render: d
  } = e, [p, v] = Ie({
    prop: n,
    defaultProp: r ?? !1,
    onChange: l,
    caller: Do
  }), [b, h] = c.useState(null), [g, y] = c.useState(null), C = c.useRef(!1), [w, x] = c.useReducer(
    (E) => E + 1,
    0
  ), S = b ? !!i || !!b.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), R = {
    checked: p,
    disabled: a,
    setChecked: v,
    control: b,
    setControl: h,
    name: s,
    form: i,
    value: f,
    hasConsumerStoppedPropagationRef: C,
    userInteractionCount: w,
    onUserInteraction: x,
    required: u,
    defaultChecked: ze(r) ? !1 : r,
    isFormControl: S,
    bubbleInput: g,
    setBubbleInput: y
  };
  return /* @__PURE__ */ m(
    Du,
    {
      scope: t,
      ...R,
      children: li(d) ? d(R) : o
    }
  );
}
He(ci, "CheckboxProvider");
var Nu = "CheckboxTrigger", Lu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ He(function({ __scopeCheckbox: t, onKeyDown: n, onClick: o, ...r }, a) {
    const {
      control: i,
      value: s,
      disabled: l,
      checked: u,
      required: f,
      setControl: d,
      setChecked: p,
      hasConsumerStoppedPropagationRef: v,
      onUserInteraction: b,
      isFormControl: h,
      bubbleInput: g
    } = No(Nu, t), y = j(a, d), C = c.useRef(u);
    return c.useEffect(() => {
      const w = i?.form;
      if (w) {
        const x = /* @__PURE__ */ He(() => p(C.current), "reset");
        return w.addEventListener("reset", x), () => w.removeEventListener("reset", x);
      }
    }, [i, p]), /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": ze(u) ? "mixed" : u,
        "aria-required": f,
        "data-state": Lo(u),
        "data-disabled": l ? "" : void 0,
        disabled: l,
        value: s,
        ...r,
        ref: y,
        onKeyDown: T(n, (w) => {
          w.key === "Enter" && w.preventDefault();
        }),
        onClick: T(o, (w) => {
          b(), p((x) => ze(x) ? !0 : !x), g && h && (v.current = w.isPropagationStopped(), v.current || w.stopPropagation());
        })
      }
    );
  }, "CheckboxTrigger")
), Fu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ He(function(t, n) {
    const {
      __scopeCheckbox: o,
      name: r,
      checked: a,
      defaultChecked: i,
      required: s,
      disabled: l,
      value: u,
      onCheckedChange: f,
      form: d,
      ...p
    } = t;
    return /* @__PURE__ */ m(
      ci,
      {
        __scopeCheckbox: o,
        checked: a,
        defaultChecked: i,
        disabled: l,
        required: s,
        onCheckedChange: f,
        name: r,
        form: d,
        value: u,
        internal_do_not_use_render: ({ isFormControl: v }) => /* @__PURE__ */ de(st, { children: [
          /* @__PURE__ */ m(
            Lu,
            {
              ...p,
              ref: n,
              __scopeCheckbox: o
            }
          ),
          v && /* @__PURE__ */ m(
            Vu,
            {
              __scopeCheckbox: o
            }
          )
        ] })
      }
    );
  }, "Checkbox")
), $u = "CheckboxIndicator", zu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ He(function(t, n) {
    const { __scopeCheckbox: o, forceMount: r, ...a } = t, i = No($u, o);
    return /* @__PURE__ */ m(
      Re,
      {
        present: r || ze(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ m(
          W.span,
          {
            "data-state": Lo(i.checked),
            "data-disabled": i.disabled ? "" : void 0,
            ...a,
            ref: n,
            style: { pointerEvents: "none", ...t.style }
          }
        )
      }
    );
  }, "CheckboxIndicator")
), Bu = "CheckboxBubbleInput", Vu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ He(function({ __scopeCheckbox: t, onClick: n, ...o }, r) {
    const {
      control: a,
      hasConsumerStoppedPropagationRef: i,
      userInteractionCount: s,
      checked: l,
      defaultChecked: u,
      required: f,
      disabled: d,
      name: p,
      value: v,
      form: b,
      bubbleInput: h,
      setBubbleInput: g
    } = No(Bu, t), y = j(r, g), C = Bt(a), w = c.useRef(!1), x = c.useRef(l), S = c.useRef(s);
    c.useEffect(() => {
      const E = h;
      if (!E) return;
      const P = window.HTMLInputElement.prototype, D = Object.getOwnPropertyDescriptor(
        P,
        "checked"
      ).set, F = s !== S.current;
      S.current = s;
      const O = x.current !== l;
      x.current = l;
      const L = !(F && i.current);
      if (O && D) {
        w.current = !F;
        const z = new Event("click", { bubbles: L });
        E.indeterminate = ze(l), D.call(E, ze(l) ? !1 : l), E.dispatchEvent(z), w.current = !1;
      }
    }, [h, l, i, s]);
    const R = c.useRef(ze(l) ? !1 : l);
    return /* @__PURE__ */ m(
      W.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: u ?? R.current,
        required: f,
        disabled: d,
        name: p,
        value: v,
        form: b,
        ...o,
        tabIndex: -1,
        ref: y,
        onClick: T(n, (E) => {
          w.current && E.stopPropagation();
        }),
        style: {
          ...o.style,
          ...C,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }, "CheckboxBubbleInput")
);
function li(e) {
  return typeof e == "function";
}
He(li, "isFunction");
function ze(e) {
  return e === "indeterminate";
}
He(ze, "isIndeterminate");
function Lo(e) {
  return ze(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
He(Lo, "getState");
const ju = ["top", "right", "bottom", "left"], Xe = Math.min, Be = Math.max, ln = Math.round, tn = Math.floor, Ve = (e) => ({
  x: e,
  y: e
}), Gu = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function ui(e, t, n) {
  return Be(e, Xe(t, n));
}
function Ue(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function qe(e) {
  return e.split("-")[0];
}
function Pt(e) {
  return e.split("-")[1];
}
function Fo(e) {
  return e === "x" ? "y" : "x";
}
function $o(e) {
  return e === "y" ? "height" : "width";
}
function Ae(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function zo(e) {
  return Fo(Ae(e));
}
function Hu(e, t, n) {
  n === void 0 && (n = !1);
  const o = Pt(e), r = zo(e), a = $o(r);
  let i = r === "x" ? o === (n ? "end" : "start") ? "right" : "left" : o === "start" ? "bottom" : "top";
  return t.reference[a] > t.floating[a] && (i = un(i)), [i, un(i)];
}
function Uu(e) {
  const t = un(e);
  return [go(e), t, go(t)];
}
function go(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Mr = ["left", "right"], Dr = ["right", "left"], Wu = ["top", "bottom"], Ku = ["bottom", "top"];
function Yu(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Dr : Mr : t ? Mr : Dr;
    case "left":
    case "right":
      return t ? Wu : Ku;
    default:
      return [];
  }
}
function Xu(e, t, n, o) {
  const r = Pt(e);
  let a = Yu(qe(e), n === "start", o);
  return r && (a = a.map((i) => i + "-" + r), t && (a = a.concat(a.map(go)))), a;
}
function un(e) {
  const t = qe(e);
  return Gu[t] + e.slice(t.length);
}
function qu(e) {
  var t, n, o, r;
  return {
    top: (t = e.top) != null ? t : 0,
    right: (n = e.right) != null ? n : 0,
    bottom: (o = e.bottom) != null ? o : 0,
    left: (r = e.left) != null ? r : 0
  };
}
function di(e) {
  return typeof e != "number" ? qu(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function dn(e) {
  const {
    x: t,
    y: n,
    width: o,
    height: r
  } = e;
  return {
    width: o,
    height: r,
    top: n,
    left: t,
    right: t + o,
    bottom: n + r,
    x: t,
    y: n
  };
}
function Nr(e, t, n) {
  let {
    reference: o,
    floating: r
  } = e;
  const a = Ae(t), i = zo(t), s = $o(i), l = qe(t), u = a === "y", f = o.x + o.width / 2 - r.width / 2, d = o.y + o.height / 2 - r.height / 2, p = o[s] / 2 - r[s] / 2;
  let v;
  switch (l) {
    case "top":
      v = {
        x: f,
        y: o.y - r.height
      };
      break;
    case "bottom":
      v = {
        x: f,
        y: o.y + o.height
      };
      break;
    case "right":
      v = {
        x: o.x + o.width,
        y: d
      };
      break;
    case "left":
      v = {
        x: o.x - r.width,
        y: d
      };
      break;
    default:
      v = {
        x: o.x,
        y: o.y
      };
  }
  const b = Pt(t);
  return b && (v[i] += p * (b === "end" ? 1 : -1) * (n && u ? -1 : 1)), v;
}
async function Zu(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: o,
    y: r,
    platform: a,
    rects: i,
    elements: s,
    strategy: l
  } = e, {
    boundary: u = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: d = "floating",
    altBoundary: p = !1,
    padding: v = 0
  } = Ue(t, e), b = di(v), g = s[p ? d === "floating" ? "reference" : "floating" : d], y = dn(await a.getClippingRect({
    element: (n = await (a.isElement == null ? void 0 : a.isElement(g))) == null || n ? g : g.contextElement || await (a.getDocumentElement == null ? void 0 : a.getDocumentElement(s.floating)),
    boundary: u,
    rootBoundary: f,
    strategy: l
  })), C = d === "floating" ? {
    x: o,
    y: r,
    width: i.floating.width,
    height: i.floating.height
  } : i.reference, w = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(s.floating)), x = await (a.isElement == null ? void 0 : a.isElement(w)) && await (a.getScale == null ? void 0 : a.getScale(w)) || {
    x: 1,
    y: 1
  }, S = dn(a.convertOffsetParentRelativeRectToViewportRelativeRect ? await a.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: C,
    offsetParent: w,
    strategy: l
  }) : C);
  return {
    top: (y.top - S.top + b.top) / x.y,
    bottom: (S.bottom - y.bottom + b.bottom) / x.y,
    left: (y.left - S.left + b.left) / x.x,
    right: (S.right - y.right + b.right) / x.x
  };
}
const Qu = 50, Ju = async (e, t, n) => {
  const {
    placement: o = "bottom",
    strategy: r = "absolute",
    middleware: a = [],
    platform: i
  } = n, s = i.detectOverflow ? i : {
    ...i,
    detectOverflow: Zu
  }, l = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let u = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: f,
    y: d
  } = Nr(u, o, l), p = o, v = 0;
  const b = {};
  for (let h = 0; h < a.length; h++) {
    const g = a[h];
    if (!g)
      continue;
    const {
      name: y,
      fn: C
    } = g, {
      x: w,
      y: x,
      data: S,
      reset: R
    } = await C({
      x: f,
      y: d,
      initialPlacement: o,
      placement: p,
      strategy: r,
      middlewareData: b,
      rects: u,
      platform: s,
      elements: {
        reference: e,
        floating: t
      }
    });
    f = w ?? f, d = x ?? d, b[y] = {
      ...b[y],
      ...S
    }, R && v < Qu && (v++, typeof R == "object" && (R.placement && (p = R.placement), R.rects && (u = R.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : R.rects), {
      x: f,
      y: d
    } = Nr(u, p, l)), h = -1);
  }
  return {
    x: f,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: b
  };
}, ed = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: o,
      placement: r,
      rects: a,
      platform: i,
      elements: s,
      middlewareData: l
    } = t, {
      element: u,
      padding: f = 0
    } = Ue(e, t) || {};
    if (u == null)
      return {};
    const d = di(f), p = {
      x: n,
      y: o
    }, v = zo(r), b = $o(v), h = await i.getDimensions(u), g = v === "y", y = g ? "top" : "left", C = g ? "bottom" : "right", w = g ? "clientHeight" : "clientWidth", x = a.reference[b] + a.reference[v] - p[v] - a.floating[b], S = p[v] - a.reference[v], R = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(u));
    let E = R ? R[w] : 0;
    (!E || !await (i.isElement == null ? void 0 : i.isElement(R))) && (E = s.floating[w] || a.floating[b]);
    const P = x / 2 - S / 2, k = E / 2 - h[b] / 2 - 1, D = Xe(d[y], k), F = Xe(d[C], k), O = E - h[b] - F, L = E / 2 - h[b] / 2 + P, z = ui(D, L, O), G = !l.arrow && Pt(r) != null && L !== z && a.reference[b] / 2 - (L < D ? D : F) - h[b] / 2 < 0, B = G ? L < D ? L - D : L - O : 0;
    return {
      [v]: p[v] + B,
      data: {
        [v]: z,
        centerOffset: L - z - B,
        ...G && {
          alignmentOffset: B
        }
      },
      reset: G
    };
  }
}), td = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        middlewareData: a,
        rects: i,
        initialPlacement: s,
        platform: l,
        elements: u
      } = t, {
        mainAxis: f = !0,
        crossAxis: d = !0,
        fallbackPlacements: p,
        fallbackStrategy: v = "bestFit",
        fallbackAxisSideDirection: b = "none",
        flipAlignment: h = !0,
        ...g
      } = Ue(e, t);
      if ((n = a.arrow) != null && n.alignmentOffset)
        return {};
      const y = qe(r), C = Ae(s), w = qe(s) === s, x = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), S = p || (w || !h ? [un(s)] : Uu(s)), R = b !== "none";
      !p && R && S.push(...Xu(s, h, b, x));
      const E = [s, ...S], P = await l.detectOverflow(t, g), k = [];
      let D = ((o = a.flip) == null ? void 0 : o.overflows) || [];
      if (f && k.push(P[y]), d) {
        const z = Hu(r, i, x);
        k.push(P[z[0]], P[z[1]]);
      }
      if (D = [...D, {
        placement: r,
        overflows: k
      }], !k.every((z) => z <= 0)) {
        var F, O;
        const z = (((F = a.flip) == null ? void 0 : F.index) || 0) + 1, G = E[z];
        if (G && (!(d === "alignment" ? C !== Ae(G) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        D.every((_) => Ae(_.placement) === C ? _.overflows[0] > 0 : !0)))
          return {
            data: {
              index: z,
              overflows: D
            },
            reset: {
              placement: G
            }
          };
        let B = (O = D.filter(($) => $.overflows[0] <= 0).sort(($, _) => $.overflows[1] - _.overflows[1])[0]) == null ? void 0 : O.placement;
        if (!B)
          switch (v) {
            case "bestFit": {
              var L;
              const $ = (L = D.filter((_) => {
                if (R) {
                  const H = Ae(_.placement);
                  return H === C || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  H === "y";
                }
                return !0;
              }).map((_) => [_.placement, _.overflows.filter((H) => H > 0).reduce((H, I) => H + I, 0)]).sort((_, H) => _[1] - H[1])[0]) == null ? void 0 : L[0];
              $ && (B = $);
              break;
            }
            case "initialPlacement":
              B = s;
              break;
          }
        if (r !== B)
          return {
            reset: {
              placement: B
            }
          };
      }
      return {};
    }
  };
};
function Lr(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Fr(e) {
  return ju.some((t) => e[t] >= 0);
}
const nd = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n,
        platform: o
      } = t, {
        strategy: r = "referenceHidden",
        ...a
      } = Ue(e, t);
      switch (r) {
        case "referenceHidden": {
          const i = await o.detectOverflow(t, {
            ...a,
            elementContext: "reference"
          }), s = Lr(i, n.reference);
          return {
            data: {
              referenceHiddenOffsets: s,
              referenceHidden: Fr(s)
            }
          };
        }
        case "escaped": {
          const i = await o.detectOverflow(t, {
            ...a,
            altBoundary: !0
          }), s = Lr(i, n.floating);
          return {
            data: {
              escapedOffsets: s,
              escaped: Fr(s)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, fi = /* @__PURE__ */ new Set(["left", "top"]);
async function od(e, t) {
  const {
    placement: n,
    platform: o,
    elements: r
  } = e, a = await (o.isRTL == null ? void 0 : o.isRTL(r.floating)), i = qe(n), s = Pt(n), l = Ae(n) === "y", u = fi.has(i) ? -1 : 1, f = a && l ? -1 : 1, d = Ue(t, e);
  let {
    mainAxis: p,
    crossAxis: v,
    alignmentAxis: b
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return s && typeof b == "number" && (v = s === "end" ? b * -1 : b), l ? {
    x: v * f,
    y: p * u
  } : {
    x: p * u,
    y: v * f
  };
}
const rd = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, o;
      const {
        x: r,
        y: a,
        placement: i,
        middlewareData: s
      } = t, l = await od(t, e);
      return i === ((n = s.offset) == null ? void 0 : n.placement) && (o = s.arrow) != null && o.alignmentOffset ? {} : {
        x: r + l.x,
        y: a + l.y,
        data: {
          ...l,
          placement: i
        }
      };
    }
  };
}, ad = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: o,
        placement: r,
        platform: a
      } = t, {
        mainAxis: i = !0,
        crossAxis: s = !1,
        limiter: l = {
          fn: (C) => {
            let {
              x: w,
              y: x
            } = C;
            return {
              x: w,
              y: x
            };
          }
        },
        ...u
      } = Ue(e, t), f = {
        x: n,
        y: o
      }, d = await a.detectOverflow(t, u), p = Ae(r), v = Fo(p);
      let b = f[v], h = f[p];
      const g = (C, w) => ui(w + d[C === "y" ? "top" : "left"], w, w - d[C === "y" ? "bottom" : "right"]);
      i && (b = g(v, b)), s && (h = g(p, h));
      const y = l.fn({
        ...t,
        [v]: b,
        [p]: h
      });
      return {
        ...y,
        data: {
          x: y.x - n,
          y: y.y - o,
          enabled: {
            [v]: i,
            [p]: s
          }
        }
      };
    }
  };
}, id = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      var n, o;
      const {
        x: r,
        y: a,
        placement: i,
        rects: s,
        middlewareData: l
      } = t, {
        offset: u = 0,
        mainAxis: f = !0,
        crossAxis: d = !0
      } = Ue(e, t), p = {
        x: r,
        y: a
      }, v = Ae(i), b = Fo(v);
      let h = p[b], g = p[v];
      const y = Ue(u, t), C = typeof y == "number" ? {
        mainAxis: y,
        crossAxis: 0
      } : {
        mainAxis: (n = y.mainAxis) != null ? n : 0,
        crossAxis: (o = y.crossAxis) != null ? o : 0
      };
      if (f) {
        const S = b === "y" ? "height" : "width", R = s.reference[b] - s.floating[S] + C.mainAxis, E = s.reference[b] + s.reference[S] - C.mainAxis;
        h < R ? h = R : h > E && (h = E);
      }
      if (d) {
        var w, x;
        const S = b === "y" ? "width" : "height", R = fi.has(qe(i)), E = s.reference[v] - s.floating[S] + (R && ((w = l.offset) == null ? void 0 : w[v]) || 0) + (R ? 0 : C.crossAxis), P = s.reference[v] + s.reference[S] + (R ? 0 : ((x = l.offset) == null ? void 0 : x[v]) || 0) - (R ? C.crossAxis : 0);
        g < E ? g = E : g > P && (g = P);
      }
      return {
        [b]: h,
        [v]: g
      };
    }
  };
}, sd = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      const {
        placement: n,
        rects: o,
        platform: r,
        elements: a
      } = t, {
        apply: i = () => {
        },
        ...s
      } = Ue(e, t), l = await r.detectOverflow(t, s), u = qe(n), f = Pt(n), d = Ae(n) === "y", {
        width: p,
        height: v
      } = o.floating;
      let b, h;
      u === "top" || u === "bottom" ? (b = u, h = f === (await (r.isRTL == null ? void 0 : r.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = u, b = f === "end" ? "top" : "bottom");
      const g = v - l.top - l.bottom, y = p - l.left - l.right, C = Xe(v - l[b], g), w = Xe(p - l[h], y), x = t.middlewareData.shift, S = !x;
      let R = C, E = w;
      x != null && x.enabled.x && (E = y), x != null && x.enabled.y && (R = g), S && !f && (d ? E = p - 2 * Be(l.left, l.right) : R = v - 2 * Be(l.top, l.bottom)), await i({
        ...t,
        availableWidth: E,
        availableHeight: R
      });
      const P = await r.getDimensions(a.floating);
      return p !== P.width || v !== P.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function wn() {
  return typeof window < "u";
}
function Et(e) {
  return pi(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function ve(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function We(e) {
  var t;
  return (t = (pi(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function pi(e) {
  return wn() ? e instanceof Node || e instanceof ve(e).Node : !1;
}
function Me(e) {
  return wn() ? e instanceof Element || e instanceof ve(e).Element : !1;
}
function Qe(e) {
  return wn() ? e instanceof HTMLElement || e instanceof ve(e).HTMLElement : !1;
}
function $r(e) {
  return !wn() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof ve(e).ShadowRoot;
}
function xn(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: o,
    display: r
  } = De(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && r !== "inline" && r !== "contents";
}
function cd(e) {
  return /^(table|td|th)$/.test(Et(e));
}
function yn(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const ld = /transform|translate|scale|rotate|perspective|filter/, ud = /paint|layout|strict|content/, ot = (e) => !!e && e !== "none";
let qn;
function Bo(e) {
  const t = Me(e) ? De(e) : e;
  return ot(t.transform) || ot(t.translate) || ot(t.scale) || ot(t.rotate) || ot(t.perspective) || !Vo() && (ot(t.backdropFilter) || ot(t.filter)) || ld.test(t.willChange || "") || ud.test(t.contain || "");
}
function dd(e) {
  let t = rt(e);
  for (; Qe(t) && !Tt(t); ) {
    if (Bo(t))
      return t;
    if (yn(t))
      return null;
    t = rt(t);
  }
  return null;
}
function Vo() {
  return qn == null && (qn = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), qn;
}
function Tt(e) {
  return /^(html|body|#document)$/.test(Et(e));
}
function De(e) {
  return ve(e).getComputedStyle(e);
}
function Cn(e) {
  return Me(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function rt(e) {
  if (Et(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    $r(e) && e.host || // Fallback.
    We(e)
  );
  return $r(t) ? t.host : t;
}
function mi(e) {
  const t = rt(e);
  return Tt(t) ? (e.ownerDocument || e).body : Qe(t) && xn(t) ? t : mi(t);
}
function Ot(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const r = mi(e), a = r === ((o = e.ownerDocument) == null ? void 0 : o.body), i = ve(r);
  if (a) {
    const s = vo(i);
    return t.concat(i, i.visualViewport || [], xn(r) ? r : [], s && n ? Ot(s) : []);
  } else
    return t.concat(r, Ot(r, [], n));
}
function vo(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function hi(e) {
  const t = De(e);
  let n = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0;
  const r = Qe(e), a = r ? e.offsetWidth : n, i = r ? e.offsetHeight : o, s = ln(n) !== a || ln(o) !== i;
  return s && (n = a, o = i), {
    width: n,
    height: o,
    $: s
  };
}
function jo(e) {
  return Me(e) ? e : e.contextElement;
}
function wt(e) {
  const t = jo(e);
  if (!Qe(t))
    return Ve(1);
  const n = t.getBoundingClientRect(), {
    width: o,
    height: r,
    $: a
  } = hi(t);
  let i = (a ? ln(n.width) : n.width) / o, s = (a ? ln(n.height) : n.height) / r;
  return (!i || !Number.isFinite(i)) && (i = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: i,
    y: s
  };
}
const fd = /* @__PURE__ */ Ve(0);
function gi(e) {
  const t = ve(e);
  return !Vo() || !t.visualViewport ? fd : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function pd(e, t, n) {
  return t === void 0 && (t = !1), !!n && t && n === ve(e);
}
function at(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), a = jo(e);
  let i = Ve(1);
  t && (o ? Me(o) && (i = wt(o)) : i = wt(e));
  const s = pd(a, n, o) ? gi(a) : Ve(0);
  let l = (r.left + s.x) / i.x, u = (r.top + s.y) / i.y, f = r.width / i.x, d = r.height / i.y;
  if (a && o) {
    const p = ve(a), v = Me(o) ? ve(o) : o;
    let b = p, h = vo(b);
    for (; h && v !== b; ) {
      const g = wt(h), y = h.getBoundingClientRect(), C = De(h), w = y.left + (h.clientLeft + parseFloat(C.paddingLeft)) * g.x, x = y.top + (h.clientTop + parseFloat(C.paddingTop)) * g.y;
      l *= g.x, u *= g.y, f *= g.x, d *= g.y, l += w, u += x, b = ve(h), h = vo(b);
    }
  }
  return dn({
    width: f,
    height: d,
    x: l,
    y: u
  });
}
function Sn(e, t) {
  const n = Cn(e).scrollLeft;
  return t ? t.left + n : at(We(e)).left + n;
}
function vi(e, t) {
  const n = e.getBoundingClientRect(), o = n.left + t.scrollLeft - Sn(e, n), r = n.top + t.scrollTop;
  return {
    x: o,
    y: r
  };
}
function md(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: o,
    strategy: r
  } = e;
  const a = r === "fixed", i = We(o), s = t ? yn(t.floating) : !1;
  if (o === i || s && a)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = Ve(1);
  const f = Ve(0), d = Qe(o);
  if ((d || !a) && ((Et(o) !== "body" || xn(i)) && (l = Cn(o)), d)) {
    const v = at(o);
    u = wt(o), f.x = v.x + o.clientLeft, f.y = v.y + o.clientTop;
  }
  const p = i && !d && !a ? vi(i, l) : Ve(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - l.scrollLeft * u.x + f.x + p.x,
    y: n.y * u.y - l.scrollTop * u.y + f.y + p.y
  };
}
function hd(e) {
  return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function gd(e) {
  const t = Cn(e), n = e.ownerDocument.body, o = Be(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), r = Be(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -t.scrollLeft + Sn(e);
  const i = -t.scrollTop;
  return De(n).direction === "rtl" && (a += Be(e.clientWidth, n.clientWidth) - o), {
    width: o,
    height: r,
    x: a,
    y: i
  };
}
const vd = 25;
function bd(e, t, n) {
  n === void 0 && (n = "viewport");
  const o = n === "layoutViewport", r = ve(e), a = We(e), i = r.visualViewport;
  let s = a.clientWidth, l = a.clientHeight, u = 0, f = 0;
  if (i) {
    const p = !Vo() || t === "fixed";
    o ? p || (u = -i.offsetLeft, f = -i.offsetTop) : (s = i.width, l = i.height, p && (u = i.offsetLeft, f = i.offsetTop));
  }
  if (Sn(a) <= 0) {
    const p = a.ownerDocument, v = p.body, b = getComputedStyle(v), h = p.compatMode === "CSS1Compat" && parseFloat(b.marginLeft) + parseFloat(b.marginRight) || 0, g = Math.abs(a.clientWidth - v.clientWidth - h), y = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? g / 2 : g;
    y <= vd && (s -= y);
  }
  return {
    width: s,
    height: l,
    x: u,
    y: f
  };
}
function wd(e, t) {
  const n = at(e, !0, t === "fixed"), o = n.top + e.clientTop, r = n.left + e.clientLeft, a = wt(e), i = e.clientWidth * a.x, s = e.clientHeight * a.y, l = r * a.x, u = o * a.y;
  return {
    width: i,
    height: s,
    x: l,
    y: u
  };
}
function zr(e, t, n) {
  let o;
  if (t === "viewport" || t === "layoutViewport")
    o = bd(e, n, t);
  else if (t === "document")
    o = gd(We(e));
  else if (Me(t))
    o = wd(t, n);
  else {
    const r = gi(e);
    o = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return dn(o);
}
function xd(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let o = Ot(e, [], !1).filter((s) => Me(s) && Et(s) !== "body"), r = null;
  const a = De(e).position === "fixed";
  let i = a ? rt(e) : e;
  for (; Me(i) && !Tt(i); ) {
    const s = De(i), l = Bo(i), u = r ? r.position : a ? "fixed" : "";
    !l && (u === "fixed" || u === "absolute" && s.position === "static") ? o = o.filter((d) => d !== i) : r = s, i = rt(i);
  }
  return t.set(e, o), o;
}
function yd(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: o,
    strategy: r
  } = e;
  const i = [...n === "clippingAncestors" ? yn(t) ? [] : xd(t, this._c) : [].concat(n), o], s = zr(t, i[0], r);
  let l = s.top, u = s.right, f = s.bottom, d = s.left;
  for (let p = 1; p < i.length; p++) {
    const v = zr(t, i[p], r);
    l = Be(v.top, l), u = Xe(v.right, u), f = Xe(v.bottom, f), d = Be(v.left, d);
  }
  return {
    width: u - d,
    height: f - l,
    x: d,
    y: l
  };
}
function Cd(e) {
  const {
    width: t,
    height: n
  } = hi(e);
  return {
    width: t,
    height: n
  };
}
function Sd(e, t, n) {
  const o = Qe(t), r = We(t), a = n === "fixed", i = at(e, !0, a, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ve(0);
  if ((o || !a) && ((Et(t) !== "body" || xn(r)) && (s = Cn(t)), o)) {
    const p = at(t, !0, a, t);
    l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
  }
  !o && r && (l.x = Sn(r));
  const u = r && !o && !a ? vi(r, s) : Ve(0), f = i.left + s.scrollLeft - l.x - u.x, d = i.top + s.scrollTop - l.y - u.y;
  return {
    x: f,
    y: d,
    width: i.width,
    height: i.height
  };
}
function Zn(e) {
  return De(e).position === "static";
}
function Br(e, t) {
  if (!Qe(e) || De(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return We(e) === n && (n = n.ownerDocument.body), n;
}
function bi(e, t) {
  const n = ve(e);
  if (yn(e))
    return n;
  if (!Qe(e)) {
    let r = rt(e);
    for (; r && !Tt(r); ) {
      if (Me(r) && !Zn(r))
        return r;
      r = rt(r);
    }
    return n;
  }
  let o = Br(e, t);
  for (; o && cd(o) && Zn(o); )
    o = Br(o, t);
  return o && Tt(o) && Zn(o) && !Bo(o) ? n : o || dd(e) || n;
}
const Rd = async function(e) {
  const t = this.getOffsetParent || bi, n = this.getDimensions, o = await n(e.floating);
  return {
    reference: Sd(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: o.width,
      height: o.height
    }
  };
};
function Pd(e) {
  return De(e).direction === "rtl";
}
const Ed = {
  convertOffsetParentRelativeRectToViewportRelativeRect: md,
  getDocumentElement: We,
  getClippingRect: yd,
  getOffsetParent: bi,
  getElementRects: Rd,
  getClientRects: hd,
  getDimensions: Cd,
  getScale: wt,
  isElement: Me,
  isRTL: Pd
};
function wi(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function _d(e, t, n) {
  let o = null, r;
  const a = We(e);
  function i() {
    var f;
    clearTimeout(r), (f = o) == null || f.disconnect(), o = null;
  }
  function s(f, d) {
    f === void 0 && (f = !1), d === void 0 && (d = 1), i();
    const p = e.getBoundingClientRect(), {
      left: v,
      top: b,
      width: h,
      height: g
    } = p;
    if (f || t(), !h || !g)
      return;
    const y = tn(b), C = tn(a.clientWidth - (v + h)), w = tn(a.clientHeight - (b + g)), x = tn(v), R = {
      rootMargin: -y + "px " + -C + "px " + -w + "px " + -x + "px",
      threshold: Be(0, Xe(1, d)) || 1
    };
    let E = !0;
    function P(k) {
      const D = k[0].intersectionRatio;
      if (!wi(p, e.getBoundingClientRect()))
        return s();
      if (D !== d) {
        if (!E)
          return s();
        D ? s(!1, D) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      E = !1;
    }
    try {
      o = new IntersectionObserver(P, {
        ...R,
        // Handle <iframe>s
        root: a.ownerDocument
      });
    } catch {
      o = new IntersectionObserver(P, R);
    }
    o.observe(e);
  }
  const l = ve(e), u = () => s(n);
  return l.addEventListener("resize", u), s(!0), () => {
    l.removeEventListener("resize", u), i();
  };
}
function kd(e, t, n, o) {
  o === void 0 && (o = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: a = !0,
    elementResize: i = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = o, u = jo(e), f = r || a ? [...u ? Ot(u) : [], ...t ? Ot(t) : []] : [];
  f.forEach((y) => {
    r && y.addEventListener("scroll", n), a && y.addEventListener("resize", n);
  });
  const d = u && s ? _d(u, n, a) : null;
  let p = -1, v = null;
  i && (v = new ResizeObserver((y) => {
    let [C] = y;
    C && C.target === u && v && t && (v.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var w;
      (w = v) == null || w.observe(t);
    })), n();
  }), u && !l && v.observe(u), t && v.observe(t));
  let b, h = l ? at(e) : null;
  l && g();
  function g() {
    const y = at(e);
    h && !wi(h, y) && n(), h = y, b = requestAnimationFrame(g);
  }
  return n(), () => {
    var y;
    f.forEach((C) => {
      r && C.removeEventListener("scroll", n), a && C.removeEventListener("resize", n);
    }), d?.(), (y = v) == null || y.disconnect(), v = null, l && cancelAnimationFrame(b);
  };
}
const Id = rd, Td = ad, Od = td, Ad = sd, Md = nd, Vr = ed, Dd = id, Nd = (e, t, n) => {
  const o = /* @__PURE__ */ new Map(), r = n ?? {}, a = {
    ...Ed,
    ...r.platform,
    _c: o
  };
  return Ju(e, t, {
    ...r,
    platform: a
  });
};
var Ld = typeof document < "u", Fd = function() {
}, sn = Ld ? Rs : Fd;
function fn(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, o, r;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (o = n; o-- !== 0; )
        if (!fn(e[o], t[o]))
          return !1;
      return !0;
    }
    if (r = Object.keys(e), n = r.length, n !== Object.keys(t).length)
      return !1;
    for (o = n; o-- !== 0; )
      if (!{}.hasOwnProperty.call(t, r[o]))
        return !1;
    for (o = n; o-- !== 0; ) {
      const a = r[o];
      if (!(a === "_owner" && e.$$typeof) && !fn(e[a], t[a]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function xi(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function jr(e, t) {
  const n = xi(e);
  return Math.round(t * n) / n;
}
function Qn(e) {
  const t = c.useRef(e);
  return sn(() => {
    t.current = e;
  }), t;
}
function $d(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: o = [],
    platform: r,
    elements: {
      reference: a,
      floating: i
    } = {},
    transform: s = !0,
    whileElementsMounted: l,
    open: u
  } = e, [f, d] = c.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [p, v] = c.useState(o);
  fn(p, o) || v(o);
  const [b, h] = c.useState(null), [g, y] = c.useState(null), C = c.useCallback((_) => {
    _ !== R.current && (R.current = _, h(_));
  }, []), w = c.useCallback((_) => {
    _ !== E.current && (E.current = _, y(_));
  }, []), x = a || b, S = i || g, R = c.useRef(null), E = c.useRef(null), P = c.useRef(f), k = l != null, D = Qn(l), F = Qn(r), O = Qn(u), L = c.useCallback(() => {
    if (!R.current || !E.current)
      return;
    const _ = {
      placement: t,
      strategy: n,
      middleware: p
    };
    F.current && (_.platform = F.current), Nd(R.current, E.current, _).then((H) => {
      const I = {
        ...H,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: O.current !== !1
      };
      z.current && !fn(P.current, I) && (P.current = I, Dt.flushSync(() => {
        d(I);
      }));
    });
  }, [p, t, n, F, O]);
  sn(() => {
    u === !1 && P.current.isPositioned && (P.current.isPositioned = !1, d((_) => ({
      ..._,
      isPositioned: !1
    })));
  }, [u]);
  const z = c.useRef(!1);
  sn(() => (z.current = !0, () => {
    z.current = !1;
  }), []), sn(() => {
    if (x && (R.current = x), S && (E.current = S), x && S) {
      if (D.current)
        return D.current(x, S, L);
      L();
    }
  }, [x, S, L, D, k]);
  const G = c.useMemo(() => ({
    reference: R,
    floating: E,
    setReference: C,
    setFloating: w
  }), [C, w]), B = c.useMemo(() => ({
    reference: x,
    floating: S
  }), [x, S]), $ = c.useMemo(() => {
    const _ = {
      position: n,
      left: 0,
      top: 0
    };
    if (!B.floating)
      return _;
    const H = jr(B.floating, f.x), I = jr(B.floating, f.y);
    return s ? {
      ..._,
      transform: "translate(" + H + "px, " + I + "px)",
      ...xi(B.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: H,
      top: I
    };
  }, [n, s, B.floating, f.x, f.y]);
  return c.useMemo(() => ({
    ...f,
    update: L,
    refs: G,
    elements: B,
    floatingStyles: $
  }), [f, L, G, B, $]);
}
const zd = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: o,
        padding: r
      } = typeof e == "function" ? e(n) : e;
      return o && t(o) ? o.current != null ? Vr({
        element: o.current,
        padding: r
      }).fn(n) : {} : o ? Vr({
        element: o,
        padding: r
      }).fn(n) : {};
    }
  };
}, Bd = (e, t) => {
  const n = Id(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Vd = (e, t) => {
  const n = Td(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, jd = (e, t) => ({
  fn: Dd(e).fn,
  options: [e, t]
}), Gd = (e, t) => {
  const n = Od(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Hd = (e, t) => {
  const n = Ad(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Ud = (e, t) => {
  const n = Md(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Wd = (e, t) => {
  const n = zd(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var Kd = Object.defineProperty, Yd = (e, t) => Kd(e, "name", { value: t, configurable: !0 }), Xd = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Yd(function(t, n) {
    const { children: o, width: r = 10, height: a = 5, ...i } = t;
    return /* @__PURE__ */ m(
      W.svg,
      {
        ...i,
        ref: n,
        width: r,
        height: a,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: t.asChild ? o : /* @__PURE__ */ m("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  }, "Arrow")
), qd = Xd, Zd = Object.defineProperty, je = (e, t) => Zd(e, "name", { value: t, configurable: !0 }), yi = "Popper", [Ci, Je] = /* @__PURE__ */ ge(yi), [Qd, Si] = Ci(yi), Jd = /* @__PURE__ */ je((e) => {
  const { __scopePopper: t, children: n } = e, [o, r] = c.useState(null), [a, i] = c.useState(void 0);
  return /* @__PURE__ */ m(
    Qd,
    {
      scope: t,
      anchor: o,
      onAnchorChange: r,
      placementState: a,
      setPlacementState: i,
      children: n
    }
  );
}, "Popper"), ef = "PopperAnchor", tf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ je(function(t, n) {
    const { __scopePopper: o, virtualRef: r, ...a } = t, i = Si(ef, o), s = c.useRef(null), l = i.onAnchorChange, u = c.useCallback(
      (h) => {
        s.current = h, h && l(h);
      },
      [l]
    ), f = j(n, u), d = c.useRef(null);
    c.useEffect(() => {
      if (!r)
        return;
      const h = d.current;
      d.current = r.current, h !== d.current && l(d.current);
    });
    const p = i.placementState && Rn(i.placementState), v = p?.[0], b = p?.[1];
    return r ? null : /* @__PURE__ */ m(
      W.div,
      {
        "data-radix-popper-side": v,
        "data-radix-popper-align": b,
        ...a,
        ref: f
      }
    );
  }, "PopperAnchor")
), Ri = "PopperContent", [nf, of] = Ci(Ri), rf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ je(function(t, n) {
    const {
      __scopePopper: o,
      side: r = "bottom",
      sideOffset: a = 0,
      align: i = "center",
      alignOffset: s = 0,
      arrowPadding: l = 0,
      avoidCollisions: u = !0,
      collisionBoundary: f = [],
      collisionPadding: d = 0,
      sticky: p = "partial",
      hideWhenDetached: v = !1,
      updatePositionStrategy: b = "optimized",
      onPlaced: h,
      ...g
    } = t, y = Si(Ri, o), [C, w] = c.useState(null), x = j(n, w), [S, R] = c.useState(null), E = Bt(S), P = E?.width ?? 0, k = E?.height ?? 0, D = r + (i !== "center" ? "-" + i : ""), F = typeof d == "number" ? d : { top: 0, right: 0, bottom: 0, left: 0, ...d }, O = Array.isArray(f) ? f : [f], L = O.length > 0, z = {
      padding: F,
      boundary: O.filter(Pi),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: L
    }, { refs: G, floatingStyles: B, placement: $, isPositioned: _, middlewareData: H } = $d({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: D,
      whileElementsMounted: /* @__PURE__ */ je((...q) => kd(...q, {
        animationFrame: b === "always"
      }), "whileElementsMounted"),
      elements: {
        reference: y.anchor
      },
      middleware: [
        Bd({ mainAxis: a + k, alignmentAxis: s }),
        u && Vd({
          mainAxis: !0,
          crossAxis: !1,
          limiter: p === "partial" ? jd() : void 0,
          ...z
        }),
        u && Gd({ ...z }),
        Hd({
          ...z,
          apply: /* @__PURE__ */ je(({ elements: q, rects: oe, availableWidth: Q, availableHeight: J }) => {
            const { width: re, height: Le } = oe.reference, ye = q.floating.style;
            ye.setProperty("--radix-popper-available-width", `${Q}px`), ye.setProperty("--radix-popper-available-height", `${J}px`), ye.setProperty("--radix-popper-anchor-width", `${re}px`), ye.setProperty("--radix-popper-anchor-height", `${Le}px`);
          }, "apply")
        }),
        S && Wd({ element: S, padding: l }),
        lf({ arrowWidth: P, arrowHeight: k }),
        v && Ud({
          strategy: "referenceHidden",
          ...z,
          // `hide` detects whether the anchor (reference) is clipped, so when
          // no explicit `collisionBoundary` is set we fall back to Floating
          // UI's default clipping ancestors (e.g. a scrollable menu). This
          // lets an occluded submenu hide once its anchor scrolls out of view
          // (#3237). The collision/size middlewares deliberately keep the
          // viewport-based default to avoid clamping content rendered inside
          // transformed or overflow-clipping portal containers.
          boundary: L ? z.boundary : void 0
        })
      ]
    }), I = y.setPlacementState;
    ne(() => (I($), () => {
      I(void 0);
    }), [$, I]);
    const [ie, Z] = Rn($), K = Se(h);
    ne(() => {
      _ && K?.();
    }, [_, K]);
    const ee = H.arrow?.x, fe = H.arrow?.y, xe = H.arrow?.centerOffset !== 0, [X, N] = c.useState();
    return ne(() => {
      C && N(window.getComputedStyle(C).zIndex);
    }, [C]), /* @__PURE__ */ m(
      "div",
      {
        ref: G.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...B,
          transform: _ ? B.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: X,
          "--radix-popper-transform-origin": [
            H.transformOrigin?.x,
            H.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...H.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: t.dir,
        children: /* @__PURE__ */ m(
          nf,
          {
            scope: o,
            placedSide: ie,
            placedAlign: Z,
            onArrowChange: R,
            arrowX: ee,
            arrowY: fe,
            shouldHideArrow: xe,
            children: /* @__PURE__ */ m(
              W.div,
              {
                "data-side": ie,
                "data-align": Z,
                ...g,
                ref: x,
                style: {
                  ...g.style,
                  // if the PopperContent hasn't been placed yet (not all
                  // measurements done) we prevent animations so that users'
                  // animations don't kick in too early from the wrong sides.
                  animation: _ ? g.style?.animation : "none"
                }
              }
            )
          }
        )
      }
    );
  }, "PopperContent")
), af = "PopperArrow", sf = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, cf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ je(function(t, n) {
    const { __scopePopper: o, ...r } = t, a = of(af, o), i = sf[a.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ m(
        "span",
        {
          ref: a.onArrowChange,
          style: {
            position: "absolute",
            left: a.arrowX,
            top: a.arrowY,
            [i]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[a.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: "rotate(180deg)",
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[a.placedSide],
            visibility: a.shouldHideArrow ? "hidden" : void 0
          },
          children: /* @__PURE__ */ m(
            qd,
            {
              ...r,
              ref: n,
              style: {
                ...r.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  }, "PopperArrow")
);
function Pi(e) {
  return e !== null;
}
je(Pi, "isNotNull");
var lf = /* @__PURE__ */ je((e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    const { placement: n, rects: o, middlewareData: r } = t, i = r.arrow?.centerOffset !== 0, s = i ? 0 : e.arrowWidth, l = i ? 0 : e.arrowHeight, [u, f] = Rn(n), d = { start: "0%", center: "50%", end: "100%" }[f], p = (r.arrow?.x ?? 0) + s / 2, v = (r.arrow?.y ?? 0) + l / 2;
    let b = "", h = "";
    return u === "bottom" ? (b = i ? d : `${p}px`, h = `${-l}px`) : u === "top" ? (b = i ? d : `${p}px`, h = `${o.floating.height + l}px`) : u === "right" ? (b = `${-l}px`, h = i ? d : `${v}px`) : u === "left" && (b = `${o.floating.width + l}px`, h = i ? d : `${v}px`), { data: { x: b, y: h } };
  }
}), "transformOrigin");
function Rn(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
je(Rn, "getSideAndAlignFromPlacement");
var Pn = Jd, En = tf, _n = rf, uf = cf, df = Object.defineProperty, Go = (e, t) => df(e, "name", { value: t, configurable: !0 }), Jn = !1;
function Ei() {
  const [e, t] = c.useState(Jn);
  return c.useEffect(() => {
    Jn || (Jn = !0, t(!0));
  }, []), e;
}
Go(Ei, "useIsHydrated");
var _i = c[" useSyncExternalStore ".trim().toString()];
function ki() {
  return () => {
  };
}
Go(ki, "subscribe");
function Ii() {
  return _i(
    ki,
    () => !0,
    () => !1
  );
}
Go(Ii, "useIsHydratedModern");
var ff = typeof _i == "function" ? Ii : Ei, pf = Object.defineProperty, ct = (e, t) => pf(e, "name", { value: t, configurable: !0 }), eo = "rovingFocusGroup.onEntryFocus", mf = { bubbles: !1, cancelable: !0 }, kn = "RovingFocusGroup", [bo, Ti, hf] = /* @__PURE__ */ hn(kn), [gf, In] = /* @__PURE__ */ ge(
  kn,
  [hf]
), [vf, bf] = gf(kn), wf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ct(function(t, n) {
    return /* @__PURE__ */ m(bo.Provider, { scope: t.__scopeRovingFocusGroup, children: /* @__PURE__ */ m(bo.Slot, { scope: t.__scopeRovingFocusGroup, children: /* @__PURE__ */ m(xf, { ...t, ref: n }) }) });
  }, "RovingFocusGroup")
), xf = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ ct(function(t, n) {
  const {
    __scopeRovingFocusGroup: o,
    orientation: r,
    loop: a = !1,
    dir: i,
    currentTabStopId: s,
    defaultCurrentTabStopId: l,
    onCurrentTabStopIdChange: u,
    onEntryFocus: f,
    preventScrollOnEntryFocus: d = !1,
    ...p
  } = t, v = c.useRef(null), b = j(n, v), h = Lt(i), [g, y] = Ie({
    prop: s,
    defaultProp: l ?? null,
    onChange: u,
    caller: kn
  }), [C, w] = c.useState(!1), x = Se(f), S = Ti(o), R = c.useRef(!1), [E, P] = c.useState(0);
  return c.useEffect(() => {
    const k = v.current;
    if (k)
      return k.addEventListener(eo, x), () => k.removeEventListener(eo, x);
  }, [x]), /* @__PURE__ */ m(
    vf,
    {
      scope: o,
      orientation: r,
      dir: h,
      loop: a,
      currentTabStopId: g,
      onItemFocus: c.useCallback(
        (k) => y(k),
        [y]
      ),
      onItemShiftTab: c.useCallback(() => w(!0), []),
      onFocusableItemAdd: c.useCallback(
        () => P((k) => k + 1),
        []
      ),
      onFocusableItemRemove: c.useCallback(
        () => P((k) => k - 1),
        []
      ),
      children: /* @__PURE__ */ m(
        W.div,
        {
          tabIndex: C || E === 0 ? -1 : 0,
          "data-orientation": r,
          ...p,
          ref: b,
          style: { outline: "none", ...t.style },
          onMouseDown: T(t.onMouseDown, () => {
            R.current = !0;
          }),
          onFocus: T(t.onFocus, (k) => {
            const D = !R.current;
            if (k.target === k.currentTarget && D && !C) {
              const F = new CustomEvent(eo, mf);
              if (k.currentTarget.dispatchEvent(F), !F.defaultPrevented) {
                const O = S().filter(($) => $.focusable), L = O.find(($) => $.active), z = O.find(($) => $.id === g), B = [L, z, ...O].filter(
                  Boolean
                ).map(($) => $.ref.current);
                Ho(B, d);
              }
            }
            R.current = !1;
          }),
          onBlur: T(t.onBlur, () => w(!1))
        }
      )
    }
  );
}, "RovingFocusGroupImpl")), yf = "RovingFocusGroupItem", Cf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ct(function(t, n) {
    const {
      __scopeRovingFocusGroup: o,
      focusable: r = !0,
      active: a = !1,
      tabStopId: i,
      children: s,
      ...l
    } = t, u = _e(), f = i || u, d = bf(yf, o), p = d.currentTabStopId === f, v = Ti(o), { onFocusableItemAdd: b, onFocusableItemRemove: h, currentTabStopId: g } = d, y = ff();
    return ne(() => {
      if (!(!y || !r))
        return b(), () => h();
    }, [y, r, b, h]), c.useEffect(() => {
      if (!(y || !r))
        return b(), () => h();
    }, [y, r, b, h]), /* @__PURE__ */ m(
      bo.ItemSlot,
      {
        scope: o,
        id: f,
        focusable: r,
        active: a,
        children: /* @__PURE__ */ m(
          W.span,
          {
            tabIndex: p ? 0 : -1,
            "data-orientation": d.orientation,
            ...l,
            ref: n,
            onMouseDown: T(t.onMouseDown, (C) => {
              r ? d.onItemFocus(f) : C.preventDefault();
            }),
            onFocus: T(t.onFocus, () => d.onItemFocus(f)),
            onKeyDown: T(t.onKeyDown, (C) => {
              if (C.key === "Tab" && C.shiftKey) {
                d.onItemShiftTab();
                return;
              }
              if (C.target !== C.currentTarget) return;
              const w = Ai(C, d.orientation, d.dir);
              if (w !== void 0) {
                if (C.metaKey || C.ctrlKey || C.altKey || C.shiftKey) return;
                C.preventDefault();
                let S = v().filter((R) => R.focusable).map((R) => R.ref.current);
                if (w === "last") S.reverse();
                else if (w === "prev" || w === "next") {
                  w === "prev" && S.reverse();
                  const R = S.indexOf(C.currentTarget);
                  S = d.loop ? Mi(S, R + 1) : S.slice(R + 1);
                }
                setTimeout(() => Ho(S));
              }
            }),
            children: typeof s == "function" ? s({ isCurrentTabStop: p, hasTabStop: g != null }) : s
          }
        )
      }
    );
  }, "RovingFocusGroupItem")
), Sf = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Oi(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
ct(Oi, "getDirectionAwareKey");
function Ai(e, t, n) {
  const o = Oi(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o)))
    return Sf[o];
}
ct(Ai, "getFocusIntent");
function Ho(e, t = !1) {
  const n = document.activeElement;
  for (const o of e)
    if (o === n || (o.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
ct(Ho, "focusFirst");
function Mi(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
ct(Mi, "wrapArray");
var Di = wf, Ni = Cf, Rf = Object.defineProperty, te = (e, t) => Rf(e, "name", { value: t, configurable: !0 }), Pf = ["Enter", " "], Ef = ["ArrowDown", "PageUp", "Home"], Li = ["ArrowUp", "PageDown", "End"], _f = [...Ef, ...Li], Tn = "Menu", [wo, kf, If] = /* @__PURE__ */ hn(Tn), [lt, Fi] = /* @__PURE__ */ ge(Tn, [
  If,
  Je,
  In
]), Uo = Je(), $i = In(), [Tf, Vt] = lt(Tn), [Of, Wo] = lt(Tn), Af = /* @__PURE__ */ te((e) => {
  const { __scopeMenu: t, open: n = !1, children: o, dir: r, onOpenChange: a, modal: i = !0 } = e, s = Uo(t), [l, u] = c.useState(null), f = c.useRef(!1), d = Se(a), p = Lt(r);
  return c.useEffect(() => {
    const v = /* @__PURE__ */ te(() => {
      f.current = !0, document.addEventListener("pointerdown", b, { capture: !0, once: !0 }), document.addEventListener("pointermove", b, { capture: !0, once: !0 });
    }, "handleKeyDown"), b = /* @__PURE__ */ te(() => f.current = !1, "handlePointer");
    return document.addEventListener("keydown", v, { capture: !0 }), () => {
      document.removeEventListener("keydown", v, { capture: !0 }), document.removeEventListener("pointerdown", b, { capture: !0 }), document.removeEventListener("pointermove", b, { capture: !0 });
    };
  }, []), c.useEffect(() => {
    if (!n)
      return;
    const v = /* @__PURE__ */ te(() => d(!1), "handleBlur");
    return window.addEventListener("blur", v), () => window.removeEventListener("blur", v);
  }, [n, d]), /* @__PURE__ */ m(Pn, { ...s, children: /* @__PURE__ */ m(
    Tf,
    {
      scope: t,
      open: n,
      onOpenChange: d,
      content: l,
      onContentChange: u,
      children: /* @__PURE__ */ m(
        Of,
        {
          scope: t,
          onClose: c.useCallback(() => d(!1), [d]),
          isUsingKeyboardRef: f,
          dir: p,
          modal: i,
          children: o
        }
      )
    }
  ) });
}, "Menu"), Mf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ te(function(t, n) {
    const { __scopeMenu: o, ...r } = t, a = Uo(o);
    return /* @__PURE__ */ m(En, { ...a, ...r, ref: n });
  }, "MenuAnchor")
), zi = "MenuPortal", [Df, Nf] = lt(zi, {
  forceMount: void 0
}), Lf = /* @__PURE__ */ te((e) => {
  const { __scopeMenu: t, forceMount: n, children: o, container: r } = e, a = Vt(zi, t);
  return /* @__PURE__ */ m(Df, { scope: t, forceMount: n, children: /* @__PURE__ */ m(Re, { present: n || a.open, children: /* @__PURE__ */ m($t, { asChild: !0, container: r, children: o }) }) });
}, "MenuPortal"), Ye = "MenuContent", [Ff, Bi] = lt(Ye), $f = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ te(function(t, n) {
    const o = Nf(Ye, t.__scopeMenu), { forceMount: r = o.forceMount, ...a } = t, i = Vt(Ye, t.__scopeMenu), s = Wo(Ye, t.__scopeMenu);
    return /* @__PURE__ */ m(wo.Provider, { scope: t.__scopeMenu, children: /* @__PURE__ */ m(Re, { present: r || i.open, children: /* @__PURE__ */ m(wo.Slot, { scope: t.__scopeMenu, children: s.modal ? /* @__PURE__ */ m(zf, { ...a, ref: n }) : /* @__PURE__ */ m(Bf, { ...a, ref: n }) }) }) });
  }, "MenuContent")
), zf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ te(function(t, n) {
    const o = Vt(Ye, t.__scopeMenu), r = c.useRef(null), a = j(n, r);
    return c.useEffect(() => {
      const i = r.current;
      if (i) return bn(i);
    }, []), /* @__PURE__ */ m(
      Vi,
      {
        ...t,
        ref: a,
        trapFocus: o.open,
        disableOutsidePointerEvents: o.open,
        disableOutsideScroll: !0,
        onFocusOutside: T(
          t.onFocusOutside,
          (i) => i.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => o.onOpenChange(!1)
      }
    );
  }, "MenuRootContentModal")
), Bf = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ te(function(t, n) {
  const o = Vt(Ye, t.__scopeMenu);
  return /* @__PURE__ */ m(
    Vi,
    {
      ...t,
      ref: n,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => o.onOpenChange(!1)
    }
  );
}, "MenuRootContentNonModal")), Vf = /* @__PURE__ */ ke("MenuContent.ScrollLock"), Vi = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ te(function(t, n) {
    const {
      __scopeMenu: o,
      loop: r = !1,
      trapFocus: a,
      onOpenAutoFocus: i,
      onCloseAutoFocus: s,
      disableOutsidePointerEvents: l,
      onEntryFocus: u,
      onEscapeKeyDown: f,
      onPointerDownOutside: d,
      onFocusOutside: p,
      onInteractOutside: v,
      onDismiss: b,
      disableOutsideScroll: h,
      ...g
    } = t, y = Vt(Ye, o), C = Wo(Ye, o), w = Uo(o), x = $i(o), S = kf(o), [R, E] = c.useState(null), P = c.useRef(null), k = j(n, P, y.onContentChange), D = c.useRef(0), F = c.useRef(""), O = c.useRef(0), L = c.useRef(null), z = c.useRef("right"), G = c.useRef(0), B = h ? zt : c.Fragment, $ = h ? { as: Vf, allowPinchZoom: !0 } : void 0, _ = /* @__PURE__ */ te((I) => {
      const ie = F.current + I, Z = S().filter((N) => !N.disabled), K = document.activeElement, ee = Z.find((N) => N.ref.current === K)?.textValue, fe = Z.map((N) => N.textValue), xe = Wi(fe, ie, ee), X = Z.find((N) => N.textValue === xe)?.ref.current;
      (/* @__PURE__ */ te((function N(q) {
        F.current = q, window.clearTimeout(D.current), q !== "" && (D.current = window.setTimeout(() => N(""), 1e3));
      }), "updateSearch"))(ie), X && setTimeout(() => X.focus());
    }, "handleTypeaheadSearch");
    c.useEffect(() => () => window.clearTimeout(D.current), []), Rt();
    const H = c.useCallback((I) => z.current === L.current?.side && Yi(I, L.current?.area), []);
    return /* @__PURE__ */ m(
      Ff,
      {
        scope: o,
        searchRef: F,
        onItemEnter: c.useCallback(
          (I) => {
            H(I) && I.preventDefault();
          },
          [H]
        ),
        onItemLeave: c.useCallback(
          (I) => {
            H(I) || (P.current?.focus(), E(null));
          },
          [H]
        ),
        onTriggerLeave: c.useCallback(
          (I) => {
            H(I) && I.preventDefault();
          },
          [H]
        ),
        pointerGraceTimerRef: O,
        onPointerGraceIntentChange: c.useCallback((I) => {
          L.current = I;
        }, []),
        children: /* @__PURE__ */ m(B, { ...$, children: /* @__PURE__ */ m(
          gn,
          {
            asChild: !0,
            trapped: a,
            onMountAutoFocus: T(i, (I) => {
              I.preventDefault(), P.current?.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: s,
            children: /* @__PURE__ */ m(
              Ft,
              {
                asChild: !0,
                disableOutsidePointerEvents: l,
                onEscapeKeyDown: f,
                onPointerDownOutside: d,
                onFocusOutside: p,
                onInteractOutside: v,
                onDismiss: b,
                children: /* @__PURE__ */ m(
                  Di,
                  {
                    asChild: !0,
                    ...x,
                    dir: C.dir,
                    orientation: "vertical",
                    loop: r,
                    currentTabStopId: R,
                    onCurrentTabStopIdChange: E,
                    onEntryFocus: T(u, (I) => {
                      C.isUsingKeyboardRef.current || I.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ m(
                      _n,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": ji(y.open),
                        "data-radix-menu-content": "",
                        dir: C.dir,
                        ...w,
                        ...g,
                        ref: k,
                        style: { outline: "none", ...g.style },
                        onKeyDown: T(g.onKeyDown, (I) => {
                          const Z = I.target.closest("[data-radix-menu-content]") === I.currentTarget, K = I.ctrlKey || I.altKey || I.metaKey, ee = I.key.length === 1;
                          Z && (I.key === "Tab" && I.preventDefault(), !K && ee && _(I.key));
                          const fe = P.current;
                          if (I.target !== fe || !_f.includes(I.key)) return;
                          I.preventDefault();
                          const X = S().filter((N) => !N.disabled).map((N) => N.ref.current);
                          Li.includes(I.key) && X.reverse(), Hi(X);
                        }),
                        onBlur: T(t.onBlur, (I) => {
                          I.currentTarget.contains(I.target) || (window.clearTimeout(D.current), F.current = "");
                        }),
                        onPointerMove: T(
                          t.onPointerMove,
                          pn((I) => {
                            const ie = I.target, Z = G.current !== I.clientX;
                            if (I.currentTarget.contains(ie) && Z) {
                              const K = I.clientX > G.current ? "right" : "left";
                              z.current = K, G.current = I.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }, "MenuContentImpl")
), xo = "MenuItem", Gr = "menu.itemSelect", jf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ te(function(t, n) {
    const { disabled: o = !1, onSelect: r, ...a } = t, i = c.useRef(null), s = Wo(xo, t.__scopeMenu), l = Bi(xo, t.__scopeMenu), u = j(n, i), f = c.useRef(!1), d = /* @__PURE__ */ te(() => {
      const p = i.current;
      if (!o && p) {
        const v = new CustomEvent(Gr, { bubbles: !0, cancelable: !0 });
        p.addEventListener(Gr, (b) => r?.(b), { once: !0 }), _o(p, v), v.defaultPrevented ? f.current = !1 : s.onClose();
      }
    }, "handleSelect");
    return /* @__PURE__ */ m(
      Gf,
      {
        ...a,
        ref: u,
        disabled: o,
        onClick: T(t.onClick, d),
        onPointerDown: (p) => {
          t.onPointerDown?.(p), f.current = !0;
        },
        onPointerUp: T(t.onPointerUp, (p) => {
          f.current || p.currentTarget?.click();
        }),
        onKeyDown: T(t.onKeyDown, (p) => {
          o || p.target !== p.currentTarget || l.searchRef.current !== "" && p.key === " " || Pf.includes(p.key) && (p.currentTarget.click(), p.preventDefault());
        })
      }
    );
  }, "MenuItem")
), Gf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ te(function(t, n) {
    const { __scopeMenu: o, disabled: r = !1, textValue: a, ...i } = t, s = Bi(xo, o), l = $i(o), u = c.useRef(null), f = j(n, u), [d, p] = c.useState(!1), [v, b] = c.useState("");
    return c.useEffect(() => {
      const h = u.current;
      h && b((h.textContent ?? "").trim());
    }, [i.children]), /* @__PURE__ */ m(
      wo.ItemSlot,
      {
        scope: o,
        disabled: r,
        textValue: a ?? v,
        children: /* @__PURE__ */ m(Ni, { asChild: !0, ...l, focusable: !r, children: /* @__PURE__ */ m(
          W.div,
          {
            role: "menuitem",
            "data-highlighted": d ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...i,
            ref: f,
            onPointerMove: T(
              t.onPointerMove,
              pn((h) => {
                r ? s.onItemLeave(h) : (s.onItemEnter(h), h.defaultPrevented || h.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: T(
              t.onPointerLeave,
              pn((h) => s.onItemLeave(h))
            ),
            onFocus: T(t.onFocus, () => p(!0)),
            onBlur: T(t.onBlur, () => p(!1))
          }
        ) })
      }
    );
  }, "MenuItemImpl")
), Hf = "MenuRadioGroup", [$h, zh] = lt(
  Hf,
  { value: void 0, onValueChange: /* @__PURE__ */ te(() => {
  }, "onValueChange") }
), Uf = "MenuItemIndicator", [Bh, Vh] = lt(
  Uf,
  { checked: !1 }
), Wf = "MenuSub", [jh, Gh] = lt(Wf);
function ji(e) {
  return e ? "open" : "closed";
}
te(ji, "getOpenState");
function Gi(e) {
  return e === "indeterminate";
}
te(Gi, "isIndeterminate");
function Kf(e) {
  return Gi(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
te(Kf, "getCheckedState");
function Hi(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
te(Hi, "focusFirst");
function Ui(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
te(Ui, "wrapArray");
function Wi(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t, a = n ? e.indexOf(n) : -1;
  let i = Ui(e, Math.max(a, 0));
  r.length === 1 && (i = i.filter((u) => u !== n));
  const l = i.find(
    (u) => u.toLowerCase().startsWith(r.toLowerCase())
  );
  return l !== n ? l : void 0;
}
te(Wi, "getNextMatch");
function Ki(e, t) {
  const { x: n, y: o } = e;
  let r = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const s = t[a], l = t[i], u = s.x, f = s.y, d = l.x, p = l.y;
    f > o != p > o && n < (d - u) * (o - f) / (p - f) + u && (r = !r);
  }
  return r;
}
te(Ki, "isPointInPolygon");
function Yi(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return Ki(n, t);
}
te(Yi, "isPointerInGraceArea");
function pn(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
te(pn, "whenMouse");
var Yf = Af, Xf = Mf, qf = Lf, Zf = $f, Qf = jf, Jf = Object.defineProperty, jt = (e, t) => Jf(e, "name", { value: t, configurable: !0 }), Ko = "DropdownMenu", [ep, Hh] = /* @__PURE__ */ ge(
  Ko,
  [Fi]
), Gt = Fi(), [tp, Xi] = ep(Ko), np = /* @__PURE__ */ jt((e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: o,
    open: r,
    defaultOpen: a,
    onOpenChange: i,
    modal: s = !0
  } = e, l = Gt(t), u = c.useRef(null), [f, d] = Ie({
    prop: r,
    defaultProp: a ?? !1,
    onChange: i,
    caller: Ko
  });
  return /* @__PURE__ */ m(
    tp,
    {
      scope: t,
      triggerId: _e(),
      triggerRef: u,
      contentId: _e(),
      open: f,
      onOpenChange: d,
      onOpenToggle: c.useCallback(() => d((p) => !p), [d]),
      modal: s,
      children: /* @__PURE__ */ m(Yf, { ...l, open: f, onOpenChange: d, dir: o, modal: s, children: n })
    }
  );
}, "DropdownMenu"), op = "DropdownMenuTrigger", rp = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ jt(function(t, n) {
    const { __scopeDropdownMenu: o, disabled: r = !1, ...a } = t, i = Xi(op, o), s = Gt(o), l = j(n, i.triggerRef);
    return /* @__PURE__ */ m(Xf, { asChild: !0, ...s, children: /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        id: i.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": i.open,
        "aria-controls": i.open ? i.contentId : void 0,
        "data-state": i.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...a,
        ref: l,
        onPointerDown: T(t.onPointerDown, (u) => {
          !r && u.button === 0 && u.ctrlKey === !1 && (i.onOpenToggle(), i.open || u.preventDefault());
        }),
        onKeyDown: T(t.onKeyDown, (u) => {
          r || (["Enter", " "].includes(u.key) && i.onOpenToggle(), u.key === "ArrowDown" && i.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(u.key) && u.preventDefault());
        })
      }
    ) });
  }, "DropdownMenuTrigger")
), ap = /* @__PURE__ */ jt((e) => {
  const { __scopeDropdownMenu: t, ...n } = e, o = Gt(t);
  return /* @__PURE__ */ m(qf, { ...o, ...n });
}, "DropdownMenuPortal"), ip = "DropdownMenuContent", sp = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ jt(function(t, n) {
    const { __scopeDropdownMenu: o, ...r } = t, a = Xi(ip, o), i = Gt(o), s = c.useRef(!1);
    return /* @__PURE__ */ m(
      Zf,
      {
        id: a.contentId,
        "aria-labelledby": a.triggerId,
        ...i,
        ...r,
        ref: n,
        onCloseAutoFocus: T(t.onCloseAutoFocus, (l) => {
          s.current || a.triggerRef.current?.focus(), s.current = !1, l.preventDefault();
        }),
        onInteractOutside: T(t.onInteractOutside, (l) => {
          const u = l.detail.originalEvent, f = u.button === 0 && u.ctrlKey === !0, d = u.button === 2 || f;
          (!a.modal || d) && (s.current = !0);
        }),
        style: {
          ...t.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }, "DropdownMenuContent")
), cp = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ jt(function(t, n) {
    const { __scopeDropdownMenu: o, ...r } = t, a = Gt(o);
    return /* @__PURE__ */ m(Qf, { ...a, ...r, ref: n });
  }, "DropdownMenuItem")
), lp = np, up = rp, dp = ap, fp = sp, pp = cp, mp = Object.defineProperty, hp = (e, t) => mp(e, "name", { value: t, configurable: !0 });
function qi(e) {
  const t = c.useRef({ value: e, previous: e });
  return c.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
hp(qi, "usePrevious");
var gp = Object.defineProperty, vp = (e, t) => gp(e, "name", { value: t, configurable: !0 });
function yo(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
vp(yo, "clamp");
var bp = Object.defineProperty, et = (e, t) => bp(e, "name", { value: t, configurable: !0 }), Yo = "Popover", [Zi, Uh] = /* @__PURE__ */ ge(Yo, [
  Je
]), Xo = Je(), [wp, _t] = Zi(Yo), xp = /* @__PURE__ */ et((e) => {
  const {
    __scopePopover: t,
    children: n,
    open: o,
    defaultOpen: r,
    onOpenChange: a,
    modal: i = !1
  } = e, s = Xo(t), l = c.useRef(null), [u, f] = c.useState(!1), [d, p] = Ie({
    prop: o,
    defaultProp: r ?? !1,
    onChange: a,
    caller: Yo
  });
  return /* @__PURE__ */ m(Pn, { ...s, children: /* @__PURE__ */ m(
    wp,
    {
      scope: t,
      contentId: _e(),
      triggerRef: l,
      open: d,
      onOpenChange: p,
      onOpenToggle: c.useCallback(() => p((v) => !v), [p]),
      hasCustomAnchor: u,
      onCustomAnchorAdd: c.useCallback(() => f(!0), []),
      onCustomAnchorRemove: c.useCallback(() => f(!1), []),
      modal: i,
      children: n
    }
  ) });
}, "Popover"), yp = "PopoverTrigger", Cp = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ et(function(t, n) {
    const { __scopePopover: o, ...r } = t, a = _t(yp, o), i = Xo(o), s = j(n, a.triggerRef), l = /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": a.open,
        "aria-controls": a.open ? a.contentId : void 0,
        "data-state": qo(a.open),
        ...r,
        ref: s,
        onClick: T(t.onClick, a.onOpenToggle)
      }
    );
    return a.hasCustomAnchor ? l : /* @__PURE__ */ m(En, { asChild: !0, ...i, children: l });
  }, "PopoverTrigger")
), Qi = "PopoverPortal", [Sp, Rp] = Zi(Qi, {
  forceMount: void 0
}), Pp = /* @__PURE__ */ et((e) => {
  const { __scopePopover: t, forceMount: n, children: o, container: r } = e, a = _t(Qi, t);
  return /* @__PURE__ */ m(Sp, { scope: t, forceMount: n, children: /* @__PURE__ */ m(Re, { present: n || a.open, children: /* @__PURE__ */ m($t, { asChild: !0, container: r, children: o }) }) });
}, "PopoverPortal"), At = "PopoverContent", Ep = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ et(function(t, n) {
    const o = Rp(At, t.__scopePopover), { forceMount: r = o.forceMount, ...a } = t, i = _t(At, t.__scopePopover);
    return /* @__PURE__ */ m(Re, { present: r || i.open, children: i.modal ? /* @__PURE__ */ m(kp, { ...a, ref: n }) : /* @__PURE__ */ m(Ip, { ...a, ref: n }) });
  }, "PopoverContent")
), _p = /* @__PURE__ */ ke("PopoverContent.RemoveScroll"), kp = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ et(function(t, n) {
    const o = _t(At, t.__scopePopover), r = c.useRef(null), a = j(n, r), i = c.useRef(!1);
    return c.useEffect(() => {
      const s = r.current;
      if (s) return bn(s);
    }, []), /* @__PURE__ */ m(zt, { as: _p, allowPinchZoom: !0, children: /* @__PURE__ */ m(
      Ji,
      {
        ...t,
        ref: a,
        trapFocus: o.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: T(t.onCloseAutoFocus, (s) => {
          s.preventDefault(), i.current || o.triggerRef.current?.focus();
        }),
        onPointerDownOutside: T(
          t.onPointerDownOutside,
          (s) => {
            const l = s.detail.originalEvent, u = l.button === 0 && l.ctrlKey === !0, f = l.button === 2 || u;
            i.current = f;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: T(
          t.onFocusOutside,
          (s) => s.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }, "PopoverContentModal")
), Ip = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ et(function(t, n) {
    const o = _t(At, t.__scopePopover), r = c.useRef(!1), a = c.useRef(!1);
    return /* @__PURE__ */ m(
      Ji,
      {
        ...t,
        ref: n,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          t.onCloseAutoFocus?.(i), i.defaultPrevented || (r.current || o.triggerRef.current?.focus(), i.preventDefault()), r.current = !1, a.current = !1;
        },
        onInteractOutside: (i) => {
          t.onInteractOutside?.(i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (a.current = !0));
          const s = i.target;
          o.triggerRef.current?.contains(s) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && a.current && i.preventDefault();
        }
      }
    );
  }, "PopoverContentNonModal")
), Ji = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ et(function(t, n) {
    const {
      __scopePopover: o,
      trapFocus: r,
      onOpenAutoFocus: a,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: s,
      onEscapeKeyDown: l,
      onPointerDownOutside: u,
      onFocusOutside: f,
      onInteractOutside: d,
      ...p
    } = t, v = _t(At, o), b = Xo(o);
    return Rt(), /* @__PURE__ */ m(
      gn,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: a,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ m(
          Ft,
          {
            asChild: !0,
            disableOutsidePointerEvents: s,
            onInteractOutside: d,
            onEscapeKeyDown: l,
            onPointerDownOutside: u,
            onFocusOutside: f,
            onDismiss: () => v.onOpenChange(!1),
            deferPointerDownOutside: !0,
            children: /* @__PURE__ */ m(
              _n,
              {
                "data-state": qo(v.open),
                role: "dialog",
                id: v.contentId,
                ...b,
                ...p,
                ref: n,
                style: {
                  ...p.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }, "PopoverContentImpl")
);
function qo(e) {
  return e ? "open" : "closed";
}
et(qo, "getState");
var Tp = xp, Op = Cp, Ap = Pp, Mp = Ep, Dp = Object.defineProperty, me = (e, t) => Dp(e, "name", { value: t, configurable: !0 }), es = "Radio", [Np, ts] = /* @__PURE__ */ ge(es), [Lp, On] = Np(es);
function ns(e) {
  const {
    __scopeRadio: t,
    checked: n = !1,
    children: o,
    disabled: r,
    form: a,
    name: i,
    onCheck: s,
    required: l,
    value: u = "on",
    // @ts-expect-error
    internal_do_not_use_render: f
  } = e, [d, p] = c.useState(null), [v, b] = c.useState(null), h = c.useRef(!1), [g, y] = c.useReducer(
    (x) => x + 1,
    0
  ), C = d ? !!a || !!d.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), w = {
    checked: n,
    disabled: r,
    required: l,
    name: i,
    form: a,
    value: u,
    control: d,
    setControl: p,
    hasConsumerStoppedPropagationRef: h,
    userInteractionCount: g,
    onUserInteraction: y,
    isFormControl: C,
    bubbleInput: v,
    setBubbleInput: b,
    onCheck: /* @__PURE__ */ me(() => s?.(), "onCheck")
  };
  return /* @__PURE__ */ m(Lp, { scope: t, ...w, children: os(f) ? f(w) : o });
}
me(ns, "RadioProvider");
var Fp = "RadioTrigger", $p = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ me(function({ __scopeRadio: t, onClick: n, ...o }, r) {
    const {
      checked: a,
      disabled: i,
      value: s,
      setControl: l,
      onCheck: u,
      hasConsumerStoppedPropagationRef: f,
      onUserInteraction: d,
      isFormControl: p,
      bubbleInput: v
    } = On(Fp, t), b = j(r, l);
    return /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        role: "radio",
        "aria-checked": a,
        "data-state": Zo(a),
        "data-disabled": i ? "" : void 0,
        disabled: i,
        value: s,
        ...o,
        ref: b,
        onClick: T(n, (h) => {
          a || (d(), u()), v && p && (f.current = h.isPropagationStopped(), f.current || h.stopPropagation());
        })
      }
    );
  }, "RadioTrigger")
), zp = "RadioIndicator", Bp = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ me(function(t, n) {
    const { __scopeRadio: o, forceMount: r, ...a } = t, i = On(zp, o);
    return /* @__PURE__ */ m(Re, { present: r || i.checked, children: /* @__PURE__ */ m(
      W.span,
      {
        "data-state": Zo(i.checked),
        "data-disabled": i.disabled ? "" : void 0,
        ...a,
        ref: n
      }
    ) });
  }, "RadioIndicator")
), Vp = "RadioBubbleInput", jp = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ me(function({ __scopeRadio: t, onClick: n, ...o }, r) {
    const {
      control: a,
      checked: i,
      required: s,
      disabled: l,
      name: u,
      value: f,
      form: d,
      bubbleInput: p,
      setBubbleInput: v,
      hasConsumerStoppedPropagationRef: b,
      userInteractionCount: h
    } = On(Vp, t), g = j(r, v), y = Bt(a), C = c.useRef(!1), w = c.useRef(i), x = c.useRef(h);
    c.useEffect(() => {
      const R = p;
      if (!R) return;
      const E = window.HTMLInputElement.prototype, k = Object.getOwnPropertyDescriptor(
        E,
        "checked"
      ).set, D = h !== x.current;
      x.current = h;
      const F = w.current !== i;
      w.current = i;
      const O = !(D && b.current);
      if (F && k) {
        C.current = !D;
        const L = new Event("click", { bubbles: O });
        k.call(R, i), R.dispatchEvent(L), C.current = !1;
      }
    }, [p, i, b, h]);
    const S = c.useRef(i);
    return /* @__PURE__ */ m(
      W.input,
      {
        type: "radio",
        "aria-hidden": !0,
        defaultChecked: S.current,
        required: s,
        disabled: l,
        name: u,
        value: f,
        form: d,
        ...o,
        tabIndex: -1,
        ref: g,
        onClick: T(n, (R) => {
          C.current && R.stopPropagation();
        }),
        style: {
          ...o.style,
          ...y,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }, "RadioBubbleInput")
);
function os(e) {
  return typeof e == "function";
}
me(os, "isFunction");
function Zo(e) {
  return e ? "checked" : "unchecked";
}
me(Zo, "getState");
var Gp = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], Qo = "RadioGroup", [Hp, Wh] = /* @__PURE__ */ ge(Qo, [
  In,
  ts
]), rs = In(), An = ts(), [Up, Wp] = Hp(Qo), Kp = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ me(function(t, n) {
    const {
      __scopeRadioGroup: o,
      name: r,
      form: a,
      defaultValue: i,
      value: s,
      required: l = !1,
      disabled: u = !1,
      orientation: f,
      dir: d,
      loop: p = !0,
      onValueChange: v,
      ...b
    } = t, h = rs(o), g = Lt(d), [y, C] = Ie({
      prop: s,
      defaultProp: i ?? null,
      onChange: v,
      caller: Qo
    }), [w, x] = c.useState(null), S = j(n, x), R = c.useRef(y);
    return c.useEffect(() => {
      const E = a ? w?.ownerDocument.getElementById(a) : w?.closest("form");
      if (E instanceof HTMLFormElement) {
        const P = /* @__PURE__ */ me(() => C(R.current), "reset");
        return E.addEventListener("reset", P), () => E.removeEventListener("reset", P);
      }
    }, [w, a, C]), /* @__PURE__ */ m(
      Up,
      {
        scope: o,
        name: r,
        form: a,
        required: l,
        disabled: u,
        value: y,
        onValueChange: C,
        children: /* @__PURE__ */ m(
          Di,
          {
            asChild: !0,
            ...h,
            orientation: f,
            dir: g,
            loop: p,
            children: /* @__PURE__ */ m(
              W.div,
              {
                role: "radiogroup",
                "aria-required": l,
                "aria-orientation": f,
                "data-disabled": u ? "" : void 0,
                dir: g,
                ...b,
                ref: S
              }
            )
          }
        )
      }
    );
  }, "RadioGroup")
), Yp = "RadioGroupItemProvider", Xp = "RadioGroupItemTrigger";
function as(e) {
  const {
    __scopeRadioGroup: t,
    value: n,
    disabled: o,
    children: r,
    // @ts-expect-error
    internal_do_not_use_render: a
  } = e, i = Wp(Yp, t), s = An(t), l = i.disabled || o;
  return /* @__PURE__ */ m(
    ns,
    {
      ...s,
      checked: i.value === n,
      disabled: l,
      required: i.required,
      name: i.name,
      form: i.form,
      value: n,
      onCheck: () => i.onValueChange(n),
      internal_do_not_use_render: a,
      children: r
    }
  );
}
me(as, "RadioGroupItemProvider");
var qp = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ me(function(t, n) {
  const { __scopeRadioGroup: o, ...r } = t, a = rs(o), i = An(o), { checked: s, disabled: l } = On(Xp, i.__scopeRadio), u = c.useRef(null), f = j(n, u), d = c.useRef(!1);
  return c.useEffect(() => {
    const p = /* @__PURE__ */ me((b) => {
      Gp.includes(b.key) && (d.current = !0);
    }, "handleKeyDown"), v = /* @__PURE__ */ me(() => d.current = !1, "handleKeyUp");
    return document.addEventListener("keydown", p), document.addEventListener("keyup", v), () => {
      document.removeEventListener("keydown", p), document.removeEventListener("keyup", v);
    };
  }, []), /* @__PURE__ */ m(
    Ni,
    {
      asChild: !0,
      ...a,
      focusable: !l,
      active: s,
      children: /* @__PURE__ */ m(
        $p,
        {
          ...i,
          ...r,
          ref: f,
          onKeyDown: T(r.onKeyDown, (p) => {
            p.key === "Enter" && p.preventDefault();
          }),
          onFocus: T(r.onFocus, () => {
            d.current && u.current?.click();
          })
        }
      )
    }
  );
}, "RadioGroupItemTrigger")), Zp = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ me(function(t, n) {
    const { __scopeRadioGroup: o, value: r, disabled: a, ...i } = t;
    return /* @__PURE__ */ m(
      as,
      {
        __scopeRadioGroup: o,
        value: r,
        disabled: a,
        internal_do_not_use_render: ({ isFormControl: s }) => /* @__PURE__ */ de(st, { children: [
          /* @__PURE__ */ m(
            qp,
            {
              ...i,
              ref: n,
              __scopeRadioGroup: o
            }
          ),
          s && /* @__PURE__ */ m(
            Qp,
            {
              __scopeRadioGroup: o
            }
          )
        ] })
      }
    );
  }, "RadioGroupItem")
), Qp = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ me(function(t, n) {
  const { __scopeRadioGroup: o, ...r } = t, a = An(o);
  return /* @__PURE__ */ m(jp, { ...a, ...r, ref: n });
}, "RadioGroupItemBubbleInput")), Jp = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ me(function(t, n) {
    const { __scopeRadioGroup: o, ...r } = t, a = An(o);
    return /* @__PURE__ */ m(Bp, { ...a, ...r, ref: n });
  }, "RadioGroupIndicator")
), em = Object.defineProperty, Y = (e, t) => em(e, "name", { value: t, configurable: !0 }), tm = [" ", "Enter", "ArrowUp", "ArrowDown"], nm = [" ", "Enter"], xt = "Select", [Mn, Dn, om] = /* @__PURE__ */ hn(xt), [ut, Kh] = /* @__PURE__ */ ge(xt, [
  om,
  Je
]), Jo = Je(), [rm, tt] = ut(xt), [am, im] = ut(xt);
function is(e) {
  const {
    __scopeSelect: t,
    children: n,
    open: o,
    defaultOpen: r,
    onOpenChange: a,
    value: i,
    defaultValue: s,
    onValueChange: l,
    dir: u,
    name: f,
    autoComplete: d,
    disabled: p,
    required: v,
    form: b,
    // @ts-expect-error internal render prop used by `Select` to compose its default parts
    internal_do_not_use_render: h
  } = e, g = Jo(t), [y, C] = c.useState(null), [w, x] = c.useState(null), [S, R] = c.useState(!1), E = Lt(u), [P, k] = Ie({
    prop: o,
    defaultProp: r ?? !1,
    onChange: a,
    caller: xt
  }), [D, F] = Ie({
    prop: i,
    defaultProp: s,
    onChange: l,
    caller: xt
  }), O = c.useRef(null), L = c.useRef(D);
  c.useEffect(() => {
    const Z = b ? y?.ownerDocument.getElementById(b) : y?.form;
    if (Z instanceof HTMLFormElement) {
      const K = /* @__PURE__ */ Y(() => F(L.current), "reset");
      return Z.addEventListener("reset", K), () => Z.removeEventListener("reset", K);
    }
  }, [b, y, F]);
  const z = y ? !!b || !!y.closest("form") : !0, [G, B] = c.useState(/* @__PURE__ */ new Set()), $ = _e(), _ = Array.from(G).map((Z) => Z.props.value).join(";"), H = c.useCallback((Z) => {
    B((K) => new Set(K).add(Z));
  }, []), I = c.useCallback((Z) => {
    B((K) => {
      const ee = new Set(K);
      return ee.delete(Z), ee;
    });
  }, []), ie = {
    required: v,
    trigger: y,
    onTriggerChange: C,
    valueNode: w,
    onValueNodeChange: x,
    valueNodeHasChildren: S,
    onValueNodeHasChildrenChange: R,
    contentId: $,
    value: D,
    onValueChange: F,
    open: P,
    onOpenChange: k,
    dir: E,
    triggerPointerDownPosRef: O,
    disabled: p,
    name: f,
    autoComplete: d,
    form: b,
    nativeOptions: G,
    nativeSelectKey: _,
    isFormControl: z
  };
  return /* @__PURE__ */ m(Pn, { ...g, children: /* @__PURE__ */ m(rm, { scope: t, ...ie, children: /* @__PURE__ */ m(Mn.Provider, { scope: t, children: /* @__PURE__ */ m(
    am,
    {
      scope: t,
      onNativeOptionAdd: H,
      onNativeOptionRemove: I,
      children: us(h) ? h(ie) : n
    }
  ) }) }) });
}
Y(is, "SelectProvider");
var sm = /* @__PURE__ */ Y((e) => {
  const { __scopeSelect: t, children: n, ...o } = e;
  return /* @__PURE__ */ m(
    is,
    {
      __scopeSelect: t,
      ...o,
      internal_do_not_use_render: ({ isFormControl: r }) => /* @__PURE__ */ de(st, { children: [
        n,
        r ? /* @__PURE__ */ m(
          Mm,
          {
            __scopeSelect: t
          }
        ) : null
      ] })
    }
  );
}, "Select"), cm = "SelectTrigger", lm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o, disabled: r = !1, ...a } = t, i = Jo(o), s = tt(cm, o), l = s.disabled || r, u = j(n, s.onTriggerChange), f = Dn(o), d = c.useRef("touch"), [p, v, b] = tr((g) => {
      const y = f().filter((x) => !x.disabled), C = y.find((x) => x.value === s.value), w = nr(y, g, C);
      w !== void 0 && s.onValueChange(w.value);
    }), h = /* @__PURE__ */ Y((g) => {
      l || (s.onOpenChange(!0), b()), g && (s.triggerPointerDownPosRef.current = {
        x: Math.round(g.pageX),
        y: Math.round(g.pageY)
      });
    }, "handleOpen");
    return /* @__PURE__ */ m(En, { asChild: !0, ...i, children: /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": s.open ? s.contentId : void 0,
        "aria-expanded": s.open,
        "aria-required": s.required,
        "aria-autocomplete": "none",
        dir: s.dir,
        "data-state": s.open ? "open" : "closed",
        disabled: l,
        "data-disabled": l ? "" : void 0,
        "data-placeholder": Ht(s.value) ? "" : void 0,
        ...a,
        ref: u,
        onClick: T(a.onClick, (g) => {
          g.currentTarget.focus(), d.current !== "mouse" && h(g);
        }),
        onPointerDown: T(a.onPointerDown, (g) => {
          d.current = g.pointerType;
          const y = g.target;
          y.hasPointerCapture(g.pointerId) && y.releasePointerCapture(g.pointerId), g.button === 0 && g.ctrlKey === !1 && g.pointerType === "mouse" && (h(g), g.preventDefault());
        }),
        onKeyDown: T(a.onKeyDown, (g) => {
          const y = p.current !== "";
          !(g.ctrlKey || g.altKey || g.metaKey) && g.key.length === 1 && v(g.key), !(y && g.key === " ") && tm.includes(g.key) && (h(), g.preventDefault());
        })
      }
    ) });
  }, "SelectTrigger")
), um = "SelectValue", dm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o, className: r, style: a, children: i, placeholder: s = "", ...l } = t, u = tt(um, o), { onValueNodeHasChildrenChange: f } = u, d = i !== void 0, p = j(n, u.onValueNodeChange);
    ne(() => {
      f(d);
    }, [f, d]);
    const v = Ht(u.value);
    return /* @__PURE__ */ m(
      W.span,
      {
        ...l,
        asChild: v ? !1 : l.asChild,
        ref: p,
        style: { pointerEvents: "none" },
        children: /* @__PURE__ */ m(c.Fragment, { children: v ? s : i }, v ? "placeholder" : "value")
      }
    );
  }, "SelectValue")
), fm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o, children: r, ...a } = t;
    return /* @__PURE__ */ m(W.span, { "aria-hidden": !0, ...a, ref: n, children: r || "▼" });
  }, "SelectIcon")
), pm = "SelectPortal", [mm, hm] = ut(pm, {
  forceMount: void 0
}), gm = /* @__PURE__ */ Y((e) => {
  const { __scopeSelect: t, forceMount: n, ...o } = e;
  return /* @__PURE__ */ m(mm, { scope: e.__scopeSelect, forceMount: n, children: /* @__PURE__ */ m($t, { asChild: !0, ...o }) });
}, "SelectPortal"), it = "SelectContent", vm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const o = hm(it, t.__scopeSelect), { forceMount: r = o.forceMount, ...a } = t, i = tt(it, t.__scopeSelect), [s, l] = c.useState();
    return ne(() => {
      l(new DocumentFragment());
    }, []), /* @__PURE__ */ m(Re, { present: r || i.open, children: ({ present: u }) => u ? /* @__PURE__ */ m(xm, { ...a, ref: n }) : /* @__PURE__ */ m(bm, { ...a, fragment: s }) });
  }, "SelectContent")
), bm = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ Y(function(t, n) {
  const { __scopeSelect: o, children: r, fragment: a } = t;
  return a ? Dt.createPortal(
    /* @__PURE__ */ m(ss, { scope: o, children: /* @__PURE__ */ m(Mn.Slot, { scope: o, children: /* @__PURE__ */ m("div", { ref: n, children: r }) }) }),
    a
  ) : null;
}, "SelectContentFragment")), Ee = 10, [ss, dt] = ut(it), wm = /* @__PURE__ */ ke("SelectContent.RemoveScroll"), xm = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o } = t, {
      position: r = "item-aligned",
      onCloseAutoFocus: a,
      onEscapeKeyDown: i,
      onPointerDownOutside: s,
      //
      // PopperContent props
      side: l,
      sideOffset: u,
      align: f,
      alignOffset: d,
      arrowPadding: p,
      collisionBoundary: v,
      collisionPadding: b,
      sticky: h,
      hideWhenDetached: g,
      avoidCollisions: y,
      //
      ...C
    } = t, w = tt(it, o), [x, S] = c.useState(null), [R, E] = c.useState(null), P = j(n, S), [k, D] = c.useState(null), [F, O] = c.useState(
      null
    ), L = Dn(o), [z, G] = c.useState(!1), B = c.useRef(!1);
    c.useEffect(() => {
      if (x) return bn(x);
    }, [x]), Rt();
    const $ = c.useCallback(
      (N) => {
        const [q, ...oe] = L().map((re) => re.ref.current), [Q] = oe.slice(-1), J = document.activeElement;
        for (const re of N)
          if (re === J || (re?.scrollIntoView({ block: "nearest" }), re === q && R && (R.scrollTop = 0), re === Q && R && (R.scrollTop = R.scrollHeight), re?.focus(), document.activeElement !== J)) return;
      },
      [L, R]
    ), _ = c.useCallback(
      () => $([k, x]),
      [$, k, x]
    );
    c.useEffect(() => {
      z && _();
    }, [z, _]);
    const { onOpenChange: H, triggerPointerDownPosRef: I } = w;
    c.useEffect(() => {
      if (x) {
        let N = { x: 0, y: 0 };
        const q = /* @__PURE__ */ Y((Q) => {
          N = {
            x: Math.abs(Math.round(Q.pageX) - (I.current?.x ?? 0)),
            y: Math.abs(Math.round(Q.pageY) - (I.current?.y ?? 0))
          };
        }, "handlePointerMove"), oe = /* @__PURE__ */ Y((Q) => {
          N.x <= 10 && N.y <= 10 ? Q.preventDefault() : Q.composedPath().includes(x) || H(!1), document.removeEventListener("pointermove", q), I.current = null;
        }, "handlePointerUp");
        return I.current !== null && (document.addEventListener("pointermove", q), document.addEventListener("pointerup", oe, { capture: !0, once: !0 })), () => {
          document.removeEventListener("pointermove", q), document.removeEventListener("pointerup", oe, { capture: !0 });
        };
      }
    }, [x, H, I]), c.useEffect(() => {
      const N = /* @__PURE__ */ Y(() => H(!1), "close");
      return window.addEventListener("blur", N), window.addEventListener("resize", N), () => {
        window.removeEventListener("blur", N), window.removeEventListener("resize", N);
      };
    }, [H]);
    const [ie, Z] = tr((N) => {
      const q = L().filter((J) => !J.disabled), oe = q.find((J) => J.ref.current === document.activeElement), Q = nr(q, N, oe);
      Q && setTimeout(() => Q.ref.current?.focus());
    }), K = c.useCallback(
      (N, q, oe) => {
        const Q = !B.current && !oe;
        (w.value !== void 0 && w.value === q || Q) && (D(N), Q && (B.current = !0));
      },
      [w.value]
    ), ee = c.useCallback(() => x?.focus(), [x]), fe = c.useCallback(
      (N, q, oe) => {
        const Q = !B.current && !oe;
        (w.value !== void 0 && w.value === q || Q) && O(N);
      },
      [w.value]
    ), xe = r === "popper" ? Hr : ym, X = xe === Hr ? {
      side: l,
      sideOffset: u,
      align: f,
      alignOffset: d,
      arrowPadding: p,
      collisionBoundary: v,
      collisionPadding: b,
      sticky: h,
      hideWhenDetached: g,
      avoidCollisions: y
    } : {};
    return /* @__PURE__ */ m(
      ss,
      {
        scope: o,
        content: x,
        viewport: R,
        onViewportChange: E,
        itemRefCallback: K,
        selectedItem: k,
        onItemLeave: ee,
        itemTextRefCallback: fe,
        focusSelectedItem: _,
        selectedItemText: F,
        position: r,
        isPositioned: z,
        searchRef: ie,
        children: /* @__PURE__ */ m(zt, { as: wm, allowPinchZoom: !0, children: /* @__PURE__ */ m(
          gn,
          {
            asChild: !0,
            trapped: w.open,
            onMountAutoFocus: (N) => {
              N.preventDefault();
            },
            onUnmountAutoFocus: T(a, (N) => {
              w.trigger?.focus({ preventScroll: !0 }), N.preventDefault();
            }),
            children: /* @__PURE__ */ m(
              Ft,
              {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: i,
                onPointerDownOutside: s,
                onFocusOutside: (N) => N.preventDefault(),
                onDismiss: () => w.onOpenChange(!1),
                children: /* @__PURE__ */ m(
                  xe,
                  {
                    role: "listbox",
                    id: w.contentId,
                    "data-state": w.open ? "open" : "closed",
                    dir: w.dir,
                    onContextMenu: (N) => N.preventDefault(),
                    ...C,
                    ...X,
                    onPlaced: () => G(!0),
                    ref: P,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...C.style
                    },
                    onKeyDown: T(C.onKeyDown, (N) => {
                      const q = N.ctrlKey || N.altKey || N.metaKey;
                      if (N.key === "Tab" && N.preventDefault(), !q && N.key.length === 1 && Z(N.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(N.key)) {
                        let Q = L().filter((J) => !J.disabled).map((J) => J.ref.current);
                        if (["ArrowUp", "End"].includes(N.key) && (Q = Q.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(N.key)) {
                          const J = N.target, re = Q.indexOf(J);
                          Q = Q.slice(re + 1);
                        }
                        setTimeout(() => $(Q)), N.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }, "SelectContentImpl")
), ym = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ Y(function(t, n) {
  const { __scopeSelect: o, onPlaced: r, ...a } = t, i = tt(it, o), s = dt(it, o), [l, u] = c.useState(null), [f, d] = c.useState(null), p = j(n, d), v = Dn(o), b = c.useRef(!1), h = c.useRef(!0), { viewport: g, selectedItem: y, selectedItemText: C, focusSelectedItem: w } = s, x = c.useCallback(() => {
    if (i.trigger && i.valueNode && l && f && g && y && C) {
      const P = i.trigger.getBoundingClientRect(), k = f.getBoundingClientRect(), D = i.valueNode.getBoundingClientRect(), F = C.getBoundingClientRect();
      if (i.dir !== "rtl") {
        const J = F.left - k.left, re = D.left - J, Le = P.left - re, ye = P.width + Le, Fn = Math.max(ye, k.width), $n = window.innerWidth - Ee, zn = yo(re, [
          Ee,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(Ee, $n - Fn)
        ]);
        l.style.minWidth = ye + "px", l.style.left = zn + "px";
      } else {
        const J = k.right - F.right, re = window.innerWidth - D.right - J, Le = window.innerWidth - P.right - re, ye = P.width + Le, Fn = Math.max(ye, k.width), $n = window.innerWidth - Ee, zn = yo(re, [
          Ee,
          Math.max(Ee, $n - Fn)
        ]);
        l.style.minWidth = ye + "px", l.style.right = zn + "px";
      }
      const O = v(), L = window.innerHeight - Ee * 2, z = g.scrollHeight, G = window.getComputedStyle(f), B = parseInt(G.borderTopWidth, 10), $ = parseInt(G.paddingTop, 10), _ = parseInt(G.borderBottomWidth, 10), H = parseInt(G.paddingBottom, 10), I = B + $ + z + H + _, ie = Math.min(y.offsetHeight * 5, I), Z = window.getComputedStyle(g), K = parseInt(Z.paddingTop, 10), ee = parseInt(Z.paddingBottom, 10), fe = P.top + P.height / 2 - Ee, xe = L - fe, X = y.offsetHeight / 2, N = y.offsetTop + X, q = B + $ + N, oe = I - q;
      if (q <= fe) {
        const J = O.length > 0 && y === O[O.length - 1].ref.current;
        l.style.bottom = "0px";
        const re = f.clientHeight - g.offsetTop - g.offsetHeight, Le = Math.max(
          xe,
          X + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (J ? ee : 0) + re + _
        ), ye = q + Le;
        l.style.height = ye + "px";
      } else {
        const J = O.length > 0 && y === O[0].ref.current;
        l.style.top = "0px";
        const Le = Math.max(
          fe,
          B + g.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (J ? K : 0) + X
        ) + oe;
        l.style.height = Le + "px", g.scrollTop = q - fe + g.offsetTop;
      }
      l.style.margin = `${Ee}px 0`, l.style.minHeight = ie + "px", l.style.maxHeight = L + "px", r?.(), requestAnimationFrame(() => b.current = !0);
    }
  }, [
    v,
    i.trigger,
    i.valueNode,
    l,
    f,
    g,
    y,
    C,
    i.dir,
    r
  ]);
  ne(() => x(), [x]);
  const [S, R] = c.useState();
  ne(() => {
    f && R(window.getComputedStyle(f).zIndex);
  }, [f]);
  const E = c.useCallback(
    (P) => {
      P && h.current === !0 && (x(), w?.(), h.current = !1);
    },
    [x, w]
  );
  return /* @__PURE__ */ m(
    Cm,
    {
      scope: o,
      contentWrapper: l,
      shouldExpandOnScrollRef: b,
      onScrollButtonChange: E,
      children: /* @__PURE__ */ m(
        "div",
        {
          ref: u,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: S
          },
          children: /* @__PURE__ */ m(
            W.div,
            {
              ...a,
              ref: p,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...a.style
              }
            }
          )
        }
      )
    }
  );
}, "SelectItemAlignedPosition")), Hr = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ Y(function(t, n) {
  const {
    __scopeSelect: o,
    align: r = "start",
    collisionPadding: a = Ee,
    ...i
  } = t, s = Jo(o);
  return /* @__PURE__ */ m(
    _n,
    {
      ...s,
      ...i,
      ref: n,
      align: r,
      collisionPadding: a,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...i.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
}, "SelectPopperPosition")), [Cm, er] = ut(it, {}), Ur = "SelectViewport", Sm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o, nonce: r, ...a } = t, i = dt(Ur, o), s = er(Ur, o), l = j(n, i.onViewportChange), u = c.useRef(0);
    return /* @__PURE__ */ de(st, { children: [
      /* @__PURE__ */ m(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: r
        }
      ),
      /* @__PURE__ */ m(Mn.Slot, { scope: o, children: /* @__PURE__ */ m(
        W.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...a,
          ref: l,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...a.style
          },
          onScroll: T(a.onScroll, (f) => {
            const d = f.currentTarget, { contentWrapper: p, shouldExpandOnScrollRef: v } = s;
            if (v?.current && p) {
              const b = Math.abs(u.current - d.scrollTop);
              if (b > 0) {
                const h = window.innerHeight - Ee * 2, g = parseFloat(p.style.minHeight), y = parseFloat(p.style.height), C = Math.max(g, y);
                if (C < h) {
                  const w = C + b, x = Math.min(h, w), S = w - x;
                  p.style.height = x + "px", p.style.bottom === "0px" && (d.scrollTop = S > 0 ? S : 0, p.style.justifyContent = "flex-end");
                }
              }
            }
            u.current = d.scrollTop;
          })
        }
      ) })
    ] });
  }, "SelectViewport")
), Rm = "SelectGroup", [Yh, Xh] = ut(Rm), Co = "SelectItem", [Pm, cs] = ut(Co), Em = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const {
      __scopeSelect: o,
      value: r,
      disabled: a = !1,
      textValue: i,
      ...s
    } = t, l = tt(Co, o), u = dt(Co, o), f = l.value === r, [d, p] = c.useState(i ?? ""), [v, b] = c.useState(!1), h = Se(
      (x) => u.itemRefCallback?.(x, r, a)
    ), g = j(n, h), y = _e(), C = c.useRef("touch"), w = /* @__PURE__ */ Y(() => {
      a || (l.onValueChange(r), l.onOpenChange(!1));
    }, "handleSelect");
    return /* @__PURE__ */ m(
      Pm,
      {
        scope: o,
        value: r,
        disabled: a,
        textId: y,
        isSelected: f,
        onItemTextChange: c.useCallback((x) => {
          p((S) => S || (x?.textContent ?? "").trim());
        }, []),
        children: /* @__PURE__ */ m(
          Mn.ItemSlot,
          {
            scope: o,
            value: r,
            disabled: a,
            textValue: d,
            children: /* @__PURE__ */ m(
              W.div,
              {
                role: "option",
                "aria-labelledby": y,
                "data-highlighted": v ? "" : void 0,
                "aria-selected": f && v,
                "data-state": f ? "checked" : "unchecked",
                "aria-disabled": a || void 0,
                "data-disabled": a ? "" : void 0,
                tabIndex: a ? void 0 : -1,
                ...s,
                ref: g,
                onFocus: T(s.onFocus, () => b(!0)),
                onBlur: T(s.onBlur, () => b(!1)),
                onClick: T(s.onClick, () => {
                  C.current !== "mouse" && w();
                }),
                onPointerUp: T(s.onPointerUp, () => {
                  C.current === "mouse" && w();
                }),
                onPointerDown: T(s.onPointerDown, (x) => {
                  C.current = x.pointerType;
                }),
                onPointerMove: T(s.onPointerMove, (x) => {
                  C.current = x.pointerType, a ? u.onItemLeave?.() : C.current === "mouse" && x.currentTarget.focus({ preventScroll: !0 });
                }),
                onPointerLeave: T(s.onPointerLeave, (x) => {
                  x.currentTarget === document.activeElement && u.onItemLeave?.();
                }),
                onKeyDown: T(s.onKeyDown, (x) => {
                  a || x.target !== x.currentTarget || u.searchRef?.current !== "" && x.key === " " || (nm.includes(x.key) && w(), x.key === " " && x.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }, "SelectItem")
), nn = "SelectItemText", _m = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o, className: r, style: a, ...i } = t, s = tt(nn, o), l = dt(nn, o), u = cs(nn, o), f = im(nn, o), [d, p] = c.useState(null), v = Se(
      (w) => l.itemTextRefCallback?.(w, u.value, u.disabled)
    ), b = j(
      n,
      p,
      u.onItemTextChange,
      v
    ), h = d?.textContent, g = c.useMemo(
      () => /* @__PURE__ */ m("option", { value: u.value, disabled: u.disabled, children: h }, u.value),
      [u.disabled, u.value, h]
    ), { onNativeOptionAdd: y, onNativeOptionRemove: C } = f;
    return ne(() => (y(g), () => C(g)), [y, C, g]), /* @__PURE__ */ de(st, { children: [
      /* @__PURE__ */ m(W.span, { id: u.textId, ...i, ref: b }),
      u.isSelected && s.valueNode && !s.valueNodeHasChildren && !Ht(s.value) ? Dt.createPortal(i.children, s.valueNode) : null
    ] });
  }, "SelectItemText")
), km = "SelectItemIndicator", Im = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Y(function(t, n) {
    const { __scopeSelect: o, ...r } = t;
    return cs(km, o).isSelected ? /* @__PURE__ */ m(W.span, { "aria-hidden": !0, ...r, ref: n }) : null;
  }, "SelectItemIndicator")
), Wr = "SelectScrollUpButton", Tm = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ Y(function(t, n) {
  const o = dt(Wr, t.__scopeSelect), r = er(Wr, t.__scopeSelect), [a, i] = c.useState(!1), s = j(n, r.onScrollButtonChange);
  return ne(() => {
    if (o.viewport && o.isPositioned) {
      let l = function() {
        const f = u.scrollTop > 0;
        i(f);
      };
      Y(l, "handleScroll");
      const u = o.viewport;
      return l(), u.addEventListener("scroll", l), () => u.removeEventListener("scroll", l);
    }
  }, [o.viewport, o.isPositioned]), a ? /* @__PURE__ */ m(
    ls,
    {
      ...t,
      ref: s,
      onAutoScroll: () => {
        const { viewport: l, selectedItem: u } = o;
        l && u && (l.scrollTop = l.scrollTop - u.offsetHeight);
      }
    }
  ) : null;
}, "SelectScrollUpButton")), Kr = "SelectScrollDownButton", Om = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ Y(function(t, n) {
  const o = dt(Kr, t.__scopeSelect), r = er(Kr, t.__scopeSelect), [a, i] = c.useState(!1), s = j(n, r.onScrollButtonChange);
  return ne(() => {
    if (o.viewport && o.isPositioned) {
      let l = function() {
        const f = u.scrollHeight - u.clientHeight, d = Math.ceil(u.scrollTop) < f;
        i(d);
      };
      Y(l, "handleScroll");
      const u = o.viewport;
      return l(), u.addEventListener("scroll", l), () => u.removeEventListener("scroll", l);
    }
  }, [o.viewport, o.isPositioned]), a ? /* @__PURE__ */ m(
    ls,
    {
      ...t,
      ref: s,
      onAutoScroll: () => {
        const { viewport: l, selectedItem: u } = o;
        l && u && (l.scrollTop = l.scrollTop + u.offsetHeight);
      }
    }
  ) : null;
}, "SelectScrollDownButton")), ls = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ Y(function(t, n) {
  const { __scopeSelect: o, onAutoScroll: r, ...a } = t, i = dt("SelectScrollButton", o), s = c.useRef(null), l = Dn(o), u = c.useCallback(() => {
    s.current !== null && (window.clearInterval(s.current), s.current = null);
  }, []);
  return c.useEffect(() => () => u(), [u]), ne(() => {
    l().find((d) => d.ref.current === document.activeElement)?.ref.current?.scrollIntoView({ block: "nearest" });
  }, [l]), /* @__PURE__ */ m(
    W.div,
    {
      "aria-hidden": !0,
      ...a,
      ref: n,
      style: { flexShrink: 0, ...a.style },
      onPointerDown: T(a.onPointerDown, () => {
        s.current === null && (s.current = window.setInterval(r, 50));
      }),
      onPointerMove: T(a.onPointerMove, () => {
        i.onItemLeave?.(), s.current === null && (s.current = window.setInterval(r, 50));
      }),
      onPointerLeave: T(a.onPointerLeave, () => {
        u();
      })
    }
  );
}, "SelectScrollButtonImpl")), Am = "SelectBubbleInput", Mm = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Y(function({ __scopeSelect: t, ...n }, o) {
    const r = tt(Am, t), { value: a, onValueChange: i, required: s, disabled: l, name: u, autoComplete: f, form: d } = r, { nativeOptions: p, nativeSelectKey: v } = r, b = c.useRef(null), h = j(o, b), g = a ?? "", y = qi(g), C = Array.from(p).some(
      (w) => (w.props.value ?? "") === ""
    );
    return c.useEffect(() => {
      const w = b.current;
      if (!w) return;
      const x = window.HTMLSelectElement.prototype, R = Object.getOwnPropertyDescriptor(
        x,
        "value"
      ).set;
      if (y !== g && R) {
        const E = new Event("change", { bubbles: !0 });
        R.call(w, g), w.dispatchEvent(E);
      }
    }, [y, g]), /* @__PURE__ */ de(
      W.select,
      {
        "aria-hidden": !0,
        required: s,
        tabIndex: -1,
        name: u,
        autoComplete: f,
        disabled: l,
        form: d,
        onChange: (w) => i(w.target.value),
        ...n,
        style: { ...Ra, ...n.style },
        ref: h,
        defaultValue: g,
        children: [
          Ht(a) && !C ? /* @__PURE__ */ m("option", { value: "" }) : null,
          Array.from(p)
        ]
      },
      v
    );
  }, "SelectBubbleInput")
);
function us(e) {
  return typeof e == "function";
}
Y(us, "isFunction");
function Ht(e) {
  return e === "" || e === void 0;
}
Y(Ht, "shouldShowPlaceholder");
function tr(e) {
  const t = Se(e), n = c.useRef(""), o = c.useRef(0), r = c.useCallback(
    (i) => {
      const s = n.current + i;
      t(s), (/* @__PURE__ */ Y((function l(u) {
        n.current = u, window.clearTimeout(o.current), u !== "" && (o.current = window.setTimeout(() => l(""), 1e3));
      }), "updateSearch"))(s);
    },
    [t]
  ), a = c.useCallback(() => {
    n.current = "", window.clearTimeout(o.current);
  }, []);
  return c.useEffect(() => () => window.clearTimeout(o.current), []), [n, r, a];
}
Y(tr, "useTypeaheadSearch");
function nr(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t, a = n ? e.indexOf(n) : -1;
  let i = ds(e, Math.max(a, 0));
  r.length === 1 && (i = i.filter((u) => u !== n));
  const l = i.find(
    (u) => u.textValue.toLowerCase().startsWith(r.toLowerCase())
  );
  return l !== n ? l : void 0;
}
Y(nr, "findNextItem");
function ds(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
Y(ds, "wrapArray");
var Dm = Object.defineProperty, Ze = (e, t) => Dm(e, "name", { value: t, configurable: !0 }), or = "Switch", [Nm, qh] = /* @__PURE__ */ ge(or), [Lm, rr] = Nm(or);
function fs(e) {
  const {
    __scopeSwitch: t,
    checked: n,
    children: o,
    defaultChecked: r,
    disabled: a,
    form: i,
    name: s,
    onCheckedChange: l,
    required: u,
    value: f = "on",
    // @ts-expect-error
    internal_do_not_use_render: d
  } = e, [p, v] = Ie({
    prop: n,
    defaultProp: r ?? !1,
    onChange: l,
    caller: or
  }), [b, h] = c.useState(null), [g, y] = c.useState(null), C = c.useRef(!1), [w, x] = c.useReducer(
    (E) => E + 1,
    0
  ), S = b ? !!i || !!b.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), R = {
    checked: p,
    setChecked: v,
    disabled: a,
    control: b,
    setControl: h,
    name: s,
    form: i,
    value: f,
    hasConsumerStoppedPropagationRef: C,
    userInteractionCount: w,
    onUserInteraction: x,
    required: u,
    defaultChecked: r,
    isFormControl: S,
    bubbleInput: g,
    setBubbleInput: y
  };
  return /* @__PURE__ */ m(Lm, { scope: t, ...R, children: ps(d) ? d(R) : o });
}
Ze(fs, "SwitchProvider");
var Fm = "SwitchTrigger", $m = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Ze(function({ __scopeSwitch: t, onClick: n, ...o }, r) {
    const {
      control: a,
      form: i,
      value: s,
      disabled: l,
      checked: u,
      required: f,
      setControl: d,
      setChecked: p,
      hasConsumerStoppedPropagationRef: v,
      onUserInteraction: b,
      isFormControl: h,
      bubbleInput: g
    } = rr(Fm, t), y = j(r, d), C = c.useRef(u);
    return c.useEffect(() => {
      const w = i ? a?.ownerDocument.getElementById(i) : a?.form;
      if (w instanceof HTMLFormElement) {
        const x = /* @__PURE__ */ Ze(() => p(C.current), "reset");
        return w.addEventListener("reset", x), () => w.removeEventListener("reset", x);
      }
    }, [a, i, p]), /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        role: "switch",
        "aria-checked": u,
        "aria-required": f,
        "data-state": ar(u),
        "data-disabled": l ? "" : void 0,
        disabled: l,
        value: s,
        ...o,
        ref: y,
        onClick: T(n, (w) => {
          b(), p((x) => !x), g && h && (v.current = w.isPropagationStopped(), v.current || w.stopPropagation());
        })
      }
    );
  }, "SwitchTrigger")
), zm = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Ze(function(t, n) {
    const {
      __scopeSwitch: o,
      name: r,
      checked: a,
      defaultChecked: i,
      required: s,
      disabled: l,
      value: u,
      onCheckedChange: f,
      form: d,
      ...p
    } = t;
    return /* @__PURE__ */ m(
      fs,
      {
        __scopeSwitch: o,
        checked: a,
        defaultChecked: i,
        disabled: l,
        required: s,
        onCheckedChange: f,
        name: r,
        form: d,
        value: u,
        internal_do_not_use_render: ({ isFormControl: v }) => /* @__PURE__ */ de(st, { children: [
          /* @__PURE__ */ m(
            $m,
            {
              ...p,
              ref: n,
              __scopeSwitch: o
            }
          ),
          v && /* @__PURE__ */ m(
            Gm,
            {
              __scopeSwitch: o
            }
          )
        ] })
      }
    );
  }, "Switch")
), Bm = "SwitchThumb", Vm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Ze(function(t, n) {
    const { __scopeSwitch: o, ...r } = t, a = rr(Bm, o);
    return /* @__PURE__ */ m(
      W.span,
      {
        "data-state": ar(a.checked),
        "data-disabled": a.disabled ? "" : void 0,
        ...r,
        ref: n
      }
    );
  }, "SwitchThumb")
), jm = "SwitchBubbleInput", Gm = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Ze(function({ __scopeSwitch: t, onClick: n, ...o }, r) {
    const {
      control: a,
      hasConsumerStoppedPropagationRef: i,
      userInteractionCount: s,
      checked: l,
      defaultChecked: u,
      required: f,
      disabled: d,
      name: p,
      value: v,
      form: b,
      bubbleInput: h,
      setBubbleInput: g
    } = rr(jm, t), y = j(r, g), C = Bt(a), w = c.useRef(!1), x = c.useRef(l), S = c.useRef(s);
    c.useEffect(() => {
      const E = h;
      if (!E) return;
      const P = window.HTMLInputElement.prototype, D = Object.getOwnPropertyDescriptor(
        P,
        "checked"
      ).set, F = s !== S.current;
      S.current = s;
      const O = x.current !== l;
      x.current = l;
      const L = !(F && i.current);
      if (O && D) {
        w.current = !F;
        const z = new Event("click", { bubbles: L });
        D.call(E, l), E.dispatchEvent(z), w.current = !1;
      }
    }, [h, l, i, s]);
    const R = c.useRef(l);
    return /* @__PURE__ */ m(
      W.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: u ?? R.current,
        required: f,
        disabled: d,
        name: p,
        value: v,
        form: b,
        ...o,
        tabIndex: -1,
        ref: y,
        onClick: T(n, (E) => {
          w.current && E.stopPropagation();
        }),
        style: {
          ...o.style,
          ...C,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }, "SwitchBubbleInput")
);
function ps(e) {
  return typeof e == "function";
}
Ze(ps, "isFunction");
function ar(e) {
  return e ? "checked" : "unchecked";
}
Ze(ar, "getState");
var Hm = Object.defineProperty, ce = (e, t) => Hm(e, "name", { value: t, configurable: !0 }), [ir, Zh] = /* @__PURE__ */ ge("Tooltip", [
  Je
]), Nn = Je(), Um = "TooltipProvider", Wm = 700, So = "tooltip.open", [Km, sr] = ir(Um), Ym = /* @__PURE__ */ ce((e) => {
  const {
    __scopeTooltip: t,
    delayDuration: n = Wm,
    skipDelayDuration: o = 300,
    disableHoverableContent: r = !1,
    children: a
  } = e, i = c.useRef(!0), s = c.useRef(!1), l = c.useRef(0);
  return c.useEffect(() => {
    const u = l.current;
    return () => window.clearTimeout(u);
  }, []), /* @__PURE__ */ m(
    Km,
    {
      scope: t,
      isOpenDelayedRef: i,
      delayDuration: n,
      onOpen: c.useCallback(() => {
        o <= 0 || (window.clearTimeout(l.current), i.current = !1);
      }, [o]),
      onClose: c.useCallback(() => {
        o <= 0 || (window.clearTimeout(l.current), l.current = window.setTimeout(
          () => i.current = !0,
          o
        ));
      }, [o]),
      isPointerInTransitRef: s,
      onPointerInTransitChange: c.useCallback((u) => {
        s.current = u;
      }, []),
      disableHoverableContent: r,
      children: a
    }
  );
}, "TooltipProvider"), Ro = "Tooltip", [Xm, Ut] = ir(Ro), qm = /* @__PURE__ */ ce((e) => {
  const {
    __scopeTooltip: t,
    children: n,
    open: o,
    defaultOpen: r,
    onOpenChange: a,
    disableHoverableContent: i,
    delayDuration: s
  } = e, l = sr(Ro, e.__scopeTooltip), u = Nn(t), [f, d] = c.useState(null), [p, v] = c.useState(void 0), b = _e(), h = c.useRef(0), g = i ?? l.disableHoverableContent, y = s ?? l.delayDuration, C = c.useRef(!1), [w, x] = Ie({
    prop: o,
    defaultProp: r ?? !1,
    onChange: /* @__PURE__ */ ce((D) => {
      D ? (l.onOpen(), document.dispatchEvent(new CustomEvent(So))) : l.onClose(), a?.(D);
    }, "onChange"),
    caller: Ro
  }), S = c.useMemo(() => w ? C.current ? "delayed-open" : "instant-open" : "closed", [w]), R = c.useCallback(() => {
    window.clearTimeout(h.current), h.current = 0, C.current = !1, x(!0);
  }, [x]), E = c.useCallback(() => {
    window.clearTimeout(h.current), h.current = 0, x(!1);
  }, [x]), P = c.useCallback(() => {
    window.clearTimeout(h.current), h.current = window.setTimeout(() => {
      C.current = !0, x(!0), h.current = 0;
    }, y);
  }, [y, x]);
  return c.useEffect(() => () => {
    h.current && (window.clearTimeout(h.current), h.current = 0);
  }, []), /* @__PURE__ */ m(Pn, { ...u, children: /* @__PURE__ */ m(
    Xm,
    {
      scope: t,
      contentId: p ?? b,
      setContentId: v,
      open: w,
      stateAttribute: S,
      trigger: f,
      onTriggerChange: d,
      onTriggerEnter: c.useCallback(() => {
        l.isOpenDelayedRef.current ? P() : R();
      }, [l.isOpenDelayedRef, P, R]),
      onTriggerLeave: c.useCallback(() => {
        g ? E() : (window.clearTimeout(h.current), h.current = 0);
      }, [E, g]),
      onOpen: R,
      onClose: E,
      disableHoverableContent: g,
      children: n
    }
  ) });
}, "Tooltip"), Yr = "TooltipTrigger", Zm = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ ce(function(t, n) {
    const { __scopeTooltip: o, ...r } = t, a = Ut(Yr, o), i = sr(Yr, o), s = Nn(o), l = c.useRef(null), u = j(n, l, a.onTriggerChange), f = c.useRef(!1), d = c.useRef(!1), p = c.useCallback(() => f.current = !1, []);
    return c.useEffect(() => () => document.removeEventListener("pointerup", p), [p]), /* @__PURE__ */ m(En, { asChild: !0, ...s, children: /* @__PURE__ */ m(
      W.button,
      {
        "aria-describedby": a.open ? a.contentId : void 0,
        "data-state": a.stateAttribute,
        ...r,
        ref: u,
        onPointerMove: T(t.onPointerMove, (v) => {
          v.pointerType !== "touch" && !d.current && !i.isPointerInTransitRef.current && (a.onTriggerEnter(), d.current = !0);
        }),
        onPointerLeave: T(t.onPointerLeave, () => {
          a.onTriggerLeave(), d.current = !1;
        }),
        onPointerDown: T(t.onPointerDown, () => {
          a.open && a.onClose(), f.current = !0, document.addEventListener("pointerup", p, { once: !0 });
        }),
        onFocus: T(t.onFocus, () => {
          f.current || a.onOpen();
        }),
        onBlur: T(t.onBlur, a.onClose),
        onClick: T(t.onClick, a.onClose)
      }
    ) });
  }, "TooltipTrigger")
), ms = "TooltipPortal", [Qm, Jm] = ir(ms, {
  forceMount: void 0
}), eh = /* @__PURE__ */ ce((e) => {
  const { __scopeTooltip: t, forceMount: n, children: o, container: r } = e, a = Ut(ms, t);
  return /* @__PURE__ */ m(Qm, { scope: t, forceMount: n, children: /* @__PURE__ */ m(Re, { present: n || a.open, children: /* @__PURE__ */ m($t, { asChild: !0, container: r, children: o }) }) });
}, "TooltipPortal"), Mt = "TooltipContent", th = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ ce(function(t, n) {
    const o = Jm(Mt, t.__scopeTooltip), { forceMount: r = o.forceMount, side: a = "top", ...i } = t, s = Ut(Mt, t.__scopeTooltip);
    return /* @__PURE__ */ m(Re, { present: r || s.open, children: s.disableHoverableContent ? /* @__PURE__ */ m(hs, { side: a, ...i, ref: n }) : /* @__PURE__ */ m(nh, { side: a, ...i, ref: n }) });
  }, "TooltipContent")
), nh = /* @__PURE__ */ c.forwardRef(/* @__PURE__ */ ce(function(t, n) {
  const o = Ut(Mt, t.__scopeTooltip), r = sr(Mt, t.__scopeTooltip), a = c.useRef(null), i = j(n, a), [s, l] = c.useState(null), { trigger: u, onClose: f } = o, d = a.current, { onPointerInTransitChange: p } = r, v = c.useCallback(() => {
    l(null), p(!1);
  }, [p]), b = c.useCallback(
    (h, g) => {
      const y = h.currentTarget, C = { x: h.clientX, y: h.clientY }, w = gs(C, y.getBoundingClientRect()), x = vs(C, w), S = bs(g.getBoundingClientRect()), R = xs([...x, ...S]);
      l(R), p(!0);
    },
    [p]
  );
  return c.useEffect(() => () => v(), [v]), c.useEffect(() => {
    if (u && d) {
      const h = /* @__PURE__ */ ce((y) => b(y, d), "handleTriggerLeave"), g = /* @__PURE__ */ ce((y) => b(y, u), "handleContentLeave");
      return u.addEventListener("pointerleave", h), d.addEventListener("pointerleave", g), () => {
        u.removeEventListener("pointerleave", h), d.removeEventListener("pointerleave", g);
      };
    }
  }, [u, d, b, v]), c.useEffect(() => {
    if (s) {
      const h = /* @__PURE__ */ ce((g) => {
        const y = g.target, C = { x: g.clientX, y: g.clientY }, w = u?.contains(y) || d?.contains(y), x = !ws(C, s);
        w ? v() : x && (v(), f());
      }, "handleTrackPointerGrace");
      return document.addEventListener("pointermove", h), () => document.removeEventListener("pointermove", h);
    }
  }, [u, d, s, f, v]), /* @__PURE__ */ m(hs, { ...t, ref: i });
}, "TooltipContentHoverable")), oh = /* @__PURE__ */ ra("TooltipContent"), hs = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ce(function(t, n) {
    const {
      __scopeTooltip: o,
      children: r,
      "aria-label": a,
      id: i,
      onEscapeKeyDown: s,
      onPointerDownOutside: l,
      ...u
    } = t, f = Ut(Mt, o), d = Nn(o), { onClose: p } = f;
    c.useEffect(() => (document.addEventListener(So, p), () => document.removeEventListener(So, p)), [p]), c.useEffect(() => {
      if (f.trigger) {
        const b = /* @__PURE__ */ ce((h) => {
          h.target instanceof Node && h.target.contains(f.trigger) && p();
        }, "handleScroll");
        return window.addEventListener("scroll", b, { capture: !0 }), () => window.removeEventListener("scroll", b, { capture: !0 });
      }
    }, [f.trigger, p]);
    const { setContentId: v } = f;
    return ne(() => (v(i), () => {
      v(void 0);
    }), [i, v]), /* @__PURE__ */ m(
      Ft,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: s,
        onPointerDownOutside: l,
        onFocusOutside: (b) => b.preventDefault(),
        onDismiss: p,
        children: /* @__PURE__ */ de(
          _n,
          {
            "data-state": f.stateAttribute,
            role: a ? void 0 : "tooltip",
            id: a ? void 0 : f.contentId,
            ...d,
            ...u,
            ref: n,
            style: {
              ...u.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ m(oh, { children: r }),
              a ? /* @__PURE__ */ m(Zc, { id: f.contentId, role: "tooltip", children: a }) : null
            ]
          }
        )
      }
    );
  }, "TooltipContentImpl")
), rh = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ ce(function(t, n) {
    const { __scopeTooltip: o, ...r } = t, a = Nn(o);
    return /* @__PURE__ */ m(uf, { ...a, ...r, ref: n });
  }, "TooltipArrow")
);
function gs(e, t) {
  const n = Math.abs(t.top - e.y), o = Math.abs(t.bottom - e.y), r = Math.abs(t.right - e.x), a = Math.abs(t.left - e.x);
  switch (Math.min(n, o, r, a)) {
    case a:
      return "left";
    case r:
      return "right";
    case n:
      return "top";
    case o:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
ce(gs, "getExitSideFromRect");
function vs(e, t, n = 5) {
  const o = [];
  switch (t) {
    case "top":
      o.push(
        { x: e.x - n, y: e.y + n },
        { x: e.x + n, y: e.y + n }
      );
      break;
    case "bottom":
      o.push(
        { x: e.x - n, y: e.y - n },
        { x: e.x + n, y: e.y - n }
      );
      break;
    case "left":
      o.push(
        { x: e.x + n, y: e.y - n },
        { x: e.x + n, y: e.y + n }
      );
      break;
    case "right":
      o.push(
        { x: e.x - n, y: e.y - n },
        { x: e.x - n, y: e.y + n }
      );
      break;
  }
  return o;
}
ce(vs, "getPaddedExitPoints");
function bs(e) {
  const { top: t, right: n, bottom: o, left: r } = e;
  return [
    { x: r, y: t },
    { x: n, y: t },
    { x: n, y: o },
    { x: r, y: o }
  ];
}
ce(bs, "getPointsFromRect");
function ws(e, t) {
  const { x: n, y: o } = e;
  let r = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const s = t[a], l = t[i], u = s.x, f = s.y, d = l.x, p = l.y;
    f > o != p > o && n < (d - u) * (o - f) / (p - f) + u && (r = !r);
  }
  return r;
}
ce(ws, "isPointInPolygon");
function xs(e) {
  const t = e.slice();
  return t.sort((n, o) => n.x < o.x ? -1 : n.x > o.x ? 1 : n.y < o.y ? -1 : n.y > o.y ? 1 : 0), ys(t);
}
ce(xs, "getHull");
function ys(e) {
  if (e.length <= 1) return e.slice();
  const t = [];
  for (let o = 0; o < e.length; o++) {
    const r = e[o];
    for (; t.length >= 2; ) {
      const a = t[t.length - 1], i = t[t.length - 2];
      if ((a.x - i.x) * (r.y - i.y) >= (a.y - i.y) * (r.x - i.x)) t.pop();
      else break;
    }
    t.push(r);
  }
  t.pop();
  const n = [];
  for (let o = e.length - 1; o >= 0; o--) {
    const r = e[o];
    for (; n.length >= 2; ) {
      const a = n[n.length - 1], i = n[n.length - 2];
      if ((a.x - i.x) * (r.y - i.y) >= (a.y - i.y) * (r.x - i.x)) n.pop();
      else break;
    }
    n.push(r);
  }
  return n.pop(), t.length === 1 && n.length === 1 && t[0].x === n[0].x && t[0].y === n[0].y ? t : t.concat(n);
}
ce(ys, "getHullPresorted");
var ah = Ym, ih = qm, sh = Zm, ch = eh, lh = th, uh = rh;
const dh = Xr(void 0);
function Ln(e) {
  return qr(dh) ?? e;
}
function Qh({
  ...e
}) {
  return /* @__PURE__ */ m(lp, { "data-slot": "dropdown-menu", ...e });
}
function Jh({
  ...e
}) {
  return /* @__PURE__ */ m(
    up,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function eg({
  className: e,
  sideOffset: t = 4,
  variant: n = "default",
  portalContainer: o,
  style: r,
  ...a
}) {
  const i = Ln();
  return /* @__PURE__ */ m(
    dp,
    {
      container: o,
      forceMount: a.forceMount,
      children: /* @__PURE__ */ m(
        fp,
        {
          "data-slot": "dropdown-menu-content",
          "data-variant": n,
          sideOffset: t,
          style: { zIndex: i, ...r },
          className: V(
            "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            n === "compact" && "w-36 rounded-[12px] border-0 p-2 shadow-[0_4px_8px_rgba(29,38,26,0.08)] [&_[data-slot=dropdown-menu-radio-item]]:h-8 [&_[data-slot=dropdown-menu-radio-item]]:rounded-md [&_[data-slot=dropdown-menu-radio-item]]:px-2 [&_[data-slot=dropdown-menu-radio-item]]:py-0 [&_[data-slot=dropdown-menu-radio-item]]:gap-2 [&_[data-slot=dropdown-menu-radio-item]]:text-xs [&_[data-slot=dropdown-menu-radio-item]]:text-muted-foreground [&_[data-slot=dropdown-menu-radio-item][data-state=checked]]:bg-accent [&_[data-slot=dropdown-menu-radio-item]>span:first-child]:hidden",
            e
          ),
          ...a
        }
      )
    }
  );
}
function tg({
  className: e,
  inset: t,
  variant: n = "default",
  ...o
}) {
  return /* @__PURE__ */ m(
    pp,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": n,
      className: V(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        e
      ),
      ...o
    }
  );
}
function fh({
  delayDuration: e = 0,
  ...t
}) {
  return /* @__PURE__ */ m(
    ah,
    {
      "data-slot": "tooltip-provider",
      delayDuration: e,
      ...t
    }
  );
}
function ng({
  ...e
}) {
  return /* @__PURE__ */ m(fh, { children: /* @__PURE__ */ m(ih, { "data-slot": "tooltip", ...e }) });
}
function og({
  ...e
}) {
  return /* @__PURE__ */ m(sh, { "data-slot": "tooltip-trigger", ...e });
}
function rg({
  className: e,
  sideOffset: t = 0,
  portalContainer: n,
  children: o,
  style: r,
  ...a
}) {
  const i = Ln();
  return /* @__PURE__ */ m(ch, { container: n, children: /* @__PURE__ */ de(
    lh,
    {
      "data-slot": "tooltip-content",
      sideOffset: t,
      style: { zIndex: i, ...r },
      className: V(
        "bg-foreground pointer-events-none text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        e
      ),
      ...a,
      children: [
        o,
        /* @__PURE__ */ m(uh, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const Cs = mn("", {
  variants: {
    controlSize: {
      default: "",
      sm: "h-[34px] rounded-[9px] bg-background text-[13px] shadow-none md:text-[13px]",
      lg: "h-[52px] rounded-lg text-base leading-6 shadow-none md:text-base focus-visible:ring-2 focus-visible:ring-ring/50"
    },
    invalidTone: {
      destructive: "",
      validation: "aria-invalid:border-validation aria-invalid:shadow-[0_1px_2px_0_var(--color-validation-shadow)] aria-invalid:ring-0 focus:aria-invalid:border-validation focus-visible:aria-invalid:border-validation"
    }
  },
  defaultVariants: { controlSize: "default", invalidTone: "destructive" }
});
function ph({
  className: e,
  type: t,
  controlSize: n,
  invalidTone: o,
  ...r
}) {
  return /* @__PURE__ */ m(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: V(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-input focus-visible:border-input",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        Cs({ controlSize: n, invalidTone: o }),
        e
      ),
      ...r
    }
  );
}
function ag({
  className: e,
  size: t = "default",
  ...n
}) {
  return /* @__PURE__ */ m(
    zm,
    {
      "data-slot": "switch",
      "data-size": t,
      className: V(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2f2c29]/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#2f2c29]",
        t === "lg" && "h-6 w-11",
        e
      ),
      ...n,
      children: /* @__PURE__ */ m(
        Vm,
        {
          className: V(
            "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
            t === "lg" && "size-5 data-[state=checked]:translate-x-5"
          )
        }
      )
    }
  );
}
function ig({
  className: e,
  variant: t = "default",
  ...n
}) {
  return /* @__PURE__ */ m(
    Fu,
    {
      "data-slot": "checkbox",
      className: V(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        t === "brand" && "data-[state=checked]:border-link data-[state=checked]:bg-link data-[state=checked]:text-white",
        e
      ),
      ...n,
      children: /* @__PURE__ */ m(
        zu,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ m(Jr, { className: "size-3.5" })
        }
      )
    }
  );
}
function sg({
  className: e,
  controlSize: t,
  invalidTone: n,
  ...o
}) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "input-group",
      role: "group",
      "data-control-size": t,
      className: V(
        "group/input-group border-input relative flex h-9 w-full min-w-0 items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30",
        "has-[>textarea]:h-auto",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        n !== "validation" && "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        Cs({ controlSize: t, invalidTone: n }),
        t === "sm" && "[&>input]:h-full [&>input]:text-[13px] [&>[data-align=inline-start]]:pl-2.5",
        t === "lg" && "[&>input]:h-full [&>input]:text-base [&>input]:leading-6",
        n === "validation" && "has-[[data-slot][aria-invalid=true]]:border-validation has-[[data-slot][aria-invalid=true]]:shadow-[0_1px_2px_0_var(--color-validation-shadow)] has-[[data-slot][aria-invalid=true]]:ring-0",
        e
      ),
      ...o
    }
  );
}
const mh = mn(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end": "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start": "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
        "block-end": "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
function cg({
  className: e,
  align: t = "inline-start",
  ...n
}) {
  return /* @__PURE__ */ m(
    "div",
    {
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": t,
      className: V(mh({ align: t }), e),
      onClick: (o) => {
        o.target.closest("button") || o.currentTarget.parentElement?.querySelector("input")?.focus();
      },
      ...n
    }
  );
}
const hh = mn(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0"
      }
    },
    defaultVariants: {
      size: "xs"
    }
  }
);
function lg({
  className: e,
  type: t = "button",
  variant: n = "ghost",
  size: o = "xs",
  ...r
}) {
  return /* @__PURE__ */ m(
    Hc,
    {
      type: t,
      "data-size": o,
      variant: n,
      className: V(hh({ size: o }), e),
      ...r
    }
  );
}
function ug({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "span",
    {
      className: V(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        e
      ),
      ...t
    }
  );
}
function dg({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    ph,
    {
      "data-slot": "input-group-control",
      className: V(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        e
      ),
      ...t
    }
  );
}
function fg({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    Kp,
    {
      "data-slot": "radio-group",
      className: V("flex flex-wrap items-center gap-4", e),
      ...t
    }
  );
}
function gh({
  className: e,
  tone: t = "default",
  ...n
}) {
  return /* @__PURE__ */ m(
    Zp,
    {
      "data-slot": "radio-group-item",
      "data-tone": t,
      className: V(
        "border-input text-primary aspect-square size-4 shrink-0 cursor-pointer rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        t === "info" && "border-2 border-[#b9c0c9] bg-white shadow-none data-[state=checked]:border-[#1677ff]",
        e
      ),
      ...n,
      children: /* @__PURE__ */ m(
        Jp,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ m(
            "span",
            {
              className: V(
                "bg-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                t === "info" && "size-1.5 bg-[#1677ff]"
              )
            }
          )
        }
      )
    }
  );
}
function pg({
  value: e,
  label: t,
  disabled: n,
  className: o
}) {
  const r = c.useId();
  return /* @__PURE__ */ de("div", { className: V("flex items-center gap-2", o), children: [
    /* @__PURE__ */ m(gh, { disabled: n, id: r, value: e }),
    /* @__PURE__ */ m(
      "label",
      {
        className: V(
          "cursor-pointer text-sm",
          n && "cursor-not-allowed text-muted-foreground"
        ),
        htmlFor: r,
        children: t
      }
    )
  ] });
}
const cr = c.createContext(null);
function mg({
  open: e,
  defaultOpen: t,
  onOpenChange: n,
  value: o,
  defaultValue: r,
  onValueChange: a,
  clearable: i = !1,
  ...s
}) {
  const l = c.useId(), u = e !== void 0, [f, d] = c.useState(
    t ?? !1
  ), p = o !== void 0, [v, b] = c.useState(
    r ?? ""
  ), h = u ? e : f, g = p ? o : v, y = c.useCallback(
    (S) => {
      u || d(S), n?.(S);
    },
    [u, n]
  ), C = c.useCallback(
    (S) => {
      p || b(S), a?.(S);
    },
    [p, a]
  ), w = c.useCallback(() => {
    C(""), y(!1);
  }, [C, y]), x = c.useMemo(
    () => ({
      id: l,
      clearable: i,
      hasValue: g.length > 0,
      clear: w
    }),
    [w, i, g, l]
  );
  return c.useEffect(() => {
    if (!h) return;
    const S = (R) => {
      const E = R.target;
      if (!(E instanceof Element)) return;
      const P = E.closest("[data-select-id]");
      P instanceof HTMLElement && P.getAttribute("data-select-id") === l || y(!1);
    };
    return document.addEventListener("pointerdown", S, !0), () => document.removeEventListener("pointerdown", S, !0);
  }, [l, h, y]), /* @__PURE__ */ m(cr.Provider, { value: x, children: /* @__PURE__ */ m(
    sm,
    {
      "data-slot": "select",
      ...s,
      onOpenChange: y,
      onValueChange: C,
      open: h,
      value: g
    }
  ) });
}
function hg({
  ...e
}) {
  return /* @__PURE__ */ m(dm, { "data-slot": "select-value", ...e });
}
function gg({
  className: e,
  indicatorClassName: t,
  size: n = "default",
  variant: o = "default",
  children: r,
  ...a
}) {
  const i = c.useContext(cr), s = !!(i?.clearable && i.hasValue);
  return /* @__PURE__ */ de(
    lm,
    {
      "data-select-id": i?.id,
      "data-slot": "select-trigger",
      "data-size": n,
      "data-variant": o,
      className: V(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        n === "default" && "h-9",
        n === "sm" && "h-8",
        n === "parameter" && "h-10 rounded-[8px] text-xs shadow-none",
        o === "plain" && "h-6 gap-1 rounded-none border-0 p-0 shadow-none",
        s && "group/select",
        n === "compact" && "h-[34px] gap-[5px] rounded-[9px] bg-background px-2 py-0 text-xs shadow-none",
        e
      ),
      ...a,
      children: [
        r,
        /* @__PURE__ */ m(fm, { asChild: !0, children: /* @__PURE__ */ de(
          "span",
          {
            className: V(
              "relative flex size-4 items-center justify-center",
              t
            ),
            children: [
              /* @__PURE__ */ m(
                ea,
                {
                  className: V(
                    "size-4 opacity-50 transition-opacity",
                    s && "group-hover/select:opacity-0"
                  )
                }
              ),
              s && /* @__PURE__ */ m(
                "span",
                {
                  "data-slot": "select-clear",
                  className: "absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover/select:opacity-100",
                  onPointerDown: (l) => {
                    l.preventDefault(), l.stopPropagation(), i?.clear();
                  },
                  onClick: (l) => l.stopPropagation(),
                  children: /* @__PURE__ */ m(ta, { className: "size-4" })
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
function vg({
  className: e,
  children: t,
  portalContainer: n,
  position: o = "popper",
  align: r = "center",
  zIndex: a,
  style: i,
  ...s
}) {
  const l = c.useContext(cr), u = Ln(1e4);
  return /* @__PURE__ */ m(gm, { container: n, children: /* @__PURE__ */ de(
    vm,
    {
      "data-select-id": l?.id,
      "data-slot": "select-content",
      className: V(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        o === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        e
      ),
      style: { ...i, zIndex: a ?? u },
      position: o,
      align: r,
      ...s,
      children: [
        /* @__PURE__ */ m(vh, {}),
        /* @__PURE__ */ m(
          Sm,
          {
            className: V(
              "p-1",
              o === "popper" && "w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children: t
          }
        ),
        /* @__PURE__ */ m(bh, {})
      ]
    }
  ) });
}
function bg({
  className: e,
  children: t,
  ...n
}) {
  return /* @__PURE__ */ de(
    Em,
    {
      "data-slot": "select-item",
      className: V(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        e
      ),
      ...n,
      children: [
        /* @__PURE__ */ m(
          "span",
          {
            "data-slot": "select-item-indicator",
            className: "absolute right-2 flex size-3.5 items-center justify-center",
            children: /* @__PURE__ */ m(Im, { children: /* @__PURE__ */ m(Jr, { className: "size-4" }) })
          }
        ),
        /* @__PURE__ */ m(_m, { children: t })
      ]
    }
  );
}
function vh({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    Tm,
    {
      "data-slot": "select-scroll-up-button",
      className: V(
        "flex cursor-default items-center justify-center py-1",
        e
      ),
      ...t,
      children: /* @__PURE__ */ m(zs, { className: "size-4" })
    }
  );
}
function bh({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    Om,
    {
      "data-slot": "select-scroll-down-button",
      className: V(
        "flex cursor-default items-center justify-center py-1",
        e
      ),
      ...t,
      children: /* @__PURE__ */ m(ea, { className: "size-4" })
    }
  );
}
function wg({
  ...e
}) {
  return /* @__PURE__ */ m(Tp, { "data-slot": "popover", ...e });
}
function xg({
  ...e
}) {
  return /* @__PURE__ */ m(Op, { "data-slot": "popover-trigger", ...e });
}
function yg({
  className: e,
  align: t = "center",
  sideOffset: n = 4,
  container: o,
  zIndex: r,
  style: a,
  variant: i = "default",
  ...s
}) {
  const l = Ln(50);
  return /* @__PURE__ */ m(
    Ap,
    {
      container: o,
      forceMount: s.forceMount,
      children: /* @__PURE__ */ m(
        Mp,
        {
          "data-slot": "popover-content",
          "data-variant": i,
          align: t,
          sideOffset: n,
          className: V(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 text-sm shadow-md outline-hidden",
            i === "compact" && "p-1",
            i === "parameter" && "rounded-[12px] border-border p-[15px] shadow-[0_4px_8px_rgba(29,38,26,0.08)]",
            e
          ),
          style: { ...a, zIndex: r ?? l },
          ...s
        }
      )
    }
  );
}
function Cg({
  className: e,
  containerClassName: t,
  ...n
}) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "table-container",
      className: V(
        "relative w-full overflow-x-auto",
        t
      ),
      children: /* @__PURE__ */ m(
        "table",
        {
          "data-slot": "table",
          className: V("w-full caption-bottom text-sm", e),
          ...n
        }
      )
    }
  );
}
function Sg({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "thead",
    {
      "data-slot": "table-header",
      className: V("[&_tr]:border-b", e),
      ...t
    }
  );
}
function Rg({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "tbody",
    {
      "data-slot": "table-body",
      className: V("[&_tr:last-child]:border-0", e),
      ...t
    }
  );
}
function Pg({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "tr",
    {
      "data-slot": "table-row",
      className: V(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        e
      ),
      ...t
    }
  );
}
function Eg({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "th",
    {
      "data-slot": "table-head",
      className: V(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        e
      ),
      ...t
    }
  );
}
function _g({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "td",
    {
      "data-slot": "table-cell",
      className: V(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        e
      ),
      ...t
    }
  );
}
async function kg(e, t = {}, n) {
  return window.__TAURI_INTERNALS__.invoke(e, t, n);
}
function Ig() {
  if (typeof window > "u") return !1;
  const e = window;
  return typeof e.__TAURI_INTERNALS__?.invoke == "function" || typeof e.__TAURI__?.core?.invoke == "function";
}
function Tg({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "nav",
    {
      role: "navigation",
      "aria-label": "分页导航",
      "data-slot": "pagination",
      className: V("mx-auto flex w-full justify-center", e),
      ...t
    }
  );
}
function Og({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    "ul",
    {
      "data-slot": "pagination-content",
      className: V("flex flex-row items-center gap-1", e),
      ...t
    }
  );
}
function Ag({ ...e }) {
  return /* @__PURE__ */ m("li", { "data-slot": "pagination-item", ...e });
}
function Mg({
  className: e,
  isActive: t,
  size: n = "icon",
  ...o
}) {
  return /* @__PURE__ */ m(
    "a",
    {
      "aria-current": t ? "page" : void 0,
      "data-slot": "pagination-link",
      "data-active": t,
      className: V(
        Sa({
          variant: t ? "outline" : "ghost",
          size: n
        }),
        e
      ),
      ...o
    }
  );
}
function Dg({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ de(
    "span",
    {
      "aria-hidden": !0,
      "data-slot": "pagination-ellipsis",
      className: V("flex size-9 items-center justify-center", e),
      ...t,
      children: [
        /* @__PURE__ */ m(js, { className: "size-4" }),
        /* @__PURE__ */ m("span", { className: "sr-only", children: "更多页" })
      ]
    }
  );
}
const wh = [
  "flex max-h-[calc(100dvh-40px)] w-[680px] max-w-[calc(100%-48px)] flex-col gap-0 overflow-hidden rounded-[20px] border-0 bg-muted p-0 sm:max-w-[680px]",
  "[&>[data-slot=dialog-header]]:shrink-0 [&>[data-slot=dialog-header]]:px-6 [&>[data-slot=dialog-header]]:pt-9 [&>[data-slot=dialog-header]]:pb-4 [&>[data-slot=dialog-header]]:text-left",
  "[&>[data-slot=dialog-header]_[data-slot=dialog-title]]:text-xl [&>[data-slot=dialog-header]_[data-slot=dialog-title]]:leading-7 [&>[data-slot=dialog-header]_[data-slot=dialog-description]]:leading-5",
  "[&>[data-slot=dialog-body]]:min-h-0 [&>[data-slot=dialog-body]]:overflow-y-auto [&>[data-slot=dialog-body]]:overscroll-contain [&>[data-slot=dialog-body]]:px-6 [&>[data-slot=dialog-body]]:[scrollbar-width:thin] [&>[data-slot=dialog-body]]:[scrollbar-gutter:stable]",
  "[&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:mt-4 [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:mb-2 [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:flex [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:items-center [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:gap-1.5 [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:text-base [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:leading-6 [&>[data-slot=dialog-body]_[data-slot=dialog-section-title]]:font-medium",
  "[&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:rounded-xl [&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:border [&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:bg-background [&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:p-4 [&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:text-xs [&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:leading-5 [&>[data-slot=dialog-body]_[data-slot=dialog-prose]]:text-muted-foreground",
  "[&>[data-slot=dialog-body]_[data-slot=dialog-prose]>p]:mb-2 [&>[data-slot=dialog-body]_[data-slot=dialog-prose]>:last-child]:mb-0 [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_:is(h1,h2,h3,h4)]:my-3 [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_:is(h1,h2,h3,h4)]:font-semibold [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_ul]:list-disc [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_ol]:list-decimal [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_:is(ul,ol)]:pl-5 [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_:is(th,td)]:border [&>[data-slot=dialog-body]_[data-slot=dialog-prose]_:is(th,td)]:p-2",
  "[&>[data-slot=dialog-footer]]:relative [&>[data-slot=dialog-footer]]:mx-6 [&>[data-slot=dialog-footer]]:mt-4 [&>[data-slot=dialog-footer]]:shrink-0 [&>[data-slot=dialog-footer]]:flex-row [&>[data-slot=dialog-footer]]:justify-between [&>[data-slot=dialog-footer]]:border-t [&>[data-slot=dialog-footer]]:pt-3 [&>[data-slot=dialog-footer]]:pb-5",
  "[@media(max-width:480px),(max-height:480px)]:[&>[data-slot=dialog-header]]:px-4 [@media(max-width:480px),(max-height:480px)]:[&>[data-slot=dialog-header]]:pt-4 [@media(max-width:480px),(max-height:480px)]:[&>[data-slot=dialog-body]]:px-4 [@media(max-width:480px),(max-height:480px)]:[&>[data-slot=dialog-footer]]:mx-4 [@media(max-width:480px),(max-height:480px)]:[&>[data-slot=dialog-footer]]:mt-2 [@media(max-width:480px),(max-height:480px)]:[&>[data-slot=dialog-footer]]:pb-3"
];
function Ng({
  ...e
}) {
  return /* @__PURE__ */ m(hu, { "data-slot": "dialog", ...e });
}
function xh({
  ...e
}) {
  return /* @__PURE__ */ m(vu, { "data-slot": "dialog-portal", ...e });
}
function yh({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    bu,
    {
      "data-slot": "dialog-overlay",
      className: V(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50",
        e
      ),
      ...t
    }
  );
}
function Lg({
  className: e,
  children: t,
  variant: n = "default",
  showCloseButton: o = !0,
  portalContainer: r,
  closeOnEscape: a = !1,
  closeOnPointerDownOutside: i = !1,
  closeButtonClassName: s,
  overlayClassName: l,
  disableAnimation: u = !1,
  zIndex: f = 9999,
  style: d,
  onEscapeKeyDown: p,
  onPointerDownOutside: v,
  ...b
}) {
  return /* @__PURE__ */ de(xh, { "data-slot": "dialog-portal", container: r, children: [
    /* @__PURE__ */ m(
      yh,
      {
        className: V(
          n === "authorization" && "bg-white/60 backdrop-blur-[7.5px]",
          n === "catalog" && "bg-black/40 backdrop-blur-[3px]",
          l
        ),
        style: { zIndex: f }
      }
    ),
    /* @__PURE__ */ de(
      yu,
      {
        "data-slot": "dialog-content",
        "data-variant": n === "default" ? void 0 : n,
        className: V(
          "bg-background fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border p-6 shadow-lg outline-none sm:max-w-lg",
          n === "detail" && wh,
          n === "authorization" && "flex h-[580px] max-h-[calc(100dvh-32px)] w-[380px] flex-col gap-0 overflow-hidden rounded-xl border-0 p-2 pb-0 sm:max-w-[380px]",
          n === "catalog" && "flex max-h-[calc(100dvh-42px)] w-[680px] flex-col gap-0 overflow-hidden rounded-[20px] border-0 bg-muted p-6 sm:max-w-[calc(100vw-32px)]",
          n === "prompt" && [
            "w-[413px] gap-6 rounded-[16px] border-0 bg-[image:var(--dialog-prompt-background)] shadow-none sm:max-w-[413px]",
            "[&>[data-slot=dialog-header]]:gap-2.5 [&>[data-slot=dialog-header]]:text-left",
            "[&>[data-slot=dialog-header]>[data-slot=dialog-title]]:text-base [&>[data-slot=dialog-header]>[data-slot=dialog-title]]:leading-6 [&>[data-slot=dialog-header]>[data-slot=dialog-title]]:font-medium [&>[data-slot=dialog-header]>[data-slot=dialog-title]]:text-[color:var(--dialog-prompt-foreground)]",
            "[&>[data-slot=dialog-header]>[data-slot=dialog-description]]:leading-5 [&>[data-slot=dialog-header]>[data-slot=dialog-description]]:text-[color:var(--dialog-prompt-muted)] [&>[data-slot=dialog-header]>[data-slot=dialog-description]>a]:text-[color:var(--dialog-prompt-foreground)]",
            "[&>[data-slot=dialog-footer]]:flex-row [&>[data-slot=dialog-footer]]:justify-end [&>[data-slot=dialog-footer]]:gap-3",
            "[&>[data-slot=dialog-footer]>button]:h-10 [&>[data-slot=dialog-footer]>button]:w-[86px] [&>[data-slot=dialog-footer]>button]:rounded-lg [&>[data-slot=dialog-footer]>button]:px-4 [&>[data-slot=dialog-footer]>button]:py-2 [&>[data-slot=dialog-footer]>button]:text-sm [&>[data-slot=dialog-footer]>button]:leading-5 [&>[data-slot=dialog-footer]>button]:shadow-none",
            "[&>[data-slot=dialog-footer]>[data-variant=outline]]:border-[color:var(--dialog-prompt-border)] [&>[data-slot=dialog-footer]>[data-variant=outline]]:text-[color:var(--dialog-prompt-muted)]"
          ],
          !u && "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          e
        ),
        style: { ...d, zIndex: f + 1 },
        onEscapeKeyDown: (h) => {
          p?.(h), a || h.preventDefault();
        },
        onPointerDownOutside: (h) => {
          v?.(h), i || h.preventDefault();
        },
        ...b,
        children: [
          t,
          o && /* @__PURE__ */ de(
            Iu,
            {
              "data-slot": "dialog-close",
              className: V(
                "absolute top-4 right-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#2f2c29] opacity-100 shadow-none transition-colors outline-none hover:bg-[#f5f5f5] hover:text-[#2f2c29] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
                s
              ),
              children: [
                /* @__PURE__ */ m(ta, {}),
                /* @__PURE__ */ m("span", { className: "sr-only", children: "关闭" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function Fg({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "dialog-header",
      className: V(
        "flex flex-col gap-2 text-center sm:text-left",
        e
      ),
      ...t
    }
  );
}
function $g({ className: e, ...t }) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "dialog-footer",
      className: V(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        e
      ),
      ...t
    }
  );
}
function zg({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    Pu,
    {
      "data-slot": "dialog-title",
      className: V("text-lg leading-none font-semibold", e),
      ...t
    }
  );
}
function Bg({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ m(
    _u,
    {
      "data-slot": "dialog-description",
      className: V("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
export {
  Pg as $,
  ph as A,
  Hc as B,
  Jr as C,
  Th as D,
  Ih as E,
  kh as F,
  Sa as G,
  ag as H,
  Ni as I,
  mg as J,
  gg as K,
  hg as L,
  vg as M,
  bg as N,
  fg as O,
  ks as P,
  gh as Q,
  Di as R,
  Mh as S,
  ng as T,
  ig as U,
  sg as V,
  dg as W,
  cg as X,
  ug as Y,
  Dh as Z,
  Rg as _,
  W as a,
  _g as a0,
  Cg as a1,
  Sg as a2,
  Eg as a3,
  Ig as a4,
  kg as a5,
  ta as a6,
  Nh as a7,
  Tg as a8,
  Og as a9,
  Ag as aa,
  Dg as ab,
  Mg as ac,
  Ng as ad,
  Lg as ae,
  dh as af,
  Fg as ag,
  zg as ah,
  Bg as ai,
  $g as aj,
  Eh as ak,
  lg as al,
  pg as am,
  ge as b,
  we as c,
  In as d,
  Lt as e,
  Ie as f,
  _e as g,
  T as h,
  _h as i,
  Ln as j,
  og as k,
  rg as l,
  Ah as m,
  Oh as n,
  ea as o,
  Qh as p,
  Jh as q,
  eg as r,
  tg as s,
  Zs as t,
  _s as u,
  V as v,
  mn as w,
  wg as x,
  xg as y,
  yg as z
};
