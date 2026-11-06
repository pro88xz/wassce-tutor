import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { BottomNav } from '@/components/BottomNav'
import { SideNav } from '@/components/shell/SideNav'
import { TopBar } from '@/components/shell/TopBar'
import { useAuth } from '@/lib/auth'
import { showsStudentNav } from '@/lib/nav'
import { Footer } from '@/components/Footer'
import { NotFoundPage } from '@/components/NotFoundPage'
import { PublicHeader } from '@/components/public/PublicHeader'
import { SITE } from '@/lib/seo'
import appCss from '@/index.css?url'
import nativeCss from '@/native.css?url'

// Only load devtools in development — never in production.
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )
const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))

// Runs before first paint, before the app's JavaScript loads:
//  - applies the saved reading theme (no light→sepia flash)
//  - marks the Android app ("native-app") and returning signed-in visitors
//    ("app-boot", a stored Supabase session) so CSS shows a spinner instead of
//    the prerendered marketing page while the session is restored.
//    AuthProvider removes "app-boot" once the session check finishes.
const BOOT_SCRIPT = `(function(){try{var d=document.documentElement;
if(localStorage.getItem('wassce_theme')==='sepia')d.classList.add('dark');
var C=window.Capacitor;if(C&&C.isNativePlatform&&C.isNativePlatform())d.classList.add('native-app');
for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&/^sb-.+-auth-token$/.test(k)){d.classList.add('app-boot');break}}
}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    // Site-wide tags. Each route adds its own title, description, robots and
    // canonical (see src/lib/seo.ts); a route's tag wins over the same tag here.
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'google-site-verification', content: 'S8kJyYT-6kCzOytVerViOFKhPDPleWCwfltAxOG1DM4' },
      { name: 'theme-color', content: '#6438d8' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:locale', content: 'en_SL' },
      { property: 'og:image', content: `${SITE.origin}/og-image.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:image:alt',
        content: 'WASSCE Tutor: Pass WASSCE with confidence. Lessons, practice questions and tutors, built in Sierra Leone.',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: `${SITE.origin}/og-image.jpg` },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: nativeCss },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon-512.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    ],
    scripts: [{ children: BOOT_SCRIPT }],
  }),
  // The root must render on the server for any child route to (Start's
  // defaultSsr: false would otherwise apply here too). Children stay
  // client-only unless they set `ssr: true` themselves.
  ssr: true,
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    // The boot script adds classes to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function GlobalLoadingBar() {
  const fetching = useIsFetching()
  if (!fetching) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] mt-[env(safe-area-inset-top)] h-0.5 overflow-hidden bg-primary/20">
      <div className="h-full w-1/3 bg-primary animate-[loadingbar_1s_ease-in-out_infinite]" />
    </div>
  )
}

function RootComponent() {
  const { user } = useAuth()
  const pathname = useRouterState({ select: (st) => st.location.pathname })
  const studentNav = !!user && showsStudentNav(pathname)
  return (
    <div className="app-frame flex bg-background text-foreground">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main" className="flex-1 overflow-y-auto pt-[env(safe-area-inset-top)]">
          <TopBar />
          {/* Bottom padding clears the fixed mobile navigation bar when it is shown. */}
          <div className={`px-4 pt-4 sm:px-6 sm:pt-6 ${studentNav ? 'pb-28 lg:pb-12' : 'pb-12'}`}>
            <PublicHeader />
            <Outlet />
            <Footer />
          </div>
        </main>
      </div>
      <GlobalLoadingBar />
      <BottomNav />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </div>
  )
}
