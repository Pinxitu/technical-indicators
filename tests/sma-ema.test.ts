import { describe, it, expect } from 'vitest'
import { sma } from '../src/indicators/sma'
import { ema } from '../src/indicators/ema'

describe('sma/ema', () => {
  it('sma period 3 on closes', () => expect(sma([1, 2, 3, 4, 5], { period: 3 })).toEqual([NaN, NaN, 2, 3, 4]))
  it('ema on candles', () => {
    const candles = [1, 2, 3, 4, 5].map((c) => ({ time: c, open: c, high: c, low: c, close: c }))
    expect(ema(candles, { period: 3 })).toEqual([NaN, NaN, 2, 3, 4])
  })
  it('linear series: ema(n) lags exactly (n-1)/2 (property, n=5)', () => {
    const x = Array.from({ length: 30 }, (_, i) => i + 1)
    const out = ema(x, { period: 5 })
    for (let i = 4; i < 30; i++) expect(out[i]).toBeCloseTo(x[i] - 2, 10)
  })
  it('defaults to period 20 and returns NaN for short input', () => {
    expect(sma([1, 2, 3]).every(Number.isNaN)).toBe(true)
    expect(ema([1, 2, 3]).every(Number.isNaN)).toBe(true)
  })
})
