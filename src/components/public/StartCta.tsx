import { Link } from '@tanstack/react-router'
import { CircleCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'

// Call to action on public pages. Logged-out visitors (and the prerendered
// HTML) get the free-trial sign-up; signed-in students get a link into the app.
// `gradient` is a subject palette gradient (from-… to-…); defaults to the brand.
export function StartCta({
  heading,
  body,
  appHref,
  gradient = 'from-blue-600 via-violet-700 to-fuchsia-700',
}: {
  heading: string
  body: string
  appHref?: string
  gradient?: string
}) {
  const { user } = useAuth()
  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="relative space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-balance">{heading}</h2>
        <p className="text-white/85">{body}</p>
        {user ? (
          <a href={appHref ?? '/subjects'} className="inline-flex h-12 items-center rounded-xl bg-white px-6 font-bold text-slate-900 shadow-md">
            Open in WASSCE Tutor
          </a>
        ) : (
          <div className="space-y-3 pt-1">
            <Link to="/auth" className="inline-flex h-12 items-center rounded-xl bg-white px-6 font-bold text-slate-900 shadow-md transition hover:shadow-lg">
              Start free for 7 days
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/85">
              {['No card needed', 'Orange Money & AfriMoney', 'Cancel anytime'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1">
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
