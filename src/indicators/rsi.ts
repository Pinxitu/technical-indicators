import type { Candle } from '../types'
import { closesOf, nanArray, wilderSmooth } from '../core/series'

export interface RsiOptions {
  period?: number
}

/**
 * Relative Strength Index (Wilder 1978). RSI = 100 − 100 / (1 + RS), RS = Wilder-smoothed gain / loss.
 * Reference: https://tradingcompendium.com/en/technical-indicators/rsi
 *            https://tradingcompendium.com/es/indicadores-tecnicos/rsi-indice-fuerza-relativa
 */
export function rsi(input: number[] | Candle[], options: RsiOptions = {}): number[] {
  const period = options.period ?? 14
  const c = closesOf(input)
  const out = nanArray(c.length)
  if (c.length < period + 1) return out
  const gains = nanArray(c.length)
  const losses = nanArray(c.length)
  for (let i = 1; i < c.length; i++) {
    const d = c[i] - c[i - 1]
    gains[i] = d > 0 ? d : 0
    losses[i] = d < 0 ? -d : 0
  }
  const g = wilderSmooth(gains, period)
  const l = wilderSmooth(losses, period)
  for (let i = period; i < c.length; i++) {
    if (l[i] === 0) out[i] = g[i] === 0 ? 50 : 100
    else out[i] = 100 - 100 / (1 + g[i] / l[i])
  }
  return out
}
