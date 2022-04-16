import type { Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";

import type { ERC721 } from "types/ERC721";
import type { ERC1155 } from "types/ERC1155";
import type { ERC721Enumerable } from "types/ERC721Enumerable";

import type { CollectionType, NftType } from "./ktypes";
import { nftUrl3, isProviderOnChainId } from "./kconfig";
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
  address: string,
  tokenID: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<NftType> => {
  let nft: NftType = { chainId, address, tokenID };
  if (!(chainId && address && tokenID && (await isProviderOnChainId(provider, chainId)))) return nft;

  console.log(`nftGetFromContract nft://${chainId}/${address}/${tokenID}`);

  let tokenURI = "";
  let contractName = "";
  let owner = "";

  try {
    if (collection?.supports?.IERC721Metadata) {
      const contract = (await collectionContractGet(chainId, address, provider)) as ERC721;
      contractName = collection.name || (await contract.name()) || "No name";
      owner = await contract.ownerOf(tokenID);
      tokenURI = await contract.tokenURI(tokenID);
    }
    if (collection?.supports?.IERC1155MetadataURI) {
      const contract = (await collectionContractGet(chainId, address, provider)) as ERC1155;
      tokenURI = await contract.uri(tokenID);
    }

    const nid = nftUrl3(chainId, address, tokenID);
    nft = { chainId, address, contractName, tokenID, tokenURI, owner, nid };
  } catch (e) {
    console.error(`ERROR nftGetFromContract nft://${chainId}/${address}/${tokenID}`, e);
  }

  console.log(`nftGetFromContract nft://${chainId}/${address}/${tokenID}`, collection, nft);
  return nft;
};

const nftGetFromContractEnumerable = async (
  chainId: number,
  address: string,
  index: number,
  provider: Provider,
  collection: CollectionType,
  owner?: string
): Promise<NftType> => {
  let nft: NftType = { chainId, address, tokenID: "" };
  console.log(`nftGetFromContract nft://${chainId}/${address}@${owner || ""} #${index}`);

  let tokenID: BigNumber = BigNumber.from(-1);

  if (
    !(
      chainId &&
      address &&
      index >= 0 &&
      (await isProviderOnChainId(provider, chainId)) &&
      collection?.supports?.IERC721Enumerable
    )
  )
    return nft;

  try {
    const contract = (await collectionContractGet(chainId, address, provider)) as ERC721Enumerable;
    if (contract) {
      if (owner) {
        tokenID = await contract.tokenOfOwnerByIndex(owner, BigNumber.from(index));
      } else {
        tokenID = await contract.tokenByIndex(index);
        owner = await contract.ownerOf(tokenID);
      }
      nft = await nftGetFromContract(chainId, address, tokenID.toString(), provider, collection);
    }
  } catch (e) {
    console.error("ERROR nftGetFromContractEnumerable", chainId, index, owner, collection, e);
  }
  console.log(`nftGetFromContractEnumerable nft://${chainId}/${address}/${tokenID.toString()}@{owner} #${index}`, nft);
  return nft;
};

const nftGet = async (
  chainId: number,
  address: string,
  tokenID: string,
  provider: Provider,
  collection?: CollectionType,
  withMetadata = false
): Promise<NftType> => {
  let nft: NftType = { chainId, address, tokenID };
  if (!(chainId && address && tokenID)) return nft;
  console.log(`nftGet nft://${chainId}/${address}/${tokenID}`);

  nft = await nftGetFromContract(chainId, address, tokenID, provider, collection);
  console.log("nft", nft);

  const nftRet = withMetadata ? await nftGetMetadata(nft) : nft;

  console.log("nftGet", nftRet);
  return nftRet;
};

export { nftGet, nftGetFromContract, nftGetFromContractEnumerable, collectionContractGet };
