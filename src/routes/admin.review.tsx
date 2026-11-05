import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { isUnlockedThisSession } from '@/lib/adminGate'
import { useApproveLesson, useReviewLessons, useReviewTopics, useSaveByline, useSaveLesson, useUnpublishLesson } from '@/lib/review'
import type { ReviewLesson } from '@/lib/review'
import { Button } from '@/components/ui/button'
import { LessonView } from '@/components/LessonView'

export const Route = createFileRoute('/admin/review')({
  component: AdminReview,
})

type SubjectOption = { id: string; slug: string; name: string }

function AdminReview() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [subjectId, setSubjectId] = useState('')
  const [topicId, setTopicId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const { data: topics } = useReviewTopics(subjectId || null)
  const { data: lessons } = useReviewLessons(topicId || null)

  useEffect(() => {
    supabase.from('subjects').select('id, slug, name').order('name').then(({ data }) => {
      setSubjects((data ?? []) as SubjectOption[])
    })
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

  const subject = subjects.find((s) => s.id === subjectId)
  const topic = topics?.find((t) => t.id === topicId)
  const lesson = lessons?.find((l) => l.id === lessonId)

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Review lessons</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Read a lesson, fix anything wrong, then approve it. Approved lessons become free public pages with your name
        on them (they appear on the website after the next deploy). Students in the app see every lesson either way.
      </p>

      {/* keyed so the form resets to the saved values whenever they change */}
      <Byline key={`${profile.full_name}|${profile.public_bio}`} profileId={user.id} name={profile.full_name ?? ''} bio={profile.public_bio ?? ''} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Subject</span>
          <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicId(''); setLessonId('') }} className="block w-full rounded-md border bg-background px-3 py-2">
            <option value="">Choose a subject…</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Topic (with lessons)</span>
          <select value={topicId} onChange={(e) => { setTopicId(e.target.value); setLessonId('') }} disabled={!topics?.length} className="block w-full rounded-md border bg-background px-3 py-2 disabled:opacity-50">
            <option value="">{subjectId && topics && topics.length === 0 ? 'No lessons in this subject yet' : 'Choose a topic…'}</option>
            {topics?.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.public_count}/{t.lesson_count} public)</option>
            ))}
          </select>
        </label>
      </div>

      {lessons && lessons.length > 0 && (
        <ul className="divide-y rounded-xl border">
          {lessons.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setLessonId(l.id)}
                className={`flex w-full items-center justify-between gap-3 p-3 text-left hover:bg-muted ${l.id === lessonId ? 'bg-muted' : ''}`}
              >
                <span className="font-medium">{l.title}</span>
                <StatusBadge lesson={l} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lesson && subject && topic && (
        <LessonReview
          key={lesson.id}
          lesson={lesson}
          reviewerId={user.id}
          canApprove={!!profile.full_name?.trim()}
          publicPath={`/wassce/${subject.slug}/${topic.slug}/${lesson.slug}`}
        />
      )}
    </div>
  )
}

function StatusBadge({ lesson }: { lesson: ReviewLesson }) {
  if (lesson.is_public) {
    return <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">Public</span>
  }
  if (lesson.reviewed_at) {
    return <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">Reviewed, private</span>
  }
  return <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">Not reviewed</span>
}

function Byline({ profileId, name, bio }: { profileId: string; name: string; bio: string }) {
  const [draftName, setDraftName] = useState(name)
  const [draftBio, setDraftBio] = useState(bio)
  const save = useSaveByline()
  const dirty = draftName !== name || draftBio !== bio
  return (
    <section className="rounded-2xl border bg-card p-4 space-y-3">
      <div>
        <h2 className="font-bold">Your public byline</h2>
        <p className="text-xs text-muted-foreground">Shown as &ldquo;Reviewed by&rdquo; on every lesson you approve.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Name</span>
          <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g. Aminata Kamara" className="block w-full rounded-md border bg-background px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">One-line bio ({160 - draftBio.length} left)</span>
          <input value={draftBio} maxLength={160} onChange={(e) => setDraftBio(e.target.value)} placeholder="e.g. Biology teacher, Freetown, 8 years" className="block w-full rounded-md border bg-background px-3 py-2" />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" disabled={!dirty || save.isPending} onClick={() => save.mutate({ profileId, fullName: draftName, bio: draftBio })}>
          {save.isPending ? 'Saving…' : 'Save byline'}
        </Button>
        {save.isError && <span className="text-sm text-red-500">{(save.error as Error).message}</span>}
        {save.isSuccess && !dirty && <span className="text-sm text-emerald-600">Saved</span>}
      </div>
    </section>
  )
}

function LessonReview({ lesson, reviewerId, canApprove, publicPath }: { lesson: ReviewLesson; reviewerId: string; canApprove: boolean; publicPath: string }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(lesson.title)
  const [content, setContent] = useState(lesson.content)
  const [minutes, setMinutes] = useState<number | ''>(lesson.est_minutes ?? '')
  const saveLesson = useSaveLesson()
  const approve = useApproveLesson()
  const unpublish = useUnpublishLesson()
  const dirty = title !== lesson.title || content !== lesson.content || (minutes || null) !== lesson.est_minutes
  const error = (saveLesson.error || approve.error || unpublish.error) as Error | null

  const save = () => saveLesson.mutateAsync({ id: lesson.id, title, content, est_minutes: minutes || null })
  const saveAndApprove = async () => {
    if (dirty) await save()
    await approve.mutateAsync({ id: lesson.id, reviewerId })
  }

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <StatusBadge lesson={lesson} />
          {lesson.reviewed_at && (
            <p className="text-xs text-muted-foreground">
              Reviewed{lesson.reviewer?.full_name ? ` by ${lesson.reviewer.full_name}` : ''} on {new Date(lesson.reviewed_at).toLocaleDateString()}
            </p>
          )}
          {lesson.is_public && (
            <p className="text-xs">
              Public page: <a href={publicPath} target="_blank" rel="noreferrer" className="text-primary hover:underline">{publicPath}</a>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>{editing ? 'Close editor' : 'Edit'}</Button>
          {editing && (
            <Button size="sm" variant="outline" disabled={!dirty || saveLesson.isPending} onClick={() => save()}>
              {saveLesson.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          )}
          {lesson.is_public ? (
            <Button size="sm" variant="outline" disabled={unpublish.isPending} onClick={() => unpublish.mutate(lesson.id)}>
              {unpublish.isPending ? 'Unpublishing…' : 'Unpublish'}
            </Button>
          ) : (
            <Button size="sm" disabled={!canApprove || approve.isPending || saveLesson.isPending} onClick={saveAndApprove} title={canApprove ? '' : 'Add your name in the byline first'}>
              {approve.isPending ? 'Approving…' : dirty ? 'Save, approve & publish' : 'Approve & publish'}
            </Button>
          )}
        </div>
      </div>
      {!canApprove && !lesson.is_public && <p className="text-sm text-amber-700">Add your name to the byline above before approving.</p>}
      {error && <p className="text-sm text-red-500">{error.message}</p>}

      {editing && (
        <div className="grid gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md border bg-background px-3 py-2 font-semibold" />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Minutes
            <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value ? Number(e.target.value) : '')} className="w-20 rounded-md border bg-background px-2 py-1" />
          </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="rounded-md border bg-background px-3 py-2 font-mono text-xs" />
        </div>
      )}

      <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-p:leading-relaxed">
        <h1>{title}</h1>
        <LessonView content={content} />
      </article>
    </section>
  )
}
