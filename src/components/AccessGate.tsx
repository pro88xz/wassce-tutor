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
          Unlock every subject, every paper, and every lesson for a full academic year.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-3 text-left">
        <div className="flex items-baseline justify-between">
          <span className="font-bold">Full access</span>
          <span><span className="text-2xl font-black">75</span> <span className="text-sm text-muted-foreground">NLe / year</span></span>
        </div>
        <ul className="space-y-1.5 text-sm">
          <li>✓ All subjects in your faculty</li>
          <li>✓ Past papers and practice quizzes</li>
          <li>✓ Step-by-step lessons with explanations</li>
          <li>✓ Progress tracking and history</li>
        </ul>
      </div>

      <div className="space-y-2">
        <Link to="/subscribe" className="block">
          <Button className="h-12 w-full text-base">Subscribe — 75 NLe / year</Button>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:underline inline-block">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
