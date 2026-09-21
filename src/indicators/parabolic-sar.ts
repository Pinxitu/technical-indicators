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
 * each new extreme up to `max`; long SAR may not exceed the two prior lows (short: two prior highs) — the
 * unconditional two-bar clamp of Wilder 1978 / TA-Lib, applied against candles[i-1] and candles[i-2] with no
 * exception for the leg's seed bar.
 * The two-bar clamp is unconditional, including on the first bars of a leg, matching Wilder 1978 and
 * TA-Lib; the fixture in `tests/parabolic-sar.test.ts` gives SAR[1..4] = 10, 10, 10.12, 10.3528. Known
 * deviation: on reversal the new SAR is set to the prior extreme point without clamping it into the
 * reversal bar's range (TA-Lib does clamp).
 * If a bar's high, low or close is not finite, `sar[i]` is `NaN` and `trend[i]` is `0` for that bar only;
 * the algorithm resumes on the next bar from the state (`cur`/`ep`/`af`/`long`) it had before that bar.
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
  sar[1] = cur
  trend[1] = long ? 1 : -1
  for (let i = 2; i < n; i++) {
    const c = candles[i]
    if (!Number.isFinite(c.high) || !Number.isFinite(c.low) || !Number.isFinite(c.close)) {
      sar[i] = NaN
      trend[i] = 0
      continue
    }
    let next = cur + af * (ep - cur)
    if (long) next = Math.min(next, candles[i - 1].low, candles[i - 2].low)
    else next = Math.max(next, candles[i - 1].high, candles[i - 2].high)
    if (long && c.low < next) {
      // reverse to short
      long = false
      next = ep
      ep = c.low
      af = step
    } else if (!long && c.high > next) {
      // reverse to long
      long = true
      next = ep
      ep = c.high
      af = step
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
