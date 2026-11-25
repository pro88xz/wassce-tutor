// Review lessons: a verified reviewer (tutors.reviewer, migration 28) reads the
// published lessons in the subjects they teach and approves each one (it then
// says "Reviewed by" them, linking to their page) or reports a problem to the
// admins. Once they have read a whole topic, or every waiting lesson in a
// subject, they can approve them together (tutor_review_lessons, migration 38,
// with the same rules), after confirming they have read them. Tutors who are
// not reviewers yet can ask to become one.
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ArrowLeft, BookOpenCheck, Check, CheckCheck, ExternalLink, Flag, ShieldCheck, Undo2 } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { lessonPath } from '@/lib/public-rules'

export const Route = createFileRoute('/tutor-dashboard_/review')({
  head: privateHead('Review lessons'),
  component: ReviewLessons,
})

type Row = {
  lesson_id: string
  lesson_slug: string
  lesson_title: string
  est_minutes: number | null
  topic_slug: string
  topic_name: string
  subject_slug: string
  subject_name: string
  reviewed_at: string | null
  reviewed_by_me: boolean
  reviewer_name: string | null
}

function friendly(err: unknown): string {
  const msg = err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err)
  if (/tutor_lessons_to_review|tutor_review_lesson|request_reviewer|schema cache/i.test(msg)) return 'Lesson review is being switched on. Try again in a few minutes.'
  return msg
}

