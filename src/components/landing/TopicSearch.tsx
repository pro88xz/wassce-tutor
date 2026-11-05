import { useMemo, useRef, useState } from 'react'
import { BookOpen, Search } from 'lucide-react'
import { fetchSearchIndex } from '@/lib/public-content'
import type { SearchEntry } from '@/lib/public-content'

const SUGGESTIONS = ['Photosynthesis', 'Quadratic equations', 'Cell structure', 'Essay writing', 'Atomic structure']

/**
 * Search box for subjects and syllabus topics. The index (subjects + 600
 * topics) loads on first focus, so it costs nothing until someone uses it.
 */
export function TopicSearch() {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [open, setOpen] = useState(false)
  const loading = useRef(false)

  const load = () => {
    if (index || loading.current) return
    loading.current = true
    fetchSearchIndex()
      .then(setIndex)
      .catch(() => setIndex([]))
      .finally(() => { loading.current = false })
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!index || q.length < 2) return []
    const words = q.split(/\s+/)
    return index
      .filter((e) => words.every((w) => `${e.name} ${e.subjectName}`.toLowerCase().includes(w)))
      .sort((a, b) => Number(b.lessons > 0) - Number(a.lessons > 0) || Number(a.kind === 'topic') - Number(b.kind === 'topic') || a.name.length - b.name.length)
      .slice(0, 8)
  }, [index, query])

  return (
    <div className="relative mx-auto w-full max-w-xl text-left">
      <label htmlFor="topic-search" className="sr-only">Search WASSCE subjects and topics</label>
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 shadow-xl shadow-blue-950/20 ring-1 ring-white/40">
        <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
        <input
          id="topic-search"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { load(); setOpen(true) }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search a subject or topic, e.g. photosynthesis"
          autoComplete="off"
          className="h-14 w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200">
          {!index ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">No topics match &ldquo;{query}&rdquo;. Try another word.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={`${r.kind}-${r.href}-${r.name}`}>
                  <a href={r.href} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                    <BookOpen className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{r.name}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {r.kind === 'subject' ? 'Subject' : r.subjectName}
                        {r.lessons > 0 ? ` · ${r.lessons} lesson${r.lessons === 1 ? '' : 's'}` : ' · lessons coming soon'}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Popular searches">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { load(); setQuery(s); setOpen(true); document.getElementById('topic-search')?.focus() }}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/25"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
