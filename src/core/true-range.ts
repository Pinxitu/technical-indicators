import type { Candle } from '../types'

/** True Range: max(high−low, |high−prevClose|, |low−prevClose|). First bar = high − low. */
export function trueRange(candles: Candle[]): number[] {
  return candles.map((c, i) => {
    if (i === 0) return c.high - c.low
    const pc = candles[i - 1].close
    return Math.max(c.high - c.low, Math.abs(c.high - pc), Math.abs(c.low - pc))
  })
}
