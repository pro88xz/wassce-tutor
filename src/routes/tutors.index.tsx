import { createFileRoute } from '@tanstack/react-router'
import { Check, ClipboardCheck, MessageCircle, UserRound } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { fetchSubjectSummaries, hasSubjectPage } from '@/lib/public-content'
import { breadcrumbJsonLd, faqJsonLd, indexablePageTags, tutoringServiceJsonLd } from '@/lib/seo'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { BookingForm } from '@/components/tutors/BookingForm'
import { TUTOR_FAQ, TutorFaq, TutorHowItWorks, TutorSubjectGrid } from '@/components/tutors/TutorSections'

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['Book a tutor', '/tutors'],
]

const TITLE = 'Book a WASSCE Tutor in Sierra Leone: Online or Home | WASSCE Tutor'
const DESCRIPTION =
  'One-to-one WASSCE lessons with a real tutor, online or at home in Sierra Leone. Choose your subject, tell us what you need, and we match you on WhatsApp.'

export const Route = createFileRoute('/tutors/')({
  ssr: true,
  loader: async () => (await fetchSubjectSummaries()).filter((s) => hasSubjectPage(s.topicCount)),
  staleTime: Infinity,
  head: () =>
    indexablePageTags({
      path: '/tutors',
      title: TITLE,
      ogTitle: 'Book a real WASSCE tutor: online or at home',
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
    <article className="tutor-booking-page mx-auto max-w-6xl space-y-16 pb-12 sm:space-y-20">
      <div className="space-y-6">
        <Breadcrumbs trail={TRAIL} />
        <header className="tutor-booking-hero">
          <div className="tutor-booking-hero-copy">
            <p className="tutor-booking-eyebrow"><span /> PERSONAL WASSCE SUPPORT</p>
            <h1>A real tutor.<br /><em>Focused on your progress.</em></h1>
            <p className="tutor-booking-lede">
              One-to-one help from a teacher who knows the WASSCE syllabus. Learn online or at home, with lessons built around the subjects and topics you need help with.
            </p>
            <ul className="tutor-booking-points">
              {[
                'Any WASSCE subject, from SSS1 to SSS3 or as a private candidate',
                'Online lessons anywhere; home lessons where available',
                'Price confirmed on WhatsApp before you pay anything',
              ].map((t) => (
                <li key={t}><Check aria-hidden /> <span>{t}</span></li>
              ))}
            </ul>
            <div className="tutor-booking-actions">
              <a href="#book" className="tutor-book-primary">Request a tutor <span aria-hidden>↗</span></a>
              <a href="#tutor-how" className="tutor-book-secondary">How it works</a>
            </div>
            <p className="tutor-booking-reassurance"><span /> Free to enquire · No payment until you agree</p>
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
              <span><strong>One-to-one teaching</strong><small>Real teachers, not AI</small></span>
            </div>
            <div className="tutor-visual-index"><span>PERSONAL SUPPORT</span><strong>01 / 03</strong></div>
          </div>
        </header>
      </div>

      <TutorHowItWorks />

      <section id="book" className="tutor-request-section scroll-mt-24" aria-labelledby="book-heading">
        <div className="tutor-request-intro">
          <p className="tutor-booking-eyebrow"><span /> START WITH A REQUEST</p>
          <h2 id="book-heading">Tell us what<br /><em>you want to work on.</em></h2>
          <p>Share a few details. We’ll follow up on WhatsApp, help find the right tutor and confirm the schedule and price with you.</p>
          <div className="tutor-request-assurances">
            <div><span className="tutor-assurance-icon"><MessageCircle aria-hidden /></span><span><strong>Direct WhatsApp follow-up</strong><small>No app or account needed to enquire.</small></span></div>
            <div><span className="tutor-assurance-icon"><ClipboardCheck aria-hidden /></span><span><strong>Clear before you commit</strong><small>Agree the tutor, times and price first.</small></span></div>
          </div>
          <div className="tutor-request-side-note">
            <span>BETWEEN LESSONS</span>
            <p>Keep building confidence with WASSCE Tutor lessons and exam-style practice.</p>
            <a href="/wassce/subjects">Explore the syllabus <span aria-hidden>↗</span></a>
          </div>
        </div>
        <div className="tutor-form-shell">
          <div className="tutor-form-heading"><span>YOUR TUTOR REQUEST</span><strong>Let’s get started.</strong><p>Complete the details below. It takes about a minute.</p></div>
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
