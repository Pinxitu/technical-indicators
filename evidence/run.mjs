// evidence/run.mjs — generates evidence/out/*.md + *.svg describing indicator BEHAVIOUR only.
// No trading-result figures: shares of bars in zones, run lengths, crossover counts, distributions,
// correlations. Run with `npm run build && npm run evidence`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadCsv, pct, quantile, runs, svgLine } from './lib.mjs'
import * as lib from '../dist/index.js'

const HERE = new URL('.', import.meta.url)
const OUT_DIR = new URL('./out/', HERE)
mkdirSync(fileURLToPath(OUT_DIR), { recursive: true })

const pkg = JSON.parse(readFileSync(new URL('../package.json', HERE), 'utf8'))
const CLOSING = 'This describes how the indicator behaved on this sample; it is not a measure of profitability.'

const round2 = (x) => (Number.isFinite(x) ? Math.round(x * 100) / 100 : x)
const isFin = (v) => Number.isFinite(v)
const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)

function pearson(a, b) {
  const n = Math.min(a.length, b.length)
  const ma = mean(a.slice(0, n))
  const mb = mean(b.slice(0, n))
  let num = 0
  let da = 0
  let db = 0
  for (let i = 0; i < n; i++) {
    const xa = a[i] - ma
    const xb = b[i] - mb
    num += xa * xb
    da += xa * xa
    db += xb * xb
  }
  const denom = Math.sqrt(da * db)
  return denom === 0 ? 0 : num / denom
}

/** Indices where sign(a[i]-b[i]) flips, skipping stretches where either series is non-finite. */
function crossovers(a, b) {
  const idx = []
  let prevSign = null
  for (let i = 0; i < a.length; i++) {
    if (!isFin(a[i]) || !isFin(b[i])) {
      prevSign = null
      continue
    }
    const diff = a[i] - b[i]
    const sign = diff > 0 ? 1 : diff < 0 ? -1 : 0
    if (prevSign !== null && sign !== 0 && sign !== prevSign) idx.push(i)
    if (sign !== 0) prevSign = sign
  }
  return idx
}
const gaps = (idx) => idx.slice(1).map((v, i) => v - idx[i])

/** Run-length segments of a non-zero trend series (0 = undefined warm-up, skipped). */
function segments(trend) {
  const segs = []
  const start = trend.findIndex((v) => v !== 0)
  if (start === -1) return segs
  let curVal = trend[start]
  let curLen = 1
  for (let i = start + 1; i < trend.length; i++) {
    if (trend[i] === curVal) {
      curLen++
    } else {
      segs.push(curLen)
      curVal = trend[i]
      curLen = 1
    }
  }
  segs.push(curLen)
  return segs
}

function histogram(values, min, max, buckets) {
  const size = (max - min) / buckets
  const counts = new Array(buckets).fill(0)
  for (const v of values) {
    let idx = Math.floor((v - min) / size)
    if (idx >= buckets) idx = buckets - 1
    if (idx < 0) idx = 0
    counts[idx]++
  }
  return counts
}

function provenanceHeader(path) {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.startsWith('#'))
    .join('\n')
}

function writeReport(slug, { title, datasetFile, note, body, series, labels }) {
  const svg = svgLine(series, { width: 900, height: 220, labels })
  writeFileSync(fileURLToPath(new URL(`${slug}.svg`, OUT_DIR)), svg)
  const md = `# ${title}

${note ? note + '\n\n' : ''}${body}

## Chart (last 250 bars)

![${title}](./${slug}.svg)

## Dataset

- File: \`data/${datasetFile}\`
- Provenance header:

\`\`\`
${provenanceHeader(new URL(`../data/${datasetFile}`, HERE))}
\`\`\`

- Library version: ${pkg.version}
- Reproduce: \`npm run build && npm run evidence\`

${CLOSING}
`
  writeFileSync(fileURLToPath(new URL(`${slug}.md`, OUT_DIR)), md)
  console.log(slug + '.md', slug + '.svg')
}

// ---------------------------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------------------------
const sp500 = loadCsv(fileURLToPath(new URL('../data/sp500-daily.csv', HERE)))
const btc = loadCsv(fileURLToPath(new URL('../data/btcusdt-1d.csv', HERE)))
const sp500Closes = sp500.map((c) => c.close)
const btcCloses = btc.map((c) => c.close)

