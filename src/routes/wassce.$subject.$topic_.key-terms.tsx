// /wassce/{subject}/{topic}/key-terms: the terms a topic's lessons define, as
// cards to revise from (term first; tap for the lesson's own definition and a
// link to where it is taught). Part of the topic: lessons, key terms, then
// practice questions. Every card is in the HTML; the page is marked up as
// flashcards. Prerendered at build time.
import { useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, ListChecks } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { KeyTermCard } from '@/components/public/KeyTermCard'
import { StartCta } from '@/components/public/StartCta'
import { coverColours } from '@/components/public/cover-colours'
import { plainText } from '@/components/public/QuestionCard'
import { fetchKeyTermsPage, keyTermsPath, lessonPath, questionsPath, subjectPath, topicPath } from '@/lib/public-content'
import type { KeyTermsPageData } from '@/lib/public-content'
import { sectionId } from '@/lib/lesson-outlines'
import { brandedTitle, breadcrumbJsonLd, fitDescription, flashcardsJsonLd, indexablePageTags, privatePageTags } from '@/lib/seo'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'

const trail = ({ subject, topic }: KeyTermsPageData): [string, string][] => [
  ['Home', '/'],
  ['WASSCE', '/wassce'],
  [subject.name, subjectPath(subject.slug)],
  [topic.name, topicPath(subject.slug, topic.slug)],
  ['Key terms', keyTermsPath(subject.slug, topic.slug)],
]

function describe({ subject, topic, terms }: KeyTermsPageData): string {
  const names = terms.slice(0, 4).map((t) => t.term)
  return fitDescription([
    `${terms.length} WASSCE ${subject.name} key terms on ${topic.name.toLowerCase()}, with their definitions: ${names.join(', ')}${terms.length > names.length ? ' and more' : ''}.`,
    'Free revision cards from the lessons.',
  ])
}

export const Route = createFileRoute('/wassce/$subject/$topic_/key-terms')({
  ssr: true, // prerendered to static HTML at build time
  loader: async ({ params }) => {
    const data = await fetchKeyTermsPage(params.subject, params.topic)
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData: data }) => {
    if (!data) return privatePageTags('Page not found')
    const path = keyTermsPath(data.subject.slug, data.topic.slug)
    const name = `${data.topic.name}: WASSCE ${data.subject.name} key terms`
    return indexablePageTags({
      path,
      title: brandedTitle(`WASSCE ${data.subject.name}: ${data.topic.name} Key Terms and Definitions`),
      ogTitle: name,
      description: describe(data),
      jsonLd: [
        flashcardsJsonLd({
          name,
          path,
          about: data.topic.name,
          subject: `WASSCE ${data.subject.name}`,
          cards: data.terms.map((t) => ({ front: t.term, back: plainText(t.definition) })),
        }),
        breadcrumbJsonLd(trail(data)),
      ],
    })
  },
  component: KeyTermsPage,
})

function KeyTermsPage() {
  const data = Route.useLoaderData()
  const { subject, topic, terms, questionCount, previousTerms, nextTerms, coverIndex } = data
  const { palette } = subjectTheme(subject.slug)
  const colours = coverColours(subject.slug, coverIndex[topic.id] ?? 0)
  const [allOpen, setAllOpen] = useState(false)
  const lessonNumber = new Map(topic.lessons.map((l, i) => [l.slug, i + 1]))
  const href = (t: (typeof terms)[number]) => `${lessonPath(subject.slug, topic.slug, t.lessonSlug)}${t.section ? `#${sectionId(t.section)}` : ''}`
  const lessons = new Set(terms.map((t) => t.lessonSlug)).size

  return (
    <article className="app-page site-page mx-auto w-full max-w-4xl space-y-8 pb-12">
      <header className="space-y-4 pt-2">
        <Breadcrumbs trail={trail(data)} />
        <p className={`flex items-center gap-2 text-sm font-semibold ${palette.text}`}>
          <SubjectIcon slug={subject.slug} size="sm" /> WASSCE {subject.name} · {topic.name}
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">{topic.name}: key terms</h1>
        <p className="max-w-3xl text-[17px] leading-relaxed text-muted-foreground">
          The {terms.length} terms {lessons === 1 ? 'the lesson defines' : `the ${lessons} lessons define`}, in the lessons&rsquo; own words. Read a term, say what it means,
          then open the card to check. WASSCE theory questions often begin &ldquo;Define&hellip;&rdquo;.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setAllOpen((v) => !v)} className="site-btn site-btn-primary" aria-pressed={allOpen}>
            {allOpen ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />} {allOpen ? 'Hide the definitions' : 'Show every definition'}
          </button>
          {questionCount > 0 && (
            <a href={questionsPath(subject.slug, topic.slug)} className="site-btn site-btn-secondary">
              <ListChecks className="h-4 w-4" aria-hidden /> Practise {questionCount} questions
            </a>
          )}
          <a href={topicPath(subject.slug, topic.slug)} className="site-btn site-btn-secondary">
            <BookOpen className="h-4 w-4" aria-hidden /> The lessons
          </a>
        </div>
      </header>

      <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {terms.map((t) => (
          <li key={`${t.id}-${allOpen}`}>
            <KeyTermCard term={t} lessonNumber={lessonNumber.get(t.lessonSlug) ?? 1} lessonHref={href(t)} colours={colours} open={allOpen} />
          </li>
        ))}
      </ol>

      {(previousTerms || nextTerms) && (
        <nav aria-label={`More ${subject.name} key terms`} className="grid gap-3 sm:grid-cols-2">
          {previousTerms ? (
            <a href={keyTermsPath(subject.slug, previousTerms.slug)} className="group rounded-xl border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40">
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous topic</span>
              <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">{previousTerms.name} key terms</span>
            </a>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextTerms && (
            <a href={keyTermsPath(subject.slug, nextTerms.slug)} className="group rounded-xl border p-4 text-right transition-colors hover:border-primary/50 hover:bg-muted/40">
              <span className="flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground">Next topic <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
              <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">{nextTerms.name} key terms</span>
            </a>
          )}
        </nav>
      )}

      <StartCta
        heading="Revise them with your progress saved"
        body={`In the app you mark each term "I know this" or "Not yet", and revision starts with the ones you do not know yet. Free, like every lesson and practice question.`}
        appHref={`/topic/${topic.id}/terms`}
      />
    </article>
  )
}
