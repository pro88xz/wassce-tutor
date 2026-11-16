import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { supabase } from '@/lib/supabase'

type GoogleCredentialResponse = { credential: string }
type GoogleIdentity = {
  initialize: (options: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    nonce: string
    use_fedcm_for_prompt: boolean
  }) => void
  renderButton: (element: HTMLElement, options: {
    type: 'standard'
    theme: 'outline'
    size: 'large'
    text: 'signup_with' | 'signin_with'
    shape: 'rectangular'
    width: number
    logo_alignment: 'left'
  }) => void
}
declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdentity } }
  }
}

type Props = {
  intent: 'student' | 'tutor' | 'affiliate'
  referralCode?: string
  mode: 'signup' | 'signin'
  /** Google has returned an account and it is being confirmed with the server. */
  onStart?: () => void
  onAuthenticated: () => void
  onError: (message: string) => void
}

let nativeGoogleInitialization: Promise<void> | null = null

async function createNoncePair(): Promise<{ nonce: string; hashedNonce: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const nonce = btoa(String.fromCharCode(...bytes))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce))
  const hashedNonce = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return { nonce, hashedNonce }
}

function googleProfileName(idToken: string): string {
  try {
    const payload = idToken.split('.')[1]
    if (!payload) return ''
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(base64)) as { name?: unknown }
    return typeof claims.name === 'string' ? claims.name : ''
  } catch {
    return ''
  }
}

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google sign-in could not load. Check your connection and try again.')), { once: true })
      if (window.google?.accounts?.id) resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google sign-in could not load. Check your connection and try again.'))
    document.head.appendChild(script)
  })
}

export function GoogleSignInButton({ intent, referralCode, mode, onStart, onAuthenticated, onError }: Props) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    if (Capacitor.isNativePlatform() || !clientId || !buttonRef.current) return
    let active = true
    let nonce = ''
    const initialize = async () => {
      try {
        const pair = await createNoncePair()
        nonce = pair.nonce
        await loadGoogleIdentityScript()
        if (!active || !buttonRef.current || !window.google?.accounts?.id) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          nonce: pair.hashedNonce,
          use_fedcm_for_prompt: true,
          callback: async (response) => {
            if (!active || !response.credential) return
            setBusy(true)
            onStart?.()
            try {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              })
              if (error) throw error
              const { error: metadataError } = await supabase.auth.updateUser({ data: { full_name: googleProfileName(response.credential), account_intent: intent, ...(referralCode ? { affiliate_code: referralCode } : {}) } })
              if (metadataError) throw metadataError
              onAuthenticated()
            } catch (error) {
              onError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.')
            } finally {
              setBusy(false)
            }
          },
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'rectangular',
          width: Math.min(buttonRef.current.clientWidth || 360, 400),
          logo_alignment: 'left',
        })
      } catch (error) {
        if (active) onError(error instanceof Error ? error.message : 'Google sign-in could not be initialized.')
      }
    }
    void initialize()
    return () => { active = false }
  }, [clientId, intent, referralCode, mode, onStart, onAuthenticated, onError])

  const handleNativeGoogleSignIn = async () => {
    if (!clientId) {
      onError('Google sign-in is not configured yet. Please try again later.')
      return
    }
    setBusy(true)
    try {
      if (!nativeGoogleInitialization) {
        nativeGoogleInitialization = SocialLogin.initialize({
          google: {
            webClientId: clientId,
            mode: 'online',
            skipAuthOnlyAuthorizationAfterSignIn: true,
          },
        }).catch((error) => {
          nativeGoogleInitialization = null
          throw error
        })
      }
      await nativeGoogleInitialization
      const { nonce, hashedNonce } = await createNoncePair()
      const result = await SocialLogin.login({
        provider: 'google',
        options: { nonce: hashedNonce },
      })
      onStart?.()
      if (result.provider !== 'google' || result.result.responseType !== 'online' || !result.result.idToken) {
        throw new Error('Google did not return a valid identity token. Please try another account.')
      }
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: result.result.idToken,
        nonce,
      })
      if (error) throw error
      const { error: metadataError } = await supabase.auth.updateUser({ data: { full_name: result.result.profile.name ?? '', account_intent: intent, ...(referralCode ? { affiliate_code: referralCode } : {}) } })
      if (metadataError) throw metadataError
      onAuthenticated()
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (Capacitor.isNativePlatform()) {
    return (
      <button
        type="button"
        onClick={handleNativeGoogleSignIn}
        disabled={busy || !clientId}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-card px-4 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.04 13.22l7.98 6.19C11.91 13.72 17.47 9.5 24 9.5Z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.25 5.47-4.73 7.16l7.28 5.65c4.25-3.92 7.52-9.71 7.52-17.28Z" />
          <path fill="#FBBC05" d="M10.02 28.59A14.4 14.4 0 0 1 9.25 24c0-1.59.27-3.12.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.58 10.78l7.44-6.19Z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-6.17l-7.28-5.65c-2.02 1.36-4.61 2.17-8.63 2.17-6.53 0-12.09-4.22-14.07-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
        </svg>
        {busy ? 'Connecting to Google…' : mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
      </button>
    )
  }

  if (!clientId) return null
  return (
    <div className={busy ? 'pointer-events-none opacity-60' : ''} aria-busy={busy}>
      <div ref={buttonRef} className="flex min-h-10 w-full justify-center" />
    </div>
  )
}
