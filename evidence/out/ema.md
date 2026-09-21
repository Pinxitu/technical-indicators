# EMA(20) behaviour — eurusd-daily.csv

Close price vs. EMA(20) on the closing-price series (6926 valid bars).

- Bars with close above EMA(20): 49.78%
- Crossovers (close crossing EMA(20)): 888 total, 12.82 per 100 bars
- Median bars between crossovers: 4
- Mean run length of a "close above EMA(20)" regime: 7.77 bars (444 regimes observed)

## Chart (last 250 bars)

![EMA(20) behaviour — eurusd-daily.csv](./ema.svg)

## Dataset

- File: `data/eurusd-daily.csv`
- Provenance header:

```
# source: FRED, Federal Reserve Bank of St. Louis (US Dollars per Euro, noon buying rates NY)
# url: https://fred.stlouisfed.org/graph/fredgraph.csv?id=DEXUSEU
# downloaded_at: 2026-09-21
# license: Public domain (U.S. federal government work: Board of Governors of the Federal Reserve System / U.S. Energy Information Administration); cite FRED, Federal Reserve Bank of St. Louis, series DEXUSEU — https://fred.stlouisfed.org/legal/
```

- Library version: 0.1.0
- Reproduce: `npm run build && npm run evidence`

This describes how the indicator behaved on this sample; it is not a measure of profitability.
