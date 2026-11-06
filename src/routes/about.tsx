import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, Mail, MapPin } from 'lucide-react'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { SUBJECT_PHOTOS } from '@/lib/subject-photos'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { TOPIC_PHOTOS } from '@/lib/topic-photos'
import { HOME_PHOTO_CREDITS } from '@/lib/home-photos'
import { publicHead } from '@/lib/seo'
import { fetchLandingData } from '@/lib/public-content'

export const Route = createFileRoute('/about')({
  head: publicHead('/about'),
  ssr: true, // prerendered to static HTML at build time
  // Live subject/topic/lesson counts, baked into the prerendered page.
  loader: () => fetchLandingData(),
  staleTime: Infinity,
  component: About,
})

const PHOTO_CREDITS = [
  ...Object.entries(SUBJECT_PHOTOS).sort((a, b) => a[1].subject.localeCompare(b[1].subject)),
  ['tutors', { subject: 'Book a tutor', caption: TUTOR_PHOTO.caption, credit: TUTOR_PHOTO.credit }] as const,
  ...HOME_PHOTO_CREDITS.map((h, i) => [`home-${i}`, { subject: h.label, caption: h.caption, credit: h.credit }] as const),
  ...Object.entries(TOPIC_PHOTOS)
    .sort((a, b) => a[1].topic.localeCompare(b[1].topic))
    .map(([key, p]) => [key, { subject: `${p.topic} (topic)`, caption: p.caption, credit: p.credit }] as const),
]

const COVER_ROW = ['english-language', 'mathematics', 'biology', 'chemistry', 'government', 'economics']

function About() {
  const { totals } = Route.useLoaderData()
  const features = [
    {
      title: `${totals.subjects} WASSCE subjects, topic by topic`,
      body: `Science, Arts, Commercial and Technical subjects, broken down into ${totals.topics} syllabus topics, with ${totals.lessons} lessons so far.`,
    },
    { title: 'Lessons with diagrams and properly rendered maths', body: 'Step-by-step explanations written for clarity, not for filler.' },
    { title: 'Exam-style practice, marked instantly', body: 'Original WASSCE-style questions written to the syllabus, with the full working and why each wrong option is wrong.' },
    { title: 'An AI tutor, any time', body: 'Ask any WASSCE question in plain English and get a clear, step-by-step answer, labelled as AI.' },
    { title: 'Built for any Android phone', body: 'Made for patchy data and shared phones.' },
    { title: 'Pay with Orange Money or AfriMoney', body: 'No card needed. Plans start at 25 NLe a month.' },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-12">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden /> Freetown, Sierra Leone
        </p>
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-4xl">Built in Sierra Leone, for Sierra Leonean students.</h1>
        <p className="text-lg text-muted-foreground">
          WASSCE Tutor is a WASSCE preparation platform made specifically for students sitting the West African Senior
          School Certificate Examination in Sierra Leone. We focus on what local students actually need, not generic
          global content.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border text-center" aria-label="WASSCE Tutor in numbers">
        {([[totals.subjects, 'subjects'], [totals.topics, 'topics'], [totals.lessons, 'lessons']] as const).map(([n, label]) => (
          <div key={label} className="bg-card px-3 py-5">
            <p className="text-3xl font-bold tabular-nums">{n}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Why we exist</h2>
        <p className="text-muted-foreground">
          WASSCE is the gate that decides whether a Sierra Leonean student gets into university, secures a scholarship,
          or starts their working life on the right footing. Yet most preparation materials available to students are
          imported from Ghana or Nigeria, miss the Sierra Leone context, or sit behind expensive textbooks and private
          tutors that families can&rsquo;t always afford.
        </p>
        <p className="text-muted-foreground">
          We built WASSCE Tutor to change that. One affordable subscription unlocks every subject, every practice set,
          every lesson, and an AI tutor that explains things in a way that fits how Sierra Leonean students learn.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold tracking-tight">What you get</h2>
        <div className="grid grid-cols-6 gap-2" aria-hidden>
          {COVER_ROW.map((slug) => (
            <SubjectCover key={slug} slug={slug} shape="thumb" className="aspect-square w-full" rounded="rounded-xl" />
          ))}
        </div>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {features.map(({ title, body }) => (
            <li key={title} className="flex gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Made for Sierra Leone</h2>
        <p className="text-muted-foreground">
          WASSCE Tutor is built and maintained in Freetown by a Sierra Leonean developer who understands the realities of
          studying for WAEC here: limited textbook access, expensive data, shared devices, unreliable power. Every
          product decision, from the small app size to the flat monthly pricing, is made with these constraints in mind.
        </p>
        <p className="text-muted-foreground">
          We are not a global ed-tech company adapting content for Africa. We are a local team building for our own
          market.
        </p>
      </section>

      {PHOTO_CREDITS.length > 0 && (
        <section id="photo-credits" className="scroll-mt-20 space-y-3">
          <h2 className="text-lg font-bold tracking-tight">Photo credits</h2>
          <p className="text-sm text-muted-foreground">
            Subject photos are used under open licences that allow commercial use. They have been cropped and compressed for the web.
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {PHOTO_CREDITS.map(([slug, p]) => (
              <li key={slug}>
                <span className="font-medium text-foreground">{p.subject}:</span> {p.caption}, by{' '}
                {p.credit.creatorUrl ? <a href={p.credit.creatorUrl} className="underline underline-offset-2 hover:text-foreground" rel="noopener">{p.credit.creator}</a> : p.credit.creator}
                {' '}via <a href={p.credit.sourceUrl} className="underline underline-offset-2 hover:text-foreground" rel="noopener">{p.credit.source}</a>,{' '}
                <a href={p.credit.licenseUrl} className="underline underline-offset-2 hover:text-foreground" rel="noopener license">{p.credit.license}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex items-center gap-4 rounded-2xl border bg-card p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold">Get in touch</h2>
          <p className="text-sm text-muted-foreground">Questions, feedback, or partnership enquiries?</p>
        </div>
        <a href="mailto:secretsafe.cc@gmail.com" className="inline-flex h-11 shrink-0 items-center rounded-xl border bg-card px-4 text-sm font-semibold hover:border-primary/40">
          Contact us
        </a>
      </section>

      <section className="rounded-2xl bg-brand-soft px-6 py-10 text-center">
        <div className="space-y-3">
          <h2 className="text-[1.75rem] font-bold tracking-tight text-brand-deep">Ready to start?</h2>
          <p className="text-brand-strong">7 days free. No card. Plans never renew automatically.</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link to="/auth" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong sm:w-auto">
              Start your free trial
            </Link>
            <a href="/wassce/subjects" className="inline-flex h-12 w-full items-center justify-center rounded-xl border bg-card px-7 font-semibold transition-colors hover:border-primary/40 sm:w-auto">
              Browse subjects
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
