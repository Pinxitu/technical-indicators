import type { Candle } from '../types'
import { nanArray } from '../core/series'
import { atr } from './atr'

export interface SupertrendOptions {
  period?: number
  multiplier?: number
}

export interface SupertrendResult {
  supertrend: number[]
  trend: number[]
  upperBand: number[]
  lowerBand: number[]
}

/**
 * SuperTrend (Olivier Seban): HL2 ± multiplier·ATR with band ratcheting; trend flips on close crossing the
 * opposite band.
 * Reference: https://tradingcompendium.com/en/technical-indicators/supertrend-indicator
 *            https://tradingcompendium.com/es/indicadores-tecnicos/supertrend-indicator
 */
export function supertrend(candles: Candle[], options: SupertrendOptions = {}): SupertrendResult {
  const { period = 10, multiplier = 3 } = options
  const n = candles.length
  const a = atr(candles, { period })
  const st = nanArray(n)
  const trend = new Array<number>(n).fill(0)
  const upperBand = nanArray(n)
  const lowerBand = nanArray(n)
  let prevUpper = NaN
  let prevLower = NaN
  let dir = 1
  for (let i = 0; i < n; i++) {
    if (Number.isNaN(a[i])) continue
    const hl2 = (candles[i].high + candles[i].low) / 2
    let upper = hl2 + multiplier * a[i]
    let lower = hl2 - multiplier * a[i]
    const prevClose = i > 0 ? candles[i - 1].close : NaN
    if (!Number.isNaN(prevUpper) && !(upper < prevUpper || prevClose > prevUpper)) upper = prevUpper
    if (!Number.isNaN(prevLower) && !(lower > prevLower || prevClose < prevLower)) lower = prevLower
    if (!Number.isNaN(prevUpper)) {
      if (dir === -1 && candles[i].close > upper) dir = 1
      else if (dir === 1 && candles[i].close < lower) dir = -1
    }
    upperBand[i] = upper
    lowerBand[i] = lower
    trend[i] = dir
    st[i] = dir === 1 ? lower : upper
    prevUpper = upper
    prevLower = lower
  }
  return { supertrend: st, trend, upperBand, lowerBand }
}
