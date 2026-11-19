// Draws the charts in the 2026 WASSCE results articles as images, so they can
// be indexed by image search and shared on their own. Each chart is plain
// HTML/SVG rendered by Playwright at 2x, then saved as WebP at 1200 px with a
// 640 px copy for phones.
//
//   node scripts/blog/results-charts.mjs
//
// Every number here is stated in the article's sources (the Ministry of Basic
// and Senior Secondary Education's results announcements). When a figure
// changes (for example, once withheld results are released), change it here,
// re-run the script, and update the article and its table in the same commit.
//
// Colours: brand violet and the reference orange and aqua, validated together
// with the dataviz palette checker on a white surface (aqua is below 3:1, so
// every aqua mark is labelled and the article carries the same data as a table).
import { mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import sharp from 'sharp'

// Playwright is not a project dependency: require() finds a global install
// (NODE_PATH), which an ES import does not. Install it with `npm i -g playwright`.
const { chromium } = createRequire(import.meta.url)('playwright')

const OUT = 'public/img/blog/charts'
const W = 600
const H = 375

const C = {
  ink: '#171c2b',
  muted: '#4f5b70',
  grid: '#e5e9f2',
  surface: '#ffffff',
  violet: '#6438d8',
  violetLight: '#c9bdf3',
  orange: '#eb6834',
  aqua: '#1baf7a',
}

const fmt = (n) => n.toLocaleString('en-GB')

async function fontCss() {
  const file = 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
  const data = (await readFile(file)).toString('base64')
  return `@font-face{font-family:Inter;font-weight:100 900;src:url(data:font/woff2;base64,${data}) format('woff2')}`
}

function frame({ title, subtitle, body, source }) {
  return `
  <div class="frame">
    <header><h1>${title}</h1><p>${subtitle}</p></header>
    <main>${body}</main>
    <footer><span>${source}</span><span class="brand">wasscetutor.com</span></footer>
  </div>`
}

const baseCss = `
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;background:${C.surface};font-family:Inter,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased}
  .frame{width:${W}px;height:${H}px;padding:26px 28px 18px;display:flex;flex-direction:column}
  header h1{font-size:25px;line-height:1.15;font-weight:700;letter-spacing:-.02em}
  header p{margin-top:6px;font-size:16px;line-height:1.3;color:${C.muted}}
  main{flex:1;position:relative;margin-top:14px}
  footer{display:flex;justify-content:space-between;gap:16px;font-size:12px;line-height:1.35;color:${C.muted};border-top:1px solid ${C.grid};padding-top:9px}
  footer .brand{font-weight:600;white-space:nowrap}
  .legend{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:15px;color:${C.ink}}
  .legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:7px;vertical-align:-1px}
  .legend b{font-weight:600}
  .legend span.v{color:${C.muted}}
`

// A tall segmented bar: one whole, split into parts, each block 4px corners,
// a 2px surface gap between blocks, its share printed inside when it fits.
function segmentedBar(label, parts) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  const blocks = parts.map((p) => {
    const share = (p.value / total) * 100
    const text = `${share.toFixed(1)}%`
    const fits = share >= 12
    return `<div class="seg" style="flex:${p.value} 1 0;background:${p.color};color:${p.text}">${fits ? text : ''}</div>`
  }).join('')
  const legend = parts.map((p) => {
    const share = (p.value / total) * 100
    return `<span><i style="background:${p.color}"></i>${p.name} <b>${fmt(p.value)}</b>${share < 12 ? ` <span class="v">(${share.toFixed(1)}%)</span>` : ''}</span>`
  }).join('')
  return `
    <section class="row">
      <h2>${label}</h2>
      <div class="bar">${blocks}</div>
      <div class="legend">${legend}</div>
    </section>`
}

const segCss = `
  .row + .row{margin-top:22px}
  .row h2{font-size:15px;font-weight:600;color:${C.ink};margin-bottom:8px}
  .bar{display:flex;gap:2px;height:28px}
  .seg{border-radius:4px;display:flex;align-items:center;padding-left:9px;font-size:14px;font-weight:600;white-space:nowrap;overflow:visible}
  .row .legend{margin-top:10px}
`

