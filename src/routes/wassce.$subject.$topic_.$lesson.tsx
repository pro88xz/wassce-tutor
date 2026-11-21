import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ListChecks, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { StartCta } from '@/components/public/StartCta'
import { FROM_PRICE } from '@/lib/plans'
import { hasPractice } from '@/lib/practice-counts'
import { PrerenderedLesson } from '@/components/lesson/PrerenderedLesson'
import { KeyTermsLink } from '@/components/lesson/key-terms-link'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { fetchPublicLessonPage, keyTermsPath, lessonPath, lessonSummary, questionsPath, subjectPath, topicKeyTermCount, topicPath, topicQuestionCount } from '@/lib/public-content'
import type { PublicLessonPageData } from '@/lib/public-content'
import { SEARCH_COPY, SITE, absoluteUrl, brandedTitle, breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'
import { SubjectIcon } from '@/components/SubjectIcon'
import { subjectTheme } from '@/lib/subject-theme'
import { displayName, tutorPagePath } from '@/lib/tutor-profile'

const trail = ({ subject, topic, lesson }: PublicLessonPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
  [lesson.title, lessonPath(subject.slug, topic.slug, lesson.slug)],
]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** WebPage wrapping the lesson as an Article; the human reviewer only when there is one. */
function lessonJsonLd(data: PublicLessonPageData): Record<string, unknown> {
  const { subject, topic, lesson } = data
  const url = absoluteUrl(lessonPath(subject.slug, topic.slug, lesson.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: lesson.title,
    inLanguage: 'en',
    ...(lesson.reviewed_at ? { lastReviewed: lesson.reviewed_at } : {}),
    ...(lesson.reviewed_at && lesson.reviewer_name
      ? { reviewedBy: { '@type': 'Person', name: displayName(lesson.reviewer_name), ...(lesson.reviewer_bio ? { description: lesson.reviewer_bio } : {}), ...(lesson.reviewer_tutor_slug ? { url: absoluteUrl(tutorPagePath(lesson.reviewer_tutor_slug)) } : {}) } }
      : {}),
    mainEntity: {
      '@type': 'Article',
      headline: lesson.title,
      description: lessonSummary(lesson.content),
      about: `${topic.name} (WASSCE ${subject.name})`,
      educationalLevel: 'Senior secondary (WASSCE)',
      isAccessibleForFree: true,
      datePublished: lesson.reviewed_at ?? lesson.updated_at,
      dateModified: lesson.updated_at,
      author: { '@type': 'Organization', name: SITE.name, url: `${SITE.origin}/` },
      publisher: { '@id': `${SITE.origin}/#organization` },
    },
  }
}

export const Route = createFileRoute('/wassce/$subject/$topic_/$lesson')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchPublicLessonPage(params.subject, params.topic, params.lesson)
    if (!data) throw notFound()
    return { ...data, questionCount: await topicQuestionCount(data.topic.id), keyTermCount: await topicKeyTermCount(data.topic) }
  },
  head: ({ loaderData: data }) => {
    if (!data) return privatePageTags('Page not found')
    const path = lessonPath(data.subject.slug, data.topic.slug, data.lesson.slug)
    const copy = SEARCH_COPY[path]
    return indexablePageTags({
      path,
      // Subject first: Google cuts titles at about 60 characters, and long lesson names used to push "WASSCE" out of view.
      // The brand goes too when it would be cut off anyway.
      title: brandedTitle(copy?.title ?? `WASSCE ${data.subject.name}: ${data.lesson.title}`),
      ogTitle: `${data.lesson.title} (WASSCE ${data.subject.name})`,
      description: copy?.description ?? lessonSummary(data.lesson.content),
      jsonLd: [lessonJsonLd(data), breadcrumbJsonLd(trail(data))],
    })
  },
  component: PublicLessonPage,
})

