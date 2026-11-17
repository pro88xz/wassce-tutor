// Local fit: the four ways the product is shaped around studying in Sierra
// Leone, as a bento of tiles of different sizes rather than four identical
// cards. Each shows the thing instead of describing it: a phone with a lesson
// on it (any phone browser, weak signal), the mobile-money USSD code, the
// reading theme by day and by night, and the syllabus order. The band ends
// with who builds it: the founder, by name, as on the About page, under the
// Sierra Leone flag's green, white and blue.
import { ArrowRight, Check, Moon, Sun, Wifi } from 'lucide-react'
import { Band, SectionHeading } from '@/components/public/Section'

/** Sierra Leone's flag, as a thin stripe. */
// The white third is a faint grey, so it reads on the white card.
const FLAG = 'linear-gradient(90deg, #1eb53a 0 33.3%, #e8ecf2 33.3% 66.6%, #0072c6 66.6%)'

export function LocalBand() {
  return (
    <Band tone="white" labelledBy="local-heading">
      <SectionHeading id="local-heading" eyebrow="Made in Freetown" title={<>Built for how students <span className="site-accent text-[var(--primary)]">here</span> study.</>} />

      <ul className="mt-9 grid grid-cols-2 gap-3.5 sm:gap-5 lg:mt-12 lg:grid-cols-12">
        {/* Any phone: the big tile. */}
        <li data-reveal className="relative col-span-2 flex min-h-[22rem] overflow-hidden rounded-[26px] bg-[var(--site-ink)] text-white shadow-[var(--site-shadow-card)] lg:col-span-6 lg:row-span-2 lg:min-h-0">
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(34rem_24rem_at_100%_100%,rgba(124,77,255,.45),transparent_60%)]" />
          <div className="relative z-10 flex max-w-[15rem] flex-col p-6 sm:max-w-[17rem] sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/85 ring-1 ring-white/15">
              <Wifi className="h-3.5 w-3.5" aria-hidden /> Weak signal? Still loads
            </span>
            <h3 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight sm:text-[1.75rem]">Built for your phone</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">Any phone browser, low-cost Androids, patchy data.</p>
          </div>
          <PhoneVisual />
        </li>

        {/* Mobile money: the wide tile. */}
        <li data-reveal="1" className="site-card col-span-2 flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:col-span-6">
          <div className="min-w-0">
            <h3 className="text-xl font-extrabold tracking-tight sm:text-[1.4rem]">Pay the local way</h3>
            <p className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-muted-foreground">Orange Money or AfriMoney. No card, no automatic renewal.</p>
          </div>
          <PayVisual />
        </li>

        <li data-reveal="2" className="site-card col-span-1 flex flex-col overflow-hidden lg:col-span-3">
          <div aria-hidden className="flex h-32 items-center justify-center bg-[linear-gradient(135deg,#f4f0ff,#fff7e6)] sm:h-36">
            <NightVisual />
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="text-[15px] font-bold leading-snug sm:text-lg">Late-night reading mode</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">A low-glare theme for studying after dark.</p>
          </div>
        </li>

        <li data-reveal="3" className="site-card col-span-1 flex flex-col overflow-hidden lg:col-span-3">
          <div aria-hidden className="flex h-32 items-center justify-center bg-[linear-gradient(135deg,#eefaf3,#f4f0ff)] px-3 sm:h-36">
            <SyllabusVisual />
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="text-[15px] font-bold leading-snug sm:text-lg">Written to the syllabus</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">Every topic, in the order you will study it.</p>
          </div>
        </li>
      </ul>

      {/* Who is behind the platform. The wording is the About page's own. */}
      <div data-reveal className="site-card relative mt-5 overflow-hidden sm:mt-6">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: FLAG }} />
        <div className="flex flex-col gap-5 p-6 pt-7 sm:flex-row sm:items-center sm:gap-7 sm:p-8 sm:pt-9">
          <img
            src="/img/about/founder-mohamed-bangura-320.webp"
            alt="Mohamed Bangura, founder and developer of WASSCE Tutor"
            width={320}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-20 w-20 shrink-0 rounded-2xl object-cover object-[50%_22%] shadow-[0_14px_28px_-16px_rgba(30,20,80,.6)] ring-4 ring-[var(--brand-soft)]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-muted-foreground">Made in Sierra Leone</p>
            <p className="mt-1.5 text-lg font-bold leading-snug tracking-tight sm:text-xl">Built and run in Freetown, for students across Sierra Leone.</p>
            <p className="mt-1.5 text-sm">
              <span className="font-bold">Mohamed Bangura</span>
              <span className="text-muted-foreground"> · Founder and developer</span>
            </p>
          </div>
          <a href="/about" className="site-btn site-btn-secondary shrink-0 self-start sm:self-auto">
            About WASSCE Tutor <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </Band>
  )
}

