import { describe, it, expect } from 'vitest'
import { stochastic } from '../src/indicators/stochastic'
import { williamsR } from '../src/indicators/williams-r'
const bar = (high: number, low: number, close: number, i = 0) => ({ time: i, open: close, high, low, close })
const bars = [bar(10, 8, 9), bar(11, 9, 10), bar(12, 10, 11.5)]

describe('stochastic / williams', () => {
  it('fast %K hand-computed', () => {
    const r = stochastic(bars, { kPeriod: 3, kSmooth: 1, dPeriod: 1 })
    expect(r.fastK[2]).toBeCloseTo(87.5, 10)
    expect(r.k[2]).toBeCloseTo(87.5, 10)   // kSmooth 1 → k = fastK
    expect(r.d[2]).toBeCloseTo(87.5, 10)
  })
  it('slow %K = SMA(3) of fast %K', () => {
    const many = Array.from({ length: 10 }, (_, i) => bar(10 + (i % 3), 8 + (i % 3), 9 + (i % 3), i))
    const r = stochastic(many, { kPeriod: 3, kSmooth: 3, dPeriod: 3 })
    const f = r.fastK
    expect(r.k[4]).toBeCloseTo((f[2] + f[3] + f[4]) / 3, 10)
  })
  it('williams %R hand-computed', () => expect(williamsR(bars, { period: 3 })[2]).toBeCloseTo(-12.5, 10))
  it('flat range → fastK 50 (no division by zero)', () => {
    expect(stochastic([bar(5, 5, 5), bar(5, 5, 5)], { kPeriod: 2, kSmooth: 1, dPeriod: 1 }).fastK[1]).toBe(50)
  })
})
