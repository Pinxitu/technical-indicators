import { describe, it, expect } from 'vitest'
import * as lib from '../src/index'
const bars = Array.from({ length: 80 }, (_, i) => ({ time: i, open: 100 + Math.sin(i), high: 101 + Math.sin(i), low: 99 + Math.sin(i), close: 100 + Math.cos(i), volume: 1000 + i }))
const fns: Array<[string, (c: typeof bars) => unknown]> = [
  ['sma', (c) => lib.sma(c)], ['ema', (c) => lib.ema(c)], ['rsi', (c) => lib.rsi(c)], ['macd', (c) => lib.macd(c)],
  ['bollingerBands', (c) => lib.bollingerBands(c)], ['atr', (c) => lib.atr(c)], ['adx', (c) => lib.adx(c)],
  ['stochastic', (c) => lib.stochastic(c)], ['williamsR', (c) => lib.williamsR(c)], ['cci', (c) => lib.cci(c)],
  ['obv', (c) => lib.obv(c)], ['vwap', (c) => lib.vwap(c)], ['parabolicSar', (c) => lib.parabolicSar(c)],
  ['ichimoku', (c) => lib.ichimoku(c)], ['supertrend', (c) => lib.supertrend(c)],
]
describe('contract', () => {
  for (const [name, fn] of fns) {
    it(`${name}: output length = input length; empty and 1-bar inputs do not throw`, () => {
      const check = (n: number) => {
        const r = fn(bars.slice(0, n))
        const arrays = Array.isArray(r) ? [r] : Object.values(r as Record<string, number[]>)
        for (const a of arrays) expect(a).toHaveLength(n)
      }
      check(80); check(1); check(0)
    })
  }
})
