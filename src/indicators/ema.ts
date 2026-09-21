import type { Candle } from '../types'
import { closesOf, emaSeries } from '../core/series'

export interface EmaOptions {
  period?: number
}

/**
 * Exponential Moving Average. K = 2 / (period + 1), seeded with the SMA of the first `period` values.
 * Reference: https://tradingcompendium.com/en/technical-indicators/moving-average-exponential
 *            https://tradingcompendium.com/es/indicadores-tecnicos/media-movil-exponencial-ema
 */
export function ema(input: number[] | Candle[], options: EmaOptions = {}): number[] {
  return emaSeries(closesOf(input), options.period ?? 20)
}
