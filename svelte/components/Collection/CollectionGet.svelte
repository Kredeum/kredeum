<script lang="ts">
  import { collectionGet } from "lib/kcollection-get";
  import { storeCollectionGet } from "lib/kstore";

  import type { Collection as CollectionType } from "lib/ktypes";

  import { hashArray } from "helpers/hash";
  import { metamaskProvider } from "main/metamask";
  import Collection from "./Collection.svelte";

  /////////////////////////////////////////////////
  // <CollectionGet {collection} {minting}? {account}? />
  // Get Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let account = "";

  // current hash of significant props
  $: hashCurrent = hashArray([chainId, collection]);

  let collectionObject: CollectionType;
  const _collectionSet = (_collectionObject: CollectionType, _hash: string): void => {
    //  set when significant props have not changed
    if (_hash === hashCurrent) collectionObject = _collectionObject;
  };

  $: if (chainId && collection && account) _collectionGet(chainId, collection, account).catch(console.error);
  const _collectionGet = async (_chainId: number, _collection: string, _account: string): Promise<void> => {
    if (!(_chainId && _collection && _account)) return;

    const hash = hashArray([_chainId, _collection]);

    // ASAP read NFT from cache
    const storeCollection = storeCollectionGet(_chainId, _collection);
    _collectionSet(storeCollection, hash);

    // THEN read NFT from metadata
    const getCollection = await collectionGet(_chainId, storeCollection, $metamaskProvider, _account);
    _collectionSet(getCollection, hash);
  };
</script>

<Collection {collectionObject} />
<!-- <CollectionSimple {collectionObject} /> -->
