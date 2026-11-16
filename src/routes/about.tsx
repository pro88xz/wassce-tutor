import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, Mail, MapPin } from 'lucide-react'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { SUBJECT_PHOTOS } from '@/lib/subject-photos'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { TOPIC_PHOTOS } from '@/lib/topic-photos'
import { BLOG_POSTS, UNIVERSITY_GUIDES } from '@/content/editorial'
import { publicHead } from '@/lib/seo'
import { CONTACT } from '@/lib/contact'
import { fetchLandingData } from '@/lib/public-content'
import { FROM_PRICE, PLANS } from '@/lib/plans'

export const Route = createFileRoute('/about')({
  head: publicHead('/about'),
  ssr: true,
  loader: () => fetchLandingData(),
  staleTime: Infinity,
  component: About,
})

const PHOTO_CREDITS = [
  ...Object.entries(SUBJECT_PHOTOS).sort((a, b) => a[1].subject.localeCompare(b[1].subject)),
  ['tutors', { subject: 'Book a tutor', caption: TUTOR_PHOTO.caption, credit: TUTOR_PHOTO.credit }] as const,
  ...Object.entries(TOPIC_PHOTOS)
    .sort((a, b) => a[1].topic.localeCompare(b[1].topic))
    .map(([key, p]) => [key, { subject: `${p.topic} (topic)`, caption: p.caption, credit: p.credit }] as const),
  // The homepage photo, and the blog and university photos, carry no caption
  // on their pages: their credits are listed here.
  [
    'home',
    {
      subject: 'Home page',
      caption: 'Two students in school uniform working through a book together at their desk',
      credit: {
        creator: 'Tosin Olowoleni',
        creatorUrl: undefined as string | undefined,
        source: 'Pexels',
        sourceUrl: 'https://www.pexels.com/photo/african-students-focused-on-classroom-studies-34162714/',
        license: 'Pexels License',
        licenseUrl: 'https://www.pexels.com/license/' as string | undefined,
      },
    },
  ] as const,
  ...BLOG_POSTS.filter((post) => post.imageSourceLabel === 'Pexels').map((post) => [
    `blog-${post.slug}`,
    {
      subject: `${post.title.split(':')[0]} (blog)`,
      caption: post.imageAlt,
      credit: {
        creator: post.imageCredit.replace(/ via Pexels$/, ''),
        creatorUrl: undefined as string | undefined,
        source: 'Pexels',
        sourceUrl: post.imageSourceUrl ?? 'https://www.pexels.com/',
        license: 'Pexels License',
        licenseUrl: 'https://www.pexels.com/license/' as string | undefined,
      },
    },
  ] as const),
  // University photos. "Name via Source — Licence" for openly
  // licensed photos, "Publisher — where" for photos credited to the institution that published them.
  ...UNIVERSITY_GUIDES.map((guide) => {
    const [who, licence] = guide.imageCredit.split(' — ')
    const [creator, source] = who.includes(' via ') ? who.split(' via ') : [who, licence ?? 'official website']
    const open = who.includes(' via ') && licence
    return [
      `university-${guide.slug}`,
      {
        subject: `${guide.name} (university guide)`,
        caption: guide.imageAlt,
        credit: {
          creator,
          creatorUrl: undefined as string | undefined,
          source,
          sourceUrl: guide.imageSourceUrl ?? guide.officialUrl,
          license: open ? licence : 'rights remain with the publisher',
          licenseUrl: (licence === 'CC BY 2.0' ? 'https://creativecommons.org/licenses/by/2.0/' : undefined) as string | undefined,
        },
      },
    ] as const
  }),
]

const COVER_ROW = ['english-language', 'mathematics', 'biology', 'chemistry', 'government', 'economics']

