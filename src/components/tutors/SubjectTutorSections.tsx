// Sections of a subject's tutor page (/tutors/{subject}) written from that
// subject's own facts (src/lib/subject-tutors.ts): the syllabus a tutor covers,
// what to practise between lessons, and the tutors for related subjects.
import { ArrowRight, BookOpen, ChevronRight, ExternalLink, FileText, ListChecks, NotebookPen, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { tutorsPath } from '@/lib/public-rules'
import { questionSpread, readingTime, subjectLessonsHref, type SubjectTutorsPage } from '@/lib/subject-tutors'
import { shortSubject } from '@/lib/tutor-seo'

/** The whole syllabus, part by part, with each part's lessons, reading time and practice questions. */
export function SyllabusCoverage({ page }: { page: SubjectTutorsPage }) {
  const { subject, topicCount } = page.hub
  const short = shortSubject(subject.name)
  return (
    <section className="space-y-6" aria-labelledby="covers">
      <div className="tutor-section-heading">
        <div>
          <p className="tutor-booking-eyebrow">
            <span /> {topicCount} TOPICS, {page.parts.length} {page.parts.length === 1 ? 'PART' : 'PARTS'}
          </p>
          <h2 id="covers">
            What a {short} tutor <em>covers.</em>
          </h2>
        </div>
        <p>
          {page.parts.length > 1 ? `From ${page.parts[0].name} to ${page.parts.at(-1)!.name}` : `The ${subject.name} syllabus`}: tap a {short} topic to read its lessons.
        </p>
      </div>
      {/* Two columns that fill top to bottom, so a short part never leaves a gap beside a long one. */}
      <ol className="gap-4 md:columns-2">
        {page.parts.map((part, i) => (
          <li key={part.name} className="mb-4 break-inside-avoid rounded-[1.5rem] border border-border bg-[var(--card)] p-5 shadow-[var(--site-shadow-card)] sm:p-6">
            <p className="text-[12px] font-bold uppercase tracking-[.14em] text-[var(--primary)]">Part {i + 1}</p>
            <h3 className="mt-1 text-lg font-bold leading-snug">{part.name}</h3>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              {part.topics.length} {part.topics.length === 1 ? 'topic' : 'topics'} · {part.lessons} {part.lessons === 1 ? 'lesson' : 'lessons'}, {readingTime(part.minutes)}
              {part.questions > 0 && ` · ${part.questions} practice questions`}
            </p>
            <ul className="mt-3.5 flex flex-wrap gap-1.5">
              {part.topics.map((t) => (
                <li key={t.id}>
                  {t.href ? (
                    <a href={t.href} className="inline-flex min-h-9 items-center rounded-full border bg-background px-3 text-[13px] font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">
                      {t.name}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-9 items-center rounded-full border border-dashed px-3 text-[13px] text-muted-foreground">{t.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * The subject's lessons that tutors here read and approved, with who reviewed
 * how many (each lesson carries the reviewer's name) and the latest ones.
 */
export function ReviewedByTutors({ page }: { page: SubjectTutorsPage }) {
  const { reviews, hub } = page
  if (reviews.total === 0) return null
  const short = shortSubject(hub.subject.name)
  return (
    <section className="space-y-5" aria-labelledby="reviewed">
      <div className="tutor-section-heading">
        <div>
          <p className="tutor-booking-eyebrow">
            <span /> {reviews.total} OF {hub.lessonCount} {short.toUpperCase()} LESSONS
          </p>
          <h2 id="reviewed">
            Reviewed by <em>tutors who teach here.</em>
          </h2>
        </div>
        <p>
          Each of these {short} lessons was read and approved by a named tutor:{' '}
          {reviews.reviewers.map((r, i) => (
            <span key={r.href}>
              {i > 0 && (i === reviews.reviewers.length - 1 ? ' and ' : ', ')}
              <a href={r.href} className="site-link">
                {r.name}
              </a>{' '}
              ({r.count})
            </span>
          ))}
          .
        </p>
      </div>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.recent.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="flex h-full gap-3 rounded-[1.25rem] border border-border bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--site-shadow-raised)]">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              <span className="min-w-0">
                <span className="block font-semibold leading-snug">{l.title}</span>
                <span className="mt-1 block text-[13px] text-muted-foreground">
                  {l.topic} · approved by {l.reviewer}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PractiseLink({ href, external, icon, title, body }: { href: string; external?: boolean; icon: ReactNode; title: string; body: string }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex h-full gap-4 rounded-[1.25rem] border border-border bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--site-shadow-raised)]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--primary)]">{icon}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-bold leading-snug">
          {title}
          {external ? <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden /> : <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />}
        </span>
        <span className="mt-1 block text-[14px] leading-relaxed text-muted-foreground">{body}</span>
      </span>
    </a>
  )
}

/** What a student can work through between lessons, with this subject's own numbers. */
export function PractiseBetweenLessons({ page }: { page: SubjectTutorsPage }) {
  const { subject, lessonCount, minutes } = page.hub
  const short = shortSubject(subject.name)
  const topics = page.parts.flatMap((p) => p.topics)
  const spread = questionSpread(page)
  return (
    <section className="space-y-5" aria-labelledby="practise">
      <div className="tutor-section-heading">
        <div>
          <p className="tutor-booking-eyebrow">
            <span /> FREE, ALONGSIDE YOUR TUTOR
          </p>
          <h2 id="practise">
            Practise {short} <em>between lessons.</em>
          </h2>
        </div>
      </div>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
        <li>
          <PractiseLink
            href={subjectLessonsHref(page)}
            icon={<BookOpen className="h-5 w-5" aria-hidden />}
            title={`${lessonCount} ${subject.name} lessons`}
            body={`From ${topics[0]?.name} to ${topics.at(-1)?.name}: ${readingTime(minutes)} of ${short} reading, free.`}
          />
        </li>
        {page.questionsHref && (
          <li>
            <PractiseLink
              href={page.questionsHref}
              icon={<ListChecks className="h-5 w-5" aria-hidden />}
              title={`${page.questionCount} ${short} practice questions`}
              body={`${spread ? `${spread[0].toUpperCase()}${spread.slice(1)}, ` : ''}each with its worked answer.`}
            />
          </li>
        )}
        {page.pastPapersUrl && (
          <li>
            <PractiseLink
              href={page.pastPapersUrl}
              external
              icon={<FileText className="h-5 w-5" aria-hidden />}
              title={`WAEC ${short} past papers`}
              body={`${subject.name} papers set by WAEC, with its examiners’ comments.`}
            />
          </li>
        )}
        {page.guide && (
          <li>
            <PractiseLink href={page.guide.href} icon={<NotebookPen className="h-5 w-5" aria-hidden />} title={page.guide.title} body={`How ${subject.name} is examined, and how to revise it.`} />
          </li>
        )}
      </ul>
    </section>
  )
}

/** Tutors for the subjects taken alongside this one (same faculty), with how many teach each. */
export function RelatedSubjectTutors({ page }: { page: SubjectTutorsPage }) {
  const short = shortSubject(page.hub.subject.name)
  if (page.related.length === 0) return null
  return (
    <section className="space-y-4" aria-labelledby="related-subjects">
      <div className="tutor-section-heading">
        <div>
          <p className="tutor-booking-eyebrow">
            <span /> OFTEN TAKEN WITH {short.toUpperCase()}
          </p>
          <h2 id="related-subjects">
            Tutors for <em>related subjects.</em>
          </h2>
        </div>
        <p>
          <a href={tutorsPath()} className="site-link">
            Tutors for every subject
          </a>
        </p>
      </div>
      <ul className="tutor-subject-grid">
        {page.related.map((s) => (
          <li key={s.slug}>
            <a href={tutorsPath(s.slug)} className="tutor-subject-card">
              <SubjectCover slug={s.slug} shape="thumb" className="tutor-subject-cover" rounded="rounded-xl" />
              <span className="tutor-subject-copy">
                <span className="tutor-subject-name">{s.name}</span>
                <span className="tutor-subject-meta">
                  {s.tutors === 0
                    ? `${s.topicCount} topics, no tutor yet`
                    : `${s.tutors} ${s.tutors === 1 ? 'tutor' : 'tutors'}${s.shared ? `, ${s.shared === s.tutors ? (s.tutors === 1 ? 'who also teaches' : 'all also teach') : `${s.shared} also teach`} ${short}` : ''}`}
                </span>
              </span>
              <ChevronRight className="tutor-subject-chevron" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
