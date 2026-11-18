// Single source of truth for page <head> metadata.
//
// Used in two places:
//  1. Route `head` options, rendered by <HeadContent /> in __root.tsx. Public
//     routes are prerendered at build time (TanStack Start), so these tags are
//     in the static HTML that crawlers and link previews (WhatsApp, Facebook)
//     read, and they update on every in-app navigation.
//  2. vite.config.ts, which prerenders every PUBLIC_PAGES entry and lists it
//     in /sitemap.xml with its lastmod.
//
// Keep this file free of browser-only and Node-only imports: it is loaded by
// both the app bundle and vite.config.ts.

import type { AnyRouteMatch } from '@tanstack/react-router'
import { CONTACT } from './contact'
import { FROM_PRICE, PLANS } from './plans'
import { GOOGLE_MAPS_URL } from './reviews'

/** Dearest plan, for structured-data price ranges. */
const TOP_PRICE = Math.max(...PLANS.map((p) => p.priceNle))

export const SITE = {
  origin: 'https://wasscetutor.com',
  name: 'WASSCE Tutor',
} as const

type PublicPage = {
  /** Full <title>, keyword first, brand last. Aim for <= 65 characters. */
  title: string
  /** Meta description. Aim for 120-160 characters, and keep it true. */
  description: string
  /** Title for link previews; defaults to `title`. */
  ogTitle?: string
  /** Date the page's content last changed meaningfully (YYYY-MM-DD), for the sitemap. */
  lastmod: string
}

// Indexable pages. Every key here gets a self-referencing canonical, a static
// HTML file at build time, and an entry in /sitemap.xml.
export const PUBLIC_PAGES = {
  '/': {
    title: 'WASSCE Practice Questions & Lessons in Sierra Leone | WASSCE Tutor',
    ogTitle: 'WASSCE Tutor: Pass WASSCE with confidence',
    description:
      `WASSCE lessons and practice questions for Sierra Leone students, with full working and one-to-one tutors. Free to start; everything from NLe ${FROM_PRICE}.`,
    lastmod: '2026-11-07',
  },
  '/about': {
    title: 'About WASSCE Tutor: WASSCE Prep Built in Sierra Leone',
    description:
      'WASSCE Tutor is a WASSCE preparation app built in Freetown for Sierra Leone students, with syllabus lessons and exam-style practice questions.',
    lastmod: '2026-11-06',
  },
  '/contact': {
    title: 'Contact WASSCE Tutor: WhatsApp, Email & Location | WASSCE Tutor',
    description:
      'Contact WASSCE Tutor in Freetown, Sierra Leone: WhatsApp +232 77 884195, email, and our WhatsApp study group. Help with plans, payments and tutors.',
    lastmod: '2026-11-06',
  },
  '/tutors': {
    title: 'Private WASSCE Tutors in Freetown & Sierra Leone | Home Lessons',
    description: 'Book a private tutor for WASSCE in Freetown, Bo, Kenema or Makeni. Home lessons and extra classes in maths, English and sciences, with the monthly fee upfront.',
    lastmod: '2026-11-18',
  },
  '/blog': {
    title: 'WASSCE Tutor Blog: Study & University Guides',
    description: 'Research-backed WASSCE study advice, Sierra Leone university admissions guides, subject planning and practical resources for students and families.',
    lastmod: '2026-11-08',
  },
  '/universities': {
    title: 'Sierra Leone Universities: Courses & WASSCE Requirements',
    description: 'Compare universities in Sierra Leone, explore programmes and WASSCE entry requirements, and follow official admissions links for each institution.',
    lastmod: '2026-11-08',
  },
  '/become-a-tutor': {
    title: 'Become a WASSCE Tutor in Sierra Leone | Teach In Person',
    description: 'Become a WASSCE tutor in Sierra Leone in three steps: add your photo, subjects and monthly fee, go live in the tutor marketplace and get students on WhatsApp.',
    lastmod: '2026-11-18',
  },
  '/affiliate': {
    title: 'WASSCE Tutor Affiliate Programme | Earn from Student Referrals',
    description: 'Join the WASSCE Tutor affiliate programme. Share a tracked referral link and earn 50% of a referred student’s first verified subscription payment.',
    lastmod: '2026-11-08',
  },
  '/privacy': {
    title: 'Privacy Policy | WASSCE Tutor',
    description:
      'What information WASSCE Tutor collects when you use the website or Android app, how it is stored and used, and the choices you have.',
    lastmod: '2026-06-08',
  },
  '/terms': {
    title: 'Terms of Service | WASSCE Tutor',
    description:
      'The terms that apply when you create an account or use WASSCE Tutor, including subscriptions, payments and acceptable use.',
    lastmod: '2026-11-07',
  },
} as const satisfies Record<string, PublicPage>

