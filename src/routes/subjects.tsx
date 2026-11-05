import { createFileRoute, Link } from '@tanstack/react-router'
import { BookCheck, Pencil } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { useStudentSubjects } from '@/lib/queries'
import { useProgress } from '@/lib/progress'
import { SubjectCard } from '@/components/ds/SubjectCard'
import { EmptyState, PageHeader, Skeleton } from '@/components/ds/Primitives'
import { ProgressBar } from '@/components/ds/Progress'

export const Route = createFileRoute('/subjects')({
  head: privateHead('Subjects'),
  component: SubjectsPage,
})

function SubjectsPage() {
  const { user } = useAuth()
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects(user?.id ?? null)
  const { summary, isLoading } = useProgress(user?.id ?? null, subjects)

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <PageHeader
        eyebrow="Your subjects"
        title="What are we studying?"
        subtitle={summary && summary.total > 0 ? `${summary.done} of ${summary.total} lessons done across your subjects` : undefined}
        aside={
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-muted"
          >
            <Pencil className="h-4 w-4" aria-hidden /> Edit
          </Link>
        }
      />

      {summary && summary.total > 0 && (
        <ProgressBar value={summary.done} max={summary.total} size="lg" fill="bg-gradient-to-r from-primary to-violet-500" label="All lessons completed" />
      )}

      {subjectsLoading || isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : !summary || summary.subjects.length === 0 ? (
        <EmptyState
          icon={<BookCheck className="h-6 w-6" />}
          title="No subjects yet"
          body="Pick the WASSCE subjects you're sitting to get started."
          action={<Link to="/onboarding" className="inline-flex h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground">Choose subjects</Link>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {summary.subjects.map((s) => <SubjectCard key={s.subject.id} s={s} />)}
        </div>
      )}
    </div>
  )
}
