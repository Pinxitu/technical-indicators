import type { Candle } from '../types'
import { rollingMax, rollingMin } from '../core/series'

export interface WilliamsROptions {
  period?: number
}

/**
 * Williams %R = −100·(HH − C)/(HH − LL), bounded [−100, 0].
 * Reference: https://tradingcompendium.com/en/technical-indicators/williams-r-percent-range
 *            https://tradingcompendium.com/es/indicadores-tecnicos/williams-r-percent-range
 */
export function williamsR(candles: Candle[], options: WilliamsROptions = {}): number[] {
  const period = options.period ?? 14
  const hh = rollingMax(candles.map((c) => c.high), period)
  const ll = rollingMin(candles.map((c) => c.low), period)
  return candles.map((c, i) => {
    const r = hh[i] - ll[i]
    return r === 0 ? -50 : (-100 * (hh[i] - c.close)) / r
  })
}
