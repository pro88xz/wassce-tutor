// Shared server code for the payment functions (api/pay/*). Runs on Vercel
// only: files in api/_lib are helpers, not endpoints.
//
// Configuration (Vercel → Settings → Environment Variables). Never commit,
// log or send any of these to the browser:
//   MONIME_ACCESS_TOKEN    Monime access token (mon_test_… for testing, mon_… live)
//   MONIME_SPACE_ID        Monime Space ID (spc-…)
//   MONIME_WEBHOOK_SECRET  the HMAC secret of the webhook set up in Monime
//   SUPABASE_SECRET_KEY    already set for the question sync
//   VITE_SUPABASE_URL      already set for the build
//   SITE_URL               optional; defaults to https://wasscetutor.com
import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const MONIME_API = 'https://api.monime.io'
const MONIME_VERSION = 'caph.2025-08-23'

export const env = () => ({
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  monimeToken: process.env.MONIME_ACCESS_TOKEN || '',
  monimeSpace: process.env.MONIME_SPACE_ID || '',
  webhookSecret: process.env.MONIME_WEBHOOK_SECRET || '',
  site: (process.env.SITE_URL || 'https://wasscetutor.com').replace(/\/$/, ''),
})

// ── HTTP helpers ────────────────────────────────────────────────────────────

/** The website, the Android app (Capacitor serves it from https://localhost) and local development. */
function allowedOrigin(origin, site) {
  if (!origin) return null
  if (origin === site || origin === 'https://localhost' || origin === 'capacitor://localhost') return origin
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin
  return null
}

export function corsHeaders(request) {
  const origin = allowedOrigin(request.headers.get('origin'), env().site)
  return origin
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
      }
    : { Vary: 'Origin' }
}

export const preflight = (request) => new Response(null, { status: 204, headers: corsHeaders(request) })

export function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders(request) },
  })
}

// ── Supabase (server key: bypasses row-level security, so check everything) ──