/** A phone rising from the corner of the tile, with a lesson and a question on it. */
function PhoneVisual() {
  return (
    <div aria-hidden className="pointer-events-none absolute -bottom-14 right-5 w-[11.5rem] rotate-[8deg] sm:right-10 sm:w-[13rem] lg:right-8">
      <div className="rounded-[2.1rem] bg-[#2b2547] p-2 shadow-[0_40px_70px_-30px_rgba(0,0,0,.8)] ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[1.65rem] bg-white text-slate-900">
          <div className="flex justify-center pt-2">
            <span className="h-1.5 w-12 rounded-full bg-slate-200" />
          </div>
          <div className="px-3.5 pb-16 pt-2.5">
            <p className="text-[8px] font-bold uppercase tracking-[.14em] text-violet-700">Mathematics · Lesson</p>
            <p className="mt-0.5 text-[11.5px] font-extrabold leading-tight">Percentage of a quantity, increase, decrease and error</p>
            <span className="mt-2 block h-1.5 w-full rounded-full bg-slate-200" />
            <span className="mt-1 block h-1.5 w-11/12 rounded-full bg-slate-200" />
            <span className="mt-1 block h-1.5 w-4/5 rounded-full bg-slate-200" />
            <div className="mt-2.5 rounded-lg bg-violet-50 p-2 ring-1 ring-violet-100">
              <p className="text-[8px] font-bold text-violet-800">Worked example</p>
              <p className="mt-0.5 text-[9px] font-semibold leading-snug">Profit = Le 720 − Le 640 = Le 80</p>
            </div>
            <p className="mt-2.5 text-[9px] font-bold leading-snug">Find her percentage profit.</p>
            <div className="mt-1.5 flex gap-1.5">
              {['A', 'B', 'C', 'D'].map((l) => (
                <span
                  key={l}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold ${
                    l === 'B' ? 'sheet-bubble is-shaded border-[#23202b] text-transparent' : 'border-[#d23f6a]/70 text-[#d23f6a]'
                  }`}
                >
                  {l}
                </span>
              ))}
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-emerald-700">
              <Check className="h-2.5 w-2.5" strokeWidth={3} /> 12.5%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The USSD code a student dials, and the two wallets it works with. */
function PayVisual() {
  return (
    <div aria-hidden className="flex shrink-0 flex-col items-start gap-2.5 sm:items-end">
      <span className="rounded-2xl bg-[var(--site-ink)] px-4 py-2.5 font-mono text-xl font-bold tracking-wider text-white shadow-[0_16px_30px_-16px_rgba(19,13,43,.8)] sm:text-2xl">*715*•••#</span>
      <span className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-900/5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff7900]" /> Orange Money
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-900/5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e4002b]" /> AfriMoney
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
    <div className="flex -rotate-2 overflow-hidden rounded-xl shadow-[0_18px_34px_-18px_rgba(30,20,80,.55)] ring-1 ring-slate-900/10">
      <div className="bg-white px-3.5 py-3">
        <Sun className="mb-2 h-4 w-4 text-amber-500" />
        {lines('bg-slate-300')}
      </div>
      <div className="bg-[#14121f] px-3.5 py-3">
        <Moon className="mb-2 h-4 w-4 text-[#ffd166]" />
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
    <ol className="w-full max-w-[11.5rem] space-y-1.5">
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
