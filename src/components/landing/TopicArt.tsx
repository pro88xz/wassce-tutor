// Topic cover drawings for the homepage course cards: a flat, white line
// drawing of the topic's own idea (a clock for modular arithmetic, Bohr
// shells for electronic configuration, scales for the judiciary), drawn on
// the card's colour like a textbook cover. Pure SVG: sharp at any size, no
// downloads, nothing to credit. Keyed "subject-slug/topic-slug"; topics
// without a drawing fall back to the typographic cover in CourseRows.
//
// Every drawing sits in a 120 x 110 box. White strokes for the shape, a
// faint white fill for areas, and the subject's accent colour (passed in
// as `a`) for the one thing the eye should land on.
import type { ReactNode } from 'react'

const W = '#fff'
const T = 'rgba(255,255,255,.16)'
const line = { stroke: W, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
const thin = { ...line, strokeWidth: 2 }
const text = (size: number, weight = 800) => ({ fill: W, fontSize: size, fontWeight: weight, fontFamily: 'inherit', textAnchor: 'middle' as const })

/** Word chips, stacked and offset, for the grammar topics. */
function chips(a: string, words: string[], hi = 0) {
  return (
    <>
      {words.map((w, i) => {
        const width = Math.max(40, w.length * 8.6 + 20)
        const x = 60 - width / 2 + (i % 2 ? 10 : -10)
        const y = 55 - (words.length * 26) / 2 + i * 26
        return (
          <g key={w}>
            <rect x={x} y={y} width={width} height={20} rx={10} fill={i === hi ? a : T} stroke={i === hi ? 'none' : W} strokeWidth={1.5} />
            <text x={x + width / 2} y={y + 14.5} {...text(12, 700)} fill={i === hi ? '#1b1240' : W}>{w}</text>
          </g>
        )
      })}
    </>
  )
}

/** Particles in a box, for the states and nature of matter. */
function particles(x: number, y: number, w: number, h: number, n: number, spread: 'solid' | 'liquid' | 'gas') {
  const dots: [number, number][] = []
  if (spread === 'solid') for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dots.push([x + 8 + c * ((w - 16) / 2), y + h - 8 - r * 8])
  if (spread === 'liquid') [[0.2, 0.85], [0.45, 0.88], [0.72, 0.84], [0.32, 0.66], [0.6, 0.68], [0.85, 0.66], [0.15, 0.62]].forEach(([u, v]) => dots.push([x + u * w, y + v * h]))
  if (spread === 'gas') [[0.2, 0.2], [0.75, 0.3], [0.45, 0.55], [0.2, 0.8], [0.8, 0.78]].forEach(([u, v]) => dots.push([x + u * w, y + v * h]))
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={4} {...thin} />
      {dots.slice(0, n).map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={3.2} fill={W} />)}
    </>
  )
}

