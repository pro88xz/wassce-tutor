// The learning method as four steps, beside an example of the progress view
// a student builds up. The example uses a real topic and its real lesson
// titles; the figures in it are sample values and the card says so. It is the
// only place on the homepage that is not live data.
import { ArrowRight, BookOpen, CircleCheck, ClipboardList, MessageCircleQuestion, TrendingUp } from 'lucide-react'
import type { PopularTopic } from '@/lib/public-content'
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

export function HowItWorks({ topic }: { topic?: PopularTopic }) {
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
        <ProgressExample topic={topic} />
      </div>
    </Band>
  )
}

/** Sample values for the example below. Not anyone's real results. */
const EXAMPLE = { lessonsDone: 12, practiceScore: 80, activeDays: [true, true, false, true, true, false, false] }
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** What the progress view looks like after a week of study, clearly marked as an example. */
function ProgressExample({ topic }: { topic?: PopularTopic }) {
  const days = EXAMPLE.activeDays.filter(Boolean).length
  return (
    <figure data-reveal="2" className="site-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <p className="site-h3">Your progress</p>
        <span className="rounded-full bg-warning/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-warning">Example</span>
      </div>

      {topic && (
        <div className="px-5 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-primary">{topic.subjectName}</p>
          <p className="mt-0.5 font-bold tracking-tight">{topic.topicName}</p>
          <ol className="mt-3 space-y-2.5">
            {topic.firstLessons.map((lesson, i) => {
              const done = i < topic.firstLessons.length - 1
              return (
                <li key={lesson.title} className="flex items-center gap-3 text-sm">
                  {done ? (
                    <CircleCheck className="h-5 w-5 shrink-0 text-success" aria-hidden />
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded-full border-2 border-primary" aria-hidden />
                  )}
                  <span className={`min-w-0 flex-1 truncate ${done ? 'text-muted-foreground' : 'font-semibold'}`}>{lesson.title}</span>
                  <span className={`shrink-0 text-[11px] font-bold ${done ? 'text-success' : 'text-primary'}`}>{done ? 'Done' : 'Next'}</span>
                </li>
              )
            })}
            <li className="flex items-center gap-3 border-t pt-2.5 text-sm">
              <ClipboardList className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">Practice set</span>
              <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold tabular-nums text-success">4/5</span>
            </li>
          </ol>
        </div>
      )}

      <dl className="mt-4 grid grid-cols-3 border-t text-center">
        <div className="flex flex-col-reverse gap-0.5 px-2 py-4">
          <dt className="text-[11px] font-medium leading-tight text-muted-foreground">lessons completed</dt>
          <dd className="text-2xl font-extrabold tracking-tight tabular-nums">{EXAMPLE.lessonsDone}</dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5 border-l px-2 py-4">
          <dt className="text-[11px] font-medium leading-tight text-muted-foreground">practice score</dt>
          <dd className="text-2xl font-extrabold tracking-tight tabular-nums">{EXAMPLE.practiceScore}%</dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5 border-l px-2 py-4">
          <dt className="text-[11px] font-medium leading-tight text-muted-foreground">days this week</dt>
          <dd className="text-2xl font-extrabold tracking-tight tabular-nums">
            {days}
            <span className="text-sm font-semibold text-muted-foreground"> of 7</span>
          </dd>
        </div>
      </dl>
      <ol className="flex justify-between gap-1 border-t px-5 py-3.5" aria-label={`Example week: studied on ${days} of 7 days`}>
        {EXAMPLE.activeDays.map((active, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-primary' : 'bg-muted'}`} aria-hidden />
            <span className="text-[10px] font-semibold text-muted-foreground" aria-hidden>{WEEKDAYS[i]}</span>
          </li>
        ))}
      </ol>
      <figcaption className="border-t bg-muted/50 px-5 py-3 text-xs leading-relaxed text-muted-foreground">
        Sample figures to show the layout. Your own lessons, scores and study days appear here as you work, and stay saved if a plan ends.
      </figcaption>
    </figure>
  )
}
