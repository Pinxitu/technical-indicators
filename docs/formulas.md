# Formulas and sources

One section per indicator: the formula this library implements, the default parameters `src/index.ts`
exposes, and the primary source the formula is attributed to. Authors, years, titles and publishers are
copied verbatim from `src/content/references.ts` in the tradingcompendium.com repository (the site's own
verified bibliography) — nothing here is a new bibliographic claim.

## Simple Moving Average — `sma`

$$\text{SMA}_n(t) = \frac{1}{n} \sum_{i=t-n+1}^{t} P_i$$

- Default: `period = 20`
- Source: Brock, William; Lakonishok, Josef; LeBaron, Blake (1992). *Simple Technical Trading Rules and
  the Stochastic Properties of Stock Returns*. The Journal of Finance, Vol. 47, No. 5, pp. 1731-1764.
  https://doi.org/10.1111/j.1540-6261.1992.tb04681.x

## Exponential Moving Average — `ema`

$$k = \frac{2}{n+1}, \qquad \text{EMA}_t = P_t \cdot k + \text{EMA}_{t-1} \cdot (1-k)$$

Seeded with the simple average of the first `n` values (this library's convention; the seed method is
not itself part of the cited sources' formula).

- Default: `period = 20`
- Sources: Brock, William; Lakonishok, Josef; LeBaron, Blake (1992). *Simple Technical Trading Rules and
  the Stochastic Properties of Stock Returns*. The Journal of Finance, Vol. 47, No. 5, pp. 1731-1764.
  https://doi.org/10.1111/j.1540-6261.1992.tb04681.x
  Murphy, John J. (1999). *Technical Analysis of the Financial Markets*. New York Institute of Finance.
  https://archive.org/details/technicalanalysi0000murp

## Relative Strength Index — `rsi`

$$\text{RS} = \frac{\text{Wilder-smoothed average gain}}{\text{Wilder-smoothed average loss}}, \qquad \text{RSI} = 100 - \frac{100}{1 + \text{RS}}$$

- Default: `period = 14`
- Source: Wilder, J. Welles (1978). *New Concepts in Technical Trading Systems*. Trend Research.
  https://archive.org/details/newconceptsintec00wild

## MACD — `macd`

$$\text{MACD} = \text{EMA}_{\text{fast}} - \text{EMA}_{\text{slow}}, \qquad \text{Signal} = \text{EMA}_{\text{signal}}(\text{MACD}), \qquad \text{Histogram} = \text{MACD} - \text{Signal}$$

- Default: `fast = 12`, `slow = 26`, `signal = 9`
- Source: Appel, Gerald (2005). *Technical Analysis: Power Tools for Active Investors*. FT Prentice Hall
  (Financial Times Prentice Hall), Upper Saddle River, NJ.
  https://books.google.com/books/about/Technical_Analysis.html?id=RFYIAAAACAAJ

## Bollinger Bands — `bollingerBands`

$$\text{Middle} = \text{SMA}_n, \qquad \text{Upper} = \text{Middle} + k\sigma_{\text{pop}}, \qquad \text{Lower} = \text{Middle} - k\sigma_{\text{pop}}$$

$$\%B = \frac{P - \text{Lower}}{\text{Upper} - \text{Lower}}, \qquad \text{Bandwidth} = \frac{\text{Upper} - \text{Lower}}{\text{Middle}}$$

`\sigma_{\text{pop}}` is the **population** standard deviation over the rolling window (divide by `n`,
not `n-1`) — see [Design rules in the README](../README.md#design-rules).

- Default: `period = 20`, `multiplier = 2`
- Source: Bollinger, John A. (2001). *Bollinger on Bollinger Bands*. McGraw-Hill.
  https://books.google.com/books/about/Bollinger_on_Bollinger_Bands.html?id=FLlxAz85iysC

## Average True Range — `atr`

$$\text{TR}_t = \max(H_t - L_t,\ |H_t - C_{t-1}|,\ |L_t - C_{t-1}|), \qquad \text{ATR} = \text{Wilder-smoothed}(\text{TR}, n)$$

Wilder smoothing: seed = simple average of the first `n` true-range values, then
`prev·(n-1)/n + \text{TR}_t/n` for each subsequent bar.

- Default: `period = 14`
- Source: Wilder, J. Welles (1978). *New Concepts in Technical Trading Systems*. Trend Research.
  https://archive.org/details/newconceptsintec00wild

## Average Directional Index — `adx`

$$+\text{DM}_t = \max(H_t - H_{t-1}, 0) \text{ if } H_t - H_{t-1} > L_{t-1} - L_t \text{, else } 0$$
$$-\text{DM}_t = \max(L_{t-1} - L_t, 0) \text{ if } L_{t-1} - L_t > H_t - H_{t-1} \text{, else } 0$$
$$+\text{DI} = 100 \cdot \frac{\text{Wilder-smoothed}(+\text{DM})}{\text{Wilder-smoothed}(\text{TR})}, \qquad -\text{DI} = 100 \cdot \frac{\text{Wilder-smoothed}(-\text{DM})}{\text{Wilder-smoothed}(\text{TR})}$$
$$\text{DX} = 100 \cdot \frac{|+\text{DI} - {-\text{DI}}|}{+\text{DI} + {-\text{DI}}}, \qquad \text{ADX} = \text{Wilder-smoothed}(\text{DX}, n)$$

- Default: `period = 14`
- Source: Wilder, J. Welles (1978). *New Concepts in Technical Trading Systems*. Trend Research.
  https://archive.org/details/newconceptsintec00wild

## Stochastic Oscillator — `stochastic`

$$\%K_{\text{fast}} = 100 \cdot \frac{C - LL_n}{HH_n - LL_n}, \qquad \%K = \text{SMA}_{\text{kSmooth}}(\%K_{\text{fast}}), \qquad \%D = \text{SMA}_{\text{dPeriod}}(\%K)$$

`HH_n`/`LL_n` are the highest high / lowest low over the last `kPeriod` bars.

- Default: `kPeriod = 14`, `kSmooth = 3`, `dPeriod = 3`
- Source: Lane, George C. (1984). *Lane's Stochastics*. Technical Analysis of Stocks & Commodities,
  Vol. 2. (No stable URL in the site's bibliography.)

## Williams %R — `williamsR`

$$\%R = -100 \cdot \frac{HH_n - C}{HH_n - LL_n}$$

Bounded to `[-100, 0]`.

- Default: `period = 14`
- Source: Williams, Larry R. (1979). *How I Made One Million Dollars Last Year Trading Commodities*.
  Windsor Books, Brightwaters, NY.
  https://openlibrary.org/books/OL4452976M/How_I_made_one_million_dollars_last_year_trading_commodities

## Commodity Channel Index — `cci`

$$\text{TP} = \frac{H + L + C}{3}, \qquad \text{CCI} = \frac{\text{TP} - \text{SMA}_n(\text{TP})}{0.015 \cdot \text{MD}_n}$$

`MD_n` is the mean absolute deviation of `TP` from its `n`-period simple average.

- Default: `period = 20`
- Source: Lambert, Donald R. (1980). *Commodity Channel Index: Tool for Trading Cyclic Trends*.
  Commodities Magazine (now Futures Magazine), October 1980.
  https://store.traders.com/-v01-c05-comm-pdf.html

## On-Balance Volume — `obv`

$$\text{OBV}_t = \text{OBV}_{t-1} + \begin{cases} +V_t & C_t > C_{t-1} \\ -V_t & C_t < C_{t-1} \\ 0 & C_t = C_{t-1} \end{cases}$$

- Default: none (no period parameter; cumulative running total from the first bar)
- Source: Granville, Joseph E. (1963). *Granville's New Key to Stock Market Profits*. Prentice-Hall.
  https://books.google.com/books/about/Granville_s_New_Key_to_Stock_Market_Prof.html?id=21ukDwAAQBAJ

## VWAP — `vwap`

$$\text{TP}_t = \frac{H_t + L_t + C_t}{3}, \qquad \text{VWAP}_t = \frac{\sum \text{TP}_i \cdot V_i}{\sum V_i}$$

The sum runs from the start of the series, or resets every `anchorEvery` bars when that option is set.

- Default: `anchorEvery = 0` (no reset — cumulative from the first bar)
- Source: Berkowitz, Stephen A.; Logue, Dennis E.; Noser, Eugene A. Jr. (1988). *The Total Cost of
  Transactions on the NYSE*. The Journal of Finance, Vol. 43, No. 1, pp. 97-112.
  https://doi.org/10.1111/j.1540-6261.1988.tb02591.x

## Parabolic SAR — `parabolicSar`

$$\text{SAR}_{t+1} = \text{SAR}_t + \text{AF} \cdot (\text{EP} - \text{SAR}_t)$$

`AF` (acceleration factor) starts at `step`, increases by `step` on each new extreme point (`EP`) up to
`max`, and resets to `step` on every trend reversal. A long SAR may never exceed the two prior bars'
lows (a short SAR may never fall below the two prior bars' highs) — the unconditional two-bar clamp from
Wilder's original rule, applied with no exception for the leg's first bar. Known deviation: on reversal
the new SAR is set to the prior extreme point without clamping it into the reversal bar's range (TA-Lib
does clamp).

- Default: `step = 0.02`, `max = 0.2`
- Source: Wilder, J. Welles (1978). *New Concepts in Technical Trading Systems*. Trend Research.
  https://archive.org/details/newconceptsintec00wild

## Ichimoku Kinko Hyo — `ichimoku`

$$\text{Tenkan} = \frac{HH_{9} + LL_{9}}{2}, \qquad \text{Kijun} = \frac{HH_{26} + LL_{26}}{2}$$
$$\text{Senkou A}_{t} = \frac{\text{Tenkan}_{t} + \text{Kijun}_{t}}{2} \text{ shifted forward by } 26, \qquad \text{Senkou B}_{t} = \frac{HH_{52} + LL_{52}}{2} \text{ shifted forward by } 26$$

- Default: `tenkan = 9`, `kijun = 26`, `senkouB = 52`, `displacement = 26`
- Source: Hosoda, Goichi (Ichimoku Sanjin) (1969). *Ichimoku Kinko Hyo*. Tokyo (original Japanese
  publication; system developed over preceding decades).
  Elliott, Nicole (2007). *Ichimoku Charts: An Introduction to Ichimoku Kinko Clouds*. Harriman House.
  https://books.google.com/books/about/Ichimoku_Charts.html?id=UMvZAgAAQBAJ

## SuperTrend — `supertrend`

$$\text{Basic Upper} = \frac{H+L}{2} + \text{multiplier} \cdot \text{ATR}_n, \qquad \text{Basic Lower} = \frac{H+L}{2} - \text{multiplier} \cdot \text{ATR}_n$$

The final upper/lower bands only tighten toward price (never widen while the trend holds), and
SuperTrend flips to the opposite band — and the trend direction reverses — the first time the close
crosses it.

- Default: `period = 10`, `multiplier = 3`
- Sources: Wilder, J. Welles (1978). *New Concepts in Technical Trading Systems*. Trend Research (ATR,
  the basis of SuperTrend's bands). https://archive.org/details/newconceptsintec00wild
  Originator: Olivier Seban. Platform documentation: TradingView, *Supertrend* help page.
  https://www.tradingview.com/support/solutions/43000634738-supertrend/

## Fibonacci Retracement / Extension — `fibonacciRetracement`, `fibonacciExtension`

$$\text{Retracement}(l) = H - l \cdot (H - L) \quad \text{(uptrend swing; mirrored for a downtrend swing)}$$
$$\text{Extension}(l) = H + (l - 1) \cdot (H - L) \quad \text{(uptrend swing; mirrored for a downtrend swing)}$$

- Default retracement levels: `0, 0.236, 0.382, 0.5, 0.618, 0.786, 1`
- Default extension levels: `1.272, 1.618, 2.618`
- Sources: Fibonacci, Leonardo (Leonardo Pisano) (1202). *Liber Abaci* (modern translation: Sigler, L. E.,
  *Fibonacci's Liber Abaci*, Springer, 2002). https://link.springer.com/book/10.1007/978-1-4613-0079-3
  Murphy, John J. (1999). *Technical Analysis of the Financial Markets*. New York Institute of Finance.
  https://archive.org/details/technicalanalysi0000murp
