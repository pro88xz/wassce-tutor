import { createFileRoute, Link } from '@tanstack/react-router'
import { BookCheck, Pencil } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { useStudentSubjects } from '@/lib/queries'
import { useProgress } from '@/lib/progress'
import { SubjectCard, SubjectSoonRow } from '@/components/ds/SubjectCard'
import { EmptyState, PageHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/subjects')({
  head: privateHead('Subjects'),
  component: SubjectsPage,
})

function SubjectsPage() {
  const { user } = useAuth()
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects(user?.id ?? null)
  const { summary, isLoading, error } = useProgress(user?.id ?? null, subjects)

  const available = summary?.subjects.filter((s) => s.total > 0) ?? []
  const soon = summary?.subjects.filter((s) => s.total === 0) ?? []
  const n = summary?.subjects.length ?? 0
  const subtitle = !summary
    ? undefined
    : summary.done > 0
      ? `${summary.done} of ${summary.total} lessons done across your ${n} ${n === 1 ? 'subject' : 'subjects'}.`
      : available.length > 0
        ? `Your ${n} WASSCE ${n === 1 ? 'subject' : 'subjects'}. Pick one and start with its first topic.`
        : undefined

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Subjects"
        subtitle={subtitle}
        aside={
          <Button asChild variant="ghost" size="sm">
            <Link to="/onboarding">
              <Pencil className="h-4 w-4" aria-hidden /> Edit
            </Link>
          </Button>
        }
      />

      {error ? (
        <EmptyState title="We couldn't load your subjects" body="Check your connection and try again. Your progress is saved." />
      ) : subjectsLoading || isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : !summary || summary.subjects.length === 0 ? (
        <EmptyState
          icon={<BookCheck className="h-6 w-6" />}
          title="No subjects yet"
          body="Pick the WASSCE subjects you're sitting to get started."
          action={<Button asChild><Link to="/onboarding">Choose subjects</Link></Button>}
        />
      ) : (
        <>
          {available.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {available.map((s) => <SubjectCard key={s.subject.id} s={s} />)}
            </div>
          )}
          {soon.length > 0 && (
            <section className="space-y-2" aria-labelledby="soon-title">
              <h2 id="soon-title" className="text-sm font-semibold text-muted-foreground">Lessons on the way</h2>
              <ul className="divide-y rounded-2xl border bg-card/60">
                {soon.map((s) => <SubjectSoonRow key={s.subject.id} s={s} />)}
              </ul>
              <p className="px-1 text-xs text-muted-foreground">New lessons are added every week. These subjects open here as soon as their first lessons are ready.</p>
            </section>
          )}
        </>
      )}
    </div>
  )
}
