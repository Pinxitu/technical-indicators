# Bollinger Bands(20,2) behaviour — sp500-daily.csv

Bollinger Bands(20, 2σ) computed on the closing-price series (2494 valid bars).

- Closes outside the bands (above upper or below lower): 10.87%
- Theoretical figure for a **normal distribution** at ±2σ: **4.6%** (this is the textbook value under a
  normality assumption, not an observation from this sample — it is cited here only for comparison)

## Chart (last 250 bars)

![Bollinger Bands(20,2) behaviour — sp500-daily.csv](./bollinger.svg)

## Dataset

- File: `data/sp500-daily.csv`
- Provenance header:

```
# source: FRED, Federal Reserve Bank of St. Louis (S&P 500 index, daily close, last 10 years per S&P licence)
# url: https://fred.stlouisfed.org/graph/fredgraph.csv?id=SP500
# downloaded_at: 2026-09-21
# license: Free use with attribution; see https://fred.stlouisfed.org/legal/
```

- Library version: 0.1.0
- Reproduce: `npm run build && npm run evidence`

This describes how the indicator behaved on this sample; it is not a measure of profitability.
