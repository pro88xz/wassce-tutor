import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CircleCheck, GraduationCap } from 'lucide-react'

export const Route = createFileRoute('/auth')({
  head: privateHead('Sign in'),
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup')
  const [resetSent, setResetSent] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
        navigate({ to: '/' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate({ to: '/' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next: 'signin' | 'signup' | 'forgot') => {
    setMode(next)
    setError(null)
    setResetSent(false)
  }
  const field = 'h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-1 py-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-3 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20">
            <GraduationCap className="h-7 w-7" aria-hidden />
          </span>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">
              {mode === 'signup' ? 'Create your free account' : mode === 'forgot' ? 'Reset your password' : 'Welcome back'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signup'
                ? '7 days free. No card needed.'
                : mode === 'forgot'
                  ? "Enter your email and we'll send you a reset link."
                  : 'Sign in to keep studying.'}
            </p>
          </div>
        </div>

        {mode !== 'forgot' && (
          <div role="tablist" aria-label="Account" className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
            {(['signup', 'signin'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={`rounded-xl py-2 text-sm font-semibold transition ${mode === m ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m === 'signup' ? 'Sign up' : 'Sign in'}
              </button>
            ))}
          </div>
        )}

        <form
          className="space-y-3"
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
                  <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => switchMode('forgot')}>
                    Forgot password?
                  </button>
                )}
              </span>
              <input
                className={field}
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
          {resetSent && (
            <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
              Check your email for a password reset link.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-base font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'signup' ? 'Start my free trial' : mode === 'forgot' ? 'Send reset link' : 'Sign in'}
          </button>
        </form>

        {mode === 'signup' && (
          <ul className="space-y-2 rounded-2xl border bg-card p-4 text-sm">
            {['Every subject, topic by topic', 'Past papers scored instantly', 'An AI tutor whenever you need help', 'Pay later with Orange Money or AfriMoney'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden /> {t}
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
  )
}
