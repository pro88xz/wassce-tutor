// Layout and text primitives for the app's screens, so every page shares the
// same header, section, card and empty-state treatment.
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

/** Card surface: soft border, subtle shadow, generous radius. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border bg-card shadow-sm shadow-black/[0.03] ${className}`}>{children}</div>
}

/** Screen header: optional back link, small eyebrow, big title, supporting line and right-side slot. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  back,
  aside,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  back?: { href: string; label: string }
  aside?: ReactNode
}) {
  return (
    <header className="space-y-3">
      {back && (
        <a href={back.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {back.label}
        </a>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</p>}
          <h1 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </header>
  )
}

/** Section heading with an optional "See all" style link. */
export function SectionHeader({ title, action }: { title: ReactNode; action?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {action && (
        <Link to={action.to} className="text-sm font-semibold text-primary hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  )
}

/** Big number with a small label. */
export function StatTile({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1.5 text-2xl font-black tabular-nums">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

/** Friendly empty state with an optional call to action. */
export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <Card className="p-8 text-center">
      {icon && <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>}
      <p className="font-bold">{title}</p>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  )
}

/** Small rounded label. */
export function Pill({ children, className = 'bg-muted text-muted-foreground' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}

/** Score badge coloured by result: 70%+ green, 50%+ amber, below red. */
export function ScorePill({ score, total }: { score: number; total: number }) {
  const p = total > 0 ? score / total : 0
  const tone =
    p >= 0.7
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : p >= 0.5
        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : 'bg-red-500/10 text-red-700 dark:text-red-400'
  return <Pill className={tone}>{score}/{total}</Pill>
}

/** Skeleton block for loading states. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted ${className}`} />
}
