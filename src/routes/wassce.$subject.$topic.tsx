import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { CourseHero, type HeroStat } from '@/components/public/CourseHero'
import { HERO_BTN, studyTime } from '@/lib/study-time'
import { StartCta } from '@/components/public/StartCta'
import { TopicCard } from '@/components/public/TopicCard'
import { useAuth } from '@/lib/auth'
import { hasPractice } from '@/lib/practice-counts'
import { fetchTopicPage, hasTopicPage, lessonMinutes, lessonPath, subjectPath, topicPath } from '@/lib/public-content'
import type { TopicPageData } from '@/lib/public-content'
import { breadcrumbJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'
import { subjectTheme } from '@/lib/subject-theme'
import { topicPhoto, topicPhotoSrcSet } from '@/lib/topic-photos'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { LessonOutlineList, outlineLinkClass } from '@/components/LessonOutline'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { describeTotals, loadOutlines, outlineKey, sectionId, totals } from '@/lib/lesson-outlines'
import type { LessonOutline } from '@/lib/lesson-outlines'

const trail = ({ subject, topic }: TopicPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
]

function describe({ subject, topic, group }: TopicPageData): string {
  const n = topic.lessons.length
  const intro = topic.description ? `${topic.description.replace(/\.?$/, '.')} ` : ''
  return `${intro}${n} WASSCE ${subject.name} lesson${n === 1 ? '' : 's'} on ${topic.name.toLowerCase()} (about ${lessonMinutes(topic.lessons)} minutes), part of ${group.name}. For Sierra Leone students.`
}

export const Route = createFileRoute('/wassce/$subject/$topic')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchTopicPage(params.subject, params.topic)
    if (!data) throw notFound()
    // What each lesson covers (sections, worked examples, diagrams), keyed by lesson slug.
    const all = await loadOutlines(data.subject.slug)
    const outlines: Record<string, LessonOutline> = {}
    for (const l of data.topic.lessons) {
      const o = all[outlineKey(data.topic.slug, l.slug)]
      if (o) outlines[l.slug] = o
    }
    return { ...data, outlines }
  },
  head: ({ loaderData: data }) =>
    data
      ? indexablePageTags({
          path: topicPath(data.subject.slug, data.topic.slug),
          title: `WASSCE ${data.subject.name}: ${data.topic.name} Lessons | WASSCE Tutor`,
          ogTitle: `${data.topic.name} (WASSCE ${data.subject.name})`,
          description: describe(data),
          jsonLd: [breadcrumbJsonLd(trail(data))],
        })
      : privatePageTags('Page not found'),
  component: TopicPage,
})

/** How many other topics from the section are offered at the foot of the page. */
const MORE_TOPICS = 4

