import { createFileRoute, Link } from '@tanstack/react-router'
import { publicHead } from '@/lib/seo'

export const Route = createFileRoute('/terms')({
  head: publicHead('/terms'),
  ssr: true, // prerendered to static HTML at build time
  component: Terms,
})

function Terms() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-12">
      <header className="space-y-3 pb-4 pt-2">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: 8 June 2026</p>
      </header>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <p className="text-muted-foreground">
          By creating an account or using WASSCE Tutor, you agree to these Terms. Please read them carefully.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Account &amp; eligibility</h2>
        <p className="text-muted-foreground">
          You are responsible for keeping your account credentials secure. You must provide accurate information when signing up. One person per account. If you are under 18, you should use WASSCE Tutor with the knowledge of a parent or guardian.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Subscription &amp; payment</h2>
        <p className="text-muted-foreground">
          A free account gives access to every subject&rsquo;s syllabus, the first lesson of every topic and a starter practice set in every subject, with no time limit. Full access to every lesson, every practice set and the AI tutor needs a paid plan: the Term pass (10 NLe for 4 months) or the Academic year (25 NLe for 12 months), counted from the day the payment is confirmed. Payments are processed by Monime and can be made with Orange Money, AfriMoney and the other methods its checkout offers. Plans do not renew automatically: when a plan ends, the account returns to the free account and your progress is kept. Paying again while a plan is running adds the new time to the end of the current plan.
        </p>
        <p className="text-muted-foreground">
          Refunds are issued at our discretion. Contact us within 7 days of payment if you believe a refund is warranted.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Content &amp; intellectual property</h2>
        <p className="text-muted-foreground">
          All lessons, questions, explanations, diagrams, and other content on WASSCE Tutor are owned by WASSCE Tutor or licensed for use. You may use this content for your personal study. You may not copy, redistribute, republish, or commercially exploit any content without written permission.
        </p>
        <p className="text-muted-foreground">
          You may not share your account credentials with others or attempt to bypass the paywall. Doing so may result in account suspension without refund.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Acceptable use</h2>
        <p className="text-muted-foreground">
          Do not use WASSCE Tutor to harass others, post unlawful content, attempt to break or probe the platform&rsquo;s security, scrape content automatically, or submit prompts designed to extract content for commercial reuse. We reserve the right to suspend accounts that violate these rules.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">AI Tutor disclaimer</h2>
        <p className="text-muted-foreground">
          The AI Tutor is a study aid. It can make mistakes, especially on complex or ambiguous questions. Always cross-check important answers against your textbook, syllabus, or teacher. WASSCE Tutor is not responsible for any exam outcome based on Tutor responses.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Service availability</h2>
        <p className="text-muted-foreground">
          We work to keep WASSCE Tutor available at all times, but we do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, infrastructure issues, or factors outside our control. We are not liable for losses caused by service interruptions.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Limitation of liability</h2>
        <p className="text-muted-foreground">
          To the maximum extent permitted by law, WASSCE Tutor&rsquo;s liability to you for any claim related to the service is limited to the amount you have paid us in the 12 months preceding the claim.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Changes to these terms</h2>
        <p className="text-muted-foreground">
          We may update these Terms occasionally. If we make material changes, we will notify you through the app or by email. Continued use after a change means you accept the updated Terms.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Governing law</h2>
        <p className="text-muted-foreground">
          These Terms are governed by the laws of Sierra Leone. Any disputes will be resolved in the courts of Freetown.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Contact</h2>
        <p className="text-muted-foreground">
          Questions about these Terms?{' '}
          <a href="mailto:secretsafe.cc@gmail.com" className="font-semibold text-primary hover:underline">
            Contact us
          </a>
          .
        </p>
      </section>

      <section className="pt-4 border-t">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to home
        </Link>
      </section>
    </div>
  )
}
