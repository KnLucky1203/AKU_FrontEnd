import { ethers } from "ethers";
import { getContract } from "./contracts";
import { AVALANCHE } from "./chains";
import { Token } from "domain/tokens";

export const TOKENS: { [chainId: number]: Token[] } = {
  [AVALANCHE]: [
    {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero,
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      isNative: true,
      isShortable: true,
    },
    {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      isWrapped: true,
      isShortable: true,
      baseSymbol: "ETH",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "Wrapped BNB",
      symbol: "WBNB",
      decimals: 18,
      address: "0x101Cc87B4655412B873AA2f135d0c0b92889A0B5",
      isWrapped: false,
      isShortable: true,
      baseSymbol: "WBNB",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "Wrapped MATIC",
      symbol: "WMATIC",
      decimals: 18,
      address: "0xAf7548a13Be5781e68DF81e3b6D2c5fEb795EFdD",
      isWrapped: false,
      isShortable: true,
      baseSymbol: "WMATIC",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0x7d578cF9A9D39a8bc88C59357E58318fb39F16d4",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      isStable: true,
    },
    {
      name: "A",
      symbol: "A",
      decimals: 18,
      address: "0x2127327E5eA259550F6070517EF0d6Dc541E07d3",
      isWrapped: false,
      isShortable: true,
      baseSymbol: "A",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    }
  ]
};

export const ADDITIONAL_TOKENS: { [chainId: number]: Token[] } = {
  [AVALANCHE]: [
    {
      name: "$SEVEN",
      symbol: "$SEVEN",
      address: getContract(AVALANCHE, "GMX"),
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    {
      name: "Escrowed SEVEN",
      symbol: "esGMX",
      address: getContract(AVALANCHE, "ES_GMX"),
      decimals: 18,
    },
    {
      name: "GMX LP",
      symbol: "$SLP",
      address: getContract(AVALANCHE, "GLP"),
      decimals: 18,
      imageUrl: "https://github.com/zomi/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  ],
};

export const PLATFORM_TOKENS: { [chainId: number]: { [symbol: string]: Token } } = {
  [AVALANCHE]: {
    GMX: {
      name: "SEVEN",
      symbol: "$SEVEN",
      decimals: 18,
      address: getContract(AVALANCHE, "GMX"),
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    GLP: {
      name: "SEVEN LP",
      symbol: "$SLP",
      decimals: 18,
      address: getContract(AVALANCHE, "StakedGlpTracker"), // address of fsGLP token because user only holds fsGLP
      imageUrl: "https://github.com/zomi/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  },
};

export const ICONLINKS = {
  [AVALANCHE]: {
    GMX: {
      coingecko: "https://www.coingecko.com/en/coins/gmx",
      arbitrum: "https://arbiscan.io/address/0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
    },
    GLP: {
      arbitrum: "https://arbiscan.io/token/0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    },
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/ethereum",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      arbitrum: "https://arbiscan.io/address/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    },
  },
};

export const GLP_POOL_COLORS = {
  ETH: "#6062a6",
  USDT: "#67B18A",
  LINK: "#3256D6",
};

export const TOKENS_MAP: { [chainId: number]: { [address: string]: Token } } = {};
export const TOKENS_BY_SYMBOL_MAP: { [chainId: number]: { [symbol: string]: Token } } = {};
export const WRAPPED_TOKENS_MAP: { [chainId: number]: Token } = {};
export const NATIVE_TOKENS_MAP: { [chainId: number]: Token } = {};

const CHAIN_IDS = [AVALANCHE];

for (let j = 0; j < CHAIN_IDS.length; j++) {
  const chainId = CHAIN_IDS[j];
  TOKENS_MAP[chainId] = {};
  TOKENS_BY_SYMBOL_MAP[chainId] = {};
  let tokens = TOKENS[chainId];
  if (ADDITIONAL_TOKENS[chainId]) {
    tokens = tokens.concat(ADDITIONAL_TOKENS[chainId]);
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    TOKENS_MAP[chainId][token.address] = token;
    TOKENS_BY_SYMBOL_MAP[chainId][token.symbol] = token;
  }
}

for (const chainId of CHAIN_IDS) {
  for (const token of TOKENS[chainId]) {
    if (token.isWrapped) {
      WRAPPED_TOKENS_MAP[chainId] = token;
    } else if (token.isNative) {
      NATIVE_TOKENS_MAP[chainId] = token;
    }
  }
}

export function getWrappedToken(chainId: number) {
  return WRAPPED_TOKENS_MAP[chainId];
}

export function getNativeToken(chainId: number) {
  return NATIVE_TOKENS_MAP[chainId];
}

export function getTokens(chainId: number) {
  return TOKENS[chainId];
}

export function isValidToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  return address in TOKENS_MAP[chainId];
}
export function getToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  if (!TOKENS_MAP[chainId][address]) {
    throw new Error(`Incorrect address "${address}" for chainId ${chainId}`);
  }
  return TOKENS_MAP[chainId][address];
}

export function getTokenBySymbol(chainId: number, symbol: string) {
  const token = TOKENS_BY_SYMBOL_MAP[chainId][symbol];
  if (!token) {
    throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`);
  }
  return token;
}

export function getWhitelistedTokens(chainId: number) {
  return TOKENS[chainId].filter((token) => token.symbol !== "USDG");
}

export function getVisibleTokens(chainId: number) {
  return getWhitelistedTokens(chainId).filter((token) => !token.isWrapped && !token.isTempHidden);
}
