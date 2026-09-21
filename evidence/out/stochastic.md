# Stochastic Oscillator(14,3,3) behaviour — btcusdt-1d.csv

_This indicator needs open/high/low data, so it is evaluated on `btcusdt-1d.csv` only (the FRED series in this repo are close-only)._

Stochastic Oscillator(14,3,3), slow %K, on 985 valid bars.

- Bars with %K > 80 (overbought zone): 24.77%
- Bars with %K < 20 (oversold zone): 12.39%

## Chart (last 250 bars)

![Stochastic Oscillator(14,3,3) behaviour — btcusdt-1d.csv](./stochastic.svg)

## Dataset

- File: `data/btcusdt-1d.csv`
- Provenance header:

```
# source: Binance public market data (BTCUSDT 1d)
# url: https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000
# downloaded_at: 2026-09-21
# license: Public API; data provided as-is by Binance
```

- Library version: 0.1.0
- Reproduce: `npm run build && npm run evidence`

This describes how the indicator behaved on this sample; it is not a measure of profitability.
