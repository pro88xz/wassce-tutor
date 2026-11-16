// The learning method as four steps, beside a real excerpt from a free lesson,
// so the page shows what studying here looks like instead of describing it.
import { ArrowRight, BookOpen, CircleCheck, MessageCircleQuestion, TrendingUp } from 'lucide-react'
import { Band, SectionHeading } from '@/components/public/Section'

const STEPS = [
  {
    label: 'Understand',
    title: 'Learn each topic in clear steps.',
    body: 'Syllabus-led lessons with explanations, worked examples, diagrams and properly typeset mathematics.',
    Icon: BookOpen,
  },
  {
    label: 'Apply',
    title: 'Practise what you have learned.',
    body: 'Original WASSCE-style questions, marked at once, with the reasoning behind every answer.',
    Icon: CircleCheck,
  },
  {
    label: 'Get support',
    title: 'Ask when a concept is unclear.',
    body: 'Use study tutor support for a step-by-step explanation, or book a teacher for one-to-one help.',
    Icon: MessageCircleQuestion,
  },
  {
    label: 'Build momentum',
    title: 'Keep track of your preparation.',
    body: 'See your completed lessons and practice, so you know what to study next and where to revise.',
    Icon: TrendingUp,
  },
]

export function HowItWorks() {
  return (
    <Band tone="white" labelledBy="method-heading">
      <SectionHeading
        id="method-heading"
        eyebrow="How it works"
        title="From first lesson to exam confidence, in four steps."
        lede="Good preparation is more than reading notes. Learn a concept, apply it, get help when you are stuck, and let your progress decide the next session."
        action={
          <a href="/wassce/subjects" className="site-link">
            Explore the syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] lg:items-start lg:gap-14">
        <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {STEPS.map(({ label, title, body, Icon }, i) => (
            <li key={label} data-reveal={i} className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_22px_-12px_rgba(100,56,216,.8)]">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
                  <span className="tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mx-2 text-border" aria-hidden>/</span>
                  {label}
                </p>
                <h3 className="site-h3 mt-1.5">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <LessonExcerpt />
      </div>
    </Band>
  )
}

/** The free lesson the excerpt below comes from. */
const LESSON_HREF = '/wassce/mathematics/quadratic-equations/quadratic-equations-factorisation-completing-the-square-and-the-formula'

/**
 * A real excerpt from a free lesson, set out as the lesson sets it out: a worked
 * example, the mistake examiners see most, and an exam tip. Plain text, so the
 * homepage does not load the maths renderer.
 */
function LessonExcerpt() {
  return (
    <figure data-reveal="2" className="site-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-primary">Mathematics · free lesson</p>
          <p className="mt-0.5 truncate font-bold tracking-tight">Quadratic equations</p>
        </div>
        <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-success">Real lesson</span>
      </div>
      <div className="space-y-3 p-5 text-[15px]">
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-500/10">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Worked example</p>
          <p className="mt-1.5 font-semibold">Solve x² − 5x + 6 = 0.</p>
          <p className="mt-1 font-mono text-[14px] leading-7 text-muted-foreground">
            Factorise: (x − 2)(x − 3) = 0
            <br />So x − 2 = 0 or x − 3 = 0
            <br /><span className="font-semibold text-foreground">x = 2 or x = 3</span>
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-rose-400 bg-rose-50 p-4 dark:bg-rose-500/10">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">Common mistake</p>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            From x² = 7x, dividing both sides by x gives only x = 7 and <span className="font-semibold text-foreground">loses the root x = 0</span>. Never divide by something that could be zero: factorise instead.
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-sky-400 bg-sky-50 p-4 dark:bg-sky-500/10">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Exam tip</p>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">Write down a, b and c with their signs before you use the formula. Most formula errors come from −b when b is already negative.</p>
        </div>
      </div>
      <a href={LESSON_HREF} className="flex items-center justify-between gap-2 border-t px-5 py-3.5 text-sm font-bold text-primary hover:bg-brand-soft/40">
        Read the whole lesson free <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </figure>
  )
}
