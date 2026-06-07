// SVG diagram registry for biology lessons.
// Diagrams are hand-coded React components that render labelled SVG.
// Use via :::diagram{name=animal-cell} in lesson Markdown.

import type { ReactElement } from 'react'

type DiagramName =
  | 'animal-cell'
  | 'plant-cell'
  | 'cell-membrane'
  | 'mitochondrion-detailed'
  | 'er-and-ribosomes'
  | 'mitosis-stages'
  | 'meiosis-overview'

const DIAGRAMS: Record<DiagramName, () => ReactElement> = {
  'animal-cell': AnimalCell,
  'plant-cell': PlantCell,
  'cell-membrane': CellMembrane,
  'mitochondrion-detailed': MitochondrionDetailed,
  'er-and-ribosomes': ErAndRibosomes,
  'mitosis-stages': MitosisStages,
  'meiosis-overview': MeiosisOverview,
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

// ---------- CELL MEMBRANE (phospholipid bilayer) ----------
function CellMembrane() {
  return (
    <svg viewBox="0 0 500 320" className="w-full h-auto max-w-[500px] mx-auto block">
      {/* Outside region */}
      <rect x="0" y="0" width="500" height="100" fill="#dbeafe" />
      {/* Inside region */}
      <rect x="0" y="220" width="500" height="100" fill="#fef3c7" />

      {/* Upper phospholipid layer - heads facing outward */}
      {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460].map((x, i) => (
        <g key={`top-${i}`}>
          <circle cx={x} cy={110} r="14" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
          <line x1={x - 5} y1={123} x2={x - 5} y2={155} stroke="#92400e" strokeWidth="2" />
          <line x1={x + 5} y1={123} x2={x + 5} y2={155} stroke="#92400e" strokeWidth="2" />
        </g>
      ))}

      {/* Lower phospholipid layer - heads facing inward (down) */}
      {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460].map((x, i) => (
        <g key={`bot-${i}`}>
          <line x1={x - 5} y1={165} x2={x - 5} y2={197} stroke="#92400e" strokeWidth="2" />
          <line x1={x + 5} y1={165} x2={x + 5} y2={197} stroke="#92400e" strokeWidth="2" />
          <circle cx={x} cy={210} r="14" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
        </g>
      ))}

      {/* Embedded protein - channel */}
      <rect x="195" y="100" width="40" height="120" rx="8" fill="#a78bfa" stroke="#6d28d9" strokeWidth="2" />
      <rect x="205" y="115" width="20" height="90" rx="3" fill="#dbeafe" />

      {/* Embedded protein - carrier */}
      <ellipse cx="370" cy="160" rx="22" ry="40" fill="#86efac" stroke="#15803d" strokeWidth="2" />

      {/* Labels */}
      <Leader x1={45} y1={110} x2={45} y2={45} />
      <Label x={45} y={40} text="Phosphate head (likes water)" anchor="middle" />

      <Leader x1={45} y1={180} x2={120} y2={275} />
      <Label x={125} y={285} text="Fatty acid tails (hate water)" anchor="start" />

      <Leader x1={215} y1={100} x2={215} y2={45} />
      <Label x={215} y={40} text="Channel protein" anchor="middle" />

      <Leader x1={370} y1={120} x2={420} y2={45} />
      <Label x={425} y={40} text="Carrier protein" anchor="start" />

      <Label x={20} y={30} text="OUTSIDE" anchor="start" />
      <Label x={20} y={260} text="INSIDE" anchor="start" />
    </svg>
  )
}

