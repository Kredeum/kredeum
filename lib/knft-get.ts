import type { Collection, Nft, NftMetadata } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchJson } from "./kfetch";
import { ipfsGetLink, ipfsGatewayUrl } from "./knfts";
import { getNetwork, getChecksumAddress, nftUrl3 } from "./kconfig";
import { collectionGetContract } from "./kcollection-get";
import { BigNumber } from "ethers";

////////////////////////////////////////////////////////
// TOKEN
////////////////////////////////////////////////////////
// SMARTCONTRACT DATA
// contract  = "0xaaa...aaa"
// tokenID   = "nnn"
// owner     = "0xbbb...bbb"
////////////////////////////////////////////////////////
// METADATA?
// tokenURI    = "https://ipfs.io/ipfs/bafaaaaa...aaaa"
// metadata    = {...}
// image       =
// name        = "image name"
// description = "description image"
// minter?     = ""
////////////////////////////////////////////////////////
// NID = NFT ID = "0xaaa...aaa_nnn@chain"
// CID = IPDS ID = "bax..."
// PID = WP IP = "123"
////////////////////////////////////////////////////////

const nftGetImageLink = (nft: Nft): string => (nft.ipfs ? ipfsGatewayUrl(nft.ipfs) : nft.image) || "";

const nftGetContentType = async (chainId: number, token: Nft, collection?: Collection): Promise<Nft> => {
  const nft = token;
  try {
    const response = await fetch(nftGetImageLink(token));
    nft.contentType = response.headers.get("content-type");
  } catch (e) {
    console.error("ERROR nftGetMetadata contentType", e);
  }
  return nft;
};

const nftGetMetadata = async (chainId: number, token: Nft, collection?: Collection): Promise<Nft> => {
  console.log("nftGetMetadata", chainId, token, collection);
  // TODO : Extend NFT type with Metadata type...
  let nftMetadata: Nft;

  if (chainId && token) {
    const network = getNetwork(chainId);
    const collectionAddress: string = getChecksumAddress(token.collection || collection.address);

    let tokenJson: NftMetadata = {};

    // ERC721 OPTIONAL METADATA => tokenURI includes METADATA
    if (token.tokenURI) {
      try {
        const tokenURIAnswer = await fetchJson(token.tokenURI);
        if (tokenURIAnswer.error) {
          console.error("ERROR nftGetMetadata tokenURIAnswer.error ", tokenURIAnswer.error);
        } else {
          console.log("nftGetMetadata tokenJson", tokenURIAnswer);
          tokenJson = tokenURIAnswer as NftMetadata;
        }
      } catch (e) {
        console.error("ERROR nftGetMetadata tokenURIAnswer", e);
      }
    }

    const chainName: string = token.chainName || network?.chainName || "";
    const metadata = { ...token.metadata, ...tokenJson };
    const image: string = token.image || metadata.image || metadata.image_url || "";
    const tokenID: string = token.tokenID || "";

    nftMetadata = {
      tokenID: token.tokenID || "",
      tokenURI: token.tokenURI || "",
      tokenJson,

      collection: collectionAddress,
      chainId,
      chainName,

      metadata,
      image,

      name: token.name || metadata.name || "",
      description: token.description || metadata.description || "",

      creator: getChecksumAddress(token.creator || metadata.creator),
      minter: getChecksumAddress(token.minter || metadata.minter),
      owner: getChecksumAddress(token.owner || metadata.owner),

      ipfs: token.ipfs || metadata.ipfs || ipfsGetLink(image) || "",
      ipfsJson: token.ipfsJson || ipfsGetLink(token.tokenURI) || "",
      nid: token.nid || nftUrl3(chainId, collectionAddress, tokenID)
    };

    // STORE in cache if exists
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(nftMetadata.nid || "", JSON.stringify(nftMetadata, null, 2));
    }
  }
  // console.log("nftGetMetadata nftMetadata", nftMetadata);
  return nftMetadata;
};

const nftGetFromContract = async (
  chainId: number,
  collection: Collection,
  tokenID: string,
  provider: Provider,
  owner: string
): Promise<Nft> => {
  let tokenURI = "";
  let contractName = "";

  let nft: Nft;

  if (chainId && collection) {
    try {
      const contract = await collectionGetContract(chainId, collection, provider);
      contractName = collection.name;

      if (collection?.supports?.ERC721Metadata) {
        contractName = contractName || (await contract.name());
        owner = owner || (await contract.ownerOf(tokenID));
        tokenURI = await contract.tokenURI(tokenID);
      }

      const nid = nftUrl3(chainId, collection.address, tokenID);
      nft = {
        chainId,
        collection: collection.address,
        contractName,
        tokenID,
        tokenURI,
        owner,
        nid
      };
    } catch (e) {
      console.error("ERROR nftGetFromContract", e);
    }
  }
  // console.log("nftGetFromContract", nft);
  return nft;
};

const nftGetFromContractEnumerable = async (
  chainId: number,
  collection: Collection,
  index: number,
  provider: Provider,
  owner?: string
): Promise<Nft> => {
  let nft: Nft;
  let tokID: BigNumber;

  if (chainId && collection?.supports?.ERC721Enumerable) {
    try {
      const contract = await collectionGetContract(chainId, collection, provider);
      if (owner) {
        tokID = await contract.tokenOfOwnerByIndex(owner, index);
      } else {
        tokID = await contract.tokenByIndex(index);
        owner = await contract.ownerOf(tokID);
      }
      nft = await nftGetFromContract(chainId, collection, tokID.toString(), provider, owner);
    } catch (e) {
      console.error("ERROR nftGetFromContractEnumerable", e);
    }
  }
  // console.log("nftGetFromContractEnumerable #", index, nft);
  return nft;
};

export {
  nftGetFromContract,
  nftGetFromContractEnumerable,
  nftGetMetadata,
  nftGetContentType,
  nftGetImageLink,
  collectionGetContract
};
