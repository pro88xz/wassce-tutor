import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { KeyRound } from 'lucide-react'

export const Route = createFileRoute('/reset-password')({
  head: privateHead('Reset password'),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  // When the user arrives from the email link, Supabase sets a temporary session
  // automatically. We wait for that session to be present before allowing reset.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })
    // Also check immediately in case the event already fired
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async () => {
    setError(null)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const field = 'h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-1 py-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-3 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <KeyRound className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Pick something you&rsquo;ll remember this time.</p>
        </div>

        {!ready ? (
          <p className="rounded-2xl bg-muted/60 p-4 text-center text-sm text-muted-foreground">
            Checking your reset link… If nothing happens after a few seconds, the link may have expired.
          </p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">New password</span>
              <input className={field} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">Confirm new password</span>
              <input className={field} type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>
            {error && <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
