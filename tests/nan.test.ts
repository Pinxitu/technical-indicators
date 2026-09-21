import { describe, it, expect } from 'vitest'
import { rsi } from '../src/indicators/rsi'
import { obv } from '../src/indicators/obv'
import { parabolicSar } from '../src/indicators/parabolic-sar'
import { sma } from '../src/indicators/sma'

// 60-bar synthetic series with a single non-finite close at index 30.
const N = 60
const NAN_AT = 30
const baseCloses = Array.from({ length: N }, (_, i) => 100 + Math.sin(i / 3) * 5)
const closes = [...baseCloses]
closes[NAN_AT] = NaN

const bar = (close: number, i: number) => ({ time: i, open: close, high: close + 1, low: close - 1, close, volume: 1000 + i })
const bars = baseCloses.map((c, i) => bar(c, i))
const barsWithNaNClose = bars.map((b, i) => (i === NAN_AT ? { ...b, close: NaN } : b))

describe('NaN propagation contract (a non-finite value inside the series, not the warm-up)', () => {
  it('rsi: a bad close poisons that bar and every bar after it (Wilder smoothing never recovers)', () => {
    const out = rsi(closes, { period: 14 })
    expect(out[NAN_AT]).toBeNaN()
    for (let i = NAN_AT + 1; i <= 43; i++) expect(out[i]).toBeNaN()
    // no value from index 30 onward is a finite number derived from the bad bar
    for (let i = NAN_AT; i < out.length; i++) expect(Number.isNaN(out[i])).toBe(true)
  })

  it('rsi: an Infinity close is propagated as NaN (like other non-finite values)', () => {
    const closesWithInfinity = [...baseCloses]
    closesWithInfinity[NAN_AT] = Infinity
    const out = rsi(closesWithInfinity, { period: 14 })
    expect(out[NAN_AT]).toBeNaN()
    expect(out[NAN_AT + 1]).toBeNaN()
    // Wilder smoothing never recovers from the bad bar
    for (let i = NAN_AT; i < out.length; i++) expect(Number.isNaN(out[i])).toBe(true)
  })

  it('obv: a bad close poisons only that bar; the running total keeps accumulating from the last finite close', () => {
    const out = obv(barsWithNaNClose)
    expect(out[NAN_AT]).toBeNaN()
    expect(Number.isFinite(out[NAN_AT + 1])).toBe(true)
    expect(Number.isFinite(out[out.length - 1])).toBe(true)
    // the only non-finite output is the bad bar itself
    expect(out.every((v, i) => (i === NAN_AT ? Number.isNaN(v) : Number.isFinite(v)))).toBe(true)
  })

  it('parabolicSar: a bad close poisons only that bar (sar NaN, trend 0); state resumes on the next bar', () => {
    const { sar, trend } = parabolicSar(barsWithNaNClose)
    expect(sar[NAN_AT]).toBeNaN()
    expect(trend[NAN_AT]).toBe(0)
    expect(Number.isFinite(sar[NAN_AT + 1])).toBe(true)
    expect(trend[NAN_AT + 1]).not.toBe(0)
  })

  it('sma: a window-based indicator recovers once the bad bar scrolls out of the window', () => {
    const period = 20
    const out = sma(closes, { period })
    for (let i = NAN_AT; i < NAN_AT + period; i++) expect(out[i]).toBeNaN()
    expect(Number.isFinite(out[NAN_AT + period])).toBe(true)
  })
})
