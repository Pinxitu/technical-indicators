import { describe, it, expect } from 'vitest'
import { macd } from '../src/indicators/macd'

describe('macd', () => {
  const x = Array.from({ length: 40 }, (_, i) => i + 1)
  it('linear series → macd = 1, signal = 1, histogram = 0', () => {
    const { macd: m, signal: s, histogram: h } = macd(x, { fast: 3, slow: 5, signal: 2 })
    expect(m[3]).toBeNaN()
    expect(m[4]).toBeCloseTo(1, 10)
    expect(s[4]).toBeNaN()
    expect(s[5]).toBeCloseTo(1, 10)
    expect(h[5]).toBeCloseTo(0, 10)
    expect(h[39]).toBeCloseTo(0, 10)
  })
  it('defaults 12/26/9 warm-up: macd from i=25, signal from i=33', () => {
    const { macd: m, signal: s } = macd(x)
    expect(m[24]).toBeNaN()
    expect(Number.isNaN(m[25])).toBe(false)
    expect(s[32]).toBeNaN()
    expect(Number.isNaN(s[33])).toBe(false)
  })
})
