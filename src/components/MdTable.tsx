// Markdown table renderer shared by lessons, the tutor chat and other Markdown.
//
// - Tables of short cells (schedules, cost tables, figures) and two-column
//   tables drop the wordy-table minimum width, so they fit a phone.
// - Wordy tables of three or more columns stack on a narrow screen: one card
//   per row, each cell labelled with its column heading (CSS container query
//   on .md-table-wrap). Wider screens show the normal table.
// - Anything still too wide scrolls sideways instead of squeezing the page.
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

type HastNode = { type: string; value?: string; tagName?: string; properties?: { className?: unknown }; children?: HastNode[] }

const SHORT_CELL = 16

function textOf(n: HastNode): string {
  if (n.type === 'text') return n.value ?? ''
  const cls = n.properties?.className
  // KaTeX renders maths twice (MathML for screen readers + HTML); count only what is seen.
  if (Array.isArray(cls) && cls.includes('katex-mathml')) return ''
  return (n.children ?? []).map(textOf).join('')
}

function findAll(n: HastNode, tag: string, out: HastNode[] = []): HastNode[] {
  if (n.tagName === tag) out.push(n)
  for (const c of n.children ?? []) findAll(c, tag, out)
  return out
}

export function tableShape(node: HastNode | undefined) {
  if (!node) return { labels: [] as string[], compact: false }
  const head = findAll(node, 'tr')[0]
  const labels = (head?.children ?? []).filter((c) => c.tagName === 'th' || c.tagName === 'td').map((c) => textOf(c).trim())
  const cells = findAll(node, 'td')
  const compact = cells.length > 0 && cells.every((c) => textOf(c).trim().length <= SHORT_CELL)
  return { labels, compact }
}

type El = ReactElement<{ children?: ReactNode }>

// Give each body cell its column heading (shown when the table stacks) and keep
// table semantics for screen readers, which some browsers drop once rows are blocks.
function withLabels(children: ReactNode, labels: string[]): ReactNode {
  return Children.map(children, (section) => {
    if (!isValidElement(section)) return section
    const s = section as El
    const rows = Children.map(s.props.children, (tr) => {
      if (!isValidElement(tr)) return tr
      const r = tr as El
      let i = 0
      const cells = Children.map(r.props.children, (cell) => {
        if (!isValidElement(cell)) return cell
        const head = cell.type === 'th'
        return cloneElement(cell as El, { role: head ? 'columnheader' : 'cell', 'data-label': labels[i++] ?? '' } as object)
      })
      return cloneElement(r, { role: 'row' } as object, cells)
    })
    return cloneElement(s, { role: 'rowgroup' } as object, rows)
  })
}

export function MdTable({ node, className = 'not-prose my-5', children, ...props }: any) {
  const { labels, compact } = tableShape(node)
  const cols = labels.length
  const stack = !compact && cols >= 3
  return (
    <div className={`${className} md-table-wrap overflow-x-auto rounded-xl border`}>
      <table
        className="md-table"
        role="table"
        data-cols={cols || undefined}
        data-compact={compact || undefined}
        data-stack={stack || undefined}
        {...props}
      >
        {stack ? withLabels(children, labels) : children}
      </table>
    </div>
  )
}
