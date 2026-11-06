import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { FileText, PlayCircle } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useAuth } from '@/lib/auth'
import { usePapers, useSubject } from '@/lib/queries'
import { useProgress } from '@/lib/progress'
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar, percent } from '@/components/ds/Progress'
import { Card, EmptyState, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { TopicGroups } from '@/components/ds/TopicGroups'

export const Route = createFileRoute('/subject/$subjectId')({
  head: privateHead('Subject'),
  component: SubjectPage,
})

function SubjectPage() {
  const { subjectId } = useParams({ from: '/subject/$subjectId' })
  const { user } = useAuth()
  const { data: subject } = useSubject(subjectId)
  const { data: papers, isLoading: papersLoading } = usePapers(subjectId)
  const { summary } = useProgress(user?.id ?? null, subject ? [subject] : undefined)
  const sp = summary?.subjects[0]
  const { icon: Icon, palette } = subjectTheme(subject?.slug)

  return (
    <AccessGate>
      <div className="mx-auto max-w-3xl space-y-8 pb-12">
        <Link to="/subjects" className="inline-flex text-sm font-medium text-muted-foreground hover:text-foreground">
          ← All subjects
        </Link>

        {/* HERO */}
        <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${palette.gradient} p-6 text-white shadow-lg`}>
          <Icon className="pointer-events-none absolute -right-6 -bottom-6 h-40 w-40 text-white/10" aria-hidden />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">WASSCE subject</p>
                <h1 className="text-3xl font-bold tracking-tight">{subject?.name ?? ' '}</h1>
              </div>
            </div>
            {sp ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold">
                    {sp.total > 0 ? `${sp.done} of ${sp.total} lessons` : 'Lessons coming soon'}
                  </span>
                  {sp.total > 0 && <span className="text-2xl font-bold tabular-nums">{percent(sp.done, sp.total)}%</span>}
                </div>
                <ProgressBar value={sp.done} max={sp.total} size="lg" fill="bg-white" track="bg-white/25" label={`${sp.subject.name} lessons completed`} />
                <p className="text-sm text-white/85">
                  {sp.topicsDone}/{sp.topicsWithLessons} topics done
                  {sp.minutesLeft > 0 && ` · about ${Math.round(sp.minutesLeft / 60)}h of lessons left`}
                  {sp.avgScore !== null && ` · papers ${sp.avgScore}%`}
                </p>
              </div>
            ) : (
              <Skeleton className="h-16 bg-white/20" />
            )}
            {sp?.next && (
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: sp.next.lesson.id }}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-md transition hover:shadow-lg"
              >
                <span className="min-w-0">
                  <span className={`block text-xs font-bold uppercase tracking-wider ${palette.text}`}>
                    {sp.done === 0 ? 'Start here' : 'Continue'}
                  </span>
                  <span className="block truncate font-semibold">{sp.next.lesson.title}</span>
                </span>
                <PlayCircle className={`h-8 w-8 shrink-0 ${palette.text}`} aria-hidden />
              </Link>
            )}
          </div>
        </section>

        {/* TOPICS */}
        <section className="space-y-4">
          <SectionHeader title="Topics" />
          {sp ? (
            <TopicGroups groups={sp.groups} palette={palette} showDescription />
          ) : (
            <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
          )}
        </section>

        {/* PAPERS */}
        <section className="space-y-3">
          <SectionHeader title="Practice papers" />
          {papersLoading ? (
            <Skeleton className="h-20" />
          ) : !papers || papers.length === 0 ? (
            <EmptyState icon={<FileText className="h-6 w-6" />} title="No papers yet" body={`Past papers for ${subject?.name ?? 'this subject'} are on the way.`} />
          ) : (
            <Card className="divide-y">
              {papers.map((p) => (
                <Link
                  key={p.id}
                  to="/paper/$paperId"
                  params={{ paperId: p.id }}
                  className="flex items-center gap-4 p-4 transition hover:bg-muted/40"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${palette.soft} ${palette.text}`}>
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[p.paper_type, p.year].filter(Boolean).join(' · ')}
                      {p.description ? ` — ${p.description}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-bold">{p.question_count} Qs</span>
                </Link>
              ))}
            </Card>
          )}
        </section>
      </div>
    </AccessGate>
  )
}
