// evidence/lib.mjs — shared helpers for the evidence scripts (no runtime dependencies).
import { readFileSync } from 'node:fs'

/**
 * Loads a provenance-headed CSV into Candle[]. Skips `#` comment lines and the column header line.
 * Accepts both `date,close` (index/FX/rate series) and `date,open,high,low,close,volume` (OHLCV) files.
 * For close-only files, open/high/low are set equal to close and volume is left undefined.
 */
export function loadCsv(path) {
  const lines = readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .filter((l) => l.length > 0 && !l.startsWith('#'))
  const [header, ...rows] = lines
  const columns = header.split(',')
  return rows.map((line) => {
    const cols = line.split(',')
    if (columns.length === 2) {
      const close = Number(cols[1])
      return { time: cols[0], open: close, high: close, low: close, close, volume: undefined }
    }
    const [time, open, high, low, close, volume] = cols
    return {
      time,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: volume !== undefined ? Number(volume) : undefined,
    }
  })
}

/** Share (0-100) of `values` for which `predicate` is true. Ignores nothing — caller filters NaN first. */
export function pct(values, predicate) {
  if (values.length === 0) return 0
  const count = values.filter(predicate).length
  return (100 * count) / values.length
}

/** Linear-interpolated quantile (q in [0,1]) of a numeric array, in the style of NumPy's default. */
export function quantile(values, q) {
  const arr = [...values].sort((a, b) => a - b)
  if (arr.length === 0) return NaN
  const pos = (arr.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  return arr[base + 1] !== undefined ? arr[base] + rest * (arr[base + 1] - arr[base]) : arr[base]
}

/** Lengths of consecutive `true` runs in a boolean array, e.g. how long each "RSI > 70" regime lasted. */
export function runs(flags) {
  const lengths = []
  let current = 0
  for (const flag of flags) {
    if (flag) {
      current++
    } else if (current > 0) {
      lengths.push(current)
      current = 0
    }
  }
  if (current > 0) lengths.push(current)
  return lengths
}

const DEFAULT_COLORS = ['#c8923a', '#3dbc72', '#e74c3c']

/**
 * Minimal inline SVG line chart, no external libraries. Draws the last 250 points of one series
 * (a number[]) or up to three series (number[][]) as polylines, with min/max axis labels.
 * Non-finite values (NaN warm-up padding) are dropped before plotting.
 */
export function svgLine(seriesInput, { width = 900, height = 220, colors = DEFAULT_COLORS, labels } = {}) {
  const seriesList = Array.isArray(seriesInput[0]) ? seriesInput : [seriesInput]
  const trimmed = seriesList.map((s) => s.slice(-250).filter((v) => typeof v === 'number' && Number.isFinite(v)))
  const allValues = trimmed.flat()
  const min = allValues.length ? Math.min(...allValues) : 0
  const max = allValues.length ? Math.max(...allValues) : 1
  const range = max - min || 1
  const pad = 32
  const plotW = width - pad * 2
  const plotH = height - pad * 2

  const toPoints = (series) =>
    series
      .map((v, i) => {
        const x = pad + (series.length > 1 ? (i / (series.length - 1)) * plotW : 0)
        const y = pad + plotH - ((v - min) / range) * plotH
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')

  const polylines = trimmed
    .map(
      (series, i) =>
        `<polyline fill="none" stroke="${colors[i % colors.length]}" stroke-width="1.5" points="${toPoints(series)}" />`
    )
    .join('\n  ')

  const legend = labels
    ? labels
        .map(
          (label, i) =>
            `<text x="${pad + i * 120}" y="${height - 6}" fill="${colors[i % colors.length]}" font-size="11" font-family="monospace">${label}</text>`
        )
        .join('\n  ')
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0a0c0f" />
  ${polylines}
  <text x="${pad}" y="${pad - 10}" fill="#8a9aaa" font-size="11" font-family="monospace">max ${max.toFixed(2)}</text>
  <text x="${pad}" y="${height - pad + 16}" fill="#8a9aaa" font-size="11" font-family="monospace">min ${min.toFixed(2)}</text>
  ${legend}
</svg>
`
}
