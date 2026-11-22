// The score at the top of a results card: a ring that fills to the percentage
// while the number counts up, and, for a strong result, a short burst of dots.
// No sound. Anyone who asks their device for less motion sees the final score
// at once (index.css turns the motion off).
import { useEffect, useState } from 'react'

const prefersLessMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Counts from 0 to `to` over `ms`, easing out; the final value at once when motion is reduced. */
function useCountUp(to: number, ms = 1100): number {
  const [value, setValue] = useState(() => (prefersLessMotion() ? to : 0))
  useEffect(() => {
    const still = prefersLessMotion()
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = still ? 1 : Math.min(1, (now - start) / ms)
      setValue(Math.round(to * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, ms])
  return value
}

const BURST_COLOURS = ['var(--primary)', 'var(--success)', 'var(--warning)', '#d23f6a']

export function ScoreRing({ score, total, size = 120 }: { score: number; total: number; size?: number }) {
  const pct = total ? Math.round((score / total) * 100) : 0
  const shown = useCountUp(pct)
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  // Start empty, then fill on the next frame so the transition runs.
  const [filled, setFilled] = useState(prefersLessMotion())
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(id)
  }, [])
  const colour = pct >= 70 ? 'var(--success)' : 'var(--primary)'
  const dots = pct === 100 ? 18 : pct >= 70 ? 12 : 0

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle className="score-ring__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="score-ring__bar"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colour}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={filled ? c * (1 - pct / 100) : c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums leading-none">{shown}%</span>
        <span className="mt-1 text-sm font-semibold tabular-nums text-muted-foreground">
          {score}/{total}
        </span>
      </div>
      {dots > 0 && (
        <div className="score-burst" aria-hidden>
          {Array.from({ length: dots }, (_, i) => (
            <span
              key={i}
              style={
                {
                  '--a': `${(360 / dots) * i}deg`,
                  '--d': `${size * 0.62 + (i % 3) * 8}px`,
                  '--delay': `${0.75 + (i % 4) * 0.04}s`,
                  background: BURST_COLOURS[i % BURST_COLOURS.length],
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
