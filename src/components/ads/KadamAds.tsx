import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { adsAllowed, hasStoredSession } from '@/lib/ads'
import { useAccess } from '@/lib/useAccess'

type Unit = {
  id: string
  script: string
  width: number
  height: number
}

const DESKTOP: Unit = {
  id: 'FgzfTN456521',
  script: 'https://hdbkome.com/qzzhzgnh.js',
  width: 728,
  height: 90,
}

const MOBILE: Unit = {
  id: 'dSbdHR456522',
  script: 'https://hdbkome.com/s7ag2adk.js',
  width: 320,
  height: 50,
}

const IN_CONTENT: Unit = {
  id: 'KZzGaH456523',
  script: 'https://hdbkome.com/qf932sdd.js',
  width: 300,
  height: 250,
}

function useKadamAllowed() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const missing = useRouterState({ select: (state) => state.matches.some((match) => match.status === 'notFound' || (match.error as { isNotFound?: boolean } | undefined)?.isNotFound === true || match.routeId === '/
  const { access, loading } = useAccess()
  const signedIn = !!user || hasStoredSession()
  const allowed =
    !loading &&
    !access.hasAccess &&
    !missing &&
    !/^\/(privacy|terms|contact)(\/|$)/.test(pathname) &&
    adsAllowed(pathname, signedIn) &&
    (typeof document === 'undefined' || !document.documentElement.classList.contains('native-app'))
  return allowed
}

/** A single Kadam unit. Its own script is loaded only when its slot is mounted. */
function KadamSlot({ unit, label }: { unit: Unit; label: string }) {
  useEffect(() => {
    const queueWindow = window as typeof window & {
      k_init?: Array<{ id: string; type: string; domain: string; refresh: boolean; next: number }>
    }
    queueWindow.k_init = queueWindow.k_init || []
    queueWindow.k_init.push({
      id: unit.id,
      type: 'bn',
      domain: 'hdbkome.com',
      refresh: false,
      next: 0,
    })

    const script = document.createElement('script')
    script.async = true
    script.charset = 'utf-8'
    script.setAttribute('data-cfasync', 'false')
    script.dataset.kadamUnit = unit.id
    script.src = unit.script
    document.head.appendChild(script)

    return () => {
      // The vendor script may finish asynchronously; do not remove it while it is executing.
      // The slot itself is removed by React when its placement unmounts.
    }
  }, [unit])

  return (
    <div
      className="mx-auto overflow-hidden"
      style={{ width: `min(${unit.width}px, 100%)`, minHeight: unit.height }}
      aria-label={label}
      data-kadam-slot={unit.id}
    >
      <div className={unit.id} />
    </div>
  )
}

/** Responsive top banner: one unit is active, never both at the same time. */
export function KadamBanner() {
  const allowed = useKadamAllowed()
  const [mounted, setMounted] = useState(false)
  const [unit, setUnit] = useState<Unit | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 800px)')
    const update = () => setUnit(media.matches ? DESKTOP : MOBILE)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  if (!mounted || !allowed) return null

  return (
    <div className="mx-auto mb-6 flex w-full justify-center px-0" aria-label="Advertisement">
      {unit && <KadamSlot unit={unit} label="Advertisement" />}
    </div>
  )
}

/** 300×250 placement used only inside long-form editorial articles. */
export function KadamInContent() {
  const allowed = useKadamAllowed()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !allowed) return null

  return (
    <div className="my-10 flex w-full justify-center" aria-label="Advertisement">
      <KadamSlot unit={IN_CONTENT} label="Advertisement" />
    </div>
  )
}
) })
  const { user } = useAuth()
  const { access, loading } = useAccess()
  const signedIn = !!user || hasStoredSession()
  const allowed =
    !loading &&
    !access.hasAccess &&
    !/^\/(privacy|terms|contact)(\/|$)/.test(pathname) &&
    adsAllowed(pathname, signedIn) &&
    (typeof document === 'undefined' || !document.documentElement.classList.contains('native-app'))
  return allowed
}

/** A single Kadam unit. Its own script is loaded only when its slot is mounted. */
function KadamSlot({ unit, label }: { unit: Unit; label: string }) {
  useEffect(() => {
    const queueWindow = window as typeof window & {
      k_init?: Array<{ id: string; type: string; domain: string; refresh: boolean; next: number }>
    }
    queueWindow.k_init = queueWindow.k_init || []
    queueWindow.k_init.push({
      id: unit.id,
      type: 'bn',
      domain: 'hdbkome.com',
      refresh: false,
      next: 0,
    })

    const script = document.createElement('script')
    script.async = true
    script.charset = 'utf-8'
    script.setAttribute('data-cfasync', 'false')
    script.dataset.kadamUnit = unit.id
    script.src = unit.script
    document.head.appendChild(script)

    return () => {
      // The vendor script may finish asynchronously; do not remove it while it is executing.
      // The slot itself is removed by React when its placement unmounts.
    }
  }, [unit])

  return (
    <div
      className="mx-auto overflow-hidden"
      style={{ width: `min(${unit.width}px, 100%)`, minHeight: unit.height }}
      aria-label={label}
      data-kadam-slot={unit.id}
    >
      <div className={unit.id} />
    </div>
  )
}

/** Responsive top banner: one unit is active, never both at the same time. */
export function KadamBanner() {
  const allowed = useKadamAllowed()
  const [unit, setUnit] = useState<Unit | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 800px)')
    const update = () => setUnit(media.matches ? DESKTOP : MOBILE)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  if (!allowed) return null

  return (
    <div className="mx-auto mb-6 flex w-full justify-center px-0" aria-label="Advertisement">
      {unit && <KadamSlot unit={unit} label="Advertisement" />}
    </div>
  )
}

/** 300×250 placement used only inside long-form editorial articles. */
export function KadamInContent() {
  const allowed = useKadamAllowed()
  if (!allowed) return null

  return (
    <div className="my-10 flex w-full justify-center" aria-label="Advertisement">
      <KadamSlot unit={IN_CONTENT} label="Advertisement" />
    </div>
  )
}
