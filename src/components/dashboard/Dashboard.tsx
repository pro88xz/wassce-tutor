// Signed-in Home (Blueprint v2, section 04 and the gap-analysis addendum).
// It answers four questions in order: what to do next, what's planned today,
// how am I doing, and where to get help. Every number comes from recorded
// activity; a learner with no activity gets a first-step screen, never 0% charts.
import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChartLine,
  CircleCheck,
  ClipboardList,
  Lightbulb,
  MessageCircleQuestion,
  PlayCircle,
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
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { EmptyState, MetricCard, Pill, ScorePill, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import { UpdateBanner } from '@/components/UpdateBanner'
import { SubjectCover } from '@/components/ds/SubjectCover'

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
      <div className="mx-auto max-w-3xl pt-4">
        <EmptyState title="We couldn't load your dashboard" body="Check your connection and try again. Your progress is saved." />
      </div>
    )
  }

  if (subjectsLoading || isLoading || !summary || !completed) {
    return (
      <div className="mx-auto max-w-3xl space-y-5" aria-busy="true" aria-label="Loading your dashboard">
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  const started = summary.done > 0 || summary.papersTaken > 0

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <UpdateBanner />

      <header className="space-y-1">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl">
          {started ? `${greeting()}, ${firstName}` : `Welcome, ${firstName}`}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {started ? 'Pick up where you left off.' : summary.next ? 'Your preparation starts with one topic.' : 'Let’s set up your study.'}
        </p>
      </header>

      <AccessNotice profile={profile} />

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

      {!started ? (
        summary.next && (
          <p className="rounded-2xl border border-dashed bg-card/60 p-4 text-sm text-muted-foreground">
            After your first lesson, your progress and study recommendations will appear here.
          </p>
        )
      ) : (
        <>
          <TodayPlan summary={summary} completed={completed} where={where} />
          <Snapshot summary={summary} />
          <Recommended summary={summary} papers={papers.data ?? []} />
          <YourSubjects subjects={summary.subjects} />
          <RecentActivity summary={summary} completed={completed} where={where} />
        </>
      )}

      <QuickAccess topic={summary.next?.topic.name ?? null} />
    </div>
  )
}

/* ── Subscription notice: only when something is about to change or has changed ── */

