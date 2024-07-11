import { AVALANCHE } from "config/chains";
import { getContract } from "config/contracts";

const AVALANCHE_GMX = getContract(AVALANCHE, "GMX").toLowerCase();

type Exchange = {
  name: string;
  icon: string;
  networks: number[];
  link?: string;
  links?: { [AVALANCHE]: string };
};

export const EXTERNAL_LINKS = {
  [AVALANCHE]: {
    networkWebsite: "https://www.avax.network/",
    buyGmx: {
      uniswap: `https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=${AVALANCHE_GMX}`,
    },
  },
};

export const TRANSFER_EXCHANGES: Exchange[] = [
  {
    name: "Avalanche",
    icon: "ic_avalanche_24.svg",
    networks: [AVALANCHE],
    link: "https://bridge.avalanche.io/",
  },
  {
    name: "Hop",
    icon: "ic_hop.svg",
    networks: [AVALANCHE],
    link: "https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=avalanche",
  },
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    networks: [AVALANCHE],
    link: "https://multitx.bungee.exchange",
  },
  {
    name: "Multiswap",
    icon: "ic_multiswap.svg",
    networks: [AVALANCHE],
    link: "https://app.multichain.org/#/router",
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    networks: [AVALANCHE],
    link: "https://o3swap.com/",
  },
  {
    name: "Across",
    icon: "ic_across.svg",
    networks: [AVALANCHE],
    link: "https://across.to/",
  },
];

export const CENTRALISED_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    link: "https://www.binance.com/en/trade/GMX_USDT?_from=markets",
    networks: [AVALANCHE],
  },
  {
    name: "Bybit",
    icon: "ic_bybit.svg",
    link: "https://www.bybit.com/en-US/trade/spot/GMX/USDT",
    networks: [AVALANCHE],
  },
  {
    name: "Kucoin",
    icon: "ic_kucoin.svg",
    link: "https://www.kucoin.com/trade/GMX-USDT",
    networks: [AVALANCHE],
  },
  {
    name: "Huobi",
    icon: "ic_huobi.svg",
    link: "https://www.huobi.com/en-us/exchange/gmx_usdt/",
    networks: [AVALANCHE],
  },
];

export const DECENTRALISED_AGGRIGATORS: Exchange[] = [
  {
    name: "1inch",
    icon: "ic_1inch.svg",
    links: {
      [AVALANCHE]: "https://app.1inch.io/#/43114/unified/swap/ETH/GMX",
    },
    networks: [AVALANCHE],
  },
  {
    name: "Paraswap",
    icon: "ic_paraswap.svg",
    links: {
      [AVALANCHE]: "https://app.paraswap.io/#/?network=avalanche",
    },
    networks: [AVALANCHE],
  },
  {
    name: "Firebird",
    icon: "ic_firebird.png",
    link: "https://app.firebird.finance/swap",
    networks: [AVALANCHE],
  },
  {
    name: "OpenOcean",
    icon: "ic_openocean.svg",
    links: {
      [AVALANCHE]: "https://app.openocean.finance/CLASSIC#/AVALANCHE/ETH/GMX",
    },
    networks: [AVALANCHE],
  },
  {
    name: "Odos",
    icon: "ic_odos.png",
    link: "https://app.odos.xyz/",
    networks: [AVALANCHE],
  },
  {
    name: "Slingshot",
    icon: "ic_slingshot.svg",
    link: "https://app.slingshot.finance/swap/ETH",
    networks: [AVALANCHE],
  },
];
