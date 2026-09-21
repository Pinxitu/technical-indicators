import type { Candle } from '../types'
import { nanArray, rollingMax, rollingMin } from '../core/series'

export interface IchimokuOptions {
  tenkan?: number
  kijun?: number
  senkouB?: number
  displacement?: number
}

export interface IchimokuResult {
  tenkan: number[]
  kijun: number[]
  senkouA: number[]
  senkouB: number[]
  chikou: number[]
}

const midpoint = (h: number[], l: number[], p: number): number[] => {
  const a = rollingMax(h, p)
  const b = rollingMin(l, p)
  return a.map((x, i) => (x + b[i]) / 2)
}

const shiftForward = (v: number[], d: number): number[] => {
  const out = nanArray(v.length)
  for (let i = d; i < v.length; i++) out[i] = v[i - d]
  return out
}

/**
 * Ichimoku Kinko Hyo (Hosoda). Tenkan/Kijun/Senkou B = (HH + LL)/2 over 9/26/52; Senkou A = (Tenkan + Kijun)/2;
 * spans plotted `displacement` bars ahead; Chikou = close plotted `displacement` bars back.
 * Reference: https://tradingcompendium.com/en/technical-indicators/ichimoku-cloud-kinko-hyo
 *            https://tradingcompendium.com/es/indicadores-tecnicos/ichimoku-cloud-kinko-hyo
 */
export function ichimoku(candles: Candle[], options: IchimokuOptions = {}): IchimokuResult {
  const { tenkan = 9, kijun = 26, senkouB = 52, displacement = 26 } = options
  const h = candles.map((c) => c.high)
  const l = candles.map((c) => c.low)
  const t = midpoint(h, l, tenkan)
  const k = midpoint(h, l, kijun)
  const aRaw = t.map((x, i) => (x + k[i]) / 2)
  const chikou = nanArray(candles.length)
  for (let i = 0; i + displacement < candles.length; i++) chikou[i] = candles[i + displacement].close
  return {
    tenkan: t,
    kijun: k,
    senkouA: shiftForward(aRaw, displacement),
    senkouB: shiftForward(midpoint(h, l, senkouB), displacement),
    chikou,
  }
}