export type PublicPath = keyof typeof PUBLIC_PAGES

// Titles and descriptions written for the words people actually search, for
// data-driven pages where Search Console showed many impressions at a good
// position but no clicks: the default template ("WASSCE Chemistry:
// Introduction to Chemistry Lessons") did not answer searches such as
// "chemistry for beginners" or "learn about literature". Keyed by path. Keep
// each one true to what the page has; it replaces the template's text only.
export const SEARCH_COPY: Partial<Record<string, { title: string; description: string }>> = {
  // Nov 2026: about 1,500 impressions at position 5 for "chemistry for beginners",
  // "chemistry explained", "learn about chemistry", "understanding chemistry".
  '/wassce/chemistry/introduction-to-chemistry': {
    title: 'Introduction to Chemistry for Beginners | WASSCE Chemistry',
    description:
      'Chemistry explained for beginners: what chemistry is, its branches and uses, the scientific method, measurement and lab safety. Short lessons, all free.',
  },
  // Nov 2026: about 270 impressions at position 5 for "learn about literature".
  '/wassce/literature-in-english': {
    title: 'Learn About Literature: Prose, Drama & Poetry | WASSCE',
    description:
      'Learn what literature is, why we read it and its three genres, prose, drama and poetry, then every topic of the WASSCE Literature in English syllabus.',
  },
  // Nov 2026: 221 impressions, 0 clicks, mostly "difference between reflection,
  // refraction and diffraction" (often "with examples" or "and interference").
  '/wassce/physics/wave-phenomena/reflection-refraction-and-diffraction-of-waves': {
    title: 'Reflection, Refraction and Diffraction: Differences & Examples',
    description:
      'The difference between reflection, refraction and diffraction: waves bounce, bend or spread. Table of water, sound and light examples, plus interference.',
  },
  // Nov 2026: position 5 to 7 for "what is agriculture", 0 clicks.
  '/wassce/agricultural-science/introduction-to-agriculture/defining-agriculture-and-its-importance': {
    title: 'What Is Agriculture? Meaning, Importance and Branches',
    description:
      'Agriculture is growing crops and rearing animals for food, raw materials and income. Its meaning, branches, types and importance, with Sierra Leone examples.',
  },
  // Search Console to 16 Nov 2026: each page shows for the searches below but
  // its title did not use their words, so it got no clicks.
  // "what is calorimetry" (position 1.8), "calorimetry", "heat and temperature".
  '/wassce/physics/quantity-of-heat-and-calorimetry': {
    title: 'What Is Calorimetry? Heat Capacity & Specific Heat | WASSCE',
    description:
      'Calorimetry is measuring heat: heat lost by hot bodies equals heat gained by cold ones. Heat capacity, specific heat capacity and WASSCE calorimetry problems.',
  },
  // "endocrine" (position 5), "endocrine meaning" (4.3), "what is endocrine", "endocrine system".
  '/wassce/biology/the-endocrine-system': {
    title: 'Endocrine System: Meaning, Glands and Hormones | WASSCE Biology',
    description:
      'Endocrine meaning: ductless glands that release hormones into the blood. The major endocrine glands, their hormones, feedback and blood glucose control.',
  },
  // "urinary system" (51 impressions), "urinary system organs" (position 9), "kidney and urinary tract anatomy".
  '/wassce/biology/the-kidney-and-urinary-system': {
    title: 'Urinary System: Organs, Kidney Structure & Nephron | WASSCE',
    description:
      'The urinary system and its organs: kidneys, ureters, bladder and urethra. Kidney structure, the nephron, how urine forms and urinary disorders. All free.',
  },
  '/wassce/biology/the-kidney-and-urinary-system/the-kidney-and-urinary-system-structure-and-organisation': {
    title: 'Urinary System Organs and Kidney Structure, with the Nephron',
    description:
      'The organs of the urinary system and the route of urine, the external and internal structure of the kidney, and the nephron, its functional unit.',
  },
  // "gas exchange", "where does gas exchange occur", "gaseous exchange in lungs" (216 impressions, position 22).
  '/wassce/biology/respiratory-systems-and-gas-exchange': {
    title: 'Gas Exchange: Where It Occurs in Humans, Fish, Insects, Plants',
    description:
      'Where gas exchange occurs: alveoli in the lungs, gills in fish, tracheae in insects and stomata in plants. The human respiratory system and breathing. Free.',
  },
  // "mrs gren", "mrs gren biology", "what is mrs gren", "mrs gren meaning", "what does mrs gren stand for".
  '/wassce/biology/characteristics-of-living-things/what-makes-something-alive-introducing-mrs-gren': {
    title: 'MRS GREN Meaning: 7 Characteristics of Living Things',
    description:
      'What MRS GREN stands for: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion and Nutrition, the seven characteristics of living things.',
  },
  // "what is the main purpose of biological classification?" (41 impressions), "why do we classify living things".
  '/wassce/biology/classification-of-living-things/why-we-classify-living-things': {
    title: 'Why We Classify Living Things: Purpose of Classification',
    description:
      'The main purpose of biological classification: to sort millions of organisms into groups so they can be named, identified and studied. Features and examples.',
  },
  // "what is economics" (23 impressions, position 14.5), "definition of economics".
  '/wassce/economics/nature-and-scope-of-economics/what-economics-is-definitions-and-subject-matter': {
    title: 'What Is Economics? Definitions by Smith, Marshall & Robbins',
    description:
      'Economics is the study of how people use scarce resources to satisfy unlimited wants. The wealth, welfare and scarcity definitions, and what economics studies.',
  },
  // "distance displacement speed velocity acceleration" and "... definition" (positions 4 to 8).
  '/wassce/physics/motion-in-a-straight-line/distance-displacement-speed-velocity-and-acceleration': {
    title: 'Distance, Displacement, Speed, Velocity & Acceleration Defined',
    description:
      'Definitions of distance, displacement, speed, velocity and acceleration, with their units, converting km/h to m/s, and WASSCE examples to practise.',
  },
}

