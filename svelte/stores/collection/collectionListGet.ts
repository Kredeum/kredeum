import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { CollectionType } from "lib/ktypes";
import { collectionListStore } from "stores/collection/collectionList";
import { collectionDefaultStore } from "stores/collection/collectionDefault";

// STATE VIEW : GET Collection fitered list
const collectionListGetStore = (
  chainId: number,
  account?: string,
  mintable = false
): Readable<Map<string, CollectionType>> => {
  const [collectionDefault, collectionMintableDefault] = get(collectionDefaultStore).get(
    collectionDefaultStore.getKey(chainId, account)
  ) || ["", ""];
  console.log(
    `collectionListGetStore collection://${chainId || ""}${account ? "@" + account : ""} ${String(mintable)}`
  );
  return derived(collectionListStore, ($collectionListStore) => {
    const collections = new Map(
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
          const okMintableDefault = coll.address == collectionMintableDefault;

          // MINTABLE
          const okMintable =
            (0 <= coll.version && coll.version <= 2) || // ok if OpenNFTs version 0, 1 or 2
            (coll.version === 3 && (coll?.open || okOwner)) || // ok if OpenNFTs version 3, with open minting or owner
            okMintableDefault;

          // DEFAULT
          const okDefault = coll.address == collectionDefault || okMintableDefault;

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
    );
    return collections;
  });
};

export { collectionListGetStore };
