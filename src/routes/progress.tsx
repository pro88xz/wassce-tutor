import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowRight, BookCheck, ChevronDown, ChevronRight } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { usePapersForSubjects, useStudentSubjects, type PaperRow } from '@/lib/queries'
import { localDay, useProgress } from '@/lib/progress'
import type { ProgressSummary, SubjectProgress } from '@/lib/progress'
import { STRONG_PCT, topicScores, topicsToReview } from '@/lib/papers'
import { subjectTheme } from '@/lib/subject-theme'
import { TopicGroups } from '@/components/ds/TopicGroups'
import { ProgressBar } from '@/components/ds/Progress'
import { percent } from '@/components/ds/percent'
import { EmptyState, MetricCard, PageHeader, ScorePill, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import { SubjectCover } from '@/components/ds/SubjectCover'

export const Route = createFileRoute('/progress')({
  head: privateHead('Progress'),
  component: ProgressPage,
})

function ProgressPage() {
  const { user } = useAuth()
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects(user?.id ?? null)
  const { summary, isLoading, error } = useProgress(user?.id ?? null, subjects)
  const papers = usePapersForSubjects((subjects ?? []).map((s) => s.id))
  const started = !!summary && (summary.done > 0 || summary.papersTaken > 0)

  return (
    <div className="app-page mx-auto w-full max-w-6xl space-y-7">
      <PageHeader title="Progress" subtitle="What you've completed, and how your practice is going." />

      {error ? (
        <EmptyState title="We couldn't load your progress" body="Check your connection and try again. Nothing you've done is lost." />
      ) : subjectsLoading || isLoading || !summary ? (
        <ProgressSkeleton />
      ) : summary.subjects.length === 0 ? (
        <EmptyState
          icon={<BookCheck className="h-6 w-6" />}
          title="Pick your subjects to start tracking"
          body="Choose the WASSCE subjects you're sitting and your progress in each one shows up here."
          action={<Button asChild><Link to="/onboarding">Choose subjects</Link></Button>}
        />
      ) : !started ? (
        <EmptyState
          icon={<BookCheck className="h-6 w-6" />}
          title="Your progress starts with your first lesson"
          body="Each lesson you finish and each practice set you take is recorded here, subject by subject."
          action={
            summary.next && (
              <Button asChild>
                <Link to="/lesson/$lessonId" params={{ lessonId: summary.next.lesson.id }}>
                  Start {summary.next.topic.name} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <Overview summary={summary} />
          <FocusNext summary={summary} papers={papers.data ?? []} />
          <section className="space-y-3">
            <SectionHeader title="By subject" />
            <SubjectList subjects={summary.subjects} papers={papers.data ?? []} />
          </section>
          <PracticeResults summary={summary} />
        </>
      )}
    </div>
  )
}

/** Four metrics, each with what it measures. Nothing is shown that wasn't recorded. */
function Overview({ summary }: { summary: ProgressSummary }) {
  const activeThisWeek = useMemo(() => {
    let n = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      if (summary.activeDays.has(localDay(d.toISOString()))) n++
    }
    return n
  }, [summary.activeDays])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricCard label="Lessons completed" value={summary.done} context={`of ${summary.total} in your subjects (${percent(summary.done, summary.total)}%)`} />
      <MetricCard label="Topics completed" value={summary.topicsDone} context={`of ${summary.topicsWithLessons} · every lesson in the topic done`} />
      <MetricCard
        label="Practice score"
        value={summary.avgScore === null ? <span className="text-base font-semibold">Not yet</span> : `${summary.avgScore}%`}
        context={summary.avgScore === null ? 'Take a practice set to see it' : `correct answers across ${summary.papersTaken} ${summary.papersTaken === 1 ? 'set' : 'sets'}`}
      />
      <MetricCard
        label="Active days"
        value={activeThisWeek}
        context={summary.streak >= 2 ? `in the last 7 days · ${summary.streak}-day streak` : 'in the last 7 days'}
      />
    </div>
  )
}

function SubjectList({ subjects, papers }: { subjects: SubjectProgress[]; papers: PaperRow[] }) {
  const ordered = [...subjects].sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? '') || b.total - a.total)
  const [open, setOpen] = useState<Set<string>>(() => new Set(ordered[0] ? [ordered[0].subject.id] : []))
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  return (
    <div className="space-y-3">
      {ordered.map((s) => (
        <SubjectPanel key={s.subject.id} s={s} papers={papers} open={open.has(s.subject.id)} onToggle={() => toggle(s.subject.id)} />
      ))}
    </div>
  )
}

