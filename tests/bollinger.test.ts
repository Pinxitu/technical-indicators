import { describe, it, expect } from 'vitest'
import { bollingerBands } from '../src/indicators/bollinger-bands'

describe('bollingerBands', () => {
  it('classic population-stddev example', () => {
    const r = bollingerBands([2, 4, 4, 4, 5, 5, 7, 9], { period: 8, multiplier: 2 })
    expect(r.middle[7]).toBeCloseTo(5, 10)
    expect(r.upper[7]).toBeCloseTo(9, 10)
    expect(r.lower[7]).toBeCloseTo(1, 10)
    expect(r.percentB[7]).toBeCloseTo(1, 10)
    expect(r.bandwidth[7]).toBeCloseTo(1.6, 10)
    expect(r.upper[6]).toBeNaN()
  })
  it('constant series → zero-width bands, percentB NaN (0/0)', () => {
    const r = bollingerBands([5, 5, 5], { period: 3 })
    expect(r.upper[2]).toBe(5)
    expect(r.lower[2]).toBe(5)
    expect(r.percentB[2]).toBeNaN()
  })
})
