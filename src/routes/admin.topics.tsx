import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile, useTopics, type Topic } from '@/lib/queries'
import { useCreateTopic, useUpdateTopic, useDeleteTopic } from '@/lib/mutations'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'
import type { Subject } from '@/lib/types'

export const Route = createFileRoute('/admin/topics')({
  component: AdminTopics,
})

function AdminTopics() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectId, setSubjectId] = useState<string>('')
  const { data: topics } = useTopics(subjectId || null)
  const createTopic = useCreateTopic()
  const deleteTopic = useDeleteTopic()

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Load all subjects (for the dropdown)
  useEffect(() => {
    supabase.from('subjects').select('*').order('name').then(({ data }) => {
      setSubjects((data ?? []) as Subject[])
      if (data && data.length > 0 && !subjectId) setSubjectId(data[0].id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Gate
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
    if (!subjectId || !name.trim()) {
      setError('Subject and name required.')
      return
    }
    try {
      await createTopic.mutateAsync({
        subject_id: subjectId,
        slug: (slug || name).trim(),
        name,
        description,
        sort_order: sortOrder,
      })
      setName(''); setSlug(''); setDescription(''); setSortOrder(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create topic')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Topics</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {/* SUBJECT PICKER */}
      <div>
        <label className="text-sm font-semibold">Subject</label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* CREATE FORM */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="font-bold">Add a topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Topic name (e.g. Quadratic Equations)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            placeholder="Slug (optional, auto-generated)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
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
        <Button onClick={handleCreate} disabled={createTopic.isPending}>
          {createTopic.isPending ? 'Saving…' : 'Create topic'}
        </Button>
      </div>

      {/* EXISTING TOPICS */}
      <div className="space-y-3">
        <h2 className="font-bold">Existing topics</h2>
        {!topics || topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No topics in this subject yet.</p>
        ) : (
          <div className="space-y-2">
            {topics.map((t) => (
              <div key={t.id} className="rounded-xl border bg-card px-4 py-3">
                {editingId === t.id ? (
                  <TopicEditForm
                    topic={t}
                    subjectId={subjectId}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">/{t.slug} · sort {t.sort_order}</p>
                      {t.description && <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>}
                    </div>
                    <div className="ml-3 flex shrink-0 items-center gap-3">
                      <button
                        onClick={() => setEditingId(t.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${t.name}"? This removes its lessons too.`)) {
                            deleteTopic.mutate(t.id)
                          }
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TopicEditForm({
  topic,
  subjectId,
  onDone,
}: {
  topic: Topic
  subjectId: string
  onDone: () => void
}) {
  const updateTopic = useUpdateTopic()
  const [name, setName] = useState(topic.name)
  const [slug, setSlug] = useState(topic.slug)
  const [description, setDescription] = useState(topic.description ?? '')
  const [sortOrder, setSortOrder] = useState<number>(topic.sort_order)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setError(null)
    if (!name.trim()) {
      setError('Name required.')
      return
    }
    try {
      await updateTopic.mutateAsync({
        id: topic.id,
        subject_id: subjectId,
        name,
        slug,
        description,
        sort_order: sortOrder,
      })
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update topic')
    }
  }

  const slugChanged = slug.trim().toLowerCase().replace(/\s+/g, '-') !== topic.slug

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          placeholder="Topic name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />
        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>
      {slugChanged && (
        <p className="text-xs text-amber-600">Changing the slug breaks existing links to this topic.</p>
      )}
      <textarea
        placeholder="Description"
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
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={updateTopic.isPending}>
          {updateTopic.isPending ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="outline" onClick={onDone} disabled={updateTopic.isPending}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
