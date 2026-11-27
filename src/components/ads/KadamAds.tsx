import { useEffect, useRef, useState } from 'react'
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

declare global {
  interface Window {
    k_init?: Array<{
      id: string
      type: string
      domain: string
      refresh: boolean
      next: number
    }>
    __wassceKadamUnits?: Set<string>
  }
}

/** Ads are limited to eligible public pages and excluded from app/workspace routes. */
function useKadamAllowed() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const missing = useRouterState({
    select: (state) => state.matches.some((match) => match.status === 'notFound'),
  })
  const { user } = useAuth()
  const { access, loading } = useAccess()
  const signedIn = Boolean(user) || hasStoredSession()

  return (
    !loading &&
    !access.hasAccess &&
    !missing &&
    !/^\\/(privacy|terms|contact)(\\/|$)/.test(pathname) &&
    adsAllowed(pathname, signedIn) &&
    (typeof document === 'undefined' ||
      !document.documentElement.classList.contains('native-app'))
  )
}

/**
 * A slot takes up no layout space until Kadam actually inserts an advert.
 * This prevents empty inventory from leaving blank bands above or inside content.
 */
function KadamSlot({
  unit,
  label,
  className,
}: {
  unit: Unit
  label: string
  className: string
}) {
  const slotRef = useRef<HTMLDivElement>(null)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    window.__wassceKadamUnits ??= new Set<string>()
    if (!window.__wassceKadamUnits.has(unit.id)) {
      window.__wassceKadamUnits.add(unit.id)
      window.k_init ??= []
      window.k_init.push({
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
    }

    const slot = slotRef.current
    if (!slot) return

    const hasCreative = () =>
      slot.childElementCount > 0 ||
      Boolean(slot.textContent?.trim()) ||
      Boolean(slot.querySelector('iframe, img, video, ins, object'))

    if (hasCreative()) {
      setFilled(true)
      return
    }

    const observer = new MutationObserver(() => {
      if (hasCreative()) {
        setFilled(true)
        observer.disconnect()
        window.clearTimeout(timeout)
      }
    })
    observer.observe(slot, { childList: true, subtree: true, characterData: true })

    // No fill (or a blocked provider script) means no reserved blank space.
    const timeout = window.setTimeout(() => observer.disconnect(), 10000)
    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [unit])

  return (
    <div
      className={filled ? className : 'hidden'}
      aria-label={label}
      data-kadam-slot={unit.id}
    >
      <div
        ref={slotRef}
        className={unit.id}
        style={{ width: `min(${unit.width}px, 100%)`, minHeight: unit.height, overflow: 'hidden' }}
      />
    </div>
  )
}

/** Shared top banner: desktop and mobile units are mutually exclusive. */
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

  if (!allowed || !unit) return null

  return (
    <KadamSlot
      unit={unit}
      label="Advertisement"
      className="mx-auto mb-6 flex w-full justify-center px-0"
    />
  )
}

/** 300×250 in-content unit; mounted only by eligible editorial content templates. */
export function KadamInContent() {
  const allowed = useKadamAllowed()
  if (!allowed) return null

  return (
    <KadamSlot
      unit={IN_CONTENT}
      label="Advertisement"
      className="my-10 flex w-full justify-center"
    />
  )
}
