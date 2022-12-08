import type { CollectionType, NftType } from "@lib/common/types";
import { collectionGet, collectionGetContract } from "@lib/collection/collection-get";

import { nftKey } from "@lib/common/config";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { resolverGetNft } from "@lib/resolver/resolver-get-nft";
import { providerGetFallback } from "@lib/common/provider-get";

const nftGet = async (
  chainId: number,
  address: string,
  tokenID: string,
  collection: CollectionType = { chainId, address },
  withMetadata = false
): Promise<NftType> => {
  console.log(`nftGet ${nftKey(chainId, address, tokenID)} ${String(withMetadata)}\n`);

  if (!(chainId && address && tokenID)) return { chainId, address, tokenID };

  const provider = await providerGetFallback(chainId);

  if (Object.keys(collection).length <= 2) collection = await collectionGet(chainId, address, provider);

  const nft = await resolverGetNft(chainId, collection, tokenID, provider);
  // console.log("nft", nft);

  nft.nid = nftKey(chainId, address, tokenID);

  const nftRet = withMetadata ? await nftGetMetadata(nft) : nft;

  // console.log("nftGet", nftRet);
  return nftRet;
};

export { nftGet, collectionGetContract };
