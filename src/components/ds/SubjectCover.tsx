// Crisp, distinct cover art for every subject: a flat line illustration of
// the subject's core idea on the subject's own colour. Pure SVG, so it is
// sharp at any size and costs no image downloads.
//
// One drawing serves three shapes:
//   square  – list thumbnails (crops to the motif on the right)
//   wide    – card covers (16:9)
//   banner  – slim headers; the motif sits right, the pattern runs left
//             under the title.
import type { ReactNode } from 'react'
import { subjectPhoto } from '@/lib/subject-photos'

type Pattern = 'grid' | 'dots' | 'ruled' | 'waves' | 'diag' | 'rings'
type Art = { bg: string; shade: string; accent: string; pattern: Pattern; motif: (a: string) => ReactNode }

/** Faint subject symbols on the left of wide covers. */
const GLYPHS: Record<string, [string, string, string]> = {
  mathematics: ['π', 'x²', '√'],
  'further-mathematics': ['Σ', 'dy/dx', '∞'],
  'english-language': ['“ ”', 'abc', '¶'],
  'literature-in-english': ['“ ”', 'Act I', '¶'],
  biology: ['DNA', 'O₂', 'cell'],
  chemistry: ['H₂O', 'NaCl', 'pH'],
  physics: ['F=ma', 'λ', 'Ω'],
  'agricultural-science': ['NPK', 'pH', 'soil'],
  economics: ['GDP', '%', 'S·D'],
  government: ['§', 'vote', 'law'],
  history: ['1961', 'AD', 'BC'],
  geography: ['N', '°E', 'km'],
  commerce: ['NLe', '%', 'sale'],
  'financial-accounting': ['A = L + C', 'Dr', 'Cr'],
  'business-management': ['SWOT', 'plan', '4Ps'],
  'ict-computer-studies': ['01', 'if', '{ }'],
  'religious-studies': ['✦', 'ethics', 'faith'],
  'technical-drawing': ['1:50', '45°', 'Ø'],
  'building-construction': ['1:100', 'm²', 'level'],
}


const W = 'white'
const T = 'rgba(255,255,255,0.18)' // tint fill
const S = 'rgba(255,255,255,0.4)' // strong fill
const line = { stroke: W, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }

