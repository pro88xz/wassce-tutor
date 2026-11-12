// Where new accounts come from. wasscetutor.com/tiktok (vercel.json) redirects
// to /?utm_source=tiktok&utm_campaign=…; the first such visit is remembered on
// this device for 30 days. The source also travels in the sign-up metadata, so
// it survives confirming the email in another browser. Once signed in, the
// account's profile is stamped one time by record_signup_source() (migration
// 15), which ignores accounts more than three days old. Everything here is
// best effort: it must never get in the way of signing up or in.
import { supabase } from '@/lib/supabase'

const KEY = 'wt_first_touch'
const DONE = 'wt_source_checked:'
const SAFE = /^[a-z0-9_-]{1,40}$/

type Touch = { source: string; campaign: string | null; at: number }

function read(): Touch | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Touch | null
    return v && typeof v.source === 'string' && SAFE.test(v.source) ? v : null
  } catch {
    return null
  }
}

/** Remember the campaign of the first tagged visit (call on page load). */
export function captureCampaign(): void {
  try {
    const q = new URLSearchParams(window.location.search)
    const source = q.get('utm_source')?.toLowerCase() ?? ''
    if (!SAFE.test(source)) return
    const previous = read()
    if (previous && Date.now() - previous.at < 30 * 86_400_000) return
    const campaign = q.get('utm_campaign')?.toLowerCase() ?? ''
    localStorage.setItem(KEY, JSON.stringify({ source, campaign: SAFE.test(campaign) ? campaign : null, at: Date.now() }))
  } catch {
    // Storage blocked: attribution is optional.
  }
}

/** Sign-up metadata, so the source survives email confirmation on another device. */
export function campaignMetadata(): Record<string, string> {
  const t = read()
  return t ? { signup_source: t.source, ...(t.campaign ? { signup_campaign: t.campaign } : {}) } : {}
}

/** Stamp a newly created account with its source, once per account per device. */
export async function reportCampaign(userId: string): Promise<void> {
  try {
    if (localStorage.getItem(DONE + userId)) return
    const t = read()
    const { error } = await supabase.rpc('record_signup_source', { p_source: t?.source ?? null, p_campaign: t?.campaign ?? null })
    if (error) return // not deployed yet, or offline: try again next time
    localStorage.setItem(DONE + userId, '1')
    if (t) localStorage.removeItem(KEY)
  } catch {
    // Never block the app on this.
  }
}
