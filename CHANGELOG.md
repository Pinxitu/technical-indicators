# Changelog

All notable changes to this project are documented in this file.

## 0.1.0 — 2026-09-21

Initial release.

### Indicators (16)

- `sma` — Simple Moving Average
- `ema` — Exponential Moving Average
- `rsi` — Relative Strength Index
- `macd` — Moving Average Convergence/Divergence
- `bollingerBands` — Bollinger Bands
- `atr` — Average True Range
- `adx` — Average Directional Index
- `stochastic` — Stochastic Oscillator
- `williamsR` — Williams %R
- `cci` — Commodity Channel Index
- `obv` — On-Balance Volume
- `vwap` — Volume-Weighted Average Price
- `parabolicSar` — Parabolic SAR (Wilder clamp on the two prior bars)
- `ichimoku` — Ichimoku Kinko Hyo
- `supertrend` — SuperTrend
- `fibonacciRetracement` / `fibonacciExtension` — Fibonacci Retracement and Extension levels

### Risk module

- `kellyFraction`, `expectancy`, `positionSize`, `riskRewardRatio`, `riskOfRuin`, `compoundGrowth`,
  `pipValue` — pure capital/position-sizing mathematics, no market-data dependency.

### Datasets

- `data/*.csv` — 12 reproducible, publicly-sourced daily/intraday series (FRED daily closes for
  equities, forex, oil, the 10-year yield and VIX; Binance daily and 4h klines for BTC/USDT and
  ETH/USDT), each regenerable with `npm run data`. Full provenance in `data/PROVENANCE.md`.

### Evidence

- `evidence/out/*.md` — 16 reproducible, non-trading-result reports (zone shares, run lengths,
  crossover frequency, correlations) describing how each indicator behaves on the datasets above.
  Regenerate with `npm run build && npm run evidence`.

### Tooling

- TypeScript strict build (`tsup`) producing ESM, CJS and type declarations.
- 68 Vitest unit tests covering every indicator, the risk module, and cross-indicator contract checks
  (output length, empty/1-bar input handling).
- GitHub Actions CI: typecheck, test, build on every push and pull request.

### Distribution

Pull requests to community lists are recorded here.
