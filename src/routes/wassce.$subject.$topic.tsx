import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Check, ClipboardCheck, Clock, Gift, Layers, ListChecks, PencilLine, Shapes, Smartphone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { BeamPadSponsoredBanner } from '@/components/landing/BeamPadSponsoredBanner'
import { CourseCard } from '@/components/public/CourseCard'
import { StartCta } from '@/components/public/StartCta'
import { TopicCover } from '@/components/public/TopicCover'
import { coverColours } from '@/components/public/cover-colours'
import { LessonCard, TopicStep } from '@/components/public/TopicPageParts'
import { subjectArt } from '@/components/ds/subject-art'
import { WaecPastPapers } from '@/components/WaecPastPapers'
import { QuestionMarkdown } from '@/components/QuestionMarkdown'
import { QuestionCard } from '@/components/public/QuestionCard'
import { KeyTermCard } from '@/components/public/KeyTermCard'
import { useAuth } from '@/lib/auth'
import { PRACTICE_QUESTIONS, hasPractice } from '@/lib/practice-counts'
import { fetchKeyTermPreview, fetchTopicExtras, fetchTopicPage, hasTopicPage, keyTermsPath, lessonMinutes, lessonPath, questionsPath, subjectPath, topicPath, topicQuestionCount } from '@/lib/public-content'
import type { TopicPageData, TopicWithLessons } from '@/lib/public-content'
import { SEARCH_COPY, brandedTitle, breadcrumbJsonLd, conceptTitle, fitDescription, indexablePageTags, privatePageTags } from '@/lib/seo'
import { QuickAnswer } from '@/components/public/QuickAnswer'
import { QUICK_ANSWERS } from '@/content/quick-answers'
import { studyTime } from '@/lib/study-time'
import { NOT_TAUGHT, loadOutlines, outlineKey, plural, sectionId, totals } from '@/lib/lesson-outlines'
import type { LessonOutline } from '@/lib/lesson-outlines'

const trail = ({ subject, topic }: TopicPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
]

/** What the topic covers first, then the lessons; whole parts only, within the length Google shows. */
function describe({ subject, topic }: TopicPageData): string {
  const n = topic.lessons.length
  const minutes = lessonMinutes(topic.lessons)
  return fitDescription([
    topic.description ? topic.description.replace(/\.?$/, '.') : `${topic.name} for WASSCE ${subject.name}.`,
    // The title already names the subject, so this line stays short enough to fit.
    `${n} lesson${n === 1 ? '' : 's'}${minutes > 0 ? `, about ${minutes} min` : ''}${n > 0 ? ', all free' : ''}.`,
    'For Sierra Leone students.',
  ])
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
    // Practice questions with answers: the topic's own questions page, when it has one.
    const questionCount = await topicQuestionCount(data.topic.id)
    // What WASSCE asks (the lessons' exam-focus notes) and two questions to try, with answers.
    const extras = await fetchTopicExtras(data.topic)
    // Key terms: the lessons' definitions as cards; the first few here, all on the topic's key terms page.
    const keyTerms = await fetchKeyTermPreview(data.topic)
    return { ...data, outlines, questionCount, ...extras, keyTerms }
  },
  head: ({ loaderData: data }) => {
    if (!data) return privatePageTags('Page not found')
    const path = topicPath(data.subject.slug, data.topic.slug)
    const copy = SEARCH_COPY[path]
    // The topic's name first, then what the page offers (conceptTitle, src/lib/seo.ts).
    const notes = data.topic.lessons.length > 0
    const questions = data.questionCount > 0
    const offers = notes && questions ? [' Notes and Practice Questions', ' Notes and Questions'] : notes ? [' Notes'] : questions ? [' Practice Questions'] : []
    return indexablePageTags({
      path,
      title: brandedTitle(copy?.title ?? conceptTitle(data.topic.name, data.subject.name, offers)),
      ogTitle: `${data.topic.name} (WASSCE ${data.subject.name})`,
      description: copy?.description ?? describe(data),
      jsonLd: [breadcrumbJsonLd(trail(data))],
    })
  },
  component: TopicPage,
})

/** How many other topics from the section are offered at the foot of the page. */
const MORE_TOPICS = 4

/** Most items in "What you'll learn" before it says how many more there are. */
const LEARN_MAX = 8


