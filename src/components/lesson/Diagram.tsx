// SVG diagram registry for biology lessons.
// Diagrams are hand-coded React components that render labelled SVG.
// Use via :::diagram{name=animal-cell} in lesson Markdown.

import type { ReactElement } from 'react'

type DiagramName = 'animal-cell' | 'plant-cell'

const DIAGRAMS: Record<DiagramName, () => ReactElement> = {
  'animal-cell': AnimalCell,
  'plant-cell': PlantCell,
}

export function Diagram({ name }: { name: string }) {
  const D = DIAGRAMS[name as DiagramName]
  if (!D) {
    return (
      <div className="my-5 rounded-lg border border-amber-400 bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200 not-prose">
        Diagram not found: <code>{name}</code>
      </div>
    )
  }
  return (
    <figure className="my-6 not-prose">
      <div className="rounded-2xl border bg-white p-4 dark:bg-slate-50">
        <D />
      </div>
    </figure>
  )
}

// Shared label component — text with a small dot connector.
function Label({
  x,
  y,
  text,
  anchor = 'start',
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize="13"
      fontWeight="600"
      fill="#1e293b"
      textAnchor={anchor}
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      {text}
    </text>
  )
}

// Leader line from label to part.
function Leader({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="1" />
}

// ---------- ANIMAL CELL ----------
function AnimalCell() {
  return (
    <svg viewBox="0 0 500 420" className="w-full h-auto max-w-[500px] mx-auto block">
      {/* Cell membrane - irregular blob */}
      <path
        d="M 100 210 C 90 130, 170 80, 240 90 C 320 70, 410 110, 420 200 C 430 280, 380 340, 290 345 C 200 360, 110 320, 100 210 Z"
        fill="#fef3c7"
        stroke="#b45309"
        strokeWidth="3"
      />

      {/* Nucleus */}
      <circle cx="240" cy="200" r="55" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2.5" />
      {/* Nucleolus */}
      <circle cx="250" cy="195" r="15" fill="#7c3aed" />

      {/* Mitochondria - several oval shapes */}
      <ellipse cx="160" cy="150" rx="22" ry="11" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" transform="rotate(-20 160 150)" />
      <ellipse cx="340" cy="160" rx="22" ry="11" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" transform="rotate(30 340 160)" />
      <ellipse cx="180" cy="280" rx="22" ry="11" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" transform="rotate(15 180 280)" />
      <ellipse cx="330" cy="290" rx="22" ry="11" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" transform="rotate(-25 330 290)" />

      {/* Ribosomes - small dots */}
      <circle cx="145" cy="220" r="3" fill="#1e40af" />
      <circle cx="155" cy="240" r="3" fill="#1e40af" />
      <circle cx="170" cy="255" r="3" fill="#1e40af" />
      <circle cx="195" cy="265" r="3" fill="#1e40af" />
      <circle cx="310" cy="230" r="3" fill="#1e40af" />
      <circle cx="325" cy="220" r="3" fill="#1e40af" />
      <circle cx="305" cy="255" r="3" fill="#1e40af" />
      <circle cx="350" cy="245" r="3" fill="#1e40af" />
      <circle cx="220" cy="305" r="3" fill="#1e40af" />
      <circle cx="270" cy="310" r="3" fill="#1e40af" />

      {/* ER - curved lines near nucleus */}
      <path d="M 175 200 Q 195 195 210 200" fill="none" stroke="#0891b2" strokeWidth="1.5" />
      <path d="M 280 200 Q 295 195 310 200" fill="none" stroke="#0891b2" strokeWidth="1.5" />

      {/* Small vacuoles */}
      <circle cx="370" cy="240" r="10" fill="#bae6fd" stroke="#0369a1" strokeWidth="1.5" />
      <circle cx="125" cy="180" r="8" fill="#bae6fd" stroke="#0369a1" strokeWidth="1.5" />

      {/* Labels with leader lines */}
      {/* Cell membrane */}
      <Leader x1={100} y1={140} x2={75} y2={120} />
      <Label x={70} y={115} text="Cell membrane" anchor="end" />

      {/* Cytoplasm */}
      <Leader x1={200} y1={130} x2={170} y2={105} />
      <Label x={165} y={100} text="Cytoplasm" anchor="end" />

      {/* Nucleus */}
      <Leader x1={240} y1={155} x2={245} y2={50} />
      <Label x={245} y={45} text="Nucleus" anchor="middle" />

      {/* Nucleolus */}
      <Leader x1={262} y1={195} x2={420} y2={120} />
      <Label x={425} y={115} text="Nucleolus" anchor="start" />

      {/* Mitochondrion */}
      <Leader x1={350} y1={155} x2={430} y2={80} />
      <Label x={435} y={75} text="Mitochondrion" anchor="start" />

      {/* Ribosomes */}
      <Leader x1={155} y1={245} x2={70} y2={290} />
      <Label x={65} y={295} text="Ribosomes" anchor="end" />

      {/* Vacuole */}
      <Leader x1={380} y1={240} x2={450} y2={290} />
      <Label x={455} y={295} text="Vacuole" anchor="start" />
    </svg>
  )
}

// ---------- PLANT CELL ----------
function PlantCell() {
  return (
    <svg viewBox="0 0 500 420" className="w-full h-auto max-w-[500px] mx-auto block">
      {/* Cell wall - thick outer rectangle */}
      <rect
        x="90"
        y="80"
        width="320"
        height="260"
        rx="12"
        fill="#dcfce7"
        stroke="#15803d"
        strokeWidth="5"
      />
      {/* Cell membrane - thinner inner rectangle */}
      <rect
        x="100"
        y="90"
        width="300"
        height="240"
        rx="8"
        fill="#fef9c3"
        stroke="#a16207"
        strokeWidth="2"
      />

      {/* Large central vacuole */}
      <rect
        x="155"
        y="135"
        width="200"
        height="150"
        rx="20"
        fill="#bae6fd"
        stroke="#0369a1"
        strokeWidth="2.5"
      />

      {/* Nucleus - pushed to side */}
      <circle cx="125" cy="160" r="22" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2.5" />
      <circle cx="129" cy="157" r="7" fill="#7c3aed" />

      {/* Chloroplasts - green ovals in cytoplasm around edges */}
      <ellipse cx="370" cy="120" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(25 370 120)" />
      <ellipse cx="375" cy="170" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(-15 375 170)" />
      <ellipse cx="370" cy="220" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(35 370 220)" />
      <ellipse cx="375" cy="270" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(-20 375 270)" />
      <ellipse cx="200" cy="110" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(-30 200 110)" />
      <ellipse cx="280" cy="105" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(15 280 105)" />
      <ellipse cx="220" cy="310" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(20 220 310)" />
      <ellipse cx="300" cy="315" rx="14" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" transform="rotate(-25 300 315)" />

      {/* Mitochondria - smaller, fewer than animal cell */}
      <ellipse cx="135" cy="240" rx="14" ry="7" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" transform="rotate(45 135 240)" />
      <ellipse cx="130" cy="290" rx="14" ry="7" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1.5" transform="rotate(-30 130 290)" />

      {/* Labels with leader lines */}
      {/* Cell wall */}
      <Leader x1={250} y1={80} x2={250} y2={40} />
      <Label x={250} y={35} text="Cell wall" anchor="middle" />

      {/* Cell membrane */}
      <Leader x1={105} y1={95} x2={50} y2={55} />
      <Label x={45} y={50} text="Cell membrane" anchor="end" />

      {/* Cytoplasm */}
      <Leader x1={140} y1={215} x2={50} y2={210} />
      <Label x={45} y={213} text="Cytoplasm" anchor="end" />

      {/* Nucleus */}
      <Leader x1={108} y1={148} x2={50} y2={120} />
      <Label x={45} y={115} text="Nucleus" anchor="end" />

      {/* Large central vacuole */}
      <Leader x1={255} y1={210} x2={255} y2={380} />
      <Label x={255} y={395} text="Large central vacuole" anchor="middle" />

      {/* Chloroplast */}
      <Leader x1={385} y1={170} x2={470} y2={140} />
      <Label x={475} y={135} text="Chloroplast" anchor="start" />

      {/* Mitochondrion */}
      <Leader x1={148} y1={290} x2={470} y2={290} />
      <Label x={475} y={293} text="Mitochondrion" anchor="start" />
    </svg>
  )
}
