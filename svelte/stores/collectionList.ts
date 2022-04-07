import { writable, derived, get } from "svelte/store";

import { collectionList as collectionListLib } from "lib/kcollection-list";
import { metamaskProvider } from "main/metamask";

import type { Collection as CollectionType } from "lib/ktypes";

// STATE
// Collection List : Map with key is chainId/collectionAddress and value is collectionObject
const _collectionList = writable(new Map() as Map<string, CollectionType>);
const { subscribe, update } = _collectionList;

// UTILITIES
const _collectionKey = (chainId: number, address: string): string => `${String(chainId)}/${address}`;
const _getAll = (): Map<string, CollectionType> => get(_collectionList);

// STATE CHANGERS
// Set one Collection
const setOne = (collectionObject: CollectionType): void => {
  const { chainId, address } = collectionObject;
  if (!(chainId && address)) return;

  update(($collectionList) => $collectionList.set(_collectionKey(chainId, address), collectionObject));
};

// ACTIONS
// SET all Collections from one nework, from an optionnal account
const setAll = async (chainId: number, account?: string): Promise<void> => {
  if (!chainId) return;

  const collectionListFromLib = await collectionListLib(chainId, account, get(metamaskProvider));
  for (const collectionObject of collectionListFromLib.values()) {
    setOne(collectionObject);
  }
};

// const cartItemsCount = derived(cartItems, ($itemsInCart) =>
//   $itemsInCart.reduce((count, item) => count + item.quantity, 0)
// );

// STATE VIEWS
// GET one Collection
// const getOne = derived(   chainId: number, address: string): CollectionType => _getAll().get(_collectionKey(chainId, address));

// GET Collection fitered
const getFiltered = (chainId: number, account: string, mintable = false): Map<string, CollectionType> => {
  const _collections = new Map(
    [..._getAll()]
      .filter(([, coll]) => {
        // SAME NETWORK
        const okNetwork = coll.chainId === chainId;

        // Collection IS a mintable collection that I own OR default mintable collection
        const okMintable = Boolean(coll.mintable) && coll.owner === account;
        // || coll.address == collectionDefaultOpenNFTsGet(chainId);

        // When not wanting to Mint ALL collections I own OR where I have NFTs OR default collection
        const okAll = !mintable && (coll.owner === account || coll.balanceOf > 0 || coll.supports?.IERC1155);
        // || coll.address == collectionDefaultGet(chainId, account));

        const ok = okNetwork && (okMintable || okAll);
        // console.log(".filter", ok, okNetwork, okMintable, okAll, mintable, coll);

        return ok;
      })

      // )
      // SORT PER SUPPLY DESC
      .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
  );
  // console.log("_collectionListFilter ~ _collections", _collections);
  return _collections;
};

export const collectionList = {
  subscribe,
  setOne,
  setAll,
  // getOne,
  getFiltered
};
