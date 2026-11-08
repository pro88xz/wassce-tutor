import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from 'lucide-react'
import { BLOG_POSTS, UNIVERSITY_GUIDES } from '@/content/editorial'
import type { BlogPost } from '@/content/editorial'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { absoluteUrl, breadcrumbJsonLd, indexablePageTags, privatePageTags, SITE } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  ssr: true,
  loader: ({ params }): BlogPost => {
    const post = BLOG_POSTS.find((item) => item.slug === params.slug)
    if (!post) throw notFound()
    return post
  },
  staleTime: Infinity,
  head: ({ loaderData }) => loaderData ? indexablePageTags({
    path: `/blog/${loaderData.slug}`,
    title: `${loaderData.title} | WASSCE Tutor`,
    description: loaderData.description,
    image: loaderData.image,
    type: 'article',
    publishedAt: loaderData.publishedAt,
    modifiedAt: loaderData.updatedAt,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: loaderData.title,
        description: loaderData.description,
        image: [loaderData.image],
        datePublished: loaderData.publishedAt,
        dateModified: loaderData.updatedAt,
        author: { '@type': 'Organization', name: 'WASSCE Tutor Editorial Desk', url: absoluteUrl('/about') },
        publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin, logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon-512.png') } },
        mainEntityOfPage: absoluteUrl(`/blog/${loaderData.slug}`),
        inLanguage: 'en',
        isPartOf: { '@type': 'Blog', name: 'WASSCE Tutor Blog', url: absoluteUrl('/blog') },
      },
      breadcrumbJsonLd([['Home','/'],['Blog','/blog'],[loaderData.title,`/blog/${loaderData.slug}`]])
    ]
  }) : privatePageTags('Article not found'),
  component: BlogArticlePage,
})

function BlogArticlePage() {
  const post = Route.useLoaderData()
  const related = post.related.map((slug) => BLOG_POSTS.find((p) => p.slug === slug) ?? UNIVERSITY_GUIDES.find((u) => u.slug === slug)).filter(Boolean)
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <Breadcrumbs trail={[['Home','/'],['Blog','/blog'],[post.title,`/blog/${post.slug}`]]}/>
      <header className="space-y-5">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4"/> All articles</a>
        <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{post.category}</p><h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{post.description}</p><div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>WASSCE Tutor Editorial Desk</span><span>Published {new Date(post.publishedAt+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5"/>{post.readMinutes} min read</span></div></div>
        <figure className="overflow-hidden rounded-3xl border bg-muted"><img src={post.image} alt={post.imageAlt} className="max-h-[520px] w-full object-cover"/><figcaption className="bg-card px-4 py-3 text-xs text-muted-foreground">Image: {post.imageCredit}. Source: <a href={post.imageSourceUrl} target="_blank" rel="noopener noreferrer" className="underline">official institution website</a>. Rights remain with the original publisher.</figcaption></figure>
      </header>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px]">
        <article className="min-w-0">
          <p className="mb-8 border-l-4 border-primary pl-5 text-lg leading-relaxed text-foreground">{post.intro}</p>
          <div className="space-y-9">
            {post.sections.map((section,i)=><section id={`section-${i}`} key={section.heading} className="scroll-mt-24"><h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2><div className="mt-4 space-y-4 text-[16px] leading-8 text-muted-foreground">{section.paragraphs?.map((p,j)=><p key={j}>{p}</p>)}</div>{section.bullets&&<ul className="mt-4 space-y-3">{section.bullets.map((b,j)=><li key={j} className="flex gap-3 text-[15px] leading-7 text-muted-foreground"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"/><span>{b}</span></li>)}</ul>}</section>)}
          </div>
          <section className="mt-10 rounded-2xl border bg-slate-50 p-5 sm:p-7"><h2 className="text-xl font-bold">Primary sources and further reading</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This article is based on the official sources below. Admissions information was checked on 8 November 2026; confirm current details with the institution before applying.</p><ol className="mt-4 space-y-3">{post.sources.map((source,i)=><li key={source.url} className="flex gap-3 text-sm"><span className="text-xs font-bold text-muted-foreground">{String(i+1).padStart(2,'0')}</span><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline decoration-primary/30 underline-offset-4">{source.label} <ExternalLink className="inline h-3 w-3"/></a></li>)}</ol>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Editorial note: WASSCE Tutor is an independent education resource. It is not an admissions office and is not affiliated with WAEC or the universities listed.</p></section>
        </article>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">On this page</p><nav className="mt-4 space-y-3">{post.sections.map((s,i)=><a key={s.heading} href={`#section-${i}`} className="block text-sm leading-snug text-muted-foreground hover:text-primary">{s.heading}</a>)}</nav></div>
          <div className="rounded-2xl bg-[#21134d] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-violet-200">WASSCE preparation</p><h3 className="mt-2 text-lg font-bold">Build the subject knowledge your next step requires.</h3><a href="/wassce/subjects" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Explore subjects <ArrowRight className="h-4 w-4"/></a></div>
        </aside>
      </div>
      <section className="space-y-4"><h2 className="text-2xl font-bold">Continue exploring</h2><div className="grid gap-4 sm:grid-cols-2">{related.map((item) => item && <a key={item.slug} href={'category' in item?`/blog/${item.slug}`:`/universities/${item.slug}`} className="rounded-2xl border bg-card p-5 transition hover:shadow-md"><p className="text-xs font-bold uppercase tracking-wider text-primary">{'category' in item?item.category:'University guide'}</p><h3 className="mt-2 font-bold leading-snug">{'category' in item ? item.title : item.name}</h3><p className="mt-2 text-sm text-muted-foreground">{'description' in item?item.description:item.summary}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read more <ArrowRight className="h-4 w-4"/></span></a>)}</div></section>
    </main>
  )
}
