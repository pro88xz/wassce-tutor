// The subjects on the homepage, by faculty, as an editorial layout rather
// than a grid of identical boxes. On desktop the faculty's first subject is a
// large feature tile and the others sit around it, with the WASSCE guide
// filling the last row; on phones the subjects are a swipeable row of tall
// cards. Each card is the subject's photograph, full bleed, with its name,
// size and what it has (practice, lessons or the syllabus outline) on it.
//
// Every faculty's cards are in the prerendered HTML (crawlable links); only
// the chosen faculty is shown. /wassce/subjects keeps the plain catalogue
// grid (src/components/public/SubjectCatalogue).
import { useState } from 'react'
import { ArrowRight, Compass } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { subjectPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { inFacultyOrder } from '@/lib/catalogue'
import { Band, SectionHeading } from '@/components/public/Section'
import { SubjectCover } from '@/components/ds/SubjectCover'

// The guide tile fills what the last row leaves (the feature tile takes four
// cells). Literal class names, so Tailwind generates them.
const MD_FILL = ['md:col-span-3', 'md:col-span-1', 'md:col-span-2']
const LG_FILL = ['lg:col-span-4', 'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3']

/** On phones, every card is a tall card in the swipeable row; from tablet width the grid sizes them. */
const PHONE_CARD = 'w-[70%] shrink-0 snap-start aspect-[4/5] sm:w-[44%] md:w-auto md:aspect-auto'

export function SubjectShowcase({ subjects }: { subjects: SubjectSummary[] }) {
  const listed = subjects.filter((s) => s.topicCount > 0)
  const withLessons = listed.filter((s) => s.lessonCount > 0).length
  const faculties = [...new Map(listed.flatMap((s) => s.faculties.map((f) => [f.faculty.id, f.faculty] as const))).values()].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const [active, setActive] = useState(faculties[0]?.id ?? '')

  return (
    <Band labelledBy="subjects-heading">
      <SectionHeading
        id="subjects-heading"
        eyebrow="Subjects"
        title={<>Find your subject. <span className="site-accent text-[var(--primary)]">Start your topic.</span></>}
        lede={`${withLessons} of ${listed.length} subjects have full lessons; the rest show their syllabus.`}
        action={
          <a href="/wassce/subjects" className="site-link">
            Browse the full syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />

      <div role="tablist" aria-label="Faculties" className="-mx-[var(--site-gutter)] mt-8 flex gap-2 overflow-x-auto px-[var(--site-gutter)] pb-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {faculties.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            id={`faculty-tab-${f.id}`}
            aria-selected={active === f.id}
            aria-controls={`faculty-${f.id}`}
            onClick={() => setActive(f.id)}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-bold ring-1 transition-all duration-300 ${
              active === f.id
                ? 'bg-[var(--site-ink)] text-white ring-transparent shadow-[0_12px_24px_-14px_rgba(19,13,43,.7)]'
                : 'bg-card text-muted-foreground ring-border hover:text-foreground hover:ring-[color-mix(in_srgb,var(--primary)_35%,var(--border))]'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {faculties.map((f) => {
        const list = inFacultyOrder(listed, f.id)
        const role = (s: SubjectSummary) => s.faculties.find((x) => x.faculty.id === f.id)?.role
        const badge = (s: SubjectSummary) => ({ core: 'Core', faculty: f.name, elective: 'Elective' })[role(s)!] ?? f.name
        const cells = list.length + 3
        return (
          <div
            key={f.id}
            id={`faculty-${f.id}`}
            role="tabpanel"
            aria-labelledby={`faculty-tab-${f.id}`}
            hidden={active !== f.id}
            className="-mx-[var(--site-gutter)] mt-3 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-[var(--site-gutter)] px-[var(--site-gutter)] pb-4 [scrollbar-width:none] md:mx-0 md:grid md:auto-rows-[13rem] md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:auto-rows-[13.5rem] lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {list.map((s, i) => (
              <SubjectTile key={s.id} s={s} badge={badge(s)} feature={i === 0} />
            ))}
            <GuideTile className={`${MD_FILL[(3 - (cells % 3)) % 3]} ${LG_FILL[(4 - (cells % 4)) % 4]}`} />
          </div>
        )
      })}
    </Band>
  )
}

function SubjectTile({ s, badge, feature }: { s: SubjectSummary; badge: string; feature: boolean }) {
  const questions = PRACTICE_QUESTIONS[s.slug] ?? 0
  const status = questions > 0 ? `${questions.toLocaleString('en')} practice questions` : s.lessonCount > 0 ? 'Lessons ready' : 'Syllabus outline'
  return (
    <a
      href={subjectPath(s.slug)}
      className={`group relative isolate block overflow-hidden rounded-[22px] bg-[#1a1530] text-white shadow-[var(--site-shadow-card)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--site-shadow-raised)] ${PHONE_CARD} ${
        feature ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <span className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
        <SubjectCover
          slug={s.slug}
          shape="wide"
          rounded="rounded-none"
          className="h-full w-full"
          sizes={feature ? '(min-width: 1024px) 620px, (min-width: 768px) 66vw, 70vw' : '(min-width: 1024px) 300px, (min-width: 768px) 33vw, 70vw'}
        />
      </span>
      {/* A scrim from the foot, so the white type reads over any photograph. */}
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0c0820]/95 via-[#0c0820]/45 to-[#0c0820]/0" />
      <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold leading-none text-slate-900 backdrop-blur">{badge}</span>
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <span className="min-w-0">
          <span className={`block font-extrabold tracking-tight text-balance ${feature ? 'text-[1.6rem] leading-[1.05] md:text-[2.4rem]' : 'text-[1.25rem] leading-tight'}`}>{s.name}</span>
          <span className="mt-1 block text-[13px] text-white/75">
            {s.topicCount} topics{s.lessonCount > 0 ? ` · ${s.lessonCount} lessons` : ''}
          </span>
          <span className="mt-2.5 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-semibold ring-1 ring-white/20 backdrop-blur-sm">{status}</span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-slate-900" aria-hidden>
          <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
  )
}

/** Fills the last row and routes undecided visitors to the WASSCE guide. */
function GuideTile({ className }: { className: string }) {
  return (
    <a
      href="/wassce"
      className={`site-brand-panel group relative isolate overflow-hidden rounded-[22px] p-5 @container transition-transform duration-500 hover:-translate-y-1 sm:p-6 ${PHONE_CARD} ${className}`}
    >
      <span className="flex h-full flex-col justify-between gap-5 @3xl:flex-row @3xl:items-center @3xl:justify-start @3xl:gap-6">
      <span aria-hidden className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(135deg,transparent,#000)]" />
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 @3xl:h-16 @3xl:w-16">
        <Compass className="h-5 w-5" aria-hidden />
      </span>
      <span>
        <span className="block text-lg font-bold leading-snug tracking-tight sm:text-xl">Not sure which subjects you sit?</span>
        <span className="mt-2 block text-sm leading-relaxed text-white/80">The WASSCE guide explains each faculty, the core subjects and how the exam is graded.</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#ffd166]">
          Read the guide <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
      </span>
    </a>
  )
}
