import type { CollectionType, NftType } from "@kredeum/common/lib/common/types";
import { collectionGet } from "@kredeum/common/lib/collection/collection-get";

import { nftGetMetadata } from "@kredeum/common/lib/nft/nft-get-metadata";
import { resolverGetNft } from "@kredeum/common/lib/resolver/resolver-get-nft";
import { keyNft } from "@kredeum/common/lib/common/keys";
import { ADDRESS_ZERO } from "../common/config";

const nftGet = async (
  chainId: number,
  address: string,
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
