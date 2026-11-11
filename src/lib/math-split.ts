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

// Steps within a line break before these: "= ...", "≈ ...".
const RELATIONS = ['=', '\\approx']
// A new line starts at these and keeps them: "⇒ sin φ = 0.75", "→ Ba + Kr + 3n".
const ARROWS = ['\\Longrightarrow', '\\Rightarrow', '\\longrightarrow', '\\rightarrow', '\\to']
// A new line starts here and the spacing itself is dropped.
const GAPS = ['\\qquad', '\\quad']

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

/** Break a formula into lines at \\quad / \\qquad gaps and before arrows. */
function rows(src: string): string[] {
  const { parts, seps } = splitTop(src, (s, i) => {
    for (const g of GAPS) if (commandAt(s, i, g)) return g
    for (const a of ARROWS) if (commandAt(s, i, a)) return a
    return null
  })
  const out = [parts[0]]
  seps.forEach((sep, k) => out.push(ARROWS.includes(sep) ? `${sep} ${parts[k + 1]}` : parts[k + 1]))
  const lines = out.map((r) => r.trim()).filter(Boolean)
  // "\quad\Longrightarrow\quad s = ..." leaves the arrow alone: join it to the next line.
  const merged: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (ARROWS.includes(lines[i]) && i + 1 < lines.length) {
      merged.push(`${lines[i]} ${lines[i + 1]}`)
      i += 1
    } else merged.push(lines[i])
  }
  return merged
}

/** The stacked form of a long displayed equation, or null if it needs none. */
export function splitForNarrow(tex: string): string | null {
  const src = tex.trim()
  if (visibleLength(src) < 14) return null
  if (/\\begin\{|\\\\|&/.test(src)) return null // already laid out by its author
  const lines = rows(src)
  const laid = lines.map((r) => (visibleLength(r) >= 12 ? stackRow(r) : null) ?? r)
  if (lines.length === 1) return laid[0] === lines[0] ? null : laid[0]
  return `\\begin{gathered}${laid.join(' \\\\[6pt] ')}\\end{gathered}`
}

/** Show the stacked form of each long equation only where the one-line form overflows. */
export function fitLongMath(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.math-split').forEach((wrap) => {
    const k = wrap.querySelector<HTMLElement>('.math-wide .katex-display')
    if (k) wrap.classList.toggle('is-narrow', k.scrollWidth > k.clientWidth + 1)
  })
}
