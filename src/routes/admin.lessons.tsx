import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import TurndownService from 'turndown'
import rehypeKatex from 'rehype-katex'
import { useAuth } from '@/lib/auth'
import { useProfile, useTopics, useTopic } from '@/lib/queries'
import { useCreateLesson, useDeleteLesson } from '@/lib/mutations'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'
import type { Subject } from '@/lib/types'

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

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('## Heading\n\nWrite your lesson here.\n\n- Use markdown\n- **Bold** and *italic* work\n- Lists, headings, all of it')
  const [estMinutes, setEstMinutes] = useState<number>(3)
  const [sortOrder, setSortOrder] = useState<number>(0)
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
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{content || '*Nothing to preview yet.*'}</ReactMarkdown>
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
