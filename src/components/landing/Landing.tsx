// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
// Section order follows the Design System Blueprint (07): hero, trust strip,
// subject discovery (subject covers and real counts), popular topics, a
// product tour with real screens, a local-fit band, who it's for, the WASSCE
// guide, plans, FAQ and a final call to action. Numbers come from the
// database and the question-set manifest.
import { Link } from '@tanstack/react-router'
import { BookOpen, Check, ChevronRight, CircleCheck, Compass, Moon, School, Smartphone, UserRound, Users, Wallet } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { SubjectCover, subjectArt } from '@/components/ds/SubjectCover'
import { topicPhoto } from '@/lib/topic-photos'
import { SubjectShowcase } from '@/components/landing/SubjectShowcase'
import { SwipeRow } from '@/components/ds/SwipeRow'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { ProductTour } from '@/components/landing/ProductTour'
import { DownloadButton } from '@/components/DownloadButton'
import { TopicSearch } from '@/components/landing/TopicSearch'

export function Landing({ data }: { data: LandingData }) {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl space-y-16 sm:space-y-24">
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
        <p className="text-sm font-medium text-white/80">Built in Freetown for Sierra Leone students</p>
        <div className="space-y-3">
          <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-tight text-balance text-white sm:text-[3.25rem]">
            Pass WASSCE with confidence.
          </h1>
          <p className="mx-auto max-w-xl text-balance text-base text-white/85 sm:text-lg">
            Lessons for every topic, exam-style practice with the full working, and an AI tutor that explains anything, all organised around your syllabus.
          </p>
        </div>
        <TopicSearch />
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/auth"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-7 text-base font-semibold text-brand-strong transition-colors hover:bg-brand-soft sm:w-auto"
          >
            Start free for 7 days
          </Link>
          <DownloadButton variant="hero" />
        </div>
        <p className="text-sm text-white/75">7 days free, no card needed · then from 25 NLe a month with Orange Money or AfriMoney</p>
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
    ['25 NLe', 'a month, everything included'],
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
          <p className="text-sm font-semibold text-primary">Popular topics</p>
          <h2 id="popular-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl">Jump straight into a topic</h2>
        </div>
        <a href="/wassce/subjects" className="hidden min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
          All subjects <ChevronRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
      <SwipeRow label="Popular topics" count={data.popular.length} grid="sm:grid-cols-2 lg:grid-cols-4">
        {data.popular.map((t) => {
          const photo = topicPhoto(t.subjectSlug, t.topicSlug)
          return (
            <a
              key={`${t.subjectSlug}/${t.topicSlug}`}
              href={topicPath(t.subjectSlug, t.topicSlug)}
              className="group flex w-[76%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40 sm:w-auto"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-muted">
                {photo ? (
                  <img
                    src={photo.small}
                    srcSet={`${photo.small} 480w, ${photo.src} 960w`}
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 76vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{ objectPosition: photo.position ?? 'center' }}
                  />
                ) : (
                  <SubjectCover slug={t.subjectSlug} shape="wide" rounded="rounded-none" className="h-full w-full" />
                )}
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: subjectArt(t.subjectSlug).bg }} aria-hidden />
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

/** Full-width deep band: local fit, set apart from the white sections around it. */
function LocalBand() {
  const items = [
    { icon: Smartphone, title: 'Built for your phone', body: 'Works in any phone browser and as an Android app, even on patchy data.' },
    { icon: Wallet, title: 'Pay the local way', body: 'Orange Money or AfriMoney. No card and no bank account needed.' },
    { icon: Moon, title: 'Reading mode for late nights', body: 'A warm, low-glare theme for studying after dark.' },
    { icon: BookOpen, title: 'Written to the WASSCE syllabus', body: 'Topics follow the syllabus, grouped the way you will study them.' },
  ]
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-brand-deep text-white">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <p className="text-sm font-semibold text-white/70">Made in Freetown</p>
        <h2 className="mt-1 max-w-xl text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">Built for studying in Sierra Leone</h2>
        <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-2 border-t border-white/15 pt-4">
              <Icon className="h-6 w-6 text-[#ffd166]" strokeWidth={1.8} aria-hidden />
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-white/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StartingPoint() {
  const paths = [
    { icon: School, tone: 'bg-[#5b34d6]', title: "I'm in SSS3", body: 'Follow your faculty’s subjects topic by topic and track your progress to exam day.', href: '/auth' },
    { icon: UserRound, tone: 'bg-[#0d8486]', title: "I'm a private candidate", body: 'Revise at your own pace with lessons, exam-style practice and the AI tutor.', href: '/auth' },
    { icon: Users, tone: 'bg-[#b0610f]', title: "I'm a parent or teacher", body: 'See exactly what every WASSCE subject covers before your student signs up.', href: '/wassce/subjects' },
  ]
  return (
    <section className="grid items-center gap-6 md:grid-cols-[1fr_1.3fr] md:gap-12" aria-labelledby="who-heading">
      <div className="space-y-2 text-center md:text-left">
        <p className="text-sm font-semibold text-primary">Who it's for</p>
        <h2 id="who-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">Made for everyone preparing for WASSCE</h2>
        <p className="text-[15px] text-muted-foreground">Start where you are. Your subjects and first lesson are set up in a minute.</p>
      </div>
      <ul className="divide-y rounded-2xl border bg-card">
        {paths.map(({ icon: Icon, tone, title, body, href }) => (
          <li key={title}>
            <a href={href} className="flex min-h-20 items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50 sm:px-5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${tone}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{title}</span>
                <span className="block text-sm text-muted-foreground">{body}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Book a tutor: the human-tutor product, introduced with its photo. */
function TutorTeaser() {
  return (
    <section className="grid overflow-hidden rounded-2xl border bg-card md:grid-cols-2" aria-labelledby="tutor-teaser">
      <img
        src={TUTOR_PHOTO.small}
        srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
        sizes="(min-width: 768px) 512px, 100vw"
        alt=""
        loading="lazy"
        width={640}
        height={427}
        className="h-56 w-full object-cover sm:h-72 md:h-full"
      />
      <div className="space-y-3 p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">Book a tutor</p>
        <h2 id="tutor-teaser" className="text-2xl font-bold leading-tight tracking-tight text-balance">Want a real teacher, one to one?</h2>
        <p className="text-[15px] text-muted-foreground">
          Book a tutor for any WASSCE subject, online or at home. Tell us what you need and we match you with a tutor on WhatsApp. Asking is free.
        </p>
        <ul className="space-y-1.5 text-[15px]">
          {['Help with the topics you find hard', 'Price confirmed before you pay anything'].map((t) => (
            <li key={t} className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {t}</li>
          ))}
        </ul>
        <a href="/tutors" className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
          Book a tutor
        </a>
      </div>
    </section>
  )
}

/** Exam orientation: the public WASSCE guide, with the grade scale as a preview. */
function GuideTeaser() {
  const grades: [string, string][] = [
    ['A1', 'credit'], ['B2', 'credit'], ['B3', 'credit'], ['C4', 'credit'], ['C5', 'credit'], ['C6', 'credit'], ['D7', 'pass'], ['E8', 'pass'], ['F9', 'fail'],
  ]
  const tone = { credit: 'bg-success/15 text-success', pass: 'bg-warning/15 text-warning', fail: 'bg-muted text-muted-foreground' }
  return (
    <section className="overflow-hidden rounded-2xl border bg-card md:grid md:grid-cols-2" aria-labelledby="guide-heading">
      <div className="space-y-3 p-6 sm:p-8">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Compass className="h-4 w-4" aria-hidden /> WASSCE guide</p>
        <h2 id="guide-heading" className="text-2xl font-bold leading-tight tracking-tight">New to WASSCE? Start with the guide</h2>
        <p className="text-[15px] text-muted-foreground">How the exam works in Sierra Leone, which subjects each faculty sits, and how grades are worked out.</p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <a href="/wassce" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
            Read the WASSCE guide
          </a>
          <a href="/wassce/subjects" className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-colors hover:border-primary/40">
            Subjects and syllabus
          </a>
        </div>
      </div>
      <div className="border-t bg-muted/50 p-6 sm:p-8 md:border-l md:border-t-0">
        <p className="text-sm font-semibold">WASSCE grades</p>
        <ul className="mt-3 grid grid-cols-9 gap-1.5" aria-label="WASSCE grade scale from A1 to F9">
          {grades.map(([g, k]) => (
            <li key={g} className={`flex h-11 items-center justify-center rounded-lg text-sm font-bold ${tone[k as keyof typeof tone]}`}>{g}</li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span><span className="font-semibold text-success">A1–C6</span> credit</span>
          <span><span className="font-semibold text-warning">D7–E8</span> pass</span>
          <span><span className="font-semibold">F9</span> fail</span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">University courses usually ask for credits (C6 or better) in five subjects, often including English Language and Mathematics.</p>
      </div>
    </section>
  )
}

/** Structurally identical cards; terms stated in full, not in footnotes. */
function Plans() {
  // Prices are also enforced in the database (payment_requests policy); see subscribe.tsx.
  const plans = [
    { name: 'Monthly', price: 25, period: 'per month', perMonth: '25 NLe a month', saving: 'Pay one month at a time', best: false },
    { name: 'Quarterly', price: 60, period: 'per 3 months', perMonth: '20 NLe a month', saving: 'Save 15 NLe', best: false },
    { name: 'Yearly', price: 220, period: 'per year', perMonth: '18.33 NLe a month', saving: 'Save 80 NLe', best: true },
  ]
  const includes = ['Every subject and lesson', 'Every practice set', 'The AI tutor', 'Progress tracking']
  return (
    <section id="plans" className="scroll-mt-20 space-y-8">
      <SectionTitle eyebrow="Plans" title="One price, everything included" body="Every plan unlocks every subject, every practice set and the AI tutor. Start with 7 days free." />
      <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`flex flex-col rounded-2xl bg-card p-5 ${p.best ? 'border-2 border-primary' : 'border'}`}>
            <div className="flex h-6 items-center justify-between">
              <h3 className="font-semibold">{p.name}</h3>
              {p.best && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-primary">Lowest monthly cost</span>}
            </div>
            <p className="mt-3">
              <span className="text-4xl font-bold tracking-tight tabular-nums">{p.price}</span>
              <span className="ml-1 text-sm font-semibold text-muted-foreground">NLe {p.period}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{p.perMonth}</p>
            <p className={`text-sm font-semibold ${p.best || p.saving.startsWith('Save') ? 'text-success' : 'text-muted-foreground'}`}>{p.saving}</p>
            <ul className="mt-4 flex-1 space-y-2 border-t pt-4 text-sm">
              {includes.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-success" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className={`mt-5 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                p.best ? 'bg-primary text-primary-foreground hover:bg-brand-strong' : 'border bg-card hover:border-primary/40'
              }`}
            >
              Start 7 days free
            </Link>
          </div>
        ))}
      </div>
      <ul className="mx-auto grid max-w-4xl gap-x-6 gap-y-3 rounded-2xl border bg-card p-5 text-sm text-muted-foreground sm:grid-cols-2">
        {[
          ['Free trial', '7 days with full access. No card needed.'],
          ['After the trial', 'Lessons, practice and the AI tutor need a plan. Your progress is kept.'],
          ['Paying', 'Orange Money or AfriMoney. We confirm on WhatsApp and switch your plan on.'],
          ['No automatic renewal', 'A plan simply ends on its last day unless you choose to pay again.'],
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
  ['Is WASSCE Tutor free?', 'You get 7 days free with full access, no card needed. After that, plans start at NLe 25 a month, and every plan includes every subject, every practice set and the AI tutor.'],
  ['Which subjects are covered?', 'All the main WASSCE subjects for Science, Arts, Commercial and Technical students, including English Language and Mathematics. Each subject is broken down topic by topic, and new lessons are added all the time.'],
  ['Are these real WAEC past papers?', 'No. Practice sets are original WASSCE-style questions written by WASSCE Tutor to match the syllabus and the exam format, each with the full working. We do not copy WAEC papers.'],
  ['How do I pay?', 'Choose a plan, then pay with Orange Money or AfriMoney. We confirm your payment on WhatsApp and switch your plan on. Plans do not renew automatically.'],
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
        <p className="text-[15px] text-brand-strong">Start with one topic today. 7 days free, no card needed.</p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link to="/auth" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-brand-strong sm:w-auto">
            Start free for 7 days
          </Link>
          <DownloadButton variant="outline" />
        </div>
      </div>
    </section>
  )
}
