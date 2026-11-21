// LessonView — Markdown renderer for lesson content with lesson directives.
// Supports :::callout{type=...} and :::diagram{name=...} blocks, and for
// writing skills ::::model, :::right, :::reveal and :mark[...]{n=...}
// alongside standard Markdown + KaTeX math.
//
// Used by lesson pages and the admin preview pane.
// MarkdownView (sibling) stays simpler for tutor/papers/question previews.
import { memo, useEffect } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components, Options } from 'react-markdown'
import type { Element, Root as HastRoot, RootContent } from 'hast'
import type { Nodes as MdastNodes, Root as MdastRoot } from 'mdast'
// Type-only: adds the directive nodes to mdast's and hName/hProperties to its data.
import type {} from 'mdast-util-directive'
import type {} from 'mdast-util-to-hast'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkDirective from 'remark-directive'
import { Callout } from './lesson/Callout'
import { Diagram } from './lesson/Diagram'
import { Zoomable } from './lesson/Zoomable'
import { Marked, ModelAnswer, Reveal, RightAligned } from './lesson/WritingBlocks'
import { MdTable } from './MdTable'
import { fitLongMath, splitForNarrow } from '@/lib/math-split'

// Custom remark plugin: rewrite directive nodes to use HTML element names
// that react-markdown can map via the `components` prop.
//
// :::callout{type=definition} ... :::  becomes  <callout type="definition">...</callout>
// :::diagram{name=animal-cell}         becomes  <diagram name="animal-cell" />
//
// Only the directives below exist, each with a fixed set of attributes.
// Anything else written in directive syntax (for example ::iframe{src=...} or
// :::script) is not turned into an element: it stays a plain block of its own
// text. Lesson text can come from outside sources (the open-notes pipeline),
// so the lesson must never be able to choose which HTML element is rendered.
const DIRECTIVES: Record<string, string[]> = {
  callout: ['type', 'title'],
  diagram: ['name'],
  // Writing skills (src/components/lesson/WritingBlocks.tsx).
  model: ['title', 'label'],
  right: [],
  reveal: ['title'],
  mark: ['n'],
}

function directiveTransformer() {
  return (tree: MdastRoot) => {
    walk(tree)
  }
  function walk(node: MdastNodes) {
    if (
      node.type === 'containerDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'textDirective'
    ) {
      const data = node.data || (node.data = {})
      const allowed = Object.hasOwn(DIRECTIVES, node.name) ? DIRECTIVES[node.name] : null
      if (allowed && node.name === 'mark' && node.type !== 'textDirective') {
        // :mark[...] is only for words inside a line.
        data.hName = 'div'
        data.hProperties = {}
      } else if (allowed) {
        const attributes: Record<string, string> = {}
        for (const key of allowed) {
          const value = node.attributes?.[key]
          if (typeof value === 'string') attributes[key] = value
        }
        data.hName = node.name
        data.hProperties = attributes
      } else if (node.type === 'textDirective' && !node.children.length) {
        // A colon followed by a word in ordinary text ("a:b"): keep it as written.
        delete node.data
        Object.assign(node, { type: 'text', value: `:${node.name}` })
      } else {
        data.hName = node.type === 'textDirective' ? 'span' : 'div'
        data.hProperties = {}
      }
    }
    if ('children' in node) {
      for (const child of node.children) walk(child)
    }
  }
}

// Some lessons write display maths as \[ ... \] and inline maths as \( ... \)
// (LaTeX style). remark-math only reads $$ ... $$ and $ ... $, so convert first;
// otherwise the formula shows as raw text.
const DISPLAY_MATH = /\\\[([\s\S]+?)\\\]/g
const INLINE_MATH = /\\\(([\s\S]+?)\\\)/g
// A line that is only $$ ... $$ is meant as a displayed formula, but Markdown
// reads it as inline maths (no centring, and a long one widens the page on a
// phone). Put the $$ on their own lines so it renders as a display block.
const ONE_LINE_DISPLAY = /^[ \t]*\$\$([^\n$]+?)\$\$[ \t]*$/gm
/**
 * Some lessons open with their own title as "# Title". The page shows the
 * title already (its <h1>), so that first line is left out instead of
 * showing the title twice.
 */
