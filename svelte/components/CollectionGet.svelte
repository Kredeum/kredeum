<script lang="ts">
  import { collectionGet, collectionGetFromCache } from "lib/kcollection-get";

  import type { Collection as CollectionType } from "lib/ktypes";

  import { metamaskProvider } from "main/metamask";
  import Collection from "./Collection.svelte";

  /////////////////////////////////////////////////
  // <CollectionGet {collection} {minting}  />
  // Get Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let minting: boolean = false;

  let collectionObject: CollectionType;

  $: if (chainId && collection) _collectionGet();
  const _collectionGet = async () => {
    // ASAP read NFT from cache
    collectionObject = collectionGetFromCache(chainId, collection);

    // THEN read NFT from metadata
    collectionObject = await collectionGet(chainId, collection, $metamaskProvider);
  };
</script>

<Collection {collectionObject} {minting} />
