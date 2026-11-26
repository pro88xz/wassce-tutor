// The parts every BeamPad guide is made of (src/routes/beampad.*-remote-*.tsx):
// the page frame with its byline, the short answer, "On this page", menu
// paths, the app card, the "which fix" table, questions, the closing call to
// action and links to the other guides. Their <head> tags come from
// src/content/beampad-guide-head.ts. One place, so every guide looks and
// reads alike.
import { Check, ChevronDown, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { BeamPadFooter, BeamPadHeader, PlayBadge } from '@/components/beampad/BeamPad'
import { Aurora, BeamPadMotion } from '@/components/beampad/Motion'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { BEAMPAD, BEAMPAD_GUIDES } from '@/content/beampad'
import type { GuidePath, Trail } from '@/content/beampad-guide-head'

/** The page: BeamPad's frame, the guide's title and byline, its content, other guides and the footer. */
export function GuidePage({ path, pageId, trail, title, byline, children }: { path: GuidePath; pageId: string; trail: Trail; title: string; byline: string; children: ReactNode }) {
  return (
    <div className="bp bp-calm">
      <Aurora />
      <BeamPadMotion />
      <a href="#main-content" className="bp-skip">Skip to content</a>
      <BeamPadHeader page={pageId} />
      <main id="main-content" className="bp-container relative z-[1] pt-10">
        <article className="mx-auto max-w-3xl">
          <header className="space-y-5">
            <Breadcrumbs trail={trail} tone="dark" />
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-[-0.03em] text-balance text-white sm:text-5xl">{title}</h1>
            <p className="text-sm text-[var(--bp-faint)]">
              By {BEAMPAD.developer}, the makers of BeamPad · {byline}
            </p>
          </header>
          {children}
          <OtherGuides current={path} />
        </article>
      </main>
      <BeamPadFooter page={pageId} />
    </div>
  )
}

export function ShortAnswer({ children }: { children: ReactNode }) {
  return (
    <div data-reveal className="bp-card bp-card-glow mt-8 p-6 sm:p-7">
      <h2 className="text-sm font-semibold tracking-[0.12em] text-[var(--bp-mint)] uppercase">The short answer</h2>
      <p className="mt-3 text-[1.075rem] leading-relaxed text-white">{children}</p>
    </div>
  )
}

export function OnThisPage({ items }: { items: [label: string, href: string][] }) {
  return (
    <nav aria-label="On this page" className="mt-8 text-[15px]">
      <p className="font-semibold text-white">On this page</p>
      <ol className="mt-2 grid gap-1 text-[var(--bp-muted)] sm:grid-cols-2">
        {items.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="inline-flex min-h-8 items-center hover:text-white">{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** A menu path on the TV, such as Settings › Network. */
export const Path = ({ steps }: { steps: string[] }) => <span className="bp-path">{steps.join(' › ')}</span>

/** An aside in the guide's mint note style. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="bp-note mt-8">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
      <p>{children}</p>
    </div>
  )
}

/** BeamPad in one line, with its Play button. */
export function AppCard({ pageId, placement }: { pageId: string; placement: string }) {
  return (
    <div className="bp-card mt-8 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
      <img src="/img/beampad/icon-192.webp" width={64} height={64} alt="" loading="lazy" className="rounded-[22%]" />
      <div className="flex-1">
        <p className="font-semibold text-white">BeamPad: TV keyboard, mouse and remote</p>
        <p className="mt-1 text-[15px] leading-snug text-[var(--bp-muted)]">Bluetooth, no Wi-Fi, nothing to install on the TV. Free on Google Play.</p>
      </div>
      <PlayBadge placement={placement} page={pageId} height={48} />
    </div>
  )
}

/** "Which fix for your situation": the guide's advice as a table. */
export function SituationTable({ rows }: { rows: [situation: string, fix: string][] }) {
  return (
    <>
      <section className="bp-prose mt-6" aria-labelledby="which">
        <h2 id="which">Which fix for your situation</h2>
      </section>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--bp-line)]">
        <table className="w-full border-collapse text-left text-[15px]">
          <thead className="bg-white/[0.04] text-white">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">Your situation</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Try this</th>
            </tr>
          </thead>
          <tbody className="text-[var(--bp-muted)]">
            {rows.map(([situation, fix]) => (
              <tr key={situation} className="border-t border-[var(--bp-line)] align-top">
                <th scope="row" className="px-5 py-4 font-medium text-white">{situation}</th>
                <td className="px-5 py-4">{fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function GuideFaq({ items }: { items: [question: string, answer: string][] }) {
  return (
    <section className="mt-16" aria-labelledby="questions">
      <h2 id="questions" className="scroll-mt-20 text-[1.75rem] font-bold tracking-tight text-white">Questions</h2>
      <div className="mt-6 space-y-3">
        {items.map(([q, a]) => (
          <details key={q} className="bp-faq group">
            <summary>
              <span>{q}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[var(--bp-faint)] transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/** The closing call to action. */
export function GuideCta({ pageId, title, points }: { pageId: string; title: string; points: string[] }) {
  return (
    <div data-reveal className="bp-cta mt-16">
      <h2 className="mx-auto max-w-xl text-2xl font-bold tracking-tight text-balance text-white sm:text-4xl">{title}</h2>
      <ul className="mx-auto mt-6 flex max-w-xl flex-col gap-2 text-left text-[15px] text-[var(--bp-muted)] sm:items-center">
        {points.map((t) => (
          <li key={t} className="flex gap-2.5">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <PlayBadge placement="guide_final" page={pageId} height={56} />
      </div>
      <p className="mt-5 text-sm">
        <a href="/beampad#compatibility" className="text-white/80 underline underline-offset-4 hover:text-white">See what BeamPad works with</a>
      </p>
    </div>
  )
}

/** Links to BeamPad's other guides. */
function OtherGuides({ current }: { current: string }) {
  const others = BEAMPAD_GUIDES.filter((g) => g.path !== current)
  if (others.length === 0) return null
  return (
    <nav aria-labelledby="more-guides" className="mt-16">
      <h2 id="more-guides" className="text-lg font-bold text-white">More guides</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {others.map((g) => (
          <li key={g.path}>
            <a href={g.path} className="bp-card block p-5 transition-colors hover:border-[rgba(139,122,255,0.4)]">
              <span className="block font-semibold text-white">{g.title}</span>
              <span className="mt-1 block text-sm leading-snug text-[var(--bp-muted)]">{g.blurb}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
