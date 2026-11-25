// /how-we-check-lessons: how lessons are prepared and who has checked them.
//
// What Google's guidance on helpful content asks a reader to be able to find
// ("Who created this? How?") and what a teacher or parent checks first: the
// process, the reviewers with their qualifications, and exactly which
// subjects they have reviewed. Every number is read from the database when
// the site is built (fetchReviewCoverage), so the page never claims more than
// has been checked. Linked from every reviewed lesson's byline and the footer.
import { createFileRoute } from '@tanstack/react-router'
import { BadgeCheck, BookOpenCheck, ClipboardCheck, MessageCircleWarning, PenLine } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { fetchReviewCoverage } from '@/lib/public-content'
import { publicHead } from '@/lib/seo'
import { CONTACT, whatsappChatLink } from '@/lib/contact'
import { tutorPagePath } from '@/lib/tutor-profile'

export const Route = createFileRoute('/how-we-check-lessons')({
  head: publicHead('/how-we-check-lessons'),
  ssr: true, // prerendered to static HTML at build time
  loader: () => fetchReviewCoverage(),
  staleTime: Infinity,
  component: HowWeCheckLessons,
})

const pct = (n: number, of: number) => (of === 0 ? 0 : Math.round((100 * n) / of))

function HowWeCheckLessons() {
  const { lessons, reviewed, subjects, reviewers } = Route.useLoaderData()
  const full = subjects.filter((s) => s.lessons > 0 && s.reviewed === s.lessons)
  const waiting = subjects.filter((s) => s.reviewed < s.lessons)

  return (
    <article className="app-page site-page mx-auto w-full max-w-4xl space-y-10 pb-12">
      <header className="space-y-4 pt-2">
        <Breadcrumbs trail={[['Home', '/'], ['How we check lessons', '/how-we-check-lessons']]} />
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">How we check our lessons</h1>
        <p className="max-w-3xl text-[17px] leading-relaxed text-muted-foreground">
          Every WASSCE Tutor lesson is prepared against the WASSCE syllabus. {reviewed.toLocaleString('en')} of our {lessons.toLocaleString('en')} lessons
          ({pct(reviewed, lessons)}%) have also been read and approved by a verified teacher in Sierra Leone who teaches that subject. This page
          explains how that works and shows exactly which subjects have been checked.
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="process">
        <h2 id="process" className="text-2xl font-bold">From syllabus to checked lesson</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          <li className="site-card space-y-2 p-5">
            <PenLine className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="font-bold">1. Prepared against the syllabus</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The WASSCE Tutor team prepares each lesson topic by topic from the WASSCE syllabus, with Sierra Leone examples. Each lesson sets out
              what you should be able to do and what the examination asks; most work through examples and end with questions to check yourself.
            </p>
          </li>
          <li className="site-card space-y-2 p-5">
            <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="font-bold">2. Read by a teacher of the subject</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A verified lesson reviewer reads it: a tutor in Sierra Leone who teaches that subject, and who reviews only the subjects they teach.
              They check that it is correct, follows the syllabus and is right for WASSCE candidates, then approve it or report what is wrong.
            </p>
          </li>
          <li className="site-card space-y-2 p-5">
            <BadgeCheck className="h-6 w-6 text-primary" aria-hidden />
            <h3 className="font-bold">3. Signed by the reviewer</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              An approved lesson says &ldquo;Reviewed by&rdquo; the teacher, with their qualification, the date they checked it and a link to their
              page. A lesson not yet reviewed says &ldquo;By the WASSCE Tutor team&rdquo; instead, so you always know which is which.
            </p>
          </li>
        </ol>
      </section>

      {reviewers.length > 0 && (
        <section className="space-y-4" aria-labelledby="reviewers">
          <h2 id="reviewers" className="text-2xl font-bold">Our lesson reviewers</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {reviewers.map((r) => (
              <li key={r.slug ?? r.name} className="site-card space-y-2 p-5">
                <p className="flex items-center gap-2 text-lg font-bold">
                  <BookOpenCheck className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                  {r.slug ? (
                    <a href={tutorPagePath(r.slug)} className="hover:text-primary hover:underline">
                      {r.name}
                    </a>
                  ) : (
                    r.name
                  )}
                </p>
                {r.credential && <p className="text-sm font-semibold">{r.credential}</p>}
                <p className="text-sm text-muted-foreground">
                  Reviewed {r.lessons.toLocaleString('en')} {r.lessons === 1 ? 'lesson' : 'lessons'} in {r.subjects.join(', ')}.
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4" aria-labelledby="coverage">
        <h2 id="coverage" className="text-2xl font-bold">What has been reviewed, subject by subject</h2>
        <p className="text-muted-foreground">
          {full.length > 0
            ? `Every lesson in ${full.length === 1 ? full[0].name : `${full.slice(0, -1).map((s) => s.name).join(', ')} and ${full[full.length - 1].name}`} has been reviewed. `
            : ''}
          {waiting.length > 0 ? 'Lessons in the other subjects are prepared the same way and are waiting for a reviewer who teaches them.' : ''}
        </p>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">Subject</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Reviewed</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Reviewer</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.slug} className="border-t">
                  <th scope="row" className="px-4 py-2.5 font-semibold">
                    <a href={`/wassce/${s.slug}`} className="hover:text-primary hover:underline">
                      {s.name}
                    </a>
                  </th>
                  <td className="px-4 py-2.5 tabular-nums">
                    {s.reviewed} of {s.lessons} lessons ({pct(s.reviewed, s.lessons)}%)
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.reviewers.length > 0 ? s.reviewers.join(', ') : 'Waiting for a reviewer'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="questions">
        <h2 id="questions" className="text-2xl font-bold">Practice questions</h2>
        <p className="leading-relaxed text-muted-foreground">
          Our practice questions are written by WASSCE Tutor in the style of the WASSCE objective papers. They are not WAEC past papers. Each one
          comes with the answer, the full working and the reason every other option is wrong.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6" aria-labelledby="mistake">
        <h2 id="mistake" className="flex items-center gap-2 text-2xl font-bold">
          <MessageCircleWarning className="h-6 w-6 text-primary" aria-hidden /> Found a mistake?
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Tell us which lesson and what is wrong, on{' '}
          <a href={whatsappChatLink()} target="_blank" rel="noopener" className="font-semibold text-primary hover:underline">
            WhatsApp
          </a>{' '}
          or by{' '}
          <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Mistake in a lesson')}`} className="font-semibold text-primary hover:underline">
            email
          </a>
          . We check it and correct it.
        </p>
      </section>
    </article>
  )
}
