// Parts of a lesson's Markdown that topic pages summarise. Most lessons have
// a "## Learning objectives" list and a "## WASSCE examination focus" note
// (usually inside a :::callout{type=waec-tests} box). Pure functions, so the
// prerender and the browser read them the same way.

/** The body of the first `##`/`###` section whose heading matches, up to the next heading of the same or a higher level. */
export function lessonSection(markdown: string, heading: RegExp): string | null {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  let start = -1
  let level = 0
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(lines[i])
    if (!m) continue
    if (start >= 0 && m[1].length <= level) return lines.slice(start, i).join('\n').trim() || null
    if (start < 0 && heading.test(m[2])) {
      start = i + 1
      level = m[1].length
    }
  }
  return start >= 0 ? lines.slice(start).join('\n').trim() || null : null
}

/** "What WASSCE asks": the lesson's examination-focus note as Markdown, without the callout box around it. */
export function examFocus(markdown: string): string | null {
  const body = lessonSection(markdown, /^(wassce|waec)\s+exam(ination)?\s+focus$|^exam(ination)?\s+focus$/i)
  if (!body) return null
  const text = body
    .split('\n')
    .filter((line) => !/^:{3,}/.test(line.trim())) // callout fences
    .join('\n')
    .trim()
  return text.length >= 40 ? text : null
}

/** The lesson's learning objectives, one per item, without the "By the end of this lesson" line. */
export function learningObjectives(markdown: string): string[] {
  const body = lessonSection(markdown, /^learning objectives$/i)
  if (!body) return []
  return body
    .split('\n')
    .map((line) => /^\s*[-*+]\s+(.+)$/.exec(line)?.[1]?.trim())
    .filter((item): item is string => !!item)
}
