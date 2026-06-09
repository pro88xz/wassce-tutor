import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-12">
      <header className="space-y-3 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">About</p>
        <h1 className="text-4xl font-black tracking-tight">
          Built in Sierra Leone, for Sierra Leonean students.
        </h1>
        <p className="text-muted-foreground text-lg">
          WASSCE Tutor is a WASSCE preparation platform made specifically for students sitting the West African Senior School Certificate Examination in Sierra Leone. We focus on what local students actually need &mdash; not generic global content.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Why we exist</h2>
        <p className="text-muted-foreground">
          WASSCE is the gate that decides whether a Sierra Leonean student gets into university, secures a scholarship, or starts their working life on the right footing. Yet most preparation materials available to students are imported from Ghana or Nigeria, miss the Sierra Leone context, or sit behind expensive textbooks and private tutors that families can&rsquo;t always afford.
        </p>
        <p className="text-muted-foreground">
          We built WASSCE Tutor to change that. One affordable subscription unlocks every subject, every past paper, every lesson, and an AI tutor that explains things in a way that fits how Sierra Leonean students learn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What you get</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-foreground mt-0.5">&bull;</span>
            <span><strong className="text-foreground">All 18 WAEC subjects</strong> across Science, Arts, Commercial, and Technical faculties &mdash; covering the official Sierra Leone WAEC syllabus.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground mt-0.5">&bull;</span>
            <span><strong className="text-foreground">Lessons with diagrams and properly rendered math.</strong> Step-by-step explanations for every topic, written for clarity, not for filler.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground mt-0.5">&bull;</span>
            <span><strong className="text-foreground">Past WAEC papers, scored instantly.</strong> Practice the way you&rsquo;ll be tested. See exactly which questions you got wrong and why.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground mt-0.5">&bull;</span>
            <span><strong className="text-foreground">AI Tutor.</strong> Ask any WASSCE question in plain English and get a clear, syllabus-aligned answer in seconds.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground mt-0.5">&bull;</span>
            <span><strong className="text-foreground">Works offline-friendly on any Android phone.</strong> Built for patchy data and shared phones.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground mt-0.5">&bull;</span>
            <span><strong className="text-foreground">Pay with Orange Money or AfriMoney.</strong> No card needed. Plans start at 25 NLe / month.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Made for Sierra Leone</h2>
        <p className="text-muted-foreground">
          WASSCE Tutor is built and maintained in Freetown by a Sierra Leonean developer who understands the realities of studying for WAEC here: limited textbook access, expensive data, shared devices, unreliable power. Every product decision &mdash; from the small APK size to the flat monthly pricing &mdash; is made with these constraints in mind.
        </p>
        <p className="text-muted-foreground">
          We are not a global ed-tech company adapting content for Africa. We are a local team building for our own market.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Get in touch</h2>
        <p className="text-muted-foreground">
          Questions, feedback, or partnership inquiries?{' '}
          <a href="mailto:secretsafe.cc@gmail.com" className="font-semibold text-primary hover:underline">
            Contact us
          </a>
          .
        </p>
      </section>

      <section className="text-center space-y-3 border-t pt-12">
        <h2 className="text-2xl font-bold">Ready to start?</h2>
        <p className="text-muted-foreground">7 days free. No card. Cancel anytime.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/auth">
            <Button className="h-12 px-8 text-base">Start your free trial</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="h-12 px-8 text-base">Back to home</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
