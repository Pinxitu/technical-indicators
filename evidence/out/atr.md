# ATR(14) behaviour — btcusdt-1d.csv

_This indicator needs open/high/low data, so it is evaluated on `btcusdt-1d.csv` only (the FRED series in this repo are close-only)._

ATR(14) / close ratio on 987 valid bars.

- Median: 3.58%
- p10: 2.5%
- p90: 5.02%

## Chart (last 250 bars)

![ATR(14) behaviour — btcusdt-1d.csv](./atr.svg)

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
