import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/reset-password')({
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">
            Pick something you'll remember this time.
          </p>
        </div>

        {!ready ? (
          <p className="text-center text-sm text-muted-foreground">
            Verifying reset link… If nothing happens after a few seconds, the link may have expired.
          </p>
        ) : (
          <div className="space-y-3">
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving…' : 'Update password'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
