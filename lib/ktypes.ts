type OpenNFTsKeys = "OpenNFTsV2" | "OpenNFTsV1" | "OpenNFTsV0" | "CloneFactory" | "NFTsFactory";
type ErcKeys = "ERC165" | "ERC721" | "ERC721TokenReceiver" | "ERC721Metadata" | "ERC721Enumerable";
type ABIS = {
  [Key in ErcKeys | OpenNFTsKeys]: Array<string>;
};

type Address = string;

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
  mainnet?: boolean;
  testnet?: boolean;
  create?: boolean;
  admin?: string;
  openSea?: { assets?: string; openNFTs?: string };
  openNFTs?: string;
  costClone?: number;
  nftsFactory?: string;
  eip1559?: boolean;
};

type Collection = {
  openNFTsVersion: number;
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
  metadata?: unknown;
  image?: string;
  ipfs?: string;
  origin?: string;
  creator?: string;
  minter?: string;
  cidJson?: string;
  cid?: string;
  nid?: string;
};

export type { Address, Collection, Network, ABIS, Nft, OpenNFTsKeys, ErcKeys };
