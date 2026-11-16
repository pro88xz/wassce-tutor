// Local fit: the four ways the product is shaped around studying in Sierra
// Leone, as light cards in the site's one card style. Each shows the thing
// instead of describing it: slow-data
// signal, the mobile-money USSD code, the reading theme in light and dark,
// and the syllabus order. The band ends with who builds it: the founder, by
// name, as on the About page.
import { ArrowRight, Check, Moon, Sun } from 'lucide-react'
import { Band, SectionHeading } from '@/components/public/Section'

const FEATURES = [
  { title: 'Built for your phone', body: 'Any phone browser, low-cost Androids, patchy data.', Visual: PhoneVisual },
  { title: 'Pay the local way', body: 'Orange Money or AfriMoney. No card, no renewal.', Visual: PayVisual },
  { title: 'Late-night reading mode', body: 'A low-glare theme for studying after dark.', Visual: NightVisual },
  { title: 'Written to the syllabus', body: 'Every topic, in the order you will study it.', Visual: SyllabusVisual },
]

export function LocalBand() {
  return (
    <Band labelledBy="local-heading">
      <div className="relative">
        <SectionHeading id="local-heading" eyebrow="Made in Freetown" title="Built for how students here study." />
        <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-12 lg:grid-cols-4">
          {FEATURES.map(({ title, body, Visual }, i) => (
            <li key={title} data-reveal={i} className="site-card flex flex-col overflow-hidden">
              <div aria-hidden className="flex h-28 items-center justify-center bg-[var(--brand-soft)]/70 px-3 sm:h-36">
                <Visual />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-[15px] font-bold leading-snug sm:text-lg">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Who is behind the platform. The wording is the About page's own. */}
        <div data-reveal className="site-card mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:mt-10">
          <img
            src="/img/about/founder-mohamed-bangura-320.webp"
            alt="Mohamed Bangura, founder and developer of WASSCE Tutor"
            width={320}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-16 w-16 shrink-0 rounded-full object-cover object-[50%_22%] ring-4 ring-[var(--brand-soft)]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] leading-relaxed">Built and run in Freetown, for students across Sierra Leone.</p>
            <p className="mt-2 text-sm">
              <span className="font-bold">Mohamed Bangura</span>
              <span className="text-muted-foreground"> · Founder and developer</span>
            </p>
          </div>
          <a href="/about" className="site-btn site-btn-secondary shrink-0">
            About WASSCE Tutor <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </Band>
  )
}

/** Signal bars with two of four lit: it still works on a weak signal. */
function PhoneVisual() {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="flex items-end gap-1.5">
        {[10, 16, 22, 28].map((h, i) => (
          <span key={h} className={`w-2.5 rounded-sm ${i < 2 ? 'bg-[var(--primary)]' : 'bg-slate-300/70'}`} style={{ height: h }} />
        ))}
      </span>
      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-900/5">Weak signal? Still loads</span>
    </div>
  )
}

/** The USSD code a student dials, and the two wallets it works with. */
function PayVisual() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="rounded-lg bg-[#1b1240] px-3 py-1.5 font-mono text-[15px] font-bold tracking-wide text-white shadow-lg sm:text-base">*715*•••#</span>
      <span className="flex flex-wrap justify-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-900/5 sm:text-[11px]">
          <span className="h-2 w-2 rounded-full bg-[#ff7900]" /> Orange Money
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-900/5 sm:text-[11px]">
          <span className="h-2 w-2 rounded-full bg-[#e4002b]" /> AfriMoney
        </span>
      </span>
    </div>
  )
}

/** One lesson line in the day theme and in the low-glare night theme. */
function NightVisual() {
  const lines = (tone: string) => (
    <>
      <span className={`block h-1.5 w-12 rounded-full ${tone}`} />
      <span className={`mt-1.5 block h-1.5 w-16 rounded-full ${tone}`} />
      <span className={`mt-1.5 block h-1.5 w-10 rounded-full ${tone}`} />
    </>
  )
  return (
    <div className="flex overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-900/10">
      <div className="bg-white px-3 py-2.5">
        <Sun className="mb-2 h-3.5 w-3.5 text-amber-500" />
        {lines('bg-slate-300')}
      </div>
      <div className="bg-[#14121f] px-3 py-2.5">
        <Moon className="mb-2 h-3.5 w-3.5 text-[#ffd166]" />
        {lines('bg-[#d8cfa8]/45')}
      </div>
    </div>
  )
}

/** The first Mathematics topics, in syllabus order. */
function SyllabusVisual() {
  const rows = [
    { n: 1, t: 'Number bases', done: true },
    { n: 2, t: 'Modular arithmetic', done: true },
    { n: 3, t: 'Fractions', done: false },
  ]
  return (
    <ol className="w-full max-w-[11rem] space-y-1.5">
      {rows.map(({ n, t, done }) => (
        <li key={n} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] font-semibold ${done ? 'bg-white text-slate-600 ring-1 ring-slate-900/5' : 'bg-[var(--primary)] text-white shadow-md'}`}>
          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-white text-[var(--primary)]'}`}>
            {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : n}
          </span>
          {t}
        </li>
      ))}
    </ol>
  )
}
