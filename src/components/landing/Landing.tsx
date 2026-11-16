// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
//
// Blueprint. Each section answers one visitor question, in this order, and
// every section is a Band on the shared grid (src/components/public/Section):
//
//   01 Hero            What is this, and what do I do first?   (+ live proof and provenance)
//   02 TryQuestion     Why this, not a past-paper app?         (answerable, no account: every answer explained)
//   03 SubjectShowcase Is my subject here?                     (course catalogue)
//   04 PopularTopics   What does a topic look like?
//   05 HowItWorks      How will I actually study?              (+ a real excerpt from a free lesson)
//   06 LocalBand       Was this made for someone like me?      (+ who builds it)
//   07 TutorFeature    Can I get a person to help?
//   08 Plans           What does it cost?
//   09 Faq             What else should I know?
//   10 FinalCta        Start.
//
// Proof comes before the catalogue: a visitor sees what makes practice here
// different within one scroll of the hero. The grading guide and university
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
import { PopularTopics } from '@/components/landing/PopularTopics'
import { TryQuestion } from '@/components/landing/TryQuestion'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { LocalBand } from '@/components/landing/LocalBand'
import { TutorFeature } from '@/components/landing/TutorFeature'
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
      <TryQuestion />
      <SubjectShowcase subjects={data.subjects} />
      <PopularTopics data={data} />
      <HowItWorks />
      <LocalBand />
      <TutorFeature />
      <Plans />
      <Faq subjects={data.subjects} />
      <FinalCta />
    </div>
  )
}
