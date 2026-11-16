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
  Lock,
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
import { checkAccess, lessonLocked } from '@/lib/access'
import { useAccess } from '@/lib/useAccess'
import { FROM_PRICE, PAID_FEATURES, planById } from '@/lib/plans'
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { EmptyState, Pill, ScorePill, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import { UpdateBanner } from '@/components/UpdateBanner'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { StudentTutorBookings } from '@/components/dashboard/StudentTutorBookings'

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
    <div className="app-page space-y-6">
      <UpdateBanner />

      <header className="flex items-end justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl">
            {started ? `${greeting()}, ${firstName}` : `Welcome, ${firstName}`}
          </h1>
        </div>
        {summary.streak >= 2 && (
          <p className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-sm font-bold text-warning ring-1 ring-warning/25">
            <Flame className="h-4 w-4" aria-hidden />
            <span>
              {summary.streak}
              <span className="sr-only sm:not-sr-only">-day streak</span>
            </span>
          </p>
        )}
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
              <div className={`order-4 ${SLOT}`}><Recommended summary={summary} papers={papers.data ?? []} /></div>
            </>
          )}
          {summary.subjects.length > 0 && <div className={`order-6 ${SLOT}`}><YourSubjects subjects={summary.subjects} /></div>}
          <div className={`order-8 ${SLOT}`}><StudentTutorBookings userId={user.id} /></div>
        </div>

        <div className={COLUMN}>
          {started && <div className={`order-3 ${SLOT}`}><Snapshot summary={summary} /></div>}
          <div className={`order-5 ${SLOT}`}><UpgradeCard /></div>
          {started && <div className={`order-7 ${SLOT}`}><RecentActivity summary={summary} completed={completed} where={where} /></div>}
          <div className={`order-9 ${SLOT}`}><QuickAccess topic={summary.next?.topic.name ?? null} /></div>
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
    body = 'Add more time to keep every lesson, practice set and the AI tutor open without a break.'
  } else {
    if (a.trialDaysLeft > 2) return null
    title = `Your free trial ends ${day(a.trialDaysLeft)}`
    body = `After that your free account keeps the first lesson of every topic. A plan opens everything, from ${FROM_PRICE} NLe.`
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
  // On a free account the next lesson may be behind the plan: say so on the button.
  const { access } = useAccess()
  const locked = lessonLocked(access, next.lesson)
  const sp = summary.subjects.find((s) => s.subject.id === next.subject.id)
  const tp = sp?.topics.find((t) => t.topic.id === next.topic.id)
  const index = next.topic.lessons.findIndex((l) => l.id === next.lesson.id) + 1
  const total = next.topic.lessons.length
  const doneInTopic = tp?.done ?? 0

  return (
    <section aria-labelledby="continue-title" className="relative isolate overflow-hidden rounded-3xl bg-[#1b1240] text-white shadow-[0_30px_60px_-30px_rgba(27,18,64,.8)]">
      <div className="grid sm:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="relative h-36 sm:order-2 sm:h-full sm:min-h-[15rem]">
          <SubjectCover slug={next.subject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 640px) 304px, 100vw" priority className="absolute inset-0 h-full w-full" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1b1240] via-[#1b1240]/30 to-transparent sm:bg-gradient-to-r sm:via-[#1b1240]/10" />
        </div>
        <div className="relative -mt-10 p-5 sm:mt-0 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">{started ? 'Continue learning' : 'Start your first lesson'}</p>
          <h2 id="continue-title" className="mt-2 text-2xl font-bold leading-tight tracking-tight text-balance sm:text-[1.75rem]">
            {started ? next.lesson.title : next.topic.name}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {started && next.lesson.title !== next.topic.name ? `${next.subject.name} · ${next.topic.name}` : `${next.subject.name} · ${next.lesson.title}`}
          </p>

          <div className="mt-5 max-w-md">
            <div className="flex items-baseline justify-between text-[13px] font-medium text-white/75">
              <span>Lesson {index} of {total}</span>
              {next.lesson.est_minutes ? <span>about {next.lesson.est_minutes} min</span> : null}
            </div>
            <div className="mt-2 flex gap-1" role="img" aria-label={`${doneInTopic} of ${total} lessons done in ${next.topic.name}`}>
              {next.topic.lessons.map((l, i) => (
                <span key={l.id} className={`h-1.5 flex-1 rounded-full ${i < index - 1 ? 'bg-[#ffd166]' : i === index - 1 ? 'bg-white' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>

          {locked ? (
            <div className="mt-6">
              <Button asChild size="lg" className="w-full bg-[#ffd166] text-[#1b1240] hover:bg-[#ffd166]/90 sm:w-auto">
                <Link to="/subscribe" search={{ plan: 'year' }}>
                  <Lock className="h-4 w-4" aria-hidden /> Unlock to continue · from {FROM_PRICE} NLe
                </Link>
              </Button>
              <p className="mt-2.5 text-center text-xs text-white/65 sm:text-left">Pay with Orange Money or AfriMoney. No card needed.</p>
            </div>
          ) : (
            <Button asChild size="lg" className="mt-6 w-full bg-white text-[#1b1240] hover:bg-white/90 sm:w-auto">
              <Link to="/lesson/$lessonId" params={{ lessonId: next.lesson.id }}>
                {started ? 'Continue lesson' : 'Start lesson'} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
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
    <section className="space-y-3" aria-labelledby="today-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="today-title" className="text-lg font-bold tracking-tight">Today's plan</h2>
          <p className="text-sm text-muted-foreground">
            {doneToday.length > 0 && `${doneToday.length} of ${all} done`}
            {doneToday.length > 0 && left > 0 && ' · '}
            {left > 0 && `about ${left} min to go`}
            {doneToday.length === 0 && left === 0 && 'Your next lessons, in order'}
          </p>
        </div>
        <span aria-hidden className="mb-1.5 flex w-24 gap-1">
          {Array.from({ length: all }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < doneToday.length ? 'bg-success' : 'bg-muted'}`} />
          ))}
        </span>
      </div>
      <ol className="divide-y rounded-2xl border bg-card">
        {doneToday.map((x) => (
          <li key={x.lesson.id} className="flex min-h-14 items-center gap-3 px-4 py-3">
            <CircleCheck className="h-5 w-5 shrink-0 text-success" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/40">{x.lesson.title}</span>
              <span className="sr-only">Completed. </span>
              <span className="block truncate text-xs text-muted-foreground">{x.topic.name}</span>
            </span>
          </li>
        ))}
        {planned.map((x, i) => (
          <li key={x.lesson.id}>
            <Link to="/lesson/$lessonId" params={{ lessonId: x.lesson.id }} className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${i === 0 ? 'border-primary' : 'border-input'}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{x.lesson.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {x.topic.name}
                  {x.lesson.est_minutes ? ` · ${x.lesson.est_minutes} min` : ''}
                </span>
              </span>
              {i === 0 && <Pill className="bg-brand-soft text-primary">Next</Pill>}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── 3. Progress snapshot: each metric says what it measures ── */

function Snapshot({ summary }: { summary: ProgressSummary }) {
  const week = useMemo(() => {
    const days: { key: string; label: string; active: boolean; today: boolean }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = localDay(d.toISOString())
      days.push({ key, label: d.toLocaleDateString('en-GB', { weekday: 'narrow' }), active: summary.activeDays.has(key), today: i === 0 })
    }
    return days
  }, [summary.activeDays])
  const activeThisWeek = week.filter((d) => d.active).length

  return (
    <section className="space-y-3" aria-labelledby="snapshot-title">
      <SectionHeader title={<span id="snapshot-title">Your progress</span>} action={{ to: '/progress', label: 'Details' }} />
      <div className="overflow-hidden rounded-2xl border bg-card">
        {/* The last seven days, today last. */}
        <div className="flex items-center justify-between gap-4 border-b px-4 py-3.5">
          <div>
            <p className="text-xs font-medium text-muted-foreground">This week</p>
            <p className="whitespace-nowrap text-lg font-bold tabular-nums">{activeThisWeek} of 7 days</p>
          </div>
          <ol className="flex gap-1" aria-label={`Studied on ${activeThisWeek} of the last 7 days`}>
            {week.map((d) => (
              <li key={d.key} className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${d.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} ${d.today ? 'ring-2 ring-primary/35 ring-offset-2 ring-offset-card' : ''}`}
                  aria-hidden
                >
                  {d.active ? <Check className="h-3 w-3" strokeWidth={3} /> : d.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <dl className="grid grid-cols-3 divide-x">
          <div className="px-4 py-3.5">
            <dt className="text-xs font-medium text-muted-foreground">Lessons done</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums">{summary.done}</dd>
            <dd className="text-[11px] text-muted-foreground">of {summary.total.toLocaleString('en')}</dd>
          </div>
          <div className="px-4 py-3.5">
            <dt className="text-xs font-medium text-muted-foreground">Topics done</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums">{summary.topicsDone}</dd>
            <dd className="text-[11px] text-muted-foreground">all lessons read</dd>
          </div>
          <div className="px-4 py-3.5">
            <dt className="text-xs font-medium text-muted-foreground">Practice</dt>
            {summary.avgScore === null ? (
              <dd className="mt-1.5"><Link to="/practice" className="text-sm font-semibold text-primary hover:underline">Take a set</Link></dd>
            ) : (
              <dd className="mt-1 flex items-center gap-2">
                <ScoreRing pct={summary.avgScore} />
                <span className="text-[11px] leading-tight text-muted-foreground">{summary.papersTaken} {summary.papersTaken === 1 ? 'set' : 'sets'}</span>
              </dd>
            )}
          </div>
        </dl>
      </div>
    </section>
  )
}

/** A practice average as a ring: green from 70%, amber from 50%, red below. */
function ScoreRing({ pct }: { pct: number }) {
  const r = 19
  const c = 2 * Math.PI * r
  const tone = pct >= 70 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive'
  return (
    <span className={`relative block h-11 w-11 shrink-0 ${tone}`}>
      <svg viewBox="0 0 48 48" className="h-11 w-11 -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="5" className="stroke-muted" />
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-foreground">{pct}%</span>
    </span>
  )
}

/* ── 4. Recommended next step, with the reason ── */

function Recommended({ summary, papers }: { summary: ProgressSummary; papers: PaperRow[] }) {
  const rec = useMemo(() => recommend(summary, papers), [summary, papers])
  if (!rec) return null
  return (
    <section aria-labelledby="rec-title" className="flex gap-4 rounded-2xl border border-warning/30 bg-warning/5 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning" aria-hidden>
        <Lightbulb className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-warning">Recommended next step</p>
        <h2 id="rec-title" className="mt-1 text-lg font-bold leading-snug">{rec.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{rec.why}</p>
        <Button asChild className="mt-4">
          <Link to="/paper/$paperId" params={{ paperId: rec.paperId }}>{rec.action} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </Button>
      </div>
    </section>
  )
}

function recommend(summary: ProgressSummary, papers: PaperRow[]): { title: string; why: string; action: string; paperId: string } | null {
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

/* ── 5. Your subjects: compact, available first, unavailable quieter ── */

function YourSubjects({ subjects }: { subjects: SubjectProgress[] }) {
  const available = subjects.filter((s) => s.total > 0).sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))
  const soon = subjects.filter((s) => s.total === 0)
  return (
    <section className="space-y-3" aria-labelledby="subjects-title">
      <SectionHeader title={<span id="subjects-title">Your subjects</span>} action={{ to: '/subjects', label: 'All subjects' }} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {available.map((s) => {
          const { palette } = subjectTheme(s.subject.slug)
          return (
            <li key={s.subject.id}>
              <Link to="/subject/$subjectId" params={{ subjectId: s.subject.id }} className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <SubjectCover slug={s.subject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 1280px) 220px, (min-width: 640px) 30vw, 50vw" className="h-20 sm:h-24" />
                <span className="flex flex-1 flex-col gap-1.5 p-3">
                  <span className="truncate text-[15px] font-semibold leading-tight">{s.subject.name}</span>
                  {s.done > 0 ? (
                    <>
                      <ProgressBar value={s.done} max={s.total} fill={palette.bar} size="sm" label={`${s.subject.name}: ${s.done} of ${s.total} lessons done`} />
                      <span className="text-xs tabular-nums text-muted-foreground">{s.done} of {s.total} lessons</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">{s.total} lessons</span>
                  )}
                  {s.next && <span className="mt-auto truncate text-xs font-medium text-primary">{s.done > 0 ? 'Next' : 'Start'}: {s.next.topic.name}</span>}
                </span>
              </Link>
            </li>
          )
        })}
        {soon.map((s) => (
          <li key={s.subject.id} className="flex flex-col overflow-hidden rounded-2xl border bg-card opacity-75">
            <SubjectCover slug={s.subject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 640px) 30vw, 50vw" className="h-20 opacity-60 grayscale sm:h-24" />
            <span className="flex flex-1 flex-col gap-1.5 p-3">
              <span className="truncate text-[15px] font-semibold leading-tight text-muted-foreground">{s.subject.name}</span>
              <Pill className="self-start">Lessons coming</Pill>
            </span>
          </li>
        ))}
      </ul>
    </section>
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
          <CircleCheck className="h-5 w-5 shrink-0 text-success" aria-hidden />
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
          <ClipboardList className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
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
    <section className="space-y-3" aria-labelledby="recent-title">
      <SectionHeader title={<span id="recent-title">Recent activity</span>} />
      <ul className="divide-y rounded-2xl border bg-card">
        {items.map((i) => <li key={i.key}>{i.node}</li>)}
      </ul>
    </section>
  )
}

/* ── 7. Quick access: secondary shortcuts, tutor in context ── */

function QuickAccess({ topic }: { topic: string | null }) {
  const tile = 'flex h-full flex-col gap-2.5 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-brand-soft/30'
  const icon = 'flex h-10 w-10 items-center justify-center rounded-xl text-white'
  return (
    <section className="space-y-3" aria-labelledby="quick-title">
      <h2 id="quick-title" className="text-lg font-bold tracking-tight">Quick access</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
        <Link to="/tutor" search={topic ? { ask: `Explain ${topic} simply, with one worked example.`, about: topic } : {}} className={tile}>
          <span className={`${icon} bg-[#2864c5]`}><MessageCircleQuestion className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">AI tutor</span>
            <span className="block text-xs text-muted-foreground">{topic ? `Ask about ${topic}` : 'Step-by-step help'}</span>
          </span>
        </Link>
        <Link to="/practice" className={tile}>
          <span className={`${icon} bg-[#17865b]`}><PlayCircle className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Practice</span>
            <span className="block text-xs text-muted-foreground">Sets with full working</span>
          </span>
        </Link>
        <a href="/tutors" className={tile}>
          <span className={`${icon} bg-[#5b34d6]`}><UserRound className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Book a tutor</span>
            <span className="block text-xs text-muted-foreground">Real teachers near you</span>
          </span>
        </a>
        <Link to="/progress" className={tile}>
          <span className={`${icon} bg-[#b66a12]`}><ChartLine className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Progress</span>
            <span className="block text-xs text-muted-foreground">Scores and weak topics</span>
          </span>
        </Link>
      </div>
    </section>
  )
}

/* ── 8. Upgrade: a free account's one clear way to the rest ── */

function UpgradeCard() {
  const { access, loading, profile } = useAccess()
  if (loading || !profile || access.hasAccess || access.reason === 'admin') return null
  const ended = !!profile.subscription_expires_at
  const year = planById('year')!
  return (
    <section aria-labelledby="upgrade-title" className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b34d6] via-[#4524b4] to-[#24135e] p-5 text-white shadow-[0_24px_50px_-28px_rgba(76,29,149,.9)] sm:p-6">
      <span aria-hidden className="absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-[#ffd166]/25 blur-2xl" />
      <p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">{ended ? 'Your plan has ended' : 'Free account'}</p>
      <h2 id="upgrade-title" className="mt-1.5 text-xl font-bold leading-snug">{ended ? 'Renew to open every lesson again' : 'Open every lesson and practice set'}</h2>
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
