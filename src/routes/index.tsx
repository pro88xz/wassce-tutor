import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile, useStudentSubjects, useFaculties, useAttempts } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toggleTheme, getTheme } from '@/lib/theme'

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
  const [theme, setTheme] = useState(getTheme())
  const flip = () => setTheme(toggleTheme())
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
      <div className="mx-auto max-w-3xl space-y-16 pb-12">
        {/* HERO */}
        <section className="pt-8 sm:pt-16 text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-lg shadow-primary/30">
            W
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-balance">
              Pass WASSCE with confidence.
            </h1>
            <p className="text-balance text-muted-foreground max-w-xl mx-auto">
              Personalised practice for every faculty — Science, Arts, Commercial, Technical. Past papers, lessons, and explanations built for Sierra Leone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/auth">
              <Button className="h-12 px-8 text-base">Start free for 7 days</Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" className="h-12 px-6 text-base">Sign in</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            No card needed · 75 NLe / year after trial
          </p>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-6">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">1</div>
              <h3 className="mt-3 font-bold">Pick your faculty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Science, Arts, Commercial or Technical. We tailor your subjects automatically.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">2</div>
              <h3 className="mt-3 font-bold">Learn then test</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Step-by-step lessons for every topic, then real WASSCE-style questions to lock it in.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">3</div>
              <h3 className="mt-3 font-bold">Track your growth</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                See your scores rise. Find your weak spots. Walk into the exam knowing you're ready.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="space-y-6">
          <h2 className="text-center text-2xl font-bold">Built for the WASSCE you're actually taking</h2>
          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <Feature>Real past papers and practice questions, scored instantly</Feature>
            <Feature>Step-by-step explanations for every answer — never just &ldquo;wrong&rdquo;</Feature>
            <Feature>Lessons with diagrams and properly rendered math equations</Feature>
            <Feature>Reading mode for late-night study without burning your eyes</Feature>
            <Feature>Works on any Android phone, even on patchy data</Feature>
            <Feature>Made in Sierra Leone, for Sierra Leonean students</Feature>
          </div>
        </section>

        {/* PRICING */}
        <section className="space-y-4">
          <h2 className="text-center text-2xl font-bold">One simple price</h2>
          <div className="mx-auto max-w-md rounded-2xl border-2 border-primary bg-card p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Full access</p>
              <p className="mt-1">
                <span className="text-5xl font-black">75</span>
                <span className="ml-1 text-muted-foreground">NLe / year</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Less than the cost of one textbook
              </p>
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <Feature>Every subject in your faculty</Feature>
              <Feature>Every past paper, every lesson</Feature>
              <Feature>Pay with Orange Money or AfriMoney</Feature>
              <Feature>Cancel anytime, no questions</Feature>
            </div>
            <Link to="/auth" className="block">
              <Button className="h-11 w-full">Start your 7-day free trial</Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              Try every feature free for a week. Pay only if it helps you.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center space-y-3 pt-4">
          <h2 className="text-2xl font-bold">Your WASSCE is closer than you think.</h2>
          <p className="text-muted-foreground">Start studying smarter today.</p>
          <Link to="/auth">
            <Button className="h-12 px-8 text-base">Get started — it's free</Button>
          </Link>
        </section>
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
        <div className="flex items-center gap-1">
          {profile?.is_admin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={flip} aria-label="Toggle reading mode">
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </header>

      {/* STATUS STRIP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Faculty</p>
          <p className="mt-1 text-lg font-bold">{facultyName}</p>
        </div>
        <div
          className={`rounded-2xl border p-4 ${
            profile?.is_admin
              ? 'border-primary/30 bg-primary/5'
              : profile?.subscription_active
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : daysLeft > 0
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-red-500/30 bg-red-500/5'
          }`}
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Access</p>
          <p className="mt-1 text-lg font-bold">
            {profile?.is_admin
              ? 'Admin'
              : profile?.subscription_active
                ? 'Active'
                : daysLeft > 0
                  ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`
                  : 'Trial ended'}
          </p>
        </div>
      </div>

      {/* TRIAL NUDGE */}
      {!profile?.subscription_active && !profile?.is_admin && (
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


function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-600">✓</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}
