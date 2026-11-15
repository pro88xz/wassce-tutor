import { createFileRoute, Link } from '@tanstack/react-router'
import { publicHead } from '@/lib/seo'
import { CONTACT } from '@/lib/contact'

export const Route = createFileRoute('/privacy')({
  head: publicHead('/privacy'),
  ssr: true, // prerendered to static HTML at build time
  component: Privacy,
})

function Privacy() {
  return (
    <div className="app-page app-page-legal mx-auto w-full max-w-5xl space-y-4 pb-12">
      <header className="space-y-3 pb-4 pt-2">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: 15 November 2026</p>
      </header>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <p className="text-muted-foreground">
          WASSCE Tutor (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a WASSCE preparation platform operated from Freetown, Sierra Leone. This Privacy Policy explains what information we collect when you use our website or Android app, how we use it, and the choices you have.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Information we collect</h2>
        <p className="text-muted-foreground">
          When you create an account, we collect your email address, your name (if you provide one), and the WAEC faculty and subjects you choose during onboarding. We use this to personalise your study experience and to keep your account secure.
        </p>
        <p className="text-muted-foreground">
          When you use the app, we record your lesson views, paper attempts, scores, and tutor questions. This lets us show your progress, recommend lessons, and improve the platform. We do not sell this data to third parties.
        </p>
        <p className="text-muted-foreground">
          When you download the Android app, we record the timestamp and the device&rsquo;s browser user agent so we can measure interest. This information cannot personally identify you.
        </p>
        <p className="text-muted-foreground">
          When you subscribe, we record your payment method (Orange Money or AfriMoney), the plan, and the transaction status. We do not store your full mobile money credentials &mdash; those are handled by the payment provider.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">How we store your data</h2>
        <p className="text-muted-foreground">
          Your data is stored on Supabase, a third-party platform that hosts our database and authentication. Supabase is GDPR-compliant and uses industry-standard encryption. We do not store any of your data on our personal devices.
        </p>
        <p className="text-muted-foreground">
          Questions you submit to the study tutor are sent to Groq, an external response-generation provider. Groq states that it does not retain your questions for model training. Your questions are tied to your account in our database so you can view your history.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Emails we send</h2>
        <p className="text-muted-foreground">
          We send account emails about your plan, such as a confirmation when your access starts and a reminder before it ends. These are part of the service.
        </p>
        <p className="text-muted-foreground">
          If you agree to study tips and reminders, we also send occasional emails based on how you use WASSCE Tutor: for example, a reminder after a week without studying, or a note if a payment you started was not completed. To choose who to email, we look at when you last signed in or studied, which subject you studied last, and your plan and payment status. We send at most two of these emails in any week, and we record when a link in them is clicked so we can tell which emails help.
        </p>
        <p className="text-muted-foreground">
          Every one of these emails has an unsubscribe link, and you can turn them off at any time under Account &rarr; Preferences. Emails are delivered by Resend, an email delivery provider, which receives your email address and the message only to deliver it.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Who can see your data</h2>
        <p className="text-muted-foreground">
          Only you can see your full account data when signed in. The WASSCE Tutor operator can access anonymised usage statistics to understand which lessons and subjects students engage with most. Individual student responses are not shared with anyone outside the platform.
        </p>
        <p className="text-muted-foreground">
          We do not share your data with advertisers. We do not run third-party advertising on this platform.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Your rights</h2>
        <p className="text-muted-foreground">
          You can request a copy of the data we hold about you, ask us to correct any of it, or request that we delete your account and all associated data. Email us via the Contact link below.
        </p>
        <p className="text-muted-foreground">
          To delete your account, contact us and we will permanently remove your data within 30 days of your request.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Cookies and tracking</h2>
        <p className="text-muted-foreground">
          We use a single first-party cookie to keep you signed in across sessions. We do not use third-party tracking cookies, advertising pixels, or analytics that follow you across other websites.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Children</h2>
        <p className="text-muted-foreground">
          WAEC students are typically aged 16&ndash;19. If you are under 18, please use WASSCE Tutor with the knowledge and supervision of a parent or guardian. We do not knowingly collect data from children under 13.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Changes to this policy</h2>
        <p className="text-muted-foreground">
          We may update this policy from time to time. If we make material changes, we will notify users via the app or email. Continued use after a change means you accept the updated policy.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight">Contact</h2>
        <p className="text-muted-foreground">
          Questions about this policy?{' '}
          <a href={`mailto:${CONTACT.email}`} className="font-semibold text-primary hover:underline">
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
