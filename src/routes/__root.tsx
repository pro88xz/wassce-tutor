import { createRootRoute, HeadContent, Outlet, Scripts, useNavigate, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { BottomNav } from '@/components/BottomNav'
import { useHasBottomNav } from '@/components/use-has-bottom-nav'
import { ROLE_HOME, isStudentOnlyPath, useAccountRole } from '@/lib/account-role'
import { SideNav } from '@/components/shell/SideNav'
import { TopBar } from '@/components/shell/TopBar'
import { useAuth } from '@/lib/auth'
import { Footer } from '@/components/Footer'
import { NotFoundPage } from '@/components/NotFoundPage'
import { PublicHeader } from '@/components/public/PublicHeader'
import { WorkspaceBar } from '@/components/shell/WorkspaceBar'
import { useSendToSignIn } from '@/lib/use-send-to-sign-in'
import { needsAccount } from '@/lib/return-to'
import { hasStoredSession } from '@/lib/ads'
import { isStandalonePath } from '@/lib/standalone-pages'
import { monetagLoaded, monetagPathAllowed, useMonetag } from '@/lib/monetag'
import { SITE } from '@/lib/seo'
import { analyticsScript, GA_MEASUREMENT_ID } from '@/lib/analytics'
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
//  - drops invisible characters from the address (zero-width spaces, joiners,
//    direction marks, byte-order marks, soft hyphens), which some apps add
//    when a link is copied or shared, and reloads without them: otherwise
//    "/beampad" + an invisible space is a 404. Runs on 404.html too.
//  - lets the document itself scroll on pages outside the app frame
//    ("page-scroll", the paths in src/lib/standalone-pages.ts): native.css
//    stops the root scrolling because the app scrolls inside its frame
//  - applies the saved reading theme (no light→sepia flash)
//  - marks the Android app ("native-app") and returning signed-in visitors
//    ("app-boot", a stored Supabase session) so CSS shows a spinner instead of
//    the prerendered marketing page while the session is restored.
//    AuthProvider removes "app-boot" once the session check finishes.
// It must act only once per document. The router re-inserts head scripts when
// it renders a route in the browser, which runs this again; without the guard
// that second run put "app-boot" back for anyone signed in, and after signing
// out the landing page stayed hidden behind the spinner until a reload.
const BOOT_SCRIPT = `(function(){try{if(window.__wtBooted)return;window.__wtBooted=1;var d=document.documentElement;
var u=location.href,c=u.replace(/%E2%80%8[B-F]|%E2%81%A0|%EF%BB%BF|%C2%AD/gi,'');if(c!==u){location.replace(c);return}
if(/^\\/beampad(\\/|$)/.test(location.pathname))d.classList.add('page-scroll');
if(localStorage.getItem('wassce_theme')==='sepia')d.classList.add('dark');
var C=window.Capacitor,n=C&&C.isNativePlatform&&C.isNativePlatform(),s=0;if(n)d.classList.add('native-app');
for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&/^sb-.+-auth-token$/.test(k)){d.classList.add('app-boot');s=1;break}}
if(n||(s&&location.pathname==='/'))window.__wtAdsPaused=1;
}catch(e){}})();`

/** Bump when the icon files change, so returning visitors see the new one. */
const ICON_VERSION = '7'

export const Route = createRootRoute({
  head: () => ({
    // Site-wide tags. Each route adds its own title, description, robots and
    // canonical (see src/lib/seo.ts); a route's tag wins over the same tag here.
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'google-site-verification', content: 'S8kJyYT-6kCzOytVerViOFKhPDPleWCwfltAxOG1DM4' },
      // Monetag's ownership check for wasscetutor.com: a tag only, it loads no ads or scripts.
      { name: 'monetag', content: 'e0a89d13cd30b9c3e9461ab2aeb342b4' },
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
      // The stacked name everywhere, generated by scripts/brand/build-icons.mjs. The
      // version suffix makes browsers drop the icon they cached before.
      { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg?v=${ICON_VERSION}` },
      { rel: 'icon', type: 'image/png', sizes: '48x48', href: `/favicon-48.png?v=${ICON_VERSION}` },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: `/favicon-192.png?v=${ICON_VERSION}` },
      { rel: 'apple-touch-icon', href: `/apple-touch-icon.png?v=${ICON_VERSION}` },
    ],
    scripts: [{ children: BOOT_SCRIPT }, ...(GA_MEASUREMENT_ID ? [{ children: analyticsScript(GA_MEASUREMENT_ID) }] : [])],
  }),
  // The root must render on the server for any child route to (Start's
  // defaultSsr: false would otherwise apply here too). Children stay
  // client-only unless they set `ssr: true` themselves.
  ssr: true,
  // Monetag's script stays on a page once loaded; reload when navigating to
  // a page where it must not show, such as Privacy or Terms.
  beforeLoad: ({ location, preload }) => {
    if (typeof window === 'undefined' || preload) return
    const signedIn = hasStoredSession()
    const leaveMonetag = monetagLoaded() && !monetagPathAllowed(location.pathname, signedIn)
    if (!leaveMonetag) return
    if (reloadWithoutNetwork(location.href)) return new Promise<never>(() => {})
  },
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

/**
 * A signed-out visitor who opens a page that needs an account (Practice, a
 * lesson, Progress…) is sent to sign in, and lands back on that page after
 * (src/lib/return-to.ts). Signing out on such a page is left to the sign-out
 * flow, which goes to the homepage.
 */
function useSignInForAppPages() {
  const { user, loading } = useAuth()
  const location = useRouterState({ select: (st) => st.location })
  const sendToSignIn = useSendToSignIn()
  const hadUser = useRef(false)
  useEffect(() => {
    if (loading) return
    if (user) {
      hadUser.current = true
      return
    }
    if (hadUser.current) {
      hadUser.current = false // just signed out: not a visitor arriving
      return
    }
    if (needsAccount(location.pathname)) sendToSignIn(`${location.pathname}${location.searchStr ?? ''}`)
  }, [loading, user, location.pathname, location.searchStr, sendToSignIn])
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

/**
 * Tutors and affiliates never land in the student app: on a student-only
 * screen (the student home, set-up, subjects, practice, progress, the study
 * tutor) they are taken to their own dashboard instead. Admins are not moved.
 */
function useRoleHome(pathname: string) {
  const navigate = useNavigate()
  const { role, isAdmin } = useAccountRole()
  useEffect(() => {
    if (!role || role === 'student' || isAdmin) return
    if (isStudentOnlyPath(pathname)) void navigate({ to: ROLE_HOME[role], replace: true })
  }, [role, isAdmin, pathname, navigate])
}

function RootComponent() {
  const pathname = useRouterState({ select: (st) => st.location.pathname })
  useSignInForAppPages()
  useMonetag(pathname)
  useRoleHome(pathname)
  const studentNav = useHasBottomNav(pathname)
  const roleWorkspace = pathname === '/tutor-dashboard' || pathname.startsWith('/tutor-dashboard/') || pathname === '/affiliate-dashboard'
  // Pages with their own brand and frame (BeamPad's): no WASSCE Tutor
  // navigation, header or footer, and the document itself scrolls.
  if (isStandalonePath(pathname)) {
    return (
      <>
        <Outlet />
        <Suspense fallback={null}>
          <TanStackRouterDevtools />
        </Suspense>
      </>
    )
  }
  return (
    <div className="app-frame flex bg-background text-foreground">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main" className="flex-1 overflow-y-auto pt-[env(safe-area-inset-top)]">
          <TopBar />
          {/* Bottom padding clears the fixed mobile navigation bar when it is shown. */}
          <div className={`px-4 pt-4 sm:px-6 sm:pt-6 ${studentNav ? 'pb-28 lg:pb-12' : 'pb-12'}`}>
            {roleWorkspace ? <WorkspaceBar /> : <PublicHeader />}
            <Outlet />
            {!roleWorkspace && <Footer />}
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