/** Google shows about 60 characters of a title: add the brand only when it still fits. */
export function brandedTitle(title: string, max = 65): string {
  const full = `${title} | ${SITE.name}`
  return full.length <= max ? full : title
}

/**
 * A meta description from parts in order of importance: as many whole parts
 * as fit in `max` characters (Google shows about 155-160); a part that does
 * not fit is skipped. The first part is always kept, cut at a word if it alone
 * is too long.
 */
export function fitDescription(parts: string[], max = 160): string {
  const [first = '', ...rest] = parts.map((p) => p.trim()).filter(Boolean)
  let out = first.length <= max ? first : `${first.slice(0, first.lastIndexOf(' ', max - 1)).replace(/[,;:.\s]+$/, '')}…`
  for (const part of rest) if (out.length + 1 + part.length <= max) out += ` ${part}`
  return out
}

// Same shapes the router's `head` option returns.
export type HeadTags = {
  meta: NonNullable<AnyRouteMatch['meta']>
  links: NonNullable<AnyRouteMatch['links']>
  scripts?: NonNullable<AnyRouteMatch['headScripts']>
}

/** A <script type="application/ld+json"> head tag; "<" is escaped so the JSON can't close the script. */
function jsonLd(data: Record<string, unknown>): NonNullable<AnyRouteMatch['headScripts']>[number] {
  return { type: 'application/ld+json', children: JSON.stringify(data).replace(/</g, String.fromCharCode(92) + 'u003c') }
}

export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE.origin}/` : `${SITE.origin}${path}`
}

const ORG_ID = `${SITE.origin}/#organization`

// The business itself: an education service based in Freetown that serves
// the whole country online. Typed as both EducationalOrganization and
// LocalBusiness so search engines can show it for local searches. sameAs is
// the Google Business Profile (src/lib/reviews.ts). Add streetAddress,
// postalCode and other profiles (socials) here when they exist; never guess them.
const ORGANIZATION = {
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': ORG_ID,
  name: SITE.name,
  url: `${SITE.origin}/`,
  logo: `${SITE.origin}/logo.png`,
  image: `${SITE.origin}/og-image.jpg`,
  description:
    'WASSCE preparation for Sierra Leone students, built in Freetown: syllabus lessons, original exam-style practice questions and one-to-one tutors.',
  email: CONTACT.email,
  telephone: CONTACT.phoneE164,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACT.locality,
    addressRegion: CONTACT.region,
    addressCountry: CONTACT.countryCode,
  },
  areaServed: { '@type': 'Country', name: CONTACT.country },
  priceRange: `NLe ${FROM_PRICE}–${TOP_PRICE}`,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: CONTACT.phoneE164,
      email: CONTACT.email,
      areaServed: CONTACT.countryCode,
      availableLanguage: ['English'],
    },
  ],
  knowsAbout: ['WASSCE', 'West African Senior School Certificate Examination', 'Secondary education in Sierra Leone'],
  sameAs: [GOOGLE_MAPS_URL],
}