function PublicLessonPage() {
  const data = Route.useLoaderData()
  const { subject, topic, lesson, questionCount, keyTermCount } = data
  const others = topic.lessons.filter((l) => l.id !== lesson.id)
  // The lessons either side, in syllabus order: every lesson has a public page (migration 22).
  const at = topic.lessons.findIndex((l) => l.id === lesson.id)
  const previous = at > 0 ? topic.lessons[at - 1] : null
  const next = at >= 0 ? topic.lessons[at + 1] ?? null : null
  const { palette } = subjectTheme(subject.slug)

  return (
    <article className="app-page app-page-reader mx-auto w-full max-w-5xl space-y-8 pb-12">
      <header className="space-y-3 pt-2">
        <Breadcrumbs trail={trail(data)} />
        <p className={`flex items-center gap-2 text-sm font-semibold ${palette.text}`}>
          <SubjectIcon slug={subject.slug} size="sm" /> WASSCE {subject.name} · {topic.name}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <div className="rounded-xl border bg-muted/40 p-3 text-sm">
          {lesson.reviewed_at ? (
            <>
              <p>
                <span className="text-muted-foreground">Reviewed by </span>
                {lesson.reviewer_tutor_slug && lesson.reviewer_name ? (
                  <a href={tutorPagePath(lesson.reviewer_tutor_slug)} className="font-semibold text-primary hover:underline">
                    {displayName(lesson.reviewer_name)}
                  </a>
                ) : (
                  <span className="font-semibold">{lesson.reviewer_name ? displayName(lesson.reviewer_name) : 'the WASSCE Tutor team'}</span>
                )}
                {lesson.reviewer_bio && <span className="text-muted-foreground">, {lesson.reviewer_bio}</span>}
              </p>
              <p className="text-xs text-muted-foreground">
                Checked {formatDate(lesson.reviewed_at)}
                {lesson.est_minutes ? ` · ${lesson.est_minutes} min read` : ''} · Reviewed by a
                person before publishing.
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="text-muted-foreground">By </span>
                <span className="font-semibold">the WASSCE Tutor team</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Updated {formatDate(lesson.updated_at)}
                {lesson.est_minutes ? ` · ${lesson.est_minutes} min read` : ''} · Prepared against the WASSCE syllabus.
              </p>
            </>
          )}
        </div>
      </header>

      {/* Definition boxes link to the topic's key terms (made from them), when it has a page. */}
      <KeyTermsLink.Provider value={keyTermCount > 0 ? { href: keyTermsPath(subject.slug, topic.slug) } : null}>
        <PrerenderedLesson
          id={`lesson-${lesson.id}`}
          content={lesson.content}
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:leading-relaxed prose-li:my-1 prose-strong:text-foreground"
        />
      </KeyTermsLink.Provider>

      {questionCount > 0 && (
        <a href={questionsPath(subject.slug, topic.slug)} className="group flex items-center gap-4 rounded-2xl border border-primary/25 bg-brand-soft/50 p-4 transition-colors hover:border-primary/50 sm:p-5">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${palette.soft} ${palette.text}`}>
            <ListChecks className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold leading-snug group-hover:text-primary">Test yourself: {questionCount} WASSCE questions on {topic.name.toLowerCase()}</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">With the answers, the full working and why each wrong option is wrong.</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
        </a>
      )}

      {(previous || next) && (
        <nav aria-label="Lessons in this topic" className="grid gap-3 sm:grid-cols-2">
          {previous ? (
            <a href={lessonPath(subject.slug, topic.slug, previous.slug)} rel="prev" className="group rounded-xl border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40">
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous lesson</span>
              <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">{previous.title}</span>
            </a>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <a href={lessonPath(subject.slug, topic.slug, next.slug)} rel="next" className="group rounded-xl border p-4 text-right transition-colors hover:border-primary/50 hover:bg-muted/40">
              <span className="flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground">Next lesson <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
              <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">{next.title}</span>
            </a>
          )}
        </nav>
      )}

      {lesson.reviewed_at && lesson.reviewer_tutor_slug && lesson.reviewer_name && (
        <ReviewerTutor name={displayName(lesson.reviewer_name)} slug={lesson.reviewer_tutor_slug} bio={lesson.reviewer_bio} subject={subject.name} />
      )}

      <WaecPastPapers subjectSlug={subject.slug} subjectName={subject.name} />

      <StartCta
        heading={`Keep going with ${topic.name.toLowerCase()}`}
        body={`${topic.lessons.length === 1 ? `This is the lesson for ${topic.name}.` : `This is one of ${topic.lessons.length} lessons in ${topic.name}, all free.`} Every lesson in every subject is free${hasPractice(subject.slug) ? ', and so is exam-style practice with the working behind every answer' : ''}. A free account saves your progress; a plan adds the AI study tutor and timed mock exams, from ${FROM_PRICE} NLe.`}
        appHref={`/lesson/${lesson.id}`}
      />

      {others.length > 0 && (
        <section className="space-y-3" aria-labelledby="more-lessons">
          <h2 id="more-lessons" className="text-xl font-bold">More lessons in {topic.name}</h2>
          <ol className="divide-y rounded-xl border">
            {others.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                {l.is_public ? (
                  <a href={lessonPath(subject.slug, topic.slug, l.slug)} className="font-medium text-primary hover:underline">{l.title}</a>
                ) : (
                  <span className="font-medium">{l.title}</span>
                )}
                {l.est_minutes ? <span className="shrink-0 text-xs text-muted-foreground">{l.est_minutes} min</span> : null}
              </li>
            ))}
          </ol>
          <p className="text-sm">
            <a href={topicPath(subject.slug, topic.slug)} className="text-primary hover:underline">All of {topic.name} →</a>
          </p>
        </section>
      )}
    </article>
  )
}

/** The lesson was checked by a tutor: learn with them in person. */
function ReviewerTutor({ name, slug, bio, subject }: { name: string; slug: string; bio: string | null; subject: string }) {
  const first = name.split(' ')[0]
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,var(--border))] bg-[linear-gradient(135deg,#f4f0ff,#ffffff_60%)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:bg-[linear-gradient(135deg,#221c3a,#1a1626_60%)]" aria-label={`Reviewed by ${name}`}>
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden />
        <div>
          <p className="text-[15px] font-bold">Checked by {name}{bio ? `, ${bio}` : ''}</p>
          <p className="mt-0.5 text-[14px] text-muted-foreground">Want help with {subject} in person? {first} gives private lessons.</p>
        </div>
      </div>
      <a href={tutorPagePath(slug)} className="site-btn site-btn-primary shrink-0">
        Learn with {first} <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </aside>
  )
}
