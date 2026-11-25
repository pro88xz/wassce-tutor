// The topics and lessons people search for most, linked from the homepage and
// /wassce (PopularTopics, src/components/public), by the words they search with.
//
// From Search Console (24 Aug to 24 Nov 2026): each page here had real search
// impressions but sat on Google's second page or lower (positions 8 to 25),
// and none was linked from the homepage, the site's strongest page. A plain
// link from it, with the searched words as the link text, is one of the
// clearest signals of what a page is about and that it matters. Review this
// list when a new export shows what has moved.

export type PopularLink = { label: string; path: string }
export type PopularGroup = { subject: string; slug: string; links: PopularLink[] }

export const POPULAR_TOPICS: PopularGroup[] = [
  {
    subject: 'Biology',
    slug: 'biology',
    links: [
      { label: 'Gas exchange', path: '/wassce/biology/respiratory-systems-and-gas-exchange' },
      { label: 'The urinary system', path: '/wassce/biology/the-kidney-and-urinary-system' },
      { label: 'The endocrine system', path: '/wassce/biology/the-endocrine-system' },
      { label: 'MRS GREN: characteristics of living things', path: '/wassce/biology/characteristics-of-living-things/what-makes-something-alive-introducing-mrs-gren' },
      { label: 'Testing a leaf for starch', path: '/wassce/biology/photosynthesis-and-plant-nutrition/testing-a-leaf-for-starch' },
      { label: 'Why we classify living things', path: '/wassce/biology/classification-of-living-things/why-we-classify-living-things' },
    ],
  },
  {
    subject: 'Physics',
    slug: 'physics',
    links: [
      { label: 'Reflection, refraction and diffraction', path: '/wassce/physics/wave-phenomena/reflection-refraction-and-diffraction-of-waves' },
      { label: 'Moments and the principle of moments', path: '/wassce/physics/moments-and-turning-effects/moments-the-principle-of-moments-and-couples' },
      { label: 'Work, energy and power', path: '/wassce/physics/work-energy-and-power' },
    ],
  },
  {
    subject: 'Chemistry',
    slug: 'chemistry',
    links: [
      { label: 'Introduction to chemistry', path: '/wassce/chemistry/introduction-to-chemistry' },
      { label: 'States of matter', path: '/wassce/chemistry/states-of-matter' },
    ],
  },
  {
    subject: 'English Language',
    slug: 'english-language',
    links: [
      { label: 'What is a noun?', path: '/wassce/english-language/nouns/what-are-nouns' },
      { label: 'Vowels and diphthongs', path: '/wassce/english-language/vowels-and-diphthongs/vowels-and-diphthongs-the-20-vowel-sounds-of-english' },
      { label: 'Prepositions', path: '/wassce/english-language/prepositions/what-are-prepositions' },
    ],
  },
  {
    subject: 'Geography',
    slug: 'geography',
    links: [
      { label: 'Weather instruments and their uses', path: '/wassce/geography/weather-and-climate/weather-instruments-and-their-uses' },
      { label: 'Types of settlement', path: '/wassce/geography/settlement-patterns/types-of-settlement-and-settlement-patterns' },
      { label: 'Latitude, longitude and time', path: '/wassce/geography/the-earth-and-the-solar-system/latitude-and-longitude-how-to-calculate-time' },
    ],
  },
  {
    subject: 'Financial Accounting',
    slug: 'financial-accounting',
    links: [
      {
        label: 'What is accounting?',
        path: '/wassce/financial-accounting/introduction-to-financial-accounting/what-is-financial-accounting-meaning-objectives-and-users-of-accounting-information',
      },
      { label: 'Balancing ledger accounts (c/d and b/d)', path: '/wassce/financial-accounting/the-ledger/how-to-balance-off-ledger-accounts-balance-cd-and-bd' },
    ],
  },
  {
    subject: 'Economics',
    slug: 'economics',
    links: [
      { label: 'What is economics?', path: '/wassce/economics/nature-and-scope-of-economics/what-economics-is-definitions-and-subject-matter' },
      { label: 'Cost and revenue', path: '/wassce/economics/concepts-of-cost-and-revenue' },
      { label: 'Inflation', path: '/wassce/economics/inflation-and-deflation/inflation-meaning-measurement-and-causes' },
    ],
  },
  {
    subject: 'Agricultural Science',
    slug: 'agricultural-science',
    links: [
      { label: 'What is agriculture?', path: '/wassce/agricultural-science/introduction-to-agriculture/defining-agriculture-and-its-importance' },
      { label: 'Characteristics of soil', path: '/wassce/agricultural-science/soil-properties-and-types/soil-properties-and-types-sandy-clay-and-loam' },
    ],
  },
  {
    subject: 'Mathematics',
    slug: 'mathematics',
    links: [
      { label: 'Surds', path: '/wassce/mathematics/surds' },
      { label: 'Set operations', path: '/wassce/mathematics/sets/set-operations-union-intersection-and-complement' },
    ],
  },
  {
    subject: 'Government',
    slug: 'government',
    links: [
      { label: 'Types of executive', path: '/wassce/government/the-executive/the-executive-types-composition-and-functions' },
      { label: 'The civil service', path: '/wassce/government/public-administration-and-civil-service/the-civil-service-features-structure-and-functions' },
    ],
  },
  {
    subject: 'Literature in English',
    slug: 'literature-in-english',
    links: [{ label: 'What is literature?', path: '/wassce/literature-in-english/what-is-literature/what-is-literature-meaning-features-and-oral-and-written-forms' }],
  },
]
