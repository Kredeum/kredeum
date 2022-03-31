<script lang="ts">
  import type { Collection as CollectionType } from "lib/ktypes";
  import { collectionList, collectionListAllFromCache } from "lib/kcollection-list";
  import { metamaskProvider } from "main/metamask";
  import type { JsonRpcProvider } from "@ethersproject/providers";

  import CollectionList from "./CollectionList.svelte";

  import { hashArray } from "helpers/hash";
  import { collectionDefaultGet, collectionDefaultOpenNFTsGet } from "lib/kcollection-get";

  // <CollectionListGet {chainId} {collection} {account} {mintable} {txt} {label} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let collection: string = undefined;
  export let account: string = undefined;
  export let mintable = false;
  export let txt = false;
  export let label = true;

  let refreshing: boolean;

  // current hash of significant props
  $: hashCurrent = hashArray([chainId, account]);

  let collections: Map<string, CollectionType>;
  const _collectionsSet = (_collections: Map<string, CollectionType>, _hash: string): void => {
    //  set when significant props have not changed
    if (_hash === hashCurrent) {
      collections = _collections;
      console.log("set collections", collections);
    }
  };

  // IF CHAINID or ACCOUNT changes THEN list collections
  $: _collectionList(chainId, account).catch(console.error);

  const _collectionList = async (_chainId: number, _account: string): Promise<void> => {
    console.log("_collectionList 1", _chainId, _account);
    if (!(_chainId && _account)) return;
    console.log("_collectionList 2", _chainId, _account);

    refreshing = true;

    const hash = hashArray([_chainId, _account]);
    console.log("_collectionList", _chainId, _account, hash);

    const _collectionListCache = _collectionListFromCache(_chainId, _account);
    console.log("_collectionList _collectionListCache", _collectionListCache);
    _collectionsSet(_collectionListCache, hash);

    const _collectionListLib = await _collectionListFromLib(_chainId, _account, $metamaskProvider);
    console.log("_collectionList _collectionListLib", _collectionListLib);
    _collectionsSet(_collectionListLib, hash);

    refreshing = false;
  };

  const _collectionListFromCache = (_chainId: number, _account: string): Map<string, CollectionType> => {
    const _allCollectionsFromCache = collectionListAllFromCache();
    console.log("_collectionListFromCache _allCollectionsFromCache", _allCollectionsFromCache);

    const _collectionsFromCache = _collectionListFilter(_chainId, _account, _allCollectionsFromCache);
    console.log("_collectionListFromCache _collectionsFromCache", _collectionsFromCache);

    return _collectionsFromCache;
  };

  const _collectionListFromLib = async (
    _chainId: number,
    _account: string,
    _provider: JsonRpcProvider
  ): Promise<Map<string, CollectionType>> => {
    const _allCollectionsFromLib = await collectionList(_chainId, _account, _provider, mintable);
    console.log("_collectionListFromLib _allCollectionsFromLib", _allCollectionsFromLib);

    const _collectionsFromLib = _collectionListFilter(_chainId, _account, _allCollectionsFromLib);
    console.log("_collectionListFromLib _collectionsFromL ib", _collectionsFromLib);

    return _collectionsFromLib;
  };

  const _collectionListFilter = (
    _chainId: number,
    _account: string,
    _allCollections: Map<string, CollectionType>
  ): Map<string, CollectionType> => {
    const _collections = new Map(
      [..._allCollections]
        .filter(([, coll]) => {
          // SAME NETWORK
          const okNetwork = coll.chainId === _chainId;

          // Collection IS a mintable collection that I own OR default mintable collection
          const okMintable =
            (Boolean(coll.mintable) && coll.owner === _account) ||
            coll.address == collectionDefaultOpenNFTsGet(_chainId);

          // When not wanting to Mint ALL collections I own OR where I have NFTs OR default collection
          const okAll =
            !mintable &&
            (coll.owner === _account ||
              coll.balanceOf > 0 ||
              coll.supports?.IERC1155 ||
              coll.address == collectionDefaultGet(_chainId, _account));

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
</script>

<!-- <CollectionListSimple {chainId} bind:collection {collections}  /> -->

<CollectionList {chainId} bind:collection {account} {mintable} {txt} {collections} {refreshing} {label} />
