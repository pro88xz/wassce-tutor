// Router factory used by TanStack Start on the server (prerendering) and in the browser.
// Replaces the old src/main.tsx: the providers that used to wrap <RouterProvider>
// are applied through the router's `Wrap` option instead.
import { createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { AuthProvider } from '@/lib/auth'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 min: data stays fresh, no refetch on remount
        // 10 min in the browser: data stays in cache after unmount. On the
        // server (build-time prerendering) keep React Query's default of no
        // garbage-collection timers, which would keep the build alive for 10 min.
        gcTime: typeof window === 'undefined' ? Infinity : 10 * 60 * 1000,
        refetchOnWindowFocus: false, // don't refetch every time user comes back
        retry: 1, // one retry on error, not 3 — faster failure
      },
    },
  })

  const router = createRouter({
    routeTree,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    ),
  })

  // Android hardware back button: navigate within app, or exit at root.
  if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
    CapApp.addListener('backButton', () => {
      if (window.history.length > 1) {
        router.history.back()
      } else {
        CapApp.exitApp()
      }
    })
  }

  return router
}
