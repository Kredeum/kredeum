/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Storage cid from ipfs or swarm
// => gataway url of ipfs or swarm

import { NftType, StorageConfigType, StorageParamsType, StorageType } from "@lib/common/types";
import { ipfsGateway, ipfsGatewayUrl, ipfsLinkToUrlHttp } from "./ipfs";
import { swarmGateway, swarmGatewayUrl, swarmLinkToUrlHttp } from "./swarm";
import config from "@config/config.json";

// IN MEMORY Storage Config
let _storageConfig: StorageConfigType;

// SET storage config TO localStorage if available
const storageConfigSet = (storageConfig: StorageConfigType): void => {
  _storageConfig = storageConfig;

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("storage", JSON.stringify(storageConfig));
  }
};

// GET storage config FROM localStorage or config.json
const storageConfigGet = (): StorageConfigType => {
  if (_storageConfig) return _storageConfig;

  _storageConfig = config.storage;

  local: if (typeof localStorage !== "undefined") {
    const locStorage = localStorage.getItem("storage");
    if (!locStorage) break local;

    const parseStorage = JSON.parse(locStorage) as StorageConfigType;
    if (!parseStorage) break local;

    Object.assign(_storageConfig, parseStorage);
  }

  // console.log("storageConfigGet ~ _storageConfig:", _storageConfig);
  return _storageConfig;
};

// GET storage default
const storageDefault = (): string => storageConfigGet().default;

// GET storage params
const storageParamsGet = (type: StorageType): StorageParamsType | undefined => {
  if (type == "ipfs") return storageConfigGet()?.ipfs || undefined;
  if (type == "swarm") return storageConfigGet()?.swarm || undefined;
  return undefined;
};

const storageParamsValid = (storageParams: StorageParamsType | undefined): boolean =>
  Boolean(storageParams?.apiKey && storageParams?.apiEndpoint && storageParams?.gateway);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const storageGatewayUrl = (link: string): string =>
  link.startsWith("ipfs://") ? ipfsGatewayUrl(link) : link.startsWith("swarm://") ? swarmGatewayUrl(link) : link;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs or swarm ( uri | http uri )
// => gateway url for ipfs or swarm
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const storageLinkToUrlHttp = (link: string): string => {
  if (!link) return "";
  if (link.startsWith("ipfs://") || link.startsWith(ipfsGateway())) return ipfsLinkToUrlHttp(link);
  if (link.startsWith("swarm://") || link.startsWith(swarmGateway())) return swarmLinkToUrlHttp(link);
  return link;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const storageUriToUrl = (uri: string) => {
  const [storage, hash] = uri.split("://");
  if (!(storage && hash)) return uri;

  const configStorage = config.storage[storage as "swarm" | "ipfs"];
  if (!configStorage?.gateway) return uri;

  return `${configStorage.gateway}/${hash}`;
};

const storageUriGetImage = (nft: NftType): string => (nft.ipfs ? nft.ipfs : nft.swarm ? nft.swarm : nft.image || "");
/////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  storageUriGetImage,
  storageLinkToUrlHttp,
  storageGatewayUrl,
  storageUriToUrl,
  storageParamsGet,
  storageDefault,
  storageConfigGet,
  storageConfigSet,
  storageParamsValid
};
