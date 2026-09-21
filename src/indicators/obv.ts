import type { Candle } from '../types'

/**
 * On-Balance Volume (Granville).
 * Reference: https://tradingcompendium.com/en/technical-indicators/obv-on-balance-volume
 *            https://tradingcompendium.com/es/indicadores-tecnicos/obv-on-balance-volume
 */
export function obv(candles: Candle[]): number[] {
  const out: number[] = []
  let acc = 0
  for (let i = 0; i < candles.length; i++) {
    if (i > 0) {
      const v = candles[i].volume ?? 0
      if (candles[i].close > candles[i - 1].close) acc += v
      else if (candles[i].close < candles[i - 1].close) acc -= v
    }
    out.push(acc)
  }
  return out
}
