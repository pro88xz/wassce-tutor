import { createFileRoute, Link } from '@tanstack/react-router'
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
    ])
    remarkMathPlugin = rm.default
    rehypeKatexPlugin = rk.default
  }
}
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tutor')({
  component: TutorPage,
})

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// Sparkle-graduation-cap hybrid: signals AI + learning
function TutorAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-4 w-4"
      >
        {/* Graduation cap */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4L2 8l10 4 10-4-10-4z M6 10v5c0 1 2.5 2 6 2s6-1 6-2v-5"
        />
      </svg>
    </div>
  )
}

function TutorPage() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const access = checkAccess(profile)
  const allowed = access.reason === 'admin' || access.reason === 'subscribed'

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
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
      <div className="mx-auto max-w-md space-y-6 pt-8 text-center">
        <TutorAvatar size={56} />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Meet your Tutor</h1>
          <p className="text-muted-foreground">
            Stuck on a question? Ask anything — your tutor explains step-by-step, in plain English, any time of day.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5 space-y-2 text-left text-sm">
          <p className="font-semibold">Examples you can ask:</p>
          <p className="text-muted-foreground">• &ldquo;Explain photosynthesis simply&rdquo;</p>
          <p className="text-muted-foreground">• &ldquo;Walk me through solving 2x + 5 = 17&rdquo;</p>
          <p className="text-muted-foreground">• &ldquo;Difference between mitosis and meiosis?&rdquo;</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Tutor unlocks with any subscription — plans start at 25 NLe / month.
        </p>
        <Link to="/subscribe" className="block">
          <Button className="h-12 w-full">Subscribe to unlock Tutor</Button>
        </Link>
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
          <p className="font-bold leading-tight">Tutor</p>
          <p className="text-xs text-muted-foreground leading-tight">
            Your WASSCE study companion
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
          <div className="mx-auto max-w-md px-5 pt-12 text-center space-y-6">
            <TutorAvatar size={56} />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground">
                Ask about any subject in your faculty, any topic, any difficulty.
              </p>
            </div>
            <div className="space-y-2 text-left">
              {[
                { icon: '⚛️', text: 'Explain the structure of the atom' },
                { icon: '📐', text: 'Walk me through finding the area of a circle' },
                { icon: '📜', text: 'What caused the trans-Atlantic slave trade?' },
              ].map((p) => (
                <button
                  key={p.text}
                  onClick={() => sendMessage(p.text)}
                  className="flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left text-sm transition hover:border-primary hover:bg-primary/5"
                >
                  <span className="text-lg">{p.icon}</span>
                  <span>{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user'
            return (
              <div
                key={m.id}
                className={`w-full px-5 py-4 ${isUser ? '' : 'bg-muted/30'}`}
              >
                <div className="mx-auto max-w-3xl flex gap-3">
                  {isUser ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      You
                    </div>
                  ) : (
                    <TutorAvatar />
                  )}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      {isUser ? 'You' : 'Tutor'}
                    </p>
                    {isUser ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                    ) : (
                      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-headings:my-2 prose-ol:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
                        <Suspense fallback={<p className="text-sm whitespace-pre-wrap">{m.content}</p>}>
                          <MarkdownView content={m.content} />
                        </Suspense>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        {sending && (
          <div className="w-full bg-muted/30 px-5 py-4">
            <div className="mx-auto max-w-3xl flex gap-3">
              <TutorAvatar />
              <div className="flex items-center pt-2 gap-1">
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition disabled:opacity-30 hover:opacity-90"
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
