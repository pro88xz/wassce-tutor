import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowRight, ChevronRight, ClipboardCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { CourseHero, type HeroStat } from '@/components/public/CourseHero'
import { HERO_BTN, studyTime } from '@/lib/study-time'
import { StartCta } from '@/components/public/StartCta'
import { SubjectCard } from '@/components/public/SubjectCatalogue'
import { inCatalogueOrder, overallBadge } from '@/lib/catalogue'
import { OutlineTopics, TopicCard } from '@/components/public/TopicCard'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { useAuth } from '@/lib/auth'
import { PRACTICE_QUESTIONS, PRACTICE_SETS, hasPractice } from '@/lib/practice-counts'
import { fetchQuestionSubjects, fetchSubjectHub, hasTopicPage, lessonMinutes, questionsPath, subjectPath } from '@/lib/public-content'
import type { SubjectHub } from '@/lib/public-content'
import { tutorsPath } from '@/lib/public-rules'
import { SEARCH_COPY, brandedTitle, breadcrumbJsonLd, fitDescription, indexablePageTags, privatePageTags } from '@/lib/seo'
import { QuickAnswer } from '@/components/public/QuickAnswer'
import { QUICK_ANSWERS } from '@/content/quick-answers'
import { subjectTheme } from '@/lib/subject-theme'

const trail = (hub: SubjectHub): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  ['Subjects', '/wassce/subjects'],
  [hub.subject.name, subjectPath(hub.subject.slug)],
]

const hours = (minutes: number) => (minutes >= 90 ? `${Math.round(minutes / 60)} hours` : `${minutes} minutes`)

function describe(hub: SubjectHub): string {
  const sections = hub.groups.map((g) => g.name).slice(0, 3).join(', ')
  return fitDescription([
    `All ${hub.topicCount} WASSCE ${hub.subject.name} syllabus topics in ${hub.groups.length} sections, including ${sections}.`,
    hub.lessonCount ? `${hub.lessonCount} lessons (about ${hours(hub.minutes)}).` : '',
    'For Sierra Leone students.',
  ])
}

export const Route = createFileRoute('/wassce/$subject/')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const hub = await fetchSubjectHub(params.subject)
    if (!hub) throw notFound()
    // Public questions with answers (/wassce/{subject}/questions), when the subject has them.
    const publicQuestions = (await fetchQuestionSubjects()).get(hub.subject.slug) ?? 0
    return { ...hub, publicQuestions }
  },
  head: ({ loaderData: hub }) => {
    if (!hub) return privatePageTags('Page not found')
    const path = subjectPath(hub.subject.slug)
    const copy = SEARCH_COPY[path]
    // "& Lessons" only when the subject has some: the title must not promise what the page lacks.
    const lessons = hub.lessonCount > 0
    return indexablePageTags({
      path,
      title: brandedTitle(copy?.title ?? `WASSCE ${hub.subject.name} Syllabus: All ${hub.topicCount} Topics${lessons ? ' & Lessons' : ''}`),
      ogTitle: `WASSCE ${hub.subject.name}: syllabus topics${lessons ? ' and lessons' : ''}`,
      description: copy?.description ?? describe(hub),
      jsonLd: [breadcrumbJsonLd(trail(hub))],
    })
  },
  component: SubjectHubPage,
})

/** "Core subject", "Main subject in Science", "Elective in Arts and Commercial". */
function roleLabel(hub: SubjectHub): string {
  const f = hub.subject.faculties
  if (f.length === 0) return 'WASSCE syllabus'
  if (f.every((x) => x.role === 'core')) return 'Core subject'
  const names = (role: string) => f.filter((x) => x.role === role).map((x) => x.faculty.name)
  const join = (list: string[]) => (list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list[0])
  const main = names('faculty')
  if (main.length > 0) return `Main subject in ${join(main)}`
  return `Elective in ${join(names('elective'))}`
}

