import type { Readable } from "svelte/store";
import { get, derived } from "svelte/store";

import type { NftType } from "@lib/common/types";
import { resolverGetNfts as nftListLib, resolverGetNft as nftLib } from "@lib/resolver/resolver-get-nft";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { nftListTokenIds } from "@lib/nft/nft-list";

import { collectionStore } from "@stores/collection/collection";
import { collectionListStore } from "@stores/collection/collectionList";

import { nftStore } from "./nft";
import { keyNftList } from "@lib/common/keys";

// STATE VIEW : GET Collection fitered list
const nftSubListStore = (
  chainId: number,
  address: string,
  account?: string,
  tokenID?: string
): Readable<Map<string, NftType>> => {
  console.log(`nftSubListStore ${keyNftList(chainId, address, account)}\n`);

  return derived(nftStore.getList, ($nftListStore) => {
    if (!(chainId && address)) return new Map() as Map<string, NftType>;

    const nfts = new Map(
      [...$nftListStore].filter(([, nft]) => {
        // const okParams = chainId > 0;
        const okParams = chainId > 0 && Boolean(address);

        // NETWORK
        const okNetwork = nft.chainId === chainId;

        // ADDRESS
        const okAddress = nft.address === address;

        // TOKENID
        const okTokenID = !tokenID || nft.tokenID === tokenID;

        // OWNER
        const okOwner = nft.owner === account;

        // FILTER
        const okFilter = okOwner || okTokenID;

        return okParams && okNetwork && okAddress && okFilter;
      })
    );
    console.log("nftSubListStore nfts", nfts);
    return nfts;
  });
};

// ACTIONS : REFRESH all NFTs from one collection for an account
const nftSubListRefresh = async (
  chainId: number,
  address: string,
  account?: string,
  tokenID?: string
): Promise<void> => {
  if (!(chainId && address)) return;
  console.log("nftSubListRefresh", chainId, address, account);

  const key = collectionStore.getKey(chainId, address);

  const $collectionList = get(collectionListStore);
  let collection = $collectionList.get(key);

  if (!collection?.supports) {
    await collectionStore.refreshOne(chainId, address);
    collection = $collectionList.get(key);
  }

  let nfts: Map<string, NftType>;
  if (collection?.supports?.IERC721Enumerable) {
    ({ nfts } = await nftListLib(chainId, collection, account));
  } else {
    nfts = await nftListTokenIds(chainId, collection.address, collection, account);
  }
  console.log("nftSubListRefresh Enumerable ~ nNFTs", nfts.size);

  for (const [, nft] of nfts) {
    nftStore.setOne(await nftGetMetadata(nft));
    console.log("nftSubListRefresh Enumerable ~ nftGetMetadata(nft) ", await nftGetMetadata(nft));
  }

  // add targeted tokenID if not in list
  if (tokenID && !nfts.has(nftStore.getKey(chainId, address, tokenID))) {
    const nft = await nftLib(chainId, collection, tokenID);
    nftStore.setOne(await nftGetMetadata(nft));
  }
};

export { nftSubListStore, nftSubListRefresh };