function withoutTitleHeading(md: string): string {
  return md.replace(/^\s*#[ \t]+[^\n]*(\n+|$)/, '')
}

function normalizeMath(md: string): string {
  return md
    .replace(DISPLAY_MATH, (_m, tex: string) => ['', '$$', tex.trim(), '$$', ''].join('\n'))
    .replace(INLINE_MATH, (_m, tex: string) => '$' + tex.trim() + '$')
    .replace(ONE_LINE_DISPLAY, (_m, tex: string) => ['$$', tex.trim(), '$$'].join('\n'))
}

// Number the level-2 headings (id="section-1", "section-2", ...) so a topic
// page can link straight to a part of a lesson. scripts/notes/outlines.mjs
// counts headings the same way.
function rehypeSectionIds() {
  return (tree: HastRoot) => {
    let n = 0
    const walk = (node: HastRoot | RootContent) => {
      if (node.type === 'element' && node.tagName === 'h2') {
        n += 1
        node.properties = { ...node.properties, id: `section-${n}` }
      }
      if ('children' in node) node.children.forEach(walk)
    }
    walk(tree)
  }
}

// A long displayed equation gets a second, stacked form (one step per line)
// for screens too narrow for it; fitLongMath() picks which one shows.
const mathBlock = (tex: string): Element => ({
  type: 'element',
  tagName: 'pre',
  properties: {},
  children: [{ type: 'element', tagName: 'code', properties: { className: ['language-math', 'math-display'] }, children: [{ type: 'text', value: tex }] }],
})
const box = (className: string, children: Element[]): Element => ({ type: 'element', tagName: 'div', properties: { className: [className] }, children })
/** A displayed formula (<pre><code class="math-display">) as its wide and stacked forms, or null when it is not one or needs no stacking. */
function splitMath(el: Element): Element | null {
  const code = el.tagName === 'pre' ? el.children[0] : undefined
  if (code?.type !== 'element' || code.tagName !== 'code') return null
  const cls = code.properties.className
  if (!Array.isArray(cls) || !cls.includes('math-display')) return null
  const tex = code.children.map((c) => (c.type === 'text' ? c.value : '')).join('')
  const narrow = splitForNarrow(tex)
  return narrow ? box('math-split', [box('math-wide', [mathBlock(tex)]), box('math-narrow', [mathBlock(narrow)])]) : null
}
function rehypeNarrowMath() {
  return (tree: HastRoot) => {
    const walk = (node: HastRoot | Element) => {
      node.children.forEach((child, i) => {
        if (child.type !== 'element') return
        const split = splitMath(child)
        if (split) node.children[i] = split
        else walk(child)
      })
    }
    walk(tree)
  }
}

/** An element's props without react-markdown's `node`, which is not an HTML attribute. */
function withoutNode<P extends { node?: unknown }>(props: P): Omit<P, 'node'> {
  const rest = { ...props }
  delete rest.node
  return rest
}

/** Props react-markdown gives our directive elements: their attributes, lowercase, as strings. */
type DirectiveProps = { children?: ReactNode; type?: string; title?: string; name?: string; label?: string; n?: string }

// Defined once, outside the component: if these were recreated on every
// render, React would rebuild every callout and diagram each time the page
// re-rendered (losing scroll state and the stacked-equation choice).
const REMARK_PLUGINS: Options['remarkPlugins'] = [[remarkGfm, { singleTilde: false }], remarkMath, remarkDirective, directiveTransformer]
const REHYPE_PLUGINS: Options['rehypePlugins'] = [rehypeSectionIds, rehypeNarrowMath, rehypeKatex]
// Our directive elements (see DIRECTIVES), mapped to React components.
const DIRECTIVE_COMPONENTS: Record<keyof typeof DIRECTIVES, (props: DirectiveProps) => ReactNode> = {
  // Lesson text can name any type; Callout shows one it does not know as a definition.
  callout: ({ type, title, children }) => (
    <Callout type={type as ComponentProps<typeof Callout>['type']} title={title}>
      {children}
    </Callout>
  ),
  diagram: ({ name }) => <Diagram name={name ?? ''} />,
  model: ({ title, label, children }) => <ModelAnswer title={title} label={label}>{children}</ModelAnswer>,
  right: ({ children }) => <RightAligned>{children}</RightAligned>,
  reveal: ({ title, children }) => <Reveal title={title}>{children}</Reveal>,
  mark: ({ n, children }) => <Marked n={n}>{children}</Marked>,
}
const MD_COMPONENTS: Components = {
  // The page already has the lesson's title as its one <h1>; a "#" heading
  // inside a lesson is a section, like "##".
  h1: (props) => <h2 {...withoutNode(props)} />,
  ...DIRECTIVE_COMPONENTS,
  // Wide tables scroll sideways on phones; short-cell tables fit the screen.
  table: MdTable,
  // Diagrams sit on a white card, so line drawings stay readable in dark mode.
  // Tapping one opens it full screen (Zoomable), where its labels are readable on a phone.
  img: ({ src, alt }) => (
    <span className="not-prose mx-auto my-5 block w-full max-w-2xl">
      <Zoomable
        label={alt || 'Lesson diagram'}
        large={<img src={src} alt={alt ?? ''} decoding="async" className="block h-auto w-full rounded-xl bg-white" />}
      >
        <img
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          className="block h-auto max-h-[32rem] w-full rounded-xl border bg-white object-contain p-1.5"
        />
      </Zoomable>
    </span>
  ),
}

// Memoised: a lesson is thousands of DOM nodes (KaTeX), and re-parsing it
// costs about a second on a mid-range phone. Without memo, any re-render of
// the page around it (the signed-in state arriving, a header menu) rendered
// the whole lesson again. It only needs to render again when its text changes.
export const LessonView = memo(function LessonView({ content }: { content: string }) {
  // Show the stacked form of a long equation wherever the one-line form would
  // need sideways scrolling: after every render, when fonts load, and when the
  // screen size changes (a phone turned sideways).
  useEffect(() => {
    fitLongMath()
  })
  useEffect(() => {
    const fit = () => fitLongMath()
    document.fonts?.ready.then(fit).catch(() => {})
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [content])

  // In the app the lesson loads after the page, so the browser cannot jump to
  // #section-N by itself; do it once the content is on screen.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id.startsWith('section-')) return
    const el = document.getElementById(id)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
  }, [content])

  return (
    <ReactMarkdown
      // GFM: tables (and task lists, autolinks). singleTilde off, so "~5 min" never strikes text through.
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={MD_COMPONENTS}
    >
      {normalizeMath(withoutTitleHeading(content))}
    </ReactMarkdown>
  )
})
