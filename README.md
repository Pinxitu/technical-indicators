# @tradingcompendium/technical-indicators

Dependency-free TypeScript implementations of the 16 technical indicators documented at
[tradingcompendium.com](https://tradingcompendium.com), plus a small risk/position-sizing module. Every
formula is hand-verifiable against the article it implements (Wilder's Wilder-smoothing, Bollinger's
population standard deviation, Appel's MACD, and so on) and against `tests/` (72 passing tests). No
runtime dependencies, no bundled market data beyond the reproducible samples in `data/`, no network
calls — you can read every function top to bottom in a few minutes.

## Install

Not published to npm. Install straight from GitHub:

```bash
npm install github:Pinxitu/technical-indicators
```

Installing from GitHub runs the build automatically (`prepare`).

## Usage

```typescript
import { rsi, sma, macd } from '@tradingcompendium/technical-indicators'

const closes = [100, 101, 99, 102, 105, 103, 107, 110, 108, 111, 109, 112, 115, 113, 116]

const rsi14 = rsi(closes, { period: 14 })
const sma20 = sma(closes, { period: 20 })
const { macd: line, signal, histogram } = macd(closes, { fast: 12, slow: 26, signal: 9 })

console.log(rsi14.at(-1), sma20.at(-1), line.at(-1), signal.at(-1), histogram.at(-1))
```

Indicators that need more than the close (ATR, ADX, Stochastic, Williams %R, CCI, Parabolic SAR,
Ichimoku, SuperTrend, OBV, VWAP) take an array of `Candle` objects (`{ time, open, high, low, close,
volume? }`) instead of a plain number array. Every output array has the same length as the input;
positions inside the warm-up window are `NaN` (see [Design rules](#design-rules) for the full NaN
contract, including behaviour on non-finite input).

## Indicators

| Function | Defaults | Article (EN) | Article (ES) | Evidence report |
|---|---|---|---|---|
| `sma` | period 20 | [Simple Moving Average](https://tradingcompendium.com/en/technical-indicators/moving-average-simple) | [Media móvil simple (SMA)](https://tradingcompendium.com/es/indicadores-tecnicos/media-movil-simple-sma) | [sma.md](./evidence/out/sma.md) |
| `ema` | period 20 | [Exponential Moving Average](https://tradingcompendium.com/en/technical-indicators/moving-average-exponential) | [Media móvil exponencial (EMA)](https://tradingcompendium.com/es/indicadores-tecnicos/media-movil-exponencial-ema) | [ema.md](./evidence/out/ema.md) |
| `rsi` | period 14 | [RSI](https://tradingcompendium.com/en/technical-indicators/rsi) | [RSI](https://tradingcompendium.com/es/indicadores-tecnicos/rsi-indice-fuerza-relativa) | [rsi-eurusd.md](./evidence/out/rsi-eurusd.md), [rsi-btcusdt.md](./evidence/out/rsi-btcusdt.md) |
| `macd` | fast 12, slow 26, signal 9 | [MACD](https://tradingcompendium.com/en/technical-indicators/macd) | [MACD (convergencia/divergencia)](https://tradingcompendium.com/es/indicadores-tecnicos/macd-convergencia-divergencia) | [macd.md](./evidence/out/macd.md) |
| `bollingerBands` | period 20, multiplier 2 | [Bollinger Bands](https://tradingcompendium.com/en/technical-indicators/bollinger-bands) | [Bandas de Bollinger](https://tradingcompendium.com/es/indicadores-tecnicos/bandas-de-bollinger) | [bollinger.md](./evidence/out/bollinger.md) |
| `atr` | period 14 | [ATR (Average True Range)](https://tradingcompendium.com/en/technical-indicators/atr-average-true-range) | [ATR (rango verdadero medio)](https://tradingcompendium.com/es/indicadores-tecnicos/atr-average-true-range) | [atr.md](./evidence/out/atr.md) |
| `adx` | period 14 | [ADX (Average Directional Index)](https://tradingcompendium.com/en/technical-indicators/adx-average-directional-index) | [ADX (índice direccional medio)](https://tradingcompendium.com/es/indicadores-tecnicos/adx-average-directional-index) | [adx.md](./evidence/out/adx.md) |
| `stochastic` | kPeriod 14, kSmooth 3, dPeriod 3 | [Stochastic Oscillator](https://tradingcompendium.com/en/technical-indicators/stochastic-oscillator) | [Oscilador estocástico](https://tradingcompendium.com/es/indicadores-tecnicos/oscilador-estocastico) | [stochastic.md](./evidence/out/stochastic.md) |
| `williamsR` | period 14 | [Williams %R](https://tradingcompendium.com/en/technical-indicators/williams-r-percent-range) | [Williams %R](https://tradingcompendium.com/es/indicadores-tecnicos/williams-r-percent-range) | [williams-r.md](./evidence/out/williams-r.md) |
| `cci` | period 20 | [CCI (Commodity Channel Index)](https://tradingcompendium.com/en/technical-indicators/cci-commodity-channel-index) | [CCI (índice de canal de materias primas)](https://tradingcompendium.com/es/indicadores-tecnicos/cci-commodity-channel-index) | [cci.md](./evidence/out/cci.md) |
| `obv` | none | [OBV (On-Balance Volume)](https://tradingcompendium.com/en/technical-indicators/obv-on-balance-volume) | [OBV (volumen en balance)](https://tradingcompendium.com/es/indicadores-tecnicos/obv-on-balance-volume) | [obv.md](./evidence/out/obv.md) |
| `vwap` | anchorEvery 0 (no reset) | [VWAP](https://tradingcompendium.com/en/technical-indicators/vwap-volume-weighted-average-price) | [VWAP](https://tradingcompendium.com/es/indicadores-tecnicos/vwap-volume-weighted-average-price) | [vwap.md](./evidence/out/vwap.md) |
| `parabolicSar` | step 0.02, max 0.2 | [Parabolic SAR](https://tradingcompendium.com/en/technical-indicators/parabolic-sar-stop-and-reverse) | [Parabolic SAR](https://tradingcompendium.com/es/indicadores-tecnicos/parabolic-sar-stop-and-reverse) | [parabolic-sar.md](./evidence/out/parabolic-sar.md) |
| `ichimoku` | tenkan 9, kijun 26, senkouB 52, displacement 26 | [Ichimoku Kinko Hyo](https://tradingcompendium.com/en/technical-indicators/ichimoku-cloud-kinko-hyo) | [Ichimoku Kinko Hyo](https://tradingcompendium.com/es/indicadores-tecnicos/ichimoku-cloud-kinko-hyo) | [ichimoku.md](./evidence/out/ichimoku.md) |
| `supertrend` | period 10, multiplier 3 | [SuperTrend](https://tradingcompendium.com/en/technical-indicators/supertrend-indicator) | [SuperTrend](https://tradingcompendium.com/es/indicadores-tecnicos/supertrend-indicator) | [supertrend.md](./evidence/out/supertrend.md) |
| `fibonacciRetracement` / `fibonacciExtension` | levels: 0, .236, .382, .5, .618, .786, 1 (retracement); 1.272, 1.618, 2.618 (extension) | [Fibonacci Retracement](https://tradingcompendium.com/en/technical-indicators/fibonacci-retracement) | [Retrocesos de Fibonacci](https://tradingcompendium.com/es/indicadores-tecnicos/retrocesos-de-fibonacci) | not applicable — no time series to sample, `tests/fibonacci.test.ts` covers it |

See [`docs/formulas.md`](./docs/formulas.md) for the formula and primary source of each indicator, and
[`docs/platform-defaults.md`](./docs/platform-defaults.md) for how these defaults compare against
TradingView, MetaTrader 5, and StockCharts.

## Risk module

Pure functions with no market-data dependency — capital and position-sizing mathematics only. None of
them produce or assume any trading result; `riskOfRuin` and `kellyFraction` describe the mathematics of
an edge you supply, they do not estimate one.

| Function | Article (EN) | Article (ES) |
|---|---|---|
| `kellyFraction` | [Kelly Criterion](https://tradingcompendium.com/en/trading-mathematics/kelly-criterion) | [Criterio de Kelly](https://tradingcompendium.com/es/matematicas-del-trading/criterio-de-kelly) |
| `expectancy` | [Trading Expectancy](https://tradingcompendium.com/en/trading-mathematics/trading-expectancy) | [Expectativa matemática](https://tradingcompendium.com/es/matematicas-del-trading/expectativa-matematica) |
| `positionSize` | [Position Sizing](https://tradingcompendium.com/en/trading-mathematics/position-sizing) | [Tamaño de posición](https://tradingcompendium.com/es/matematicas-del-trading/tamano-de-posicion) |
| `riskRewardRatio` | [Risk/Reward Ratio](https://tradingcompendium.com/en/risk-capital-management/risk-reward-ratio) | [Ratio riesgo/beneficio](https://tradingcompendium.com/es/gestion-riesgo-capital/ratio-riesgo-beneficio) |
| `riskOfRuin` | [Risk of Ruin](https://tradingcompendium.com/en/trading-mathematics/risk-of-ruin) | [Riesgo de ruina](https://tradingcompendium.com/es/matematicas-del-trading/riesgo-de-ruina) |
| `compoundGrowth` | [Compound Interest](https://tradingcompendium.com/en/trading-mathematics/compound-interest) | [Interés compuesto](https://tradingcompendium.com/es/matematicas-del-trading/interes-compuesto) |
| `pipValue` | [Trading Glossary — pip](https://tradingcompendium.com/en/trading-glossary#pip) | [Glosario de trading — pip](https://tradingcompendium.com/es/glosario-trading#pip) |

## Datasets

`data/*.csv` are small, reproducible, publicly-sourced samples (FRED daily closes; Binance daily/4h
klines) used only to generate `evidence/out/*.md` — human-readable reports of how each indicator
actually behaves on real data (bars in each zone, run lengths, crossover frequency; never a win rate or
a return). Full provenance, licences, and refresh instructions are in
[`data/PROVENANCE.md`](./data/PROVENANCE.md). Regenerate everything with:

```bash
npm run build && npm run evidence
```

## Design rules

- **NaN warm-up, not a shorter array.** Every indicator returns an array the same length as its input.
  Positions before the warm-up period completes are `NaN`, so callers can zip an indicator's output back
  against the original candle array by index without ever re-deriving an offset.
- **The NaN contract.** Input series must be finite. Only the warm-up is `NaN`. A non-finite value
  inside the series is propagated as `NaN` by every indicator for at least that bar; window-based
  indicators recover after the window passes, Wilder/EMA-based ones carry it forward.
- **First valid index.** Window indicators (`sma`, `ema`, `bollingerBands`, `cci`, `williamsR`,
  `stochastic` fast %K) emit from index `period − 1`. Wilder-on-differences indicators (`rsi`, `adx`
  +DI/−DI) emit from index `period`. `atr` includes `TR[0] = high − low` and therefore emits from
  `period − 1` — its seed differs from TA-Lib/TradingView (which start TR at bar 1) by about 1.5% at the
  first value, decaying below 0.2% after ~50 bars. `macd`'s line emits from `slow − 1`, its signal from
  `slow + signal − 2`. `adx` itself emits from `2·period − 1`.
- **Wilder smoothing where Wilder defined it.** ATR and ADX/DMI use Wilder's original running-average
  smoothing (`prev·(n−1)/n + x/n`), not a plain SMA or EMA, matching Wilder (1978) and what
  TradingView/MetaTrader/StockCharts all implement by default.
- **Population standard deviation in Bollinger Bands.** The band width uses `σ` over the window
  (divide by `n`, not `n−1`) — this is what Bollinger (2001) and every mainstream platform's default
  Bollinger Bands setting uses; a sample standard deviation would produce visibly wider bands.

## Contributing

Issues and pull requests are welcome. Before opening one: `npm run typecheck && npm test && npm run
build` must pass locally (the same three steps CI runs — see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).
Changes to an indicator's formula should point to a primary source (see
[`docs/formulas.md`](./docs/formulas.md) for the sources already used) rather than another library's
implementation, and should not introduce any trading-result claim (win rate, return, drawdown) anywhere
in code, tests, comments or docs.

## Licence

MIT — see [`LICENSE`](./LICENSE). Copyright Trading Compendium.
