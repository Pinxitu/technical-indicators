import type { Candle } from '../types'
import { nanArray, wilderSmooth } from '../core/series'
import { trueRange } from '../core/true-range'

export interface AdxOptions {
  period?: number
}

export interface AdxResult {
  plusDI: number[]
  minusDI: number[]
  dx: number[]
  adx: number[]
}

/**
 * Directional Movement (Wilder 1978): +DM/−DM, +DI/−DI, DX and ADX. Uses Wilder averages
 * (ratios are identical to Wilder's running sums).
 * Reference: https://tradingcompendium.com/en/technical-indicators/adx-average-directional-index
 *            https://tradingcompendium.com/es/indicadores-tecnicos/adx-average-directional-index
 */
export function adx(candles: Candle[], options: AdxOptions = {}): AdxResult {
  const period = options.period ?? 14
  const n = candles.length
  const plusDM = nanArray(n)
  const minusDM = nanArray(n)
  for (let i = 1; i < n; i++) {
    const up = candles[i].high - candles[i - 1].high
    const down = candles[i - 1].low - candles[i].low
    plusDM[i] = up > down && up > 0 ? up : 0
    minusDM[i] = down > up && down > 0 ? down : 0
  }
  const tr = trueRange(candles)
  tr[0] = NaN
  const sTR = wilderSmooth(tr, period)
  const sP = wilderSmooth(plusDM, period)
  const sM = wilderSmooth(minusDM, period)
  const plusDI = sP.map((v, i) => (sTR[i] === 0 ? 0 : (100 * v) / sTR[i]))
  const minusDI = sM.map((v, i) => (sTR[i] === 0 ? 0 : (100 * v) / sTR[i]))
  const dx = plusDI.map((p, i) => {
    const m = minusDI[i]
    const s = p + m
    return s === 0 ? 0 : (100 * Math.abs(p - m)) / s
  })
  return { plusDI, minusDI, dx, adx: wilderSmooth(dx, period) }
}
