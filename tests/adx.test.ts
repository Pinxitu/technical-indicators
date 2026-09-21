import { describe, it, expect } from 'vitest'
import { adx } from '../src/indicators/adx'

const bar = (high: number, low: number, close: number, i = 0) => ({ time: i, open: close, high, low, close })

describe('adx', () => {
  it('period 1 hand-computed', () => {
    const r = adx([bar(10, 8, 9), bar(12, 9, 11)], { period: 1 })
    expect(r.plusDI[1]).toBeCloseTo(200 / 3, 8)
    expect(r.minusDI[1]).toBe(0)
    expect(r.dx[1]).toBeCloseTo(100, 8)
    expect(r.adx[1]).toBeCloseTo(100, 8)
  })
  it('steady uptrend: +DI > −DI and ADX defined after 2·period−1 bars', () => {
    const bars = Array.from({ length: 20 }, (_, i) => bar(11 + i, 9 + i, 10 + i, i))
    const r = adx(bars, { period: 3 })
    expect(r.adx[4]).toBeNaN()
    expect(Number.isNaN(r.adx[5])).toBe(false)
    for (let i = 5; i < 20; i++) expect(r.plusDI[i]).toBeGreaterThan(r.minusDI[i])
  })
})
