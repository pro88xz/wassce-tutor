// The course catalogue on the homepage: the shared faculty-tabbed grid of
// subject photos (src/components/public/SubjectCatalogue), then topic search
// for students who already know what they want. The lede says
// how many subjects have lessons today, so the page and the cards agree.
import { ArrowRight } from 'lucide-react'
import type { PopularTopic, SubjectSummary } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { TopicSearch, type TopicShortcut } from '@/components/landing/TopicSearch'
import { Band, Mark, SectionHeading } from '@/components/public/Section'
import { SubjectCatalogue } from '@/components/public/SubjectCatalogue'

/** Shortcut chips: popular topics that have lessons, short enough to read as a chip. */
function shortcutsFrom(popular: PopularTopic[]): TopicShortcut[] {
  return popular
    .filter((t) => t.lessons > 0 && t.topicName.length <= 22)
    .slice(0, 3)
    .map((t) => ({ label: t.topicName, href: topicPath(t.subjectSlug, t.topicSlug) }))
}

export function SubjectShowcase({ subjects, popular }: { subjects: SubjectSummary[]; popular: PopularTopic[] }) {
  const listed = subjects.filter((s) => s.topicCount > 0)
  const withLessons = listed.filter((s) => s.lessonCount > 0).length
  return (
    <Band tone="white" labelledBy="subjects-heading">
      <SectionHeading
        id="subjects-heading"
        eyebrow="Subjects"
        title={<>Find your subject. <Mark>Start your topic.</Mark></>}
        lede={`${withLessons} of ${listed.length} subjects have full lessons; the rest show their syllabus.`}
        action={
          <a href="/wassce/subjects" className="site-link">
            Browse the full syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <div className="mt-8">
        <SubjectCatalogue subjects={subjects} />
      </div>
      {/* For students who already know the topic they want. */}
      <div data-reveal className="mt-8 rounded-3xl border bg-card p-5 sm:p-6 md:flex md:items-center md:gap-8">
        <p className="shrink-0 text-lg font-bold tracking-tight md:w-56">Know your topic? <span className="text-muted-foreground">Jump straight to it.</span></p>
        <div className="mt-4 min-w-0 flex-1 md:mt-0">
          <TopicSearch shortcuts={shortcutsFrom(popular)} tone="light" />
        </div>
      </div>
    </Band>
  )
}
