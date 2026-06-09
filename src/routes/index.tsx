import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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
      <>
        {/* HERO - Animated gradient with depth (full-bleed) */}
        <section className="relative -mx-6 -mt-6 mb-0 overflow-hidden">
          {/* Base gradient layer */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-700 to-fuchsia-700"
            style={{
              backgroundSize: '200% 200%',
              animation: 'heroGradient 20s ease infinite',
            }}
          />
          {/* Soft glowing orbs for atmospheric depth */}
          <div aria-hidden className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/25 blur-3xl" />
          <div aria-hidden className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          {/* SVG grain texture */}
          <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
            <filter id="heroNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#heroNoise)" />
          </svg>
          {/* Decorative floating shapes */}
          <svg aria-hidden className="absolute top-12 right-8 h-12 w-12 text-white/10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z" />
          </svg>
          <svg aria-hidden className="absolute bottom-20 left-10 h-8 w-8 text-white/10 rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
          <div aria-hidden className="absolute top-1/3 left-12 h-3 w-3 rounded-full bg-white/20" />
          <div aria-hidden className="absolute top-1/2 right-16 h-2 w-2 rounded-full bg-white/30" />
          <div aria-hidden className="absolute bottom-1/3 left-1/3 h-4 w-4 rounded-full border border-white/15" />
          {/* Vignette */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.25)_100%)]" />
          {/* CONTENT */}
          <div className="relative px-6 pt-16 sm:pt-24 pb-20 text-center space-y-7">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl shadow-blue-900/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-9 w-9 text-white drop-shadow-lg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L2 8l10 4 10-4-10-4z M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
              </svg>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-balance text-white drop-shadow-md">
                Pass WASSCE with confidence.
              </h1>
              <p className="text-balance text-white/90 text-base sm:text-lg max-w-xl mx-auto drop-shadow-sm">
                Personalised practice for every faculty &mdash; Science, Arts, Commercial, Technical. Past papers, lessons, and explanations built for Sierra Leone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link to="/auth" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-8 rounded-md bg-white text-blue-700 font-bold text-base shadow-xl shadow-blue-900/30 hover:bg-white/95 transition active:scale-[0.98]">
                  Start free for 7 days
                </button>
              </Link>
              <DownloadButton variant="hero" />
            </div>
            <div className="flex justify-center gap-2 pt-1">
              <Link to="/auth" className="text-xs text-white/80 hover:text-white transition">
                Sign in
              </Link>
              <span className="text-xs text-white/50">&middot;</span>
              <p className="text-xs text-white/80">
                No card needed &middot; Cancel anytime
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl space-y-16 pt-12 pb-12">
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
          <h2 className="text-center text-2xl font-bold">Plans that fit your wallet</h2>
          <p className="text-center text-sm text-muted-foreground -mt-2">All plans unlock every subject, every paper, and your AI tutor.</p>
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-5 text-center space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Monthly</p>
              <p><span className="text-4xl font-black">25</span><span className="ml-1 text-sm text-muted-foreground">NLe</span></p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="rounded-2xl border bg-card p-5 text-center space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Quarterly</p>
              <p><span className="text-4xl font-black">60</span><span className="ml-1 text-sm text-muted-foreground">NLe</span></p>
              <p className="text-xs text-muted-foreground">per 3 months</p>
              <p className="text-xs font-semibold text-emerald-600">Save 15 NLe</p>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-5 text-center space-y-1 relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-wide">Best value</span>
              <p className="text-sm font-semibold text-muted-foreground">Yearly</p>
              <p><span className="text-4xl font-black">220</span><span className="ml-1 text-sm text-muted-foreground">NLe</span></p>
              <p className="text-xs text-muted-foreground">per year</p>
              <p className="text-xs font-semibold text-emerald-600">Save 80 NLe</p>
            </div>
          </div>
          <div className="mx-auto max-w-md pt-2 space-y-2">
            <Link to="/auth" className="block">
              <Button className="h-11 w-full">Start your 7-day free trial</Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              Pay with Orange Money or AfriMoney. Cancel anytime.
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
      </>
    )
  }

  if (profileLoading) return <CenterMsg>Loading your dashboard…</CenterMsg>

  const daysLeft = trialDaysLeft(profile?.trial_started_at ?? null)
  const facultyName =
    faculties?.find((f) => f.id === profile?.faculty_id)?.name ?? 'Your faculty'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  // --- Today's pick logic ---
  const hasAttempts = (attempts?.length ?? 0) > 0
  const initials = (() => {
    const name = (firstName || '').trim()
    if (!name) return '?'
    const parts = name.split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name[0].toUpperCase()
  })()
  const todaysPickSubject = (() => {
    if (!subjects || subjects.length === 0) return null
    if (!hasAttempts) return subjects[0]
    const recentSubjectNames = new Set(
      (attempts ?? []).slice(0, 3).map((a) => a.paper?.subject?.name).filter(Boolean)
    )
    const stale = subjects.find((sub) => !recentSubjectNames.has(sub.name))
    return stale ?? subjects[0]
  })()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* HEADER with avatar */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-black tracking-tight">{firstName} 👋</h1>
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
            <p className="font-bold">Keep your progress going</p>
            <p className="text-sm opacity-90">From 25 NLe / month — every subject, every paper, your AI tutor.</p>
          </div>
          <Link to="/subscribe">
            <Button variant="secondary" size="sm">Subscribe</Button>
          </Link>
        </div>
      )}

      {/* TODAY'S PICK */}
      {todaysPickSubject && (
        <Link
          to="/subject/$subjectId"
          params={{ subjectId: todaysPickSubject.id }}
          className="block rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
        >
          <p className="text-xs uppercase tracking-wide text-primary font-bold">
            {hasAttempts ? "Today's pick" : 'Start here'}
          </p>
          <p className="mt-1.5 text-xl font-bold">{todaysPickSubject.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasAttempts
              ? `Pick up where you left off in ${todaysPickSubject.name}.`
              : `New to WASSCE Tutor? Open ${todaysPickSubject.name} and take your first lesson.`}
          </p>
          <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {hasAttempts ? 'Continue' : 'Open subject'} <span aria-hidden>→</span>
          </p>
        </Link>
      )}
      {/* RECENT ACTIVITY */}
      {hasAttempts && (
        <div className="rounded-2xl border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Recent activity</p>
            <Link to="/progress" className="text-xs text-primary font-semibold hover:underline">
              See all →
            </Link>
          </div>
          <div className="space-y-2">
            {attempts!.slice(0, 2).map((a) => {
              const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0
              const tone = pct >= 70 ? 'emerald' : pct >= 50 ? 'amber' : 'red'
              const toneCls = tone === 'emerald'
                ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700'
                : tone === 'amber'
                  ? 'border-amber-500/40 bg-amber-500/5 text-amber-700'
                  : 'border-red-500/40 bg-red-500/5 text-red-700'
              return (
                <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.paper?.title ?? 'Quiz'}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.paper?.subject?.name ?? ''}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${toneCls}`}>
                    {a.score}/{a.total}
                  </span>
                </div>
              )
            })}
          </div>
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


function DownloadButton({ variant = 'default' }: { variant?: 'default' | 'outline' | 'hero' }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  if (Capacitor.isNativePlatform() || user) return null

  const trackAndDownload = () => {
    try {
      let clientId = localStorage.getItem('wt_client_id')
      if (!clientId) {
        clientId = crypto.randomUUID()
        localStorage.setItem('wt_client_id', clientId)
      }
      void supabase.from('downloads').insert({
        user_agent: navigator.userAgent.slice(0, 500),
        client_id: clientId,
      })
    } catch {}
    const a = document.createElement('a')
    a.href = 'https://cfclkwugbexrihloqofc.supabase.co/storage/v1/object/public/apk/wassce-tutor.apk'
    a.download = 'wassce-tutor.apk'
    a.click()
    setOpen(false)
  }

  const btnClass =
    variant === 'hero'
      ? 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 text-base font-semibold transition active:scale-[0.98] shadow-lg shadow-blue-900/20'
      : variant === 'outline'
        ? 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-base font-medium transition'
        : 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-base font-medium transition'

  return (
    <>
      <button onClick={() => setOpen(true)} className={btnClass}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
        Download Android App
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L2 8l10 4 10-4-10-4z M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold leading-tight">Install WASSCE Tutor</h3>
                <p className="text-sm text-muted-foreground">Quick 3-step install. The warnings are normal &mdash; every Android app installed outside the Play Store shows them.</p>
              </div>
            </div>
            <ol className="space-y-3 mb-5">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                <div className="text-sm">
                  <p className="font-semibold">Download starts.</p>
                  <p className="text-muted-foreground">If Chrome warns about file safety, tap <span className="font-semibold text-foreground">Download anyway</span> or <span className="font-semibold text-foreground">Keep</span>.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                <div className="text-sm">
                  <p className="font-semibold">Open the downloaded file.</p>
                  <p className="text-muted-foreground">If your phone says <span className="font-semibold text-foreground">"unknown source"</span>, tap <span className="font-semibold text-foreground">Settings, Allow from this source, back</span>.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                <div className="text-sm">
                  <p className="font-semibold">Tap Install.</p>
                  <p className="text-muted-foreground">If Play Protect asks, tap <span className="font-semibold text-foreground">Install anyway</span>. WASSCE Tutor is safe &mdash; it just isn&rsquo;t on the Play Store yet.</p>
                </div>
              </li>
            </ol>
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 h-11 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition">Cancel</button>
              <button onClick={trackAndDownload} className="flex-1 h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium transition">Got it, download</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
