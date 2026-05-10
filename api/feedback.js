// api/feedback.js
// Receives docs feedback (page rating + optional comment) and forwards
// to hello@off-hours.app via Resend. No persistence, no admin dashboard.
// Pattern mirrors off-hours-site/api/partner-apply.js (Edge runtime,
// direct REST call to Resend, same RESEND_API_KEY env var).

export const config = { runtime: 'edge' };

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'hello@off-hours.app';
const FROM_EMAIL = 'Off Hours Docs <hello@off-hours.app>';

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
  const commentText = typeof comment === 'string' ? comment : '';

  const emoji = vote === 'yes' ? '👍' : '👎';
  const subject = `[Docs feedback] ${emoji} on ${page_id}`;
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const text = [
    `Page: ${page_id}`,
    `Vote: ${vote}`,
    '',
    'Comment:',
    commentText.trim() || '(no comment)',
    '',
    '---',
    `Submitted: ${new Date().toISOString()}`,
    `User agent: ${userAgent}`,
  ].join('\n');

  // Per spec: return 200 even if Resend fails. Log server-side, don't
  // surface backend errors to users — the widget UX should be identical
  // whether the email pipeline is healthy or not.
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_EMAIL],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('[feedback] Resend non-2xx:', res.status, errText);
    }
  } catch (err) {
    console.error('[feedback] Resend fetch error:', err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
