import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ExternalLink, GraduationCap, MapPin } from 'lucide-react'
import { UNIVERSITY_GUIDES } from '@/content/editorial'
import type { UniversityGuide } from '@/content/editorial'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { absoluteUrl, breadcrumbJsonLd, indexablePageTags, privatePageTags, SITE } from '@/lib/seo'

export const Route = createFileRoute('/universities/$slug')({
  ssr: true,
  loader: ({ params }): UniversityGuide => {
    const guide = UNIVERSITY_GUIDES.find((item) => item.slug === params.slug)
    if (!guide) throw notFound()
    return guide
  },
  staleTime: Infinity,
  head: ({ loaderData }) => loaderData ? indexablePageTags({
    path: `/universities/${loaderData.slug}`,
    title: `${loaderData.name}: Admissions, Courses & WASSCE Requirements | WASSCE Tutor`,
    description: `${loaderData.name} in Sierra Leone: programmes, WASSCE entry requirements, application process and official admissions links. Updated 8 November 2026.`,
    image: loaderData.image,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollegeOrUniversity',
        '@id': absoluteUrl(`/universities/${loaderData.slug}#institution`),
        name: loaderData.name,
        alternateName: loaderData.shortName,
        url: loaderData.officialUrl,
        image: loaderData.image,
        description: loaderData.summary,
        location: { '@type': 'Place', name: loaderData.location },
        areaServed: { '@type': 'Country', name: 'Sierra Leone' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `${loaderData.name} — admissions and programme guide`,
        url: absoluteUrl(`/universities/${loaderData.slug}`),
        mainEntity: { '@id': absoluteUrl(`/universities/${loaderData.slug}#institution`) },
        publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
      },
      breadcrumbJsonLd([['Home','/'],['Universities','/universities'],[loaderData.name,`/universities/${loaderData.slug}`]])
    ]
  }) : privatePageTags('University not found'),
  component: UniversityProfilePage,
})

function UniversityProfilePage() {
  const guide = Route.useLoaderData()
  const related = UNIVERSITY_GUIDES.filter((u) => u.slug !== guide.slug).slice(0,3)
  return (
    <main className="mx-auto w-full max-w-5xl space-y-9 pb-16">
      <Breadcrumbs trail={[['Home','/'],['Universities','/universities'],[guide.name,`/universities/${guide.slug}`]]}/>
      <header className="space-y-5">
        <a href="/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4"/> All institutions</a>
        <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Sierra Leone university guide · {guide.shortName}</p><h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{guide.name}</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{guide.summary}</p><p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4"/>{guide.location}</p></div>
        <figure className="overflow-hidden rounded-3xl border bg-muted"><img src={guide.image} alt={guide.imageAlt} className="max-h-[480px] w-full object-cover" fetchPriority="high"/><figcaption className="bg-card px-4 py-3 text-xs text-muted-foreground">Image: {guide.imageCredit}. <a href={guide.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">Institution website</a>. Image rights remain with the original publisher.</figcaption></figure>
      </header>
      <section className="rounded-2xl border bg-card p-5 sm:p-7"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-900">{guide.status}</span><span className="text-xs text-muted-foreground">Source review: 8 November 2026</span></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{guide.statusNote}</p></section>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-9">
          <section><p className="text-xs font-bold uppercase tracking-wider text-primary">01 / Entry requirements</p><h2 className="mt-2 text-2xl font-bold">WASSCE and other entry routes</h2><ul className="mt-5 space-y-4">{guide.requirements.map((r,i)=><li key={i} className="flex gap-3 text-[15px] leading-7 text-muted-foreground"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"/><span>{r}</span></li>)}</ul></section>
          <section><p className="text-xs font-bold uppercase tracking-wider text-primary">02 / Courses and programmes</p><h2 className="mt-2 text-2xl font-bold">What can you study?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{guide.programmes.map((p,i)=><div key={i} className="rounded-xl border bg-card p-4 text-sm leading-relaxed text-muted-foreground"><span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-800">0{i+1}</span>{p}</div>)}</div></section>
          <section><p className="text-xs font-bold uppercase tracking-wider text-primary">03 / How to apply</p><h2 className="mt-2 text-2xl font-bold">Application process</h2><ol className="mt-5 space-y-4">{guide.application.map((p,i)=><li key={i} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#21134d] text-xs font-bold text-white">{i+1}</span><p className="pt-1 text-sm leading-relaxed text-muted-foreground">{p}</p></li>)}</ol></section>
          <section className="rounded-2xl border bg-slate-50 p-5 sm:p-7"><h2 className="text-xl font-bold">Application fee and deadline</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Application fee</p><p className="mt-2 text-sm leading-relaxed">{guide.fees??'Not confirmed in the official source retrieved. Check the admissions portal.'}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deadline</p><p className="mt-2 text-sm leading-relaxed">{guide.deadline??'Not confirmed in the official source retrieved. Check the admissions portal.'}</p></div></div></section>
          <section><h2 className="text-xl font-bold">Official sources</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use these institutional sources to confirm current programme availability, fees, deadlines and admission decisions.</p><ul className="mt-4 space-y-3">{guide.sources.map((s,i)=><li key={s.url} className="flex gap-3 text-sm"><span className="text-xs font-bold text-muted-foreground">{String(i+1).padStart(2,'0')}</span><a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline decoration-primary/30 underline-offset-4">{s.label} <ExternalLink className="inline h-3 w-3"/></a></li>)}</ul><p className="mt-5 text-xs leading-relaxed text-muted-foreground">WASSCE Tutor is an independent student information resource, not an admissions office or an agent of this institution. Information was checked on 8 November 2026. Image copyright belongs to the institution or original publisher.</p></section>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5"><GraduationCap className="h-6 w-6 text-primary"/><h2 className="mt-3 font-bold">Official university links</h2><a href={guide.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-10 items-center justify-between gap-2 text-sm font-semibold text-primary">Institution website <ExternalLink className="h-4 w-4"/></a><a href={guide.admissionsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center justify-between gap-2 text-sm font-semibold text-primary">Entry requirements <ExternalLink className="h-4 w-4"/></a>{guide.applicationUrl&&<a href={guide.applicationUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white">Open application portal <ArrowRight className="ml-2 h-4 w-4"/></a>}</div>
          <div className="rounded-2xl bg-[#21134d] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-violet-200">Prepare for your next step</p><h3 className="mt-2 text-lg font-bold">Strengthen the WASSCE subjects your course requires.</h3><a href="/wassce/subjects" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Browse subjects <ArrowRight className="h-4 w-4"/></a></div>
        </aside>
      </div>
      <section className="space-y-4"><h2 className="text-2xl font-bold">Compare other institutions</h2><div className="grid gap-3 sm:grid-cols-3">{related.map((u)=><a key={u.slug} href={`/universities/${u.slug}`} className="rounded-xl border bg-card p-4 transition hover:shadow-md"><p className="text-xs font-bold text-primary">{u.shortName}</p><h3 className="mt-2 font-bold leading-snug">{u.name}</h3><p className="mt-2 text-xs text-muted-foreground">{u.location}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">Compare <ArrowRight className="h-4 w-4"/></span></a>)}</div></section>
    </main>
  )
}
