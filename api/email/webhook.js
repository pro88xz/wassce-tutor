// POST /api/email/webhook: delivery events from Resend (set the webhook up in
// Resend → Webhooks; put its signing secret in the GitHub secret
// RESEND_WEBHOOK_SECRET and run the "Set up email engine (16)" workflow).
// Every event is signed (Svix scheme) and checked before it is trusted; an
// event delivered twice is stored once. A permanent bounce or a spam complaint
// stops all future email to that address.
import { loadEmailConfig } from '../_lib/email/config.js'
import { verifyResendSignature } from '../_lib/email/webhook-signature.js'
import { db } from '../_lib/server.js'

const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export async function POST(request) {
  const client = db()
  const env = await loadEmailConfig(client)
  const raw = await request.text()
  if (!verifyResendSignature(raw, request.headers, env.webhookSecret)) return reply({ error: 'invalid signature' }, 401)

  let event
  try {
    event = JSON.parse(raw)
  } catch {
    return reply({ error: 'bad json' }, 400)
  }
  const type = String(event?.type ?? '')
  const data = event?.data ?? {}
  const messageId = typeof data.email_id === 'string' ? data.email_id : null

  const { data: job } = messageId
    ? await client.from('email_send_jobs').select('id, user_id').eq('provider_message_id', messageId).maybeSingle()
    : { data: null }

  const { error: insertError } = await client.from('email_message_events').upsert(
    {
      provider_event_id: request.headers.get('svix-id'),
      job_id: job?.id ?? null,
      provider_message_id: messageId,
      event_type: type,
      occurred_at: event?.created_at ?? new Date().toISOString(),
      metadata: { bounce: data.bounce ?? null, tags: data.tags ?? null },
    },
    { onConflict: 'provider_event_id', ignoreDuplicates: true },
  )
  if (insertError) {
    console.error(`[email] webhook store failed: ${insertError.message}`)
    return reply({ error: 'store failed' }, 500) // Resend retries
  }

  const addresses = (Array.isArray(data.to) ? data.to : [data.to]).filter((a) => typeof a === 'string').map((a) => a.trim().toLowerCase())
  const permanentBounce = type === 'email.bounced' && String(data.bounce?.type ?? '').toLowerCase() !== 'transient'
  const complaint = type === 'email.complained'
  if ((permanentBounce || complaint) && addresses.length) {
    await client.from('email_suppressions').upsert(
      addresses.map((email) => ({
        email_normalized: email,
        reason: complaint ? 'complaint' : 'hard_bounce',
        source: 'resend_webhook',
        detail: String(data.bounce?.message ?? type).slice(0, 300),
      })),
      { onConflict: 'email_normalized', ignoreDuplicates: true },
    )
    if (complaint && job?.user_id) {
      const now = new Date().toISOString()
      await client
        .from('email_preferences')
        .upsert({ user_id: job.user_id, marketing_status: 'unsubscribed', consent_source: 'complaint', unsubscribed_at: now, updated_at: now }, { onConflict: 'user_id' })
    }
  }
  return reply({ ok: true })
}
