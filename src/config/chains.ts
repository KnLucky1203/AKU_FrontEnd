import { ethers } from "ethers";
import { isDevelopment } from "lib/legacy";

const { parseEther } = ethers.utils;

export const AVALANCHE = 5;

export const DEFAULT_CHAIN_ID = AVALANCHE;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [AVALANCHE];

if (isDevelopment()) {
  SUPPORTED_CHAIN_IDS.push(AVALANCHE);
}

export const IS_NETWORK_DISABLED = {
  [AVALANCHE]: false
};

export const CHAIN_NAMES_MAP = {
  [AVALANCHE]: "Goerli Test"
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [AVALANCHE]: 4
};

export const MAX_GAS_PRICE_MAP = {
  [AVALANCHE]: 0
};

export const HIGH_EXECUTION_FEES_MAP = {
  [AVALANCHE]: 3
};

const constants = {
  [AVALANCHE]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDT",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  }
};

const ALCHEMY_WHITELISTED_DOMAINS = ["gmx.io", "app.gmx.io"];

export const AVALANCHE_RPC_PROVIDERS = [getDefaultAvalancheRpcUrl()];

export const RPC_PROVIDERS = {
  [AVALANCHE]: AVALANCHE_RPC_PROVIDERS
};

export const FALLBACK_PROVIDERS = {
  [AVALANCHE]: [getAvalancheHttpUrl()]
};

export const NETWORK_METADATA = {
  [AVALANCHE]: {
    chainId: "0x" + AVALANCHE.toString(16),
    chainName: "GoerliTestnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: AVALANCHE_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(AVALANCHE)],
  }
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getDefaultAvalancheRpcUrl() {
  return "https://ethereum-goerli.publicnode.com";
}

export function getAvalancheHttpUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "https://ethereum-goerli.publicnode.com";
  }
  return "https://ethereum-goerli.publicnode.com";
}

export function getAvalancheWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://ethereum-goerli.publicnode.com";
  }
  return "wss://ethereum-goerli.publicnode.com";
}

export function getExplorerUrl(chainId) {
  if (chainId === AVALANCHE) {
    return "https://goerli.etherscan.io/";
  }
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
