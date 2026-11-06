import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowRight, ChevronRight, CircleCheck, Clock, RotateCcw } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useAuth } from '@/lib/auth'
import { usePapers, useSubject, useTopic } from '@/lib/queries'
import { useCompletedLessons, useScoredAttempts } from '@/lib/progress'
import { bestByPaper, latestByPaper, setForTopic } from '@/lib/papers'
import { PracticeSetRow } from '@/components/ds/PracticeSetRow'
import { Button } from '@/components/ui/button'
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { EmptyState, Skeleton } from '@/components/ds/Primitives'

export const Route = createFileRoute('/topic/$topicId')({
  head: privateHead('Topic'),
  component: TopicPage,
})

function TopicPage() {
  const { topicId } = useParams({ from: '/topic/$topicId' })
  const { user } = useAuth()
  const { data, isLoading } = useTopic(topicId)
  const { data: subject } = useSubject(data?.topic.subject_id ?? null)
  const { data: completed } = useCompletedLessons(user?.id ?? null)
  const { palette } = subjectTheme(subject?.slug)
  const { data: papers } = usePapers(data?.topic.subject_id ?? null)
  const { data: attempts } = useScoredAttempts(user?.id ?? null)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-40" />
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
      </div>
    )
  }
  if (!data) return <EmptyState title="Topic not found" body="It may have been moved." />

  const { topic, lessons } = data
  const isDone = (id: string) => completed?.has(id) ?? false
  const doneCount = lessons.filter((l) => isDone(l.id)).length
  const next = lessons.find((l) => !isDone(l.id)) ?? null
  const minutesLeft = lessons.filter((l) => !isDone(l.id)).reduce((n, l) => n + (l.est_minutes ?? 0), 0)
  const allDone = lessons.length > 0 && doneCount === lessons.length
  const cta = allDone ? lessons[0] : next
  const practice = papers ? setForTopic(papers, { name: topic.name, subject_id: topic.subject_id }) : undefined
  const best = bestByPaper(attempts ?? [])
  const last = practice ? latestByPaper(attempts ?? []).get(practice.id) : undefined

  return (
    <AccessGate>
      <div className="mx-auto max-w-2xl space-y-6">
        <nav aria-label="Breadcrumb" className="-mb-2">
          <ol className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link to="/subjects" className="inline-flex min-h-11 items-center hover:text-foreground">Subjects</Link>
            </li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
            {subject ? (
              <li className="shrink-0">
                <Link to="/subject/$subjectId" params={{ subjectId: subject.id }} className="inline-flex min-h-11 items-center hover:text-foreground">{subject.name}</Link>
              </li>
            ) : (
              <li className="h-11" />
            )}
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="truncate font-medium text-foreground">{topic.name}</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <div className="space-y-1">
            {topic.group_name && <p className="text-sm font-medium text-muted-foreground">{topic.group_name}</p>}
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance">{topic.name}</h1>
            {topic.description && <p className="text-[15px] text-muted-foreground">{topic.description}</p>}
          </div>
          {lessons.length > 0 && (
            <div className="space-y-2">
              {doneCount > 0 && <ProgressBar value={doneCount} max={lessons.length} fill={palette.bar} size="sm" label={`${doneCount} of ${lessons.length} lessons done in ${topic.name}`} />}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{doneCount > 0 ? `${doneCount} of ${lessons.length} lessons done` : `${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'}`}</span>
                {minutesLeft > 0 && (
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> about {minutesLeft} min {doneCount > 0 ? 'left' : 'in total'}</span>
                )}
                {allDone && <span className="inline-flex items-center gap-1 font-semibold text-success"><CircleCheck className="h-4 w-4" aria-hidden /> Completed</span>}
              </p>
            </div>
          )}
          {cta && (
            <Button asChild variant={allDone ? 'outline' : 'default'} size="lg" className="w-full sm:w-auto">
              <Link to="/lesson/$lessonId" params={{ lessonId: cta.id }}>
                {allDone ? <><RotateCcw className="h-4 w-4" aria-hidden /> Review from lesson 1</> : <>{doneCount === 0 ? 'Start lesson 1' : 'Continue'} <ArrowRight className="h-4 w-4" aria-hidden /></>}
              </Link>
            </Button>
          )}
        </header>

        <section className="space-y-3" aria-labelledby="lessons-title">
          <h2 id="lessons-title" className="text-lg font-bold tracking-tight">Lessons</h2>
          {lessons.length === 0 ? (
            <EmptyState title="Lessons for this topic are on the way" body="New lessons are added every week. Other topics in this subject are ready now." />
          ) : (
            <ol className="divide-y rounded-2xl border bg-card">
              {lessons.map((l, i) => {
                const done = isDone(l.id)
                const upNext = !allDone && next?.id === l.id
                return (
                  <li key={l.id}>
                    <Link
                      to="/lesson/$lessonId"
                      params={{ lessonId: l.id }}
                      aria-current={upNext ? 'step' : undefined}
                      className={`flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${upNext ? 'bg-brand-soft/40' : ''}`}
                    >
                      {done ? (
                        <CircleCheck className="h-7 w-7 shrink-0 text-success" aria-hidden />
                      ) : (
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${upNext ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} aria-hidden>
                          {i + 1}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block line-clamp-2 font-semibold">{l.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {done ? <span className="font-semibold text-success">Completed</span> : upNext ? <span className="font-semibold text-primary">Up next</span> : 'Not started'}
                          {l.est_minutes ? ` · ${l.est_minutes} min` : ''}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        {practice && (
          <section className="space-y-3" aria-labelledby="practice-title">
            <div>
              <h2 id="practice-title" className="text-lg font-bold tracking-tight">Practice</h2>
              <p className="text-sm text-muted-foreground">
                {last && last.score / Math.max(last.total, 1) < 0.5
                  ? `Review recommended: your last score was ${last.score}/${last.total}. Go back over the lessons, then try the set again.`
                  : allDone
                    ? 'You have finished the lessons. Check what has stuck.'
                    : 'Best taken once you have finished the lessons.'}
              </p>
            </div>
            <ul className="rounded-2xl border bg-card">
              <PracticeSetRow paper={practice} best={best.get(practice.id)} accent={palette.bar} />
            </ul>
          </section>
        )}
      </div>
    </AccessGate>
  )
}
