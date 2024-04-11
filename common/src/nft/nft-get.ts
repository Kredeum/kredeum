import type { CollectionType, NftType } from "../common/types";
import { collectionGet } from "../collection/collection-get";

import { nftGetMetadata } from "../nft/nft-get-metadata";
import { resolverGetNft } from "../resolver/resolver-get-nft";
import { keyNft } from "../common/keys";
import { ADDRESS_ZERO } from "../common/config";
import { type Address } from "viem";

const nftGet = async (
  chainId: number,
  address: Address,
  tokenID: string,
  collection: CollectionType = { chainId, address },
  withMetadata = false
): Promise<NftType> => {
  // console.log(`nftGet ${keyNft(chainId, address, tokenID)} ${String(withMetadata)}\n`);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID)) return { chainId, address, tokenID };

  if (Object.keys(collection).length <= 2) collection = await collectionGet(chainId, address);

  let nft = await resolverGetNft(chainId, collection, tokenID);
  // console.log("nft", nft);

  nft = withMetadata ? await nftGetMetadata(nft) : nft;

  nft.nid = keyNft(chainId, address, tokenID);

  nft.collection = collection;

  // console.log("nftGet", nft);
  return nft;
};

export { nftGet };
