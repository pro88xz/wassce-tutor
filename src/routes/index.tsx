import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { publicHead } from '@/lib/seo'
import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Landing } from '@/components/landing/Landing'
import { fetchLandingData } from '@/lib/public-content'

export const Route = createFileRoute('/')({
  head: publicHead('/'),
  ssr: true, // prerendered to static HTML at build time
  // Landing-page data (subjects, counts, popular topics), baked into the
  // prerendered HTML. It changes only when content does, so never refetch it
  // on in-app navigation back to Home.
  loader: () => fetchLandingData(),
  staleTime: Infinity,
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const landingData = Route.useLoaderData()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)

  useEffect(() => {
    if (!loading && user && profile && !profile.onboarded) {
      navigate({ to: '/onboarding', replace: true }) // replace: back from set-up must not land here and bounce again
    }
  }, [loading, user, profile, navigate])

  // Inside the APK, signed-out users go straight to sign-in (skip marketing page)
  useEffect(() => {
    if (!loading && !user && Capacitor.isNativePlatform()) {
      navigate({ to: '/auth' })
    }
  }, [loading, user, navigate])


  // NOT SIGNED IN (or auth still restoring) — landing.
  // This branch is what gets prerendered to static HTML for search engines, so
  // it must not depend on auth state. Visitors with a stored session, and the
  // Android app, see the boot spinner instead until auth resolves: the inline
  // boot script in __root.tsx sets a class on <html> and CSS in index.css
  // swaps [data-landing] for [data-boot-spinner].
  if (!user) {
    return (
      <>
        <div data-boot-spinner className="min-h-[80vh] items-center justify-center" aria-hidden>
          <Spinner />
        </div>
        <div data-landing>
          <Landing data={landingData} />
        </div>
      </>
    )
  }

  // Signed in. Keep the same spinner as the boot state while the profile
  // loads, and while a first-time student is being sent to onboarding, so the
  // screen changes once (spinner, then dashboard) instead of flickering
  // through a loading message or a dashboard that is about to be replaced.
  if (profileLoading || (profile && !profile.onboarded)) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center" role="status" aria-label="Loading your dashboard">
        <Spinner />
      </div>
    )
  }

  return <Dashboard user={user} profile={profile} />
}

function Spinner() {
  return <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary motion-reduce:animate-none" />
}


