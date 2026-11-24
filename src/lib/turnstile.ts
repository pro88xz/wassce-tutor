// Cloudflare Turnstile: proof that a person in a real browser pressed play, so
// a download tool or script cannot get a video's viewing token (api/_lib/video.js
// confirms the token with Cloudflare). Invisible to students: Cloudflare shows a
// check only in the rare case it cannot tell. Off until VITE_TURNSTILE_SITE_KEY is set.
//
// Each token works once, for five minutes, so a fresh widget runs for every start.

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  execute: (id: string) => void
  remove: (id: string) => void
  reset: (id: string) => void
}

const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || ''
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let loading: Promise<Turnstile> | null = null

function load(): Promise<Turnstile> {
  loading ??= new Promise<Turnstile>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => {
      const t = (window as unknown as { turnstile?: Turnstile }).turnstile
      if (t) resolve(t)
      else reject(new Error('turnstile did not load'))
    }
    s.onerror = () => {
      loading = null
      reject(new Error('turnstile did not load'))
    }
    document.head.appendChild(s)
  })
  return loading
}

/**
 * A one-time token that a person is here (playing a video, sending a form), or
 * undefined when the check is off. A challenge that fails is tried again twice
 * (Cloudflare's advice for its 600xxx errors); the error names Cloudflare's code.
 */
export async function personToken(container: HTMLElement, action = 'video-start'): Promise<string | undefined> {
  if (!SITE_KEY) return undefined
  const t = await load()
  return new Promise<string>((resolve, reject) => {
    let id = ''
    let tries = 0
    const done = (fn: () => void) => {
      window.clearTimeout(timer)
      fn()
      window.setTimeout(() => id && t.remove(id))
    }
    const timer = window.setTimeout(() => done(() => reject(new Error('check timed out'))), 30000)
    id = t.render(container, {
      sitekey: SITE_KEY,
      execution: 'execute',
      appearance: 'interaction-only',
      action,
      retry: 'never',
      callback: (token: string) => done(() => resolve(token)),
      'error-callback': (code: string) => {
        // 1xxxxx: the widget's settings (a hostname or key); trying again will not help.
        if (++tries <= 2 && !String(code).startsWith('1')) {
          window.setTimeout(() => { t.reset(id); t.execute(id) }, 600)
        } else {
          done(() => reject(new Error(`check ${code}`)))
        }
        return true
      },
    })
    t.execute(id)
  })
}
