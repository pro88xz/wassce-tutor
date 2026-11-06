import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useAuth } from '@/lib/auth'
import { usePapers, useSubject } from '@/lib/queries'
import { useProgress } from '@/lib/progress'
import { bestByPaper, topicsToReview } from '@/lib/papers'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { EmptyState, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { TopicGroups } from '@/components/ds/TopicGroups'
import { PracticeSetRow } from '@/components/ds/PracticeSetRow'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/subject/$subjectId')({
  head: privateHead('Subject'),
  component: SubjectPage,
})

/** Practice sets shown here before "See all". */
const SETS_SHOWN = 4

function SubjectPage() {
  const { subjectId } = useParams({ from: '/subject/$subjectId' })
  const { user } = useAuth()
  const { data: subject } = useSubject(subjectId)
  const { data: papers, isLoading: papersLoading } = usePapers(subjectId)
  const { summary } = useProgress(user?.id ?? null, subject ? [subject] : undefined)
  const sp = summary?.subjects[0]
  const { palette } = subjectTheme(subject?.slug)

  const best = useMemo(() => bestByPaper(sp?.attempts ?? []), [sp])
  const review = useMemo(
    () => topicsToReview(papers ?? [], sp?.attempts ?? [], (sp?.topics ?? []).map((t) => ({ id: t.topic.id, name: t.topic.name, subject_id: t.topic.subject_id }))),
    [papers, sp],
  )
  // Sets not yet tried come first, so the short list is always useful.
  const sets = useMemo(() => [...(papers ?? [])].sort((a, b) => Number(best.has(a.id)) - Number(best.has(b.id))), [papers, best])

  const started = !!sp && sp.done > 0

  return (
    <AccessGate>
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/subjects" className="-mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All subjects
        </Link>

        {/* Compact header: identity, progress context, next action */}
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <SubjectIcon slug={subject?.slug} size="lg" />
            <div className="min-w-0">
              <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight">{subject?.name ?? ' '}</h1>
              {sp ? (
                <p className="text-sm text-muted-foreground">
                  {sp.total === 0
                    ? 'Lessons coming soon'
                    : started
                      ? `${sp.done} of ${sp.total} lessons · ${sp.topicsDone} of ${sp.topicsWithLessons} topics completed`
                      : `${sp.total} lessons in ${sp.topicsWithLessons} topics`}
                  {sp.avgScore !== null && ` · practice ${sp.avgScore}%`}
                </p>
              ) : (
                <Skeleton className="mt-1 h-4 w-48" />
              )}
            </div>
          </div>
          {started && <ProgressBar value={sp!.done} max={sp!.total} fill={palette.bar} size="sm" label={`${sp!.subject.name}: ${sp!.done} of ${sp!.total} lessons done`} />}
        </header>

        {sp?.next && (
          <section aria-labelledby="next-title" className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">{started ? 'Continue' : 'Start here'}</p>
              <h2 id="next-title" className="truncate font-bold">{sp.next.lesson.title}</h2>
              <p className="truncate text-sm text-muted-foreground">
                {sp.next.topic.name}
                {sp.next.lesson.est_minutes ? ` · about ${sp.next.lesson.est_minutes} min` : ''}
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link to="/lesson/$lessonId" params={{ lessonId: sp.next.lesson.id }}>
                {started ? 'Continue' : 'Start lesson'} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </section>
        )}

        {/* TOPICS */}
        <section className="space-y-3" aria-labelledby="topics-title">
          <h2 id="topics-title" className="text-lg font-bold tracking-tight">Topics</h2>
          {sp ? (
            <TopicGroups groups={sp.groups} palette={palette} showDescription review={review} />
          ) : (
            <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
          )}
        </section>

        {/* PRACTICE */}
        <section className="space-y-3">
          <SectionHeader title="Practice" action={papers && papers.length > SETS_SHOWN ? { to: '/practice', label: `All ${papers.length} sets` } : undefined} />
          {papersLoading ? (
            <Skeleton className="h-20" />
          ) : sets.length === 0 ? (
            <EmptyState title="Practice is being written" body={`Practice sets for ${subject?.name ?? 'this subject'} are on the way. The lessons above are ready now.`} />
          ) : (
            <ul className="divide-y rounded-2xl border bg-card">
              {sets.slice(0, SETS_SHOWN).map((p) => <PracticeSetRow key={p.id} paper={p} best={best.get(p.id)} accent={palette.bar} />)}
            </ul>
          )}
        </section>
      </div>
    </AccessGate>
  )
}
