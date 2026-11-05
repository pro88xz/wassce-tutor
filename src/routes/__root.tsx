import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { BottomNav } from '@/components/BottomNav'
import { Footer } from '@/components/Footer'
import { SITE } from '@/lib/seo'

// Only load devtools in development — never in production.
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function GlobalLoadingBar() {
  const fetching = useIsFetching()
  if (!fetching) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-primary/20 overflow-hidden" style={{ marginTop: 'env(safe-area-inset-top)' }}>
      <div className="h-full w-1/3 bg-primary animate-[loadingbar_1s_ease-in-out_infinite]" />
    </div>
  )
}

function RootComponent() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Per-route <title>, meta and canonical (route `head` options, see src/lib/seo.ts).
          React hoists these elements into <head>. */}
      <HeadContent />
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="px-6 pt-6 pb-32">
          <Outlet />
          <Footer />
        </div>
      </main>
      <GlobalLoadingBar />
      <BottomNav />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
    </div>
  )
}

function NotFound() {
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
