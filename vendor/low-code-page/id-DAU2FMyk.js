const l = (n) => {
  let t;
  const e = /* @__PURE__ */ new Set(), c = (s, a) => {
    const o = typeof s == "function" ? s(t) : s;
    if (!Object.is(o, t)) {
      const S = t;
      t = a ?? (typeof o != "object" || o === null) ? o : Object.assign({}, t, o), e.forEach((f) => f(t, S));
    }
  }, i = () => t, r = { setState: c, getState: i, getInitialState: () => u, subscribe: (s) => (e.add(s), () => e.delete(s)) }, u = t = n(c, i, r);
  return r;
}, g = ((n) => n ? l(n) : l);
function y() {
  const n = globalThis.crypto;
  if (typeof n?.randomUUID == "function") return n.randomUUID();
  const t = new Uint8Array(16);
  n.getRandomValues(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
  const e = Array.from(
    t,
    (c) => c.toString(16).padStart(2, "0")
  ).join("");
  return `${e.slice(0, 8)}-${e.slice(8, 12)}-${e.slice(12, 16)}-${e.slice(16, 20)}-${e.slice(20)}`;
}
export {
  g as a,
  y as c
};
