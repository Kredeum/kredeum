import type { NftType, Properties } from "@lib/common/types";

import { swarmGatewayUrl, textShort, DEFAULT_NAME } from "@lib/common/config";
import { swarmUploadFile } from "@lib/common/beejs";

///////////////////////////////////////////////////////////////////////////////////
// GET Swarm image link
const nftSwarmImage = async (
  file: File,
  nftTitle: string,
  contentType: string,
  nodeUrl?: string,
  batchId?: string,
  fileSize?: number
): Promise<string> => {
  const swarmImage = `bzz://${await swarmUploadFile(file, nftTitle, contentType, nodeUrl, batchId, fileSize)}`;
  console.info("🚀 ~ swarm image uploaded Ref :", swarmImage);

  // console.log("nftSwarmImage", ipfsImage);
  return swarmImage;
};

// GET Swarm metadata url
const nftSwarmJson = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  swarm = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = "",
  nodeUrl?: string,
  batchId?: string
): Promise<string> => {
  // console.log("nftSwarmJson", name, swarm, address, image, metadata);

  const json = {
    name,
    description: nftDescription || name || "",
    image: swarmGatewayUrl(swarm),
    swarm,
    origin: textShort(image, 140),
    minter: address
  } as NftType;
  if (metadata) json.metadata = JSON.parse(metadata);
  if (Object.keys(properties).length > 0) json.properties = properties;
  if (animation_url) json.animation_url = swarmGatewayUrl(animation_url);

  const swarmJson = `bzz://${await swarmUploadFile(
    JSON.stringify(json, null, 2),
    "swarmJson",
    "text",
    nodeUrl,
    batchId
  )}`;

  console.info("nftSwarmJson", swarmJson);

  return swarmJson;
};

export { nftSwarmImage, nftSwarmJson };
