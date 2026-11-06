import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { FacultySubjects } from '@/components/public/FacultySubjects'
import { StartCta } from '@/components/public/StartCta'
import { fetchSubjectSummaries } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags } from '@/lib/seo'

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
]

// The WAEC grade scale. Kept to what WAEC publishes on every result slip;
// no percentage bands (WAEC doesn't publish fixed ones).
const GRADES: [grade: string, meaning: string, kind: string][] = [
  ['A1', 'Excellent', 'Credit'],
  ['B2', 'Very good', 'Credit'],
  ['B3', 'Good', 'Credit'],
  ['C4', 'Credit', 'Credit'],
  ['C5', 'Credit', 'Credit'],
  ['C6', 'Credit', 'Credit'],
  ['D7', 'Pass', 'Pass'],
  ['E8', 'Pass', 'Pass'],
  ['F9', 'Fail', 'Fail'],
]

export const Route = createFileRoute('/wassce/')({
  ssr: true, // prerendered to static HTML at build time
  loader: () => fetchSubjectSummaries(),
  head: () =>
    indexablePageTags({
      path: '/wassce',
      title: 'WASSCE in Sierra Leone: Subjects, Syllabus & Grades | WASSCE Tutor',
      ogTitle: 'WASSCE in Sierra Leone: subjects, syllabus and grades',
      description:
        'What WASSCE is, which subjects Science, Arts, Commercial and Technical students take, how A1 to F9 grades work, and the full syllabus for each subject.',
      jsonLd: [breadcrumbJsonLd(TRAIL)],
    }),
  component: WasscePillarPage,
})

function WasscePillarPage() {
  const subjects = Route.useLoaderData()
  return (
    <article className="mx-auto max-w-3xl space-y-12 pb-12">
      <header className="space-y-3 pt-2">
        <Breadcrumbs trail={TRAIL} />
        <h1 className="text-4xl font-bold tracking-tight">WASSCE in Sierra Leone</h1>
        <p className="text-lg text-muted-foreground">
          The subjects you&rsquo;ll sit, how WASSCE is graded, and the full syllabus for each subject, in one place.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">What is WASSCE?</h2>
        <p className="text-muted-foreground">
          The West African Senior School Certificate Examination (WASSCE) is the exam students in Sierra Leone sit
          in their final year of senior secondary school (SSS3). It is set and marked by the West African
          Examinations Council (WAEC), which runs the same examination in Ghana, Nigeria, Liberia and The Gambia.
        </p>
        <p className="text-muted-foreground">
          Your WASSCE results decide which university programmes you can apply for, and many scholarships and jobs
          ask for them too. Each subject is graded separately.
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="subjects">
        <h2 id="subjects" className="text-2xl font-bold">WASSCE subjects by faculty</h2>
        <p className="text-muted-foreground">
          Every candidate takes English Language and Mathematics. Your other subjects depend on your faculty.
          Open a subject to see every topic in its syllabus.
        </p>
        <FacultySubjects subjects={subjects} />
        <p className="text-sm">
          <a href="/wassce/subjects" className="text-primary hover:underline">See all subjects with topic and lesson counts →</a>
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="grades">
        <h2 id="grades" className="text-2xl font-bold">How WASSCE is graded</h2>
        <p className="text-muted-foreground">
          Each subject gets one of nine grades. A1 to C6 are credits, D7 and E8 are passes, and F9 is a fail.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-md border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-semibold">Grade</th>
                <th className="py-2 pr-4 font-semibold">Meaning</th>
                <th className="py-2 font-semibold">Counts as</th>
              </tr>
            </thead>
            <tbody>
              {GRADES.map(([grade, meaning, kind]) => (
                <tr key={grade} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono font-semibold">{grade}</td>
                  <td className="py-2 pr-4">{meaning}</td>
                  <td className="py-2">{kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Most university programmes ask for credits (C6 or better) in at least five subjects, usually including
          English Language and Mathematics. Requirements differ by university and programme, so check the exact
          entry requirements for the course you want.
        </p>
      </section>

      <StartCta
        heading="Prepare for WASSCE with WASSCE Tutor"
        body="Lessons for every topic, past papers with instant scoring, and an AI tutor that explains anything in plain English. Built in Freetown for Sierra Leone students."
      />
    </article>
  )
}
