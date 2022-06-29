import type { NftType } from "./ktypes";

import { swarmGatewayUrl, textShort, DEFAULT_NAME } from "./kconfig";
import { swarmUploadFile } from "./kbeejs";

const nftSwarmMintTexts = [
  "Mint",
  "Wait till Image stored on Swarm",
  "Wait till Metadata stored on Swarm",
  "Please, sign the transaction",
  "Wait till transaction completed, it may take one minute or more..."
];

///////////////////////////////////////////////////////////////////////////////////
// GET Swarm image link
const nftMint1SwarmImage = async (
  file: File,
  nftTitle: string,
  contentType: string,
  nodeUrl?: string,
  batchId?: string,
  fileSize?: number
): Promise<string> => {
  const swarmImage = `swarm://${await swarmUploadFile(file, nftTitle, contentType, nodeUrl, batchId, fileSize)}`;
  console.log("🚀 ~ swarm image uploaded Ref :", swarmImage);

  // console.log("nftMint swarm image", ipfsImage);
  return swarmImage;
};

// GET Swarm metadata url
const nftMint2SwarmJson = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  swarm = "",
  address = "",
  image = "",
  metadata = "{}",
  nodeUrl?: string,
  batchId?: string
): Promise<string> => {
  // console.log("nftMint2IpfsJson", name, swarm, address, image, metadata);

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

  console.log("nftMint swarm metadata", swarmJson);

  return swarmJson;
};

export { nftSwarmMintTexts, nftMint1SwarmImage, nftMint2SwarmJson };
