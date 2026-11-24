// The protected lesson video player. Nothing here is a video address: the
// player asks /api/video for a short-lived viewer token, loads the encrypted
// stream with it, and unmasks the key in memory (api/_lib/video.js explains
// the server side). The site's address is burned into every frame; over the
// picture, the viewer's code drifts from corner to corner, in fullscreen too
// (the frame, not the bare <video>, goes fullscreen), so a screen recording
// says where, and for whom, it was played.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Capacitor } from '@capacitor/core'
import { Captions, Gauge, Maximize, Minimize, Pause, Play, RotateCcw } from 'lucide-react'
import type Hls from 'hls.js'
import type { HlsConfig, LoaderCallbacks, LoaderConfiguration, LoaderContext } from 'hls.js'
import { track } from '@/lib/analytics'
import { clock } from '@/lib/lesson-video'
import type { LessonVideo } from '@/lib/lesson-video'
import { cn } from '@/lib/utils'

const API = typeof window !== 'undefined' && Capacitor.isNativePlatform() ? 'https://wasscetutor.com' : ''
const SPEEDS = [1, 1.25, 1.5, 0.75]
// Where the viewer's mark sits in turn: corners and edges, never the middle of the board.
const MARK_SPOTS = ['left-[4%] top-[14%]', 'right-[4%] bottom-[16%]', 'left-[6%] bottom-[18%]', 'right-[6%] top-[20%]', 'left-[38%] bottom-[10%]', 'left-[40%] top-[9%]']

type Phase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'
type Session = { token: string; mask: Uint8Array; viewer: string }

