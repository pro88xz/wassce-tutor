// The header of a subject or topic page: what it is, how much of it there is,
// and the first action, on the same ink surface as the homepage hero. One
// component, so a subject and its topics open the same way.
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
    <header className="site-band-ink relative isolate overflow-hidden rounded-3xl">
      <div aria-hidden className="site-hero-backdrop" />
      <div className="relative grid gap-6 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:items-center lg:gap-12 lg:p-11">
        <div className="min-w-0 px-1 pb-1 sm:p-0">
          <p className="site-eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-[1.08] text-balance sm:text-[2.75rem] lg:text-5xl">{title}</h1>
          {lede && <p className="mt-4 max-w-xl text-base leading-relaxed text-white/72 sm:text-[17px]">{lede}</p>}
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-9">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse gap-0.5">
                <dt className="text-xs font-medium text-white/60">{label}</dt>
                <dd className="text-[1.375rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[1.75rem]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
          {note && <p className="mt-4 text-sm leading-relaxed text-white/65">{note}</p>}
        </div>
        <div className="order-first lg:order-none">{media}</div>
      </div>
    </header>
  )
}
