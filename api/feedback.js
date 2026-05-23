// api/feedback.js
// Receives docs feedback (page rating + optional comment) and writes
// to the shared Supabase Postgres (docs_feedback table) using the
// service role key. Admins read submissions via the
// dashboard.off-hours.app/admin/docs-feedback page.
// Pattern mirrors off-hours-site/api/partner-apply.js (Edge runtime,
// direct REST call to Supabase, same SUPABASE_URL + service role envs).

export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Light rate limit: max 10 requests per IP per 60-second sliding window.
// Module-level Map persists across invocations on the same Edge instance
// and resets on cold start. Per spec: doesn't need to survive cold starts.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const recentByIp = new Map();

function getClientIp(req) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recent = (recentByIp.get(ip) || []).filter((t) => t > cutoff);
  if (recent.length >= RATE_LIMIT_MAX) {
    recentByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentByIp.set(ip, recent);
  return false;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, reason: 'rate_limited' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { page_id, vote, comment } = body || {};
  if (typeof page_id !== 'string' || page_id.length === 0) {
    return new Response('Missing or invalid page_id', { status: 400 });
  }
  if (vote !== 'yes' && vote !== 'no') {
    return new Response('Invalid vote', { status: 400 });
  }
  const commentValue =
    typeof comment === 'string' && comment.trim() ? comment.trim() : null;

  // Per spec: return 200 even if the Supabase insert fails. Log
  // server-side, don't surface backend errors to users. The widget UX
  // should be identical whether the pipeline is healthy or not.
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/docs_feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        page_id,
        vote,
        comment: commentValue,
        user_agent: req.headers.get('user-agent') || null,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('[feedback] Supabase insert non-2xx:', res.status, errText);
    }
  } catch (err) {
    console.error('[feedback] Supabase fetch error:', err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
