// POST /api/pay/confirm  { paymentId }
// Signed-in students only. Called when a student comes back from the Monime
// payment page (and while they wait), so access switches on even if the
// webhook is slow. Checks the session with Monime; never trusts the browser.
//   200 { status: "completed" | "pending" | "processing" | "cancelled" | "expired" | ..., accessUntil?, expireTime? }
// For a USSD payment code that is not settled yet, the code's own state is read
// from Monime: "processing" (the student is paying), or "expired" (the 10
// minutes ran out, nothing was taken). The payments row is left as it is, so
// the "finish your payment" emails still find it.
import { db, json, monime, monimeConfigured, preflight, requestUser, settlePayment, settlePaymentCode } from '../_lib/server.js'

export const OPTIONS = preflight

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request) {
  if (!monimeConfigured()) return json(request, { code: 'not_configured' }, 503)

  const client = db()
  const user = await requestUser(request, client)
  if (!user) return json(request, { code: 'unauthorised', error: 'Please sign in again.' }, 401)

  const body = await request.json().catch(() => ({}))
  const paymentId = typeof body?.paymentId === 'string' ? body.paymentId : ''
  if (!UUID.test(paymentId)) return json(request, { code: 'bad_request' }, 400)

  const { data: payment } = await client
    .from('payments')
    .select('id, user_id, status, checkout_session_id, access_until, payment_code_id, provider_payment_id, amount_nle, ussd_code, financial_transaction_reference')
    .eq('id', paymentId)
    .maybeSingle()
  // Someone else's payment reads the same as a missing one.
  if (!payment || payment.user_id !== user.id) return json(request, { code: 'not_found' }, 404)

  let result = payment.payment_code_id
    ? await settlePaymentCode(client, payment)
    : await settlePayment(client, payment)
  let expireTime = null
  if (payment.payment_code_id && result.status !== 'completed') {
    const code = await monime('GET', `/v1/payment-codes/${encodeURIComponent(payment.payment_code_id)}`)
    if (code.ok && code.result?.id === payment.payment_code_id) {
      expireTime = typeof code.result.expireTime === 'string' ? code.result.expireTime : null
      const state = code.result.status
      if (state === 'expired' || state === 'cancelled') result = { status: 'expired' }
      // Paid or being paid, and the webhook has not settled it yet.
      else if (state === 'processing' || state === 'completed') result = { status: 'processing' }
    }
  }
  return json(request, { status: result.status, accessUntil: result.accessUntil ?? null, ussdCode: payment.ussd_code ?? null, expireTime })
}
