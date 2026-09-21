import type { Candle } from '../types'
import { nanArray, sma } from '../core/series'

export interface CciOptions {
  period?: number
}

/**
 * Commodity Channel Index (Lambert 1980): (TP − SMA(TP)) / (0.015 · mean deviation), TP = (H+L+C)/3.
 * Reference: https://tradingcompendium.com/en/technical-indicators/cci-commodity-channel-index
 *            https://tradingcompendium.com/es/indicadores-tecnicos/cci-commodity-channel-index
 */
export function cci(candles: Candle[], options: CciOptions = {}): number[] {
  const period = options.period ?? 20
  const tp = candles.map((c) => (c.high + c.low + c.close) / 3)
  const out = nanArray(tp.length)
  if (period <= 0) return out
  const mean = sma(tp, period)
  for (let i = period - 1; i < tp.length; i++) {
    let md = 0
    for (let j = i - period + 1; j <= i; j++) md += Math.abs(tp[j] - mean[i])
    md /= period
    out[i] = md === 0 ? 0 : (tp[i] - mean[i]) / (0.015 * md)
  }
  return out
}