// Motifs are drawn around (0, 0) within roughly ±60 and placed at (232, 90).
const ART: Record<string, Art> = {
  mathematics: {
    bg: '#5b34d6', shade: '#4520b0', accent: '#ffd166', pattern: 'grid',
    motif: (a) => (
      <>
        <path d="M-56 42 H58 M-46 54 V-56" {...line} />
        <path d="M-56 42 l0 0 M58 42 l-7 -5 M58 42 l-7 5 M-46 -56 l-5 7 M-46 -56 l5 7" {...line} />
        <path d="M-36 -48 Q4 82 44 -48" {...line} strokeWidth={4.5} />
        <path d="M-6 -6 L30 -6 L30 -34 Z" fill={T} stroke={W} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={4} cy={17} r={6.5} fill={a} />
      </>
    ),
  },
  'further-mathematics': {
    bg: '#3a2a96', shade: '#2a1d75', accent: '#ffd166', pattern: 'grid',
    motif: (a) => (
      <>
        <path d="M-48 50 Q-38 62 -30 46 L-10 -44 Q-2 -60 8 -48" {...line} strokeWidth={6} />
        <path d="M22 -32 h-8 v64 h8 M62 -32 h8 v64 h-8" {...line} />
        <circle cx={30} cy={-14} r={4.5} fill={W} />
        <circle cx={54} cy={-14} r={4.5} fill={W} />
        <circle cx={30} cy={14} r={4.5} fill={W} />
        <circle cx={54} cy={14} r={4.5} fill={a} />
      </>
    ),
  },
  'english-language': {
    bg: '#2560c0', shade: '#1b4a99', accent: '#ffd166', pattern: 'ruled',
    motif: (a) => (
      <>
        <text x={-60} y={22} fill={W} fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={78}>Aa</text>
        <rect x={50} y={-34} width={5} height={60} rx={2.5} fill={a} />
        <path d="M-58 42 H48 M-58 56 H20" {...line} stroke="rgba(255,255,255,0.55)" />
      </>
    ),
  },
  'literature-in-english': {
    bg: '#a8521f', shade: '#874016', accent: '#ffd166', pattern: 'ruled',
    motif: (a) => (
      <>
        <path d="M0 -28 C-20 -42 -44 -42 -58 -36 V40 C-44 34 -20 34 0 46 Z" fill={T} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M0 -28 C20 -42 44 -42 58 -36 V40 C44 34 20 34 0 46 Z" fill={T} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M0 -28 V46" {...line} />
        <path d="M-46 -18 C-36 -22 -22 -22 -12 -16 M-46 -2 C-36 -6 -22 -6 -12 0 M-46 14 C-36 10 -22 10 -12 16 M12 -16 C22 -22 36 -22 46 -18 M12 0 C22 -6 36 -6 46 -2" {...line} strokeWidth={2.5} stroke="rgba(255,255,255,0.7)" />
        <path d="M30 -38 v28 l7 -6 l7 6 v-28 Z" fill={a} />
      </>
    ),
  },
  biology: {
    bg: '#15805a', shade: '#0e6345', accent: '#ffd166', pattern: 'dots',
    motif: (a) => (
      <>
        <ellipse cx={0} cy={0} rx={60} ry={46} fill={T} stroke={W} strokeWidth={3.5} />
        <circle cx={-14} cy={-6} r={19} fill={S} stroke={W} strokeWidth={3} />
        <circle cx={-14} cy={-6} r={7} fill={a} />
        <g transform="rotate(-22 28 18)">
          <ellipse cx={28} cy={18} rx={15} ry={8} fill="none" stroke={W} strokeWidth={3} />
          <path d="M16 18 q4 -5 8 0 t8 0 t8 0" stroke={W} strokeWidth={2} fill="none" />
        </g>
        <circle cx={30} cy={-24} r={5} fill={W} />
        <circle cx={-40} cy={24} r={4} fill={W} />
        <circle cx={6} cy={30} r={3} fill={W} />
      </>
    ),
  },
  chemistry: {
    bg: '#0d8486', shade: '#096668', accent: '#ffd166', pattern: 'dots',
    motif: (a) => (
      <>
        <path d="M-18 -44 L8 -29 V1 L-18 16 L-44 1 V-29 Z" fill={T} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={-18} cy={-14} r={14} {...line} strokeWidth={2.5} stroke="rgba(255,255,255,0.75)" />
        <path d="M8 -29 L36 -44 M8 1 L34 22 M-18 16 V44" {...line} />
        <circle cx={40} cy={-46} r={9} fill={a} />
        <circle cx={38} cy={25} r={11} fill={S} stroke={W} strokeWidth={3} />
        <circle cx={-18} cy={50} r={7} fill={W} />
      </>
    ),
  },
  physics: {
    bg: '#1f4fa8', shade: '#173c82', accent: '#ffd166', pattern: 'waves',
    motif: (a) => (
      <>
        <ellipse cx={0} cy={0} rx={60} ry={21} {...line} />
        <ellipse cx={0} cy={0} rx={60} ry={21} {...line} transform="rotate(60)" />
        <ellipse cx={0} cy={0} rx={60} ry={21} {...line} transform="rotate(120)" />
        <circle cx={0} cy={0} r={10} fill={a} />
        <circle cx={58} cy={-4} r={5} fill={W} />
        <circle cx={-26} cy={-50} r={5} fill={W} />
        <circle cx={-30} cy={46} r={5} fill={W} />
      </>
    ),
  },
  'agricultural-science': {
    bg: '#4a8420', shade: '#386617', accent: '#ffd166', pattern: 'dots',
    motif: (a) => (
      <>
        <circle cx={-40} cy={-42} r={12} fill={a} />
        <path d="M-62 44 Q0 26 62 44" {...line} />
        <path d="M-50 56 Q0 42 50 56" {...line} stroke="rgba(255,255,255,0.55)" />
        <path d="M2 38 C2 18 4 0 2 -16" {...line} strokeWidth={4} />
        <path d="M2 4 C-8 -22 -38 -24 -44 -8 C-28 0 -12 2 2 4 Z" fill={T} stroke={W} strokeWidth={3} strokeLinejoin="round" />
        <path d="M2 -16 C12 -46 46 -52 54 -30 C40 -18 18 -14 2 -16 Z" fill={S} stroke={W} strokeWidth={3} strokeLinejoin="round" />
      </>
    ),
  },
  economics: {
    bg: '#0c7468', shade: '#085a51', accent: '#ffd166', pattern: 'grid',
    motif: (a) => (
      <>
        <path d="M-58 48 H58" {...line} />
        <rect x={-50} y={22} width={16} height={26} rx={3} fill={T} stroke={W} strokeWidth={3} />
        <rect x={-26} y={6} width={16} height={42} rx={3} fill={T} stroke={W} strokeWidth={3} />
        <rect x={-2} y={-10} width={16} height={58} rx={3} fill={T} stroke={W} strokeWidth={3} />
        <rect x={22} y={-30} width={16} height={78} rx={3} fill={S} stroke={W} strokeWidth={3} />
        <path d="M-52 4 L-22 -14 L4 -8 L46 -50" {...line} stroke={a} strokeWidth={4.5} />
        <path d="M46 -50 l-12 2 M46 -50 l-2 12" {...line} stroke={a} strokeWidth={4.5} />
      </>
    ),
  },
  government: {
    bg: '#8a4a14', shade: '#6c390e', accent: '#ffd166', pattern: 'diag',
    motif: (a) => (
      <>
        <path d="M-58 -18 L0 -54 L58 -18 Z" fill={T} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={0} cy={-31} r={6} fill={a} />
        <path d="M-58 -10 H58" {...line} />
        {[-44, -20, 4, 28].map((x) => (
          <rect key={x} x={x} y={-4} width={14} height={42} rx={2} fill="none" stroke={W} strokeWidth={3} />
        ))}
        <rect x={-62} y={42} width={124} height={10} rx={3} fill={S} stroke={W} strokeWidth={3} />
      </>
    ),
  },
  history: {
    bg: '#9a5410', shade: '#7a420c', accent: '#ffd166', pattern: 'diag',
    motif: (a) => (
      <>
        <path d="M-40 -50 H8 M-40 50 H8" {...line} strokeWidth={5} />
        <path d="M-34 -46 C-34 -12 -20 -6 -20 0 C-20 6 -34 12 -34 46 H2 C2 12 -12 6 -12 0 C-12 -6 2 -12 2 -46 Z" fill={T} stroke={W} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-28 -30 Q-16 -16 -4 -30 Z" fill={a} />
        <path d="M-28 44 Q-16 24 -4 44 Z" fill={a} />
        <path d="M34 -46 V46" {...line} />
        <circle cx={34} cy={-30} r={6} fill={W} />
        <circle cx={34} cy={0} r={6} fill={a} />
        <circle cx={34} cy={30} r={6} fill={W} />
        <path d="M44 -30 H60 M44 0 H56 M44 30 H60" {...line} strokeWidth={3} stroke="rgba(255,255,255,0.7)" />
      </>
    ),
  },
  geography: {
    bg: '#127386', shade: '#0d5868', accent: '#ffd166', pattern: 'waves',
    motif: (a) => (
      <>
        <circle cx={0} cy={0} r={52} fill={T} stroke={W} strokeWidth={3.5} />
        <ellipse cx={0} cy={0} rx={22} ry={52} {...line} strokeWidth={3} />
        <path d="M-52 0 H52 M-46 -24 Q0 -14 46 -24 M-46 24 Q0 34 46 24" {...line} strokeWidth={3} />
        <path d="M22 -4 C10 -18 10 -34 22 -34 C34 -34 34 -18 22 -4 Z" fill={a} stroke={a} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={22} cy={-24} r={4} fill={'#127386'} />
      </>
    ),
  },
  commerce: {
    bg: '#b0610f', shade: '#8c4c0a', accent: '#fff3c4', pattern: 'dots',
    motif: (a) => (
      <>
        <path d="M-62 -6 L-34 -40 H8 V28 H-34 Z" fill={T} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={-34} cy={-6} r={6} fill="none" stroke={W} strokeWidth={3} />
        <path d="M-16 -16 H-2 M-16 2 H-6" {...line} strokeWidth={3} />
        {[44, 30, 16].map((y, i) => (
          <g key={y}>
            <path d={`M20 ${y} v8 a22 7 0 0 0 44 0 v-8`} fill={i === 2 ? a : S} stroke={W} strokeWidth={3} />
            <ellipse cx={42} cy={y} rx={22} ry={7} fill={i === 2 ? a : S} stroke={W} strokeWidth={3} />
          </g>
        ))}
      </>
    ),
  },
  'financial-accounting': {
    bg: '#1b7548', shade: '#135a37', accent: '#ffd166', pattern: 'grid',
    motif: (a) => (
      <>
        <rect x={-52} y={-50} width={96} height={100} rx={8} fill={T} stroke={W} strokeWidth={3.5} />
        <path d="M-40 -26 H32 M-4 -26 V40" {...line} strokeWidth={4.5} />
        <text x={-34} y={-32} fill={W} fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize={13}>Dr</text>
        <text x={8} y={-32} fill={W} fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize={13}>Cr</text>
        <path d="M-36 -10 H-14 M-36 6 H-18 M-36 22 H-12 M6 -10 H26 M6 6 H22" {...line} strokeWidth={3} stroke="rgba(255,255,255,0.7)" />
        <circle cx={44} cy={42} r={15} fill={a} />
        <path d="M37 42 l5 5 l9 -10" {...line} stroke="#1b7548" strokeWidth={4} />
      </>
    ),
  },
  'business-management': {
    bg: '#3456b4', shade: '#27418b', accent: '#ffd166', pattern: 'dots',
    motif: (a) => (
      <>
        <rect x={-18} y={-54} width={36} height={24} rx={6} fill={a} />
        <path d="M0 -30 V-14 M-44 -14 H44 M-44 -14 V0 M0 -14 V0 M44 -14 V0" {...line} />
        {[-62, -18, 26].map((x) => (
          <rect key={x} x={x} y={0} width={36} height={24} rx={6} fill={S} stroke={W} strokeWidth={3} />
        ))}
        <path d="M-44 24 V36 M-58 36 H-30 M-58 36 V44 M-30 36 V44" {...line} strokeWidth={3} />
        <rect x={-68} y={44} width={20} height={14} rx={4} fill={T} stroke={W} strokeWidth={2.5} />
        <rect x={-40} y={44} width={20} height={14} rx={4} fill={T} stroke={W} strokeWidth={2.5} />
      </>
    ),
  },
  'ict-computer-studies': {
    bg: '#22388c', shade: '#192a6b', accent: '#7de2b8', pattern: 'grid',
    motif: (a) => (
      <>
        <rect x={-58} y={-46} width={116} height={76} rx={8} fill={T} stroke={W} strokeWidth={3.5} />
        <path d="M-14 30 L-18 46 H18 L14 30 M-28 48 H28" {...line} />
        <path d="M-26 -22 L-40 -8 L-26 6 M26 -22 L40 -8 L26 6 M8 -26 L-8 10" {...line} strokeWidth={4} />
        <rect x={30} y={14} width={14} height={5} rx={2} fill={a} />
      </>
    ),
  },
  'religious-studies': {
    bg: '#6a3dbd', shade: '#522d96', accent: '#ffd166', pattern: 'rings',
    motif: (a) => (
      <>
        <path d="M-34 52 V-6 A34 34 0 0 1 34 -6 V52 Z" fill={T} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M-20 52 V0 A20 20 0 0 1 20 0 V52" {...line} strokeWidth={2.5} stroke="rgba(255,255,255,0.7)" />
        <circle cx={0} cy={-2} r={9} fill={a} />
        <path d="M0 -50 V-60 M-34 -40 L-41 -47 M34 -40 L41 -47 M-50 -14 H-60 M50 -14 H60" {...line} stroke={a} strokeWidth={3.5} />
      </>
    ),
  },
  'technical-drawing': {
    bg: '#18697f', shade: '#115163', accent: '#ffd166', pattern: 'grid',
    motif: (a) => (
      <>
        <path d="M-14 -50 L25 -28 L-14 -6 L-53 -28 Z" fill={S} stroke={W} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-53 -28 V16 L-14 38 V-6 Z" fill={T} stroke={W} strokeWidth={3} strokeLinejoin="round" />
        <path d="M25 -28 V16 L-14 38" {...line} strokeWidth={3} />
        <path d="M-60 26 L-21 48 M-60 20 V32 M-21 42 V54" {...line} strokeWidth={2.5} stroke="rgba(255,255,255,0.75)" />
        <path d="M34 50 L34 4 L62 50 Z" fill="none" stroke={a} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M40 44 V30 L48 44 Z" fill="none" stroke={a} strokeWidth={2.5} strokeLinejoin="round" />
      </>
    ),
  },
  'building-construction': {
    bg: '#a1531a', shade: '#7f4013', accent: '#ffd166', pattern: 'diag',
    motif: (a) => (
      <>
        <path d="M-62 -4 L0 -50 L62 -4 Z" fill={S} stroke={W} strokeWidth={3.5} strokeLinejoin="round" />
        <rect x={-50} y={-4} width={100} height={54} fill={T} stroke={W} strokeWidth={3.5} />
        <path d="M-50 10 H50 M-50 24 H50 M-50 38 H50 M-25 -4 V10 M10 -4 V10 M-40 10 V24 M-5 10 V24 M30 10 V24 M-25 24 V38 M10 24 V38 M-40 38 V50 M-5 38 V50 M30 38 V50" stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />
        <rect x={-11} y={22} width={22} height={28} rx={2} fill={a} />
      </>
    ),
  },
}

