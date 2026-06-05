import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { Button } from '@/components/ui/button'

export function AccessGate({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile(user?.id ?? null)

  if (isLoading) {
    return <p className="text-muted-foreground">Loading…</p>
  }

  const access = checkAccess(profile)

  if (access.hasAccess) return <>{children}</>

  // Locked screen
  return (
    <div className="mx-auto max-w-md space-y-6 pt-8 text-center">
      <div className="space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          🔒
        </div>
        <h1 className="text-2xl font-bold">Your free trial has ended</h1>
        <p className="text-muted-foreground">
          You've seen what's here. Pick a plan that fits and keep going — your progress, every subject, every paper, your AI tutor.
        </p>
      </div>

      <div className="space-y-2">
        <Link to="/subscribe" className="block">
          <Button className="h-12 w-full text-base">See plans</Button>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:underline inline-block">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
