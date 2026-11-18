import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { fetchSubjectHub, fetchSubjectSummaries, hasSubjectPage, subjectPath } from '@/lib/public-content'
import type { SubjectHub, SubjectSummary } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { breadcrumbJsonLd, faqJsonLd, indexablePageTags, privatePageTags, tutoringServiceJsonLd } from '@/lib/seo'
import { shortSubject, subjectTutorDescription, subjectTutorTitle } from '@/lib/tutor-seo'
import { SubjectBanner } from '@/components/ds/SubjectCover'
import { BookingForm } from '@/components/tutors/BookingForm'
import { TutorMarketplace } from '@/components/tutors/Marketplace'
import { TUTOR_FAQ, TutorFaq, TutorHowItWorks, TutorSubjectGrid, TutorJoinBand } from '@/components/tutors/TutorSections'
import { TutorProfile } from '@/components/tutors/TutorProfile'
import { displayName, fetchTutorPage, tutorJsonLd, tutorPageDescription, tutorPagePath, tutorPageTitle, tutorPhoto, type TutorPageData } from '@/lib/tutor-profile'

// /tutors/{x}: a subject's tutor page when x is a subject, otherwise a tutor's
// own page (src/lib/tutor-profile.ts; a tutor's slug never equals a subject's).
type Data =
  | { kind: 'subject'; hub: SubjectHub; subjects: SubjectSummary[] }
  | ({ kind: 'tutor' } & TutorPageData)

const tutorTrail = (name: string, slug: string): [string, string][] => [
  ['Home', '/'],
  ['Private tutors', '/tutors'],
  [name, tutorPagePath(slug)],
]

const trail = (hub: SubjectHub): [string, string][] => [
  ['Home', '/'],
  ['Private tutors', '/tutors'],
  [`${hub.subject.name} tutor`, tutorsPath(hub.subject.slug)],
]

function describe(hub: SubjectHub): string {
  return subjectTutorDescription(hub.subject.name, hub.topicCount)
}

// The subject FAQ leads with a subject-specific answer, then the shared ones.
const subjectFaq = (hub: SubjectHub): [string, string][] => [
  [
    `What can a private ${shortSubject(hub.subject.name)} tutor help with?`,
    `Any part of the WASSCE ${hub.subject.name} syllabus: ${hub.groups.map((g) => g.name).slice(0, 4).join(', ')}${hub.groups.length > 4 ? ' and more' : ''}. Tell us the topics you find hard and the tutor starts there.`,
  ],
  ...TUTOR_FAQ.slice(1),
]

export const Route = createFileRoute('/tutors/$subject')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }): Promise<Data> => {
    const [hub, all] = await Promise.all([fetchSubjectHub(params.subject), fetchSubjectSummaries()])
    if (hub) return { kind: 'subject', hub, subjects: all.filter((s) => hasSubjectPage(s.topicCount)) }
    const tutor = await fetchTutorPage(params.subject)
    if (tutor) return { kind: 'tutor', ...tutor }
    throw notFound()
  },
  staleTime: Infinity,
  head: ({ loaderData }) =>
    loaderData?.kind === 'tutor'
      ? indexablePageTags({
          path: tutorPagePath(loaderData.tutor.slug!),
          title: tutorPageTitle(loaderData.tutor),
          ogTitle: `${displayName(loaderData.tutor.full_name)}: private WASSCE tutor in ${loaderData.tutor.location}`,
          description: tutorPageDescription(loaderData.tutor),
          type: 'profile',
          image: tutorPhoto(loaderData.tutor) ?? undefined,
          jsonLd: [
            tutorJsonLd(loaderData.tutor, `https://wasscetutor.com${tutorPagePath(loaderData.tutor.slug!)}`),
            breadcrumbJsonLd(tutorTrail(displayName(loaderData.tutor.full_name), loaderData.tutor.slug!)),
          ],
        })
      : loaderData
      ? indexablePageTags({
          path: tutorsPath(loaderData.hub.subject.slug),
          title: subjectTutorTitle(loaderData.hub.subject.name),
          ogTitle: `Book a private WASSCE ${shortSubject(loaderData.hub.subject.name)} tutor in Sierra Leone`,
          description: describe(loaderData.hub),
          jsonLd: [
            tutoringServiceJsonLd({
              name: `Private WASSCE ${loaderData.hub.subject.name} tutoring`,
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
  const data = Route.useLoaderData()
  if (data.kind === 'tutor')
    return <TutorProfile tutor={data.tutor} reviewed={data.reviewed} others={data.others} trail={tutorTrail(displayName(data.tutor.full_name), data.tutor.slug!)} />
  return <SubjectTutors hub={data.hub} subjects={data.subjects} />
}

function SubjectTutors({ hub, subjects }: { hub: SubjectHub; subjects: SubjectSummary[] }) {
  const { subject, groups } = hub
  return (
    <article className="app-page site-page space-y-12 pb-8 sm:space-y-14">
      <div className="space-y-5">
        <Breadcrumbs trail={trail(hub)} />
        <SubjectBanner slug={subject.slug} eyebrow="Book a private tutor" title={`Private ${shortSubject(subject.name)} tutors`} />
        <TutorMarketplace subjectId={subject.id} subjectName={subject.name} />
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10">
          <div className="space-y-4">
            <p className="text-[17px] text-muted-foreground">
              Private {subject.name} lessons for WASSCE, one to one at your home or near you, in Freetown, Bo, Kenema, Makeni or your own town. See each tutor’s monthly fee, then message them on WhatsApp to arrange lessons.
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
