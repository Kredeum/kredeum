import type { NftType, NftMetadata } from "../common/types";
import { fetchJson } from "../common/fetch";
import { ADDRESS_ZERO, getChecksumAddress } from "../common/config";
import { keyNft } from "../common/keys";
import { swarmGatewayUrl, swarmGetLink } from "../storage/swarm";
import { ipfsGatewayUrl, ipfsGetLink } from "../storage/ipfs";
import { networks } from "../common/networks";

// Cache contentType(url)
const contentTypesCache: Map<string, string> = new Map();

const nftGetImageLink = (nft: NftType): string =>
  ipfsGatewayUrl(nft?.ipfs) || swarmGatewayUrl(nft?.swarm) || nft.image || "";

const nftGetContentType = async (nft: NftType): Promise<string> => {
  // console.log("nftGetContentType", nft);

  const { chainId, address, tokenID } = nft;
  const url = nftGetImageLink(nft);

  let contentType = "text";
  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && url)) return contentType;

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
  // console.log(`nftGetContentType ${keyNft(chainId, address, tokenID)}\n`, url, contentType);

  return contentType;
};

const nftGetMetadata = async (nft: NftType): Promise<NftType> => {
  // console.log("nftGetMetadata", nft);

  const { chainId, address, tokenID } = nft;
  const network = networks.get(chainId);
  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && network)) return nft;

  // ERC721 OPTIONAL METADATA => tokenURI includes METADATA
  if (nft.tokenURI) {
    let metadataJson = "";

    if (!nft.ipfsJson) {
      const ipfsJson = ipfsGetLink(nft.tokenURI);
      if (ipfsJson) {
        nft.ipfsJson = ipfsJson;
        metadataJson = ipfsJson;
      }
    }
    if (!nft.swarmJson) {
      const swarmJson = swarmGetLink(nft.tokenURI);
      if (swarmJson) {
        nft.swarmJson = swarmJson;
        metadataJson = swarmJson;
      }
    }

    try {
      // metadataJson = ipfs://...cid... : metadata URI found on IPFS   OU swarm://
      // nft.tokenURI : default metadata URI
      const tokenURIAnswer = await fetchJson(nft.tokenURI || metadataJson);
      if (tokenURIAnswer.error) {
        console.error("ERROR nftGetMetadata tokenURIAnswer.error ", tokenURIAnswer.error);
      } else {
        const nftMetadata = tokenURIAnswer as NftMetadata;
        // console.log("nftGetMetadata", nft.tokenURI, metadataJson, nftMetadata);

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
          if (!nft.pdf && nftMetadata.pdf) nft.pdf = nftMetadata.pdf;
          if (!nft.properties && nftMetadata.properties) nft.properties = nftMetadata.properties;
        }
      }
    } catch (e) {
      console.error("ERROR nftGetMetadata tokenURIAnswer", e);
    }
  }

  nft.chainName ||= network.chainName;
  nft.nid ||= keyNft(chainId, address, tokenID);
  nft.contentType ||= await nftGetContentType(nft);

  // console.log(`nftGetMetadata ${keyNft(chainId, address, tokenID)}\n`, nft);
  return nft;
};

export { nftGetMetadata, nftGetImageLink, nftGetContentType };
