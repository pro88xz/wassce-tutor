// /api/email/unsubscribe?t=<signed token>
//   GET   a small page with an "Unsubscribe" button (link scanners open links,
//         so opening the page alone changes nothing)
//   POST  unsubscribes: from that button, or from the email app's one-click
//         unsubscribe (RFC 8058, "List-Unsubscribe=One-Click"). A second
//         button on the result page subscribes again.
// Only marketing emails stop; account emails (payment confirmations, access
// ending) still arrive.
import { loadEmailConfig } from '../_lib/email/config.js'
import { verifyUnsubscribeToken } from '../_lib/email/tokens.js'
import { db } from '../_lib/server.js'

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function page(title, body, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${escape(title)} · WASSCE Tutor</title>
<style>
  body{margin:0;background:#f2f3f8;font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#171c2b}
  .band{background:#4720b5;padding:18px 24px}.band img{display:block;width:190px;height:20px}
  main{max-width:520px;margin:32px auto;background:#fff;border:1px solid #e5e9f2;border-radius:16px;padding:28px 24px}
  h1{margin:0 0 12px;font-size:24px;line-height:1.25}p{margin:0 0 16px;color:#4f5b70}
  button{font:700 16px/1 inherit;font-family:inherit;border:0;border-radius:12px;padding:15px 22px;cursor:pointer;background:#6438d8;color:#fff;width:100%}
  button.quiet{background:#ede8fc;color:#4720b5}a{color:#6438d8}
</style></head><body><div class="band"><a href="/"><img src="/brand/email-logo.png" alt="WASSCE Tutor"></a></div>
<main>${body}</main></body></html>`
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })
}

const invalid = () =>
  page(
    'Link not valid',
    `<h1>This link isn't valid any more</h1><p>You can still change which emails you get in your account.</p><p><a href="/account">Open email settings</a></p>`,
    400,
  )

function form(token, action, label, quiet = false) {
  return `<form method="post" action="/api/email/unsubscribe?t=${encodeURIComponent(token)}"><input type="hidden" name="action" value="${action}"><button${quiet ? ' class="quiet"' : ''}>${escape(label)}</button></form>`
}

export async function GET(request) {
  const env = await loadEmailConfig(db())
  const token = new URL(request.url).searchParams.get('t') ?? ''
  if (!verifyUnsubscribeToken(env.tokenSecret, token)) return invalid()
  return page(
    'Unsubscribe',
    `<h1>Stop study tips and reminders?</h1><p>You'll stop getting study tips, reminders and news from WASSCE Tutor. Account emails, like payment confirmations, will still arrive.</p>${form(token, 'unsubscribe', 'Unsubscribe')}`,
  )
}

export async function POST(request) {
  const client = db()
  const env = await loadEmailConfig(client)
  const token = new URL(request.url).searchParams.get('t') ?? ''
  const userId = verifyUnsubscribeToken(env.tokenSecret, token)
  const params = new URLSearchParams(await request.text().catch(() => ''))
  const oneClick = params.get('List-Unsubscribe') === 'One-Click'
  if (!userId) return oneClick ? new Response('invalid', { status: 400 }) : invalid()

  const resubscribe = !oneClick && params.get('action') === 'resubscribe'
  const now = new Date().toISOString()
  const { error } = await client.from('email_preferences').upsert(
    resubscribe
      ? { user_id: userId, marketing_status: 'subscribed', consent_source: 'email_link', subscribed_at: now, updated_at: now }
      : { user_id: userId, marketing_status: 'unsubscribed', consent_source: 'email_link', unsubscribed_at: now, updated_at: now },
    { onConflict: 'user_id' },
  )
  if (error) {
    console.error(`[email] unsubscribe failed: ${error.message}`)
    return oneClick ? new Response('error', { status: 500 }) : page('Something went wrong', `<h1>Something went wrong</h1><p>Please try again, or change your email settings in your account.</p>`, 500)
  }
  if (!resubscribe) {
    // Anything already queued for this student stops too.
    await client
      .from('email_send_jobs')
      .update({ status: 'cancelled', skip_reason: 'unsubscribed', updated_at: now })
      .eq('user_id', userId)
      .eq('category', 'marketing')
      .eq('status', 'queued')
  }
  if (oneClick) return new Response('unsubscribed', { status: 200 })
  return resubscribe
    ? page('Subscribed', `<h1>You're subscribed again</h1><p>You'll get study tips, reminders and news from WASSCE Tutor.</p><p><a href="/">Back to WASSCE Tutor</a></p>`)
    : page(
        'Unsubscribed',
        `<h1>You're unsubscribed</h1><p>You won't get study tips, reminders or news any more. Account emails, like payment confirmations, will still arrive.</p>${form(token, 'resubscribe', 'Subscribe again', true)}`,
      )
}
