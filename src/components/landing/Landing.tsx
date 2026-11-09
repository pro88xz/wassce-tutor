// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
// Section order follows the Design System Blueprint (07): hero, trust strip,
// subject discovery (subject covers and real counts), popular topics, a
// product tour with real screens, a local-fit band, who it's for, the WASSCE
// guide, plans, FAQ and a final call to action. Numbers come from the
// database and the question-set manifest.
import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useReveal } from '@/components/ds/useReveal'
import { ArrowRight, BookOpen, BookOpenCheck, CalendarClock, Check, ChevronRight, Compass, GraduationCap, Moon, ShieldCheck, Smartphone, UserRound, Wallet, Zap } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { subjectPath, topicPath } from '@/lib/public-content'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { topicPhoto } from '@/lib/topic-photos'
import { SubjectShowcase } from '@/components/landing/SubjectShowcase'
import { SwipeRow } from '@/components/ds/SwipeRow'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { ProductTour } from '@/components/landing/ProductTour'
import { FREE_FEATURES, FROM_PRICE, PAID_FEATURES, PLANS, type PlanId } from '@/lib/plans'
import { TopicSearch } from '@/components/landing/TopicSearch'
import { supabase } from '@/lib/supabase'
import { FEATURED_EDITORIAL, UNIVERSITY_FEATURES } from '@/content/editorial-index'

export function Landing({ data }: { data: LandingData }) {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <>
      <Hero data={data} />
      <TrustStrip />
      <div ref={root} className="mx-auto max-w-6xl space-y-12 px-4 sm:space-y-16 sm:px-6">
        <SubjectShowcase subjects={data.subjects} />
        {data.popular.length > 0 && <PopularTopics data={data} />}
        <ProductTour />
        <LocalBand data={data} />
        <StartingPoint />
        <TutorTeaser />
        <GuideTeaser />
        <EditorialDiscovery />
        <Plans />
        <Faq />
        <FinalCta />
      </div>
    </>
  )
}


function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const target = Math.max(0, Math.floor(value))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target)
      return
    }
    let frame = 0
    let startTime = 0
    const duration = 1050
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min(1, (time - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(target * eased))
      if (progress < 1) frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [value])
  return <span>{display.toLocaleString('en')}</span>
}

