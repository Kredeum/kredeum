import type { Properties } from "@lib/common/types";

import { DEFAULT_NAME } from "@lib/common/config";
import { nftSwarmImageUri, nftSwarmTokenUri } from "./nft-swarm";
import { nftIpfsImageUri, nftIpfsTokenUri } from "./nft-ipfs";

const _nftStorageGet = (): string => {
  let storage = "";

  if (typeof localStorage !== "undefined") {
    storage = localStorage.getItem("storage") || "";
  }

  return storage || "ipfs";
};

const _nftStorageSet = (storage: string): void => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("storage", storage);
  }
};

_nftStorageSet("swarm");

///////////////////////////////////////////////////////////////////////////////////
// GET  image uri
const nftImageUri = async (image: string, key = ""): Promise<string> => {
  const nftImageUriFunc = _nftStorageGet() == "ipfs" ? nftIpfsImageUri : nftSwarmImageUri;
  return nftImageUriFunc(image, key);
};

// GET  metadata uri
const nftTokenUri = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  imageUri = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = ""
): Promise<string> => {
  const nftTokenUriFunc = _nftStorageGet() == "ipfs" ? nftIpfsTokenUri : nftSwarmTokenUri;
  return nftTokenUriFunc(name, nftDescription, imageUri, address, image, metadata, properties, animation_url);
};

export { nftImageUri, nftTokenUri };
