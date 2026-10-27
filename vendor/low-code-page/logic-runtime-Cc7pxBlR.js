import { c as je, a as De } from "./id-DAU2FMyk.js";
import { u as x, i as Y, a as Ne, n as ae, p as Ce, r as Fe, w as we, S as oe, q as le, y as pe, o as ge, x as Se, s as he, t as de, v as Je } from "./split-layout-CBltrNgl.js";
function Re(e, o) {
  const s = x(e.logic);
  for (const [i, y] of Object.entries(s.fields)) {
    const k = o.initialValues?.[y.formId ?? "main"];
    k && Object.hasOwn(k, y.name ?? i) && (y.defaultValue = x(k[y.name ?? i]));
  }
  for (const i of s.events)
    for (const y of [...i.steps, ...i.onError ?? []]) {
      if (y.type !== "dialog.open") continue;
      const k = e.dialogs[y.targetId];
      k && (y.formId ??= k.formId, y.defaults = {
        ...Object.fromEntries(
          Object.entries(s.fields).filter(
            ([, S]) => (S.formId ?? "main") === y.formId
          ).map(([S, N]) => [
            N.name ?? S,
            N.defaultValue ?? null
          ])
        ),
        ...y.defaults
      }, y.input = {
        record: { from: "row", fallback: {} },
        draft: {
          from: "object",
          entries: x(k.initialBindings)
        },
        ...y.input
      });
    }
  const d = /* @__PURE__ */ new Map(), n = (i, y) => Array.isArray(i) ? i.map((k) => n(k, y)) : !Y(i) || i.from === "constant" ? i : Object.fromEntries(
    Object.entries({
      ...i,
      ...i.from === "form" && !i.formId ? { formId: y } : {}
    }).map(([k, S]) => [k, n(S, y)])
  ), t = (i, y = [], k = "main") => {
    if (Array.isArray(i)) {
      i.forEach((S) => t(S, y, k));
      return;
    }
    if (Y(i))
      if (typeof i.type == "string" && Y(i.props)) {
        const S = i.props, N = e.logic.rules.filter(
          (f) => f.targetId === S.id
        ), v = N.filter((f) => f.property === "visible").map(
          (f) => f.scriptId ? {
            operator: "equals",
            left: {
              from: "page",
              path: [`__rule:${f.id}`]
            },
            right: { from: "constant", value: !0 }
          } : f.condition ?? (f.conditions ? {
            operator: f.combinator ?? "all",
            conditions: f.conditions
          } : f)
        ), b = [
          ...y,
          ...v.map((f) => n(f, k)),
          ...S.visibleWhen ? [n(S.visibleWhen, k)] : []
        ];
        if (typeof S.fieldId == "string" && !(i.type === "TextField" && S.valueMode === "value")) {
          const f = s.fields[S.fieldId];
          if (f) {
            for (const h of N.filter(
              (a) => a.property !== "visible"
            ))
              s.rules.push({
                ...n(h, k),
                id: `__field:${S.fieldId}:${h.id}`,
                targetId: f.nodeId ?? S.fieldId
              });
            const $ = s.bindings.find(
              (h) => h.nodeId === S.id && h.property === "options"
            );
            $ && !f.optionsSource && (f.optionsSource = n($.value, k), f.optionMapping = $.map);
          }
          const j = d.get(S.fieldId) ?? [];
          d.set(S.fieldId, [
            ...j,
            { operator: "all", conditions: b }
          ]);
        }
        Object.entries(S).forEach(
          ([f, j]) => !Ne(S, f) && t(
            j,
            b,
            typeof S.formId == "string" ? S.formId : k
          )
        );
      } else
        Object.values(i).forEach(
          (S) => t(S, y, k)
        );
  };
  t(e.page), Object.values(e.cells).forEach((i) => t(i)), Object.values(e.dialogs).forEach(
    (i) => t(i.content, [], i.formId)
  );
  for (const [i, y] of d)
    s.fields[i] && s.rules.push({
      id: `__placement:${i}`,
      targetId: s.fields[i].nodeId ?? i,
      property: "visible",
      condition: { operator: "any", conditions: y }
    });
  return s;
}
function Ve(e) {
  const o = (i) => ({
    instanceId: String(i.instanceId),
    definitionId: String(i.targetId),
    row: Y(i.record) ? i.record : {},
    formId: String(
      i.formId ?? e.dialogs[String(i.targetId)]?.formId ?? "main"
    )
  });
  let s, d = null, n, t = [];
  return (i) => (i.dialogStack !== n && (n = i.dialogStack, t = (i.dialogStack ?? []).map(o)), i.dialog !== s && (s = i.dialog, d = i.dialog.instanceId ? {
    instanceId: String(i.dialog.instanceId),
    definitionId: String(i.dialog.targetId),
    row: Y(i.dialog.record) ? i.dialog.record : {},
    formId: String(
      i.dialog.formId ?? e.dialogs[String(i.dialog.targetId)]?.formId ?? "main"
    )
  } : null), {
    forms: i.forms ?? {},
    errors: i.errors,
    sources: i.sources,
    tables: i.tables,
    dialog: d,
    dialogStack: t,
    busy: i.busy,
    feedback: typeof i.page.__feedback == "string" ? i.page.__feedback : "",
    page: i.page
  });
}
function Le(e, o, s) {
  const d = (o.request?.method ?? "GET").toUpperCase(), n = s.query ?? (d === "GET" ? s.params : {});
  Object.entries(n).forEach(([t, i]) => {
    i != null && e.searchParams.set(t, String(i));
  });
  for (const t of Object.keys(s.headers ?? {}))
    if (/authorization|cookie|token|api[-_]?key/i.test(t))
      throw new Error("凭据只能由宿主注入");
  return {
    method: d,
    headers: {
      "Content-Type": "application/json",
      ...Object.fromEntries(
        Object.entries(s.headers ?? {}).map(([t, i]) => [
          t,
          String(i)
        ])
      )
    },
    body: ["GET", "HEAD"].includes(d) ? void 0 : JSON.stringify(s.body ?? s.params),
    signal: s.signal,
    credentials: "omit",
    redirect: "error"
  };
}
async function Te(e, o, s) {
  if (o.signal.aborted)
    throw new DOMException("请求已取消", "AbortError");
  return e.kind === "local" ? x(e.data ?? null) : s(e, o);
}
function Pe(e = {}) {
  return async (o, s) => {
    if (o.kind === "local") return x(o.data ?? null);
    if (o.kind === "host") {
      const k = ae(e.host, [
        o.hostKey ?? o.id
      ]);
      if (k === void 0)
        throw new Error(
          `宿主未公开数据：${o.hostKey ?? o.id}`
        );
      return x(k);
    }
    const d = o.request?.mode === "url", n = e.connections?.[o.request?.connectionId ?? ""];
    if (!d && !n)
      throw new Error(
        `宿主未登记连接：${o.request?.connectionId ?? ""}`
      );
    if (!d && typeof n == "function")
      return n(o, s);
    const t = d ? Ce(o.request?.url ?? "") : Fe(
      n,
      o.request?.path ?? ""
    ), i = Le(t, o, s), y = await fetch(t, i);
    if (!y.ok) throw new Error(`HTTP ${y.status}`);
    return y.status === 204 ? null : y.json();
  };
}
function ze(e) {
  const {
    instanceId: o,
    definition: s,
    options: d,
    controllers: n,
    ensure: t,
    update: i,
    mapValues: y,
    log: k,
    executeScript: S
  } = e;
  return async (v, b = {}, f = e.getSnapshot(), j, $) => {
    t();
    const h = s.sources.find((z) => z.id === v);
    if (!h) throw new Error(`未知数据源：${v}`);
    n.get(v)?.abort();
    const a = new AbortController();
    n.set(v, a);
    const T = () => a.abort();
    j?.addEventListener("abort", T, { once: !0 }), j?.aborted && a.abort();
    const M = (e.getSnapshot().sources[v]?.requestId ?? 0) + 1, O = e.getSnapshot().sources[v]?.data, P = Date.now(), w = we();
    if (h.trigger?.requireNonEmpty?.some((z) => {
      const L = ae(f, z.split("."));
      return L == null || L === "" || L === "all";
    }))
      return i({
        sources: {
          ...e.getSnapshot().sources,
          [v]: { status: "idle", data: [], requestId: M }
        }
      }), j?.removeEventListener("abort", T), n.delete(v), [];
    const m = x({ ...y(h.params, f), ...b });
    i({
      sources: {
        ...e.getSnapshot().sources,
        [v]: { status: "loading", data: O, requestId: M }
      }
    });
    let K = !1;
    const X = setTimeout(() => {
      K = !0, a.abort();
    }, h.request?.timeoutMs ?? 3e4), H = f.dialog.instanceId, q = () => e.isActive() && e.getSnapshot().dialog.instanceId === H && e.getSnapshot().sources[v]?.requestId === M && !a.signal.aborted;
    k("source", v, "loading", w, JSON.stringify(m));
    try {
      const z = {
        params: m,
        signal: a.signal,
        query: h.request?.query ? y(h.request.query, f) : void 0,
        body: h.request?.body ? y(h.request.body, f) : void 0,
        headers: y(h.request?.headers, f)
      }, L = () => Te(h, z, d.request), J = h.operation === "query" && d.query ? d.query(
        [
          o,
          e.getGeneration(),
          v,
          JSON.stringify({
            params: m,
            query: z.query,
            body: z.body,
            headers: z.headers,
            form: f.form,
            page: f.page,
            dialog: f.dialog,
            host: f.host,
            row: f.row,
            scope: f.scope
          })
        ],
        L
      ) : L(), F = await new Promise((B, I) => {
        const W = () => I(new Error(K ? "请求超时" : "请求已取消"));
        a.signal.addEventListener("abort", W, {
          once: !0
        }), J.then(B, I).finally(
          () => a.signal.removeEventListener("abort", W)
        );
      });
      if (!q()) throw new oe("请求已失效");
      if (h.result?.successPath && JSON.stringify(ae(F, h.result.successPath)) !== JSON.stringify(h.result.successValue ?? !0))
        throw new Error(
          String(
            ae(F, h.result.errorPath) ?? "接口返回失败"
          )
        );
      let u = ae(F, h.result?.path);
      if (h.result?.path && u === void 0)
        throw new Error(
          `响应路径不存在：${h.result.path.join(".")}`
        );
      if (Array.isArray(u) && h.filters?.length && (u = u.filter(
        (B) => h.filters.every((I) => {
          const W = le(I.value, f);
          return I.ignore?.includes(W) || W == null || JSON.stringify(ae(B, I.path)) === JSON.stringify(W);
        })
      )), h.result?.transformScriptId && (u = await S(
        h.result.transformScriptId,
        { data: u, params: m },
        f,
        void 0,
        a.signal
      )), !q()) throw new oe("请求已失效");
      i({
        sources: {
          ...e.getSnapshot().sources,
          [v]: { status: "success", data: x(u), requestId: M }
        }
      }), $?.("before");
      const D = e.getEpoch();
      return e.onSuccess(v), D !== e.getEpoch() && $?.("after"), k("source", v, "success", w, void 0, Date.now() - P), u;
    } catch (z) {
      const L = K ? "请求超时" : z instanceof Error ? z.message : String(z);
      throw e.isActive() && e.getSnapshot().sources[v]?.requestId === M && (!H || e.getSnapshot().dialog.instanceId === H) && i({
        sources: {
          ...e.getSnapshot().sources,
          [v]: {
            status: K ? "error" : a.signal.aborted || pe(z) ? "idle" : "error",
            data: O,
            error: !K && (pe(z) || !q()) ? void 0 : L,
            requestId: M
          }
        }
      }), k(
        "source",
        v,
        pe(z) ? "stale" : "error",
        w,
        L,
        Date.now() - P
      ), !K && !q() ? new oe("请求已失效") : a.signal.aborted && !K ? new oe("请求已取消") : K ? new Error("请求超时") : z;
    } finally {
      j?.removeEventListener("abort", T), clearTimeout(X), n.get(v) === a && n.delete(v);
    }
  };
}
function $e(e, o) {
  const s = (n) => o.some(
    (t) => t === n || t.startsWith(`${n}.`) || n.startsWith(`${t}.`)
  );
  if (e.kind === "host" && s(`host.${e.hostKey ?? e.id}`) || e.trigger?.dependsOn?.some(s) || e.trigger?.requireNonEmpty?.some(s))
    return !0;
  const d = (n) => Array.isArray(n) ? n.some(d) : Y(n) ? n.from === "form" ? s(
    (n.formId ? `forms.${String(n.formId)}.${n.path?.join(".") ?? ""}` : `form.${n.path?.join(".") ?? ""}`).replace(/\.$/, "")
  ) : ["page", "host", "dialog", "forms"].includes(String(n.from)) ? s(
    `${String(n.from)}.${n.path?.join(".") ?? ""}`.replace(
      /\.$/,
      ""
    )
  ) : Object.values(n).some(d) : !1;
  return d(e.params) || d(e.request) || d(e.filters);
}
function We(e, o) {
  const s = (n) => typeof o.validationMessage == "string" && o.validationMessage ? o.validationMessage : n;
  if (e == null || e === "" || Array.isArray(e) && e.length === 0)
    return ge(o.required) ? typeof o.requiredMessage == "string" && o.requiredMessage ? o.requiredMessage : "此项必填" : void 0;
  if (o.type === "number" && !Number.isFinite(
    typeof e == "number" ? e : typeof e == "string" && e.trim() ? Number(e) : NaN
  ))
    return s("请输入有效数字");
  if (o.type === "string" && typeof e != "string" || o.type === "object" && !Y(e) || o.type === "boolean" && typeof e != "boolean" || o.type === "array" && !Array.isArray(e))
    return s("字段类型错误");
  if (typeof e == "string" || Array.isArray(e)) {
    if (typeof o.minLength == "number" && e.length < o.minLength)
      return s(`长度不能少于 ${o.minLength}`);
    if (typeof o.maxLength == "number" && e.length > o.maxLength)
      return s(`长度不能超过 ${o.maxLength}`);
  }
  if (typeof o.min == "number" || typeof o.max == "number") {
    const n = typeof e == "number" ? e : typeof e == "string" && e.trim() ? Number(e) : NaN;
    if (!Number.isFinite(n)) return s("请输入有效数字");
    if (typeof o.min == "number" && n < o.min)
      return s(`数值不能小于 ${o.min}`);
    if (typeof o.max == "number" && n > o.max)
      return s(`数值不能大于 ${o.max}`);
  }
  if (typeof o.pattern == "string" && o.pattern)
    try {
      if (!new RegExp(o.pattern).test(String(e)))
        return s("格式不正确");
    } catch {
      return s("校验规则无效");
    }
  if ("options" in o) {
    const n = Array.isArray(e) ? e : [e];
    for (const t of n) {
      const i = Array.isArray(o.options) ? o.options.find(
        (y) => Y(y) && JSON.stringify(y.value) === JSON.stringify(t)
      ) : void 0;
      if (!Y(i) || ge(i.hidden))
        return s("所选选项已不可用，请重新选择");
      if (ge(i.disabled))
        return typeof i.disabledReason == "string" && i.disabledReason ? i.disabledReason : s("所选选项已禁用，请重新选择");
    }
  }
}
function ve(e, o) {
  if (!e.optionsSource) return e.options;
  const s = le(e.optionsSource, o), d = {
    label: "label",
    value: "value",
    description: "description",
    disabled: "disabled",
    hidden: "hidden",
    disabledReason: "disabledReason",
    group: "group",
    ...e.optionMapping
  };
  return Array.isArray(s) ? s.map(
    (n) => Object.fromEntries(
      Object.entries(d).map(([t, i]) => [
        t,
        ae(n, i.split("."))
      ])
    )
  ) : [];
}
function Be(e, o) {
  if (e.type !== "number" || o === null || o === "")
    return x(o);
  if (typeof o == "number" && Number.isFinite(o)) return o;
  if (typeof o == "string" && /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(o.trim()) && Number.isFinite(Number(o)))
    return Number(o);
  throw new Error(`${e.label ?? e.name ?? "字段"}请输入有效数字`);
}
function Ue(e) {
  const { definition: o, evaluate: s } = e;
  return (d, n = e.getSnapshot(), t = "form") => {
    const i = {}, y = {}, k = [];
    for (const S of d) {
      const N = o.fields?.[S];
      if (!N) continue;
      const v = {
        ...n,
        scope: {
          ...n.scope,
          formId: N.formId ?? n.scope?.formId ?? "main"
        }
      }, f = (e.getRegistrations(S) ?? [
        { nodeId: N.nodeId ?? S, props: {} }
      ]).filter(
        ({ nodeId: $, props: h }) => h.visible !== !1 && s($, "visible", n.row, v.scope)
      );
      if (!f.length && !N.submitWhenHidden) continue;
      const j = t === "dialog" ? ae(n.dialog.draft, [N.name ?? S]) ?? null : n.form[S] ?? null;
      try {
        const $ = Be(N, j);
        i[N.name ?? S] = $, f.length && k.push(S);
        const h = f.length ? f : [{ nodeId: N.nodeId ?? S, props: {} }];
        for (const { nodeId: a, props: T } of h) {
          const M = {
            ...N,
            ...T,
            required: f.length > 0 && (N.required || T.required || s(
              a,
              "required",
              n.row,
              v.scope
            ))
          }, O = o.bindings.find(
            (m) => m.nodeId === a && m.property === "options"
          ), P = N.optionsSource ?? O?.value;
          if (P?.from === "source" && n.sources[P.sourceId]?.status !== "success")
            throw new Error(`${N.label ?? S}选项尚未加载成功`);
          if (N.optionsSource)
            M.options = ve(N, v);
          else if (O) {
            const m = le(O.value, v);
            M.options = Array.isArray(m) && O.map ? m.map(
              (K) => Object.fromEntries(
                Object.entries(O.map).map(
                  ([X, H]) => [
                    X,
                    ae(
                      K,
                      H.split(".")
                    )
                  ]
                )
              )
            ) : m;
          }
          const w = We($, M);
          if (w) throw new Error(w);
        }
      } catch ($) {
        y[S] = $ instanceof Error ? $.message : String($);
      }
    }
    return { values: i, errors: y, visibleIds: k };
  };
}
function xe(e, o = {}) {
  const s = (e.dependencies ?? []).filter((d) => d.startsWith("service:")).map((d) => d.slice(8));
  if (s.length && e.type !== "event")
    throw new Error("只有事件脚本可以使用宿主服务");
  return Object.fromEntries(
    s.map((d) => {
      if (!/^[a-zA-Z][\w-]*$/.test(d) || ["constructor", "prototype", "__proto__"].includes(d))
        throw new Error(`服务名称无效：${d}`);
      const n = Object.hasOwn(o, d) ? o[d] : void 0;
      if (!n) throw new Error(`宿主未提供服务：${d}`);
      const t = e.serviceVersions?.[d] ?? "1";
      if (n.version !== t)
        throw new Error(
          `服务版本不兼容：${d}，需要 ${t}，当前 ${n.version}`
        );
      return [d, n];
    })
  );
}
const Ke = (e) => {
  if (!e || e.split(".").some(
    (o) => !o || ["__proto__", "constructor", "prototype"].includes(o)
  ))
    throw new Error("能力名称无效");
};
function me(e, o) {
  let s = 0;
  const d = /* @__PURE__ */ new Set(), n = (t, i) => {
    if (++s > 1e4 || i > 32) throw new Error("脚本数据结构超限");
    if (!(t === null || typeof t == "string" || typeof t == "boolean") && !(typeof t == "number" && Number.isFinite(t))) {
      if (typeof t != "object" || !t || d.has(t))
        throw new Error("脚本参数和结果必须是 JSON 数据");
      d.add(t);
      for (const [y, k] of Object.entries(t)) {
        if (!he(y)) throw new Error("脚本参数含无效属性");
        k !== void 0 && n(k, i + 1);
      }
      d.delete(t);
    }
  };
  if (n(e, 0), JSON.stringify(e).length > o)
    throw new Error("脚本参数或结果大小超限");
}
function Ae(e, o, s) {
  if (o?.length) {
    if (!Y(e)) throw new Error(`脚本${s}声明要求对象`);
    for (const d of o)
      if (!d.split(".").every(he) || ae(e, d.split(".")) === void 0)
        throw new Error(`脚本${s}缺少声明路径：${d}`);
  }
}
function He(e, o) {
  if (["form.getValues", "dialogs.close"].includes(e)) {
    if (o.length) throw new Error(`脚本能力参数无效：${e}`);
  } else if (e === "form.patch") {
    if (o.length !== 1 || !Y(o[0]))
      throw new Error("字段补丁必须是对象");
  } else if (["dataSources.call", "actions.run", "dialogs.open"].includes(e) && (o.length < 1 || o.length > 2 || typeof o[0] != "string" || !he(o[0]) || o.length === 2 && !Y(o[1])))
    throw new Error(`脚本能力参数无效：${e}`);
}
function Ge(e = {}) {
  const o = /* @__PURE__ */ new Map(), s = (n, t) => {
    if (Ke(n), !["form", "dataSource", "action", "dialog"].includes(t.kind) || typeof t.handler != "function")
      throw new Error("能力登记无效");
    o.set(n, t);
  };
  return Object.entries(e).forEach(
    ([n, t]) => s(n, t)
  ), {
    invoke: async (n, t) => {
      const i = o.get(n);
      if (!i) throw new Error(`脚本能力未授权：${n}`);
      if (!Array.isArray(t) || t.length > 16)
        throw new Error("脚本参数数量超限");
      me(t, 65536);
      const y = await i.handler(...x(t));
      return me(y, 65536), x(y);
    },
    has: (n) => o.has(n),
    list: () => [...o].map(([n, t]) => ({
      name: n,
      kind: t.kind,
      ...t.label ? { label: t.label } : {},
      ...t.input ? { input: t.input } : {},
      ...t.result ? { result: t.result } : {},
      ...t.completion ? { completion: t.completion } : {}
    })),
    register: s,
    remove: (n) => o.delete(n)
  };
}
function Ze(e) {
  const {
    definition: o,
    options: s,
    controllers: d,
    ensure: n,
    setField: t,
    openDialog: i,
    closeDialog: y,
    loadSource: k
  } = e;
  return async (N, v, b = e.getSnapshot(), f = () => {
  }, j, $) => {
    n();
    const h = o.scripts.find((I) => I.id === N);
    if (!h) throw new Error(`未知脚本：${N}`);
    if (!s.runScript) throw new Error("脚本执行器未接入");
    const a = new AbortController(), T = we(), M = `script-retained:${N}:${String(b.dialog.instanceId ?? "")}`;
    h.type === "event" && (d.get(M)?.abort(), d.set(M, a));
    let O = !1, P = !1, w, m = e.getEpoch(), K = e.getSnapshot().dialog.instanceId, X = 0, H = Date.now(), q = !1;
    const z = setTimeout(
      () => {
        q = !0, a.abort();
      },
      Math.min(h.timeoutMs ?? 3e3, 3e4)
    );
    d.set(T, a);
    const L = () => a.abort();
    j?.addEventListener("abort", L, { once: !0 }), j?.aborted && a.abort();
    const J = () => {
      if (n(), q) throw new Error("脚本执行超时");
      if (a.signal.aborted)
        throw a.signal.reason instanceof oe ? a.signal.reason : new oe("脚本已停止");
      if (!P && e.getEpoch() !== m || e.getSnapshot().dialog.instanceId !== K)
        throw new oe(
          "输入或弹框已变化，拒绝旧脚本结果"
        );
    }, F = () => {
      m = e.getEpoch(), K = e.getSnapshot().dialog.instanceId, f();
    }, u = (I) => {
      if (!h.dependencies?.includes(I))
        throw new Error(`脚本未声明依赖 ${I}`);
    }, D = /* @__PURE__ */ new Map(), B = Ge({
      "form.getValues": {
        kind: "form",
        handler: () => {
          const I = b.scope?.formId ?? "main";
          return u(`form:${I}`), x(e.getSnapshot().forms?.[I] ?? {});
        }
      },
      "form.patch": {
        kind: "form",
        handler: (I) => {
          if (u(`form:${b.scope?.formId ?? "main"}`), !Y(I)) throw new Error("字段补丁必须是对象");
          return Object.entries(I).map(
            ([l, A]) => {
              const se = Object.keys(
                o.fields ?? {}
              ).find((Q) => {
                const te = o.fields[Q];
                return (te.name ?? Q) === l && (te.formId ?? "main") === (b.scope?.formId ?? "main");
              });
              if (!se)
                throw new Error(`当前表单未声明字段：${l}`);
              return [se, A];
            }
          ).forEach(
            ([l, A]) => t(l, A)
          ), F(), null;
        }
      },
      "dataSources.call": {
        kind: "dataSource",
        handler: async (I, W) => (u(`source:${String(I)}`), await k(
          String(I),
          Y(W) ? W : {},
          {
            ...e.getSnapshot(),
            scope: b.scope,
            row: b.row
          },
          a.signal,
          (l) => {
            l === "before" ? J() : F();
          }
        ) ?? null)
      },
      "actions.run": {
        kind: "action",
        handler: async (I, W) => {
          if (u(`action:${String(I)}`), !s.action)
            throw new Error(`宿主动作未接入：${String(I)}`);
          return s.action(
            String(I),
            Y(W) ? W : {},
            a.signal
          );
        }
      },
      "dialogs.open": {
        kind: "dialog",
        handler: (I, W) => (u(`dialog:${String(I)}`), i(String(I), Y(W) ? W : {}), F(), null)
      },
      "dialogs.close": {
        kind: "dialog",
        handler: () => (u(
          `dialog:${String(e.getSnapshot().dialog.targetId)}`
        ), y(!0), F(), null)
      }
    });
    try {
      J(), me(v, 262144), Ae(v, h.input, "输入");
      const I = s.runScript(
        h,
        x(v),
        a.signal,
        async (l, A) => {
          if (J(), P && Date.now() - H >= 1e3 && (X = 0, H = Date.now()), ++X > 100) throw new Error("脚本能力调用次数超限");
          if (h.type !== "event")
            throw new Error("纯脚本不能调用宿主能力");
          He(l, A);
          const se = l === "actions.run" || l === "dataSources.call" && o.sources.some(
            (ee) => ee.id === A[0] && ee.operation === "mutation"
          ) || !B.has(l) && s.capabilities?.list().some(
            (ee) => ee.name === l && ee.kind === "action"
          );
          if (l === "actions.run" && u(`action:${String(A[0])}`), l === "dataSources.call" && u(`source:${String(A[0])}`), !B.has(l) && (u(`capability:${l}`), !s.capabilities?.has(l)))
            throw new Error(`脚本能力未授权：${l}`);
          const Q = JSON.stringify([l, A]), te = (D.get(Q) ?? 0) + 1;
          se && !P && D.set(Q, te);
          const _ = `${Q}:${te}`;
          if (!P && se && $?.writes.has(_))
            return x($.writes.get(_));
          const C = l === "actions.run" ? String(A[0]) : B.has(l) ? void 0 : l, G = C ? e.getActionVersion(C) : void 0, re = () => {
            if (C && e.getActionVersion(C) !== G) {
              const ee = new oe(
                "输入已变化，拒绝旧脚本结果"
              );
              throw a.abort(ee), ee;
            }
            C && F();
          };
          let ne;
          try {
            if (B.has(l))
              ne = await B.invoke(l, A);
            else {
              if (u(`capability:${l}`), !s.capabilities?.has(l))
                throw new Error(`脚本能力未授权：${l}`);
              ne = await s.capabilities.invoke(
                l,
                A
              );
            }
            re();
          } catch (ee) {
            throw re(), ee;
          }
          return J(), !P && se && $?.writes.set(_, x(ne)), ne;
        },
        {
          services: xe(h, s.services),
          onRetain: (l) => {
            O = !0, w = l;
          },
          onError: (l) => {
            a.signal.aborted || (s.onLog?.({
              instanceId: T,
              batchId: "",
              kind: "script",
              id: N,
              status: "error",
              time: Date.now(),
              detail: l.message
            }), a.abort());
          },
          invokeService: async (l, A, se, Q) => {
            J();
            const te = JSON.stringify([
              "service",
              l,
              A.path,
              se
            ]), _ = A.kind === "async" && A.effect === "write", C = (D.get(te) ?? 0) + 1;
            _ && !P && D.set(te, C);
            const G = `${te}:${C}`;
            if (!P && _ && $?.writes.has(G)) {
              const ee = $.writes.get(G);
              return ee.isUndefined ? void 0 : x(ee.value);
            }
            const re = `${s.services?.[l]?.actionPrefix ?? `${l}.`}${A.path}`, ne = e.getActionVersion(re);
            try {
              const ee = await Q();
              if (e.getActionVersion(re) !== ne)
                throw a.abort(
                  new oe(
                    "输入已变化，拒绝旧脚本结果"
                  )
                ), new oe(
                  "输入已变化，拒绝旧脚本结果"
                );
              return F(), J(), !P && _ && $ && (me(ee ?? null, 1048576), $.writes.set(G, {
                value: x(ee ?? null),
                isUndefined: ee === void 0
              })), ee;
            } catch (ee) {
              throw e.getActionVersion(re) !== ne ? (a.abort(
                new oe(
                  "输入已变化，拒绝旧脚本结果"
                )
              ), new oe(
                "输入已变化，拒绝旧脚本结果"
              )) : ee;
            } finally {
              !a.signal.aborted && e.getActionVersion(re) === ne && F();
            }
          }
        }
      ), W = await Se(I, a.signal, "脚本已停止");
      return J(), me(W, 262144), Ae(W, h.output, "输出"), P = !0, X = 0, H = Date.now(), x(W);
    } catch (I) {
      throw J(), I;
    } finally {
      clearTimeout(z), d.delete(T), O && P && !a.signal.aborted ? (d.set(M, a), a.signal.addEventListener(
        "abort",
        () => {
          w?.(), j?.removeEventListener("abort", L), d.get(M) === a && d.delete(M);
        },
        { once: !0 }
      )) : (w?.(), d.get(M) === a && d.delete(M), j?.removeEventListener("abort", L));
    }
  };
}
function Qe(e) {
  const {
    definition: o,
    options: s,
    controllers: d,
    ensure: n,
    update: t,
    log: i,
    mapValues: y,
    setField: k,
    setPage: S,
    setDialogField: N,
    openDialog: v,
    closeDialog: b,
    formFields: f,
    collectForm: j,
    validateForm: $,
    resetForm: h,
    rememberForm: a,
    executeScript: T,
    loadSource: M
  } = e, O = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = async (X, H, q, z, L, J) => {
    const F = L ? P.get(L) : void 0, u = x(
      F?.output ?? H.output ?? {}
    );
    let D = u.__result ?? null, B = e.getEpoch();
    const I = () => {
      if (n(), J?.aborted)
        throw new oe("事件已被新输入替换");
      if (e.getEpoch() !== B || e.getSnapshot().dialog.instanceId !== z)
        throw new oe("输入或弹框已变化，动作链失效");
    };
    for (let W = F?.next ?? 0; W < X.length; W++) {
      const l = X[W];
      if (l.disabled) continue;
      I();
      const A = {
        ...e.getSnapshot(),
        row: H.row,
        scope: H.scope,
        output: u,
        result: D
      };
      if (l.when && !de(l.when, A)) continue;
      const se = Date.now();
      i("step", l.id, "running", q);
      let Q = null, te = !1;
      try {
        let _;
        if ((l.type === "field.set" || l.type === "page.set" || l.type === "dialog.set") && (_ = le(
          l.value,
          A
        ), l.valueScriptId)) {
          const C = o.scripts.find(
            (G) => G.id === l.valueScriptId
          );
          if (C?.type !== "compute")
            throw new Error("自定义赋值逻辑必须引用计算脚本");
          _ = await T(
            C.id,
            _ ?? null,
            A,
            void 0,
            J
          ), I();
        }
        switch (l.type) {
          case "field.set":
            k(l.field, _);
            break;
          case "field.clear":
            k(l.field, null);
            break;
          case "form.reset":
            await h(
              l.formId ?? A.scope?.formId,
              l.fields,
              A,
              () => {
                B = e.getEpoch();
              }
            ), I();
            break;
          case "page.set":
            S(l.field, _);
            break;
          case "dialog.set":
            N(l.field, _);
            break;
          case "form.validate":
            await $(
              l.fields ?? f(
                l.formId ?? A.scope?.formId
              ),
              l.scope,
              A
            ), I(), Q = j(
              l.formId ?? A.scope?.formId ?? "main",
              A
            );
            break;
          case "dataSource.call":
            Q = await M(
              l.sourceId,
              y(l.params, A),
              A,
              J,
              (C) => {
                C === "before" ? I() : B = e.getEpoch();
              }
            ) ?? null, I(), te = o.sources.some(
              (C) => C.id === l.sourceId && C.operation === "mutation"
            );
            break;
          case "query.refresh":
            await M(
              l.sourceId,
              {},
              A,
              J,
              (C) => {
                C === "before" ? I() : B = e.getEpoch();
              }
            ), I();
            break;
          case "dialog.open": {
            const C = y(l.input, A);
            if (l.mode === "stack" && [
              ...A.dialogStack ?? [],
              A.dialog
            ].some(
              (G) => G.instanceId && G.targetId === l.targetId
            ))
              throw new Error("不能重复叠加同一个弹框");
            if (l.mode === "stack" && l.formId && [
              ...A.dialogStack ?? [],
              A.dialog
            ].some(
              (G) => G.instanceId && G.formId === l.formId
            ))
              throw new Error("嵌套弹框必须使用独立表单");
            if (l.formId) {
              const G = {
                ...l.defaults,
                ...Y(C.record) ? C.record : {},
                ...Y(C.draft) ? C.draft : C
              };
              a(
                l.formId,
                G
              ), C.formId = l.formId, C.draft = x(
                e.getSnapshot().forms?.[l.formId] ?? {}
              );
            }
            v(l.targetId, C, l.mode), z = e.getSnapshot().dialog.instanceId;
            break;
          }
          case "dialog.close":
            (l.targetId === "__current__" || e.getSnapshot().dialog.targetId === l.targetId) && (b(!0), z = e.getSnapshot().dialog.instanceId);
            break;
          case "script.run": {
            const C = L ? w.get(L)?.steps : void 0, G = C?.get(l.id) ?? {
              writes: /* @__PURE__ */ new Map()
            };
            C?.set(l.id, G), Q = await T(
              l.scriptId,
              l.inputValue ? le(l.inputValue, A) : l.input ? y(l.input, A) : A,
              A,
              () => {
                B = e.getEpoch(), z = e.getSnapshot().dialog.instanceId;
              },
              J,
              G
            ), I(), te = G.writes.size > 0;
            break;
          }
          case "host.action": {
            if (!s.action)
              throw new Error(`宿主动作未接入：${l.actionId}`);
            const C = new AbortController(), G = () => C.abort();
            J?.addEventListener("abort", G, {
              once: !0
            }), J?.aborted && C.abort();
            const re = x(
              l.inputValue ? le(l.inputValue, A) : y(l.input, A)
            );
            if (!Y(re))
              throw new Error("宿主动作参数必须是对象");
            const ne = l.formId ?? A.scope?.formId ?? "main";
            if (l.saveForm) {
              if (re.formId != null && re.formId !== ne)
                throw new Error(
                  `保存目标表单不一致：动作指定 ${ne}，参数指定 ${String(re.formId)}`
                );
              re.formId ??= ne;
            }
            (l.formId || l.saveForm) && (await $(
              f(ne),
              "form",
              A
            ), I(), Object.hasOwn(re, "values") || (re.values = j(ne, A)));
            const ee = l.saveForm ? j(ne, A) : void 0, be = e.getActionVersion(
              l.actionId
            );
            try {
              Q = await Se(
                s.action(
                  l.actionId,
                  re,
                  C.signal
                ),
                C.signal,
                "动作已取消"
              ), e.getActionVersion(l.actionId) === be && (B = e.getEpoch()), I(), te = !0, ee && a(
                ne,
                Y(Q) && Y(Q.values) ? Q.values : ee
              );
            } finally {
              e.getActionVersion(l.actionId) === be && (B = e.getEpoch()), J?.removeEventListener("abort", G);
            }
            break;
          }
          case "feedback":
            t({
              page: {
                ...e.getSnapshot().page,
                __feedback: String(
                  le(l.message, A) ?? ""
                )
              }
            });
            break;
        }
        n(), B = e.getEpoch(), D = Q, u.__result = Q, u[l.id] = Q, "assignTo" in l && l.assignTo && (u[l.assignTo] = Q), L && te && P.set(L, {
          next: W + 1,
          epoch: e.getEpoch(),
          output: x(u)
        }), i(
          "step",
          l.id,
          "success",
          q,
          void 0,
          Date.now() - se
        );
      } catch (_) {
        throw I(), i(
          "step",
          l.id,
          pe(_) ? "stale" : "error",
          q,
          String(_),
          Date.now() - se
        ), _;
      }
    }
    return u;
  };
  return {
    runEvent: async (X, H, q = {}, z = !1) => {
      if (s.mode === "design") return;
      n();
      const L = o.events.find(
        (_) => _.nodeId === X && _.event === H
      );
      if (!L) return;
      const J = Y(q.scope) ? q.scope.dialogId : L.scope?.dialogId;
      if (J && e.getSnapshot().dialog.targetId !== J && e.getSnapshot().dialogStack?.some(
        (_) => _.targetId === J
      ))
        throw new oe("父弹框暂不可交互，请先关闭当前弹框");
      const F = `${X}:${H}`, u = `${F}:${String(e.getSnapshot().dialog.instanceId ?? (Y(q.row) ? q.row.id : ""))}`, D = O.get(u), B = z || ["change", "onChange"].includes(H) || Object.values(o.fields ?? {}).some(
        (_) => _.onChange === L.id
      );
      if (D && !B) return;
      D?.controller.abort();
      const I = { key: F, controller: new AbortController() };
      O.set(u, I);
      const W = P.get(u);
      W && W.epoch !== e.getEpoch() && P.delete(u);
      const l = w.get(u);
      (!l || l.epoch !== e.getEpoch()) && w.set(u, {
        epoch: e.getEpoch(),
        steps: /* @__PURE__ */ new Map()
      });
      const A = { ...e.getSnapshot().page };
      delete A.__feedback, t({ busy: { ...e.getSnapshot().busy, [F]: !0 }, page: A });
      const se = x({
        ...e.getSnapshot(),
        scope: {
          ...L.scope,
          ...Y(q.scope) ? q.scope : {}
        },
        row: q.row ?? e.getSnapshot().row,
        output: q
      }), Q = we(), te = e.getSnapshot().dialog.instanceId;
      d.set(Q, I.controller);
      try {
        const _ = await m(
          L.steps,
          se,
          Q,
          te,
          u,
          I.controller.signal
        );
        P.delete(u), w.delete(u);
        const C = { ...e.getSnapshot().errors };
        return delete C[F], t({ errors: C }), _;
      } catch (_) {
        if (pe(_) || !e.isActive() || I.controller.signal.aborted)
          throw new oe(
            _ instanceof Error ? _.message : "事件已取消"
          );
        if (t({
          page: {
            ...e.getSnapshot().page,
            __feedback: _ instanceof Error ? _.message : String(_)
          },
          errors: {
            ...e.getSnapshot().errors,
            [F]: _ instanceof Error ? _.message : String(_)
          }
        }), L.onError)
          try {
            await m(
              L.onError,
              {
                ...se,
                output: {
                  ...se.output,
                  error: _ instanceof Error ? _.message : String(_)
                }
              },
              Q,
              e.getSnapshot().dialog.instanceId,
              void 0,
              I.controller.signal
            );
          } catch (re) {
            if (pe(re)) throw re;
            t({
              errors: {
                ...e.getSnapshot().errors,
                [`${F}:onError`]: String(re)
              }
            });
          }
        const C = P.get(u);
        C && (C.epoch = e.getEpoch());
        const G = w.get(u);
        throw G && (G.epoch = e.getEpoch()), _;
      } finally {
        d.delete(Q), O.get(u) === I && O.delete(u), t({
          busy: {
            ...e.getSnapshot().busy,
            [F]: [...O.values()].some(
              (_) => _.key === F
            )
          }
        });
      }
    },
    stop: () => O.clear(),
    dispose: () => {
      O.clear(), P.clear(), w.clear();
    }
  };
}
function Xe(e, o) {
  Je(e, void 0, { mode: o.mode });
  const s = we(), d = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), t = {}, i = Object.fromEntries(
    Object.entries(e.fields ?? {}).map(([r, c]) => [
      r,
      x(c.defaultValue ?? null)
    ])
  ), y = /* @__PURE__ */ new Map();
  let k = 0;
  const S = {};
  let N = !1, v = !0, b = !1, f = !1, j = /* @__PURE__ */ new Set(), $ = 0, h = 0, a = {
    form: Object.fromEntries(
      Object.entries(e.fields ?? {}).map(([r, c]) => [
        r,
        x(c.defaultValue ?? null)
      ])
    ),
    page: x(e.pageVariables ?? {}),
    row: null,
    dialog: {},
    dialogStack: [],
    host: x(o.host ?? {}),
    sources: Object.fromEntries(
      e.sources.map((r) => [
        r.id,
        {
          status: r.kind === "local" ? "success" : "idle",
          data: r.kind === "local" ? x(
            ae(r.data, r.result?.path)
          ) : void 0,
          requestId: 0
        }
      ])
    ),
    tables: {},
    logs: [],
    busy: {},
    errors: {}
  };
  const T = () => {
    const r = {};
    for (const [c, p] of Object.entries(e.fields ?? {})) {
      const g = p.formId ?? "main";
      (r[g] ??= {})[p.name ?? c] = a.form[c] ?? null;
    }
    a = { ...a, forms: r };
  };
  T();
  const M = () => {
    v && d.forEach((r) => r());
  }, O = (r) => {
    v && (a = { ...a, ...r }, r.form && T(), M());
  }, P = (r, c, p, g = "", R, U) => {
    const E = {
      instanceId: s,
      batchId: g,
      kind: r,
      id: c,
      status: p,
      time: Date.now(),
      detail: R,
      duration: U
    };
    O({ logs: [...a.logs.slice(-199), E] }), o.onLog?.(E);
  }, w = () => {
    if (!v) throw new oe("页面实例已失效");
    if (o.mode === "design")
      throw new oe("设计态不执行运行逻辑");
  }, m = (r, c, p, g) => {
    const R = e.rules.filter(
      (E) => E.targetId === r && E.property === c
    ), U = { ...a, row: p ?? a.row, scope: g };
    return R.length ? R.every(
      (E) => E.scriptId ? a.page[`__rule:${E.id}`] === !0 : E.condition ? de(E.condition, U) : E.combinator === "any" ? (E.conditions ?? [E]).some(
        (V) => de(V, U)
      ) : (E.conditions ?? [E]).every(
        (V) => de(V, U)
      )
    ) : c === "visible";
  }, K = (r, c) => r && typeof r == "object" && "from" in r ? le(r, c) : Array.isArray(r) ? r.map((p) => K(p, c)) : Y(r) ? Object.fromEntries(
    Object.entries(r).map(([p, g]) => [
      p,
      K(g, c)
    ])
  ) : r, X = (r = {}, c = a) => Object.fromEntries(
    Object.entries(r).map(([p, g]) => [
      p,
      x(K(g, c))
    ])
  ), H = (r) => {
    if (r.forEach((p) => j.add(p)), f || !b || o.mode === "design") return;
    f = !0;
    const c = $;
    queueMicrotask(() => {
      if (c !== $ || (f = !1, !v || o.mode === "design")) return;
      const p = [...j];
      j = /* @__PURE__ */ new Set(), Q();
      for (const g of e.sources)
        g.trigger?.mode === "dependency" && $e(g, p) && _(g.id).catch(() => {
        });
    });
  }, q = (r) => r.flatMap((c) => {
    const p = e.fields?.[c];
    return [
      `form.${c}`,
      `form.${p?.name ?? c}`,
      `forms.${p?.formId ?? "main"}.${p?.name ?? c}`
    ];
  }), z = (r) => {
    const c = { ...a.sources }, p = [];
    for (const g of e.sources)
      $e(g, r) && (n.get(g.id)?.abort(), te.delete(g.id), p.push(g.id), c[g.id] = {
        ...c[g.id],
        status: "idle",
        error: void 0,
        requestId: (c[g.id]?.requestId ?? 0) + 1
      });
    return p.length && O({ sources: c }), p;
  }, L = (r, c = !1) => {
    w();
    const p = { ...a.form }, g = [];
    for (const [E, V] of Object.entries(r)) {
      if (!he(E) || !(E in (e.fields ?? {})) && !y.get(E)?.size)
        throw new Error(`字段未声明：${E}`);
      JSON.stringify(p[E]) !== JSON.stringify(V) && (p[E] = x(V), g.push(E));
    }
    if (!g.length) return [];
    if (c) {
      for (let E = 0; E < g.length; E++)
        for (const V of e.fields?.[g[E]]?.clearOnChange ?? [])
          if (!g.includes(V)) {
            if (g.length >= 20)
              throw new Error("连锁更新超过 20 次");
            p[V] = null, g.push(V);
          }
    }
    g.forEach((E) => {
      t[E] = (t[E] ?? 0) + 1;
    }), h++;
    const R = (E) => {
      const V = { ...E }, Z = { ...Y(V.draft) ? V.draft : {} };
      for (const ce of g) {
        const fe = e.fields?.[ce];
        V.formId && fe?.formId === V.formId && (Z[fe.name ?? ce] = p[ce], V.dirty = !0);
      }
      return V.instanceId && (V.draft = Z), V;
    };
    O({
      form: p,
      dialog: R(a.dialog),
      dialogStack: a.dialogStack?.map(R) ?? [],
      errors: {}
    });
    const U = q(g);
    return z(U), H(U), g;
  }, J = (r, c) => {
    L({ [r]: c }, !0);
  }, F = (r, c) => {
    if (w(), !he(r)) throw new Error("变量名称无效");
    JSON.stringify(a.page[r]) !== JSON.stringify(c) && (t["page." + r] = (t["page." + r] ?? 0) + 1, h++, O({ page: { ...a.page, [r]: x(c) } }), z([`page.${r}`]), H([`page.${r}`]));
  }, u = (r, c) => {
    if (w(), !a.dialog.instanceId || !he(r))
      throw new Error("弹框已关闭或字段无效");
    const p = Object.keys(e.fields ?? {}).find(
      (g) => e.fields[g].formId === a.dialog.formId && (e.fields[g].name ?? g) === r
    );
    if (p) {
      J(p, c);
      return;
    }
    t[`dialog.${r}`] = (t[`dialog.${r}`] ?? 0) + 1, h++, O({
      dialog: {
        ...a.dialog,
        draft: {
          ...a.dialog.draft,
          [r]: x(c)
        },
        dirty: !0
      },
      errors: {}
    });
  }, D = (r, c, p = "replace") => {
    if (w(), p === "stack" && [...a.dialogStack ?? [], a.dialog].some(
      (g) => g.instanceId && g.targetId === r
    ))
      throw new Error("不能重复叠加同一个弹框");
    if (p === "stack" && c.formId && [...a.dialogStack ?? [], a.dialog].some(
      (g) => g.instanceId && g.formId === c.formId
    ))
      throw new Error("嵌套弹框必须使用独立表单");
    h++, O({
      dialogStack: p === "stack" && a.dialog.instanceId ? [...a.dialogStack ?? [], x(a.dialog)] : [],
      dialog: {
        ...x(c),
        targetId: r,
        instanceId: we(),
        record: x(c.record ?? null),
        draft: x(c.draft ?? c.record ?? {}),
        dirty: !1
      }
    });
  }, B = (r = !1) => {
    if (w(), a.dialog.dirty && !r) return !1;
    const c = a.dialog.instanceId;
    c && n.forEach((g, R) => {
      R.startsWith("script-retained:") && R.endsWith(`:${String(c)}`) && g.abort();
    }), h++;
    const p = [...a.dialogStack ?? []];
    return O({ dialog: p.pop() ?? {}, dialogStack: p }), !0;
  }, I = Ze({
    definition: e,
    options: o,
    controllers: n,
    ensure: w,
    getSnapshot: () => a,
    getEpoch: () => h,
    getActionVersion: (r) => JSON.stringify([
      h - k,
      Object.entries(S).filter(
        ([c]) => !o.actionOutputKeys?.[r]?.includes(c)
      )
    ]),
    setField: J,
    openDialog: D,
    closeDialog: B,
    loadSource: (...r) => _(...r)
  });
  let W = !1, l = !1, A = Promise.resolve(), se = [];
  const Q = async () => {
    if (W)
      return l = !0, A;
    W = !0;
    let r;
    A = new Promise((c) => {
      r = c;
    });
    try {
      do {
        l = !1, se = [];
        const c = h;
        for (const p of e.rules.filter((g) => g.scriptId)) {
          try {
            const g = await I(
              p.scriptId,
              a
            );
            v && h === c && O({
              page: {
                ...a.page,
                [`__rule:${p.id}`]: g === !0
              }
            });
          } catch (g) {
            P("rule", p.id, "error", "", String(g)), se.push(`规则 ${p.id}：${String(g)}`);
          }
          if (!v || h !== c) break;
        }
        v && h !== c && (l = !0);
      } while (v && l);
    } finally {
      W = !1, r();
    }
  }, te = /* @__PURE__ */ new Map(), _ = (r, c = {}, p = a, g, R) => {
    if (o.mode === "design")
      return Promise.resolve(a.sources[r]?.data);
    if (!v)
      return Promise.reject(new oe("页面实例已失效"));
    const U = e.sources.find((fe) => fe.id === r), E = JSON.stringify({
      params: c,
      form: p.form,
      page: p.page,
      dialog: p.dialog,
      host: p.host,
      row: p.row,
      scope: p.scope
    }), V = te.get(r);
    if (U?.operation === "query" && V?.key === E)
      return g ? Se(V.promise, g, "请求消费已取消") : V.promise;
    const Z = C(
      r,
      c,
      p,
      g,
      R
    );
    te.set(r, { key: E, promise: Z });
    const ce = () => {
      te.get(r)?.promise === Z && te.delete(r);
    };
    return Z.then(ce, ce), Z;
  }, C = ze({
    instanceId: s,
    definition: e,
    options: o,
    controllers: n,
    versions: t,
    ensure: w,
    update: O,
    mapValues: X,
    log: P,
    executeScript: I,
    getSnapshot: () => a,
    getEpoch: () => h,
    isActive: () => v,
    getGeneration: () => $,
    onSuccess: (r) => {
      const c = {};
      for (const [p, g] of Object.entries(e.fields ?? {})) {
        if (g.optionsSource?.from !== "source" || g.optionsSource.sourceId !== r)
          continue;
        const R = a.form[p];
        if (R == null || R === "") continue;
        const U = ve(g, {
          ...a,
          scope: { formId: g.formId }
        }) ?? [], E = (V) => U.some(
          (Z) => Y(Z) && JSON.stringify(Z.value) === JSON.stringify(V) && !ge(Z.hidden) && !ge(Z.disabled)
        );
        if (Array.isArray(R)) {
          const V = R.filter(E);
          V.length !== R.length && (c[p] = V);
        } else E(R) || (c[p] = null);
      }
      Object.keys(c).length && L(c);
    }
  }), G = (r) => Object.keys(e.fields ?? {}).filter(
    (c) => !r || (e.fields[c].formId ?? "main") === r
  ), re = Ue({
    definition: e,
    getSnapshot: () => a,
    evaluate: m,
    getRegistrations: (r) => {
      const c = y.get(r);
      return c ? [...c.values()].map(({ nodeId: p, readState: g }) => ({
        nodeId: p,
        props: g()
      })) : void 0;
    }
  }), ne = (r, c) => {
    const p = { ...a.errors };
    r.forEach((g) => {
      delete p[g];
    }), O({ errors: { ...p, ...c } });
  }, ee = (r = "main", c = a) => {
    const p = G(r), { values: g, errors: R } = re(p, c);
    return ne(p, R), { values: g, errors: R };
  }, be = (r = "main", c = a) => {
    const { values: p, errors: g } = ee(r, c);
    if (Object.keys(g).length)
      throw new Error(Object.values(g).join("；"));
    return p;
  }, Ie = async (r, c = "form", p = a) => {
    w();
    const g = h, R = r ?? G(p.scope?.formId), U = re(R, p, c), E = { ...U.errors };
    for (const V of U.visibleIds) {
      const Z = e.fields[V];
      if (!E[V] && Z.validateScriptId) {
        const ce = await I(
          Z.validateScriptId,
          {
            value: U.values[Z.name ?? V],
            values: U.values
          },
          p
        );
        ce !== !0 && (E[V] = typeof ce == "string" ? ce : "校验失败");
      }
    }
    if (w(), h !== g)
      throw new oe("输入已变化，请重新校验");
    if (ne(R, E), Object.keys(E).length)
      throw new Error(
        Object.entries(E).map(
          ([V, Z]) => `${e.fields?.[V]?.label ?? V}：${Z}`
        ).join("；")
      );
    return U.values;
  }, Ee = async (r, c, p = a, g = () => {
  }) => {
    w();
    const R = G(r).filter(
      (Z) => !c || c.includes(Z)
    );
    h++;
    const U = z(q(R));
    L(
      Object.fromEntries(
        R.map((Z) => [Z, x(i[Z] ?? null)])
      )
    ), g();
    let E = h;
    const V = (Z) => {
      if (Z === "before") {
        if (w(), h !== E)
          throw new oe("输入已变化，重置失效");
      } else
        E = h, g();
    };
    await Promise.all(
      U.map(
        (Z) => _(
          Z,
          {},
          {
            ...a,
            row: p.row,
            scope: { ...p.scope, formId: r }
          },
          void 0,
          V
        )
      )
    ), w();
  }, ke = (r, c) => {
    w();
    const p = Object.fromEntries(
      G(r).map((g) => {
        const R = e.fields[g].name ?? g;
        return i[g] = x(
          Object.hasOwn(c, R) ? c[R] : a.form[g] ?? null
        ), [g, i[g]];
      })
    );
    L(p);
  }, ye = Qe({
    definition: e,
    options: o,
    controllers: n,
    ensure: w,
    update: O,
    log: P,
    mapValues: X,
    setField: J,
    setPage: F,
    setDialogField: u,
    openDialog: D,
    closeDialog: B,
    formFields: G,
    collectForm: be,
    validateForm: Ie,
    resetForm: Ee,
    rememberForm: ke,
    executeScript: I,
    loadSource: _,
    getSnapshot: () => a,
    getEpoch: () => h,
    getActionVersion: (r) => JSON.stringify([
      h - k,
      Object.entries(S).filter(
        ([c]) => !o.actionOutputKeys?.[r]?.includes(c)
      )
    ]),
    isActive: () => v
  }), { runEvent: Oe } = ye;
  return {
    instanceId: s,
    getSnapshot: () => a,
    subscribe: (r) => (d.add(r), () => {
      d.delete(r);
    }),
    setField: J,
    openDialog: D,
    resetForm: Ee,
    rememberForm: ke,
    collectForm: be,
    checkForm: ee,
    executeScript: I,
    refreshSource: _,
    cancelSource: (r) => n.get(r)?.abort(),
    executeEvent: (r, c = {}, p = !1) => {
      const g = e.events.find((R) => R.id === r);
      return g ? Oe(g.nodeId, g.event, c, p) : Promise.reject(new Error(`未知事件：${r}`));
    },
    evaluateRule: (r, c = a) => r.scriptId ? c.page[`__rule:${r.id}`] === !0 : r.condition ? de(r.condition, c) : r.combinator === "any" ? (r.conditions ?? [r]).some(
      (p) => de(p, c)
    ) : (r.conditions ?? [r]).every(
      (p) => de(p, c)
    ),
    setCapabilities: (r) => {
      o.capabilities = r;
    },
    setServices: (r) => {
      [.../* @__PURE__ */ new Set([
        ...Object.keys(o.services ?? {}),
        ...Object.keys(r ?? {})
      ])].some(
        (p) => o.services?.[p]?.value !== r?.[p]?.value || o.services?.[p]?.version !== r?.[p]?.version
      ) && n.forEach((p, g) => {
        e.sources.some((R) => R.id === g) || p.abort();
      }), o.services = r;
    },
    setPage: F,
    setDialogField: u,
    closeDialog: B,
    setRow: (r) => {
      w(), h++, O({ row: x(r) });
    },
    setTable: (r, c, p = !0) => {
      if (!v) throw new oe("页面实例已失效");
      JSON.stringify(a.tables[r]) !== JSON.stringify(c) && (p && h++, O({ tables: { ...a.tables, [r]: x(c) } }));
    },
    setHost: (r) => {
      if (!v) throw new oe("页面实例已失效");
      if (JSON.stringify(a.host) !== JSON.stringify(r)) {
        h++, k++;
        for (const c of /* @__PURE__ */ new Set([
          ...Object.keys(a.host),
          ...Object.keys(r)
        ]))
          JSON.stringify(a.host[c]) !== JSON.stringify(r[c]) && (S[c] = (S[c] ?? 0) + 1);
        O({ host: x(r) }), z(["host"]), H(["host", ...Object.keys(r).map((c) => `host.${c}`)]);
      }
    },
    setSourceData: (r, c) => {
      !v || !a.sources[r] || O({
        sources: {
          ...a.sources,
          [r]: {
            status: "success",
            data: x(c),
            requestId: a.sources[r].requestId
          }
        }
      });
    },
    setDialog: (r) => {
      w(), h++, O({ dialog: x(r), dialogStack: [] });
    },
    loadSource: _,
    runEvent: Oe,
    validateForm: Ie,
    settleRules: async () => {
      if (w(), await Q(), w(), se.length) throw new Error(se.join("；"));
    },
    registerField: (r, c, p) => {
      const g = y.get(r) ?? /* @__PURE__ */ new Map(), R = Symbol(c);
      return g.set(R, { nodeId: c, readState: p }), y.set(r, g), () => {
        g.delete(R);
      };
    },
    isRuleActive: (r, c) => m(r, c),
    resolveProps: (r, c, p) => {
      const g = { ...c }, R = { ...a, row: p ?? a.row };
      for (const U of e.bindings.filter(
        (E) => E.nodeId === r
      )) {
        let E = le(U.value, R);
        if (E === void 0 && !(U.value.from === "source" && a.sources[U.value.sourceId]?.status !== "success"))
          throw new Error(`绑定路径不存在：${r}.${U.property}`);
        U.map && Array.isArray(E) && (E = E.map(
          (V) => Object.fromEntries(
            Object.entries(U.map).map(([Z, ce]) => {
              const fe = ae(V, ce.split("."));
              return [
                Z,
                Z === "disabled" || Z === "hidden" ? ge(fe) : fe
              ];
            })
          )
        )), g[U.property] = E;
      }
      for (const U of ["visible", "disabled", "required"])
        e.rules.some(
          (E) => E.targetId === r && E.property === U
        ) && (g[U] = m(r, U, p));
      return g.busy = a.busy[`${r}:onClick`] ?? !1, g;
    },
    start: () => {
      if (!(N || b) && (v = !0, o.mode !== "design")) {
        b = !0, Q();
        for (const r of e.sources)
          r.trigger?.mode && r.trigger.mode !== "manual" && _(r.id).catch(() => {
          });
        j.clear();
      }
    },
    stop: () => {
      $++, v = !1, b = !1, f = !1, h++, n.forEach((r) => r.abort()), n.clear(), te.clear(), ye.stop(), a = {
        ...a,
        busy: {},
        sources: Object.fromEntries(
          Object.entries(a.sources).map(([r, c]) => [
            r,
            {
              ...c,
              status: c.status === "loading" ? "idle" : c.status,
              requestId: c.requestId + 1
            }
          ])
        )
      };
    },
    dispose: () => {
      N = !0, $++, v = !1, b = !1, h++, n.forEach((r) => r.abort()), n.clear(), te.clear(), ye.stop(), ye.dispose(), d.clear();
    },
    stopScripts: () => {
      n.forEach((r, c) => {
        e.sources.some((p) => p.id === c) || r.abort();
      });
    }
  };
}
const Ye = `
const serviceCallbacks = new Map(), serviceResources = new Map(), serviceSnapshots = new Map(), disposers = new Set();
let serviceSend, serviceRequest, scriptFinished = false, disposing = false, callbackSerial = 0, activeCallbacks = 0;
const remoteError = value => {
  const error = new Error(value && typeof value === 'object' ? value.message : String(value));
  if (value && typeof value === 'object') for (const [key,item] of Object.entries(value)) {
    if (!['__proto__','constructor','prototype'].includes(key)) Object.defineProperty(error,key,{value:item,configurable:true,enumerable:true});
  }
  return error;
};
const wireError = error => {
  const result = {name:error?.name || 'Error',message:String(error?.message || error)};
  if (error && typeof error === 'object') for (const key of Object.keys(error)) {
    if (!['__proto__','constructor','prototype'].includes(key)) try {result[key]=JSON.parse(JSON.stringify(error[key]));}catch{}
  }
  return result;
};
const stable = (old,value) => JSON.stringify(old) === JSON.stringify(value) ? old : value;
const retained = () => serviceCallbacks.size > 0 || disposers.size > 0 || activeCallbacks > 0;
const releaseIfIdle = () => {if(scriptFinished && !disposing && !retained()) serviceSend({type:'service-idle'});};
const invokeCallback = (fn,args) => {
  const callbackId = ++callbackSerial;
  activeCallbacks++;
  serviceSend({type:'callback-start',callbackId});
  Promise.resolve().then(()=>fn(...args)).catch(error=>serviceSend({type:'error',error:wireError(error)})).finally(()=>{activeCallbacks--;serviceSend({type:'callback-end',callbackId});releaseIfIdle();});
};
function serviceMessage(data) {
  if(data.type==='service-fault'){serviceSend({type:'error',error:data.error});return true;}
  if (data.type === 'service-snapshot') {
    const previous = serviceSnapshots.get(data.service) || {};
    for (const [path,value] of Object.entries(data.snapshots)) previous[path] = stable(previous[path],value);
    serviceSnapshots.set(data.service,previous); return true;
  }
  if (data.type === 'service-event') {
    const callback = serviceCallbacks.get(data.handle); if(callback)invokeCallback(callback,data.args); return true;
  }
  if (data.type === 'service-resource') {
    const resource = serviceResources.get(data.handle);
    if(resource) {
      resource.state=stable(resource.state,data.state);resource.snapshot=stable(resource.snapshot,data.snapshot);
      for(const listener of resource.listeners.values()) invokeCallback(listener,[]);
    }
    return true;
  }
  if (data.type === 'dispose') {
    disposing=true;
    const callbacks=[...disposers]; disposers.clear(); serviceCallbacks.clear(); serviceResources.clear();
    Promise.allSettled(callbacks.map(fn=>Promise.resolve().then(fn))).then(()=>serviceSend({type:'disposed'}));
    return true;
  }
  return false;
}
function buildServices(data,send,request) {
  serviceSend=send;serviceRequest=request;
  const services=Object.create(null);
  const fire = payload => request({type:'service-call',...payload}).catch(error=>send({type:'error',error:wireError(error)}));
  for(const [name,definition] of Object.entries(data.services || {})) {
    const value=Object.create(null);services[name]=value;serviceSnapshots.set(name,definition.snapshots);
    for(const method of definition.methods) {
      const parts=method.path.split('.');let owner=value;
      if(parts.some(part=>!part || ['__proto__','constructor','prototype'].includes(part)))throw new Error('服务路径无效');
      for(const part of parts.slice(0,-1))owner=owner[part] || (owner[part]=Object.create(null));
      owner[parts.at(-1)]=(...values)=>{
        if(method.kind==='snapshot')return serviceSnapshots.get(name)?.[method.path];
        if(disposing)throw new Error('脚本已释放');
        const handle=++serial, args=[...values], base={service:name,path:method.path,operation:method.kind,handle};
        if(method.kind==='subscribe') {
          const index=method.callbackIndex ?? args.length-1, callback=args.splice(index,1)[0];
          if(typeof callback!=='function')throw new Error('订阅需要回调');
          serviceCallbacks.set(handle,callback);fire({...base,args});
          return ()=>{if(serviceCallbacks.delete(handle)){fire({operation:'unsubscribe',handle,args:[]});releaseIfIdle();}};
        }
        if(method.kind==='resource') {
          const resource={state:method.resourceInitial?.state ?? {data:null,loading:true,stale:false,error:null,revision:null,refreshing:false},snapshot:method.resourceInitial?.snapshot ?? null,listeners:new Map()};
          serviceResources.set(handle,resource);const ready=fire({...base,args});
          let connected=false;
          const sync=()=>ready.then(()=>{
            if(disposing)return;
            const wanted=resource.listeners.size>0;
            if(wanted===connected)return;
            connected=wanted;
            return fire({operation:wanted?'resource-subscribe':'resource-unsubscribe',handle,args:[]});
          });
          return Object.freeze({
            getState:()=>resource.state,getSnapshot:()=>resource.snapshot,
            subscribe:listener=>{
              if(typeof listener!=='function')throw new Error('订阅需要回调');
              if(disposing)throw new Error('脚本已释放');
              const key=++serial;serviceCallbacks.set(key,listener);resource.listeners.set(key,listener);void sync();
              return ()=>{serviceCallbacks.delete(key);resource.listeners.delete(key);void sync();releaseIfIdle();};
            },
            refresh:async(...refreshArgs)=>{await ready;return request({type:'service-call',operation:'resource-refresh',handle,args:refreshArgs});}
          });
        }
        return request({type:'service-call',...base,args});
      };
    }
  }
  return services;
}
`, et = `
const pending = new Map(); let serial = 0;
${Ye}
self.onmessage = async ({data}) => {
  if(data.type==='ping'){self.postMessage({type:'pong',executionId:data.executionId});return;}
  if(serviceMessage(data))return;
  if (data.type === 'reply') { const task = pending.get(data.callId); if (task) { pending.delete(data.callId); data.error ? task.reject(remoteError(data.error)) : task.resolve(data.isUndefined ? undefined : data.value); } return; }
  if (data.type !== 'run') return;
  const send = (message) => self.postMessage({...message, executionId:data.executionId});
  const request = payload => {
    if(pending.size>=100)return Promise.reject(new Error('脚本并发调用过多'));
    const callId=++serial;
    return new Promise((resolve,reject)=>{pending.set(callId,{resolve,reject});send({...payload,callId});});
  };
  const api = Object.freeze({call:(action, args) => {
    if (data.kind !== 'event') return Promise.reject(new Error('此脚本不能调用宿主动作'));
    return request({type:'call',action,args});
  }});
  try {
    const services=buildServices({...data,services:data.kind==='event'?data.services:{}},send,request);
    const onDispose=callback=>{if(data.kind!=='event'||typeof callback!=='function')throw new Error('仅事件脚本可登记释放回调');disposers.add(callback);send({type:'disposer-state',active:true});return ()=>{disposers.delete(callback);send({type:'disposer-state',active:disposers.size>0});releaseIfIdle();};};
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const value = await new AsyncFunction('input','api','services','sdk','target','onDispose','"use strict";\\n'+data.source)(data.input,api,services,services.workflowSdk,data.kind==='event'?data.services?.workflowSdk?.target:undefined,onDispose);
    const encoded = JSON.stringify(value === undefined ? null : value);
    if (encoded.length > 1048576) throw new Error('脚本输出超过 1MB');
    scriptFinished=true;send({type:'result',value:JSON.parse(encoded),retained:retained()});
  } catch (error) {send({type:'error',error:wireError(error)});}
};`;
function tt(e) {
  const o = `
addEventListener('message', function connect(event) {
  if (event.source !== parent || !event.ports[0]) return;
  removeEventListener('message',connect);
  const port = event.ports[0]; let worker;
  port.onmessage = ({data}) => {
    if (data.type === 'terminate') {if(worker)worker.terminate();return;}
    if (data.type === 'run') {
      const blob = new Blob([${JSON.stringify(et)}],{type:'text/javascript'});
      const url = URL.createObjectURL(blob);
      worker = new Worker(url); URL.revokeObjectURL(url);
      worker.onmessage = ({data}) => port.postMessage(data);
      worker.onerror = (error) => port.postMessage({type:'error',executionId:data.executionId,error:error.message});
    }
    if(worker)worker.postMessage(data);
  }; port.start(); port.postMessage({type:'ready'});
});`;
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${e}' 'unsafe-eval'; worker-src blob:; connect-src 'none'; img-src 'none'; style-src 'none'"><script nonce="${e}">${o}<\/script>`;
}
function ie(e, o = 1048576) {
  const s = /* @__PURE__ */ new WeakMap(), d = JSON.stringify(
    e === void 0 ? null : e,
    (n, t) => {
      if (!(t instanceof Error) && Object.prototype.toString.call(t) !== "[object Error]")
        return t;
      const i = t, y = s.get(i);
      if (y) return y;
      const k = {
        ...i,
        name: i.name,
        message: i.message
      };
      return s.set(i, k), k;
    }
  );
  if (!d || d.length > o)
    throw new Error("脚本消息过大或不可序列化");
  return JSON.parse(d);
}
function Me(e) {
  if (!e || typeof e != "object") return { message: String(e) };
  const o = {};
  for (const s of /* @__PURE__ */ new Set([
    "name",
    "message",
    "stack",
    ...Object.keys(e)
  ]))
    if (!["__proto__", "constructor", "prototype"].includes(s))
      try {
        o[s] = ie(e[s], 65536);
      } catch {
      }
  return { ...o, message: String(o.message || e) };
}
function qe(e) {
  if (!e || typeof e != "object") return new Error(String(e));
  const o = e, s = new Error(String(o.message || "脚本执行失败"));
  for (const [d, n] of Object.entries(o))
    ["__proto__", "constructor", "prototype"].includes(d) || Object.defineProperty(s, d, {
      value: n,
      configurable: !0,
      enumerable: !0
    });
  return s;
}
function ue(e, o) {
  let s = e;
  const d = o.split(".");
  for (const t of d.slice(0, -1)) {
    if (!_e(t) || !Object.hasOwn(s, t) || !s[t] || typeof s[t] != "object")
      throw new Error("服务成员未登记");
    s = s[t];
  }
  const n = d.at(-1);
  if (!_e(n) || !Object.hasOwn(s, n) || typeof s[n] != "function")
    throw new Error("服务成员未登记");
  return (...t) => s[n].apply(s, t);
}
function _e(e) {
  return !!e && !["__proto__", "prototype", "constructor"].includes(e);
}
function rt(e, o, s, d) {
  const n = xe(e, o), t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set(), b = [];
  let f = !1, j = 0;
  const $ = (w) => {
    f || s(ie(w));
  }, h = (w) => {
    if (!f)
      try {
        w();
      } catch (m) {
        $({ type: "service-fault", error: Me(m) });
      }
  }, a = (w) => Object.fromEntries(
    n[w].methods.filter((m) => m.kind === "snapshot").map((m) => [
      m.path,
      ie(ue(n[w].value, m.path)())
    ])
  ), T = Object.fromEntries(
    Object.entries(n).map(([w, m]) => [
      w,
      {
        version: m.version,
        methods: m.methods,
        snapshots: a(w),
        target: ie(m.target ?? {})
      }
    ])
  ), M = (w) => $({
    type: "service-snapshot",
    service: w,
    snapshots: a(w)
  }), O = (w, m) => {
    if (typeof m != "function")
      throw new Error("服务订阅未返回取消函数");
    f || v.delete(w) ? m() : t.set(w, m);
  }, P = (w, m) => h(
    () => $({
      type: "service-resource",
      handle: w,
      state: ue(m, "getState")(),
      snapshot: ue(m, "getSnapshot")()
    })
  );
  return {
    initial: T,
    start() {
      for (const [w, m] of Object.entries(n))
        m.subscribe && b.push(
          m.subscribe(() => h(() => M(w)))
        );
    },
    async handle(w) {
      if (f || e.type !== "event")
        throw new Error("此脚本不能调用服务");
      const m = Number(w.handle);
      if (w.operation === "unsubscribe")
        return N.has(m) && v.add(m), t.get(m)?.(), t.delete(m), null;
      if (!Array.isArray(w.args)) throw new Error("服务参数无效");
      const K = ie(w.args, 65536);
      if (w.operation === "resource-subscribe" || w.operation === "resource-unsubscribe") {
        const F = i.get(m);
        if (!F) throw new Error("资源不存在");
        if (w.operation === "resource-unsubscribe")
          return k.delete(m), t.get(m)?.(), t.delete(m), null;
        if (k.add(m), t.has(m)) return null;
        const u = S.get(m);
        if (u)
          return await u, null;
        const D = y.get(m), B = () => f || !k.has(m) ? () => {
        } : ue(
          F,
          "subscribe"
        )(() => P(m, F)), I = Promise.resolve().then(
          () => d ? d(
            D.name,
            D.method,
            [],
            B
          ) : B()
        ).then((W) => {
          !k.has(m) && typeof W == "function" ? W() : O(m, W), P(m, F);
        }).finally(() => S.delete(m));
        return S.set(m, I), await I, null;
      }
      if (w.operation === "resource-refresh") {
        const F = i.get(m);
        if (!F) throw new Error("资源不存在");
        const u = y.get(m), D = () => ue(F, "refresh")(...K), B = await (d ? d(u.name, u.method, K, D) : D());
        return P(m, F), B === void 0 ? void 0 : ie(B);
      }
      if (!Number.isSafeInteger(m) || m <= 0)
        throw new Error("服务句柄无效");
      const X = String(w.service), H = Object.hasOwn(n, X) ? n[X] : void 0, q = H?.methods.find(
        (F) => F.path === w.path
      );
      if (!H || !q || q.kind === "snapshot")
        throw new Error("服务成员未登记");
      if (w.operation !== q.kind)
        throw new Error("服务操作类型无效");
      if (m <= j || t.has(m) || i.has(m))
        throw new Error("服务句柄重复");
      if (j = m, t.size + i.size >= 100)
        throw new Error("服务资源数量超限");
      const z = ue(H.value, q.path), L = () => d ? d(X, q, K, () => z(...K)) : z(...K);
      if (q.kind === "subscribe") {
        const F = (...u) => h(() => {
          M(X), $({
            type: "service-event",
            handle: m,
            args: u
          });
        });
        K.splice(q.callbackIndex ?? K.length, 0, F), N.add(m);
        try {
          O(m, await L());
        } finally {
          N.delete(m), v.delete(m);
        }
        return null;
      }
      const J = await L();
      if (f) return null;
      if (q.kind === "resource") {
        if (!J || typeof J != "object")
          throw new Error("服务未返回资源对象");
        return i.set(m, J), y.set(m, { name: X, method: q }), P(m, J), null;
      }
      return M(X), J === void 0 ? void 0 : ie(J);
    },
    dispose() {
      if (!f) {
        f = !0;
        for (const w of [...t.values(), ...b])
          try {
            w();
          } catch {
          }
        t.clear(), i.clear(), y.clear(), k.clear(), b.length = 0;
      }
    }
  };
}
function ot(e, o, s = {}) {
  return new Promise((d, n) => {
    if (s.signal?.aborted) {
      n(new DOMException("脚本已取消", "AbortError"));
      return;
    }
    try {
      ie(o);
    } catch {
      n(new Error("脚本输入不合法或过大"));
      return;
    }
    const t = document.createElement("iframe"), i = new MessageChannel(), y = je();
    let k = !1, S = !1, N = !1, v = !1, b = !1, f = 0, j = 0, $ = Date.now(), h = 0;
    const a = Math.min(Math.max(e.timeoutMs || 3e3, 100), 3e4), T = /* @__PURE__ */ new Map();
    let M, O, P, w, m = 0, K = Date.now();
    const X = () => {
      v || (v = !0, clearTimeout(O), i.port1.postMessage({ type: "terminate" }), i.port1.close(), i.port2.close(), t.remove());
    }, H = (u = !1) => {
      if (!N) {
        N = !0, clearTimeout(L), clearTimeout(P), clearTimeout(w);
        for (const D of T.values()) clearTimeout(D);
        T.clear(), s.signal?.removeEventListener("abort", z), M?.dispose(), u && k ? (i.port1.postMessage({ type: "dispose" }), O = setTimeout(X, 100)) : X();
      }
    }, q = (u) => {
      if (N) return;
      const D = u instanceof Error ? u : qe(u);
      H(b || S), S ? s.onError?.(D) : n(D);
    }, z = () => {
      S ? H(!0) : q(new DOMException("脚本已取消", "AbortError"));
    }, L = setTimeout(
      () => q(new Error(`脚本超时：${e.id}`)),
      a
    ), J = (u) => {
      if (!N) {
        if (Date.now() - K >= 1e3 && (m = 0, K = Date.now()), ++m > 200) {
          q(new Error("宿主脚本消息数量超限"));
          return;
        }
        try {
          i.port1.postMessage(ie(u));
        } catch (D) {
          q(D);
        }
      }
    }, F = () => {
      P = setTimeout(() => {
        J({ type: "ping", executionId: y }), w = setTimeout(
          () => q(new Error("脚本订阅执行器无响应")),
          a
        );
      }, a);
    };
    try {
      M = rt(
        e,
        s.services ?? {},
        J,
        s.invokeService
      );
    } catch (u) {
      q(u);
      return;
    }
    s.signal?.addEventListener("abort", z, { once: !0 }), t.hidden = !0, t.setAttribute("sandbox", "allow-scripts"), t.srcdoc = tt(je().replaceAll("-", "")), t.onload = () => {
      N || t.contentWindow?.postMessage({ type: "connect" }, "*", [
        i.port2
      ]);
    }, i.port1.onmessage = async ({ data: u }) => {
      if (N) {
        u?.type === "disposed" && u.executionId === y && X();
        return;
      }
      if (!u || typeof u != "object") {
        q(new Error("脚本消息格式无效"));
        return;
      }
      try {
        ie(u);
      } catch (D) {
        q(D);
        return;
      }
      if (S && Date.now() - $ >= 1e3 && ($ = Date.now(), j = 0), ++j > 200) {
        q(new Error("脚本消息数量超限"));
        return;
      }
      if (u.type === "ready") {
        if (k) return;
        k = !0, J({
          type: "run",
          executionId: y,
          source: e.source,
          kind: e.type,
          input: o,
          services: M.initial
        });
        try {
          M.start();
        } catch (D) {
          q(D);
        }
        return;
      }
      if (!(!k || u.executionId !== y)) {
        if (u.type === "pong") {
          S && w && (clearTimeout(w), w = void 0, F());
          return;
        }
        if (u.type === "disposer-state") {
          b = e.type === "event" && u.active === !0;
          return;
        }
        if (u.type === "error") {
          q(qe(u.error));
          return;
        }
        if (u.type === "callback-start") {
          if (!Number.isSafeInteger(u.callbackId) || T.has(u.callbackId) || T.size >= 100) {
            q(new Error("脚本回调 ID 无效"));
            return;
          }
          T.set(
            u.callbackId,
            setTimeout(
              () => q(new Error("脚本订阅回调超时")),
              a
            )
          );
          return;
        }
        if (u.type === "callback-end") {
          clearTimeout(T.get(u.callbackId)), T.delete(u.callbackId);
          return;
        }
        if (u.type === "service-idle") {
          S && H();
          return;
        }
        if (u.type === "result") {
          if (S) {
            q(new Error("脚本重复返回结果"));
            return;
          }
          try {
            const D = ie(u.value);
            if (e.type === "event" && u.retained === !0) {
              if (clearTimeout(L), s.onRetain?.(() => H(!0)), N) {
                n(new DOMException("脚本已取消", "AbortError"));
                return;
              }
              S = !0, F(), d(D);
            } else
              S = !0, H(), d(D);
          } catch (D) {
            q(D);
          }
          return;
        }
        if (!(u.type !== "call" && u.type !== "service-call")) {
          if (!Number.isSafeInteger(u.callId) || u.callId <= f) {
            q(new Error("脚本调用 ID 无效或重复"));
            return;
          }
          if (f = u.callId, ++h > 100) {
            q(new Error("脚本并发调用过多"));
            return;
          }
          try {
            if (e.type !== "event")
              throw new Error("此脚本不能调用宿主动作或服务");
            let D;
            if (u.type === "service-call")
              D = await M.handle(u);
            else {
              if (!s.call || typeof u.action != "string" || !Array.isArray(u.args))
                throw new Error("脚本动作或参数不合法");
              const B = ie(u.args, 65536);
              D = await s.call(u.action, B);
            }
            J({
              type: "reply",
              callId: u.callId,
              value: ie(D),
              isUndefined: u.type === "service-call" && D === void 0
            });
          } catch (D) {
            J({
              type: "reply",
              callId: u.callId,
              error: Me(D)
            });
          } finally {
            h--;
          }
        }
      }
    }, document.body.appendChild(t);
  });
}
function st(e) {
  const o = {}, s = (d) => {
    if (!d || typeof d != "object") return;
    if (Array.isArray(d)) {
      d.forEach(s);
      return;
    }
    const n = d;
    if (n.type === "DataTable" && n.props && typeof n.props == "object") {
      const t = n.props;
      typeof t.tableId == "string" && t.tableId && (o[t.tableId] = {
        ...t.selection === !0 && t.defaultSelection === "all" ? { initialSelectionPending: !0 } : {},
        ...t.paginationMode === "server" && typeof t.total == "number" ? { total: t.total } : Array.isArray(t.rows) ? { total: t.rows.length } : {},
        ...typeof t.disabled == "boolean" ? { disabled: t.disabled } : {},
        ...typeof t.pageChangeEventId == "string" ? { pageChangeEventId: t.pageChangeEventId } : {},
        ...typeof t.pageSizeChangeEventId == "string" ? { pageSizeChangeEventId: t.pageSizeChangeEventId } : {},
        selectedIds: Array.isArray(t.selectedKeys) ? t.selectedKeys.map(String) : [],
        page: typeof t.page == "number" && t.page > 0 ? t.page : 1,
        pageSize: typeof t.pageSize == "number" && Number.isInteger(t.pageSize) && t.pageSize > 0 ? t.pageSize : 20
      });
    }
    Object.entries(n).forEach(([t, i]) => {
      Ne(n, t) || s(i);
    });
  };
  return s(e.page), Object.values(e.dialogs).forEach((d) => s(d.content)), Object.values(e.cells).forEach(s), o;
}
function at(e, o, s = "interactive") {
  if (e.schemaVersion !== 2 || e.logicVersion !== 2 || !e.logic)
    throw new Error("请使用新版页面配置（schemaVersion=2、logicVersion=2）");
  let d = o;
  const n = Re(e, d), t = Xe(n, {
    mode: s === "design" ? "design" : "runtime",
    host: d.context,
    capabilities: d.capabilities,
    services: s === "design" ? void 0 : d.services,
    request: (b, f) => d.request ? d.request(b, f) : Pe({
      connections: d.connections,
      host: d.context
    })(b, f),
    actionOutputKeys: o.actionOutputKeys,
    action: (b, f, j) => d.call(b, f, j),
    runScript: (b, f, j, $, h) => ot(b, x(f), {
      ...h,
      signal: j,
      call: $
    }),
    onLog: (b) => d.onLog?.(
      `${b.kind}/${b.id} ${b.status}`,
      b.detail ?? null
    )
  });
  for (const [b, f] of Object.entries(st(e)))
    t.setTable(b, f);
  if (s === "design")
    for (const [b, f] of Object.entries(d.designData ?? {}))
      t.setSourceData(b, x(f));
  const i = Ve(e), y = De(() => i(t.getSnapshot())), k = t.subscribe(
    () => y.setState(i(t.getSnapshot()))
  ), S = (b = {}, f) => ({
    ...t.getSnapshot(),
    scope: b,
    row: b.row ?? t.getSnapshot().row,
    result: f
  }), N = (b) => {
    const f = n.fields[b];
    if (!f) throw new Error(`未知字段：${b}`);
    return f;
  }, v = async (b, f = {}, j = !1) => {
    if (s !== "design")
      return t.executeEvent(
        b,
        { scope: f, row: f.row ?? null },
        j
      );
  };
  return {
    materialProps: (b, f, j = {}) => {
      const $ = S(j), h = { ...f };
      for (const T of n.bindings.filter(
        (M) => M.nodeId === b
      )) {
        const M = le(T.value, $), O = T.map && Array.isArray(M) ? M.map(
          (w) => Object.fromEntries(
            Object.entries(T.map).map(
              ([m, K]) => [
                m,
                ae(w, K.split("."))
              ]
            )
          )
        ) : M;
        h[T.property] = O;
        const P = {
          Text: "text",
          Badge: "text",
          Image: "src",
          ActionButton: "label",
          Link: "text",
          Tabs: "value"
        }[String(f.__material)];
        T.property === P && (h.binding = { from: "constant", value: O ?? null }), T.property === "href" && (h.hrefBinding = {
          from: "constant",
          value: O ?? null
        });
      }
      const a = (T) => {
        const M = n.rules.filter(
          (O) => O.targetId === b && O.property === T
        );
        return M.length ? M.every((O) => t.evaluateRule(O, $)) : T === "visible";
      };
      return {
        props: h,
        visible: a("visible"),
        disabled: s !== "design" && a("disabled")
      };
    },
    definition: e,
    instanceKey: o.instanceKey,
    store: y,
    mode: s,
    core: t,
    context: S,
    options: (b, f = {}) => ve(
      N(b),
      S({
        ...f,
        formId: N(b).formId ?? f.formId ?? "main"
      })
    ),
    runSource: (b, f = {}) => t.loadSource(b, void 0, S(f)),
    setField: (b, f, j = !0, $ = {}) => {
      if (s === "design") return;
      const h = N(b);
      t.setField(b, x(f)), j && h.onChange && v(
        h.onChange,
        { ...$, formId: h.formId ?? "main" },
        !0
      ).catch(() => {
      });
    },
    execute: v,
    updateHost: (b) => {
      d = b, t.setCapabilities(b.capabilities), t.setServices(s === "design" ? void 0 : b.services), t.setHost(b.context);
    },
    fieldStatus: (b, f = {}) => {
      const j = N(b), $ = S({
        ...f,
        formId: j.formId ?? f.formId ?? "main"
      }), h = (a, T) => {
        const M = n.rules.filter(
          (O) => O.targetId === (j.nodeId ?? b) && O.property === a
        );
        return M.length ? M.every((O) => t.evaluateRule(O, $)) : T;
      };
      return s === "design" ? {
        visible: h("visible", !0),
        disabled: !1,
        required: !!j.required,
        error: void 0
      } : {
        visible: h("visible", !0),
        disabled: h("disabled", !1),
        required: !!j.required || h("required", !1),
        error: y.getState().errors[b]
      };
    },
    resolve: (b, f = {}) => {
      const j = le(b, S(f));
      if (j === void 0) {
        if (s === "design" || b.from === "source" && e.logic.sources.some(
          ($) => $.id === b.sourceId
        ) && t.getSnapshot().sources[b.sourceId]?.status !== "success")
          return null;
        throw new Error("绑定路径不存在");
      }
      return j;
    },
    test: (b, f = {}) => {
      try {
        return de(b, S(f));
      } catch (j) {
        if (s === "design") return !1;
        throw j;
      }
    },
    getField: (b) => t.getSnapshot().form[b] ?? null,
    validate: (b, f = {}) => {
      if (s === "design") return !0;
      const j = t.checkForm(
        b,
        S({ ...f, formId: b })
      );
      return !Object.keys(j.errors).length;
    },
    setTable: (b, f) => {
      const j = y.getState().tables[b] ?? {
        selectedIds: [],
        page: 1,
        pageSize: 20
      }, $ = /* @__PURE__ */ new Set([
        "total",
        "disabled",
        "pageChangeEventId",
        "pageSizeChangeEventId"
      ]), h = Object.keys(f).some(
        (a) => !$.has(a) && JSON.stringify(j[a]) !== JSON.stringify(f[a])
      );
      t.setTable(
        b,
        { ...j, ...f },
        h
      );
    },
    closeDialog: () => {
      s !== "design" && !Object.values(y.getState().busy).some(Boolean) && t.closeDialog(!0);
    },
    start: () => t.start(),
    stop: () => t.stop(),
    dispose: () => {
      k(), t.dispose();
    }
  };
}
export {
  at as a,
  Ge as b,
  Pe as c,
  Ze as d,
  Te as e,
  ze as f,
  Xe as g,
  xe as h,
  Le as p,
  ot as r,
  $e as s
};
