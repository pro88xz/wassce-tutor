import { createFileRoute, Link } from '@tanstack/react-router'
import { CONTACT } from '@/lib/contact'
import { privateHead } from '@/lib/seo'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
// Lazy-loaded markdown stack — only fetched when AI starts answering
const ReactMarkdown = lazy(() => import('react-markdown'))
// remarkMath + rehypeKatex are plugins (small), but we'll load them with markdown
let remarkMathPlugin: any = null
let rehypeKatexPlugin: any = null
async function ensureMarkdownPlugins() {
  if (!remarkMathPlugin) {
    const [rm, rk] = await Promise.all([
      import('remark-math'),
      import('rehype-katex'),
      import('katex/dist/katex.min.css'),
    ])
    remarkMathPlugin = rm.default
    rehypeKatexPlugin = rk.default
  }
}
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { supabase } from '@/lib/supabase'
import { Flag, Sparkles } from 'lucide-react'
import { SubjectIcon } from '@/lib/subject-theme'

export const Route = createFileRoute('/tutor')({
  head: privateHead('AI Tutor'),
  // ?ask= pre-fills the message box (e.g. from "Ask about this topic" links); never sends on its own.
  // ?about= names the subject and topic the student came from (shown in the header).
  validateSearch: (search: Record<string, unknown>): { ask?: string; about?: string } => ({
    ...(typeof search.ask === 'string' && search.ask.trim() ? { ask: search.ask.slice(0, 300) } : {}),
    ...(typeof search.about === 'string' && search.about.trim() ? { about: search.about.slice(0, 80) } : {}),
  }),
  component: TutorPage,
})

const SUPPORT_EMAIL = CONTACT.email

/** Follow-ups offered under the latest answer (Design System Blueprint 09, suggested prompts). */
const FOLLOW_UPS = ['Explain this more simply', 'Give me another example', 'Test me with a question']

