type KredeumKeys = "KredeumV2" | "KredeumV1" | "KredeumV0" | "CloneFactory" | "NFTsFactory";
type ErcKeys = "ERC165" | "ERC721" | "ERC721TokenReceiver" | "ERC721Metadata" | "ERC721Enumerable";
type ABIS = {
  [Key in ErcKeys | KredeumKeys]: Array<string>;
};

type Contract = {
  chainId: string;
  address: string;
  name?: string;
  chainName?: string;
  interfaces?: Array<string>;
  symbol?: string;
  totalSupply?: number;
  startBlock?: number;
  description?: string;
};

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
  openNFTs?: string;
  nftsFactory?: string;
};

type NftMetadata = {
  name?: string;
  description?: string;
  image?: string;
  cid?: string;
  creator?: string;
  minter?: string;
  owner?: string;
};

type NftData = {
  tokenID: string;
  tokenURI: string;
  owner: string;
  chainId: string;
  chainName?: string;
  name?: string;
  description?: string;
  metadata?: NftMetadata;
  image?: string;
  contract?: string;
  creator?: string;
  minter?: string;
  cid?: string;
  nid?: string;
};

export type { Contract, Network, ABIS, NftMetadata, NftData, KredeumKeys, ErcKeys };
