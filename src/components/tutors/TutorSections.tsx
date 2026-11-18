// Sections shared by /tutors and /tutors/{subject}.
import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, BookOpen, ChevronRight, MapPin, Search } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { useTutorAutoApprove } from '@/lib/tutor-settings'
import { SubjectCover } from '@/components/ds/SubjectCover'

export const TUTOR_FAQ: [question: string, answer: string][] = [
  ['Is this a real person or the study tutor in the app?', 'A real person. Every tutor listed is a teacher with their own photo, qualifications and fees on WASSCE Tutor. It is separate from the study tutor inside the WASSCE Tutor app.'],
  ['How much does a tutor cost?', 'Each tutor sets their own monthly fee for each subject, and how many lessons a week it includes. Take several subjects with one tutor and the fees add up, often with a discount from the tutor. You see the total, and confirm it, before WhatsApp opens.'],
  ['Can friends learn together to pay less?', 'Yes, with tutors who take small groups (look for “Groups up to” on their card). Choose how many of you are learning: friends, classmates or brothers and sisters. Each of you pays the tutor’s group fee, usually lower than learning alone.'],
  ['Where do lessons happen?', 'In person. You agree the place with the tutor: your home, the tutor’s place or somewhere convenient for you both. WASSCE Tutor does not run online lessons.'],
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
              <span className="tutor-subject-link">Explore tutoring <span aria-hidden>↗</span></span>
            </span>
            <ChevronRight className="tutor-subject-chevron" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * The hero search: a subject (its own tutor page) and a town. On the same page
 * it filters the marketplace in place (TutorMarketplace listens for
 * "tutors:search"); otherwise it opens the subject's page with ?area=.
 */
export function TutorSearch({ subjects, current }: { subjects: { name: string; slug: string }[]; current?: string }) {
  const navigate = useNavigate()
  const [subject, setSubject] = useState(current ?? '')
  const [area, setArea] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const path = tutorsPath(subject || undefined)
    const a = area.trim().slice(0, 60)
    const url = `${path}${a ? `?area=${encodeURIComponent(a)}` : ''}`
    if (path === window.location.pathname) {
      window.history.replaceState(window.history.state, '', `${url}#tutors`)
      window.dispatchEvent(new CustomEvent('tutors:search', { detail: a }))
      document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    void navigate({ href: `${url}#tutors` })
  }
  const box = 'flex h-14 min-w-0 items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 ring-1 ring-slate-900/[.06] transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#7c5cff]'
  return (
    <form onSubmit={submit} className="grid gap-2 rounded-2xl bg-white p-2 text-slate-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,.65)] sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]" role="search" aria-label="Find a tutor">
      <label className={box}>
        <BookOpen className="h-[18px] w-[18px] shrink-0 text-[#6438d8]" aria-hidden />
        <span className="sr-only">Subject</span>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-full w-full min-w-0 cursor-pointer bg-transparent text-[15px] font-semibold outline-none">
          <option value="">Any subject</option>
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className={box}>
        <MapPin className="h-[18px] w-[18px] shrink-0 text-[#6438d8]" aria-hidden />
        <span className="sr-only">Town or area</span>
        <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Town or area, e.g. Bo" className="h-full w-full min-w-0 bg-transparent text-[15px] font-medium outline-none placeholder:text-slate-400" />
      </label>
      <button type="submit" className="site-btn site-btn-primary h-14 px-6">
        <Search className="h-4 w-4" aria-hidden /> Find tutors
      </button>
    </form>
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
