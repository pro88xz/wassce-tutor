// Long displayed equations on a phone.
//
// A worked step such as
//   least count = 1 MSD − 1 VSD = 1.0 mm − 0.9 mm = 0.1 mm
// is wider than a phone screen, so KaTeX shows it in a box the reader has to
// swipe sideways. splitForNarrow() rewrites it with one step per line:
//
//   least count
//   = 1 MSD − 1 VSD
//   = 1.0 mm − 0.9 mm
//   = 0.1 mm
//
// LessonView renders both forms and shows the stacked one only when the
// one-line form does not fit (see fitLongMath()), so wide screens are unchanged.

const RELATIONS = ['=', '\\approx', '\\Rightarrow']

/** Roughly how many characters the formula shows (commands count as one). */
export function visibleLength(tex: string): number {
  return tex
    .replace(/\\(?:text|mathrm|textbf)\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, '#')
    .replace(/\\[ ,;:!]|[{}^_\s]/g, '').length
}

/** Split at depth-0 occurrences of a separator (outside any {...}). */
function splitTop(tex: string, isSep: (s: string, i: number) => string | null): { parts: string[]; seps: string[] } {
  const parts: string[] = []
  const seps: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < tex.length; i++) {
    const c = tex[i]
    if (c === '\\') {
      if (tex[i + 1] === '{' || tex[i + 1] === '}') {
        i += 1
        continue
      }
      if (depth === 0) {
        const sep = isSep(tex, i)
        if (sep) {
          parts.push(tex.slice(start, i))
          seps.push(sep)
          i += sep.length - 1
          start = i + 1
          continue
        }
      }
      continue
    }
    if (c === '{') depth += 1
    else if (c === '}') depth = Math.max(0, depth - 1)
    else if (depth === 0) {
      const sep = isSep(tex, i)
      if (sep) {
        parts.push(tex.slice(start, i))
        seps.push(sep)
        i += sep.length - 1
        start = i + 1
      }
    }
  }
  parts.push(tex.slice(start))
  return { parts, seps }
}

const commandAt = (s: string, i: number, name: string) =>
  s.startsWith(name, i) && !/[a-zA-Z]/.test(s[i + name.length] ?? '') ? name : null

const relationAt = (s: string, i: number) => {
  if (s[i] === '=') return '='
  for (const r of RELATIONS) if (r !== '=' && commandAt(s, i, r)) return r
  return null
}

function stackRow(row: string): string | null {
  const { parts, seps } = splitTop(row, relationAt)
  if (seps.length === 0) return null
  const lhs = parts[0].trim()
  const steps = seps.map((r, k) => `${r} ${parts[k + 1].trim()}`)
  // A short left side (v, L, \rho) stays on the first line: "v = ...".
  const lines =
    lhs && visibleLength(lhs) <= 4
      ? [`${lhs} &${steps[0]}`, ...steps.slice(1).map((s) => `&${s}`)]
      : [...(lhs ? [`&${lhs}`] : []), ...steps.map((s) => `&${s}`)]
  return `\\begin{aligned}${lines.join(' \\\\ ')}\\end{aligned}`
}

/** The stacked form of a long displayed equation, or null if it needs none. */
export function splitForNarrow(tex: string): string | null {
  const src = tex.trim()
  if (visibleLength(src) < 22) return null
  if (/\\begin\{|\\\\|&/.test(src)) return null // already laid out by its author
  const rows = splitTop(src, (s, i) => commandAt(s, i, '\\qquad')).parts.map((r) => r.trim()).filter(Boolean)
  const laid = rows.map((r) => (visibleLength(r) >= 14 ? stackRow(r) : null) ?? r)
  if (rows.length === 1) return laid[0] === rows[0] ? null : laid[0]
  return `\\begin{gathered}${laid.join(' \\\\[6pt] ')}\\end{gathered}`
}

/** Show the stacked form of each long equation only where the one-line form overflows. */
export function fitLongMath(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.math-split').forEach((wrap) => {
    const k = wrap.querySelector<HTMLElement>('.math-wide .katex-display')
    if (k) wrap.classList.toggle('is-narrow', k.scrollWidth > k.clientWidth + 1)
  })
}