// ---------------------------------------------------------------------------------------------
// RSI(14) — on both sp500-daily.csv and btcusdt-1d.csv
// ---------------------------------------------------------------------------------------------
function rsiReport(slug, datasetFile, closes) {
  const r = lib.rsi(closes, { period: 14 })
  const valid = r.filter(isFin)
  const overboughtPct = pct(valid, (v) => v > 70)
  const oversoldPct = pct(valid, (v) => v < 30)
  const overboughtRuns = runs(r.map((v) => isFin(v) && v > 70))
  const oversoldRuns = runs(r.map((v) => isFin(v) && v < 30))
  const hist = histogram(valid, 0, 100, 10)
  const histLines = hist
    .map((count, i) => `| ${i * 10}-${(i + 1) * 10} | ${count} | ${round2((100 * count) / valid.length)}% |`)
    .join('\n')
  const body = `RSI(14) computed on the closing-price series (${valid.length} valid bars after the 14-bar warm-up).

- Bars with RSI > 70 (overbought zone): ${round2(overboughtPct)}%
- Bars with RSI < 30 (oversold zone): ${round2(oversoldPct)}%
- Mean run length of an "RSI > 70" regime: ${round2(mean(overboughtRuns))} bars (${overboughtRuns.length} regimes observed)
- Mean run length of an "RSI < 30" regime: ${round2(mean(oversoldRuns))} bars (${oversoldRuns.length} regimes observed)

### Histogram (10 buckets)

| RSI range | Bars | Share |
|---|---|---|
${histLines}`
  writeReport(slug, { title: `RSI(14) behaviour — ${datasetFile}`, datasetFile, body, series: r })
}
rsiReport('rsi-sp500', 'sp500-daily.csv', sp500Closes)
rsiReport('rsi-btcusdt', 'btcusdt-1d.csv', btcCloses)

// ---------------------------------------------------------------------------------------------
// MACD(12,26,9) — sp500-daily.csv (close-only)
// ---------------------------------------------------------------------------------------------
{
  const { macd, signal } = lib.macd(sp500Closes, { fast: 12, slow: 26, signal: 9 })
  const idx = crossovers(macd, signal)
  const validBars = macd.filter(isFin).length
  const perHundred = (100 * idx.length) / validBars
  const medianGap = quantile(gaps(idx), 0.5)
  const body = `MACD(12,26,9) computed on the closing-price series (${validBars} valid bars).

- Signal-line crossovers: ${idx.length} total, ${round2(perHundred)} per 100 bars
- Median bars between crossovers: ${round2(medianGap)}`
  writeReport('macd', {
    title: 'MACD(12,26,9) behaviour — sp500-daily.csv',
    datasetFile: 'sp500-daily.csv',
    body,
    series: [macd, signal],
    labels: ['macd', 'signal'],
  })
}

// ---------------------------------------------------------------------------------------------
// Bollinger Bands(20,2) — sp500-daily.csv (close-only)
// ---------------------------------------------------------------------------------------------
{
  const { upper, lower, middle } = lib.bollingerBands(sp500Closes, { period: 20, multiplier: 2 })
  const idxValid = sp500Closes.map((_, i) => i).filter((i) => isFin(upper[i]) && isFin(lower[i]))
  const outsideCount = idxValid.filter((i) => sp500Closes[i] > upper[i] || sp500Closes[i] < lower[i]).length
  const outsidePct = (100 * outsideCount) / idxValid.length
  const body = `Bollinger Bands(20, 2σ) computed on the closing-price series (${idxValid.length} valid bars).

- Closes outside the bands (above upper or below lower): ${round2(outsidePct)}%
- Theoretical figure for a **normal distribution** at ±2σ: **4.6%** (this is the textbook value under a
  normality assumption, not an observation from this sample — it is cited here only for comparison)`
  writeReport('bollinger', {
    title: 'Bollinger Bands(20,2) behaviour — sp500-daily.csv',
    datasetFile: 'sp500-daily.csv',
    body,
    series: [sp500Closes, upper, lower],
    labels: ['close', 'upper', 'lower'],
  })
}

// ---------------------------------------------------------------------------------------------
// SMA(50) / EMA(20) — sp500-daily.csv (close-only): crossover behaviour of price vs. the average
// ---------------------------------------------------------------------------------------------
function maReport(slug, name, maArr, closes, datasetFile) {
  const idxValid = closes.map((_, i) => i).filter((i) => isFin(maArr[i]))
  const abovePct = pct(idxValid, (i) => closes[i] > maArr[i])
  const idxCross = crossovers(closes, maArr)
  const validBars = idxValid.length
  const perHundred = (100 * idxCross.length) / validBars
  const medianGap = quantile(gaps(idxCross), 0.5)
  const aboveRuns = runs(closes.map((v, i) => isFin(maArr[i]) && v > maArr[i]))
  const body = `Close price vs. ${name} on the closing-price series (${validBars} valid bars).

- Bars with close above ${name}: ${round2(abovePct)}%
- Crossovers (close crossing ${name}): ${idxCross.length} total, ${round2(perHundred)} per 100 bars
- Median bars between crossovers: ${round2(medianGap)}
- Mean run length of a "close above ${name}" regime: ${round2(mean(aboveRuns))} bars (${aboveRuns.length} regimes observed)`
  writeReport(slug, {
    title: `${name} behaviour — ${datasetFile}`,
    datasetFile,
    body,
    series: [closes, maArr],
    labels: ['close', name],
  })
}
maReport('sma', 'SMA(50)', lib.sma(sp500Closes, { period: 50 }), sp500Closes, 'sp500-daily.csv')
maReport('ema', 'EMA(20)', lib.ema(sp500Closes, { period: 20 }), sp500Closes, 'sp500-daily.csv')