function AccessNotice({ profile }: { profile: Profile | null | undefined }) {
  const a = checkAccess(profile)
  if (a.reason === 'admin' || a.reason === 'no-profile') return null
  const day = (n: number) => (n === 1 ? 'tomorrow' : `in ${n} days`)
  let title: string
  let body: string
  if (a.reason === 'subscribed') {
    if (a.subscriptionDaysLeft > 3) return null
    title = `Your plan ends ${day(a.subscriptionDaysLeft)}`
    body = 'Renew to keep lessons, practice and the AI tutor open without a break.'
  } else if (a.reason === 'trial') {
    if (a.trialDaysLeft > 2) return null
    title = `Your free trial ends ${day(a.trialDaysLeft)}`
    body = 'Choose a plan to keep lessons, practice and the AI tutor open. Your progress is kept either way.'
  } else {
    title = profile?.subscription_expires_at ? 'Your plan has ended' : 'Your free trial has ended'
    body = 'Lessons, practice and the AI tutor need an active plan. Everything you have done so far is saved.'
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between" role="status">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      <Button asChild size="sm" className="shrink-0 self-start sm:self-auto">
        <Link to="/subscribe">See plans</Link>
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
  const { palette } = subjectTheme(next.subject.slug)

  return (
    <section aria-labelledby="continue-title" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <p className="text-sm font-semibold text-primary">{started ? 'Continue learning' : 'Start your first lesson'}</p>
      <div className="mt-3 flex items-start gap-3">
        <SubjectCover slug={next.subject.slug} shape="square" className="h-14 w-14 shrink-0" />
        <div className="min-w-0">
          <h2 id="continue-title" className="text-xl font-bold leading-snug text-balance">
            {started ? next.lesson.title : next.topic.name}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {started ? `${next.subject.name} · ${next.topic.name}` : next.subject.name}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
          <span>
            Lesson {index} of {total}
            {!started && `: ${next.lesson.title}`}
          </span>
          {next.lesson.est_minutes ? <span aria-hidden>·</span> : null}
          {next.lesson.est_minutes ? <span>about {next.lesson.est_minutes} min</span> : null}
        </p>
        {tp && tp.done > 0 && (
          <ProgressBar value={tp.done} max={tp.total} fill={palette.bar} size="sm" label={`${tp.done} of ${tp.total} lessons done in ${next.topic.name}`} />
        )}
      </div>

      <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
        <Link to="/lesson/$lessonId" params={{ lessonId: next.lesson.id }}>
          {started ? 'Continue' : 'Start lesson'} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
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

  return (
    <section className="space-y-3" aria-labelledby="today-title">
      <div>
        <h2 id="today-title" className="text-lg font-bold tracking-tight">Today's plan</h2>
        <p className="text-sm text-muted-foreground">
          {doneToday.length > 0 && `${doneToday.length} done today`}
          {doneToday.length > 0 && left > 0 && ' · '}
          {left > 0 && `about ${left} min to go`}
          {doneToday.length === 0 && left === 0 && 'Your next lessons, in order'}
        </p>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Lessons completed" value={summary.done} context={`of ${summary.total} in your subjects`} />
        <MetricCard label="Topics finished" value={summary.topicsDone} context="every lesson in the topic done" />
        <MetricCard
          label="Practice score"
          value={summary.avgScore === null ? <span className="text-base font-semibold">Not yet</span> : `${summary.avgScore}%`}
          context={
            summary.avgScore === null ? (
              <Link to="/practice" className="font-medium text-primary hover:underline">Take a practice set</Link>
            ) : (
              `average of ${summary.papersTaken} ${summary.papersTaken === 1 ? 'set' : 'sets'}`
            )
          }
        />
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">This week</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {activeThisWeek} <span className="text-sm font-medium text-muted-foreground">of 7 days</span>
          </p>
          <ol className="mt-2 flex justify-between gap-1" aria-label={`Studied on ${activeThisWeek} of the last 7 days`}>
            {week.map((d) => (
              <li key={d.key} className="flex flex-col items-center gap-1">
                <span className={`h-2.5 w-2.5 rounded-full ${d.active ? 'bg-primary' : 'bg-muted'} ${d.today ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-card' : ''}`} aria-hidden />
                <span className="text-[10px] font-medium text-muted-foreground" aria-hidden>{d.label}</span>
              </li>
            ))}
          </ol>
          {summary.streak >= 2 && <p className="mt-1 text-xs text-muted-foreground">{summary.streak}-day streak</p>}
        </div>
      </div>
    </section>
  )
}

/* ── 4. Recommended next step, with the reason ── */

function Recommended({ summary, papers }: { summary: ProgressSummary; papers: PaperRow[] }) {
  const rec = useMemo(() => recommend(summary, papers), [summary, papers])
  if (!rec) return null
  return (
    <section aria-labelledby="rec-title" className="rounded-2xl border bg-card p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Lightbulb className="h-4 w-4 text-warning" aria-hidden /> Recommended next step
      </p>
      <h2 id="rec-title" className="mt-2 text-lg font-bold leading-snug">{rec.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{rec.why}</p>
      <Button asChild variant="secondary" className="mt-4">
        <Link to="/paper/$paperId" params={{ paperId: rec.paperId }}>{rec.action}</Link>
      </Button>
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
      <ul className="divide-y rounded-2xl border bg-card">
        {available.map((s) => {
          const { palette } = subjectTheme(s.subject.slug)
          return (
            <li key={s.subject.id}>
              <Link to="/subject/$subjectId" params={{ subjectId: s.subject.id }} className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                <SubjectCover slug={s.subject.slug} shape="square" className="h-11 w-11 shrink-0" rounded="rounded-lg" />
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-semibold">{s.subject.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {s.done > 0 ? `${s.done}/${s.total} lessons` : `${s.total} lessons`}
                    </span>
                  </span>
                  {s.done > 0 && <ProgressBar value={s.done} max={s.total} fill={palette.bar} size="sm" label={`${s.subject.name}: ${s.done} of ${s.total} lessons done`} />}
                  {s.next && <span className="block truncate text-xs text-muted-foreground">{s.done > 0 ? 'Next' : 'Start with'}: {s.next.topic.name}</span>}
                </span>
              </Link>
            </li>
          )
        })}
        {soon.map((s) => (
          <li key={s.subject.id} className="flex min-h-14 items-center gap-3 px-4 py-3 opacity-70">
            <SubjectCover slug={s.subject.slug} shape="square" className="h-11 w-11 shrink-0 opacity-60" rounded="rounded-lg" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{s.subject.name}</span>
            <Pill>Lessons coming soon</Pill>
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
          <span className="hidden text-sm font-semibold text-primary sm:inline">Try again</span>
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
  const tile = 'flex min-h-16 items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-brand-soft/30'
  return (
    <section className="space-y-3" aria-labelledby="quick-title">
      <h2 id="quick-title" className="text-lg font-bold tracking-tight">Quick access</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link to="/tutor" search={topic ? { ask: `Explain ${topic} simply, with one worked example.` } : {}} className={tile}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2864c5] text-white"><MessageCircleQuestion className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{topic ? `Ask about ${topic}` : 'Ask the AI tutor'}</span>
            <span className="block text-xs text-muted-foreground">Step-by-step help from the AI tutor</span>
          </span>
        </Link>
        <Link to="/practice" className={tile}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17865b] text-white"><PlayCircle className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Practice</span>
            <span className="block text-xs text-muted-foreground">Exam-style sets with full working</span>
          </span>
        </Link>
        <Link to="/progress" className={tile}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b66a12] text-white"><ChartLine className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Progress</span>
            <span className="block text-xs text-muted-foreground">Every subject and score</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
