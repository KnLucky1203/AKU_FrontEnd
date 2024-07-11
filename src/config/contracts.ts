import { AVALANCHE } from "./chains";

export const XGMT_EXCLUDED_ACCOUNTS = [
  "0x330eef6b9b1ea6edd620c825c9919dc8b611d5d5",
  "0xd9b1c23411adbb984b1c4be515fafc47a12898b2",
  "0xa633158288520807f91ccc98aa58e0ea43acb400",
  "0xffd0a93b4362052a336a7b22494f1b77018dd34b",
];

const CONTRACTS = {
  [AVALANCHE]: {
    //Goerli Testnet
    Vault: "0x17B08E308D6D1C321C7F907FF38e72BA79767D99", //replaced
    Router: "0x017d74e2E4e7d4F1161957DE8485337ae0BbE8ba", //replaced
    VaultReader: "0xf94aCcec356Fb4Eef24b6F81032983A467A57A54", //replaced
    Reader: "0x3ee2687f451be4ACbC40d2B07DDFC0e353c41419", //replaced
    GlpManager: "0x3F5AffbDd9918D770C7AD646A515C0B3AB5aE0Fa", //replaced
    RewardRouter: "0xc18930a4c514f44167cF5137aDb9e49C8374D896", //replaced
    RewardReader: "0x41c641e7F396d95bf720bfD35B2AabDC017C21e2", //replaced
    NATIVE_TOKEN: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    GLP: "0x10dFdBba0796193D619cBf5e225692c9D867BA63", //replaced
    GMX: "0x26C3Ab789f9de5E321df69875121E5a3de6FE881", //replaced
    ES_GMX: "0x01087E79f8c5c2B62FF0320E5A4eD0c163A983F3", //replaced
    BN_GMX: "0x605EfbEf9Be6421620B5309b3DdFd6aF99E1cc4C", //replaced
    USDG: "0x767Bf831c4e26D5f414B3f8dE615bD188a11c6C7", //replaced
    ES_GMX_IOU: "0x7aC47286172821A74dC8a1E73b5773ccAd8B75a7", // placeholder address

    StakedGmxTracker: "0x3834d766036f2C4AA21Cc7F6DEF88254332C60d9", //replaced
    BonusGmxTracker: "0x6586c3B1fEB9AEe2e6EC8736C60c7534Fe222fA2", //replaced
    FeeGmxTracker: "0xb57960644bce4b89CaAcc17A3F85663E7a487BB4", //replaced
    StakedGlpTracker: "0x885F1b9f8AC4f6181AC23420c233C919508742e1", //replaced
    FeeGlpTracker: "0x01EE694B0710e4Ea3749657c92b8b2cb0CDAf6eF", //replaced

    StakedGmxDistributor: "0x5Adef357d86E4aD7b3b269cd3fF2dA97c48F1792", //replaced
    StakedGlpDistributor: "0xc10447334dB5A391D9E706A7cC9d2Cb6C888461D", //replaced

    GmxVester: "0xE964d7BB749cc1C55087B7625Dcaf8b730Ed9eAF", //replaced
    GlpVester: "0xF869161a3Ec06b47aA904C4790a9A47aA652F67c", //replaced

    OrderBook: "0x71da3e2196c0c632610FE1Ec88998c16B702F664", //replaced
    OrderExecutor: "0x71da3e2196c0c632610FE1Ec88998c16B702F664", //replaced
    OrderBookReader: "0xcb4665Fb134431513985eCC5bf6455d67BD038B6", //replaced

    PositionRouter: "0x6B5a37a69708d36D102962AA70bdf0C973577Ae5", //replaced
    PositionManager: "0xa048982eD6Ec36e2EF20fE7e843fC1e9Fec17DfE", //replaced

    UniswapGmxEthPool: "0xaa9b2ce3ec0eccc79a9c12eda4eda4ed5219d80f", //replaced
    ReferralStorage: "0x7923cC6897D5B846cC88ff35c74C53592C6775Ee", //replaced
    ReferralReader: "0x0C0A903921152994fD0dB8845252D80Ec6D071B8", //replaced
  }
};

export function getContract(chainId: number, name: string): string {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }

  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }

  return CONTRACTS[chainId][name];
}
