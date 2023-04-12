import type { NftType, Properties } from "@lib/common/types";

import { DEFAULT_NAME, textShort, ipfsGatewayUrl, swarmGatewayUrl } from "@lib/common/config";

import { swarmUploadFile } from "@lib/common/beejs";

///////////////////////////////////////////////////////////////////////////////////
// Switch src to file
const srcToFileType = async (src: string): Promise<File> => {
  const blob = await fetch(src).then((r) => r.blob());
  const file = new File([blob], DEFAULT_NAME, { type: blob.type });
  console.log("file", file);

  return file;
};

///////////////////////////////////////////////////////////////////////////////////
// GET swarm image uri
// Params
// image
// key : Swarm batchID (batch of stamps)
const nftSwarmImageUri = async (image: string | File, key = ""): Promise<string> => {
  let file: string | File = image;
  if (typeof image === "string" && image.startsWith("http")) {
    file = await srcToFileType(image);
  } else if (image instanceof File) {
    file = image;
  }

  const swarmImageUri = `swarm://${await swarmUploadFile(file, key)}`;
  console.log("🚀 ~ swarm image uploaded Ref :", swarmImageUri);

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
  animation_url = ""
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

  const swarmTokenUri = `swarm://${await swarmUploadFile(JSON.stringify(json, null, 2))}`;

  return swarmTokenUri;
};

export { nftSwarmImageUri, nftSwarmTokenUri };