const FALLBACK: Art = {
  bg: '#5b34d6', shade: '#4520b0', accent: '#ffd166', pattern: 'dots',
  motif: (a) => (
    <>
      <rect x={-44} y={-46} width={70} height={92} rx={6} fill={T} stroke={W} strokeWidth={3.5} />
      <path d="M-30 -24 H12 M-30 -8 H12 M-30 8 H0" {...line} strokeWidth={3} />
      <rect x={30} y={-30} width={14} height={76} rx={3} fill={a} />
    </>
  ),
}

/** Background texture for the whole canvas, including the part left of the viewBox used by banners. */
function PatternLayer({ kind }: { kind: Pattern }) {
  const c = 'rgba(255,255,255,0.09)'
  const x0 = -1200
  switch (kind) {
    case 'grid':
      return (
        <g stroke={c} strokeWidth={1}>
          {Array.from({ length: 96 }, (_, i) => x0 + i * 16).map((x) => <path key={`v${x}`} d={`M${x} 0 V180`} />)}
          {Array.from({ length: 12 }, (_, i) => i * 16).map((y) => <path key={`h${y}`} d={`M${x0} ${y} H320`} />)}
        </g>
      )
    case 'ruled':
      return (
        <g stroke={c} strokeWidth={1.5}>
          {Array.from({ length: 9 }, (_, i) => 14 + i * 20).map((y) => <path key={y} d={`M${x0} ${y} H320`} />)}
        </g>
      )
    case 'dots':
      return (
        <g fill="rgba(255,255,255,0.16)">
          {Array.from({ length: 96 }, (_, i) => x0 + 8 + i * 16).flatMap((x) =>
            Array.from({ length: 11 }, (_, j) => 8 + j * 16).map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.4} />),
          )}
        </g>
      )
    case 'waves':
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          {Array.from({ length: 9 }, (_, i) => 10 + i * 20).map((y) => (
            <path key={y} d={`M${x0} ${y} ${Array.from({ length: 80 }, () => 'q 10 -7 20 0 t 20 0').join(' ')}`} />
          ))}
        </g>
      )
    case 'diag':
      return (
        <g stroke={c} strokeWidth={1.5}>
          {Array.from({ length: 100 }, (_, i) => x0 + i * 16).map((x) => <path key={x} d={`M${x} 180 L${x + 180} 0`} />)}
        </g>
      )
    case 'rings':
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          {Array.from({ length: 14 }, (_, i) => 20 + i * 18).map((r) => <circle key={r} cx={232} cy={90} r={r} />)}
        </g>
      )
  }
}

