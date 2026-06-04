import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import TurndownService from 'turndown'
import { useAuth } from '@/lib/auth'
import { useProfile, useTopics, useTopic } from '@/lib/queries'
import { useCreateLesson, useDeleteLesson } from '@/lib/mutations'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'
import type { Subject } from '@/lib/types'
import { MarkdownView } from '@/components/MarkdownView'

export const Route = createFileRoute('/admin/lessons')({
  component: AdminLessons,
})

// HTML -> Markdown converter for the paste handler.
const turndown = new TurndownService({
  headingStyle: 'atx',          // ## instead of underline
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})
// Preserve LaTeX math if pasted as <span class="math">...</span> or similar
turndown.addRule('keepLatex', {
  filter: (node) => /(katex|math)/i.test(node.className || ''),
  replacement: (_content, node) => {
    const tex = (node as HTMLElement).getAttribute('data-tex')
      || (node.textContent || '')
    const display = /display|block/i.test((node as HTMLElement).className)
    return display ? `\n$$${tex}$$\n` : `$${tex}$`
  },
})

function AdminLessons() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectId, setSubjectId] = useState<string>('')
  const [topicId, setTopicId] = useState<string>('')
  const { data: topics } = useTopics(subjectId || null)
  const { data: topicData } = useTopic(topicId || null)
  const createLesson = useCreateLesson()
  const deleteLesson = useDeleteLesson()

  // AI lesson draft generator — fills the markdown textarea with a draft from Groq
  const generateDraft = async () => {
    if (!title.trim()) {
      setGenError('Add a title first — the AI needs to know what to write about.')
      return
    }
    if (!topicData?.topic) {
      setGenError('Pick a topic first.')
      return
    }
    const subjectName = subjects.find((sub) => sub.id === subjectId)?.name ?? 'this subject'
    const prompt = `LESSON TITLE: "${title.trim()}"\n\nCONTEXT: This lesson is one focused chunk inside the topic "${topicData.topic.name}" in ${subjectName}. Write a lesson on EXACTLY the title above. Do not write about the whole topic. Do not survey other concepts.`
    setGenError(null)
    setGenerating(true)
    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      if (!token) throw new Error('Not signed in')
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-tutor`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ message: prompt, mode: 'lesson_draft' }),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setContent(data.reply)
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Failed to generate draft')
    } finally {
      setGenerating(false)
    }
  }

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('## Heading\n\nWrite your lesson here.\n\n- Use markdown\n- **Bold** and *italic* work\n- Lists, headings, all of it')
  const [estMinutes, setEstMinutes] = useState<number>(3)
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const taRef = useRef<HTMLTextAreaElement | null>(null)

  // Wraps the current selection in `before`/`after`, or inserts at cursor if no selection.
  // Smart: if `block` is true, ensures the inserted bit sits on its own line.
  const wrap = (before: string, after: string = before, block = false) => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const prefix = block && start > 0 && content[start - 1] !== '\n' ? '\n' : ''
    const suffix = block && content[end] !== '\n' ? '\n' : ''
    const inserted = prefix + before + selected + after + suffix
    const next = content.slice(0, start) + inserted + content.slice(end)
    setContent(next)
    // Restore selection / cursor
    requestAnimationFrame(() => {
      ta.focus()
      const cursor = start + prefix.length + before.length + selected.length
      ta.setSelectionRange(cursor, cursor)
    })
  }

  // Prepends a string to the start of each selected line (for lists, headings)
  const prefixLines = (linePrefix: string) => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    // Expand selection to whole lines
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const lineEnd = content.indexOf('\n', end) === -1 ? content.length : content.indexOf('\n', end)
    const chunk = content.slice(lineStart, lineEnd) || 'text'
    const numbered = linePrefix === '1. '
    const transformed = chunk.split('\n').map((line, i) =>
      (numbered ? `${i + 1}. ` : linePrefix) + line
    ).join('\n')
    const next = content.slice(0, lineStart) + transformed + content.slice(lineEnd)
    setContent(next)
    requestAnimationFrame(() => ta.focus())
  }


  useEffect(() => {
    supabase.from('subjects').select('*').order('name').then(({ data }) => {
      setSubjects((data ?? []) as Subject[])
      if (data && data.length > 0 && !subjectId) setSubjectId(data[0].id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset topic when subject changes
  useEffect(() => { setTopicId('') }, [subjectId])
  // Auto-pick first topic when topics load
  useEffect(() => {
    if (topics && topics.length > 0 && !topicId) setTopicId(topics[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics])

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
    if (!topicId || !title.trim() || !content.trim()) {
      setError('Topic, title and content are required.')
      return
    }
    try {
      await createLesson.mutateAsync({
        topic_id: topicId,
        slug: (slug || title).trim(),
        title,
        content,
        est_minutes: estMinutes || null,
        sort_order: sortOrder,
      })
      setTitle(''); setSlug(''); setSortOrder(0)
      // keep content + estMinutes — likely they're adding several similar lessons
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create lesson')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Lessons</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {/* SUBJECT + TOPIC PICKERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <div>
          <label className="text-sm font-semibold">Topic</label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            disabled={!topics || topics.length === 0}
          >
            {!topics || topics.length === 0
              ? <option>No topics — create one first</option>
              : topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {/* CREATE FORM */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Add a lesson</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-primary hover:underline"
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Lesson title (e.g. Common Denominators)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            placeholder="Slug (optional, auto-generated)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className={`grid gap-3 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          <div>
            <label className="text-xs text-muted-foreground">Content</label>
            <div className="mt-1 flex flex-wrap gap-1 rounded-t-md border border-b-0 bg-muted/30 p-1.5">
              <ToolbarBtn onClick={() => prefixLines('## ')} title="Heading">H2</ToolbarBtn>
              <ToolbarBtn onClick={() => prefixLines('### ')} title="Sub-heading">H3</ToolbarBtn>
              <ToolbarBtn onClick={() => wrap('**')} title="Bold"><b>B</b></ToolbarBtn>
              <ToolbarBtn onClick={() => wrap('*')} title="Italic"><i>I</i></ToolbarBtn>
              <ToolbarBtn onClick={() => prefixLines('- ')} title="Bullet list">• List</ToolbarBtn>
              <ToolbarBtn onClick={() => prefixLines('1. ')} title="Numbered list">1. List</ToolbarBtn>
              <ToolbarBtn onClick={() => wrap('`')} title="Inline code">{'<>'}</ToolbarBtn>
              <ToolbarBtn onClick={() => wrap('> ', '', true)} title="Quote">&ldquo;&rdquo;</ToolbarBtn>
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <button
                type="button"
                onClick={generateDraft}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary/80 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50 transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5z M14 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" transform="translate(2 0)" />
                </svg>
                {generating ? 'Generating…' : 'Generate draft with AI'}
              </button>
              <span className="text-xs text-muted-foreground">Review and edit before saving</span>
            </div>
            {genError && (
              <div className="rounded-md border border-red-500/40 bg-red-500/5 p-2 mb-2 text-xs text-red-600">
                {genError}
              </div>
            )}
            <textarea
              ref={taRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={(e) => {
                const html = e.clipboardData.getData('text/html')
                if (!html) return  // no HTML in clipboard — let plain text paste normally
                e.preventDefault()
                let md = turndown.turndown(html)
                // Un-escape doubled backslashes inside $...$ and $$...$$ math regions
                md = md.replace(/\$\$([\s\S]*?)\$\$/g, (_m, body) => '$$' + body.replace(/\\\\/g, '\\') + '$$')
                md = md.replace(/\$([^\n$]+?)\$/g, (_m, body) => '$' + body.replace(/\\\\/g, '\\') + '$')
                const ta = e.currentTarget
                const start = ta.selectionStart
                const end = ta.selectionEnd
                const next = content.slice(0, start) + md + content.slice(end)
                setContent(next)
                requestAnimationFrame(() => {
                  ta.focus()
                  const cursor = start + md.length
                  ta.setSelectionRange(cursor, cursor)
                })
              }}
              rows={14}
              className="block w-full rounded-b-md border bg-background px-3 py-2 font-mono text-xs"
              placeholder="Type or paste your lesson content. Formatting from Word, ChatGPT, etc. will be preserved."
            />
          </div>
          {showPreview && (
            <div>
              <label className="text-xs text-muted-foreground">Preview</label>
              <div className="mt-1 rounded-md border bg-background p-4 prose prose-slate dark:prose-invert max-w-none
                prose-headings:font-bold prose-h2:text-base prose-h2:mt-3 prose-h2:mb-2
                prose-p:text-sm prose-li:text-sm prose-li:my-0.5
                prose-strong:text-foreground">
                <MarkdownView content={content || '*Nothing to preview yet.*'} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Est. minutes</label>
            <input
              type="number"
              value={estMinutes}
              onChange={(e) => setEstMinutes(Number(e.target.value))}
              className="w-20 rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Sort</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-20 rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleCreate} disabled={createLesson.isPending || !topicId}>
          {createLesson.isPending ? 'Saving…' : 'Create lesson'}
        </Button>
      </div>

      {/* EXISTING LESSONS IN THIS TOPIC */}
      <div className="space-y-3">
        <h2 className="font-bold">Lessons in this topic</h2>
        {!topicData || topicData.lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons yet.</p>
        ) : (
          <div className="space-y-2">
            {topicData.lessons.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold">{l.title}</p>
                  <p className="text-xs text-muted-foreground">
                    /{l.slug} · sort {l.sort_order}{l.est_minutes ? ` · ${l.est_minutes} min` : ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${l.title}"?`)) deleteLesson.mutate(l.id)
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


function ToolbarBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  )
}
