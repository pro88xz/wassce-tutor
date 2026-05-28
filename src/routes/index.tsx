import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile, useStudentSubjects, useFaculties, useAttempts } from '@/lib/queries'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function trialDaysLeft(startedAt: string | null): number {
  if (!startedAt) return 0
  const start = new Date(startedAt).getTime()
  const end = start + 7 * 24 * 60 * 60 * 1000
  const left = Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000))
  return Math.max(0, left)
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function Index() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)
  const { data: subjects } = useStudentSubjects(user?.id ?? null)
  const { data: attempts } = useAttempts(user?.id ?? null)
  const { data: faculties } = useFaculties()

  useEffect(() => {
    if (!loading && user && profile && !profile.onboarded) {
      navigate({ to: '/onboarding' })
    }
  }, [loading, user, profile, navigate])

  if (loading) return <CenterMsg>Loading…</CenterMsg>

  // NOT SIGNED IN — landing
  if (!user) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-lg shadow-primary/30">
            W
          </div>
          <h1 className="text-4xl font-black tracking-tight">WASSCE Tutor</h1>
          <p className="text-balance text-muted-foreground">
            Your personalised WASSCE prep — tailored to your faculty, built to help you pass.
          </p>
        </div>
        <Link to="/auth" className="w-full">
          <Button className="h-12 w-full text-base">Get Started — Free for 7 days</Button>
        </Link>
      </div>
    )
  }

  if (profileLoading) return <CenterMsg>Loading your dashboard…</CenterMsg>

  const daysLeft = trialDaysLeft(profile?.trial_started_at ?? null)
  const facultyName =
    faculties?.find((f) => f.id === profile?.faculty_id)?.name ?? 'Your faculty'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* HEADER */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-black tracking-tight">{firstName} 👋</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </header>

      {/* STATUS STRIP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Faculty</p>
          <p className="mt-1 text-lg font-bold">{facultyName}</p>
        </div>
        <div
          className={`rounded-2xl border p-4 ${
            profile?.subscription_active
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : daysLeft > 0
                ? 'border-amber-500/30 bg-amber-500/5'
                : 'border-red-500/30 bg-red-500/5'
          }`}
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Access</p>
          <p className="mt-1 text-lg font-bold">
            {profile?.subscription_active
              ? 'Active'
              : daysLeft > 0
                ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`
                : 'Trial ended'}
          </p>
        </div>
      </div>

      {/* TRIAL NUDGE */}
      {!profile?.subscription_active && (
        <div className="flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground">
          <div>
            <p className="font-bold">Unlock everything for a year</p>
            <p className="text-sm opacity-90">Just 75 NLe — all subjects, all papers.</p>
          </div>
          <Button variant="secondary" size="sm">
            Subscribe
          </Button>
        </div>
      )}

      {/* SUBJECTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Your subjects</h2>
          <Link to="/onboarding" className="text-sm text-primary hover:underline">
            Edit
          </Link>
        </div>

        {!subjects ? (
          <p className="text-sm text-muted-foreground">Loading subjects…</p>
        ) : subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subjects yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {subjects.map((s) => (
              <Link
                key={s.id}
                to="/subject/$subjectId"
                params={{ subjectId: s.id }}
                className="group flex aspect-square flex-col justify-between rounded-2xl border bg-card p-4 text-left transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold leading-tight">{s.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Tap to study →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* RECENT ACTIVITY */}
      {attempts && attempts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Recent activity</h2>
          <div className="space-y-2">
            {attempts.map((a) => {
              const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {a.paper?.subject?.name ?? 'Subject'} — {a.paper?.title ?? 'Paper'}
                    </p>
                    <p className="text-xs text-muted-foreground">{relativeTime(a.created_at)}</p>
                  </div>
                  <div
                    className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      pct >= 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {a.score}/{a.total}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function CenterMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground">{children}</p>
    </div>
  )
}
