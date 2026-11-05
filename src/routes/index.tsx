import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { publicHead } from '@/lib/seo'
import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { useAuth } from '@/lib/auth'
import { useProfile, useStudentSubjects, useFaculties } from '@/lib/queries'
import { Flame, PlayCircle, Target, BookCheck } from 'lucide-react'
import { useProgress } from '@/lib/progress'
import { SubjectIcon } from '@/lib/subject-theme'
import { SubjectCard } from '@/components/ds/SubjectCard'
import { ProgressRing, percent } from '@/components/ds/Progress'
import { Card, ScorePill, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import { UpdateBanner } from '@/components/UpdateBanner'
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

function trialDaysLeft(startedAt: string | null): number {
  if (!startedAt) return 0
  const start = new Date(startedAt).getTime()
  const end = start + 7 * 24 * 60 * 60 * 1000
  const left = Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000))
  return Math.max(0, left)
}

function Index() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const landingData = Route.useLoaderData()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)
  const { data: subjects } = useStudentSubjects(user?.id ?? null)
  const { summary } = useProgress(user?.id ?? null, subjects)
  const { data: faculties } = useFaculties()

  useEffect(() => {
    if (!loading && user && profile && !profile.onboarded) {
      navigate({ to: '/onboarding' })
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
        <div data-landing>
          <Landing data={landingData} />
        </div>
      </>
    )
  }

  if (profileLoading) return <CenterMsg>Loading your dashboard…</CenterMsg>

  const subscriptionDaysLeft = profile?.subscription_active && profile?.subscription_expires_at ? Math.ceil((new Date(profile.subscription_expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null
  const daysLeft = trialDaysLeft(profile?.trial_started_at ?? null)
  const facultyName =
    faculties?.find((f) => f.id === profile?.faculty_id)?.name ?? 'Your faculty'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  const initials = (() => {
    const name = (firstName || '').trim()
    if (!name) return '?'
    const parts = name.split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name[0].toUpperCase()
  })()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <UpdateBanner />
      {/* HEADER with avatar */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{(() => {
            const h = new Date().getHours()
            if (h < 5) return "Working late,"
            if (h < 12) return "Good morning,"
            if (h < 17) return "Good afternoon,"
            if (h < 21) return "Good evening,"
            return "Working late,"
          })()}</p>
          <h1 className="text-3xl font-black tracking-tight">{firstName}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{(() => {
            const prompts = [
              "What are you studying today?",
              "Ready to tackle WAEC?",
              "Let's get sharper today.",
              "Which subject needs you today?",
              "One more step closer to passing.",
            ]
            return prompts[Math.floor(Math.random() * prompts.length)]
          })()}</p>
        </div>
        <Link
          to="/profile"
          aria-label="Open profile"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold shadow-md shadow-primary/20 hover:opacity-90 transition"
        >
          {initials}
        </Link>
      </header>
      {/* STATUS STRIP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Faculty</p>
          <p className="mt-0.5 text-base font-bold">{facultyName}</p>
        </div>
        <div
          className={`rounded-2xl border p-3 ${
            profile?.is_admin
              ? 'border-primary/30 bg-primary/5'
              : profile?.subscription_active
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : daysLeft > 0
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-red-500/30 bg-red-500/5'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Access</p>
          <p className="mt-0.5 text-base font-bold">
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

      {/* SUBSCRIPTION EXPIRY WARNING */}
      {subscriptionDaysLeft !== null && subscriptionDaysLeft <= 3 && subscriptionDaysLeft >= 0 && (
        <div className="flex items-center justify-between rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 px-4 py-3">
          <div>
            <p className="font-bold text-amber-700">
              {subscriptionDaysLeft === 0 ? 'Your subscription expires today' : subscriptionDaysLeft === 1 ? 'Your subscription expires tomorrow' : `Your subscription expires in ${subscriptionDaysLeft} days`}
            </p>
            <p className="text-xs text-amber-700/80">Renew now to keep your access without interruption.</p>
          </div>
          <Link to="/subscribe">
            <Button variant="secondary" size="sm">Renew</Button>
          </Link>
        </div>
      )}

      {/* TRIAL NUDGE */}
      {!profile?.subscription_active && !profile?.is_admin && (
        <div className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
          <div>
            <p className="font-bold">Keep your progress going</p>
            <p className="text-sm opacity-90">From 25 NLe / month — every subject, every paper, your AI tutor.</p>
          </div>
          <Link to="/subscribe">
            <Button variant="secondary" size="sm">Subscribe</Button>
          </Link>
        </div>
      )}

      {/* CONTINUE LEARNING */}
      {!summary ? (
        <Skeleton className="h-44" />
      ) : (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-violet-700 to-fuchsia-700 p-5 text-white shadow-lg">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-5">
            <ProgressRing value={summary.done} max={summary.total} size={92} thickness={9} stroke="text-white" label="Lessons completed across your subjects">
              <span className="text-xl font-black tabular-nums">{percent(summary.done, summary.total)}%</span>
            </ProgressRing>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-white/75">Your WASSCE progress</p>
              <p className="text-xl font-black leading-tight">
                {summary.done} of {summary.total} lessons
              </p>
              <p className="text-sm text-white/80">
                {summary.topicsDone} topics done{summary.streak > 0 ? ` · ${summary.streak}-day streak` : ''}
              </p>
            </div>
          </div>
          {summary.next && (
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: summary.next.lesson.id }}
              className="relative mt-5 flex items-center gap-3 rounded-2xl bg-white p-3 text-slate-900 shadow-md transition hover:shadow-lg"
            >
              <SubjectIcon slug={summary.next.subject.slug} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold uppercase tracking-wider text-violet-700">
                  {summary.done === 0 ? 'Start here' : 'Continue learning'}
                </span>
                <span className="block truncate font-semibold">{summary.next.lesson.title}</span>
                <span className="block truncate text-xs text-slate-500">{summary.next.subject.name} · {summary.next.topic.name}</span>
              </span>
              <PlayCircle className="h-8 w-8 shrink-0 text-violet-700" aria-hidden />
            </Link>
          )}
        </section>
      )}

      {/* QUICK STATS */}
      {summary && (
        <div className="grid grid-cols-3 gap-2">
          <Link to="/progress" className="rounded-2xl border bg-card p-3 text-center transition hover:border-primary/40">
            <Flame className="mx-auto h-5 w-5 text-orange-500" aria-hidden />
            <p className="mt-1 text-xl font-black tabular-nums">{summary.streak}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Day streak</p>
          </Link>
          <Link to="/progress" className="rounded-2xl border bg-card p-3 text-center transition hover:border-primary/40">
            <BookCheck className="mx-auto h-5 w-5 text-emerald-500" aria-hidden />
            <p className="mt-1 text-xl font-black tabular-nums">{summary.done}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lessons</p>
          </Link>
          <Link to="/progress" className="rounded-2xl border bg-card p-3 text-center transition hover:border-primary/40">
            <Target className="mx-auto h-5 w-5 text-primary" aria-hidden />
            <p className="mt-1 text-xl font-black tabular-nums">{summary.avgScore === null ? '–' : `${summary.avgScore}%`}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Paper avg</p>
          </Link>
        </div>
      )}

      {/* YOUR SUBJECTS */}
      {summary && summary.subjects.length > 0 && (
        <section className="space-y-3">
          <SectionHeader title="Your subjects" action={{ to: '/subjects', label: 'See all' }} />
          <div className="grid gap-3 sm:grid-cols-2">
            {[...summary.subjects]
              .sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? '') || b.total - a.total)
              .slice(0, 4)
              .map((s) => <SubjectCard key={s.subject.id} s={s} compact />)}
          </div>
        </section>
      )}

      {/* RECENT PAPERS */}
      {summary && summary.papersTaken > 0 && (
        <section className="space-y-3">
          <SectionHeader title="Recent papers" action={{ to: '/progress', label: 'All scores' }} />
          <Card className="divide-y">
            {summary.subjects
              .flatMap((s) => s.attempts.map((a) => ({ a, s: s.subject })))
              .sort((x, y) => y.a.created_at.localeCompare(x.a.created_at))
              .slice(0, 3)
              .map(({ a, s }) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <SubjectIcon slug={s.slug} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.paper?.title ?? 'Paper'}</p>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                  </div>
                  <ScorePill score={a.score} total={a.total} />
                </div>
              ))}
          </Card>
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


