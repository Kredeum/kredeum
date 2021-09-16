import networksJson from "../networks.json";

type Network = {
  chainId: string;
  chainName: string;
  rpcUrls: Array<string>;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: Array<string>;
  subgraph?: {
    url?: string;
    startBlock?: number;
    active?: boolean;
  };
  covalent?: { active: boolean };
  type?: string;
  admin?: string;
  openSea?: { assets?: string; kredeum?: string };
  nftsFactory?: string;
};

const networks = networksJson as Array<Network>;

export { networks };
export type { Network };