// ---------------------------------------------------------------------------------------------
// The remaining indicators need OHLC(V) — run on btcusdt-1d.csv, noted explicitly in each report.
// ---------------------------------------------------------------------------------------------
const OHLC_NOTE = '_This indicator needs open/high/low data, so it is evaluated on `btcusdt-1d.csv` only (the FRED series in this repo are close-only)._'
const OHLCV_NOTE = '_This indicator needs volume data, so it is evaluated on `btcusdt-1d.csv` only (the only OHLCV dataset with sufficient depth here)._'

// ATR(14)/close ratio distribution
{
  const atrArr = lib.atr(btc, { period: 14 })
  const ratios = btc.map((c, i) => (isFin(atrArr[i]) ? atrArr[i] / c.close : NaN)).filter(isFin)
  const body = `ATR(14) / close ratio on ${ratios.length} valid bars.

- Median: ${round2(100 * quantile(ratios, 0.5))}%
- p10: ${round2(100 * quantile(ratios, 0.1))}%
- p90: ${round2(100 * quantile(ratios, 0.9))}%`
  writeReport('atr', { title: 'ATR(14) behaviour — btcusdt-1d.csv', datasetFile: 'btcusdt-1d.csv', note: OHLC_NOTE, body, series: ratios })
}

// ADX(14) > 25 share
{
  const { adx } = lib.adx(btc, { period: 14 })
  const valid = adx.filter(isFin)
  const body = `ADX(14) on ${valid.length} valid bars.

- Bars with ADX > 25 (conventionally read as a trending market): ${round2(pct(valid, (v) => v > 25))}%`
  writeReport('adx', { title: 'ADX(14) behaviour — btcusdt-1d.csv', datasetFile: 'btcusdt-1d.csv', note: OHLC_NOTE, body, series: adx })
}

// Stochastic(14,3,3) overbought/oversold shares
{
  const { k, d } = lib.stochastic(btc, { kPeriod: 14, kSmooth: 3, dPeriod: 3 })
  const validK = k.filter(isFin)
  const body = `Stochastic Oscillator(14,3,3), slow %K, on ${validK.length} valid bars.

- Bars with %K > 80 (overbought zone): ${round2(pct(validK, (v) => v > 80))}%
- Bars with %K < 20 (oversold zone): ${round2(pct(validK, (v) => v < 20))}%`
  writeReport('stochastic', {
    title: 'Stochastic Oscillator(14,3,3) behaviour — btcusdt-1d.csv',
    datasetFile: 'btcusdt-1d.csv',
    note: OHLC_NOTE,
    body,
    series: [k, d],
    labels: ['%K', '%D'],
  })
}

// Williams %R(14) overbought/oversold shares
{
  const wr = lib.williamsR(btc, { period: 14 })
  const valid = wr.filter(isFin)
  const body = `Williams %R(14) on ${valid.length} valid bars.

- Bars with %R > -20 (overbought zone): ${round2(pct(valid, (v) => v > -20))}%
- Bars with %R < -80 (oversold zone): ${round2(pct(valid, (v) => v < -80))}%`
  writeReport('williams-r', { title: 'Williams %R(14) behaviour — btcusdt-1d.csv', datasetFile: 'btcusdt-1d.csv', note: OHLC_NOTE, body, series: wr })
}

// CCI(20) overbought/oversold shares
{
  const cciArr = lib.cci(btc, { period: 20 })
  const valid = cciArr.filter(isFin)
  const body = `CCI(20) on ${valid.length} valid bars.

- Bars with CCI > 100 (overbought zone): ${round2(pct(valid, (v) => v > 100))}%
- Bars with CCI < -100 (oversold zone): ${round2(pct(valid, (v) => v < -100))}%`
  writeReport('cci', { title: 'CCI(20) behaviour — btcusdt-1d.csv', datasetFile: 'btcusdt-1d.csv', note: OHLC_NOTE, body, series: cciArr })
}

