import type { ExternalProvider } from "@ethersproject/providers";
import type { EthereumProvider } from "hardhat/types";
import { BigNumber } from "ethers";

type WindowEthereumProvider = Window & typeof globalThis & { ethereum: EthereumProvider };
type WindowExternalProvider = Window & typeof globalThis & { ethereum: ExternalProvider };

type IOpenNFTsKeys = "IOpenNFTsV4" | "IOpenNFTsV3" | "IOpenNFTsV2" | "IOpenNFTsV1" | "IOpenNFTsV0";
type IErcKeys = "IERC165" | "IERC721" | "IERC721Metadata" | "IERC721Enumerable" | "IERC1155" | "IERC1155MetadataURI";
type AbiType = { abi: Array<string>; interfaceId?: string };
type ABIS = IErcKeys | IOpenNFTsKeys;

type NetworkWriteableFieldsType =
  | "openNFTs"
  | "nftsFactory"
  | "nftsFactoryV2"
  | "nftsFactoryV3"
  | "nftsResolver"
  | "openBound";

type NetworkType = {
  chainId: number;
  chainName: string;
  rpcUrls: Array<string>;
  iconUrls?: Array<string>;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: Array<string>;
  etherscanApiKey?: string;
  hardhatOptions?: unknown;
  subgraph?: { url?: string; startBlock?: number; active?: boolean };
  alchemy?: { url?: string; active: boolean };
  moralis?: { active: boolean; url?: string };
  covalent?: { active: boolean };
  mainnet?: boolean;
  testnet?: boolean;
  create?: boolean;
  admin?: string;
  openSea?: string;
  openMulti?: string;
  openBound?: string;
  openNFTs?: string;
  nftsFactory?: string;
  nftsFactoryV2?: string;
  nftsFactoryV3?: string;
  nftsResolver?: string;
  eip1559?: boolean;
};

type ReceiverType = {
  account?: string;
  fee?: number;
  minimum?: BigNumber;
};

type CollectionType = {
  chainId: number;
  address: string;
  owner?: string;
  name?: string;
  symbol?: string;
  totalSupply?: number;
  balancesOf?: Map<string, number>;
  approvedForAll?: Map<string, boolean>;
  supports?: CollectionSupports;
  chainName?: string;
  startBlock?: number;
  description?: string;
  version?: number;
  template?: string;
  open?: boolean;
  minimal?: boolean;
  royalty?: ReceiverType;
  price?: BigNumber;
};

type CollectionSupports = {
  IERC165?: boolean;

  IERC721?: boolean;
  IERC721Metadata?: boolean;
  IERC721Enumerable?: boolean;
  IERC721TokenReceiver?: boolean;

  IERC1155?: boolean;
  IERC1155MetadataURI?: boolean;
  IERC1155TokenReceiver?: boolean;

  IERC173?: boolean;
  IERC2981?: boolean;

  IOpenNFTs?: boolean;
  IOpenChecker?: boolean;
  IOpenCloneable?: boolean;
  IOpenMarketable?: boolean;
  IOpenPauseable?: boolean;

  ICloneFactoryV2?: boolean;
  INFTsFactoryV2?: boolean;
  IOpenNFTsFactoryV3?: boolean;

  IOpenNFTsV0?: boolean;
  IOpenNFTsV1?: boolean;
  IOpenNFTsV2?: boolean;
  IOpenNFTsV3?: boolean;
  IOpenNFTsV4?: boolean;
  IOpenAutoMarket?: boolean;
  IOpenBound?: boolean;
};

///////////////////////////////////////////////////
// Exclusives storage parameters for Ipfs | Swarm
///////////////////////////////////////////////////
type Without<T> = { [P in keyof T]?: undefined };
type XOR<T, U> = (Without<T> & U) | (Without<U> & T);

////////
type ipfsType = {
  ipfs?: string;
  ipfsJson?: string;
};

type swarmType = {
  swarm?: string;
  swarmJson?: string;
};

////////
type storageType = XOR<ipfsType, swarmType>;

///////////////////////////////////////////////////

type NftMetadata = {
  name?: string;
  description?: string;
  creator?: string;
  minter?: string;
  owner?: string;
  image?: string;
  image_url?: string;
  animation_url?: string;
  properties?: Properties;
} & storageType;

type NftType = {
  chainId: number;
  address: string;
  tokenID: string;
  tokenURI?: string;
  owner?: string;
  approved?: string;
  chainName?: string;
  name?: string;
  description?: string;
  tokenJson?: NftMetadata;
  metadata?: NftMetadata | unknown;
  image?: string;
  image_url?: string;
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  background_color?: string;
  attributes?: unknown;
  origin?: string;
  creator?: string;
  minter?: string;
  nid?: string;
  contentType?: string;
  royalty?: ReceiverType;
  price?: BigNumber;
  collection?: CollectionType;
  properties?: Properties;
} & storageType;

type Property = {
  name: string;
  value: string;
  display_value: string;
};

type Properties = { [k: string]: Property };

export type {
  WindowEthereumProvider,
  WindowExternalProvider,
  NetworkType,
  NftType,
  Properties,
  CollectionType,
  ReceiverType,
  AbiType,
  NetworkWriteableFieldsType,
  CollectionSupports,
  ABIS,
  NftMetadata,
  IOpenNFTsKeys,
  IErcKeys
};
