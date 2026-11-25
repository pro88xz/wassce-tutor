import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { FacultySubjects } from '@/components/public/FacultySubjects'
import { StartCta } from '@/components/public/StartCta'
import { PopularTopicLinks } from '@/components/public/PopularTopics'
import { fetchQuestionSubjects, fetchSubjectSummaries, questionsPath } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags } from '@/lib/seo'

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
]

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
  ssr: true,
  loader: async () => {
    const [subjects, questions] = await Promise.all([fetchSubjectSummaries(), fetchQuestionSubjects()])
    // Subjects with a questions-and-answers page, in the directory's order, with how many questions each has.
    const questionSubjects = subjects.filter((s) => questions.has(s.slug)).map((s) => ({ slug: s.slug, name: s.name, questions: questions.get(s.slug)! }))
    return { subjects, questionSubjects }
  },
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
  const { subjects, questionSubjects } = Route.useLoaderData()
  return (
    <article className="wassce-guide site-page space-y-14 pb-12 sm:space-y-20">
      <header className="guide-hero">
        <Breadcrumbs trail={TRAIL} />
        <div className="guide-hero-content">
          <div className="guide-hero-copy">
            <p className="guide-eyebrow">THE SIERRA LEONE EXAM GUIDE</p>
            <h1>Understand WASSCE. <span>Prepare with direction.</span></h1>
            <p className="guide-hero-lede">
              Your guide to the subjects, syllabus and grading system for the West African Senior School Certificate Examination in Sierra Leone.
            </p>
            <div className="guide-hero-actions">
              <a href="#guide-subjects" className="guide-primary-link">Explore subjects <span aria-hidden>↗</span></a>
              <a href="#guide-grades" className="guide-secondary-link">Understand grades</a>
            </div>
          </div>
          <div className="guide-hero-index" aria-label="Inside this guide">
            <p>INSIDE THIS GUIDE</p>
            <a href="#guide-overview"><span>01</span> The examination <span aria-hidden>↗</span></a>
            <a href="#guide-subjects"><span>02</span> Subjects by faculty <span aria-hidden>↗</span></a>
            <a href="#guide-grades"><span>03</span> The grade scale <span aria-hidden>↗</span></a>
            <div className="guide-index-foot"><span className="guide-index-dot" /> Sierra Leone · WASSCE</div>
          </div>
        </div>
        <div className="guide-hero-bottom">
          <span>ONE EXAMINATION</span><span>FOUR FACULTIES</span><span>NINE GRADES</span>
        </div>
      </header>

      <section id="guide-overview" className="guide-overview-section scroll-mt-24">
        <div className="guide-section-heading">
          <p className="guide-eyebrow">01 / THE EXAMINATION</p>
          <h2>What is WASSCE?</h2>
          <p>The qualification at the end of senior secondary school—and what your results mean for the next step.</p>
        </div>
        <div className="guide-overview-grid">
          <div className="guide-overview-copy">
            <p>
              The West African Senior School Certificate Examination (WASSCE) is the exam students in Sierra Leone sit
              in their final year of senior secondary school (SSS3). It is set and marked by the West African
              Examinations Council (WAEC), which runs the same examination in Ghana, Nigeria, Liberia and The Gambia.
            </p>
            <p>
              Your WASSCE results decide which university programmes you can apply for, and many scholarships and jobs
              ask for them too. Each subject is graded separately.
            </p>
          </div>
          <aside className="guide-fact-panel">
            <span className="guide-fact-kicker">THE RESULT</span>
            <strong>A grade for<br />every subject.</strong>
            <p>Your final result is made up of individual subject grades—not one overall score.</p>
            <a href="#guide-grades">See how the grades work <span aria-hidden>↗</span></a>
          </aside>
        </div>
      </section>

      <section id="guide-subjects" className="guide-subject-section scroll-mt-24">
        <div className="guide-section-heading guide-section-heading-row">
          <div>
            <p className="guide-eyebrow">02 / SUBJECT DIRECTORY</p>
            <h2>Choose your faculty. Find your subjects.</h2>
            <p>Every candidate takes English Language and Mathematics. Your other subjects depend on your faculty. Open a subject to see every topic in its syllabus.</p>
          </div>
          <a href="/wassce/subjects" className="guide-text-link">Full subject directory <span aria-hidden>↗</span></a>
        </div>
        <div className="guide-subject-surface">
          <FacultySubjects subjects={subjects} />
        </div>
      </section>

      <section id="guide-grades" className="guide-grades-section scroll-mt-24">
        <div className="guide-section-heading">
          <p className="guide-eyebrow">03 / UNDERSTANDING YOUR RESULT</p>
          <h2>The WASSCE grade scale</h2>
          <p>Each subject receives one of nine grades. A1 to C6 are credits, D7 and E8 are passes, and F9 is a fail.</p>
        </div>
        <div className="guide-grades-layout">
          <div className="guide-grade-table-wrap">
            <table className="guide-grade-table">
              <thead><tr><th>Grade</th><th>Meaning</th><th>Classification</th></tr></thead>
              <tbody>
                {GRADES.map(([grade, meaning, kind]) => (
                  <tr key={grade} className={kind === 'Credit' ? 'grade-credit' : kind === 'Pass' ? 'grade-pass' : 'grade-fail'}>
                    <td><span className="guide-grade-pill">{grade}</span></td>
                    <td>{meaning}</td>
                    <td><span className="guide-grade-kind">{kind}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="guide-grade-note">
            <span className="guide-note-mark">C6</span>
            <p className="guide-eyebrow">A COMMON ENTRY REQUIREMENT</p>
            <h3>Know what counts as a credit.</h3>
            <p>Many university programmes ask for credits (C6 or better) in at least five subjects, usually including English Language and Mathematics.</p>
            <p>Requirements differ by university and programme, so check the exact entry requirements for the course you want.</p>
          </aside>
        </div>
      </section>

      {questionSubjects.length > 0 && (
        <section id="guide-questions" className="scroll-mt-24 space-y-6" aria-labelledby="guide-questions-title">
          <div className="guide-section-heading">
            <p className="guide-eyebrow">04 / PRACTICE QUESTIONS</p>
            <h2 id="guide-questions-title">WASSCE questions and answers</h2>
            <p>
              Original WASSCE-style objective questions, topic by topic, each with the answer, the full working and why every other option is
              wrong. Free to read. They are not WAEC past papers.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {questionSubjects.map((s) => (
              <li key={s.slug}>
                <a href={questionsPath(s.slug)} className="site-card group flex h-full items-center justify-between gap-3 p-4 transition-colors hover:border-primary/40">
                  <span>
                    <span className="block font-bold leading-snug group-hover:text-primary">{s.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{s.questions} questions with answers</span>
                  </span>
                  <span className="text-primary" aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* The topics people search for most, linked by the words they search with (src/content/popular-topics.ts). */}
      <section id="guide-popular" className="scroll-mt-24 space-y-6" aria-labelledby="guide-popular-title">
        <div className="guide-section-heading">
          <p className="guide-eyebrow">05 / POPULAR TOPICS</p>
          <h2 id="guide-popular-title">Popular WASSCE topics</h2>
          <p>Some of the topics students look up most. Every lesson is free to read.</p>
        </div>
        <PopularTopicLinks />
      </section>

      <StartCta
        heading="Prepare for WASSCE with WASSCE Tutor"
        body="Lessons for every topic, exam-style practice marked instantly, and an AI tutor that explains anything in plain English. Built in Freetown for Sierra Leone students."
      />
    </article>
  )
}
