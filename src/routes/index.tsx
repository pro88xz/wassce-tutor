import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
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

function Index() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null)
  const { data: subjects } = useStudentSubjects(user?.id ?? null)
  const { data: attempts } = useAttempts(user?.id ?? null)
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


  // Auth still restoring from storage — show a quick spinner, no landing flash.
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    )
  }

  // NOT SIGNED IN — landing
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl space-y-16 pb-12">
        {/* HERO */}
        <section className="pt-8 sm:pt-16 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-9 w-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L2 8l10 4 10-4-10-4z M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
            </svg>
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
            <DownloadButton variant="outline" />
          </div>
          <div className="flex justify-center gap-2 pt-1">
            <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs text-muted-foreground">
              No card needed · 75 NLe / year after trial
            </p>
          </div>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/auth">
              <Button className="h-12 px-8 text-base">Get started — it's free</Button>
            </Link>
            <DownloadButton />
          </div>
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
      <header>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="text-3xl font-black tracking-tight">{firstName} 👋</h1>
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
          <Link to="/subscribe">
            <Button variant="secondary" size="sm">Subscribe</Button>
          </Link>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/subjects"
          className="rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z M8 11h8 M8 15h5" />
            </svg>
          </div>
          <p className="mt-3 font-bold">Continue studying</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{subjects?.length ?? 0} subjects</p>
          <p className="mt-2 text-xs text-primary">Open →</p>
        </Link>

        <Link
          to="/progress"
          className="rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 8-8 M14 8h6v6" />
            </svg>
          </div>
          <p className="mt-3 font-bold">See progress</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {attempts?.length ?? 0} {attempts?.length === 1 ? 'quiz' : 'quizzes'} taken
          </p>
          <p className="mt-2 text-xs text-primary">Open →</p>
        </Link>
      </div>
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


function DownloadButton({ variant = 'default' }: { variant?: 'default' | 'outline' }) {
  const trackClick = async () => {
    try {
      // Anonymous client id, lasts forever — for unique-downloader estimate
      let clientId = localStorage.getItem('wt_client_id')
      if (!clientId) {
        clientId = crypto.randomUUID()
        localStorage.setItem('wt_client_id', clientId)
      }
      // Fire-and-forget: we don't block the download on this.
      void supabase.from('downloads').insert({
        user_agent: navigator.userAgent.slice(0, 500),
        client_id: clientId,
      })
    } catch {
      // never block download on tracking failure
    }
  }

  const className =
    variant === 'outline'
      ? 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-base font-medium transition'
      : 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-base font-medium transition'

  return (
    <a
      href="/wassce-tutor.apk"
      download="wassce-tutor.apk"
      onClick={trackClick}
      className={className}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
      </svg>
      Download Android App
    </a>
  )
}
