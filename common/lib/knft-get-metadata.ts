import type { Nft, NftMetadata } from "./ktypes";
import { fetchJson } from "./kfetch";
import { ipfsGetLink, ipfsGatewayUrl, getNetwork, getChecksumAddress, nftUrl3 } from "./kconfig";

// Cache contentType(url)
const contentTypes: Map<string, string> = new Map();

const nftGetImageLink = (nft: Nft): string => (nft?.ipfs ? ipfsGatewayUrl(nft.ipfs) : nft?.image || "");

const nftGetContentType = async (nft: Nft): Promise<string> => {
  // console.log("nftGetContentType", nft);

  let contentType = "text";
  const url = nftGetImageLink(nft);

  if (url) {
    contentType = contentTypes.get(url) || "";
    if (!contentType) {
      contentType = "image";
      try {
        const options = { method: "HEAD" };
        const response = await fetch(url, options);
        contentType = response.headers.get("content-type") || "text";
        contentTypes.set(url, contentType);
      } catch (e) {
        console.error("ERROR nftGetContentType", e);
      }
      console.log("nftGetContentType", url, contentType);
    }
  }
  return contentType;
};

const nftGetMetadata = async (nft: Nft): Promise<Nft> => {
  // console.log("nftGetMetadata", chainId, nft, collection);
  // TODO : Extend NFT type with Metadata type...
  let nftMetadata = nft;

  const { chainId, collection, tokenID } = nft;

  if (chainId && collection && tokenID) {
    const network = getNetwork(chainId);

    let tokenJson: NftMetadata = {};

    // ERC721 OPTIONAL METADATA => tokenURI includes METADATA
    if (nft.tokenURI) {
      try {
        const tokenURIAnswer = await fetchJson(nft.tokenURI);
        if (tokenURIAnswer.error) {
          console.error("ERROR nftGetMetadata tokenURIAnswer.error ", tokenURIAnswer.error);
        } else {
          // console.log("nftGetMetadata tokenJson", tokenURIAnswer);
          tokenJson = tokenURIAnswer as NftMetadata;
        }
      } catch (e) {
        console.error("ERROR nftGetMetadata tokenURIAnswer", e);
      }
    }

    const chainName: string = nft.chainName || network?.chainName || "";
    const metadata = { ...nft.metadata, ...tokenJson };
    const image: string = nft.image || metadata.image || metadata.image_url || "";

    nftMetadata = {
      chainId,
      collection,
      tokenID,

      tokenURI: nft.tokenURI || "",
      tokenJson,

      chainName,
      metadata,
      image,

      name: nft.name || metadata.name || "",
      description: nft.description || metadata.description || "",

      creator: getChecksumAddress(nft.creator || metadata.creator),
      minter: getChecksumAddress(nft.minter || metadata.minter),
      owner: getChecksumAddress(nft.owner || metadata.owner),

      ipfs: nft.ipfs || metadata.ipfs || ipfsGetLink(image) || "",
      ipfsJson: nft.ipfsJson || ipfsGetLink(nft.tokenURI || "") || "{}",
      nid: nft.nid || nftUrl3(chainId, collection, tokenID)
    };
    nftMetadata.contentType = nft.contentType || (await nftGetContentType(nftMetadata));

    // STORE in cache if exists
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(nftMetadata.nid || "", JSON.stringify(nftMetadata, null, 2));
    }
  }
  // console.log("nftGetMetadata nftMetadata", nftMetadata);
  return nftMetadata;
};

export { nftGetMetadata, nftGetImageLink, nftGetContentType };
