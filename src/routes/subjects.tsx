import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useStudentSubjects } from '@/lib/queries'

export const Route = createFileRoute('/subjects')({
  component: SubjectsPage,
})

function SubjectsPage() {
  const { user } = useAuth()
  const { data: subjects, isLoading } = useStudentSubjects(user?.id ?? null)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Your subjects</p>
          <h1 className="text-3xl font-black tracking-tight">Pick one to study</h1>
        </div>
        <Link to="/onboarding" className="text-sm text-primary hover:underline">
          Edit
        </Link>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading subjects…</p>
      ) : !subjects || subjects.length === 0 ? (
        <div className="rounded-2xl border bg-card p-6 text-center">
          <p className="text-muted-foreground">No subjects yet.</p>
          <Link to="/onboarding" className="text-sm text-primary hover:underline mt-2 inline-block">
            Pick your subjects →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to="/subject/$subjectId"
              params={{ subjectId: s.id }}
              className="group flex aspect-square flex-col justify-between rounded-2xl border bg-card p-4 text-left transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold leading-tight">{s.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Tap to study →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
