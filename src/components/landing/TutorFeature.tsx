// Book a tutor: the human-tutor service, introduced with its photograph.
import { ArrowRight, Check, UserRound } from 'lucide-react'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { Band, Mark } from '@/components/public/Section'
import { BrandPhoto } from '@/components/public/BrandPhoto'

const POINTS = ['Help with the topics you find hard', 'In-person lessons, verified tutors', 'Message them on WhatsApp']

export function TutorFeature() {
  return (
    <Band tone="white" labelledBy="tutor-heading">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div data-reveal className="px-3 pt-3 sm:px-5 sm:pt-5">
          <BrandPhoto
            src={TUTOR_PHOTO.small}
            srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
            sizes="(min-width: 768px) 50vw, 100vw"
            width={640}
            height={427}
            alt="A tutor and a student going through notes together"
            slab="left"
          >
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-slate-900 shadow-lg">
              <UserRound className="h-4 w-4 text-violet-700" aria-hidden /> Learn with real teachers
            </span>
          </BrandPhoto>
        </div>
        <div data-reveal="1" className="max-w-xl">
          <p className="site-eyebrow">Book a tutor</p>
          <h2 id="tutor-heading" className="site-h2 mt-3">Need a <Mark>real tutor?</Mark></h2>
          <p className="site-lede mt-4">Verified WASSCE tutors near you, with the fee shown up front.</p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] font-medium">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <a href="/tutors" className="site-btn site-btn-primary mt-8">
            Book a tutor <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </Band>
  )
}
