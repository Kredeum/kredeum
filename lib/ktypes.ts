type OpenNFTsKeys = "OpenNFTsV2" | "OpenNFTsV1" | "OpenNFTsV0" | "CloneFactory" | "NFTsFactory";
type ErcKeys = "ERC165" |
  "ERC721" | "ERC721TokenReceiver" | "ERC721Metadata" | "ERC721Enumerable" |
  "ERC1155" | "ERC1155TokenReceiver" | "ERC1155Metadata_URI";
type ABIS = {
  [Key in ErcKeys | OpenNFTsKeys]: {
    abi: Array<string>;
    interfaceId?: string;
  };
};

type Address = string;

type Network = {
  chainId: number;
  chainName: string;
  rpcUrls: Array<string>;
  iconUrls?: Array<string>;
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
  nftsFactory?: string;
  eip1559?: boolean;
};

type Collection = {
  openNFTsVersion?: number;
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
  user: string;
  balanceOf?: number;
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
  image_url?: string;
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  background_color?: string;
  attributes?: unknown;
  ipfs?: string;
  origin?: string;
  creator?: string;
  minter?: string;
  cidJson?: string;
  cid?: string;
  nid?: string;
};

export type { Address, Collection, Network, ABIS, Nft, OpenNFTsKeys, ErcKeys };
