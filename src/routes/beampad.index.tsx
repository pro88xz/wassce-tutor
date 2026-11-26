// /beampad: BeamPad's landing page. BeamPad is the studio's Android app that
// makes a phone a Bluetooth keyboard, mouse and remote for a TV.
//
// Written for one search intent the usual answers miss: typing on, or
// controlling, a TV from a phone when the phone and TV are not on the same
// Wi-Fi network (the Google TV, Fire TV and TV makers' apps all need one). It
// says plainly which TVs it does not work with, so the people who install it
// are the people it works for. The sections are shared with the Spanish page
// (src/components/beampad/Landing.tsx); the words are in
// src/content/beampad-landing-en.tsx, and every claim comes from
// src/content/beampad.ts.
import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/components/beampad/Landing'
import { BEAMPAD_OG_IMAGE, LANDING_FAQ, beampadAppJsonLd, landingLanguageLinks } from '@/content/beampad'
import { LANDING_EN } from '@/content/beampad-landing-en'
import { PUBLIC_PAGES, breadcrumbJsonLd, faqJsonLd, indexablePageTags } from '@/lib/seo'

const PATH = '/beampad'
const PAGE = PUBLIC_PAGES[PATH]

export const Route = createFileRoute('/beampad/')({
  ssr: true, // prerendered to static HTML at build time
  head: () => {
    const tags = indexablePageTags({
      path: PATH,
      title: PAGE.title,
      description: PAGE.description,
      ogTitle: PAGE.ogTitle,
      image: BEAMPAD_OG_IMAGE,
      jsonLd: [beampadAppJsonLd(), breadcrumbJsonLd([['BeamPad', PATH]]), faqJsonLd(LANDING_FAQ)],
    })
    return {
      ...tags,
      meta: [...tags.meta, { name: 'theme-color', content: '#0b0921' }, { property: 'og:site_name', content: 'BeamPad' }],
      links: [...tags.links, { rel: 'icon', type: 'image/png', href: '/img/beampad/icon-512.png' }, ...landingLanguageLinks()],
    }
  },
  component: () => <LandingPage t={LANDING_EN} />,
})
