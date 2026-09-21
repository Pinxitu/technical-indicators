import { describe, it, expect } from 'vitest'
import { parabolicSar } from '../src/indicators/parabolic-sar'
const bar = (high: number, low: number, close: number, i = 0) => ({ time: i, open: close, high, low, close })
describe('parabolicSar', () => {
  it('uptrend hand-computed (Wilder)', () => {
    const bars = [0, 1, 2, 3, 4].map((i) => bar(11 + i, 10 + i, 10.5 + i, i))
    const { sar, trend } = parabolicSar(bars)
    expect(sar[1]).toBeCloseTo(10, 10)
    expect(sar[2]).toBeCloseTo(10.04, 10)
    expect(sar[3]).toBeCloseTo(10.1584, 10)
    expect(sar[4]).toBeCloseTo(10.388896, 10)
    expect(trend.slice(1)).toEqual([1, 1, 1, 1])
  })
  it('reverses when price crosses the SAR', () => {
    const up = [0, 1, 2, 3].map((i) => bar(11 + i, 10 + i, 10.5 + i, i))
    const crash = bar(9, 5, 6, 4)  // low 5 < sar
    const { sar, trend } = parabolicSar([...up, crash])
    expect(trend[4]).toBe(-1)
    expect(sar[4]).toBe(14)       // new SAR = prior extreme point (max high = 14)
  })
})
