import type { Properties } from "@lib/common/types";

import { DEFAULT_NAME, isTestnet } from "@lib/common/config";
import { nftSwarmImageUri, nftSwarmTokenUri } from "./nft-swarm";
import { nftIpfsImageUri, nftIpfsTokenUri } from "./nft-ipfs";

const nftStorageGet = (): string => localStorage?.getItem("storage") || "ipfs";

const nftStorageSet = (storage: string): void => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("storage", storage);
  }
};

///////////////////////////////////////////////////////////////////////////////////
// GET  image uri
const nftImageUri = async (chainId: number, image: string, key = ""): Promise<string> => {
  const nftImageUriFunc = nftStorageGet() == "swarm" && isTestnet(chainId) ? nftSwarmImageUri : nftIpfsImageUri;
  return nftImageUriFunc(image, key);
};

// GET  metadata uri
const nftTokenUri = async (
  chainId: number,
  name = DEFAULT_NAME,
  nftDescription = "",
  imageUri = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = ""
): Promise<string> => {
  const nftTokenUriFunc = nftStorageGet() == "swarm" && isTestnet(chainId) ? nftSwarmTokenUri : nftIpfsTokenUri;
  return nftTokenUriFunc(name, nftDescription, imageUri, address, image, metadata, properties, animation_url);
};

export { nftImageUri, nftTokenUri, nftStorageGet, nftStorageSet };
