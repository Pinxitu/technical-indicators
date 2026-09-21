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
- 72 Vitest unit tests covering every indicator, the risk module, and cross-indicator contract checks
  (output length, empty/1-bar input handling).
- GitHub Actions CI: typecheck, test, build on every push and pull request.

### Changed

- S&P 500, DJIA, NASDAQ Composite and VIX series are not redistributed: FRED tags all four
  "Copyrighted: Pre-Approval Required" (S&P Dow Jones Indices / Nasdaq, Inc. / Cboe Global Markets hold
  the copyright). `npm run data` still fetches them for local reproduction, but writes them to the
  gitignored `data/local/` instead of `data/`. The evidence reports that used to run on `sp500-daily.csv`
  (RSI, MACD, Bollinger Bands, SMA, EMA) now run on `eurusd-daily.csv` (FRED `DEXUSEU`, public domain)
  instead; the OHLCV reports continue to use `btcusdt-1d.csv`.

### Distribution

None yet.
