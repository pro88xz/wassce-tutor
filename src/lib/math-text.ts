// Inline maths as plain text, for places that cannot render KaTeX: meta
// descriptions, page titles, structured data and image alt text.
//
//   $2^3$                      -> 2³
//   $2 \times 2 \times 2 = 8$  -> 2 × 2 × 2 = 8
//   $\dfrac{124°}{2}$          -> 124°/2
//   $\sqrt{16}$                -> √16
//   $\angle AOB$               -> ∠AOB
//
// Google shows a snippet as written, so a formula that is simply deleted
// leaves holes such as "When you write, you don't mean two times three".
// Anything this cannot turn into plain text cleanly is kept as close to the
// source as possible rather than dropped.

const SYMBOLS: Record<string, string> = {
  times: '×', div: '÷', cdot: '·', pm: '±', mp: '∓',
  le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', equiv: '≡', sim: '~', propto: '∝',
  to: '→', rightarrow: '→', Rightarrow: '⇒', leftarrow: '←', leftrightarrow: '↔', iff: '⇔', mapsto: '↦',
  longrightarrow: '→', Longrightarrow: '⇒', rightleftharpoons: '⇌',
  ldots: '…', cdots: '…', dots: '…',
  infty: '∞', angle: '∠', triangle: '△', parallel: '∥', circ: '°', degree: '°',
  in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', cup: '∪', cap: '∩', emptyset: '∅', varnothing: '∅',
  neg: '¬', wedge: '∧', vee: '∨', otimes: '⊗', oplus: '⊕',
  sum: 'Σ', int: '∫', partial: '∂', nabla: '∇',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
  theta: 'θ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
  phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  sin: 'sin', cos: 'cos', tan: 'tan', log: 'log', ln: 'ln', lim: 'lim', max: 'max', min: 'min',
  bmod: 'mod', gg: '≫', ll: '≪', ast: '*', star: '⋆', perp: '⊥', therefore: '∴', because: '∵',
}

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '−': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', n: 'ⁿ', i: 'ⁱ', x: 'ˣ', y: 'ʸ',
}
const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '−': '₋', '=': '₌', '(': '₍', ')': '₎',
}

/** Superscript or subscript in Unicode when every character has one, else "^(...)" / "_..." */
function script(text: string, map: Record<string, string>, fallback: (t: string) => string): string {
  const chars = [...text]
  return chars.every((c) => map[c]) ? chars.map((c) => map[c]).join('') : fallback(text)
}

/** Read one argument after a command: "{...}" (balanced) or a single character. */
function readArg(s: string, i: number): [arg: string, end: number] {
  while (s[i] === ' ') i++
  if (s[i] === '{') {
    let depth = 0
    for (let j = i; j < s.length; j++) {
      if (s[j] === '{') depth++
      else if (s[j] === '}' && --depth === 0) return [s.slice(i + 1, j), j + 1]
    }
    return [s.slice(i + 1), s.length]
  }
  if (s[i] === '\\') {
    const m = /^\\[a-zA-Z]+/.exec(s.slice(i))
    if (m) return [m[0], i + m[0].length]
  }
  return [s[i] ?? '', i + 1]
}

/** A fraction's part: wrapped in brackets when it has more than one term. */
const part = (t: string) => (/^[\w.,°′″√²³⁰¹⁴-⁹αβγθλμπωΔ∠]+$/u.test(t) ? t : `(${t})`)

