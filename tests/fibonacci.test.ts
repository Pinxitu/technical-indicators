import { describe, it, expect } from 'vitest'
import { fibonacciRetracement, fibonacciExtension } from '../src/indicators/fibonacci'
describe('fibonacci', () => {
  it('up-swing 100→200 retracements', () => {
    const r = Object.fromEntries(fibonacciRetracement(200, 100).map((x) => [x.level, x.price]))
    expect(r[0]).toBe(200); expect(r[0.5]).toBe(150); expect(r[0.618]).toBeCloseTo(138.2, 10); expect(r[1]).toBe(100)
  })
  it('down-swing mirrors', () => {
    const r = Object.fromEntries(fibonacciRetracement(200, 100, { direction: 'down' }).map((x) => [x.level, x.price]))
    expect(r[0]).toBe(100); expect(r[0.382]).toBeCloseTo(138.2, 10)
  })
  it('extensions beyond the swing', () => {
    expect(fibonacciExtension(200, 100).find((x) => x.level === 1.618)!.price).toBeCloseTo(261.8, 10)
  })
})
