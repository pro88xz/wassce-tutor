import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { CircleCheck, Lock } from 'lucide-react'

export function AccessGate({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile(user?.id ?? null)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" aria-busy="true">
        <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        <div className="h-20 animate-pulse rounded-3xl bg-muted" />
        <div className="h-20 animate-pulse rounded-3xl bg-muted" />
      </div>
    )
  }

  const access = checkAccess(profile)

  if (access.hasAccess) return <>{children}</>

  // Detect whether this was an expired subscription or just trial-only
  const hadSubscription = profile?.subscription_expires_at != null
  const headline = hadSubscription ? 'Your subscription has ended' : 'Your free trial has ended'
  const subtext = hadSubscription
    ? "Thanks for being a subscriber. Renew to keep your full access — every subject, every paper, your AI tutor."
    : "You've seen what's here. Pick a plan that fits and keep going — your progress, every subject, every paper, your AI tutor."

  // Locked screen
  return (
    <div className="mx-auto max-w-md space-y-6 pt-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20">
        <Lock className="h-7 w-7" aria-hidden />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-balance">{headline}</h1>
        <p className="text-muted-foreground">{subtext}</p>
      </div>
      <ul className="space-y-2 rounded-3xl border bg-card p-4 text-left text-sm">
        {['Every subject and lesson', 'Past papers scored instantly', 'Your AI tutor', 'Your progress, kept safe'].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden /> {t}
          </li>
        ))}
      </ul>
      <div className="space-y-3">
        <Link
          to="/subscribe"
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-base font-bold text-white shadow-md transition hover:shadow-lg"
        >
          See plans · from 25 NLe / month
        </Link>
        <Link to="/" className="inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