export function db() {
  const { supabaseUrl, supabaseKey } = env()
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

/** The signed-in user who sent the request, from their Supabase access token. */
export async function requestUser(request, client) {
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null
  const { data, error } = await client.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

// ── Monime ─────────────────────────────────────────────────────────────────

export const monimeConfigured = () => {
  const e = env()
  return Boolean(e.monimeToken && e.monimeSpace && e.supabaseUrl && e.supabaseKey)
}

/** Calls the Monime API. Returns { ok, status, result, reason, requestId }. */
export async function monime(method, path, { body, idempotencyKey } = {}) {
  const { monimeToken, monimeSpace } = env()
  const headers = {
    Authorization: `Bearer ${monimeToken}`,
    'Monime-Space-Id': monimeSpace,
    'Monime-Version': MONIME_VERSION,
  }
  if (body) headers['Content-Type'] = 'application/json'
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

  let res
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      res = await fetch(`${MONIME_API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
    } catch (e) {
      res = null
      if (attempt === 2) return { ok: false, status: 0, reason: 'network_error', requestId: null, message: String(e) }
    }
    // Retry network errors and 5xx with the same idempotency key; nothing else.
    if (res && res.status < 500) break
    await new Promise((r) => setTimeout(r, 300 * 2 ** attempt + Math.random() * 200))
  }
  const requestId = res.headers.get('monime-request-id')
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.success) {
    const reason = data?.error?.reason || `http_${res.status}`
    console.error(`[monime] ${method} ${path} failed: ${reason} (request ${requestId ?? 'n/a'})`)
    return { ok: false, status: res.status, reason, requestId }
  }
  return { ok: true, status: res.status, result: data.result, requestId }
}

/**
 * Verifies a Monime webhook signature: header "t=<unix>,v1=<base64>", where
 * v1 = base64(HMAC-SHA256(secret, `${t}_${rawBody}`)). Rejects deliveries
 * older than 5 minutes or more than 1 minute in the future.
 */
export function verifyMonimeSignature(rawBody, header, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!header || !secret) return false
  const parts = {}
  for (const pair of header.split(',')) {
    const [k, ...rest] = pair.split('=')
    parts[k.trim()] = rest.join('=').trim()
  }
  const { t, v1 } = parts
  if (!t || !v1 || !/^\d+$/.test(t)) return false
  const ts = Number(t)
  if (nowSeconds - ts > 300 || ts - nowSeconds > 60) return false
  const expected = crypto.createHmac('sha256', secret).update(Buffer.concat([Buffer.from(`${t}_`), rawBody])).digest()
  const given = Buffer.from(v1, 'base64')
  return given.length === expected.length && crypto.timingSafeEqual(given, expected)
}


/**
 * Verifies a one-time Payment Code and its resulting Payment with Monime.
 * The signed webhook is only a trigger; the authoritative code and payment
 * objects are fetched server-to-server before the subscription is granted.
 */
export async function settlePaymentCode(client, payment) {
  if (payment.status === 'completed') return { status: 'completed', accessUntil: payment.access_until }
  if (!payment.payment_code_id || !payment.provider_payment_id) return { status: payment.status }

  const [codeResult, paymentResult] = await Promise.all([
    monime('GET', `/v1/payment-codes/${encodeURIComponent(payment.payment_code_id)}`),
    monime('GET', `/v1/payments/${encodeURIComponent(payment.provider_payment_id)}`),
  ])
  if (!codeResult.ok || !paymentResult.ok) return { status: payment.status, error: 'monime_unavailable' }

  const code = codeResult.result
  const paid = paymentResult.result
  const expectedMinor = Number(payment.amount_nle) * 100
  const codeAmount = code?.amount
  const paidAmount = paid?.amount
  const valid =
    code?.id === payment.payment_code_id &&
    code?.status === 'completed' &&
    code?.reference === payment.id &&
    code?.metadata?.payment_id === payment.id &&
    codeAmount?.currency === 'SLE' &&
    Number(codeAmount?.value) === expectedMinor &&
    paid?.id === payment.provider_payment_id &&
    paid?.status === 'completed' &&
    paid?.reference === payment.id &&
    paidAmount?.currency === 'SLE' &&
    Number(paidAmount?.value) === expectedMinor &&
    typeof paid?.financialTransactionReference === 'string' &&
    paid.financialTransactionReference.length > 0 &&
    (!code.financialAccountId || !paid.financialAccountId || code.financialAccountId === paid.financialAccountId)

  if (!valid) {
    console.error(`[pay] Monime Payment Code/payment verification mismatch for local payment ${payment.id}`)
    return { status: payment.status, error: 'payment_mismatch' }
  }

  const { data, error } = await client.rpc('complete_payment', { p_payment: payment.id })
  if (error) {
    console.error(`[pay] complete_payment failed for ${payment.id}: ${error.message}`)
    return { status: payment.status, error: 'grant_failed' }
  }
  return { status: 'completed', accessUntil: data }
}

/**
 * Brings a payment up to date with its Monime checkout session. Grants the
 * plan (once) when the session is completed. Returns the payment's status.
 */
export async function settlePayment(client, payment) {
  if (payment.status === 'completed') return { status: 'completed', accessUntil: payment.access_until }
  if (!payment.checkout_session_id) return { status: payment.status }

  const got = await monime('GET', `/v1/checkout-sessions/${encodeURIComponent(payment.checkout_session_id)}`)
  if (!got.ok) return { status: payment.status, error: 'monime_unavailable' }
  const session = got.result
  // The session must be the one created for this payment.
  if (session.id !== payment.checkout_session_id || (session.reference && session.reference !== payment.id)) {
    console.error(`[pay] session ${session.id} does not match payment ${payment.id}`)
    return { status: payment.status, error: 'mismatch' }
  }

  if (session.status === 'completed') {
    const { data, error } = await client.rpc('complete_payment', { p_payment: payment.id })
    if (error) {
      console.error(`[pay] complete_payment failed for ${payment.id}: ${error.message}`)
      return { status: payment.status, error: 'grant_failed' }
    }
    return { status: 'completed', accessUntil: data }
  }
  if (session.status === 'cancelled' || session.status === 'expired') {
    await client.from('payments').update({ status: session.status, updated_at: new Date().toISOString() }).eq('id', payment.id).neq('status', 'completed')
    return { status: session.status }
  }
  return { status: 'pending' }
}
