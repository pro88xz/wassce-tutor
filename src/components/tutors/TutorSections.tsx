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
    <section className="tutor-how-section space-y-5" aria-labelledby="tutor-how">
      <div className="tutor-section-heading">
        <div><p className="tutor-booking-eyebrow"><span /> A SIMPLE, CLEAR PROCESS</p><h2 id="tutor-how">From request to your first lesson.</h2></div>
        <p>No payment to enquire. You decide once the tutor, schedule and price are clear.</p>
      </div>
      <ol className="tutor-how-grid">
        {steps.map(([title, body], i) => (
          <li key={title} className="tutor-how-card">
            <div className="tutor-step-top"><span>0{i + 1}</span><span className="tutor-step-line" /></div>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function TutorFaq({ items = TUTOR_FAQ }: { items?: [string, string][] }) {
  return (
    <section className="tutor-faq-section space-y-4" aria-labelledby="tutor-faq">
      <div className="tutor-section-heading"><div><p className="tutor-booking-eyebrow"><span /> BEFORE YOU REQUEST</p><h2 id="tutor-faq">Questions about tutoring.</h2></div></div>
      <div className="tutor-faq-grid">
        {items.map(([q, a], i) => (
          <details key={q} className="tutor-faq-item">
            <summary><span className="tutor-faq-number">0{i + 1}</span><span>{q}</span><span className="tutor-faq-plus" aria-hidden>+</span></summary>
            <p>{a}</p>
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
    <ul className="tutor-subject-grid">
      {list.map((s) => (
        <li key={s.id}>
          <a href={tutorsPath(s.slug)} className="tutor-subject-card">
            <SubjectCover slug={s.slug} shape="thumb" className="tutor-subject-cover" rounded="rounded-xl" />
            <span className="tutor-subject-copy">
              <span className="tutor-subject-name">{s.name}</span>
              <span className="tutor-subject-meta">{s.topicCount} syllabus topics</span>
              <span className="tutor-subject-link">Explore tutoring <span aria-hidden>↗</span></span>
            </span>
            <ChevronRight className="tutor-subject-chevron" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
