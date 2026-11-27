import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, GraduationCap, MapPin } from 'lucide-react'
import { UNIVERSITY_GUIDES } from '@/content/editorial'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { BeamPadSponsoredBanner } from '@/components/landing/BeamPadSponsoredBanner'
import { EditorialPhoto } from '@/components/public/EditorialPhoto'
import { editorialImage } from '@/lib/editorial-images'
import { absoluteUrl, breadcrumbJsonLd, indexablePageTags } from '@/lib/seo'

export const Route = createFileRoute('/universities/')({
  ssr: true,
  head: () => indexablePageTags({
    path: '/universities',
    title: 'Sierra Leone Universities: Courses & WASSCE Requirements',
    description: 'Compare universities in Sierra Leone, explore programmes and WASSCE entry requirements, and follow official admissions links for each institution.',
    image: editorialImage(UNIVERSITY_GUIDES[0].image).og,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Universities in Sierra Leone', url: absoluteUrl('/universities'), mainEntity: { '@type': 'ItemList', itemListElement: UNIVERSITY_GUIDES.map((u,i) => ({ '@type': 'ListItem', position: i+1, item: { '@type': 'CollegeOrUniversity', name: u.name, url: absoluteUrl(`/universities/${u.slug}`) } })) } },
      breadcrumbJsonLd([['Home','/'],['Universities','/universities']])
    ]
  }),
  component: UniversityDirectoryPage,
})

function UniversityDirectoryPage() {
  return (
    <div className="site-page space-y-10 pb-16 sm:space-y-14">
      <Breadcrumbs trail={[['Home','/'],['Universities','/universities']]}/>
      <header className="relative overflow-hidden rounded-[2rem] bg-[#171d3d] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"/>
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200">Sierra Leone · Higher education directory</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Find the university path that fits your next step.</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">Compare programme areas, WASSCE entry requirements and official application links for universities and higher-education institutions in Sierra Leone.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href="#directory" className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 text-sm font-bold text-[#171d3d]">Explore institutions</a><a href="/blog/sierra-leone-university-admission-requirements-2026-2027" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 px-5 text-sm font-semibold text-white">2026/2027 admissions guide</a></div>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5"><GraduationCap className="h-5 w-5 text-primary"/><p className="mt-3 text-2xl font-bold">{UNIVERSITY_GUIDES.length}</p><p className="mt-1 text-sm text-muted-foreground">Institution profiles researched</p></div>
        <div className="rounded-2xl border bg-card p-5"><MapPin className="h-5 w-5 text-primary"/><p className="mt-3 text-2xl font-bold">Nationwide</p><p className="mt-1 text-sm text-muted-foreground">Freetown, Makeni, Njala, Bo and Eastern Province locations</p></div>
        <div className="rounded-2xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">Source standard</p><p className="mt-3 text-lg font-bold">Official first</p><p className="mt-1 text-sm text-muted-foreground">Requirements and application links are linked to institutional sources.</p></div>
      </section>
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b px-5 py-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">Quick comparison</p><h2 className="mt-1 text-lg font-bold">Published WASSCE degree-entry starting points</h2><p className="mt-1 text-xs text-muted-foreground">A summary only. Programme-specific requirements and current deadlines can differ.</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-bold">Institution</th><th className="px-5 py-3 font-bold">Entry snapshot</th><th className="px-5 py-3 font-bold">Admissions status</th><th className="px-5 py-3 font-bold">Guide</th></tr></thead><tbody>{UNIVERSITY_GUIDES.map((u)=><tr key={u.slug} className="border-t align-top"><td className="px-5 py-4 font-semibold">{u.shortName}</td><td className="max-w-sm px-5 py-4 leading-relaxed text-muted-foreground">{u.entrySummary}</td><td className="px-5 py-4 text-xs leading-relaxed text-muted-foreground">{u.status}</td><td className="px-5 py-4"><a href={`/universities/${u.slug}`} className="font-semibold text-primary underline underline-offset-4">{u.shortName} guide</a></td></tr>)}</tbody></table></div>
      </section>
      <BeamPadSponsoredBanner />
      <section id="directory" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Institution directory</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Universities and higher education</h2></div><p className="max-w-md text-sm leading-relaxed text-muted-foreground">Each profile identifies what is confirmed, what is programme-specific and what still needs confirmation from the institution.</p></div>
        <div className="grid gap-5 md:grid-cols-2">
          {UNIVERSITY_GUIDES.map((u) => <article key={u.slug} className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
            <a href={`/universities/${u.slug}`} className="block">
              <div className="relative"><EditorialPhoto image={u.image} alt={u.imageAlt} label={u.shortName} sizes="(min-width: 768px) 560px, 100vw" className="aspect-[16/8]" imgClassName="transition duration-500 group-hover:scale-[1.025]"/><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">{u.shortName}</span></div>
              <div className="space-y-3 p-5 sm:p-6"><p className="text-xs font-semibold text-primary">{u.status}</p><h3 className="text-xl font-bold leading-snug">{u.name}</h3><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5"/>{u.location}</p><p className="text-sm leading-relaxed text-muted-foreground">{u.summary}</p><span className="inline-flex items-center gap-2 pt-1 text-sm font-bold text-primary">View requirements and courses <ArrowRight className="h-4 w-4"/></span></div>
            </a>
          </article>)}
        </div>
      </section>
      <section className="rounded-3xl border bg-[#f7f5ff] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Important before applying</p><h2 className="mt-2 text-2xl font-bold text-slate-950">The university-wide minimum is only the starting point.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">A programme may require particular WASSCE subjects, stronger grades, professional qualifications or an interview. Deadlines and fees can change. Open the official admissions source linked in each profile and confirm the current cycle before making a payment.</p><a href="/blog/sierra-leone-university-admission-requirements-2026-2027" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-800">Read the 2026/2027 comparison <ArrowRight className="h-4 w-4"/></a></section>
    </div>
  )
}
