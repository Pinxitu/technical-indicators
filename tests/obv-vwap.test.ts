import { describe, it, expect } from 'vitest'
import { obv } from '../src/indicators/obv'
import { vwap } from '../src/indicators/vwap'
const bar = (close: number, volume: number, i = 0) => ({ time: i, open: close, high: close + 1, low: close - 1, close, volume })
describe('obv / vwap', () => {
  it('obv accumulates signed volume', () => {
    const bars = [bar(10, 100), bar(11, 200), bar(10, 300), bar(10, 400), bar(12, 500)]
    expect(obv(bars)).toEqual([0, 200, -100, -100, 400])
  })
  it('vwap = Σ(TP·V)/ΣV (TP = close here since H = C+1, L = C−1)', () => {
    const bars = [bar(10, 100), bar(20, 300)]
    expect(vwap(bars)).toEqual([10, (10 * 100 + 20 * 300) / 400])
  })
  it('vwap anchorEvery resets the accumulation', () => {
    const bars = [bar(10, 100), bar(20, 100), bar(30, 100), bar(40, 100)]
    expect(vwap(bars, { anchorEvery: 2 })).toEqual([10, 15, 30, 35])
  })
})