export function subjectArt(slug: string | null | undefined): Art {
  return (slug && ART[slug]) || FALLBACK
}

/**
 * Subject cover. `shape` sets how the drawing fits its box; size the box
 * with className (e.g. "h-16 w-16" for a thumbnail, "aspect-[16/9] w-full"
 * for a card, "h-28 w-full" for a banner).
 */
export function SubjectCover({
  slug,
  shape = 'wide',
  className = '',
  rounded = 'rounded-xl',
  priority = false,
}: {
  slug: string | null | undefined
  shape?: 'square' | 'wide' | 'banner'
  className?: string
  rounded?: string
  /** Load immediately (above-the-fold banners). */
  priority?: boolean
}) {
  const art = subjectArt(slug)
  // Large shapes use the subject's photograph when there is one; small
  // thumbnails keep the illustration, which stays crisp at 40-64 px.
  const photo = shape !== 'square' ? subjectPhoto(slug) : undefined
  if (photo) {
    return (
      <span className={`relative block overflow-hidden ${rounded} ${className}`} style={{ backgroundColor: art.bg }} aria-hidden>
        <img
          src={photo.src}
          srcSet={`${photo.small} 640w, ${photo.src} 1280w`}
          sizes={shape === 'banner' ? '(min-width: 1024px) 768px, 100vw' : '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw'}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: photo.position ?? 'center' }}
        />
        {shape === 'wide' && (
          <span className="absolute bottom-2.5 left-2.5 rounded-[10px] bg-white p-0.5 shadow-sm">
            <SubjectCover slug={slug} shape="square" className="h-8 w-8" rounded="rounded-lg" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: art.bg }} />
      </span>
    )
  }
  const glyphs = slug ? GLYPHS[slug] : undefined
  const fit = shape === 'square' ? 'xMaxYMid slice' : shape === 'banner' ? 'xMaxYMid meet' : 'xMidYMid slice'
  return (
    <span className={`relative block overflow-hidden ${rounded} ${className}`} style={{ backgroundColor: art.bg }} aria-hidden>
      <svg viewBox="0 0 320 180" preserveAspectRatio={fit} className="absolute inset-0 h-full w-full" focusable="false">
        <rect x={-1200} y={0} width={1520} height={180} fill={art.bg} />
        <PatternLayer kind={art.pattern} />
        <path d="M-1200 180 V128 C-300 128 40 150 150 180 Z" fill={art.shade} opacity={0.55} />
        <circle cx={232} cy={90} r={74} fill="rgba(255,255,255,0.1)" />
        <circle cx={232} cy={90} r={92} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        {shape === 'wide' && glyphs && (
          <g fill="rgba(255,255,255,0.34)" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontWeight={700}>
            <text x={34} y={58} fontSize={26}>{glyphs[0]}</text>
            <text x={78} y={134} fontSize={20}>{glyphs[1]}</text>
            <text x={120} y={74} fontSize={17}>{glyphs[2]}</text>
          </g>
        )}
        <g transform="translate(232 90)">{art.motif(art.accent)}</g>
      </svg>
    </span>
  )
}

/** Page header for a subject: its cover as a slim banner with the title on it. */
export function SubjectBanner({ slug, eyebrow, title }: { slug: string | null | undefined; eyebrow?: ReactNode; title: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <SubjectCover slug={slug} shape="banner" rounded="rounded-2xl" className="h-28 w-full sm:h-36" priority />
      {/* A scrim keeps white text legible: light over illustrations, stronger over photos. */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 sm:p-6 ${
          subjectPhoto(slug) ? 'bg-gradient-to-r from-black/70 via-black/35 to-black/5' : 'bg-gradient-to-r from-black/30 via-black/10 to-transparent'
        }`}
      >
        {eyebrow && <p className="text-sm font-medium text-white/85">{eyebrow}</p>}
        <h1 className="max-w-[70%] text-[1.6rem] font-bold leading-tight tracking-tight text-balance text-white sm:text-3xl">{title}</h1>
      </div>
    </div>
  )
}
