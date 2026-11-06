import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { useAccess } from '@/lib/useAccess'
import { FREE_FEATURES, PLANS } from '@/lib/plans'

type Kind = 'lesson' | 'practice' | 'tutor'

const COPY: Record<Kind, { title: (name?: string) => string; body: string }> = {
  lesson: {
    title: (name) => (name ? `Unlock “${name}”` : 'Unlock this lesson'),
    body: 'Your free account opens the first lesson of every topic. A plan opens every lesson in every subject.',
  },
  practice: {
    title: (name) => (name ? `Unlock “${name}”` : 'Unlock this practice set'),
    body: 'Your free account includes a starter practice set in every subject. A plan opens every set, with the full working.',
  },
  tutor: {
    title: () => 'The AI tutor comes with a plan',
    body: 'Ask any WASSCE question and get a clear, step-by-step answer, up to 20 questions a day.',
  },
}

/**
 * What a student sees on something their account does not open: what it is,
 * what they already have for free, and the two plans.
 */
export function LockedPanel({ kind, name, back }: { kind: Kind; name?: string; back?: ReactNode }) {
  const { profile } = useAccess()
  const ended = profile?.subscription_expires_at != null
  const copy = COPY[kind]
  return (
    <div className="mx-auto max-w-lg space-y-6 pt-4">
      {back}
      <div className="overflow-hidden rounded-3xl border bg-card shadow-[0_24px_48px_-28px_rgba(76,29,149,0.45)]">
        <div className="space-y-3 bg-gradient-to-br from-primary to-brand-strong p-6 text-white sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Lock className="h-6 w-6" aria-hidden />
          </span>
          {ended && <p className="text-sm font-semibold text-white/80">Your plan has ended</p>}
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance sm:text-[1.75rem]">{copy.title(name)}</h1>
          <p className="text-[15px] text-white/85">{copy.body}</p>
        </div>
        <div className="space-y-5 p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-3">
            {PLANS.map((p) => (
              <Link
                key={p.id}
                to="/subscribe"
                search={{ plan: p.id }}
                className={`relative rounded-2xl p-4 transition-shadow hover:shadow-md ${p.best ? 'border-2 border-primary bg-brand-soft/60' : 'border bg-card'}`}
              >
                {p.best && <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">Best value</span>}
                <span className="block text-sm font-semibold text-muted-foreground">{p.name}</span>
                <span className="mt-1 block text-2xl font-bold tracking-tight tabular-nums">
                  {p.priceNle} <span className="text-sm font-semibold text-muted-foreground">NLe</span>
                </span>
                <span className="block text-xs text-muted-foreground">{p.length}</span>
              </Link>
            ))}
          </div>
          <Link
            to="/subscribe"
            search={{ plan: 'year' }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-center text-base font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-brand-strong"
          >
            {ended ? 'Renew my plan' : 'See plans'} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-semibold">Still free on your account</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Shows children with a plan (or a running trial), the locked panel otherwise. */
export function AccessGate({ children, kind, name }: { children: ReactNode; kind: Kind; name?: string }) {
  const { access, loading } = useAccess()
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" aria-busy="true">
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }
  return access.hasAccess ? <>{children}</> : <LockedPanel kind={kind} name={name} />
}
