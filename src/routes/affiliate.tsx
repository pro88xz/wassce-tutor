import { createFileRoute, Link } from '@tanstack/react-router'
import { BadgePercent, Link2, Wallet } from 'lucide-react'
import { absoluteUrl, breadcrumbJsonLd, indexablePageTags, SITE } from '@/lib/seo'

export const Route = createFileRoute('/affiliate')({
  head: () => indexablePageTags({ path: '/affiliate', title: 'WASSCE Tutor Affiliate Programme | Earn from Student Referrals', description: 'Join the WASSCE Tutor affiliate programme. Share a tracked referral link and earn 50% of a referred student’s first verified subscription payment.', jsonLd: [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: 'WASSCE Tutor Affiliate Programme', url: absoluteUrl('/affiliate'), description: 'An approved referral partner programme for WASSCE Tutor.', mainEntity: { '@type': 'Service', name: 'WASSCE Tutor Partner Programme', serviceType: 'Affiliate referral programme', provider: { '@type': 'Organization', name: SITE.name, url: SITE.origin }, description: 'Approved partners receive 50% of a referred student’s first successfully verified subscription payment.' } },
    breadcrumbJsonLd([['Home','/'],['Affiliate programme','/affiliate']])
  ] }),
  component: AffiliateLanding,
})

function AffiliateLanding() {
  return (
    <main className="site-page space-y-10 pb-16">
      <section className="relative site-brand-panel overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">WASSCE Tutor partner programme</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Grow access to better WASSCE preparation. Earn from referrals.</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">Share WASSCE Tutor with your audience. Approved partners receive 50% of a referred student's first successfully verified subscription payment. Track referrals, reviewed commissions and payout requests in a dedicated workspace.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth" search={{ intent: 'affiliate' } as never} className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 text-sm font-bold text-[#21134d]">Join the affiliate programme</Link>
            <Link to="/affiliate-dashboard" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 px-5 text-sm font-semibold text-white">Affiliate sign in</Link>
          </div>
          <p className="mt-4 text-xs text-white/55">Applications are reviewed before referral links become active. Commissions are subject to payment verification and review.</p>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border bg-card p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-800"><Link2 className="h-5 w-5"/></span><h2 className="mt-4 text-lg font-bold">One tracked link</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your approved referral link attributes eligible new accounts before their first paid subscription.</p></article>
        <article className="rounded-2xl border bg-card p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><BadgePercent className="h-5 w-5"/></span><h2 className="mt-4 text-lg font-bold">50% first-payment commission</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">A commission is recorded only after the first subscription payment is successfully verified.</p></article>
        <article className="rounded-2xl border bg-card p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><Wallet className="h-5 w-5"/></span><h2 className="mt-4 text-lg font-bold">Clear payout tracking</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Follow pending and approved commissions, reserved balances and payout decisions from your own dashboard.</p></article>
      </section>
      <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><p className="text-sm font-semibold text-primary">A separate partner workspace</p><h2 className="mt-1 text-2xl font-bold">Your referrals. Your performance. Your payouts.</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Affiliate accounts are separate from student learning and tutor operations. You do not need a student dashboard to participate.</p></div>
        <Link to="/auth" search={{ intent: 'affiliate' } as never} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white">Create affiliate account</Link>
      </section>
      <p className="text-center text-sm text-muted-foreground">Looking to teach instead? <Link to="/become-a-tutor" className="font-semibold text-primary hover:underline">Apply as a tutor</Link>.</p>
    </main>
  )
}
