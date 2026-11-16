import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Clock3 } from 'lucide-react'
import { BLOG_POSTS, UNIVERSITY_GUIDES } from '@/content/editorial'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { EditorialPhoto } from '@/components/public/EditorialPhoto'
import { editorialImage } from '@/lib/editorial-images'
import { absoluteUrl, breadcrumbJsonLd, indexablePageTags, SITE } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  ssr: true,
  head: () => indexablePageTags({
    path: '/blog',
    title: 'WASSCE Tutor Blog: Study & University Guides',
    description: 'Research-backed WASSCE study advice, Sierra Leone university admissions guides, subject planning and practical resources for students and families.',
    image: editorialImage(BLOG_POSTS[0].image).og,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Blog', name: 'WASSCE Tutor Blog', url: absoluteUrl('/blog'), inLanguage: 'en', publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin } },
      { '@context': 'https://schema.org', '@type': 'ItemList', name: 'WASSCE Tutor editorial articles', itemListElement: BLOG_POSTS.map((post,i) => ({ '@type': 'ListItem', position: i+1, url: absoluteUrl(`/blog/${post.slug}`), name: post.title })) },
      breadcrumbJsonLd([['Home','/'],['Blog','/blog']])
    ]
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const featured = BLOG_POSTS[0]
  const remaining = BLOG_POSTS.slice(1)
  return (
    <main className="site-page space-y-10 pb-16 sm:space-y-14">
      <Breadcrumbs trail={[['Home', '/'], ['Blog', '/blog']]} />
      <header className="relative overflow-hidden rounded-[2rem] bg-[#21134d] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-200">WASSCE Tutor · Editorial</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Clear guidance for the next step.</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">Research-backed WASSCE advice, university admission guides and practical study resources for students and families across Sierra Leone.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-white/80"><span className="rounded-full border border-white/20 px-3 py-2">University admissions</span><span className="rounded-full border border-white/20 px-3 py-2">WASSCE results</span><span className="rounded-full border border-white/20 px-3 py-2">Subject planning</span><span className="rounded-full border border-white/20 px-3 py-2">Study guides</span></div>
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1.45fr_.85fr]">
        <a href={`/blog/${featured.slug}`} className="group overflow-hidden rounded-3xl border bg-card">
          <EditorialPhoto image={featured.image} alt={featured.imageAlt} label={featured.category} sizes="(min-width: 1024px) 720px, 100vw" priority className="aspect-[16/8]" imgClassName="transition duration-500 group-hover:scale-[1.025]"/>
          <div className="space-y-3 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">{featured.category} · Featured guide</p><h2 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{featured.title}</h2><p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{featured.description}</p><div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground"><span>{new Date(featured.publishedAt+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5"/>{featured.readMinutes} min read</span><span className="ml-auto inline-flex items-center gap-1 font-semibold text-primary">Read guide <ArrowRight className="h-4 w-4"/></span></div></div>
        </a>
        <aside className="flex flex-col justify-between rounded-3xl border bg-[#f7f5ff] p-6 sm:p-8">
          <div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-800 shadow-sm"><BookOpen className="h-6 w-6"/></span><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-violet-700">University directory</p><h2 className="mt-2 text-2xl font-bold leading-tight text-slate-950">Compare Sierra Leone universities before you apply.</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">Explore programmes, WASSCE entry rules, application links and the official sources behind each guide.</p></div>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="University guides">
            {UNIVERSITY_GUIDES.map((u) => (
              <li key={u.slug}><a href={`/universities/${u.slug}`} className="inline-flex min-h-9 items-center rounded-full border border-violet-200 bg-white px-3.5 text-[13px] font-semibold text-slate-800 transition hover:border-violet-400 hover:text-violet-800">{u.shortName}</a></li>
            ))}
          </ul>
          <a href="/universities" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#21134d] px-5 text-sm font-bold text-white">Explore universities <ArrowRight className="h-4 w-4"/></a>
        </aside>
      </section>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">The latest</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Guides and useful reads</h2></div><span className="text-sm text-muted-foreground">{BLOG_POSTS.length} researched articles</span></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((post) => <a key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
            <EditorialPhoto image={post.image} alt={post.imageAlt} label={post.category} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" imgClassName="transition duration-500 group-hover:scale-[1.03]"/>
            <div className="space-y-3 p-5"><p className="text-[11px] font-bold uppercase tracking-wider text-primary">{post.category}</p><h3 className="text-lg font-bold leading-snug">{post.title}</h3><p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p><div className="flex items-center justify-between pt-1 text-xs text-muted-foreground"><span>{post.readMinutes} min read</span><span className="inline-flex items-center gap-1 font-semibold text-primary">Read article <ArrowRight className="h-3.5 w-3.5"/></span></div></div>
          </a>)}
        </div>
      </section>
      <section className="rounded-3xl border bg-card p-6 sm:p-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-wider text-primary">Keep learning</p><h2 className="mt-2 text-2xl font-bold">Turn guidance into preparation.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use the WASSCE subject directory to explore syllabus topics, study lessons and practise exam-style questions.</p><div className="mt-5 flex flex-wrap gap-3"><a href="/wassce/subjects" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white">Explore WASSCE subjects</a><a href="/universities" className="inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-semibold">University guides</a></div></div></section>
    </main>
  )
}
