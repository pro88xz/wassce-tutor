// Paying for a plan with Monime (api/pay/*, server side). The browser never
// sees a Monime key: it asks our server for a checkout page, sends the
// student there, and asks our server to confirm when they come back.
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
  | { kind: 'redirect'; url: string; paymentId: string }
  /** Online checkout is not switched on (no Monime keys yet, or no server): pay on WhatsApp. */
  | { kind: 'whatsapp' }
  | { kind: 'error'; message: string }

export async function startCheckout(plan: PlanId): Promise<CheckoutResult> {
  try {
    const { status, data } = await post('checkout', { plan })
    if (status === 200 && typeof data?.url === 'string' && typeof data.paymentId === 'string') {
      return { kind: 'redirect', url: data.url, paymentId: data.paymentId }
    }
    if (status === 503 || status === 404 || status === 405) return { kind: 'whatsapp' }
    return { kind: 'error', message: typeof data?.error === 'string' ? data.error : 'The payment page could not be opened. Please try again.' }
  } catch {
    return { kind: 'error', message: 'No connection. Check your data and try again.' }
  }
}

export type PaymentStatus = 'completed' | 'pending' | 'created' | 'cancelled' | 'expired' | 'failed' | 'unknown'

export async function confirmPayment(paymentId: string): Promise<PaymentStatus> {
  try {
    const { status, data } = await post('confirm', { paymentId })
    if (status !== 200) return 'unknown'
    return (typeof data?.status === 'string' ? data.status : 'unknown') as PaymentStatus
  } catch {
    return 'unknown'
  }
}

// The payment a student started, kept so the app can confirm it when they
// come back from the payment page (on Android, payment happens in the browser).
export type PendingCheckout = { paymentId: string; plan: PlanId; startedAt: number }
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
