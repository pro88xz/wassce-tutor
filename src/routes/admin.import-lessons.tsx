import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'

export const Route = createFileRoute('/admin/import-lessons')({
  component: AdminImportLessons,
})

const EXAMPLE = `[
  {
    "subject": "Biology",
    "topic": "cell-structure",
    "title": "Animal cells and plant cells under the microscope",
    "content": "Every living thing is built from cells...",
    "est_minutes": 8,
    "sort_order": 1
  }
]`

type ImportResult = {
  inserted: number
  updated: number
  errors: Array<{ row: Record<string, unknown>; error: string }>
}

const MAX_BATCH = 20

function AdminImportLessons() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [text, setText] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  if (!user) return <p>Sign in required.</p>
  if (!profile?.is_admin) return <p>Not authorised.</p>
  if (!isUnlockedThisSession()) {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <p className="text-muted-foreground">Admin session locked.</p>
        <Link to="/admin"><Button>Unlock</Button></Link>
      </div>
    )
  }

  const runImport = async () => {
    setParseError(null)
    setResult(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      setParseError('Invalid JSON: ' + (e instanceof Error ? e.message : 'parse failed'))
      return
    }
    if (!Array.isArray(parsed)) {
      setParseError('Expected a JSON array of lessons')
      return
    }
    if (parsed.length === 0) {
      setParseError('Array is empty')
      return
    }
    if (parsed.length > MAX_BATCH) {
      setParseError(`Batch too large: ${parsed.length} lessons (max ${MAX_BATCH} per import)`)
      return
    }
    // Validate required fields per row
    for (let i = 0; i < parsed.length; i++) {
      const row = parsed[i] as Record<string, unknown>
      const missing: string[] = []
      if (typeof row.subject !== 'string') missing.push('subject')
      if (typeof row.topic !== 'string') missing.push('topic')
      if (typeof row.title !== 'string') missing.push('title')
      if (typeof row.content !== 'string') missing.push('content')
      if (missing.length > 0) {
        setParseError(`Row ${i + 1} missing required fields: ${missing.join(', ')}`)
        return
      }
    }
    setImporting(true)
    try {
      const { data, error } = await supabase.rpc('import_lessons', { p_lessons: parsed })
      if (error) throw error
      const row = Array.isArray(data) ? data[0] : data
      setResult(row as ImportResult)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Bulk Import Lessons</h1>
        </div>
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-4 text-sm space-y-2">
        <p className="font-semibold">JSON shape</p>
        <p className="text-muted-foreground">
          Array of lesson objects. Required fields: <code>subject</code>, <code>topic</code> (topic slug), <code>title</code>, <code>content</code> (Markdown).
          Optional: <code>est_minutes</code>, <code>sort_order</code>.
        </p>
        <p className="text-muted-foreground">
          Max {MAX_BATCH} lessons per batch. Matches existing lessons by topic + title slug — re-imports update in place.
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-muted-foreground">Example</summary>
          <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">{EXAMPLE}</pre>
        </details>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Paste JSON</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={EXAMPLE}
          rows={16}
          className="w-full rounded-md border bg-background p-3 font-mono text-xs"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={runImport} disabled={importing || !text.trim()}>
          {importing ? 'Importing…' : 'Import lessons'}
        </Button>
        {parseError && <p className="text-sm text-red-600">{parseError}</p>}
      </div>

      {result && (
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="font-semibold">Result</p>
          <p className="text-sm">
            <span className="font-bold text-emerald-600">{result.inserted}</span> inserted, {' '}
            <span className="font-bold text-blue-600">{result.updated}</span> updated
          </p>
          {result.errors && result.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">{result.errors.length} error(s):</p>
              <ul className="space-y-1 text-xs">
                {result.errors.map((e, i) => (
                  <li key={i} className="rounded bg-red-50 p-2 dark:bg-red-950/30">
                    <p className="font-mono">{e.error}</p>
                    <p className="text-muted-foreground">
                      {typeof e.row?.title === 'string' ? e.row.title : JSON.stringify(e.row).slice(0, 80)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
