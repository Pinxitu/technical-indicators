import { describe, it, expect } from 'vitest'
import { cci } from '../src/indicators/cci'
const bar = (high: number, low: number, close: number, i = 0) => ({ time: i, open: close, high, low, close })
describe('cci', () => {
  it('hand-computed period 2', () => {
    const out = cci([bar(3, 1, 2), bar(5, 3, 4), bar(4, 2, 3)], { period: 2 })
    expect(out[0]).toBeNaN()
    expect(out[1]).toBeCloseTo(200 / 3, 8)
    expect(out[2]).toBeCloseTo(-200 / 3, 8)
  })
  it('flat prices → 0 (mean deviation 0 guarded)', () => {
    expect(cci([bar(2, 2, 2), bar(2, 2, 2)], { period: 2 })[1]).toBe(0)
  })
})
