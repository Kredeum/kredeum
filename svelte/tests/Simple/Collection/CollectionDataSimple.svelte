<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType } from "@lib/common/types";
  import { collectionStore } from "@stores/collection/collection";

  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let collection: Readable<CollectionType>;

  $: account, chainId && address && handleChange();
  const handleChange = (): void => {
    collection = collectionStore.getOne(chainId, address);
    collectionStore.refreshOne(chainId, address, account).catch(console.error);
  };
  $: console.log("collection", account, $collection);
</script>

<slot collection={$collection}>
  <p>LOADING COLLECTION...</p>
</slot>
