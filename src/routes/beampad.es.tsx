// /beampad/es: BeamPad's landing page in Spanish (Latin America), for
// "usar celular como control remoto para tv sin wifi" and its variants. The
// same sections as /beampad (src/components/beampad/Landing.tsx), with the
// words in src/content/beampad-landing-es.tsx. The two pages point to each
// other with hreflang; the document's lang is "es" here (src/routes/__root.tsx).
import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/components/beampad/Landing'
import { BEAMPAD_OG_IMAGE, SCREEN_SIZE, beampadAppJsonLd, imageObject, landingLanguageLinks, screenSrc } from '@/content/beampad'
import { FAQ_ES, LANDING_ES } from '@/content/beampad-landing-es'
import { PUBLIC_PAGES, absoluteUrl, breadcrumbJsonLd, faqJsonLd, indexablePageTags } from '@/lib/seo'

const PATH = '/beampad/es'
const PAGE = PUBLIC_PAGES[PATH]

/** The app, described in Spanish, with the screens this page shows and their Spanish captions. */
function appJsonLdEs(): Record<string, unknown> {
  return {
    ...beampadAppJsonLd(),
    '@id': `${absoluteUrl(PATH)}#app`,
    url: absoluteUrl(PATH),
    description:
      'Convierte un celular Android en control remoto, teclado, mouse y (con Pro) control de juegos Bluetooth para Android TV, Google TV, Fire TV, computadoras y proyectores. Sin wifi y sin instalar nada en la TV.',
    inLanguage: 'es',
    screenshot: LANDING_ES.features.items.map((f) => imageObject(screenSrc(f.screen, 840), f.alt ?? f.title, SCREEN_SIZE.width, SCREEN_SIZE.height)),
  }
}

export const Route = createFileRoute('/beampad/es')({
  ssr: true, // prerendered to static HTML at build time
  head: () => {
    const tags = indexablePageTags({
      path: PATH,
      title: PAGE.title,
      description: PAGE.description,
      ogTitle: PAGE.ogTitle,
      image: BEAMPAD_OG_IMAGE,
      jsonLd: [appJsonLdEs(), breadcrumbJsonLd([['BeamPad', PATH]]), faqJsonLd(FAQ_ES)],
    })
    return {
      ...tags,
      meta: [
        ...tags.meta,
        { name: 'theme-color', content: '#0b0921' },
        { property: 'og:site_name', content: 'BeamPad' },
        { property: 'og:locale', content: 'es_419' },
      ],
      links: [...tags.links, { rel: 'icon', type: 'image/png', href: '/img/beampad/icon-512.png' }, ...landingLanguageLinks()],
    }
  },
  component: () => <LandingPage t={LANDING_ES} />,
})
