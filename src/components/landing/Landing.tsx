// Logged-out homepage. Prerendered at build time (with LandingData from the
// route loader) so search engines and link previews get the full page.
//
// Blueprint. Each section answers one visitor question, in this order, and
// every section is a Band on the shared grid (src/components/public/Section):
//
//   01 Hero            What is this, and what do I do first?   (+ live proof and provenance)
//   02 SubjectShowcase Is my subject here?                     (course catalogue)
//   03 PopularTopics   What does a topic look like?
//   04 TryQuestion     What is practice like?                  (answerable, no account)
//   05 HowItWorks      How will I actually study?              (+ example progress view)
//   06 LocalBand       Was this made for someone like me?
//   07 Audiences       Where do I start?
//   08 TutorFeature    Can I get a person to help?
//   09 GradeGuide      How is the exam graded?
//   10 AfterWassce     What comes after the exam?
//   11 Plans           What does it cost?
//   12 Faq             What else should I know?
//   13 FinalCta        Start.
//
// The first three are what a phone visitor must reach quickly: the hero and
// its proof row end in about one screen so the catalogue follows at once.
//
// Numbers come from the database and the question-set manifest, and the
// sample questions are from the practice bank. The one exception is the
// progress example in HowItWorks, which uses sample figures and is labelled
// as an example.
import { useRef } from 'react'
import type { LandingData } from '@/lib/public-content'
import { useReveal } from '@/components/ds/useReveal'
import { Hero } from '@/components/landing/Hero'
import { SubjectShowcase } from '@/components/landing/SubjectShowcase'
import { PopularTopics } from '@/components/landing/PopularTopics'
import { TryQuestion } from '@/components/landing/TryQuestion'
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
      <TryQuestion />
      <HowItWorks topic={data.popular[0]} />
      <LocalBand />
      <Audiences />
      <TutorFeature />
      <GradeGuide />
      <AfterWassce />
      <Plans />
      <Faq subjects={data.subjects} />
      <FinalCta />
    </div>
  )
}
