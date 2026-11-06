import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, CircleCheck, Clock, PlayCircle, RotateCcw } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useAuth } from '@/lib/auth'
import { useSubject, useTopic } from '@/lib/queries'
import { useCompletedLessons } from '@/lib/progress'
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { Card, EmptyState, Skeleton } from '@/components/ds/Primitives'

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

  return (
    <AccessGate>
      <div className="mx-auto max-w-2xl space-y-6 pb-12">
        {subject ? (
          <Link to="/subject/$subjectId" params={{ subjectId: subject.id }} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {subject.name}
          </Link>
        ) : (
          <span className="block h-5" />
        )}

        <Card className="space-y-4 p-5">
          <div className="space-y-1">
            <p className={`text-xs font-bold uppercase tracking-wider ${palette.text}`}>
              {[subject?.name, topic.group_name].filter(Boolean).join(' · ') || 'Topic'}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-balance">{topic.name}</h1>
            {topic.description && <p className="text-muted-foreground">{topic.description}</p>}
          </div>
          {lessons.length > 0 && (
            <div className="space-y-2">
              <ProgressBar value={doneCount} max={lessons.length} fill={palette.bar} size="lg" label={`${topic.name} lessons completed`} />
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{doneCount} of {lessons.length} lessons done</span>
                {minutesLeft > 0 && (
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {minutesLeft} min left</span>
                )}
              </p>
            </div>
          )}
          {cta && (
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: cta.id }}
              className={`flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br ${palette.gradient} px-4 py-3.5 font-semibold text-white shadow-md transition hover:shadow-lg`}
            >
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  {allDone ? 'Topic complete · review' : doneCount === 0 ? 'Start' : 'Continue'}
                </span>
                <span className="block truncate">{cta.title}</span>
              </span>
              {allDone ? <RotateCcw className="h-6 w-6 shrink-0" aria-hidden /> : <PlayCircle className="h-7 w-7 shrink-0" aria-hidden />}
            </Link>
          )}
        </Card>

        <section className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight">Lessons</h2>
          {lessons.length === 0 ? (
            <EmptyState title="No lessons here yet" body="Lessons for this topic are on the way." />
          ) : (
            <ol className="space-y-2">
              {lessons.map((l, i) => {
                const done = isDone(l.id)
                const upNext = !allDone && next?.id === l.id
                return (
                  <li key={l.id}>
                    <Link
                      to="/lesson/$lessonId"
                      params={{ lessonId: l.id }}
                      className={`flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 transition hover:ring-primary/40 ${upNext ? `ring-2 ${palette.ring}` : 'ring-border/60'}`}
                    >
                      {done ? (
                        <CircleCheck className="h-7 w-7 shrink-0 text-emerald-500" aria-label="Done" />
                      ) : (
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${upNext ? `${palette.soft} ${palette.text}` : 'bg-muted text-muted-foreground'}`}>
                          {i + 1}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={`block line-clamp-2 font-semibold ${done ? 'text-muted-foreground' : ''}`}>{l.title}</span>
                        {upNext && <span className={`text-xs font-bold ${palette.text}`}>Up next</span>}
                      </span>
                      {l.est_minutes && <span className="shrink-0 text-xs text-muted-foreground">{l.est_minutes} min</span>}
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>
    </AccessGate>
  )
}