// ---------- MITOCHONDRION (detailed cross-section) ----------
function MitochondrionDetailed() {
  return (
    <svg viewBox="0 0 500 320" className="w-full h-auto max-w-[500px] mx-auto block">
      {/* Outer membrane */}
      <ellipse cx="250" cy="160" rx="180" ry="100" fill="#fee2e2" stroke="#b91c1c" strokeWidth="3" />
      {/* Inner membrane with cristae */}
      <ellipse cx="250" cy="160" rx="165" ry="85" fill="#fecaca" stroke="#7f1d1d" strokeWidth="2.5" />

      {/* Cristae - inward folds */}
      <path d="M 110 130 Q 140 130 140 160 Q 140 190 110 190" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M 90 160 Q 130 160 130 180" fill="none" stroke="#7f1d1d" strokeWidth="2" />
      <path d="M 90 160 Q 130 160 130 140" fill="none" stroke="#7f1d1d" strokeWidth="2" />

      <path d="M 165 100 Q 180 130 195 100" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M 170 105 Q 180 125 190 105" fill="none" stroke="#7f1d1d" strokeWidth="2" />

      <path d="M 215 220 Q 230 195 245 220" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M 220 215 Q 230 200 240 215" fill="none" stroke="#7f1d1d" strokeWidth="2" />

      <path d="M 280 100 Q 295 130 310 100" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M 285 105 Q 295 125 305 105" fill="none" stroke="#7f1d1d" strokeWidth="2" />

      <path d="M 330 220 Q 345 195 360 220" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M 335 215 Q 345 200 355 215" fill="none" stroke="#7f1d1d" strokeWidth="2" />

      <path d="M 390 130 Q 360 130 360 160 Q 360 190 390 190" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M 410 160 Q 370 160 370 180" fill="none" stroke="#7f1d1d" strokeWidth="2" />
      <path d="M 410 160 Q 370 160 370 140" fill="none" stroke="#7f1d1d" strokeWidth="2" />

      {/* Labels */}
      <Leader x1={70} y1={120} x2={30} y2={70} />
      <Label x={25} y={65} text="Outer membrane" anchor="end" />

      <Leader x1={90} y1={155} x2={30} y2={160} />
      <Label x={25} y={163} text="Inner membrane" anchor="end" />

      <Leader x1={140} y1={160} x2={40} y2={250} />
      <Label x={35} y={258} text="Cristae (folds)" anchor="end" />

      <Leader x1={250} y1={160} x2={460} y2={160} />
      <Label x={465} y={163} text="Matrix" anchor="start" />

      <Leader x1={250} y1={250} x2={250} y2={295} />
      <Label x={250} y={305} text="Site of respiration — energy released" anchor="middle" />
    </svg>
  )
}

// ---------- ENDOPLASMIC RETICULUM + RIBOSOMES ----------
function ErAndRibosomes() {
  return (
    <svg viewBox="0 0 500 320" className="w-full h-auto max-w-[500px] mx-auto block">
      {/* Nucleus on left for context */}
      <circle cx="80" cy="160" r="50" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2.5" />
      <circle cx="88" cy="155" r="12" fill="#7c3aed" />

      {/* Rough ER - cisternae continuous from nucleus */}
      <path d="M 130 150 Q 200 130 270 150 L 270 175 Q 200 155 130 175 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      <path d="M 140 195 Q 210 180 280 195 L 280 220 Q 210 205 140 220 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      <path d="M 135 110 Q 205 95 275 110 L 275 135 Q 205 120 135 135 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />

      {/* Smooth ER (no ribosomes) */}
      <path d="M 310 140 Q 370 120 430 140 Q 460 160 430 180 Q 370 200 310 180 Z" fill="#fef9c3" stroke="#a16207" strokeWidth="2" />
      <path d="M 320 180 Q 380 195 440 180" fill="none" stroke="#a16207" strokeWidth="2" />
      <path d="M 320 200 Q 380 215 440 200" fill="none" stroke="#a16207" strokeWidth="2" />

      {/* Ribosomes on rough ER surface */}
      {[145, 165, 185, 205, 225, 245, 265].map((x, i) => (
        <circle key={`r1-${i}`} cx={x} cy={148} r="4" fill="#1e40af" />
      ))}
      {[140, 160, 180, 200, 220, 240, 260].map((x, i) => (
        <circle key={`r2-${i}`} cx={x} cy={177} r="4" fill="#1e40af" />
      ))}
      {[155, 175, 195, 215, 235, 255, 275].map((x, i) => (
        <circle key={`r3-${i}`} cx={x} cy={193} r="4" fill="#1e40af" />
      ))}
      {[150, 170, 190, 210, 230, 250, 270].map((x, i) => (
        <circle key={`r4-${i}`} cx={x} cy={222} r="4" fill="#1e40af" />
      ))}

      {/* Free ribosomes in cytoplasm */}
      <circle cx="100" cy="240" r="4" fill="#1e40af" />
      <circle cx="120" cy="260" r="4" fill="#1e40af" />
      <circle cx="400" cy="250" r="4" fill="#1e40af" />
      <circle cx="380" cy="270" r="4" fill="#1e40af" />

      {/* Labels */}
      <Leader x1={80} y1={110} x2={80} y2={40} />
      <Label x={80} y={35} text="Nucleus" anchor="middle" />

      <Leader x1={200} y1={130} x2={200} y2={50} />
      <Label x={200} y={45} text="Rough ER" anchor="middle" />

      <Leader x1={170} y1={148} x2={50} y2={70} />
      <Label x={45} y={65} text="Ribosomes (build proteins)" anchor="end" />

      <Leader x1={380} y1={140} x2={420} y2={50} />
      <Label x={425} y={45} text="Smooth ER" anchor="start" />

      <Leader x1={120} y1={260} x2={50} y2={290} />
      <Label x={45} y={295} text="Free ribosomes in cytoplasm" anchor="end" />
    </svg>
  )
}

