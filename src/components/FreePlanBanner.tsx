import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAccess } from '@/lib/useAccess'
import { FROM_PRICE } from '@/lib/plans'

/**
 * A slim note for free accounts: what is open, and the way to the rest.
 * Shows nothing with a plan (or a running trial), or before the profile loads.
 */
export function FreePlanBanner({ what = 'The first lesson of every topic and a starter practice set in every subject are free.' }: { what?: string }) {
  const { access, loading, profile } = useAccess()
  if (loading || !profile || access.hasAccess) return null
  return (
    <Link
      to="/subscribe"
      search={{ plan: 'year' }}
      className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-brand-soft/60 p-3.5 transition-colors hover:border-primary/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-sm">
        <span className="block font-semibold">{profile.subscription_expires_at ? 'Your plan has ended' : 'You are on the free account'}</span>
        <span className="block text-muted-foreground">{what} Unlock everything from {FROM_PRICE} NLe.</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
