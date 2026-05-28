import { supabase } from '@/lib/supabase'

const LOCK_KEY = 'wassce_admin_unlocked'
const MAX_ATTEMPTS = 3
const LOCK_MINUTES = 15

export function isUnlockedThisSession(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(LOCK_KEY) === '1'
}

export function markUnlocked() {
  sessionStorage.setItem(LOCK_KEY, '1')
}

export function clearUnlocked() {
  sessionStorage.removeItem(LOCK_KEY)
}

type GateResult =
  | { ok: true }
  | { ok: false; reason: 'wrong'; attemptsLeft: number }
  | { ok: false; reason: 'locked'; until: string }
  | { ok: false; reason: 'error'; message: string }

export async function tryUnlock(email: string, password: string): Promise<GateResult> {
  // 1. Check current lock state
  const { data: prof, error: pErr } = await supabase
    .from('profiles')
    .select('admin_failed_attempts, admin_locked_until')
    .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .single()
  if (pErr) return { ok: false, reason: 'error', message: pErr.message }

  if (prof.admin_locked_until && new Date(prof.admin_locked_until) > new Date()) {
    return { ok: false, reason: 'locked', until: prof.admin_locked_until }
  }

  // 2. Verify password by re-signing in (refreshes session if correct)
  const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })

  if (!authErr) {
    // Correct — reset counter, mark unlocked
    await supabase
      .from('profiles')
      .update({ admin_failed_attempts: 0, admin_locked_until: null })
      .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
    markUnlocked()
    return { ok: true }
  }

  // 3. Wrong password — increment, lock if maxed
  const attempts = (prof.admin_failed_attempts ?? 0) + 1
  const update: { admin_failed_attempts: number; admin_locked_until?: string } = {
    admin_failed_attempts: attempts,
  }
  if (attempts >= MAX_ATTEMPTS) {
    update.admin_locked_until = new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString()
  }
  await supabase
    .from('profiles')
    .update(update)
    .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')

  if (attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: 'locked', until: update.admin_locked_until! }
  }
  return { ok: false, reason: 'wrong', attemptsLeft: MAX_ATTEMPTS - attempts }
}
