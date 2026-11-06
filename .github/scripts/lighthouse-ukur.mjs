// Lighthouse against production, every template — F4-06 "Ukur di perangkat
// nyata", the lab half. Run by `.github/workflows/lighthouse-ukur.yml`;
// `docs/F4-06-UKUR.md` reads what it writes.
//
//   node lighthouse-ukur.mjs measure <variant> <out-dir>
//   node lighthouse-ukur.mjs summarise <dir> <summary.md> <summary.json>
//
// `measure` runs the Lighthouse CLI named by $LIGHTHOUSE_BIN against $SITE,
// $RUNS times per page, one run of every page before the next run of any,
// so a slow minute on the runner or the CDN lands on one run of each page
// rather than on every run of one. `summarise` keeps the median per metric
// and names, for the median run, what the LCP was and what Lighthouse would
// fix first.
//
// Lab numbers only. Lighthouse's navigation mode has no INP; TBT is reported
// as its lab proxy, and the summary says so (CLAUDE.md #19).
//
// Original work for this project; no third-party code copied.

import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/** The templates F4-06 names, one page each. Checked 200 on 2026-11-06. */
const PAGES = [
  { slug: 'beranda', template: 'Beranda', path: '/id' },
  { slug: 'unit', template: 'Unit', path: '/id/konstruksi' },
  { slug: 'sisi', template: 'Sisi', path: '/id/konstruksi/pelaku-proyek' },
  {
    slug: 'bab',
    template: 'Bab',
    path: '/id/konstruksi/pelaku-proyek/hulu-hilir',
  },
  {
    slug: 'offer',
    template: 'Offer',
    path: '/id/teknologi/siap-pakai/kuliner/bot-pesan-antar-whatsapp',
  },
  { slug: 'jaringan', template: 'Sisi jaringan', path: '/id/peekabo/jaringan' },
  { slug: 'layanan', template: '/layanan', path: '/id/layanan' },
  { slug: 'metode', template: '/metode', path: '/id/metode' },
  { slug: 'pembayaran', template: '/pembayaran', path: '/id/pembayaran' },
  { slug: 'kebijakan', template: '/kebijakan', path: '/id/kebijakan' },
  { slug: 'kontak', template: '/kontak', path: '/id/kontak' },
  { slug: 'work', template: '/work', path: '/id/work' },
  {
    slug: 'work-detail',
    template: '/work/<slug>',
    path: '/id/work/arus-balik',
  },
]

/** The three routes that mount the WebGL root (docs/F4-04-WEBGL.md). */
const WEBGL_PAGES = new Set(['beranda', 'work', 'work-detail'])

/**
 * What each variant measures.
 *
 * - `mobile`: Lighthouse's default, a phone-sized screen under simulated
 *   throttling (150 ms RTT, 1.6 Mbps, CPU 4x). At that width the site mounts
 *   no WebGL on any page (`lib/hooks/use-device-detection.ts`).
 * - `desktop`: `--preset=desktop`, with WebGL switched off in the browser,
 *   so the three WebGL routes are measured on the path a desktop without
 *   WebGL takes, and no number depends on whether this runner's Chrome
 *   happens to offer software WebGL.
 * - `desktop-webgl`: the three WebGL routes again, with SwiftShader allowed,
 *   so the canvas mounts and three.js is fetched and run. The GPU is
 *   software, so main-thread time on these runs is an upper bound.
 */
const VARIANTS = {
  mobile: { pages: PAGES, flags: [], chrome: [] },
  desktop: {
    pages: PAGES,
    flags: ['--preset=desktop'],
    chrome: ['--disable-webgl'],
  },
  'desktop-webgl': {
    pages: PAGES.filter((page) => WEBGL_PAGES.has(page.slug)),
    flags: ['--preset=desktop'],
    chrome: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  },
}

/** The "good" thresholds F4-06 names. TBT stands in for INP in the lab. */
const GOOD = { lcp: 2500, cls: 0.1, tbt: 200 }

/**
 * One plain request per page before any run, so no run pays for a cache
 * entry the CDN has not built yet, and so a page that redirects or fails is
 * known before it is measured. What the CDN said is kept with the results.
 */
async function warm(site, pages, outDir, variantName) {
  const answers = []
  for (const page of pages) {
    const response = await fetch(`${site}${page.path}`, { redirect: 'manual' })
    await response.arrayBuffer()
    const answer = {
      path: page.path,
      status: response.status,
      cache: response.headers.get('x-vercel-cache'),
      age: response.headers.get('age'),
    }
    answers.push(answer)
    console.log(
      `warm ${answer.path}: ${answer.status} x-vercel-cache=${answer.cache} age=${answer.age}`
    )
  }
  writeFileSync(
    path.join(outDir, `${variantName}__warm.json`),
    `${JSON.stringify(answers, null, 2)}\n`
  )
}

