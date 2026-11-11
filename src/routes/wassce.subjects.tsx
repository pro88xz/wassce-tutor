import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { SubjectCatalogue } from '@/components/public/SubjectCatalogue'
import { PRACTICE_SUBJECTS_PHRASE, PRACTICE_TOTAL } from '@/lib/practice-counts'
import { fetchSubjectSummaries, hasSubjectPage } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags } from '@/lib/seo'

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  ['Subjects', '/wassce/subjects'],
]

export const Route = createFileRoute('/wassce/subjects')({
  ssr: true, // prerendered to static HTML at build time
  loader: () => fetchSubjectSummaries(),
  head: ({ loaderData: subjects = [] }) => {
    const listed = subjects.filter((s) => hasSubjectPage(s.topicCount))
    const topics = listed.reduce((n, s) => n + s.topicCount, 0)
    return indexablePageTags({
      path: '/wassce/subjects',
      title: 'All WASSCE Subjects by Faculty | WASSCE Tutor',
      ogTitle: 'All WASSCE subjects by faculty',
      description: `The ${listed.length} WASSCE subjects for Science, Arts, Commercial and Technical students in Sierra Leone, with ${topics} syllabus topics and lessons to study each one.`,
      jsonLd: [breadcrumbJsonLd(TRAIL)],
    })
  },
  component: SubjectsIndexPage,
})

function SubjectsIndexPage() {
  const subjects = Route.useLoaderData()
  // Subjects a visitor can open: the same count the homepage shows.
  const listed = subjects.filter((s) => hasSubjectPage(s.topicCount))
  const topics = listed.reduce((n, s) => n + s.topicCount, 0)
  const lessons = listed.reduce((n, s) => n + s.lessonCount, 0)
  const withLessons = listed.filter((s) => s.lessonCount > 0).length
  const stats = [
    { value: listed.length, label: 'subjects' },
    { value: topics, label: 'syllabus topics' },
    { value: lessons, label: 'published lessons' },
    { value: PRACTICE_TOTAL, label: 'practice questions' },
  ]
  return (
    <article className="site-page space-y-9 pb-16 pt-1 sm:space-y-12">
      <header className="space-y-6">
        <Breadcrumbs trail={TRAIL} />
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:items-end lg:gap-12">
          <div>
            <p className="site-eyebrow">Course catalogue</p>
            <h1 className="site-display mt-3 text-[2.25rem] text-foreground sm:text-5xl lg:text-[3.25rem]">
              Find your subjects. <span className="text-primary">Build your path.</span>
            </h1>
            <p className="site-lede mt-4">
              The Sierra Leone WASSCE curriculum by faculty. English Language and Mathematics are taken by every candidate; your faculty sets your main
              subjects and electives.
            </p>
          </div>
          <dl className="site-card grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2">
            {stats.map(({ value, label }, i) => (
              <div key={label} className={`flex flex-col-reverse gap-1 p-4 sm:p-5 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0 lg:border-t' : ''} ${i === 2 ? 'sm:border-l lg:border-l-0' : ''}`}>
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="text-2xl font-extrabold leading-none tracking-tight tabular-nums sm:text-3xl">{value.toLocaleString('en')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="space-y-2" aria-labelledby="catalogue">
        <h2 id="catalogue" className="sr-only">Subjects by faculty</h2>
        <SubjectCatalogue subjects={subjects} withAll />
        <p className="pt-4 text-sm leading-relaxed text-muted-foreground">
          {withLessons} of {listed.length} subjects have lessons today, and practice questions are published for {PRACTICE_SUBJECTS_PHRASE}. A subject marked
          “Syllabus outline” lists every topic it covers while its lessons are written.
        </p>
      </section>

      <StartCta
        heading="Prepare for every subject you are sitting"
        body="Pick your faculty and subjects, then study with clear lessons, practice marked instantly and study tutor support that answers in plain English."
      />
    </article>
  )
}
