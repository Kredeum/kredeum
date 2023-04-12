import type { Properties } from "@lib/common/types";

import { DEFAULT_NAME } from "@lib/common/config";
import { nftSwarmImageUri, nftSwarmTokenUri } from "./nft-swarm";
import { nftIpfsImageUri, nftIpfsTokenUri } from "./nft-ipfs";

// temporary
const _storage = "ipfs";

///////////////////////////////////////////////////////////////////////////////////
// GET  image uri
const nftImageUri = async (image: string, key = ""): Promise<string> => {
  const nftImageUriFunc = _storage == "ipfs" ? nftIpfsImageUri : nftSwarmImageUri;
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
  const nftTokenUriFunc = _storage == "ipfs" ? nftIpfsTokenUri : nftSwarmTokenUri;
  return nftTokenUriFunc(name, nftDescription, imageUri, address, image, metadata, properties, animation_url);
};

export { nftImageUri, nftTokenUri };