import { describe, it, expect } from 'vitest'
import { kellyFraction, expectancy, positionSize, riskRewardRatio, riskOfRuin, compoundGrowth, pipValue } from '../src/risk'
describe('risk', () => {
  it('kelly: p=0.6, b=1 → 0.2; p=0.5, b=1 → 0', () => {
    expect(kellyFraction(0.6, 1)).toBeCloseTo(0.2, 10); expect(kellyFraction(0.5, 1)).toBeCloseTo(0, 10)
  })
  it('expectancy: 0.4·300 − 0.6·100 = 60', () => expect(expectancy(0.4, 300, 100)).toBeCloseTo(60, 10))
  it('position size: 10 000 equity, 1% risk, entry 50 stop 48 → 50 units', () => {
    expect(positionSize({ equity: 10_000, riskFraction: 0.01, entry: 50, stop: 48 })).toBe(50)
  })
  it('risk/reward: entry 100 stop 95 target 115 → 3', () => expect(riskRewardRatio(100, 95, 115)).toBe(3))
  it('risk of ruin: no edge → 1; strong edge with small risk → near 0', () => {
    expect(riskOfRuin({ winProbability: 0.5, payoffRatio: 1, riskFraction: 0.01 })).toBe(1)
    expect(riskOfRuin({ winProbability: 0.6, payoffRatio: 1, riskFraction: 0.01 })).toBeLessThan(1e-10)
  })
  it('compound growth: 1000 at 1% for 12 periods', () => expect(compoundGrowth({ principal: 1000, ratePerPeriod: 0.01, periods: 12 })).toBeCloseTo(1126.825, 2))
  it('pip value: 100 000 lot, 0.0001 pip, rate 1 → 10', () => expect(pipValue({ lotSize: 100_000, pipSize: 0.0001 })).toBeCloseTo(10, 10))
})
