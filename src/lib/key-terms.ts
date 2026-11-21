// Key terms: the definitions a topic's lessons already give, as cards to
// revise from (term on the front, the lesson's own words on the back).
//
// Source: the lessons' definition boxes (:::callout{type=definition}). A card
// is made only where the box clearly defines a term in bold:
//
//   **Fermentation** is the breakdown of sugars ...       (term, then is/are/means)
//   An **adjective** is a word that ...                     (with an article first)
//   **Coulomb's law:** the force between two charges ...   (term, then a colon or dash)
//   - **Puberty**: the age at which an animal ...          (one card per list item)
//   | Term | Meaning |  ...  | **allele** | one form of a gene |   (a table of terms, see tableUnits)
//
// Anything else in a box (other tables, worked lists, a formula on its own)
// makes no card: a wrong card is worse than a missing one. The back of the card is the
// sentence as the lesson wrote it, so the words never drift from the lesson.
// Pure functions, no imports: used by the pages, the app, and the build's
// page list (scripts/public-page-list.ts, loaded by vite.config.ts in Node).

export type KeyTerm = {
  /** Stable across builds while the term and its lesson stay: `${lessonId}:${slug}` */
  id: string
  /** The term as the lesson writes it, first letter capitalised */
  term: string
  /** The lesson's definition, Markdown (with maths), the term in bold */
  definition: string
  lessonId: string
  lessonSlug: string
  lessonTitle: string
  /** The lesson section it is in (LessonView numbers the ## headings: #section-N), or null before the first */
  section: number | null
}

type LessonSource = { id: string; slug: string; title: string; content: string }

/** A topic gets a key terms page (and section) from this many cards. */
export const MIN_KEY_TERMS = 4

