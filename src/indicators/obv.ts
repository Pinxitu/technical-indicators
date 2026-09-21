import type { Candle } from '../types'

/**
 * On-Balance Volume (Granville).
 * A bar whose close is not finite emits `NaN` for that bar only; the running accumulator itself stays
 * finite and keeps accumulating from the last finite close on the next bar (it is not "poisoned"
 * forever the way a Wilder/EMA recursion would be — OBV's running total is a plain sum, not a filter
 * fed back through itself).
 * Reference: https://tradingcompendium.com/en/technical-indicators/obv-on-balance-volume
 *            https://tradingcompendium.com/es/indicadores-tecnicos/obv-on-balance-volume
 */
export function obv(candles: Candle[]): number[] {
  const out: number[] = []
  let acc = 0
  let lastClose: number | undefined
  for (let i = 0; i < candles.length; i++) {
    const close = candles[i].close
    if (!Number.isFinite(close)) {
      out.push(NaN)
      continue
    }
    if (i > 0 && lastClose !== undefined) {
      const v = candles[i].volume ?? 0
      if (close > lastClose) acc += v
      else if (close < lastClose) acc -= v
    }
    lastClose = close
    out.push(acc)
  }
  return out
}
