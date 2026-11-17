import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, ChevronRight, ClipboardList, Lock, Search, Timer } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { usePapersForSubjects, useStudentSubjects, type PaperRow } from '@/lib/queries'
import { useScoredAttempts, type ScoredAttempt } from '@/lib/progress'
import { bestByPaper, setName } from '@/lib/papers'
import { PracticeSetRow } from '@/components/ds/PracticeSetRow'
import { subjectTheme } from '@/lib/subject-theme'
import { FROM_PRICE } from '@/lib/plans'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { formatMinutes, mockMinutes } from '@/lib/mock-exams'
import { useAccess } from '@/lib/useAccess'
import { isMockPaper, paperLocked } from '@/lib/access'
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
      <div className="app-page mx-auto w-full max-w-6xl space-y-7">
        <PageHeader title="Practice" subtitle={`${PRACTICE_TOTAL.toLocaleString('en')} exam-style questions, marked instantly with the full working.`} />

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
            {(() => {
              const of = (id: string) => (papers.data ?? []).filter((p) => p.subject_id === id)
              const ready = subjects.filter((s) => of(s.id).length > 0)
              const coming = subjects.filter((s) => of(s.id).length === 0)
              return (
                <>
                  {ready.length > 0 && <Browser subjects={ready} of={of} best={best} attempts={attempts.data ?? []} />}
                  {attempts.data && attempts.data.length > 0 && <Recent attempts={attempts.data} subjects={subjects} />}
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
  )
}

/**
 * The practice sets, one subject at a time: a card with the set to do next,
 * a row of subject tabs, then that subject's sets. Opens on the subject the
 * student practised last.
 */
function Browser({ subjects, of, best, attempts }: { subjects: Subject[]; of: (id: string) => PaperRow[]; best: Map<string, ScoredAttempt>; attempts: ScoredAttempt[] }) {
  const { access } = useAccess()
  const lastSubject = attempts.find((a) => a.paper && subjects.some((s) => s.id === a.paper!.subject_id))?.paper?.subject_id
  const [activeId, setActiveId] = useState(lastSubject ?? subjects[0].id)
  const active = subjects.find((s) => s.id === activeId) ?? subjects[0]
  // A subject's timed mock exam has its own card; the list below is its topic sets.
  const mock = of(active.id).find(isMock)
  const papers = of(active.id).filter((p) => !isMock(p))

  // Up next: the first topic set not yet taken in this subject (never the
  // mock: a 50-question exam is not a first step). Every set is free.
  const next = papers.find((p) => !best.has(p.id))
  const nextSubject = active
  const theme = subjectTheme(active.slug)

  // Keep the chosen tab in view in the sideways rail on phones (without
  // scrolling the page itself).
  const activeTab = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const tab = activeTab.current
    const rail = tab?.parentElement
    if (tab && rail && rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: Math.max(0, tab.offsetLeft - rail.offsetLeft - 12), behavior: 'smooth' })
  }, [active.id])

  return (
    <>
      <section aria-labelledby="up-next-title" className="relative isolate overflow-hidden rounded-3xl bg-[#1b1240] text-white shadow-[0_30px_60px_-30px_rgba(27,18,64,.8)]">
        <div className="grid sm:grid-cols-[minmax(0,1fr)_14rem] lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="relative h-28 sm:order-2 sm:h-full sm:min-h-[12rem]">
            <SubjectCover slug={nextSubject.slug} shape="wide" rounded="rounded-none" sizes="(min-width: 640px) 288px, 100vw" className="absolute inset-0 h-full w-full" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1b1240] via-[#1b1240]/30 to-transparent sm:bg-gradient-to-r sm:via-[#1b1240]/10" />
          </div>
          <div className="relative -mt-8 p-5 sm:mt-0 sm:p-7">
            {next ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">
                  {best.size === 0 ? 'Start here' : 'Up next'} · {nextSubject.name}
                </p>
                <h2 id="up-next-title" className="mt-1.5 text-2xl font-bold leading-tight tracking-tight">{setName(next.title)}</h2>
                <p className="mt-1 text-sm text-white/70">{next.question_count} questions · free · marked as you go, with the working</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <Button asChild size="lg" className="w-full bg-white text-[#1b1240] hover:bg-white/90 sm:w-auto">
                    <Link to="/paper/$paperId" params={{ paperId: next.id }}>Start set <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">{active.name}</p>
                <h2 id="up-next-title" className="mt-1.5 text-2xl font-bold leading-tight tracking-tight">Every {active.name} set taken</h2>
                <p className="mt-1 text-sm text-white/70">Retake your lowest scores below to check the topics have stuck.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {subjects.length > 1 && (
        <div role="tablist" aria-label="Subjects" className="site-rail gap-2 pb-1 sm:flex-wrap">
          {subjects.map((s) => {
            const on = s.id === active.id
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                ref={on ? activeTab : undefined}
                aria-selected={on}
                onClick={() => setActiveId(s.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold transition ${
                  on ? 'bg-foreground text-background shadow-md' : 'bg-card text-foreground ring-1 ring-border hover:ring-primary/40'
                }`}
              >
                <SubjectCover slug={s.slug} shape="thumb" className="h-8 w-8 shrink-0" rounded="rounded-full" />
                {s.name}
                <span className={`text-xs font-medium tabular-nums ${on ? 'text-background/70' : 'text-muted-foreground'}`}>{of(s.id).filter((p) => !isMock(p)).length}</span>
              </button>
            )
          })}
        </div>
      )}

      <div role="tabpanel" aria-label={active.name} className="space-y-6">
        {mock && <MockCard paper={mock} subject={active.name} best={best.get(mock.id)} locked={paperLocked(access, mock)} />}
        <SubjectSets key={active.id} subject={active} papers={papers} best={best} accent={theme.palette.bar} />
      </div>
    </>
  )
}

const isMock = isMockPaper

/** A subject's timed WASSCE Paper 1: the length, the clock, and the best score so far. */
function MockCard({ paper, subject, best, locked }: { paper: PaperRow; subject: string; best?: ScoredAttempt; locked: boolean }) {
  const minutes = mockMinutes(paper.id)
  return (
    <section aria-labelledby="mock-title" className="site-brand-panel relative isolate overflow-hidden rounded-3xl p-5 sm:p-7">
      <span aria-hidden className="absolute -right-12 -top-12 -z-10 h-44 w-44 rounded-full border-[22px] border-white/10" />
      <span aria-hidden className="absolute -bottom-10 right-16 -z-10 hidden h-24 w-24 rounded-full bg-[#ffd166]/85 sm:block" />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#ffd166]">
            <Timer className="h-4 w-4" aria-hidden /> Timed mock exam
          </p>
          <h2 id="mock-title" className="mt-1.5 text-2xl font-bold leading-tight tracking-tight">{subject} Paper 1</h2>
          <p className="mt-1 text-sm text-white/80">
            {paper.question_count} questions{minutes ? ` · ${formatMinutes(minutes)}, the time WAEC gives` : ''} · topics to revise when you finish
          </p>
          {best && (
            <p className="mt-2 text-sm font-semibold">
              Best so far: {best.score}/{best.total} ({Math.round((best.score / best.total) * 100)}%)
            </p>
          )}
        </div>
        {locked ? (
          <Button asChild size="lg" className="w-full shrink-0 bg-[#ffd166] text-[#1b1240] hover:bg-[#ffd166]/90 sm:w-auto">
            <Link to="/subscribe" search={{ plan: 'year' }}><Lock className="h-4 w-4" aria-hidden /> Unlock mock exams · from {FROM_PRICE} NLe</Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full shrink-0 bg-white text-[#3a1d9e] hover:bg-white/90 sm:w-auto">
            <Link to="/paper/$paperId" params={{ paperId: paper.id }}>{best ? 'Sit it again' : 'Start the mock'} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </Button>
        )}
      </div>
    </section>
  )
}

function Recent({ attempts, subjects }: { attempts: ScoredAttempt[]; subjects: Subject[] }) {
  const names = new Map(subjects.map((s) => [s.id, s.name]))
  const shown = attempts.filter((a) => a.paper).slice(0, 4)
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

function SubjectSets({ subject, papers, best, accent }: { subject: Subject; papers: PaperRow[]; best: Map<string, ScoredAttempt>; accent: string }) {
  const [all, setAll] = useState(false)
  const [q, setQ] = useState('')
  const filtered = q.trim() ? papers.filter((p) => p.title.toLowerCase().includes(q.trim().toLowerCase())) : papers
  const shown = all || q.trim() ? filtered : filtered.slice(0, PREVIEW)
  const taken = papers.filter((p) => best.has(p.id)).length

  return (
    <section className="space-y-3" aria-labelledby={`sets-${subject.id}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`sets-${subject.id}`} className="text-lg font-bold tracking-tight">{subject.name} sets</h2>
        <p className="text-sm text-muted-foreground">
          {papers.length} {papers.length === 1 ? 'set' : 'sets'}
          {taken > 0 && ` · ${taken} taken`}
        </p>
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
            {shown.map((p) => (
              <PracticeSetRow key={p.id} paper={p} best={best.get(p.id)} accent={accent} />
            ))}
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
