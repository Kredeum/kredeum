import type { NftType, Properties } from "@kredeum/common/lib/common/types";

import { DEFAULT_NAME, textShort } from "@kredeum/common/lib/common/config";

import { swarmUploadFile } from "@kredeum/common/lib/common/beejs";

import { storageDefault, storageParamsGet, storageParamsValid } from "./storage";
import { networks } from "@kredeum/common/lib/common/networks";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SWARM HELPERS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// uri : https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => Swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmGetLink = (uri: string | undefined): string => {
  if (!uri) return "";

  let swarmLink = "";
  let cid = "";

  if (uri.startsWith("swarm://")) {
    swarmLink = uri;
  } else if (uri.startsWith(swarmGateway())) {
    // find cid in uri
    cid = uri.replace(swarmGateway(), "");

    // console.log("ipfsGetLink ~ uri res cid", uri, res, cid);
  }
  if (cid) {
    // reconstruct ipfs uri
    swarmLink = swarmCidToLink(cid);
  }

  return swarmLink;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// http link : https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => gateway url : https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmLinkToUrlHttp = (link: string): string => (link.startsWith("swarm://") ? swarmGatewayUrl(link) : link);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// cid : 1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmCidToLink = (cid: string): string => (cid ? `swarm://${cid}` : "");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => cid : 1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmLinkToCid = (swarm: string): string => swarm.replace(/^swarm:\/\//, "");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Swarm reference : 1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => gateway url https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmGatewayUrl = (swarm: string | undefined): string =>
  swarm ? `${swarmGateway()}/${swarmLinkToCid(swarm)}` : "";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const swarmGateway = (): string => storageParamsGet("swarm")?.gateway.replace(/\/$/, "") || "";
const swarmApiEndpoint = (): string => storageParamsGet("swarm")?.apiEndpoint.replace(/\/$/, "") || "";
const swarmApiKey = (): string => storageParamsGet("swarm")?.apiKey || "";

const SWARM_ZERO_APIKEY = "0000000000000000000000000000000000000000000000000000000000000000";

// TEST if swarm config or params are valid
const swarmConfigValid = (chainId: number): boolean => storageDefault() == "swarm" && swarmParamsValid(chainId);
const swarmParamsValid = (chainId: number): boolean => {
  const swarmParams = storageParamsGet("swarm");

  if (!(swarmParams && storageParamsValid(swarmParams))) return false;
  if (networks.isTestnet(chainId)) return true;

  if (swarmParams.apiKey === SWARM_ZERO_APIKEY) return false;

  return true;
};

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
const swarmPin = async (media: string | File): Promise<string> => {
  let file: string | File = media;

  if (typeof media === "string" && (media.startsWith("http") || media.startsWith("data:"))) {
    file = await _srcToFileType(media);
  } else if (media instanceof File) {
    file = media;
  }

  const swarmHash = await swarmUploadFile(file);
  const swarmUri = swarmHash ? `swarm://${swarmHash}` : "";

  return swarmUri;
};

// GET swarm metadata uri
const swarmTokenUri = async (
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
  if (animation_url) json.animation_url = swarmGatewayUrl(animation_url);
  if (pdfUri) json.pdf = swarmGatewayUrl(pdfUri);

  const swarmTokenUri = `swarm://${await swarmUploadFile(JSON.stringify(json, null, 2))}`;

  return swarmTokenUri;
};

export {
  swarmPin,
  swarmTokenUri,
  SWARM_ZERO_APIKEY,
  swarmGetLink,
  swarmLinkToUrlHttp,
  swarmCidToLink,
  swarmLinkToCid,
  swarmGatewayUrl,
  swarmGateway,
  swarmApiEndpoint,
  swarmApiKey,
  swarmParamsValid,
  swarmConfigValid
};
