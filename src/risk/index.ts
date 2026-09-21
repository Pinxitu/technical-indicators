/**
 * Kelly criterion fraction of capital to risk: p − (1−p)/b. May be negative (no edge — do not bet).
 * Reference: https://tradingcompendium.com/en/trading-mathematics/kelly-criterion
 *            https://tradingcompendium.com/es/matematicas-del-trading/criterio-de-kelly
 */
export const kellyFraction = (winProbability: number, winLossRatio: number): number =>
  winProbability - (1 - winProbability) / winLossRatio

/**
 * Expected value per trade: p·W − (1−p)·L, in the same units as W (averageWin) and L (averageLoss).
 * Reference: https://tradingcompendium.com/en/trading-mathematics/trading-expectancy
 *            https://tradingcompendium.com/es/matematicas-del-trading/expectativa-matematica
 */
export const expectancy = (winProbability: number, averageWin: number, averageLoss: number): number =>
  winProbability * averageWin - (1 - winProbability) * averageLoss

export interface PositionSizeOptions {
  equity: number
  riskFraction: number
  entry: number
  stop: number
  pointValue?: number
}

/**
 * Position size in units: equity·riskFraction / (|entry − stop|·pointValue).
 * Reference: https://tradingcompendium.com/en/trading-mathematics/position-sizing
 *            https://tradingcompendium.com/es/matematicas-del-trading/tamano-de-posicion
 */
export function positionSize(options: PositionSizeOptions): number {
  const perUnit = Math.abs(options.entry - options.stop) * (options.pointValue ?? 1)
  return perUnit === 0 ? NaN : (options.equity * options.riskFraction) / perUnit
}

/**
 * Risk/reward ratio: |target − entry| / |entry − stop|.
 * Reference: https://tradingcompendium.com/en/risk-capital-management/risk-reward-ratio
 *            https://tradingcompendium.com/es/gestion-riesgo-capital/ratio-riesgo-beneficio
 */
export const riskRewardRatio = (entry: number, stop: number, target: number): number =>
  Math.abs(target - entry) / Math.abs(entry - stop)

export interface RiskOfRuinOptions {
  winProbability: number
  payoffRatio: number
  riskFraction: number
}

/**
 * Risk of ruin approximation (Vince 1990): this is NOT a promise of any trading result, only a rough
 * approximation under the classic even-money formula generalized to a payoff ratio via "units of risk":
 * edge = p − (1−p)/payoffRatio; risk of ruin = ((1 − edge)/(1 + edge))^(1/riskFraction), clamped to [0, 1].
 * Returns 1 (certain ruin) when there is no edge (edge ≤ 0).
 * Reference: https://tradingcompendium.com/en/trading-mathematics/risk-of-ruin
 *            https://tradingcompendium.com/es/matematicas-del-trading/riesgo-de-ruina
 */
export function riskOfRuin(options: RiskOfRuinOptions): number {
  const edge = options.winProbability - (1 - options.winProbability) / options.payoffRatio
  if (edge <= 0) return 1
  return Math.min(1, Math.max(0, ((1 - edge) / (1 + edge)) ** (1 / options.riskFraction)))
}

export interface CompoundGrowthOptions {
  principal: number
  ratePerPeriod: number
  periods: number
}

/**
 * Compound growth: principal·(1 + ratePerPeriod)^periods.
 * Reference: https://tradingcompendium.com/en/trading-mathematics/compound-interest
 *            https://tradingcompendium.com/es/matematicas-del-trading/interes-compuesto
 */
export const compoundGrowth = (options: CompoundGrowthOptions): number =>
  options.principal * (1 + options.ratePerPeriod) ** options.periods

export interface PipValueOptions {
  lotSize: number
  pipSize: number
  quoteToAccountRate?: number
}

/**
 * Monetary value of one pip: lotSize·pipSize·quoteToAccountRate.
 * Reference: https://tradingcompendium.com/en/trading-glossary#pip
 *            https://tradingcompendium.com/es/glosario-trading#pip
 */
export const pipValue = (options: PipValueOptions): number =>
  options.lotSize * options.pipSize * (options.quoteToAccountRate ?? 1)
