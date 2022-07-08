import type { NftType } from "./ktypes";

import NftStorage from "./knft-storage";
import { ipfsGatewayUrl, textShort, DEFAULT_NAME } from "./kconfig";

let nftStorage: NftStorage;

///////////////////////////////////////////////////////////////////////////////////
// GET ipfs image link
const nftMint1IpfsImage = async (image: string, key = ""): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);
  const ipfsImage = `ipfs://${await nftStorage.pinUrl(image)}`;

  // console.log("nftMint ipfs image", ipfsImage);
  return ipfsImage;
};

// GET ipfs metadata url
const nftMint2IpfsJson = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  ipfs = "",
  storageAnimationUrl = "",
  address = "",
  image = "",
  metadata = "{}"
): Promise<string> => {
  // console.log("nftMint2IpfsJson", name, ipfs, address, image, metadata);

  const json = {
    name,
    description: nftDescription || name || "",
    image: ipfsGatewayUrl(ipfs),
    ipfs,
    origin: textShort(image, 140),
    minter: address
  } as NftType;
  if (storageAnimationUrl) json.animation_url = storageAnimationUrl;
  if (metadata) json.metadata = JSON.parse(metadata);

  const ipfsCid = await nftStorage.pinJson(json);
  const ipfsJson = `ipfs://${ipfsCid}`;

  // console.log("nftMint ipfs metadata", ipfsJson);
  return ipfsJson;
};

export { nftMint1IpfsImage, nftMint2IpfsJson };
