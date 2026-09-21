import { describe, it, expect } from 'vitest'
import { ichimoku } from '../src/indicators/ichimoku'
const bars = [1, 2, 3, 4, 5, 6].map((h, i) => ({ time: i, open: h, high: h, low: h - 1, close: h }))
describe('ichimoku', () => {
  const r = ichimoku(bars, { tenkan: 2, kijun: 3, senkouB: 4, displacement: 2 })
  it('tenkan/kijun midpoints', () => {
    expect(r.tenkan).toEqual([NaN, 1, 2, 3, 4, 5])
    expect(r.kijun).toEqual([NaN, NaN, 1.5, 2.5, 3.5, 4.5])
  })
  it('senkou spans are displaced forward', () => {
    expect(r.senkouA.slice(0, 4).every(Number.isNaN)).toBe(true)
    expect(r.senkouA[4]).toBeCloseTo(1.75, 10); expect(r.senkouA[5]).toBeCloseTo(2.75, 10)
    expect(r.senkouB[5]).toBeCloseTo(2, 10); expect(r.senkouB[4]).toBeNaN()
  })
  it('chikou is close shifted back', () => expect(r.chikou).toEqual([3, 4, 5, 6, NaN, NaN]))
})
