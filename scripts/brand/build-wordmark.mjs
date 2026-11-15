// Draws the WASSCE Tutor wordmark and writes its outlines to src/components/brand-geometry.ts,
// which the site header/footer (src/components/BrandMark.tsx) and the icon script
// (scripts/brand/build-icons.mjs) both read. Run it only when the wordmark itself changes:
//
//   npm i --no-save opentype.js
//   node scripts/brand/build-wordmark.mjs /path/to/InterDisplay-otf-folder
//
// The folder must hold InterDisplay-ExtraBold.otf (from the Inter release, https://rsms.me/inter/).
// Then run `npm run brand:icons`.
//
// The design: the name is the logo. Letters are Inter Display ExtraBold, set letter by letter with
// tightened spacing. The one drawn detail is the "o" of Tutor: a shaded answer bubble, as on the
// WASSCE objective paper. It keeps the letter's size, with a thin printed outline, a gap, then
// solid shading.
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

let opentype
try {
  opentype = (await import('opentype.js')).default
} catch {
  console.error('This script needs opentype.js: npm i --no-save opentype.js')
  process.exit(1)
}
const fontDir = process.argv[2] ?? '/usr/share/fonts/opentype/inter'
const font = opentype.loadSync(join(fontDir, 'InterDisplay-ExtraBold.otf'))
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const SIZE = 100 // set at 100 units; everything scales from here
const RING = 0.37 // bubble outline, as a share of the letter's stroke weight
const GAP = 0.36 // white gap between outline and shading, same unit

const r2 = (n) => Math.round(n * 100) / 100
const bbox = (cmds) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const c of cmds)
    for (const [x, y] of [[c.x, c.y], [c.x1, c.y1], [c.x2, c.y2]])
      if (x !== undefined) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }
}
const ellipse = (cx, cy, rx, ry) =>
  `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0Z`

/** Sets `text` with its baseline at y = `baseline`, from x = `x0`. The first `bubble` character becomes the bubble. */
function set(text, size, { x0 = 0, baseline = 0, tracking = 0, bubble = null } = {}) {
  const k = size / font.unitsPerEm
  let x = x0
  let prev = null
  let letters = ''
  let ring = ''
  let shade = ''
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
  const grow = (b) => { box.x0 = Math.min(box.x0, b.x0); box.y0 = Math.min(box.y0, b.y0); box.x1 = Math.max(box.x1, b.x1); box.y1 = Math.max(box.y1, b.y1) }
  for (const ch of text) {
    const g = font.charToGlyph(ch)
    if (prev) x += font.getKerningValue(prev, g) * k
    const path = g.getPath(x, baseline, size)
    if (ch === bubble && !ring) {
      const contours = []
      for (const c of path.commands) {
        if (c.type === 'M') contours.push([])
        contours.at(-1).push(c)
      }
      const [outer, inner] = contours.map(bbox).sort((a, b) => b.w * b.h - a.w * a.h)
      const stroke = Math.min(inner.x0 - outer.x0, inner.y0 - outer.y0)
      const rx = outer.w / 2
      const ry = outer.h / 2
      const t = stroke * RING
      const gp = stroke * GAP
      ring = ellipse(outer.cx, outer.cy, rx, ry) + ellipse(outer.cx, outer.cy, rx - t, ry - t)
      shade = ellipse(outer.cx, outer.cy, rx - t - gp, ry - t - gp)
      grow(outer)
    } else if (ch !== ' ') {
      letters += path.toPathData(2)
      const bb = path.getBoundingBox()
      grow({ x0: bb.x1, y0: bb.y1, x1: bb.x2, y1: bb.y2 })
    }
    x += g.advanceWidth * k + tracking * size
    prev = g
  }
  const capHeight = (font.tables.os2.sCapHeight * size) / font.unitsPerEm
  return { letters, ring, shade, box, capHeight }
}

const union = (...bs) => ({ x0: Math.min(...bs.map((b) => b.x0)), y0: Math.min(...bs.map((b) => b.y0)), x1: Math.max(...bs.map((b) => b.x1)), y1: Math.max(...bs.map((b) => b.y1)) })
const viewBox = (b) => `${r2(b.x0)} ${r2(b.y0)} ${r2(b.x1 - b.x0)} ${r2(b.y1 - b.y0)}`

// One line: "WASSCE Tutor". Cap height sits on y = 0..capHeight.
const capH = (font.tables.os2.sCapHeight * SIZE) / font.unitsPerEm
const wassce = set('WASSCE', SIZE, { baseline: capH, tracking: -0.012 })
const space = 0.24 * SIZE
const tutor = set('Tutor', SIZE, { x0: wassce.box.x1 + space, baseline: capH, tracking: -0.018, bubble: 'o' })
const lineBox = union(wassce.box, tutor.box)

// Stacked: "WASSCE" over "TUTOR", both lines the same width.
const top = set('WASSCE', SIZE, { baseline: capH, tracking: -0.01 })
const probe = set('TUTOR', SIZE, { tracking: -0.01, bubble: 'O' })
const size2 = (SIZE * (top.box.x1 - top.box.x0)) / (probe.box.x1 - probe.box.x0)
const capH2 = (font.tables.os2.sCapHeight * size2) / font.unitsPerEm
const base2 = capH + 0.2 * SIZE + capH2
// Shift the second line so both lines' ink starts at the same x.
const probe2 = set('TUTOR', size2, { tracking: -0.01, bubble: 'O' })
const bottom = set('TUTOR', size2, { x0: top.box.x0 - probe2.box.x0, baseline: base2, tracking: -0.01, bubble: 'O' })
const stackBox = union(top.box, bottom.box)

// Initials "WT" for the browser tab, where the full name is too small to read.
const w = set('W', SIZE, { baseline: capH })
const t = set('T', SIZE, { x0: w.box.x1 + 0.035 * SIZE, baseline: capH })

const out = `// Generated by scripts/brand/build-wordmark.mjs: do not edit by hand.
// Outlines of the WASSCE Tutor wordmark. "o" / "O" is the shaded answer bubble: \`ring\` is its
// printed outline, \`shade\` the shading inside it.

/** "WASSCE Tutor" on one line: the site header and footer. */
export const WORDMARK_LINE = {
  viewBox: '${viewBox(lineBox)}',
  aspect: ${r2((lineBox.x1 - lineBox.x0) / (lineBox.y1 - lineBox.y0))},
  wassce: '${wassce.letters}',
  tutor: '${tutor.letters}',
  ring: '${tutor.ring}',
  shade: '${tutor.shade}',
} as const

/** "WASSCE" over "TUTOR", both lines the same width: square logos and the app icon. */
export const WORDMARK_STACK = {
  viewBox: '${viewBox(stackBox)}',
  aspect: ${r2((stackBox.x1 - stackBox.x0) / (stackBox.y1 - stackBox.y0))},
  wassce: '${top.letters}',
  tutor: '${bottom.letters}',
  ring: '${bottom.ring}',
  shade: '${bottom.shade}',
} as const

/** The initials "WT": the browser-tab icon. */
export const MONOGRAM = {
  viewBox: '${viewBox(union(w.box, t.box))}',
  w: '${w.letters}',
  t: '${t.letters}',
} as const
`
writeFileSync(join(root, 'src/components/brand-geometry.ts'), out)
console.log(`src/components/brand-geometry.ts written (${(out.length / 1024).toFixed(1)} KB)`)
