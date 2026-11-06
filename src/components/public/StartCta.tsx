import { Link } from '@tanstack/react-router'
import { CircleCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'

// Call to action on public pages. Logged-out visitors (and the prerendered
// HTML) get the free-trial sign-up; signed-in students get a link into the app.
// A calm brand-soft panel: the blueprint keeps gradients for the homepage hero.
export function StartCta({
  heading,
  body,
  appHref,
}: {
  heading: string
  body: string
  appHref?: string
  /** @deprecated ignored; kept so existing call sites compile */
  gradient?: string
}) {
  const { user } = useAuth()
  return (
    <section className="space-y-3 rounded-2xl bg-brand-soft p-6">
      <h2 className="text-xl font-bold tracking-tight text-balance text-brand-deep sm:text-2xl">{heading}</h2>
      <p className="text-[15px] text-brand-strong">{body}</p>
      {user ? (
        <a href={appHref ?? '/subjects'} className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
          Open in WASSCE Tutor
        </a>
      ) : (
        <div className="space-y-3 pt-1">
          <Link to="/auth" className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
            Start free for 7 days
          </Link>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-strong">
            {['No card needed', 'Orange Money & AfriMoney', 'No automatic renewal'].map((t) => (
              <li key={t} className="inline-flex items-center gap-1">
                <CircleCheck className="h-4 w-4" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
