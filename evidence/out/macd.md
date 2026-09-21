# MACD(12,26,9) behaviour — sp500-daily.csv

MACD(12,26,9) computed on the closing-price series (2488 valid bars).

- Signal-line crossovers: 216 total, 8.68 per 100 bars
- Median bars between crossovers: 9

## Chart (last 250 bars)

![MACD(12,26,9) behaviour — sp500-daily.csv](./macd.svg)

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
