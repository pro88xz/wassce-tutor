import { Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'

// Call to action on public pages. Logged-out visitors (and the prerendered
// HTML) get the free-trial sign-up; signed-in students get a link into the app.
export function StartCta({ heading, body, appHref }: { heading: string; body: string; appHref?: string }) {
  const { user } = useAuth()
  return (
    <section className="rounded-2xl border bg-primary/5 p-6 space-y-3">
      <h2 className="text-xl font-bold">{heading}</h2>
      <p className="text-muted-foreground">{body}</p>
      {user ? (
        <a
          href={appHref ?? '/subjects'}
          className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground"
        >
          Open in WASSCE Tutor
        </a>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/auth"
            className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground"
          >
            Start free for 7 days
          </Link>
          <span className="text-xs text-muted-foreground">No card needed. Pay with Orange Money or AfriMoney.</span>
        </div>
      )}
    </section>
  )
}
