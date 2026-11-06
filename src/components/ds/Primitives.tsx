// Shared layout and text primitives (Design System Blueprint, sections 04-06).
// Every screen composes these instead of inventing local variants, so cards,
// headings, metrics and empty states look the same everywhere.
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

/** Card surface: white, 16 px radius, subtle border; borders first, shadows second. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card ${className}`}>{children}</div>
}

/** Screen header: optional back link, short eyebrow, one H1, supporting line, right-side slot. */
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
        <a href={back.href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {back.label}
        </a>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          {eyebrow && <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>}
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">{title}</h1>
          {subtitle && <p className="text-[15px] text-muted-foreground">{subtitle}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </header>
  )
}

/** Section heading with an optional secondary link. */
export function SectionHeader({ title, action }: { title: ReactNode; action?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {action && (
        <Link to={action.to} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  )
}

/**
 * A labelled group on account and settings screens: title, short explanation,
 * content, and an optional trailing action. One pattern for every section.
 */
export function SectionCard({
  title,
  description,
  action,
  children,
  id,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  children?: ReactNode
  id?: string
}) {
  return (
    <section id={id} className="rounded-2xl border bg-card">
      <div className="flex items-start justify-between gap-3 p-5 pb-0">
        <div className="min-w-0 space-y-1">
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

/** A metric with its name, value and what it means (never a bare number). */
export function MetricCard({ label, value, context, icon }: { label: string; value: ReactNode; context?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {context && <p className="mt-0.5 text-xs text-muted-foreground">{context}</p>}
    </div>
  )
}

/** Kept for existing screens: a metric tile. */
export function StatTile({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return <MetricCard label={label} value={value} context={hint} icon={icon} />
}

/** Helpful empty state: title, explanation, one primary action. */
export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <Card className="p-6 text-center">
      {icon && <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-primary">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  )
}

/** Compact semantic label. Keep badges for status and classification, not every piece of metadata. */
export function Pill({ children, className = 'bg-muted text-muted-foreground' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}

/**
 * Score badge. 70%+ is marked as a strong result; lower scores stay neutral:
 * the blueprint reserves red for errors, never for an ordinary low score.
 */
export function ScorePill({ score, total }: { score: number; total: number }) {
  const p = total > 0 ? score / total : 0
  const tone = p >= 0.7 ? 'bg-success/10 text-success' : p >= 0.5 ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
  return <Pill className={`${tone} tabular-nums`}>{score}/{total}</Pill>
}

/** Skeleton block matching the final content's shape (no layout jump). */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />
}
