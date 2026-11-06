// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
// Section order follows the Design System Blueprint (07): hero, trust strip,
// subject discovery, how it works, what you get, who it's for, WASSCE guide,
// plans, FAQ, then a final call to action. Numbers come from the database.
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight, BookOpen, ChartLine, Check, CircleCheck, ClipboardCheck, Compass, Library, MessageCircle, Moon, School, Smartphone,
  UserRound, Users, Wallet,
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
      <div className="mx-auto max-w-5xl space-y-16 sm:space-y-20">
        <TrustStrip data={data} />
        <SubjectsByFaculty subjects={data.subjects} />
        {data.popular.length > 0 && <PopularTopics data={data} />}
        <HowItWorks />
        <WhatYouGet />
        <StartingPoint />
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
      <div role="tablist" aria-label="Faculties" className="mx-auto grid w-full max-w-lg grid-cols-4 gap-1 rounded-xl bg-muted p-1">
        {faculties.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={active === f.id}
            aria-controls={`faculty-${f.id}`}
            onClick={() => setActive(f.id)}
            className={`min-h-10 rounded-lg px-0.5 py-2 text-[13px] font-semibold tracking-tight transition-colors sm:text-sm ${active === f.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
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
                <a key={s.id} href={subjectPath(s.slug)} className="flex min-h-16 items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40">
                  {inner}
                </a>
              ) : (
                <div key={s.id} className="flex min-h-16 items-center gap-3 rounded-2xl border border-dashed bg-card/60 p-4 text-muted-foreground">{inner}</div>
              )
            })}
          </div>
        )
      })}
      <p className="text-center text-sm">
        <a href="/wassce/subjects" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">See every subject and its syllabus →</a>
      </p>
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-card py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors hover:border-primary/40"
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

/** The learning loop: learn, practise, ask, track. */
function HowItWorks() {
  const steps = [
    { icon: BookOpen, title: 'Learn a topic', body: 'Short lessons with worked examples, written to the WASSCE syllabus.' },
    { icon: ClipboardCheck, title: 'Practise exam-style questions', body: 'Every answer is marked straight away, with the full working and why the wrong options are wrong.' },
    { icon: MessageCircle, title: 'Ask the AI tutor', body: 'Stuck on a step? Ask in plain English and get it explained one step at a time.' },
    { icon: ChartLine, title: 'Track your progress', body: 'See which topics are done and which need another look before the exam.' },
  ]
  return (
    <section className="space-y-8">
      <SectionTitle eyebrow="How it works" title="Learn, practise, ask, track" />
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
            </div>
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
    { icon: Library, title: 'Exam-style practice, marked instantly', body: 'Original WASSCE-style questions written to the syllabus, each with the full working.' },
    { icon: BookOpen, title: 'Lessons with diagrams and maths', body: 'Clear step-by-step lessons, with properly typeset equations.' },
    { icon: MessageCircle, title: 'An AI tutor, any time', body: 'Ask any WASSCE question in plain English and get a clear answer in seconds.' },
    { icon: Moon, title: 'Reading mode for late nights', body: 'A warm, low-glare theme for studying after dark.' },
    { icon: Smartphone, title: 'Built for your phone', body: 'Works in any phone browser, with an Android app, and on patchy data.' },
    { icon: Wallet, title: 'Pay the local way', body: 'Orange Money or AfriMoney. No card, no bank account.' },
  ]
  return (
    <section className="space-y-8">
      <SectionTitle eyebrow="What you get" title="Built for the WASSCE you're actually taking" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-2xl border bg-card p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
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

function StartingPoint() {
  const paths = [
    { icon: School, title: "I'm in SSS3", body: 'Follow your faculty’s subjects topic by topic and track your progress to exam day.', cta: 'Start free', href: '/auth' },
    { icon: UserRound, title: "I'm a private candidate", body: 'Revise at your own pace with lessons, exam-style practice and an AI tutor whenever you need help.', cta: 'Start free', href: '/auth' },
    { icon: Users, title: "I'm a parent or teacher", body: 'See exactly what’s covered in every WASSCE subject before your student signs up.', cta: 'Browse subjects', href: '/wassce/subjects' },
  ]
  return (
    <section className="space-y-8">
      <SectionTitle eyebrow="Who it's for" title="Made for everyone preparing for WASSCE" />
      <div className="grid gap-3 sm:grid-cols-3">
        {paths.map(({ icon: Icon, title, body, cta, href }) => (
          <a key={title} href={href} className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-bold">{title}</span>
            <span className="flex-1 text-sm text-muted-foreground">{body}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              {cta} <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

/** Exam orientation: points to the public WASSCE guide pages. */
function GuideTeaser() {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
        <Compass className="h-6 w-6" aria-hidden />
      </span>
      <div className="flex-1 space-y-1">
        <h2 className="text-xl font-bold tracking-tight">New to WASSCE? Start with the guide</h2>
        <p className="text-[15px] text-muted-foreground">How the exam works in Sierra Leone, which subjects each faculty sits, and how grades are worked out.</p>
      </div>
      <div className="flex flex-col gap-2 sm:items-end">
        <a href="/wassce" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-strong">
          Read the WASSCE guide
        </a>
        <a href="/wassce/subjects" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-primary hover:underline">
          Every subject and syllabus
        </a>
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
