// The course catalogue on the homepage: the shared faculty-tabbed grid of
// subject photos (src/components/public/SubjectCatalogue). Topic search is in
// the hero. The lede says
// how many subjects have lessons today, so the page and the cards agree.
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
        eyebrow="Subjects"
        title={<>Find your subject. <span className="site-accent text-[var(--primary)]">Start your topic.</span></>}
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
    </Band>
  )
}
