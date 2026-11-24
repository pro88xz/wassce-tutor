// The protected lesson video player. Nothing here is a video address: the
// player asks /api/video for a short-lived viewer token (after Cloudflare's
// check that a person pressed play, when it is switched on), loads the
// encrypted stream with it, and unmasks the key in memory (api/_lib/video.js
// explains the server side). The video itself carries the WASSCE Tutor
// caption in every frame and ends on the brand card.
//
// Downloading is for subscribers: the Download button asks the server, which
// checks the signed-in student's plan and only then gives a ten-minute address
// to the file. Everyone else is offered a subscription.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Capacitor } from '@capacitor/core'
import { Captions, Download, Gauge, Lock, Maximize, Minimize, Pause, Play, RotateCcw } from 'lucide-react'
import type Hls from 'hls.js'
import type { HlsConfig, LoaderCallbacks, LoaderConfiguration, LoaderContext } from 'hls.js'
import { track } from '@/lib/analytics'
import { clock } from '@/lib/lesson-video'
import type { LessonVideo } from '@/lib/lesson-video'
import { supabase } from '@/lib/supabase'
import { personToken } from '@/lib/turnstile'
import { cn } from '@/lib/utils'

const API = typeof window !== 'undefined' && Capacitor.isNativePlatform() ? 'https://wasscetutor.com' : ''
const SPEEDS = [1, 1.25, 1.5, 0.75]
type Phase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'
type Session = { token: string; mask: Uint8Array }
type Offer = 'subscribe' | 'preparing' | 'busy' | 'failed'

async function startSession(video: string, human: string | undefined): Promise<Session> {
  const res = await fetch(`${API}/api/video?op=start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video, human }),
    credentials: 'omit',
  })
  if (!res.ok) throw new Error(`start ${res.status}`)
  const body = (await res.json()) as { token: string; mask: string }
  const mask = new Uint8Array(body.mask.match(/../g)!.map((h) => parseInt(h, 16)))
  return { token: body.token, mask }
}

const isOurs = (url: string) => url.includes('/api/video?')

/** Asks the server for the subscriber's download; returns what to tell the student, or null once it has started. */
async function requestDownload(video: string): Promise<Offer | null> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return 'subscribe'
  const res = await fetch(`${API}/api/video?op=download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ video }),
    credentials: 'omit',
  })
  if (res.status === 401 || res.status === 402) return 'subscribe'
  if (res.status === 409) return 'preparing'
  if (res.status === 429) return 'busy'
  if (!res.ok) return 'failed'
  const { url } = (await res.json()) as { url: string }
  const a = document.createElement('a')
  a.href = url
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  return null
}

type Fullscreenable = HTMLVideoElement & { webkitEnterFullscreen?: () => void }
type Lockable = ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void }

export function LessonVideoPlayer({ video, startAt, className, children }: { video: LessonVideo; startAt?: number | null; className?: string; children?: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLVideoElement>(null)
  const humanBox = useRef<HTMLDivElement>(null)
  const tapShowsControls = useRef(false)
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
  const [chrome, setChrome] = useState(true)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [fetching, setFetching] = useState(false)
  const duration = video.duration_s

  useEffect(() => () => hls.current?.destroy(), [])

  useEffect(() => {
    const onFull = () => {
      const on = document.fullscreenElement === frame.current
      setFull(on)
      if (!on) (screen.orientation as Lockable | undefined)?.unlock?.()
    }
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
      session.current = await startSession(video.id, await personToken(humanBox.current!))
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
    const box = frame.current
    if (!box) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else if (box.requestFullscreen) {
      void box.requestFullscreen().then(() => {
        // A phone turns the lesson sideways, so the board fills the screen.
        if (window.matchMedia('(pointer: coarse)').matches) void (screen.orientation as Lockable | undefined)?.lock?.('landscape').catch(() => {})
      }).catch(() => {})
    } else {
      // iPhone Safari can put only the video itself in full screen.
      ;(media.current as Fullscreenable | null)?.webkitEnterFullscreen?.()
    }
  }
  const download = async () => {
    if (fetching) return
    media.current?.pause()
    setFetching(true)
    track('video_download_tap', { video_id: video.id })
    try {
      const next = await requestDownload(video.id)
      setOffer(next)
      if (!next) track('video_download', { video_id: video.id })
    } catch {
      setOffer('failed')
    } finally {
      setFetching(false)
    }
  }
  // On a phone, a tap while the controls are hidden only brings them back; it does not pause the lesson.
  const onVideoClick = () => {
    if (tapShowsControls.current) {
      tapShowsControls.current = false
      return
    }
    toggle()
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
        onTouchStart={() => {
          tapShowsControls.current = playing && !chrome
          window.setTimeout(() => (tapShowsControls.current = false), 700)
          setChrome(true)
        }}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          'group relative aspect-video w-full select-none overflow-hidden bg-[#1f3229] outline-none ring-primary/60 focus-visible:ring-2',
          full ? 'rounded-none' : 'rounded-[3px] shadow-lg',
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
          onClick={onVideoClick}
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

        {phase !== 'ready' && (
          <button
            type="button"
            onClick={download}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 py-1.5 pl-2.5 pr-1.5 text-xs font-semibold text-white shadow hover:bg-black/85"
            aria-label="Download this video (for subscribers)"
          >
            <Download className="h-4 w-4" aria-hidden /> Download
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fddd6b] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
              <Lock className="h-2.5 w-2.5" aria-hidden /> Subscribers
            </span>
          </button>
        )}

        {/* Cloudflare's check appears here only in the rare case it must ask. */}
        <div ref={humanBox} className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2" />

        {offer && (
          <div role="dialog" aria-modal="true" aria-label="Download this video" className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 p-5 text-center text-white">
            <div className="max-w-sm space-y-3">
              <Download className="mx-auto h-8 w-8 text-[#fddd6b]" aria-hidden />
              {offer === 'subscribe' && (
                <>
                  <p className="text-lg font-bold">Subscribe to download</p>
                  <p className="text-sm text-white/80">Subscribers can download every video lesson and watch it any time, with no data.</p>
                </>
              )}
              {offer === 'preparing' && <p className="text-sm font-semibold">This video's download is being prepared. Please try again later today.</p>}
              {offer === 'busy' && <p className="text-sm font-semibold">You have downloaded a lot of videos today. Please try again tomorrow.</p>}
              {offer === 'failed' && <p className="text-sm font-semibold">The download could not start. Check your connection and try again.</p>}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {offer === 'subscribe' && (
                  <a href="/subscribe" className="rounded-full bg-[#fddd6b] px-5 py-2 text-sm font-bold text-black" onClick={() => track('video_download_subscribe', { video_id: video.id })}>
                    Subscribe
                  </a>
                )}
                <button type="button" onClick={() => setOffer(null)} className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold">
                  {offer === 'subscribe' ? 'Not now' : 'Close'}
                </button>
              </div>
            </div>
          </div>
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

        {phase === 'ready' && (
          <div className={cn('absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-white transition-opacity', chrome || !playing ? 'opacity-100' : 'pointer-events-none opacity-0')}>
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
                // inline: the site's rule that every input on a page is 2.9rem tall (for tapping)
                // made this invisible bar cover the buttons below it
                style={{ minHeight: 0 }}
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
              <Control label="Download (subscribers)" onClick={download}>
                <span className="relative inline-flex">
                  <Download className="h-5 w-5" />
                  <Lock className="absolute -bottom-1 -right-1.5 h-3 w-3 rounded-full bg-[#fddd6b] p-[1px] text-black" />
                </span>
              </Control>
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
