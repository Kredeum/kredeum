<script lang="ts">
  import type { Collection as CollectionType } from "lib/ktypes";
  import CollectionSimple from "../Collection/CollectionSimple.svelte";
  import { currentCollection } from "main/current";

  /////////////////////////////////////////////////
  // <CollectionListSimple {collections}   />
  // Display Collections
  /////////////////////////////////////////////////
  export let collections: Map<string, CollectionType>;
  export let collection: string;
  export let chainId: number;

  $: if (chainId) collectionObject = null;

  $: if (collectionObject) {
    collection = collectionObject.address;
    currentCollection.set(collection);
  }

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
  <p on:click={() => (collectionObject = coll)}>
    {coll.name}
    ({coll.balanceOf})
  </p>
{/each}