async function startSession(video: string): Promise<Session> {
  const res = await fetch(`${API}/api/video?op=start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video }),
    credentials: 'omit',
  })
  if (!res.ok) throw new Error(`start ${res.status}`)
  const body = (await res.json()) as { token: string; mask: string; viewer: string }
  const mask = new Uint8Array(body.mask.match(/../g)!.map((h) => parseInt(h, 16)))
  return { token: body.token, mask, viewer: body.viewer }
}

const isOurs = (url: string) => url.includes('/api/video?')

export function LessonVideoPlayer({ video, startAt, className, children }: { video: LessonVideo; startAt?: number | null; className?: string; children?: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLVideoElement>(null)
  const hls = useRef<Hls | null>(null)
  const session = useRef<Session | null>(null)
  const restarts = useRef(0)
  const quartiles = useRef(new Set<number>())
  const [phase, setPhase] = useState<Phase>('idle')
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [captions, setCaptions] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [full, setFull] = useState(false)
  const [viewer, setViewer] = useState('')
  const [spot, setSpot] = useState(0)
  const [chrome, setChrome] = useState(true)
  const duration = video.duration_s

  useEffect(() => () => hls.current?.destroy(), [])

  // The viewer's mark moves every 12 seconds while the video is loaded.
  useEffect(() => {
    if (phase !== 'ready') return
    const id = window.setInterval(() => setSpot((s) => (s + 1) % MARK_SPOTS.length), 12_000)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    const onFull = () => setFull(document.fullscreenElement === frame.current)
    document.addEventListener('fullscreenchange', onFull)
    return () => document.removeEventListener('fullscreenchange', onFull)
  }, [])

  // Controls fade while playing; any movement brings them back.
  useEffect(() => {
    if (!playing) return setChrome(true)
    const id = window.setTimeout(() => setChrome(false), 2600)
    return () => window.clearTimeout(id)
  }, [playing, chrome])

  const attach = useCallback(
    async (at: number) => {
      const el = media.current!
      const { default: HlsClass } = await import('hls.js')
      if (!HlsClass.isSupported()) {
        setPhase('unsupported')
        return
      }
      session.current = await startSession(video.id)
      setViewer(session.current.viewer)
      hls.current?.destroy()

      // Key responses are masked for this viewer: unmask them before hls.js decrypts.
      const Base = HlsClass.DefaultConfig.loader
      class MaskedKeyLoader extends Base {
        load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>) {
          if (context.url.includes('op=key')) {
            const done = callbacks.onSuccess
            callbacks = {
              ...callbacks,
              onSuccess: (response, stats, ctx, details) => {
                const mask = session.current!.mask
                const bytes = new Uint8Array(response.data as ArrayBuffer).map((b, i) => b ^ mask[i])
                done({ ...response, data: bytes.buffer }, stats, ctx, details)
              },
            }
          }
          super.load(context, config, callbacks)
        }
      }
      const config: Partial<HlsConfig> = {
        loader: MaskedKeyLoader as unknown as HlsConfig['loader'],
        // The token travels only in a header, and only to our own API, never in an address.
        xhrSetup: (xhr, url) => {
          if (isOurs(url)) xhr.setRequestHeader('X-Video-Token', session.current!.token)
        },
        startPosition: at,
        maxBufferLength: 30,
        enableWorker: true,
      }
      const h = new HlsClass(config)
      hls.current = h
      h.on(HlsClass.Events.ERROR, (_e, data) => {
        if (!data.fatal) return
        const code = data.response?.code ?? 0
        // An expired token or segment address, or a republished video: start again from here.
        if (data.type === HlsClass.ErrorTypes.NETWORK_ERROR && restarts.current < 3 && [0, 400, 403, 409].includes(code)) {
          restarts.current++
          const here = el.currentTime || at
          void attach(here).catch(() => setPhase('error'))
        } else if (data.type === HlsClass.ErrorTypes.MEDIA_ERROR && restarts.current < 3) {
          restarts.current++
          h.recoverMediaError()
        } else {
          setPhase('error')
        }
      })
      h.on(HlsClass.Events.MANIFEST_PARSED, () => {
        setPhase('ready')
        el.playbackRate = speed
        void el.play().catch(() => setPlaying(false))
      })
      h.loadSource(`${API}/api/video?op=playlist&v=${encodeURIComponent(video.id)}`)
      h.attachMedia(el)
    },
    // speed is read once, when the stream is first attached
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [video.id],
  )

  const begin = useCallback(
    (at = startAt ?? 0) => {
      if (phase === 'loading') return
      if (phase === 'ready') {
        const el = media.current!
        el.currentTime = at
        void el.play()
        return
      }
      setPhase('loading')
      // Called inside the tap, so phones allow the sound once the stream is ready.
      void media.current?.play().catch(() => {})
      track('video_start', { video_id: video.id })
      attach(at).catch(() => setPhase('error'))
    },
    [attach, phase, startAt, video.id],
  )

  const toggle = () => {
    const el = media.current
    if (!el || phase !== 'ready') return begin()
    if (el.paused) void el.play()
    else el.pause()
  }
  const seek = (to: number) => {
    const el = media.current
    if (el && phase === 'ready') el.currentTime = Math.min(Math.max(0, to), duration - 0.2)
  }
  const toggleFull = () => {
    if (!frame.current) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void frame.current.requestFullscreen?.().catch(() => {})
  }
  const toggleCaptions = () => {
    const track = media.current?.textTracks[0]
    const on = !captions
    if (track) track.mode = on ? 'showing' : 'hidden'
    setCaptions(on)
  }
  const nextSpeed = () => {
    const s = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
    if (media.current) media.current.playbackRate = s
    setSpeed(s)
  }
  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ' ': toggle, k: toggle, f: toggleFull, c: toggleCaptions,
      ArrowLeft: () => seek(time - 5), ArrowRight: () => seek(time + 5),
    }
    const act = keys[e.key]
    if (act && e.target === frame.current) {
      e.preventDefault()
      act()
    }
  }
  const onTime = () => {
    const el = media.current!
    setTime(el.currentTime)
    const b = el.buffered
    setBuffered(b.length ? b.end(b.length - 1) : 0)
    const q = Math.floor((el.currentTime / duration) * 4)
    if (q > 0 && !quartiles.current.has(q)) {
      quartiles.current.add(q)
      track('video_progress', { video_id: video.id, percent: q * 25 })
    }
  }

  const progress = duration ? (time / duration) * 100 : 0
  return (
    <div className={cn('space-y-3', className)}>
      <div
        ref={frame}
        tabIndex={0}
        role="region"
        aria-label={`Video lesson: ${video.title}`}
        onKeyDown={onKey}
        onMouseMove={() => setChrome(true)}
        onTouchStart={() => setChrome(true)}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          'group relative aspect-video w-full select-none overflow-hidden bg-[#1f3229] outline-none ring-primary/60 focus-visible:ring-2',
          full ? 'rounded-none' : 'rounded-2xl shadow-lg',
          playing && !chrome && 'cursor-none',
        )}
      >
        <video
          ref={media}
          className="absolute inset-0 h-full w-full"
          playsInline
          preload="none"
          crossOrigin="anonymous"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback noplaybackrate nofullscreen"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false)
            track('video_complete', { video_id: video.id })
          }}
          onTimeUpdate={onTime}
          onClick={toggle}
          onDragStart={(e) => e.preventDefault()}
        >
          {video.captions_url && <track kind="captions" srcLang="en" label="English" src={video.captions_url} />}
        </video>

        {phase !== 'ready' && (
          <button type="button" onClick={() => begin()} className="absolute inset-0 block h-full w-full" aria-label={`Play the video lesson: ${video.title}`}>
            <img src={video.thumbnail_url} alt="" width={1280} height={720} className="h-full w-full object-cover" draggable={false} />
            <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1f3229] shadow-xl transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
              {phase === 'loading' ? <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-current border-t-transparent" /> : <Play className="ml-1 h-8 w-8 fill-current sm:h-9 sm:w-9" aria-hidden />}
            </span>
            <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-left text-white">
              <span className="text-sm font-semibold drop-shadow sm:text-base">{startAt ? `Play from ${clock(startAt)}` : 'Watch the lesson'}</span>
              <span className="rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold tabular-nums">{clock(duration)}</span>
            </span>
          </button>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-6 text-center text-white">
            <p className="font-semibold">The video could not load. Check your connection and try again.</p>
            <button type="button" onClick={() => { restarts.current = 0; setPhase('idle') }} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              <RotateCcw className="h-4 w-4" aria-hidden /> Try again
            </button>
          </div>
        )}
        {phase === 'unsupported' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 text-center text-sm font-semibold text-white">
            This browser cannot play protected video. Update it, or watch in Chrome or the WASSCE Tutor app.
          </div>
        )}

        {/* The viewer's mark: the site and their code, moving, in fullscreen too. */}
        {phase === 'ready' && (
          <span aria-hidden className={cn('pointer-events-none absolute z-10 whitespace-nowrap rounded px-1.5 text-[10px] font-semibold tracking-wide text-white/40 transition-all duration-[1500ms] sm:text-xs', MARK_SPOTS[spot])}>
            wasscetutor.com · {viewer}
          </span>
        )}

        {phase === 'ready' && (
          <div className={cn('absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-white transition-opacity', chrome || !playing ? 'opacity-100' : 'opacity-0')}>
            <div className="relative h-5">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white/35" style={{ width: `${(buffered / duration) * 100}%` }} />
              </div>
              <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#fddd6b]" style={{ width: `${progress}%` }} />
              {video.chapters.map((c) => (
                <span key={c.start} className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 bg-black/60" style={{ left: `${(c.start / duration) * 100}%` }} />
              ))}
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={time}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                aria-valuetext={`${clock(time)} of ${clock(duration)}`}
                className="absolute inset-0 h-5 w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Control label={playing ? 'Pause' : 'Play'} onClick={toggle}>
                {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
              </Control>
              <span className="px-1 text-xs font-medium tabular-nums">{clock(time)} / {clock(duration)}</span>
              <span className="flex-1" />
              {video.captions_url && (
                <Control label={captions ? 'Hide captions' : 'Show captions'} onClick={toggleCaptions} active={captions}>
                  <Captions className="h-5 w-5" />
                </Control>
              )}
              <Control label={`Speed ${speed}×`} onClick={nextSpeed}>
                <span className="flex items-center gap-0.5 text-xs font-semibold"><Gauge className="h-4 w-4" />{speed}×</span>
              </Control>
              <Control label={full ? 'Exit full screen' : 'Full screen'} onClick={toggleFull}>
                {full ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Control>
            </div>
          </div>
        )}
      </div>

      {video.chapters.length > 1 && (
        <nav aria-label="In this video" className="flex gap-2 overflow-x-auto pb-1">
          {video.chapters.map((c) => (
            <button
              key={c.start}
              type="button"
              onClick={() => begin(c.start)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors hover:border-primary/60 hover:bg-muted',
                phase === 'ready' && time >= c.start && time < (video.chapters.find((d) => d.start > c.start)?.start ?? Infinity) && 'border-primary/60 bg-primary/5 text-primary',
              )}
            >
              <span className="tabular-nums text-muted-foreground">{clock(c.start)}</span> {c.name}
            </button>
          ))}
        </nav>
      )}
      {children}
    </div>
  )
}

function Control({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cn('inline-flex h-9 min-w-9 items-center justify-center rounded-md px-1.5 hover:bg-white/15', active && 'text-[#fddd6b]')}>
      {children}
    </button>
  )
}
