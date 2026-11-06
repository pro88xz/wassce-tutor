// Sections shared by /tutors and /tutors/{subject}.
import { ChevronRight } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { SubjectCover } from '@/components/ds/SubjectCover'

export const TUTOR_FAQ: [question: string, answer: string][] = [
  ['Is this a real person or the AI tutor?', 'A real person. Book a tutor arranges one-to-one lessons with a human teacher. It is separate from the AI tutor inside the WASSCE Tutor app.'],
  ['How much does a tutor cost?', 'It depends on the subject, how often you meet and whether lessons are online or at home. We tell you the price on WhatsApp before you agree to anything, and you pay nothing to ask.'],
  ['Can the tutor come to my home?', 'Home lessons depend on where you live. Tell us your town or area and we will let you know whether a tutor can come to you. Online lessons work anywhere with a phone and data.'],
  ['How do online lessons work?', 'Your tutor calls you on a video or voice call at the times you agree, and shares working and past questions as you go. A phone is enough.'],
  ['Do I need a WASSCE Tutor account?', 'No. Anyone can request a tutor. Between lessons, the app is there for lessons, exam-style practice and the AI tutor if you want them.'],
  ['What happens after I send a request?', 'We reply on WhatsApp to confirm the tutor, the days and times, and the price. Nothing is booked or paid until you agree.'],
]

export function TutorHowItWorks() {
  const steps = [
    ['Tell us what you need', 'Your subject, your class, online or at home, and when you are free. It takes a minute and costs nothing.'],
    ['We match you with a tutor', 'We reply on WhatsApp with a tutor for your subject and confirm the times and the price before anything is paid.'],
    ['Learn one to one', 'Work through the topics you find hard with someone who explains them your way, until you are ready for the exam.'],
  ]
  return (
    <section className="space-y-5" aria-labelledby="tutor-how">
      <h2 id="tutor-how" className="text-2xl font-bold tracking-tight">How booking works</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <li key={title} className="rounded-2xl border bg-card p-5">
            <span className="text-3xl font-bold tabular-nums text-primary/30">0{i + 1}</span>
            <h3 className="mt-2 text-lg font-bold leading-snug">{title}</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function TutorFaq({ items = TUTOR_FAQ }: { items?: [string, string][] }) {
  return (
    <section className="space-y-4" aria-labelledby="tutor-faq">
      <h2 id="tutor-faq" className="text-2xl font-bold tracking-tight">Questions about tutors</h2>
      <div className="divide-y rounded-2xl border bg-card">
        {items.map(([q, a]) => (
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

/** Every subject with a tutor page, as photo rows. */
export function TutorSubjectGrid({ subjects, exclude }: { subjects: SubjectSummary[]; exclude?: string }) {
  const list = subjects.filter((s) => s.slug !== exclude)
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
      {list.map((s) => (
        <li key={s.id}>
          <a href={tutorsPath(s.slug)} className="flex min-h-[76px] items-center gap-3.5 rounded-2xl border bg-card p-3 pr-3.5 transition-colors hover:border-primary/40">
            <SubjectCover slug={s.slug} shape="thumb" className="h-14 w-20 shrink-0" rounded="rounded-lg" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold leading-snug">{s.name} tutor</span>
              <span className="mt-0.5 block text-[13px] text-muted-foreground">{s.topicCount} syllabus topics</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
