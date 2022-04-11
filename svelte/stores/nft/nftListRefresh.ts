import { get } from "svelte/store";

import { nftGetFromContractEnumerable } from "lib/knft-get";
import { nftGetMetadata } from "lib/knft-get-metadata";
import { nftListTokenIds } from "lib/knft-list";

import { metamaskProvider } from "main/metamask";
import { collectionStore } from "stores/collection/collection";
import { nftListStore } from "./nftList";

// ACTIONS : SET all NFTs from one collection for an account
const nftListRefresh = async (chainId: number, address: string, account: string): Promise<void> => {
  if (!(chainId && address)) return;
  console.log("nftListRefresh", chainId, address, account);

  const collectionObject = collectionStore.getOne(chainId, address);
  // console.log("nftListRefresh ~ collectionObject", collectionObject);
  if (!collectionObject) return;

  if (collectionObject.supports) {
    if (collectionObject.supports.IERC721Enumerable) {
      const nNFTs = collectionObject.balancesOf?.get(account);
      // console.log("nftListRefresh Enumerable ~ nNFTs", nNFTs);

      for (let numNFT = 0; numNFT < nNFTs; numNFT++) {
        const nftIndex = await nftGetFromContractEnumerable(
          chainId,
          collectionObject,
          numNFT,
          get(metamaskProvider),
          account
        );
        if (nftIndex) {
          nftListStore.updateOne(await nftGetMetadata(nftIndex));
        }
      }
    } else {
      const nftsTokenIds = await nftListTokenIds(chainId, collectionObject, get(metamaskProvider), account);
      // console.log("nftListRefresh nbTokenIds ~ nNFTs", nftsTokenIds.size);

      for await (const _nft of nftsTokenIds.values()) {
        nftListStore.updateOne(await nftGetMetadata(_nft));
      }
    }
  } else {
    console.error("ERROR nftListRefresh, missing supported interfaces", collectionObject);
  }
};

export { nftListRefresh };
