# Ichimoku Kinko Hyo behaviour — btcusdt-1d.csv

_This indicator needs open/high/low data, so it is evaluated on `btcusdt-1d.csv` only (the FRED series in this repo are close-only)._

Ichimoku Kinko Hyo default settings, close vs. cloud (Senkou A/B), on 923 valid bars.

- Bars with close above the cloud: 44.75%
- Bars with close inside the cloud: 17.44%
- Bars with close below the cloud: 37.81%

## Chart (last 250 bars)

![Ichimoku Kinko Hyo behaviour — btcusdt-1d.csv](./ichimoku.svg)

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
