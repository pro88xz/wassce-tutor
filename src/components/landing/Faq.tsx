// Questions: the heading and a route to a person on the left, answers on the right.
import { ArrowRight, Plus } from 'lucide-react'
import { PLANS } from '@/lib/plans'
import { Band } from '@/components/public/Section'

const PRICES = PLANS.map((p) => `${p.priceNle} NLe for ${p.length}`).join(' or ')

const FAQ: [question: string, answer: string][] = [
  ['Is WASSCE Tutor free?', `Yes, to start. A free account opens every subject, the first lesson of every topic and a starter practice set in every subject, with no time limit. To unlock everything, pay ${PRICES}.`],
  ['Which subjects are covered?', 'All the main WASSCE subjects for Science, Arts, Commercial and Technical students, including English Language and Mathematics. Each subject is broken down topic by topic, and new lessons are added all the time.'],
  ['Are these real WAEC past papers?', 'No. Practice sets are original WASSCE-style questions written by WASSCE Tutor to match the syllabus and the exam format, each with the full working. We do not copy WAEC papers.'],
  ['How do I pay?', 'Choose a plan, complete the Monime USSD payment on your phone, and your access activates automatically after payment verification. Plans do not renew automatically.'],
  ['Does it work on my phone?', 'Yes. WASSCE Tutor works in any phone browser and is built for patchy data. An Android app is coming soon.'],
  ['Who writes the lessons?', 'Lessons follow the WASSCE syllabus. Every lesson published openly on this website is checked by a named reviewer, whose name appears on the lesson.'],
  ['Is this the official WAEC website?', 'No. WASSCE Tutor is an independent study platform built in Sierra Leone. For registration, timetables and results, always use official WAEC channels.'],
]

export function Faq() {
  return (
    <Band tone="white" labelledBy="faq-heading">
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
          {FAQ.map(([q, a]) => (
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
