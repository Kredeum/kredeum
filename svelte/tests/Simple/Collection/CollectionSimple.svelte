<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/types";

  import { collectionStore } from "@stores/collection/collection";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let collection: Readable<CollectionType>;
  // $: console.log("collection", account, $collection);

  $: account, chainId && address && handleChange();
  const handleChange = (): void => {
    collection = collectionStore.getOneStore(chainId, address);
    collectionStore.refreshOne(chainId, address, account).catch(console.error);
  };
</script>

<div>
  <strong>
    {#if $collection}
      {$collection.balancesOf?.get(account) || "?"}
      {$collection.name || "No name"} -
      {$collection.address}
    {:else}
      Choose one collection
    {/if}
  </strong>
</div>
<hr />
