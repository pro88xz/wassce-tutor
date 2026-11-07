// Subjects on the homepage, presented like products: every subject has its
// own cover, real counts, and a place in a clear hierarchy (core subjects
// featured, faculty subjects as cards, electives as compact rows).
import { useState } from 'react'
import { ArrowRight, ChevronRight, ClipboardCheck } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { subjectPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { SwipeRow } from '@/components/ds/SwipeRow'

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

/** Faculty subject: a photo card (swipeable row on phones, grid from 640 px). */
function SubjectCard({ s }: { s: SubjectSummary }) {
  const ready = s.topicCount > 0
  const body = (
    <>
      <SubjectCover slug={s.slug} shape="wide" rounded="rounded-none" className="aspect-[16/10] w-full sm:aspect-[16/9]" />
      <span className="flex flex-1 flex-col gap-1 p-4">
        <span className="truncate font-bold">{s.name}</span>
        <span className="text-xs text-muted-foreground">{meta(s)}</span>
        <span className="pt-1"><PracticeBadge slug={s.slug} /></span>
      </span>
    </>
  )
  const cls = 'flex w-[72%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card transition-colors sm:w-auto'
  return ready ? (
    <a href={subjectPath(s.slug)} className={`${cls} hover:border-primary/40`}>{body}</a>
  ) : (
    <div className={`${cls} opacity-70`}>{body}</div>
  )
}

/** Elective: a readable row card with a photo thumbnail. */
function ElectiveRow({ s }: { s: SubjectSummary }) {
  const ready = s.topicCount > 0
  const inner = (
    <>
      <SubjectCover slug={s.slug} shape="thumb" className="h-[4.75rem] w-[5.75rem] shrink-0 sm:h-20 sm:w-28" rounded="rounded-xl" />
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold leading-snug tracking-tight">{s.name}</span>
        <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">{meta(s)}</span>
        {PRACTICE_QUESTIONS[s.slug] ? <span className="mt-1 block"><PracticeBadge slug={s.slug} /></span> : null}
      </span>
      {ready && <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />}
    </>
  )
  const cls = 'group flex min-h-[108px] items-center gap-4 rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/25 p-3.5 pr-4 shadow-sm transition-all duration-200 sm:min-h-[116px] sm:gap-4.5 sm:p-4'
  return ready ? (
    <a href={subjectPath(s.slug)} className={`${cls} hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md`}>{inner}</a>
  ) : (
    <div className={`${cls} opacity-75`}>{inner}</div>
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

      {/* Tabs share one row while they fit; with a large phone text size they wrap rather than clip a label. */}
      <div role="tablist" aria-label="Faculties" className="mx-auto flex w-full max-w-lg flex-wrap gap-1 rounded-xl bg-muted p-1">
        {faculties.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={active === f.id}
            aria-controls={`faculty-${f.id}`}
            onClick={() => setActive(f.id)}
            className={`min-h-10 min-w-fit grow basis-0 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-semibold tracking-tight transition-colors sm:text-sm ${
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
                <SwipeRow label={`${f.name} subjects`} count={main.length}>
                  {main.map((s) => <SubjectCard key={s.id} s={s} />)}
                </SwipeRow>
              </div>
            )}
            {electives.length > 0 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Electives</h3>
                  <p className="text-[13px] text-muted-foreground">Optional subjects you can take alongside your faculty subjects.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
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
