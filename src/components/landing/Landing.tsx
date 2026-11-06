// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
// Section order follows the Design System Blueprint (07): hero, trust strip,
// subject discovery (subject covers and real counts), popular topics, a
// product tour with real screens, a local-fit band, who it's for, the WASSCE
// guide, plans, FAQ and a final call to action. Numbers come from the
// database and the question-set manifest.
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { useReveal } from '@/components/ds/useReveal'
import { ArrowRight, BookOpen, Check, ChevronRight, CircleCheck, Compass, GraduationCap, Moon, Smartphone, UserRound, Wallet } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { SubjectCover, subjectArt } from '@/components/ds/SubjectCover'
import { topicPhoto } from '@/lib/topic-photos'
import { SubjectShowcase } from '@/components/landing/SubjectShowcase'
import { SwipeRow } from '@/components/ds/SwipeRow'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { ProductTour } from '@/components/landing/ProductTour'
import { DownloadButton } from '@/components/DownloadButton'
import { FREE_FEATURES, FROM_PRICE, PAID_FEATURES, PLANS, type PlanId } from '@/lib/plans'
import { TopicSearch } from '@/components/landing/TopicSearch'

export function Landing({ data }: { data: LandingData }) {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <>
      <Hero />
      <div ref={root} className="mx-auto max-w-5xl space-y-16 sm:space-y-24">
        <TrustStrip data={data} />
        <SubjectShowcase subjects={data.subjects} />
        {data.popular.length > 0 && <PopularTopics data={data} />}
        <ProductTour />
        <LocalBand />
        <StartingPoint />
        <TutorTeaser />
        <GuideTeaser />
        <Plans />
        <Faq />
        <FinalCta />
      </div>
    </>
  )
}

/** Restrained brand field: one primary action, one discovery action (search), one quieter secondary. */
function Hero() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-6 w-screen bg-gradient-to-br from-primary to-brand-strong">
      <div className="mx-auto max-w-3xl space-y-6 px-6 pb-20 pt-10 text-center sm:pb-24 sm:pt-14">
        <div className="space-y-3">
          {/* The keyword line is part of the h1, so the page's main heading
              matches its title and description; it reads as an eyebrow. */}
          <h1 className="flex flex-col gap-6 text-white">
            <span className="text-sm font-medium text-white/80">WASSCE lessons and practice questions for Sierra Leone</span>
            <span className="text-[2.25rem] font-bold leading-[1.1] tracking-tight text-balance sm:text-[3.25rem]">Pass WASSCE with confidence.</span>
          </h1>
          <p className="mx-auto max-w-xl text-balance text-base text-white/85 sm:text-lg">
            Lessons for every topic, exam-style practice questions with the full working, and an AI tutor that explains anything, all organised around your syllabus. Built in Freetown.
          </p>
        </div>
        <TopicSearch />
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/auth"
            className="inline-flex min-h-12 py-2 w-full items-center justify-center rounded-xl bg-white px-7 text-base font-semibold text-brand-strong transition-colors hover:bg-brand-soft sm:w-auto text-center"
          >
            Start free
          </Link>
          <DownloadButton variant="hero" />
        </div>
        <p className="text-sm text-white/75">Free account, no card needed · unlock everything for 25 NLe a whole academic year</p>
      </div>
    </section>
  )
}

