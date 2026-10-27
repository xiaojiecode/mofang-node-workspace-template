function a(e, n, t) {
  function r(c, u) {
    if (c._zod || Object.defineProperty(c, "_zod", {
      value: {
        def: u,
        constr: s,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), c._zod.traits.has(e))
      return;
    c._zod.traits.add(e), n(c, u);
    const l = s.prototype, f = Object.keys(l);
    for (let p = 0; p < f.length; p++) {
      const h = f[p];
      h in c || (c[h] = l[h].bind(c));
    }
  }
  const o = t?.Parent ?? Object;
  class i extends o {
  }
  Object.defineProperty(i, "name", { value: e });
  function s(c) {
    var u;
    const l = t?.Parent ? new i() : this;
    r(l, c), (u = l._zod).deferred ?? (u.deferred = []);
    for (const f of l._zod.deferred)
      f();
    return l;
  }
  return Object.defineProperty(s, "init", { value: r }), Object.defineProperty(s, Symbol.hasInstance, {
    value: (c) => t?.Parent && c instanceof t.Parent ? !0 : c?._zod?.traits?.has(e)
  }), Object.defineProperty(s, "name", { value: e }), s;
}
class D extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class Ue extends Error {
  constructor(n) {
    super(`Encountered unidirectional transform during encode: ${n}`), this.name = "ZodEncodeError";
  }
}
const Fe = {};
function T(e) {
  return Fe;
}
function Le(e) {
  const n = Object.values(e).filter((r) => typeof r == "number");
  return Object.entries(e).filter(([r, o]) => n.indexOf(+r) === -1).map(([r, o]) => o);
}
function se(e, n) {
  return typeof n == "bigint" ? n.toString() : n;
}
function ue(e) {
  return {
    get value() {
      {
        const n = e();
        return Object.defineProperty(this, "value", { value: n }), n;
      }
    }
  };
}
function ae(e) {
  return e == null;
}
function le(e) {
  const n = e.startsWith("^") ? 1 : 0, t = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(n, t);
}
function Ln(e, n) {
  const t = (e.toString().split(".")[1] || "").length, r = n.toString();
  let o = (r.split(".")[1] || "").length;
  if (o === 0 && /\d?e-\d?/.test(r)) {
    const u = r.match(/\d?e-(\d?)/);
    u?.[1] && (o = Number.parseInt(u[1]));
  }
  const i = t > o ? t : o, s = Number.parseInt(e.toFixed(i).replace(".", "")), c = Number.parseInt(n.toFixed(i).replace(".", ""));
  return s % c / 10 ** i;
}
const _e = /* @__PURE__ */ Symbol("evaluating");
function _(e, n, t) {
  let r;
  Object.defineProperty(e, n, {
    get() {
      if (r !== _e)
        return r === void 0 && (r = _e, r = t()), r;
    },
    set(o) {
      Object.defineProperty(e, n, {
        value: o
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function A(e, n, t) {
  Object.defineProperty(e, n, {
    value: t,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function j(...e) {
  const n = {};
  for (const t of e) {
    const r = Object.getOwnPropertyDescriptors(t);
    Object.assign(n, r);
  }
  return Object.defineProperties({}, n);
}
function ge(e) {
  return JSON.stringify(e);
}
function Mn(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const Me = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function K(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const Vn = ue(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    const e = Function;
    return new e(""), !0;
  } catch {
    return !1;
  }
});
function x(e) {
  if (K(e) === !1)
    return !1;
  const n = e.constructor;
  if (n === void 0 || typeof n != "function")
    return !0;
  const t = n.prototype;
  return !(K(t) === !1 || Object.prototype.hasOwnProperty.call(t, "isPrototypeOf") === !1);
}
function Ve(e) {
  return x(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
const Bn = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function J(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function I(e, n, t) {
  const r = new e._zod.constr(n ?? e._zod.def);
  return (!n || t?.parent) && (r._zod.parent = e), r;
}
function d(e) {
  const n = e;
  if (!n)
    return {};
  if (typeof n == "string")
    return { error: () => n };
  if (n?.message !== void 0) {
    if (n?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    n.error = n.message;
  }
  return delete n.message, typeof n.error == "string" ? { ...n, error: () => n.error } : n;
}
function Wn(e) {
  return Object.keys(e).filter((n) => e[n]._zod.optin === "optional" && e[n]._zod.optout === "optional");
}
const Kn = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function Gn(e, n) {
  const t = e._zod.def, r = t.checks;
  if (r && r.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  const i = j(e._zod.def, {
    get shape() {
      const s = {};
      for (const c in n) {
        if (!(c in t.shape))
          throw new Error(`Unrecognized key: "${c}"`);
        n[c] && (s[c] = t.shape[c]);
      }
      return A(this, "shape", s), s;
    },
    checks: []
  });
  return I(e, i);
}
function Yn(e, n) {
  const t = e._zod.def, r = t.checks;
  if (r && r.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  const i = j(e._zod.def, {
    get shape() {
      const s = { ...e._zod.def.shape };
      for (const c in n) {
        if (!(c in t.shape))
          throw new Error(`Unrecognized key: "${c}"`);
        n[c] && delete s[c];
      }
      return A(this, "shape", s), s;
    },
    checks: []
  });
  return I(e, i);
}
function qn(e, n) {
  if (!x(n))
    throw new Error("Invalid input to extend: expected a plain object");
  const t = e._zod.def.checks;
  if (t && t.length > 0) {
    const i = e._zod.def.shape;
    for (const s in n)
      if (Object.getOwnPropertyDescriptor(i, s) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const o = j(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape, ...n };
      return A(this, "shape", i), i;
    }
  });
  return I(e, o);
}
function Xn(e, n) {
  if (!x(n))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const t = j(e._zod.def, {
    get shape() {
      const r = { ...e._zod.def.shape, ...n };
      return A(this, "shape", r), r;
    }
  });
  return I(e, t);
}
function Hn(e, n) {
  const t = j(e._zod.def, {
    get shape() {
      const r = { ...e._zod.def.shape, ...n._zod.def.shape };
      return A(this, "shape", r), r;
    },
    get catchall() {
      return n._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return I(e, t);
}
function Qn(e, n, t) {
  const o = n._zod.def.checks;
  if (o && o.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  const s = j(n._zod.def, {
    get shape() {
      const c = n._zod.def.shape, u = { ...c };
      if (t)
        for (const l in t) {
          if (!(l in c))
            throw new Error(`Unrecognized key: "${l}"`);
          t[l] && (u[l] = e ? new e({
            type: "optional",
            innerType: c[l]
          }) : c[l]);
        }
      else
        for (const l in c)
          u[l] = e ? new e({
            type: "optional",
            innerType: c[l]
          }) : c[l];
      return A(this, "shape", u), u;
    },
    checks: []
  });
  return I(n, s);
}
function et(e, n, t) {
  const r = j(n._zod.def, {
    get shape() {
      const o = n._zod.def.shape, i = { ...o };
      if (t)
        for (const s in t) {
          if (!(s in i))
            throw new Error(`Unrecognized key: "${s}"`);
          t[s] && (i[s] = new e({
            type: "nonoptional",
            innerType: o[s]
          }));
        }
      else
        for (const s in o)
          i[s] = new e({
            type: "nonoptional",
            innerType: o[s]
          });
      return A(this, "shape", i), i;
    }
  });
  return I(n, r);
}
function R(e, n = 0) {
  if (e.aborted === !0)
    return !0;
  for (let t = n; t < e.issues.length; t++)
    if (e.issues[t]?.continue !== !0)
      return !0;
  return !1;
}
function C(e, n) {
  return n.map((t) => {
    var r;
    return (r = t).path ?? (r.path = []), t.path.unshift(e), t;
  });
}
function V(e) {
  return typeof e == "string" ? e : e?.message;
}
function N(e, n, t) {
  const r = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const o = V(e.inst?._zod.def?.error?.(e)) ?? V(n?.error?.(e)) ?? V(t.customError?.(e)) ?? V(t.localeError?.(e)) ?? "Invalid input";
    r.message = o;
  }
  return delete r.inst, delete r.continue, n?.reportInput || delete r.input, r;
}
function fe(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function L(...e) {
  const [n, t, r] = e;
  return typeof n == "string" ? {
    message: n,
    code: "custom",
    input: t,
    inst: r
  } : { ...n };
}
const Be = (e, n) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: n,
    enumerable: !1
  }), e.message = JSON.stringify(n, se, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, We = a("$ZodError", Be), Ke = a("$ZodError", Be, { Parent: Error });
function nt(e, n = (t) => t.message) {
  const t = {}, r = [];
  for (const o of e.issues)
    o.path.length > 0 ? (t[o.path[0]] = t[o.path[0]] || [], t[o.path[0]].push(n(o))) : r.push(n(o));
  return { formErrors: r, fieldErrors: t };
}
function tt(e, n = (t) => t.message) {
  const t = { _errors: [] }, r = (o) => {
    for (const i of o.issues)
      if (i.code === "invalid_union" && i.errors.length)
        i.errors.map((s) => r({ issues: s }));
      else if (i.code === "invalid_key")
        r({ issues: i.issues });
      else if (i.code === "invalid_element")
        r({ issues: i.issues });
      else if (i.path.length === 0)
        t._errors.push(n(i));
      else {
        let s = t, c = 0;
        for (; c < i.path.length; ) {
          const u = i.path[c];
          c === i.path.length - 1 ? (s[u] = s[u] || { _errors: [] }, s[u]._errors.push(n(i))) : s[u] = s[u] || { _errors: [] }, s = s[u], c++;
        }
      }
  };
  return r(e), t;
}
const pe = (e) => (n, t, r, o) => {
  const i = r ? Object.assign(r, { async: !1 }) : { async: !1 }, s = n._zod.run({ value: t, issues: [] }, i);
  if (s instanceof Promise)
    throw new D();
  if (s.issues.length) {
    const c = new (o?.Err ?? e)(s.issues.map((u) => N(u, i, T())));
    throw Me(c, o?.callee), c;
  }
  return s.value;
}, de = (e) => async (n, t, r, o) => {
  const i = r ? Object.assign(r, { async: !0 }) : { async: !0 };
  let s = n._zod.run({ value: t, issues: [] }, i);
  if (s instanceof Promise && (s = await s), s.issues.length) {
    const c = new (o?.Err ?? e)(s.issues.map((u) => N(u, i, T())));
    throw Me(c, o?.callee), c;
  }
  return s.value;
}, ee = (e) => (n, t, r) => {
  const o = r ? { ...r, async: !1 } : { async: !1 }, i = n._zod.run({ value: t, issues: [] }, o);
  if (i instanceof Promise)
    throw new D();
  return i.issues.length ? {
    success: !1,
    error: new (e ?? We)(i.issues.map((s) => N(s, o, T())))
  } : { success: !0, data: i.value };
}, rt = /* @__PURE__ */ ee(Ke), ne = (e) => async (n, t, r) => {
  const o = r ? Object.assign(r, { async: !0 }) : { async: !0 };
  let i = n._zod.run({ value: t, issues: [] }, o);
  return i instanceof Promise && (i = await i), i.issues.length ? {
    success: !1,
    error: new e(i.issues.map((s) => N(s, o, T())))
  } : { success: !0, data: i.value };
}, ot = /* @__PURE__ */ ne(Ke), st = (e) => (n, t, r) => {
  const o = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
  return pe(e)(n, t, o);
}, it = (e) => (n, t, r) => pe(e)(n, t, r), ct = (e) => async (n, t, r) => {
  const o = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
  return de(e)(n, t, o);
}, ut = (e) => async (n, t, r) => de(e)(n, t, r), at = (e) => (n, t, r) => {
  const o = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
  return ee(e)(n, t, o);
}, lt = (e) => (n, t, r) => ee(e)(n, t, r), ft = (e) => async (n, t, r) => {
  const o = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
  return ne(e)(n, t, o);
}, pt = (e) => async (n, t, r) => ne(e)(n, t, r), dt = /^[cC][^\s-]{8,}$/, ht = /^[0-9a-z]+$/, mt = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, _t = /^[0-9a-vA-V]{20}$/, gt = /^[A-Za-z0-9]{27}$/, vt = /^[a-zA-Z0-9_-]{21}$/, yt = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, zt = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, ve = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, bt = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, wt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function kt() {
  return new RegExp(wt, "u");
}
const $t = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Zt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, St = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Ot = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Et = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Ge = /^[A-Za-z0-9_-]*$/, Pt = /^\+[1-9]\d{6,14}$/, Ye = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", It = /* @__PURE__ */ new RegExp(`^${Ye}$`);
function qe(e) {
  const n = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${n}` : e.precision === 0 ? `${n}:[0-5]\\d` : `${n}:[0-5]\\d\\.\\d{${e.precision}}` : `${n}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Tt(e) {
  return new RegExp(`^${qe(e)}$`);
}
function Nt(e) {
  const n = qe({ precision: e.precision }), t = ["Z"];
  e.local && t.push(""), e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const r = `${n}(?:${t.join("|")})`;
  return new RegExp(`^${Ye}T(?:${r})$`);
}
const jt = (e) => {
  const n = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${n}$`);
}, At = /^-?\d+$/, Xe = /^-?\d+(?:\.\d+)?$/, Rt = /^(?:true|false)$/i, Ct = /^null$/i, Dt = /^[^A-Z]*$/, xt = /^[^a-z]*$/, S = /* @__PURE__ */ a("$ZodCheck", (e, n) => {
  var t;
  e._zod ?? (e._zod = {}), e._zod.def = n, (t = e._zod).onattach ?? (t.onattach = []);
}), He = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, Qe = /* @__PURE__ */ a("$ZodCheckLessThan", (e, n) => {
  S.init(e, n);
  const t = He[typeof n.value];
  e._zod.onattach.push((r) => {
    const o = r._zod.bag, i = (n.inclusive ? o.maximum : o.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    n.value < i && (n.inclusive ? o.maximum = n.value : o.exclusiveMaximum = n.value);
  }), e._zod.check = (r) => {
    (n.inclusive ? r.value <= n.value : r.value < n.value) || r.issues.push({
      origin: t,
      code: "too_big",
      maximum: typeof n.value == "object" ? n.value.getTime() : n.value,
      input: r.value,
      inclusive: n.inclusive,
      inst: e,
      continue: !n.abort
    });
  };
}), en = /* @__PURE__ */ a("$ZodCheckGreaterThan", (e, n) => {
  S.init(e, n);
  const t = He[typeof n.value];
  e._zod.onattach.push((r) => {
    const o = r._zod.bag, i = (n.inclusive ? o.minimum : o.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    n.value > i && (n.inclusive ? o.minimum = n.value : o.exclusiveMinimum = n.value);
  }), e._zod.check = (r) => {
    (n.inclusive ? r.value >= n.value : r.value > n.value) || r.issues.push({
      origin: t,
      code: "too_small",
      minimum: typeof n.value == "object" ? n.value.getTime() : n.value,
      input: r.value,
      inclusive: n.inclusive,
      inst: e,
      continue: !n.abort
    });
  };
}), Jt = /* @__PURE__ */ a("$ZodCheckMultipleOf", (e, n) => {
  S.init(e, n), e._zod.onattach.push((t) => {
    var r;
    (r = t._zod.bag).multipleOf ?? (r.multipleOf = n.value);
  }), e._zod.check = (t) => {
    if (typeof t.value != typeof n.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof t.value == "bigint" ? t.value % n.value === BigInt(0) : Ln(t.value, n.value) === 0) || t.issues.push({
      origin: typeof t.value,
      code: "not_multiple_of",
      divisor: n.value,
      input: t.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Ut = /* @__PURE__ */ a("$ZodCheckNumberFormat", (e, n) => {
  S.init(e, n), n.format = n.format || "float64";
  const t = n.format?.includes("int"), r = t ? "int" : "number", [o, i] = Kn[n.format];
  e._zod.onattach.push((s) => {
    const c = s._zod.bag;
    c.format = n.format, c.minimum = o, c.maximum = i, t && (c.pattern = At);
  }), e._zod.check = (s) => {
    const c = s.value;
    if (t) {
      if (!Number.isInteger(c)) {
        s.issues.push({
          expected: r,
          format: n.format,
          code: "invalid_type",
          continue: !1,
          input: c,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(c)) {
        c > 0 ? s.issues.push({
          input: c,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: r,
          inclusive: !0,
          continue: !n.abort
        }) : s.issues.push({
          input: c,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: r,
          inclusive: !0,
          continue: !n.abort
        });
        return;
      }
    }
    c < o && s.issues.push({
      origin: "number",
      input: c,
      code: "too_small",
      minimum: o,
      inclusive: !0,
      inst: e,
      continue: !n.abort
    }), c > i && s.issues.push({
      origin: "number",
      input: c,
      code: "too_big",
      maximum: i,
      inclusive: !0,
      inst: e,
      continue: !n.abort
    });
  };
}), Ft = /* @__PURE__ */ a("$ZodCheckMaxLength", (e, n) => {
  var t;
  S.init(e, n), (t = e._zod.def).when ?? (t.when = (r) => {
    const o = r.value;
    return !ae(o) && o.length !== void 0;
  }), e._zod.onattach.push((r) => {
    const o = r._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    n.maximum < o && (r._zod.bag.maximum = n.maximum);
  }), e._zod.check = (r) => {
    const o = r.value;
    if (o.length <= n.maximum)
      return;
    const s = fe(o);
    r.issues.push({
      origin: s,
      code: "too_big",
      maximum: n.maximum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !n.abort
    });
  };
}), Lt = /* @__PURE__ */ a("$ZodCheckMinLength", (e, n) => {
  var t;
  S.init(e, n), (t = e._zod.def).when ?? (t.when = (r) => {
    const o = r.value;
    return !ae(o) && o.length !== void 0;
  }), e._zod.onattach.push((r) => {
    const o = r._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    n.minimum > o && (r._zod.bag.minimum = n.minimum);
  }), e._zod.check = (r) => {
    const o = r.value;
    if (o.length >= n.minimum)
      return;
    const s = fe(o);
    r.issues.push({
      origin: s,
      code: "too_small",
      minimum: n.minimum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !n.abort
    });
  };
}), Mt = /* @__PURE__ */ a("$ZodCheckLengthEquals", (e, n) => {
  var t;
  S.init(e, n), (t = e._zod.def).when ?? (t.when = (r) => {
    const o = r.value;
    return !ae(o) && o.length !== void 0;
  }), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.minimum = n.length, o.maximum = n.length, o.length = n.length;
  }), e._zod.check = (r) => {
    const o = r.value, i = o.length;
    if (i === n.length)
      return;
    const s = fe(o), c = i > n.length;
    r.issues.push({
      origin: s,
      ...c ? { code: "too_big", maximum: n.length } : { code: "too_small", minimum: n.length },
      inclusive: !0,
      exact: !0,
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), te = /* @__PURE__ */ a("$ZodCheckStringFormat", (e, n) => {
  var t, r;
  S.init(e, n), e._zod.onattach.push((o) => {
    const i = o._zod.bag;
    i.format = n.format, n.pattern && (i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(n.pattern));
  }), n.pattern ? (t = e._zod).check ?? (t.check = (o) => {
    n.pattern.lastIndex = 0, !n.pattern.test(o.value) && o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: n.format,
      input: o.value,
      ...n.pattern ? { pattern: n.pattern.toString() } : {},
      inst: e,
      continue: !n.abort
    });
  }) : (r = e._zod).check ?? (r.check = () => {
  });
}), Vt = /* @__PURE__ */ a("$ZodCheckRegex", (e, n) => {
  te.init(e, n), e._zod.check = (t) => {
    n.pattern.lastIndex = 0, !n.pattern.test(t.value) && t.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: t.value,
      pattern: n.pattern.toString(),
      inst: e,
      continue: !n.abort
    });
  };
}), Bt = /* @__PURE__ */ a("$ZodCheckLowerCase", (e, n) => {
  n.pattern ?? (n.pattern = Dt), te.init(e, n);
}), Wt = /* @__PURE__ */ a("$ZodCheckUpperCase", (e, n) => {
  n.pattern ?? (n.pattern = xt), te.init(e, n);
}), Kt = /* @__PURE__ */ a("$ZodCheckIncludes", (e, n) => {
  S.init(e, n);
  const t = J(n.includes), r = new RegExp(typeof n.position == "number" ? `^.{${n.position}}${t}` : t);
  n.pattern = r, e._zod.onattach.push((o) => {
    const i = o._zod.bag;
    i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(r);
  }), e._zod.check = (o) => {
    o.value.includes(n.includes, n.position) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: n.includes,
      input: o.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Gt = /* @__PURE__ */ a("$ZodCheckStartsWith", (e, n) => {
  S.init(e, n);
  const t = new RegExp(`^${J(n.prefix)}.*`);
  n.pattern ?? (n.pattern = t), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(t);
  }), e._zod.check = (r) => {
    r.value.startsWith(n.prefix) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: n.prefix,
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Yt = /* @__PURE__ */ a("$ZodCheckEndsWith", (e, n) => {
  S.init(e, n);
  const t = new RegExp(`.*${J(n.suffix)}$`);
  n.pattern ?? (n.pattern = t), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(t);
  }), e._zod.check = (r) => {
    r.value.endsWith(n.suffix) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: n.suffix,
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), qt = /* @__PURE__ */ a("$ZodCheckOverwrite", (e, n) => {
  S.init(e, n), e._zod.check = (t) => {
    t.value = n.tx(t.value);
  };
});
class Xt {
  constructor(n = []) {
    this.content = [], this.indent = 0, this && (this.args = n);
  }
  indented(n) {
    this.indent += 1, n(this), this.indent -= 1;
  }
  write(n) {
    if (typeof n == "function") {
      n(this, { execution: "sync" }), n(this, { execution: "async" });
      return;
    }
    const r = n.split(`
`).filter((s) => s), o = Math.min(...r.map((s) => s.length - s.trimStart().length)), i = r.map((s) => s.slice(o)).map((s) => " ".repeat(this.indent * 2) + s);
    for (const s of i)
      this.content.push(s);
  }
  compile() {
    const n = Function, t = this?.args, o = [...(this?.content ?? [""]).map((i) => `  ${i}`)];
    return new n(...t, o.join(`
`));
  }
}
const Ht = {
  major: 4,
  minor: 3,
  patch: 5
}, v = /* @__PURE__ */ a("$ZodType", (e, n) => {
  var t;
  e ?? (e = {}), e._zod.def = n, e._zod.bag = e._zod.bag || {}, e._zod.version = Ht;
  const r = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && r.unshift(e);
  for (const o of r)
    for (const i of o._zod.onattach)
      i(e);
  if (r.length === 0)
    (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const o = (s, c, u) => {
      let l = R(s), f;
      for (const p of c) {
        if (p._zod.def.when) {
          if (!p._zod.def.when(s))
            continue;
        } else if (l)
          continue;
        const h = s.issues.length, m = p._zod.check(s);
        if (m instanceof Promise && u?.async === !1)
          throw new D();
        if (f || m instanceof Promise)
          f = (f ?? Promise.resolve()).then(async () => {
            await m, s.issues.length !== h && (l || (l = R(s, h)));
          });
        else {
          if (s.issues.length === h)
            continue;
          l || (l = R(s, h));
        }
      }
      return f ? f.then(() => s) : s;
    }, i = (s, c, u) => {
      if (R(s))
        return s.aborted = !0, s;
      const l = o(c, r, u);
      if (l instanceof Promise) {
        if (u.async === !1)
          throw new D();
        return l.then((f) => e._zod.parse(f, u));
      }
      return e._zod.parse(l, u);
    };
    e._zod.run = (s, c) => {
      if (c.skipChecks)
        return e._zod.parse(s, c);
      if (c.direction === "backward") {
        const l = e._zod.parse({ value: s.value, issues: [] }, { ...c, skipChecks: !0 });
        return l instanceof Promise ? l.then((f) => i(f, s, c)) : i(l, s, c);
      }
      const u = e._zod.parse(s, c);
      if (u instanceof Promise) {
        if (c.async === !1)
          throw new D();
        return u.then((l) => o(l, r, c));
      }
      return o(u, r, c);
    };
  }
  _(e, "~standard", () => ({
    validate: (o) => {
      try {
        const i = rt(e, o);
        return i.success ? { value: i.data } : { issues: i.error?.issues };
      } catch {
        return ot(e, o).then((s) => s.success ? { value: s.data } : { issues: s.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), he = /* @__PURE__ */ a("$ZodString", (e, n) => {
  v.init(e, n), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? jt(e._zod.bag), e._zod.parse = (t, r) => {
    if (n.coerce)
      try {
        t.value = String(t.value);
      } catch {
      }
    return typeof t.value == "string" || t.issues.push({
      expected: "string",
      code: "invalid_type",
      input: t.value,
      inst: e
    }), t;
  };
}), z = /* @__PURE__ */ a("$ZodStringFormat", (e, n) => {
  te.init(e, n), he.init(e, n);
}), Qt = /* @__PURE__ */ a("$ZodGUID", (e, n) => {
  n.pattern ?? (n.pattern = zt), z.init(e, n);
}), er = /* @__PURE__ */ a("$ZodUUID", (e, n) => {
  if (n.version) {
    const r = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[n.version];
    if (r === void 0)
      throw new Error(`Invalid UUID version: "${n.version}"`);
    n.pattern ?? (n.pattern = ve(r));
  } else
    n.pattern ?? (n.pattern = ve());
  z.init(e, n);
}), nr = /* @__PURE__ */ a("$ZodEmail", (e, n) => {
  n.pattern ?? (n.pattern = bt), z.init(e, n);
}), tr = /* @__PURE__ */ a("$ZodURL", (e, n) => {
  z.init(e, n), e._zod.check = (t) => {
    try {
      const r = t.value.trim(), o = new URL(r);
      n.hostname && (n.hostname.lastIndex = 0, n.hostname.test(o.hostname) || t.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: n.hostname.source,
        input: t.value,
        inst: e,
        continue: !n.abort
      })), n.protocol && (n.protocol.lastIndex = 0, n.protocol.test(o.protocol.endsWith(":") ? o.protocol.slice(0, -1) : o.protocol) || t.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: n.protocol.source,
        input: t.value,
        inst: e,
        continue: !n.abort
      })), n.normalize ? t.value = o.href : t.value = r;
      return;
    } catch {
      t.issues.push({
        code: "invalid_format",
        format: "url",
        input: t.value,
        inst: e,
        continue: !n.abort
      });
    }
  };
}), rr = /* @__PURE__ */ a("$ZodEmoji", (e, n) => {
  n.pattern ?? (n.pattern = kt()), z.init(e, n);
}), or = /* @__PURE__ */ a("$ZodNanoID", (e, n) => {
  n.pattern ?? (n.pattern = vt), z.init(e, n);
}), sr = /* @__PURE__ */ a("$ZodCUID", (e, n) => {
  n.pattern ?? (n.pattern = dt), z.init(e, n);
}), ir = /* @__PURE__ */ a("$ZodCUID2", (e, n) => {
  n.pattern ?? (n.pattern = ht), z.init(e, n);
}), cr = /* @__PURE__ */ a("$ZodULID", (e, n) => {
  n.pattern ?? (n.pattern = mt), z.init(e, n);
}), ur = /* @__PURE__ */ a("$ZodXID", (e, n) => {
  n.pattern ?? (n.pattern = _t), z.init(e, n);
}), ar = /* @__PURE__ */ a("$ZodKSUID", (e, n) => {
  n.pattern ?? (n.pattern = gt), z.init(e, n);
}), lr = /* @__PURE__ */ a("$ZodISODateTime", (e, n) => {
  n.pattern ?? (n.pattern = Nt(n)), z.init(e, n);
}), fr = /* @__PURE__ */ a("$ZodISODate", (e, n) => {
  n.pattern ?? (n.pattern = It), z.init(e, n);
}), pr = /* @__PURE__ */ a("$ZodISOTime", (e, n) => {
  n.pattern ?? (n.pattern = Tt(n)), z.init(e, n);
}), dr = /* @__PURE__ */ a("$ZodISODuration", (e, n) => {
  n.pattern ?? (n.pattern = yt), z.init(e, n);
}), hr = /* @__PURE__ */ a("$ZodIPv4", (e, n) => {
  n.pattern ?? (n.pattern = $t), z.init(e, n), e._zod.bag.format = "ipv4";
}), mr = /* @__PURE__ */ a("$ZodIPv6", (e, n) => {
  n.pattern ?? (n.pattern = Zt), z.init(e, n), e._zod.bag.format = "ipv6", e._zod.check = (t) => {
    try {
      new URL(`http://[${t.value}]`);
    } catch {
      t.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: t.value,
        inst: e,
        continue: !n.abort
      });
    }
  };
}), _r = /* @__PURE__ */ a("$ZodCIDRv4", (e, n) => {
  n.pattern ?? (n.pattern = St), z.init(e, n);
}), gr = /* @__PURE__ */ a("$ZodCIDRv6", (e, n) => {
  n.pattern ?? (n.pattern = Ot), z.init(e, n), e._zod.check = (t) => {
    const r = t.value.split("/");
    try {
      if (r.length !== 2)
        throw new Error();
      const [o, i] = r;
      if (!i)
        throw new Error();
      const s = Number(i);
      if (`${s}` !== i)
        throw new Error();
      if (s < 0 || s > 128)
        throw new Error();
      new URL(`http://[${o}]`);
    } catch {
      t.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: t.value,
        inst: e,
        continue: !n.abort
      });
    }
  };
});
function nn(e) {
  if (e === "")
    return !0;
  if (e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
const vr = /* @__PURE__ */ a("$ZodBase64", (e, n) => {
  n.pattern ?? (n.pattern = Et), z.init(e, n), e._zod.bag.contentEncoding = "base64", e._zod.check = (t) => {
    nn(t.value) || t.issues.push({
      code: "invalid_format",
      format: "base64",
      input: t.value,
      inst: e,
      continue: !n.abort
    });
  };
});
function yr(e) {
  if (!Ge.test(e))
    return !1;
  const n = e.replace(/[-_]/g, (r) => r === "-" ? "+" : "/"), t = n.padEnd(Math.ceil(n.length / 4) * 4, "=");
  return nn(t);
}
const zr = /* @__PURE__ */ a("$ZodBase64URL", (e, n) => {
  n.pattern ?? (n.pattern = Ge), z.init(e, n), e._zod.bag.contentEncoding = "base64url", e._zod.check = (t) => {
    yr(t.value) || t.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: t.value,
      inst: e,
      continue: !n.abort
    });
  };
}), br = /* @__PURE__ */ a("$ZodE164", (e, n) => {
  n.pattern ?? (n.pattern = Pt), z.init(e, n);
});
function wr(e, n = null) {
  try {
    const t = e.split(".");
    if (t.length !== 3)
      return !1;
    const [r] = t;
    if (!r)
      return !1;
    const o = JSON.parse(atob(r));
    return !("typ" in o && o?.typ !== "JWT" || !o.alg || n && (!("alg" in o) || o.alg !== n));
  } catch {
    return !1;
  }
}
const kr = /* @__PURE__ */ a("$ZodJWT", (e, n) => {
  z.init(e, n), e._zod.check = (t) => {
    wr(t.value, n.alg) || t.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: t.value,
      inst: e,
      continue: !n.abort
    });
  };
}), tn = /* @__PURE__ */ a("$ZodNumber", (e, n) => {
  v.init(e, n), e._zod.pattern = e._zod.bag.pattern ?? Xe, e._zod.parse = (t, r) => {
    if (n.coerce)
      try {
        t.value = Number(t.value);
      } catch {
      }
    const o = t.value;
    if (typeof o == "number" && !Number.isNaN(o) && Number.isFinite(o))
      return t;
    const i = typeof o == "number" ? Number.isNaN(o) ? "NaN" : Number.isFinite(o) ? void 0 : "Infinity" : void 0;
    return t.issues.push({
      expected: "number",
      code: "invalid_type",
      input: o,
      inst: e,
      ...i ? { received: i } : {}
    }), t;
  };
}), $r = /* @__PURE__ */ a("$ZodNumberFormat", (e, n) => {
  Ut.init(e, n), tn.init(e, n);
}), Zr = /* @__PURE__ */ a("$ZodBoolean", (e, n) => {
  v.init(e, n), e._zod.pattern = Rt, e._zod.parse = (t, r) => {
    if (n.coerce)
      try {
        t.value = !!t.value;
      } catch {
      }
    const o = t.value;
    return typeof o == "boolean" || t.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: o,
      inst: e
    }), t;
  };
}), Sr = /* @__PURE__ */ a("$ZodNull", (e, n) => {
  v.init(e, n), e._zod.pattern = Ct, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (t, r) => {
    const o = t.value;
    return o === null || t.issues.push({
      expected: "null",
      code: "invalid_type",
      input: o,
      inst: e
    }), t;
  };
}), Or = /* @__PURE__ */ a("$ZodUnknown", (e, n) => {
  v.init(e, n), e._zod.parse = (t) => t;
}), Er = /* @__PURE__ */ a("$ZodNever", (e, n) => {
  v.init(e, n), e._zod.parse = (t, r) => (t.issues.push({
    expected: "never",
    code: "invalid_type",
    input: t.value,
    inst: e
  }), t);
});
function ye(e, n, t) {
  e.issues.length && n.issues.push(...C(t, e.issues)), n.value[t] = e.value;
}
const Pr = /* @__PURE__ */ a("$ZodArray", (e, n) => {
  v.init(e, n), e._zod.parse = (t, r) => {
    const o = t.value;
    if (!Array.isArray(o))
      return t.issues.push({
        expected: "array",
        code: "invalid_type",
        input: o,
        inst: e
      }), t;
    t.value = Array(o.length);
    const i = [];
    for (let s = 0; s < o.length; s++) {
      const c = o[s], u = n.element._zod.run({
        value: c,
        issues: []
      }, r);
      u instanceof Promise ? i.push(u.then((l) => ye(l, t, s))) : ye(u, t, s);
    }
    return i.length ? Promise.all(i).then(() => t) : t;
  };
});
function G(e, n, t, r, o) {
  if (e.issues.length) {
    if (o && !(t in r))
      return;
    n.issues.push(...C(t, e.issues));
  }
  e.value === void 0 ? t in r && (n.value[t] = void 0) : n.value[t] = e.value;
}
function rn(e) {
  const n = Object.keys(e.shape);
  for (const r of n)
    if (!e.shape?.[r]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${r}": expected a Zod schema`);
  const t = Wn(e.shape);
  return {
    ...e,
    keys: n,
    keySet: new Set(n),
    numKeys: n.length,
    optionalKeys: new Set(t)
  };
}
function on(e, n, t, r, o, i) {
  const s = [], c = o.keySet, u = o.catchall._zod, l = u.def.type, f = u.optout === "optional";
  for (const p in n) {
    if (c.has(p))
      continue;
    if (l === "never") {
      s.push(p);
      continue;
    }
    const h = u.run({ value: n[p], issues: [] }, r);
    h instanceof Promise ? e.push(h.then((m) => G(m, t, p, n, f))) : G(h, t, p, n, f);
  }
  return s.length && t.issues.push({
    code: "unrecognized_keys",
    keys: s,
    input: n,
    inst: i
  }), e.length ? Promise.all(e).then(() => t) : t;
}
const Ir = /* @__PURE__ */ a("$ZodObject", (e, n) => {
  if (v.init(e, n), !Object.getOwnPropertyDescriptor(n, "shape")?.get) {
    const c = n.shape;
    Object.defineProperty(n, "shape", {
      get: () => {
        const u = { ...c };
        return Object.defineProperty(n, "shape", {
          value: u
        }), u;
      }
    });
  }
  const r = ue(() => rn(n));
  _(e._zod, "propValues", () => {
    const c = n.shape, u = {};
    for (const l in c) {
      const f = c[l]._zod;
      if (f.values) {
        u[l] ?? (u[l] = /* @__PURE__ */ new Set());
        for (const p of f.values)
          u[l].add(p);
      }
    }
    return u;
  });
  const o = K, i = n.catchall;
  let s;
  e._zod.parse = (c, u) => {
    s ?? (s = r.value);
    const l = c.value;
    if (!o(l))
      return c.issues.push({
        expected: "object",
        code: "invalid_type",
        input: l,
        inst: e
      }), c;
    c.value = {};
    const f = [], p = s.shape;
    for (const h of s.keys) {
      const m = p[h], k = m._zod.optout === "optional", w = m._zod.run({ value: l[h], issues: [] }, u);
      w instanceof Promise ? f.push(w.then((M) => G(M, c, h, l, k))) : G(w, c, h, l, k);
    }
    return i ? on(f, l, c, u, r.value, e) : f.length ? Promise.all(f).then(() => c) : c;
  };
}), Tr = /* @__PURE__ */ a("$ZodObjectJIT", (e, n) => {
  Ir.init(e, n);
  const t = e._zod.parse, r = ue(() => rn(n)), o = (h) => {
    const m = new Xt(["shape", "payload", "ctx"]), k = r.value, w = (P) => {
      const Z = ge(P);
      return `shape[${Z}]._zod.run({ value: input[${Z}], issues: [] }, ctx)`;
    };
    m.write("const input = payload.value;");
    const M = /* @__PURE__ */ Object.create(null);
    let Jn = 0;
    for (const P of k.keys)
      M[P] = `key_${Jn++}`;
    m.write("const newResult = {};");
    for (const P of k.keys) {
      const Z = M[P], E = ge(P), Fn = h[P]?._zod?.optout === "optional";
      m.write(`const ${Z} = ${w(P)};`), Fn ? m.write(`
        if (${Z}.issues.length) {
          if (${E} in input) {
            payload.issues = payload.issues.concat(${Z}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${E}, ...iss.path] : [${E}]
            })));
          }
        }

        if (${Z}.value === undefined) {
          if (${E} in input) {
            newResult[${E}] = undefined;
          }
        } else {
          newResult[${E}] = ${Z}.value;
        }

      `) : m.write(`
        if (${Z}.issues.length) {
          payload.issues = payload.issues.concat(${Z}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${E}, ...iss.path] : [${E}]
          })));
        }

        if (${Z}.value === undefined) {
          if (${E} in input) {
            newResult[${E}] = undefined;
          }
        } else {
          newResult[${E}] = ${Z}.value;
        }

      `);
    }
    m.write("payload.value = newResult;"), m.write("return payload;");
    const Un = m.compile();
    return (P, Z) => Un(h, P, Z);
  };
  let i;
  const s = K, c = !Fe.jitless, l = c && Vn.value, f = n.catchall;
  let p;
  e._zod.parse = (h, m) => {
    p ?? (p = r.value);
    const k = h.value;
    return s(k) ? c && l && m?.async === !1 && m.jitless !== !0 ? (i || (i = o(n.shape)), h = i(h, m), f ? on([], k, h, m, p, e) : h) : t(h, m) : (h.issues.push({
      expected: "object",
      code: "invalid_type",
      input: k,
      inst: e
    }), h);
  };
});
function ze(e, n, t, r) {
  for (const i of e)
    if (i.issues.length === 0)
      return n.value = i.value, n;
  const o = e.filter((i) => !R(i));
  return o.length === 1 ? (n.value = o[0].value, o[0]) : (n.issues.push({
    code: "invalid_union",
    input: n.value,
    inst: t,
    errors: e.map((i) => i.issues.map((s) => N(s, r, T())))
  }), n);
}
const Nr = /* @__PURE__ */ a("$ZodUnion", (e, n) => {
  v.init(e, n), _(e._zod, "optin", () => n.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0), _(e._zod, "optout", () => n.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), _(e._zod, "values", () => {
    if (n.options.every((o) => o._zod.values))
      return new Set(n.options.flatMap((o) => Array.from(o._zod.values)));
  }), _(e._zod, "pattern", () => {
    if (n.options.every((o) => o._zod.pattern)) {
      const o = n.options.map((i) => i._zod.pattern);
      return new RegExp(`^(${o.map((i) => le(i.source)).join("|")})$`);
    }
  });
  const t = n.options.length === 1, r = n.options[0]._zod.run;
  e._zod.parse = (o, i) => {
    if (t)
      return r(o, i);
    let s = !1;
    const c = [];
    for (const u of n.options) {
      const l = u._zod.run({
        value: o.value,
        issues: []
      }, i);
      if (l instanceof Promise)
        c.push(l), s = !0;
      else {
        if (l.issues.length === 0)
          return l;
        c.push(l);
      }
    }
    return s ? Promise.all(c).then((u) => ze(u, o, e, i)) : ze(c, o, e, i);
  };
}), jr = /* @__PURE__ */ a("$ZodIntersection", (e, n) => {
  v.init(e, n), e._zod.parse = (t, r) => {
    const o = t.value, i = n.left._zod.run({ value: o, issues: [] }, r), s = n.right._zod.run({ value: o, issues: [] }, r);
    return i instanceof Promise || s instanceof Promise ? Promise.all([i, s]).then(([u, l]) => be(t, u, l)) : be(t, i, s);
  };
});
function ie(e, n) {
  if (e === n)
    return { valid: !0, data: e };
  if (e instanceof Date && n instanceof Date && +e == +n)
    return { valid: !0, data: e };
  if (x(e) && x(n)) {
    const t = Object.keys(n), r = Object.keys(e).filter((i) => t.indexOf(i) !== -1), o = { ...e, ...n };
    for (const i of r) {
      const s = ie(e[i], n[i]);
      if (!s.valid)
        return {
          valid: !1,
          mergeErrorPath: [i, ...s.mergeErrorPath]
        };
      o[i] = s.data;
    }
    return { valid: !0, data: o };
  }
  if (Array.isArray(e) && Array.isArray(n)) {
    if (e.length !== n.length)
      return { valid: !1, mergeErrorPath: [] };
    const t = [];
    for (let r = 0; r < e.length; r++) {
      const o = e[r], i = n[r], s = ie(o, i);
      if (!s.valid)
        return {
          valid: !1,
          mergeErrorPath: [r, ...s.mergeErrorPath]
        };
      t.push(s.data);
    }
    return { valid: !0, data: t };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function be(e, n, t) {
  const r = /* @__PURE__ */ new Map();
  let o;
  for (const c of n.issues)
    if (c.code === "unrecognized_keys") {
      o ?? (o = c);
      for (const u of c.keys)
        r.has(u) || r.set(u, {}), r.get(u).l = !0;
    } else
      e.issues.push(c);
  for (const c of t.issues)
    if (c.code === "unrecognized_keys")
      for (const u of c.keys)
        r.has(u) || r.set(u, {}), r.get(u).r = !0;
    else
      e.issues.push(c);
  const i = [...r].filter(([, c]) => c.l && c.r).map(([c]) => c);
  if (i.length && o && e.issues.push({ ...o, keys: i }), R(e))
    return e;
  const s = ie(n.value, t.value);
  if (!s.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`);
  return e.value = s.data, e;
}
const Ar = /* @__PURE__ */ a("$ZodRecord", (e, n) => {
  v.init(e, n), e._zod.parse = (t, r) => {
    const o = t.value;
    if (!x(o))
      return t.issues.push({
        expected: "record",
        code: "invalid_type",
        input: o,
        inst: e
      }), t;
    const i = [], s = n.keyType._zod.values;
    if (s) {
      t.value = {};
      const c = /* @__PURE__ */ new Set();
      for (const l of s)
        if (typeof l == "string" || typeof l == "number" || typeof l == "symbol") {
          c.add(typeof l == "number" ? l.toString() : l);
          const f = n.valueType._zod.run({ value: o[l], issues: [] }, r);
          f instanceof Promise ? i.push(f.then((p) => {
            p.issues.length && t.issues.push(...C(l, p.issues)), t.value[l] = p.value;
          })) : (f.issues.length && t.issues.push(...C(l, f.issues)), t.value[l] = f.value);
        }
      let u;
      for (const l in o)
        c.has(l) || (u = u ?? [], u.push(l));
      u && u.length > 0 && t.issues.push({
        code: "unrecognized_keys",
        input: o,
        inst: e,
        keys: u
      });
    } else {
      t.value = {};
      for (const c of Reflect.ownKeys(o)) {
        if (c === "__proto__")
          continue;
        let u = n.keyType._zod.run({ value: c, issues: [] }, r);
        if (u instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (typeof c == "string" && Xe.test(c) && u.issues.length && u.issues.some((p) => p.code === "invalid_type" && p.expected === "number")) {
          const p = n.keyType._zod.run({ value: Number(c), issues: [] }, r);
          if (p instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          p.issues.length === 0 && (u = p);
        }
        if (u.issues.length) {
          n.mode === "loose" ? t.value[c] = o[c] : t.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: u.issues.map((p) => N(p, r, T())),
            input: c,
            path: [c],
            inst: e
          });
          continue;
        }
        const f = n.valueType._zod.run({ value: o[c], issues: [] }, r);
        f instanceof Promise ? i.push(f.then((p) => {
          p.issues.length && t.issues.push(...C(c, p.issues)), t.value[u.value] = p.value;
        })) : (f.issues.length && t.issues.push(...C(c, f.issues)), t.value[u.value] = f.value);
      }
    }
    return i.length ? Promise.all(i).then(() => t) : t;
  };
}), Rr = /* @__PURE__ */ a("$ZodEnum", (e, n) => {
  v.init(e, n);
  const t = Le(n.entries), r = new Set(t);
  e._zod.values = r, e._zod.pattern = new RegExp(`^(${t.filter((o) => Bn.has(typeof o)).map((o) => typeof o == "string" ? J(o) : o.toString()).join("|")})$`), e._zod.parse = (o, i) => {
    const s = o.value;
    return r.has(s) || o.issues.push({
      code: "invalid_value",
      values: t,
      input: s,
      inst: e
    }), o;
  };
}), Cr = /* @__PURE__ */ a("$ZodLiteral", (e, n) => {
  if (v.init(e, n), n.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  const t = new Set(n.values);
  e._zod.values = t, e._zod.pattern = new RegExp(`^(${n.values.map((r) => typeof r == "string" ? J(r) : r ? J(r.toString()) : String(r)).join("|")})$`), e._zod.parse = (r, o) => {
    const i = r.value;
    return t.has(i) || r.issues.push({
      code: "invalid_value",
      values: n.values,
      input: i,
      inst: e
    }), r;
  };
}), Dr = /* @__PURE__ */ a("$ZodTransform", (e, n) => {
  v.init(e, n), e._zod.parse = (t, r) => {
    if (r.direction === "backward")
      throw new Ue(e.constructor.name);
    const o = n.transform(t.value, t);
    if (r.async)
      return (o instanceof Promise ? o : Promise.resolve(o)).then((s) => (t.value = s, t));
    if (o instanceof Promise)
      throw new D();
    return t.value = o, t;
  };
});
function we(e, n) {
  return e.issues.length && n === void 0 ? { issues: [], value: void 0 } : e;
}
const sn = /* @__PURE__ */ a("$ZodOptional", (e, n) => {
  v.init(e, n), e._zod.optin = "optional", e._zod.optout = "optional", _(e._zod, "values", () => n.innerType._zod.values ? /* @__PURE__ */ new Set([...n.innerType._zod.values, void 0]) : void 0), _(e._zod, "pattern", () => {
    const t = n.innerType._zod.pattern;
    return t ? new RegExp(`^(${le(t.source)})?$`) : void 0;
  }), e._zod.parse = (t, r) => {
    if (n.innerType._zod.optin === "optional") {
      const o = n.innerType._zod.run(t, r);
      return o instanceof Promise ? o.then((i) => we(i, t.value)) : we(o, t.value);
    }
    return t.value === void 0 ? t : n.innerType._zod.run(t, r);
  };
}), xr = /* @__PURE__ */ a("$ZodExactOptional", (e, n) => {
  sn.init(e, n), _(e._zod, "values", () => n.innerType._zod.values), _(e._zod, "pattern", () => n.innerType._zod.pattern), e._zod.parse = (t, r) => n.innerType._zod.run(t, r);
}), Jr = /* @__PURE__ */ a("$ZodNullable", (e, n) => {
  v.init(e, n), _(e._zod, "optin", () => n.innerType._zod.optin), _(e._zod, "optout", () => n.innerType._zod.optout), _(e._zod, "pattern", () => {
    const t = n.innerType._zod.pattern;
    return t ? new RegExp(`^(${le(t.source)}|null)$`) : void 0;
  }), _(e._zod, "values", () => n.innerType._zod.values ? /* @__PURE__ */ new Set([...n.innerType._zod.values, null]) : void 0), e._zod.parse = (t, r) => t.value === null ? t : n.innerType._zod.run(t, r);
}), Ur = /* @__PURE__ */ a("$ZodDefault", (e, n) => {
  v.init(e, n), e._zod.optin = "optional", _(e._zod, "values", () => n.innerType._zod.values), e._zod.parse = (t, r) => {
    if (r.direction === "backward")
      return n.innerType._zod.run(t, r);
    if (t.value === void 0)
      return t.value = n.defaultValue, t;
    const o = n.innerType._zod.run(t, r);
    return o instanceof Promise ? o.then((i) => ke(i, n)) : ke(o, n);
  };
});
function ke(e, n) {
  return e.value === void 0 && (e.value = n.defaultValue), e;
}
const Fr = /* @__PURE__ */ a("$ZodPrefault", (e, n) => {
  v.init(e, n), e._zod.optin = "optional", _(e._zod, "values", () => n.innerType._zod.values), e._zod.parse = (t, r) => (r.direction === "backward" || t.value === void 0 && (t.value = n.defaultValue), n.innerType._zod.run(t, r));
}), Lr = /* @__PURE__ */ a("$ZodNonOptional", (e, n) => {
  v.init(e, n), _(e._zod, "values", () => {
    const t = n.innerType._zod.values;
    return t ? new Set([...t].filter((r) => r !== void 0)) : void 0;
  }), e._zod.parse = (t, r) => {
    const o = n.innerType._zod.run(t, r);
    return o instanceof Promise ? o.then((i) => $e(i, e)) : $e(o, e);
  };
});
function $e(e, n) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: n
  }), e;
}
const Mr = /* @__PURE__ */ a("$ZodCatch", (e, n) => {
  v.init(e, n), _(e._zod, "optin", () => n.innerType._zod.optin), _(e._zod, "optout", () => n.innerType._zod.optout), _(e._zod, "values", () => n.innerType._zod.values), e._zod.parse = (t, r) => {
    if (r.direction === "backward")
      return n.innerType._zod.run(t, r);
    const o = n.innerType._zod.run(t, r);
    return o instanceof Promise ? o.then((i) => (t.value = i.value, i.issues.length && (t.value = n.catchValue({
      ...t,
      error: {
        issues: i.issues.map((s) => N(s, r, T()))
      },
      input: t.value
    }), t.issues = []), t)) : (t.value = o.value, o.issues.length && (t.value = n.catchValue({
      ...t,
      error: {
        issues: o.issues.map((i) => N(i, r, T()))
      },
      input: t.value
    }), t.issues = []), t);
  };
}), Vr = /* @__PURE__ */ a("$ZodPipe", (e, n) => {
  v.init(e, n), _(e._zod, "values", () => n.in._zod.values), _(e._zod, "optin", () => n.in._zod.optin), _(e._zod, "optout", () => n.out._zod.optout), _(e._zod, "propValues", () => n.in._zod.propValues), e._zod.parse = (t, r) => {
    if (r.direction === "backward") {
      const i = n.out._zod.run(t, r);
      return i instanceof Promise ? i.then((s) => B(s, n.in, r)) : B(i, n.in, r);
    }
    const o = n.in._zod.run(t, r);
    return o instanceof Promise ? o.then((i) => B(i, n.out, r)) : B(o, n.out, r);
  };
});
function B(e, n, t) {
  return e.issues.length ? (e.aborted = !0, e) : n._zod.run({ value: e.value, issues: e.issues }, t);
}
const Br = /* @__PURE__ */ a("$ZodReadonly", (e, n) => {
  v.init(e, n), _(e._zod, "propValues", () => n.innerType._zod.propValues), _(e._zod, "values", () => n.innerType._zod.values), _(e._zod, "optin", () => n.innerType?._zod?.optin), _(e._zod, "optout", () => n.innerType?._zod?.optout), e._zod.parse = (t, r) => {
    if (r.direction === "backward")
      return n.innerType._zod.run(t, r);
    const o = n.innerType._zod.run(t, r);
    return o instanceof Promise ? o.then(Ze) : Ze(o);
  };
});
function Ze(e) {
  return e.value = Object.freeze(e.value), e;
}
const Wr = /* @__PURE__ */ a("$ZodLazy", (e, n) => {
  v.init(e, n), _(e._zod, "innerType", () => n.getter()), _(e._zod, "pattern", () => e._zod.innerType?._zod?.pattern), _(e._zod, "propValues", () => e._zod.innerType?._zod?.propValues), _(e._zod, "optin", () => e._zod.innerType?._zod?.optin ?? void 0), _(e._zod, "optout", () => e._zod.innerType?._zod?.optout ?? void 0), e._zod.parse = (t, r) => e._zod.innerType._zod.run(t, r);
}), Kr = /* @__PURE__ */ a("$ZodCustom", (e, n) => {
  S.init(e, n), v.init(e, n), e._zod.parse = (t, r) => t, e._zod.check = (t) => {
    const r = t.value, o = n.fn(r);
    if (o instanceof Promise)
      return o.then((i) => Se(i, t, r, e));
    Se(o, t, r, e);
  };
});
function Se(e, n, t, r) {
  if (!e) {
    const o = {
      code: "custom",
      input: t,
      inst: r,
      // incorporates params.error into issue reporting
      path: [...r._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !r._zod.def.abort
      // params: inst._zod.def.params,
    };
    r._zod.def.params && (o.params = r._zod.def.params), n.issues.push(L(o));
  }
}
var Oe;
class Gr {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(n, ...t) {
    const r = t[0];
    return this._map.set(n, r), r && typeof r == "object" && "id" in r && this._idmap.set(r.id, n), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(n) {
    const t = this._map.get(n);
    return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(n), this;
  }
  get(n) {
    const t = n._zod.parent;
    if (t) {
      const r = { ...this.get(t) ?? {} };
      delete r.id;
      const o = { ...r, ...this._map.get(n) };
      return Object.keys(o).length ? o : void 0;
    }
    return this._map.get(n);
  }
  has(n) {
    return this._map.has(n);
  }
}
function Yr() {
  return new Gr();
}
(Oe = globalThis).__zod_globalRegistry ?? (Oe.__zod_globalRegistry = Yr());
const F = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function qr(e, n) {
  return new e({
    type: "string",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Xr(e, n) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Ee(e, n) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Hr(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Qr(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function eo(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function no(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function to(e, n) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function ro(e, n) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function oo(e, n) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function so(e, n) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function io(e, n) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function co(e, n) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function uo(e, n) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function ao(e, n) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function lo(e, n) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function fo(e, n) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function po(e, n) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function ho(e, n) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function mo(e, n) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function _o(e, n) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function go(e, n) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function vo(e, n) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function yo(e, n) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function zo(e, n) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function bo(e, n) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function wo(e, n) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function ko(e, n) {
  return new e({
    type: "number",
    checks: [],
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function $o(e, n) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Zo(e, n) {
  return new e({
    type: "boolean",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function So(e, n) {
  return new e({
    type: "null",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Oo(e) {
  return new e({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function Eo(e, n) {
  return new e({
    type: "never",
    ...d(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Pe(e, n) {
  return new Qe({
    check: "less_than",
    ...d(n),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function re(e, n) {
  return new Qe({
    check: "less_than",
    ...d(n),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function Ie(e, n) {
  return new en({
    check: "greater_than",
    ...d(n),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function oe(e, n) {
  return new en({
    check: "greater_than",
    ...d(n),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function Te(e, n) {
  return new Jt({
    check: "multiple_of",
    ...d(n),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function cn(e, n) {
  return new Ft({
    check: "max_length",
    ...d(n),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Y(e, n) {
  return new Lt({
    check: "min_length",
    ...d(n),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function un(e, n) {
  return new Mt({
    check: "length_equals",
    ...d(n),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function Po(e, n) {
  return new Vt({
    check: "string_format",
    format: "regex",
    ...d(n),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function Io(e) {
  return new Bt({
    check: "string_format",
    format: "lowercase",
    ...d(e)
  });
}
// @__NO_SIDE_EFFECTS__
function To(e) {
  return new Wt({
    check: "string_format",
    format: "uppercase",
    ...d(e)
  });
}
// @__NO_SIDE_EFFECTS__
function No(e, n) {
  return new Kt({
    check: "string_format",
    format: "includes",
    ...d(n),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function jo(e, n) {
  return new Gt({
    check: "string_format",
    format: "starts_with",
    ...d(n),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ao(e, n) {
  return new Yt({
    check: "string_format",
    format: "ends_with",
    ...d(n),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function U(e) {
  return new qt({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ro(e) {
  return /* @__PURE__ */ U((n) => n.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Co() {
  return /* @__PURE__ */ U((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Do() {
  return /* @__PURE__ */ U((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function xo() {
  return /* @__PURE__ */ U((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Jo() {
  return /* @__PURE__ */ U((e) => Mn(e));
}
// @__NO_SIDE_EFFECTS__
function Uo(e, n, t) {
  return new e({
    type: "array",
    element: n,
    // get element() {
    //   return element;
    // },
    ...d(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Fo(e, n, t) {
  return new e({
    type: "custom",
    check: "custom",
    fn: n,
    ...d(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Lo(e) {
  const n = /* @__PURE__ */ Mo((t) => (t.addIssue = (r) => {
    if (typeof r == "string")
      t.issues.push(L(r, t.value, n._zod.def));
    else {
      const o = r;
      o.fatal && (o.continue = !1), o.code ?? (o.code = "custom"), o.input ?? (o.input = t.value), o.inst ?? (o.inst = n), o.continue ?? (o.continue = !n._zod.def.abort), t.issues.push(L(o));
    }
  }, e(t.value, t)));
  return n;
}
// @__NO_SIDE_EFFECTS__
function Mo(e, n) {
  const t = new S({
    check: "custom",
    ...d(n)
  });
  return t._zod.check = e, t;
}
function q(e) {
  let n = e?.target ?? "draft-2020-12";
  return n === "draft-4" && (n = "draft-04"), n === "draft-7" && (n = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? F,
    target: n,
    unrepresentable: e?.unrepresentable ?? "throw",
    override: e?.override ?? (() => {
    }),
    io: e?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: e?.cycles ?? "ref",
    reused: e?.reused ?? "inline",
    external: e?.external ?? void 0
  };
}
function g(e, n, t = { path: [], schemaPath: [] }) {
  var r;
  const o = e._zod.def, i = n.seen.get(e);
  if (i)
    return i.count++, t.schemaPath.includes(e) && (i.cycle = t.path), i.schema;
  const s = { schema: {}, count: 1, cycle: void 0, path: t.path };
  n.seen.set(e, s);
  const c = e._zod.toJSONSchema?.();
  if (c)
    s.schema = c;
  else {
    const f = {
      ...t,
      schemaPath: [...t.schemaPath, e],
      path: t.path
    };
    if (e._zod.processJSONSchema)
      e._zod.processJSONSchema(n, s.schema, f);
    else {
      const h = s.schema, m = n.processors[o.type];
      if (!m)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);
      m(e, n, h, f);
    }
    const p = e._zod.parent;
    p && (s.ref || (s.ref = p), g(p, n, f), n.seen.get(p).isParent = !0);
  }
  const u = n.metadataRegistry.get(e);
  return u && Object.assign(s.schema, u), n.io === "input" && $(e) && (delete s.schema.examples, delete s.schema.default), n.io === "input" && s.schema._prefault && ((r = s.schema).default ?? (r.default = s.schema._prefault)), delete s.schema._prefault, n.seen.get(e).schema;
}
function X(e, n) {
  const t = e.seen.get(n);
  if (!t)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const r = /* @__PURE__ */ new Map();
  for (const s of e.seen.entries()) {
    const c = e.metadataRegistry.get(s[0])?.id;
    if (c) {
      const u = r.get(c);
      if (u && u !== s[0])
        throw new Error(`Duplicate schema id "${c}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      r.set(c, s[0]);
    }
  }
  const o = (s) => {
    const c = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const p = e.external.registry.get(s[0])?.id, h = e.external.uri ?? ((k) => k);
      if (p)
        return { ref: h(p) };
      const m = s[1].defId ?? s[1].schema.id ?? `schema${e.counter++}`;
      return s[1].defId = m, { defId: m, ref: `${h("__shared")}#/${c}/${m}` };
    }
    if (s[1] === t)
      return { ref: "#" };
    const l = `#/${c}/`, f = s[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: f, ref: l + f };
  }, i = (s) => {
    if (s[1].schema.$ref)
      return;
    const c = s[1], { ref: u, defId: l } = o(s);
    c.def = { ...c.schema }, l && (c.defId = l);
    const f = c.schema;
    for (const p in f)
      delete f[p];
    f.$ref = u;
  };
  if (e.cycles === "throw")
    for (const s of e.seen.entries()) {
      const c = s[1];
      if (c.cycle)
        throw new Error(`Cycle detected: #/${c.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (const s of e.seen.entries()) {
    const c = s[1];
    if (n === s[0]) {
      i(s);
      continue;
    }
    if (e.external) {
      const l = e.external.registry.get(s[0])?.id;
      if (n !== s[0] && l) {
        i(s);
        continue;
      }
    }
    if (e.metadataRegistry.get(s[0])?.id) {
      i(s);
      continue;
    }
    if (c.cycle) {
      i(s);
      continue;
    }
    if (c.count > 1 && e.reused === "ref") {
      i(s);
      continue;
    }
  }
}
function H(e, n) {
  const t = e.seen.get(n);
  if (!t)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const r = (s) => {
    const c = e.seen.get(s);
    if (c.ref === null)
      return;
    const u = c.def ?? c.schema, l = { ...u }, f = c.ref;
    if (c.ref = null, f) {
      r(f);
      const h = e.seen.get(f), m = h.schema;
      if (m.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (u.allOf = u.allOf ?? [], u.allOf.push(m)) : Object.assign(u, m), Object.assign(u, l), s._zod.parent === f)
        for (const w in u)
          w === "$ref" || w === "allOf" || w in l || delete u[w];
      if (m.$ref)
        for (const w in u)
          w === "$ref" || w === "allOf" || w in h.def && JSON.stringify(u[w]) === JSON.stringify(h.def[w]) && delete u[w];
    }
    const p = s._zod.parent;
    if (p && p !== f) {
      r(p);
      const h = e.seen.get(p);
      if (h?.schema.$ref && (u.$ref = h.schema.$ref, h.def))
        for (const m in u)
          m === "$ref" || m === "allOf" || m in h.def && JSON.stringify(u[m]) === JSON.stringify(h.def[m]) && delete u[m];
    }
    e.override({
      zodSchema: s,
      jsonSchema: u,
      path: c.path ?? []
    });
  };
  for (const s of [...e.seen.entries()].reverse())
    r(s[0]);
  const o = {};
  if (e.target === "draft-2020-12" ? o.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? o.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? o.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const s = e.external.registry.get(n)?.id;
    if (!s)
      throw new Error("Schema is missing an `id` property");
    o.$id = e.external.uri(s);
  }
  Object.assign(o, t.def ?? t.schema);
  const i = e.external?.defs ?? {};
  for (const s of e.seen.entries()) {
    const c = s[1];
    c.def && c.defId && (i[c.defId] = c.def);
  }
  e.external || Object.keys(i).length > 0 && (e.target === "draft-2020-12" ? o.$defs = i : o.definitions = i);
  try {
    const s = JSON.parse(JSON.stringify(o));
    return Object.defineProperty(s, "~standard", {
      value: {
        ...n["~standard"],
        jsonSchema: {
          input: Q(n, "input", e.processors),
          output: Q(n, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), s;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function $(e, n) {
  const t = n ?? { seen: /* @__PURE__ */ new Set() };
  if (t.seen.has(e))
    return !1;
  t.seen.add(e);
  const r = e._zod.def;
  if (r.type === "transform")
    return !0;
  if (r.type === "array")
    return $(r.element, t);
  if (r.type === "set")
    return $(r.valueType, t);
  if (r.type === "lazy")
    return $(r.getter(), t);
  if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault")
    return $(r.innerType, t);
  if (r.type === "intersection")
    return $(r.left, t) || $(r.right, t);
  if (r.type === "record" || r.type === "map")
    return $(r.keyType, t) || $(r.valueType, t);
  if (r.type === "pipe")
    return $(r.in, t) || $(r.out, t);
  if (r.type === "object") {
    for (const o in r.shape)
      if ($(r.shape[o], t))
        return !0;
    return !1;
  }
  if (r.type === "union") {
    for (const o of r.options)
      if ($(o, t))
        return !0;
    return !1;
  }
  if (r.type === "tuple") {
    for (const o of r.items)
      if ($(o, t))
        return !0;
    return !!(r.rest && $(r.rest, t));
  }
  return !1;
}
const Vo = (e, n = {}) => (t) => {
  const r = q({ ...t, processors: n });
  return g(e, r), X(r, e), H(r, e);
}, Q = (e, n, t = {}) => (r) => {
  const { libraryOptions: o, target: i } = r ?? {}, s = q({ ...o ?? {}, target: i, io: n, processors: t });
  return g(e, s), X(s, e), H(s, e);
}, Bo = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, an = (e, n, t, r) => {
  const o = t;
  o.type = "string";
  const { minimum: i, maximum: s, format: c, patterns: u, contentEncoding: l } = e._zod.bag;
  if (typeof i == "number" && (o.minLength = i), typeof s == "number" && (o.maxLength = s), c && (o.format = Bo[c] ?? c, o.format === "" && delete o.format, c === "time" && delete o.format), l && (o.contentEncoding = l), u && u.size > 0) {
    const f = [...u];
    f.length === 1 ? o.pattern = f[0].source : f.length > 1 && (o.allOf = [
      ...f.map((p) => ({
        ...n.target === "draft-07" || n.target === "draft-04" || n.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: p.source
      }))
    ]);
  }
}, ln = (e, n, t, r) => {
  const o = t, { minimum: i, maximum: s, format: c, multipleOf: u, exclusiveMaximum: l, exclusiveMinimum: f } = e._zod.bag;
  typeof c == "string" && c.includes("int") ? o.type = "integer" : o.type = "number", typeof f == "number" && (n.target === "draft-04" || n.target === "openapi-3.0" ? (o.minimum = f, o.exclusiveMinimum = !0) : o.exclusiveMinimum = f), typeof i == "number" && (o.minimum = i, typeof f == "number" && n.target !== "draft-04" && (f >= i ? delete o.minimum : delete o.exclusiveMinimum)), typeof l == "number" && (n.target === "draft-04" || n.target === "openapi-3.0" ? (o.maximum = l, o.exclusiveMaximum = !0) : o.exclusiveMaximum = l), typeof s == "number" && (o.maximum = s, typeof l == "number" && n.target !== "draft-04" && (l <= s ? delete o.maximum : delete o.exclusiveMaximum)), typeof u == "number" && (o.multipleOf = u);
}, fn = (e, n, t, r) => {
  t.type = "boolean";
}, Wo = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("BigInt cannot be represented in JSON Schema");
}, Ko = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Symbols cannot be represented in JSON Schema");
}, pn = (e, n, t, r) => {
  n.target === "openapi-3.0" ? (t.type = "string", t.nullable = !0, t.enum = [null]) : t.type = "null";
}, Go = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Undefined cannot be represented in JSON Schema");
}, Yo = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Void cannot be represented in JSON Schema");
}, dn = (e, n, t, r) => {
  t.not = {};
}, qo = (e, n, t, r) => {
}, hn = (e, n, t, r) => {
}, Xo = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Date cannot be represented in JSON Schema");
}, mn = (e, n, t, r) => {
  const o = e._zod.def, i = Le(o.entries);
  i.every((s) => typeof s == "number") && (t.type = "number"), i.every((s) => typeof s == "string") && (t.type = "string"), t.enum = i;
}, _n = (e, n, t, r) => {
  const o = e._zod.def, i = [];
  for (const s of o.values)
    if (s === void 0) {
      if (n.unrepresentable === "throw")
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
    } else if (typeof s == "bigint") {
      if (n.unrepresentable === "throw")
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      i.push(Number(s));
    } else
      i.push(s);
  if (i.length !== 0) if (i.length === 1) {
    const s = i[0];
    t.type = s === null ? "null" : typeof s, n.target === "draft-04" || n.target === "openapi-3.0" ? t.enum = [s] : t.const = s;
  } else
    i.every((s) => typeof s == "number") && (t.type = "number"), i.every((s) => typeof s == "string") && (t.type = "string"), i.every((s) => typeof s == "boolean") && (t.type = "boolean"), i.every((s) => s === null) && (t.type = "null"), t.enum = i;
}, Ho = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("NaN cannot be represented in JSON Schema");
}, Qo = (e, n, t, r) => {
  const o = t, i = e._zod.pattern;
  if (!i)
    throw new Error("Pattern not found in template literal");
  o.type = "string", o.pattern = i.source;
}, es = (e, n, t, r) => {
  const o = t, i = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  }, { minimum: s, maximum: c, mime: u } = e._zod.bag;
  s !== void 0 && (i.minLength = s), c !== void 0 && (i.maxLength = c), u ? u.length === 1 ? (i.contentMediaType = u[0], Object.assign(o, i)) : (Object.assign(o, i), o.anyOf = u.map((l) => ({ contentMediaType: l }))) : Object.assign(o, i);
}, ns = (e, n, t, r) => {
  t.type = "boolean";
}, gn = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, ts = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Function types cannot be represented in JSON Schema");
}, vn = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, rs = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Map cannot be represented in JSON Schema");
}, os = (e, n, t, r) => {
  if (n.unrepresentable === "throw")
    throw new Error("Set cannot be represented in JSON Schema");
}, yn = (e, n, t, r) => {
  const o = t, i = e._zod.def, { minimum: s, maximum: c } = e._zod.bag;
  typeof s == "number" && (o.minItems = s), typeof c == "number" && (o.maxItems = c), o.type = "array", o.items = g(i.element, n, { ...r, path: [...r.path, "items"] });
}, zn = (e, n, t, r) => {
  const o = t, i = e._zod.def;
  o.type = "object", o.properties = {};
  const s = i.shape;
  for (const l in s)
    o.properties[l] = g(s[l], n, {
      ...r,
      path: [...r.path, "properties", l]
    });
  const c = new Set(Object.keys(s)), u = new Set([...c].filter((l) => {
    const f = i.shape[l]._zod;
    return n.io === "input" ? f.optin === void 0 : f.optout === void 0;
  }));
  u.size > 0 && (o.required = Array.from(u)), i.catchall?._zod.def.type === "never" ? o.additionalProperties = !1 : i.catchall ? i.catchall && (o.additionalProperties = g(i.catchall, n, {
    ...r,
    path: [...r.path, "additionalProperties"]
  })) : n.io === "output" && (o.additionalProperties = !1);
}, bn = (e, n, t, r) => {
  const o = e._zod.def, i = o.inclusive === !1, s = o.options.map((c, u) => g(c, n, {
    ...r,
    path: [...r.path, i ? "oneOf" : "anyOf", u]
  }));
  i ? t.oneOf = s : t.anyOf = s;
}, wn = (e, n, t, r) => {
  const o = e._zod.def, i = g(o.left, n, {
    ...r,
    path: [...r.path, "allOf", 0]
  }), s = g(o.right, n, {
    ...r,
    path: [...r.path, "allOf", 1]
  }), c = (l) => "allOf" in l && Object.keys(l).length === 1, u = [
    ...c(i) ? i.allOf : [i],
    ...c(s) ? s.allOf : [s]
  ];
  t.allOf = u;
}, ss = (e, n, t, r) => {
  const o = t, i = e._zod.def;
  o.type = "array";
  const s = n.target === "draft-2020-12" ? "prefixItems" : "items", c = n.target === "draft-2020-12" || n.target === "openapi-3.0" ? "items" : "additionalItems", u = i.items.map((h, m) => g(h, n, {
    ...r,
    path: [...r.path, s, m]
  })), l = i.rest ? g(i.rest, n, {
    ...r,
    path: [...r.path, c, ...n.target === "openapi-3.0" ? [i.items.length] : []]
  }) : null;
  n.target === "draft-2020-12" ? (o.prefixItems = u, l && (o.items = l)) : n.target === "openapi-3.0" ? (o.items = {
    anyOf: u
  }, l && o.items.anyOf.push(l), o.minItems = u.length, l || (o.maxItems = u.length)) : (o.items = u, l && (o.additionalItems = l));
  const { minimum: f, maximum: p } = e._zod.bag;
  typeof f == "number" && (o.minItems = f), typeof p == "number" && (o.maxItems = p);
}, kn = (e, n, t, r) => {
  const o = t, i = e._zod.def;
  o.type = "object";
  const s = i.keyType, u = s._zod.bag?.patterns;
  if (i.mode === "loose" && u && u.size > 0) {
    const f = g(i.valueType, n, {
      ...r,
      path: [...r.path, "patternProperties", "*"]
    });
    o.patternProperties = {};
    for (const p of u)
      o.patternProperties[p.source] = f;
  } else
    (n.target === "draft-07" || n.target === "draft-2020-12") && (o.propertyNames = g(i.keyType, n, {
      ...r,
      path: [...r.path, "propertyNames"]
    })), o.additionalProperties = g(i.valueType, n, {
      ...r,
      path: [...r.path, "additionalProperties"]
    });
  const l = s._zod.values;
  if (l) {
    const f = [...l].filter((p) => typeof p == "string" || typeof p == "number");
    f.length > 0 && (o.required = f);
  }
}, $n = (e, n, t, r) => {
  const o = e._zod.def, i = g(o.innerType, n, r), s = n.seen.get(e);
  n.target === "openapi-3.0" ? (s.ref = o.innerType, t.nullable = !0) : t.anyOf = [i, { type: "null" }];
}, Zn = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType;
}, Sn = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType, t.default = JSON.parse(JSON.stringify(o.defaultValue));
}, On = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType, n.io === "input" && (t._prefault = JSON.parse(JSON.stringify(o.defaultValue)));
}, En = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType;
  let s;
  try {
    s = o.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  t.default = s;
}, Pn = (e, n, t, r) => {
  const o = e._zod.def, i = n.io === "input" ? o.in._zod.def.type === "transform" ? o.out : o.in : o.out;
  g(i, n, r);
  const s = n.seen.get(e);
  s.ref = i;
}, In = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType, t.readOnly = !0;
}, is = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType;
}, me = (e, n, t, r) => {
  const o = e._zod.def;
  g(o.innerType, n, r);
  const i = n.seen.get(e);
  i.ref = o.innerType;
}, Tn = (e, n, t, r) => {
  const o = e._zod.innerType;
  g(o, n, r);
  const i = n.seen.get(e);
  i.ref = o;
}, Ne = {
  string: an,
  number: ln,
  boolean: fn,
  bigint: Wo,
  symbol: Ko,
  null: pn,
  undefined: Go,
  void: Yo,
  never: dn,
  any: qo,
  unknown: hn,
  date: Xo,
  enum: mn,
  literal: _n,
  nan: Ho,
  template_literal: Qo,
  file: es,
  success: ns,
  custom: gn,
  function: ts,
  transform: vn,
  map: rs,
  set: os,
  array: yn,
  object: zn,
  union: bn,
  intersection: wn,
  tuple: ss,
  record: kn,
  nullable: $n,
  nonoptional: Zn,
  default: Sn,
  prefault: On,
  catch: En,
  pipe: Pn,
  readonly: In,
  promise: is,
  optional: me,
  lazy: Tn
};
function Ii(e, n) {
  if ("_idmap" in e) {
    const r = e, o = q({ ...n, processors: Ne }), i = {};
    for (const u of r._idmap.entries()) {
      const [l, f] = u;
      g(f, o);
    }
    const s = {}, c = {
      registry: r,
      uri: n?.uri,
      defs: i
    };
    o.external = c;
    for (const u of r._idmap.entries()) {
      const [l, f] = u;
      X(o, f), s[l] = H(o, f);
    }
    if (Object.keys(i).length > 0) {
      const u = o.target === "draft-2020-12" ? "$defs" : "definitions";
      s.__shared = {
        [u]: i
      };
    }
    return { schemas: s };
  }
  const t = q({ ...n, processors: Ne });
  return g(e, t), X(t, e), H(t, e);
}
const cs = /* @__PURE__ */ a("ZodISODateTime", (e, n) => {
  lr.init(e, n), b.init(e, n);
});
function us(e) {
  return /* @__PURE__ */ yo(cs, e);
}
const as = /* @__PURE__ */ a("ZodISODate", (e, n) => {
  fr.init(e, n), b.init(e, n);
});
function ls(e) {
  return /* @__PURE__ */ zo(as, e);
}
const fs = /* @__PURE__ */ a("ZodISOTime", (e, n) => {
  pr.init(e, n), b.init(e, n);
});
function ps(e) {
  return /* @__PURE__ */ bo(fs, e);
}
const ds = /* @__PURE__ */ a("ZodISODuration", (e, n) => {
  dr.init(e, n), b.init(e, n);
});
function hs(e) {
  return /* @__PURE__ */ wo(ds, e);
}
const ms = (e, n) => {
  We.init(e, n), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (t) => tt(e, t)
      // enumerable: false,
    },
    flatten: {
      value: (t) => nt(e, t)
      // enumerable: false,
    },
    addIssue: {
      value: (t) => {
        e.issues.push(t), e.message = JSON.stringify(e.issues, se, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (t) => {
        e.issues.push(...t), e.message = JSON.stringify(e.issues, se, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, O = a("ZodError", ms, {
  Parent: Error
}), _s = /* @__PURE__ */ pe(O), gs = /* @__PURE__ */ de(O), vs = /* @__PURE__ */ ee(O), ys = /* @__PURE__ */ ne(O), zs = /* @__PURE__ */ st(O), bs = /* @__PURE__ */ it(O), ws = /* @__PURE__ */ ct(O), ks = /* @__PURE__ */ ut(O), $s = /* @__PURE__ */ at(O), Zs = /* @__PURE__ */ lt(O), Ss = /* @__PURE__ */ ft(O), Os = /* @__PURE__ */ pt(O), y = /* @__PURE__ */ a("ZodType", (e, n) => (v.init(e, n), Object.assign(e["~standard"], {
  jsonSchema: {
    input: Q(e, "input"),
    output: Q(e, "output")
  }
}), e.toJSONSchema = Vo(e, {}), e.def = n, e.type = n.type, Object.defineProperty(e, "_def", { value: n }), e.check = (...t) => e.clone(j(n, {
  checks: [
    ...n.checks ?? [],
    ...t.map((r) => typeof r == "function" ? { _zod: { check: r, def: { check: "custom" }, onattach: [] } } : r)
  ]
}), {
  parent: !0
}), e.with = e.check, e.clone = (t, r) => I(e, t, r), e.brand = () => e, e.register = ((t, r) => (t.add(e, r), e)), e.parse = (t, r) => _s(e, t, r, { callee: e.parse }), e.safeParse = (t, r) => vs(e, t, r), e.parseAsync = async (t, r) => gs(e, t, r, { callee: e.parseAsync }), e.safeParseAsync = async (t, r) => ys(e, t, r), e.spa = e.safeParseAsync, e.encode = (t, r) => zs(e, t, r), e.decode = (t, r) => bs(e, t, r), e.encodeAsync = async (t, r) => ws(e, t, r), e.decodeAsync = async (t, r) => ks(e, t, r), e.safeEncode = (t, r) => $s(e, t, r), e.safeDecode = (t, r) => Zs(e, t, r), e.safeEncodeAsync = async (t, r) => Ss(e, t, r), e.safeDecodeAsync = async (t, r) => Os(e, t, r), e.refine = (t, r) => e.check(Oi(t, r)), e.superRefine = (t) => e.check(Ei(t)), e.overwrite = (t) => e.check(/* @__PURE__ */ U(t)), e.optional = () => De(e), e.exactOptional = () => pi(e), e.nullable = () => xe(e), e.nullish = () => De(xe(e)), e.nonoptional = (t) => vi(e, t), e.array = () => An(e), e.or = (t) => Rn([e, t]), e.and = (t) => si(e, t), e.transform = (t) => Je(e, li(t)), e.default = (t) => mi(e, t), e.prefault = (t) => gi(e, t), e.catch = (t) => zi(e, t), e.pipe = (t) => Je(e, t), e.readonly = () => ki(e), e.describe = (t) => {
  const r = e.clone();
  return F.add(r, { description: t }), r;
}, Object.defineProperty(e, "description", {
  get() {
    return F.get(e)?.description;
  },
  configurable: !0
}), e.meta = (...t) => {
  if (t.length === 0)
    return F.get(e);
  const r = e.clone();
  return F.add(r, t[0]), r;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (t) => t(e), e)), Nn = /* @__PURE__ */ a("_ZodString", (e, n) => {
  he.init(e, n), y.init(e, n), e._zod.processJSONSchema = (r, o, i) => an(e, r, o);
  const t = e._zod.bag;
  e.format = t.format ?? null, e.minLength = t.minimum ?? null, e.maxLength = t.maximum ?? null, e.regex = (...r) => e.check(/* @__PURE__ */ Po(...r)), e.includes = (...r) => e.check(/* @__PURE__ */ No(...r)), e.startsWith = (...r) => e.check(/* @__PURE__ */ jo(...r)), e.endsWith = (...r) => e.check(/* @__PURE__ */ Ao(...r)), e.min = (...r) => e.check(/* @__PURE__ */ Y(...r)), e.max = (...r) => e.check(/* @__PURE__ */ cn(...r)), e.length = (...r) => e.check(/* @__PURE__ */ un(...r)), e.nonempty = (...r) => e.check(/* @__PURE__ */ Y(1, ...r)), e.lowercase = (r) => e.check(/* @__PURE__ */ Io(r)), e.uppercase = (r) => e.check(/* @__PURE__ */ To(r)), e.trim = () => e.check(/* @__PURE__ */ Co()), e.normalize = (...r) => e.check(/* @__PURE__ */ Ro(...r)), e.toLowerCase = () => e.check(/* @__PURE__ */ Do()), e.toUpperCase = () => e.check(/* @__PURE__ */ xo()), e.slugify = () => e.check(/* @__PURE__ */ Jo());
}), Es = /* @__PURE__ */ a("ZodString", (e, n) => {
  he.init(e, n), Nn.init(e, n), e.email = (t) => e.check(/* @__PURE__ */ Xr(Ps, t)), e.url = (t) => e.check(/* @__PURE__ */ to(Is, t)), e.jwt = (t) => e.check(/* @__PURE__ */ vo(Bs, t)), e.emoji = (t) => e.check(/* @__PURE__ */ ro(Ts, t)), e.guid = (t) => e.check(/* @__PURE__ */ Ee(Ae, t)), e.uuid = (t) => e.check(/* @__PURE__ */ Hr(W, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ Qr(W, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ eo(W, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ no(W, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ oo(Ns, t)), e.guid = (t) => e.check(/* @__PURE__ */ Ee(Ae, t)), e.cuid = (t) => e.check(/* @__PURE__ */ so(js, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ io(As, t)), e.ulid = (t) => e.check(/* @__PURE__ */ co(Rs, t)), e.base64 = (t) => e.check(/* @__PURE__ */ mo(Ls, t)), e.base64url = (t) => e.check(/* @__PURE__ */ _o(Ms, t)), e.xid = (t) => e.check(/* @__PURE__ */ uo(Cs, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ ao(Ds, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ lo(xs, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ fo(Js, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ po(Us, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ ho(Fs, t)), e.e164 = (t) => e.check(/* @__PURE__ */ go(Vs, t)), e.datetime = (t) => e.check(us(t)), e.date = (t) => e.check(ls(t)), e.time = (t) => e.check(ps(t)), e.duration = (t) => e.check(hs(t));
});
function je(e) {
  return /* @__PURE__ */ qr(Es, e);
}
const b = /* @__PURE__ */ a("ZodStringFormat", (e, n) => {
  z.init(e, n), Nn.init(e, n);
}), Ps = /* @__PURE__ */ a("ZodEmail", (e, n) => {
  nr.init(e, n), b.init(e, n);
}), Ae = /* @__PURE__ */ a("ZodGUID", (e, n) => {
  Qt.init(e, n), b.init(e, n);
}), W = /* @__PURE__ */ a("ZodUUID", (e, n) => {
  er.init(e, n), b.init(e, n);
}), Is = /* @__PURE__ */ a("ZodURL", (e, n) => {
  tr.init(e, n), b.init(e, n);
}), Ts = /* @__PURE__ */ a("ZodEmoji", (e, n) => {
  rr.init(e, n), b.init(e, n);
}), Ns = /* @__PURE__ */ a("ZodNanoID", (e, n) => {
  or.init(e, n), b.init(e, n);
}), js = /* @__PURE__ */ a("ZodCUID", (e, n) => {
  sr.init(e, n), b.init(e, n);
}), As = /* @__PURE__ */ a("ZodCUID2", (e, n) => {
  ir.init(e, n), b.init(e, n);
}), Rs = /* @__PURE__ */ a("ZodULID", (e, n) => {
  cr.init(e, n), b.init(e, n);
}), Cs = /* @__PURE__ */ a("ZodXID", (e, n) => {
  ur.init(e, n), b.init(e, n);
}), Ds = /* @__PURE__ */ a("ZodKSUID", (e, n) => {
  ar.init(e, n), b.init(e, n);
}), xs = /* @__PURE__ */ a("ZodIPv4", (e, n) => {
  hr.init(e, n), b.init(e, n);
}), Js = /* @__PURE__ */ a("ZodIPv6", (e, n) => {
  mr.init(e, n), b.init(e, n);
}), Us = /* @__PURE__ */ a("ZodCIDRv4", (e, n) => {
  _r.init(e, n), b.init(e, n);
}), Fs = /* @__PURE__ */ a("ZodCIDRv6", (e, n) => {
  gr.init(e, n), b.init(e, n);
}), Ls = /* @__PURE__ */ a("ZodBase64", (e, n) => {
  vr.init(e, n), b.init(e, n);
}), Ms = /* @__PURE__ */ a("ZodBase64URL", (e, n) => {
  zr.init(e, n), b.init(e, n);
}), Vs = /* @__PURE__ */ a("ZodE164", (e, n) => {
  br.init(e, n), b.init(e, n);
}), Bs = /* @__PURE__ */ a("ZodJWT", (e, n) => {
  kr.init(e, n), b.init(e, n);
}), jn = /* @__PURE__ */ a("ZodNumber", (e, n) => {
  tn.init(e, n), y.init(e, n), e._zod.processJSONSchema = (r, o, i) => ln(e, r, o), e.gt = (r, o) => e.check(/* @__PURE__ */ Ie(r, o)), e.gte = (r, o) => e.check(/* @__PURE__ */ oe(r, o)), e.min = (r, o) => e.check(/* @__PURE__ */ oe(r, o)), e.lt = (r, o) => e.check(/* @__PURE__ */ Pe(r, o)), e.lte = (r, o) => e.check(/* @__PURE__ */ re(r, o)), e.max = (r, o) => e.check(/* @__PURE__ */ re(r, o)), e.int = (r) => e.check(Re(r)), e.safe = (r) => e.check(Re(r)), e.positive = (r) => e.check(/* @__PURE__ */ Ie(0, r)), e.nonnegative = (r) => e.check(/* @__PURE__ */ oe(0, r)), e.negative = (r) => e.check(/* @__PURE__ */ Pe(0, r)), e.nonpositive = (r) => e.check(/* @__PURE__ */ re(0, r)), e.multipleOf = (r, o) => e.check(/* @__PURE__ */ Te(r, o)), e.step = (r, o) => e.check(/* @__PURE__ */ Te(r, o)), e.finite = () => e;
  const t = e._zod.bag;
  e.minValue = Math.max(t.minimum ?? Number.NEGATIVE_INFINITY, t.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(t.maximum ?? Number.POSITIVE_INFINITY, t.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (t.format ?? "").includes("int") || Number.isSafeInteger(t.multipleOf ?? 0.5), e.isFinite = !0, e.format = t.format ?? null;
});
function Ws(e) {
  return /* @__PURE__ */ ko(jn, e);
}
const Ks = /* @__PURE__ */ a("ZodNumberFormat", (e, n) => {
  $r.init(e, n), jn.init(e, n);
});
function Re(e) {
  return /* @__PURE__ */ $o(Ks, e);
}
const Gs = /* @__PURE__ */ a("ZodBoolean", (e, n) => {
  Zr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => fn(e, t, r);
});
function Ys(e) {
  return /* @__PURE__ */ Zo(Gs, e);
}
const qs = /* @__PURE__ */ a("ZodNull", (e, n) => {
  Sr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => pn(e, t, r);
});
function Xs(e) {
  return /* @__PURE__ */ So(qs, e);
}
const Hs = /* @__PURE__ */ a("ZodUnknown", (e, n) => {
  Or.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => hn();
});
function Ce() {
  return /* @__PURE__ */ Oo(Hs);
}
const Qs = /* @__PURE__ */ a("ZodNever", (e, n) => {
  Er.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => dn(e, t, r);
});
function ei(e) {
  return /* @__PURE__ */ Eo(Qs, e);
}
const ni = /* @__PURE__ */ a("ZodArray", (e, n) => {
  Pr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => yn(e, t, r, o), e.element = n.element, e.min = (t, r) => e.check(/* @__PURE__ */ Y(t, r)), e.nonempty = (t) => e.check(/* @__PURE__ */ Y(1, t)), e.max = (t, r) => e.check(/* @__PURE__ */ cn(t, r)), e.length = (t, r) => e.check(/* @__PURE__ */ un(t, r)), e.unwrap = () => e.element;
});
function An(e, n) {
  return /* @__PURE__ */ Uo(ni, e, n);
}
const ti = /* @__PURE__ */ a("ZodObject", (e, n) => {
  Tr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => zn(e, t, r, o), _(e, "shape", () => n.shape), e.keyof = () => ci(Object.keys(e._zod.def.shape)), e.catchall = (t) => e.clone({ ...e._zod.def, catchall: t }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: Ce() }), e.loose = () => e.clone({ ...e._zod.def, catchall: Ce() }), e.strict = () => e.clone({ ...e._zod.def, catchall: ei() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (t) => qn(e, t), e.safeExtend = (t) => Xn(e, t), e.merge = (t) => Hn(e, t), e.pick = (t) => Gn(e, t), e.omit = (t) => Yn(e, t), e.partial = (...t) => Qn(Dn, e, t[0]), e.required = (...t) => et(xn, e, t[0]);
});
function Ti(e, n) {
  const t = {
    type: "object",
    shape: e ?? {},
    ...d(n)
  };
  return new ti(t);
}
const ri = /* @__PURE__ */ a("ZodUnion", (e, n) => {
  Nr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => bn(e, t, r, o), e.options = n.options;
});
function Rn(e, n) {
  return new ri({
    type: "union",
    options: e,
    ...d(n)
  });
}
const oi = /* @__PURE__ */ a("ZodIntersection", (e, n) => {
  jr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => wn(e, t, r, o);
});
function si(e, n) {
  return new oi({
    type: "intersection",
    left: e,
    right: n
  });
}
const Cn = /* @__PURE__ */ a("ZodRecord", (e, n) => {
  Ar.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => kn(e, t, r, o), e.keyType = n.keyType, e.valueType = n.valueType;
});
function ii(e, n, t) {
  return new Cn({
    type: "record",
    keyType: e,
    valueType: n,
    ...d(t)
  });
}
function Ni(e, n, t) {
  const r = I(e);
  return r._zod.values = void 0, new Cn({
    type: "record",
    keyType: r,
    valueType: n,
    ...d(t)
  });
}
const ce = /* @__PURE__ */ a("ZodEnum", (e, n) => {
  Rr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (r, o, i) => mn(e, r, o), e.enum = n.entries, e.options = Object.values(n.entries);
  const t = new Set(Object.keys(n.entries));
  e.extract = (r, o) => {
    const i = {};
    for (const s of r)
      if (t.has(s))
        i[s] = n.entries[s];
      else
        throw new Error(`Key ${s} not found in enum`);
    return new ce({
      ...n,
      checks: [],
      ...d(o),
      entries: i
    });
  }, e.exclude = (r, o) => {
    const i = { ...n.entries };
    for (const s of r)
      if (t.has(s))
        delete i[s];
      else
        throw new Error(`Key ${s} not found in enum`);
    return new ce({
      ...n,
      checks: [],
      ...d(o),
      entries: i
    });
  };
});
function ci(e, n) {
  const t = Array.isArray(e) ? Object.fromEntries(e.map((r) => [r, r])) : e;
  return new ce({
    type: "enum",
    entries: t,
    ...d(n)
  });
}
const ui = /* @__PURE__ */ a("ZodLiteral", (e, n) => {
  Cr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => _n(e, t, r), e.values = new Set(n.values), Object.defineProperty(e, "value", {
    get() {
      if (n.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return n.values[0];
    }
  });
});
function ji(e, n) {
  return new ui({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...d(n)
  });
}
const ai = /* @__PURE__ */ a("ZodTransform", (e, n) => {
  Dr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => vn(e, t), e._zod.parse = (t, r) => {
    if (r.direction === "backward")
      throw new Ue(e.constructor.name);
    t.addIssue = (i) => {
      if (typeof i == "string")
        t.issues.push(L(i, t.value, n));
      else {
        const s = i;
        s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), s.input ?? (s.input = t.value), s.inst ?? (s.inst = e), t.issues.push(L(s));
      }
    };
    const o = n.transform(t.value, t);
    return o instanceof Promise ? o.then((i) => (t.value = i, t)) : (t.value = o, t);
  };
});
function li(e) {
  return new ai({
    type: "transform",
    transform: e
  });
}
const Dn = /* @__PURE__ */ a("ZodOptional", (e, n) => {
  sn.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => me(e, t, r, o), e.unwrap = () => e._zod.def.innerType;
});
function De(e) {
  return new Dn({
    type: "optional",
    innerType: e
  });
}
const fi = /* @__PURE__ */ a("ZodExactOptional", (e, n) => {
  xr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => me(e, t, r, o), e.unwrap = () => e._zod.def.innerType;
});
function pi(e) {
  return new fi({
    type: "optional",
    innerType: e
  });
}
const di = /* @__PURE__ */ a("ZodNullable", (e, n) => {
  Jr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => $n(e, t, r, o), e.unwrap = () => e._zod.def.innerType;
});
function xe(e) {
  return new di({
    type: "nullable",
    innerType: e
  });
}
const hi = /* @__PURE__ */ a("ZodDefault", (e, n) => {
  Ur.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => Sn(e, t, r, o), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function mi(e, n) {
  return new hi({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof n == "function" ? n() : Ve(n);
    }
  });
}
const _i = /* @__PURE__ */ a("ZodPrefault", (e, n) => {
  Fr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => On(e, t, r, o), e.unwrap = () => e._zod.def.innerType;
});
function gi(e, n) {
  return new _i({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof n == "function" ? n() : Ve(n);
    }
  });
}
const xn = /* @__PURE__ */ a("ZodNonOptional", (e, n) => {
  Lr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => Zn(e, t, r, o), e.unwrap = () => e._zod.def.innerType;
});
function vi(e, n) {
  return new xn({
    type: "nonoptional",
    innerType: e,
    ...d(n)
  });
}
const yi = /* @__PURE__ */ a("ZodCatch", (e, n) => {
  Mr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => En(e, t, r, o), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function zi(e, n) {
  return new yi({
    type: "catch",
    innerType: e,
    catchValue: typeof n == "function" ? n : () => n
  });
}
const bi = /* @__PURE__ */ a("ZodPipe", (e, n) => {
  Vr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => Pn(e, t, r, o), e.in = n.in, e.out = n.out;
});
function Je(e, n) {
  return new bi({
    type: "pipe",
    in: e,
    out: n
    // ...util.normalizeParams(params),
  });
}
const wi = /* @__PURE__ */ a("ZodReadonly", (e, n) => {
  Br.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => In(e, t, r, o), e.unwrap = () => e._zod.def.innerType;
});
function ki(e) {
  return new wi({
    type: "readonly",
    innerType: e
  });
}
const $i = /* @__PURE__ */ a("ZodLazy", (e, n) => {
  Wr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => Tn(e, t, r, o), e.unwrap = () => e._zod.def.getter();
});
function Zi(e) {
  return new $i({
    type: "lazy",
    getter: e
  });
}
const Si = /* @__PURE__ */ a("ZodCustom", (e, n) => {
  Kr.init(e, n), y.init(e, n), e._zod.processJSONSchema = (t, r, o) => gn(e, t);
});
function Oi(e, n = {}) {
  return /* @__PURE__ */ Fo(Si, e, n);
}
function Ei(e) {
  return /* @__PURE__ */ Lo(e);
}
function Ai(e) {
  const n = Zi(() => Rn([je(e), Ws(), Ys(), Xs(), An(n), ii(je(), n)]));
  return n;
}
export {
  ci as _,
  An as a,
  Zi as b,
  Ys as c,
  Rn as d,
  Xs as e,
  Ai as j,
  ji as l,
  Ws as n,
  Ti as o,
  Ni as p,
  ii as r,
  je as s,
  Ii as t,
  Ce as u
};
