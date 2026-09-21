// scripts/fetch-data.mjs — regenerates data/*.csv from public sources (no API keys).
import { writeFileSync, mkdirSync } from 'node:fs'
mkdirSync('data', { recursive: true })
mkdirSync('data/local', { recursive: true })
const today = new Date().toISOString().slice(0, 10)
const header = (source, url, license) => `# source: ${source}\n# url: ${url}\n# downloaded_at: ${today}\n# license: ${license}\n`

const FRED_ROW = /^\d{4}-\d\d-\d\d,-?[\d.]+$/

const fredCitation = (id) =>
  `Public domain (U.S. federal government work: Board of Governors of the Federal Reserve System / ` +
  `U.S. Energy Information Administration); cite FRED, Federal Reserve Bank of St. Louis, series ${id} — ` +
  `https://fred.stlouisfed.org/legal/`

async function fred(id, file, note, license, dir = 'data') {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  const txt = await res.text()
  // FRED marks a missing observation either as "DATE,." or, for some series/dates, as "DATE," with an
  // empty value (no dot) — both are dropped by only keeping rows that match a plain "date,number" shape.
  const rows = txt
    .trim()
    .split('\n')
    .slice(1)
    .filter((l) => FRED_ROW.test(l))
  writeFileSync(`${dir}/${file}`, header(`FRED, Federal Reserve Bank of St. Louis (${note})`, url, license) + 'date,close\n' + rows.join('\n') + '\n')
  console.log(`${dir}/${file}`, rows.length, 'rows')
}
async function binance(symbol, interval, file) {
  const url = `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${symbol} ${interval}: HTTP ${res.status}`)
  const k = await res.json()
  if (!Array.isArray(k)) throw new Error(`${symbol} ${interval}: unexpected response shape (expected an array of klines)`)
  const rows = k.map((r) => `${new Date(r[0]).toISOString().slice(0, interval === '1d' ? 10 : 16)},${r[1]},${r[2]},${r[3]},${r[4]},${r[5]}`)
  writeFileSync(`data/${file}`, header(`Binance public market data (${symbol} ${interval})`, url, 'Public API; data provided as-is by Binance') + 'date,open,high,low,close,volume\n' + rows.join('\n') + '\n')
  console.log(file, rows.length, 'rows')
}

// The next four series are tagged by FRED as "Copyrighted: Pre-Approval Required" — S&P Dow Jones
// Indices / Nasdaq / Cboe hold the copyright and prohibit reproduction in any form without a licence.
// They are fetched here only so the evidence reports can be reproduced locally; they are written to
// data/local/ (gitignored — see .gitignore) and are never committed. See data/PROVENANCE.md.
await fred('SP500', 'sp500-daily.csv', 'S&P 500 index, daily close, last 10 years', 'Copyrighted by S&P Dow Jones Indices LLC; reproduction prohibited without permission; not redistributed', 'data/local')
await fred('NASDAQCOM', 'nasdaq-daily.csv', 'NASDAQ Composite', 'Copyrighted by Nasdaq, Inc.; reproduction prohibited without permission; not redistributed', 'data/local')
await fred('DJIA', 'djia-daily.csv', 'Dow Jones Industrial Average', 'Copyrighted by S&P Dow Jones Indices LLC; reproduction prohibited without permission; not redistributed', 'data/local')
await fred('DEXUSEU', 'eurusd-daily.csv', 'US Dollars per Euro, noon buying rates NY', fredCitation('DEXUSEU'))
await fred('DEXJPUS', 'usdjpy-daily.csv', 'Japanese Yen per US Dollar', fredCitation('DEXJPUS'))
await fred('DEXUSUK', 'gbpusd-daily.csv', 'US Dollars per British Pound', fredCitation('DEXUSUK'))
await fred('DCOILWTICO', 'wti-daily.csv', 'WTI crude spot, Cushing', fredCitation('DCOILWTICO'))
await fred('DGS10', 'us10y-daily.csv', '10-year Treasury constant maturity', fredCitation('DGS10'))
await fred('VIXCLS', 'vix-daily.csv', 'CBOE Volatility Index', 'Copyrighted by Cboe Global Markets, Inc.; reproduction prohibited without permission; not redistributed', 'data/local')
await binance('BTCUSDT', '1d', 'btcusdt-1d.csv')
await binance('ETHUSDT', '1d', 'ethusdt-1d.csv')
await binance('BTCUSDT', '4h', 'btcusdt-4h.csv')
