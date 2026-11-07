// POST /api/pay/ussd { plan: "term" | "year" }
// Creates a server-priced, one-time Monime Payment Code and returns its
// generated USSD dial string. Each order has its own immutable reference.
import { PLANS } from '../_lib/plans.js'
import { db, json, monime, monimeConfigured, preflight, requestUser } from '../_lib/server.js'

export const OPTIONS = preflight

export async function POST(request) {
  if (!monimeConfigured()) return json(request, { code: 'not_configured', error: 'Mobile money payments are not configured yet.' }, 503)
  const client = db()
  const user = await requestUser(request, client)
  if (!user) return json(request, { code: 'unauthorised', error: 'Please sign in again.' }, 401)

  const body = await request.json().catch(() => ({}))
  const planId = typeof body?.plan === 'string' ? body.plan : ''
  const plan = PLANS[planId]
  if (!plan) return json(request, { code: 'bad_plan', error: 'Choose a valid plan.' }, 400)

  // Reuse a live one-time code after a double tap or retry.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { data: recent } = await client.from('payments')
    .select('id, payment_code_id')
    .eq('user_id', user.id).eq('plan', planId).eq('status', 'pending')
    .not('payment_code_id', 'is', null).gte('created_at', since)
    .order('created_at', { ascending: false }).limit(1)
  if (recent?.[0]?.payment_code_id) {
    const current = await monime('GET', `/v1/payment-codes/${encodeURIComponent(recent[0].payment_code_id)}`)
    if (current.ok && current.result?.status === 'pending' && current.result?.ussdCode) {
      return json(request, { paymentId: recent[0].id, ussdCode: current.result.ussdCode })
    }
  }

  const { data: payment, error } = await client.from('payments')
    .insert({ user_id: user.id, plan: planId, amount_nle: plan.priceNle, status: 'created' })
    .select('id').single()
  if (error || !payment) {
    console.error(`[pay] could not create USSD payment row: ${error?.message}`)
    return json(request, { code: 'server_error', error: 'Could not start the payment. Please try again.' }, 500)
  }

  const code = await monime('POST', '/v1/payment-codes', {
    idempotencyKey: `wassce-tutor-ussd-${payment.id}`,
    body: {
      name: `WASSCE Tutor ${plan.name}`,
      mode: 'one_time',
      enable: true,
      amount: { currency: 'SLE', value: plan.priceNle * 100 },
      duration: '10m',
      reference: payment.id,
      metadata: { payment_id: payment.id, plan: planId, product: 'wassce_tutor' },
    },
  })
  const ussdCode = code.result?.ussdCode
  const codeId = code.result?.id
  if (!code.ok || !codeId || typeof ussdCode !== 'string' || !/^\*715\*\d+\*\d+#$/.test(ussdCode)) {
    await client.from('payments').update({ status: 'failed', updated_at: new Date().toISOString() }).eq('id', payment.id)
    console.error(`[pay] Monime did not return a valid payment-code USSD string for ${payment.id}`)
    return json(request, { code: 'monime_error', error: 'Monime could not create a payment code. Please try again or use WhatsApp.' }, 502)
  }

  const { error: updateError } = await client.from('payments').update({
    payment_code_id: codeId,
    ussd_code: ussdCode,
    status: 'pending',
    updated_at: new Date().toISOString(),
  }).eq('id', payment.id)
  if (updateError) {
    console.error(`[pay] could not persist payment code for ${payment.id}: ${updateError.message}`)
    return json(request, { code: 'server_error', error: 'Could not prepare the payment safely. Please try again.' }, 500)
  }
  return json(request, { paymentId: payment.id, ussdCode })
}
