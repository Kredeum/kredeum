import type { OpenNFTs } from "../solidity/types/OpenNFTs";
import type { Collection, Nft } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchJson } from "./kfetch";
import { getNetwork, getChecksumAddress, nftUrl3 } from "./kconfig";
import { collectionGetContract } from "./kcollection-get";

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

const nftGetMetadataSync = (chainId: number, _token: Nft, _collection?: Collection): Nft => {
  // console.log(`nftGetMetadataSync ${chainId} ${_collection.address}`, _token);
  let nftData: Nft;

  if (chainId && _token) {
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
    const collectionAddress: string = getChecksumAddress(_token.collection || _collection.address);

    const chainName: string = _token.chainName || network?.chainName || "";
    const metadata: Metadata = (_token.metadata as Metadata) || {};
    const image: string = _token.image || metadata.image || metadata.image_url || "";
    const tokenID: string = _token.tokenID || "";

    nftData = {
      tokenID: _token.tokenID || "",
      tokenURI: _token.tokenURI || "",

      collection: collectionAddress,
      chainId,
      chainName,

      metadata,
      image,

      name: _token.name || metadata.name || "",
      description: _token.description || metadata.description || "",

      creator: getChecksumAddress(_token.creator || metadata.creator),
      minter: getChecksumAddress(_token.minter || metadata.minter),
      owner: getChecksumAddress(_token.owner || metadata.owner),

      cid: _token.cid || metadata.cid || cidExtract(image) || "",
      cidJson: _token.cidJson || cidExtract(_token.tokenURI) || "",
      nid: _token.nid || nftUrl3(chainId, collectionAddress, tokenID)
    };
    // STORE in cache if exists
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(nftData.nid || "", JSON.stringify(nftData, null, 2));
    }
  }

  // console.log("nftGetMetadataSync", _token, "=>", nftData);
  return nftData;
};

const nftGetMetadata = async (
  chainId: number,
  _token: Nft,
  _collection?: Collection
): Promise<Nft> => {
  // console.log("nftGetMetadata chainId _token", chainId, _token);
  let nftDataSync: Nft;

  if (chainId && _token) {
    const metadataUrl = (_token.metadata as string) || _token.tokenURI;

    if (metadataUrl) {
      const metadataAnswer = await fetchJson(metadataUrl);

      if (metadataAnswer.error) {
        console.error("metadataAnswer ERROR", metadataAnswer.error);
      } else {
        _token.metadata = metadataAnswer;
      }
    }
    nftDataSync = nftGetMetadataSync(chainId, _token, _collection);
  }
  // console.log("nftGetMetadata nftDataSync", nftDataSync);
  return nftDataSync;
};

const nftGetFromIndex = async (
  chainId: number,
  collection: Collection,
  _index: number,
  _provider: Provider,
  _owner?: string
): Promise<Nft | undefined> => {
  // console.log("nftGetFromIndex", chainId, collection, _owner);

  let nft: Nft | undefined;

  if (chainId && collection) {
    const contract = await collectionGetContract(chainId, collection, _provider);
    if (contract) {
      nft = await nftGetFromContract(chainId, contract, _index, _owner);
    }
  }
  return nft;
};

const nftGetFromTokenID = async (
  chainId: number,
  _smartcontract: OpenNFTs,
  _tokenId: number,
  _owner?: string
): Promise<Nft> => {
  const nft: Nft = null;
  return nft;
};

const nftGetFromContract = async (
  chainId: number,
  _smartcontract: OpenNFTs,
  _index: number,
  _owner?: string
): Promise<Nft> => {
  let tokenID = "";
  let tokenURI = "";
  let owner = "";
  let collection = "";
  let contractName = "";

  // console.log("nftGetFromContract  IN", chainId, _index, _owner);
  // console.log("nftGetFromContract", _smartcontract);

  try {
    collection = getChecksumAddress(_smartcontract.address);
    // console.log("nftGetFromContract collection", collection);

    if (_smartcontract.name) {
      contractName = await _smartcontract.name();
      // console.log("nftGetFromContract contractName", contractName);
    }
    if (_owner) {
      if (_smartcontract.tokenOfOwnerByIndex) {
        tokenID = (await _smartcontract.tokenOfOwnerByIndex(_owner, _index)).toString();
        // console.log("nftGetFromContract tokenOfOwnerByIndex tokenID", tokenID);
        owner = _owner;
      }
    } else if (_smartcontract.tokenByIndex) {
      tokenID = (await _smartcontract.tokenByIndex(_index)).toString();
      // console.log("nftGetFromContract tokenByIndex tokenID", tokenID);
      owner = await _smartcontract.ownerOf(tokenID);
    }
    if (_smartcontract.tokenURI) {
      tokenURI = await _smartcontract.tokenURI(tokenID);
      // console.log("nftGetFromContract tokenURI", tokenURI);
    }
  } catch (e) {
    console.error(
      "nftGetFromContract ERROR",
      e,
      tokenID,
      tokenURI,
      owner,
      collection,
      contractName,
      chainId,
      _index,
      _owner
    );
  }
  const nid = nftUrl3(chainId, collection, tokenID);
  // console.log("nftGetFromContract #" + tokenID, chainId, collection, tokenURI, owner);
  return { chainId, collection, contractName, tokenID, tokenURI, owner, nid };
};

export {
  nftGetFromIndex,
  nftGetFromTokenID,
  nftGetFromContract,
  nftGetMetadata,
  collectionGetContract
};
