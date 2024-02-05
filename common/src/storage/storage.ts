/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Storage cid from ipfs or swarm
// => gataway url of ipfs or swarm

import { NftType, StorageConfigType, StorageParamsType, StorageType } from "../common/types";
import { ipfsGateway, ipfsGatewayUrl, ipfsLinkToUrlHttp, ipfsGetLink } from "./ipfs";
import { swarmGateway, swarmGatewayUrl, swarmLinkToUrlHttp, swarmGetLink } from "./swarm";
import config from "@kredeum/config/dist/config.json";
import { localStorageGet, localStorageSet } from "../common/local";

// IN MEMORY Storage Config
let _storageConfig: StorageConfigType;

// SET storage config TO localStorage if available
const storageConfigSet = (storageConfig: StorageConfigType): void => {
  _storageConfig = storageConfig;

  localStorageSet("storage", JSON.stringify(storageConfig));
};

// GET storage config FROM localStorage or config.json
const storageConfigGet = (): StorageConfigType => {
  if (_storageConfig) return _storageConfig;

  _storageConfig = config.storage;

  local: {
    const locStorage = localStorageGet("storage");
    if (!locStorage) break local;

    const parseStorage = JSON.parse(locStorage) as StorageConfigType;
    if (!parseStorage) break local;

    for (const [key, value] of Object.entries(parseStorage)) {
      if (key == "default") _storageConfig.default = value as string;
      else if (key == "ipfs" || key == "swarm" || key == "arweave")
        Object.assign(_storageConfig[key] as StorageParamsType, value);
    }
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

const storageUriGetImage = (nft: NftType): string => (nft.ipfs ? nft.ipfs : nft.swarm ? nft.swarm : nft.image || "");
/////////////////////////////////////////////////////////////////////////////////////////////////////

const storageLinkToUri = (link?: string): string => {
  if (!link) return "";
  if (link.startsWith(ipfsGateway())) return ipfsGetLink(link);
  if (link.startsWith(swarmGateway())) return swarmGetLink(link);
  return "";
};

export {
  storageUriGetImage,
  storageLinkToUrlHttp,
  storageGatewayUrl,
  storageParamsGet,
  storageDefault,
  storageConfigGet,
  storageConfigSet,
  storageParamsValid,
  storageLinkToUri
};
