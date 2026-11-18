import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { fetchSubjectHub, fetchSubjectSummaries, hasSubjectPage, subjectPath } from '@/lib/public-content'
import type { SubjectHub, SubjectSummary } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { breadcrumbJsonLd, faqJsonLd, indexablePageTags, privatePageTags, tutoringServiceJsonLd } from '@/lib/seo'
import { SubjectBanner } from '@/components/ds/SubjectCover'
import { BookingForm } from '@/components/tutors/BookingForm'
import { TutorMarketplace } from '@/components/tutors/Marketplace'
import { TUTOR_FAQ, TutorFaq, TutorHowItWorks, TutorSubjectGrid, TutorJoinBand } from '@/components/tutors/TutorSections'

type Data = { hub: SubjectHub; subjects: SubjectSummary[] }

const trail = (hub: SubjectHub): [string, string][] => [
  ['Home', '/'],
  ['Book a tutor', '/tutors'],
  [`${hub.subject.name} tutor`, tutorsPath(hub.subject.slug)],
]

function describe(hub: SubjectHub): string {
  return `Book a verified WASSCE ${hub.subject.name} tutor in Sierra Leone for in-person lessons covering all ${hub.topicCount} syllabus topics. See their monthly fee, then message them on WhatsApp.`
}

// The subject FAQ leads with a subject-specific answer, then the shared ones.
const subjectFaq = (hub: SubjectHub): [string, string][] => [
  [
    `What can a ${hub.subject.name} tutor help with?`,
    `Any part of the WASSCE ${hub.subject.name} syllabus: ${hub.groups.map((g) => g.name).slice(0, 4).join(', ')}${hub.groups.length > 4 ? ' and more' : ''}. Tell us the topics you find hard and the tutor starts there.`,
  ],
  ...TUTOR_FAQ.slice(1),
]

export const Route = createFileRoute('/tutors/$subject')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }): Promise<Data> => {
    const [hub, all] = await Promise.all([fetchSubjectHub(params.subject), fetchSubjectSummaries()])
    if (!hub) throw notFound()
    return { hub, subjects: all.filter((s) => hasSubjectPage(s.topicCount)) }
  },
  staleTime: Infinity,
  head: ({ loaderData }) =>
    loaderData
      ? indexablePageTags({
          path: tutorsPath(loaderData.hub.subject.slug),
          title: `WASSCE ${loaderData.hub.subject.name} Tutor in Sierra Leone | WASSCE Tutor`,
          ogTitle: `Book a WASSCE ${loaderData.hub.subject.name} tutor`,
          description: describe(loaderData.hub),
          jsonLd: [
            tutoringServiceJsonLd({
              name: `WASSCE ${loaderData.hub.subject.name} tutoring`,
              description: describe(loaderData.hub),
              path: tutorsPath(loaderData.hub.subject.slug),
              subject: loaderData.hub.subject.name,
            }),
            faqJsonLd(subjectFaq(loaderData.hub)),
            breadcrumbJsonLd(trail(loaderData.hub)),
          ],
        })
      : privatePageTags('Page not found'),
  component: SubjectTutorPage,
})

function SubjectTutorPage() {
  const { hub, subjects } = Route.useLoaderData()
  const { subject, groups } = hub
  return (
    <article className="app-page site-page space-y-12 pb-8 sm:space-y-14">
      <div className="space-y-5">
        <Breadcrumbs trail={trail(hub)} />
        <SubjectBanner slug={subject.slug} eyebrow="Book a tutor" title={`${subject.name} tutor`} />
        <TutorMarketplace subjectId={subject.id} subjectName={subject.name} />
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10">
          <div className="space-y-4">
            <p className="text-[17px] text-muted-foreground">
              In-person help with WASSCE {subject.name} from a teacher near you. See each tutor’s monthly fee, then message them on WhatsApp to arrange lessons near you.
            </p>
            <ul className="space-y-2 text-[15px]">
              {[`All ${hub.topicCount} topics in the WASSCE ${subject.name} syllabus`, 'In-person lessons, arranged directly with your tutor', 'Monthly fee shown upfront: you agree before you message'].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {t}</li>
              ))}
            </ul>

            <a href="#tutors" className="inline-flex min-h-12 py-2 w-full items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong md:hidden text-center">
              See {subject.name} tutors
            </a>

            <section className="space-y-3 pt-2" aria-labelledby="covers">
              <h2 id="covers" className="text-lg font-bold tracking-tight">What your tutor can cover</h2>
              <div className="space-y-3">
                {groups.slice(0, 5).map((g) => (
                  <div key={g.name}>
                    <p className="text-sm font-semibold text-muted-foreground">{g.name}</p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {g.topics.slice(0, 6).map((t) => (
                        <li key={t.id} className="rounded-full border bg-card px-3 py-1 text-[13px] font-medium">{t.name}</li>
                      ))}
                      {g.topics.length > 6 && <li className="px-1 py-1 text-[13px] text-muted-foreground">+{g.topics.length - 6} more</li>}
                    </ul>
                  </div>
                ))}
              </div>
              <a href={subjectPath(subject.slug)} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline">
                See the full {subject.name} syllabus <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </section>
          </div>

          <section id="book" className="scroll-mt-20" aria-labelledby="book-heading">
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6 md:sticky md:top-20">
              <h2 id="book-heading" className="mb-1 text-xl font-bold tracking-tight">Can’t find a {subject.name} tutor?</h2>
              <p className="mb-5 text-[15px] text-muted-foreground">Tell us your area and we’ll find one for in-person lessons, and tell you their monthly fee on WhatsApp.</p>
              <BookingForm subjects={subjects.map((s) => s.name)} defaultSubject={subject.name} />
            </div>
          </section>
        </div>
      </div>

      <TutorHowItWorks />

      <section className="space-y-4" aria-labelledby="other-subjects">
        <h2 id="other-subjects" className="text-2xl font-bold tracking-tight">Tutors for other subjects</h2>
        <TutorSubjectGrid subjects={subjects} exclude={subject.slug} />
      </section>

      <TutorJoinBand subjectName={subject.name} />

      <TutorFaq items={subjectFaq(hub)} />
    </article>
  )
}