function ReviewLessons() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [subject, setSubject] = useState<string>('all')
  const [flagging, setFlagging] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const lessons = useQuery({
    queryKey: ['tutor-review-lessons', user?.id],
    enabled: !!user,
    retry: false,
    queryFn: async (): Promise<Row[] | 'not-reviewer'> => {
      const { data, error } = await supabase.rpc('tutor_lessons_to_review')
      if (error) {
        if (/Lesson reviewers only/i.test(error.message)) return 'not-reviewer'
        throw error
      }
      return (data ?? []) as Row[]
    },
  })

  const rows = useMemo(() => (Array.isArray(lessons.data) ? lessons.data : []), [lessons.data])
  const subjects = useMemo(() => [...new Set(rows.map((r) => r.subject_name))], [rows])
  const shown = rows.filter((r) => subject === 'all' || r.subject_name === subject)
  const mine = rows.filter((r) => r.reviewed_by_me).length
  const open = rows.filter((r) => !r.reviewed_at).length
  const groups = useMemo(() => {
    const out: { key: string; subject: string; topic: string; rows: Row[] }[] = []
    for (const r of shown) {
      const key = `${r.subject_slug}/${r.topic_slug}`
      const last = out[out.length - 1]
      if (last?.key === key) last.rows.push(r)
      else out.push({ key, subject: r.subject_name, topic: r.topic_name, rows: [r] })
    }
    return out
  }, [shown])

  const act = async (id: string, decision: 'approved' | 'flagged' | 'withdrawn', done: string) => {
    setBusy(id)
    setError(null)
    setMessage(null)
    try {
      const { error } = await supabase.rpc('tutor_review_lesson', { p_lesson: id, p_decision: decision, p_note: decision === 'flagged' ? note.trim() : null })
      if (error) throw error
      setMessage(done)
      setFlagging(null)
      setNote('')
      await qc.invalidateQueries({ queryKey: ['tutor-review-lessons'] })
    } catch (err) {
      setError(friendly(err))
    } finally {
      setBusy(null)
    }
  }

  // Approve many at once: only after the reviewer confirms they have read them.
  const approveMany = async (ids: string[], scope: string) => {
    if (ids.length === 0) return
    const ok = window.confirm(
      `Approve ${ids.length} ${ids.length === 1 ? 'lesson' : 'lessons'} in ${scope}?\n\nApprove only lessons you have read and checked. Each one will say “Reviewed by” you, with a link to your page.`,
    )
    if (!ok) return
    setBusy(`many:${scope}`)
    setError(null)
    setMessage(null)
    try {
      const { data, error } = await supabase.rpc('tutor_review_lessons', { p_lessons: ids })
      if (error) throw error
      const n = typeof data === 'number' ? data : ids.length
      setMessage(`${n} ${n === 1 ? 'lesson' : 'lessons'} in ${scope} now ${n === 1 ? 'says' : 'say'} Reviewed by you.`)
      await qc.invalidateQueries({ queryKey: ['tutor-review-lessons'] })
    } catch (err) {
      setError(friendly(err))
    } finally {
      setBusy(null)
    }
  }
  const waitingIds = (list: Row[]) => list.filter((r) => !r.reviewed_at).map((r) => r.lesson_id)

  const askToReview = async () => {
    setBusy('request')
    setError(null)
    setMessage(null)
    const { error } = await supabase.rpc('request_reviewer')
    setBusy(null)
    if (error) setError(friendly(error))
    else setMessage('Request sent. We will tell you here when you can review lessons.')
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-16">
      <header className="site-brand-panel rounded-[2rem] p-7 sm:p-9">
        <Link to="/tutor-dashboard" className="flex w-fit items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Tutor dashboard
        </Link>
        <p className="mt-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-violet-200">
          <ShieldCheck className="h-4 w-4" aria-hidden /> Verified lesson reviewer
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Review lessons</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Read the lessons in the subjects you teach. Every lesson you approve says “Reviewed by” you, with a link to your page, so students who read it can book you.
        </p>
      </header>

      {message && (
        <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/15 dark:text-red-200">
          {error}
        </p>
      )}

      {lessons.isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : lessons.error ? (
        <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">{friendly(lessons.error)}</p>
      ) : lessons.data === 'not-reviewer' ? (
        <section className="rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-bold">Become a lesson reviewer</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Verified reviewers check WASSCE Tutor lessons in the subjects they teach. Each approved lesson carries your name and a link to your page, where students can book you.
          </p>
          <button type="button" onClick={() => void askToReview()} disabled={busy === 'request'} className="site-btn site-btn-primary mt-5">
            {busy === 'request' ? 'Sending…' : 'Ask to review lessons'}
          </button>
        </section>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Lessons in your subjects" value={rows.length} />
            <Stat label="Waiting for a reviewer" value={open} />
            <Stat label="Approved by you" value={mine} />
          </div>

          {subjects.length > 1 && (
            <div className="flex flex-wrap gap-2" aria-label="Filter by subject">
              {['all', ...subjects].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={subject === s}
                  onClick={() => setSubject(s)}
                  className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${subject === s ? 'border-transparent bg-[var(--site-ink)] text-white dark:bg-white dark:text-[var(--site-ink)]' : 'bg-card'}`}
                >
                  {s === 'all' ? 'All subjects' : s}
                </button>
              ))}
            </div>
          )}

          {/* One subject on screen (chosen, or the only one they teach): approve its waiting lessons together. */}
          {(subject !== 'all' || subjects.length === 1) && waitingIds(shown).length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Read every waiting lesson in {subject !== 'all' ? subject : subjects[0]}? Approve them together instead of one by one.
              </p>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void approveMany(waitingIds(shown), subject !== 'all' ? subject : subjects[0])}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                <CheckCheck className="h-4 w-4" aria-hidden /> Approve all {waitingIds(shown).length} waiting in {subject !== 'all' ? subject : subjects[0]}
              </button>
            </div>
          )}

          {rows.length === 0 ? (
            <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">There are no published lessons in your subjects yet.</p>
          ) : (
            <div className="space-y-6">
              {groups.map((g) => (
                <section key={g.key} className="rounded-2xl border bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
                    <h2 className="text-sm font-bold">
                      <span className="text-muted-foreground">{g.subject} · </span>
                      {g.topic}
                    </h2>
                    {waitingIds(g.rows).length > 1 && (
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => void approveMany(waitingIds(g.rows), `${g.topic} (${g.subject})`)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-600/40 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                      >
                        <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Approve all {waitingIds(g.rows).length} in this topic
                      </button>
                    )}
                  </div>
                  <ul className="divide-y">
                    {g.rows.map((r) => {
                      const href = lessonPath(r.subject_slug, r.topic_slug, r.lesson_slug)
                      return (
                        <li key={r.lesson_id} className="px-5 py-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold leading-snug">{r.lesson_title}</p>
                              <p className="mt-0.5 text-xs">
                                {r.reviewed_by_me ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                                    <BookOpenCheck className="h-3.5 w-3.5" aria-hidden /> Approved by you
                                  </span>
                                ) : r.reviewed_at ? (
                                  <span className="text-muted-foreground">Approved by {r.reviewer_name ?? 'another reviewer'}</span>
                                ) : (
                                  <span className="text-amber-700 dark:text-amber-300">Not reviewed yet</span>
                                )}
                                {r.est_minutes ? <span className="text-muted-foreground"> · {r.est_minutes} min</span> : null}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <a href={href} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold hover:border-primary/40">
                                Read <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                              </a>
                              {!r.reviewed_at && (
                                <button type="button" disabled={busy === r.lesson_id} onClick={() => void act(r.lesson_id, 'approved', `“${r.lesson_title}” now says Reviewed by you.`)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                                  <Check className="h-4 w-4" aria-hidden /> Approve
                                </button>
                              )}
                              {r.reviewed_by_me && (
                                <button type="button" disabled={busy === r.lesson_id} onClick={() => void act(r.lesson_id, 'withdrawn', `You withdrew your approval of “${r.lesson_title}”.`)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold disabled:opacity-60">
                                  <Undo2 className="h-4 w-4" aria-hidden /> Withdraw
                                </button>
                              )}
                              <button type="button" onClick={() => { setFlagging(flagging === r.lesson_id ? null : r.lesson_id); setNote('') }} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold text-red-700 hover:border-red-300 dark:text-red-300">
                                <Flag className="h-4 w-4" aria-hidden /> Report a problem
                              </button>
                            </div>
                          </div>
                          {flagging === r.lesson_id && (
                            <div className="mt-3 rounded-xl bg-muted/50 p-3">
                              <label className="block text-sm font-semibold" htmlFor={`note-${r.lesson_id}`}>
                                What is wrong? Our team will fix it.
                              </label>
                              <textarea id={`note-${r.lesson_id}`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} className="mt-2 w-full rounded-xl border bg-card p-3 text-sm" placeholder="e.g. In the worked example, the answer should be 12 m s⁻¹, not 21 m s⁻¹." />
                              <button type="button" disabled={busy === r.lesson_id || note.trim().length < 10} onClick={() => void act(r.lesson_id, 'flagged', 'Thank you. The admins have your note.')} className="site-btn site-btn-primary mt-2">
                                Send to the admins
                              </button>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
