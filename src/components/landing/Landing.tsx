// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
//
// Blueprint. Each section answers one visitor question, in this order, and
// every section is a Band on the shared grid (src/components/public/Section):
//
//   01 Hero            What is this, and what do I do first?   (+ live proof row)
//   02 SubjectShowcase Is my subject here?                     (course catalogue)
//   03 PopularTopics   What does a topic look like?
//   04 HowItWorks      How will I actually study?
//   05 LocalBand       Was this made for someone like me?
//   06 Audiences       Where do I start?
//   07 TutorFeature    Can I get a person to help?
//   08 GradeGuide      How is the exam graded?
//   09 AfterWassce     What comes after the exam?
//   10 Plans           What does it cost?
//   11 Faq             What else should I know?
//   12 FinalCta        Start.
//
// Numbers come from the database and the question-set manifest; nothing on
// the page is a mock-up or an invented statistic.
import { useRef } from 'react'
import type { LandingData } from '@/lib/public-content'
import { useReveal } from '@/components/ds/useReveal'
import { Hero } from '@/components/landing/Hero'
import { SubjectShowcase } from '@/components/landing/SubjectShowcase'
import { PopularTopics } from '@/components/landing/PopularTopics'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { LocalBand } from '@/components/landing/LocalBand'
import { Audiences } from '@/components/landing/Audiences'
import { TutorFeature } from '@/components/landing/TutorFeature'
import { GradeGuide } from '@/components/landing/GradeGuide'
import { AfterWassce } from '@/components/landing/AfterWassce'
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
      <SubjectShowcase subjects={data.subjects} />
      <PopularTopics data={data} />
      <HowItWorks />
      <LocalBand />
      <Audiences />
      <TutorFeature />
      <GradeGuide />
      <AfterWassce />
      <Plans />
      <Faq />
      <FinalCta />
    </div>
  )
}
