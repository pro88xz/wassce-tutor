// POST /api/pay/checkout  { plan: "term" | "year" }
// Signed-in students only (Authorization: Bearer <Supabase access token>).
// Creates a payments row and a Monime checkout session for it, and returns
// the Monime-hosted payment page to send the student to.
//   200 { url, paymentId }
//   503 { code: "not_configured" }  Monime keys not set yet: the app falls back to WhatsApp
import { PLANS } from '../_lib/plans.js'
import { db, env, json, monime, monimeConfigured, preflight, requestUser } from '../_lib/server.js'

export const OPTIONS = preflight

export async function POST(request) {
  if (!monimeConfigured()) return json(request, { code: 'not_configured', error: 'Card and mobile money checkout is not switched on yet.' }, 503)

  const client = db()
  const user = await requestUser(request, client)
  if (!user) return json(request, { code: 'unauthorised', error: 'Please sign in again.' }, 401)

  const body = await request.json().catch(() => ({}))
  const planId = typeof body?.plan === 'string' ? body.plan : ''
  const plan = PLANS[planId]
  if (!plan) return json(request, { code: 'bad_plan', error: 'Choose a plan.' }, 400)

  // Reuse a checkout started in the last 30 minutes for the same plan, so a
  // double tap or a quick retry does not open a second payment.
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data: recent } = await client
    .from('payments')
    .select('id, checkout_session_id')
    .eq('user_id', user.id)
    .eq('plan', planId)
    .eq('status', 'pending')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
  if (recent?.[0]?.checkout_session_id) {
    const existing = await monime('GET', `/v1/checkout-sessions/${encodeURIComponent(recent[0].checkout_session_id)}`)
    if (existing.ok && existing.result?.status === 'pending' && existing.result.redirectUrl) {
      return json(request, { url: existing.result.redirectUrl, paymentId: recent[0].id })
    }
  }

  const { data: payment, error } = await client
    .from('payments')
    .insert({ user_id: user.id, plan: planId, amount_nle: plan.priceNle, status: 'created' })
    .select('id')
    .single()
  if (error || !payment) {
    console.error(`[pay] could not create payment row: ${error?.message}`)
    const missing = error?.code === 'PGRST205' || error?.code === '42P01'
    return json(request, { code: missing ? 'not_configured' : 'server_error', error: 'Could not start the payment.' }, missing ? 503 : 500)
  }

  const { site } = env()
  const back = `${site}/subscribe?payment=${payment.id}`
  const session = await monime('POST', '/v1/checkout-sessions', {
    // The payment id: a retry of this exact request is never charged twice.
    idempotencyKey: `wassce-tutor-payment-${payment.id}`,
    body: {
      name: `WASSCE Tutor: ${plan.name} (${plan.length})`,
      description: `Every lesson, every practice set and the AI tutor for ${plan.length}.`,
      reference: payment.id,
      successUrl: back,
      cancelUrl: `${back}&cancelled=1`,
      lineItems: [
        {
          type: 'custom',
          name: `${plan.name} (${plan.length})`,
          quantity: 1,
          // Minor units: NLe 25.00 is 2500.
          price: { currency: 'SLE', value: plan.priceNle * 100 },
        },
      ],
      brandingOptions: { primaryColor: '#6438d8' },
      metadata: { payment_id: payment.id, plan: planId },
    },
  })
  if (!session.ok || !session.result?.redirectUrl) {
    await client.from('payments').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('id', payment.id)
    return json(request, { code: 'monime_error', error: 'The payment page could not be opened. Please try again, or pay on WhatsApp.' }, 502)
  }

  await client
    .from('payments')
    .update({ checkout_session_id: session.result.id, status: 'pending', updated_at: new Date().toISOString() })
    .eq('id', payment.id)

  return json(request, { url: session.result.redirectUrl, paymentId: payment.id })
}
