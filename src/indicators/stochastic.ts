import type { Candle } from '../types'
import { rollingMax, rollingMin, sma } from '../core/series'

export interface StochasticOptions {
  kPeriod?: number
  kSmooth?: number
  dPeriod?: number
}

export interface StochasticResult {
  fastK: number[]
  k: number[]
  d: number[]
}

/**
 * Stochastic Oscillator (Lane): fast %K = 100·(C − LL)/(HH − LL); slow %K = SMA(kSmooth); %D = SMA(dPeriod) of %K.
 * Reference: https://tradingcompendium.com/en/technical-indicators/stochastic-oscillator
 *            https://tradingcompendium.com/es/indicadores-tecnicos/oscilador-estocastico
 */
export function stochastic(candles: Candle[], options: StochasticOptions = {}): StochasticResult {
  const { kPeriod = 14, kSmooth = 3, dPeriod = 3 } = options
  const hh = rollingMax(candles.map((c) => c.high), kPeriod)
  const ll = rollingMin(candles.map((c) => c.low), kPeriod)
  const fastK = candles.map((c, i) => {
    const r = hh[i] - ll[i]
    return r === 0 ? 50 : (100 * (c.close - ll[i])) / r
  })
  const k = kSmooth <= 1 ? fastK : sma(fastK, kSmooth)
  const d = dPeriod <= 1 ? k : sma(k, dPeriod)
  return { fastK, k, d }
}
