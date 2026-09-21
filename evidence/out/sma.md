# SMA(50) behaviour — sp500-daily.csv

Close price vs. SMA(50) on the closing-price series (2464 valid bars).

- Bars with close above SMA(50): 73.58%
- Crossovers (close crossing SMA(50)): 154 total, 6.25 per 100 bars
- Median bars between crossovers: 3
- Mean run length of a "close above SMA(50)" regime: 23.24 bars (78 regimes observed)

## Chart (last 250 bars)

![SMA(50) behaviour — sp500-daily.csv](./sma.svg)

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
