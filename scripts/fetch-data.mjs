// scripts/fetch-data.mjs — regenerates data/*.csv from public sources (no API keys).
import { writeFileSync, mkdirSync } from 'node:fs'
mkdirSync('data', { recursive: true })
const today = new Date().toISOString().slice(0, 10)
const header = (source, url, license) => `# source: ${source}\n# url: ${url}\n# downloaded_at: ${today}\n# license: ${license}\n`

async function fred(id, file, note) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`
  const txt = await (await fetch(url)).text()
  // FRED marks a missing observation either as "DATE,." or, for some series/dates, as "DATE," with an
  // empty value (no dot) — both must be dropped, or the empty field parses to 0 downstream.
  const rows = txt.trim().split('\n').slice(1).filter((l) => { const v = l.slice(l.indexOf(',') + 1); return v !== '.' && v !== '' }).map((l) => l.replace(/^(\S+),(\S+)$/, '$1,$2'))
  writeFileSync(`data/${file}`, header(`FRED, Federal Reserve Bank of St. Louis (${note})`, url, 'Free use with attribution; see https://fred.stlouisfed.org/legal/') + 'date,close\n' + rows.join('\n') + '\n')
  console.log(file, rows.length, 'rows')
}
async function binance(symbol, interval, file) {
  const url = `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
  const k = await (await fetch(url)).json()
  const rows = k.map((r) => `${new Date(r[0]).toISOString().slice(0, interval === '1d' ? 10 : 16)},${r[1]},${r[2]},${r[3]},${r[4]},${r[5]}`)
  writeFileSync(`data/${file}`, header(`Binance public market data (${symbol} ${interval})`, url, 'Public API; data provided as-is by Binance') + 'date,open,high,low,close,volume\n' + rows.join('\n') + '\n')
  console.log(file, rows.length, 'rows')
}
await fred('SP500', 'sp500-daily.csv', 'S&P 500 index, daily close, last 10 years per S&P licence')
await fred('NASDAQCOM', 'nasdaq-daily.csv', 'NASDAQ Composite')
await fred('DJIA', 'djia-daily.csv', 'Dow Jones Industrial Average')
await fred('DEXUSEU', 'eurusd-daily.csv', 'US Dollars per Euro, noon buying rates NY')
await fred('DEXJPUS', 'usdjpy-daily.csv', 'Japanese Yen per US Dollar')
await fred('DEXUSUK', 'gbpusd-daily.csv', 'US Dollars per British Pound')
await fred('DCOILWTICO', 'wti-daily.csv', 'WTI crude spot, Cushing')
await fred('DGS10', 'us10y-daily.csv', '10-year Treasury constant maturity')
await fred('VIXCLS', 'vix-daily.csv', 'CBOE Volatility Index')
await binance('BTCUSDT', '1d', 'btcusdt-1d.csv')
await binance('ETHUSDT', '1d', 'ethusdt-1d.csv')
await binance('BTCUSDT', '4h', 'btcusdt-4h.csv')
