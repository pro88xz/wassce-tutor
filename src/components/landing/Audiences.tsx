// Who it's for: one photographed card per audience, each with its own next step.
import { ArrowRight } from 'lucide-react'
import { Band, SectionHeading } from '@/components/public/Section'

const AUDIENCES = [
  { img: 'persona-sss3', tag: 'SSS students', title: 'I am in SSS1 to SSS3', body: 'Follow your faculty’s subjects topic by topic and track your progress to exam day.', cta: 'Start free', href: '/auth', alt: 'Secondary school students working in class' },
  { img: 'persona-private', tag: 'Private candidates', title: 'I am a private candidate', body: 'Revise at your own pace with syllabus lessons and exam-style practice.', cta: 'Start free', href: '/auth', alt: 'A young man studying alone at a desk' },
  { img: 'persona-teacher', tag: 'Parents and teachers', title: 'I am a parent or teacher', body: 'See exactly what every WASSCE subject covers before your student signs up.', cta: 'Browse subjects', href: '/wassce/subjects', alt: 'A teacher leading a lesson at the whiteboard' },
]

export function Audiences() {
  return (
    <Band labelledBy="who-heading">
      <SectionHeading
        id="who-heading"
        eyebrow="Who it is for"
        title="Made for everyone preparing for WASSCE."
        lede="Start where you are. Your subjects and first lesson are set up in about a minute."
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {AUDIENCES.map(({ img, tag, title, body, cta, href, alt }, i) => (
          <li key={title} data-reveal={i}>
            <a href={href} className="site-card site-card-link group flex h-full flex-col overflow-hidden">
              <span className="relative block aspect-[16/10] overflow-hidden bg-muted md:aspect-[4/3]">
                <img
                  src={`/img/home/${img}-480.webp`}
                  srcSet={`/img/home/${img}-480.webp 480w, /img/home/${img}.webp 960w`}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  width={480}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold leading-none text-slate-900 shadow-sm">{tag}</span>
              </span>
              <span className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="site-h3 text-xl">{title}</span>
                <span className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{body}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold text-primary">
                  {cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Band>
  )
}
