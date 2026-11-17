// Homepage hero. On the left, the promise in the candidate's own terms (the
// answer sheet they will shade on exam day), the real size of the library,
// topic search and the two actions. On the right, the product instead of a
// stock photograph: a WASSCE-style answer sheet shaded question by question
// (AnswerSheet), with a real lesson and a real "why not" explanation from
// the bank floating around it. On desktop the group tilts a little towards
// the pointer. The live counts sit just below, on the syllabus wall.
import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowRight, BookOpen, Check, Clock } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { TopicSearch, type TopicShortcut } from '@/components/landing/TopicSearch'
import { AnswerSheet } from '@/components/landing/AnswerSheet'
import { TopicCover } from '@/components/public/TopicCover'
import { lessonPath, topicPath, type PopularTopic } from '@/lib/public-content'

/** Shortcut chips: popular topics that have lessons, short enough to read as a chip. */
function shortcutsFrom(popular: PopularTopic[]): TopicShortcut[] {
  return popular
    .filter((t) => t.lessons > 0 && t.topicName.length <= 22)
    .slice(0, 4)
    .map((t) => ({ label: t.topicName, href: topicPath(t.subjectSlug, t.topicSlug) }))
}

const ASSURANCES = ['Every lesson free', 'No card needed', 'Works on any phone']

