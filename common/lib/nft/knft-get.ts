import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";

import type { CollectionType, NftType } from "@lib/common/ktypes";
import { collectionGetContract } from "@lib/collection/kcollection-get";

import { nftKey } from "@lib/common/kconfig";
import { nftGetMetadata } from "@lib/nft/knft-get-metadata";
import { resolverGetNft } from "@lib/resolver/resolver-get-nft";

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

const nftGet = async (
  chainId: number,
  address: string,
  tokenID: string,
  signerOrProvider: Signer | Provider,
  collection: CollectionType = { chainId, address },
  withMetadata = false
): Promise<NftType> => {
  let nft: NftType = { chainId, address, tokenID };
  if (!(chainId && address && tokenID && signerOrProvider)) return nft;
  // console.log(`nftGet ${nftKey(chainId, address, tokenID)} ${String(withMetadata)}\n`);

  nft = await resolverGetNft(chainId, collection, tokenID, signerOrProvider);
  console.log("nft", nft);

  nft.nid = nftKey(chainId, address, tokenID);

  const nftRet = withMetadata ? await nftGetMetadata(nft) : nft;

  console.log("nftGet", nftRet);
  return nftRet;
};

export { nftGet, collectionGetContract };
