import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tutor')({
  component: TutorPage,
})

function TutorPage() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const access = checkAccess(profile)

  // Subscriber-only: admins + active subscriptions
  const allowed = access.reason === 'admin' || access.reason === 'subscribed'

  if (!allowed) {
    return (
      <div className="mx-auto max-w-md space-y-6 pt-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground">
          💬
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Your AI Tutor</h1>
          <p className="text-muted-foreground">
            Stuck on a question? Ask anything — your tutor explains step-by-step, in plain English, any time of day.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5 space-y-2 text-left text-sm">
          <p className="font-semibold">Examples you can ask:</p>
          <p className="text-muted-foreground">• &ldquo;Explain photosynthesis simply&rdquo;</p>
          <p className="text-muted-foreground">• &ldquo;Walk me through solving 2x + 5 = 17&rdquo;</p>
          <p className="text-muted-foreground">• &ldquo;What's the difference between mitosis and meiosis?&rdquo;</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Tutor is for subscribers only — part of the full 75 NLe / year plan.
        </p>
        <Link to="/subscribe" className="block">
          <Button className="h-12 w-full">Subscribe to unlock Tutor</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Tutor</h1>
      <p className="mt-2 text-muted-foreground">Chat UI coming next — we're wiring it up.</p>
    </div>
  )
}
