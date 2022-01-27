type OpenNFTsKeys =
  | "OpenNFTs"
  | "OpenNFTsV3"
  | "OpenNFTsV2"
  | "OpenNFTsV1"
  | "OpenNFTsV0"
  | "CloneFactory"
  | "NFTsFactory";
type ErcKeys =
  | "ERC165"
  | "ERC721"
  | "ERC721TokenReceiver"
  | "ERC721Metadata"
  | "ERC721Enumerable"
  | "ERC1155"
  | "ERC1155TokenReceiver"
  | "ERC1155Metadata_URI";
type AbiType = { abi: Array<string>; interfaceId?: string };
type ABIS = {
  [Key in ErcKeys | OpenNFTsKeys]: AbiType;
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
  user?: string;
  balanceOf?: number;
  supports?: CollectionSupports;
};
type CollectionSupports = {
  ERC165?: boolean;
  ERC721?: boolean;
  ERC1155?: boolean;
  ERC721TokenReceiver?: boolean;
  ERC721Metadata?: boolean;
  ERC721Enumerable?: boolean;
  ERC1155TokenReceiver?: boolean;
  ERC1155Metadata_URI?: boolean;
  OpenNFTs?: boolean;
  OpenNFTsV1?: boolean;
  OpenNFTsV2?: boolean;
  OpenNFTsV3?: boolean;
};

type NftMetadata = {
  name?: string;
  description?: string;
  creator?: string;
  minter?: string;
  owner?: string;
  image?: string;
  image_url?: string;
  ipfs?: string;
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
  tokenJson?: NftMetadata;
  metadata?: NftMetadata;
  image?: string;
  image_url?: string;
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  background_color?: string;
  attributes?: unknown;
  ipfs?: string;
  ipfsJson?: string;
  origin?: string;
  creator?: string;
  minter?: string;
  nid?: string;
  contentType?: string;
};

export type {
  Address,
  Collection,
  CollectionSupports,
  Network,
  ABIS,
  AbiType,
  Nft,
  NftMetadata,
  OpenNFTsKeys,
  ErcKeys
};
