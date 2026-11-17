// Questions: the heading and a route to a person on the left, answers on the right.
import { ArrowRight, Plus } from 'lucide-react'
import { PLANS } from '@/lib/plans'
import { FREE_PRACTICE_INLINE } from '@/lib/free-plan'
import type { SubjectSummary } from '@/lib/public-content'
import { Band } from '@/components/public/Section'

const PRICES = PLANS.map((p) => `${p.priceNle} NLe for ${p.length}`).join(' or ')

const list = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] ?? '')

/**
 * The answers are written from the same data as the catalogue above them
 * (which subjects have lessons, which have practice), so the two always agree.
 */
function faq(subjects: SubjectSummary[]): [question: string, answer: string][] {
  const listed = subjects.filter((s) => s.topicCount > 0)
  const withLessons = listed.filter((s) => s.lessonCount > 0).sort((a, b) => b.lessonCount - a.lessonCount)
  const covered =
    withLessons.length === listed.length
      ? `Every one of the ${listed.length} subjects has lessons.`
      : `Lessons are published for ${withLessons.length} of them so far: ${list(withLessons.map((s) => s.name))}. The others show their full syllabus outline while their lessons are written.`
  return [
    ['Is WASSCE Tutor free?', `Yes. Every lesson in every subject and ${FREE_PRACTICE_INLINE} are free, with no time limit, and you can read the lessons without an account. A plan adds the AI study tutor and timed mock exams, for ${PRICES}.`],
    ['Which subjects are covered?', `The syllabus for ${listed.length} WASSCE subjects is here, topic by topic, for Science, Arts, Commercial and Technical students. ${covered}`],
    ['Are these real WAEC past papers?', 'No. Practice sets are original WASSCE-style questions written by WASSCE Tutor to match the syllabus and the exam format, each with the full working. We do not copy WAEC papers.'],
    ['How do I pay?', 'Choose a plan, complete the Monime USSD payment on your phone, and your access activates automatically after payment verification. Plans do not renew automatically.'],
    ['Does it work on my phone?', 'Yes. WASSCE Tutor works in any phone browser and is built for patchy data. An Android app is coming soon.'],
    // Reviews are optional and recorded per lesson, so this answer makes no claim about how many lessons are reviewed.
    ['Who writes the lessons?', 'Lessons are prepared by WASSCE Tutor to follow the WASSCE syllabus. Where a lesson has been checked by a reviewer, the reviewer’s name appears on that lesson.'],
    ['Is this the official WAEC website?', 'No. WASSCE Tutor is an independent study platform built in Sierra Leone. For registration, timetables and results, always use official WAEC channels.'],
  ]
}

export function Faq({ subjects }: { subjects: SubjectSummary[] }) {
  return (
    <Band labelledBy="faq-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div data-reveal>
          <p className="site-eyebrow">Questions</p>
          <h2 id="faq-heading" className="site-h2 mt-3">Frequently asked questions</h2>
          <p className="site-lede mt-4">Straight answers about cost, content and how WASSCE Tutor relates to WAEC.</p>
          <a href="/contact" className="site-link mt-4">
            Ask us something else <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <div className="divide-y border-y">
          {faq(subjects).map(([q, a]) => (
            <details key={q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-bold tracking-tight transition-colors hover:text-primary">
                {q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground">
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Band>
  )
}
