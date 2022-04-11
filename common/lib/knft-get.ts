import type { Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";

import type { ERC721 } from "types/ERC721";
import type { ERC721Enumerable } from "types/ERC721Enumerable";

import type { Collection, Nft } from "./ktypes";
import { nftUrl3 } from "./kconfig";
import { collectionContractGet } from "./kcollection-get";
import { nftGetMetadata } from "./knft-get-metadata";

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

const nftGetFromContract = async (
  chainId: number,
  collection: Collection,
  tokenID: string,
  provider: Provider
): Promise<Nft | undefined> => {
  let tokenURI = "";
  let contractName = "";
  let owner = "";

  let nft: Nft | undefined;

  if (chainId && collection) {
    try {
      const contract = (await collectionContractGet(chainId, collection, provider)) as ERC721;
      contractName = collection.name || "No name";

      if (contract && collection?.supports?.IERC721Metadata) {
        contractName = contractName || (await contract.name());
        owner = await contract.ownerOf(tokenID);
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
): Promise<Nft | undefined> => {
  let nft: Nft | undefined;
  let tokID: BigNumber;

  // console.log("nftGetFromContractEnumerable", chainId, index, collection.address, owner);

  if (chainId && collection?.supports?.IERC721Enumerable) {
    try {
      const contract = (await collectionContractGet(chainId, collection, provider)) as ERC721Enumerable;
      if (contract) {
        if (owner) {
          tokID = await contract.tokenOfOwnerByIndex(owner, index);
        } else {
          tokID = await contract.tokenByIndex(index);
          owner = await contract.ownerOf(tokID);
        }
        nft = await nftGetFromContract(chainId, collection, tokID.toString(), provider);
      }
    } catch (e) {
      console.error("ERROR nftGetFromContractEnumerable", chainId, index, owner, collection, e);
    }
  }
  // console.log("nftGetFromContractEnumerable #", index, nft);
  return nft;
};

const nftGet = async (chainId: number, collection: string, tokenID: string): Promise<Nft | undefined> =>
  nftGetMetadata({ chainId, collection, tokenID });

export { nftGet, nftGetFromContract, nftGetFromContractEnumerable, collectionContractGet };
