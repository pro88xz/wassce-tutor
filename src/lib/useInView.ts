import { useEffect, useState, type RefObject } from 'react'

/**
 * True once the element has been on screen (at least `threshold` of it), and
 * from then on, while `active`. It starts watching only when `active`, so an
 * animation that waits on it plays when its result can be seen, not
 * off-screen. To watch again from the start, give the element a new key.
 */
export function useInView(ref: RefObject<Element | null>, active = true, threshold = 0.35): boolean {
  const [seen, setSeen] = useState(false)
  const noObserver = typeof IntersectionObserver === 'undefined'
  useEffect(() => {
    const el = ref.current
    if (!active || seen || !el || noObserver) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, active, seen, threshold, noObserver])
  return active && (seen || noObserver)
}
