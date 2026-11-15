// Sections shared by /tutors and /tutors/{subject}.
import { ChevronRight } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { SubjectCover } from '@/components/ds/SubjectCover'

export const TUTOR_FAQ: [question: string, answer: string][] = [
  ['Is this a real person or the study tutor in the app?', 'A real person. Every tutor listed is a teacher verified by WASSCE Tutor. It is separate from the study tutor inside the WASSCE Tutor app.'],
  ['How much does a tutor cost?', 'Each tutor sets their own monthly fee for each subject. You see it on their card, and you confirm it before WhatsApp opens.'],
  ['Where do lessons happen?', 'In person. You agree the place with the tutor: your home, the tutor’s place or somewhere convenient for you both. WASSCE Tutor does not run online lessons.'],
  ['How do I pay the tutor?', 'You pay the tutor directly, in the way you agree together. WASSCE Tutor does not take payment for tutoring.'],
  ['What does the blue tick mean?', 'The tutor is verified: they applied with their qualifications and experience, and our team reviewed them before listing. A tutor can be paused if a problem is reported.'],
  ['Do I need a WASSCE Tutor account?', 'To message a tutor directly, yes: a free account keeps tutors’ numbers private and shows them the message comes from a real student. To ask us to find a tutor for you, no account is needed.'],
]

export function TutorHowItWorks() {
  const steps = [
    ['Choose a verified tutor', 'Compare tutors by subject, experience, area and monthly fee. Every tutor is reviewed before they are listed.'],
    ['Agree to the fee', 'Tap Book this tutor. You see the tutor’s monthly fee for your subject, and continue only if it works for you.'],
    ['Message them on WhatsApp', 'WhatsApp opens with your message ready. Agree your days, times and place for in-person lessons directly with the tutor.'],
  ]
  return (
    <section className="tutor-how-section space-y-5" aria-labelledby="tutor-how">
      <div className="tutor-section-heading">
        <div><p className="tutor-booking-eyebrow"><span /> A SIMPLE, CLEAR PROCESS</p><h2 id="tutor-how">From choosing a tutor to your first lesson.</h2></div>
        <p>Free to contact. You see the fee first, and you pay the tutor directly.</p>
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
