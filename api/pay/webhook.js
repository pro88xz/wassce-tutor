// POST /api/pay/webhook: Monime webhook deliveries.
// Set up in Monime → Developer → Webhooks:
//   URL      https://wasscetutor.com/api/pay/webhook
//   Release  caph (2025-08-23)
//   Events   checkout_session.completed, checkout_session.cancelled, checkout_session.expired
//   Method   HMAC; copy its secret into MONIME_WEBHOOK_SECRET in Vercel
//
// Every delivery is verified against the raw body before anything happens.
// The event only says which session changed: the session's real state is
// read back from Monime before the plan is granted. Deliveries may repeat,
// so handled event ids are recorded and granting is idempotent.
import { db, env, monimeConfigured, settlePayment, verifyMonimeSignature } from '../_lib/server.js'

const reply = (status, text = '') => new Response(text, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  const raw = Buffer.from(await request.arrayBuffer())
  const { webhookSecret } = env()
  if (!webhookSecret || !verifyMonimeSignature(raw, request.headers.get('monime-signature'), webhookSecret)) {
    return reply(401)
  }
  if (!monimeConfigured()) return reply(503)

  let payload
  try {
    payload = JSON.parse(raw.toString('utf8'))
  } catch {
    return reply(400)
  }
  const eventId = payload?.event?.id
  const name = payload?.event?.name
  const objectId = payload?.object?.id
  if (!eventId || !name) return reply(400)

  const client = db()
  const { data: seen } = await client.from('payment_events').select('id').eq('id', eventId).maybeSingle()
  if (seen) return reply(200, 'duplicate')

  if (name.startsWith('checkout_session.') && objectId) {
    const { data: payment } = await client
      .from('payments')
      .select('id, user_id, status, checkout_session_id, access_until')
      .eq('checkout_session_id', objectId)
      .maybeSingle()
    if (payment) {
      const result = await settlePayment(client, payment)
      // Could not reach Monime or grant the plan: fail so Monime retries.
      if (result.error === 'monime_unavailable' || result.error === 'grant_failed') return reply(500)
    }
  }

  await client.from('payment_events').insert({ id: eventId, name, object_id: objectId ?? null })
  return reply(200, 'ok')
}
