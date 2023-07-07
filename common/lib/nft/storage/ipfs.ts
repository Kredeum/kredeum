import type { NftType, Properties } from "@lib/common/types";

import NftStorage from "@lib/nft/storage/nftstorage";
import { textShort, DEFAULT_NAME, urlToLink } from "@lib/common/config";
import { storageDefault, storageParamsGet, storageParamsValid } from "./storage";

let nftStorage: NftStorage;

/////////////////////////////////////////////////////////////////////////////////////////////////////
// IPFS helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfsTextShort
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsTextShort = (s: string, n = 16, p = n): string => {
  const ipfsStr: string = s?.toString() || "";
  const str: string = ipfsLinkToCid(ipfsStr);
  const l: number = str.length || 0;
  return str.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? str.substring(l - p, l) : ""));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// uri : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGetLink = (uri: string | undefined): string => {
  if (!uri) return "";

  let ipfsLink = "";
  let cid = "";

  if (uri.startsWith("Qm") || uri.startsWith("ba")) {
    cid = uri;
  } else if (uri.startsWith("ipfs://")) {
    if (uri.startsWith("ipfs://ipfs/")) {
      cid = uri.replace(/^ipfs:\/\/(ipfs\/)/, "");
    } else {
      ipfsLink = uri;
    }
  } else {
    // find cid in uri
    const res = uri.match(/^.*\/ipfs\/(.*)$/i);
    cid = (res && res[1]) || "";
    // console.log("ipfsGetLink ~ uri res cid", uri, res, cid);
  }
  if (cid) {
    // reconstruct ipfs uri
    ipfsLink = ipfsCidToLink(cid);
  }
  // console.log("ipfsGetLink", uri, "=>", ipfsLink, cid);
  return ipfsLink;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// http uri : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway url : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsLinkToUrlHttp = (link: string): string => (link.startsWith("ipfs://") ? ipfsGatewayUrl(link) : link);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// cid : bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsCidToLink = (cid: string): string => (cid ? `ipfs://${cid}` : "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => cid : bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsLinkToCid = (ipfs: string): string => ipfs.replace(/^ipfs:\/\//, "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway url https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGatewayUrl = (ipfs: string | undefined): string => (ipfs ? `${ipfsGateway()}/${ipfsLinkToCid(ipfs)}` : "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway link <a href="https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624" target="_blank" rel="noreferrer">bafk...cek624</a>
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGatewayLink = (ipfs: string): string => urlToLink(ipfsGatewayUrl(ipfs), textShort(ipfs));
/////////////////////////////////////////////////////////////////////////////////////////////////////

// TEST if ipfs config or params are valid
const ipfsConfigValid = (): boolean => storageDefault() == "ipfs" && ipfsParamsValid();
const ipfsParamsValid = (): boolean => storageParamsValid(storageParamsGet("ipfs"));

// GET ipfs gateway
const ipfsGateway = (): string => storageParamsGet("ipfs")?.gateway?.replace(/\/$/, "") || "";
const ipfsApiEndpoint = (): string => storageParamsGet("ipfs")?.apiEndpoint.replace(/\/$/, "") || "";
const ipfsApiKey = (): string => storageParamsGet("ipfs")?.apiKey || "";

// GET ipfs uri from media url
const ipfsPin = async (mediaUrl: string): Promise<string> => {
  nftStorage ||= new NftStorage();
  const ipfsCid = await nftStorage.pinUrl(mediaUrl);
  const ipfsUri = ipfsCid ? `ipfs://${ipfsCid}` : "";

  // console.log("ipfsUri", ipfsUri);
  return ipfsUri;
};

// GET ipfs metadata uri
const ipfsTokenUri = async (
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
  // console.log("ipfsTokenUri", name, imageUri, address, image, metadata);

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
  if (pdfUri) json.pdf = ipfsGatewayUrl(pdfUri);

  const ipfsJsonCid = await nftStorage.pinJson(json);
  const ipfsTokenUri = ipfsJsonCid && `ipfs://${ipfsJsonCid}`;

  // console.log("ipfsTokenUri", ipfsTokenUri);
  return ipfsTokenUri;
};

export {
  ipfsPin,
  ipfsTokenUri,
  ipfsConfigValid,
  ipfsParamsValid,
  ipfsLinkToUrlHttp,
  ipfsCidToLink,
  ipfsLinkToCid,
  ipfsGetLink,
  ipfsGateway,
  ipfsGatewayUrl,
  ipfsGatewayLink,
  ipfsTextShort,
  ipfsApiEndpoint,
  ipfsApiKey
};
