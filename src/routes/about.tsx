import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Library, Mail, MapPin, MessageCircle, Smartphone, Wallet } from 'lucide-react'
import { publicHead } from '@/lib/seo'
import { fetchLandingData } from '@/lib/public-content'

export const Route = createFileRoute('/about')({
  head: publicHead('/about'),
  ssr: true, // prerendered to static HTML at build time
  // Live subject/topic/lesson counts, baked into the prerendered page.
  loader: () => fetchLandingData(),
  staleTime: Infinity,
  component: About,
})

function About() {
  const { totals } = Route.useLoaderData()
  const features = [
    {
      icon: Library,
      title: `${totals.subjects} WASSCE subjects, topic by topic`,
      body: `Science, Arts, Commercial and Technical subjects, broken down into ${totals.topics} syllabus topics, with ${totals.lessons} lessons so far.`,
    },
    { icon: BookOpen, title: 'Lessons with diagrams and properly rendered maths', body: 'Step-by-step explanations written for clarity, not for filler.' },
    { icon: Library, title: 'Past WAEC papers, scored instantly', body: 'Practise the way you’ll be tested and see exactly which questions you got wrong and why.' },
    { icon: MessageCircle, title: 'AI Tutor', body: 'Ask any WASSCE question in plain English and get a clear, syllabus-aligned answer in seconds.' },
    { icon: Smartphone, title: 'Built for any Android phone', body: 'Made for patchy data and shared phones.' },
    { icon: Wallet, title: 'Pay with Orange Money or AfriMoney', body: 'No card needed. Plans start at 25 NLe a month.' },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-12">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-brand-strong p-7 text-white shadow-lg">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> Freetown, Sierra Leone
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Built in Sierra Leone, for Sierra Leonean students.</h1>
          <p className="text-lg text-white/90">
            WASSCE Tutor is a WASSCE preparation platform made specifically for students sitting the West African Senior
            School Certificate Examination in Sierra Leone. We focus on what local students actually need, not generic
            global content.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl border bg-border text-center shadow-sm" aria-label="WASSCE Tutor in numbers">
        {([[totals.subjects, 'subjects'], [totals.topics, 'topics'], [totals.lessons, 'lessons']] as const).map(([n, label]) => (
          <div key={label} className="bg-card px-3 py-5">
            <p className="text-3xl font-bold tabular-nums">{n}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Why we exist</h2>
        <p className="text-muted-foreground">
          WASSCE is the gate that decides whether a Sierra Leonean student gets into university, secures a scholarship,
          or starts their working life on the right footing. Yet most preparation materials available to students are
          imported from Ghana or Nigeria, miss the Sierra Leone context, or sit behind expensive textbooks and private
          tutors that families can&rsquo;t always afford.
        </p>
        <p className="text-muted-foreground">
          We built WASSCE Tutor to change that. One affordable subscription unlocks every subject, every past paper,
          every lesson, and an AI tutor that explains things in a way that fits how Sierra Leonean students learn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">What you get</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-bold">{title}</span>
                <span className="block text-sm text-muted-foreground">{body}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Made for Sierra Leone</h2>
        <p className="text-muted-foreground">
          WASSCE Tutor is built and maintained in Freetown by a Sierra Leonean developer who understands the realities of
          studying for WAEC here: limited textbook access, expensive data, shared devices, unreliable power. Every
          product decision, from the small app size to the flat monthly pricing, is made with these constraints in mind.
        </p>
        <p className="text-muted-foreground">
          We are not a global ed-tech company adapting content for Africa. We are a local team building for our own
          market.
        </p>
      </section>

      <section className="flex items-center gap-4 rounded-3xl border bg-card p-5 shadow-sm">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold">Get in touch</h2>
          <p className="text-sm text-muted-foreground">Questions, feedback, or partnership enquiries?</p>
        </div>
        <a href="mailto:secretsafe.cc@gmail.com" className="shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted">
          Contact us
        </a>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-brand-strong px-6 py-10 text-center text-white shadow-lg">
        <div className="relative space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Ready to start?</h2>
          <p className="text-white/85">7 days free. No card. Cancel anytime.</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link to="/auth" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 font-bold text-blue-700 shadow-lg sm:w-auto">
              Start your free trial
            </Link>
            <a href="/wassce/subjects" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white/15 px-8 font-semibold text-white ring-1 ring-white/30 sm:w-auto">
              Browse subjects
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
