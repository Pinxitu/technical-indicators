import type { Candle } from '../types'
import { wilderSmooth } from '../core/series'
import { trueRange } from '../core/true-range'

export interface AtrOptions {
  period?: number
}

/**
 * Average True Range (Wilder 1978): Wilder-smoothed True Range.
 * Reference: https://tradingcompendium.com/en/technical-indicators/atr-average-true-range
 *            https://tradingcompendium.com/es/indicadores-tecnicos/atr-average-true-range
 */
export function atr(candles: Candle[], options: AtrOptions = {}): number[] {
  return wilderSmooth(trueRange(candles), options.period ?? 14)
}