function LivePlatformStats({ initial }: { initial: LandingData['totals'] }) {
  const [stats, setStats] = useState({
    subjects: initial.subjects,
    topics: initial.topics,
    lessons: initial.lessons,
    students: 0,
  })
  useEffect(() => {
    let active = true
    void Promise.all([
      supabase.from('subjects').select('id', { count: 'exact', head: true }),
      supabase.from('topics').select('id', { count: 'exact', head: true }),
      supabase.from('wassce_lesson_index').select('id', { count: 'exact', head: true }),
      supabase.rpc('get_public_student_count'),
    ]).then(([subjects, topics, lessons, students]) => {
      if (!active) return
      setStats((current) => ({
        subjects: subjects.error || subjects.count === null ? current.subjects : subjects.count,
        topics: topics.error || topics.count === null ? current.topics : topics.count,
        lessons: lessons.error || lessons.count === null ? current.lessons : lessons.count,
        students: students.error || students.data === null ? current.students : Number(students.data),
      }))
    })
    return () => { active = false }
  }, [])
  const items = [
    { value: stats.subjects, label: 'WASSCE subjects' },
    { value: stats.topics, label: 'syllabus topics' },
    { value: stats.lessons, label: 'available lessons' },
    { value: stats.students, label: 'registered students' },
  ]
  return (
    <div className="relative border-t border-white/10 bg-black/10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 px-5 py-5 sm:px-8 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="platform-stat px-3 py-2 text-center sm:px-5">
            <p className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl"><AnimatedNumber value={item.value} /></p>
            <p className="mt-1 text-xs font-medium text-white/55 sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Editorial hero: discovery-led, with real syllabus subjects as the visual proof. */
function Hero({ data }: { data: LandingData }) {
  const featured = data.subjects.filter((s) => s.topicCount > 0).slice(0, 3)
  return (
    <section className="relative isolate left-1/2 right-1/2 -mx-[50vw] -mt-6 w-screen overflow-hidden bg-[#17112f] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-violet-500/25 blur-[100px]" />
        <div className="absolute -bottom-56 left-[18%] h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.7) 0.7px, transparent 0.7px)', backgroundSize: '24px 24px' }} />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-9 px-5 pb-14 pt-12 sm:gap-12 sm:px-8 sm:pb-18 sm:pt-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:pb-20 lg:pt-20">
        <div className="relative z-10 mx-auto w-full max-w-2xl space-y-6 text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-bold tracking-[.12em] text-violet-100 shadow-lg shadow-black/10 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            SIERRA LEONE WASSCE · BUILT FOR YOUR SYLLABUS
          </div>
          <div className="space-y-4">
            <h1 className="mx-auto max-w-[14ch] text-[2.55rem] font-extrabold leading-[1.04] tracking-[-.055em] text-balance sm:text-6xl xl:mx-0 xl:text-[4.15rem]">
              Your next grade starts <span className="bg-gradient-to-r from-[#e0d3ff] via-[#b8a0ff] to-[#8ddcf4] bg-clip-text text-transparent">with one topic.</span>
            </h1>
            <p className="mx-auto max-w-[34rem] text-[15px] leading-[1.75] text-white/70 sm:text-lg lg:mx-0">
              Understand every subject, practise WASSCE-style questions and get clear explanations—at your own pace.
            </p>
          </div>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Link to="/auth" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-base font-extrabold text-[#28145f] shadow-[0_14px_34px_-14px_rgba(255,255,255,.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-violet-50">
              Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/tutors" className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/25 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/[0.12]">
              Book a tutor
            </Link>
          </div>
          <div className="mx-auto max-w-xl lg:mx-0">
            <TopicSearch />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-white/65 lg:justify-start">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-300" /> No card needed</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
            <span>Study free · upgrade when ready</span>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.07] px-3.5 text-white/85">
              <Smartphone className="h-4 w-4 text-violet-200" aria-hidden />
              <span className="font-semibold">Android app</span>
              <span className="rounded-full bg-amber-300/15 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-amber-100">Coming soon</span>
            </span>
          </div>
        </div>

        <div className="hero-subject-collage relative mx-auto w-full max-w-[35rem]" aria-label="Explore WASSCE subjects">
          <div className="hero-collage-backdrop" aria-hidden="true" />
          {featured[0] && (
            <a href={subjectPath(featured[0].slug)} className="hero-subject-card hero-subject-card-primary group">
              <SubjectCover slug={featured[0].slug} shape="wide" rounded="rounded-[1.1rem]" className="aspect-[16/10] w-full" />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 text-slate-900">
                <span className="min-w-0"><span className="block text-[10px] font-extrabold uppercase tracking-[.14em] text-violet-700">Explore subject</span><span className="mt-1 block truncate text-lg font-extrabold">{featured[0].name}</span></span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-800"><ArrowRight className="h-4 w-4" aria-hidden /></span>
              </div>
            </a>
          )}
          {featured[1] && (
            <a href={subjectPath(featured[1].slug)} className="hero-subject-card hero-subject-card-secondary group">
              <SubjectCover slug={featured[1].slug} shape="wide" rounded="rounded-[.9rem]" className="aspect-[16/10] w-full" />
              <div className="px-2 pb-1 pt-2 text-slate-900"><span className="block truncate text-sm font-extrabold">{featured[1].name}</span><span className="mt-1 block text-[11px] text-slate-500">{featured[1].topicCount} syllabus topics</span></div>
            </a>
          )}
          {featured[2] && (
            <a href={subjectPath(featured[2].slug)} className="hero-subject-card hero-subject-card-tertiary group">
              <SubjectCover slug={featured[2].slug} shape="wide" rounded="rounded-[.9rem]" className="aspect-[16/10] w-full" />
              <div className="px-2 pb-1 pt-2 text-slate-900"><span className="block truncate text-sm font-extrabold">{featured[2].name}</span><span className="mt-1 block text-[11px] text-slate-500">{featured[2].topicCount} syllabus topics</span></div>
            </a>
          )}
          <div className="hero-collage-caption"><GraduationCap className="h-4 w-4 text-[#d6c4ff]" /> Built for your WASSCE syllabus</div>
        </div>
      </div>
      <LivePlatformStats initial={data.totals} />
    </section>
  )
}

/** Concrete product assurances, not borrowed testimonials or invented social proof. */
function TrustStrip() {
  const items = [
    { title: 'Built around WASSCE', body: 'Subjects and topics organised for the Sierra Leone syllabus.' },
    { title: 'Study on your phone', body: 'Use the website or install the Android app.' },
    { title: 'USSD checkout', body: 'Complete a one-time payment from your phone. Access activates after verification.' },
    { title: 'Independent study platform', body: 'Not an official WAEC service or examination body.' },
  ]
  return (
    <section aria-label="WASSCE Tutor at a glance" className="trust-strip relative mx-auto mt-7 mb-10 grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-5 sm:px-8 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="trust-strip-item flex min-h-[7.25rem] flex-col justify-center gap-1.5 px-4 py-4 sm:px-5">
          <span className="text-[11px] font-extrabold uppercase tracking-[.12em] text-primary">{item.title}</span>
          <span className="text-xs leading-relaxed text-slate-600 sm:text-[13px]">{item.body}</span>
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
  if (data.popular.length === 0) return null

  const renderImage = (subjectSlug: string, topicSlug: string, compact = false) => {
    const photo = topicPhoto(subjectSlug, topicSlug)
    return photo ? (
      <img
        src={compact ? photo.small : photo.src}
        srcSet={compact ? undefined : `${photo.small} 480w, ${photo.src} 960w`}
        sizes={compact ? '76px' : '(min-width: 768px) 42vw, 100vw'}
        alt={photo.caption}
        loading="lazy"
        decoding="async"
        width={compact ? 152 : 960}
        height={compact ? 96 : 600}
        className={`h-full w-full object-cover ${photo.position ?? ''}`}
      />
    ) : (
      <SubjectCover slug={subjectSlug} shape="wide" rounded="rounded-none" className="h-full w-full" />
    )
  }

  return (
    <section className="space-y-6 sm:space-y-7" aria-labelledby="popular-heading">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between sm:pb-5">
        <div className="max-w-2xl space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Explore the syllabus</p>
          <h2 id="popular-heading" className="text-3xl font-bold leading-[1.08] tracking-tight text-balance sm:text-4xl">Popular WASSCE topics</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">Explore focused lessons across the subjects you are preparing for.</p>
        </div>
        <a href="/wassce/subjects" className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-strong">
          Explore all subjects <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>

      <div className="popular-topic-rail" aria-label="Popular WASSCE topics. Scroll horizontally to see more.">
        {data.popular.map((t, i) => (
          <a
            key={`${t.subjectSlug}/${t.topicSlug}`}
            href={topicPath(t.subjectSlug, t.topicSlug)}
            data-reveal={i % 4}
            className="popular-topic-card group"
          >
            <span className="popular-topic-image">
              {renderImage(t.subjectSlug, t.topicSlug, true)}
              
            </span>
            <span className="popular-topic-copy">
              <span className="popular-topic-subject">{t.subjectName}</span>
              <span className="popular-topic-name">{t.topicName}</span>
              <span className="popular-topic-lessons"><BookOpen className="h-3.5 w-3.5" aria-hidden /> {t.lessons} {t.lessons === 1 ? 'lesson' : 'lessons'}</span>
            </span>
          </a>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">Showing {Math.min(3, data.popular.length)} at a time · {data.popular.length} topics</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary" aria-hidden="true">
          Swipe to explore <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </section>
  )
}

/** Full-width deep band: local fit, told with photographs rather than small icons. */
const FEATURES = [
  { img: 'feature-phone', alt: 'A student studying on her phone', icon: Smartphone, title: 'Built for your phone', body: 'Works in any phone browser and as an Android app, even on patchy data.' },
  { img: 'feature-pay', alt: 'A customer paying with his phone at a shop', icon: Wallet, title: 'Pay the local way', body: 'Choose a plan, complete the Monime USSD payment and receive access after verification.' },
  { img: 'feature-night', alt: 'A student studying by lamplight at night', icon: Moon, title: 'Reading mode for late nights', body: 'A warm, low-glare theme for studying after dark.' },
  { img: 'feature-syllabus', alt: 'A student writing notes from a textbook', icon: BookOpen, title: 'Written to the WASSCE syllabus', body: 'Topics follow the syllabus, grouped the way you will study them.' },
]

function LocalBand({ data }: { data: LandingData }) {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-brand-deep text-white" aria-labelledby="local-heading">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-end gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] lg:gap-12">
          <div data-reveal className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold text-[#ffd166]">Made in Freetown · Built for Sierra Leone</p>
            <h2 id="local-heading" className="text-[2rem] font-bold leading-[1.04] tracking-tight text-balance sm:text-4xl lg:text-5xl">A WASSCE learning platform shaped around local students.</h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base">Study on the devices you use, follow the subjects you sit and pay through a phone-based checkout. The experience is designed around the realities of preparing for WASSCE in Sierra Leone.</p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm">
            {[[String(data.totals.subjects), 'subjects'], [String(data.totals.topics), 'syllabus topics'], [String(data.totals.lessons), 'published lessons']].map(([value, label]) => (
              <div key={label} className="min-w-0 px-3 py-5 text-center sm:px-4 sm:py-6">
                <p className="text-2xl font-bold tracking-tight tabular-nums text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-[10px] font-medium leading-snug text-white/65 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-9 sm:mt-12">
          <SwipeRow label="Features" count={FEATURES.length} grid="sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ img, alt, icon: Icon, title, body }, i) => (
              <div
                key={title}
                data-reveal={i}
                className="group relative aspect-[5/4] w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10 sm:aspect-[4/5] sm:w-auto"
              >
                <img
                  src={`/img/home/${img}-400.webp`}
                  srcSet={`/img/home/${img}-400.webp 400w, /img/home/${img}.webp 800w`}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 82vw"
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


function EditorialDiscovery() {
  return (
    <section data-reveal className="space-y-6" aria-labelledby="next-step-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Beyond the exam</p><h2 id="next-step-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Plan what comes after WASSCE.</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Explore Sierra Leone universities, compare entry requirements and read practical guidance before you apply.</p></div>
        <a href="/universities" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary">University directory <ArrowRight className="h-4 w-4"/></a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {UNIVERSITY_FEATURES.map((u) => <a key={u.slug} href={`/universities/${u.slug}`} className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="aspect-[16/9] overflow-hidden bg-muted"><img src={u.image} alt={u.imageAlt} loading="lazy" decoding="async" width={1200} height={675} onError={u.slug === 'milton-margai-technical-university' ? (event) => { const image = event.currentTarget; if (image.dataset.fallbackApplied) return; image.dataset.fallbackApplied = 'true'; image.src = 'https://www.mmtu.edu.sl/images/brookfields.jpeg' } : undefined} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"/></div>
          <div className="p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-primary">{u.shortName}</p><h3 className="mt-2 font-bold leading-snug">{u.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{u.summary}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">View guide <ArrowRight className="h-3.5 w-3.5"/></span></div>
        </a>)}
      </div>
      <div className="grid gap-4 rounded-2xl bg-[#f7f5ff] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">From the editorial desk</p><h3 className="mt-2 text-xl font-bold text-slate-950">{FEATURED_EDITORIAL.title}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{FEATURED_EDITORIAL.description}</p></div>
        <a href={`/blog/${FEATURED_EDITORIAL.slug}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#21134d] px-5 text-sm font-bold text-white">Read the guide <ArrowRight className="h-4 w-4"/></a>
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
    <section id="plans" className="plans-section scroll-mt-20 space-y-8">
      <SectionTitle eyebrow="Plans" title="Start free. Unlock everything for one small payment." body={`A free account opens the first lesson of every topic. A plan opens every lesson, every practice set and the AI tutor, from ${FROM_PRICE} NLe.`} />
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <div
            key={c.key}
            data-reveal={i}
            data-plan-tier={c.key}
            className={`plan-option-card relative flex flex-col rounded-3xl bg-card p-6 transition-shadow hover:shadow-lg ${
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
      <ul className="plan-assurances mx-auto grid max-w-6xl gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Secure Monime checkout', body: 'Pay once through your phone’s USSD dialler. The amount is fixed to the plan you choose.', Icon: ShieldCheck },
          { title: 'Verified activation', body: 'Monime confirms the payment first. Your selected access is activated automatically after verification.', Icon: Zap },
          { title: 'No recurring charges', body: 'No subscription deductions or automatic renewal. You pay only when you choose to extend access.', Icon: CalendarClock },
          { title: 'Your progress stays saved', body: 'Your saved study progress remains when a plan expires. Renewing adds the new time to your existing expiry.', Icon: BookOpenCheck },
        ].map(({ title, body, Icon }) => (
          <li key={title} className="plan-assurance-card">
            <span className="plan-assurance-icon"><Icon className="h-5 w-5" aria-hidden /></span>
            <span className="plan-assurance-copy">
              <span className="plan-assurance-title">{title}</span>
              <span className="plan-assurance-body">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const FAQ: [question: string, answer: string][] = [
  ['Is WASSCE Tutor free?', 'Yes, to start. A free account opens every subject, the first lesson of every topic and a starter practice set in every subject, with no time limit. To unlock everything, pay 25 NLe for one month or 75 NLe for 12 months.'],
  ['Which subjects are covered?', 'All the main WASSCE subjects for Science, Arts, Commercial and Technical students, including English Language and Mathematics. Each subject is broken down topic by topic, and new lessons are added all the time.'],
  ['Are these real WAEC past papers?', 'No. Practice sets are original WASSCE-style questions written by WASSCE Tutor to match the syllabus and the exam format, each with the full working. We do not copy WAEC papers.'],
  ['How do I pay?', 'Choose a plan, complete the Monime USSD payment on your phone, and your access activates automatically after payment verification. Plans do not renew automatically.'],
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
          <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-5 py-2 text-sm font-semibold text-brand-deep">
            <Smartphone className="h-4 w-4 text-primary" aria-hidden />
            Android app
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-amber-800">Coming soon</span>
          </span>
        </div>
      </div>
    </section>
  )
}
