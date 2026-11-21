import { createFileRoute, notFound } from '@tanstack/react-router'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import type { SubjectHub } from '@/lib/public-content'
import { TUTOR_HUB_FAQ, tutorsPath } from '@/lib/public-rules'
import { breadcrumbJsonLd, faqJsonLd, indexablePageTags, privatePageTags, tutoringServiceJsonLd } from '@/lib/seo'
import { shortSubject, subjectTutorDescription, subjectTutorTitle, TUTOR_TOWNS } from '@/lib/tutor-seo'
import { listText } from '@/lib/tutor-pricing'
import { tutorTowns } from '@/lib/subject-tutors'
import { fetchSubjectTutorsPage, subjectTutorFaq, subjectTutorIntro, type SubjectTutorsPage } from '@/lib/subject-tutors'
import { SubjectBanner } from '@/components/ds/SubjectCover'
import { BookingForm } from '@/components/tutors/BookingForm'
import { TutorMarketplace } from '@/components/tutors/Marketplace'
import { PractiseBetweenLessons, RelatedSubjectTutors, ReviewedByTutors, SyllabusCoverage } from '@/components/tutors/SubjectTutorSections'
import { TutorFaq, TutorJoinBand } from '@/components/tutors/TutorSections'
import { TutorProfile } from '@/components/tutors/TutorProfile'
import { displayName, fetchTutorPage, tutorJsonLd, tutorPageDescription, tutorPagePath, tutorPageTitle, tutorPhoto, type TutorPageData } from '@/lib/tutor-profile'

// /tutors/{x}: a subject's tutor page when x is a subject, otherwise a tutor's
// own page (src/lib/tutor-profile.ts; a tutor's slug never equals a subject's).
//
// A subject's page is written from that subject's own facts
// (src/lib/subject-tutors.ts): its tutors are in the HTML, with the whole
// syllabus, what to practise between lessons and answers built from the
// tutors' real fees and towns. Booking steps and the general FAQ live once on
// /tutors. The URL, title, description, heading and canonical are unchanged.
type Data =
  | { kind: 'subject'; page: SubjectTutorsPage }
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

export const Route = createFileRoute('/tutors/$subject')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }): Promise<Data> => {
    const page = await fetchSubjectTutorsPage(params.subject)
    if (page) return { kind: 'subject', page }
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
          path: tutorsPath(loaderData.page.hub.subject.slug),
          title: subjectTutorTitle(loaderData.page.hub.subject.name),
          ogTitle: `Book a private WASSCE ${shortSubject(loaderData.page.hub.subject.name)} tutor in Sierra Leone`,
          description: describe(loaderData.page.hub),
          jsonLd: [
            tutoringServiceJsonLd({
              name: `Private WASSCE ${loaderData.page.hub.subject.name} tutoring`,
              description: describe(loaderData.page.hub),
              path: tutorsPath(loaderData.page.hub.subject.slug),
              subject: loaderData.page.hub.subject.name,
            }),
            faqJsonLd(subjectTutorFaq(loaderData.page)),
            breadcrumbJsonLd(trail(loaderData.page.hub)),
          ],
        })
      : privatePageTags('Page not found'),
  component: SubjectTutorPage,
})

function SubjectTutorPage() {
  const data = Route.useLoaderData()
  if (data.kind === 'tutor')
    return <TutorProfile tutor={data.tutor} reviewed={data.reviewed} others={data.others} trail={tutorTrail(displayName(data.tutor.full_name), data.tutor.slug!)} />
  return <SubjectTutors page={data.page} />
}

/** Ask us to find a tutor for this subject: beside the syllabus when tutors are listed, first when none is. */
function RequestBox({ page, sticky = false }: { page: SubjectTutorsPage; sticky?: boolean }) {
  const { subject } = page.hub
  const short = shortSubject(subject.name)
  const any = page.tutors.length > 0
  return (
    <section id="book" className="scroll-mt-20" aria-labelledby="book-heading">
      <div className={`rounded-2xl border bg-card p-5 shadow-sm sm:p-6 ${sticky ? 'lg:sticky lg:top-20' : 'mx-auto max-w-2xl'}`}>
        <h2 id="book-heading" className="mb-1 text-xl font-bold tracking-tight">
          {any ? `Can’t find a ${subject.name} tutor?` : `Ask us to find a ${short} tutor`}
        </h2>
        <p className="mb-5 text-[15px] text-muted-foreground">
          {any ? `Not near ${listText(tutorTowns(page.tutors), 'or')}? We look for ${short} tutors in ${listText([...TUTOR_TOWNS.filter((t) => !tutorTowns(page.tutors).some((x) => x.includes(t))), 'your own town'], 'or')} too.` : `${listText([...TUTOR_TOWNS, 'anywhere else'], 'or')}: we look in your town, then send you the ${short} tutor’s fee on WhatsApp.`}
        </p>
        <BookingForm fixedSubject={{ name: subject.name, otherHref: `${tutorsPath()}#book` }} />
      </div>
    </section>
  )
}

function SubjectTutors({ page }: { page: SubjectTutorsPage }) {
  const { hub, tutors } = page
  const { subject } = hub
  const short = shortSubject(subject.name)
  return (
    <article className="app-page site-page space-y-12 pb-8 sm:space-y-16">
      <div className="space-y-5">
        <Breadcrumbs trail={trail(hub)} />
        <SubjectBanner slug={subject.slug} eyebrow="Book a private tutor" title={`Private ${short} tutors`} />
        <p className="max-w-3xl text-[17px] leading-relaxed text-muted-foreground">{subjectTutorIntro(page)}</p>
      </div>

      <TutorMarketplace subjectId={subject.id} subjectName={subject.name} initialTutors={tutors} emptyState={false} />

      {tutors.length ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
          <SyllabusCoverage page={page} />
          <RequestBox page={page} sticky />
        </div>
      ) : (
        <>
          <RequestBox page={page} />
          <SyllabusCoverage page={page} />
        </>
      )}

      <ReviewedByTutors page={page} />

      <PractiseBetweenLessons page={page} />

      <TutorFaq items={subjectTutorFaq(page)} topic={short} more={{ href: TUTOR_HUB_FAQ, label: 'Booking, payment and the blue tick' }} />

      <RelatedSubjectTutors page={page} />

      <TutorJoinBand subjectName={subject.name} tutorCount={tutors.length} />
    </article>
  )
}
