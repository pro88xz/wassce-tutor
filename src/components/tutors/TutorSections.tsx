// Sections shared by /tutors and /tutors/{subject}.
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { shortSubject, TUTOR_AREAS } from '@/lib/tutor-seo'
import { useTutorAutoApprove } from '@/lib/tutor-settings'
import { SubjectCover } from '@/components/ds/SubjectCover'

export const TUTOR_FAQ: [question: string, answer: string][] = [
  ['Is this a real person or the study tutor in the app?', 'A real person. Every tutor listed is a teacher with their own photo, qualifications and fees on WASSCE Tutor. It is separate from the study tutor inside the WASSCE Tutor app.'],
  ['How do I find a private tutor in Sierra Leone?', 'Choose a tutor in the marketplace on this page: filter by subject, search for your town or area, and compare their experience and monthly fees. Tap Book this tutor, agree to the fee, and WhatsApp opens with your message ready. If there is no tutor near you yet, tell us your subject and area and we will find one.'],
  ['How much does a private tutor cost?', 'Each tutor sets their own monthly fee for each subject, and how many lessons a week it includes. Take several subjects with one tutor and the fees add up, often with a discount from the tutor. You see the total, and confirm it, before WhatsApp opens.'],
  ['Can a tutor give lessons at my home?', 'Yes. Lessons are in person: at your home, at the tutor’s place or somewhere convenient for you both, as you agree with the tutor. WASSCE Tutor does not run online lessons.'],
  ['Are there tutors in Freetown, Bo, Kenema and Makeni?', 'Tutors teach in their own town or area, which is on their card. Search the marketplace for yours. If none is listed near you yet, tell us where you live and we will find a tutor for you.'],
  ['Can friends take extra classes together to pay less?', 'Yes, with tutors who take small groups (look for “Groups up to” on their card). Choose how many of you are learning: friends, classmates or brothers and sisters. Each of you pays the tutor’s group fee, usually lower than learning alone.'],
  ['How do I pay the tutor?', 'You pay the tutor directly, by Orange Money, Afrimoney, cash or bank transfer: when you book, you see which ones the tutor accepts. WASSCE Tutor does not take payment for tutoring.'],
  ['What does the blue tick mean?', 'The tutor has a tutor account with WASSCE Tutor, with their real photo, qualifications and fees. Our team is told about every new tutor and removes any card that is misleading, and a tutor can be paused if a problem is reported.'],
  ['Do I need a WASSCE Tutor account?', 'To message a tutor directly, yes: a free account keeps tutors’ numbers private and shows them the message comes from a real student. To ask us to find a tutor for you, no account is needed.'],
]
export function TutorHowItWorks() {
  const steps = [
    ['Choose a tutor', 'Compare tutors by subject, experience, area and monthly fee. Each card shows their photo, qualifications and fee.'],
    ['Agree to the fee', 'Tap Book this tutor, choose your subjects and who is learning, and see the monthly price with any discount. Continue only if it works for you.'],
    ['Message them on WhatsApp', 'WhatsApp opens with your message ready. Agree your days, times and place for in-person lessons directly with the tutor.'],
  ]
  return (
    <section className="tutor-how-section space-y-5" aria-labelledby="tutor-how">
      <div className="tutor-section-heading">
        <div><p className="tutor-booking-eyebrow"><span /> A SIMPLE, CLEAR PROCESS</p><h2 id="tutor-how">From choosing a tutor <em>to your first lesson.</em></h2></div>
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
      <div className="tutor-section-heading"><div><p className="tutor-booking-eyebrow"><span /> BEFORE YOU REQUEST</p><h2 id="tutor-faq">Questions about <em>tutoring.</em></h2></div></div>
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
              <span className="tutor-subject-link">
                {shortSubject(s.name)} tutors <span aria-hidden>↗</span>
              </span>
            </span>
            <ChevronRight className="tutor-subject-chevron" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** For teachers reading the marketplace: join in three steps. */
export function TutorJoinBand({ subjectName }: { subjectName?: string }) {
  const auto = useTutorAutoApprove()
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-[var(--site-ink)] px-6 py-10 text-white sm:px-12 sm:py-14" aria-labelledby="join-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_22rem_at_100%_0%,rgba(124,92,255,.42),transparent_70%),radial-gradient(28rem_18rem_at_0%_120%,rgba(255,209,102,.16),transparent_70%)]" />
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[#cdbcff]">For teachers</p>
          <h2 id="join-heading" className="site-h2 mt-3">
            Teach {subjectName ?? 'WASSCE'}? <span className="site-accent text-[#cdbcff]">Students are looking.</span>
          </h2>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/72">
            Make your tutor card in three steps and set your own monthly fee. {auto ? 'It goes live in the marketplace the moment you finish.' : 'Our team checks it, then it goes live.'}
          </p>
        </div>
        <a href="/become-a-tutor" className="site-btn site-btn-lg bg-white px-7 text-[var(--site-ink)] hover:bg-[#efeaff]">
          Become a tutor <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </section>
  )
}

/**
 * What private lessons here involve, in the words people search with:
 * private tutor, home lessons, extra classes, the town. Plain text for
 * students and search engines alike, with the key facts beside it.
 */
export function PrivateLessonsGuide() {
  const facts: [string, string][] = [
    ['Lessons', 'In person, one to one or in a small group, at your home or near you'],
    ['Fees', 'Set by each tutor, per month, shown before you contact them'],
    ['Payment', 'Directly to the tutor: Orange Money, Afrimoney or cash'],
    ['Contact', 'Free, on WhatsApp, once you agree to the tutor’s fee'],
    ['Syllabus', 'The Sierra Leone WASSCE syllabus, every subject'],
  ]
  return (
    <section aria-labelledby="private-lessons">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-16">
        <div>
          <div className="tutor-section-heading">
            <div>
              <p className="tutor-booking-eyebrow"><span /> PRIVATE LESSONS FOR WASSCE</p>
              <h2 id="private-lessons">Home lessons with a private tutor, <em>near you.</em></h2>
            </div>
          </div>
          <div className="mt-6 max-w-2xl space-y-4 text-[16px] leading-relaxed text-muted-foreground">
            <p>
              A private tutor gives you lessons in person, one to one, at your home, at the tutor’s place or somewhere you both agree. Home lessons
              fit around school: after classes, in the evening or at weekends. Many tutors also take small groups, so friends can share extra classes at a
              lower fee each.
            </p>
            <p>
              Every tutor here teaches for the Sierra Leone WASSCE. Their card shows the subjects they teach, their qualifications and experience, their
              town, and the monthly fee for each subject with how many lessons a week it includes, so you know the price before you message them.
            </p>
            <p>
              Tutors teach in their own town or area: search the marketplace for yours, such as {TUTOR_AREAS}. If there is no tutor near you yet, tell us
              where you live and we will find one.
            </p>
          </div>
        </div>
        <dl className="h-fit divide-y divide-border self-start rounded-[1.5rem] border border-border bg-[var(--card)] px-6 shadow-[var(--site-shadow-card)]">
          {facts.map(([term, detail]) => (
            <div key={term} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-4">
              <dt className="text-[13px] font-bold uppercase tracking-[.12em] text-[var(--primary)]">{term}</dt>
              <dd className="text-[15px] leading-snug text-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
