import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { FROM_PRICE } from '@/lib/plans'

// Call to action on public pages. Logged-out visitors (and the prerendered
// HTML) get the free-account sign-up; signed-in students get a link into the app.
// A calm brand-soft panel: the blueprint keeps gradients for the homepage hero.
// Copy on the left, the one action on the right from desktop width.
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
    <section className="rounded-3xl bg-brand-soft px-6 py-8 sm:px-10 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <div>
          <h2 className="site-h2 text-[1.5rem] text-brand-deep sm:text-[1.875rem]">{heading}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-strong sm:text-base">{body}</p>
          {!user && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-medium text-brand-strong">
              {['Every lesson free', 'Progress saved on a free account', `Study tutor and mock exams from ${FROM_PRICE} NLe`].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CircleCheck className="h-4 w-4 shrink-0" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        {user ? (
          <a href={appHref ?? '/subjects'} className="site-btn site-btn-lg site-btn-primary">
            Open in WASSCE Tutor <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        ) : (
          <Link to="/auth" className="site-btn site-btn-lg site-btn-primary">
            Start free <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </section>
  )
}
