// Signed-in Home. It answers four questions in order: what to do next, what's
// planned today, how am I doing, and where to get help. Every number comes
// from recorded activity; a learner with no activity gets a first-step screen,
// never 0% charts.
//
// Look. One dominant dark card with the subject's photo carries the next
// lesson and its button. The week is a strip of days, the practice average a
// ring, subjects are photo cards, and a free account gets one clear card with
// what a plan opens and its price (instead of a banner on every visit).
//
// Layout. The screen sits on the workspace grid (.app-page). From 1280 px it
// has two columns: the things to do on the left and the things to glance at in
// a rail on the right. Below that it is one column in the reading order set by
// the order-* classes.
import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChartLine,
  Check,
  CircleCheck,
  ClipboardList,
  Flame,
  Lightbulb,
  MessageCircleQuestion,
  PlayCircle,
  UserRound,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { usePapersForSubjects, useStudentSubjects, type PaperRow } from '@/lib/queries'
import {
  localDay,
  useProgress,
  type Completed,
  type CurriculumLesson,
  type CurriculumTopic,
  type ProgressSummary,
  type ScoredAttempt,
  type SubjectProgress,
  type SubjectRef,
} from '@/lib/progress'
import { checkAccess } from '@/lib/access'
import { useAccess } from '@/lib/useAccess'
import { FROM_PRICE, PAID_FEATURES, planById } from '@/lib/plans'
import { subjectTheme } from '@/lib/subject-theme'
import { EmptyState, Pill, ScorePill, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import { UpdateBanner } from '@/components/UpdateBanner'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { StudentTutorBookings } from '@/components/dashboard/StudentTutorBookings'
import { KeyTermsNudge } from '@/components/dashboard/KeyTermsNudge'
import { ReviewPrompt } from '@/components/dashboard/ReviewPrompt'

type Located = { lesson: CurriculumLesson; topic: CurriculumTopic; subject: SubjectRef }

function greeting(): string {
  const h = new Date().getHours()
  return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 17 ? 'Good afternoon' : 'Good evening'
}

const shortDate = (iso: string) => {
  const day = localDay(iso)
  const today = localDay(new Date().toISOString())
  const y = new Date()
  y.setDate(y.getDate() - 1)
  if (day === today) return 'Today'
  if (day === localDay(y.toISOString())) return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const minutes = (lessons: CurriculumLesson[]) => lessons.reduce((n, l) => n + (l.est_minutes ?? 0), 0)

export function Dashboard({ user, profile }: { user: User; profile: Profile | null | undefined }) {
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects(user.id)
  const { summary, completed, isLoading, error } = useProgress(user.id, subjects)
  const papers = usePapersForSubjects((subjects ?? []).map((s) => s.id))
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || 'there'

  // lesson id -> where it sits, for "done today" and recent activity
  const where = useMemo(() => {
    const m = new Map<string, Located>()
    for (const s of summary?.subjects ?? []) for (const t of s.topics) for (const l of t.topic.lessons) m.set(l.id, { lesson: l, topic: t.topic, subject: s.subject })
    return m
  }, [summary])

  if (error) {
    return (
      <div className="app-page pt-4">
        <EmptyState title="We couldn't load your dashboard" body="Check your connection and try again. Your progress is saved." />
      </div>
    )
  }

  if (subjectsLoading || isLoading || !summary || !completed) {
    return (
      <div className="app-page space-y-6" aria-busy="true" aria-label="Loading your dashboard">
        <Skeleton className="h-16 w-2/3 max-w-md" />
        <div className={COLUMNS}>
          <div className="space-y-7">
            <Skeleton className="h-52" />
            <Skeleton className="h-44" />
          </div>
          <div className="space-y-7">
            <Skeleton className="h-48" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    )
  }

  const started = summary.done > 0 || summary.papersTaken > 0

  return (
    <div className="app-page relative isolate space-y-7">
      {/* A soft brand light behind the greeting and the first card. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 -z-10 h-[30rem] bg-[radial-gradient(55%_60%_at_12%_0%,rgba(100,56,216,.16),transparent_70%),radial-gradient(40%_50%_at_95%_10%,rgba(255,209,102,.12),transparent_70%)] dark:bg-[radial-gradient(55%_60%_at_12%_0%,rgba(140,110,255,.18),transparent_70%)]" />
      <UpdateBanner />

      <header className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="dash-eyebrow">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          {summary.streak >= 2 && (
            <p className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-[#ffb547] to-[#f0782f] px-3 py-1.5 text-sm font-bold text-white shadow-[0_10px_22px_-10px_rgba(240,120,47,.85)]">
              <Flame className="h-4 w-4" aria-hidden />
              <span className="tabular-nums">{summary.streak}-day streak</span>
            </p>
          )}
        </div>
        <h1 className="text-[1.875rem] font-bold leading-[1.1] tracking-tight text-balance sm:text-[2.5rem]">
          {started ? `${greeting()}, ${firstName}` : `Welcome, ${firstName}`}
        </h1>
        <p className="max-w-xl text-[15px] text-muted-foreground">
          {!summary.next
            ? 'Every lesson and practice set in your subjects is free.'
            : started
              ? `${summary.done} ${summary.done === 1 ? 'lesson' : 'lessons'} done so far. Pick up where you left off in ${summary.next.subject.name}.`
              : `Your first lesson takes about ${summary.next.lesson.est_minutes ?? 10} minutes. Start whenever you are ready.`}
        </p>
      </header>

      <AccessNotice profile={profile} />

      <div className={COLUMNS}>
        <div className={COLUMN}>
          <div className="order-1 xl:order-none">
            {summary.subjects.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-6 w-6" />}
                title="Choose your subjects"
                body="Pick your faculty and the WASSCE subjects you're sitting. Your first lesson appears here straight after."
                action={<Button asChild><Link to="/onboarding">Choose subjects</Link></Button>}
              />
            ) : !summary.next ? (
              summary.total > 0 && summary.done === summary.total ? (
                <EmptyState
                  icon={<CircleCheck className="h-6 w-6" />}
                  title="You've finished every lesson in your subjects"
                  body="Keep your knowledge sharp with practice sets, and revisit any topic from Subjects."
                  action={<Button asChild><Link to="/practice">Go to practice</Link></Button>}
                />
              ) : (
                <EmptyState
                  icon={<BookOpen className="h-6 w-6" />}
                  title="Lessons for your subjects are being written"
                  body="New lessons are added every week. You can browse what's ready in Subjects."
                  action={<Button asChild><Link to="/subjects">Browse subjects</Link></Button>}
                />
              )
            ) : (
              <ContinueCard summary={summary} started={started} />
            )}
          </div>

          {!started && summary.next && (
            <p className="order-2 rounded-2xl border border-dashed bg-card/60 p-4 text-sm text-muted-foreground xl:order-none">
              After your first lesson, your progress and study recommendations will appear here.
            </p>
          )}
          {started && (
            <>
              <div className={`order-2 ${SLOT}`}><TodayPlan summary={summary} completed={completed} where={where} /></div>
              {/* Key terms of the topic being studied, once a lesson in it is done. */}
              {summary.next && (summary.subjects.find((x) => x.subject.id === summary.next!.subject.id)?.topics.find((t) => t.topic.id === summary.next!.topic.id)?.done ?? 0) > 0 && (
                <div className={`order-4 ${SLOT}`}>
                  <KeyTermsNudge userId={user.id} topic={summary.next.topic} subjectSlug={summary.next.subject.slug} />
                </div>
              )}
              <div className={`order-4 ${SLOT}`}><Recommended summary={summary} papers={papers.data ?? []} /></div>
            </>
          )}
          {summary.subjects.length > 0 && <div className={`order-6 ${SLOT}`}><YourSubjects subjects={summary.subjects} /></div>}
          <div className={`order-8 ${SLOT}`}><StudentTutorBookings userId={user.id} /></div>
        </div>

        <div className={COLUMN}>
          {started && <div className={`order-3 ${SLOT}`}><Snapshot summary={summary} completed={completed} /></div>}
          <div className={`order-5 ${SLOT}`}><UpgradeCard /></div>
          {started && <div className={`order-7 ${SLOT}`}><RecentActivity summary={summary} completed={completed} where={where} /></div>}
          <div className={`order-9 ${SLOT}`}><QuickAccess topic={summary.next?.topic.name ?? null} /></div>
          {completed.size >= 3 && <div className={`order-10 ${SLOT}`}><ReviewPrompt lessonsDone={completed.size} /></div>}
        </div>
      </div>
    </div>
  )
}

