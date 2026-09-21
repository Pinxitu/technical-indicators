/** One OHLCV bar. `time` is whatever the caller uses (ISO string or epoch ms); the library never reads it. */
export interface Candle {
  time: string | number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}
