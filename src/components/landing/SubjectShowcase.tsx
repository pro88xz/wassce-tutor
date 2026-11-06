// Subjects on the homepage, presented like products: every subject has its
// own cover, real counts, and a place in a clear hierarchy (core subjects
// featured, faculty subjects as cards, electives as compact rows).
import { useState } from 'react'
import { ArrowRight, ChevronRight, ClipboardCheck } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { subjectPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { SubjectCover } from '@/components/ds/SubjectCover'

type Role = 'core' | 'faculty' | 'elective'

function meta(s: SubjectSummary) {
  if (!s.topicCount) return 'Syllabus coming soon'
  return [`${s.topicCount} topics`, s.lessonCount > 0 ? `${s.lessonCount} lessons` : 'lessons coming soon'].join(' · ')
}

function PracticeBadge({ slug }: { slug: string }) {
  const n = PRACTICE_QUESTIONS[slug]
  if (!n) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
      <ClipboardCheck className="h-3.5 w-3.5" aria-hidden /> {n} practice questions
    </span>
  )
}

/** Large card for the core subjects everyone sits. */
function FeatureCard({ s }: { s: SubjectSummary }) {
  return (
    <a href={subjectPath(s.slug)} className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40">
      <SubjectCover slug={s.slug} shape="wide" rounded="rounded-none" className="aspect-[16/7] w-full sm:aspect-[16/8]" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-primary">Core · every student</span>
        </div>
        <h4 className="text-xl font-bold tracking-tight">{s.name}</h4>
        <p className="text-sm text-muted-foreground">{meta(s)}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <PracticeBadge slug={s.slug} />
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </a>
  )
}

/** Faculty subject: a row with a square cover on phones, a cover card from 640 px. */
function SubjectCard({ s }: { s: SubjectSummary }) {
  const ready = s.topicCount > 0
  const body = (
    <>
      <SubjectCover slug={s.slug} shape="square" rounded="rounded-xl sm:rounded-none" className="h-16 w-16 shrink-0 sm:hidden" />
      <SubjectCover slug={s.slug} shape="wide" rounded="rounded-none" className="hidden aspect-[16/9] w-full sm:block" />
      <span className="flex min-w-0 flex-1 flex-col gap-1 sm:p-4">
        <span className="truncate font-bold">{s.name}</span>
        <span className="text-xs text-muted-foreground">{meta(s)}</span>
        <span className="hidden pt-1 sm:block"><PracticeBadge slug={s.slug} /></span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground sm:hidden" aria-hidden />
    </>
  )
  const cls = 'flex items-center gap-3 rounded-2xl border bg-card p-3 transition-colors sm:flex-col sm:items-stretch sm:gap-0 sm:overflow-hidden sm:p-0'
  return ready ? (
    <a href={subjectPath(s.slug)} className={`${cls} hover:border-primary/40`}>{body}</a>
  ) : (
    <div className={`${cls} opacity-70`}>{body}</div>
  )
}

/** Elective: compact row with a small cover, inside a tinted panel. */
function ElectiveRow({ s }: { s: SubjectSummary }) {
  const ready = s.topicCount > 0
  const inner = (
    <>
      <SubjectCover slug={s.slug} shape="square" className="h-12 w-12 shrink-0" rounded="rounded-lg" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{s.name}</span>
        <span className="block text-xs text-muted-foreground">{meta(s)}</span>
      </span>
      {ready && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
    </>
  )
  return ready ? (
    <a href={subjectPath(s.slug)} className="flex min-h-16 items-center gap-3 rounded-xl bg-card p-2.5 pr-3 transition-colors hover:bg-card/70">{inner}</a>
  ) : (
    <div className="flex min-h-16 items-center gap-3 rounded-xl bg-card/60 p-2.5 pr-3 opacity-80">{inner}</div>
  )
}

export function SubjectShowcase({ subjects }: { subjects: SubjectSummary[] }) {
  const faculties = [...new Map(subjects.flatMap((s) => s.faculties.map((f) => [f.faculty.id, f.faculty] as const))).values()].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const [active, setActive] = useState(faculties[0]?.id ?? '')

  return (
    <section className="space-y-6" aria-labelledby="subjects-heading">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <p className="text-sm font-semibold text-primary">Every subject</p>
        <h2 id="subjects-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">
          Your WASSCE subjects, topic by topic
        </h2>
        <p className="text-[15px] text-muted-foreground">Pick your faculty to see the subjects you sit.</p>
      </div>

      <div role="tablist" aria-label="Faculties" className="mx-auto grid w-full max-w-lg grid-cols-4 gap-1 rounded-xl bg-muted p-1">
        {faculties.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={active === f.id}
            aria-controls={`faculty-${f.id}`}
            onClick={() => setActive(f.id)}
            className={`min-h-10 rounded-lg px-0.5 py-2 text-[13px] font-semibold tracking-tight transition-colors sm:text-sm ${
              active === f.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {faculties.map((f) => {
        const roleOf = (s: SubjectSummary) => s.faculties.find((x) => x.faculty.id === f.id)?.role as Role | undefined
        const inFaculty = subjects.filter((s) => roleOf(s))
        const byLessons = (a: SubjectSummary, b: SubjectSummary) => b.lessonCount - a.lessonCount || b.topicCount - a.topicCount
        const core = inFaculty.filter((s) => roleOf(s) === 'core').sort(byLessons)
        const main = inFaculty.filter((s) => roleOf(s) === 'faculty').sort(byLessons)
        const electives = inFaculty.filter((s) => roleOf(s) === 'elective').sort(byLessons)
        return (
          // Every faculty is in the HTML (crawlable links); only the active one is shown.
          <div key={f.id} id={`faculty-${f.id}`} role="tabpanel" hidden={active !== f.id} className="space-y-8">
            {core.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Core subjects</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
                  {core.map((s) => <FeatureCard key={s.id} s={s} />)}
                </div>
              </div>
            )}
            {main.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">{f.name} subjects</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 [&>*]:min-w-0">
                  {main.map((s) => <SubjectCard key={s.id} s={s} />)}
                </div>
              </div>
            )}
            {electives.length > 0 && (
              <div className="space-y-3 rounded-2xl bg-brand-soft/50 p-3 sm:p-4">
                <h3 className="px-1 text-sm font-semibold text-brand-strong">Electives</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
                  {electives.map((s) => <ElectiveRow key={s.id} s={s} />)}
                </div>
              </div>
            )}
          </div>
        )
      })}

      <p className="text-center text-sm">
        <a href="/wassce/subjects" className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary hover:underline">
          See every subject and its syllabus <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </p>
    </section>
  )
}
