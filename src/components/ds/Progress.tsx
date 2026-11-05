// Progress indicators shared by the learning screens.

const pct = (value: number, max: number) => (max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0)

/** Horizontal progress bar. `fill` is a background class (e.g. a subject palette's `bar`). */
export function ProgressBar({
  value,
  max,
  fill = 'bg-primary',
  track = 'bg-muted',
  size = 'md',
  label,
}: {
  value: number
  max: number
  fill?: string
  /** background class for the empty part of the bar */
  track?: string
  size?: 'sm' | 'md' | 'lg'
  /** accessible name, e.g. "Biology lessons completed" */
  label?: string
}) {
  const p = pct(value, max)
  const height = size === 'lg' ? 'h-3' : size === 'sm' ? 'h-1.5' : 'h-2'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`w-full overflow-hidden rounded-full ${track} ${height}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${fill} ${p === 0 ? 'opacity-0' : ''}`}
        style={{ width: `${Math.max(p, p > 0 ? 3 : 0)}%` }}
      />
    </div>
  )
}

/** Circular progress with content in the middle. `stroke` is a text-colour class. */
export function ProgressRing({
  value,
  max,
  size = 96,
  thickness = 9,
  stroke = 'text-primary',
  label,
  children,
}: {
  value: number
  max: number
  size?: number
  thickness?: number
  stroke?: string
  label?: string
  children?: React.ReactNode
}) {
  const p = pct(value, max)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={c}
          strokeDashoffset={c - (c * p) / 100}
          className={`${stroke} transition-[stroke-dashoffset] duration-700 ease-out ${p === 0 ? 'opacity-0' : ''}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export { pct as percent }
