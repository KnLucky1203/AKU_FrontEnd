import { useMemo } from "react";
import { gql } from "@apollo/client";
import useSWR from "swr";
import { ethers } from "ethers";

import { USD_DECIMALS, CHART_PERIODS, MEXC_CHART_PERIODS } from "lib/legacy";
import { GMX_STATS_API_URL, MEXC_API_URL } from "config/backend";
import { chainlinkClient } from "lib/subgraph/clients";
import { sleep } from "lib/sleep";
import { formatAmount } from "lib/numbers";
import { AVALANCHE } from "config/chains";

const BigNumber = ethers.BigNumber;

// Ethereum network, Chainlink Aggregator contracts
const FEED_ID_MAP = {
  ETH_USD: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  BNB_USD: "0x5505F871A1eA61C837dA5D068EbBae0d3027C516",
  MATIC_USD: "0xc7eB96040F938F684fB2220f5D78A6aAa0FD71a4"
};
const timezoneOffset = -new Date().getTimezoneOffset() * 60;

function fillGaps(prices, periodSeconds) {
  if (prices.length < 2) {
    return prices;
  }

  const newPrices = [prices[0]];
  let prevTime = prices[0].time;
  for (let i = 1; i < prices.length; i++) {
    const { time, open } = prices[i];
    if (prevTime) {
      let j = (time - prevTime) / periodSeconds - 1;
      while (j > 0) {
        newPrices.push({
          time: time - j * periodSeconds,
          open,
          close: open,
          high: open * 1.0003,
          low: open * 0.9996,
        });
        j--;
      }
    }

    prevTime = time;
    newPrices.push(prices[i]);
  }

  return newPrices;
}

function formatBarInfo(bar) {
  const { t, o: open, c: close, h: high, l: low } = bar;
  return {
    time: t + timezoneOffset,
    open,
    close,
    high,
    low,
  };
}

