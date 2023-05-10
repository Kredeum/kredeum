import type { NftType, Properties, StorageOptionType } from "@lib/common/types";

import NftStorage from "@lib/nft/storage/nft-storage";
import { ipfsGatewayUrl, textShort, DEFAULT_NAME } from "@lib/common/config";

let nftStorage: NftStorage;

///////////////////////////////////////////////////////////////////////////////////
// GET ipfs image uri
const nftIpfsImageUri = async (
  image: string,
  storageOption: StorageOptionType = { default: "ipfs" }
): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(storageOption?.ipfs?.apiKey || "");
  const ipfsImageCid = await nftStorage.pinUrl(image);
  const ipfsImageUri = ipfsImageCid && `ipfs://${ipfsImageCid}`;

  // console.log("nftIpfsImageUri", ipfsImageUri);
  return ipfsImageUri;
};

// GET ipfs metadata uri
const nftIpfsTokenUri = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  imageUri = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = "",
  storageOption: StorageOptionType = { default: "ipfs" }
): Promise<string> => {
  // console.log("nftIpfsTokenUri", name, imageUri, address, image, metadata);

  const json = {
    name,
    description: nftDescription || name || "",
    image: ipfsGatewayUrl(imageUri),
    ipfs: imageUri,
    origin: textShort(image, 140),
    minter: address
  } as NftType;
  if (metadata) json.metadata = JSON.parse(metadata);
  if (Object.keys(properties).length > 0) json.properties = properties;
  if (animation_url) json.animation_url = ipfsGatewayUrl(animation_url);

  const ipfsJsonCid = await nftStorage.pinJson(json);
  const ipfsTokenUri = ipfsJsonCid && `ipfs://${ipfsJsonCid}`;

  // console.log("nftIpfsTokenUri", ipfsTokenUri);
  return ipfsTokenUri;
};

export { nftIpfsImageUri, nftIpfsTokenUri };