// One column in reading order on phones and tablets (the two column wrappers
// dissolve and each section takes its order-* position); main column plus a
// 22rem rail from 1280 px.
const COLUMNS = 'flex flex-col gap-7 xl:grid xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-8'
const COLUMN = 'contents xl:flex xl:min-w-0 xl:flex-col xl:gap-7'
/** A section's place in the layout. A section that renders nothing leaves no gap. */
const SLOT = 'empty:hidden xl:order-none'

/* ── Plan notice: a free account's way to the rest, or a plan about to end ── */

function AccessNotice({ profile }: { profile: Profile | null | undefined }) {
  const a = checkAccess(profile)
  if (a.reason === 'admin' || a.reason === 'no-profile') return null
  const day = (n: number) => (n === 1 ? 'tomorrow' : `in ${n} days`)
  // Free accounts (and ended plans) get the UpgradeCard in the layout instead.
  if (a.reason === 'expired') return null
  let title: string
  let body: string
  if (a.reason === 'subscribed') {
    if (a.subscriptionDaysLeft > 7) return null
    title = `Your plan ends ${day(a.subscriptionDaysLeft)}`
    body = 'Add more time to keep the AI study tutor and the mock exams without a break. Lessons and practice stay free either way.'
  } else {
    if (a.trialDaysLeft > 2) return null
    title = `Your free trial ends ${day(a.trialDaysLeft)}`
    body = `After that every lesson and practice set stays free. A plan adds the AI study tutor and the mock exams, from ${FROM_PRICE} NLe.`
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between" role="status">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      <Button asChild size="sm" className="shrink-0 self-start sm:self-auto">
        <Link to="/subscribe" search={{ plan: 'year' }}>See plans</Link>
      </Button>
    </div>
  )
}

