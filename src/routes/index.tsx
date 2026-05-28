import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)

  // Redirect signed-in-but-not-onboarded users to onboarding
  useEffect(() => {
    if (!loading && user && profile && !profile.onboarded) {
      navigate({ to: '/onboarding' })
    }
  }, [loading, user, profile, navigate])

  if (loading) return <p className="text-muted-foreground">Loading...</p>

  // NOT SIGNED IN — landing
  if (!user) {
    return (
      <div className="max-w-md mx-auto space-y-6 text-center pt-12">
        <h1 className="text-3xl font-bold">WASSCE Tutor</h1>
        <p className="text-muted-foreground">
          Your personalised WASSCE prep — tailored to your faculty.
        </p>
        <Link to="/auth">
          <Button className="w-full">Get Started</Button>
        </Link>
      </div>
    )
  }

  // SIGNED IN, profile still loading
  if (profileLoading) return <p className="text-muted-foreground">Loading your dashboard...</p>

  // SIGNED IN + ONBOARDED — minimal dashboard
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground">Your dashboard</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
      </div>

      <div className="rounded-lg border p-4 space-y-1">
        <p className="text-sm text-muted-foreground">
          Onboarding complete. Dashboard content coming in Phase 2.
        </p>
      </div>
    </div>
  )
}
