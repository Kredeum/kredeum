<script lang="ts">
  import type { Collection as CollectionType } from "lib/ktypes";
  import { collectionList, collectionListFromCache } from "lib/kcollection-list";
  import { metamaskProvider } from "main/metamask";

  import CollectionList from "./CollectionList.svelte";
  import CollectionListSimple from "./CollectionListSimple.svelte";

  import { hashArray } from "helpers/hash";

  /////////////////////////////////////////////////
  // <CollectionListData {chainId} {account} {collection} {minting} {txt} />
  //  Collection List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string = undefined;
  export let account: string;
  export let minting = false;
  export let txt = false;

  let refreshing: boolean = false;

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
    if (!(_chainId && _account)) return;

    refreshing = true;

    const hash = hashArray([chainId, account]);
    // console.log("_collectionList", _chainId, _account, hash);

    _collectionsSet(_collectionListFromCache(_chainId, _account), hash);

    _collectionsSet(await collectionList(_chainId, _account, $metamaskProvider), hash);

    refreshing = false;
  };

  const _collectionListFromCache = (_chainId: number, _account: string): Map<string, CollectionType> => {
    const _allCollections = collectionListFromCache(_chainId, _account);
    console.log("_collectionListFromCache= ~ _allCollections", _allCollections);

    const _collections = _collectionListFilter(_chainId, _account, _allCollections);
    console.log("_collectionListFromCache= ~ _allCollections", _collections);

    return _collections;
  };

  const _defaultMintableCollection = () => localStorage.getItem(`defaultMintableCollection/${chainId}`) || "";
  const _defaultCollection = () =>
    localStorage.getItem(`defaultCollection/${chainId}/${account}`) || _defaultMintableCollection();

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
            (Boolean(coll.mintable) && coll.owner === _account) || coll.address == _defaultMintableCollection();

          // When not wanting to Mint ALL collections I own OR where I have NFTs OR default collection
          const okAll =
            !minting && (coll.owner === _account || coll.balanceOf > 0 || coll.address == _defaultCollection());

          return okNetwork && (okMintable || okAll);
        })

        // )
        // SORT PER SUPPLY DESC
        .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
    );
    // console.log("_collectionListFilter ~ _collections", _collections);
    return _collections;
  };
</script>

<!-- <CollectionListSimple {collections} {chainId} bind:collection /> -->
<CollectionList {chainId} bind:collection {account} {minting} {txt} {collections} />
