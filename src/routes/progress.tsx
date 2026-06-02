import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useAttempts } from '@/lib/queries'

export const Route = createFileRoute('/progress')({
  component: ProgressPage,
})

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function ProgressPage() {
  const { user } = useAuth()
  const { data: attempts, isLoading } = useAttempts(user?.id ?? null)

  // Compute simple stats
  const totalQuizzes = attempts?.length ?? 0
  const totalQuestions = attempts?.reduce((sum, a) => sum + (a.total ?? 0), 0) ?? 0
  const totalCorrect = attempts?.reduce((sum, a) => sum + (a.score ?? 0), 0) ?? 0
  const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Your progress</p>
        <h1 className="text-3xl font-black tracking-tight">How you're doing</h1>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading your activity…</p>
      ) : !attempts || attempts.length === 0 ? (
        <div className="rounded-2xl border bg-card p-6 text-center space-y-2">
          <p className="font-semibold">No quizzes taken yet</p>
          <p className="text-sm text-muted-foreground">
            Open a subject, take a paper, and your scores will show up here.
          </p>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-card p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Quizzes</p>
              <p className="mt-1 text-2xl font-black">{totalQuizzes}</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Questions</p>
              <p className="mt-1 text-2xl font-black">{totalQuestions}</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg score</p>
              <p className={`mt-1 text-2xl font-black ${avgScore >= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {avgScore}%
              </p>
            </div>
          </div>

          {/* HISTORY */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Recent quizzes</h2>
            <div className="space-y-2">
              {attempts.map((a) => {
                const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border bg-card px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {a.paper?.subject?.name ?? 'Subject'} — {a.paper?.title ?? 'Paper'}
                      </p>
                      <p className="text-xs text-muted-foreground">{relativeTime(a.created_at)}</p>
                    </div>
                    <div
                      className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        pct >= 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {a.score}/{a.total}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
