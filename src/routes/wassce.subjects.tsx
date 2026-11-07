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
    <article className="mx-auto w-full max-w-6xl space-y-9 px-1 pb-16 sm:space-y-12">
      <header className="subject-index-hero">
        <Breadcrumbs trail={TRAIL} />
        <div className="subject-index-hero-content">
          <div className="max-w-3xl">
            <span className="subject-index-eyebrow">YOUR WASSCE, ORGANISED</span>
            <h1>Find your <span>subjects.</span><br className="hidden sm:block" />Build your path.</h1>
            <p>Explore the Sierra Leone WASSCE curriculum by faculty. Start with your core subjects, then find the subjects that match your programme.</p>
          </div>
          <div className="subject-index-stats" aria-label="Curriculum overview">
            <div><strong>{subjects.length}</strong><span>subjects</span></div>
            <div><strong>{topics}</strong><span>syllabus topics</span></div>
            <div><strong>{lessons}</strong><span>published lessons</span></div>
          </div>
        </div>
        <div className="subject-index-core-note">
          <span className="subject-index-core-mark">01</span>
          <span><strong>Start with your core subjects</strong><small>English Language and Mathematics are taken by every WASSCE candidate.</small></span>
        </div>
      </header>

      <section className="space-y-4" aria-label="Subjects by faculty">
        <FacultySubjects subjects={subjects} detailed />
      </section>

      <StartCta
        heading="Prepare for every subject you're sitting"
        body="Pick your faculty and subjects, then study with lessons, exam-style practice marked instantly, and an AI tutor that answers in plain English."
      />
    </article>
  )
}
