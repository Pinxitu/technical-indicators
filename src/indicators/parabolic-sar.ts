import type { Candle } from '../types'
import { nanArray } from '../core/series'

export interface ParabolicSarOptions {
  step?: number
  max?: number
}

export interface ParabolicSarResult {
  sar: number[]
  trend: number[]
}

/**
 * Parabolic SAR (Wilder 1978). SAR(t+1) = SAR(t) + AF·(EP − SAR(t)); AF starts at `step`, grows by `step` on
 * each new extreme up to `max`; long SAR may not exceed the two prior lows (short: two prior highs) — "prior"
 * meaning within the current leg: the bar that seeded the leg (index 0, or the bar a reversal happened on)
 * is only ever used to seed SAR/EP and is not itself reused as a clamp bound.
 * Reference: https://tradingcompendium.com/en/technical-indicators/parabolic-sar-stop-and-reverse
 *            https://tradingcompendium.com/es/indicadores-tecnicos/parabolic-sar-stop-and-reverse
 */
export function parabolicSar(candles: Candle[], options: ParabolicSarOptions = {}): ParabolicSarResult {
  const { step = 0.02, max = 0.2 } = options
  const n = candles.length
  const sar = nanArray(n)
  const trend = new Array<number>(n).fill(0)
  if (n < 2) return { sar, trend }
  let long = candles[1].close >= candles[0].close
  let af = step
  let ep = long ? candles[1].high : candles[1].low
  let cur = long ? candles[0].low : candles[0].high
  let legStart = 0
  sar[1] = cur
  trend[1] = long ? 1 : -1
  for (let i = 2; i < n; i++) {
    let next = cur + af * (ep - cur)
    const lowAt = (idx: number): number => (idx > legStart ? candles[idx].low : Infinity)
    const highAt = (idx: number): number => (idx > legStart ? candles[idx].high : -Infinity)
    if (long) next = Math.min(next, lowAt(i - 1), lowAt(i - 2))
    else next = Math.max(next, highAt(i - 1), highAt(i - 2))
    const c = candles[i]
    if (long && c.low < next) {
      // reverse to short
      long = false
      next = ep
      ep = c.low
      af = step
      legStart = i
    } else if (!long && c.high > next) {
      // reverse to long
      long = true
      next = ep
      ep = c.high
      af = step
      legStart = i
    } else if (long && c.high > ep) {
      ep = c.high
      af = Math.min(af + step, max)
    } else if (!long && c.low < ep) {
      ep = c.low
      af = Math.min(af + step, max)
    }
    sar[i] = next
    trend[i] = long ? 1 : -1
    cur = next
  }
  return { sar, trend }
}
