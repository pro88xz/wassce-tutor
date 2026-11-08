import { ArrowRight, BookOpen, CheckCircle2, MessageCircleQuestion, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    label: 'UNDERSTAND',
    title: 'Learn each topic in clear steps.',
    body: 'Work through syllabus-led lessons with explanations, worked examples, diagrams and properly typeset mathematics.',
    Icon: BookOpen,
  },
  {
    number: '02',
    label: 'APPLY',
    title: 'Practise what you have learned.',
    body: 'Answer original WASSCE-style questions, check your answers and study the reasoning behind each solution.',
    Icon: CheckCircle2,
  },
  {
    number: '03',
    label: 'GET SUPPORT',
    title: 'Ask when a concept is unclear.',
    body: 'Use the AI tutor to ask follow-up questions and get a step-by-step explanation when you need another way into a topic.',
    Icon: MessageCircleQuestion,
  },
  {
    number: '04',
    label: 'BUILD MOMENTUM',
    title: 'Keep track of your preparation.',
    body: 'See your completed lessons and practice activity so you can decide what to study next and where to focus revision.',
    Icon: TrendingUp,
  },
]

/** A clear explanation of the learning cycle, without fabricated product screenshots. */
export function ProductTour() {
  return (
    <section className="product-tour-section" aria-labelledby="tour-heading">
      <div className="product-tour-editorial">
        <div className="product-tour-intro">
          <p className="text-sm font-semibold text-primary">The learning method</p>
          <h2 id="tour-heading">Preparation that moves from understanding to confidence.</h2>
          <p>Good exam preparation is more than reading notes. Learn a concept, apply it, get help when you are stuck and use your progress to guide the next study session.</p>
          <a href="/wassce/subjects" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">
            Explore the syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <ol className="product-tour-steps">
          {STEPS.map(({ number, label, title, body, Icon }) => (
            <li key={number} className="product-tour-step">
              <div className="product-tour-step-top">
                <span className="product-tour-number">{number}</span>
                <span className="product-tour-step-icon"><Icon aria-hidden /></span>
              </div>
              <p className="product-tour-step-label">{label}</p>
              <h3>{title}</h3>
              <p className="product-tour-step-body">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
