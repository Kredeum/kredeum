import type { NftMetadata, NftType, Properties } from "../common/types";

import { DEFAULT_NAME, textShort } from "../common/config";

import { storageDefault, storageParamsGet, storageParamsValid } from "./storage";
import networks from "../contract/networks";
import { fetchBee } from "../common/fetchBee";

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
// Switch src URL or dataURL to file
const _urlToBlob = async (src: URL | string): Promise<Blob> => {
  const blob = await fetch(src).then((r) => r.blob());

  return blob;
};

///////////////////////////////////////////////////////////////////////////////////
// GET swarm image uri
// Params
// image
// key : Swarm batchID (batch of stamps)
const swarmPin = async (url: URL | string): Promise<string> => {
  const blob: Blob = await _urlToBlob(url);

  const swarmHash = await fetchBee.uploadBlob(blob);
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
  if (metadata) json.metadata = JSON.parse(metadata) as NftMetadata;
  if (Object.keys(properties).length > 0) json.properties = properties;
  if (animation_url) json.animation_url = swarmGatewayUrl(animation_url);
  if (pdfUri) json.pdf = swarmGatewayUrl(pdfUri);

  const swarmHash = await fetchBee.uploadJson(JSON.stringify(json, null, 2));
  const swarmTokenUri = `swarm://${swarmHash}`;

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
  swarmParamsValid,
  swarmConfigValid
};
