import type { Candle } from '../types'
import { closesOf, emaSeries } from '../core/series'

export interface MacdOptions {
  fast?: number
  slow?: number
  signal?: number
}

export interface MacdResult {
  macd: number[]
  signal: number[]
  histogram: number[]
}

/**
 * MACD (Appel): EMA(fast) − EMA(slow); signal = EMA(signal) of the MACD line; histogram = MACD − signal.
 * Reference: https://tradingcompendium.com/en/technical-indicators/macd
 *            https://tradingcompendium.com/es/indicadores-tecnicos/macd-convergencia-divergencia
 */
export function macd(input: number[] | Candle[], options: MacdOptions = {}): MacdResult {
  const { fast = 12, slow = 26, signal = 9 } = options
  const c = closesOf(input)
  const f = emaSeries(c, fast)
  const s = emaSeries(c, slow)
  const line = c.map((_, i) => f[i] - s[i])
  const sig = emaSeries(line, signal)
  return { macd: line, signal: sig, histogram: line.map((v, i) => v - sig[i]) }
}