// ---------- MITOSIS STAGES (4-panel) ----------
function MitosisStages() {
  return (
    <svg viewBox="0 0 600 540" className="w-full h-auto max-w-[600px] mx-auto block">
      {/* Panel borders - 2x2 grid */}
      <line x1="300" y1="20" x2="300" y2="520" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="20" y1="270" x2="580" y2="270" stroke="#cbd5e1" strokeWidth="1" />

      {/* ==== PROPHASE (top-left) ==== */}
      <text x="150" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b" fontFamily="system-ui, sans-serif">PROPHASE</text>
      <text x="150" y="58" textAnchor="middle" fontSize="11" fill="#475569" fontFamily="system-ui, sans-serif">Chromosomes condense, nuclear membrane breaks down</text>
      <circle cx="150" cy="160" r="80" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <circle cx="150" cy="160" r="55" fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
      <g transform="translate(120 140)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(180 140)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(125 180)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(175 180)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* ==== METAPHASE (top-right) ==== */}
      <text x="450" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b" fontFamily="system-ui, sans-serif">METAPHASE</text>
      <text x="450" y="58" textAnchor="middle" fontSize="11" fill="#475569" fontFamily="system-ui, sans-serif">Chromosomes line up at the cell's middle</text>
      <circle cx="450" cy="160" r="80" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <line x1="380" y1="100" x2="450" y2="160" stroke="#94a3b8" strokeWidth="1" />
      <line x1="380" y1="220" x2="450" y2="160" stroke="#94a3b8" strokeWidth="1" />
      <line x1="520" y1="100" x2="450" y2="160" stroke="#94a3b8" strokeWidth="1" />
      <line x1="520" y1="220" x2="450" y2="160" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="380" cy="160" r="4" fill="#475569" />
      <circle cx="520" cy="160" r="4" fill="#475569" />
      <g transform="translate(450 125)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(450 150)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(450 175)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(450 200)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      </g>
      <line x1="450" y1="90" x2="450" y2="230" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

      {/* ==== ANAPHASE (bottom-left) ==== */}
      <text x="150" y="290" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b" fontFamily="system-ui, sans-serif">ANAPHASE</text>
      <text x="150" y="308" textAnchor="middle" fontSize="11" fill="#475569" fontFamily="system-ui, sans-serif">Sister chromatids separate, pulled to opposite poles</text>
      <circle cx="150" cy="410" r="80" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <line x1="80" y1="410" x2="115" y2="410" stroke="#94a3b8" strokeWidth="1" />
      <line x1="220" y1="410" x2="185" y2="410" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="80" cy="410" r="4" fill="#475569" />
      <circle cx="220" cy="410" r="4" fill="#475569" />
      <g transform="translate(105 380)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(195 380)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(105 400)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(195 400)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(105 420)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(195 420)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(105 440)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(195 440)">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* ==== TELOPHASE (bottom-right) ==== */}
      <text x="450" y="290" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b" fontFamily="system-ui, sans-serif">TELOPHASE</text>
      <text x="450" y="308" textAnchor="middle" fontSize="11" fill="#475569" fontFamily="system-ui, sans-serif">Two new nuclei form, cell splits in two</text>
      <ellipse cx="400" cy="410" rx="55" ry="70" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <ellipse cx="500" cy="410" rx="55" ry="70" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <path d="M 450 360 Q 450 410 450 460" fill="none" stroke="#b45309" strokeWidth="2" />
      <circle cx="400" cy="410" r="32" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
      <circle cx="500" cy="410" r="32" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
      <line x1="385" y1="395" x2="395" y2="405" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <line x1="405" y1="395" x2="415" y2="405" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
      <line x1="385" y1="415" x2="395" y2="425" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
      <line x1="405" y1="415" x2="415" y2="425" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
      <line x1="485" y1="395" x2="495" y2="405" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <line x1="505" y1="395" x2="515" y2="405" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
      <line x1="485" y1="415" x2="495" y2="425" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
      <line x1="505" y1="415" x2="515" y2="425" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ---------- MEIOSIS OVERVIEW (1 cell -> 4 daughter cells, half chromosomes each) ----------
function MeiosisOverview() {
  return (
    <svg viewBox="0 0 600 480" className="w-full h-auto max-w-[600px] mx-auto block">
      <text x="300" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b" fontFamily="system-ui, sans-serif">MEIOSIS — One cell becomes four, each with half the chromosomes</text>
      <circle cx="300" cy="100" r="55" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
      <text x="300" y="70" textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569" fontFamily="system-ui, sans-serif">Parent cell (4 chromosomes)</text>
      <g transform="translate(280 90)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(320 90)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(280 120)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(320 120)">
        <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <text x="300" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c3aed" fontFamily="system-ui, sans-serif">MEIOSIS I</text>
      <text x="300" y="196" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="system-ui, sans-serif">Pairs separate</text>
      <path d="M 285 205 L 220 240" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 315 205 L 380 240" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="#475569" />
        </marker>
      </defs>
      <circle cx="190" cy="270" r="45" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <g transform="translate(180 265)">
        <path d="M -7 -7 L 7 7 M -7 7 L 7 -7" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(200 285)">
        <path d="M -7 -7 L 7 7 M -7 7 L 7 -7" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="410" cy="270" r="45" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <g transform="translate(400 265)">
        <path d="M -7 -7 L 7 7 M -7 7 L 7 -7" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(420 285)">
        <path d="M -7 -7 L 7 7 M -7 7 L 7 -7" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      </g>
      <text x="300" y="340" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c3aed" fontFamily="system-ui, sans-serif">MEIOSIS II</text>
      <text x="300" y="356" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="system-ui, sans-serif">Chromatids separate</text>
      <path d="M 180 320 L 130 380" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 200 320 L 250 380" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 400 320 L 350 380" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 420 320 L 470 380" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <circle cx="100" cy="420" r="35" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <line x1="90" y1="415" x2="100" y2="425" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <line x1="105" y1="420" x2="115" y2="430" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      <circle cx="240" cy="420" r="35" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <line x1="230" y1="415" x2="240" y2="425" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <line x1="245" y1="420" x2="255" y2="430" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      <circle cx="360" cy="420" r="35" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <line x1="350" y1="415" x2="360" y2="425" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <line x1="365" y1="420" x2="375" y2="430" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      <circle cx="500" cy="420" r="35" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
      <line x1="490" y1="415" x2="500" y2="425" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <line x1="505" y1="420" x2="515" y2="430" stroke="#1e40af" strokeWidth="4" strokeLinecap="round" />
      <text x="300" y="473" textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569" fontFamily="system-ui, sans-serif">4 gametes (each with 2 chromosomes — half of parent)</text>
    </svg>
  )
}