function SubjectHubPage() {
  const hub = Route.useLoaderData()
  const { subject, groups, topicCount, lessonCount, minutes, related, publicQuestions } = hub
  const quick = QUICK_ANSWERS[subjectPath(subject.slug)]
  const { user } = useAuth()
  const { palette } = subjectTheme(subject.slug)
  const hasLessons = lessonCount > 0
  const practice = PRACTICE_QUESTIONS[subject.slug] ?? 0
  const topicsWithLessons = groups.reduce((n, g) => n + g.topics.filter(hasTopicPage).length, 0)
  // The section a visitor most wants open: the first one with something to study.
  const firstOpen = Math.max(0, groups.findIndex((g) => g.topics.some(hasTopicPage)))

  const stats: HeroStat[] = [
    { value: String(topicCount), label: 'syllabus topics' },
    ...(hasLessons
      ? [
          { value: String(lessonCount), label: 'lessons' },
          { value: studyTime(minutes), label: 'of study' },
        ]
      : [{ value: String(groups.length), label: groups.length === 1 ? 'section' : 'sections' }]),
    ...(practice > 0 ? [{ value: String(practice), label: 'practice questions' }] : []),
  ]

  return (
    <article className="app-page site-page space-y-10 pb-12 sm:space-y-12">
      <div className="space-y-4">
        <Breadcrumbs trail={trail(hub)} />
        <CourseHero
          eyebrow={`WASSCE syllabus · ${roleLabel(hub)}`}
          title={subject.name}
          lede={
            hasLessons
              ? `Every topic in the WASSCE ${subject.name} syllabus, grouped the way you will study it, with lessons written for Sierra Leone students.`
              : `Every topic in the WASSCE ${subject.name} syllabus, grouped the way you will study it. The lessons for this subject are being written; the outline below shows what they will cover.`
          }
          stats={stats}
          actions={
            user ? (
              <a href={`/subject/${subject.id}`} className={`site-btn site-btn-primary ${HERO_BTN}`}>
                Open in WASSCE Tutor <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            ) : hasLessons ? (
              <>
                <Link to="/auth" className={`site-btn site-btn-primary ${HERO_BTN}`}>
                  Start {subject.name} free <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a href={tutorsPath(subject.slug)} className={`site-btn site-btn-secondary ${HERO_BTN}`}>Book a private tutor</a>
              </>
            ) : (
              <>
                <a href={tutorsPath(subject.slug)} className={`site-btn site-btn-primary ${HERO_BTN}`}>
                  Book a private tutor <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="/wassce/subjects" className={`site-btn site-btn-secondary ${HERO_BTN}`}>Subjects with lessons</a>
              </>
            )
          }
          note={hasLessons && !user ? 'Every lesson is free to read. No account or card needed.' : undefined}
          media={
            <SubjectCover
              slug={subject.slug}
              shape="wide"
              priority
              rounded="rounded-2xl"
              sizes="(min-width: 1024px) 480px, 100vw"
              className="aspect-[5/2] w-full shadow-[0_24px_48px_-28px_rgba(30,20,80,.45)] sm:aspect-[3/1] lg:aspect-[4/3]"
            />
          }
        />
      </div>

      {/* The question this page is searched for, answered first (src/content/quick-answers.ts). */}
      {quick && <QuickAnswer qa={quick} />}

      <section className="space-y-5" aria-labelledby="syllabus">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="site-eyebrow">Course outline</p>
            <h2 id="syllabus" className="site-h2 mt-2 text-[1.625rem] sm:text-[2rem]">{subject.name} syllabus, section by section</h2>
          </div>
          {hasLessons && (
            <div className="sm:w-64 sm:shrink-0">
              <p className="text-sm font-medium text-muted-foreground">
                Lessons published for <span className="font-bold text-foreground">{topicsWithLessons}</span> of {topicCount} topics
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                <div className={`h-full rounded-full ${palette.bar}`} style={{ width: `${(topicsWithLessons / topicCount) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {groups.map((group, groupIndex) => {
            const numbered = group.topics.map((topic, i) => ({ topic, number: i + 1 }))
            const ready = numbered.filter(({ topic }) => hasTopicPage(topic))
            const outline = numbered.filter(({ topic }) => !hasTopicPage(topic))
            const lessons = group.topics.reduce((n, t) => n + t.lessons.length, 0)
            const time = lessonMinutes(group.topics.flatMap((t) => t.lessons))
            return (
              <details key={group.name} open={groupIndex === firstOpen} className="site-card group/section overflow-hidden">
                <summary className="flex min-h-[4.75rem] cursor-pointer list-none items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold tabular-nums ${palette.soft} ${palette.text}`}>
                    {String(groupIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="site-h3 block text-base sm:text-lg">{group.name}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">
                      {group.topics.length} topic{group.topics.length === 1 ? '' : 's'}
                      {lessons > 0 ? ` · ${lessons} lesson${lessons === 1 ? '' : 's'}${time > 0 ? ` · ${studyTime(time)}` : ''}` : ' · syllabus outline'}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open/section:rotate-90" aria-hidden />
                </summary>
                <div className="space-y-5 border-t bg-muted/30 p-3 sm:p-5">
                  {ready.length > 0 && (
                    <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
                      {ready.map(({ topic, number }) => (
                        <li key={topic.id}>
                          <TopicCard subjectSlug={subject.slug} topic={topic} number={number} palette={palette} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="px-1 sm:px-0">
                    <OutlineTopics topics={outline} heading={ready.length > 0 ? 'Also on the syllabus · lessons in preparation' : undefined} />
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      </section>

      {hasPractice(subject.slug) && (
        <section className="site-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6" aria-labelledby="practice">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
            <ClipboardCheck className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="practice" className="site-h3">{practice} {subject.name} practice questions, all free</h2>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
              {PRACTICE_SETS[subject.slug]} sets of original WASSCE-style questions, topic by topic, each with the answer and the full working. They are not WAEC
              past papers.
            </p>
          </div>
          {publicQuestions > 0 ? (
            <a href={questionsPath(subject.slug)} className="site-btn site-btn-secondary shrink-0">
              Questions and answers <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <a href="/#try-a-question" className="site-btn site-btn-secondary shrink-0">
              Try a question <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          )}
        </section>
      )}

      <a href={tutorsPath(subject.slug)} className="site-card site-card-link group flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
        <img src="/img/tutors-session-640.webp" alt="Two students going through their notes with a tutor" loading="lazy" decoding="async" width={640} height={427} className="h-16 w-24 shrink-0 rounded-xl object-cover sm:h-20 sm:w-32" />
        <span className="min-w-0 flex-1">
          <span className="site-h3 block">Need one-to-one help with {subject.name}?</span>
          <span className="mt-1 block text-[15px] text-muted-foreground">Book a verified {subject.name} tutor for in-person lessons near you. Browsing is free.</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </a>

      <StartCta
        heading={`Study WASSCE ${subject.name} with WASSCE Tutor`}
        body={
          hasLessons
            ? `All ${lessonCount} ${subject.name} lessons are free${practice > 0 ? ', and so is exam-style practice marked instantly, with the working' : ''}. A free account saves your progress.`
            : `Lessons for ${subject.name} are being written. Every lesson is free in the subjects that already have them.`
        }
        appHref={`/subject/${subject.id}`}
      />

      {related.length > 0 && (
        <section className="space-y-5" aria-labelledby="related">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related" className="site-h2 text-[1.375rem] sm:text-[1.625rem]">Subjects taken with {subject.name}</h2>
            <a href="/wassce/subjects" className="site-link shrink-0">
              All subjects <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 [&>*]:min-w-0">
            {inCatalogueOrder(related).slice(0, 4).map((s) => (
              <li key={s.id}>
                <SubjectCard s={s} badge={overallBadge(s)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