// Parabolic SAR — trend flips
{
  const { sar, trend } = lib.parabolicSar(btc)
  const segs = segments(trend)
  const flips = Math.max(0, segs.length - 1)
  const consideredBars = segs.reduce((a, b) => a + b, 0)
  const body = `Parabolic SAR default settings on ${consideredBars} bars with an established trend.

- Trend flips: ${flips} total, ${round2((100 * flips) / consideredBars)} per 100 bars
- Median trend-segment duration: ${round2(quantile(segs, 0.5))} bars`
  writeReport('parabolic-sar', {
    title: 'Parabolic SAR behaviour — btcusdt-1d.csv',
    datasetFile: 'btcusdt-1d.csv',
    note: OHLC_NOTE,
    body,
    series: [btcCloses, sar],
    labels: ['close', 'sar'],
  })
}

// SuperTrend — trend flips
{
  const { supertrend, trend } = lib.supertrend(btc)
  const segs = segments(trend)
  const flips = Math.max(0, segs.length - 1)
  const consideredBars = segs.reduce((a, b) => a + b, 0)
  const body = `SuperTrend default settings on ${consideredBars} bars with an established trend.

- Trend flips: ${flips} total, ${round2((100 * flips) / consideredBars)} per 100 bars
- Median trend-segment duration: ${round2(quantile(segs, 0.5))} bars`
  writeReport('supertrend', {
    title: 'SuperTrend behaviour — btcusdt-1d.csv',
    datasetFile: 'btcusdt-1d.csv',
    note: OHLC_NOTE,
    body,
    series: [btcCloses, supertrend],
    labels: ['close', 'supertrend'],
  })
}

// Ichimoku — position relative to the cloud
{
  const { senkouA, senkouB } = lib.ichimoku(btc)
  const idxValid = btcCloses.map((_, i) => i).filter((i) => isFin(senkouA[i]) && isFin(senkouB[i]))
  const above = idxValid.filter((i) => btcCloses[i] > Math.max(senkouA[i], senkouB[i])).length
  const below = idxValid.filter((i) => btcCloses[i] < Math.min(senkouA[i], senkouB[i])).length
  const inside = idxValid.length - above - below
  const body = `Ichimoku Kinko Hyo default settings, close vs. cloud (Senkou A/B), on ${idxValid.length} valid bars.

- Bars with close above the cloud: ${round2((100 * above) / idxValid.length)}%
- Bars with close inside the cloud: ${round2((100 * inside) / idxValid.length)}%
- Bars with close below the cloud: ${round2((100 * below) / idxValid.length)}%`
  writeReport('ichimoku', {
    title: 'Ichimoku Kinko Hyo behaviour — btcusdt-1d.csv',
    datasetFile: 'btcusdt-1d.csv',
    note: OHLC_NOTE,
    body,
    series: [btcCloses, senkouA, senkouB],
    labels: ['close', 'senkouA', 'senkouB'],
  })
}

// OBV — correlation between OBV changes and close changes (needs volume)
{
  const obvArr = lib.obv(btc)
  const obvDiffs = obvArr.slice(1).map((v, i) => v - obvArr[i])
  const closeDiffs = btcCloses.slice(1).map((v, i) => v - btcCloses[i])
  const r = pearson(obvDiffs, closeDiffs)
  const body = `On-Balance Volume on ${obvArr.length} bars.

- Pearson correlation between bar-to-bar OBV changes and bar-to-bar close changes: ${round2(r)}
  (OBV adds/subtracts the full bar volume on an up/down close, so a strong positive correlation with
  the direction of price change is expected by construction, not a predictive signal)`
  writeReport('obv', { title: 'OBV behaviour — btcusdt-1d.csv', datasetFile: 'btcusdt-1d.csv', note: OHLCV_NOTE, body, series: obvArr })
}

// VWAP — % of closes above VWAP anchored every 30 bars (needs volume)
{
  const vwapArr = lib.vwap(btc, { anchorEvery: 30 })
  const idxValid = btcCloses.map((_, i) => i).filter((i) => isFin(vwapArr[i]))
  const abovePct = pct(idxValid, (i) => btcCloses[i] > vwapArr[i])
  const body = `VWAP anchored every 30 bars, on ${idxValid.length} valid bars.

- Bars with close above VWAP: ${round2(abovePct)}%`
  writeReport('vwap', {
    title: 'VWAP (anchor every 30 bars) behaviour — btcusdt-1d.csv',
    datasetFile: 'btcusdt-1d.csv',
    note: OHLCV_NOTE,
    body,
    series: [btcCloses, vwapArr],
    labels: ['close', 'vwap'],
  })
}

console.log('done')