/** A pre-filled email reporting a wrong or confusing answer (trust boundary: a report route for AI answers). */
function reportHref(answer: string) {
  const excerpt = answer.length > 600 ? `${answer.slice(0, 600)}…` : answer
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('AI tutor answer report')}&body=${encodeURIComponent(
    `What is wrong or confusing:\n\n\n---\nThe answer:\n${excerpt}`,
  )}`
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// Brand-gradient avatar with a sparkle: signals AI + learning
function TutorAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <Sparkles style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden />
    </div>
  )
}

function TutorPage() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const access = checkAccess(profile)
  const allowed = access.reason === 'admin' || access.reason === 'subscribed'

  const [messages, setMessages] = useState<Message[]>([])
  const { ask, about } = Route.useSearch()
  const [input, setInput] = useState(ask ?? '')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!user || !allowed) return
    supabase
      .from('tutor_messages')
      .select('id,role,content,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (data) setMessages(data as Message[])
        setHistoryLoaded(true)
      })
  }, [user, allowed])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending])

  // Auto-grow textarea up to ~5 lines
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }, [input])

  if (!allowed) {
    return (
      <div className="mx-auto max-w-md space-y-6 pt-6 text-center">
        <div className="mx-auto w-fit"><TutorAvatar size={64} /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Meet your AI Tutor</h1>
          <p className="text-muted-foreground">
            Stuck on a question? Ask anything. Your tutor explains step by step, in plain English, any time of day.
          </p>
        </div>
        <div className="space-y-2 text-left">
          {[
            { slug: 'biology', text: 'Explain photosynthesis simply' },
            { slug: 'mathematics', text: 'Walk me through solving 2x + 5 = 17' },
            { slug: 'biology', text: "What's the difference between mitosis and meiosis?" },
          ].map((p) => (
            <div key={p.text} className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm font-medium">
              <SubjectIcon slug={p.slug} size="sm" />
              <span>&ldquo;{p.text}&rdquo;</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Link
            to="/subscribe"
            className="flex min-h-12 py-2 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white transition-colors hover:bg-brand-strong text-center"
          >
            Unlock the AI Tutor
          </Link>
          <p className="text-xs text-muted-foreground">Included in every plan, from 25 NLe / month.</p>
        </div>
      </div>
    )
  }

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || sending) return
    setError(null)
    setSending(true)

    const tempUserMsg: Message = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
    }
    setMessages((m) => [...m, tempUserMsg])
    setInput('')

    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      if (!token) throw new Error('Not signed in')

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-tutor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: trimmed }),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        created_at: new Date().toISOString(),
      }
      setMessages((m) => [...m, aiMsg])
      if (typeof data.remaining === 'number') setRemaining(data.remaining)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reach Tutor')
      setMessages((m) => m.filter((msg) => msg.id !== tempUserMsg.id))
      setInput(trimmed)
    } finally {
      setSending(false)
    }
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-background pb-[calc(env(safe-area-inset-bottom)+64px)] lg:left-64 lg:pb-0">
      {/* HEADER — sticky, full-width, identity-forward */}
      <header
        className="flex items-center gap-3 border-b bg-background/95 backdrop-blur px-5 py-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <TutorAvatar size={36} />
        <div className="min-w-0 flex-1">
          <h1 className="font-bold leading-tight tracking-tight">AI tutor</h1>
          <p className="truncate text-xs leading-tight text-muted-foreground">
            {about ? <>Asking about <span className="font-semibold text-foreground">{about}</span></> : 'Step-by-step help with your WASSCE subjects'}
          </p>
        </div>
        {remaining !== null && (
          <p className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {remaining} left today
          </p>
        )}
      </header>

      {/* MESSAGE THREAD — full-width rows, alternating bg */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!historyLoaded ? (
          <p className="pt-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : messages.length === 0 ? (
          <div className="mx-auto max-w-md space-y-6 px-5 pt-10 text-center">
            <div className="mx-auto w-fit"><TutorAvatar size={64} /></div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground">
                Ask about any subject or topic. I&rsquo;ll explain step by step, the way WAEC expects.
              </p>
            </div>
            <div className="space-y-2 text-left">
              {[
                { slug: 'physics', text: 'Explain the structure of the atom' },
                { slug: 'mathematics', text: 'Walk me through finding the area of a circle' },
                { slug: 'history', text: 'What caused the trans-Atlantic slave trade?' },
                { slug: 'english-language', text: 'How do I write a good WASSCE essay introduction?' },
              ].map((p) => (
                <button
                  key={p.text}
                  type="button"
                  onClick={() => sendMessage(p.text)}
                  className="flex min-h-12 w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary/40"
                >
                  <SubjectIcon slug={p.slug} size="sm" />
                  <span>{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-5">
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-white">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex gap-2.5">
                  <TutorAvatar size={30} />
                  <div className="min-w-0 max-w-[90%] space-y-2">
                    <div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">AI-generated</p>
                      <div className="prose prose-slate max-w-none text-[15px] dark:prose-invert prose-headings:my-2 prose-ol:my-1.5 prose-p:my-1.5 prose-pre:my-2 prose-ul:my-1.5 prose-li:my-0.5">
                        <Suspense fallback={<p className="whitespace-pre-wrap text-sm">{m.content}</p>}>
                          <MarkdownView content={m.content} />
                        </Suspense>
                      </div>
                    </div>
                    <a
                      href={reportHref(m.content)}
                      className="inline-flex min-h-9 items-center gap-1 px-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Flag className="h-3.5 w-3.5" aria-hidden /> Report this answer
                    </a>
                    {m.id === lastAssistantId && !sending && (
                      <div className="flex flex-wrap gap-2" aria-label="Suggested follow-ups">
                        {FOLLOW_UPS.map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => sendMessage(f)}
                            className="inline-flex min-h-10 items-center rounded-full border bg-card px-3.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-brand-soft/40"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        {sending && (
          <div className="w-full px-4 pb-4">
            <div className="mx-auto flex max-w-3xl gap-2.5">
              <TutorAvatar size={30} />
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border bg-card px-4 py-3" role="status" aria-label="The tutor is writing">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="px-5 py-3 text-center text-sm text-danger" role="alert">{error} Your question is still in the box below, so you can send it again.</p>
        )}
      </div>

      {/* INPUT BAR — single floating capsule with integrated send */}
      <div className="bg-background px-4 pb-3 pt-2">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-3xl border bg-card py-1.5 pl-5 pr-1.5 transition-colors focus-within:border-primary">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask about any WASSCE topic…"
            aria-label="Your question"
            disabled={sending}
            rows={1}
            className="flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-brand-strong disabled:opacity-30"
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="mx-auto mt-1.5 max-w-3xl px-2 text-center text-[11px] leading-snug text-muted-foreground">
          Answers are AI-generated and can be wrong. Check them against your lessons. This is not an official WAEC marking scheme.{' '}
          <a href="/tutors" className="font-semibold text-primary underline-offset-2 hover:underline">Prefer a real person? Book a tutor</a>
        </p>
      </div>
    </div>
  )
}

// Wrapper that loads remarkMath + rehypeKatex once, then renders ReactMarkdown
function MarkdownView({ content }: { content: string }) {
  const [plugins, setPlugins] = useState<{ remark: any; rehype: any } | null>(null)
  useEffect(() => {
    ensureMarkdownPlugins().then(() =>
      setPlugins({ remark: remarkMathPlugin, rehype: rehypeKatexPlugin })
    )
  }, [])
  if (!plugins) {
    // First render: show plain text while plugins load
    return <p className="text-sm whitespace-pre-wrap">{content}</p>
  }
  return (
    <ReactMarkdown remarkPlugins={[plugins.remark]} rehypePlugins={[plugins.rehype]}>
      {content}
    </ReactMarkdown>
  )
}
