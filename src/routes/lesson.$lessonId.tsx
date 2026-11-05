import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CircleCheck, Clock, PartyPopper } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useAuth } from '@/lib/auth'
import { useLesson, useSubject, useTopic } from '@/lib/queries'
import { useCompletedLessons, useSetLessonComplete } from '@/lib/progress'
import { subjectTheme } from '@/lib/subject-theme'
import { LessonView } from '@/components/LessonView'
import { ProgressBar } from '@/components/ds/Progress'
import { Card, EmptyState, Skeleton } from '@/components/ds/Primitives'

export const Route = createFileRoute('/lesson/$lessonId')({
  head: privateHead('Lesson'),
  component: LessonPage,
})

function LessonPage() {
  const { lessonId } = useParams({ from: '/lesson/$lessonId' })
  const { user } = useAuth()
  const { data: lesson, isLoading } = useLesson(lessonId)
  const { data: topicData } = useTopic(lesson?.topic_id ?? null)
  const { data: subject } = useSubject(topicData?.topic.subject_id ?? null)
  const { data: completed } = useCompletedLessons(user?.id ?? null)
  const setComplete = useSetLessonComplete(user?.id ?? null)
  const { palette } = subjectTheme(subject?.slug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
      </div>
    )
  }
  if (!lesson) return <EmptyState title="Lesson not found" body="It may have been moved." />

  const siblings = topicData?.lessons ?? []
  const index = siblings.findIndex((l) => l.id === lesson.id)
  const next = index >= 0 ? siblings[index + 1] ?? null : null
  const previous = index > 0 ? siblings[index - 1] : null
  const done = completed?.has(lesson.id) ?? false
  const doneInTopic = siblings.filter((l) => completed?.has(l.id)).length
  const topicFinished = siblings.length > 0 && doneInTopic === siblings.length

  return (
    <AccessGate>
      <div className="mx-auto max-w-2xl space-y-6 pb-12">
        {/* TOP BAR */}
        <div className="space-y-3">
          <Link to="/topic/$topicId" params={{ topicId: lesson.topic_id }} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {topicData?.topic.name ?? 'Topic'}
          </Link>
          {siblings.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span className={palette.text}>
                  {subject?.name ? `${subject.name} · ` : ''}Lesson {index + 1} of {siblings.length}
                </span>
                <span>{doneInTopic}/{siblings.length} done</span>
              </div>
              <ProgressBar value={doneInTopic} max={siblings.length} fill={palette.bar} size="sm" label={`${topicData?.topic.name ?? 'Topic'} lessons completed`} />
            </div>
          )}
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">{lesson.title}</h1>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            {lesson.est_minutes && (
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden /> {lesson.est_minutes} min read</span>
            )}
            {done && <span className="inline-flex items-center gap-1 font-semibold text-emerald-600"><CircleCheck className="h-4 w-4" aria-hidden /> Completed</span>}
          </p>
        </header>

        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-xl prose-p:leading-relaxed prose-li:my-1 prose-strong:text-foreground prose-code:text-foreground">
          <LessonView content={lesson.content} />
        </article>

        {/* COMPLETION */}
        <Card className="space-y-4 p-5">
          {done ? (
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-bold text-emerald-600">
                <CircleCheck className="h-6 w-6" aria-hidden /> Lesson complete
              </p>
              <button
                type="button"
                onClick={() => setComplete.mutate({ lessonId: lesson.id, done: false })}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
              >
                Undo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-bold">Finished this lesson?</p>
              <button
                type="button"
                disabled={setComplete.isPending}
                onClick={() => setComplete.mutate({ lessonId: lesson.id, done: true })}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${palette.gradient} font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60`}
              >
                <CircleCheck className="h-5 w-5" aria-hidden /> Mark as complete
              </button>
            </div>
          )}
          {setComplete.isError && <p className="text-sm text-red-500">{(setComplete.error as Error).message}</p>}

          {next ? (
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: next.id }}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 transition ${done ? `${palette.soft} ${palette.ring}` : 'ring-border hover:bg-muted/50'}`}
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-muted-foreground">Next lesson</span>
                <span className="block truncate font-semibold">{next.title}</span>
              </span>
              <ArrowRight className={`h-5 w-5 shrink-0 ${palette.text}`} aria-hidden />
            </Link>
          ) : (
            done && topicFinished && (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-400">
                <PartyPopper className="h-6 w-6 shrink-0" aria-hidden />
                <p className="text-sm font-semibold">You&rsquo;ve finished {topicData?.topic.name}! Pick your next topic.</p>
              </div>
            )
          )}

          <div className="flex items-center justify-between text-sm">
            {previous ? (
              <Link to="/lesson/$lessonId" params={{ lessonId: previous.id }} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Previous
              </Link>
            ) : <span />}
            {subject && (
              <Link to="/subject/$subjectId" params={{ subjectId: subject.id }} className="font-semibold text-primary hover:underline">
                All {subject.name} topics
              </Link>
            )}
          </div>
        </Card>
      </div>
    </AccessGate>
  )
}
