import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Building2, Mail, MapPin, Users } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'
import { ADDRESS_LINE, CONTACT, whatsappChatLink } from '@/lib/contact'
import { publicHead } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: publicHead('/contact'),
  ssr: true, // prerendered to static HTML at build time
  component: Contact,
})

const TRAIL: [string, string][] = [
  ['Home', '/'],
  ['Contact', '/contact'],
]

const HELP: { title: string; href: string }[] = [
  { title: 'Plans and paying with Orange Money or AfriMoney', href: '/#plans' },
  { title: 'Book a one-to-one tutor', href: '/tutors' },
  { title: 'Browse WASSCE subjects', href: '/wassce/subjects' },
  { title: 'How we handle your information', href: '/privacy' },
]

function Contact() {
  return (
    <article className="app-page mx-auto w-full max-w-6xl space-y-12 pb-10">
      <div className="space-y-5">
        <Breadcrumbs trail={TRAIL} />
        <header className="space-y-3">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden /> {`${CONTACT.locality}, ${CONTACT.country}`}
          </p>
          <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-balance sm:text-[2.5rem]">Contact WASSCE Tutor</h1>
          <p className="max-w-2xl text-[17px] text-muted-foreground">
            Questions about your account, plans, payments or booking a tutor? Message us on WhatsApp or send an email.
          </p>
        </header>
      </div>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Ways to contact us">
        <a
          href={whatsappChatLink('Hello WASSCE Tutor, ')}
          target="_blank"
          rel="noopener"
          className="group flex flex-col gap-3 rounded-2xl bg-[#1a8d4a] p-6 text-white shadow-sm transition-shadow hover:shadow-lg"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <WhatsAppGlyph className="h-6 w-6" />
          </span>
          <span className="text-lg font-bold">WhatsApp</span>
          <span className="text-xl font-semibold tabular-nums tracking-tight">{CONTACT.phoneDisplay}</span>
          <span className="flex-1 text-sm text-white/85">The fastest way to reach us, for plans, payments and tutors.</span>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            Chat on WhatsApp <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </a>

        <a href={`mailto:${CONTACT.email}`} className="group flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <Mail className="h-6 w-6" aria-hidden />
          </span>
          <span className="text-lg font-bold">Email</span>
          <span className="break-all font-semibold text-primary">{CONTACT.email}</span>
          <span className="flex-1 text-sm text-muted-foreground">For account help, problem reports, schools and partnerships.</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
            Send an email <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </a>

        <a href={CONTACT.whatsappGroup} target="_blank" rel="noopener" className="group flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a8d4a]/10 text-[#1a8d4a]">
            <Users className="h-6 w-6" aria-hidden />
          </span>
          <span className="text-lg font-bold">WhatsApp group</span>
          <span className="font-semibold">WASSCE Tutor community</span>
          <span className="flex-1 text-sm text-muted-foreground">Join our group on WhatsApp for news and updates from WASSCE Tutor.</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#1a8d4a]">
            Join the group <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </a>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4 rounded-2xl border bg-card p-6" aria-labelledby="business-heading">
          <h2 id="business-heading" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Building2 className="h-5 w-5 text-primary" aria-hidden /> Business details
          </h2>
          <address className="not-italic">
            <dl className="space-y-3 text-[15px]">
              <div>
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="font-semibold">{CONTACT.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Location</dt>
                <dd className="font-semibold">{ADDRESS_LINE}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Phone (WhatsApp)</dt>
                <dd>
                  <a href={whatsappChatLink()} target="_blank" rel="noopener" className="font-semibold tabular-nums text-primary hover:underline">{CONTACT.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`} className="break-all font-semibold text-primary hover:underline">{CONTACT.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Who we serve</dt>
                <dd>WASSCE students across Sierra Leone, online. Home tutoring where a tutor is available.</dd>
              </div>
            </dl>
          </address>
          <p className="text-sm text-muted-foreground">WASSCE Tutor is an independent study service and is not affiliated with WAEC.</p>
        </section>

        <section className="space-y-4" aria-labelledby="help-heading">
          <h2 id="help-heading" className="text-xl font-bold tracking-tight">Find it faster</h2>
          <ul className="divide-y rounded-2xl border bg-card">
            {HELP.map((h) => (
              <li key={h.href}>
                <a href={h.href} className="flex min-h-14 items-center justify-between gap-3 px-5 py-3 font-semibold transition-colors hover:text-primary">
                  {h.title} <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Found a mistake in a lesson or question?{' '}
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Problem report: WASSCE Tutor')}`}
              className="font-semibold text-primary hover:underline"
            >
              Report a problem
            </a>{' '}
            and tell us the page.
          </p>
        </section>
      </div>
    </article>
  )
}
