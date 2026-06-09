import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { BottomNav } from '@/components/BottomNav'
import { Footer } from '@/components/Footer'

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
