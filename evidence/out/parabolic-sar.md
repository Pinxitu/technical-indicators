# Parabolic SAR behaviour — btcusdt-1d.csv

_This indicator needs open/high/low data, so it is evaluated on `btcusdt-1d.csv` only (the FRED series in this repo are close-only)._

Parabolic SAR default settings on 999 bars with an established trend.

- Trend flips: 85 total, 8.51 per 100 bars
- Median trend-segment duration: 11 bars

## Chart (last 250 bars)

![Parabolic SAR behaviour — btcusdt-1d.csv](./parabolic-sar.svg)

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
