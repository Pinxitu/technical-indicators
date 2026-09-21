import { describe, it, expect } from 'vitest'
import { supertrend } from '../src/indicators/supertrend'
const bar = (high: number, low: number, close: number, i = 0) => ({ time: i, open: close, high, low, close })
describe('supertrend', () => {
  it('hand-computed period 2, multiplier 1', () => {
    const r = supertrend([bar(10, 8, 9), bar(11, 9, 10), bar(13, 10, 12)], { period: 2, multiplier: 1 })
    expect(r.supertrend[0]).toBeNaN()
    expect(r.trend[1]).toBe(1); expect(r.supertrend[1]).toBeCloseTo(8, 10)
    expect(r.trend[2]).toBe(1); expect(r.supertrend[2]).toBeCloseTo(9, 10)
    // basic upper at i=2 is HL2 + m*ATR = 11.5 + 2.5 = 14, but the exposed upperBand is the
    // *final* (ratcheted) band: since 14 is not < prevUpper(12) and prevClose(10) is not >
    // prevUpper(12), the ratchet holds the previous final upper (12) rather than widening.
    expect(r.upperBand[2]).toBeCloseTo(12, 10)
  })
  it('flips to −1 when close falls below the lower band', () => {
    const bars = [bar(10, 8, 9), bar(11, 9, 10), bar(13, 10, 12), bar(9, 5, 6)]
    const r = supertrend(bars, { period: 2, multiplier: 1 })
    expect(r.trend[3]).toBe(-1)
    expect(r.supertrend[3]).toBeCloseTo(r.upperBand[3], 10)
  })
})