/** One LaTeX formula (without its $ delimiters) as plain text. */
export function latexToText(tex: string): string {
  let out = ''
  let i = 0
  const s = tex
  while (i < s.length) {
    const c = s[i]
    if (c === '\\') {
      const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(i))
      if (!m) {
        i++
        continue
      }
      const name = m[1]
      i += m[0].length
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        const [num, a] = readArg(s, i)
        const [den, b] = readArg(s, a)
        i = b
        out += `${part(latexToText(num))}/${part(latexToText(den))}`
      } else if (name === 'sqrt') {
        let index = ''
        if (s[i] === '[') {
          const close = s.indexOf(']', i)
          index = s.slice(i + 1, close)
          i = close + 1
        }
        const [arg, end] = readArg(s, i)
        i = end
        const inner = latexToText(arg)
        const root = index === '3' ? '∛' : index === '4' ? '∜' : index ? `${script(index, SUP, (t) => `(${t})`)}√` : '√'
        out += root + (inner.length > 1 && !/^\w+$/.test(inner) ? `(${inner})` : inner)
      } else if (['text', 'mathrm', 'textbf', 'mathbf', 'textit', 'mathit', 'operatorname', 'mbox', 'mathbb', 'boldsymbol'].includes(name)) {
        const [arg, end] = readArg(s, i)
        i = end
        const words = /^(text|mbox|textit|textbf)$/.test(name)
        out += name === 'mathbb' ? ({ R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ' } as Record<string, string>)[arg] ?? arg : words ? arg.replace(/\\([%$&#_{}])/g, '$1') : latexToText(arg)
      } else if (['overrightarrow', 'vec'].includes(name)) {
        const [arg, end] = readArg(s, i)
        i = end
        out += latexToText(arg) + '⃗'
      } else if (['bar', 'overline'].includes(name)) {
        const [arg, end] = readArg(s, i)
        i = end
        out += [...latexToText(arg)].map((ch) => ch + '̅').join('')
      } else if (['dot', 'hat', 'tilde', 'underline'].includes(name)) {
        const [arg, end] = readArg(s, i)
        i = end
        out += latexToText(arg)
      } else if (name === 'underbrace' || name === 'overbrace') {
        const [arg, end] = readArg(s, i)
        i = end
        out += latexToText(arg)
        // drop the brace's label: "_{n \text{ times}}"
        if (s[i] === '_' || s[i] === '^') i = readArg(s, i + 1)[1]
      } else if (name === 'underset' || name === 'overset') {
        const [, a] = readArg(s, i)
        const [base, b] = readArg(s, a)
        i = b
        out += latexToText(base)
      } else if (name === 'pmod') {
        const [arg, end] = readArg(s, i)
        i = end
        out += ` (mod ${latexToText(arg)})`
      } else if (name === 'begin' || name === 'end') {
        i = readArg(s, i)[1]
        out += ' '
      } else if (name === 'not') {
        // "\not\equiv" and the like
        const next = /^\s*\\([a-zA-Z]+)/.exec(s.slice(i))
        if (next) {
          i += next[0].length
          const sym = SYMBOLS[next[1]] ?? next[1]
          out += sym === '=' ? '≠' : sym === '∈' ? '∉' : sym + '̸'
        }
      } else if (['left', 'right', 'big', 'Big', 'bigg', 'Bigg', 'displaystyle', 'textstyle', 'limits', 'nolimits', 'lvert', 'rvert', 'mid'].includes(name)) {
        if (name === 'lvert' || name === 'rvert' || name === 'mid') out += '|'
      } else if (name === 'quad' || name === 'qquad' || name === ',' || name === ';' || name === ':' || name === ' ' || name === '!') {
        out += name === '!' ? '' : ' '
      } else if (name === '\\') {
        out += '; '
      } else if (name === '{' || name === '}' || name === '%' || name === '$' || name === '&' || name === '#' || name === '_') {
        out += name
      } else if (SYMBOLS[name] !== undefined) {
        const sym = SYMBOLS[name]
        // spell-out operators read better spaced: "2 × 3", "x → y"
        out += /^[a-z]+$/.test(sym) ? (/[A-Za-z0-9]$/.test(out) ? ' ' : '') + sym + ' ' : sym
      } else {
        out += name
      }
    } else if (c === '^' || c === '_') {
      const [arg, end] = readArg(s, i + 1)
      i = end
      const inner = latexToText(arg)
      if (c === '^' && (inner === '∘' || inner === '°' || arg === '\\circ')) out += '°'
      else if (c === '^' && inner === '′') out += '′'
      else out += c === '^' ? script(inner, SUP, (t) => `^(${t})`) : script(inner, SUB, (t) => `_${t}`)
    } else if (c === '{' || c === '}') {
      // a group with no command, e.g. 10{,}000 -> 10,000
      i++
    } else if (c === '&') {
      i++
      out += ' '
    } else if (c === '~') {
      i++
      out += ' '
    } else {
      out += c === '-' ? '−' : c
      i++
    }
  }
  return out
    .replace(/\s+/g, ' ')
    // a prefix symbol sits against what follows: "∠AOB", "√2", "ΔH", "¬p"
    .replace(/([∠△√∛∜¬Δ]) +(?=[\w(])/gu, '$1')
    .replace(/ +([,.;)])/g, '$1')
    .replace(/\( +/g, '(')
    .trim()
}

/**
 * Markdown with $...$ and $$...$$ maths as plain text with the maths written
 * out. Display maths becomes inline text too.
 */
export function mathToText(markdown: string): string {
  return markdown
    .replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (_, a?: string, b?: string) => ` ${latexToText(a ?? b ?? '')} `)
    // $\$5000$ (an escaped dollar inside the maths) is one formula, not two.
    .replace(/(?<!\\)\$((?:\\\$|[^$\n])+?)\$|\\\((.+?)\\\)/g, (_, a?: string, b?: string) => latexToText(a ?? b ?? ''))
}