function TopicPage() {
  const data = Route.useLoaderData()
  const { subject, topic, group, previous, next, outlines } = data
  const { user } = useAuth()
  const { palette } = subjectTheme(subject.slug)
  const minutes = lessonMinutes(topic.lessons)
  const count = topic.lessons.length
  const freeLesson = topic.lessons.find((l) => l.is_public)
  const freeCount = topic.lessons.filter((l) => l.is_public).length
  const covered = describeTotals(totals(topic.lessons.map((l) => outlines[l.slug])))
  const photo = topicPhoto(subject.slug, topic.slug)

  // Other topics in the section that can be opened: the ones after this topic first, then back round.
  const at = group.topics.findIndex((t) => t.id === topic.id)
  const more = [...group.topics.slice(at + 1), ...group.topics.slice(0, at)]
    .filter(hasTopicPage)
    .slice(0, MORE_TOPICS)
    .map((t) => ({ topic: t, number: group.topics.findIndex((x) => x.id === t.id) + 1 }))

  const stats: HeroStat[] = [
    { value: String(count), label: count === 1 ? 'lesson' : 'lessons' },
    ...(minutes > 0 ? [{ value: studyTime(minutes), label: 'of study' }] : []),
    ...(freeCount > 0 ? [{ value: String(freeCount), label: 'free to read' }] : []),
  ]

  return (
    <article className="app-page site-page space-y-10 pb-12 sm:space-y-12">
      <div className="space-y-4">
        <Breadcrumbs trail={trail(data)} />
        <CourseHero
          eyebrow={`WASSCE ${subject.name} · ${group.name}`}
          title={topic.name}
          lede={topic.description ?? undefined}
          stats={stats}
          actions={
            <>
              {freeLesson && (
                <a href={lessonPath(subject.slug, topic.slug, freeLesson.slug)} className={`site-btn site-btn-light ${HERO_BTN}`}>
                  Read the first lesson free <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              )}
              {user ? (
                <a href={`/topic/${topic.id}`} className={`site-btn ${HERO_BTN} ${freeLesson ? 'site-btn-glass' : 'site-btn-light'}`}>Open in WASSCE Tutor</a>
              ) : (
                <Link to="/auth" className={`site-btn ${HERO_BTN} ${freeLesson ? 'site-btn-glass' : 'site-btn-light'}`}>Start free</Link>
              )}
            </>
          }
          note={covered.length > 0 ? `Across the topic: ${covered.join(' · ')}` : undefined}
          media={
            photo ? (
              <span className="relative block aspect-[5/2] w-full overflow-hidden rounded-2xl bg-white/5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.7)] ring-1 ring-white/10 sm:aspect-[3/1] lg:aspect-[4/3]">
                <img
                  src={photo.src}
                  srcSet={topicPhotoSrcSet(photo)}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  alt={photo.caption}
                  width={960}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover ${photo.position ?? ''}`}
                />
              </span>
            ) : (
              <SubjectCover
                slug={subject.slug}
                shape="wide"
                priority
                rounded="rounded-2xl"
                sizes="(min-width: 1024px) 480px, 100vw"
                className="aspect-[5/2] w-full shadow-[0_30px_60px_-30px_rgba(0,0,0,.7)] ring-1 ring-white/10 sm:aspect-[3/1] lg:aspect-[4/3]"
              />
            )
          }
        />
      </div>

      <section className="space-y-5" aria-labelledby="lessons">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="site-eyebrow">Topic content</p>
            <h2 id="lessons" className="site-h2 mt-2 text-[1.625rem] sm:text-[2rem]">Lessons in this topic</h2>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {count} lesson{count === 1 ? '' : 's'}
            {minutes > 0 ? ` · ${studyTime(minutes)}` : ''}
          </p>
        </div>
        {/* One list, as a course outline: the free lesson opens here, the rest come with a plan. */}
        <ol className="site-card divide-y overflow-hidden">
          {topic.lessons.map((lesson, i) => {
            const href = lesson.is_public ? lessonPath(subject.slug, topic.slug, lesson.slug) : user ? `/lesson/${lesson.id}` : null
            // Time and access: beside the title from tablet width, under it on phones (so titles keep the full line).
            const meta = (
              <>
                {lesson.est_minutes ? <span className="tabular-nums">{lesson.est_minutes} min</span> : null}
                {lesson.is_public ? (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 font-bold text-success">Free</span>
                ) : (
                  !user && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-semibold">
                      <Lock className="h-3 w-3" aria-hidden /> Plan
                    </span>
                  )
                )}
              </>
            )
            const body = (
              <>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${palette.soft} ${palette.text}`}>
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold leading-snug ${href ? 'transition-colors group-hover/lesson:text-primary' : ''}`}>{lesson.title}</span>
                  <span className="mt-1.5 flex items-center gap-2.5 text-xs text-muted-foreground sm:hidden">{meta}</span>
                </span>
                <span className="hidden shrink-0 items-center gap-2.5 text-xs text-muted-foreground sm:flex">{meta}</span>
                {href && <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover/lesson:translate-x-1" aria-hidden />}
              </>
            )
            const outline = outlines[lesson.slug]
            return (
              <li key={lesson.id}>
                {href ? (
                  <a href={href} className="group/lesson flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5">{body}</a>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-4 sm:px-5">{body}</div>
                )}
                {outline && (
                  <LessonOutlineList
                    outline={outline}
                    className="-mt-1.5 pb-4 pl-[3.75rem] pr-4 sm:pl-16 sm:pr-5"
                    link={href ? (n, b) => <a href={`${href}#${sectionId(n)}`} className={outlineLinkClass}>{b}</a> : undefined}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <WaecPastPapers subjectSlug={subject.slug} subjectName={subject.name} />

      <StartCta
        heading={`Learn ${topic.name.toLowerCase()} step by step`}
        body={`Unlock ${count === 1 ? 'this lesson' : count === 2 ? 'both lessons' : `all ${count} lessons`} on ${topic.name.toLowerCase()}, plus every other WASSCE ${subject.name} topic${hasPractice(subject.slug) ? ', exam-style practice marked instantly' : ''} and guided learning tools.`}
        appHref={`/topic/${topic.id}`}
      />

      {more.length > 0 && (
        <section className="space-y-5" aria-labelledby="more">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 id="more" className="site-h2 text-[1.375rem] sm:text-[1.625rem]">More in {group.name}</h2>
            <a href={subjectPath(subject.slug)} className="site-link shrink-0">
              All {subject.name} topics <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
            {more.map(({ topic: t, number }) => (
              <li key={t.id}>
                <TopicCard subjectSlug={subject.slug} topic={t} number={number} palette={palette} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" aria-label="Topic navigation">
        {previous ? (
          <a href={topicPath(subject.slug, previous.slug)} className="site-card site-card-link group flex min-w-0 items-center gap-3 p-4">
            <ArrowLeft className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted-foreground">Previous topic</span>
              <span className="block truncate text-[15px] font-bold">{previous.name}</span>
            </span>
          </a>
        ) : <span className="hidden sm:block" />}
        {next ? (
          <a href={topicPath(subject.slug, next.slug)} className="site-card site-card-link group flex min-w-0 items-center justify-end gap-3 p-4 text-right">
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted-foreground">Next topic</span>
              <span className="block truncate text-[15px] font-bold">{next.name}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </a>
        ) : <span />}
      </nav>
    </article>
  )
}
