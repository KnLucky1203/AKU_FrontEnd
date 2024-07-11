import { createClient } from "./utils";
import { SUBGRAPH_URLS } from "config/subgraph";
import { AVALANCHE } from "config/chains";

export const chainlinkClient = createClient(SUBGRAPH_URLS.common.chainLink);

export const avalancheGraphClient = createClient(SUBGRAPH_URLS[AVALANCHE].stats);
export const avalancheReferralsGraphClient = createClient(SUBGRAPH_URLS[AVALANCHE].referrals);
export const nissohGraphClient = createClient(SUBGRAPH_URLS[AVALANCHE].trades);

export function getGmxGraphClient(chainId: number) {
  if (chainId === AVALANCHE) {
    return avalancheGraphClient;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}
