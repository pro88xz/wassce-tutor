import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ChevronRight, ClipboardList, Search } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { usePapersForSubjects, useStudentSubjects, type PaperRow } from '@/lib/queries'
import { useScoredAttempts, type ScoredAttempt } from '@/lib/progress'
import { bestByPaper } from '@/lib/papers'
import { PracticeSetRow } from '@/components/ds/PracticeSetRow'
import { subjectTheme } from '@/lib/subject-theme'
import { AccessGate } from '@/components/AccessGate'
import { EmptyState, PageHeader, ScorePill, SectionHeader, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import type { Subject } from '@/lib/types'
import { SubjectCover } from '@/components/ds/SubjectCover'

export const Route = createFileRoute('/practice')({
  head: privateHead('Practice'),
  component: PracticePage,
})

/** How many sets a subject shows before "Show all". */
const PREVIEW = 8

function PracticePage() {
  const { user } = useAuth()
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects(user?.id ?? null)
  const ids = useMemo(() => (subjects ?? []).map((s) => s.id), [subjects])
  const papers = usePapersForSubjects(ids)
  const attempts = useScoredAttempts(user?.id ?? null)

  const best = useMemo(() => bestByPaper(attempts.data ?? []), [attempts.data])

  const loading = subjectsLoading || (ids.length > 0 && papers.isLoading)

  return (
    <AccessGate>
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHeader title="Practice" subtitle="Exam-style questions with full working. Each result shows what to revise next." />

        {loading ? (
          <div className="space-y-3" aria-busy="true">
            <Skeleton className="h-24" />
            <Skeleton className="h-64" />
          </div>
        ) : !subjects || subjects.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="Choose your subjects first"
            body="Pick the WASSCE subjects you're sitting and their practice sets appear here."
            action={<Button asChild><Link to="/onboarding">Choose subjects</Link></Button>}
          />
        ) : papers.error ? (
          <EmptyState title="We couldn't load practice" body="Check your connection and try again." />
        ) : (
          <>
            {attempts.data && attempts.data.length > 0 && <Recent attempts={attempts.data} subjects={subjects} />}
            {(() => {
              const of = (id: string) => (papers.data ?? []).filter((p) => p.subject_id === id)
              const ready = subjects.filter((s) => of(s.id).length > 0)
              const coming = subjects.filter((s) => of(s.id).length === 0)
              return (
                <>
                  {ready.map((s) => <SubjectSets key={s.id} subject={s} papers={of(s.id)} best={best} />)}
                  {coming.length > 0 && (
                    <p className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
                      Practice sets for {listNames(coming.map((s) => s.name))} are being written. Their lessons are ready now in{' '}
                      <Link to="/subjects" className="font-semibold text-primary hover:underline">Subjects</Link>.
                    </p>
                  )}
                </>
              )
            })()}
          </>
        )}
      </div>
    </AccessGate>
  )
}

function Recent({ attempts, subjects }: { attempts: ScoredAttempt[]; subjects: Subject[] }) {
  const names = new Map(subjects.map((s) => [s.id, s.name]))
  const shown = attempts.filter((a) => a.paper).slice(0, 5)
  if (shown.length === 0) return null
  return (
    <section className="space-y-3">
      <SectionHeader title="Recent results" action={{ to: '/progress', label: 'All progress' }} />
      <ul className="divide-y rounded-2xl border bg-card">
        {shown.map((a) => (
          <li key={a.id}>
            <Link to="/paper/$paperId" params={{ paperId: a.paper!.id }} className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{a.paper!.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {names.get(a.paper!.subject_id) ?? 'Practice'} · {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </span>
              <ScorePill score={a.score} total={a.total} />
              <span className="hidden text-sm font-semibold text-primary sm:inline">Try again</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SubjectSets({ subject, papers, best }: { subject: Subject; papers: PaperRow[]; best: Map<string, ScoredAttempt> }) {
  const { palette } = subjectTheme(subject.slug)
  const [all, setAll] = useState(false)
  const [q, setQ] = useState('')
  const filtered = q.trim() ? papers.filter((p) => p.title.toLowerCase().includes(q.trim().toLowerCase())) : papers
  const shown = all || q.trim() ? filtered : filtered.slice(0, PREVIEW)
  const taken = papers.filter((p) => best.has(p.id)).length

  return (
    <section className="space-y-3" aria-labelledby={`sets-${subject.id}`}>
      <div className="flex items-center gap-3">
        <SubjectCover slug={subject.slug} shape="square" className="h-11 w-11 shrink-0" rounded="rounded-lg" />
        <div>
          <h2 id={`sets-${subject.id}`} className="text-lg font-bold tracking-tight">{subject.name}</h2>
          {papers.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {papers.length} {papers.length === 1 ? 'set' : 'sets'}
              {taken > 0 && ` · ${taken} taken`}
            </p>
          )}
        </div>
      </div>

      {papers.length > 0 && (
        <>
          {papers.length > PREVIEW && (
            <label className="relative block">
              <span className="sr-only">Find a {subject.name} topic</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find a topic"
                className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-[15px] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </label>
          )}
          <ul className="divide-y rounded-2xl border bg-card">
            {shown.map((p) => <PracticeSetRow key={p.id} paper={p} best={best.get(p.id)} accent={palette.bar} />)}
            {shown.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">No topic matches “{q}”.</li>}
          </ul>
          {!q.trim() && filtered.length > PREVIEW && (
            <Button variant="outline" className="w-full" onClick={() => setAll((v) => !v)} aria-expanded={all}>
              {all ? 'Show fewer' : `Show all ${filtered.length} sets`}
            </Button>
          )}
        </>
      )}
    </section>
  )
}

/** "A", "A and B", "A, B and C". */
function listNames(names: string[]): string {
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
