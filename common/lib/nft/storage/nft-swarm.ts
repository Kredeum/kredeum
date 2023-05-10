import type { NftType, Properties, StorageOptionType } from "@lib/common/types";

import { DEFAULT_NAME, textShort, ipfsGatewayUrl, swarmGatewayUrl } from "@lib/common/config";

import { swarmUploadFile } from "@lib/common/beejs";

///////////////////////////////////////////////////////////////////////////////////
// Switch src URL or dataURI to file
const _srcToFileType = async (src: string): Promise<File> => {
  const blob = await fetch(src).then((r) => r.blob());
  const file = new File([blob], DEFAULT_NAME, { type: blob.type });

  return file;
};

///////////////////////////////////////////////////////////////////////////////////
// GET swarm image uri
// Params
// image
// key : Swarm batchID (batch of stamps)
const nftSwarmImageUri = async (
  image: string | File,
  storageOption: StorageOptionType = { default: "swarm" }
): Promise<string> => {
  let file: string | File = image;

  if (typeof image === "string" && (image.startsWith("http") || image.startsWith("data:"))) {
    file = await _srcToFileType(image);
  } else if (image instanceof File) {
    file = image;
  }

  const swarmImageUri = `swarm://${await swarmUploadFile(file, storageOption)}`;

  return swarmImageUri;
};

// GET swarm metadata uri
const nftSwarmTokenUri = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  imageUri = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = "",
  storageOption: StorageOptionType = { default: "swarm" }
): Promise<string> => {
  const json = {
    name,
    description: nftDescription || name || "",
    image: swarmGatewayUrl(imageUri),
    swarm: imageUri,
    origin: textShort(image, 140),
    minter: address
  } as NftType;
  if (metadata) json.metadata = JSON.parse(metadata);
  if (Object.keys(properties).length > 0) json.properties = properties;
  if (animation_url) json.animation_url = ipfsGatewayUrl(animation_url);

  const swarmTokenUri = `swarm://${await swarmUploadFile(JSON.stringify(json, null, 2), storageOption)}`;

  return swarmTokenUri;
};

export { nftSwarmImageUri, nftSwarmTokenUri };