/** Verified numbers only (counted from the live syllabus), plus the price. */
function TrustStrip({ data }: { data: LandingData }) {
  const items: [string, string][] = [
    [String(data.totals.subjects), 'WASSCE subjects'],
    [String(data.totals.topics), 'syllabus topics'],
    [String(data.totals.lessons), 'lessons written'],
    ['25 NLe', 'a full year, everything included'],
  ]
  return (
    <section aria-label="WASSCE Tutor in numbers" className="relative z-10 -mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border bg-card shadow-sm sm:grid-cols-4">
      {items.map(([value, label], i) => (
        <div key={label} className={`px-4 py-5 text-center ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
          <p className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      ))}
    </section>
  )
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-2 text-center">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">{title}</h2>
      {body && <p className="text-[15px] text-muted-foreground">{body}</p>}
    </div>
  )
}

/**
 * Popular topics as topic cards. Each card shows a photograph of the topic
 * itself (topic-photos.ts), not the subject photo, so topic discovery never
 * repeats the subject cards above; a small subject label in the subject's
 * colour keeps the link to the subject.
 */
function PopularTopics({ data }: { data: LandingData }) {
  return (
    <section className="space-y-5" aria-labelledby="popular-heading">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">Jump straight in</p>
          <h2 id="popular-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl">Popular WASSCE topics</h2>
        </div>
        <a href="/wassce/subjects" className="hidden min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
          All subjects <ChevronRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
      <SwipeRow label="Popular topics" count={data.popular.length} grid="sm:grid-cols-2 lg:grid-cols-4">
        {data.popular.map((t, i) => {
          const photo = topicPhoto(t.subjectSlug, t.topicSlug)
          return (
            <a
              key={`${t.subjectSlug}/${t.topicSlug}`}
              href={topicPath(t.subjectSlug, t.topicSlug)}
              data-reveal={i % 4}
              className="group flex w-[76%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40 sm:w-auto"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-muted">
                {photo ? (
                  <img
                    src={photo.small}
                    srcSet={`${photo.small} 480w, ${photo.src} 960w`}
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 76vw"
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={300}
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${photo.position ?? ''}`}
                  />
                ) : (
                  <SubjectCover slug={t.subjectSlug} shape="wide" rounded="rounded-none" className="h-full w-full" />
                )}
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                  <span className={`h-2 w-2 rounded-full ${subjectArt(t.subjectSlug).tone}`} aria-hidden />
                  {t.subjectName}
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-1 p-4">
                <span className="text-base font-bold leading-snug">{t.topicName}</span>
                <span className="mt-auto pt-1 text-[13px] text-muted-foreground">{t.lessons} lessons</span>
              </span>
            </a>
          )
        })}
      </SwipeRow>
    </section>
  )
}

/** Full-width deep band: local fit, told with photographs rather than small icons. */
const FEATURES = [
  { img: 'feature-phone', alt: 'A student studying on her phone', icon: Smartphone, title: 'Built for your phone', body: 'Works in any phone browser and as an Android app, even on patchy data.' },
  { img: 'feature-pay', alt: 'A customer paying with his phone at a shop', icon: Wallet, title: 'Pay the local way', body: 'Orange Money or AfriMoney. No card and no bank account needed.' },
  { img: 'feature-night', alt: 'A student studying by lamplight at night', icon: Moon, title: 'Reading mode for late nights', body: 'A warm, low-glare theme for studying after dark.' },
  { img: 'feature-syllabus', alt: 'A student writing notes from a textbook', icon: BookOpen, title: 'Written to the WASSCE syllabus', body: 'Topics follow the syllabus, grouped the way you will study them.' },
]

function LocalBand() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-brand-deep text-white" aria-labelledby="local-heading">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div data-reveal className="max-w-xl space-y-2">
          <p className="text-sm font-semibold text-[#ffd166]">Made in Freetown</p>
          <h2 id="local-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-4xl">Built for studying in Sierra Leone</h2>
          <p className="text-[15px] text-white/75">Made for the phones, payments and late nights of WASSCE students here.</p>
        </div>
        <div className="mt-8">
          <SwipeRow label="Features" count={FEATURES.length} grid="sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ img, alt, icon: Icon, title, body }, i) => (
              <div
                key={title}
                data-reveal={i}
                className="group relative aspect-[4/5] w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10 sm:w-auto"
              >
                <img
                  src={`/img/home/${img}-400.webp`}
                  srcSet={`/img/home/${img}-400.webp 400w, /img/home/${img}.webp 800w`}
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 72vw"
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/0" />
                <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-md">
                    <Icon className="h-5 w-5 text-[#ffd166]" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold leading-snug">{title}</h3>
                  <p className="text-sm text-white/80">{body}</p>
                </div>
              </div>
            ))}
          </SwipeRow>
        </div>
      </div>
    </section>
  )
}

