import type { Candle } from '../types'

export interface VwapOptions {
  anchorEvery?: number
}

/**
 * Volume-Weighted Average Price, cumulative from the anchor.
 * Reference: https://tradingcompendium.com/en/technical-indicators/vwap-volume-weighted-average-price
 *            https://tradingcompendium.com/es/indicadores-tecnicos/vwap-volume-weighted-average-price
 */
export function vwap(candles: Candle[], options: VwapOptions = {}): number[] {
  const every = options.anchorEvery ?? 0
  let pv = 0
  let vol = 0
  return candles.map((c, i) => {
    if (every > 0 && i % every === 0) {
      pv = 0
      vol = 0
    }
    const v = c.volume ?? 0
    pv += ((c.high + c.low + c.close) / 3) * v
    vol += v
    return vol === 0 ? NaN : pv / vol
  })
}
