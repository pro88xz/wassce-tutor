// POST /api/pay/webhook: Monime webhook deliveries.
// Set up in Monime → Developer → Webhooks:
//   URL      https://wasscetutor.com/api/pay/webhook
//   Release  caph (2025-08-23)
//   Events   payment_code.processed, payment_code.completed (plus checkout_session events if retained)
//   Method   HMAC; copy its secret into MONIME_WEBHOOK_SECRET in Vercel
//
// Every delivery is verified against the raw body before anything happens.
// The event only says which session changed: the session's real state is
// read back from Monime before the plan is granted. Deliveries may repeat,
// so handled event ids are recorded and granting is idempotent.
import { db, env, monime, monimeConfigured, settlePayment, settlePaymentCode, verifyMonimeSignature } from '../_lib/server.js'

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

  if (name === 'payment_code.processed' && objectId) {
    const incoming = payload?.data?.processedPaymentData
    const paymentId = incoming?.paymentId
    const amount = incoming?.amount
    if (!paymentId || amount?.currency !== 'SLE' || !Number.isFinite(Number(amount?.value))) return reply(400)

    const { data: payment } = await client.from('payments')
      .select('id, amount_nle, payment_code_id, status')
      .eq('payment_code_id', objectId).maybeSingle()
    if (!payment) return reply(404)

    const code = await monime('GET', `/v1/payment-codes/${encodeURIComponent(objectId)}`)
    if (!code.ok) return reply(500)
    if (
      code.result?.id !== objectId ||
      code.result?.reference !== payment.id ||
      code.result?.metadata?.payment_id !== payment.id ||
      code.result?.amount?.currency !== 'SLE' ||
      Number(code.result?.amount?.value) !== payment.amount_nle * 100 ||
      Number(amount.value) !== payment.amount_nle * 100
    ) return reply(400)

    const { error } = await client.from('payments').update({
      provider_payment_id: paymentId,
      payer_account_id: typeof incoming?.channelData?.accountId === 'string' ? incoming.channelData.accountId : null,
      financial_transaction_reference: typeof incoming?.financialTransactionReference === 'string' ? incoming.financialTransactionReference : null,
      financial_account_id: typeof code.result?.financialAccountId === 'string' ? code.result.financialAccountId : null,
      updated_at: new Date().toISOString(),
    }).eq('id', payment.id).neq('status', 'completed')
    if (error) {
      console.error(`[pay] could not record processed Monime payment: ${error.message}`)
      return reply(500)
    }
  }

  if (name === 'payment_code.completed' && objectId) {
    const { data: payment } = await client.from('payments')
      .select('id, user_id, status, access_until, payment_code_id, provider_payment_id, amount_nle')
      .eq('payment_code_id', objectId).maybeSingle()
    if (payment) {
      const result = await settlePaymentCode(client, payment)
      if (result.error === 'monime_unavailable' || result.error === 'grant_failed') return reply(500)
      if (result.error === 'payment_mismatch') return reply(400)
      if (result.status !== 'completed') return reply(500)
    }
  }

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