/** Who it's for: one photographed card per audience, each the right age for WASSCE. */
function StartingPoint() {
  const paths = [
    { img: 'persona-sss3', tag: 'SSS students', tone: 'bg-[#5b34d6]', title: "I'm in SSS1 to SSS3", body: 'Follow your faculty’s subjects topic by topic and track your progress to exam day.', cta: 'Start free', href: '/auth', alt: 'Secondary school students working in class' },
    { img: 'persona-private', tag: 'Private candidates', tone: 'bg-[#0d8486]', title: "I'm a private candidate", body: 'Revise at your own pace with lessons, exam-style practice and the AI tutor.', cta: 'Start free', href: '/auth', alt: 'A young man studying alone at a desk' },
    { img: 'persona-teacher', tag: 'Parents and teachers', tone: 'bg-[#b0610f]', title: "I'm a parent or teacher", body: 'See exactly what every WASSCE subject covers before your student signs up.', cta: 'Browse subjects', href: '/wassce/subjects', alt: 'A teacher leading a lesson at the whiteboard' },
  ]
  return (
    <section className="space-y-6" aria-labelledby="who-heading">
      <div data-reveal className="mx-auto max-w-2xl space-y-2 text-center">
        <p className="text-sm font-semibold text-primary">Who it's for</p>
        <h2 id="who-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">Made for everyone preparing for WASSCE</h2>
        <p className="text-[15px] text-muted-foreground">Start where you are. Your subjects and first lesson are set up in a minute.</p>
      </div>
      <SwipeRow label="Audiences" count={paths.length} grid="sm:grid-cols-3">
        {paths.map(({ img, tag, tone, title, body, cta, href, alt }, i) => (
          <a
            key={title}
            href={href}
            data-reveal={i}
            className="group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl sm:w-auto"
          >
            <span className="relative block aspect-[4/3] overflow-hidden">
              <img
                src={`/img/home/${img}-480.webp`}
                srcSet={`/img/home/${img}-480.webp 480w, /img/home/${img}.webp 960w`}
                sizes="(min-width: 640px) 33vw, 82vw"
                alt={alt}
                loading="lazy"
                decoding="async"
                width={480}
                height={360}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md ${tone}`}>{tag}</span>
            </span>
            <span className="flex flex-1 flex-col gap-2 p-5">
              <span className="text-xl font-bold leading-snug">{title}</span>
              <span className="flex-1 text-[15px] text-muted-foreground">{body}</span>
              <span className="mt-1 inline-flex items-center gap-1.5 font-semibold text-primary">
                {cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
            </span>
          </a>
        ))}
      </SwipeRow>
    </section>
  )
}

/** Book a tutor: the human-tutor product, introduced with its photo. */
function TutorTeaser() {
  return (
    <section data-reveal className="group grid overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2" aria-labelledby="tutor-teaser">
      <span className="relative block overflow-hidden">
        <img
          src={TUTOR_PHOTO.small}
          srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
          sizes="(min-width: 768px) 512px, 100vw"
          alt="A tutor and a student going through notes together"
          loading="lazy"
          width={640}
          height={427}
          className="h-60 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sm:h-80 md:h-full"
        />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 shadow-lg">
          <UserRound className="h-4 w-4 text-primary" aria-hidden /> Real teachers, not AI
        </span>
      </span>
      <div className="space-y-3 p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">Book a tutor</p>
        <h2 id="tutor-teaser" className="text-2xl font-bold leading-tight tracking-tight text-balance">Want a real WASSCE tutor, one to one?</h2>
        <p className="text-[15px] text-muted-foreground">
          Book a tutor for any WASSCE subject, online or at home. Tell us what you need and we match you with a tutor on WhatsApp. Asking is free.
        </p>
        <ul className="space-y-1.5 text-[15px]">
          {['Help with the topics you find hard', 'Price confirmed before you pay anything'].map((t) => (
            <li key={t} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {t}</li>
          ))}
        </ul>
        <a href="/tutors" className="mt-2 inline-flex min-h-12 py-2 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong text-center">
          Book a tutor
        </a>
      </div>
    </section>
  )
}

/** Exam orientation: the public WASSCE guide, with the grade scale as a preview. */
// The WAEC grade scale as a ladder: bar heights only show order (WAEC
// publishes no fixed percentage bands, so none are implied). Class names are
// literals so Tailwind generates them.
const GRADE_BARS = [
  { g: 'A1', m: 'Excellent', kind: 'credit', h: 'h-full', d: 'delay-[0ms]' },
  { g: 'B2', m: 'Very good', kind: 'credit', h: 'h-[91%]', d: 'delay-[60ms]' },
  { g: 'B3', m: 'Good', kind: 'credit', h: 'h-[82%]', d: 'delay-[120ms]' },
  { g: 'C4', m: 'Credit', kind: 'credit', h: 'h-[73%]', d: 'delay-[180ms]' },
  { g: 'C5', m: 'Credit', kind: 'credit', h: 'h-[64%]', d: 'delay-[240ms]' },
  { g: 'C6', m: 'Credit', kind: 'credit', h: 'h-[55%]', d: 'delay-[300ms]' },
  { g: 'D7', m: 'Pass', kind: 'pass', h: 'h-[42%]', d: 'delay-[360ms]' },
  { g: 'E8', m: 'Pass', kind: 'pass', h: 'h-[34%]', d: 'delay-[420ms]' },
  { g: 'F9', m: 'Fail', kind: 'fail', h: 'h-[24%]', d: 'delay-[480ms]' },
] as const

const BAR_TONE = {
  credit: 'bg-gradient-to-t from-[#0d7a50] to-[#2bb97f] shadow-[0_10px_20px_-8px_rgba(13,122,80,0.55)]',
  pass: 'bg-gradient-to-t from-[#b0650c] to-[#f2a93b] shadow-[0_10px_20px_-8px_rgba(176,101,12,0.5)]',
  fail: 'bg-gradient-to-t from-slate-500 to-slate-400 shadow-[0_10px_20px_-8px_rgba(71,85,105,0.5)]',
}

/** WASSCE guide: an elevated card with the grade ladder, the thing new students most need to understand. */
function GuideTeaser() {
  return (
    <section
      data-reveal
      className="relative overflow-hidden rounded-3xl border bg-card shadow-[0_32px_64px_-32px_rgba(76,29,149,0.4)] md:grid md:grid-cols-2"
      aria-labelledby="guide-heading"
    >
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col justify-center space-y-4 p-6 sm:p-10">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft"><Compass className="h-4 w-4" aria-hidden /></span>
          WASSCE guide
        </p>
        <h2 id="guide-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">New to WASSCE? Know how it is graded</h2>
        <p className="text-[15px] text-muted-foreground">
          Every subject gets one of nine grades. Learn what each one means, which subjects each faculty sits, and how the exam works in Sierra Leone.
        </p>
        <ul className="space-y-2 text-[15px]">
          {['A1 to C6 are credits, the grades that count', 'D7 and E8 are passes; F9 is a fail', 'Each subject is graded on its own'].map((t) => (
            <li key={t} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {t}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <a href="/wassce" className="inline-flex min-h-12 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-brand-strong text-center">
            Read the WASSCE guide <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a href="/wassce/subjects" className="group inline-flex min-h-12 py-2 items-center gap-1 whitespace-nowrap px-3 text-sm font-semibold text-primary hover:underline">
            Subjects and syllabus <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </div>

      <div className="relative p-4 pt-0 sm:p-6 md:pl-0">
        <div className="h-full rounded-2xl bg-gradient-to-b from-brand-soft to-card p-5 ring-1 ring-primary/10 sm:p-6">
          <p className="font-bold">The WASSCE grade scale</p>
          <p className="text-xs font-medium text-muted-foreground">A1 is the best grade, F9 the lowest</p>
          <ul className="mt-4 grid h-44 grid-cols-9 items-end gap-1.5 sm:h-52 sm:gap-2" aria-label="WASSCE grades from A1, the best, to F9">
            {GRADE_BARS.map((b) => (
              <li key={b.g} className="flex h-full items-end">
                <span
                  className={`grade-bar flex w-full justify-center rounded-t-xl rounded-b-md pt-2 text-xs font-bold text-white ring-1 ring-inset ring-white/20 transition-transform duration-700 ease-out sm:text-sm ${b.h} ${b.d} ${BAR_TONE[b.kind]}`}
                >
                  {b.g}
                  <span className="sr-only">: {b.m}{b.kind === 'credit' ? ', credit' : ''}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 grid grid-cols-9 gap-1.5 text-center text-xs font-semibold sm:gap-2" aria-hidden>
            <span className="col-span-6 border-t-2 border-success pt-1.5 text-success">Credit</span>
            <span className="col-span-2 border-t-2 border-warning pt-1.5 text-warning">Pass</span>
            <span className="border-t-2 border-slate-400 pt-1.5 text-muted-foreground">Fail</span>
          </div>
          <div className="mt-5 flex gap-3 rounded-xl bg-card p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] ring-1 ring-black/5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm">
              <span className="font-semibold">Aim for C6 or better.</span>{' '}
              <span className="text-muted-foreground">University courses usually ask for credits in five subjects, often including English Language and Mathematics.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Structurally identical cards; terms stated in full, not in footnotes. */
/** Free account, then two paid plans; terms stated in full, not in footnotes. */
function Plans() {
  // Prices live in src/lib/plans.ts (and are enforced by the server and the database).
  const cards = [
    {
      key: 'free',
      name: 'Free account',
      price: 0,
      length: 'no time limit',
      blurb: 'Try every subject before you pay.',
      features: FREE_FEATURES,
      cta: 'Create a free account',
      to: '/auth' as const,
      best: false,
    },
    ...PLANS.map((p) => ({
      key: p.id,
      name: p.name,
      price: p.priceNle,
      length: p.length,
      blurb: p.blurb,
      features: PAID_FEATURES,
      cta: `Get ${p.name.toLowerCase()}`,
      to: '/subscribe' as const,
      best: !!p.best,
    })),
  ]
  return (
    <section id="plans" className="scroll-mt-20 space-y-8">
      <SectionTitle eyebrow="Plans" title="Start free. Unlock everything for one small payment." body={`A free account opens the first lesson of every topic. A plan opens every lesson, every practice set and the AI tutor, from ${FROM_PRICE} NLe.`} />
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <div
            key={c.key}
            data-reveal={i}
            className={`relative flex flex-col rounded-3xl bg-card p-6 transition-shadow hover:shadow-lg ${
              c.best ? 'border-2 border-primary shadow-[0_24px_48px_-28px_rgba(76,29,149,0.55)]' : 'border'
            }`}
          >
            {c.best && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Best value</span>}
            <h3 className="font-semibold">{c.name}</h3>
            <p className="mt-3">
              <span className="text-4xl font-bold tracking-tight tabular-nums">{c.price === 0 ? 'Free' : c.price}</span>
              {c.price > 0 && <span className="ml-1 text-sm font-semibold text-muted-foreground">NLe</span>}
            </p>
            <p className="text-sm font-semibold text-muted-foreground">{c.price === 0 ? c.length : `for ${c.length}`}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            <ul className="mt-4 flex-1 space-y-2 border-t pt-4 text-sm">
              {c.features.map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <Link
              to={c.to}
              {...(c.to === '/subscribe' ? { search: { plan: c.key as PlanId } } : {})}
              className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-center text-sm font-semibold transition-colors ${
                c.best ? 'bg-primary text-primary-foreground hover:bg-brand-strong' : 'border bg-card hover:border-primary/40'
              }`}
            >
              {c.cta}
            </Link>
          </div>
        ))}
      </div>
      <ul className="mx-auto grid max-w-4xl gap-x-6 gap-y-3 rounded-2xl border bg-card p-5 text-sm text-muted-foreground sm:grid-cols-2">
        {[
          ['No free trial needed', 'The free account never runs out, so you can study before you decide.'],
          ['Paying', 'Orange Money, AfriMoney and more, through a secure Monime checkout. Your plan switches on as soon as the payment is confirmed.'],
          ['No automatic renewal', 'A plan simply ends on its last day. You go back to the free account, and your progress is kept.'],
          ['Buying again', 'Paying while a plan is running adds the new time on top, so nothing is lost.'],
        ].map(([title, body]) => (
          <li key={title} className="flex gap-2">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            <span><span className="font-semibold text-foreground">{title}.</span> {body}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const FAQ: [question: string, answer: string][] = [
  ['Is WASSCE Tutor free?', 'Yes, to start. A free account opens every subject, the first lesson of every topic and a starter practice set in every subject, with no time limit. To unlock everything, pay 10 NLe for a term (4 months) or 25 NLe for a full academic year (12 months).'],
  ['Which subjects are covered?', 'All the main WASSCE subjects for Science, Arts, Commercial and Technical students, including English Language and Mathematics. Each subject is broken down topic by topic, and new lessons are added all the time.'],
  ['Are these real WAEC past papers?', 'No. Practice sets are original WASSCE-style questions written by WASSCE Tutor to match the syllabus and the exam format, each with the full working. We do not copy WAEC papers.'],
  ['How do I pay?', 'Choose a plan and pay on the secure Monime checkout page with Orange Money, AfriMoney and more. Your plan switches on as soon as the payment is confirmed. Plans do not renew automatically.'],
  ['Does it work on my phone?', 'Yes. WASSCE Tutor works in any phone browser, and there is an Android app you can install from this page. It is built to work on patchy data.'],
  ['Who writes the lessons?', 'Lessons are drafted with the help of AI and follow the WASSCE syllabus. Lessons we publish openly on this website are checked by a named reviewer first, and their name appears on the lesson.'],
  ['Is this the official WAEC website?', 'No. WASSCE Tutor is an independent study app built in Sierra Leone. For registration, timetables and results, always use official WAEC channels.'],
]

function Faq() {
  return (
    <section className="space-y-8" aria-labelledby="faq-heading">
      <div id="faq-heading">
        <SectionTitle eyebrow="Questions" title="Frequently asked questions" />
      </div>
      <div className="mx-auto max-w-2xl divide-y rounded-2xl border bg-card">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold">
              {q}
              <span className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="pb-5 text-[15px] text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="rounded-2xl bg-brand-soft px-6 py-10 text-center sm:py-12">
      <div className="mx-auto max-w-xl space-y-4">
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance text-brand-deep sm:text-3xl">Your WASSCE is closer than you think.</h2>
        <p className="text-[15px] text-brand-strong">Start with one topic today. Free account, no card needed.</p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link to="/auth" className="inline-flex min-h-12 py-2 w-full items-center justify-center rounded-xl bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong sm:w-auto text-center">
            Start free
          </Link>
          <DownloadButton variant="outline" />
        </div>
      </div>
    </section>
  )
}
