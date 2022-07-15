import type { Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";

import type { CollectionType, NftType } from "./ktypes";
import { nftKey, isProviderOnChainId, DEFAULT_NAME } from "./kconfig";
import { collectionContractGet, collectionGetSupports } from "./kcollection-get";

import { nftGetMetadata } from "./knft-get-metadata";
import { IERC721Metadata, IERC721, IERC1155MetadataURI, IERC721Enumerable } from "soltypes/contracts/interfaces";

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
  const nft: NftType = { chainId, address, tokenID };
  if (!(chainId && address && tokenID && provider && (await isProviderOnChainId(provider, chainId)))) return nft;

  // console.log(`nftGetFromContract ${nftKey(chainId, address, tokenID)}\n`);
  // console.log("nftGetFromContract collection", collection);

  let contractName = "";
  let tokenURI = "";
  let owner = "";

  try {
    if (!("supports" in collection)) await collectionGetSupports(chainId, address, provider, collection);

    const contract = await collectionContractGet(chainId, address, provider);

    if (collection?.supports?.IERC721) {
      owner = await (contract as IERC721).ownerOf(tokenID);
    }
    if (collection?.supports?.IERC721Metadata) {
      contractName = collection.name || (await (contract as IERC721Metadata).name()) || DEFAULT_NAME;
      tokenURI = await (contract as IERC721Metadata).tokenURI(tokenID);
    }
    if (collection?.supports?.IERC1155MetadataURI) {
      tokenURI = await (contract as IERC1155MetadataURI).uri(tokenID);
    }

    nft.nid = nftKey(chainId, address, tokenID);
    if (contractName) nft.contractName = contractName;
    if (owner) nft.owner = owner;
    if (tokenURI) nft.tokenURI = tokenURI;
  } catch (e) {
    console.error(`ERROR nftGetFromContract ${nftKey(chainId, address, tokenID)}\n`, e);
  }

  // console.log(`nftGetFromContract ${nftKey(chainId, address, tokenID)}\n`, collection, nft);
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
  // console.log(`nftGetFromContract nft://${chainId}/${address}@${owner || ""} #${index}`);

  let tokenID: BigNumber = BigNumber.from(-1);

  if (
    !(
      chainId &&
      address &&
      index >= 0 &&
      provider &&
      (await isProviderOnChainId(provider, chainId)) &&
      collection?.supports?.IERC721Enumerable
    )
  )
    return nft;

  try {
    const contract = await collectionContractGet(chainId, address, provider);
    if (contract) {
      if (owner) {
        tokenID = await (contract as IERC721Enumerable).tokenOfOwnerByIndex(owner, BigNumber.from(index));
      } else {
        tokenID = await (contract as IERC721Enumerable).tokenByIndex(index);
        owner = await (contract as IERC721).ownerOf(tokenID);
      }
      nft = await nftGetFromContract(chainId, address, tokenID.toString(), provider, collection);
    }
  } catch (e) {
    console.error("ERROR nftGetFromContractEnumerable", chainId, index, owner, collection, e);
  }
  // console.log(`nftGetFromContractEnumerable ${nftKey(chainId, address, String(tokenID), owner)} #${index}`, nft);
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
  if (!(chainId && address && tokenID && provider)) return nft;
  // console.log(`nftGet ${nftKey(chainId, address, tokenID)} ${String(withMetadata)}\n`);

  nft = await nftGetFromContract(chainId, address, tokenID, provider, collection);
  // console.log("nft", nft);

  const nftRet = withMetadata ? await nftGetMetadata(nft) : nft;

  // console.log("nftGet", nftRet);
  return nftRet;
};

export { nftGet, nftGetFromContract, nftGetFromContractEnumerable, collectionContractGet };
