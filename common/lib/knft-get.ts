import type { Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";

import type { CollectionType, NftType } from "@lib/ktypes";
import { nftKey, isProviderOnChainId, DEFAULT_NAME } from "@lib/kconfig";
import { collectionGetContract } from "@lib/kcollection-get";

import { nftGetMetadata } from "@lib/knft-get-metadata";
import {
  IERC721Metadata,
  IERC721,
  IERC1155MetadataURI,
  IERC721Enumerable
} from "@soltypes/OpenNFTs/contracts/interfaces";

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

  let collectionName = "";
  let tokenURI = "";
  let owner = "";

  try {
    const { contract, supports } = await collectionGetContract(chainId, address, provider);

    if (supports.IERC721) {
      owner = await (contract as IERC721).ownerOf(tokenID);
    }
    if (supports.IERC721Metadata) {
      collectionName = collection.name || (await (contract as IERC721Metadata).name()) || DEFAULT_NAME;
      tokenURI = await (contract as IERC721Metadata).tokenURI(tokenID);
    }
    if (supports.IERC1155MetadataURI) {
      tokenURI = await (contract as IERC1155MetadataURI).uri(tokenID);
    }

    nft.nid = nftKey(chainId, address, tokenID);
    if (collectionName) nft.collectionName = collectionName;
    if (owner) nft.owner = owner;
    if (tokenURI) nft.tokenURI = tokenURI;
  } catch (e) {
    console.error(`ERROR nftGetFromContract ${nftKey(chainId, address, tokenID)}\n`, e);
  }

  // console.log(`nftGetFromContract ${nftKey(chainId, address, tokenID)}\n`, collection, nft);
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

export { nftGet, nftGetFromContract, collectionGetContract };
