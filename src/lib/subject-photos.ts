// Licensed subject photographs (self-hosted WebP in public/subjects/).
// Every entry records where the photo came from and its licence, and the
// About page lists these credits. Only licences that allow commercial use
// and editing are used.
export type SubjectPhoto = {
  /** 1280 px wide WebP */
  src: string
  /** 640 px wide WebP */
  small: string
  /** CSS object-position, to keep the subject of the photo in frame */
  position?: string
  /** Subject name, for the credits list */
  subject: string
  /** What the photo shows (for credits) */
  caption: string
  credit: {
    creator: string
    creatorUrl?: string
    source: string
    sourceUrl: string
    license: string
    licenseUrl: string
  }
}

// Sourced from Pexels (free for commercial use, no attribution required;
// credited anyway). Downloaded at 1600 px, centre-cropped to 3:2 and
// re-encoded as WebP at 1280 and 640 px (public/img/subjects).
export const SUBJECT_PHOTOS: Record<string, SubjectPhoto> = {
  'english-language': {
    src: '/img/subjects/english-language.webp',
    small: '/img/subjects/english-language-640.webp',
    position: '70% 40%',
    subject: 'English Language',
    caption: 'A student reading in a university library',
    credit: { creator: 'Yan Krukau', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/people-studying-in-library-8199762/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'mathematics': {
    src: '/img/subjects/mathematics.webp',
    small: '/img/subjects/mathematics-640.webp',
    position: '60% 40%',
    subject: 'Mathematics',
    caption: 'A student working through equations on a chalkboard',
    credit: { creator: 'Yan Krukau', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/back-view-of-a-student-answering-a-problem-on-the-chalkboard-8197497/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'further-mathematics': {
    src: '/img/subjects/further-mathematics.webp',
    small: '/img/subjects/further-mathematics-640.webp',
    position: '50% 50%',
    subject: 'Further Mathematics',
    caption: 'An integral written on a blackboard',
    credit: { creator: 'Monstera Production', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/mathematical-equation-written-on-blackboard-6238050/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'biology': {
    src: '/img/subjects/biology.webp',
    small: '/img/subjects/biology-640.webp',
    position: '50% 40%',
    subject: 'Biology',
    caption: 'A scientist at a microscope',
    credit: { creator: 'Artem Podrez', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/a-man-looking-at-the-camera-while-holding-the-eyepiece-of-the-microscope-5726797/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'chemistry': {
    src: '/img/subjects/chemistry.webp',
    small: '/img/subjects/chemistry-640.webp',
    position: '35% 40%',
    subject: 'Chemistry',
    caption: 'A researcher running a titration',
    credit: { creator: 'RF._.studio', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/focused-african-american-researcher-conducting-biochemical-experiment-in-clinic-3825434/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'physics': {
    src: '/img/subjects/physics-circuit.webp',
    small: '/img/subjects/physics-circuit-640.webp',
    position: '72% 40%',
    subject: 'Physics',
    caption: 'A student soldering an electrical circuit',
    credit: { creator: 'ThisIsEngineering', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/woman-soldering-pcb-in-school-19895844/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'agricultural-science': {
    src: '/img/subjects/agricultural-science.webp',
    small: '/img/subjects/agricultural-science-640.webp',
    position: '50% 50%',
    subject: 'Agricultural Science',
    caption: 'Farmers harvesting rice in Makurdi, Nigeria',
    credit: { creator: 'ZEUS THE CREATOR', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/people-farming-on-the-field-14314165/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'economics': {
    src: '/img/subjects/economics.webp',
    small: '/img/subjects/economics-640.webp',
    position: '35% 45%',
    subject: 'Economics',
    caption: 'A woman counting money at her desk',
    credit: { creator: 'MART PRODUCTION', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/woman-in-pink-coat-counting-money-8872369/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'commerce': {
    src: '/img/subjects/commerce.webp',
    small: '/img/subjects/commerce-640.webp',
    position: '50% 55%',
    subject: 'Commerce',
    caption: 'A busy produce market with yam sellers',
    credit: { creator: 'Detty Images', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/vibrant-african-local-market-scene-with-vendors-30179958/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'government': {
    src: '/img/subjects/government.webp',
    small: '/img/subjects/government-640.webp',
    position: '45% 45%',
    subject: 'Government',
    caption: 'A voter casting his ballot',
    credit: { creator: 'Edmond Dantès', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/a-man-casting-his-ballot-in-a-ballot-box-7103203/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'history': {
    src: '/img/subjects/history.webp',
    small: '/img/subjects/history-640.webp',
    position: '35% 60%',
    subject: 'History',
    caption: 'A vintage map of West Africa',
    credit: { creator: 'Nothing Ahead', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/brown-map-in-close-up-photography-9494916/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'geography': {
    src: '/img/subjects/geography.webp',
    small: '/img/subjects/geography-640.webp',
    position: '50% 50%',
    subject: 'Geography',
    caption: 'A geography lesson with a globe and world map',
    credit: { creator: 'Tima Miroshnichenko', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/teacher-teaching-a-student-about-geography-using-a-globe-5428269/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'financial-accounting': {
    src: '/img/subjects/financial-accounting.webp',
    small: '/img/subjects/financial-accounting-640.webp',
    position: '45% 50%',
    subject: 'Financial Accounting',
    caption: 'Working figures on a calculator',
    credit: { creator: 'RDNE Stock project', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/woman-uses-calculator-7491011/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'business-management': {
    src: '/img/subjects/business-management.webp',
    small: '/img/subjects/business-management-640.webp',
    position: '50% 50%',
    subject: 'Business Management',
    caption: 'A team meeting in a Lagos office',
    credit: { creator: 'Ninthgrid', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/business-meeting-in-lagos-office-setting-30688596/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'ict-computer-studies': {
    src: '/img/subjects/ict-computer-studies.webp',
    small: '/img/subjects/ict-computer-studies-640.webp',
    position: '55% 55%',
    subject: 'ICT / Computer Studies',
    caption: 'Students working on laptops',
    credit: { creator: 'Kampus Production', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/concentrated-young-diverse-students-using-laptops-during-lesson-in-library-5940711/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'literature-in-english': {
    src: '/img/subjects/literature-in-english.webp',
    small: '/img/subjects/literature-in-english-640.webp',
    position: '50% 50%',
    subject: 'Literature in English',
    caption: 'A stack of leather-bound books',
    credit: { creator: 'photoGraph', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/pile-of-old-books-12006842/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'technical-drawing': {
    src: '/img/subjects/technical-drawing.webp',
    small: '/img/subjects/technical-drawing-640.webp',
    position: '50% 50%',
    subject: 'Technical Drawing',
    caption: 'Architectural drawings and drafting tools',
    credit: { creator: 'Thirdman', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/pen-and-ruler-on-top-of-drawing-pad-5582585/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
  'building-construction': {
    src: '/img/subjects/building-construction.webp',
    small: '/img/subjects/building-construction-640.webp',
    position: '50% 45%',
    subject: 'Building Construction',
    caption: 'A construction crew at work',
    credit: { creator: 'Jerome Govender', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/construction-workers-working-together-5298215/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/' },
  },
}

export function subjectPhoto(slug: string | null | undefined): SubjectPhoto | undefined {
  return slug ? SUBJECT_PHOTOS[slug] : undefined
}
