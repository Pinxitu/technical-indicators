import { describe, it, expect } from 'vitest'
import { rsi } from '../src/indicators/rsi'

describe('rsi', () => {
  it('period 2 hand-computed', () => {
    const out = rsi([10, 11, 10, 12, 11], { period: 2 })
    expect(out[0]).toBeNaN()
    expect(out[1]).toBeNaN()
    expect(out[2]).toBeCloseTo(50, 10)
    expect(out[3]).toBeCloseTo(100 - 100 / 6, 10)
    expect(out[4]).toBeCloseTo(50, 10)
  })
  it('only gains → 100, only losses → 0', () => {
    expect(rsi([1, 2, 3, 4, 5], { period: 3 })[4]).toBe(100)
    expect(rsi([5, 4, 3, 2, 1], { period: 3 })[4]).toBe(0)
  })
  it('output length equals input length; default period 14 warm-up', () => {
    const out = rsi(Array.from({ length: 20 }, (_, i) => Math.sin(i) + 10))
    expect(out).toHaveLength(20)
    expect(out.slice(0, 14).every(Number.isNaN)).toBe(true)
    expect(Number.isNaN(out[14])).toBe(false)
  })
})
