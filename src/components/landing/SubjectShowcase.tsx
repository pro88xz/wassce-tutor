// The course catalogue on the homepage: the shared faculty-tabbed grid
// (src/components/public/SubjectCatalogue), under the section heading. The
// lede says how many subjects have lessons today, so the count on the page
// and the cards below it agree.
import { ArrowRight } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { Band, SectionHeading } from '@/components/public/Section'
import { SubjectCatalogue } from '@/components/public/SubjectCatalogue'

export function SubjectShowcase({ subjects }: { subjects: SubjectSummary[] }) {
  const listed = subjects.filter((s) => s.topicCount > 0)
  const withLessons = listed.filter((s) => s.lessonCount > 0).length
  return (
    <Band labelledBy="subjects-heading">
      <SectionHeading
        id="subjects-heading"
        eyebrow="Course catalogue"
        title="Every WASSCE subject, organised topic by topic."
        lede={
          <>
            Choose your faculty to see the subjects you sit. {withLessons} of {listed.length} subjects have lessons today; the rest show their full
            syllabus outline while their lessons are written.
          </>
        }
        action={
          <a href="/wassce/subjects" className="site-link">
            Browse the full syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <div className="mt-8">
        <SubjectCatalogue subjects={subjects} />
      </div>
    </Band>
  )
}
