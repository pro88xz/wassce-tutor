// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
// Structure follows the competitor teardown: keyword-rich hero with search,
// proof numbers, subjects by faculty, a "where are you starting" router,
// popular topics, how it works, what you get, plans, FAQ, final call to action.
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight, BookOpen, ChartLine, CircleCheck, GraduationCap, Library, MessageCircle, Moon, School, Smartphone,
  Sparkles, UserRound, Users, Wallet,
} from 'lucide-react'
import type { LandingData, SubjectSummary } from '@/lib/public-content'
import { subjectPath, topicPath } from '@/lib/public-content'
import { SubjectIcon } from '@/lib/subject-theme'
import { DownloadButton } from '@/components/DownloadButton'
import { TopicSearch } from '@/components/landing/TopicSearch'

export function Landing({ data }: { data: LandingData }) {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl space-y-20 pb-16">
        <ProofStrip data={data} />
        <SubjectsByFaculty subjects={data.subjects} />
        <StartingPoint />
        {data.popular.length > 0 && <PopularTopics data={data} />}
        <HowItWorks />
        <WhatYouGet />
        <Plans />
        <Faq />
        <FinalCta />
      </div>
    </>
  )
}

function Hero() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-6 w-screen overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary to-brand-strong"

      />
      <div aria-hidden className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/25 blur-3xl" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.25)_100%)]" />

      <div className="relative mx-auto max-w-3xl space-y-7 px-6 pb-24 pt-14 text-center sm:pt-20">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Built in Freetown for Sierra Leone students
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-white drop-shadow-md sm:text-6xl">
            Pass WASSCE with confidence.
          </h1>
          <p className="mx-auto max-w-xl text-balance text-base text-white/90 sm:text-lg">
            Lessons for every topic, past papers scored instantly, and an AI tutor that explains anything. For
            Science, Arts, Commercial and Technical students.
          </p>
        </div>
        <TopicSearch />
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link
            to="/auth"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-blue-700 shadow-xl shadow-blue-950/30 transition hover:bg-white/95 active:scale-[0.98] sm:w-auto"
          >
            Start free for 7 days
          </Link>
          <DownloadButton variant="hero" />
        </div>
        <p className="text-xs text-white/80">No card needed · Pay with Orange Money or AfriMoney · Cancel anytime</p>
      </div>
    </section>
  )
}

function ProofStrip({ data }: { data: LandingData }) {
  const items: [string, string][] = [
    [String(data.totals.subjects), 'WASSCE subjects'],
    [String(data.totals.topics), 'syllabus topics'],
    [String(data.totals.lessons), 'lessons'],
    ['NLe 25', 'a month, all in'],
  ]
  return (
    <section aria-label="WASSCE Tutor in numbers" className="relative z-10 -mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border bg-border shadow-xl shadow-black/5 sm:grid-cols-4">
      {items.map(([value, label]) => (
        <div key={label} className="bg-card px-4 py-5 text-center">
          <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        </div>
      ))}
    </section>
  )
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-2 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-balance">{title}</h2>
      {body && <p className="text-muted-foreground">{body}</p>}
    </div>
  )
}

const ROLE_LABEL = { core: 'Core', faculty: 'Main', elective: 'Elective' } as const

