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
  ssr: true, // prerendered to static HTML at build time
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
    <article className="mx-auto max-w-5xl space-y-14 pb-8 sm:space-y-16">
      <div className="space-y-6">
        <Breadcrumbs trail={TRAIL} />
        <header className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-primary">Book a tutor</p>
            <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-balance sm:text-[2.75rem]">A real WASSCE tutor, one to one</h1>
            <p className="text-[17px] text-muted-foreground">
              Get personal help from a teacher who knows the WASSCE syllabus, online or at home. Tell us your subject and what you need, and we match you with a tutor.
            </p>
            <ul className="space-y-2 text-[15px]">
              {['Ask for any WASSCE subject, from SSS1 to SSS3 or as a private candidate', 'Online lessons anywhere, home lessons where available', 'Price confirmed on WhatsApp before you pay anything'].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {t}</li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <a href="#book" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
                Request a tutor
              </a>
              <a href="#tutor-how" className="inline-flex h-12 items-center justify-center rounded-xl border bg-card px-6 font-semibold transition-colors hover:border-primary/40">
                How it works
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={TUTOR_PHOTO.src}
              srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
              sizes="(min-width: 768px) 480px, 100vw"
              alt="A teacher helping a pupil with her work at a desk"
              width={1280}
              height={853}
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <span className="absolute -bottom-4 left-4 inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-sm font-semibold shadow-lg">
              <UserRound className="h-4 w-4 text-primary" aria-hidden /> Real teachers, not AI
            </span>
          </div>
        </header>
      </div>

      <TutorHowItWorks />

      <section id="book" className="scroll-mt-20 grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10" aria-labelledby="book-heading">
        <div className="space-y-4">
          <h2 id="book-heading" className="text-2xl font-bold tracking-tight">Request a tutor</h2>
          <p className="text-[15px] text-muted-foreground">Fill this in and send it on WhatsApp. Asking is free, and nothing is booked until you agree the tutor, times and price.</p>
          <ul className="space-y-3 text-[15px]">
            <li className="flex gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#1a8d4a]" aria-hidden /> We reply on WhatsApp, so there is no app or account needed.</li>
            <li className="flex gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden /> Between lessons, keep practising with WASSCE Tutor's lessons and exam-style questions.</li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <BookingForm subjects={subjects.map((s) => s.name)} />
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="by-subject">
        <h2 id="by-subject" className="text-2xl font-bold tracking-tight">Tutors by subject</h2>
        <TutorSubjectGrid subjects={subjects} />
      </section>

      <TutorFaq />
    </article>
  )
}