function entriesChart() {
  return {
    name: 'wassce-2026-entries',
    width: W,
    height: H,
    css: segCss,
    html: frame({
      title: 'Where the 200,756 entries stand',
      subtitle: '2026 WASSCE school candidates on WAEC’s list to the Ministry',
      body:
        segmentedBar('Every entry on the list', [
          { name: 'Results released', value: 141810, color: C.violet, text: '#fff' },
          { name: 'Withheld', value: 47454, color: C.orange, text: C.ink },
          { name: 'Absent from every paper', value: 11492, color: C.aqua, text: C.ink },
        ]) +
        segmentedBar('Candidates with results released', [
          { name: 'Five credits or more', value: 91122, color: C.violet, text: '#fff' },
          { name: 'Fewer than five', value: 141810 - 91122, color: C.violetLight, text: C.ink },
        ]),
      source: 'Source: Ministry of Basic and Senior Secondary Education, 27 October 2026. Five credits in a single sitting.',
    }),
  }
}

// Slope chart: two series, two years, 2px lines, 8px end dots with a 2px surface ring.
function englishMathsChart() {
  const plot = { x0: 70, x1: 400, y0: 8, y1: 148, max: 70 }
  const y = (v) => plot.y1 - (v / plot.max) * (plot.y1 - plot.y0)
  const series = [
    { name: 'Mathematics', color: C.orange, a: 46.71, b: 62.15 },
    { name: 'English Language', color: C.violet, a: 11.77, b: 9.77 },
  ]
  const grid = [0, 20, 40, 60].map((v) => `
    <line x1="${plot.x0 - 18}" x2="${plot.x1 + 150}" y1="${y(v)}" y2="${y(v)}" stroke="${C.grid}" stroke-width="1"/>
    <text x="${plot.x0 - 26}" y="${y(v) + 5}" text-anchor="end" class="tick">${v}%</text>`).join('')
  const lines = series.map((s) => `
    <line x1="${plot.x0}" x2="${plot.x1}" y1="${y(s.a)}" y2="${y(s.b)}" stroke="${s.color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${plot.x0}" cy="${y(s.a)}" r="5" fill="${s.color}" stroke="${C.surface}" stroke-width="2"/>
    <circle cx="${plot.x1}" cy="${y(s.b)}" r="5" fill="${s.color}" stroke="${C.surface}" stroke-width="2"/>
    <text x="${plot.x0 + 12}" y="${y(s.a) + (s.a > 30 ? -12 : 22)}" class="val">${s.a.toFixed(2)}%</text>
    <text x="${plot.x1 + 14}" y="${y(s.b) - 3}" class="end">${s.name}</text>
    <text x="${plot.x1 + 14}" y="${y(s.b) + 17}" class="val">${s.b.toFixed(2)}%</text>`).join('')
  const axis = `
    <text x="${plot.x0}" y="${plot.y1 + 24}" text-anchor="middle" class="year">2025</text>
    <text x="${plot.x1}" y="${plot.y1 + 24}" text-anchor="middle" class="year">2026</text>`
  return {
    name: 'wassce-2026-english-maths',
    width: W,
    height: H,
    css: `
      svg{position:absolute;inset:26px 0 0 0;overflow:visible}
      .tick{font-size:13px;fill:${C.muted}}
      .year{font-size:15px;font-weight:600;fill:${C.ink}}
      .val{font-size:15px;fill:${C.ink};font-variant-numeric:tabular-nums}
      .end{font-size:15px;font-weight:600;fill:${C.ink}}
      main .legend{position:absolute;top:0;left:0}`,
    html: frame({
      title: 'Maths credits jumped as English credits fell',
      subtitle: 'Share of candidates with a credit (A1 to C6), as announced',
      body: `
        <div class="legend">${series.map((s) => `<span><i style="background:${s.color};border-radius:50%"></i>${s.name}</span>`).join('')}</div>
        <svg width="${W - 56}" height="180" viewBox="0 0 ${W - 56} 180">${grid}${lines}${axis}</svg>`,
      source: 'Source: Ministry of Basic and Senior Secondary Education, results announcements of October 2025 and 27 October 2026.',
    }),
  }
}

// Horizontal bars, one series: 24px thick, 4px rounded data-end, square at the baseline, value at the tip.
function withheldChart() {
  const rows = [
    { year: '2024', value: 27097 },
    { year: '2025', value: 13237 },
    { year: '2026', value: 47454 },
  ]
  const max = 50000
  const track = 400
  const bars = rows.map((r) => `
    <div class="hrow">
      <span class="yr">${r.year}</span>
      <span class="track"><span class="hbar" style="width:${(r.value / max) * track}px"></span><span class="hv">${fmt(r.value)}</span></span>
    </div>`).join('')
  return {
    name: 'wassce-2026-withheld-by-year',
    width: W,
    height: H,
    css: `
      .hrows{display:flex;flex-direction:column;gap:26px;margin-top:18px}
      .hrow{display:flex;align-items:center;gap:16px}
      .yr{width:44px;font-size:16px;font-weight:600}
      .track{display:flex;align-items:center;gap:10px;border-left:1px solid ${C.muted};padding:3px 0;height:30px}
      .hbar{display:block;height:24px;background:${C.orange};border-radius:0 4px 4px 0}
      .hv{font-size:17px;font-weight:600;font-variant-numeric:tabular-nums}
      .note{margin-top:26px;font-size:15px;line-height:1.4;color:${C.muted}}`,
    html: frame({
      title: 'Withheld results more than tripled in a year',
      subtitle: 'Candidates whose results WAEC withheld for suspected malpractice',
      body: `<div class="hrows">${bars}</div>
        <p class="note">Withheld means under investigation, not found guilty.</p>`,
      source: 'Source: Ministry of Basic and Senior Secondary Education, results announcements of October 2025 and 27 October 2026.',
    }),
  }
}

