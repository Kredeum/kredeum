type KredeumKeys = "KredeumV2" | "KredeumV1" | "KredeumV0" | "CloneFactory" | "NFTsFactory";
type ErcKeys = "ERC165" | "ERC721" | "ERC721TokenReceiver" | "ERC721Metadata" | "ERC721Enumerable";
type ABIS = {
  [Key in ErcKeys | KredeumKeys]: Array<string>;
};

type Network = {
  chainId: number;
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
  openNFTs?: string;
  costClone?: number;
  nftsFactory?: string;
  eip1559?: boolean;
};

type Collection = {
  chainId: number;
  address: string;
  owner?: string;
  name?: string;
  symbol?: string;
  chainName?: string;
  interfaces?: Array<string>;
  totalSupply?: number;
  startBlock?: number;
  description?: string;
};

type Nft = {
  chainId: number;
  collection: string;
  tokenID: string;
  tokenURI: string;
  owner: string;
  chainName?: string;
  name?: string;
  contractName?: string;
  description?: string;
  metadata?: any;
  image?: string;
  ipfs?: string;
  origin?: string;
  creator?: string;
  minter?: string;
  cid?: string;
  nid?: string;
};

export type { Collection, Network, ABIS, Nft, KredeumKeys, ErcKeys };
