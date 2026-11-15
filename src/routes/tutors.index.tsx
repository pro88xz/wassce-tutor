import { createFileRoute } from '@tanstack/react-router'
import { Check, ClipboardCheck, MessageCircle, UserRound } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { fetchSubjectSummaries, hasSubjectPage } from '@/lib/public-content'
import { breadcrumbJsonLd, faqJsonLd, indexablePageTags, tutoringServiceJsonLd } from '@/lib/seo'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { BookingForm } from '@/components/tutors/BookingForm'
import { TutorMarketplace } from '@/components/tutors/Marketplace'
import { TUTOR_FAQ, TutorFaq, TutorHowItWorks, TutorSubjectGrid } from '@/components/tutors/TutorSections'

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['Book a tutor', '/tutors'],
]

const TITLE = 'Book a WASSCE Tutor in Sierra Leone: Verified, In Person | WASSCE Tutor'
const DESCRIPTION =
  'Choose a verified WASSCE tutor in Sierra Leone, see their monthly fee upfront, and message them on WhatsApp to arrange in-person lessons near you.'

export const Route = createFileRoute('/tutors/')({
  ssr: true,
  loader: async () => (await fetchSubjectSummaries()).filter((s) => hasSubjectPage(s.topicCount)),
  staleTime: Infinity,
  head: () =>
    indexablePageTags({
      path: '/tutors',
      title: TITLE,
      ogTitle: 'Book a verified WASSCE tutor for in-person lessons',
      description: DESCRIPTION,
      jsonLd: [
        tutoringServiceJsonLd({ name: 'WASSCE tutoring in Sierra Leone', description: DESCRIPTION, path: '/tutors' }),
        faqJsonLd(TUTOR_FAQ),
        breadcrumbJsonLd(TRAIL),
      ],
    }),
  component: TutorsPage,
})

function TutorsPage() {
  const subjects = Route.useLoaderData()
  return (
    <article className="tutor-booking-page site-page space-y-16 pb-12 sm:space-y-20">
      <div className="space-y-6">
        <Breadcrumbs trail={TRAIL} />
        <header className="tutor-booking-hero">
          <div className="tutor-booking-hero-copy">
            <p className="tutor-booking-eyebrow"><span /> VERIFIED TUTORS · IN PERSON</p>
            <h1>A real tutor.<br /><em>Focused on your progress.</em></h1>
            <p className="tutor-booking-lede">
              Choose a verified teacher who knows the WASSCE syllabus, see their monthly fee upfront, and message them on WhatsApp to arrange in-person lessons near you.
            </p>
            <ul className="tutor-booking-points">
              {[
                'Every tutor reviewed by WASSCE Tutor before they are listed',
                'In-person lessons, arranged directly with your tutor',
                'Monthly fee shown upfront: you agree before you message',
              ].map((t) => (
                <li key={t}><Check aria-hidden /> <span>{t}</span></li>
              ))}
            </ul>
            <div className="tutor-booking-actions">
              <a href="#tutors" className="tutor-book-primary">See tutors <span aria-hidden>↓</span></a>
              <a href="#tutor-how" className="tutor-book-secondary">How it works</a>
            </div>
            <p className="tutor-booking-reassurance"><span /> Free to contact · You pay the tutor directly</p>
          </div>
          <div className="tutor-booking-visual">
            <img
              src={TUTOR_PHOTO.src}
              srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
              sizes="(min-width: 768px) 560px, 100vw"
              alt="A tutor and a student going through notes together"
              width={1280}
              height={853}
              fetchPriority="high"
            />
            <div className="tutor-photo-caption">
              <span className="tutor-photo-icon"><UserRound aria-hidden /></span>
              <span><strong>In-person lessons</strong><small>One to one, near you</small></span>
            </div>
            <div className="tutor-visual-index"><span>PERSONAL SUPPORT</span><strong>01 / 03</strong></div>
          </div>
        </header>
      </div>

      <TutorMarketplace />

      <TutorHowItWorks />

      <section id="book" className="tutor-request-section scroll-mt-24" aria-labelledby="book-heading">
        <div className="tutor-request-intro">
          <p className="tutor-booking-eyebrow"><span /> CAN’T FIND THE RIGHT TUTOR?</p>
          <h2 id="book-heading">Tell us what you need.<br /><em>We’ll find a tutor.</em></h2>
          <p>Share your subject and area. We’ll reply on WhatsApp with a tutor for in-person lessons near you, and their monthly fee.</p>
          <div className="tutor-request-assurances">
            <div><span className="tutor-assurance-icon"><MessageCircle aria-hidden /></span><span><strong>Direct WhatsApp follow-up</strong><small>No app or account needed to enquire.</small></span></div>
            <div><span className="tutor-assurance-icon"><ClipboardCheck aria-hidden /></span><span><strong>Clear before you commit</strong><small>You hear the fee before anything is arranged.</small></span></div>
          </div>
          <div className="tutor-request-side-note">
            <span>BETWEEN LESSONS</span>
            <p>Keep building confidence with WASSCE Tutor lessons and exam-style practice.</p>
            <a href="/wassce/subjects">Explore the syllabus <span aria-hidden>↗</span></a>
          </div>
        </div>
        <div className="tutor-form-shell">
          <div className="tutor-form-heading"><span>FIND ME A TUTOR</span><strong>Let’s get started.</strong><p>Complete the details below. It takes about a minute.</p></div>
          <BookingForm subjects={subjects.map((s) => s.name)} />
        </div>
      </section>

      <section className="tutor-subject-section" aria-labelledby="by-subject">
        <div className="tutor-section-heading">
          <div><p className="tutor-booking-eyebrow"><span /> SUBJECT SPECIALISATIONS</p><h2 id="by-subject">Find support by subject.</h2><p>Choose a subject to see its syllabus topics and tutoring information.</p></div>
          <a href="/wassce/subjects">Browse all subjects <span aria-hidden>↗</span></a>
        </div>
        <TutorSubjectGrid subjects={subjects} />
      </section>

      <TutorFaq />
    </article>
  )
}
