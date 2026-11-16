// Paying for a plan with Monime (api/pay/*, server side). The browser never
// sees a Monime key: it asks our server for a one-time, fixed-price USSD code
// and asks our server to verify the resulting payment when the student returns.
import { Capacitor } from '@capacitor/core'
import { supabase } from '@/lib/supabase'
import type { PlanId } from '@/lib/plans'

// The Android app runs from local files, so it calls the website's API.
const API = typeof window !== 'undefined' && Capacitor.isNativePlatform() ? 'https://wasscetutor.com' : ''

async function post(path: string, body: unknown): Promise<{ status: number; data: Record<string, unknown> | null }> {
  const { data: auth } = await supabase.auth.getSession()
  const token = auth.session?.access_token
  const res = await fetch(`${API}/api/pay/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null
  return { status: res.status, data }
}

export type CheckoutResult =
  | { kind: 'ussd'; ussdCode: string; paymentId: string; expiresAt: number }
  | { kind: 'whatsapp' }
  | { kind: 'error'; message: string }

export async function startUssdPayment(plan: PlanId): Promise<CheckoutResult> {
  try {
    const { status, data } = await post('ussd', { plan })
    if (status === 200 && typeof data?.ussdCode === 'string' && typeof data.paymentId === 'string') {
      // Monime's codes last 10 minutes; its own expiry time is used when it sends one.
      const expiresAt = typeof data.expireTime === 'string' && !Number.isNaN(Date.parse(data.expireTime)) ? Date.parse(data.expireTime) : Date.now() + 10 * 60 * 1000
      return { kind: 'ussd', ussdCode: data.ussdCode, paymentId: data.paymentId, expiresAt }
    }
    if (status === 503 || status === 404 || status === 405) return { kind: 'whatsapp' }
    const diagnostic = data?.diagnostic as { reason?: unknown; status?: unknown; requestId?: unknown } | undefined
    if (diagnostic && typeof diagnostic.reason === 'string') {
      const http = typeof diagnostic.status === 'number' && diagnostic.status > 0 ? `HTTP ${diagnostic.status}` : 'network error'
      const reference = typeof diagnostic.requestId === 'string' ? ` Reference: ${diagnostic.requestId}.` : ''
      return { kind: 'error', message: `Monime rejected payment-code creation: ${diagnostic.reason} (${http}).${reference}` }
    }
    return { kind: 'error', message: typeof data?.error === 'string' ? data.error : 'The USSD payment could not be prepared. Please try again.' }
  } catch {
    return { kind: 'error', message: 'No connection. Check your data and try again.' }
  }
}

export type PaymentStatus = 'completed' | 'pending' | 'processing' | 'created' | 'cancelled' | 'expired' | 'failed' | 'unknown'

export async function confirmPayment(paymentId: string): Promise<{ status: PaymentStatus; expiresAt?: number }> {
  try {
    const { status, data } = await post('confirm', { paymentId })
    if (status !== 200) return { status: 'unknown' }
    const expiresAt = typeof data?.expireTime === 'string' && !Number.isNaN(Date.parse(data.expireTime)) ? Date.parse(data.expireTime) : undefined
    return { status: (typeof data?.status === 'string' ? data.status : 'unknown') as PaymentStatus, expiresAt }
  } catch {
    return { status: 'unknown' }
  }
}

// The payment a student started, kept so the app can confirm it when they
// come back from the payment page (on Android, payment happens in the browser).
export type PendingCheckout = { paymentId: string; plan: PlanId; startedAt: number; ussdCode?: string; expiresAt?: number }
const KEY = (userId: string) => `wt_checkout_${userId}`

export function rememberCheckout(userId: string, p: PendingCheckout) {
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(p))
  } catch {
    /* private mode: the return URL still carries the payment id */
  }
}

export function pendingCheckout(userId: string): PendingCheckout | null {
  try {
    const p = JSON.parse(localStorage.getItem(KEY(userId)) ?? 'null') as PendingCheckout | null
    // Monime checkout pages expire; after a day there is nothing to wait for.
    return p && Date.now() - p.startedAt < 24 * 60 * 60 * 1000 ? p : null
  } catch {
    return null
  }
}

export function forgetCheckout(userId: string) {
  try {
    localStorage.removeItem(KEY(userId))
  } catch {
    /* nothing to forget */
  }
}

/** Phones (and the Android app) can open the dialler from a tel: link; computers cannot. */
export function canDial(): boolean {
  if (typeof window === 'undefined') return false
  return Capacitor.isNativePlatform() || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

/** Opens the phone dialler with a USSD code (# must be encoded). */
export function openDialler(ussdCode: string) {
  window.location.href = `tel:${encodeURIComponent(ussdCode)}`
}
