import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { FacultySubjects } from '@/components/public/FacultySubjects'
import { StartCta } from '@/components/public/StartCta'
import { fetchSubjectSummaries } from '@/lib/public-content'
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
    const topics = subjects.reduce((n, s) => n + s.topicCount, 0)
    return indexablePageTags({
      path: '/wassce/subjects',
      title: 'All WASSCE Subjects by Faculty | WASSCE Tutor',
      ogTitle: 'All WASSCE subjects by faculty',
      description: `The ${subjects.length} WASSCE subjects for Science, Arts, Commercial and Technical students in Sierra Leone, with ${topics} syllabus topics and lessons to study each one.`,
      jsonLd: [breadcrumbJsonLd(TRAIL)],
    })
  },
  component: SubjectsIndexPage,
})

function SubjectsIndexPage() {
  const subjects = Route.useLoaderData()
  const topics = subjects.reduce((n, s) => n + s.topicCount, 0)
  const lessons = subjects.reduce((n, s) => n + s.lessonCount, 0)
  return (
    <article className="mx-auto max-w-3xl space-y-10 pb-12">
      <header className="space-y-3 pt-2">
        <Breadcrumbs trail={TRAIL} />
        <h1 className="text-4xl font-bold tracking-tight">WASSCE subjects</h1>
        <p className="text-lg text-muted-foreground">
          Every WASSCE subject on WASSCE Tutor, grouped by faculty. English Language and Mathematics are core
          subjects for every candidate; the rest depend on whether you&rsquo;re in Science, Arts, Commercial or
          Technical.
        </p>
        <p className="text-sm text-muted-foreground">
          {subjects.length} subjects · {topics} syllabus topics · {lessons} lessons
        </p>
      </header>

      <section className="space-y-4" aria-label="Subjects by faculty">
        <FacultySubjects subjects={subjects} detailed />
      </section>

      <StartCta
        heading="Prepare for every subject you're sitting"
        body="Pick your faculty and subjects, then study with lessons, past papers with instant scoring, and an AI tutor that answers in plain English."
      />
    </article>
  )
}
