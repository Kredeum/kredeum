import type { Properties } from "../common/types";

import { DEFAULT_NAME } from "../common/config";
import { swarmConfigValid, swarmPin, swarmTokenUri } from "../storage/swarm";
import { ipfsConfigValid, ipfsPin, ipfsTokenUri } from "../storage/ipfs";

///////////////////////////////////////////////////////////////////////////////////
// GET  image uri
const nftPin = async (chainId: number, media: string): Promise<string> => {
  if (ipfsConfigValid(chainId)) return ipfsPin(media);
  if (swarmConfigValid(chainId)) return swarmPin(media);
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
  animation_url = "",
  pdfUri = ""
): Promise<string> => {
  let nftTokenUriFunc;
  if (ipfsConfigValid(chainId)) nftTokenUriFunc = ipfsTokenUri;
  if (swarmConfigValid(chainId)) nftTokenUriFunc = swarmTokenUri;

  return nftTokenUriFunc
    ? nftTokenUriFunc(name, nftDescription, imageUri, address, image, metadata, properties, animation_url, pdfUri)
    : "";
};

export { nftPin, nftTokenUri };