function SubjectsByFaculty({ subjects }: { subjects: SubjectSummary[] }) {
  const faculties = [...new Map(subjects.flatMap((s) => s.faculties.map((f) => [f.faculty.id, f.faculty] as const))).values()].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const [active, setActive] = useState(faculties[0]?.id ?? '')
  return (
    <section className="space-y-8" aria-labelledby="subjects-heading">
      <div id="subjects-heading">
        <SectionTitle
          eyebrow="Every subject"
          title="Your WASSCE subjects, topic by topic"
          body="Pick your faculty. English Language and Mathematics are core for everyone."
        />
      </div>
      <div role="tablist" aria-label="Faculties" className="mx-auto grid w-full max-w-lg grid-cols-4 gap-1 rounded-2xl bg-muted p-1">
        {faculties.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={active === f.id}
            aria-controls={`faculty-${f.id}`}
            onClick={() => setActive(f.id)}
            className={`rounded-xl px-0.5 py-2 text-xs font-semibold tracking-tight transition sm:text-sm ${active === f.id ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {f.name}
          </button>
        ))}
      </div>
      {faculties.map((f) => {
        const list = subjects
          .filter((s) => s.faculties.some((x) => x.faculty.id === f.id))
          .sort((a, b) => {
            const ra = a.faculties.find((x) => x.faculty.id === f.id)!.role
            const rb = b.faculties.find((x) => x.faculty.id === f.id)!.role
            const order = { core: 0, faculty: 1, elective: 2 }
            return order[ra] - order[rb] || b.lessonCount - a.lessonCount
          })
        return (
          // All faculties are in the HTML (crawlable links); only the active one is shown.
          <div key={f.id} id={`faculty-${f.id}`} role="tabpanel" hidden={active !== f.id} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => {
              const role = s.faculties.find((x) => x.faculty.id === f.id)!.role
              const inner = (
                <>
                  <SubjectIcon slug={s.slug} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{s.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {s.topicCount ? `${s.topicCount} topics` : 'Syllabus coming soon'}
                      {s.lessonCount > 0 && ` · ${s.lessonCount} lessons`}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{ROLE_LABEL[role]}</span>
                </>
              )
              return s.topicCount > 0 ? (
                <a key={s.id} href={subjectPath(s.slug)} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm shadow-black/[0.03] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  {inner}
                </a>
              ) : (
                <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-dashed bg-card p-4 opacity-70">{inner}</div>
              )
            })}
          </div>
        )
      })}
      <p className="text-center text-sm">
        <a href="/wassce/subjects" className="font-semibold text-primary hover:underline">See every subject and its syllabus →</a>
      </p>
    </section>
  )
}

function StartingPoint() {
  const paths = [
    { icon: School, title: "I'm in SSS3", body: 'Follow your faculty’s subjects topic by topic and track your progress to exam day.', cta: 'Start free', href: '/auth' },
    { icon: UserRound, title: "I'm a private candidate", body: 'Revise at your own pace with lessons, past papers and an AI tutor whenever you need help.', cta: 'Start free', href: '/auth' },
    { icon: Users, title: "I'm a parent or teacher", body: 'See exactly what’s covered in every WASSCE subject before your student signs up.', cta: 'Browse subjects', href: '/wassce/subjects' },
  ]
  return (
    <section className="space-y-8">
      <SectionTitle eyebrow="Where are you starting?" title="Made for everyone preparing for WASSCE" />
      <div className="grid gap-3 sm:grid-cols-3">
        {paths.map(({ icon: Icon, title, body, cta, href }) => (
          <a key={title} href={href} className="group flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-bold">{title}</span>
            <span className="flex-1 text-sm text-muted-foreground">{body}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

function PopularTopics({ data }: { data: LandingData }) {
  return (
    <section className="space-y-6">
      <SectionTitle eyebrow="Popular topics" title="Jump straight into a topic" />
      <ul className="flex flex-wrap justify-center gap-2">
        {data.popular.map((t) => (
          <li key={`${t.subjectSlug}/${t.topicSlug}`}>
            <a
              href={topicPath(t.subjectSlug, t.topicSlug)}
              className="inline-flex items-center gap-2 rounded-full border bg-card py-1.5 pl-1.5 pr-4 text-sm font-medium shadow-sm transition hover:border-primary/40"
            >
              <SubjectIcon slug={t.subjectSlug} size="sm" />
              <span>{t.topicName}</span>
              <span className="whitespace-nowrap text-xs text-muted-foreground">{t.lessons} lessons</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: GraduationCap, title: 'Pick your faculty', body: 'Science, Arts, Commercial or Technical. Your subjects are set up for you.' },
    { icon: BookOpen, title: 'Learn, then test', body: 'Short lessons for each topic, then WASSCE-style questions to lock it in.' },
    { icon: ChartLine, title: 'Watch your progress', body: 'See every subject and topic fill up, find weak spots, and walk in ready.' },
  ]
  return (
    <section className="space-y-8">
      <SectionTitle eyebrow="How it works" title="Three steps to exam-ready" />
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="relative rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03]">
            <span className="absolute right-5 top-4 text-5xl font-bold text-muted/80" aria-hidden>{i + 1}</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function WhatYouGet() {
  const features = [
    { icon: Library, title: 'Past papers, scored instantly', body: 'Practise and see exactly which answers you got wrong, with explanations.' },
    { icon: BookOpen, title: 'Lessons with diagrams and maths', body: 'Clear step-by-step lessons, with properly typeset equations.' },
    { icon: MessageCircle, title: 'An AI tutor, any time', body: 'Ask any WASSCE question in plain English and get a clear answer in seconds.' },
    { icon: Moon, title: 'Reading mode for late nights', body: 'A warm, low-glare theme for studying after dark.' },
    { icon: Smartphone, title: 'Built for your phone', body: 'Works on any Android phone and on patchy data.' },
    { icon: Wallet, title: 'Pay the local way', body: 'Orange Money or AfriMoney. No card, no bank account.' },
  ]
  return (
    <section className="space-y-8">
      <SectionTitle eyebrow="What you get" title="Built for the WASSCE you're actually taking" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="block text-sm text-muted-foreground">{body}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Plans() {
  // Prices are also enforced in the database (payment_requests policy); see subscribe.tsx.
  const plans = [
    { name: 'Monthly', price: 25, period: 'per month', note: null, best: false },
    { name: 'Quarterly', price: 60, period: 'per 3 months', note: 'Save 15 NLe', best: false },
    { name: 'Yearly', price: 220, period: 'per year', note: 'Save 80 NLe', best: true },
  ]
  return (
    <section id="plans" className="scroll-mt-20 space-y-8">
      <SectionTitle eyebrow="Plans" title="Plans that fit your wallet" body="Every plan unlocks every subject, every paper and your AI tutor. Start with 7 days free." />
      <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
        {plans.map((p) => (
          <Link
            key={p.name}
            to="/auth"
            className={`relative flex flex-col items-center gap-1 rounded-3xl bg-card p-6 text-center shadow-sm transition hover:shadow-lg active:scale-[0.98] ${p.best ? 'border-2 border-primary shadow-primary/10' : 'border'}`}
          >
            {p.best && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                Best value
              </span>
            )}
            <span className="text-sm font-semibold text-muted-foreground">{p.name}</span>
            <span>
              <span className="text-5xl font-bold tracking-tight">{p.price}</span>
              <span className="ml-1 text-sm font-semibold text-muted-foreground">NLe</span>
            </span>
            <span className="text-xs text-muted-foreground">{p.period}</span>
            {p.note && <span className="text-xs font-bold text-emerald-600">{p.note}</span>}
          </Link>
        ))}
      </div>
      <ul className="mx-auto flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {['7 days free', 'No card needed', 'Orange Money & AfriMoney', 'Cancel anytime'].map((t) => (
          <li key={t} className="inline-flex items-center gap-1.5">
            <CircleCheck className="h-4 w-4 text-emerald-500" aria-hidden /> {t}
          </li>
        ))}
      </ul>
    </section>
  )
}

const FAQ: [question: string, answer: string][] = [
  ['Is WASSCE Tutor free?', 'You get 7 days free with full access, no card needed. After that, plans start at NLe 25 a month, and every plan includes every subject, every paper and the AI tutor.'],
  ['Which subjects are covered?', 'All the main WASSCE subjects for Science, Arts, Commercial and Technical students, including English Language and Mathematics. Each subject is broken down topic by topic, and new lessons are added all the time.'],
  ['How do I pay?', 'Choose a plan, then pay with Orange Money or AfriMoney. We confirm your payment on WhatsApp and switch your plan on.'],
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
      <div className="mx-auto max-w-2xl divide-y rounded-3xl border bg-card">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {q}
              <span className="text-xl leading-none text-muted-foreground transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-brand-strong px-6 py-12 text-center text-white shadow-xl">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="relative space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Your WASSCE is closer than you think.</h2>
        <p className="text-white/85">Start studying smarter today. 7 days free, no card needed.</p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link to="/auth" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 font-bold text-blue-700 shadow-lg sm:w-auto">
            Get started free
          </Link>
          <DownloadButton variant="hero" />
        </div>
      </div>
    </section>
  )
}
