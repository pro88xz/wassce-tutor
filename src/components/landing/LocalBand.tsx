// Local fit: the four ways the product is shaped around studying in Sierra
// Leone, as icon cards (no stock photographs). Two columns on phones, four above.
// The band ends with who builds it: the founder, by name, as on the About page.
import { ArrowRight, BookOpen, Moon, Smartphone, Wallet } from 'lucide-react'
import { Band, SectionHeading } from '@/components/public/Section'

const FEATURES = [
  { icon: Smartphone, title: 'Built for your phone', body: 'Works in any phone browser, on lower-cost Android devices and on patchy data.' },
  { icon: Wallet, title: 'Pay the local way', body: 'Pay with Orange Money or AfriMoney through a one-time Monime code. No card, no bank account, no renewal.' },
  { icon: Moon, title: 'Reading mode for late nights', body: 'A warm, low-glare theme for studying after dark.' },
  { icon: BookOpen, title: 'Written to the WASSCE syllabus', body: 'Topics follow the syllabus, grouped the way you will study them.' },
]

export function LocalBand() {
  return (
    <Band tone="deep" labelledBy="local-heading" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary/45 blur-[110px]" />
      <div className="relative">
        <SectionHeading
          id="local-heading"
          eyebrow="Made in Freetown"
          title="A learning platform shaped around how students here actually study."
          lede="Study on the devices you already use, follow the subjects you sit, and pay through a phone-based checkout. Every decision starts from the realities of preparing for WASSCE in Sierra Leone."
        />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <li key={title} data-reveal={i} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/12">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffd166]/15 ring-1 ring-[#ffd166]/30">
                <Icon className="h-5 w-5 text-[#ffd166]" aria-hidden />
              </span>
              <h3 className="site-h3 mt-4 text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">{body}</p>
            </li>
          ))}
        </ul>

        {/* Who is behind the platform. The wording is the About page's own. */}
        <div data-reveal className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/12 bg-white/[0.06] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:mt-10">
          <img
            src="/img/about/founder-mohamed-bangura-320.webp"
            alt="Mohamed Bangura, founder and developer of WASSCE Tutor"
            width={320}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-16 w-16 shrink-0 rounded-full object-cover object-[50%_22%] ring-2 ring-white/25"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] leading-relaxed text-white/85">
              WASSCE Tutor is built and maintained in Freetown by a Sierra Leonean developer, to make structured, locally relevant WASSCE preparation
              accessible to students across the country.
            </p>
            <p className="mt-2 text-sm">
              <span className="font-bold text-white">Mohamed Bangura</span>
              <span className="text-white/70"> · Founder and developer</span>
            </p>
          </div>
          <a href="/about" className="site-btn site-btn-glass shrink-0">
            About WASSCE Tutor <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </Band>
  )
}
