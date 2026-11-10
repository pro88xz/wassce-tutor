// The learning method as four connected steps. Words only: no simulated
// screens, because the hero already shows the real product.
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
    <Band labelledBy="method-heading">
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
      <ol className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {STEPS.map(({ label, title, body, Icon }, i) => (
          <li key={label} data-reveal={i} className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-5 lg:block">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_22px_-12px_rgba(100,56,216,.8)]">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              {/* Connector to the next step (desktop row only). */}
              <span aria-hidden className={`hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-border ${i === STEPS.length - 1 ? '' : 'lg:block'}`} />
            </div>
            <div className="lg:mt-6">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
                <span className="tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span className="mx-2 text-border" aria-hidden>/</span>
                {label}
              </p>
              <h3 className="site-h3 mt-2 text-xl">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Band>
  )
}
