import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import TurndownService from 'turndown'
import { useAuth } from '@/lib/auth'
import { useProfile, usePapers, useTopics, usePaper } from '@/lib/queries'
import { useCreateQuestion, useDeleteQuestion } from '@/lib/mutations'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'
import type { Subject } from '@/lib/types'

export const Route = createFileRoute('/admin/questions')({
  component: AdminQuestions,
})

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' })

const EMPTY_OPTIONS = [
  { label: 'A', content: '', is_correct: true },
  { label: 'B', content: '', is_correct: false },
  { label: 'C', content: '', is_correct: false },
  { label: 'D', content: '', is_correct: false },
]

function AdminQuestions() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectId, setSubjectId] = useState<string>('')
  const [paperId, setPaperId] = useState<string>('')
  const { data: papers } = usePapers(subjectId || null)
  const { data: topics } = useTopics(subjectId || null)
  const { data: paperQuestions } = usePaper(paperId || null)
  const createQuestion = useCreateQuestion()
  const deleteQuestion = useDeleteQuestion()

  const [stem, setStem] = useState('')
  const [explanation, setExplanation] = useState('')
  const [topicId, setTopicId] = useState<string>('')
  const [options, setOptions] = useState(EMPTY_OPTIONS)
  const [error, setError] = useState<string | null>(null)
  const stemRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    supabase.from('subjects').select('*').order('name').then(({ data }) => {
      setSubjects((data ?? []) as Subject[])
      if (data && data.length > 0 && !subjectId) setSubjectId(data[0].id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setPaperId('') }, [subjectId])
  useEffect(() => {
    if (papers && papers.length > 0 && !paperId) setPaperId(papers[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [papers])

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

  // Stem paste handler — convert HTML to markdown
  const handleStemPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData('text/html')
    if (!html) return
    e.preventDefault()
    let md = turndown.turndown(html)
                // Un-escape doubled backslashes inside $...$ and $$...$$ math regions
                md = md.replace(/\$\$([\s\S]*?)\$\$/g, (_m, body) => '$$' + body.replace(/\\\\/g, '\\') + '$$')
                md = md.replace(/\$([^\n$]+?)\$/g, (_m, body) => '$' + body.replace(/\\\\/g, '\\') + '$')
    const ta = e.currentTarget
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const next = stem.slice(0, start) + md + stem.slice(end)
    setStem(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + md.length, start + md.length)
    })
  }

  const setOption = (i: number, patch: Partial<(typeof EMPTY_OPTIONS)[number]>) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)))
  }
  const markCorrect = (i: number) => {
    setOptions((prev) => prev.map((o, idx) => ({ ...o, is_correct: idx === i })))
  }

  const handleCreate = async () => {
    setError(null)
    if (!paperId) return setError('Pick a paper first.')
    if (!stem.trim()) return setError('Question stem is required.')
    if (options.some((o) => !o.content.trim())) return setError('All 4 options must have content.')
    const correctCount = options.filter((o) => o.is_correct).length
    if (correctCount !== 1) return setError('Mark exactly one option as correct.')

    try {
      await createQuestion.mutateAsync({
        paper_id: paperId,
        stem,
        explanation,
        topic_id: topicId || null,
        options,
      })
      // reset form but keep paper selection
      setStem(''); setExplanation(''); setOptions(EMPTY_OPTIONS); setTopicId('')
      stemRef.current?.focus()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create question')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Questions</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {/* SUBJECT + PAPER PICKERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold">Subject</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Paper</label>
          <select value={paperId} onChange={(e) => setPaperId(e.target.value)}
            disabled={!papers || papers.length === 0}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
            {!papers || papers.length === 0
              ? <option>No papers — create one first</option>
              : papers.map((p) => <option key={p.id} value={p.id}>{p.title} ({p.question_count} Qs)</option>)}
          </select>
        </div>
      </div>

      {/* CREATE FORM */}
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <h2 className="font-bold">Add a question</h2>

        {/* STEM */}
        <div>
          <label className="text-xs text-muted-foreground">Question stem (markdown + math supported)</label>
          <textarea
            ref={stemRef}
            value={stem}
            onChange={(e) => setStem(e.target.value)}
            onPaste={handleStemPaste}
            rows={4}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs"
            placeholder="e.g. Solve for x: $2x + 5 = 17$"
          />
          {stem && (
            <div className="mt-2 rounded-md border bg-background p-3 text-sm prose prose-slate dark:prose-invert max-w-none prose-p:my-1">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{stem}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* OPTIONS */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Options (tick the correct one)</label>
          {options.map((o, i) => (
            <div key={o.label} className={`flex items-center gap-2 rounded-md border px-3 py-2 ${o.is_correct ? 'border-emerald-500 bg-emerald-500/5' : 'border-border'}`}>
              <button
                type="button"
                onClick={() => markCorrect(i)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${o.is_correct ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-muted-foreground/40'}`}
                title="Mark as correct"
              >
                {o.is_correct ? '✓' : ''}
              </button>
              <span className="w-5 shrink-0 text-sm font-bold">{o.label}</span>
              <input
                value={o.content}
                onChange={(e) => setOption(i, { content: e.target.value })}
                placeholder={`Option ${o.label}`}
                className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm"
              />
            </div>
          ))}
        </div>

        {/* EXPLANATION */}
        <div>
          <label className="text-xs text-muted-foreground">Explanation (shown after answer; markdown + math supported)</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs"
            placeholder="Why is the correct option right?"
          />
        </div>

        {/* TOPIC TAG */}
        {topics && topics.length > 0 && (
          <div>
            <label className="text-xs text-muted-foreground">Topic (optional — tag this question to a topic)</label>
            <select value={topicId} onChange={(e) => setTopicId(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="">— none —</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleCreate} disabled={createQuestion.isPending || !paperId}>
          {createQuestion.isPending ? 'Saving…' : 'Add question'}
        </Button>
      </div>

      {/* EXISTING QUESTIONS IN THIS PAPER */}
      <div className="space-y-3">
        <h2 className="font-bold">Questions in this paper</h2>
        {!paperQuestions || paperQuestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No questions yet.</p>
        ) : (
          <div className="space-y-2">
            {paperQuestions.map((q, i) => {
              const correct = q.options.find((o) => o.is_correct)
              return (
                <div key={q.id} className="flex items-start justify-between rounded-xl border bg-card px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Q{i + 1}</p>
                    <p className="font-semibold mt-0.5 line-clamp-2">{q.stem}</p>
                    {correct && (
                      <p className="text-xs text-emerald-600 mt-1">
                        ✓ {correct.label}: {correct.content}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this question?')) {
                        deleteQuestion.mutate({ questionId: q.id, paperId })
                      }
                    }}
                    className="ml-3 text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
