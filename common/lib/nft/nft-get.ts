import type { CollectionType, NftType } from "@lib/common/types";
import { collectionGet } from "@lib/collection/collection-get";

import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { resolverGetNft } from "@lib/resolver/resolver-get-nft";
import { keyNft } from "@lib/common/keys";
import { constants } from "ethers";

const nftGet = async (
  chainId: number,
  address: string,
  tokenID: string,
  collection: CollectionType = { chainId, address },
  withMetadata = false
): Promise<NftType> => {
  // console.log(`nftGet ${keyNft(chainId, address, tokenID)} ${String(withMetadata)}\n`);

  if (!(chainId && address && address != constants.AddressZero && tokenID)) return { chainId, address, tokenID };

  if (Object.keys(collection).length <= 2) collection = await collectionGet(chainId, address);

  const nft = await resolverGetNft(chainId, collection, tokenID);
  // console.log("nft", nft);

  nft.nid = keyNft(chainId, address, tokenID);

  const nftRet = withMetadata ? await nftGetMetadata(nft) : nft;

  // console.log("nftGet", nftRet);
  return nftRet;
};

export { nftGet };
