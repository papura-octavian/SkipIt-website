// Cloudflare Worker for the "Request Tools" form on skipit.space.
// Receives a JSON request from the site and forwards it by email through Resend.

const MAX = { name: 80, email: 160, request: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Submissions faster than this after the page loaded are almost certainly bots.
const MIN_FILL_MS = 2500;

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function validate(data) {
  if (!data || typeof data !== "object") return { error: "Invalid request." };

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const request = String(data.request ?? "").trim();
  const company = String(data.company ?? "");
  const elapsed = Number(data.elapsedMs ?? 0);

  // Honeypot or too fast: pretend success so bots learn nothing.
  if (company || elapsed < MIN_FILL_MS) return { spam: true };

  if (!EMAIL_RE.test(email) || email.length > MAX.email) {
    return { error: "Please enter a valid email address." };
  }
  if (request.length < 10) {
    return { error: "Tell us a bit more about the tool (at least 10 characters)." };
  }
  if (request.length > MAX.request || name.length > MAX.name) {
    return { error: "Your message is too long." };
  }
  return { value: { name, email, request } };
}

async function sendEmail(env, { name, email, request }) {
  const who = (name || email).replace(/[\r\n]+/g, " ");
  const text = `Name: ${name || "-"}\nEmail: ${email}\n\nRequest:\n${request}\n`;
  const html =
    `<p><b>Name:</b> ${escapeHtml(name || "-")}<br><b>Email:</b> ${escapeHtml(email)}</p>` +
    `<p><b>Request:</b></p><pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(request)}</pre>`;

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: env.TO_EMAIL.split(",").map((t) => t.trim()),
      reply_to: email,
      subject: `SkipIt tool request from ${who}`.slice(0, 150),
      text,
      html,
    }),
  });
}

const worker = {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = corsHeaders(req.headers.get("Origin"), env);

    if (url.pathname !== "/request") {
      return json({ error: "Not found" }, 404, cors);
    }
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }
    if (!cors["Access-Control-Allow-Origin"]) {
      return json({ error: "Origin not allowed" }, 403, cors);
    }

    let data;
    try {
      data = await req.json();
    } catch {
      return json({ error: "Invalid request." }, 400, cors);
    }

    const result = validate(data);
    if (result.spam) return json({ ok: true }, 200, cors);
    if (result.error) return json({ error: result.error }, 400, cors);

    if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.TO_EMAIL) {
      return json({ error: "The request service is not configured yet." }, 503, cors);
    }

    const res = await sendEmail(env, result.value);
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return json({ error: "Could not send your request right now." }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
};

export default worker;
