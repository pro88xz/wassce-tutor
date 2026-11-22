// The branded email shell. Table layout with inline styles (what email apps
// reliably render), one column up to 600 px, one button, and a plain-text
// twin built from the same content. The logo is a PNG with the violet band
// baked in, so it stays readable when an email app switches to dark mode.
//
// Content shape (from templates.js):
//   { subject, preheader, headline, paragraphs[], lists[{ title, items[] }],
//     cta: { label, link }, after[], note, category: 'marketing' | 'service',
//     question?: { eyebrow, topic, stem, options[{ label, text, link }], footnote },
//     continueLine?: { hint, label, link },
//     tutor?: { eyebrow, title, lines[], cta: { label, link } } }
// A question's stem and options may use **bold** and *italic* (as the questions do).

const BRAND = '#6438d8'
const BAND = '#4720b5'
const INK = '#171c2b'
const MUTED = '#4f5b70'
const LINE = '#e5e9f2'
const CANVAS = '#f2f3f8'
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const escape = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Question text as HTML: escaped, with **bold**, *italic* and line breaks kept. */
const inline = (t) =>
  escape(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>')
/** The same text for the plain-text email: bold (the letters a question asks about) in capitals, italics dropped. */
const plainInline = (t) => String(t ?? '').replace(/\*\*(.+?)\*\*/g, (_, b) => b.toUpperCase()).replace(/\*([^*\n]+?)\*/g, '$1')

/** Fails loudly if a template left a placeholder or an empty value in the copy. */
export function assertClean(content) {
  const strings = []
  const walk = (v) => (typeof v === 'string' ? strings.push(v) : v && typeof v === 'object' ? Object.values(v).forEach(walk) : null)
  walk(content)
  const bad = strings.find((t) => /\{\{|\}\}|\bundefined\b|\bNaN\b|\bnull\b|\bInvalid Date\b/.test(t) || !t.trim())
  if (bad !== undefined || !content.subject || !content.headline || !content.cta?.label || !content.cta?.link) {
    throw new Error(`Template produced unfinished copy: ${JSON.stringify(bad ?? content.subject ?? '')}`)
  }
}

/**
 * @param content  from templates.js
 * @param ctx      { site, url(linkKey) → absolute URL, unsubscribeUrl, preferencesUrl, contact }
 */
export function renderEmail(content, ctx) {
  assertClean(content)
  const ctaUrl = ctx.url(content.cta.link)
  const p = (t, extra = '') => `<p style="margin:0 0 16px;font:400 16px/1.6 ${FONT};color:${INK};${extra}">${escape(t)}</p>`
  const lists = (content.lists ?? [])
    .map(
      (l) => `
      <tr><td style="padding:4px 0 8px">
        ${l.title ? `<p style="margin:0 0 10px;font:700 15px/1.4 ${FONT};color:${INK}">${escape(l.title)}</p>` : ''}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${l.items
            .map(
              (item) => `<tr>
            <td width="26" valign="top" style="padding:2px 0 10px;font:700 15px/1.5 ${FONT};color:${BRAND}">&#10003;</td>
            <td valign="top" style="padding:2px 0 10px;font:400 15px/1.5 ${FONT};color:${INK}">${escape(item)}</td>
          </tr>`,
            )
            .join('')}
        </table>
      </td></tr>`,
    )
    .join('')

  const q = content.question
  const question = q
    ? `
      <tr><td style="padding:4px 0 22px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #ddd3fb;border-radius:16px;background:#f7f4ff">
          <tr><td style="padding:18px 18px 4px">
            <p style="margin:0;font:700 11px/1.4 ${FONT};letter-spacing:0.12em;text-transform:uppercase;color:${BRAND}">${escape(q.eyebrow)}</p>
            ${q.topic ? `<p style="margin:2px 0 0;font:400 13px/1.4 ${FONT};color:${MUTED}">${escape(q.topic)}</p>` : ''}
            <p style="margin:12px 0 14px;font:600 17px/1.5 ${FONT};color:${INK}">${inline(q.stem)}</p>
          </td></tr>
          ${q.options
            .map(
              (o) => `<tr><td style="padding:0 18px 10px">
            <a href="${escape(ctx.url(o.link))}" style="display:block;text-decoration:none;border:1px solid #d6ccf7;border-radius:12px;background:#ffffff;padding:11px 14px;font:500 15px/1.45 ${FONT};color:${INK}">
              <span style="display:inline-block;min-width:26px;height:26px;margin-right:10px;border-radius:13px;background:${BRAND};color:#ffffff;font:700 13px/26px ${FONT};text-align:center;vertical-align:middle">${escape(o.label)}</span><span style="vertical-align:middle">${inline(o.text)}</span>
            </a>
          </td></tr>`,
            )
            .join('')}
          <tr><td style="padding:2px 18px 16px"><p style="margin:0;font:400 13px/1.5 ${FONT};color:${MUTED}">${escape(q.footnote)}</p></td></tr>
        </table>
      </td></tr>`
    : ''
  const cont = content.continueLine
    ? `<tr><td style="padding:0 0 22px">${p(`${content.continueLine.hint}:`, `font-size:14px;color:${MUTED};margin:0 0 4px`)}<a href="${escape(ctx.url(content.continueLine.link))}" style="font:700 15px/1.5 ${FONT};color:${BRAND};text-decoration:none">${escape(content.continueLine.label)} &rarr;</a></td></tr>`
    : ''
  const t = content.tutor
  const tutor = t
    ? `
      <tr><td style="padding:0 0 24px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #f1dcb8;border-radius:16px;background:#fff9ef">
          <tr><td style="padding:18px">
            <p style="margin:0 0 6px;font:700 11px/1.4 ${FONT};letter-spacing:0.12em;text-transform:uppercase;color:#a85d0d">${escape(t.eyebrow)}</p>
            <p style="margin:0 0 10px;font:700 18px/1.35 ${FONT};color:${INK}">${escape(t.title)}</p>
            ${t.lines.map((line) => p(line, 'font-size:15px;margin:0 0 10px')).join('')}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px"><tr>
              <td style="border:2px solid ${BRAND};border-radius:12px;background:#ffffff">
                <a href="${escape(ctx.url(t.cta.link))}" style="display:inline-block;padding:11px 22px;font:700 15px/1.2 ${FONT};color:${BRAND};text-decoration:none">${escape(t.cta.label)}</a>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`
    : ''

  const reason =
    content.category === 'marketing'
      ? `You're receiving this because you have a WASSCE Tutor account and get study tips and updates by email.`
      : `This is an account email about your WASSCE Tutor plan.`
  const footerLinks = [
    content.category === 'marketing' && ctx.unsubscribeUrl ? `<a href="${escape(ctx.unsubscribeUrl)}" style="color:${MUTED};text-decoration:underline">Unsubscribe</a>` : '',
    `<a href="${escape(ctx.preferencesUrl)}" style="color:${MUTED};text-decoration:underline">Email settings</a>`,
    `<a href="${escape(`${ctx.site}/privacy`)}" style="color:${MUTED};text-decoration:underline">Privacy</a>`,
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ')

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escape(content.subject)}</title>
<style>
  @media (max-width: 620px) {
    .card { width: 100% !important; border-radius: 0 !important; }
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 24px !important; }
    .btn a { display: block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${CANVAS};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${CANVAS}">${escape(content.preheader)}${'&#8199;&#65279;&#847; '.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS}">
  <tr><td align="center" style="padding:24px 12px">
    <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${LINE}">
      <tr><td class="pad" bgcolor="${BAND}" style="background:${BAND};padding:20px 32px">
        <a href="${escape(ctx.site)}" style="text-decoration:none"><img src="${escape(`${ctx.site}/brand/email-logo.png`)}" width="190" height="20" alt="WASSCE Tutor" style="display:block;border:0;outline:none;width:190px;height:20px;color:#ffffff;font:700 18px ${FONT}"></a>
      </td></tr>
      <tr><td class="pad" style="padding:32px 32px 8px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td>
            <h1 class="h1" style="margin:0 0 18px;font:800 26px/1.2 ${FONT};letter-spacing:-0.01em;color:${INK}">${escape(content.headline)}</h1>
            ${(content.paragraphs ?? []).map((t) => p(t)).join('')}
          </td></tr>
          ${question}
          ${lists}
          ${(content.after ?? []).length ? `<tr><td>${content.after.map((t) => p(t)).join('')}</td></tr>` : ''}
          <tr><td style="padding:8px 0 24px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn"><tr>
              <td bgcolor="${BRAND}" style="background:${BRAND};border-radius:12px;text-align:center">
                <a href="${escape(ctaUrl)}" style="display:inline-block;padding:15px 28px;font:700 16px/1.2 ${FONT};color:#ffffff;text-decoration:none;border-radius:12px">${escape(content.cta.label)}</a>
              </td>
            </tr></table>
            <p style="margin:14px 0 0;font:400 13px/1.5 ${FONT};color:${MUTED}">Button not working? Open <a href="${escape(ctaUrl)}" style="color:${BRAND};word-break:break-all">${escape(ctx.displayUrl(content.cta.link))}</a></p>
          </td></tr>
          ${cont}
          ${tutor}
          ${content.note ? `<tr><td style="padding:0 0 24px">${p(content.note, `font-size:14px;color:${MUTED};margin:0`)}</td></tr>` : ''}
        </table>
      </td></tr>
      <tr><td class="pad" style="padding:20px 32px 26px;border-top:1px solid ${LINE};background:#fafbff">
        <p style="margin:0 0 10px;font:400 12px/1.6 ${FONT};color:${MUTED}">${escape(reason)}</p>
        <p style="margin:0 0 10px;font:400 12px/1.6 ${FONT};color:${MUTED}">${footerLinks}</p>
        <p style="margin:0;font:400 12px/1.6 ${FONT};color:${MUTED}">WASSCE Tutor · Freetown, Sierra Leone · WhatsApp ${escape(ctx.contact.phoneDisplay)}<br>An independent study service. Not affiliated with WAEC.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  const lines = [content.headline, '', ...(content.paragraphs ?? []).flatMap((t) => [t, ''])]
  if (q) {
    lines.push(q.eyebrow.toUpperCase(), plainInline(q.stem), '')
    for (const o of q.options) lines.push(`  ${o.label}. ${plainInline(o.text)}: ${ctx.url(o.link)}`)
    lines.push('', q.footnote, '')
  }
  for (const l of content.lists ?? []) {
    if (l.title) lines.push(l.title)
    for (const item of l.items) lines.push(`  ✓ ${item}`)
    lines.push('')
  }
  for (const t of content.after ?? []) lines.push(t, '')
  lines.push(`${content.cta.label}: ${ctaUrl}`, '')
  if (content.continueLine) lines.push(`${content.continueLine.hint}: ${content.continueLine.label}: ${ctx.url(content.continueLine.link)}`, '')
  if (t) lines.push(t.title, ...t.lines, `${t.cta.label}: ${ctx.url(t.cta.link)}`, '')
  if (content.note) lines.push(content.note, '')
  lines.push('—', reason)
  if (content.category === 'marketing' && ctx.unsubscribeUrl) lines.push(`Unsubscribe: ${ctx.unsubscribeUrl}`)
  lines.push(`Email settings: ${ctx.preferencesUrl}`, `WASSCE Tutor · Freetown, Sierra Leone · WhatsApp ${ctx.contact.phoneDisplay}`, 'An independent study service. Not affiliated with WAEC.')

  return { html, text: lines.join('\n') }
}