async function measure(variantName, outDir) {
  const variant = VARIANTS[variantName]
  if (!variant) throw new Error(`unknown variant ${variantName}`)
  const site = (process.env.SITE ?? '').replace(/\/$/u, '')
  const runs = Number(process.env.RUNS ?? '3')
  const bin = process.env.LIGHTHOUSE_BIN
  if (!site || !bin || !(runs >= 1)) {
    throw new Error('SITE, RUNS and LIGHTHOUSE_BIN must be set')
  }
  mkdirSync(outDir, { recursive: true })
  await warm(site, variant.pages, outDir, variantName)

  const chromeFlags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    ...variant.chrome,
  ].join(' ')

  const failures = []
  for (let run = 1; run <= runs; run += 1) {
    for (const page of variant.pages) {
      const file = path.join(
        outDir,
        `${variantName}__${page.slug}__${run}.json`
      )
      const started = Date.now()
      const result = spawnSync(
        bin,
        [
          `${site}${page.path}`,
          '--output=json',
          `--output-path=${file}`,
          '--only-categories=performance',
          '--quiet',
          `--chrome-flags=${chromeFlags}`,
          ...variant.flags,
        ],
        { stdio: ['ignore', 'inherit', 'inherit'], timeout: 180_000 }
      )
      const seconds = ((Date.now() - started) / 1000).toFixed(1)
      if (result.status !== 0) {
        failures.push(`${page.slug} run ${run}: exit ${result.status}`)
      }
      console.log(
        `${variantName} run ${run} ${page.path}: exit ${result.status} in ${seconds}s`
      )
    }
  }
  writeFileSync(
    path.join(outDir, `${variantName}__failures.json`),
    `${JSON.stringify(failures, null, 2)}\n`
  )
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

/** The first node a Lighthouse details tree names, wherever it sits. */
function findNode(details) {
  if (!details || typeof details !== 'object') return null
  if (details.type === 'node' && (details.selector || details.snippet)) {
    return details
  }
  for (const value of Object.values(details)) {
    const found = findNode(value)
    if (found) return found
  }
  return null
}

/** Rows of a details tree that carry a duration: LCP's subparts. */
function findPhases(details, out = []) {
  if (!details || typeof details !== 'object') return out
  const label = details.label ?? details.subpart ?? details.phase
  const ms = details.duration ?? details.timing
  if (typeof label === 'string' && typeof ms === 'number') {
    out.push({ label, ms: Math.round(ms) })
    return out
  }
  for (const value of Object.values(details)) findPhases(value, out)
  return out
}

/** Elements Lighthouse blames for layout shift, with their score. */
function findShifts(details, out = []) {
  if (!details || typeof details !== 'object') return out
  if (typeof details.score === 'number' && details.node) {
    out.push({
      node: details.node.nodeLabel ?? details.node.selector ?? '?',
      score: Number(details.score.toFixed(4)),
    })
    return out
  }
  for (const value of Object.values(details)) findShifts(value, out)
  return out
}