const ART: Record<string, (a: string) => ReactNode> = {
  // ---------------- Mathematics ----------------
  'mathematics/number-bases': (a) => (
    <>
      <text x={60} y={46} {...text(26)}>1011<tspan fontSize={13} dy={6} fill={a}>2</tspan></text>
      <path d="M30 60 H90" {...thin} />
      <text x={60} y={88} {...text(26)}>11<tspan fontSize={13} dy={6} fill={a}>10</tspan></text>
    </>
  ),
  'mathematics/modular-arithmetic': (a) => (
    <>
      <circle cx={60} cy={55} r={42} {...line} fill={T} />
      {Array.from({ length: 12 }, (_, i) => {
        const t = (i / 12) * Math.PI * 2
        return <path key={i} d={`M${60 + Math.sin(t) * 35} ${55 - Math.cos(t) * 35} L${60 + Math.sin(t) * 40} ${55 - Math.cos(t) * 40}`} {...thin} />
      })}
      <path d="M60 55 L60 26" {...line} />
      <path d="M60 55 L80 66" stroke={a} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={60} cy={55} r={3.5} fill={a} />
      <text x={60} y={84} {...text(9, 700)}>mod 12</text>
    </>
  ),
  'mathematics/fractions-decimals-and-approximations': (a) => (
    <>
      <circle cx={46} cy={50} r={32} {...line} fill={T} />
      <path d="M46 50 L46 18 A32 32 0 1 1 14 50 Z" fill={a} />
      <path d="M46 18 V82 M14 50 H78" {...thin} />
      <text x={98} y={92} {...text(18)}>0.75</text>
    </>
  ),
  'mathematics/indices': (a) => (
    <>
      <text x={50} y={86} {...text(70)}>2</text>
      <text x={88} y={46} {...text(36)} fill={a}>5</text>
    </>
  ),
  'mathematics/logarithms': (a) => (
    <>
      <path d="M14 96 H108 M20 102 V10" {...thin} />
      <path d="M26 104 C 30 60, 44 44, 64 36 S 98 26, 108 24" stroke={a} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <text x={74} y={70} {...text(15)}>log x</text>
    </>
  ),
  'mathematics/sequences-and-series': (a) => (
    <>
      {[1, 3, 5, 7].map((n, i) => (
        <rect key={n} x={16 + i * 24} y={96 - n * 11} width={18} height={n * 11} rx={3} fill={i === 3 ? a : T} stroke={i === 3 ? 'none' : W} strokeWidth={2} />
      ))}
      <text x={60} y={16} {...text(12, 700)}>1, 3, 5, 7 …</text>
    </>
  ),
  'mathematics/integers-and-rational-numbers': (a) => (
    <>
      <path d="M6 60 H114" {...line} />
      <path d="M110 54 L116 60 L110 66" {...line} />
      {[-2, -1, 0, 1, 2].map((n, i) => (
        <g key={n}>
          <path d={`M${20 + i * 20} 52 V68`} {...thin} />
          <text x={20 + i * 20} y={86} {...text(11, 700)}>{n}</text>
        </g>
      ))}
      <circle cx={70} cy={60} r={6} fill={a} />
      <text x={70} y={40} {...text(13)} fill={a}>½</text>
    </>
  ),
  'mathematics/surds': (a) => (
    <>
      <path d="M22 92 H82 V32 Z" {...line} fill={T} />
      <path d="M72 92 V82 H82" {...thin} />
      <text x={52} y={106} {...text(12, 700)}>1</text>
      <text x={96} y={66} {...text(12, 700)}>1</text>
      <text x={38} y={54} {...text(18)} fill={a}>√2</text>
    </>
  ),

  // ---------------- English Language ----------------
  'english-language/parts-of-speech': (a) => chips(a, ['noun', 'verb', 'adjective'], 1),
  'english-language/nouns': (a) => chips(a, ['Freetown', 'teacher', 'honesty'], 0),
  'english-language/pronouns': (a) => chips(a, ['I', 'you', 'she', 'they'], 2),
  'english-language/verbs-and-verb-forms': (a) => chips(a, ['go', 'went', 'gone'], 1),
  'english-language/tenses': (a) => (
    <>
      <path d="M8 56 H112" {...line} />
      <path d="M106 50 L112 56 L106 62" {...line} />
      {[
        [24, 'was'],
        [60, 'is'],
        [96, 'will be'],
      ].map(([x, w], i) => (
        <g key={w}>
          <circle cx={x as number} cy={56} r={i === 1 ? 8 : 5} fill={i === 1 ? a : W} />
          <text x={x as number} y={i % 2 ? 36 : 84} {...text(12, 700)}>{w}</text>
        </g>
      ))}
    </>
  ),
  'english-language/active-and-passive-voice': (a) => (
    <>
      <rect x={10} y={22} width={30} height={22} rx={6} fill={a} />
      <rect x={80} y={22} width={30} height={22} rx={6} fill={T} stroke={W} strokeWidth={2} />
      <text x={25} y={38} {...text(12)} fill="#1b1240">Ali</text>
      <text x={95} y={38} {...text(12)}>ball</text>
      <path d="M44 33 H74 M68 27 L74 33 L68 39" {...line} />
      <rect x={10} y={66} width={30} height={22} rx={6} fill={T} stroke={W} strokeWidth={2} />
      <rect x={80} y={66} width={30} height={22} rx={6} fill={a} />
      <text x={25} y={82} {...text(12)}>ball</text>
      <text x={95} y={82} {...text(12)} fill="#1b1240">Ali</text>
      <path d="M44 77 H74 M68 71 L74 77 L68 83" {...line} strokeDasharray="4 5" />
    </>
  ),
  'english-language/non-finite-verb-forms': (a) => chips(a, ['to read', 'reading', 'read'], 0),
  'english-language/adjectives': (a) => chips(a, ['bright', 'tall', 'careful'], 0),

  // ---------------- Biology ----------------
  'biology/introduction-to-biology': (a) => (
    <>
      <path d="M46 14 L62 14 L66 52 L50 52 Z" {...line} fill={T} />
      <path d="M58 52 L58 64" {...line} />
      <circle cx={58} cy={70} r={5} fill={a} />
      <path d="M70 34 C 92 40, 94 70, 76 84" {...line} />
      <path d="M30 96 H96 M40 84 H84 V96" {...line} />
    </>
  ),
  'biology/characteristics-of-living-things': (a) => (
    <>
      <path d="M60 100 C 20 80, 18 34, 60 10 C 102 34, 100 80, 60 100 Z" {...line} fill={T} />
      <path d="M60 104 V24 M60 46 L42 34 M60 60 L80 46 M60 74 L40 62 M60 86 L78 74" {...thin} />
      <circle cx={92} cy={22} r={9} fill={a} />
    </>
  ),
  'biology/classification-of-living-things': (a) => (
    <>
      <circle cx={74} cy={16} r={8} fill={a} />
      <path d="M74 24 V38 M50 38 H98 M50 38 V52 M98 38 V52 M50 64 V72 M38 72 H62 M38 72 V82 M62 72 V82 M98 64 V72 M86 72 H110 M86 72 V82 M110 72 V82" {...thin} />
      {[50, 98].map((x) => <circle key={x} cx={x} cy={58} r={6} fill={T} stroke={W} strokeWidth={2} />)}
      {[38, 62, 86, 110].map((x) => <circle key={x} cx={x} cy={88} r={5} fill={W} />)}
    </>
  ),
  'biology/cell-structure': (a) => (
    <>
      <rect x={8} y={14} width={104} height={82} rx={14} {...line} fill={T} />
      <circle cx={46} cy={54} r={16} fill={a} />
      <circle cx={46} cy={54} r={6} fill="#1b1240" opacity={0.35} />
      <ellipse cx={88} cy={36} rx={11} ry={6} {...thin} />
      <ellipse cx={86} cy={74} rx={12} ry={6} {...thin} transform="rotate(-20 86 74)" />
      <circle cx={24} cy={84} r={3} fill={W} />
      <circle cx={70} cy={86} r={3} fill={W} />
    </>
  ),
  'biology/cell-functions-and-specialisation': (a) => (
    <>
      <ellipse cx={38} cy={40} rx={26} ry={18} fill={a} />
      <ellipse cx={38} cy={40} rx={12} ry={7} fill="#1b1240" opacity={0.2} />
      <circle cx={84} cy={74} r={10} {...line} fill={T} />
      <path d="M94 74 H116 M76 66 L64 54 M76 82 L62 96 M84 64 V50" {...thin} />
    </>
  ),
  'biology/cell-division': (a) => (
    <>
      <path d="M60 30 C 50 14, 12 14, 12 55 C 12 96, 50 96, 60 80 C 70 96, 108 96, 108 55 C 108 14, 70 14, 60 30 Z" {...line} fill={T} />
      <path d="M32 46 l8 18 M40 46 l-8 18 M80 46 l8 18 M88 46 l-8 18" stroke={a} strokeWidth={3.5} strokeLinecap="round" />
    </>
  ),
  'biology/levels-of-organisation': (a) => (
    <>
      <circle cx={16} cy={56} r={6} fill={a} />
      <path d="M26 56 H34 M31 52 L35 56 L31 60" {...thin} />
      <rect x={38} y={44} width={24} height={24} rx={4} fill={T} stroke={W} strokeWidth={2} />
      <path d="M46 44 V68 M54 44 V68 M38 52 H62 M38 60 H62" stroke={W} strokeWidth={1} />
      <path d="M66 56 H74 M71 52 L75 56 L71 60" {...thin} />
      <path d="M96 40 C 88 30, 76 38, 80 50 C 84 62, 96 72, 96 72 C 96 72, 108 62, 112 50 C 116 38, 104 30, 96 40 Z" {...line} fill={T} />
    </>
  ),
  'biology/photosynthesis-and-plant-nutrition': (a) => (
    <>
      <circle cx={22} cy={22} r={11} fill={a} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <path key={d} d="M22 4 V0" stroke={a} strokeWidth={3} strokeLinecap="round" transform={`rotate(${d} 22 22)`} />
      ))}
      <path d="M40 40 L58 58" {...thin} strokeDasharray="4 4" />
      <path d="M78 100 C 50 92, 52 52, 84 40 C 112 56, 108 92, 78 100 Z" {...line} fill={T} />
      <path d="M78 104 V54" {...thin} />
    </>
  ),

  // ---------------- Physics ----------------
  'physics/physical-quantities-and-units': (a) => (
    <>
      <rect x={8} y={40} width={104} height={26} rx={4} {...line} fill={T} />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${14 + i * 9.2} 40 V${i % 5 === 0 ? 54 : 48}`} {...thin} />)}
      <text x={44} y={88} {...text(14)}>m</text>
      <text x={74} y={88} {...text(14)} fill={a}>kg</text>
      <text x={104} y={88} {...text(14)}>s</text>
    </>
  ),
  'physics/scalars-and-vectors': (a) => (
    <>
      <path d="M14 92 L74 92" {...line} />
      <path d="M66 86 L74 92 L66 98" {...line} />
      <path d="M78 88 L98 26" {...line} />
      <path d="M90 30 L98 26 L100 35" {...line} />
      <path d="M16 88 L94 26" stroke={a} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M84 27 L95 25 L92 35" stroke={a} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'physics/measurement-and-errors': (a) => (
    <>
      <path d="M14 30 H106 V44 H14 Z" {...line} fill={T} />
      <path d="M30 44 V80 M46 44 V70" {...line} />
      <path d="M58 30 V44 M58 44 V70" stroke={a} strokeWidth={3} />
      <text x={60} y={100} {...text(14)}>2.5 ± 0.1</text>
    </>
  ),
  'physics/motion-in-a-straight-line': (a) => (
    <>
      <path d="M16 98 H108 M20 102 V12" {...thin} />
      <path d="M20 96 L100 24" stroke={a} strokeWidth={3.5} strokeLinecap="round" />
      <text x={110} y={92} {...text(10, 700)}>t</text>
      <text x={10} y={18} {...text(10, 700)}>s</text>
    </>
  ),
  'physics/equations-of-motion': (a) => (
    <>
      <text x={60} y={44} {...text(20)}>v = u + at</text>
      <text x={60} y={78} {...text(14, 700)} fill={a}>s = ut + ½at²</text>
    </>
  ),
  'physics/motion-under-gravity': (a) => (
    <>
      {[12, 22, 38, 62, 94].map((y, i) => (
        <circle key={y} cx={46} cy={y} r={i === 4 ? 8 : 6} fill={i === 4 ? a : 'none'} stroke={W} strokeWidth={i === 4 ? 0 : 2} opacity={i === 4 ? 1 : 0.4 + i * 0.15} />
      ))}
      <path d="M86 24 V82 M80 74 L86 82 L92 74" {...line} />
      <text x={100} y={58} {...text(14)}>g</text>
    </>
  ),
  'physics/projectile-motion': (a) => (
    <>
      <path d="M20 98 H116" {...thin} />
      <path d="M28 96 Q 70 -6, 112 96" {...thin} strokeDasharray="5 6" />
      <circle cx={70} cy={45} r={7} fill={a} />
      <path d="M28 96 L46 66 M40 67 L46 66 L47 72" {...line} />
    </>
  ),
  'physics/newton-s-laws-of-motion': (a) => (
    <>
      <path d="M8 84 H112" {...thin} />
      <rect x={42} y={50} width={36} height={34} rx={4} {...line} fill={T} />
      <path d="M82 67 H112 M104 61 L112 67 L104 73" stroke={a} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 67 H14 M22 61 L14 67 L22 73" {...thin} />
      <text x={98} y={52} {...text(14)} fill={a}>F</text>
    </>
  ),

  // ---------------- Chemistry ----------------
  'chemistry/introduction-to-chemistry': (a) => (
    <>
      <path d="M48 12 H72 M52 12 V44 L24 96 H96 L68 44 V12" {...line} />
      <path d="M36 74 L84 74 L94 94 H26 Z" fill={a} />
      <circle cx={52} cy={84} r={3} fill="#1b1240" opacity={0.3} />
      <circle cx={66} cy={80} r={2} fill="#1b1240" opacity={0.3} />
    </>
  ),
  'chemistry/particulate-nature-of-matter': () => (
    <>
      {particles(10, 30, 44, 50, 9, 'solid')}
      {particles(66, 30, 44, 50, 5, 'gas')}
      <path d="M56 55 H64" {...thin} />
    </>
  ),
  'chemistry/atomic-structure': (a) => (
    <>
      <ellipse cx={60} cy={55} rx={48} ry={17} {...thin} />
      <ellipse cx={60} cy={55} rx={48} ry={17} {...thin} transform="rotate(60 60 55)" />
      <ellipse cx={60} cy={55} rx={48} ry={17} {...thin} transform="rotate(-60 60 55)" />
      <circle cx={60} cy={55} r={8} fill={a} />
      <circle cx={108} cy={55} r={4} fill={W} />
    </>
  ),
  'chemistry/electronic-configuration': (a) => (
    <>
      {[14, 28, 42].map((r) => <circle key={r} cx={60} cy={55} r={r} {...thin} />)}
      <circle cx={60} cy={55} r={7} fill={a} />
      {[0, 180].map((d) => <circle key={`a${d}`} cx={60 + 14 * Math.cos((d * Math.PI) / 180)} cy={55 + 14 * Math.sin((d * Math.PI) / 180)} r={3.2} fill={W} />)}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => <circle key={`b${d}`} cx={60 + 28 * Math.cos((d * Math.PI) / 180)} cy={55 + 28 * Math.sin((d * Math.PI) / 180)} r={3.2} fill={W} />)}
      <circle cx={60 + 42 * Math.cos(-0.6)} cy={55 + 42 * Math.sin(-0.6)} r={4} fill={a} />
      <text x={104} y={106} {...text(11, 700)}>2, 8, 1</text>
    </>
  ),
  'chemistry/the-periodic-table-and-periodicity': (a) => (
    <>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => {
          const gap = r < 1 ? c > 0 && c < 7 : r < 3 ? c > 1 && c < 5 : false
          if (gap) return null
          const hot = r === 2 && c === 0
          return <rect key={`${r}-${c}`} x={8 + c * 13.5} y={20 + r * 14} width={11} height={11} rx={2} fill={hot ? a : T} stroke={hot ? 'none' : W} strokeWidth={1.2} />
        }),
      )}
    </>
  ),
  'chemistry/chemical-bonding': (a) => (
    <>
      <circle cx={44} cy={55} r={28} {...line} fill={T} />
      <circle cx={76} cy={55} r={28} {...line} fill={T} />
      <text x={34} y={60} {...text(14)}>H</text>
      <text x={86} y={60} {...text(14)}>H</text>
      <circle cx={60} cy={47} r={4} fill={a} />
      <circle cx={60} cy={63} r={4} fill={a} />
    </>
  ),
  'chemistry/states-of-matter': () => (
    <>
      {particles(4, 34, 34, 42, 9, 'solid')}
      {particles(43, 34, 34, 42, 7, 'liquid')}
      {particles(82, 34, 34, 42, 5, 'gas')}
    </>
  ),
  'chemistry/gas-laws': (a) => (
    <>
      <path d="M30 20 V96 H90 V20" {...line} />
      <rect x={32} y={42} width={56} height={8} rx={2} fill={a} />
      <path d="M60 42 V10 M50 10 H70" {...line} />
      {[[44, 66], [70, 62], [56, 80], [78, 86], [42, 88]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={3.2} fill={W} />)}
      <text x={60} y={110} {...text(10, 700)}>PV = constant</text>
    </>
  ),

  // ---------------- Government ----------------
  'government/meaning-and-nature-of-government': (a) => (
    <>
      <path d="M14 38 L60 12 L106 38 Z" fill={a} />
      <path d="M18 42 H102 M16 96 H104 M20 90 H100" {...line} />
      {[28, 46, 64, 82].map((x) => <path key={x} d={`M${x + 4} 46 V86`} {...line} />)}
    </>
  ),
  'government/state-and-sovereignty': () => (
    <>
      <path d="M22 104 V8" {...line} />
      <rect x={24} y={12} width={76} height={18} fill="#1eb53a" />
      <rect x={24} y={30} width={76} height={18} fill="#ffffff" />
      <rect x={24} y={48} width={76} height={18} fill="#0072c6" />
      <rect x={24} y={12} width={76} height={54} fill="none" stroke={W} strokeWidth={1.5} />
    </>
  ),
  'government/forms-of-government': (a) => (
    <>
      <path d="M60 12 L108 96 H12 Z" {...line} fill={T} />
      <path d="M38 54 H82 M26 76 H94" {...thin} />
      <path d="M48 32 L60 12 L72 32 Z" fill={a} />
    </>
  ),
  'government/systems-of-government': (a) => (
    <>
      <circle cx={60} cy={55} r={14} fill={a} />
      {[0, 72, 144, 216, 288].map((d) => {
        const r = (d - 90) * (Math.PI / 180)
        const x = 60 + Math.cos(r) * 40
        const y = 55 + Math.sin(r) * 40
        return (
          <g key={d}>
            <path d={`M${60 + Math.cos(r) * 16} ${55 + Math.sin(r) * 16} L${60 + Math.cos(r) * 31} ${55 + Math.sin(r) * 31}`} {...thin} />
            <circle cx={x} cy={y} r={9} fill={T} stroke={W} strokeWidth={2} />
          </g>
        )
      })}
    </>
  ),
  'government/democracy-and-other-political-ideologies': (a) => (
    <>
      <rect x={20} y={46} width={80} height={54} rx={4} {...line} fill={T} />
      <path d="M40 46 H80" stroke={W} strokeWidth={5} strokeLinecap="round" />
      <rect x={46} y={12} width={28} height={36} rx={2} fill={W} transform="rotate(-8 60 30)" />
      <path d="M52 30 L58 36 L68 22" stroke={a} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-8 60 30)" />
    </>
  ),
  'government/the-executive': (a) => (
    <>
      <rect x={44} y={10} width={32} height={22} rx={5} fill={a} />
      <path d="M60 32 V46 M22 46 H98 M22 46 V58 M60 46 V58 M98 46 V58" {...thin} />
      {[22, 60, 98].map((x) => <rect key={x} x={x - 15} y={58} width={30} height={20} rx={5} fill={T} stroke={W} strokeWidth={2} />)}
      <path d="M22 78 V88 M60 78 V88 M98 78 V88" {...thin} />
      {[22, 60, 98].map((x) => <circle key={x} cx={x} cy={94} r={5} fill={W} />)}
    </>
  ),
  'government/the-legislature': (a) => (
    <>
      {([[44, 11], [34, 9], [24, 7]] as const).map(([r, n], ri) =>
        Array.from({ length: n }, (_, i) => {
          const t = Math.PI + (i / (n - 1)) * Math.PI
          return <circle key={`${r}-${i}`} cx={60 + Math.cos(t) * r} cy={86 + Math.sin(t) * r} r={3.6} fill={ri === 0 && i % 3 === 0 ? a : W} />
        }),
      )}
      <rect x={50} y={82} width={20} height={12} rx={2} fill={T} stroke={W} strokeWidth={2} />
    </>
  ),
  'government/the-judiciary': (a) => (
    <>
      <path d="M60 14 V96 M40 98 H80 M22 30 H98" {...line} />
      <circle cx={60} cy={12} r={4} fill={a} />
      <path d="M22 30 L10 60 H34 Z M98 30 L86 60 H110 Z" {...thin} />
      <path d="M10 60 C 14 70, 30 70, 34 60 Z M86 60 C 90 70, 106 70, 110 60 Z" fill={a} />
    </>
  ),
}

/** The drawing for a topic, or null when there is none. */
export function topicArt(subjectSlug: string, topicSlug: string, accent: string): ReactNode | null {
  const draw = ART[`${subjectSlug}/${topicSlug}`]
  return draw ? draw(accent) : null
}
