import type { Collection, Nft } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchJson } from "./kfetch";
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

const cidExtract = (_uri: string): string => {
  let cid = "";
  if (_uri) {
    const cid1 = _uri.match(/^ipfs:\/\/(.*)$/i);
    const cid2 = _uri.match(/^.*\/ipfs\/([^/]*)(.*)$/i);
    cid = (cid1 && cid1[1]) || (cid2 && cid2[1]) || "";
  }
  // console.log('cid' cid, '<=', _image);
  return cid;
};

const nftGetMetadataSync = (chainId: number, token: Nft, collection?: Collection): Nft => {
  // console.log(`nftGetMetadataSync ${chainId} ${collection.address}`, token);
  let nftData: Nft;

  if (chainId && token) {
    // TODO : Extend NFT type with Metadata type...
    type Metadata = {
      name?: string;
      description?: string;
      creator?: string;
      minter?: string;
      owner?: string;
      image?: string;
      image_url?: string;
      cid?: string;
    };

    const network = getNetwork(chainId);
    const collectionAddress: string = getChecksumAddress(token.collection || collection.address);

    const chainName: string = token.chainName || network?.chainName || "";
    const metadata: Metadata = (token.metadata as Metadata) || {};
    const image: string = token.image || metadata.image || metadata.image_url || "";
    const tokenID: string = token.tokenID || "";

    nftData = {
      tokenID: token.tokenID || "",
      tokenURI: token.tokenURI || "",

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

      cid: token.cid || metadata.cid || cidExtract(image) || "",
      cidJson: token.cidJson || cidExtract(token.tokenURI) || "",
      nid: token.nid || nftUrl3(chainId, collectionAddress, tokenID)
    };
    // STORE in cache if exists
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(nftData.nid || "", JSON.stringify(nftData, null, 2));
    }
  }

  // console.log("nftGetMetadataSync", token, "=>", nftData);
  return nftData;
};

const nftGetMetadata = async (chainId: number, token: Nft, collection?: Collection): Promise<Nft> => {
  // console.log("nftGetMetadata", chainId, token, collection);
  let nftDataSync = token;

  if (chainId && token) {
    // console.log("nftGetMetadata chainId token", chainId, token);

    if (!token.metadata) {
      const metadataUrl = token.tokenURI;

      if (metadataUrl) {
        const metadataAnswer = await fetchJson(metadataUrl);

        if (metadataAnswer.error) {
          console.error("metadataAnswer ERROR", metadataAnswer.error);
        } else {
          token.metadata = metadataAnswer;
        }
      }
    }
    nftDataSync = nftGetMetadataSync(chainId, token, collection);
  }
  // console.log("nftGetMetadata nftDataSync", nftDataSync);
  return nftDataSync;
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

export { nftGetFromContract, nftGetFromContractEnumerable, nftGetMetadata, collectionGetContract };
