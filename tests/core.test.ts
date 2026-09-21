import { describe, it, expect } from 'vitest'
import { sma, emaSeries, wilderSmooth, rollingMax, rollingMin, stdDevPop, closesOf, firstValid } from '../src/core/series'

describe('core', () => {
  it('sma(3) of 1..5 = [NaN,NaN,2,3,4]', () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toEqual([NaN, NaN, 2, 3, 4])
  })
  it('sma with short input is all NaN', () => {
    expect(sma([1, 2], 3)).toEqual([NaN, NaN])
  })
  it('sma recovers after leading NaN instead of poisoning every window forever', () => {
    expect(sma([NaN, NaN, 1, 2, 3], 2)).toEqual([NaN, NaN, NaN, 1.5, 2.5])
  })
  it('ema(3) of 1..5: seed SMA=2, K=0.5 → [NaN,NaN,2,3,4]', () => {
    expect(emaSeries([1, 2, 3, 4, 5], 3)).toEqual([NaN, NaN, 2, 3, 4])
  })
  it('ema skips leading NaN (chainable): ema(2) of [NaN,NaN,1,1,1] = [NaN,NaN,NaN,1,1]', () => {
    expect(emaSeries([NaN, NaN, 1, 1, 1], 2)).toEqual([NaN, NaN, NaN, 1, 1])
  })
  it('wilderSmooth(2) of [2,2,3]: seed (2+2)/2=2, then 2*1/2+3/2=2.5', () => {
    expect(wilderSmooth([2, 2, 3], 2)).toEqual([NaN, 2, 2.5])
  })
  it('rollingMax/Min(2)', () => {
    expect(rollingMax([1, 3, 2, 5], 2)).toEqual([NaN, 3, 3, 5])
    expect(rollingMin([1, 3, 2, 5], 2)).toEqual([NaN, 1, 2, 2])
  })
  it('stdDevPop(8) of [2,4,4,4,5,5,7,9] = 2 at last index', () => {
    const out = stdDevPop([2, 4, 4, 4, 5, 5, 7, 9], 8)
    expect(out.slice(0, 7).every(Number.isNaN)).toBe(true)
    expect(out[7]).toBeCloseTo(2, 10)
  })
  it('stdDevPop with period <= 0 or short input returns all-NaN with no stray properties', () => {
    const zero = stdDevPop([1, 2, 3], 0)
    expect(zero).toEqual([NaN, NaN, NaN])
    expect(Object.keys(zero).length).toBe(zero.length)

    const negative = stdDevPop([1, 2, 3, 4], -1)
    expect(negative).toEqual([NaN, NaN, NaN, NaN])
    expect(Object.keys(negative).length).toBe(negative.length)

    expect(stdDevPop([1, 2], 3)).toEqual([NaN, NaN])
  })
  it('closesOf accepts numbers or candles', () => {
    expect(closesOf([1, 2])).toEqual([1, 2])
    expect(closesOf([{ time: 0, open: 1, high: 2, low: 0, close: 1.5 }])).toEqual([1.5])
  })
  it('firstValid', () => {
    expect(firstValid([NaN, NaN, 3])).toBe(2)
    expect(firstValid([NaN])).toBe(-1)
  })
})
