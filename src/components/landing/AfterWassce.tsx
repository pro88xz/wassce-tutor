// Beyond the exam: the university directory and the featured admissions guide.
import { ArrowRight } from 'lucide-react'
import { FEATURED_EDITORIAL, UNIVERSITY_FEATURES } from '@/content/editorial-index'
import { EditorialPhoto } from '@/components/public/EditorialPhoto'
import { Band, SectionHeading } from '@/components/public/Section'

export function AfterWassce() {
  return (
    <Band tone="white" labelledBy="next-step-heading">
      <SectionHeading
        id="next-step-heading"
        eyebrow="Beyond the exam"
        title="Plan what comes after WASSCE."
        lede="Explore Sierra Leone’s universities, compare entry requirements and read practical guidance before you apply."
        action={
          <a href="/universities" className="site-link">
            University directory <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {UNIVERSITY_FEATURES.map((u, i) => (
          <li key={u.slug} data-reveal={i}>
            <a href={`/universities/${u.slug}`} className="site-card site-card-link group flex h-full flex-col overflow-hidden">
              <EditorialPhoto
                image={u.image}
                alt={u.imageAlt}
                label={u.shortName}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[16/9]"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-bold uppercase tracking-[.12em] text-primary">{u.shortName}</span>
                <span className="site-h3 mt-1.5">{u.name}</span>
                <span className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{u.summary}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  View guide <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-6 grid gap-5 rounded-2xl border bg-brand-soft/60 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10 sm:p-8">
        <div>
          <p className="site-eyebrow">From the editorial desk</p>
          <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight sm:text-2xl">{FEATURED_EDITORIAL.title}</h3>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{FEATURED_EDITORIAL.description}</p>
        </div>
        <a href={`/blog/${FEATURED_EDITORIAL.slug}`} className="site-btn site-btn-primary">
          Read the guide <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </Band>
  )
}
