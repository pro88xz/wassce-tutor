import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
import { AuthProvider } from '@/lib/auth'
import { routeTree } from './routeTree.gen'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import './index.css'
import './native.css'
import { applyTheme, getTheme } from '@/lib/theme'
applyTheme(getTheme())

const router = createRouter({ routeTree })

// Android hardware back button: navigate within app, or exit at root.
if (Capacitor.isNativePlatform()) {
  CapApp.addListener('backButton', () => {
    if (window.history.length > 1) {
      router.history.back()
    } else {
      CapApp.exitApp()
    }
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min: data stays fresh, no refetch on remount
      gcTime: 10 * 60 * 1000,    // 10 min: data stays in cache after unmount
      refetchOnWindowFocus: false, // don't refetch every time user comes back
      retry: 1, // one retry on error, not 3 — faster failure
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Suspense fallback={null}><ReactQueryDevtools initialIsOpen={false} /></Suspense>
    </QueryClientProvider>
  </StrictMode>,
)
