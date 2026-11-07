// POST /api/pay/confirm  { paymentId }
// Signed-in students only. Called when a student comes back from the Monime
// payment page (and while they wait), so access switches on even if the
// webhook is slow. Checks the session with Monime; never trusts the browser.
//   200 { status: "completed" | "pending" | "cancelled" | "expired" | ..., accessUntil? }
import { db, json, monimeConfigured, preflight, requestUser, settlePayment, settlePaymentCode } from '../_lib/server.js'

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
    .select('id, user_id, status, checkout_session_id, access_until, payment_code_id, provider_payment_id, amount_nle, ussd_code')
    .eq('id', paymentId)
    .maybeSingle()
  // Someone else's payment reads the same as a missing one.
  if (!payment || payment.user_id !== user.id) return json(request, { code: 'not_found' }, 404)

  const result = payment.payment_code_id
    ? await settlePaymentCode(client, payment)
    : await settlePayment(client, payment)
  return json(request, { status: result.status, accessUntil: result.accessUntil ?? null, ussdCode: payment.ussd_code ?? null })
}
