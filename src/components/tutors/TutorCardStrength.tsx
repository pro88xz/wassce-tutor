// The card-strength meter on the tutor dashboard: how findable the tutor's
// page is, how it appears in Google, and what to add next.
import { Check, ExternalLink, Pencil } from 'lucide-react'
import type { Tutor } from '@/components/tutors/Marketplace'
import { cardStrength } from '@/lib/tutor-strength'
import { tutorPageDescription, tutorPagePath, tutorPageTitle } from '@/lib/tutor-profile'

const LEVEL = {
  weak: { label: 'Weak', bar: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300', body: 'Parents will struggle to find your page. Each tip below makes it easier.' },
  good: { label: 'Good', bar: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300', body: 'Your page can be found. A few more details will put it in front of more parents.' },
  strong: { label: 'Strong', bar: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', body: 'Your page gives Google and parents everything they need. Keep it up to date.' },
} as const

export function TutorCardStrength({ tutor }: { tutor: Tutor }) {
  const { score, level, checks } = cardStrength(tutor)
  const style = LEVEL[level]
  const todo = checks.filter((c) => !c.done)
  const done = checks.filter((c) => c.done)
  const page = tutor.slug ? tutorPagePath(tutor.slug) : null

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-7" aria-labelledby="strength-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Your page on Google</p>
          <h2 id="strength-heading" className="mt-1 text-xl font-bold">
            Card strength: <span className={style.text}>{style.label}</span>
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{style.body}</p>
        </div>
        <p className="text-3xl font-extrabold tabular-nums" aria-label={`${score} out of 100`}>
          {score}
          <span className="text-base font-semibold text-muted-foreground">/100</span>
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className={`h-full rounded-full transition-all duration-500 ${style.bar}`} style={{ width: `${Math.max(6, score)}%` }} />
      </div>

      {/* How the page shows in Google search results. */}
      {page && (
        <div className="mt-6 rounded-xl border bg-background p-4">
          <p className="truncate text-[13px] text-muted-foreground">wasscetutor.com › tutors › {tutor.slug}</p>
          <p className="mt-0.5 line-clamp-1 text-[18px] font-medium text-[#1a0dab] dark:text-[#8ab4f8]">{tutorPageTitle(tutor)}</p>
          <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-muted-foreground">{tutorPageDescription(tutor)}</p>
        </div>
      )}

      {todo.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold">To do next</h3>
          <ul className="mt-2 space-y-2">
            {todo.map((c) => (
              <li key={c.key} className="rounded-xl bg-muted/50 p-3">
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{c.tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {done.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Already done">
          {done.map((c) => (
            <li key={c.key} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
              <Check className="h-3.5 w-3.5" aria-hidden /> {c.label}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <a href="#card" className="site-btn site-btn-primary">
          <Pencil className="h-4 w-4" aria-hidden /> Improve my card
        </a>
        {page && (
          <a href={page} className="site-btn site-btn-secondary">
            See my page <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </section>
  )
}
