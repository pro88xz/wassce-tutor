import { Link } from '@tanstack/react-router'
import { SITE } from '@/lib/seo'

// Shown by the catch-all route (src/routes/$.tsx) for unknown URLs, and by the
// root route's notFoundComponent for programmatic notFound() calls.
// Vercel serves those URLs dist/client/404.html with a real 404 status.
export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 pt-12 pb-12 text-center">
      <title>{`Page not found | ${SITE.name}`}</title>
      <meta name="robots" content="noindex" />
      <p className="text-xs uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="text-4xl font-black tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">
        We couldn&rsquo;t find that page. It may have moved, or the link may be wrong.
      </p>
      <Link
        to="/"
        className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground"
      >
        Go to the homepage
      </Link>
    </div>
  )
}
