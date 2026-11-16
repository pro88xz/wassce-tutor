// The course catalogue on the homepage: topic search, then the shared
// faculty-tabbed grid (src/components/public/SubjectCatalogue). The lede says
// how many subjects have lessons today, so the page and the cards agree.
import { ArrowRight } from 'lucide-react'
import type { PopularTopic, SubjectSummary } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { TopicSearch, type TopicShortcut } from '@/components/landing/TopicSearch'
import { Band, SectionHeading } from '@/components/public/Section'
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
    <Band labelledBy="subjects-heading">
      <SectionHeading
        id="subjects-heading"
        eyebrow="Subjects"
        title="Find your subject. Start your topic."
        lede={`${withLessons} of ${listed.length} subjects have full lessons; the rest show their syllabus.`}
        action={
          <a href="/wassce/subjects" className="site-link">
            Browse the full syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <div data-reveal className="mt-7 max-w-xl">
        <TopicSearch shortcuts={shortcutsFrom(popular)} tone="light" />
      </div>
      <div className="mt-8">
        <SubjectCatalogue subjects={subjects} />
      </div>
    </Band>
  )
}