// Organization + WebSite + app entity graph, on the homepage.
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'WebSite',
      '@id': `${SITE.origin}/#website`,
      name: SITE.name,
      // Helps Google show "WASSCE Tutor" above results instead of the bare domain.
      alternateName: ['WASSCETutor', 'wasscetutor.com'],
      url: `${SITE.origin}/`,
      inLanguage: 'en',
      publisher: { '@id': `${SITE.origin}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE.name,
      description: 'WASSCE preparation app built in Sierra Leone with syllabus lessons and exam-style practice questions.',
      url: `${SITE.origin}/`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Android, Web',
      inLanguage: 'en',
      audience: {
        '@type': 'Audience',
        audienceType: 'WASSCE candidates',
        geographicArea: { '@type': 'Country', name: 'Sierra Leone' },
      },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'SLE', lowPrice: '0', highPrice: String(TOP_PRICE), offerCount: String(PLANS.length + 1) },
      provider: { '@id': ORG_ID },
    },
  ],
}

// Contact page: the business entity in full, with the page about it.
const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'ContactPage',
      '@id': `${SITE.origin}/contact#page`,
      url: `${SITE.origin}/contact`,
      name: 'Contact WASSCE Tutor',
      inLanguage: 'en',
      about: { '@id': ORG_ID },
      mainEntity: { '@id': ORG_ID },
    },
  ],
}

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION,
    {
      '@type': 'AboutPage',
      url: `${SITE.origin}/about`,
      name: 'About WASSCE Tutor',
      inLanguage: 'en',
      about: { '@id': ORG_ID },
    },
  ],
}

const PAGE_JSON_LD: Partial<Record<PublicPath, Record<string, unknown>[]>> = {
  '/': [HOME_JSON_LD],
  // breadcrumbJsonLd is a function declaration, so it is hoisted and usable here.
  '/about': [ABOUT_JSON_LD, breadcrumbJsonLd([['Home', '/'], ['About', '/about']])],
  '/contact': [CONTACT_JSON_LD, breadcrumbJsonLd([['Home', '/'], ['Contact', '/contact']])],
  '/tutors': [breadcrumbJsonLd([['Home', '/'], ['Private tutors', '/tutors']])],
  '/affiliate': [breadcrumbJsonLd([['Home', '/'], ['Affiliate programme', '/affiliate']])],
  '/become-a-tutor': [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Become a WASSCE Tutor in Sierra Leone',
      url: `${SITE.origin}/become-a-tutor`,
      description: 'Become a WASSCE tutor in Sierra Leone in three steps: make a tutor card with your photo, subjects and monthly fee, and get messages from students on WhatsApp.',
      mainEntity: {
        '@type': 'Service',
        name: 'WASSCE Tutor teaching partner onboarding',
        serviceType: 'Tutoring marketplace onboarding',
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'Sierra Leone' },
      },
    },
    breadcrumbJsonLd([['Home', '/'], ['Become a tutor', '/become-a-tutor']]),
  ],
  '/blog': [breadcrumbJsonLd([['Home', '/'], ['Blog', '/blog']])],
  '/universities': [breadcrumbJsonLd([['Home', '/'], ['Universities', '/universities']])],
}

type IndexablePage = {
  path: string
  title: string
  description: string
  ogTitle?: string
  /** JSON-LD objects, each emitted as its own <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>[]
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  modifiedAt?: string
}

/** Tags for an indexable page: unique title + description, self canonical, OG/Twitter text, optional JSON-LD. */
export function indexablePageTags({ path, title, description, ogTitle = title, jsonLd: data = [], image = `${SITE.origin}/og-image.jpg`, type = 'website', publishedAt, modifiedAt }: IndexablePage): HeadTags {
  const url = absoluteUrl(path)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
      { property: 'og:type', content: type },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: title },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: image },
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: description },
      ...(type === 'article' && publishedAt ? [{ property: 'article:published_time', content: publishedAt }, { property: 'article:modified_time', content: modifiedAt ?? publishedAt }] : []),
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: data.map(jsonLd),
  }
}

/** Tags for a fixed page listed in PUBLIC_PAGES. */
export function publicPageTags(path: PublicPath): HeadTags {
  const page: PublicPage = PUBLIC_PAGES[path]
  return indexablePageTags({
    path,
    title: page.title,
    description: page.description,
    ogTitle: page.ogTitle,
    jsonLd: PAGE_JSON_LD[path] ?? [],
  })
}