export function Hero({ data }: { data: LandingData }) {
  const { lessons, topics } = data.totals
  return (
    <section className="relative isolate overflow-hidden bg-[var(--card)]" aria-labelledby="hero-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(56rem_34rem_at_100%_0%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_70%),radial-gradient(40rem_26rem_at_0%_100%,rgba(255,209,102,.18),transparent_70%)]" />
      {/* Faint ruled lines, like the paper the sheet is printed on. */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[.55] [background-image:linear-gradient(rgba(210,63,106,.07)_1px,transparent_1px)] [background-size:100%_34px] [mask-image:linear-gradient(90deg,transparent,#000_55%)]" />
      <div className="site-container grid grid-cols-[minmax(0,1fr)] items-center gap-14 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,.86fr)] lg:gap-12 lg:pb-28 lg:pt-20">
        <div className="max-w-2xl">
          <p className="hero-rise inline-flex items-center gap-2.5 rounded-full bg-[var(--brand-soft)] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-[var(--brand-strong)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.18)]" aria-hidden />
            Built for the Sierra Leone WASSCE syllabus
          </p>
          <h1 id="hero-heading" className="site-display mt-5 text-foreground">
            <span className="hero-rise block" style={{ ['--rise-delay' as string]: '80ms' }}>
              Know every answer
            </span>
            <span className="hero-rise block" style={{ ['--rise-delay' as string]: '180ms' }}>
              <span className="site-accent text-[var(--primary)]">before you shade it.</span>
            </span>
          </h1>
          <p className="hero-rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg" style={{ ['--rise-delay' as string]: '280ms' }}>
            <strong className="font-semibold text-foreground">{lessons.toLocaleString('en')} lessons</strong> and{' '}
            <strong className="font-semibold text-foreground">{PRACTICE_TOTAL.toLocaleString('en')} questions</strong> with the full working, across all{' '}
            {topics.toLocaleString('en')} topics of the WASSCE syllabus. Free on any phone.
          </p>
          {/* Search first, as on a course catalogue: most visitors arrive knowing their subject or topic. */}
          <div className="hero-rise mt-8 max-w-xl" style={{ ['--rise-delay' as string]: '360ms' }}>
            <TopicSearch shortcuts={shortcutsFrom(data.popular)} tone="light" size="lg" />
          </div>
          <div className="hero-rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ ['--rise-delay' as string]: '440ms' }}>
            <Link to="/auth" className="site-btn site-btn-lg site-btn-primary px-6">
              Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#try-a-question" className="site-link">
              or try a question <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-muted-foreground sm:text-sm">
            {ASSURANCES.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroStage />
      </div>
    </section>
  )
}

/** A real lesson, shown as it appears on its topic page. */
const LESSON = {
  subjectSlug: 'chemistry',
  subjectName: 'Chemistry',
  topicSlug: 'introduction-to-chemistry',
  topicName: 'Introduction to Chemistry',
  lessonSlug: 'what-chemistry-is-branches-importance-and-careers',
  title: 'What chemistry is: branches, importance and careers',
  minutes: 7,
}

/** A card floating over the hero: white, hairline border, long soft shadow. */
const FLOAT = 'rounded-2xl bg-white text-slate-900 ring-1 ring-slate-900/[0.06] shadow-[0_30px_60px_-24px_rgba(30,20,80,.45)]'

/**
 * The answer sheet with two pieces of the product around it. Pointer
 * movement sets --px/--py (-1 to 1) on the stage; each layer moves by its
 * own amount, so the group reads as having depth. Pointer devices only, and
 * never when the visitor prefers reduced motion.
 */
function HeroStage() {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      const py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', px.toFixed(3))
        el.style.setProperty('--py', py.toFixed(3))
      })
    }
    const leave = () => {
      el.style.setProperty('--px', '0')
      el.style.setProperty('--py', '0')
    }
    // Listen on the whole hero, so the tilt follows the pointer across the page.
    const area = el.closest('section') ?? el
    area.addEventListener('pointermove', move as EventListener)
    area.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      area.removeEventListener('pointermove', move as EventListener)
      area.removeEventListener('pointerleave', leave)
    }
  }, [])

  const layer = 'transition-transform duration-500 ease-out will-change-transform'
  return (
    <div ref={stage} className="hero-rise relative mx-auto w-full max-w-[33rem] [perspective:1600px] sm:mb-24 lg:mx-0 lg:mb-0 lg:ml-auto lg:mt-10" style={{ ['--rise-delay' as string]: '200ms' }}>
      {/* A real lesson, behind the sheet's top-left corner. */}
      <a
        href={lessonPath(LESSON.subjectSlug, LESSON.topicSlug, LESSON.lessonSlug)}
        tabIndex={-1}
        aria-hidden
        className={`absolute -right-8 -top-[5.5rem] z-0 hidden w-56 p-2.5 lg:block ${FLOAT} ${layer}`}
        style={{ transform: 'translate3d(calc(var(--px, 0) * 18px), calc(var(--py, 0) * -16px), 0) rotate(6deg)' }}
      >
        <span className="hero-float block" style={{ ['--float-time' as string]: '8s' }}>
          <TopicCover subjectSlug={LESSON.subjectSlug} subjectName={LESSON.subjectName} topicSlug={LESSON.topicSlug} topicName={LESSON.topicName} className="aspect-[16/9] rounded-xl" />
          <span className="mt-2.5 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">
            <BookOpen className="h-3.5 w-3.5" aria-hidden /> Lesson 1 <Clock className="ml-1 h-3.5 w-3.5" aria-hidden /> {LESSON.minutes} min
          </span>
          <span className="mt-1 block px-1 pb-1 text-[13px] font-bold leading-snug">{LESSON.title}</span>
        </span>
      </a>

      {/* The sheet: tilts towards the pointer. */}
      <div className={`relative z-10 ${layer}`} style={{ transform: 'rotateY(calc(var(--px, 0) * 5deg)) rotateX(calc(var(--py, 0) * -4deg))' }}>
        <AnswerSheet />
      </div>

      {/* Why a wrong option is wrong: the bank's own explanation for question 1. */}
      <div
        aria-hidden
        className={`absolute -bottom-28 -left-6 z-20 hidden w-64 sm:block lg:-left-16 ${layer}`}
        style={{ transform: 'translate3d(calc(var(--px, 0) * 20px), calc(var(--py, 0) * 14px), 0) rotate(-3deg)' }}
      >
        <div className={`hero-float p-4 ${FLOAT}`} style={{ ['--float-time' as string]: '7s', ['--float-delay' as string]: '-2s' }}>
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#d23f6a]">Question 1 · Why not C?</p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-700">
            <span className="font-bold text-slate-900">Souring of palm wine:</span> ethanol is oxidised to ethanoic acid, a new substance. That makes it a chemical change.
          </p>
          <p className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-500">Every wrong option, explained</p>
        </div>
      </div>
    </div>
  )
}
