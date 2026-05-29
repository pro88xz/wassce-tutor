import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/subscribe')({
  component: SubscribePage,
})

function SubscribePage() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    setBusy(true)
    setError(null)
    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      if (!token) throw new Error('Not signed in')
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ origin: window.location.origin }),
        },
      )
      const data = await res.json()
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || 'Failed to start checkout')
      }
      window.location.href = data.redirectUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center pt-8">
        <p>Sign in to subscribe.</p>
        <Link to="/auth"><Button>Sign in</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>

      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Subscribe</h1>
        <p className="text-sm text-muted-foreground">
          Full access for a year — every subject, paper, and lesson.
        </p>
      </header>

      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="font-bold">WASSCE Tutor — 1 year</span>
          <span>
            <span className="text-3xl font-black">75</span>{' '}
            <span className="text-sm text-muted-foreground">NLe</span>
          </span>
        </div>

        <ul className="space-y-2 text-sm">
          <li>✓ All subjects in your faculty</li>
          <li>✓ Past papers and practice quizzes</li>
          <li>✓ Step-by-step lessons with explanations</li>
          <li>✓ Progress tracking and history</li>
          <li>✓ Reading mode for night study</li>
        </ul>

        <div className="space-y-2 pt-2">
          <Button
            className="h-12 w-full text-base"
            onClick={handlePay}
            disabled={busy || !!profile?.subscription_active}
          >
            {busy ? 'Preparing checkout…' : 'Pay with Orange Money / AfriMoney'}
          </Button>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <p className="text-center text-xs text-muted-foreground">
            Secure payment via Monime. Test mode active.
          </p>
        </div>
      </div>

      {profile?.subscription_active && (
        <div className="rounded-xl bg-emerald-500/10 p-3 text-center text-sm text-emerald-700 dark:text-emerald-400">
          ✓ You already have an active subscription.
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Questions? Contact us at support@wasscetutor.app
      </p>
    </div>
  )
}
