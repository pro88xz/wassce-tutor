// The header of a subject or topic page: what it is, how much of it there is,
// and the first action, in the homepage's light style: a white panel, the
// photograph on the violet brand slab. One component, so a subject and its
// topics open the same way.
import type { ReactNode } from 'react'

export type HeroStat = { value: string; label: string }

export function CourseHero({
  eyebrow,
  title,
  lede,
  stats,
  actions,
  note,
  media,
}: {
  eyebrow: ReactNode
  title: ReactNode
  lede?: ReactNode
  stats: HeroStat[]
  actions: ReactNode
  /** One quiet line under the actions */
  note?: ReactNode
  /** The photograph: a short banner on phones, the right-hand column from desktop width */
  media: ReactNode
}) {
  return (
    <header className="relative isolate overflow-hidden rounded-3xl border bg-[var(--card)] shadow-[0_1px_2px_rgba(23,28,43,.04),0_24px_48px_-32px_rgba(30,20,80,.3)]">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(42rem_26rem_at_100%_0%,color-mix(in_srgb,var(--primary)_13%,transparent),transparent_70%),radial-gradient(30rem_20rem_at_0%_100%,rgba(255,209,102,.14),transparent_70%)]" />
      <div className="relative grid gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:items-center lg:gap-12 lg:p-11">
        <div className="min-w-0 px-1 pb-1 sm:p-0">
          <p className="site-eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-[1.08] tracking-[-.04em] text-balance text-foreground sm:text-[2.75rem] lg:text-5xl">{title}</h1>
          {lede && <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">{lede}</p>}
          <dl className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse gap-1 rounded-2xl bg-[var(--brand-soft)]/70 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="text-xl font-extrabold leading-none tracking-tight tabular-nums text-foreground sm:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
          {note && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{note}</p>}
        </div>
        {/* The photograph, framed as on the homepage. */}
        <div className="relative isolate order-first lg:order-none">
          {media}
        </div>
      </div>
    </header>
  )
}
