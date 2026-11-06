import { useEffect, type RefObject } from 'react'

/**
 * Fade-and-rise for [data-reveal] elements inside `root` as they scroll into
 * view. Progressive: the HTML renders fully visible (prerendering and no-JS
 * keep all content), elements already on screen are never hidden, and
 * nothing moves when the visitor prefers reduced motion. Stagger with the
 * CSS variable --reveal-delay (milliseconds).
 */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
    )
    for (const item of el.querySelectorAll<HTMLElement>('[data-reveal]')) {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add('is-revealed')
      else io.observe(item)
    }
    el.classList.add('reveal-armed')
    return () => io.disconnect()
  }, [root])
}