const BOX = /^:::callout\{type=definition[^}]*\}[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm
// A unit that opens with a bold term. Group 1: the term; group 2: a colon
// inside the bold ("**Coulomb's law:** the force ..."); group 3: what follows
// the term when it defines it (is, are, means, a colon or a dash).
const DEFINES = /^(?:(?:A|An|The)\s+)?\*{2,3}([^*\n]{2,60}?)(:?)\*{2,3}\s*(?:\([^)\n]{1,40}\)\s*)?([:—–]|-\s|is\b|are\b|means\b|refers to\b|describes?\b|was\b)?/
// Labels that open a line in a definition box without naming a term.
const GENERIC = /^(verify|check|notation|note|notes|step \d+|method|rule|rules|formula|result|answer|example|examples|remember|tip|key idea|summary|definition|meaning|(first|second|third) law)$/i
const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const words = (s: string) => s.replace(/\$[^$]*\$/g, ' x ').replace(/[*_`>#|]/g, ' ').split(/\s+/).filter(Boolean).length

// A table defines terms only when its headings say so: the first column names
// terms and the second gives their meaning. "Type" tables (Simple / Compound,
// whose entries are adjectives) and tables of stages, parts, marks, rules,
// symbols or formulas make no card, and nor do "the question it answers" tables.
const TERM_COLUMN = /^(terms?|words?|figures?|process(es)?|associations?|concepts?|propert(y|ies))$/i
const MEANING_COLUMN = /^(meaning|definition|what happens|how it works)$/i
// Further columns that belong on the card (an example, the organisms involved); others ("Here", "How to find it") stay in the lesson.
const EXTRA_COLUMN = /^(examples?|organisms?)$/i

/** A table of terms as units, one per row with its term in bold: "**term**: meaning. Example: ...". */
function tableUnits(block: string): string[] {
  const rows = block.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'))
  if (rows.length < 3 || !/^\|[\s:|-]+\|?$/.test(rows[1])) return []
  const cells = (row: string) => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
  const head = cells(rows[0]).map((h) => h.replace(/\*/g, '').split(':')[0].trim())
  if (head.length < 2 || !TERM_COLUMN.test(head[0]) || !MEANING_COLUMN.test(head[1])) return []
  return rows.slice(2).flatMap((row) => {
    const c = cells(row)
    if (!/^\*\*[^*\n]{2,60}\*\*/.test(c[0] ?? '') || !c[1]) return []
    // End each part with a full stop, unless it already ends a sentence (also inside italics: "*… a cheetah.*").
    const sentence = (v: string) => (/[.!?]["'”’]?[*_]*$/.test(v) ? v : `${v}.`)
    const meaning = sentence(c[1])
    const extra = c.slice(2).flatMap((v, i) => (v && EXTRA_COLUMN.test(head[i + 2] ?? '') ? [`${head[i + 2]}: ${sentence(v)}`] : []))
    return [[`${c[0]}: ${meaning}`, ...extra].join(' ')]
  })
}

/** A box's text as units: list items, table rows that define terms, and the sentences of a paragraph that each start by defining a bold term. */
function units(box: string): string[] {
  const out: string[] = []
  const blocks = box.split(/\n\s*\n/)
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b].trim()
    if (!block) continue
    if (block.startsWith('|')) {
      out.push(...tableUnits(block))
      continue
    }
    const lines = block.split('\n')
    if (lines.every((l) => /^\s*([-*+]|\d+[.)])\s+/.test(l) || /^\s{2,}\S/.test(l))) {
      // A list: one unit per item (continuation lines join their item).
      for (const l of lines) {
        if (/^\s*([-*+]|\d+[.)])\s+/.test(l)) out.push(l.replace(/^\s*([-*+]|\d+[.)])\s+/, '').trim())
        else if (out.length) out[out.length - 1] += ` ${l.trim()}`
      }
      continue
    }
    let text = lines.join(' ').trim()
    // "... is measured as:" followed by its formula on its own line: keep them together.
    const next = blocks[b + 1]?.trim()
    if (/:\s*$/.test(text) && next && /^\$\$[\s\S]*\$\$$/.test(next)) {
      text = `${text}\n\n${next}`
      b++
    }
    // Two terms defined in one paragraph ("**Stock** is ... **Supply** is ..."): split before the second.
    out.push(...text.split(/(?<=[.!?])\s+(?=(?:(?:A|An|The)\s+)?\*{2,3}[^*\n]{2,60}\*{2,3}\s*(?:is |are |means |:|—|–))/))
  }
  return out
}

/** The key terms in one lesson, in the order it gives them. */
export function lessonKeyTerms(lesson: LessonSource): KeyTerm[] {
  const out: KeyTerm[] = []
  const content = lesson.content.replace(/\r\n?/g, '\n')
  for (const box of content.matchAll(BOX)) {
    const before = content.slice(0, box.index)
    const sections = (before.match(/^##(?!#)\s/gm) ?? []).length
    for (const unit of units(box[1])) {
      const m = DEFINES.exec(unit)
      // A bold word that is not followed by a definition ("**Note** that ...") makes no card.
      if (!m || (!m[2] && !m[3])) continue
      const raw = m[1].replace(/[:\s]+$/, '').trim()
      if (raw.includes('$') || /^\d/.test(raw)) continue
      // A label for a step or a part of the working is not a term to learn ("**Verify:** the shares sum to Q",
      // "**Notation:**", a bare "**First law:**" without whose law it is).
      if (GENERIC.test(raw)) continue
      // The definition must say something: a few words after the term, not just a list heading.
      const rest = unit.slice(m[0].length)
      if (words(rest) < 4 || words(unit) > 90) continue
      if (/:\s*$/.test(unit) && !unit.includes('$$')) continue
      // Values from a worked example ("**class width**: $30.5 - 20.5 = 10$") are not a definition.
      // A bare formula ("**Roots:** $\log \sqrt[n]{a} = ...$") is kept only when words around it define the term.
      const prose = words(rest.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, ' '))
      if ((/^\s*[$\d]/.test(rest) && prose < 8) || /\d\s*[-+×−]\s*\d+(\.\d+)?\s*=/.test(rest)) continue
      // A reaction or formula after the term ("**Yeast:** glucose → ethanol + ...") is not a definition.
      if (/[→⇌=]/.test(rest.replace(/\$[^$]*\$/g, '')) && words(rest) < 14) continue
      // Capitalise "adjective" (from "An **adjective** is"), but never pH, mRNA or -ing.
      const term = /^[a-z][a-z]/.test(raw) ? raw.charAt(0).toUpperCase() + raw.slice(1) : raw
      out.push({
        id: `${lesson.id}:${slugOf(raw)}`,
        term,
        definition: unit.trim(),
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        section: sections > 0 ? sections : null,
      })
    }
  }
  return out
}

/** A topic's key terms, lessons in syllabus order, each term once (the first lesson that defines it). */
export function topicKeyTerms(lessons: LessonSource[]): KeyTerm[] {
  const seen = new Set<string>()
  const out: KeyTerm[] = []
  for (const l of lessons) {
    for (const t of lessonKeyTerms(l)) {
      const key = t.term.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push(t)
    }
  }
  return out
}

/** Whether a topic has enough key terms for its own page and section. */
export const hasKeyTermsByCount = (n: number) => n >= MIN_KEY_TERMS