// The results article's cover: a unit chart on the brand's dark surface, one
// dot per ~1,000 entries, in the dark-surface steps of the same three colours
// (validated on #130d2b). Covers are cropped to 16:8 on wide screens, so all of
// the content sits inside the middle 600 x 300 of the 600 x 375 frame.
function coverEntries() {
  const parts = [
    { name: 'results released', value: 141810, dots: 142, color: '#9085e9' },
    { name: 'withheld', value: 47454, dots: 47, color: '#d95926' },
    { name: 'absent from every paper', value: 11492, dots: 11, color: '#199e70' },
  ]
  const dots = parts.flatMap((p) => Array.from({ length: p.dots }, () => `<i style="background:${p.color}"></i>`)).join('')
  return {
    name: '../wassce-2026-results-sierra-leone',
    cover: true,
    width: W,
    height: H,
    css: `
      body{background:#130d2b;color:#fff}
      .cover{position:relative;width:${W}px;height:${H}px;overflow:hidden;padding:50px 34px 44px;display:grid;grid-template-columns:262px 1fr;grid-template-rows:1fr auto;column-gap:30px;row-gap:16px;align-items:center}
      .kicker{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#c4b5fd}
      h1{margin-top:10px;font-size:31px;line-height:1.06;font-weight:800;letter-spacing:-.03em}
      .sub{margin-top:10px;font-size:14px;line-height:1.4;color:rgb(255 255 255 / 72%)}
      .key{margin-top:16px;display:grid;gap:7px;font-size:13.5px;color:rgb(255 255 255 / 88%)}
      .key span{display:flex;align-items:center;gap:8px}
      .key b{font-weight:700;color:#fff;font-variant-numeric:tabular-nums}
      .key i{width:10px;height:10px;border-radius:50%;flex:none}
      .grid{display:grid;grid-template-columns:repeat(20,9px);gap:3px;justify-content:end}
      .grid i{width:9px;height:9px;border-radius:50%}
      .note{grid-column:1/-1;font-size:11px;color:rgb(255 255 255 / 58%);display:flex;justify-content:space-between;gap:12px}`,
    html: `
      <div class="cover">
        <div>
          <p class="kicker">Sierra Leone · WASSCE 2026</p>
          <h1>200,756 entries. Where they stand.</h1>
          <p class="sub">School candidates on WAEC’s list, as announced on 27 October 2026.</p>
          <div class="key">${parts.map((p) => `<span><i style="background:${p.color}"></i><b>${fmt(p.value)}</b> ${p.name}</span>`).join('')}</div>
        </div>
        <div class="grid">${dots}</div>
        <p class="note"><span>Each dot is about 1,000 entries. Figures: MBSSE</span><span>wasscetutor.com</span></p>
      </div>`,
  }
}

const CHARTS = [coverEntries(), entriesChart(), englishMathsChart(), withheldChart()]

await mkdir(OUT, { recursive: true })
const font = await fontCss()
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2 })
for (const chart of CHARTS) {
  await page.setViewportSize({ width: chart.width, height: chart.height })
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${font}${baseCss}${chart.css}</style></head><body>${chart.html}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png' })
  const big = join(OUT, `${chart.name}.webp`)
  const small = join(OUT, `${chart.name}-640.webp`)
  await sharp(png).webp({ quality: 90, effort: 6 }).toFile(big)
  await sharp(png).resize({ width: 640 }).webp({ quality: 88, effort: 6 }).toFile(small)
  // Covers also need the JPEG that link previews (og:image) use.
  if (chart.cover) await sharp(png).flatten({ background: '#130d2b' }).jpeg({ quality: 88, mozjpeg: true }).toFile(join(OUT, `${chart.name}.jpg`))
  console.log(`${big}  ${chart.width * 2}x${chart.height * 2}`)
}
await browser.close()
