import { createFileRoute, Link } from '@tanstack/react-router'
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
import { Sparkles } from 'lucide-react'
import { SubjectIcon } from '@/lib/subject-theme'

export const Route = createFileRoute('/tutor')({
  head: privateHead('AI Tutor'),
  // ?ask= pre-fills the message box (e.g. from "Ask about this topic" links); never sends on its own.
  validateSearch: (search: Record<string, unknown>): { ask?: string } =>
    typeof search.ask === 'string' && search.ask.trim() ? { ask: search.ask.slice(0, 300) } : {},
  component: TutorPage,
})

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
  const { ask } = Route.useSearch()
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
            <div key={p.text} className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm font-medium shadow-sm">
              <SubjectIcon slug={p.slug} size="sm" />
              <span>&ldquo;{p.text}&rdquo;</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Link
            to="/subscribe"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-white shadow-md transition hover:shadow-lg"
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

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-background" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 76px)' }}>
      {/* HEADER — sticky, full-width, identity-forward */}
      <header
        className="flex items-center gap-3 border-b bg-background/95 backdrop-blur px-5 py-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <TutorAvatar size={36} />
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight tracking-tight">AI Tutor</p>
          <p className="text-xs text-muted-foreground leading-tight">
            Ask anything from your WASSCE subjects
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
                  className="flex w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium shadow-sm transition hover:border-primary/40 hover:shadow-md"
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
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-primary px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex gap-2.5">
                  <TutorAvatar size={30} />
                  <div className="min-w-0 max-w-[90%] rounded-3xl rounded-tl-lg border bg-card px-4 py-3 shadow-sm">
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-headings:my-2 prose-ol:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
                      <Suspense fallback={<p className="whitespace-pre-wrap text-sm">{m.content}</p>}>
                        <MarkdownView content={m.content} />
                      </Suspense>
                    </div>
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
              <div className="flex items-center gap-1 rounded-3xl rounded-tl-lg border bg-card px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="px-5 py-3 text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* INPUT BAR — single floating capsule with integrated send */}
      <div className="bg-background px-4 pb-3 pt-2">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-full border bg-background pl-5 pr-1.5 py-1.5 shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition">
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
            placeholder="Ask Tutor anything…"
            disabled={sending}
            rows={1}
            className="flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed disabled:opacity-50 focus:outline-none placeholder:text-muted-foreground/70"
          />
          <button
            onClick={() => sendMessage()}
            disabled={sending || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition disabled:opacity-30 hover:opacity-90"
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
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
