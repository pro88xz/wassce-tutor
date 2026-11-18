import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, ClipboardCheck, MessageCircle, UserRound } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { fetchSubjectSummaries, hasSubjectPage } from '@/lib/public-content'
import { breadcrumbJsonLd, faqJsonLd, indexablePageTags, tutoringServiceJsonLd } from '@/lib/seo'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { supabase } from '@/lib/supabase'
import { BookingForm } from '@/components/tutors/BookingForm'
import { TutorMarketplace } from '@/components/tutors/Marketplace'
import { PrivateLessonsGuide, TUTOR_FAQ, TutorFaq, TutorHowItWorks, TutorJoinBand, TutorSubjectGrid } from '@/components/tutors/TutorSections'

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['Private tutors', '/tutors'],
]

const TITLE = 'Private WASSCE Tutors in Freetown & Sierra Leone | Home Lessons'
const DESCRIPTION =
  'Book a private tutor for WASSCE in Freetown, Bo, Kenema or Makeni. Home lessons and extra classes in maths, English and sciences, with the monthly fee upfront.'

export const Route = createFileRoute('/tutors/')({
  ssr: true,
  loader: async () => (await fetchSubjectSummaries()).filter((s) => hasSubjectPage(s.topicCount)),
  staleTime: Infinity,
  head: () =>
    indexablePageTags({
      path: '/tutors',
      title: TITLE,
      ogTitle: 'Book a private WASSCE tutor in Sierra Leone: home lessons near you',
      description: DESCRIPTION,
      jsonLd: [
        tutoringServiceJsonLd({ name: 'Private WASSCE tutors in Sierra Leone', description: DESCRIPTION, path: '/tutors' }),
        faqJsonLd(TUTOR_FAQ),
        breadcrumbJsonLd(TRAIL),
      ],
    }),
  component: TutorsPage,
})

function TutorsPage() {
  const subjects = Route.useLoaderData()
  return (
    <>
      <TutorsHero />
      <article className="tutor-booking-page site-page space-y-16 pb-12 pt-14 sm:space-y-20 sm:pt-20">
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

      <PrivateLessonsGuide />

      <section className="tutor-subject-section" aria-labelledby="by-subject">
        <div className="tutor-section-heading">
          <div><p className="tutor-booking-eyebrow"><span /> BY SUBJECT</p><h2 id="by-subject">Private tutors <em>by subject.</em></h2><p>A maths tutor, an English tutor, a physics or chemistry tutor: choose a subject to see its tutors and what they can cover.</p></div>
          <a href="/wassce/subjects">Browse all subjects <span aria-hidden>↗</span></a>
        </div>
        <TutorSubjectGrid subjects={subjects} />
      </section>

      <TutorJoinBand />

      <TutorFaq />
    </article>
    </>
  )
}

/** How many tutors are in the marketplace now, for the hero (null until known, or if there are none). */
function useTutorCount(): number | null {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    let active = true
    void supabase
      .from('tutors')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('listed', true)
      .then(({ count: n, error }) => {
        if (active && !error && n) setCount(n)
      })
    return () => {
      active = false
    }
  }, [])
  return count
}

function TutorsHero() {
  const count = useTutorCount()
  return (
    <section className="site-bleed relative isolate -mt-6 overflow-hidden bg-[var(--site-ink)] text-white" aria-labelledby="tutors-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_32rem_at_100%_0%,rgba(124,92,255,.42),transparent_68%),radial-gradient(40rem_26rem_at_0%_110%,rgba(255,209,102,.16),transparent_70%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_80%_at_70%_30%,#000,transparent)]" />
      <div className="site-container pb-16 pt-6 sm:pb-20 lg:pb-24">
        <Breadcrumbs trail={TRAIL} tone="dark" />
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-white/85 ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.2)]" aria-hidden />
              {count ? `${count} ${count === 1 ? 'tutor' : 'tutors'} in the marketplace` : 'In-person tutoring across Sierra Leone'}
            </p>
            <h1 id="tutors-heading" className="site-display mt-6">
              Private WASSCE tutors, <span className="site-accent text-[#cdbcff]">near you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/72 sm:text-lg">
              One-to-one lessons in person with a real teacher. See each tutor’s monthly fee upfront, then message them on WhatsApp to arrange lessons near you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#tutors" className="site-btn site-btn-premium">
                Book a private tutor
                <span className="site-btn-premium-badge" aria-hidden>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
              <a href="#tutor-how" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline">
                How it works
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/70">
              {['Free to contact', 'Fee shown upfront', 'You pay the tutor directly'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[30rem] pb-8 lg:mx-0 lg:ml-auto">
            <img
              src={TUTOR_PHOTO.src}
              srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
              sizes="(min-width: 1024px) 30rem, 92vw"
              alt="A tutor and a student going through notes together"
              width={1280}
              height={853}
              fetchPriority="high"
              className="aspect-[4/4.3] w-full rounded-[1.75rem] object-cover shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] ring-1 ring-white/10"
            />
            <div className="hero-float absolute -left-3 bottom-0 w-[17.5rem] rounded-2xl bg-white p-4 text-slate-900 shadow-[0_30px_60px_-24px_rgba(0,0,0,.55)] ring-1 ring-slate-900/5 sm:-left-10" style={{ ['--float-time' as string]: '9s' }}>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Three steps</p>
              <ol className="mt-2.5 space-y-2.5">
                {[
                  [UserRound, 'Choose a private tutor near you'],
                  [ClipboardCheck, 'Agree to their monthly fee'],
                  [MessageCircle, 'Message them on WhatsApp'],
                ].map(([Icon, text], i) => {
                  const I = Icon as typeof UserRound
                  return (
                    <li key={i} className="flex items-center gap-2.5 text-[13px] font-semibold">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#efeaff] text-[#5b34d6]">
                        <I className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      {text as string}
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
