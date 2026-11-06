import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CircleCheck, Clock, Flag, MessageCircleQuestion, ShieldCheck } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useAuth } from '@/lib/auth'
import { useLesson, usePapers, useSubject, useTopic } from '@/lib/queries'
import { setForTopic } from '@/lib/papers'
import { Button } from '@/components/ui/button'
import { useCompletedLessons, useSetLessonComplete } from '@/lib/progress'
import { subjectTheme } from '@/lib/subject-theme'
import { LessonView } from '@/components/LessonView'
import { ProgressBar } from '@/components/ds/Progress'
import { EmptyState, Skeleton } from '@/components/ds/Primitives'

const SUPPORT_EMAIL = 'secretsafe.cc@gmail.com'

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
  const { data: papers } = usePapers(topicData?.topic.subject_id ?? null)

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

  const practice = topicData && papers ? setForTopic(papers, { name: topicData.topic.name, subject_id: topicData.topic.subject_id }) : undefined
  const reportHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Lesson problem: ${lesson.title}`)}&body=${encodeURIComponent(
    `Lesson: ${lesson.title}\nTopic: ${topicData?.topic.name ?? ''}\nLink: https://wasscetutor.com/lesson/${lesson.id}\n\nWhat looks wrong:\n`,
  )}`

  return (
    <AccessGate>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* READER HEADER: back, position in topic, progress */}
        <div className="space-y-2">
          <Link to="/topic/$topicId" params={{ topicId: lesson.topic_id }} className="-ml-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {topicData?.topic.name ?? 'Topic'}
          </Link>
          {siblings.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>
                  {subject?.name ? `${subject.name} · ` : ''}Lesson {index + 1} of {siblings.length}
                </span>
                <span>{doneInTopic} of {siblings.length} done</span>
              </div>
              <ProgressBar value={doneInTopic} max={siblings.length} fill={palette.bar} size="sm" label={`${doneInTopic} of ${siblings.length} lessons done in ${topicData?.topic.name ?? 'this topic'}`} />
            </div>
          )}
        </div>

        <header className="space-y-2">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-4xl">{lesson.title}</h1>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {lesson.est_minutes && (
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden /> {lesson.est_minutes} min read</span>
            )}
            {done && <span className="inline-flex items-center gap-1 font-semibold text-success"><CircleCheck className="h-4 w-4" aria-hidden /> Completed</span>}
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" aria-hidden /> {lesson.reviewed_at ? 'Checked by a reviewer' : 'Drafted with AI help, written to the WASSCE syllabus'}
            </span>
          </p>
        </header>

        <article className="prose prose-slate max-w-none text-base leading-[1.6] dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mb-3 prose-h2:mt-8 prose-h2:text-xl prose-p:leading-[1.6] prose-li:my-1 prose-strong:text-foreground prose-code:text-foreground">
          <LessonView content={lesson.content} />
        </article>

        {/* HELP: tutor in context, and a way to report mistakes */}
        <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/tutor"
            search={{
              ask: `I'm studying "${lesson.title}" (${topicData?.topic.name ?? subject?.name ?? 'WASSCE'}). Explain the main idea more simply, with one more example.`,
              about: [subject?.name, topicData?.topic.name].filter(Boolean).join(' · ') || undefined,
            }}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <MessageCircleQuestion className="h-5 w-5" aria-hidden /> Ask the tutor about this lesson
          </Link>
          <a href={reportHref} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Flag className="h-4 w-4" aria-hidden /> Report a mistake
          </a>
        </div>

        {/* COMPLETION */}
        <section aria-label="Lesson completion" className="space-y-4 rounded-2xl border bg-card p-5">
          {done ? (
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="flex items-center gap-2 font-semibold text-success" role="status">
                <CircleCheck className="h-6 w-6" aria-hidden /> Lesson completed
              </p>
              <button
                type="button"
                onClick={() => setComplete.mutate({ lessonId: lesson.id, done: false })}
                className="inline-flex min-h-11 items-center px-2 text-sm text-muted-foreground underline-offset-2 hover:underline"
              >
                Mark as not done
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold">Finished reading?</p>
              <Button size="lg" className="w-full" disabled={setComplete.isPending} onClick={() => setComplete.mutate({ lessonId: lesson.id, done: true })}>
                <CircleCheck className="h-5 w-5" aria-hidden /> Mark lesson complete
              </Button>
            </div>
          )}
          {setComplete.isError && <p className="text-sm text-danger" role="alert">{(setComplete.error as Error).message}</p>}

          {next ? (
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId: next.id }}
              className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${done ? 'border-primary/40 bg-brand-soft/50' : 'hover:bg-muted/50'}`}
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium text-muted-foreground">Next lesson</span>
                <span className="block truncate font-semibold">{next.title}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            </Link>
          ) : (
            done && topicFinished && (
              <div className="space-y-3 rounded-xl bg-success/5 p-4">
                <p className="font-semibold">You have completed {topicData?.topic.name}.</p>
                {practice ? (
                  <>
                    <p className="text-sm text-muted-foreground">A short practice set shows what has stuck and what to revise.</p>
                    <Button asChild>
                      <Link to="/paper/$paperId" params={{ paperId: practice.id }}>
                        Test yourself on {topicData?.topic.name} <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </Button>
                  </>
                ) : (
                  subject && (
                    <Button asChild variant="outline">
                      <Link to="/subject/$subjectId" params={{ subjectId: subject.id }}>Choose your next topic</Link>
                    </Button>
                  )
                )}
              </div>
            )
          )}

          <div className="flex items-center justify-between text-sm">
            {previous ? (
              <Link to="/lesson/$lessonId" params={{ lessonId: previous.id }} className="inline-flex min-h-11 items-center gap-1 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Previous
              </Link>
            ) : <span />}
            {subject && (
              <Link to="/subject/$subjectId" params={{ subjectId: subject.id }} className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">
                All {subject.name} topics
              </Link>
            )}
          </div>
        </section>
      </div>
    </AccessGate>
  )
}
