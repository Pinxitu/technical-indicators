import { describe, it, expect } from 'vitest'
import { trueRange } from '../src/core/true-range'
import { atr } from '../src/indicators/atr'

const bar = (high: number, low: number, close: number, i = 0) => ({ time: i, open: close, high, low, close })

describe('atr', () => {
  const bars = [bar(10, 8, 9), bar(11, 9, 10), bar(13, 10, 12)]
  it('true range uses previous close', () => expect(trueRange(bars)).toEqual([2, 2, 3]))
  it('gap bar: TR = |high − prevClose|', () => expect(trueRange([bar(10, 8, 9), bar(15, 14, 14)])[1]).toBe(6))
  it('atr(2) Wilder', () => {
    const out = atr(bars, { period: 2 })
    expect(out[0]).toBeNaN()
    expect(out[1]).toBeCloseTo(2, 10)
    expect(out[2]).toBeCloseTo(2.5, 10)
  })
})
