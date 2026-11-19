// The building blocks of a blog article beyond plain paragraphs: key figures,
// a dated updates log, sections with charts and tables, and reader questions.
// Content comes from src/content/editorial*.ts; see the types there.
import type { BlogPost, EditorialFigure, EditorialSection, EditorialTable } from '@/content/editorial'

/**
 * Article text with links: "[label](/path)" becomes a link. Site paths stay in
 * the tab; outside addresses open in a new one. Everything else is plain text.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (!m) return part
        const external = /^https?:/.test(m[2])
        return <a key={i} href={m[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">{m[1]}</a>
      })}
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- a plain date helper the article page shares
export function longDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** The headline figures, each one stated in the post's sources. */
export function KeyFacts({ facts }: { facts: NonNullable<BlogPost['keyFacts']> }) {
  return (
    <section aria-label="Key figures" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="rounded-2xl border bg-card p-4 sm:p-5">
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">{fact.value}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{fact.label}</p>
        </div>
      ))}
    </section>
  )
}

/** What has changed since the story was first published, newest first. */
export function Updates({ updates }: { updates: NonNullable<BlogPost['updates']> }) {
  return (
    <section aria-labelledby="updates-heading" className="mb-10 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
      <h2 id="updates-heading" className="text-xs font-bold uppercase tracking-[.16em] text-amber-900">Latest updates</h2>
      <ol className="mt-4 space-y-4">
        {updates.map((u) => (
          <li key={u.date + u.text.slice(0, 24)} className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-4">
            <time dateTime={u.date} className="text-sm font-semibold text-amber-950">{longDate(u.date)}</time>
            <p className="text-[15px] leading-7 text-slate-700"><Rich text={u.text} /></p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ArticleSection({ section, id }: { section: EditorialSection; id: string }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
      {section.paragraphs && <div className="mt-4 space-y-4 text-[16px] leading-8 text-muted-foreground">{section.paragraphs.map((p, j) => <p key={j}><Rich text={p} /></p>)}</div>}
      {section.bullets && <ul className="mt-4 space-y-3">{section.bullets.map((b, j) => <li key={j} className="flex gap-3 text-[15px] leading-7 text-muted-foreground"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"/><span><Rich text={b} /></span></li>)}</ul>}
      {section.figure && <Figure figure={section.figure} />}
      {section.table && <DataTable table={section.table} />}
      {section.after && <div className="mt-6 space-y-4 text-[16px] leading-8 text-muted-foreground">{section.after.map((p, j) => <p key={j}><Rich text={p} /></p>)}</div>}
    </section>
  )
}

/** A chart or photograph. Charts carry their source in the caption; photo credits live on the About page. */
function Figure({ figure }: { figure: EditorialFigure }) {
  const small = figure.image.replace(/\.webp$/, '-640.webp')
  return (
    <figure className="mt-6">
      <img
        src={figure.image}
        srcSet={`${small} 640w, ${figure.image} 1200w`}
        sizes="(min-width: 1024px) 700px, 100vw"
        width={figure.width}
        height={figure.height}
        alt={figure.alt}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-2xl border bg-white"
      />
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{figure.caption}</figcaption>
    </figure>
  )
}

function DataTable({ table }: { table: EditorialTable }) {
  return (
    <figure className="mt-6">
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full border-collapse text-left text-[14px] leading-6">
          <caption className="border-b bg-slate-50 px-3 py-3 text-left text-sm font-semibold text-foreground sm:px-4">{table.caption}</caption>
          <thead>
            <tr className="border-b">
              {table.columns.map((c, i) => <th key={c} scope="col" className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:px-4 ${i > 0 ? 'whitespace-nowrap text-right' : ''}`}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="border-b last:border-b-0">
                {row.map((cell, i) => i === 0
                  ? <th key={i} scope="row" className="px-3 py-2.5 font-medium text-foreground sm:px-4">{cell}</th>
                  : <td key={i} className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-foreground sm:px-4">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{table.note}</figcaption>}
    </figure>
  )
}

export function Faq({ items }: { items: NonNullable<BlogPost['faq']> }) {
  return (
    <section id="questions" className="mt-12 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight">Questions readers ask</h2>
      <div className="mt-5 divide-y rounded-2xl border bg-card">
        {items.map((item) => (
          <details key={item.question} className="group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold leading-snug text-foreground">
              <h3 className="text-[16px]">{item.question}</h3>
              <span aria-hidden className="mt-0.5 text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground"><Rich text={item.answer} /></p>
          </details>
        ))}
      </div>
    </section>
  )
}