function SubjectPanel({ s, papers, open, onToggle }: { s: SubjectProgress; papers: PaperRow[]; open: boolean; onToggle: () => void }) {
  const { palette } = subjectTheme(s.subject.slug)
  const panelId = `subject-${s.subject.id}`
  const review = useMemo(
    () => topicsToReview(papers, s.attempts, s.topics.map((t) => ({ id: t.topic.id, name: t.topic.name, subject_id: t.topic.subject_id }))),
    [papers, s],
  )
  if (s.total === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border bg-card/60 p-4">
        <SubjectCover slug={s.subject.slug} shape="thumb" className="h-12 w-16 shrink-0 opacity-60" rounded="rounded-lg" />
        <p className="flex-1 font-semibold text-muted-foreground">{s.subject.name}</p>
        <p className="text-xs text-muted-foreground">Lessons in preparation</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-16 w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/40"
      >
        <SubjectCover slug={s.subject.slug} shape="thumb" className="h-14 w-20 shrink-0" rounded="rounded-lg" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate font-bold">{s.subject.name}</p>
            {s.done > 0 && <p className={`shrink-0 text-sm font-bold tabular-nums ${palette.text}`}>{percent(s.done, s.total)}%</p>}
          </div>
          {s.done > 0 && <ProgressBar value={s.done} max={s.total} fill={palette.bar} size="sm" label={`${s.subject.name}: ${s.done} of ${s.total} lessons done`} />}
          <p className="text-xs text-muted-foreground">
            {s.done > 0 ? `${s.done} of ${s.total} lessons · ${s.topicsDone} of ${s.topicsWithLessons} topics completed` : `Not started · ${s.total} lessons`}
            {s.avgScore !== null && ` · practice ${s.avgScore}%`}
            {review.size > 0 && <span className="font-semibold text-warning"> · {review.size} to review</span>}
          </p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div id={panelId} className="space-y-5 border-t bg-muted/20 p-4">
          <TopicGroups groups={s.groups} palette={palette} review={review} />
          <Link to="/subject/$subjectId" params={{ subjectId: s.subject.id }} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Open {s.subject.name} <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}

/**
 * The topics to work on next: every practised topic scored by its latest
 * practice set, weakest first, with the lesson and the set one tap away.
 */
function FocusNext({ summary, papers }: { summary: ProgressSummary; papers: PaperRow[] }) {
  const scores = useMemo(
    () => topicScores(papers, summary.subjects.flatMap((s) => s.attempts), summary.subjects.map((s) => ({ subject: s.subject, topics: s.topics }))),
    [papers, summary],
  )
  if (scores.length === 0) return null
  const weak = scores.filter((t) => t.pct < STRONG_PCT).slice(0, 5)
  const strong = scores.filter((t) => t.pct >= STRONG_PCT)
  return (
    <section className="space-y-3" aria-labelledby="focus-title">
      <div>
        <h2 id="focus-title" className="text-lg font-bold tracking-tight">Focus next: your weakest topics</h2>
        <p className="text-sm text-muted-foreground">From your latest practice score in each topic. Revise the lesson, then try the set again.</p>
      </div>
      {weak.length === 0 ? (
        <div className="rounded-2xl border border-success/30 bg-success/5 p-4 text-sm">
          <p className="font-semibold">No weak topics right now.</p>
          <p className="text-muted-foreground">
            Every topic you have practised scored {STRONG_PCT}% or more on your latest try ({strong.length} {strong.length === 1 ? 'topic' : 'topics'}). Practise a new topic to keep it that way.
          </p>
        </div>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {weak.map((t) => (
            <li key={t.topic.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <SubjectCover slug={t.subject.slug} shape="thumb" className="h-11 w-14 shrink-0" rounded="rounded-md" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{t.topic.name}</span>
                <span className="block text-xs text-muted-foreground">{t.subject.name} · latest {t.score}/{t.total}</span>
              </span>
              <ScorePill score={t.score} total={t.total} />
              <span className="flex w-full gap-2 sm:w-auto">
                <Link to="/topic/$topicId" params={{ topicId: t.topic.id }} className="flex min-h-10 flex-1 items-center justify-center rounded-lg border px-3 text-sm font-semibold hover:border-primary/40 sm:flex-none">
                  Revise
                </Link>
                <Link to="/paper/$paperId" params={{ paperId: t.paperId }} className="flex min-h-10 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-brand-strong sm:flex-none">
                  Practise again
                </Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function PracticeResults({ summary }: { summary: ProgressSummary }) {
  const attempts = summary.subjects.flatMap((s) => s.attempts.map((a) => ({ a, s: s.subject })))
  attempts.sort((x, y) => y.a.created_at.localeCompare(x.a.created_at))
  return (
    <section className="space-y-3">
      <SectionHeader title="Practice results" action={{ to: '/practice', label: 'Practice' }} />
      {attempts.length === 0 ? (
        <EmptyState
          title="No practice sets taken yet"
          body="Each practice set marks your answers and shows the working. Your results appear here."
          action={<Button asChild variant="outline"><Link to="/practice">Find a practice set</Link></Button>}
        />
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {attempts.slice(0, 15).map(({ a, s }) => {
            const body = (
              <>
                <SubjectCover slug={s.slug} shape="thumb" className="h-11 w-14 shrink-0" rounded="rounded-md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{a.paper?.title ?? 'Practice set'}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.name} · {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </span>
                <ScorePill score={a.score} total={a.total} />
              </>
            )
            return (
              <li key={a.id}>
                {a.paper ? (
                  <Link to="/paper/$paperId" params={{ paperId: a.paper.id }} className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                    {body}
                    <span className="hidden text-sm font-semibold text-primary sm:inline">Try again</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                ) : (
                  <div className="flex min-h-14 items-center gap-3 px-4 py-3">{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function ProgressSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading your progress">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  )
}
