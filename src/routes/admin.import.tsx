import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'

export const Route = createFileRoute('/admin/import')({
  component: AdminImport,
})

const EXAMPLE = `[
  { "subject": "Mathematics", "name": "Quadratic Equations", "description": "Factoring, completing the square, quadratic formula", "sort_order": 18 },
  { "subject": "Mathematics", "name": "Indices and Logarithms", "description": "Laws of indices and basic log properties", "sort_order": 19 }
]`

type ImportResult = {
  inserted: number
  updated: number
  errors: Array<{ row: Record<string, unknown>; error: string }>
}

function AdminImport() {
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
      setParseError('Expected a JSON array of topics')
      return
    }
    if (parsed.length === 0) {
      setParseError('Array is empty')
      return
    }
    setImporting(true)
    try {
      const { data, error } = await supabase.rpc('import_topics', { p_topics: parsed })
      if (error) throw error
      // RPC returns a single-row table; supabase-js gives us an array
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
          <h1 className="text-2xl font-bold">Bulk Import Topics</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      <div className="rounded-2xl border bg-card p-4 space-y-3 text-sm">
        <p className="font-semibold">How it works:</p>
        <ol className="space-y-2 text-muted-foreground">
          <li>1. Make a Google Sheet with columns: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">subject</code> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">name</code> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">description</code> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">sort_order</code></li>
          <li>2. Convert to JSON (see the formula tip below)</li>
          <li>3. Paste it here and tap Import</li>
        </ol>
        <details className="text-xs">
          <summary className="cursor-pointer font-semibold text-foreground">Google Sheets to JSON formula (click to expand)</summary>
          <p className="mt-2 text-muted-foreground">In a blank cell, paste:</p>
          <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">{`="[\n  " & TEXTJOIN(",\n  ", TRUE, ARRAYFORMULA(IF(A2:A="",,"{""subject"":"""&A2:A&""", ""name"":"""&B2:B&""", ""description"":"""&C2:C&""", ""sort_order"":"&D2:D&"}"))) & "\n]"`}</pre>
          <p className="mt-1 text-muted-foreground">Adjust A2:A, B2:B, C2:C, D2:D to your column letters. Copy the cell value and paste below.</p>
        </details>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Paste JSON array of topics:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={EXAMPLE}
          rows={14}
          className="w-full rounded-xl border bg-background p-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {parseError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-600">
          {parseError}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Inserted</p>
              <p className="mt-1 text-2xl font-black text-emerald-700">{result.inserted}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-amber-700">Updated</p>
              <p className="mt-1 text-2xl font-black text-amber-700">{result.updated}</p>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-red-700">Errors</p>
              <p className="mt-1 text-2xl font-black text-red-700">{result.errors?.length ?? 0}</p>
            </div>
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="rounded-xl border bg-card p-3 space-y-2">
              <p className="text-sm font-semibold">Errors:</p>
              {result.errors.map((err, i) => (
                <div key={i} className="text-xs text-red-600 font-mono break-all">
                  {err.error} - {JSON.stringify(err.row)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Button onClick={runImport} disabled={importing || !text.trim()} className="w-full h-12">
        {importing ? 'Importing...' : 'Import topics'}
      </Button>
    </div>
  )
}
