import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { campaignMetadata } from '@/lib/attribution'
import { useAuth } from '@/lib/auth'
import { Capacitor } from '@capacitor/core'
import { CircleCheck } from 'lucide-react'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { BrandMark } from '@/components/BrandMark'
import { FROM_PRICE } from '@/lib/plans'
import { MIN_PASSWORD_LENGTH } from '@/lib/password'

export const Route = createFileRoute('/auth')({
  head: privateHead('Sign in'),
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const intent = params.get('intent') === 'tutor' ? 'tutor' : params.get('intent') === 'affiliate' ? 'affiliate' : 'student'
  const requestedNext = params.get('next') ?? ''
  const referralCode = params.get('ref')?.trim().toUpperCase() ?? ''
  // Only same-site paths we know, so ?next= cannot send people elsewhere.
  const safeNext = ['/onboarding','/subjects','/practice','/progress','/account','/','/tutors'].includes(requestedNext) || /^\/tutors\/[a-z0-9-]+$/.test(requestedNext)
  const destination = intent === 'tutor' ? '/tutor-dashboard' : intent === 'affiliate' ? '/affiliate-dashboard' : safeNext ? requestedNext : '/'
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup')
  const [resetSent, setResetSent] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate({ to: destination as '/' | '/tutor-dashboard' | '/affiliate-dashboard' | '/onboarding' | '/subjects' | '/practice' | '/progress' | '/account' })
  }, [user, destination, navigate])

  const handleSubmit = async () => {
    const referralCode = params.get('ref')?.trim().toUpperCase() ?? ''
    setError(null)
    setLoading(true)
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setResetSent(true)
      } else if (mode === 'signup') {
        if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?intent=${intent}${referralCode ? `&ref=${encodeURIComponent(referralCode)}` : ''}`,
            data: { full_name: fullName.trim(), account_intent: intent, ...campaignMetadata(), ...(referralCode ? { affiliate_code: referralCode } : {}) },
          },
        })
        if (error) throw error
        if (data.session) navigate({ to: destination as '/tutor-dashboard' | '/affiliate-dashboard' | '/' })
        else setConfirmationSent(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (referralCode) {
          const { error: referralError } = await supabase.rpc('claim_affiliate_referral', { p_code: referralCode })
          if (referralError && !/already|before first payment/i.test(referralError.message)) throw referralError
        }
        navigate({ to: destination as '/tutor-dashboard' | '/affiliate-dashboard' | '/' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuthenticated = useCallback(async () => {
    try {
      if (referralCode) {
        const { error: referralError } = await supabase.rpc('claim_affiliate_referral', { p_code: referralCode })
        if (referralError && !/already|before first payment/i.test(referralError.message)) throw referralError
      }
      navigate({ to: destination as '/tutor-dashboard' | '/affiliate-dashboard' | '/' | '/onboarding' | '/subjects' | '/practice' | '/progress' | '/account' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your account was created, but the referral could not be applied.')
    }
  }, [destination, navigate, referralCode])

  const switchMode = (next: 'signin' | 'signup' | 'forgot') => {
    setMode(next)
    setError(null)
    setResetSent(false)
    setConfirmationSent(false)
  }
  const field = 'h-12 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
  const story = STORY[intent]
  // Google sign-in needs a client id on the web; without one there is nothing to offer.
  const googleAvailable = Capacitor.isNativePlatform() || !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    // Full-bleed: cancels the app wrapper's padding so the two panels meet the screen edges.
    <div className="site-bleed -mb-12 -mt-4 grid min-h-dvh sm:-mt-6 lg:grid-cols-2">
      {/* What you are signing up for. Wide screens only: on a phone the form comes first. */}
      <aside className="site-band-ink relative isolate hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div aria-hidden className="site-hero-backdrop -z-10" />
        <a href="/" aria-label="WASSCE Tutor home" className="w-fit">
          <BrandMark tone="light" />
        </a>
        <div className="max-w-lg py-10">
          <p className="site-eyebrow">{story.eyebrow}</p>
          <h2 className="site-h2 mt-3">{story.title}</h2>
          <ul className="mt-8 space-y-4">
            {story.points.map((t) => (
              <li key={t} className="flex gap-3 text-[17px] leading-snug text-white/85">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/55">An independent study service built in Freetown. Not affiliated with WAEC.</p>
      </aside>

      <div className="flex flex-col px-5 pb-10 pt-6 sm:px-8 lg:justify-center lg:py-12">
        <a href="/" aria-label="WASSCE Tutor home" className="mb-8 w-fit lg:hidden">
          <BrandMark />
        </a>
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {mode === 'signup' ? (intent === 'tutor' ? 'Create your tutor account' : intent === 'affiliate' ? 'Create your affiliate account' : 'Create your free account') : mode === 'forgot' ? 'Reset your password' : 'Welcome back'}
            </h1>
            <p className="text-[15px] text-muted-foreground">
              {mode === 'signup'
                ? intent === 'tutor' ? 'Create your account and continue to your tutor workspace.' : intent === 'affiliate' ? 'Create your account and continue to your affiliate workspace.' : `Free to start, no card needed. Unlock everything later from ${FROM_PRICE} NLe.`
                : mode === 'forgot'
                  ? "Enter your email and we'll send you a reset link."
                  : intent === 'tutor' ? 'Sign in to continue to your tutor workspace.' : intent === 'affiliate' ? 'Sign in to continue to your affiliate workspace.' : 'Sign in to keep studying.'}
            </p>
          </div>

          {mode !== 'forgot' && (
            <div role="tablist" aria-label="Account" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              {(['signup', 'signin'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => switchMode(m)}
                  className={`min-h-11 rounded-lg text-sm font-semibold transition ${mode === m ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {m === 'signup' ? 'Sign up' : 'Sign in'}
                </button>
              ))}
            </div>
          )}

          {mode !== 'forgot' && googleAvailable && (
            <div className="space-y-4">
              <GoogleSignInButton
                intent={intent}
                referralCode={referralCode}
                mode={mode}
                onAuthenticated={handleGoogleAuthenticated}
                onError={setError}
              />
              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or use your email</span>
                <span className="h-px flex-1 bg-border" />
              </div>
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            {mode === 'signup' && (
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold">Full name</span>
                <input className={field} autoComplete="name" placeholder="e.g. Fatmata Sesay" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>
            )}
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">Email</span>
              <input className={field} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {mode !== 'forgot' && (
              <label className="block space-y-1.5">
                <span className="flex items-center justify-between text-sm font-semibold">
                  Password
                  {mode === 'signin' && (
                    <button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => switchMode('forgot')}>
                      Forgot password?
                    </button>
                  )}
                </span>
                <input
                  className={field}
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder={mode === 'signup' ? `At least ${MIN_PASSWORD_LENGTH} characters` : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            )}

            {error && <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
            {confirmationSent && (
              <p role="status" className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                Account created. Check your email to verify your address. After verification, you will be taken to your {intent === 'tutor' ? 'tutor' : intent === 'affiliate' ? 'affiliate' : 'student'} workspace.
              </p>
            )}
            {resetSent && (
              <p role="status" className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                Check your email for a password reset link.
              </p>
            )}

            <button type="submit" disabled={loading} className="site-btn site-btn-primary site-btn-lg w-full disabled:opacity-60">
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create my free account' : mode === 'forgot' ? 'Send reset link' : 'Sign in'}
            </button>
          </form>

          {/* On a phone the benefits sit under the form; on wide screens they are in the panel beside it. */}
          {mode === 'signup' && (
            <ul className="space-y-2 rounded-2xl border bg-card p-4 text-sm lg:hidden">
              {story.points.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          )}

          {mode === 'forgot' && (
            <p className="text-center text-sm">
              <button type="button" className="font-semibold text-primary hover:underline" onClick={() => switchMode('signin')}>
                ← Back to sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/** What each kind of account is for: shown beside the form on wide screens, under it on phones. */
const STORY: Record<'student' | 'tutor' | 'affiliate', { eyebrow: string; title: string; points: string[] }> = {
  student: {
    eyebrow: 'For WASSCE students',
    title: 'Your next grade starts with one topic.',
    points: ['Every subject, topic by topic', 'Exam-style practice, marked instantly', 'An AI tutor whenever you need help', 'Pay later with Orange Money or AfriMoney'],
  },
  tutor: {
    eyebrow: 'For tutors',
    title: 'Teach WASSCE students across Sierra Leone.',
    points: ['Create your tutor profile', 'List your subjects and your rates', 'Manage verified bookings in one workspace'],
  },
  affiliate: {
    eyebrow: 'For affiliates',
    title: 'Earn when students you refer subscribe.',
    points: ['Share your own tracked referral link', 'Earn 50% of a referred student’s first verified subscription payment', 'Follow your referrals in one workspace'],
  },
}
