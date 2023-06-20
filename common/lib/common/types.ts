import type { ExternalProvider } from "@ethersproject/providers";
import type { EthereumProvider } from "hardhat/types";
import { BigNumber } from "ethers";

type WindowEthereumProvider = Window & typeof globalThis & { ethereum: EthereumProvider };
type WindowExternalProvider = Window & typeof globalThis & { ethereum: ExternalProvider };

type AddressesType = {
  OpenNFTs: string;
  OpenNFTsV4: string;
  OpenNFTsResolver: string;
  OpenNFTsFactoryV3: string;
  OpenNFTsFactoryV2?: string;
  OpenNFTsFactory?: string;
  OpenAutoMarket: string;
  OpenBound?: string;
};

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
  infura?: { url?: string; active: boolean };
  alchemy?: { url?: string; active: boolean };
  moralis?: { active: boolean; url?: string; id?: string };
  covalent?: { active: boolean; url?: string; key?: string };
  mainnet?: boolean;
  testnet?: boolean;
  create?: boolean;
  admin?: string;
  blur?: string;
  openSea?: string;
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
  supports?: Map<string, boolean>;
  chainName?: string;
  startBlock?: number;
  description?: string;
  version?: number;
  template?: string;
  open?: boolean;
  royalty?: ReceiverType;
  royaltyEnforcement?: boolean;
  price?: BigNumber;
};

type CollectionFilterType = { owner?: string; tokenID?: string; offset?: number; limit?: number };

///////////////////////////////////////////////////
// Exclusives storage parameters for Ipfs | Swarm
///////////////////////////////////////////////////
type Without<T> = { [P in keyof T]?: undefined };
type XOR<T, U> = (Without<T> & U) | (Without<U> & T);

////////
type IpfsMetadataType = {
  ipfs?: string;
  ipfsJson?: string;
};

type SwarmMetadataType = {
  swarm?: string;
  swarmJson?: string;
};

////////
type StorageMetadataType = XOR<IpfsMetadataType, SwarmMetadataType>;

///////////////////////////////////////////////////
// Upload storage Options parameters for Ipfs | Swarm | arweave
///////////////////////////////////////////////////
type StorageParamsType = {
  apiEndpoint: string;
  apiKey: string;
  gateway: string;
};

type StorageConfigType = {
  default: string;
  ipfs?: StorageParamsType;
  swarm?: StorageParamsType;
  arweave?: StorageParamsType;
};

type StorageType = "ipfs" | "swarm" | "arweave";

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
} & StorageMetadataType;

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
} & StorageMetadataType;

type Property = {
  name: string;
  value: string;
  display_value: string;
};

type Properties = { [k: string]: Property };

type RefPageType = {
  chainId?: number;
  address?: string;
  tokenID?: string;
  account?: string;
  signer?: string;
  action?: string;
  chainName?: string;
};

export type {
  WindowEthereumProvider,
  WindowExternalProvider,
  NetworkType,
  AddressesType,
  NftType,
  Properties,
  CollectionType,
  CollectionFilterType,
  ReceiverType,
  NftMetadata,
  StorageType,
  StorageParamsType,
  StorageConfigType,
  RefPageType
};
