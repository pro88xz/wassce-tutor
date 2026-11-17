import { useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Search } from 'lucide-react'
import { fetchSearchIndex } from '@/lib/public-content'
import type { SearchEntry } from '@/lib/public-content'
import { matchEntries } from '@/lib/search'

export type TopicShortcut = { label: string; href: string }

/**
 * Search box for subjects and syllabus topics. The index (subjects + 600
 * topics) loads on first focus, so it costs nothing until someone uses it.
 * Matching tolerates small spelling mistakes (see src/lib/search.ts).
 *
 * `shortcuts` are links to real topics that already have lessons, so a
 * shortcut never leads to a page with no lessons.
 */
/** `light` for a pale background (the subject catalogue), `dark` for the ink hero. */
export function TopicSearch({ shortcuts = [], tone = 'dark', size = 'md' }: { shortcuts?: TopicShortcut[]; tone?: 'dark' | 'light'; size?: 'md' | 'lg' }) {
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
    if (!index || query.trim().length < 2) return []
    return matchEntries(index, query)
      .sort(
        (a, b) =>
          a.cost - b.cost ||
          Number(b.entry.lessons > 0) - Number(a.entry.lessons > 0) ||
          Number(a.entry.kind === 'topic') - Number(b.entry.kind === 'topic') ||
          a.entry.name.length - b.entry.name.length,
      )
      .slice(0, 8)
      .map((m) => m.entry)
  }, [index, query])

  return (
    <div className="relative w-full text-left">
      <label htmlFor="topic-search" className="sr-only">Search WASSCE subjects and topics</label>
      <div className={`flex items-center gap-3 bg-white transition-shadow ${size === 'lg' ? 'rounded-2xl pl-5 pr-2' : 'rounded-xl px-4'} focus-within:ring-2 focus-within:ring-violet-300 ${tone === 'light' ? 'shadow-[0_18px_40px_-24px_rgba(30,20,80,.45)] ring-1 ring-slate-300/80' : 'shadow-[0_18px_40px_-22px_rgba(0,0,0,.7)] ring-1 ring-white/30'}`}>
        <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
        <input
          id="topic-search"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { load(); setOpen(true) }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={size === 'lg' ? 'What do you want to study?' : 'Search a subject or topic, e.g. photosynthesis'}
          autoComplete="off"
          className={`${size === 'lg' ? 'h-16' : 'h-14'} w-full min-w-0 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none`}
        />
        {size === 'lg' && (
          <label htmlFor="topic-search" aria-hidden className="hidden h-12 shrink-0 cursor-pointer items-center rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-strong)] sm:flex">
            Search
          </label>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200">
          {!index ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching…</p>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-600">
              <p>No subject or topic matches &ldquo;{query}&rdquo;. Check the spelling or try a shorter word.</p>
              <a href="/wassce/subjects" className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-violet-700 hover:underline">
                Browse every subject <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={`${r.kind}-${r.href}-${r.name}`}>
                  <a href={r.href} className="flex min-h-12 items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                    <BookOpen className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{r.name}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {r.kind === 'subject' ? 'Subject' : r.subjectName}
                        {r.lessons > 0 ? ` · ${r.lessons} lesson${r.lessons === 1 ? '' : 's'}` : ' · syllabus outline'}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {shortcuts.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-medium ${tone === 'light' ? 'text-muted-foreground' : 'text-white/55'}`}>Popular topics:</span>
          {shortcuts.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold ring-1 transition ${tone === 'light' ? 'bg-card text-foreground ring-border hover:ring-primary/40' : 'bg-white/10 text-white/90 ring-white/20 hover:bg-white/20'}`}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
