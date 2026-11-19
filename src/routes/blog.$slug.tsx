import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from 'lucide-react'
import { BLOG_POSTS, UNIVERSITY_GUIDES } from '@/content/editorial'
import type { BlogPost } from '@/content/editorial'
import { ArticleSection, Faq, KeyFacts, Rich, Updates, longDate } from '@/components/public/ArticleBlocks'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { EditorialPhoto } from '@/components/public/EditorialPhoto'
import { editorialImage } from '@/lib/editorial-images'
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
    title: loaderData.seoTitle,
    description: loaderData.description,
    image: editorialImage(loaderData.image).og,
    type: 'article',
    publishedAt: loaderData.publishedAt,
    modifiedAt: loaderData.updatedAt,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': loaderData.news ? 'NewsArticle' : 'BlogPosting',
        headline: loaderData.title,
        description: loaderData.description,
        image: [editorialImage(loaderData.image).og],
        datePublished: loaderData.publishedAt,
        dateModified: loaderData.updatedAt,
        author: { '@type': 'Organization', name: 'WASSCE Tutor Editorial Desk', url: absoluteUrl('/about') },
        publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin, logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon-512.png') } },
        mainEntityOfPage: absoluteUrl(`/blog/${loaderData.slug}`),
        inLanguage: 'en',
        isPartOf: { '@type': 'Blog', name: 'WASSCE Tutor Blog', url: absoluteUrl('/blog') },
        ...(loaderData.news ? { dateline: 'Freetown, Sierra Leone', contentLocation: { '@type': 'Country', name: 'Sierra Leone' } } : {}),
      },
      breadcrumbJsonLd([['Home','/'],['Blog','/blog'],[loaderData.title,`/blog/${loaderData.slug}`]])
    ]
  }) : privatePageTags('Article not found'),
  component: BlogArticlePage,
})

type RelatedCard = { slug: string; label: string; title: string; description: string; href: string }

function getRelatedCards(slugs: string[]): RelatedCard[] {
  const cards: RelatedCard[] = []

  for (const slug of slugs) {
    const article = BLOG_POSTS.find((entry) => entry.slug === slug)
    if (article) {
      cards.push({
        slug: article.slug,
        label: article.category,
        title: article.title,
        description: article.description,
        href: `/blog/${article.slug}`,
      })
      continue
    }

    const university = UNIVERSITY_GUIDES.find((entry) => entry.slug === slug)
    if (university) {
      cards.push({
        slug: university.slug,
        label: 'University guide',
        title: university.name,
        description: university.summary,
        href: `/universities/${university.slug}`,
      })
    }
  }

  return cards
}

function BlogArticlePage() {
  const post = Route.useLoaderData()
  const related = getRelatedCards(post.related)
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <Breadcrumbs trail={[['Home','/'],['Blog','/blog'],[post.title,`/blog/${post.slug}`]]}/>
      <header className="space-y-5">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4"/> All articles</a>
        <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{post.category}</p><h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{post.description}</p><div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>WASSCE Tutor Editorial Desk</span><span>Published <time dateTime={post.publishedAt}>{longDate(post.publishedAt)}</time></span>{post.updatedAt !== post.publishedAt && <span className="font-semibold text-foreground">Updated <time dateTime={post.updatedAt}>{longDate(post.updatedAt)}</time></span>}<span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5"/>{post.readMinutes} min read</span></div></div>
        <figure className="overflow-hidden rounded-3xl border bg-muted"><EditorialPhoto image={post.image} alt={post.imageAlt} label={post.category} sizes="(min-width: 1024px) 1024px, 100vw" priority className="aspect-[16/10] sm:aspect-[16/8]"/></figure>
        {post.keyFacts && <KeyFacts facts={post.keyFacts} />}
      </header>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px]">
        <article className="min-w-0">
          <p className="mb-8 border-l-4 border-primary pl-5 text-lg leading-relaxed text-foreground"><Rich text={post.intro} /></p>
          {post.updates && <Updates updates={post.updates} />}
          <div className="space-y-10">
            {post.sections.map((section,i)=><ArticleSection key={section.heading} section={section} id={`section-${i}`} />)}
          </div>
          {post.faq && <Faq items={post.faq} />}
          <section className="mt-10 rounded-2xl border bg-slate-50 p-5 sm:p-7"><h2 className="text-xl font-bold">Primary sources and further reading</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This article is based on the sources below, checked on {new Date(post.updatedAt+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}. Confirm current details with the institution concerned before you act on them.</p><ol className="mt-4 space-y-3">{post.sources.map((source,i)=><li key={source.url} className="flex gap-3 text-sm"><span className="text-xs font-bold text-muted-foreground">{String(i+1).padStart(2,'0')}</span><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline decoration-primary/30 underline-offset-4">{source.label} <ExternalLink className="inline h-3 w-3"/></a></li>)}</ol>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Editorial note: WASSCE Tutor is an independent education resource. It is not an admissions office and is not affiliated with WAEC or the universities listed.</p></section>
        </article>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">On this page</p><nav className="mt-4 space-y-3">{post.sections.map((s,i)=><a key={s.heading} href={`#section-${i}`} className="block text-sm leading-snug text-muted-foreground hover:text-primary">{s.heading}</a>)}{post.faq && <a href="#questions" className="block text-sm leading-snug text-muted-foreground hover:text-primary">Questions readers ask</a>}</nav></div>
          <div className="site-brand-panel rounded-2xl p-5"><p className="text-xs font-bold uppercase tracking-wider text-violet-200">WASSCE preparation</p><h3 className="mt-2 text-lg font-bold">{post.action?.heading ?? 'Build the subject knowledge your next step requires.'}</h3><a href={post.action?.href ?? '/wassce/subjects'} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold">{post.action?.label ?? 'Explore subjects'} <ArrowRight className="h-4 w-4"/></a></div>
        </aside>
      </div>
      <section className="space-y-4"><h2 className="text-2xl font-bold">Continue exploring</h2><div className="grid gap-4 sm:grid-cols-2">{related.map((item) => <a key={item.slug} href={item.href} className="rounded-2xl border bg-card p-5 transition hover:shadow-md"><p className="text-xs font-bold uppercase tracking-wider text-primary">{item.label}</p><h3 className="mt-2 font-bold leading-snug">{item.title}</h3><p className="mt-2 text-sm text-muted-foreground">{item.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read more <ArrowRight className="h-4 w-4"/></span></a>)}</div></section>
    </main>
  )
}

