import { get } from "svelte/store";

import { nftGetFromContractEnumerable } from "lib/knft-get";
import { nftGetMetadata } from "lib/knft-get-metadata";
import { nftListTokenIds } from "lib/knft-list";
import { collectionGet as collectionLib } from "lib/kcollection-get";

import { metamaskProvider } from "main/metamask";
import { collectionStore } from "stores/collection/collection";
import { collectionListStore } from "stores/collection/collectionList";
import { nftStore } from "./nft";

// ACTIONS : REFRESH all NFTs from one collection for an account
const nftListRefresh = async (chainId: number, address: string, account: string): Promise<void> => {
  if (!(chainId && address)) return;
  console.log("nftListRefresh", chainId, address, account);

  let collection = get(collectionListStore).get(collectionStore.getKey(chainId, address));
  if (!collection?.supports) {
    await collectionStore.refresh(chainId, address);
    collection = get(collectionListStore).get(collectionStore.getKey(chainId, address));
  }

  if (collection?.supports?.IERC721Enumerable) {
    const nNFTs = collection.balancesOf?.get(account);
    console.log("nftListRefresh Enumerable ~ nNFTs", nNFTs);

    for (let numNFT = 0; numNFT < nNFTs; numNFT++) {
      const nftIndex = await nftGetFromContractEnumerable(
        chainId,
        collection.address,
        numNFT,
        get(metamaskProvider),
        collection,
        account
      );
      if (nftIndex) {
        nftStore.setOne(await nftGetMetadata(nftIndex));
      }
    }
  } else {
    const nftsTokenIds = await nftListTokenIds(chainId, collection.address, get(metamaskProvider), collection, account);
    console.log("nftListRefresh nbTokenIds ~ nNFTs", nftsTokenIds.size);

    for await (const _nft of nftsTokenIds.values()) {
      nftStore.setOne(await nftGetMetadata(_nft));
    }
  }
};

export { nftListRefresh };
