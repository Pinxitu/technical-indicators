import type { Candle } from '../types'
import { closesOf, sma, stdDevPop } from '../core/series'

export interface BollingerOptions {
  period?: number
  multiplier?: number
}

export interface BollingerResult {
  middle: number[]
  upper: number[]
  lower: number[]
  percentB: number[]
  bandwidth: number[]
}

/**
 * Bollinger Bands®: SMA(n) ± k·σ (population). %B = (close − lower)/(upper − lower); bandwidth = (upper − lower)/middle.
 * Reference: https://tradingcompendium.com/en/technical-indicators/bollinger-bands
 *            https://tradingcompendium.com/es/indicadores-tecnicos/bandas-de-bollinger
 */
export function bollingerBands(input: number[] | Candle[], options: BollingerOptions = {}): BollingerResult {
  const { period = 20, multiplier = 2 } = options
  const c = closesOf(input)
  const middle = sma(c, period)
  const sd = stdDevPop(c, period)
  const upper = middle.map((m, i) => m + multiplier * sd[i])
  const lower = middle.map((m, i) => m - multiplier * sd[i])
  const percentB = c.map((x, i) => (x - lower[i]) / (upper[i] - lower[i]))
  const bandwidth = middle.map((m, i) => (upper[i] - lower[i]) / m)
  return { middle, upper, lower, percentB, bandwidth }
}
