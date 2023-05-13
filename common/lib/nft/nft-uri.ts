import type { Properties } from "@lib/common/types";

import { DEFAULT_NAME } from "@lib/common/config";
import { swarmConfigValid, swarmImageUri, swarmTokenUri } from "./storage/swarm";
import { ipfsConfigValid, ipfsImageUri, ipfsTokenUri } from "./storage/ipfs";

///////////////////////////////////////////////////////////////////////////////////
// GET  image uri
const nftImageUri = async (chainId: number, image: string): Promise<string> => {
  if (ipfsConfigValid()) return ipfsImageUri(image);
  if (swarmConfigValid(chainId)) return swarmImageUri(image);
  return "";
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
  let nftTokenUriFunc;
  if (ipfsConfigValid()) nftTokenUriFunc = ipfsTokenUri;
  if (swarmConfigValid(chainId)) nftTokenUriFunc = swarmTokenUri;

  return nftTokenUriFunc
    ? nftTokenUriFunc(name, nftDescription, imageUri, address, image, metadata, properties, animation_url)
    : "";
};

export { nftImageUri, nftTokenUri };