function readRun(file) {
  const lhr = JSON.parse(readFileSync(file, 'utf8'))
  const audit = (id) => lhr.audits?.[id]
  const value = (id) => audit(id)?.numericValue
  const lcp = value('largest-contentful-paint')
  if (lhr.runtimeError || typeof lcp !== 'number') {
    return { ok: false, error: lhr.runtimeError?.code ?? 'no LCP' }
  }

  const lcpAudits = [
    'largest-contentful-paint-element',
    'lcp-breakdown-insight',
    'lcp-discovery-insight',
  ]
    .map(audit)
    .filter(Boolean)
  const lcpNode = lcpAudits.map((a) => findNode(a.details)).find(Boolean)
  const phases = lcpAudits.flatMap((a) => findPhases(a.details))
  const shifts = [
    'cls-culprits-insight',
    'layout-shifts',
    'layout-shift-elements',
  ]
    .map(audit)
    .filter(Boolean)
    .flatMap((a) => findShifts(a.details))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const requests = audit('network-requests')?.details?.items ?? []
  const scriptKB = Math.round(
    requests
      .filter((item) => item.resourceType === 'Script')
      .reduce((sum, item) => sum + (item.transferSize ?? 0), 0) / 1024
  )

  const refs = lhr.categories?.performance?.auditRefs ?? []
  const issues = refs
    .map((ref) => audit(ref.id))
    .filter(
      (a) =>
        a &&
        typeof a.score === 'number' &&
        a.score < 0.9 &&
        ![
          'largest-contentful-paint',
          'cumulative-layout-shift',
          'total-blocking-time',
          'first-contentful-paint',
          'speed-index',
          'interactive',
        ].includes(a.id)
    )
    .map((a) => ({
      id: a.id,
      title: a.title,
      display: a.displayValue ?? '',
      savings: a.metricSavings ?? {},
    }))
    .sort(
      (a, b) =>
        (b.savings.LCP ?? 0) +
        (b.savings.TBT ?? 0) -
        ((a.savings.LCP ?? 0) + (a.savings.TBT ?? 0))
    )
    .slice(0, 6)

  return {
    ok: true,
    lcp,
    cls: value('cumulative-layout-shift'),
    tbt: value('total-blocking-time'),
    fcp: value('first-contentful-paint'),
    si: value('speed-index'),
    score: lhr.categories?.performance?.score,
    scriptKB,
    lcpNode: lcpNode
      ? {
          label: lcpNode.nodeLabel ?? '',
          selector: lcpNode.selector ?? '',
          snippet: (lcpNode.snippet ?? '').slice(0, 160),
        }
      : null,
    phases,
    shifts,
    issues,
    finalUrl: lhr.finalDisplayedUrl ?? lhr.finalUrl,
    env: {
      lighthouse: lhr.lighthouseVersion,
      benchmarkIndex: lhr.environment?.benchmarkIndex,
      hostUserAgent: lhr.environment?.hostUserAgent,
      formFactor: lhr.configSettings?.formFactor,
      throttlingMethod: lhr.configSettings?.throttlingMethod,
      throttling: lhr.configSettings?.throttling,
      screen: lhr.configSettings?.screenEmulation,
    },
    warnings: lhr.runWarnings ?? [],
  }
}

const fmtSeconds = (ms) => (ms == null ? '—' : (ms / 1000).toFixed(2))
const fmtMs = (ms) => (ms == null ? '—' : String(Math.round(ms)))
const fmtCls = (cls) => (cls == null ? '—' : cls.toFixed(3))

