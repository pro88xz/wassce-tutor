// The question people search for, answered in a few sentences at the top of a
// public page (src/content/quick-answers.ts has the answers and why). A heading
// that is the question, then a short answer, is the shape featured snippets
// and AI answers quote. Plain HTML: it is in the prerendered page and needs no
// script.
import type { QuickAnswer as QuickAnswerData } from '@/content/quick-answers'

export function QuickAnswer({ qa, className = '' }: { qa: QuickAnswerData; className?: string }) {
  return (
    <section aria-labelledby="quick-answer" className={`rounded-2xl border border-primary/20 bg-brand-soft/40 p-5 sm:p-6 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Quick answer</p>
      <h2 id="quick-answer" className="mt-1.5 text-xl font-bold leading-snug text-balance">
        {qa.question}
      </h2>
      <p className="mt-2 text-[16px] leading-relaxed">{qa.answer}</p>
      {qa.points && (
        <ul className="mt-3 space-y-1.5 text-[15px] leading-snug">
          {qa.points.map(([term, text]) => (
            <li key={term} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>
                <strong>{term}</strong>: {text}
              </span>
            </li>
          ))}
        </ul>
      )}
      {qa.table && (
        <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                {qa.table.head.map((h, i) => (
                  <th key={i} scope="col" className="px-3 py-2 font-semibold">
                    {h || <span className="sr-only">Phenomenon</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qa.table.rows.map((row) => (
                <tr key={row[0]} className="border-t">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-3 py-2 font-semibold">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-3 py-2">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
