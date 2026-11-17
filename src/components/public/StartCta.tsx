import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { FROM_PRICE } from '@/lib/plans'

// Call to action on public pages. Logged-out visitors (and the prerendered
// HTML) get the free-account sign-up; signed-in students get a link into the app.
// tone="soft" (the default) is a calm brand-soft panel; tone="brand" is the
// violet .site-brand-panel with white type, for pages that need the call to
// action to stand out (topic pages). Copy on the left, the one action on the
// right from desktop width.
export function StartCta({
  heading,
  body,
  appHref,
  tone = 'soft',
}: {
  heading: string
  body: string
  appHref?: string
  tone?: 'soft' | 'brand'
  /** @deprecated ignored; kept so existing call sites compile */
  gradient?: string
}) {
  const { user } = useAuth()
  const brand = tone === 'brand'
  return (
    <section className={`relative isolate overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10 ${brand ? 'site-brand-panel' : 'bg-brand-soft'}`}>
      {brand && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(90deg,transparent,#000_70%)]"
        />
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <div>
          <h2 className={`site-h2 text-[1.5rem] sm:text-[1.875rem] ${brand ? 'text-white' : 'text-brand-deep'}`}>{heading}</h2>
          <p className={`mt-3 max-w-2xl text-[15px] leading-relaxed sm:text-base ${brand ? 'text-white/80' : 'text-brand-strong'}`}>{body}</p>
          {!user && (
            <ul className={`mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-medium ${brand ? 'text-white/90' : 'text-brand-strong'}`}>
              {['Every lesson free', 'Progress saved on a free account', `Study tutor and mock exams from ${FROM_PRICE} NLe`].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CircleCheck className="h-4 w-4 shrink-0" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        {user ? (
          <a href={appHref ?? '/subjects'} className={`site-btn site-btn-lg ${brand ? 'site-btn-light' : 'site-btn-primary'}`}>
            Open in WASSCE Tutor <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        ) : (
          <Link to="/auth" className={`site-btn site-btn-lg ${brand ? 'site-btn-light' : 'site-btn-primary'}`}>
            Start free <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
    </section>
  )
}
