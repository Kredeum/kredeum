import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { CollectionType } from "lib/ktypes";
// import { collectionListKey } from "lib/kconfig";
import { collectionList as collectionListLib } from "lib/kcollection-list";

import { metamaskProvider } from "main/metamask";
import { collectionStore } from "stores/collection/collection";

// STATE VIEW : GET Collection fitered list
const collectionSubListStore = (
  chainId: number,
  account?: string,
  mintable = false
): Readable<Map<string, CollectionType>> => {
  // console.log(`collectionSubListStore ${collectionListKey(chainId, account, mintable)}\n`);

  return derived(
    [collectionStore.getListStore, collectionStore.getDefaultStore],
    ([$collectionListStore, $collectionDefaultStore]) => {
      const [collectionDefault, collectionMintableDefault] = $collectionDefaultStore.get(
        collectionStore.getDefaultKey(chainId, account)
      ) || ["", ""];

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
            const okMintable = okMintableDefault || coll.open || (okOwner && coll.version >= 3);

            // DEFAULT
            const okDefault = coll.address == collectionDefault || okMintableDefault;

            // GENERIC FILTER
            const okFilter = okOwner || okBalance || okDefault;

            // IERC1155
            // const okIrc1155 = coll.supports?.IERC1155;

            const ok = okParams && okNetwork && okFilter && (!mintable || okMintable);

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
    }
  );
};

// ACTIONS : Refresh all Collections from one nework, from an optional account
const collectionSubListRefresh = async (chainId: number, account?: string, mintable = false): Promise<void> => {
  if (!chainId) return;

  const collectionListFromLib = await collectionListLib(chainId, account, get(metamaskProvider), mintable);
  for (const collectionObject of collectionListFromLib.values()) {
    collectionStore.setOne(collectionObject);
  }
  // console.log(`collectionSubListRefresh ${collectionListKey(chainId, account, mintable)}\n`, collectionListFromLib);
};

export { collectionSubListStore, collectionSubListRefresh };
