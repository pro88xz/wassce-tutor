import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, Mail, MapPin } from 'lucide-react'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { SUBJECT_PHOTOS } from '@/lib/subject-photos'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { TOPIC_PHOTOS } from '@/lib/topic-photos'
import { HOME_PHOTO_CREDITS } from '@/lib/home-photos'
import { publicHead } from '@/lib/seo'
import { CONTACT } from '@/lib/contact'
import { fetchLandingData } from '@/lib/public-content'

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
  ...HOME_PHOTO_CREDITS.map((h, i) => [`home-${i}`, { subject: h.label, caption: h.caption, credit: h.credit }] as const),
  ...Object.entries(TOPIC_PHOTOS)
    .sort((a, b) => a[1].topic.localeCompare(b[1].topic))
    .map(([key, p]) => [key, { subject: `${p.topic} (topic)`, caption: p.caption, credit: p.credit }] as const),
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
    { title: 'An AI tutor, any time', body: 'Ask any WASSCE question in plain English and get a clear, step-by-step answer, labelled as AI.' },
    { title: 'Built for any Android phone', body: 'Made for patchy data and shared phones.' },
    { title: 'Pay with Orange Money or AfriMoney', body: '10 NLe for a term or 25 NLe for a full academic year. No card needed.' },
  ]

  return (
    <article className="about-page mx-auto max-w-6xl space-y-16 pb-12 sm:space-y-20">
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
            every lesson, and an AI tutor that explains things in a way that fits how Sierra Leonean students learn.
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

      {PHOTO_CREDITS.length > 0 && (
        <section id="photo-credits" className="about-credits scroll-mt-20">
          <div><p className="about-eyebrow">IMAGE SOURCES</p><h2>Photo credits</h2><p>Subject photos are used under open licences that allow commercial use. They have been cropped and compressed for the web.</p></div>
          <details className="about-credits-details">
            <summary>View image credits <span aria-hidden>＋</span></summary>
            <ul>
              {PHOTO_CREDITS.map(([slug, p]) => (
                <li key={slug}>
                  <span className="font-semibold text-foreground">{p.subject}:</span> {p.caption}, by{' '}
                  {p.credit.creatorUrl ? <a href={p.credit.creatorUrl} rel="noopener">{p.credit.creator}</a> : p.credit.creator}
                  {' '}via <a href={p.credit.sourceUrl} rel="noopener">{p.credit.source}</a>,{' '}
                  <a href={p.credit.licenseUrl} rel="noopener license">{p.credit.license}</a>
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
        <p>Free to start, no card needed. Everything from 10 NLe, and plans never renew automatically.</p>
        <div><Link to="/auth">Create a free account <span aria-hidden>↗</span></Link><a href="/wassce/subjects">Browse subjects</a></div>
      </section>
    </article>
  )
}