function summarise(dir, mdFile, jsonFile) {
  const files = readdirSync(dir, { recursive: true })
    .map(String)
    .filter((name) => /__\d+\.json$/u.test(name))
  const groups = new Map()
  for (const name of files) {
    const [variant, slug, runText] = path.basename(name, '.json').split('__')
    const key = `${variant}__${slug}`
    if (!groups.has(key)) groups.set(key, { variant, slug, runs: [] })
    groups
      .get(key)
      .runs.push({ run: Number(runText), ...readRun(path.join(dir, name)) })
  }

  const results = []
  for (const [variantName, variant] of Object.entries(VARIANTS)) {
    for (const page of variant.pages) {
      const group = groups.get(`${variantName}__${page.slug}`)
      const runs = group?.runs ?? []
      const ok = runs.filter((run) => run.ok)
      const metric = (key) => median(ok.map((run) => run[key]))
      const range = (key) =>
        ok.length > 0
          ? [
              Math.min(...ok.map((run) => run[key])),
              Math.max(...ok.map((run) => run[key])),
            ]
          : null
      const lcp = metric('lcp')
      const representative = [...ok].sort(
        (a, b) => Math.abs(a.lcp - lcp) - Math.abs(b.lcp - lcp)
      )[0]
      const result = {
        variant: variantName,
        ...page,
        runs: runs.length,
        failed: runs.filter((run) => !run.ok).map((run) => run.error),
        lcp,
        lcpRange: range('lcp'),
        cls: metric('cls'),
        clsRange: range('cls'),
        tbt: metric('tbt'),
        tbtRange: range('tbt'),
        fcp: metric('fcp'),
        si: metric('si'),
        score: metric('score'),
        scriptKB: metric('scriptKB'),
        representative: representative
          ? {
              run: representative.run,
              lcpNode: representative.lcpNode,
              phases: representative.phases,
              shifts: representative.shifts,
              issues: representative.issues,
              finalUrl: representative.finalUrl,
              warnings: representative.warnings,
            }
          : null,
        env: representative?.env ?? null,
        benchmarkIndex: median(
          ok.map((run) => run.env.benchmarkIndex).filter(Number.isFinite)
        ),
      }
      result.above = [
        result.lcp > GOOD.lcp ? 'LCP' : null,
        result.cls > GOOD.cls ? 'CLS' : null,
        result.tbt > GOOD.tbt ? 'TBT' : null,
      ].filter(Boolean)
      results.push(result)
    }
  }

  const lines = []
  const env = results.find((result) => result.env)?.env
  lines.push(`# Lighthouse ${env?.lighthouse ?? '?'} — produksi`)
  lines.push('')
  lines.push(
    `Situs: ${process.env.SITE ?? '?'}. Median dari ${process.env.RUNS ?? '?'} run per halaman per varian. Angka lab, bukan lapangan: Lighthouse mode navigasi tidak punya INP, jadi TBT dipakai sebagai proksi lab.`
  )
  lines.push('')
  lines.push(
    `Ambang "baik": LCP ${GOOD.lcp / 1000} s, CLS ${GOOD.cls}, TBT ${GOOD.tbt} ms.`
  )
  for (const variantName of Object.keys(VARIANTS)) {
    const rows = results.filter((result) => result.variant === variantName)
    const sample = rows.find((row) => row.env)?.env
    const bench = median(rows.map((row) => row.benchmarkIndex).filter(Boolean))
    lines.push('')
    lines.push(`## ${variantName}`)
    lines.push('')
    if (sample) {
      const t = sample.throttling ?? {}
      const s = sample.screen ?? {}
      lines.push(
        `${sample.formFactor}, throttling ${sample.throttlingMethod} (RTT ${t.rttMs} ms, ${t.throughputKbps} kbps, CPU ${t.cpuSlowdownMultiplier}×), layar ${s.width}×${s.height} @${s.deviceScaleFactor}. benchmarkIndex runner (median): ${bench == null ? '?' : Math.round(bench)}.`
      )
      lines.push('')
    }
    lines.push(
      '| Template | Halaman | LCP s (rentang) | CLS (rentang) | TBT ms (rentang) | FCP s | Skor | JS KB | Di atas "baik" |'
    )
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |')
    for (const row of rows) {
      const lcpRange = row.lcpRange
        ? ` (${fmtSeconds(row.lcpRange[0])}–${fmtSeconds(row.lcpRange[1])})`
        : ''
      const clsRange = row.clsRange
        ? ` (${fmtCls(row.clsRange[0])}–${fmtCls(row.clsRange[1])})`
        : ''
      const tbtRange = row.tbtRange
        ? ` (${fmtMs(row.tbtRange[0])}–${fmtMs(row.tbtRange[1])})`
        : ''
      const failed =
        row.failed.length > 0 ? ` (gagal: ${row.failed.join(', ')})` : ''
      lines.push(
        `| ${row.template} | \`${row.path}\` | ${fmtSeconds(row.lcp)}${lcpRange} | ${fmtCls(row.cls)}${clsRange} | ${fmtMs(row.tbt)}${tbtRange} | ${fmtSeconds(row.fcp)} | ${row.score == null ? '—' : Math.round(row.score * 100)} | ${row.scriptKB ?? '—'} | ${row.above.join(', ') || '—'}${failed} |`
      )
    }
    lines.push('')
    lines.push(`### ${variantName}: run median per halaman`)
    for (const row of rows) {
      const rep = row.representative
      if (!rep) continue
      lines.push('')
      lines.push(`- **${row.template}** \`${row.path}\` (run ${rep.run})`)
      if (rep.lcpNode) {
        lines.push(
          `  - Elemen LCP: ${rep.lcpNode.label || '(tanpa label)'} — \`${rep.lcpNode.selector}\``
        )
      }
      if (rep.phases.length > 0) {
        lines.push(
          `  - Fase LCP: ${rep.phases.map((phase) => `${phase.label} ${phase.ms} ms`).join(', ')}`
        )
      }
      if (rep.shifts.length > 0) {
        lines.push(
          `  - Pergeseran: ${rep.shifts.map((shift) => `${shift.node} (${shift.score})`).join('; ')}`
        )
      }
      for (const issue of rep.issues) {
        const savings = Object.entries(issue.savings)
          .filter(([, amount]) => amount > 0)
          .map(
            ([metric, amount]) =>
              `${metric} ${Math.round(amount * 1000) / 1000}`
          )
          .join(', ')
        lines.push(
          `  - ${issue.title}${issue.display ? ` — ${issue.display}` : ''}${savings ? ` (hemat ${savings})` : ''}`
        )
      }
      if (rep.finalUrl && !rep.finalUrl.endsWith(row.path)) {
        lines.push(`  - Berakhir di ${rep.finalUrl}`)
      }
      for (const warning of rep.warnings)
        lines.push(`  - Peringatan: ${warning}`)
    }
  }
  writeFileSync(mdFile, `${lines.join('\n')}\n`)
  writeFileSync(
    jsonFile,
    `${JSON.stringify({ site: process.env.SITE, runs: process.env.RUNS, good: GOOD, results }, null, 2)}\n`
  )
}

const [mode, ...rest] = process.argv.slice(2)
if (mode === 'measure') await measure(rest[0], rest[1])
else if (mode === 'summarise') summarise(rest[0], rest[1], rest[2])
else {
  console.error(
    'usage: measure <variant> <out-dir> | summarise <dir> <md> <json>'
  )
  process.exit(2)
}
