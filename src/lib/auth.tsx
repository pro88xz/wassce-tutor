import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import { supabase } from '@/lib/supabase'
import { clearUnlocked } from '@/lib/adminGate'

type AuthState = {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

/** Removes every Supabase session entry this app keeps on the device. */
function clearStoredSession() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (/^sb-.+-auth-token/.test(key)) localStorage.removeItem(key)
    }
  } catch {
    // Storage can be unavailable (private mode, blocked site data): nothing to clear.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the current session on load. Whatever happens (including an error
    // reading it), the check must end, or the boot spinner would never clear.
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false))

    // Listen for auth changes (login, logout, token refresh)
    let lastUserId: string | null | undefined
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      // Re-require the admin password on sign-out, when a different account
      // signs in, or when the account's credentials change. Page loads
      // (INITIAL_SESSION) and hourly token refreshes keep the unlock, so a
      // reviewer isn't asked for the password on every refresh.
      const userId = session?.user?.id ?? null
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED' || (lastUserId !== undefined && userId !== lastUserId)) {
        clearUnlocked()
      }
      lastUserId = userId
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  // The boot marker hides the prerendered landing page while a stored session
  // is restored (see BOOT_SCRIPT in routes/__root.tsx). Once the session check
  // has finished it must never be present, whatever the auth state is: it is
  // cleared here, after React has drawn the signed-in or signed-out screen, so
  // neither the landing page nor the spinner flashes in between. Outside the
  // Android app also drop "native-app", in case the boot script misdetected
  // the platform.
  useEffect(() => {
    if (loading) return
    document.documentElement.classList.remove('app-boot')
    if (!Capacitor.isNativePlatform()) document.documentElement.classList.remove('native-app')
  }, [loading, session])

  const signOut = async () => {
    clearUnlocked()
    let failed = false
    try {
      const { error } = await supabase.auth.signOut()
      failed = !!error
    } catch {
      failed = true
    }
    if (failed) {
      // The server could not be reached, so Supabase kept the session. Signing
      // out must still work on this device (phones here are often shared and
      // connections drop), so end the session locally.
      clearStoredSession()
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
