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
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // Any auth change (sign in / sign out / refresh) re-requires admin password
      clearUnlocked()
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
