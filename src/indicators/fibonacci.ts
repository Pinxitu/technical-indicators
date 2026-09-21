export interface FibonacciOptions {
  direction?: 'up' | 'down'
  levels?: number[]
}

export interface FibonacciLevel {
  level: number
  price: number
}

export const FIBONACCI_RETRACEMENT_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
export const FIBONACCI_EXTENSION_LEVELS = [1.272, 1.618, 2.618]

/**
 * Fibonacci retracement levels of a swing between `low` and `high`.
 * Reference: https://tradingcompendium.com/en/technical-indicators/fibonacci-retracement
 *            https://tradingcompendium.com/es/indicadores-tecnicos/retrocesos-de-fibonacci
 */
export function fibonacciRetracement(high: number, low: number, options: FibonacciOptions = {}): FibonacciLevel[] {
  const { direction = 'up', levels = FIBONACCI_RETRACEMENT_LEVELS } = options
  const range = high - low
  return levels.map((level) => ({ level, price: direction === 'up' ? high - level * range : low + level * range }))
}

/**
 * Fibonacci extension levels projected beyond a swing between `low` and `high`.
 * Reference: https://tradingcompendium.com/en/technical-indicators/fibonacci-retracement
 *            https://tradingcompendium.com/es/indicadores-tecnicos/retrocesos-de-fibonacci
 */
export function fibonacciExtension(high: number, low: number, options: FibonacciOptions = {}): FibonacciLevel[] {
  const { direction = 'up', levels = FIBONACCI_EXTENSION_LEVELS } = options
  const range = high - low
  return levels.map((level) => ({
    level,
    price: direction === 'up' ? high + (level - 1) * range : low - (level - 1) * range,
  }))
}
