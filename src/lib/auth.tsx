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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      // Session check done: stop hiding the prerendered landing page
      // (see BOOT_SCRIPT in routes/__root.tsx). Outside the Android app also
      // drop "native-app", in case the boot script misdetected the platform.
      document.documentElement.classList.remove('app-boot')
      if (!Capacitor.isNativePlatform()) document.documentElement.classList.remove('native-app')
    })

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

  const signOut = async () => {
    clearUnlocked()
    await supabase.auth.signOut()
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
