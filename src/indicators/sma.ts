import type { Candle } from '../types'
import { closesOf, sma as smaCore } from '../core/series'

export interface SmaOptions {
  period?: number
}

/**
 * Simple Moving Average.
 * Reference: https://tradingcompendium.com/en/technical-indicators/moving-average-simple
 *            https://tradingcompendium.com/es/indicadores-tecnicos/media-movil-simple-sma
 */
export function sma(input: number[] | Candle[], options: SmaOptions = {}): number[] {
  return smaCore(closesOf(input), options.period ?? 20)
}