/** A topic as the course card the homepage shows. */
const asCourse = (t: TopicWithLessons) => ({
  topicSlug: t.slug,
  topicName: t.name,
  minutes: lessonMinutes(t.lessons),
  lessons: t.lessons.length,
  freeLessons: t.lessons.filter((l) => l.is_public).length,
  summary: t.description,
})

// The page reads like a course page on a big learning site: a dark header
// with the topic's real numbers, a summary card that rises into the header
// and stays in view on desktop, "What you'll learn" from the lessons' own
// headings, every lesson as a card with its sections, then the next topics
// as the homepage's course cards. Every number comes from the lessons.
function TopicPage() {
  const data = Route.useLoaderData()
  const { subject, topic, group, previous, next, outlines, coverIndex, questionCount, examFocus, sampleQuestions, keyTerms } = data
  const quick = QUICK_ANSWERS[topicPath(subject.slug, topic.slug)]
  const { user } = useAuth()
  const art = subjectArt(subject.slug)
  const cover = { subjectSlug: subject.slug, subjectName: subject.name, topicSlug: topic.slug, topicName: topic.name, index: coverIndex[topic.id] ?? 0 }
  // The page takes its colour from the topic's cover: the header's glow and the lesson numbers.
  const [tone, toneDeep] = coverColours(subject.slug, cover.index)

  const lessons = topic.lessons
  const count = lessons.length
  const minutes = lessonMinutes(lessons)
  const freeCount = lessons.filter((l) => l.is_public).length
  const allFree = count > 0 && freeCount === count
  const firstLesson = lessons.find((l) => l.is_public)
  const { worked, figures } = totals(lessons.map((l) => outlines[l.slug]))
  const practice = hasPractice(subject.slug) ? (PRACTICE_QUESTIONS[subject.slug] ?? 0) : 0
  const questionsHref = questionCount > 0 ? questionsPath(subject.slug, topic.slug) : null
  const lessonHref = (l: (typeof lessons)[number]) => (l.is_public ? lessonPath(subject.slug, topic.slug, l.slug) : user ? `/lesson/${l.id}` : null)

  // Where the topic sits in its section of the syllabus.
  const at = group.topics.findIndex((t) => t.id === topic.id)
  const more = [...group.topics.slice(at + 1), ...group.topics.slice(0, at)].filter(hasTopicPage).slice(0, MORE_TOPICS)

  // What you'll learn: the lessons' teaching sections, in order; lesson titles when there are no outlines.
  const sections = [...new Set(lessons.flatMap((l) => outlines[l.slug]?.s.map(([, title]) => title) ?? []).filter((t) => !NOT_TAUGHT.test(t)))]
  const learn = sections.length >= 3 ? sections : count >= 2 ? lessons.map((l) => l.title) : []

  const startLabel = firstLesson && lessons.indexOf(firstLesson) === 0 ? 'Start the first lesson' : 'Start learning'
  const primary = firstLesson ? { href: lessonPath(subject.slug, topic.slug, firstLesson.slug), label: startLabel } : null
  // Signed in: open the topic in the app. Signed out: a free account keeps their progress.
  const secondary = user ? { href: `/topic/${topic.id}`, label: 'Open in WASSCE Tutor' } : null

  const facts: { icon: ReactNode; text: string }[] = [
    { icon: <BookOpen className="h-[18px] w-[18px]" />, text: plural(count, 'lesson') },
    ...(minutes > 0 ? [{ icon: <Clock className="h-[18px] w-[18px]" />, text: `${studyTime(minutes)} of study` }] : []),
    ...(worked > 0 ? [{ icon: <PencilLine className="h-[18px] w-[18px]" />, text: plural(worked, 'worked example') }] : []),
    ...(figures > 0 ? [{ icon: <Shapes className="h-[18px] w-[18px]" />, text: plural(figures, 'diagram') }] : []),
    ...(keyTerms.total > 0 ? [{ icon: <Layers className="h-[18px] w-[18px]" />, text: plural(keyTerms.total, 'key term') }] : []),
    ...(questionCount > 0 ? [{ icon: <ListChecks className="h-[18px] w-[18px]" />, text: plural(questionCount, 'practice question') }] : []),
    ...(freeCount > 0 ? [{ icon: <Gift className="h-[18px] w-[18px]" />, text: allFree ? (count === 1 ? 'Free' : 'Every lesson free') : `${freeCount} free` }] : []),
  ]

  const secondaryButton = (className: string) =>
    secondary ? (
      <a href={secondary.href} className={className}>{secondary.label}</a>
    ) : (
      <Link to="/auth" className={className}>Save your progress</Link>
    )

  return (
    // Full width, like the homepage: the header band runs edge to edge under the site header.
    <article className="site-bleed -mt-6">
      <header className="relative isolate overflow-hidden bg-[var(--site-ink)] text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(52rem 32rem at 88% -12%, color-mix(in srgb, ${tone} 75%, transparent), transparent 66%), radial-gradient(38rem 26rem at -4% 112%, rgb(91 52 214 / 38%), transparent 62%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,#000,transparent_85%)]"
        />
        <div className="site-container pb-10 pt-6 sm:pb-14 sm:pt-8 lg:pb-16">
          <Breadcrumbs trail={trail(data)} tone="dark" />
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-7 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <a
                  href={subjectPath(subject.slug)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: art.accent }} aria-hidden />
                  WASSCE {subject.name}
                </a>
                <span className="text-[13px] font-medium text-white/60">
                  {group.name} · Topic {at + 1} of {group.topics.length}
                </span>
              </div>
              <h1 className="mt-4 text-[2.25rem] font-extrabold leading-[1.04] tracking-[-.04em] text-balance sm:text-5xl lg:text-[3.5rem]">{topic.name}</h1>
              {topic.description && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-lg">{topic.description}</p>}

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-[15px] font-semibold text-white/90">
                {facts.map((f) => (
                  <li key={f.text} className="inline-flex items-center gap-2">
                    <span style={{ color: art.accent }} aria-hidden>{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                {primary && (
                  <a href={primary.href} className="site-btn site-btn-lg site-btn-light max-sm:flex-1">
                    {primary.label} <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                )}
                {questionsHref ? (
                  <a href={questionsHref} className={`site-btn site-btn-lg ${primary ? 'site-btn-glass' : 'site-btn-light'} max-sm:flex-1`}>
                    Try {plural(questionCount, 'question')}
                  </a>
                ) : (
                  secondaryButton(`site-btn site-btn-lg ${primary ? 'site-btn-glass' : 'site-btn-light'} max-sm:flex-1`)
                )}
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-white/60">
                {[...(allFree ? ['Free to read, no sign-up'] : []), 'Written to the WASSCE syllabus', 'Works on any phone'].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-300" strokeWidth={3} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phones and tablets: the cover sits at the top of the header. From desktop width it moves into the summary card. */}
            <TopicCover
              {...cover}
              variant="hero"
              className="order-first aspect-[16/9] w-full rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] ring-1 ring-white/10 sm:aspect-[2/1] lg:hidden"
            />
          </div>
        </div>
      </header>

      <div className="site-container grid grid-cols-[minmax(0,1fr)] gap-10 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
        <div className="min-w-0 space-y-10 sm:space-y-12">
          {/* The question this page is searched for, answered first (src/content/quick-answers.ts). */}
          {quick && <QuickAnswer qa={quick} />}
          <BeamPadSponsoredBanner />
          {learn.length > 0 && (
            <section className="site-card p-6 sm:p-8" aria-labelledby="learn">
              <h2 id="learn" className="text-[1.375rem] font-extrabold tracking-[-.02em] sm:text-2xl">What you&rsquo;ll learn</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {learn.slice(0, LEARN_MAX).map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-snug">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-300" aria-hidden>
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              {learn.length > LEARN_MAX && (
                <p className="mt-4 text-sm font-medium text-muted-foreground">and {learn.length - LEARN_MAX} more in the lessons below</p>
              )}
            </section>
          )}

          <section aria-labelledby="lessons">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div>
                <p className="site-eyebrow">Topic content</p>
                <h2 id="lessons" className="mt-2 text-[1.625rem] font-extrabold tracking-[-.03em] sm:text-[2rem]">
                  {count === 1 ? 'The lesson' : `${count} lessons`}, in order
                </h2>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {[minutes > 0 ? `${studyTime(minutes)} in all` : '', worked > 0 ? plural(worked, 'worked example') : '', figures > 0 ? plural(figures, 'diagram') : '']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>

            <ol className="mt-6 space-y-4">
              {lessons.map((lesson, i) => (
                <LessonCard
                  key={lesson.id}
                  number={i + 1}
                  title={lesson.title}
                  minutes={lesson.est_minutes}
                  href={lessonHref(lesson)}
                  outline={outlines[lesson.slug]}
                  colours={[tone, toneDeep]}
                />
              ))}
            </ol>
          </section>
          {keyTerms.total > 0 && (
            <section aria-labelledby="terms">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div>
                  <p className="site-eyebrow">Remember</p>
                  <h2 id="terms" className="mt-2 text-[1.625rem] font-extrabold tracking-[-.03em] sm:text-[2rem]">{plural(keyTerms.total, 'key term')} to know</h2>
                </div>
                <p className="text-sm font-medium text-muted-foreground">From the lessons&rsquo; definitions. Say the meaning, then check.</p>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {keyTerms.terms.map((t) => (
                  <li key={t.id}>
                    <KeyTermCard
                      term={t}
                      lessonNumber={lessons.findIndex((l) => l.slug === t.lessonSlug) + 1}
                      lessonHref={`${lessonPath(subject.slug, topic.slug, t.lessonSlug)}${t.section ? `#${sectionId(t.section)}` : ''}`}
                      colours={[tone, toneDeep]}
                    />
                  </li>
                ))}
              </ul>
              <a href={keyTermsPath(subject.slug, topic.slug)} className="site-btn site-btn-secondary mt-5">
                <Layers className="h-4 w-4" aria-hidden /> {keyTerms.total > keyTerms.terms.length ? `All ${keyTerms.total} key terms` : 'Revise the key terms'} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </section>
          )}

          {examFocus.length > 0 && (
            <section aria-labelledby="exam">
              <p className="site-eyebrow">In the exam</p>
              <h2 id="exam" className="mt-2 text-[1.625rem] font-extrabold tracking-[-.03em] sm:text-[2rem]">What WASSCE asks on {topic.name.toLowerCase()}</h2>
              <div className="mt-6 space-y-4">
                {examFocus.map((f) => {
                  const n = lessons.findIndex((l) => l.slug === f.slug) + 1
                  return (
                    <div key={f.slug} className="site-card p-5 sm:p-6">
                      <QuestionMarkdown content={f.markdown} className="question-md text-[15px] leading-relaxed" />
                      <a href={lessonPath(subject.slug, topic.slug, f.slug)} className="site-link mt-3 text-sm">
                        Lesson {n}: {f.title} <ArrowRight className="h-4 w-4" aria-hidden />
                      </a>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {sampleQuestions.length > 0 && (
            <section aria-labelledby="try">
              <p className="site-eyebrow">Practise this topic</p>
              <h2 id="try" className="mt-2 text-[1.625rem] font-extrabold tracking-[-.03em] sm:text-[2rem]">Try {sampleQuestions.length === 1 ? 'a WASSCE question' : `${sampleQuestions.length} WASSCE questions`}</h2>
              <p className="mt-2 text-[15px] text-muted-foreground">Pick an answer, then open the working to check it.</p>
              <ol className="mt-6 space-y-4">
                {sampleQuestions.map((q, i) => (
                  <QuestionCard key={q.id} q={q} n={i + 1} topic={topic.name} heading="h3" />
                ))}
              </ol>
            </section>
          )}

          {questionsHref && (
            <a href={questionsHref} className="site-card site-card-link group flex items-center gap-4 p-5 sm:gap-5 sm:p-6">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,.45)]"
                style={{ background: `linear-gradient(135deg, ${tone}, ${toneDeep})` }}
                aria-hidden
              >
                <ListChecks className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">{sampleQuestions.length > 0 ? 'Every question on this topic' : 'Practise this topic'}</span>
                <span className="mt-1 block text-lg font-bold leading-snug tracking-tight group-hover:text-[var(--brand-strong)]">
                  {topic.name}: {questionCount} WASSCE questions with answers
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">Objective questions with the full working and why each wrong option is wrong. Free.</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </a>
          )}

          <WaecPastPapers subjectSlug={subject.slug} subjectName={subject.name} />
        </div>

        {/* Desktop: the summary card rises into the header and stays in view while the lessons scroll past. */}
        <aside className="hidden lg:block" aria-label="About this topic">
          <div className="sticky top-24 z-10 -mt-[23rem] overflow-hidden rounded-2xl bg-[var(--card)] shadow-[var(--site-shadow-raised)] ring-1 ring-slate-900/10">
            <TopicCover {...cover} className="aspect-[16/9]" />
            <div className="p-6">
              {allFree && (
                <p className="flex items-baseline gap-2">
                  <span className="text-[1.75rem] font-extrabold tracking-[-.03em]">Free</span>
                  <span className="text-sm font-medium text-muted-foreground">{count === 1 ? 'the whole lesson' : `all ${count} lessons`}</span>
                </p>
              )}
              <div className="mt-4 grid gap-2.5">
                {primary && (
                  <a href={primary.href} className="site-btn site-btn-primary w-full">
                    {primary.label} <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                )}
                {secondaryButton(`site-btn w-full ${primary ? 'site-btn-secondary' : 'site-btn-primary'}`)}
              </div>
              <p className="mt-6 text-sm font-bold">This topic includes</p>
              <ul className="mt-3 space-y-2.5 text-[14px] text-foreground/85">
                {facts
                  .filter((f) => !f.text.startsWith('Every lesson free') && f.text !== 'Free')
                  .map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5">
                      <span className="text-muted-foreground" aria-hidden>{f.icon}</span>
                      {f.text}
                    </li>
                  ))}
                {questionCount === 0 && practice > 0 && (
                  <li className="flex items-center gap-2.5">
                    <span className="text-muted-foreground" aria-hidden><ClipboardCheck className="h-[18px] w-[18px]" /></span>
                    {practice.toLocaleString('en')} {subject.name} practice questions
                  </li>
                )}
                <li className="flex items-center gap-2.5">
                  <span className="text-muted-foreground" aria-hidden><Smartphone className="h-[18px] w-[18px]" /></span>
                  Works on any phone, no download
                </li>
              </ul>
              <a href={subjectPath(subject.slug)} className="site-link mt-4 text-sm">
                All {subject.name} topics <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="site-container mt-12 space-y-12 sm:mt-16 sm:space-y-16">
        <StartCta
          tone="brand"
          heading={count === 0 ? `${topic.name}: lessons on the way` : `Keep going with ${topic.name.toLowerCase()}`}
          body={
            count === 0
              ? `Lessons for ${topic.name.toLowerCase()} are being written. Meanwhile, every published WASSCE ${subject.name} lesson is free${practice > 0 ? ', and so is exam-style practice with the working behind every answer' : ''}.`
              : `${count === 1 ? 'The lesson in this topic is' : `All ${count} lessons in this topic are`} free${practice > 0 ? ', and so is exam-style practice with the working behind every answer' : ''}. A free account saves your progress as you go.`
          }
          appHref={`/topic/${topic.id}`}
        />

        {more.length > 0 && (
          <section aria-labelledby="more">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <p className="site-eyebrow">Up next in {group.name}</p>
                <h2 id="more" className="mt-2 text-[1.625rem] font-extrabold tracking-[-.03em] sm:text-[2rem]">Keep building the section</h2>
              </div>
              <a href={subjectPath(subject.slug)} className="site-link shrink-0">
                All {subject.name} topics <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            {/* A swipeable row on phones, a grid from tablet width, as on the homepage. */}
            <div className="site-rail -mx-[var(--site-gutter)] mt-6 scroll-px-[var(--site-gutter)] px-[var(--site-gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:px-0 lg:grid-cols-4">
              {more.map((t, i) => (
                <CourseCard key={t.id} subjectSlug={subject.slug} subjectName={subject.name} course={asCourse(t)} index={coverIndex[t.id] ?? i + 1} className="w-[74%] sm:w-auto" />
              ))}
            </div>
          </section>
        )}

        <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" aria-label="Topic navigation">
          {previous ? <TopicStep subjectSlug={subject.slug} subjectName={subject.name} topic={previous} index={coverIndex[previous.id] ?? 0} direction="previous" /> : <span className="hidden sm:block" />}
          {next ? <TopicStep subjectSlug={subject.slug} subjectName={subject.name} topic={next} index={coverIndex[next.id] ?? 0} direction="next" /> : <span />}
        </nav>
      </div>
    </article>
  )
}
