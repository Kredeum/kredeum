<script lang="ts">
  import type { CollectionType } from "lib/ktypes";
  import CollectionSimple from "./CollectionSimple.svelte";
  import { collectionCurrent } from "stores/collection/collectionDefault";
  /////////////////////////////////////////////////
  // <CollectionListSimple {collections}   />
  // Display Collections
  /////////////////////////////////////////////////
  export let collections: Map<string, CollectionType>;
  export let collection: string;
  export let chainId: number;

  $: if (chainId) collectionObject = null;

  const _setCollection = (_collectionObject: CollectionType) => {
    collectionObject = _collectionObject;
    collection = collectionObject.address;
    collectionDefault.set(collection);
  };

  let collectionObject: CollectionType;
</script>

{#if collectionObject}
  <p>
    <strong>
      {collectionObject?.name} ({collectionObject?.balanceOf})
    </strong>
  </p>
  <CollectionSimple {collectionObject} />
{/if}

{#each [...collections] as [url, coll]}
  <p on:click={() => _setCollection(coll)}>
    {coll.name}
    ({coll.balanceOf})
  </p>
{/each}
