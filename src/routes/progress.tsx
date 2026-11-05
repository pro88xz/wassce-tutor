import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { BookCheck, ChevronDown, CircleCheck, Flame, PlayCircle, Target, Trophy } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { useStudentSubjects } from '@/lib/queries'
import { useProgress } from '@/lib/progress'
import type { ProgressSummary, SubjectProgress } from '@/lib/progress'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'
import { TopicGroups } from '@/components/ds/TopicGroups'
import { ProgressBar, ProgressRing, percent } from '@/components/ds/Progress'
import { Card, EmptyState, PageHeader, ScorePill, SectionHeader, Skeleton, StatTile } from '@/components/ds/Primitives'

export const Route = createFileRoute('/progress')({
  head: privateHead('Progress'),
  component: ProgressPage,
})

function ProgressPage() {
  const { user } = useAuth()
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects(user?.id ?? null)
  const { summary, isLoading, error } = useProgress(user?.id ?? null, subjects)

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <PageHeader eyebrow="Your progress" title="How you're doing" />

      {error ? (
        <EmptyState title="We couldn't load your progress" body="Check your connection and try again." />
      ) : subjectsLoading || isLoading || !summary ? (
        <ProgressSkeleton />
      ) : summary.subjects.length === 0 ? (
        <EmptyState
          icon={<BookCheck className="h-6 w-6" />}
          title="Pick your subjects to start tracking"
          body="Choose the WASSCE subjects you're sitting and your progress in each one shows up here."
          action={<Link to="/onboarding" className="inline-flex h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground">Choose subjects</Link>}
        />
      ) : (
        <>
          <Overview summary={summary} />
          {summary.next && <ContinueCard summary={summary} />}
          <section className="space-y-3">
            <SectionHeader title="By subject" />
            <SubjectList subjects={summary.subjects} />
          </section>
          <PaperScores summary={summary} />
        </>
      )}
    </div>
  )
}

function Overview({ summary }: { summary: ProgressSummary }) {
  const p = percent(summary.done, summary.total)
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col items-center gap-6 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-6 sm:flex-row">
        <ProgressRing value={summary.done} max={summary.total} size={132} thickness={12} label="Lessons completed across your subjects">
          <span className="text-3xl font-black tabular-nums">{p}%</span>
          <span className="text-xs text-muted-foreground">complete</span>
        </ProgressRing>
        <div className="w-full space-y-1 text-center sm:text-left">
          <p className="text-2xl font-black tracking-tight">
            {summary.done} of {summary.total} lessons
          </p>
          <p className="text-sm text-muted-foreground">
            {summary.done === 0
              ? 'Finish your first lesson and your progress starts here.'
              : `Across ${summary.subjects.length} subject${summary.subjects.length === 1 ? '' : 's'}. Keep going!`}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t p-3 sm:grid-cols-4 [&>div]:border-0 [&>div]:bg-muted/50">
        <StatTile icon={<CircleCheck className="h-4 w-4" />} label="Topics done" value={`${summary.topicsDone}/${summary.topicsWithLessons}`} />
        <StatTile icon={<Flame className="h-4 w-4 text-orange-500" />} label="Streak" value={summary.streak} hint={summary.streak === 1 ? 'day' : 'days'} />
        <StatTile icon={<Target className="h-4 w-4" />} label="Papers" value={summary.papersTaken} hint="taken" />
        <StatTile icon={<Trophy className="h-4 w-4 text-amber-500" />} label="Avg score" value={summary.avgScore === null ? '–' : `${summary.avgScore}%`} />
      </div>
    </Card>
  )
}

function ContinueCard({ summary }: { summary: ProgressSummary }) {
  const next = summary.next!
  const { palette } = subjectTheme(next.subject.slug)
  return (
    <Link
      to="/lesson/$lessonId"
      params={{ lessonId: next.lesson.id }}
      className="group flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md"
    >
      <SubjectIcon slug={next.subject.slug} size="lg" />
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-bold uppercase tracking-wider ${palette.text}`}>
          {summary.done === 0 ? 'Start here' : 'Continue learning'}
        </p>
        <p className="truncate font-bold">{next.lesson.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {next.subject.name} · {next.topic.name}
        </p>
      </div>
      <PlayCircle className="h-9 w-9 shrink-0 text-primary transition group-hover:scale-110" aria-hidden />
    </Link>
  )
}

function SubjectList({ subjects }: { subjects: SubjectProgress[] }) {
  const ordered = [...subjects].sort(
    (a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? '') || b.total - a.total,
  )
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
        <SubjectCard key={s.subject.id} s={s} open={open.has(s.subject.id)} onToggle={() => toggle(s.subject.id)} />
      ))}
    </div>
  )
}

function SubjectCard({ s, open, onToggle }: { s: SubjectProgress; open: boolean; onToggle: () => void }) {
  const { palette } = subjectTheme(s.subject.slug)
  const p = percent(s.done, s.total)
  const panelId = `subject-${s.subject.id}`
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted/40"
      >
        <SubjectIcon slug={s.subject.slug} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate font-bold">{s.subject.name}</p>
            <p className={`shrink-0 text-sm font-black tabular-nums ${palette.text}`}>{s.total > 0 ? `${p}%` : '–'}</p>
          </div>
          <ProgressBar value={s.done} max={s.total} fill={palette.bar} label={`${s.subject.name} lessons completed`} />
          <p className="text-xs text-muted-foreground">
            {s.total > 0 ? (
              <>
                {s.done}/{s.total} lessons · {s.topicsDone}/{s.topicsWithLessons} topics done
              </>
            ) : (
              'Lessons coming soon'
            )}
            {s.avgScore !== null && <> · papers {s.avgScore}%</>}
          </p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div id={panelId} className="space-y-5 border-t bg-muted/20 p-4">
          {s.next && (
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: s.next.lesson.id }}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${palette.soft} ${palette.text}`}
            >
              <span className="truncate">Next: {s.next.lesson.title}</span>
              <PlayCircle className="h-5 w-5 shrink-0" aria-hidden />
            </Link>
          )}
          <TopicGroups groups={s.groups} palette={palette} />
          <Link
            to="/subject/$subjectId"
            params={{ subjectId: s.subject.id }}
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            Open {s.subject.name} →
          </Link>
        </div>
      )}
    </Card>
  )
}

function PaperScores({ summary }: { summary: ProgressSummary }) {
  const attempts = summary.subjects.flatMap((s) => s.attempts.map((a) => ({ a, s: s.subject })))
  attempts.sort((x, y) => y.a.created_at.localeCompare(x.a.created_at))
  return (
    <section className="space-y-3">
      <SectionHeader title="Paper scores" />
      {attempts.length === 0 ? (
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="No papers taken yet"
          body="Practise a past paper from any subject and your scores appear here."
        />
      ) : (
        <Card className="divide-y">
          {attempts.slice(0, 15).map(({ a, s }) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
              <SubjectIcon slug={s.slug} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.paper?.title ?? 'Paper'}</p>
                <p className="text-xs text-muted-foreground">
                  {s.name} · {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <ScorePill score={a.score} total={a.total} />
            </div>
          ))}
        </Card>
      )}
    </section>
  )
}

function ProgressSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading your progress">
      <Skeleton className="h-64" />
      <Skeleton className="h-20" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  )
}