function About() {
  const { totals } = Route.useLoaderData()
  const features = [
    {
      title: `${totals.subjects} WASSCE subjects, topic by topic`,
      body: `Science, Arts, Commercial and Technical subjects, broken down into ${totals.topics} syllabus topics, with ${totals.lessons} lessons so far.`,
    },
    { title: 'Lessons with diagrams and properly rendered maths', body: 'Step-by-step explanations written for clarity, not for filler.' },
    { title: 'Exam-style practice, marked instantly', body: 'Original WASSCE-style questions written to the syllabus, with the full working and why each wrong option is wrong.' },
    { title: 'Step-by-step study support', body: 'Ask WASSCE questions in plain English and get clear explanations to support your revision.' },
    { title: 'Built for any Android phone', body: 'Made for patchy data and shared phones.' },
    { title: 'Pay with Orange Money or AfriMoney', body: `${PLANS.map((p) => `${p.priceNle} NLe for ${p.length}`).join(' or ')}. No card needed.` },
  ]

  return (
    <article className="about-page site-page space-y-16 pb-12 sm:space-y-20">
      <header className="about-hero">
        <div className="about-hero-copy">
          <p className="about-eyebrow"><MapPin aria-hidden /> Freetown, Sierra Leone</p>
          <h1>Built here.<br /><em>For the next generation.</em></h1>
          <p className="about-hero-lede">
            WASSCE Tutor is a WASSCE preparation platform made specifically for students sitting the West African Senior School Certificate Examination in Sierra Leone. We focus on what local students actually need, not generic global content.
          </p>
          <div className="about-hero-actions">
            <Link to="/auth">Create a free account <span aria-hidden>↗</span></Link>
            <a href="/wassce/subjects">Explore the subjects</a>
          </div>
          <div className="about-origin-note"><span /> Designed and maintained in Sierra Leone</div>
        </div>
        <div className="about-hero-art" aria-label="WASSCE subject areas">
          <div className="about-cover about-cover-one"><SubjectCover slug="biology" shape="thumb" className="h-full w-full" rounded="rounded-2xl" /></div>
          <div className="about-cover about-cover-two"><SubjectCover slug="mathematics" shape="thumb" className="h-full w-full" rounded="rounded-2xl" /></div>
          <div className="about-cover about-cover-three"><SubjectCover slug="chemistry" shape="thumb" className="h-full w-full" rounded="rounded-2xl" /></div>
          <div className="about-cover about-cover-four"><SubjectCover slug="english-language" shape="thumb" className="h-full w-full" rounded="rounded-2xl" /></div>
          <div className="about-art-label"><span>LOCAL CONTEXT</span><strong>Learning built around the WASSCE syllabus.</strong></div>
        </div>
        <div className="about-stats" aria-label="WASSCE Tutor in numbers">
          <div><strong>{totals.subjects}</strong><span>Subjects</span></div>
          <div><strong>{totals.topics}</strong><span>Syllabus topics</span></div>
          <div><strong>{totals.lessons}</strong><span>Published lessons</span></div>
          <p>Live curriculum coverage</p>
        </div>
      </header>

      <section className="about-mission-section">
        <div className="about-section-heading">
          <p className="about-eyebrow">WHY WE EXIST</p>
          <h2>Good preparation<br /><em>should be within reach.</em></h2>
        </div>
        <div className="about-mission-copy">
          <p>
            WASSCE is the gate that decides whether a Sierra Leonean student gets into university, secures a scholarship,
            or starts their working life on the right footing. Yet most preparation materials available to students are
            imported from Ghana or Nigeria, miss the Sierra Leone context, or sit behind expensive textbooks and private
            tutors that families can’t always afford.
          </p>
          <p>
            We built WASSCE Tutor to change that. A free account opens every subject, and one small payment unlocks every practice set,
            and clear study support that fits how Sierra Leonean students learn.
          </p>
        </div>
      </section>

      <section className="about-product-section">
        <div className="about-section-heading about-product-heading">
          <div><p className="about-eyebrow">THE LEARNING EXPERIENCE</p><h2>Everything connected<br /><em>to your exam goals.</em></h2></div>
          <p>One platform for understanding the syllabus, practising what you learn and getting help when you need it.</p>
        </div>
        <div className="about-subject-ribbon" aria-hidden>
          {COVER_ROW.map((slug) => (
            <div key={slug}><SubjectCover slug={slug} shape="thumb" className="aspect-[5/4] w-full" rounded="rounded-xl" /></div>
          ))}
        </div>
        <div className="about-feature-grid">
          {features.map(({ title, body }, index) => (
            <div key={title} className="about-feature-card">
              <span className="about-feature-number">0{index + 1}</span>
              <span className="about-feature-check"><Check aria-hidden /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-local-section">
        <div className="about-local-mark"><MapPin aria-hidden /></div>
        <div><p className="about-eyebrow">MADE FOR SIERRA LEONE</p><h2>Built around the realities of learning here.</h2>
          <p>WASSCE Tutor is built and maintained in Freetown by a Sierra Leonean developer who understands the realities of studying for WAEC here: limited textbook access, expensive data, shared devices, unreliable power. Every product decision, from the small app size to the flat pricing, is made with these constraints in mind.</p>
          <p>We are not a global ed-tech company adapting content for Africa. We are a local team building for our own market.</p>
        </div>
      </section>

      <section className="site-card overflow-hidden" aria-labelledby="founder-heading">
        <div className="grid md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div className="relative bg-muted">
            <img
              src="/img/about/founder-mohamed-bangura.webp"
              srcSet="/img/about/founder-mohamed-bangura-320.webp 320w, /img/about/founder-mohamed-bangura.webp 640w"
              sizes="(min-width: 768px) 352px, 100vw"
              alt="Mohamed Bangura, founder and developer of WASSCE Tutor"
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] h-full w-full object-cover object-[50%_22%] md:aspect-auto md:min-h-[22rem]"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="about-eyebrow">THE PERSON BEHIND THE PLATFORM</p>
            <h2 id="founder-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Mohamed Bangura</h2>
            <p className="mt-1.5 text-sm font-bold text-primary">Founder &amp; Developer, WASSCE Tutor</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              WASSCE Tutor is built and maintained by a Sierra Leonean developer focused on making structured, locally relevant WASSCE preparation more accessible to students across the country.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="https://www.linkedin.com/in/mohamed-bangura-6b209944a/" target="_blank" rel="noopener noreferrer" className="site-btn site-btn-secondary">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.56 9h3.554v11.452H3.56zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
                Connect on LinkedIn
              </a>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground"><MapPin className="h-4 w-4" aria-hidden /> Freetown, Sierra Leone</span>
            </div>
          </div>
        </div>
      </section>

      {PHOTO_CREDITS.length > 0 && (
        <section id="photo-credits" className="about-credits scroll-mt-20">
          <div><p className="about-eyebrow">IMAGE SOURCES</p><h2>Photo credits</h2><p>Every photo on the site is credited here. Photos are used under open licences that allow commercial use, or with credit to the institution that published them. They have been cropped and compressed for the web.</p></div>
          <details className="about-credits-details">
            <summary>View image credits <span aria-hidden>＋</span></summary>
            <ul>
              {PHOTO_CREDITS.map(([slug, p]) => (
                <li key={slug}>
                  <span className="font-semibold text-foreground">{p.subject}:</span> {p.caption}, by{' '}
                  {p.credit.creatorUrl ? <a href={p.credit.creatorUrl} rel="noopener">{p.credit.creator}</a> : p.credit.creator}
                  {' '}via <a href={p.credit.sourceUrl} rel="noopener">{p.credit.source}</a>,{' '}
                  {p.credit.licenseUrl ? <a href={p.credit.licenseUrl} rel="noopener license">{p.credit.license}</a> : p.credit.license}
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}

      <section className="about-contact">
        <span className="about-contact-icon"><Mail aria-hidden /></span>
        <div><p className="about-eyebrow">TALK TO THE TEAM</p><h2>Questions, feedback or partnerships?</h2><p>{`WhatsApp ${CONTACT.phoneDisplay} or ${CONTACT.email}.`}</p></div>
        <a href="/contact">Get in touch <span aria-hidden>↗</span></a>
      </section>

      <section className="about-final-cta">
        <p className="about-eyebrow">YOUR NEXT STEP STARTS HERE</p>
        <h2>Make your preparation<br /><em>count.</em></h2>
        <p>{`Free to start, no card needed. Everything from ${FROM_PRICE} NLe, and plans never renew automatically.`}</p>
        <div><Link to="/auth">Create a free account <span aria-hidden>↗</span></Link><a href="/wassce/subjects">Browse subjects</a></div>
      </section>
    </article>
  )
}
