// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
//
// Blueprint. Each section answers one visitor question, in this order, and
// every section is a Band on the shared grid (src/components/public/Section):
//
//   01 Hero            What is this, and what do I do first?   (search first, + a dark strip of live counts and provenance)
//   02 CourseRows      What can I study?                       (topics as course cards, a tab per subject)
//   03 TryQuestion     Why this, not a past-paper app?         (answerable, no account: every answer explained)
//   04 SubjectShowcase Is my subject here?                     (every subject, by faculty)
//   05 HowItWorks      How will I actually study?              (+ a real excerpt from a free lesson)
//   06 MockExams       Can I rehearse the real paper?          (on a dark band, for contrast mid-page)
//   07 LocalBand       Was this made for someone like me?      (+ who builds it)
//   08 TutorFeature    Can I get a person to help?
//   09 Reviews         What do other students think?           (real Google reviews, or an invitation to write one)
//   10 Plans           What does it cost?
//   11 Faq             What else should I know?
//   12 FinalCta        Start.
//
// Like a course marketplace, the page leads with the courses themselves:
// search in the hero, then real topics as course cards, then proof. The grading guide and university
// planning live on /wassce and /universities, linked from the header.
//
// Numbers come from the database and the question-set manifest, the sample
// questions are from the practice bank, and the lesson excerpt is from a free
// lesson. Nothing on the page is invented.
import { useRef } from 'react'
import type { LandingData } from '@/lib/public-content'
import { useReveal } from '@/components/ds/useReveal'
import { Hero } from '@/components/landing/Hero'
import { SubjectShowcase } from '@/components/landing/SubjectShowcase'
import { CourseRows } from '@/components/landing/CourseRows'
import { TryQuestion } from '@/components/landing/TryQuestion'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { MockExams } from '@/components/landing/MockExams'
import { LocalBand } from '@/components/landing/LocalBand'
import { TutorFeature } from '@/components/landing/TutorFeature'
import { Reviews } from '@/components/landing/Reviews'
import { Plans } from '@/components/landing/Plans'
import { Faq } from '@/components/landing/Faq'
import { FinalCta } from '@/components/landing/FinalCta'

export function Landing({ data }: { data: LandingData }) {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    // Full-bleed: cancels the app wrapper's padding and the header/footer gaps.
    <div ref={root} className="site-bleed -mb-16 -mt-6">
      <Hero data={data} />
      <CourseRows rows={data.courseRows} />
      <TryQuestion />
      <SubjectShowcase subjects={data.subjects} />
      <HowItWorks />
      <MockExams subjects={data.subjects} />
      <LocalBand />
      <TutorFeature />
      <Reviews />
      <Plans />
      <Faq subjects={data.subjects} />
      <FinalCta />
    </div>
  )
}
