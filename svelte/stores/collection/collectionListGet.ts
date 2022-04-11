import type { Readable } from "svelte/store";
import { derived } from "svelte/store";
import { collectionListStore } from "stores/collection/collectionList";
import { Collection as CollectionType } from "lib/ktypes";
import { collectionDefaultStore } from "stores/collection/collectionDefault";

// STATE VIEW : GET Collection fitered list
const collectionListGetStore = (
  chainId: number,
  account: string,
  mintable = false
): Readable<Map<string, CollectionType>> =>
  derived(
    collectionListStore,
    ($collectionListStore) =>
      new Map(
        [...$collectionListStore]
          .filter(([, coll]) => {
            const okParams = chainId > 0 && Boolean(account);

            // NETWORK
            const okNetwork = coll.chainId === chainId;

            // BALANCE
            const okBalance = (coll.balancesOf?.get(account) || 0) > 0;

            // OWNER
            const okOwner = coll.owner === account;

            // DEFAULT MINTABLE
            const okDefaultMintable = coll.address == collectionDefaultStore.getOpenNFTs(chainId);

            // MINTABLE
            const okMintable =
              (0 <= coll.version && coll.version <= 2) || // ok if OpenNFTs version 0, 1 or 2
              (coll.version === 3 && (coll?.open || okOwner)) || // ok if OpenNFTs version 3, with open minting or owner
              okDefaultMintable;

            // DEFAULT
            const okDefault = coll.address == collectionDefaultStore.getOne(chainId, account) || okDefaultMintable;

            // NOT MINTABLE
            const okNotMintable = okOwner || okBalance || okDefault;

            // IERC1155
            // const okIrc1155 = coll.supports?.IERC1155;

            const ok = okParams && okNetwork && (mintable ? okMintable : okNotMintable);

            // if (mintable) {
            //   console.log("collectionListGet Mintable", ok, okParams, okNetwork, okMintable, coll);
            // } else {
            //   console.log("collectionListGet", ok, okParams, okNetwork, okNotMintable);
            //   console.log("collectionListGet NotMintable", okNotMintable, okOwner, okBalance, okDefault);
            // }

            return ok;
          })

          // SORT PER SUPPLY DESC
          .sort(([, a], [, b]) => (b.balancesOf?.get(account) || 0) - (a.balancesOf?.get(account) || 0))
      )
  );

export { collectionListGetStore };
