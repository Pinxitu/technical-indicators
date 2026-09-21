import type { Candle } from '../types'

export const nanArray = (n: number): number[] => new Array<number>(n).fill(NaN)
export const firstValid = (v: number[]): number => v.findIndex((x) => !Number.isNaN(x))
export const closesOf = (input: number[] | Candle[]): number[] =>
  input.length > 0 && typeof input[0] === 'object' ? (input as Candle[]).map((c) => c.close) : (input as number[])

export function sma(values: number[], period: number): number[] {
  const out = nanArray(values.length)
  if (period <= 0 || values.length < period) return out
  // Recompute each window from scratch (not a running sum): a running sum would let one NaN
  // (e.g. from a shorter warm-up in an upstream series) poison every subsequent window forever,
  // since `sum -= values[i - period]` cannot un-NaN a sum that already went NaN.
  for (let i = period - 1; i < values.length; i++) {
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) sum += values[j]
    out[i] = sum / period
  }
  return out
}

/** EMA seeded with the SMA of the first `period` valid values. Leading NaN are skipped. */
export function emaSeries(values: number[], period: number): number[] {
  const out = nanArray(values.length)
  const start = firstValid(values)
  if (period <= 0 || start < 0 || values.length - start < period) return out
  const k = 2 / (period + 1)
  let seed = 0
  for (let i = start; i < start + period; i++) seed += values[i]
  let prev = seed / period
  out[start + period - 1] = prev
  for (let i = start + period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k)
    out[i] = prev
  }
  return out
}

/** Wilder's smoothing: seed = SMA of first `period` valid values, then prev*(n-1)/n + x/n. */
export function wilderSmooth(values: number[], period: number): number[] {
  const out = nanArray(values.length)
  const start = firstValid(values)
  if (period <= 0 || start < 0 || values.length - start < period) return out
  let seed = 0
  for (let i = start; i < start + period; i++) seed += values[i]
  let prev = seed / period
  out[start + period - 1] = prev
  for (let i = start + period; i < values.length; i++) {
    prev = (prev * (period - 1) + values[i]) / period
    out[i] = prev
  }
  return out
}

function rolling(values: number[], period: number, pick: (a: number, b: number) => number): number[] {
  const out = nanArray(values.length)
  if (period <= 0) return out
  for (let i = period - 1; i < values.length; i++) {
    let acc = values[i - period + 1]
    for (let j = i - period + 2; j <= i; j++) acc = pick(acc, values[j])
    out[i] = acc
  }
  return out
}
export const rollingMax = (v: number[], p: number): number[] => rolling(v, p, Math.max)
export const rollingMin = (v: number[], p: number): number[] => rolling(v, p, Math.min)

/** Population standard deviation over a rolling window (what Bollinger/StockCharts use). */
export function stdDevPop(values: number[], period: number): number[] {
  const out = nanArray(values.length)
  if (period <= 0 || values.length < period) return out
  const means = sma(values, period)
  for (let i = period - 1; i < values.length; i++) {
    let ss = 0
    for (let j = i - period + 1; j <= i; j++) ss += (values[j] - means[i]) ** 2
    out[i] = Math.sqrt(ss / period)
  }
  return out
}