export async function getChartPricesFromMexc( symbol, period ) {
  // symbol = getNormalizedTokenSymbol(symbol);
  ///// ###### test here
  const endTime = Date.now();
  let startTime = Number(endTime) - Number(CHART_PERIODS[period]) * 150 * 1000;
  const openPriceMode = "LAST_CLOSE";
  const interval = MEXC_CHART_PERIODS[period];
  const apiUrl = `${MEXC_API_URL}?end=${endTime}&interval=${interval}&openPriceMode=${openPriceMode}&start=${startTime}&symbol=${symbol}_USDT`;
  const TIMEOUT = 5000;
  const res = await new Promise(async (resolve, reject) => {
    let done = false;
    setTimeout(() => {
      done = true;
      reject(new Error(`request timeout ${apiUrl}`));
    }, TIMEOUT);

    let lastEx;
    for (let i = 0; i < 3; i++) {
      if (done) return;
      try {
        const res = await fetch(apiUrl);
        resolve(res);
        return;
      } catch (ex) {
        await sleep(300);
        lastEx = ex;
      }
    }
    reject(lastEx);
  });

  if (!res.ok) {
    throw new Error(`mexc request failed ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.code !== 200) {
    throw new Error(`getting data error: code=${json.code}, length=${json.s}`);
  }
  const _prices = [];

  const { t, o, c, h, l } = json.data;
  for (let i = 0; i < json.data.s; i++) {
    _prices.push(
      formatBarInfo({
        t: t[i],
        o: o[i],
        c: c[i],
        h: h[i],
        l: l[i],
      })
    );
  }
  return _prices;
}

async function getChartPricesFromStats(chainId, symbol, period) {
  if (chainId === AVALANCHE) {
    if (symbol === "WETH") return getChartPricesFromMexc("ETH", period);
    if (symbol === "WBNB") return getChartPricesFromMexc("BNB", period);
    if (symbol === "WMATIC") return getChartPricesFromMexc("MATIC", period);
    return getChartPricesFromMexc(symbol, period);
  }

  if (["WETH", "WBNB", "WMATIC"].includes(symbol)) {
    symbol = symbol.substr(1);
  }

  const timeDiff = CHART_PERIODS[period] * 3000;
  const from = Math.floor(Date.now() / 1000 - timeDiff);
  const url = `${GMX_STATS_API_URL}/candles/${symbol}?preferableChainId=${chainId}&period=${period}&from=${from}&preferableSource=fast`;

  const TIMEOUT = 5000;
  const res = await new Promise(async (resolve, reject) => {
    let done = false;
    setTimeout(() => {
      done = true;
      reject(new Error(`request timeout ${url}`));
    }, TIMEOUT);

    let lastEx;
    for (let i = 0; i < 3; i++) {
      if (done) return;
      try {
        const res = await fetch(url);
        resolve(res);
        return;
      } catch (ex) {
        await sleep(300);
        lastEx = ex;
      }
    }
    reject(lastEx);
  });
  if (!res.ok) {
    throw new Error(`request failed ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  let prices = json?.prices;
  if (!prices || prices.length < 10) {
    throw new Error(`not enough prices data: ${prices?.length}`);
  }

  const OBSOLETE_THRESHOLD = Date.now() / 1000 - 60 * 30; // 30 min ago
  const updatedAt = json?.updatedAt || 0;
  if (updatedAt < OBSOLETE_THRESHOLD) {
    throw new Error(
      "chart data is obsolete, last price record at " +
        new Date(updatedAt * 1000).toISOString() +
        " now: " +
        new Date().toISOString()
    );
  }

  prices = prices.map(({ t, o: open, c: close, h: high, l: low }) => ({
    time: t + timezoneOffset,
    open,
    close,
    high,
    low,
  }));
  return prices;
}

function getCandlesFromPrices(prices, period) {
  const periodTime = CHART_PERIODS[period];

  if (prices.length < 2) {
    return [];
  }

  const candles = [];
  const first = prices[0];
  let prevTsGroup = Math.floor(first[0] / periodTime) * periodTime;
  let prevPrice = first[1];
  let o = prevPrice;
  let h = prevPrice;
  let l = prevPrice;
  let c = prevPrice;
  for (let i = 1; i < prices.length; i++) {
    const [ts, price] = prices[i];
    const tsGroup = Math.floor(ts / periodTime) * periodTime;
    if (prevTsGroup !== tsGroup) {
      candles.push({ t: prevTsGroup + timezoneOffset, o, h, l, c });
      o = c;
      h = Math.max(o, c);
      l = Math.min(o, c);
    }
    c = price;
    h = Math.max(h, price);
    l = Math.min(l, price);
    prevTsGroup = tsGroup;
  }

  return candles.map(({ t: time, o: open, c: close, h: high, l: low }) => ({
    time,
    open,
    close,
    high,
    low,
  }));
}

function getChainlinkChartPricesFromGraph(tokenSymbol, period) {
  if (["WETH", "WBNB", "WMATIC"].includes(tokenSymbol)) {
    tokenSymbol = tokenSymbol.substr(1);
  }

  const marketName = tokenSymbol + "_USD";
  const feedId = FEED_ID_MAP[marketName];
  if (!feedId) {
    throw new Error(`undefined marketName ${marketName}`);
  }

  const PER_CHUNK = 1000;
  const CHUNKS_TOTAL = 6;
  const requests = [];
  for (let i = 0; i < CHUNKS_TOTAL; i++) {
    const query = gql(`{
      rounds(
        first: ${PER_CHUNK},
        skip: ${i * PER_CHUNK},
        orderBy: unixTimestamp,
        orderDirection: desc,
        where: {feed: "${feedId}"}
      ) {
        unixTimestamp,
        value
      }
    }`);
    requests.push(chainlinkClient.query({ query }));
  }

  return Promise.all(requests)
    .then((chunks) => {
      let prices = [];
      const uniqTs = new Set();
      chunks.forEach((chunk) => {
        chunk.data.rounds.forEach((item) => {
          if (uniqTs.has(item.unixTimestamp)) {
            return;
          }

          uniqTs.add(item.unixTimestamp);
          prices.push([item.unixTimestamp, Number(item.value) / 1e8]);
        });
      });

      prices.sort(([timeA], [timeB]) => timeA - timeB);
      prices = getCandlesFromPrices(prices, period);
      return prices;
    })
    .catch((err) => {
      console.error(err);
    });
}

export function useChartPrices(chainId, symbol, isStable, period, currentAveragePrice) {
  const swrKey = !isStable && symbol ? ["getChartCandles", chainId, symbol, period] : null;
  let { data: prices, mutate: updatePrices } = useSWR(swrKey, {
    fetcher: async (...args) => {
      try {
        return await getChartPricesFromStats(chainId, symbol, period);
      } catch (ex) {
        console.warn(ex);
        console.warn("Switching to graph chainlink data");
        try {
          return await getChainlinkChartPricesFromGraph(symbol, period);
        } catch (ex2) {
          console.warn("getChainlinkChartPricesFromGraph failed");
          console.warn(ex2);
          return [];
        }
      }
    },
    dedupingInterval: 60000,
    focusThrottleInterval: 60000 * 10,
  });

  const currentAveragePriceString = currentAveragePrice && currentAveragePrice.toString();
  const retPrices = useMemo(() => {
    if (isStable) {
      return getStablePriceData(period);
    }

    if (!prices) {
      return [];
    }

    let _prices = [...prices];
    if (currentAveragePriceString && prices.length) {
      _prices = appendCurrentAveragePrice(_prices, BigNumber.from(currentAveragePriceString), period);
    }

    return fillGaps(_prices, CHART_PERIODS[period]);
  }, [prices, isStable, currentAveragePriceString, period]);

  return [retPrices, updatePrices];
}

function appendCurrentAveragePrice(prices, currentAveragePrice, period) {
  const periodSeconds = CHART_PERIODS[period];
  const currentCandleTime = Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds + timezoneOffset;
  const last = prices[prices.length - 1];
  const averagePriceValue = parseFloat(formatAmount(currentAveragePrice, USD_DECIMALS, 2));
  if (currentCandleTime === last.time) {
    last.close = averagePriceValue;
    last.high = Math.max(last.high, averagePriceValue);
    last.low = Math.max(last.low, averagePriceValue);
    return prices;
  } else {
    const newCandle = {
      time: currentCandleTime,
      open: last.close,
      close: averagePriceValue,
      high: averagePriceValue,
      low: averagePriceValue,
    };
    return [...prices, newCandle];
  }
}

function getStablePriceData(period) {
  const periodSeconds = CHART_PERIODS[period];
  const now = Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds;
  let priceData = [];
  for (let i = 100; i > 0; i--) {
    priceData.push({
      time: now - i * periodSeconds,
      open: 1,
      close: 1,
      high: 1,
      low: 1,
    });
  }
  return priceData;
}