/* ── 1. Continue learning: the one dominant action ── */

function ContinueCard({ summary, started }: { summary: ProgressSummary; started: boolean }) {
  const next = summary.next!
  const sp = summary.subjects.find((s) => s.subject.id === next.subject.id)
  const tp = sp?.topics.find((t) => t.topic.id === next.topic.id)
  const index = next.topic.lessons.findIndex((l) => l.id === next.lesson.id) + 1
  const total = next.topic.lessons.length
  const doneInTopic = tp?.done ?? 0
  const pct = total ? Math.round((doneInTopic / total) * 100) : 0

  return (
    <section
      aria-labelledby="continue-title"
      className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#140d33] text-white ring-1 ring-white/10 shadow-[0_44px_80px_-42px_rgba(20,13,51,.95),0_20px_40px_-28px_rgba(91,52,214,.6)]"
    >
      {/* The subject's photo fills the card on a phone and the right side from 640 px, fading into the card. */}
      <div aria-hidden className="absolute inset-0 sm:left-auto sm:w-[60%]">
        <SubjectCover slug={next.subject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 640px) 60vw, 100vw" priority className="absolute inset-0 h-full w-full" />
        <span className="absolute inset-0 bg-gradient-to-t from-[#140d33] via-[#140d33]/75 to-[#140d33]/15 sm:bg-gradient-to-r sm:from-[#140d33] sm:via-[#140d33]/55 sm:to-[#140d33]/0" />
      </div>
      <span aria-hidden className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#7c4dff]/40 blur-3xl" />

      <div className="relative flex min-h-[22rem] flex-col justify-end p-6 sm:min-h-[18rem] sm:max-w-[62%] sm:justify-center sm:p-8">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-violet-100 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
          <PlayCircle className="h-3.5 w-3.5" aria-hidden /> {started ? 'Continue learning' : 'Start here'}
        </p>
        <h2 id="continue-title" className="mt-3 text-[1.75rem] font-bold leading-[1.15] tracking-tight text-balance sm:text-[2rem]">
          {started ? next.lesson.title : next.topic.name}
        </h2>
        <p className="mt-1.5 text-sm text-white/70">
          {started && next.lesson.title !== next.topic.name ? `${next.subject.name} · ${next.topic.name}` : `${next.subject.name} · ${next.lesson.title}`}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <MiniRing pct={pct} label={`${doneInTopic} of ${total} lessons done in ${next.topic.name}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-white/75">
              <span>Lesson {index} of {total} in this topic</span>
              {next.lesson.est_minutes ? <span className="shrink-0">{next.lesson.est_minutes} min</span> : null}
            </div>
            <div className="mt-2 flex gap-1" aria-hidden>
              {next.topic.lessons.map((l, i) => (
                <span key={l.id} className={`h-1.5 flex-1 rounded-full ${i < index - 1 ? 'bg-[#ffd166]' : i === index - 1 ? 'bg-white' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button asChild size="lg" className="w-full bg-white text-[#140d33] shadow-[0_12px_28px_-12px_rgba(255,255,255,.6)] hover:bg-white/90 sm:w-auto">
            <Link to="/lesson/$lessonId" params={{ lessonId: next.lesson.id }}>
              {started ? 'Continue lesson' : 'Start lesson'} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Link to="/topic/$topicId" params={{ topicId: next.topic.id }} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
            <BookOpen className="h-4 w-4" aria-hidden /> All lessons in {next.topic.name}
          </Link>
        </div>
      </div>
    </section>
  )
}

/** A small ring for the topic's progress on the dark card. */
function MiniRing({ pct, label }: { pct: number; label: string }) {
  const r = 21
  const c = 2 * Math.PI * r
  return (
    <span className="relative block h-14 w-14 shrink-0" role="img" aria-label={label}>
      <svg viewBox="0 0 52 52" className="h-14 w-14 -rotate-90" aria-hidden>
        <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" className="stroke-white/15" />
        <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" stroke="#ffd166" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums">{pct}%</span>
    </span>
  )
}

/* ── 2. Today's plan: what's done today plus the next lessons in sequence ── */

function TodayPlan({ summary, completed, where }: { summary: ProgressSummary; completed: Completed; where: Map<string, Located> }) {
  const next = summary.next
  const today = localDay(new Date().toISOString())
  const doneToday = [...completed.entries()]
    .filter(([, at]) => localDay(at) === today)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id]) => where.get(id))
    .filter((x): x is Located => !!x)
    .slice(-3)

  let planned: Located[] = []
  if (next) {
    // the lessons after the resume point, through the subject's topics in order
    const sp = summary.subjects.find((s) => s.subject.id === next.subject.id)
    const sequence = (sp?.topics ?? []).flatMap((t) => t.topic.lessons.map((lesson) => ({ lesson, topic: t.topic, subject: next.subject })))
    const from = sequence.findIndex((x) => x.lesson.id === next.lesson.id)
    planned = sequence.slice(Math.max(from, 0)).filter((x) => !completed.has(x.lesson.id)).slice(0, Math.max(1, 3 - doneToday.length))
  }
  if (doneToday.length === 0 && planned.length === 0) return null
  const left = minutes(planned.map((p) => p.lesson))
  const all = doneToday.length + planned.length

  return (
    <section className="dash-card p-5 sm:p-6" aria-labelledby="today-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="dash-eyebrow">Today</p>
          <h2 id="today-title" className="mt-1 text-xl font-bold tracking-tight">Your plan for today</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {doneToday.length > 0 && `${doneToday.length} of ${all} done`}
            {doneToday.length > 0 && left > 0 && ' · '}
            {left > 0 && `about ${left} min to go`}
            {doneToday.length === 0 && left === 0 && 'Your next lessons, in order'}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-sm font-bold tabular-nums" aria-hidden>
          {doneToday.length}/{all}
        </span>
      </div>

      {/* A timeline: done lessons, the next one, then the ones after it. */}
      <ol className="relative mt-5 space-y-1.5 before:absolute before:bottom-6 before:left-[1.1rem] before:top-6 before:w-px before:bg-border">
        {doneToday.map((x) => (
          <li key={x.lesson.id} className="relative flex min-h-14 items-center gap-3.5 rounded-2xl px-2 py-2">
            <span className="relative z-10 flex h-5 w-5 shrink-0 translate-x-[0.6rem] items-center justify-center rounded-full bg-success text-white ring-4 ring-card" aria-hidden>
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="ml-3 min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/40">{x.lesson.title}</span>
              <span className="sr-only">Completed. </span>
              <span className="block truncate text-xs text-muted-foreground">{x.topic.name}</span>
            </span>
          </li>
        ))}
        {planned.map((x, i) => (
          <li key={x.lesson.id} className="relative">
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: x.lesson.id }}
              className={`group flex min-h-14 items-center gap-3.5 rounded-2xl px-2 py-2.5 transition-colors ${i === 0 ? 'bg-brand-soft/60 ring-1 ring-primary/15 hover:bg-brand-soft dark:bg-primary/10' : 'hover:bg-muted/60'}`}
            >
              <span
                className={`relative z-10 flex h-5 w-5 shrink-0 translate-x-[0.6rem] items-center justify-center rounded-full ring-4 ${i === 0 ? 'bg-primary ring-primary/20 shadow-[0_0_0_6px_rgba(100,56,216,.12)]' : 'border-2 border-input bg-card ring-card'}`}
                aria-hidden
              >
                {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="ml-3 min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{x.lesson.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {x.topic.name}
                  {x.lesson.est_minutes ? ` · ${x.lesson.est_minutes} min` : ''}
                </span>
              </span>
              {i === 0 ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
                  Start <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              )}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── 3. Progress snapshot: the week as a chart, then three numbers that say what they measure ── */

function Snapshot({ summary, completed }: { summary: ProgressSummary; completed: Completed }) {
  const week = useMemo(() => {
    // Lessons finished and practice sets taken on each of the last seven days, today last.
    const count = new Map<string, number>()
    for (const at of completed.values()) count.set(localDay(at), (count.get(localDay(at)) ?? 0) + 1)
    for (const a of summary.subjects.flatMap((s) => s.attempts)) count.set(localDay(a.created_at), (count.get(localDay(a.created_at)) ?? 0) + 1)
    const days: { key: string; label: string; n: number; active: boolean; today: boolean }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = localDay(d.toISOString())
      days.push({ key, label: d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2), n: count.get(key) ?? 0, active: summary.activeDays.has(key), today: i === 0 })
    }
    return days
  }, [summary, completed])
  const activeThisWeek = week.filter((d) => d.active).length
  const most = Math.max(1, ...week.map((d) => d.n))
  const things = week.reduce((n, d) => n + d.n, 0)

  return (
    <section className="dash-card overflow-hidden" aria-labelledby="snapshot-title">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="dash-eyebrow" id="snapshot-title">This week</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
              {activeThisWeek}<span className="text-lg font-semibold text-muted-foreground"> of 7 days</span>
            </p>
            <p className="text-sm text-muted-foreground">{things} {things === 1 ? 'lesson or set' : 'lessons and sets'} done</p>
          </div>
          <Link to="/progress" className="inline-flex min-h-9 items-center gap-1 rounded-full bg-muted px-3 text-xs font-semibold text-foreground hover:bg-muted/70">
            Details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        {/* Bars: how much was done each day. */}
        <ol className="mt-5 grid h-28 grid-cols-7 items-end gap-2" aria-label={`Studied on ${activeThisWeek} of the last 7 days`}>
          {week.map((d, i) => (
            <li key={d.key} className="flex h-full flex-col items-center justify-end gap-1.5">
              <span className="sr-only">{d.label}: {d.n} done</span>
              <span
                aria-hidden
                className={`dash-bar w-full max-w-7 rounded-lg ${d.n > 0 ? (d.today ? 'bg-gradient-to-t from-[#5b34d6] to-[#9b7bff]' : 'bg-gradient-to-t from-[#6438d8]/80 to-[#8f6bff]/80') : 'bg-muted'}`}
                style={{ height: d.n > 0 ? `${Math.max(18, (d.n / most) * 100)}%` : '8%', animationDelay: `${i * 0.05}s` }}
              />
              <span aria-hidden className={`text-[11px] font-semibold ${d.today ? 'text-primary' : 'text-muted-foreground'}`}>{d.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <dl className="grid grid-cols-3 border-t bg-muted/30">
        <div className="px-4 py-3.5">
          <dt className="text-[11px] font-semibold text-muted-foreground">Lessons</dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums">{summary.done}<span className="text-xs font-medium text-muted-foreground">/{summary.total}</span></dd>
          <dd className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
            <span className="block h-full rounded-full bg-primary" style={{ width: `${summary.total ? (summary.done / summary.total) * 100 : 0}%` }} />
          </dd>
        </div>
        <div className="border-x px-4 py-3.5">
          <dt className="text-[11px] font-semibold text-muted-foreground">Topics done</dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums">{summary.topicsDone}</dd>
          <dd className="text-[11px] text-muted-foreground">every lesson read</dd>
        </div>
        <div className="px-4 py-3.5">
          <dt className="text-[11px] font-semibold text-muted-foreground">Practice</dt>
          {summary.avgScore === null ? (
            <dd className="mt-1"><Link to="/practice" className="text-sm font-semibold text-primary hover:underline">Take a set</Link></dd>
          ) : (
            <dd className="mt-0.5 flex items-center gap-2">
              <ScoreRing pct={summary.avgScore} />
              <span className="text-[11px] leading-tight text-muted-foreground">{summary.papersTaken} {summary.papersTaken === 1 ? 'set' : 'sets'}</span>
            </dd>
          )}
        </div>
      </dl>
    </section>
  )
}

/** A practice average as a ring: green from 70%, amber from 50%, red below. */
function ScoreRing({ pct, size = 'sm' }: { pct: number; size?: 'sm' | 'md' }) {
  const r = 19
  const c = 2 * Math.PI * r
  const tone = pct >= 70 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive'
  const box = size === 'md' ? 'h-14 w-14' : 'h-11 w-11'
  return (
    <span className={`relative block shrink-0 ${box} ${tone}`}>
      <svg viewBox="0 0 48 48" className={`${box} -rotate-90`} aria-hidden>
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="5" className="stroke-muted" />
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-bold tabular-nums text-foreground ${size === 'md' ? 'text-xs' : 'text-[11px]'}`}>{pct}%</span>
    </span>
  )
}

/* ── 4. Recommended next step, with the reason ── */

function Recommended({ summary, papers }: { summary: ProgressSummary; papers: PaperRow[] }) {
  const rec = useMemo(() => recommend(summary, papers), [summary, papers])
  if (!rec) return null
  return (
    <section aria-labelledby="rec-title" className="dash-card overflow-hidden p-5 sm:p-6">
      <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#ffb547]/20 blur-3xl" />
      <div className="relative flex gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffb547] to-[#f0782f] text-white shadow-[0_10px_20px_-10px_rgba(240,120,47,.8)]" aria-hidden>
          <Lightbulb className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="dash-eyebrow text-warning">Recommended next step</p>
          <h2 id="rec-title" className="mt-1 text-xl font-bold leading-snug tracking-tight">{rec.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{rec.why}</p>
          {rec.last && (
            <div className="mt-4 max-w-sm" aria-hidden>
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Last score</span>
                <span className="tabular-nums text-foreground">{rec.last.score}/{rec.last.total}</span>
              </div>
              <div className="mt-1.5 flex gap-1">
                {Array.from({ length: rec.last.total }, (_, i) => (
                  <span key={i} className={`h-2 flex-1 rounded-full ${i < rec.last!.score ? 'bg-warning' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
          )}
          <Button asChild className="mt-5">
            <Link to="/paper/$paperId" params={{ paperId: rec.paperId }}>{rec.action} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function recommend(summary: ProgressSummary, papers: PaperRow[]): { title: string; why: string; action: string; paperId: string; last?: { score: number; total: number } } | null {
  const attempts = summary.subjects.flatMap((s) => s.attempts).sort((a, b) => b.created_at.localeCompare(a.created_at))
  // latest attempt per paper
  const latestByPaper = new Map<string, ScoredAttempt>()
  for (const a of attempts) if (a.paper && !latestByPaper.has(a.paper.id)) latestByPaper.set(a.paper.id, a)

  // 1. A set whose latest result was under half: revise, then retry.
  const weak = [...latestByPaper.values()].find((a) => a.total > 0 && a.score / a.total < 0.5)
  if (weak?.paper) {
    return {
      title: `Retry ${weak.paper.title.replace(/: practice set \d+$/i, '')}`,
      why: `Your last score was ${weak.score}/${weak.total} (${/^(Today|Yesterday)$/.test(shortDate(weak.created_at)) ? shortDate(weak.created_at).toLowerCase() : shortDate(weak.created_at)}). Read the worked solutions, then try the set again to check it has stuck.`,
      action: 'Try again',
      paperId: weak.paper.id,
      last: weak.total <= 20 ? { score: weak.score, total: weak.total } : undefined,
    }
  }

  // 2. A topic whose lessons are all done but whose practice set hasn't been tried.
  const finished = summary.subjects
    .flatMap((s) => s.topics)
    .filter((t) => t.status === 'done')
    .sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))
  for (const t of finished) {
    const set = papers.find((p) => p.subject_id === t.topic.subject_id && p.title.toLowerCase().startsWith(`${t.topic.name.toLowerCase()}:`) && !latestByPaper.has(p.id))
    if (set) {
      return {
        title: `Test yourself on ${t.topic.name}`,
        why: `You've finished every lesson in ${t.topic.name}. A short practice set shows what has stuck and what to revise.`,
        action: 'Start practice set',
        paperId: set.id,
      }
    }
  }
  return null
}

/* ── 5. Your subjects: photo cards with progress, available first, unavailable quieter ── */

function YourSubjects({ subjects }: { subjects: SubjectProgress[] }) {
  const available = subjects.filter((s) => s.total > 0).sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))
  const soon = subjects.filter((s) => s.total === 0)
  return (
    <section className="space-y-3.5" aria-labelledby="subjects-title">
      <SectionHeader title={<span id="subjects-title">Your subjects</span>} action={{ to: '/subjects', label: 'All subjects' }} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {available.map((s) => {
          const { palette } = subjectTheme(s.subject.slug)
          const pct = s.total ? Math.round((s.done / s.total) * 100) : 0
          return (
            <li key={s.subject.id}>
              <Link to="/subject/$subjectId" params={{ subjectId: s.subject.id }} className="dash-card dash-lift group flex h-full flex-col overflow-hidden">
                <span className="relative block h-32 overflow-hidden">
                  <SubjectCover slug={s.subject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 640px) 40vw, 100vw" className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
                    <span className="truncate text-lg font-bold leading-tight text-white drop-shadow">{s.subject.name}</span>
                    {s.avgScore !== null && (
                      <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
                        Practice {s.avgScore}%
                      </span>
                    )}
                  </span>
                </span>
                <span className="flex flex-1 items-center gap-3.5 p-4">
                  <span className={palette.text}>
                    <SubjectRing pct={pct} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold tabular-nums">{s.done > 0 ? `${s.done} of ${s.total} lessons` : `${s.total} lessons to start`}</span>
                    {s.next && (
                      <span className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-primary">
                        {s.done > 0 ? 'Next' : 'Start'}: {s.next.topic.name}
                        <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
        {soon.map((s) => (
          <li key={s.subject.id} className="dash-card flex flex-col overflow-hidden opacity-80">
            <span className="relative block h-24 overflow-hidden">
              <SubjectCover slug={s.subject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 640px) 40vw, 100vw" className="absolute inset-0 h-full w-full opacity-60 grayscale" />
            </span>
            <span className="flex flex-1 items-center justify-between gap-2 p-4">
              <span className="truncate text-[15px] font-semibold text-muted-foreground">{s.subject.name}</span>
              <Pill>Lessons coming</Pill>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** A subject's share of lessons done, in the subject's colour (currentColor). */
function SubjectRing({ pct }: { pct: number }) {
  const r = 19
  const c = 2 * Math.PI * r
  return (
    <span className="relative block h-12 w-12 shrink-0" aria-hidden>
      <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="5" className="stroke-muted" />
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-foreground">{pct}%</span>
    </span>
  )
}

/* ── 6. Recent activity: last lessons and practice results ── */

function RecentActivity({ summary, completed, where }: { summary: ProgressSummary; completed: Completed; where: Map<string, Located> }) {
  type Item = { at: string; key: string; node: ReactNode }
  const lessons: Item[] = [...completed.entries()]
    .map(([id, at]) => ({ at, x: where.get(id) }))
    .filter((r): r is { at: string; x: Located } => !!r.x)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)
    .map(({ at, x }) => ({
      at,
      key: `l-${x.lesson.id}`,
      node: (
        <Link to="/lesson/$lessonId" params={{ lessonId: x.lesson.id }} className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success" aria-hidden><CircleCheck className="h-[18px] w-[18px]" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{x.lesson.title}</span>
            <span className="block truncate text-xs text-muted-foreground">Lesson · {x.subject.name} · {shortDate(at)}</span>
          </span>
        </Link>
      ),
    }))
  const names = new Map(summary.subjects.map((s) => [s.subject.id, s.subject.name]))
  const results: Item[] = summary.subjects
    .flatMap((s) => s.attempts)
    .filter((a) => a.paper)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)
    .map((a) => ({
      at: a.created_at,
      key: `a-${a.id}`,
      node: (
        <Link to="/paper/$paperId" params={{ paperId: a.paper!.id }} className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden><ClipboardList className="h-[18px] w-[18px]" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{a.paper!.title}</span>
            <span className="block truncate text-xs text-muted-foreground">Practice · {names.get(a.paper!.subject_id) ?? ''} · {shortDate(a.created_at)}</span>
          </span>
          <ScorePill score={a.score} total={a.total} />
          <span className="hidden text-sm font-semibold text-primary sm:inline xl:hidden">Try again</span>
        </Link>
      ),
    }))
  const items = [...lessons, ...results].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5)
  if (items.length === 0) return null
  return (
    <section className="space-y-3.5" aria-labelledby="recent-title">
      <SectionHeader title={<span id="recent-title">Recent activity</span>} />
      <ul className="dash-card divide-y overflow-hidden">
        {items.map((i) => <li key={i.key}>{i.node}</li>)}
      </ul>
    </section>
  )
}

/* ── 7. Quick access: secondary shortcuts, tutor in context ── */

function QuickAccess({ topic }: { topic: string | null }) {
  const tile = 'dash-card dash-lift flex h-full flex-col gap-3 p-4'
  const icon = 'flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[0_10px_18px_-10px_rgba(23,28,43,.6)]'
  return (
    <section className="space-y-3" aria-labelledby="quick-title">
      <h2 id="quick-title" className="text-xl font-bold tracking-tight">Quick access</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
        <Link to="/tutor" search={topic ? { ask: `Explain ${topic} simply, with one worked example.`, about: topic } : {}} className={tile}>
          <span className={`${icon} bg-gradient-to-br from-[#4a86ea] to-[#2353a8]`}><MessageCircleQuestion className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">AI tutor</span>
            <span className="block text-xs text-muted-foreground">{topic ? `Ask about ${topic}` : 'Step-by-step help'}</span>
          </span>
        </Link>
        <Link to="/practice" className={tile}>
          <span className={`${icon} bg-gradient-to-br from-[#2fb47c] to-[#136f4b]`}><PlayCircle className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Practice</span>
            <span className="block text-xs text-muted-foreground">Sets with full working</span>
          </span>
        </Link>
        <a href="/tutors" className={tile}>
          <span className={`${icon} bg-gradient-to-br from-[#8a63ff] to-[#4524b4]`}><UserRound className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Book a private tutor</span>
            <span className="block text-xs text-muted-foreground">Real teachers near you</span>
          </span>
        </a>
        <Link to="/progress" className={tile}>
          <span className={`${icon} bg-gradient-to-br from-[#ffb547] to-[#c2620f]`}><ChartLine className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Progress</span>
            <span className="block text-xs text-muted-foreground">Scores and weak topics</span>
          </span>
        </Link>
      </div>
    </section>
  )
}

/* ── 8. Upgrade: what a plan adds to the free account ── */

function UpgradeCard() {
  const { access, loading, profile } = useAccess()
  if (loading || !profile || access.hasAccess || access.reason === 'admin') return null
  const ended = !!profile.subscription_expires_at
  const year = planById('year')!
  return (
    <section aria-labelledby="upgrade-title" className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b34d6] via-[#4524b4] to-[#24135e] p-5 text-white shadow-[0_24px_50px_-28px_rgba(76,29,149,.9)] sm:p-6">
      <span aria-hidden className="absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-[#ffd166]/25 blur-2xl" />
      <p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">{ended ? 'Your plan has ended' : 'Free account'}</p>
      <h2 id="upgrade-title" className="mt-1.5 text-xl font-bold leading-snug">{ended ? 'Renew for the AI tutor and mock exams' : 'Add the AI study tutor and mock exams'}</h2>
      <ul className="mt-3.5 space-y-1.5 text-sm text-white/85">
        {PAID_FEATURES.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd166]" aria-hidden /> {f}</li>
        ))}
      </ul>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight">{FROM_PRICE}</span>
        <span className="text-sm font-semibold text-white/80">NLe a month</span>
        <span className="ml-auto text-right text-xs text-white/70">or {year.priceNle} NLe for a year</span>
      </p>
      <Button asChild size="lg" className="mt-4 w-full bg-white text-[#24135e] hover:bg-white/90">
        <Link to="/subscribe" search={{ plan: 'year' }}>See plans <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </Button>
      <p className="mt-2.5 text-center text-xs text-white/65">Orange Money or AfriMoney · No automatic renewal</p>
    </section>
  )
}
