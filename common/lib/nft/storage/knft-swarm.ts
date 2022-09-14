import type { NftType } from "@lib/common/ktypes";

import { swarmGatewayUrl, textShort, DEFAULT_NAME } from "@lib/common/kconfig";
import { swarmUploadFile } from "@lib/common/kbeejs";

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
  const swarmImage = `swarm://${await swarmUploadFile(file, nftTitle, contentType, nodeUrl, batchId, fileSize)}`;
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

  const swarmJson = `swarm://${await swarmUploadFile(
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
