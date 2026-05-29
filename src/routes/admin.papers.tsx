import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile, usePapers } from '@/lib/queries'
import { useCreatePaper, useDeletePaper } from '@/lib/mutations'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'
import type { Subject } from '@/lib/types'

export const Route = createFileRoute('/admin/papers')({
  component: AdminPapers,
})

function AdminPapers() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectId, setSubjectId] = useState<string>('')
  const { data: papers } = usePapers(subjectId || null)
  const createPaper = useCreatePaper()
  const deletePaper = useDeletePaper()

  const [title, setTitle] = useState('')
  const [year, setYear] = useState<number | ''>('')
  const [paperType, setPaperType] = useState('Practice')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('subjects').select('*').order('name').then(({ data }) => {
      setSubjects((data ?? []) as Subject[])
      if (data && data.length > 0 && !subjectId) setSubjectId(data[0].id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleCreate = async () => {
    setError(null)
    if (!subjectId || !title.trim()) {
      setError('Subject and title required.')
      return
    }
    try {
      await createPaper.mutateAsync({
        subject_id: subjectId,
        title,
        year: year === '' ? null : Number(year),
        paper_type: paperType,
        description,
        sort_order: sortOrder,
      })
      setTitle(''); setYear(''); setDescription(''); setSortOrder(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create paper')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Papers</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      <div>
        <label className="text-sm font-semibold">Subject</label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="font-bold">Add a paper</h2>
        <input
          placeholder="Title (e.g. WASSCE 2023 Paper 1)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Year (optional, e.g. 2024)"
            value={year}
            onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
          <select
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option>Practice</option>
            <option>Paper 1</option>
            <option>Paper 2</option>
            <option>Mock</option>
            <option>Past Exam</option>
          </select>
        </div>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Sort</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-20 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleCreate} disabled={createPaper.isPending}>
          {createPaper.isPending ? 'Saving…' : 'Create paper'}
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold">Existing papers</h2>
        {!papers || papers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No papers in this subject yet.</p>
        ) : (
          <div className="space-y-2">
            {papers.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {[p.paper_type, p.year, `${p.question_count} Qs`].filter(Boolean).join(' · ')}
                  </p>
                  {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${p.title}"? This removes all its questions too.`)) {
                      deletePaper.mutate(p.id)
                    }
                  }}
                  className="ml-3 text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
