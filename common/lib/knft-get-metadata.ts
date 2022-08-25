import type { NftType, NftMetadata } from "@lib/ktypes";
import { fetchJson } from "@lib/kfetch";
import {
  ipfsGetLink,
  ipfsGatewayUrl,
  swarmGetLink,
  swarmGatewayUrl,
  getNetwork,
  getChecksumAddress,
  nftKey
} from "@lib/kconfig";
import { Provider } from "@ethersproject/abstract-provider";

import { getNftPrice, getNftRoyaltyInfo } from "@lib/kautomarket";

// Cache contentType(url)
const contentTypesCache: Map<string, string> = new Map();

const nftGetImageLink = (nft: NftType): string =>
  ipfsGatewayUrl(nft?.ipfs) || swarmGatewayUrl(nft?.swarm) || nft.image || "";

const nftGetContentType = async (nft: NftType): Promise<string> => {
  // console.log("nftGetContentType", nft);

  const { chainId, address, tokenID } = nft || {};
  const url = nftGetImageLink(nft);

  let contentType = "text";
  if (!(chainId && address && tokenID && url)) return contentType;

  contentType = contentTypesCache.get(url) || "";
  if (contentType) return contentType;

  contentType = "image";
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (200 === response.status) {
      contentType = response.headers.get("content-type") || contentType;
      contentTypesCache.set(url, contentType);
    }
  } catch (e) {
    console.error("ERROR nftGetContentType", e, url, nft);
  }
  // console.log(`nftGetContentType ${nftKey(chainId, address, tokenID)}\n`, url, contentType);

  return contentType;
};

const nftGetMetadata = async (nft: NftType, provider?: Provider): Promise<NftType> => {
  // console.log("nftGetMetadata", nft);

  const { chainId, address, tokenID } = nft || {};
  const network = getNetwork(chainId);
  if (!(chainId && address && tokenID && network)) return nft;

  // ERC721 OPTIONAL METADATA => tokenURI includes METADATA
  if (nft.tokenURI) {
    if (!nft.ipfsJson) {
      const ipfsJson = ipfsGetLink(nft.tokenURI);
      if (ipfsJson) nft.ipfsJson = ipfsJson;
    }
    if (!nft.swarmJson) {
      const swarmJson = swarmGetLink(nft.tokenURI);
      if (swarmJson) nft.swarmJson = swarmJson;
    }

    try {
      // nft.ipfsJson = ipfs://...cid... : metadata URI found on IPFS
      // nft.tokenURI : default metadata URI
      const tokenURIAnswer = await fetchJson(nft.ipfsJson || nft.tokenURI);
      if (tokenURIAnswer.error) {
        console.error("ERROR nftGetMetadata tokenURIAnswer.error ", tokenURIAnswer.error);
      } else {
        const nftMetadata = tokenURIAnswer as NftMetadata;
        // console.log("nftGetMetadata", nft.tokenURI, nft.ipfsJson, nftMetadata);

        if (nftMetadata) {
          nft.metadata = nftMetadata;

          if (!nft.name && nftMetadata.name) nft.name = nftMetadata.name;
          if (!nft.description && nftMetadata.description) nft.description = nftMetadata.description;
          if (!nft.creator && nftMetadata.creator) nft.creator = getChecksumAddress(nftMetadata.creator);
          if (!nft.minter && nftMetadata.minter) nft.minter = getChecksumAddress(nftMetadata.minter);
          if (!nft.owner && nftMetadata.owner) nft.owner = getChecksumAddress(nftMetadata.owner);

          if (!nft.image && (nftMetadata.image || nftMetadata.image_url))
            nft.image = nftMetadata.image || nftMetadata.image_url;

          if (!nft.ipfs && (nftMetadata.ipfs || ipfsGetLink(nft.image)))
            nft.ipfs = nftMetadata.ipfs || ipfsGetLink(nft.image);

          if (!nft.swarm && (nftMetadata.swarm || swarmGetLink(nft.image)))
            nft.swarm = nftMetadata.swarm || swarmGetLink(nft.image);

          if (!nft.animation_url && nftMetadata.animation_url) nft.animation_url = nftMetadata.animation_url;
        }

        if (provider) {
          nft.price = await getNftPrice(chainId, address, tokenID, provider);
          const royaltyinfo = await getNftRoyaltyInfo(chainId, address, tokenID, provider);
          nft.royalties = royaltyinfo?.royaltyAmount;
          nft.royaltiesReceiver = royaltyinfo?.receiver;
        }
      }
    } catch (e) {
      console.error("ERROR nftGetMetadata tokenURIAnswer", e);
    }
  }

  nft.chainName ||= network.chainName;
  nft.nid ||= nftKey(chainId, address, tokenID);
  nft.contentType ||= await nftGetContentType(nft);

  // console.log(`nftGetMetadata ${nftKey(chainId, address, tokenID)}\n`, nft);
  return nft;
};

export { nftGetMetadata, nftGetImageLink, nftGetContentType };
