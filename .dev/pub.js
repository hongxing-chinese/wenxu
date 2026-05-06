// proxy/dist/index.js
var b = { name: "HMAC", hash: "SHA-256" };
function m(t) {
  let r = typeof t == "string" ? new TextEncoder().encode(t) : new Uint8Array(t), e = "";
  for (let o of r) e += String.fromCharCode(o);
  return btoa(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function f(t) {
  let r = t.replace(/-/g, "+").replace(/_/g, "/"), e = atob(r), o = new Uint8Array(e.length);
  for (let n = 0; n < e.length; n++) o[n] = e.charCodeAt(n);
  return o;
}
async function h(t) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(t), b, false, ["sign", "verify"]);
}
async function R(t, r, e = 86400 * 7) {
  let o = { alg: "HS256", typ: "JWT" }, n = Math.floor(Date.now() / 1e3), s = { ...t, iat: n, exp: n + e }, a = m(JSON.stringify(o)), c = m(JSON.stringify(s)), d = `${a}.${c}`, u = await h(r), i = await crypto.subtle.sign("HMAC", u, new TextEncoder().encode(d));
  return `${d}.${m(i)}`;
}
async function w(t, r) {
  let e = t.split(".");
  if (e.length !== 3) return null;
  let [o, n, s] = e, a = `${o}.${n}`, c = await h(r), d = f(s);
  if (!await crypto.subtle.verify("HMAC", c, d, new TextEncoder().encode(a))) return null;
  let i = JSON.parse(new TextDecoder().decode(f(n)));
  return i.exp < Math.floor(Date.now() / 1e3) ? null : i;
}
function v(t) {
  let r = {};
  if (!t) return r;
  for (let e of t.split(";")) {
    let [o, ...n] = e.split("=");
    o && n.length > 0 && (r[o.trim()] = n.join("=").trim());
  }
  return r;
}
async function p(t, r) {
  let e = t.headers.get("Cookie"), n = v(e).auth_token;
  if (!n) return null;
  let s = await w(n, r);
  return s ? { id: s.sub, name: s.name, avatar: s.avatar, provider: s.provider } : null;
}
function P(t, r) {
  let e = new Response(t.body, t);
  return e.headers.append("Set-Cookie", `auth_token=${r}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${86400 * 7}`), e;
}
function E(t) {
  let r = new Response(t.body, t);
  return r.headers.append("Set-Cookie", "auth_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"), r;
}
function y(t) {
  let r = new EdgeKV({ namespace: t });
  return { async getRecords(e) {
    let o = `user_${e}_records`, n = await r.get(o, { type: "json" });
    return Array.isArray(n) ? n : [];
  }, async addRecord(e, o) {
    let n = `user_${e}_records`, a = (await r.get(n, { type: "json" }) || []).filter((c) => c.id !== o.id);
    a.unshift(o), await r.put(n, JSON.stringify(a.slice(0, 100)));
  }, async deleteRecord(e, o) {
    let n = `user_${e}_records`, s = await r.get(n, { type: "json" }) || [], a = s.filter((c) => c.id !== o);
    return a.length === s.length ? false : (await r.put(n, JSON.stringify(a)), true);
  }, async getUser(e) {
    return await r.get(`user_${e}`, { type: "json" }) || null;
  }, async setUser(e, o) {
    await r.put(`user_${e}`, JSON.stringify(o));
  } };
}
var _ = /* @__PURE__ */ new Set(["qq", "wx"]);
async function A(t, r, e) {
  let o = new URL(t.url), n = o.pathname, s = r;
  if (n === "/api/auth/login" && t.method === "GET") {
    let a = o.searchParams.get("type") || "qq";
    if (!_.has(a)) return e.json({ error: `\u4E0D\u652F\u6301\u7684\u767B\u5F55\u65B9\u5F0F: ${a}` }, 400);
    let c = `${s.APP_ORIGIN}/api/auth/callback`, d = `${s.LOGIN_API_URL}?act=login&appid=${s.LOGIN_APP_ID}&appkey=${s.LOGIN_APP_KEY}&type=${a}&redirect_uri=${encodeURIComponent(c)}`;
    try {
      let i = await (await fetch(d)).json();
      return i.code !== 0 || !i.url ? e.json({ error: i.msg || "\u83B7\u53D6\u767B\u5F55\u5730\u5740\u5931\u8D25" }, 502) : e.json({ url: i.url });
    } catch {
      return e.json({ error: "\u767B\u5F55\u670D\u52A1\u8BF7\u6C42\u5931\u8D25" }, 502);
    }
  }
  if (n === "/api/auth/callback" && t.method === "GET") {
    let a = o.searchParams.get("type"), c = o.searchParams.get("code");
    if (!a || !c) return e.json({ error: "\u7F3A\u5C11 type \u6216 code \u53C2\u6570" }, 400);
    if (!_.has(a)) return e.json({ error: `\u4E0D\u652F\u6301\u7684\u767B\u5F55\u65B9\u5F0F: ${a}` }, 400);
    let d = `${s.LOGIN_API_URL}?act=callback&appid=${s.LOGIN_APP_ID}&appkey=${s.LOGIN_APP_KEY}&type=${a}&code=${encodeURIComponent(c)}`;
    try {
      let i = await (await fetch(d)).json();
      if (i.code !== 0 || !i.social_uid) return e.json({ error: i.msg || "\u767B\u5F55\u5931\u8D25" }, 400);
      let l = `${a}_${i.social_uid}`;
      await y(s.KV_NAMESPACE).setUser(l, { id: l, name: i.nickname || `${a}\u7528\u6237`, avatar: i.faceimg });
      let T = await R({ sub: l, name: i.nickname || `${a}\u7528\u6237`, avatar: i.faceimg, provider: a }, s.JWT_SECRET), O = new URL("/app", s.APP_ORIGIN), j = Response.redirect(O.toString(), 302);
      return P(j, T);
    } catch {
      return e.json({ error: "\u767B\u5F55\u670D\u52A1\u8BF7\u6C42\u5931\u8D25" }, 502);
    }
  }
  if (n === "/api/auth/me" && t.method === "GET") {
    let a = await p(t, s.JWT_SECRET);
    return a ? e.json({ user: a }) : e.json({ user: null }, 401);
  }
  if (n === "/api/auth/logout" && t.method === "POST") {
    let a = e.json({ ok: true });
    return E(a);
  }
  return e.json({ error: "Not Found" }, 404);
}
async function S(t, r, e) {
  let n = new URL(t.url).pathname, s = r;
  if (n === "/api/chat/completions" && t.method === "POST") {
    if (!await p(t, s.JWT_SECRET)) return e.json({ error: "Unauthorized\uFF0C\u8BF7\u5148\u767B\u5F55" }, 401);
    let c = await t.json();
    if (!c.systemPrompt || !c.userMessage) return e.json({ error: "\u7F3A\u5C11 systemPrompt \u6216 userMessage" }, 400);
    let d = (s.LLM_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/$/, ""), u = s.LLM_MODEL || "qwen-plus", i = await fetch(`${d}/chat/completions`, { method: "POST", headers: { Authorization: `Bearer ${s.LLM_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: u, messages: [{ role: "system", content: c.systemPrompt }, { role: "user", content: c.userMessage }], stream: c.stream !== false }) });
    if (!i.ok) {
      let l = await i.text();
      return e.json({ error: `LLM API \u9519\u8BEF: ${i.status}`, detail: l }, 502);
    }
    return new Response(i.body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
  }
  return e.json({ error: "Not Found" }, 404);
}
async function k(t, r, e) {
  let n = new URL(t.url).pathname, s = r, a = await p(t, s.JWT_SECRET);
  if (!a) return e.json({ error: "Unauthorized\uFF0C\u8BF7\u5148\u767B\u5F55" }, 401);
  let c = y(s.KV_NAMESPACE);
  if (n === "/api/history" && t.method === "GET") {
    let u = await c.getRecords(a.id);
    return e.json({ records: u });
  }
  if (n === "/api/history" && t.method === "POST") {
    let u = await t.json();
    return !u.id || !u.type ? e.json({ error: "\u8BB0\u5F55\u7F3A\u5C11 id \u6216 type" }, 400) : (u.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), await c.addRecord(a.id, u), e.json({ ok: true, record: u }));
  }
  let d = n.match(/^\/api\/history\/(.+)$/);
  if (d && t.method === "DELETE") {
    let u = d[1];
    return await c.deleteRecord(a.id, u) ? e.json({ ok: true }) : e.json({ error: "\u8BB0\u5F55\u4E0D\u5B58\u5728" }, 404);
  }
  return e.json({ error: "Not Found" }, 404);
}
var L = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400" };
function C(t) {
  let r = new Response(t.body, t);
  for (let [e, o] of Object.entries(L)) r.headers.set(e, o);
  return r;
}
function $() {
  return new Response(null, { status: 204, headers: L });
}
function g(t, r = 200) {
  return new Response(JSON.stringify(t), { status: r, headers: { "Content-Type": "application/json" } });
}
function I() {
  return g({ error: "Not Found" }, 404);
}
var Z = { async fetch(t, r) {
  if (t.method === "OPTIONS") return $();
  let o = new URL(t.url).pathname;
  try {
    let n;
    return o.startsWith("/api/auth") ? n = await A(t, r, { json: g }) : o.startsWith("/api/chat") ? n = await S(t, r, { json: g }) : o.startsWith("/api/history") ? n = await k(t, r, { json: g }) : n = I(), C(n);
  } catch (n) {
    let s = n instanceof Error ? n.message : "Internal Server Error";
    return C(g({ error: s }, 500));
  }
} };
export {
  Z as default
};
