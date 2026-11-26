// <head> tags for BeamPad's guides (src/routes/beampad.*-remote-*.tsx): the
// article, breadcrumb and question markup, BeamPad's own theme colour and
// name. Their page parts are in src/components/beampad/Guide.tsx.
import { BEAMPAD_OG_IMAGE, beampadPublisher } from '@/content/beampad'
import { PUBLIC_PAGES, absoluteUrl, breadcrumbJsonLd, faqJsonLd, indexablePageTags } from '@/lib/seo'

export type GuidePath = keyof typeof PUBLIC_PAGES & `/beampad/${string}`
export type Trail = [name: string, path: string][]

/** <head> tags for a guide: article, breadcrumb and question markup, BeamPad's own theme colour and name. */
export function guideHead({ path, headline, published, trail, faq, images = [] }: { path: GuidePath; headline: string; published: string; trail: Trail; faq: [string, string][]; images?: Record<string, unknown>[] }) {
  const page = PUBLIC_PAGES[path]
  const tags = indexablePageTags({
    path,
    title: page.title,
    description: page.description,
    image: BEAMPAD_OG_IMAGE,
    type: 'article',
    publishedAt: published,
    modifiedAt: page.lastmod,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description: page.description,
        // The guide's own pictures first (captioned ImageObjects), then the share image.
        image: [...images, BEAMPAD_OG_IMAGE],
        datePublished: published,
        dateModified: page.lastmod,
        mainEntityOfPage: absoluteUrl(path),
        author: beampadPublisher(),
        publisher: beampadPublisher(),
      },
      breadcrumbJsonLd(trail),
      faqJsonLd(faq),
    ],
  })
  return { ...tags, meta: [...tags.meta, { name: 'theme-color', content: '#0b0921' }, { property: 'og:site_name', content: 'BeamPad' }] }
}