/** schema.org BreadcrumbList for a trail of [name, path] pairs, ending with the current page. */
export function breadcrumbJsonLd(trail: [name: string, path: string][]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

/** Tags for app screens and private pages: a readable tab title, never indexed. */
export function privatePageTags(title: string): HeadTags {
  return {
    meta: [
      { title: `${title} | ${SITE.name}` },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [],
  }
}

/** Route `head` option for an indexable page. */
export const publicHead = (path: PublicPath) => () => publicPageTags(path)

/** Route `head` option for a non-indexable screen. */
export const privateHead = (title: string) => () => privatePageTags(title)

/** schema.org Service for a tutoring page. */
export function tutoringServiceJsonLd({ name, description, path, subject }: { name: string; description: string; path: string; subject?: string }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    serviceType: subject ? `Private ${subject} tutoring` : 'Private tutoring',
    category: 'Education',
    provider: { '@type': 'Organization', '@id': ORG_ID, name: SITE.name, url: `${SITE.origin}/`, telephone: CONTACT.phoneE164 },
    areaServed: [
      { '@type': 'Country', name: 'Sierra Leone' },
      ...['Freetown', 'Bo', 'Kenema', 'Makeni'].map((city) => ({ '@type': 'City', name: city, containedInPlace: { '@type': 'Country', name: 'Sierra Leone' } })),
    ],
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'WASSCE candidates' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: absoluteUrl(path), availableLanguage: 'en' },
  }
}

/** schema.org FAQPage from visible question/answer pairs (must match what the page shows). */
export function faqJsonLd(items: [question: string, answer: string][]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

export type QuizQuestion = {
  /** Plain text: the question as written, maths spelled out (no LaTeX). */
  text: string
  /** Plain text of each option, with its letter. */
  options: { label: string; text: string; correct: boolean }[]
  /** Plain text of the worked solution. */
  explanation?: string
  image?: string | null
}

/**
 * schema.org Quiz for a page of multiple-choice questions with their answers
 * and working (all visible on the page). Not marked as flashcards: Google's
 * Education Q&A carousel is for flashcard pages only, and these are not.
 */
export function quizJsonLd({ name, path, about, subject, questions }: { name: string; path: string; about: string; subject: string; questions: QuizQuestion[] }): Record<string, unknown> {
  const url = absoluteUrl(path)
  const answer = (o: QuizQuestion['options'][number], explanation?: string) => ({
    '@type': 'Answer',
    text: `${o.label}. ${o.text}`,
    ...(explanation ? { answerExplanation: { '@type': 'Comment', text: explanation } } : {}),
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': `${url}#quiz`,
    url,
    name,
    about: { '@type': 'Thing', name: about },
    educationalLevel: 'Senior secondary (WASSCE)',
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalSubject', targetName: subject },
    learningResourceType: 'Practice problems',
    assesses: about,
    isAccessibleForFree: true,
    inLanguage: 'en',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'WASSCE candidates' },
    provider: { '@id': ORG_ID },
    hasPart: questions.map((q, i) => {
      const correct = q.options.find((o) => o.correct)
      return {
        '@type': 'Question',
        '@id': `${url}#q${i + 1}`,
        name: `Question ${i + 1}`,
        text: q.text,
        eduQuestionType: 'Multiple choice',
        ...(q.image ? { image: q.image } : {}),
        ...(correct ? { acceptedAnswer: answer(correct, q.explanation) } : {}),
        suggestedAnswer: q.options.filter((o) => !o.correct).map((o) => answer(o)),
      }
    }),
  }
}

/**
 * schema.org Quiz of flashcards (Google's Education Q&A): one card per key
 * term, the term on the front (as the page shows it) and the lesson's
 * definition as the answer. Only for a page where every card is a flashcard.
 */
export function flashcardsJsonLd({ name, path, about, subject, cards }: { name: string; path: string; about: string; subject: string; cards: { front: string; back: string }[] }): Record<string, unknown> {
  const url = absoluteUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': `${url}#flashcards`,
    url,
    name,
    about: { '@type': 'Thing', name: about },
    educationalLevel: 'Senior secondary (WASSCE)',
    educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'educationalSubject', targetName: subject },
    learningResourceType: 'Flashcard',
    isAccessibleForFree: true,
    inLanguage: 'en',
    provider: { '@id': ORG_ID },
    hasPart: cards.map((c) => ({
      '@type': 'Question',
      eduQuestionType: 'Flashcard',
      text: c.front,
      acceptedAnswer: { '@type': 'Answer', text: c.back },
    })),
  }
}
